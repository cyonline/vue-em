<template>
  <!-- 检查项问题数占比 -->
  <div class="chart_module">
    <chart-tab v-if="computedEnabledTabs && computedEnabledTabs.length > 1" v-model="tabIndex" :data="computedEnabledTabs" :props="{ label: 'Name' }"></chart-tab>
    <div class="charts_container">
      <div class="title_left_border"></div>
      <div class="title_more" @click="openLayer"><span>更多 <i class="iconfont icon-xiangzuo-copy"></i></span></div>
      <div v-if="noData" class="nodata_block">暂无数据</div>
      <div
        ref="echart"
        class="chart_stack-bar"></div>
    </div>
    <div class="ci-panel auto-alert-box alert-p-15">
        <div class="search-layer">
            <ul class="list-unstyled index-choose-list clearfix">
                <li class="company">
                    <span class="lh-30 w-65">问题分类</span>
                    <el-select size="small" v-model="searchList.type" placeholder="可按分类筛选" filterable clearable @change="changeType()">
                        <el-option
                        v-for="item in typeOpt"
                        :key="item.QuestTypeId"
                        :label="item.QuestTypeName"
                        :value="item.QuestTypeId">
                        </el-option>
                    </el-select>
                </li>
                <li>
                    <el-button type="primary" @click="search" size="small">搜索</el-button>
                </li>
            </ul>
        </div>
        <div class="table-box" style="border-right: none">
            <div class="stat-table">
                <el-table stripe :data="layerTable" style="width: 100%">
                    <el-table-column :align="tableCol[0].align" :label="tableCol[0].label">
                        <template scope="scope" v-if="false">
                            <span>{{(pagination.index-1)*pagination.size + scope.$index + 1}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column 
                        v-for="(item, index) in tableCol" 
                        v-if="!!item.prop"
                        :key="item.id || index" 
                        :type="item.type" 
                        :align="item.align" 
                        :width="item.width" 
                        :label="item.label" 
                        :prop="item.prop"
                        :formatter="item.formatter"
                        show-overflow-tooltip>
                            
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <div class="page-container">
            <el-pagination
                :total="pagination.total"
                :page-size="pagination.size"
                @current-change="pageChange"
                :current-page.sync="pagination.index"
                @size-change="handleSizeChange"
                :page-sizes="[10, 20, 50, 100]"
                layout="total, sizes, prev, pager, next, jumper">
            </el-pagination>
        </div>
    </div>
  </div>
</template>

<script>
import tableStandard from '@/views/lookBoard/components/charts/tableStandard/ci.js'

var DefaultChartOption = {
  backgroundColor: '#fff',
  title: {
    text: "",
    textStyle: {
      fontSize: 15,
    },
  },
  grid: {
    left: 0,
    right: 60,
    top: 40,
    bottom: 0,
    containLabel: true
  },
  series: [],
  color: ""
};

var CustomChartOption = [{
  title: {
    text: "检查项问题数占比"
  },
  xAxis: {
    show: false
  },
  yAxis: {
    type: "category",
    data: [],
    inverse: true,
    axisLabel: {
      formatter: function (value, index) {
        return value + "\t\t" + (index + 1);
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
      name: '',
      type: 'bar',
      data: [],
      barWidth: 15,
      // barMaxWidth: 30,
      label: {
        show: true,
        position: 'right',
        color: '#333',
        formatter: function (v) {
          return v.value + "%";
        }
      },
      itemStyle: {
        color: '#42a1ff',
      },
    }]
}, {
  title: {
    text: "检查项整改率排行"
  },
  xAxis: {
    show: false
  },
  yAxis: {
    type: "category",
    data: [],
    inverse: true,
    axisLabel: {
      formatter: function (value, index) {
        return value + "\t\t" + (index + 1);
      }
    }
  },
  tooltip: {
    formatter: "{a} <br/>{b}: {c}%"
  },
  series: [{
    type: "bar",
    name: "",
    label: {
      normal: {
        show: true,
        position: "right",
        formatter: function (v) {
          return v.value;
        }
      }
    },
    data: []
  }]
}];

export default {
  name: 'CheckItem',
  data: function () {
    return {
      tabIndex: 0,
      offSetIndex: 0,
      //
      // echartOps: [],
      echartIns: null,
      //
      chartData: {},
      //
      noData: true,
      tableCol: tableStandard,
      searchList: {
          type: ''
      },
      typeOpt: [],
      layerTable: [],
      pagination: {
          total: 0,
          size: 0,
          index: 0
      }
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
      var vm = this;
      var t = this.computedCurrentModuleData;
      // 注意分组的顺序
      var optionIdx = this.groups.findIndex(function (g) {
        return g.map(function (item) { return item.Code; }).includes((vm.computedCurrentModuleData.Code));
      });
      return this.$$merge(this.$$deepClone(DefaultChartOption), CustomChartOption[optionIdx], this.chartData, {
        title: {
          text: t.Title || t.Name,
          padding: [5, 5, 5, 14],
        },
      }, true);
    },
    computedRealIndex: function () {
      return this.tabIndex + this.offSetIndex;
    },
    computedCurrentModuleData: function () {
      return this.tabs[this.computedRealIndex] || {};
    },
    computedEnabledTabs: function () {
      return this.tabs.filter(function (item) {
        return item.Enable;
      });
    },
  },
  watch: {
    // computedEchartOps: function () {
    //   // console.log('[watch:computedEchartOps]');
    //   this.$nextTick(this.initEcharts);
    // },
    tabIndex: function (n) {
      // console.log('[watch:tabIndex]', n);
      this.fetchData();
    },
    initTab: function (n) {
      this.offSetIndex = 0;
      this.tabIndex = n;
    },
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
    var step = new Date().getFullYear();
    this.searchList.year = step;
    this.searchList.month = new Date().getMonth() + 1;
    step -= 11;
    this.yearOpt = Array.apply(null,{length:21}).map(function (){step++;return {value: step, label: ''}});
  },
  methods: {
    /**
     * 更新和初始化echart
     */
    initEcharts: function () {
        var self = this;
      if (!this.echartIns) {
        var echartIns = window.echarts.init(this.$refs.echart);
        echartIns.setOption(this.computedEchartOps, true);
        echartIns.__INITED__ = true;
        this.echartIns = echartIns;
      } else {
        this.echartIns.setOption(this.computedEchartOps, true);
      }
    },
    fetchData: function () {
      var vm = this;
      // 注意分组的顺序
      var idx = this.groups.findIndex(function (g) {
        return g.map(function (item) { return item.Code; }).includes((vm.computedCurrentModuleData.Code));
      });
      var m = {
        0 : {
          url: '/api/reportBoardDelive/questType',
          request: {
            hierarchyType: this.hierarchyType,
            commonId: this.structId,
          },
        },
      };
      this.$$get(m[idx].url, m[idx].request)
        .then(function (res) {
          vm.chartData = {
            yAxis: res.data.xAxis,
            series: res.data.series,
          };
          vm.noData = !res.data.xAxis || !res.data.xAxis.data || !res.data.xAxis.data.length;
          vm.$nextTick(vm.initEcharts);
        }).catch(function (err) {
          if (err.message) {
            vm.$message.error(err.message);
          }
        });
    },
    openLayer: function() {
        if(this.hierarchyType === 3){
            return;
        }
        var $alert = $(".ci-panel");
        var self = this;
            this.pagination = {
                total: 0,
                index: 1,
                size: 10
            }
            this.getQuestionType()
            this.search()
            
            window.layer.open({
                type: 1,
                title: self.computedEnabledTabs[self.tabIndex].Name,
                shade: 0.0001,
                content: $alert,
                area: ['80%', '90%'],
                resize: false,
                btn: []
            });
    },
    search: function() { 
        var self = this;
        $.request({ 
            url: '/api/reportBoardDelive/app/deliverQuestTypeList', 
            type: 'get',
            isLoad: true,
            data: {
                questTypeId: self.searchList.type,
                hierarchyType: self.hierarchyType,
                itemId: self.hierarchyType == 2 ? self.structId : '',
                pageIndex: self.pagination.index,
                pageSize: self.pagination.size
            },
            success: function(data, res) {
                if(res.Code == 0) {
                    self.layerTable = data.Rows;
                    self.pagination.total = data.Total;
                }
            }
        })
    },
    getQuestionType: function() {
        var self = this;
        $.request({ 
            url: '/api/questionTypes/firstLevel', 
            type: 'get',
            isLoad: true,
            success: function(data, res) {
                if(res.Code == 0) {
                    self.typeOpt = data;
                }
            }
        })
    },
    changeCompany: function() {
        
    },
    pageChange: function(index) {
        this.pagination.index = index;
        this.search()
    },
    handleSizeChange: function(size) {
        this.pagination.size = size;
        this.search()
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
  }
  .chart_stack-bar {
    width: 100%;
    height: 400px;
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
  /* #region */
  .nodata_block {
    position: absolute;
    left: 0;
    top: 40px;
    width: 100%;
    height: -webkit-calc(100% - 40px);
    height: calc(100% - 40px);
    padding-top: 100px;
    text-align: center;
    color: #999;
    background-color: #fff;
    z-index: 10;
  }
  .chart_module .page-container{
    display: table;
    margin: 10px auto;
  }
  .title_more {
    position: absolute;
    right: 0;
    z-index: 10;
    color: #42a1ff;
    cursor: pointer;
  }
</style>


