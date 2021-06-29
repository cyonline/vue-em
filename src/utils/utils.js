export default {
    isArray(arg) {
        return Object.prototype.toString.call(arg) === '[object Array]';
    },
    isNull(arg) {
        return Object.prototype.toString.call(arg) === '[object Null]';
    },
    isObject(arg) {
        // return Object.prototype.toString.call(arg) === '[object Object]';
        return typeof arg === 'object' && !isNull(arg) && !isArray(arg);
    },

    isString(arg) {
        return Object.prototype.toString.call(arg) === '[object String]';
    },

    isNumber(arg) {
        return Object.prototype.toString.call(arg) === '[object Number]';
    },

    isBoolean(arg) {
        return Object.prototype.toString.call(arg) === '[object Boolean]';
    },

    is(arg) {
        return Object.prototype.toString.call(arg) === '[object ]';
    },

    isNaN(arg) {
        // eslint-disable-next-line
        return isNumber(arg) && !isObject(arg) && arg !== arg;
    },

    isUndefined(arg) {
        return Object.prototype.toString.call(arg) === '[object Undefined]';
    },

    isEmptyObject(o) {
        return !Object.keys(o).length;
    },
    isInteger(arg) {
        return isNumber(arg) && !isNaN(arg) && Math.floor(arg) === arg;
    },
    //
    isType(param) {
        return Object.prototype.toString.call(param).slice(8, -1).toLowerCase();
    },
    getANewDefineOfArrayOrObject(param) {
        if (isType(param) === 'array') {
            return [];
        }

        if (isType(param) === 'object') {
            return {};
        }

        return undefined;
    },
}