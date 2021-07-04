<template>
  <!-- 项目看板 -->
  <div id="project_panel">
    <section class="top-container clearfix">
      <div class="left-pic-block">
        <project-map v-model="buildingId" :struct-id="structId" class="project_map__container"></project-map>
        <!-- 项目及楼栋信息 -->
        <div class="top_right_section" style="z-index: 1000;">
          <project-info :building-id="buildingId" :project-id="structId"></project-info>
        </div>
      </div>
      <!-- 总览 -->
      <div v-if="isModuleHasPermission(['001', '002', '009'])" class="right-overview-block">
        <overview v-if="isModuleHasPermission(['001', '002'])" :hierarchy-type="hierarchyType" :item-id="structId" :permissions="getModulePermission" :panel-type="panelType" style="background-color: #fff"></overview>
        <!-- 验房缺陷分类排行 -->
        <div v-if="isModuleHasPermission(['009'])" class="top_right_section" style="">
          <house-defects
            :hierarchy-type="hierarchyType"
            :struct-id="structId"
            :tabs="getTabs(['009'])"
            :groups="[[{ Code: '009' }]]"></house-defects>
        </div>
      </div>
    </section>
    <!-- 质量与安全分析 -->
    <section v-if="isModuleHasPermission(['003', '004'])" class="section">
      <quality-safety
        :hierarchy-type="hierarchyType"
        :struct-id="structId"
        :tabs="getTabs(['003', '004'])"
        :groups="[[{ Code: '003' }], [{ Code: '004' }]]"></quality-safety>
    </section>
    <!-- 问题严重程度分析 -->
    <section v-if="isModuleHasPermission(['005'])" class="section">
      <serious-problem
        :hierarchy-type="hierarchyType"
        :struct-id="structId"
        :tabs="getTabs(['005'])"></serious-problem>
    </section>
    <!-- 交付情况分析/交付缺陷分析 -->
    <section v-if="isModuleHasPermission(['006', '007'])" class="section">
      <delivery-analysis 
        :hierarchy-type="hierarchyType"
        :struct-id="structId"
        :tabs="getTabs(['006', '007'])"
        :groups="[[{ Code: '006' }], [{ Code: '007' }]]"></delivery-analysis >
    </section>
    <!-- 检查项问题数占比 -->
    <section v-if="isModuleHasPermission(['008'])" class="section">
      <check-item 
        :hierarchy-type="hierarchyType"
        :struct-id="structId"
        :tabs="getTabs(['008'])"
        :groups="[[{ Code: '008' }]]"></check-item>
    </section>
    <!-- 验房缺陷分类排行 -->
    <!-- <section v-if="isModuleHasPermission(['009'])" class="section">
      <house-defects
        :hierarchy-type="hierarchyType"
        :struct-id="structId"
        :tabs="getTabs(['009'])"
        :groups="[[{ Code: '009' }]]"></house-defects>
    </section> -->
    <!-- 合作单位排名 -->
    <section v-if="isModuleHasPermission(['010','013','014'])" class="section not_echart">
      <stat :show-type="'3-1'" :permissions="getModulePermission" :item-id="structId"></stat>
    </section>
    <!--评估检查  资料-->
    <section class="section not_echart" v-if="isModuleHasPermission(['011'])">
        <article style="width:48%;margin-right:4%;display:inline-block">
          <accesscheck-stat :show-type="'3'" :permissions="getModulePermission"></accesscheck-stat>
        </article> 
    </section>
  </div>
</template>

<script>
import PanelMixin from '@/views/lookBoard/mixins/panel.js';

export default {
  name: 'ProjectPanel',
  mixins: [PanelMixin],
  data: function() {
    return {
      // 层级(1.集团，2.公司，3.项目)
      hierarchyType: 3,
      //
      buildingId: '',
    }
  },
  /**
   * props
   * structId: 公司或项目的id
   * structNodeData 公司或项目当前选中的数据
   * modulePermissions: 图表权限列表
   * panelType: 面板类型 0 工程 1 交付
   */
  props: ['structId', 'structNodeData', 'modulePermissions', 'panelType'],
  components: {
    QualitySafety: function () {
      return import('@/views/lookBoard/components/charts/quality-safety.vue');
    },
    HouseDefects: function () {
      return import('@/views/lookBoard/components/charts/house-defects.vue');
    },
    overview: function () {
      return import('@/views/lookBoard/components/overview/overview.vue');
    },
    stat: function () {
      return import('@/views/lookBoard/components/problem-stat/stat.vue');
    },
    seriousProblem: function () {
      return import("@/views/lookBoard/components/charts/serious-problem.vue")
    },
    deliveryAnalysis: function () {
      return import("@/views/lookBoard/components/charts/delivery-analysis.vue")
    },
    checkItem: function () {
      return import("@/views/lookBoard/components/charts/check-item.vue")
    },
    projectMap: function() {
      return import("@/views/lookBoard/components/projectMap/index.vue")
    },
    projectInfo: function () {
      return import('@/views/lookBoard/components/projectInfo/index.vue');
    },
    accesscheckStat: function () {
      return import('@/views/lookBoard/components/problem-stat/accesscheck-stat.vue');
    }
  },
  watch: {
    structId: function () {
      this.buildingId = '';
    },
  },
};

</script>

<style scoped>
#project_panel {
  background-color: #efeff4;
  width: 100%;
  overflow: hidden;
}
#project_panel .top-container {
  position: relative;
  margin: 14px 0px;
  font-size: 0;
  overflow: hidden;
  min-height: 390px;
}
#project_panel .top-container .left-pic-block {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -webkit-flex-direction: column;
      -ms-flex-direction: column;
          flex-direction: column;
  position: absolute;
  left: 0;
  top: 0;
  vertical-align: top;
  width: -webkit-calc(65% - 16px);
  width: calc(65% - 16px);
  margin-right: 16px;
  background-color: #ffffff;
  -webkit-border-radius: 4px;
          border-radius: 4px;
  height: 100%;
  overflow: hidden;
}
#project_panel .top-container .right-overview-block {
  width: 35%;
  /* background-color: #ffffff; */
  -webkit-border-radius: 4px;
          border-radius: 4px;
  float: right;
}
#project_panel .section {
  margin-bottom: 14px;
  padding:15px 50px;
  background-color: #fff;
}
#project_panel .section.not_echart {
  padding: 30px 50px;
}
.top_right_section {
  position: relative;
  margin-top: 14px;
  padding: 0 25px;
  -webkit-border-radius: 4px;
          border-radius: 4px;
  background-color: #fff;
  padding: 1px 25px;
}
.project_map__container {
  -webkit-box-flex: 1;
  -webkit-flex: 1 0;
      -ms-flex: 1 0;
          flex: 1 0;
  width: 100%;
  height: 100%;
}
</style>
