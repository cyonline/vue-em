/**
 * file: util@hyk.es6
 * ES6 版本
 * created by hyk 2018-08-24
 * ES6代码 需要babel转译，也需要polyfill对es6的api兼容
 * 在base等其它文件加载完再加载，只是做了一些小的方法的封装。并没有对原来的代码修改什么
 * 将方法挂载到Vue原型链上，属性以 $$ + 'xxxx'命名
 */
// 不去污染window

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
    
    //
    export default {
      noop,
      isArray,
      isNull,
      isObject,
      isString,
      isNumber,
      isBoolean,
      isFunction,
      isNaN,
      isUndefined,
      isEmptyObject,
      isInteger,
      deepClone,
      merge,
      generateUuid,
      checkFloatNumber,
    }
    