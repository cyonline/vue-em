(function () {
  new Vue({
    el: '#lookBoard',
    mixins: [commonMixin],
    data: function () {
      return {
        webUrl: webInit.fileUrl,
        permissions: {},
        breadcrumbs: [],
        userInfo: null,
        //
        panels: JSON.parse(window.sessionStorage.getItem('look-board-menus') || '[]'),
        // panelType: 0, // 0 工程 1 交付
        //
        typeIndex: 0, // 工程/交付
        tabIndex: 0, // 集团/公司/项目
        // panel: 'group-panel', // [group-panel|compony-panel|project-panel]
        //
        structId: '', // 公司看看板和项目看板默认选中第一个
        treeDataInited: false,
        structTreeData: [],
        structTreeExpandedKeys: [],
        structProps: {
          children: "ChildNodes",
          label: "Name",
        },
        // 以子级MenuId作为key
        chartModulesMap: {},
      };
    },
    components: {
      panelTab: function () {
        return __import__('@/views/lookBoard/componentspanel-tab/index.vue');
      },
      chartTab: function () {
        return __import__('@/views/lookBoard/componentschart-tab/index.vue');
      },
      groupPanel: function () {
        return __import__('@/views/lookBoard/componentspanels/group.vue');
      },
      companyPanel: function () {
        return __import__('@/views/lookBoard/componentspanels/company.vue');
      },
      projectPanel: function () {
        return __import__('@/views/lookBoard/componentspanels/project.vue');
      },
    },
    computed: {
      computedChildrenPanels: function () {
        return this.panels[this.typeIndex].Children || [];
      },
      /**
       * 面板类型 0 工程 1 交付
       */
      computedPanelType: function () {
        var idx = 0;
        switch(this.panels[this.typeIndex].MenuNo + '') {
          case '13':
            // 工程
            idx = 0;
            break;
          case '14':
            // 验房
            idx = 1;
            break;
        }
        return idx;
      },
      computedPanelIndex: function () {
        // 0 集团 1 公司 2 项目
        var menu = this.computedChildrenPanels[this.tabIndex] || {};
        var panelIndex = 0;
        switch(menu.MenuNo.split('.')[1]) {
          case '1':
            // 集团
            panelIndex = 0;
            break;
          case '2':
            // 公司
            panelIndex = 1;
            break;
          case '3':
            // 项目
            panelIndex = 2;
            break;
        }
        return panelIndex;
      },
      computedCurrentPanelData: function () {
        return this.computedChildrenPanels[this.tabIndex] || {};
      },
      computedCurrentPanel: function () {
        var m = {
          0: 'group-panel',
          1: 'company-panel',
          2: 'project-panel',
        };
        return m[this.computedPanelIndex];
      },
      computedLabelText: function () {
        var m = {
          1: '公司',
          2: '项目',
        };
        return m[this.computedPanelIndex];
      },
      // 1 公司 2 项目
      computedStructType: function () {
        var idx = 0;
        switch(this.computedPanelIndex) {
          case 0:
            idx = 0;
            break;
          case 1:
            idx = 1;
            break;
          case 2:
            idx = 2;
            break;
        }
        return idx;
      },
      computedStructTreeData: function () {
        return this.filterStructData(this.structTreeData);
      },
      /**
       * 当是公司和项目看板时，必需先等待项目树请求完后才启用面板
       */
      computedEnableComponent: function () {
        return this.computedPanelIndex === 0 || (this.computedPanelIndex > 0 && this.treeDataInited);
      },
      /**
       * 看板图表权限
       */
      computedModulePermissions: function () {
        return this.chartModulesMap[this.computedCurrentPanelData.MenuId] || [];
      },
    },
    watch: {
      computedPanelIndex: function (n) {
        this.fetchModulesPermissions();
        if (n > 0) {
          this.structId = '';
          var structTreeRef = this.$refs.structTree;
          structTreeRef.clearSelect();
          var vm = this;
          this.fetchStructData().then(function (res) {
            // 默认选中第一个公司或项目
            var first = vm.getFirstStructNode(vm.computedStructTreeData) || {};
            structTreeRef.clickPartTree(first, null, {
              $el: structTreeRef.$el.querySelector('.tree-select-box'),
            });
            vm.structId = first.Id || '';
          });
        }
      },
      typeIndex: function () {
        if (this.tabIndex === 0) {
          this.fetchModulesPermissions();
        }
        this.tabIndex = 0;
      },
    },
    created: function () {
      this.fetchModulesPermissions();
      if (this.computedPanelIndex > 0) {
        this.fetchStructData();
      }
    },
    methods: {
      fetchStructData: function () {
        var vm = this;
        if (!vm.treeDataInited) {
          return vm.$$get('/api/structures/struTreeByUserId').then(function (res) {
            vm.structTreeData = res.data;
            if (res.data && res.data.length) {
              vm.structTreeExpandedKeys.push(res.data[0].Id);
            }
            vm.treeDataInited = true;
            return res.data;
          }).catch(function (err) {
            if (err.message) {
              vm.$message.error(err.message);
            }
          });
        }
        return Promise.resolve(this.structTreeData);
      },
      /**
       * 过滤树数据
       */
      filterStructData: function (payload) {
        var vm = this;
        var arr = [];
        var data = this.$$deepClone(payload);
        (data || []).forEach(function (node) {
          if (node.Type <= vm.computedStructType) {
            var children = node[vm.structProps.children];
            if (children && children.length) {
              node[vm.structProps.children] = vm.filterStructData(children);
            }
            arr.push(node);
          }
        });
        return arr;
      },
      /**
       * 默认选中第一个公司或项目
       */
      getFirstStructNode: function (payload) {
        var o = null;
        var vm = this;
        (payload || []).some(function (node) {
          if (node.Type === vm.computedStructType) {
            o = node;
            return true;
          }
          var children = node[vm.structProps.children];
          if (children && children.length) {
            o = vm.getFirstStructNode(children);
            if (o) {
              return true;
            }
          }
          return false;
        });
        return o;
      },
      handleChooseStructChange: function (node) {
        this.structId = node.Id || '';
      },
      structNodeDisabled: function (node) {
        return node.Type !== this.computedStructType;
      },
      /**
       * 获取看板模块权限
       */
      fetchModulesPermissions: function () {
        var panelMenuId = this.computedCurrentPanelData.MenuId;
        if (!panelMenuId) {
          return [];
        } else if (this.chartModulesMap[panelMenuId]) {
          return this.chartModulesMap[panelMenuId];  
        } else {
          var vm = this;
          return this.$$get('/api/reportBoardMenu', {
            menuId: panelMenuId,
            pageSize: 0,
          }).then(function (res) {
            vm.$set(vm.chartModulesMap, panelMenuId, res.data.Rows || []);
            return vm.chartModulesMap[panelMenuId];
          }).catch(function (err) {
            if (err.message) {
              vm.$message.error(err.message);
            }
            throw err;
          });
        }
      },
    },
  });
})();