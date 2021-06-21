/**
 * file: util@hyk.es6
 * ES6 版本
 * created by hyk 2018-08-24
 * ES6代码 需要babel转译，也需要polyfill对es6的api兼容
 * 在base等其它文件加载完再加载，只是做了一些小的方法的封装。并没有对原来的代码修改什么
 * 将方法挂载到Vue原型链上，属性以 $$ + 'xxxx'命名
 */
// 不去污染window
(() => {
  'use strict';
  const noop = () => {};
  function isArray(arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
  }
  function isNull(arg) {
    return Object.prototype.toString.call(arg) === '[object Null]';
  }
  function isObject(arg) {
    // return Object.prototype.toString.call(arg) === '[object Object]';
    return typeof arg === 'object' && !isNull(arg) && !isArray(arg);
  }
  
  function isString(arg) {
    return Object.prototype.toString.call(arg) === '[object String]';
  }
  
  function isNumber(arg) {
    return Object.prototype.toString.call(arg) === '[object Number]';
  }
  
  function isBoolean(arg) {
    return Object.prototype.toString.call(arg) === '[object Boolean]';
  }
  
  function isFunction(arg) {
    return Object.prototype.toString.call(arg) === '[object Function]';
  }
  
  function isNaN(arg) {
    // eslint-disable-next-line
    return isNumber(arg) && !isObject(arg) && arg !== arg;
  }
  
  function isUndefined(arg) {
    return Object.prototype.toString.call(arg) === '[object Undefined]';
  }
  
  function isEmptyObject(o) {
    return !Object.keys(o).length;
  }
  function isInteger(arg) {
    return isNumber(arg) && !isNaN(arg) && Math.floor(arg) === arg;
  }
//
function isType(param) {
  return Object.prototype.toString.call(param).slice(8, -1).toLowerCase();
}
function getANewDefineOfArrayOrObject(param) {
  if (isType(param) === 'array') {
    return [];
  }

  if (isType(param) === 'object') {
    return {};
  }

  return undefined;
}
/**
 * 深度克隆，解除引用
 */
function deepClone(param) {
  const res = getANewDefineOfArrayOrObject(param);
  // 非引用类型
  if (!res) {
    return param;
  }
  Object.entries(param).forEach(([k, v]) => {
    if (isType(v) === 'array' || isType(v) === 'object') {
      // 递归
      res[k] = deepClone(v);
    } else {
      res[k] = v;
    }
  });

  return res;
}
/**
 * 深度合并
 * @param {*} obj
 * @param {*} options
 * @return any
 */
function deepMerge(o = {}, options) {
  const obj = o;
  if (isObject(options) || isArray(options)) {
    Object.keys(options).forEach((key) => {
      if ((isObject(obj[key]) && isObject(options[key])) || ((isArray(obj[key]) && isArray(options[key])))) {
        deepMerge(obj[key], options[key]);
      } else {
        obj[key] = options[key];
      }
    });
  }
  return obj;
}

/**
 * 合并对象或数组,可合并多个
 * 注意这不会解除引用关系
 * 想返回一个全新的对象，第一个参数传空对象就行，注意这并不能对对象里面的属性解除引用
 * 最后一个参数传Boolean可决定是否深度merge。
 * --> 例如 { a: { a1: 'a1', a2: 'a2' } } 和 { a: { a1: 'a2', a3: 'a3' }, b: 'b' }
 * --> 合并为 { a: { a1: 'a2', a2: 'a2', a3: 'a3' }, b: 'b' }
 * @param {Object} parent
 * @param {Boolean} deep
 * @return any
 */
function merge(parent, ...children) {
  if (!isObject(parent) && !isArray(parent)) {
    throw new Error(`util@hyk:merge 第一个参数应该是对象或对象 --> ${parent}`);
  }
  const o = parent;
  if (!children || !children.length) {
    return parent;
  }
  let len = children.length;
  let deep = false; // 是否深度merge
  if (isBoolean(children[len - 1])) {
    if (len < 2) {
      return parent;
    }
    deep = children[len - 1];
    len -= 1;
  }
  for (let i = 0; i < len; i += 1) {
    if (isObject(children[i]) || isArray(children[i])) {
      Object.keys(children[i]).forEach((key) => {
        o[key] = deep ? deepMerge(parent[key], children[i][key]) : children[i][key];
      });
    }
  }
  return o;
}
/**
 * 根据URL获取参数对象
 * 带地址参数跳转的时候，一定要 转码 encodeURIComponent
 * @param {String} url
 * @param {Boolean} decode 是否解码
 * @returns
 */
  function getRequest(url = window.location.href, decode = true) {
    const theRequest = {};
    const str = url.indexOf('?') > -1 ? url.substr(url.indexOf('?') + 1).split('#')[0].replace(/\/+$/, '') : '';
    const strs = str ? str.split('&') : [];
    for (let i = 0; i < strs.length; i += 1) {
      const arr = strs[i].split('=');
      theRequest[arr[0]] = decode && arr[1] ? decodeURIComponent(arr[1]) : arr[1];
    }
    return theRequest;
  }
  /**
 * 地址栏参数转换
 *
 * @param {String} url
 * @param {Object} extQuery 往url中添加参数。默认参数会被编码
 * @param {Object::array} rmQuery 移除url中的参数，可以是正则表达式（必需为正则对象）
 * @param {Boolean} encode 是否对键值编码 默认false
 * @return String
 */
  function extendUrl(url = location.href, extQuery, rmQuery = [], encode = false, querySplit = '?') {
    const index = url.indexOf(querySplit);
    let pathname = index === -1 ? url : url.substr(0, index);
    // console.log(pathname);
    let query = getRequest(url, false);
    query = merge({}, query, extQuery);
    Object.keys(query).forEach((key) => {
      // if (!rmQuery.includes(key)) {
      //   pathname += (`${pathname.includes('?') ? '&' : '?'}${key}=${query[key]}`);
      // }
      const flag = rmQuery.some((item) => {
        if (Object.prototype.toString.call(item) === '[object RegExp]') {
          return item.test(key);
        }
        return item === key;
      });
      if (!flag) {
        const r = isUndefined(query[key]) || isNull(query[key]) ? '' : query[key];
        pathname += (`${pathname.includes('?') ? '&' : '?'}${key}=${encode ? encodeURIComponent(query[key]) : r}`);
      }
    });
    return pathname;
  }
  /**
   * 产生唯一标识 uuid
   * 在需要为vue提供key的时候非常有用
   *
   * @param {Number} len
   * @param {Number} radix 基数
   * @returns
   */
  /* eslint-disable no-bitwise */
  function generateUuid(len, _radix) {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    const uuid = [];
    let i = 0;
    const radix = _radix || chars.length;
    if (len) {
      // Compact form
      for (i = 0; i < len; i += 1) uuid[i] = chars[0 | Math.random() * radix];
    } else {
      let r;
      uuid[8] = '-';
      uuid[13] = '-';
      uuid[18] = '-';
      uuid[23] = '-';
      uuid[14] = '4';
      for (i = 0; i < 36; i += 1) {
        if (!uuid[i]) {
          r = 0 | Math.random() * 16;
          uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r];
        }
      }
    }
    return uuid.join('');
  }
  /**
   * 是否是浮点数
   */
  function checkFloatNumber(num) {
    return /^[0-9]\d*$|(^[0-9]\d*\.\d+$)/g.test(num);
  }
  /**
   * 请求
   * @param {Object} params 跟base中的request参数保持一致
   * @return Promise
   * 备注.不要在params中传入success, fail, complete等方法
   */
  const request = function request(params, apiConfig) {
    if (!isObject(params)) {
      throw new Error(`util@hyk:request 参数应该是一个Object --> ${params}`);
    }
    // 克隆参数，不要去影响传过来的参数
    const payload = deepClone(params);
    // 每个请求都带上一个时间戳
    // if (isObject(payload.data)) {
    //   payload.data._t = Date.now();
    // } else {
    //   payload.url = extendUrl(payload.url, {
    //     _t: Date.now(),
    //   });
    // }
    payload.isLoad = !(payload.isLoad === false);
    // 假设参数中传了success,fail,complete
    // const success = isFunction(payload.success) ? payload.success : noop;
    // const fail = isFunction(payload.fail) ? payload.fail : noop;
    // const complete = isFunction(payload.complete) ? payload.complete : noop;
    // 过滤掉success, fail, complete
    // payload.success = noop;
    // payload.fail = noop;
    // payload.complete = noop;
    return new Promise((resolve, reject) => {
      $.request({
        ...payload,
        success(data, response) {
          // 只有code等于0的时候才resolve
          if (+response.Code === 0) {
            resolve({
              data: data,
              response: response
            });
          } else {
            reject((new Error(response.Message)));
          }
        },
        error(err) {
          err.message = err.message || err.Message || `${err.status} ${err.statusText} ${err.responseText}`;
          reject(err);
        },
        complete: noop,
      }, apiConfig);
    });
  };
  const get = function get(url, _data, opts, apiConfig) {
    const options = isObject(opts) ? deepClone(opts) : {};
    const data = isObject(_data) ? deepClone(_data) : {};
    return request({
      ...options,
      url,
      type: 'get',
      data,
    }, apiConfig);
  };
  const post = function post(url, _data, opts, apiConfig) {
    const options = isObject(opts) ? deepClone(opts) : {};
    const data = isObject(_data) ? deepClone(_data) : {};
    return request({
      ...options,
      url,
      type: 'post',
      data,
    }, apiConfig);
  };
  const put = function put(url, _data, opts, apiConfig) {
    const options = isObject(opts) ? deepClone(opts) : {};
    const data = isObject(_data) ? deepClone(_data) : {};
    return request({
      ...options,
      url,
      type: 'put',
      data,
    }, apiConfig);
  };
  const ajaxDelete = function ajaxDelete(url, _data, opts, apiConfig) {
    const options = isObject(opts) ? deepClone(opts) : {};
    const data = isObject(_data) ? deepClone(_data) : {};
    return request({
      ...options,
      url,
      type: 'delete',
      data,
    }, apiConfig);
  };
  //
  // 挂载到vue原型上
  Vue.prototype.$$noop= noop;
  //
  Vue.prototype.$$isArray = isArray;
  //
  Vue.prototype.$$isNull = isNull;
  //
  Vue.prototype.$$isObject = isObject;
  //
  Vue.prototype.$$isString = isString;
  //
  Vue.prototype.$$isNumber = isNumber;
  //
  Vue.prototype.$$isBoolean = isBoolean;
  //
  Vue.prototype.$$isFunction = isFunction;
  //
  Vue.prototype.$$isNaN = isNaN;
  //
  Vue.prototype.$$isUndefined = isUndefined;
  //
  Vue.prototype.$$isEmptyObject = isEmptyObject;
  //
  Vue.prototype.$$isInteger = isInteger;
  //
  Vue.prototype.$$deepClone = deepClone;
  //
  Vue.prototype.$$merge = merge;
  //
  Vue.prototype.$$getRequest = getRequest;
  //
  Vue.prototype.$$extendUrl = extendUrl;
  //
  Vue.prototype.$$generateUuid = generateUuid;
  //
  Vue.prototype.$$checkFloatNumber = checkFloatNumber;
  //
  Vue.prototype.$$request = request;
  Vue.prototype.$$get = get;
  Vue.prototype.$$post = post;
  Vue.prototype.$$put = put;
  Vue.prototype.$$delete = ajaxDelete;
  //
  // 把$.msg 也挂载
  Vue.prototype.$$msg = $.msg;
  // 这里需要element-ui已加载
  Vue.prototype.$$message = Vue.prototype.$message;
})();