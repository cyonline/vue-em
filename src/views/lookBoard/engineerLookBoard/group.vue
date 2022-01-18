<template>

    <div class="stage-box" id="lookBoard" v-cloak>
      <main class="main">
        <header class="lookboard_panel_header">
          <div class="float-left header-title">{{ headerTitle }}</div>
        </header>
        <article ref="mainContent" class="lookboard_panel_content">
          <!-- 放置组件 -->
          <div id="group_panel">
            <section class="top-container">
              <div class="col-left">
                <div class="col-left-top">
                  <company-info
                    :hierarchy-type="hierarchyType"
                    :struct-id="structId"
                    :data="companyInfoData"
                  >
                  </company-info>
                </div>
                <div class="col-left-bottom">
                  <range-check
                    :hierarchy-type="hierarchyType"
                    :struct-id="structId"
                  >
                  </range-check>
                </div>
              </div>
              <div class="col-center">
                <project-map :data="projectMapData"></project-map>
              </div>
              <div class="col-right">
                <div class="col-left-top">
                  <group-inspection
                    :hierarchy-type="hierarchyType"
                    :struct-id="structId"
                  >
                  </group-inspection>
                </div>
                <div class="col-left-bottom">
                  <third-assess
                    :hierarchy-type="hierarchyType"
                    :struct-id="structId"
                  >
                  </third-assess>
                </div>
              </div>
            </section>
            <section class="middle-container">
              <div class="col-left">
                <supervisor-manage
                  :hierarchy-type="hierarchyType"
                  :struct-id="structId"
                >
                </supervisor-manage>
              </div>
              <div class="col-center">
                <key-node-track></key-node-track>
              </div>
              <div class="col-right">
                <sample-accept
                  :hierarchy-type="hierarchyType"
                  :struct-id="structId"
                >
                </sample-accept>
              </div>
            </section>
            <section class="bottom-container">
              <div class="col-left">
                <company-data
                  :hierarchy-type="hierarchyType"
                  :struct-id="structId"
                >
                </company-data>
              </div>
              <div class="col-center">
                <product-progress
                  :hierarchy-type="hierarchyType"
                  :struct-id="structId"
                ></product-progress>
              </div>
              <div class="col-left">
                <meterial-accept
                  :hierarchy-type="hierarchyType"
                  :struct-id="structId"
                >
                </meterial-accept>
              </div>
            </section>
          </div>
        </article>
      </main>
    </div>
  
</template>

<script>
import treeSelect from "@/components/sapi-tree-select";

export default {
  name: "group",
  data() {
    var panels = JSON.parse(
      window.sessionStorage.getItem("look-board-menus") || "[]"
    );
    panels = panels.filter(function(item) {
      return item.Children && item.Children.length;
    });
    return {
      // webUrl: webInit.fileUrl,
      webUrl: "",
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
      panelMenuId: "",
      hierarchyType: '',
      structId:'',
      projectMapData: [],
      companyInfoData: {},
    };
  },
  components: {
    ProjectInfo: function() {
      return import("@/views/lookBoard/components/projectInfo/index.vue");
    },
    companyInfo: function() {
      return import("@/views/lookBoard/components/projectInfo/company-info.vue");
    },
    ProjectMap: function() {
      return import("@/views/lookBoard/components/projectMap/index.vue");
    },
    KeyNodeTrack: function() {
      return import("@/views/lookBoard/components/keyNode/index-group.vue");
    },
    supervisorManage: function() {
      return import("@/views/lookBoard/components/projectInfo/supervisor-manage.vue");
    },
    inspectionAssessment: function() {
      return import("@/views/lookBoard/components/projectInfo/inspection-assessment.vue");
    },
    // projectData: function() {
    //   return import('@/views/lookBoard/components/projectInfo/project-data.vue')
    // },
    companyData: function() {
      return import("@/views/lookBoard/components/projectInfo/company-data.vue");
    },
    rangeCheck: function() {
      return import("@/views/lookBoard/components/charts/range-check.vue");
    },
    thirdAssess: function() {
      return import("@/views/lookBoard/components/charts/third-assess.vue");
    },
    groupInspection: function() {
      return import("@/views/lookBoard/components/charts/group-inspection.vue");
    },
    sampleAccept: function() {
      return import("@/views/lookBoard/components/charts/sample-accept.vue");
    },
    meterialAccept: function() {
      return import("@/views/lookBoard/components/charts/meterial-accept.vue");
    },
    ProductProgress: function() {
      return import("@/views/lookBoard/components/productProgress/index.vue");
    },

    treeSelect
  },
  computed: {
    headerTitle: function() {
      var tilte = { "1": "集团看板", "2": "公司看板", "3": "项目看板" };
      return tilte[this.boardMenuType + ""];
    }
  },
  methods: {
    getProjectImage(){
      this.$http('/api/project/images').then((value) => {
        console.info('images',value);
        this.projectMapData = value.data;
      })
    }
  },
  watch: {
    boardMenuType: function(n) {
      this.$refs.mainContent.scrollTop = 0;
      this.structId = "";
    }
  },
  created: function() {
    if (this.boardMenuType > 1) {
    }
    this.panelMenuId = window.sessionStorage.getItem("menuId");

  },
  mounted(){
    this.getProjectImage();
  }
};
</script>
<style lang="less">
@import url("../style.css");
#group_panel {
  background-color: #efeff4;
  width: 100%;
  overflow: hidden;
}
#group_panel section {
  position: relative;
  margin: 10px 0px;
  padding: 5px;
  overflow: hidden;
  
}
.top-container{
  min-height: 450px;
  height: 500px;
}
.middle-container{
  min-height: 300px;
  height: 320px;
}
.bottom-container{
  min-height: 500px;
  height: 600px;
}
.col-left,.col-right{
  float:left;
  width: 25%;
  height: 100%;
}
.col-left-top,.col-left-bottom{
  height: calc(~'50% - 8px');
  margin-bottom: 16px;
}
.col-center{
  float:left;
  width: calc(~'50% - 30px');
  margin: 0 15px;
  height: 100%;
}
</style>
