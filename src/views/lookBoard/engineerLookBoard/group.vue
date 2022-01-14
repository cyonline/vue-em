<template>
  <div>
    <div class="stage-box" id="lookBoard" v-cloak>
      <main class="main">
        <header class="lookboard_panel_header">
          <div class="float-left header-title">{{headerTitle}}</div>
          
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
  name: "group",
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
      
    },
  methods:  {
    
  
    
    },
  watch: {
      boardMenuType: function(n) {
        this.$refs.mainContent.scrollTop = 0;
        this.structId = "";
        
      },
    
    },
    created: function() {
      if (this.boardMenuType > 1) {
        
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