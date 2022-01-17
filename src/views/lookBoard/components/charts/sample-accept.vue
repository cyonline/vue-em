<template>
    <div class="chart_module sample_accept">
            <div class="charts_container">
                <div class="title_left_border">
                </div>
                <div class="more-btn" @click="doMore">更多></div>
                <div class="data-filter">
                    <span @click="checkFilter(0)" :class="{'active': currentIdx === 0}">今日</span>
                    <span @click="checkFilter(1)" :class="{'active': currentIdx === 1}">本周</span>
                    <span @click="checkFilter(2)" :class="{'active': currentIdx === 2}">本月</span>
                    <span @click="checkFilter(3)" :class="{'active': currentIdx === 3}">本年</span>
                </div>
                <div v-if="noData" class="nodata_block">暂无数据</div>
                <div
                    ref="echart"
                    class="chart_stack-bar"></div>
            </div>
    </div>
</template>

<script>
import card from "@/views/lookBoard/components/common/card.vue"
var DefaultChartOption = {
  backgroundColor: '#fff',
  title: {
    text: "",
    textStyle: {
      fontSize: 15,
    },
  },
  legend: {
    data: ['验收次数'],
    left: 20,
    top: 20
  },
  grid: {
    left: 0,
    right: 60,
    bottom: 0,
    top: 40,
    containLabel: true
  },
  series: [],
  color: ""
};
var CustomChartOption = [{
  title: {
    text: "样板验收",
    padding: [5, 5, 5, 14],
    textStyle: {
      fontSize: 15,
    },
  },
  xAxis: {
    show: true,
  },
  yAxis: {
    type: "category",
    data: [],
    inverse: true,
    axisLabel: {
            interval:0,
            formatter:function(value){
                var ret = '';
                if(!value) return '';
                var maxLength = 4;
                var valLength = value.length;
                var rowN = Math.ceil(valLength/maxLength);
                if(rowN>1){
                    for(var i=0;i<rowN;i++){
                        var temp = '';
                        var start = i*maxLength;
                        var end = start + maxLength;
                        temp = value.substring(start, end) + '\n';
                        ret += temp;
                    }
                    return ret;
                }else{
                    return value;
                }
            }
      },
    axisLine: {
      lineStyle: {
        color: '#666',
      },
    },
    axisTick: {
      show: false,
    },
  },
  series: [
    {
      name: '验收次数',
      type: 'bar',
      data: [],
      barWidth: 15,
      // barMaxWidth: 30,
      label: {
        show: true,
        position: 'right',
        color: '#333',
      },
      itemStyle: {
        color: '#5FA3A7',
      },
    }]
}];
export default {
  name: 'SampleAccept',
  data: function () {
    return {
      echartIns: null,
      chartData: {},
      currentIdx: 2,
      dataList: [],
      noData: true
    };
  },
  components:{
    'card':card
    },
  props: {
    // 层级(1.集团，2.公司，3.项目)
    hierarchyType: {
      type: Number|String,
      required: true,
      default: function () {
        return 1;
      },
    },
    structId: {
      type: String,
      required: false,
      default: function () {
        return '';
      },
    },
  },
  computed: {
    computedEchartOps: function () {
      // return this.$$merge(this.$$deepClone(DefaultChartOption),this.$$deepClone(CustomChartOption[0]), this.chartData, true);
    },
  },
  watch: {
    hierarchyType: function () {
      this.fetchData();
    },
    structId: function () {
      this.fetchData();
    },
    currentIdx: function() {
      this.fetchData();
    }
 },
  mounted: function () {
    this.fetchData();
  },
  methods: {
    doMore: function() {
        var content = '/web/em/materialSampleAcceptance.html?layer=1&stageId=' + this.structId
                layer.open({
                    type: 2,
                    title: ["详情"],
                    shade: 0.001,
                    area: ['100%', '100%'],
                    resize: false,
                    content: content
                });

    },
    checkFilter: function(val) {
        this.currentIdx = val
    },
    /**
     * 更新和初始化echart
     */
    initEcharts: function () {
        var self = this;
      // if (!this.echartIns) {
      //   var echartIns = window.echarts.init(this.$refs.echart);
      //   // console.info(this.computedEchartOps)
      //   echartIns.setOption(this.computedEchartOps);
      //   echartIns.__INITED__ = true;
      //   this.echartIns = echartIns;
      // } else {
      //   this.echartIns.setOption(this.computedEchartOps, true);
      // }
    },
    fetchData: function () {
      var vm = this;
      var subData = {
        hierarchyType: this.hierarchyType,
        commonId: this.structId,
        dateType: this.currentIdx,
        acceptanceType:1
      };
      vm.initEcharts()
      // this.$$get('/api/engineeringReportBoard/acceptance', subData)
      //   .then(function (res) {
      //     vm.chartData = {
      //       yAxis: res.data.xAxis,
      //       series: res.data.series,
      //     };
      //     vm.noData = !res.data.xAxis || !res.data.xAxis.data || !res.data.xAxis.data.length;
      //     vm.$nextTick(vm.initEcharts);
      //   }).catch(function (err) {
      //     if (err.message) {
      //       vm.$message.error(err.message);
      //     }
      //   });
    },
  },
}
</script>

<style>
  /* #region */
  .chart_module {
    width: 100%;
    height: 100%;
    background: #fff;
    padding: 18px 20px;
    box-shadow: 0px 1px 4px #ccc;
    border-radius: 3px;
  }
  .sample_accept .charts_container {
    position: relative;
    width: 100%;
  }
  .sample_accept .title_left_border {
    position: absolute;
    left: 0px;
    top: 0px;
    width: 4px;
    height: 20px;
    background-color: #69a4e0;
    z-index: 10;
  }
  .sample_accept .chart_stack-bar {
    width: 100%;
    height: 280px;
  }
  .f-r {
      float: right;
  }
  .sample_accept .data-filter {
      position: absolute;
      right: 0px;
      top: 21px;
      z-index: 999;
  }

  .sample_accept .data-filter span{
      margin-left: 8px;
      cursor: pointer;
  }
  .sample_accept .more-btn {
    position: absolute;
    right: 0px;
    top: 0px;
    font-size: 14px;
    color: #388D91;
    cursor: pointer;
    z-index: 10;
 }

 .sample_accept .nodata_block {
    position: absolute;
    left: 0;
    top: 40px;
    width: 100%;
    font-size: 13px;
    height: -webkit-calc(100% - 40px);
    height: calc(100% - 40px);
    padding-top: 100px;
    text-align: center;
    color: #999;
    background-color: #fff;
    z-index: 10;
  }

</style>
