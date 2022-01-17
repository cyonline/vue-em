<template>
    <div class="chart_module range_check">
            <div class="charts_container">
                <div class="title_left_border">
                </div>
                <div class="more-btn" @click="doMore">更多></div>
                <div class="data-filter">
                    <span @click="checkFilter(0)" :class="{'active': currentIdx === 0}">上月</span>
                    <span @click="checkFilter(1)" :class="{'active': currentIdx === 1}">本年</span>
                </div>
                <div
                    ref="echart"
                    class="chart_stack-bar"></div>
                <div class="bottom-content" v-if="dataList.length > 0 && hierarchyType==3">
                    <div v-for="item in dataList" :key="item.ItemId">
                        <span>{{item.ItemName}}</span>
                        <span class="f-r">{{item.Score}}</span>
                    </div>
                </div>
                <div class="bottom-content-group" v-if="dataList.length > 0 && hierarchyType!=3">
                    <div class="bc-item" v-for="item in dataList" :key="item.ItemId">
                        <span>{{item.ItemName}}</span>
                        <span class="f-r">{{item.Score}}</span>
                    </div>
                </div>
            </div>
    </div>
</template>

<script>
import card from "@/views/lookBoard/components/common/card.vue"
var DefaultChartOption = {
  title: {
    text: "区域巡检",
    padding: [5, 5, 5, 14],
    textStyle: {
      fontSize: 15,
    },
  },
  series: [{
        type: 'gauge',
        startAngle: 180,
        endAngle: 0,
        min: 0,
        max: 100,
        splitNumber: null,
        itemStyle: {
            color: '#68D4D9',
            shadowColor: 'rgba(255,255,255,1)',
            shadowBlur: 10,
            shadowOffsetX: 2,
            shadowOffsetY: 2,
        },
        progress: {
            show: true,
            roundCap: true,
            width: 10
        },
        pointer: {
            show: false,
        },
        axisLine: {
            roundCap: true,
            lineStyle: {
                width: 10
            }
        },
        axisTick: {
            show: false,
        },
        splitLine: {
            show: false,
        },
        axisLabel: {
            distance: 30,
            color: '#999',
            fontSize: 10
        },
        title: {
            show: false,
        },
        detail: {
            backgroundColor: '#fff',
            width: '60%',
            lineHeight: 25,
            height: 10,
            offsetCenter: [0, '-40%'],
            valueAnimation: true,
            formatter: function (value) {
                return '{a|综合得分}' +'\n'+'{value|' +  value + '}';
            },
            rich: {
                value: {
                    fontSize: 30,
                    fontWeight: 'bolder',
                    color: '#333'
                },
                a: {
                    fontSize: 14,
                    color: '#666',
                    padding:[0,0,30,0]
                }
            }
        },
        data: []
    }]
};
export default {
  name: 'RangrCheck',
  data: function () {
    return {
      echartIns: null,
      chartData: {},
      currentIdx: 0,
      dataList: [],
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
      // return this.$$merge(this.$$deepClone(DefaultChartOption), this.chartData, true);
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
        console.log('domore')
        var content = '/pages/em/InspectionManageControl/InspectionManage/InspectionManage.html?layer=1&menuId=layer&insType=1&stageId=' + this.structId
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
      if (!this.echartIns) {
        var echartIns = window.echarts.init(this.$refs.echart);
        // console.info(this.computedEchartOps)
        echartIns.setOption(this.computedEchartOps);
        echartIns.__INITED__ = true;
        this.echartIns = echartIns;
      } else {
        this.echartIns.setOption(this.computedEchartOps, true);
      }
    },
    fetchData: function () {
      var vm = this;
      var subData = {
        hierarchyType: this.hierarchyType,
        commonId: this.structId,
        type: this.currentIdx,
      };
      // this.$$get('/api/engineeringReportBoard/areaQualityInspection', subData)
      //   .then(function (res) {
      //     vm.chartData = {
      //         series: [{
      //             data: [{
      //                 value: res.data.TotalScore
      //             }]
      //         }]
      //     };
      //     vm.dataList = res.data.ItemScores
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
  .range_check .charts_container {
    position: relative;
    width: 100%;
  }
  .range_check .title_left_border {
    position: absolute;
    left: 0;
    top: 0px;
    width: 4px;
    height: 20px;
    background-color: #69a4e0;
    z-index: 10;
  }
  .range_check .chart_stack-bar {
    width: 100%;
    height: 280px;
  }

  .range_check .bottom-content {
      position: absolute;
      bottom: 30px;
      left: 50%;
      width: 80%;
      height: 100px;
      transform: translateX(-50%);
  }
  .range_check .bottom-content div {
      line-height: 25px;
  }
  .f-r {
      float: right;
  }
  .range_check .data-filter {
      position: absolute;
      right: 0px;
      top: 36px;
      z-index: 999;
  }

  .range_check .data-filter span{
      margin-left: 8px;
      cursor: pointer;
  }

  .range_check .more-btn {
    position: absolute;
    right: 0px;
    top: 0px;
    font-size: 14px;
    color: #388D91;
    cursor: pointer;
    z-index: 10;
  }
  .bottom-content-group{
    display: flex;
    position: absolute;
    bottom: 65px;
    left: 50%;
    width: 100%;
    height: 60px;
    padding: 0 10px;
    transform: translateX(-50%);
    flex-wrap:wrap;
  }
  .bc-item{
    width: 40%;
    margin-right: 10%;
    height: auto;
  }
  .m-l{
    margin-left: 5%;
  }

</style>
