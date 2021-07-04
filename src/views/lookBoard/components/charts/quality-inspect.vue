<template>
  <!-- 质量与安全 -->
  <div class="chart_module">

    <div class="charts_container">
      <div class="input-container">
        <span>年度:</span>
        <el-date-picker v-model="yearValue" @change="yearChange" type="year" :clearable="false" placeholder="请选择年度"></el-date-picker>
      </div>
      <div class="title_left_border"></div>
      <div
        ref="echart"
        class="chart_stack-bar"></div>
    </div>
   
  </div>
</template>

<script>
import tableStandard from '@/views/lookBoard/components/charts/tableStandard/qs.js'

export default {
  name: 'QualitySafeTyAnalysis',
  data: function () {
    return {
      tabIndex: 0,
      offSetIndex: 0,
      // echartOps: [],
      echartIns: null,
      //
      chartData: {},
      //
      // titleMap: {
      //   0: '质量问题分析',
      //   1: '安全问题分析',
      // },
      tableCol: tableStandard,
      searchList: {
          itemId: '',
          year: '',
          month: ''
      },
      itemType: 0,
      companyOpt: [],
      yearOpt: [],
      monthOpt: Array.apply(null,{length:12}).map(function (v, i){i++;return {value: i, label: ''}}),
      layerTable: [],
      pagination: {
          total: 0,
          size: 0,
          index: 0
      },
      projectTreeDataModel: {
          label: 'Name',
          children: 'ChildNodes',
        },
      yearValue: ''
    };
  },
  components: {
    chartTab: function () {
      return import('@/views/lookBoard/components/chart-tab/index.vue');
    },
  },
  props: {
    // 层级(1.集团，2.公司，3.项目)
    hierarchyType: {
      type: Number,
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
    // tab标签
    tabs: {
      type: Array,
      required: false,
      default: function () {
        return [];
      },
    },
    /**
     * 默认显示的tab
     */
    initTab: {
      type: Number,
      required: false,
      default: function () {
        return 0;
      },
    },
    groups: {
      type: Array,
      required: true,
      default: function () {
        return [];
      },
    },
  },
  computed: {
    computedEchartOps: function () {
      var t = this.computedCurrentModuleData;
      var DefaultChartOption = {
        backgroundColor: '#fff',
        title: {
          text: '',
          padding: [5, 5, 5, 14],
          textStyle: {
            fontSize: 15,
          },
        },
        dataZoom: [
            {
            height: 12,
      　　　　  type: 'slider',//图表下方的伸缩条
      　　　　  show : true, //是否显示 　　　　realtime : true, //拖动时，是否实时更新系列的视图 　　　　start : 0, //伸缩条开始位置（1-100），可以随时更改
      　　　　  end : this.computedPosition(this.chartData.xAxis.data.length), //伸缩条结束位置（1-100），可以随时更改 　　　}
            start : 0, //伸缩条开始位置（1-100），可以随时更改
            showDetail: false,
            bottom:30
      　　}],
        tooltip: {
          trigger: 'axis',
          // formatter: '{a}<br/>{b}:{c} ({d}%)',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'cross' // 默认为直线，可选为：'line' | 'shadow' | 'cross'
          },
        },
        legend: {
          // 自定义
          data: ['第一季度', '第二季度', '第三季度', '第四季度'],
          left: 'center',
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          // 后台返回数据
          data: [],
          // 后台返回数据
          name: '',
          // axisLabel: {  
          //     interval:0,  
          //     rotate:10
          //   },
          axisTick: {
            alignWithLabel: true
          },
        },
        yAxis: [
          {
            type: 'value',
            name: '',
            axisLine: {
              lineStyle: {
                color: '#666',
              },
            },
            axisTick: {
              show: false,
            },
            minInterval: 1,
          },
          {
            show: false,
            type: 'value',
            name: '',
            axisLine: {
              lineStyle: {
                color: '#666',
              },
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: true,
              formatter: function (value, index) {
                return index === 0 ? '' :  value;
              },
            },
          },
        ],
        series: [
          {
            name: '第一季度',
            type: 'bar',
            yAxisIndex: 0,
            // 后台返回数据
            data: [],
            itemStyle: {
              color: '#42a1ff',
            },
            barMaxWidth: 35,
            label: {
              show: true,
              position: 'top',
              formatter: function (params) {
                return params.value == 0 ? '' :  params.value;
              },
            },
          },
          {
            name: '第二季度',
            type: 'bar',
            yAxisIndex: 0,
            // 后台返回数据
            data: [],
            barMaxWidth: 35,
            itemStyle: {
              color: '#f3b219',
            },
            label: {
              show: true,
              position: 'top',
              formatter: function (params) {
                return params.value == 0 ? '' :  params.value;
              },
            },
          },
          {
            name: '第三季度',
            type: 'bar',
            yAxisIndex: 0,
            // 后台返回数据
            data: [],
            barMaxWidth: 35,
            itemStyle: {
              color: '#b93425',
            },
            label: {
              show: true,
              position: 'top',
              formatter: function (params) {
                return params.value == 0 ? '' :  params.value;
              },
            },
          },
          {
            name: '第四季度',
            type: 'bar',
            yAxisIndex: 0,
            // 后台返回数据
            data: [],
            barMaxWidth: 35,
            itemStyle: {
              color: '#274e96',
            },
            label: {
              show: true,
              position: 'top',
              formatter: function (params) {
                return params.value == 0 ? '' :  params.value;
              },
            },
          },
        ]
      };
      return this.$$merge(this.$$deepClone(DefaultChartOption), this.chartData, {
        title: {
          text: "专项检查得分(本年度)",
        },
      }, true);
    },
    computedRealIndex: function () {
      return this.tabIndex + this.offSetIndex;
    },
    computedCurrentModuleData: function () {
      return this.tabs[this.computedRealIndex] || {};
    },
  },
  watch: {
    // },
    hierarchyType: function () {
      this.fetchData();
    },
    structId: function () {
      this.fetchData();
    },
    tabs: function (n) {
      var vm = this;
      n.some(function (item, idx) {
        if (item.Enable) {
          vm.offSetIndex = idx;
          return true;
        }
        return false;
      });
    },
  },
  mounted: function () {
    var vm = this;
    this.yearValue = new Date()
    this.tabIndex = this.initTab;
    this.tabs.some(function (item, idx) {
      if (item.Enable) {
        vm.offSetIndex = idx;
        return true;
      }
      return false;
    });
    if (this.tabIndex === 0) {
      this.fetchData();
    }
  },
  methods: {
    computedPosition:function(length) {
      this.end = 100;
      console.log(length,'222')
      console.log(length <= 15 ? this.start = 0 : this.start = (100 - Math.floor(15 / length * 100)),'222')
      if(length>=15){
        return length <= 15 ? this.start = 0 : this.start = (100 - Math.floor(15 / length * 100))
      }else {
        return 100
      }
    },
    /**
     * 更新和初始化echart
     */
    initEcharts: function () {
        var self = this;
        var echartIns = window.echarts.init(this.$refs.echart);
        echartIns.setOption(this.computedEchartOps, true);
    },
    yearChange: function(){
      this.fetchData()
    },
    fetchData: function () {
      var vm = this;
      // 注意分组的顺序
      var type = this.groups.findIndex(function (g) {
        return g.map(function (item) { return item.Code; }).includes((vm.computedCurrentModuleData.Code));
      });
      var subData = {
        hierarchyType: this.hierarchyType,
        // type: type, // 0 质量 1 安全
        itemId: this.structId, // 下拉选择项(公司Id或项目Id)
        year: $.formatDateTime(this.yearValue).split("-")[0],
        // startTime: '',
        // endTime: '',
      };
      this.$$get('/api/reportBoardSpecialAssess/SpecialChartData', subData)
        .then(function (res) {
          vm.chartData = res.data;
          vm.$nextTick(vm.initEcharts);
        }).catch(function (err) {
          if (err.message) {
            vm.$message.error(err.message);
          }
        });
    },
  },
}
</script>

<style scoped>
  /* #region */
  .charts_container {
    position: relative;
    margin-top: 20px;
    width: 100%;
    /* overflow-y: auto; */
  }
  .chart_stack-bar {
    width: 100%;
    /* width: 2500px; */
    height: 340px;
    overflow-y: auto;
  }
  .title_left_border {
    position: absolute;
    left: 0;
    top: 0px;
    width: 4px;
    height: 20px;
    background-color: #42a1ff;
    z-index: 10;
  }
  .chart_module .page-container{
    display: table;
    margin: 10px auto;
  }
  .input-container {
    display: inline-block;
    width: 200px;
    position: absolute;
    top: 0;
    right: 0px;
    z-index: 100;
    display: flex;
  }
  .input-container span{
    width: 50px;
    line-height: 30px;
    margin-right: 10px;
  }
</style>
