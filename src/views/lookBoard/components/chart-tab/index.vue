<template>
  <div class="chart_module_tabs">
    <el-radio-group v-model="tabIndex" size="medium">
      <el-radio-button
        v-for="(item, idx) in data"
        :key="idx"
        :label="idx">{{ props.label === '*this' ? item :item[props.label] }}</el-radio-button>
    </el-radio-group>
  </div>
</template>

<script>

export default {
  namt: 'ChartTab',
  data: function () {
    return {
      tabIndex: 0,
    };
  },
  props: {
    value: {
      type: Number|String,
      required: false,
    },
    data: {
      type: Array,
      default: function () {
        return [];
      },
    },
    props: {
      type: Object,
      default: function () {
        return {
          label: '*this', // *this表示自身
        };
      },
    },
  },
  watch: {
    value: function (n) {
      this.tabIndex = n;
    },
    tabIndex: function (n) {
      this.$emit('input', n);
      this.$emit('change', n);
    },
  },
  mounted: function () {
    this.tabIndex = this.value || 0;
  },
}
</script>

<style>
  /* #region */
  .chart_module_tabs {
    text-align: center;
    border-bottom: 1px solid #c1cbda;
  }
  /* hack element-ui */
  .chart_module_tabs .el-radio-button .el-radio-button__inner {
    background-color: #efeff4;
    border-bottom: none;
    padding: 9px 15px;
    min-width: 80px;
    font-size: 13px;
    border-right: 1px solid #bfcbd9;
  }
  .chart_module_tabs .el-radio-button__orig-radio:checked+.el-radio-button__inner {
    background-color: #42a1ff;
  }
  .chart_module_tabs .el-radio-button:first-child .el-radio-button__inner {
    border-radius: 0;
  }
  .chart_module_tabs .el-radio-button:last-child .el-radio-button__inner {
    border-radius: 0;
  }
</style>
