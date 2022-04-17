<template>
  <div id="lookBoard" v-cloak>
    <main class="main">
      <header class="lookboard_panel_header">
        <div class="float-left header-title">公司看板</div>
      </header>
      <div class="lookboard_panel_header_blank"></div>
      <article ref="mainContent" class="lookboard_panel_content">
        <!-- 放置组件 -->
        <div id="project_panel">
          <section class="top-container">
            <div class="col-left">
              <project-info
                :data="projectInfoData"
                :struct-id="structId"
              ></project-info>
            </div>
            <div class="col-center">
              <project-map :data="projectMapData"></project-map>
            </div>
            <div class="col-right">
              <weather-info
                :data1="weatherInfoData.ProjectCastWeatherList"
                :data2="weatherInfoData.ProjectMonthWeatherList"
                :struct-id="structId"
              ></weather-info>
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
              <key-node-track
                :hierarchy-type="hierarchyType"
                :struct-id="structId"
              ></key-node-track>
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
              <div class="col-left-top">
                <inspection-assessment
                  :hierarchy-type="hierarchyType"
                  :struct-id="structId"
                >
                </inspection-assessment>
              </div>
              <div class="col-left-bottom">
                <project-data
                  :hierarchy-type="hierarchyType"
                  :struct-id="structId"
                ></project-data>
              </div>
            </div>
            <div class="col-center">
              <!-- <project-info :data="projectInfoData"></project-info> -->
              <product-progress
                :hierarchy-type="hierarchyType"
                :struct-id="structId"
              ></product-progress>
            </div>
            <div class="col-left">
              <div class="col-left-top">
                <range-check
                  :hierarchy-type="hierarchyType"
                  :struct-id="structId"
                >
                </range-check>
              </div>
              <div class="col-left-bottom">
                <meterial-accept
                  :hierarchy-type="hierarchyType"
                  :struct-id="structId"
                >
                </meterial-accept>
              </div>
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
  name: "lookBoard",
  data() {
    return {
      structId: "", // 公司看看板和项目看板默认选中第一个
      hierarchyType: 3,
      // 以子级MenuId作为key
      boardMenuType: 1,
      projectInfoData: {},
      projectMapData: [],
      weatherInfoData: {},
    };
  },
  components: {
    ProjectInfo: function () {
      return import("@/views/lookBoard/components/projectInfo/index.vue");
    },
    ProjectMap: function () {
      return import("@/views/lookBoard/components/projectMap/index.vue");
    },
    WeatherInfo: function () {
      return import("@/views/lookBoard/components/weatherInfo/index.vue");
    },
    KeyNodeTrack: function () {
      return import("@/views/lookBoard/components/keyNode/index.vue");
    },
    supervisorManage: function () {
      return import(
        "@/views/lookBoard/components/projectInfo/supervisor-manage.vue"
      );
    },
    inspectionAssessment: function () {
      return import(
        "@/views/lookBoard/components/projectInfo/inspection-assessment.vue"
      );
    },
    projectData: function () {
      return import(
        "@/views/lookBoard/components/projectInfo/project-data.vue"
      );
    },
    rangeCheck: function () {
      return import("@/views/lookBoard/components/charts/range-check.vue");
    },
    sampleAccept: function () {
      return import("@/views/lookBoard/components/charts/sample-accept.vue");
    },
    meterialAccept: function () {
      return import("@/views/lookBoard/components/charts/meterial-accept.vue");
    },
    ProductProgress: function () {
      return import("@/views/lookBoard/components/productProgress/index.vue");
    },

    treeSelect,
  },
  computed: {
    headerTitle: function () {
      var tilte = { 1: "集团看板", 2: "公司看板", 3: "项目看板" };
      return tilte[this.boardMenuType + ""];
    },
  },
  methods: {
    getProjectInfo: function () {
      var _this = this;
      this.$request("/api/engineeringReportBoard/projectInfo").then((res) => {
        console.info("项目", res);
        let data = res.data;
        _this.projectInfoData = {
          ProjectName: data.ProjectName,
          ProjectOldName: data.ProjectOldName,
          LandUseArea: data.LandUseArea,
          BuildingArea: data.BuildingArea,
          VolumeRate: data.VolumeRate,
          BuildingStoreys: data.BuildingStoreys,
          BuildingType: data.BuildingType,
          ConstructionUnit: data.ConstructionUnit,
          SurveyUnit: data.SurveyUnit,
          DesignyUnit: data.DesignyUnit,
          ProgressUnit: data.ProgressUnit,
          SupervisorSupplierName: data.SupervisorSupplierName,
          SupervisorSupplierNameStr: data.SupervisorSupplierNameStr,
        };
        _this.projectMapData = data.ImgUrls;
        _this.weatherInfoData = {
          ProjectMonthWeatherList: data.ProjectMonthWeatherList,
          ProjectCastWeatherList: data.ProjectCastWeatherList,
        };
      });
    },
  },
  watch: {},
  mounted() {
    this.getProjectInfo();
  },
};
</script>
<style lang="less" scoped>
@import url("../style.css");
#project_panel {
  background-color: #efeff4;
  width: 100%;
  overflow: hidden;
}
#project_panel section {
  position: relative;
  margin: 10px 0px;
  padding: 5px;
  overflow: hidden;
}
.top-container {
  min-height: 500px;
  height: 40vh;
}
.middle-container {
  min-height: 300px;
  height: 34vh;
}
.bottom-container {
  min-height: 500px;
  height: 600px;
}
.col-left,
.col-right {
  float: left;
  width: 25%;
  height: 100%;
}
.col-left-top,
.col-left-bottom {
  height: calc(~"50% - 8px");
  margin-bottom: 16px;
}
.col-center {
  float: left;
  width: calc(~"50% - 30px");
  margin: 0 15px;
  height: 100%;
}
</style>
