<template>
  <div class="wrapper">
    <el-row class="row">
      <el-col :span="12">
        <el-row>
          <el-col :span="8" class="label">项目名称：</el-col>
          <el-col :span="16" class="text">{{ data.ProjectName || '---' }}</el-col>
        </el-row>
      </el-col>
      <el-col :span="12">
          <el-col :span="8" class="label">甲方负责人：</el-col>
          <el-col :span="16" class="text">{{ data.LeaderName || '---' }}</el-col>
      </el-col>
    </el-row>
    <el-row class="row">
      <el-col :span="12">
        <el-row>
          <el-col :span="8" class="label">建筑面积：</el-col>
          <el-col :span="16" class="text">{{ data.BuildingArea || '---' }}</el-col>
        </el-row>
      </el-col>
      <el-col :span="12">
          <el-col :span="8" class="label">总包单位：</el-col>
          <el-col :span="16" class="text">{{ data.ContractorSupplierName || '---' }}</el-col>
      </el-col>
    </el-row>
    <el-row class="row">
      <el-col :span="12">
        <el-row>
          <el-col :span="8" class="label">分期标段：</el-col>
          <el-col :span="16" class="text">{{ data.StageBuildName || '---' }}</el-col>
        </el-row>
      </el-col>
      <el-col :span="12">
          <el-col :span="8" class="label">监理单位：</el-col>
          <el-col :span="16" class="text">{{ data.SupervisorSupplierName || '---' }}</el-col>
      </el-col>
    </el-row>
    <el-row v-if="buildingId" class="row">
      <el-col :span="12">
        <el-row>
          <el-col :span="8" class="label">楼栋名称：</el-col>
          <el-col :span="16" class="text">{{ data.BuildName || '---' }}</el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'ProjectInfo',
  data: function () {
    return {
      data: {},
    };
  },
  props: ['buildingId', 'projectId'],
  watch: {
    buildingId: function (n) {
      if (n) {
        this.fetchData();
      }
    },
    projectId: function () {
      this.fetchData();
    },
  },
  mounted: function () {
    this.fetchData();
  },
  methods: {
    fetchData: function () {
      var vm = this;
      return this.$$get('/project/reportBoardProjectBuild', {
        projectId: this.projectId,
        buildId: this.buildingId,
      }).then(function (res) {
        vm.data = res.data;
      }).catch(function (err) {
        console.error(err);
        if (err.message) {
          vm.$message.error(err.message);
        }
        throw err;
      });
    },
  },
};

</script>

<style scoped>
  .wrapper {
    position: relative;
    font-size: 12px;
    width: 80%;
    padding: 16px 0;
  }
  .row {
    margin-bottom: 16px;
  }
  .row:last-child {
    margin-bottom: 0;
  }
  .label {
    color: #333;
    font-weight: bold;
  }
  .text {
    color: #666;
  }
</style>

