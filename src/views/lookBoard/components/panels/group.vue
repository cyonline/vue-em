<template>
  <!-- 集团看板 -->
  <div id="group_panel">
    <!-- 总览 -->
    <section class="top-container clearfix">
      <div class="left-pic-block">
        <map-box :city="structNodeData" :hierarchy-type="hierarchyType"></map-box>
      </div>
      <div v-if="isModuleHasPermission(['001', '002', '009'])" class="right-overview-block">
        <overview v-if="isModuleHasPermission(['001', '002'])" :hierarchy-type="hierarchyType" :panel-type="panelType" :permissions="getModulePermission"  style="background-color: #fff"></overview>
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
    <!-- 评估得分 -->
    <section v-if="isModuleHasPermission(['012'])" class="section">
      <quality-assessment
        :hierarchy-type="hierarchyType"
        :struct-id="structId"
        :tabs="getTabs(['012'])"
        :groups="[[{ Code: '012' }]]"></quality-assessment>
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
        <stat :show-type="'1-1'" :permissions="getModulePermission"></stat>
    </section>
    <section v-if="isModuleHasPermission(['015','016'])" class="section not_echart">
        <stat-t :show-type="'1-1'" :permissions="getModulePermission"></stat-t>
    </section>
    <!--评估检查  资料-->
    <section class="section not_echart" v-if="isModuleHasPermission(['011'])">
        <article style="width:48%;margin-right:4%;display:inline-block">
          <accesscheck-stat :show-type="'1'" :permissions="getModulePermission"></accesscheck-stat>
        </article> 
    </section>
  </div>

</template>

<script>
import PanelMixin from '@/views/lookBoard/mixins/panel.js';

export default {
  name: 'GroupPanel',
  mixins: [PanelMixin],
  data: function() {
    return {
      // 层级(1.集团，2.公司，3.项目)
      hierarchyType: 1,
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
    mapBox: function() {
      return import("@/views/lookBoard/components/baiduMap/baiduMap.vue")
    },
    accesscheckStat: function () {
      return import('@/views/lookBoard/components/problem-stat/accesscheck-stat.vue');
    },
    QualityAssessment: function () {
      return import('@/views/lookBoard/components/charts/quality-assessment.vue');
    },
    statT: function () {
      return import('@/views/lookBoard/components/problem-stat/statT.vue');
    },
  },
};

</script>

<style scoped>
#group_panel {
  background-color: #efeff4;
  width: 100%;
  overflow: hidden;
}
#group_panel .top-container {
  position: relative;
  margin: 14px 0px;
  font-size: 0;
  overflow: hidden;
  min-height: 313px;
}
#group_panel .top-container .left-pic-block {
  display: inline-block;
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
#group_panel .top-container .right-overview-block {
  width: 35%;
  /* background-color: #ffffff; */
  -webkit-border-radius: 4px;
          border-radius: 4px;
  float: right;
}
#group_panel .section {
  margin-bottom: 14px;
  padding: 10px 50px;
  background-color: #fff;
}
#group_panel .section.not_echart {
  padding: 20px 50px;
}
.top_right_section {
  position: relative;
  margin-top: 14px;
  padding: 0 25px;
  border-radius: 4px;
  background-color: #fff;
  padding: 1px 25px;
}
</style>
