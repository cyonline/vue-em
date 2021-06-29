
export default {
  methods: {
    /**
     * 对数组做并集
     * @param arr1 {Array} 
     * @param arr2 {Array}
     * @param key {String} 如果数组的项是对象，key作为每一项的唯一标记
     * @returns {Array} 返回一个新的数组
     */
    arrayUnion: function (arr1, arr2, key) {
      if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
        throw new Error('arrayUnion expected Array');
      }
      var arr1Keys = arr1.map(function (item){ return (key ? item[key] : item)});
      return arr1.concat(arr2.filter(function (v) { return !arr1Keys.includes((key ? v[key] : v))}));
    },
    /**
     * 对数组做交集
     */
    arrayInter: function (arr1, arr2, key) {
      if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
        throw new Error('arrayInter expected Array');
      }
      var arr1Keys = arr1.map(function (item){ return (key ? item[key] : item)});
      var arr2Keys = arr2.map(function (item){ return (key ? item[key] : item)});
      return this.arrayUnion(arr1, arr2, key).filter(function (v) {
        return  arr1Keys.includes((key ? v[key] : v))
        && arr2Keys.includes((key ? v[key] : v));
      });
    },
    /**
     * 展开内部数组
     * @param {Number} deep。深度。默认展开1级
     */
    spreadInsideArray: function (arr, deep) {
      deep = deep === undefined ? 1 : deep;
      if (deep <= 0) {
        return arr;
      }
      var results = [];
      var vm = this;
      arr.forEach(function (item) {
        if (Array.isArray(item)) {
          results = results.concat(vm.spreadInsideArray(item, deep - 1));
        } else {
          results.push(item);
        }
      });
      return results;
    },
    /**
     * 控制图表模块是否显示
     * 与modulePermissions中的ReportBoardMenuModularCode, Status对比
     * @param {Array<Object|String>} permissionPattern. [{ Code: 'ReportBoardMenuModularCode', Name: 'ReportBoardMenuModularName', Title: 'ReportBoardMenuModularName' }|'ReportBoardMenuModularCode']
     */
    isModuleHasPermission: function (permissionPattern) {
      return !!this.getModulePermission(permissionPattern).length;
    },
    getModulePermission: function (permissionPattern) {
      if (!Array.isArray(permissionPattern)) {
        throw new Error('getModulePermission expected Array');
      }
      var vm = this;
      permissionPattern = permissionPattern.map(function (item) {
        var isType = Object.prototype.toString.call(item);
        if (isType === '[object String]') {
          return {
            ReportBoardMenuModularCode: item,
            Code: item,
          };
        } else if (isType === '[object Object]') {
          return vm.$$merge({}, item, { ReportBoardMenuModularCode: item.Code });
        } else {
          throw new TypeError('pattern item should be string or object:' + item);
        }
      });
      var joinedArr = this.arrayInter(this.modulePermissions, permissionPattern, 'ReportBoardMenuModularCode');
      // Status == 1 启用状态
      // Type 0 工程 1 交付
      return joinedArr.filter(function (item) { return (+item.Status) === 1 && vm.panelType === (+item.Type); });
    },
    getTabs: function (expectedTabsPattern) {
      if (!Array.isArray(expectedTabsPattern)) {
        throw new Error('expectedTabsPattern expected Array');
      }
      var vm = this;
      expectedTabsPattern = expectedTabsPattern.map(function (item) {
        var isType = Object.prototype.toString.call(item);
        if (isType === '[object String]') {
          return {
            ReportBoardMenuModularCode: item,
            Code: item,
          };
        } else if (isType === '[object Object]') {
          return vm.$$merge({}, item, { ReportBoardMenuModularCode: item.Code });
        } else {
          throw new TypeError('pattern item should be string or object:' + item);
        }
      });
      var arr = this.arrayInter(this.getModulePermission(expectedTabsPattern), expectedTabsPattern, 'ReportBoardMenuModularCode');
      var res = expectedTabsPattern.map(function (item) {
        item.Enable = false;
        arr.some(function (m) {
          if (m.ReportBoardMenuModularCode === item.ReportBoardMenuModularCode) {
            item.Enable = true;
            // 优先自定义的Name值
            item = vm.$$merge({}, item, m, { Name: item.Name || m.ReportBoardMenuModularName });
            return true;
          }
          return false;
        });
        return item;
      });
      return res;
    },
  }, 
};