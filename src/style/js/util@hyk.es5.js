/**
 * file: util@hyk.es6
 * ES6 版本
 * created by hyk 2018-08-24
 * 需要polyfill对es6的api兼容
 * 在base等其它文件加载完再加载，只是做了一些小的方法的封装。并没有对原来的代码修改什么
 * 将方法挂载到Vue原型链上，属性以 $$ + 'xxxx'命名
 */
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function () {
  'use strict';

  var noop = function noop() {};
  function isArray(arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
  }
  function isNull(arg) {
    return Object.prototype.toString.call(arg) === '[object Null]';
  }
  function isObject(arg) {
    // return Object.prototype.toString.call(arg) === '[object Object]';
    return (typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) === 'object' && !isNull(arg) && !isArray(arg);
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
    var res = getANewDefineOfArrayOrObject(param);
    // 非引用类型
    if (!res) {
      return param;
    }
    Object.entries(param).forEach(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          k = _ref2[0],
          v = _ref2[1];

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
  function deepMerge() {
    var o = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var options = arguments[1];

    var obj = o;
    if (isObject(options) || isArray(options)) {
      Object.keys(options).forEach(function (key) {
        if (isObject(obj[key]) && isObject(options[key]) || isArray(obj[key]) && isArray(options[key])) {
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
  function merge(parent) {
    for (var _len = arguments.length, children = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      children[_key - 1] = arguments[_key];
    }

    if (!isObject(parent) && !isArray(parent)) {
      throw new Error('util@hyk:merge \u7B2C\u4E00\u4E2A\u53C2\u6570\u5E94\u8BE5\u662F\u5BF9\u8C61\u6216\u5BF9\u8C61 --> ' + parent);
    }
    var o = parent;
    if (!children || !children.length) {
      return parent;
    }
    var len = children.length;
    var deep = false; // 是否深度merge
    if (isBoolean(children[len - 1])) {
      if (len < 2) {
        return parent;
      }
      deep = children[len - 1];
      len -= 1;
    }

    var _loop = function _loop(i) {
      if (isObject(children[i]) || isArray(children[i])) {
        Object.keys(children[i]).forEach(function (key) {
          o[key] = deep ? deepMerge(parent[key], children[i][key]) : children[i][key];
        });
      }
    };

    for (var i = 0; i < len; i += 1) {
      _loop(i);
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
  function getRequest() {
    var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window.location.href;
    var decode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    var theRequest = {};
    var str = url.indexOf('?') > -1 ? url.substr(url.indexOf('?') + 1).split('#')[0].replace(/\/+$/, '') : '';
    var strs = str ? str.split('&') : [];
    for (var i = 0; i < strs.length; i += 1) {
      var arr = strs[i].split('=');
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
  function extendUrl() {
    var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : location.href;
    var extQuery = arguments[1];
    var rmQuery = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
    var encode = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    var querySplit = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '?';

    var index = url.indexOf(querySplit);
    var pathname = index === -1 ? url : url.substr(0, index);
    // console.log(pathname);
    var query = getRequest(url, false);
    query = merge({}, query, extQuery);
    Object.keys(query).forEach(function (key) {
      // if (!rmQuery.includes(key)) {
      //   pathname += (`${pathname.includes('?') ? '&' : '?'}${key}=${query[key]}`);
      // }
      var flag = rmQuery.some(function (item) {
        if (Object.prototype.toString.call(item) === '[object RegExp]') {
          return item.test(key);
        }
        return item === key;
      });
      if (!flag) {
        var r = isUndefined(query[key]) || isNull(query[key]) ? '' : query[key];
        pathname += '' + (pathname.includes('?') ? '&' : '?') + key + '=' + (encode ? encodeURIComponent(query[key]) : r);
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
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [];
    var i = 0;
    var radix = _radix || chars.length;
    if (len) {
      // Compact form
      for (i = 0; i < len; i += 1) {
        uuid[i] = chars[0 | Math.random() * radix];
      }
    } else {
      var r = void 0;
      uuid[8] = '-';
      uuid[13] = '-';
      uuid[18] = '-';
      uuid[23] = '-';
      uuid[14] = '4';
      for (i = 0; i < 36; i += 1) {
        if (!uuid[i]) {
          r = 0 | Math.random() * 16;
          uuid[i] = chars[i === 19 ? r & 0x3 | 0x8 : r];
        }
      }
    }
    return uuid.join('');
  }
  /**
   * 是否是浮点数
   */
  function checkFloatNumber(num) {
    return (/^[0-9]\d*$|(^[0-9]\d*\.\d+$)/g.test(num)
    );
  }
  /**
   * 请求
   * @param {Object} params 跟base中的request参数保持一致
   * @return Promise
   * 备注.不要在params中传入success, fail, complete等方法
   */
  var request = function request(params, apiConfig) {
    if (!isObject(params)) {
      throw new Error('util@hyk:request \u53C2\u6570\u5E94\u8BE5\u662F\u4E00\u4E2AObject --> ' + params);
    }
    // 克隆参数，不要去影响传过来的参数
    var payload = deepClone(params);
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
    return new Promise(function (resolve, reject) {
      $.request(_extends({}, payload, {
        success: function success(data, response) {
          // 只有code等于0的时候才resolve
          if (+response.Code === 0) {
            resolve({
              data: data,
              response: response
            });
          } else {
            reject(new Error(response.Message));
          }
        },
        error: function error(err) {
          err.message = err.message || err.Message || err.status + ' ' + err.statusText + ' ' + err.responseText;
          reject(err);
        },

        complete: noop
      }), apiConfig);
    });
  };
  var get = function get(url, _data, opts, apiConfig) {
    var options = isObject(opts) ? deepClone(opts) : {};
    var data = isObject(_data) ? deepClone(_data) : {};
    return request(_extends({}, options, {
      url: url,
      type: 'get',
      data: data
    }), apiConfig);
  };
  var post = function post(url, _data, opts, apiConfig) {
    var options = isObject(opts) ? deepClone(opts) : {};
    var data = isObject(_data) ? deepClone(_data) : {};
    return request(_extends({}, options, {
      url: url,
      type: 'post',
      data: data
    }), apiConfig);
  };
  var put = function put(url, _data, opts, apiConfig) {
    var options = isObject(opts) ? deepClone(opts) : {};
    var data = isObject(_data) ? deepClone(_data) : {};
    return request(_extends({}, options, {
      url: url,
      type: 'put',
      data: data
    }), apiConfig);
  };
  var ajaxDelete = function ajaxDelete(url, _data, opts, apiConfig) {
    var options = isObject(opts) ? deepClone(opts) : {};
    var data = isObject(_data) ? deepClone(_data) : {};
    return request(_extends({}, options, {
      url: url,
      type: 'delete',
      data: data
    }), apiConfig);
  };
  //
  // 挂载到vue原型上
  Vue.prototype.$$noop = noop;
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