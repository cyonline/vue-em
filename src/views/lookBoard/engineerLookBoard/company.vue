<template>
  <div>
    <div class="stage-box" id="lookBoard" v-cloak>
      <main class="main">
        <header class="lookboard_panel_header">
          <div class="float-left header-title">公司看板</div>
          <div v-show="boardMenuType > 1" class="struct_container float-right">
            <label for class="header_label">{{ computedLabelText }} &nbsp;</label>

          </div>
        </header>
        <article ref="mainContent" class="main_content">
          <!-- 放置组件 -->
        </article>
      </main>
    </div>
  </div>
</template>

<script>
import treeSelect from '@/components/sapi-tree-select'


export default {
  name: "lookBoard",
  data() {
      var panels = JSON.parse(
        window.sessionStorage.getItem("look-board-menus") || "[]"
      );
      panels = panels.filter(function(item) {
        return item.Children && item.Children.length;
      });
    return  {
        // webUrl: webInit.fileUrl,
        webUrl: '',
        permissions: {},
        breadcrumbs: [],
        userInfo: null,
        //
        panels: panels,
        // panelType: 0, // 0 工程 1 交付
        //
        typeIndex: 0, // 工程/交付
        tabIndex: 0, // 集团/公司/项目
        // panel: 'group-panel', // [group-panel|compony-panel|project-panel]
        //
        structId: "", // 公司看看板和项目看板默认选中第一个
        structDataInited: false,
        structData: {},
        projectTreeDataModel: {
          label: "Name",
          children: "ChildNodes"
        },
        projectTreeDefaultExpandedKeys: [],
        // 以子级MenuId作为key
        chartModulesMap: {},
        //
        boardMenuType: 1,
        ReportBoardType: 0,
        panelMenuId: ""
      };
  },
  components: {
      panelTab: function() {
        return import("@/views/lookBoard/components/panel-tab/index.vue");
      },
      chartTab: function() {
        return import("@/views/lookBoard/components/chart-tab/index.vue");
      },

      treeSelect,
    },
     computed: {
      headerTitle:function(){
        var tilte ={"1":"集团看板","2":"公司看板","3":"项目看板"}
        return tilte[this.boardMenuType + '']
      },
      /**
       * 面板类型 0 工程 1 交付
       */
      computedPanelType: function() {
        var idx = 0;
        try {
          switch (this.ReportBoardType + "") {
            case "0":
              // 工程
              idx = 0;
              break;
            case "1":
              // 验房
              idx = 1;
              break;
          }
        } catch (error) {}
        return idx;
      },
      computedCurrentPanel: function() {
        var m = {
          0: "group-panel",
          1: "company-panel",
          2: "project-panel"
        };
        return m[this.boardMenuType - 1];
      },
      computedLabelText: function() {
        var m = {
          1: "公司",
          2: "项目"
        };
        return m[this.boardMenuType - 1];
      },
      // 1 公司 2 项目
      computedStructType: function() {
        var idx = 0;
        switch (this.boardMenuType - 1) {
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
      /**
       * 当是公司和项目看板时，必需先等待项目树请求完后才启用面板
       */
      computedEnableComponent: function() {
        return (
        //   this.panels &&
        //   this.panels.length &&
          
            (this.boardMenuType  && this.structDataInited)
        
        );
      },
      /**
       * 看板图表权限
       */
      computedModulePermissions: function() {
        return this.chartModulesMap[this.panelMenuId] || [];
      },
      /**
       * 公司或项目当前选中的数据
       * @returns {Object|Null}
       */
      computedStructNode: function() {
        var idx = this.boardMenuType - 1;
        if (idx === 0) {
          return null;
        }
        var vm = this;
        var node = null;
        (this.structData[idx] || []).some(function(item) {
          if (item.Id === vm.structId) {
            node = vm.$$deepClone(item);
            return true;
          }
          return false;
        });
        return node;
      }
    },
  methods:  {
      doSthAfterFetchStructData: function() {
        // 默认选中第一个公司或项目
        var vm = this;
        var idx = vm.boardMenuType - 1;
        var t = vm.structData[idx];
        vm.structDataInited = true;
        if (idx === 1) {
          vm.structId = t && t.length ? t[0].Id : "";
        } else if (idx === 2) {
          var first = vm.getFirstProStructNode(t) || {};
          vm.structId = first.Id || "";
          this.$nextTick(function() {
            var proStructTreeRef = this.$refs.projectStructTree;
            proStructTreeRef.clearSelect();
            proStructTreeRef.clickPartTree(first, null, {
              $el: proStructTreeRef.$el.querySelector(".tree-select-box")
            });
          });
        }
      },
      fetchStructData: function() {
        var vm = this;
        var idx = vm.boardMenuType - 1;
        vm.structDataInited = false;
        if (!vm.structData[idx] && idx > 0) {
          var m = {
            1: {
              // 公司
              url: "/api/structures/reportstruTreeByUserId",
              request: {}
            },
            2: {
              // 项目
              url: "/projectBuilding/getSpecialCheckProjectTreeData",
              request: {
                isContainStage: false
              }
            }
          };
          return vm.$$get(m[idx].url, m[idx].request)
            .then(function(res) {
              vm.$set(vm.structData, idx, res.data);
              if (idx == 1) {
                res.data.forEach(function(ele) {
                  ele.concatName = ele.ParentName + "-" + ele.Name;
                });
              }
              return res.data;
            })
            .catch(function(err) {
              if (err.message) {
                vm.$message.error(err.message);
              }
              throw err;
            });
        }
        return Promise.resolve(vm.structData[idx]);
      },
      handleProjectTreeNodeClick: function(nodeData) {
        if (+nodeData.Type === 2) {
          this.structId = nodeData.Id;
        }
      },
      /**
       * 项目树节点是否可点
       */
      isProDisabled: function(nodeData) {
        return nodeData.Type !== 2;
      },
      /**
       * 默认选中第一个项目节点
       */
      getFirstProStructNode: function(payload) {
        var o = null;
        var vm = this;
        (payload || []).some(function(node) {
          if (node.Type === 2) {
            o = node;
            vm.projectTreeDefaultExpandedKeys.push(node.Id);
            return true;
          }
          var children = node[vm.projectTreeDataModel.children];
          if (children && children.length) {
            o = vm.getFirstProStructNode(children);
            if (o) {
              vm.projectTreeDefaultExpandedKeys.push(node.Id);
              return true;
            }
          }
          return false;
        });
        return o;
      },
      /**
       * 获取看板模块权限
       */
      fetchModulesPermissions: function() {
        if (!this.panelMenuId) {
          return [];
        } else if (this.chartModulesMap[this.panelMenuId]) {
          return this.chartModulesMap[this.panelMenuId];
        } else {
          var vm = this;
          return this.$$get("/api/reportBoardMenu", {
            menuId: vm.panelMenuId,
            modularType: 0, // 模块类型 0:Web / 1;App
            pageSize: 0
          })
            .then(function(res) {
              vm.$set(
                vm.chartModulesMap,
                vm.panelMenuId,
                res.data.Rows || []
              );
              return vm.chartModulesMap[vm.panelMenuId];
            })
            .catch(function(err) {
              if (err.message) {
                vm.$message.error(err.message);
              }
              throw err;
            });
        }
      }
    },
  watch: {
      boardMenuType: function(n) {
        this.$refs.mainContent.scrollTop = 0;
        this.fetchModulesPermissions();
        this.structId = "";
        if (n > 0) {
          this.fetchStructData().then(this.doSthAfterFetchStructData);
        }
      },
    
    },
     created: function() {
      this.fetchModulesPermissions();
      if (this.boardMenuType > 1) {
        this.fetchStructData().then(this.doSthAfterFetchStructData);
      }
      this.panelMenuId = window.sessionStorage.getItem("menuId");

    //   var paramArr = window.location.search.split("&");
    //   this.ReportBoardType = paramArr[1].split("=")[1]; // 0工程看板  1 验房看板
    //     this.boardMenuType = paramArr[2].split("=")[1]; // 1 集团看板  2公司看板 3 项目看板
    },
};
</script>
<style lang="less">
  @import url('../style.css');
</style>