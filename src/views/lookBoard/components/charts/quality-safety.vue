<template>
  <!-- 质量与安全 -->
  <div class="chart_module">
    <chart-tab v-if="computedEnabledTabs && computedEnabledTabs.length > 1" v-model="tabIndex" :data="computedEnabledTabs" :props="{ label: 'Name' }"></chart-tab>
    <div class="charts_container">
      <div class="title_left_border"></div>
      <div
        ref="echart"
        class="chart_stack-bar"></div>
    </div>
    <div class="qs-panel auto-alert-box alert-p-15">
        <div class="search-layer">
            <ul class="list-unstyled index-choose-list clearfix">
                <li class="company">
                    <span class="lh-30 w-40">公司</span>
                    <el-select v-show="hierarchyType === 1" size="small" v-model="searchList.itemId" placeholder="可按公司名称筛选" filterable clearable @change="changeCompany()">
                        <el-option
                        v-for="item in companyOpt"
                        :key="item.Id"
                        :label="item.Name"
                        :value="item.Id">
                        </el-option>
                    </el-select>
                    <el-select v-show="hierarchyType === 2" v-model="searchList.itemId" placeholder="可按公司名称筛选" size="small" filterable clearable @change="handleProjectTreeNodeClick()">
                        <el-option
                        v-for="item in companyOpt"
                        :key="item.Id"
                        :value="item.Id"
                        :label="item.Name"></el-option>
                    </el-select>
                    <!-- <tree-select
                        ref="projectStructTree"
                        v-show="hierarchyType === 2"
                        :data="companyOpt"
                        node-key="Id"
                        :on-all="true"
                        :cur-key="searchList.itemId"
                        :props="projectTreeDataModel"
                        :change="handleProjectTreeNodeClick"
                        :expand-all="false"
                        placeholder="请选择项目"
                        :disabled="isProDisabled"
                        class="projectStructTree"></tree-select> -->
                </li>
                <li class="date">
                    <el-select size="small" v-model="searchList.year" placeholder="请选择">
                        <el-option
                        v-for="item in yearOpt"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                    <span> 年 </span>
                    <el-select size="small" v-model="searchList.month" placeholder="请选择">
                        <el-option
                        v-for="item in monthOpt"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                    <span> 月 </span>
                </li>
                <li>
                    <el-button type="primary" @click="search" size="small">搜索</el-button>
                </li>
            </ul>
  </div>
        <div v-if="hierarchyType < 3" class="table-box" style="border-right: none">
            <div class="stat-table">
                <el-table stripe :data="layerTable" style="width: 100%">
                    <el-table-column 
                        v-for="(item, index) in tableCol[hierarchyType-1].table" 
                        :key="item.id || index" 
                        :type="item.type" 
                        align="center" 
                        :width="item.width" 
                        :label="item.label" 
                        :prop="item.prop"
                        :formatter="item.formatter"
                        show-overflow-tooltip></el-table-column>
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
import tableStandard from '@/lookBoard/components/charts/tableStandard/qs.js'

var DefaultChartOption = {
  backgroundColor: '#fff',
  title: {
    text: '',
    padding: [5, 5, 5, 14],
    textStyle: {
      fontSize: 15,
    },
  },
  tooltip: {
    trigger: 'axis',
    // formatter: '{a}<br/>{b}:{c} ({d}%)',
    axisPointer: { // 坐标轴指示器，坐标轴触发有效
      type: 'cross' // 默认为直线，可选为：'line' | 'shadow' | 'cross'
    },
    formatter:function(par){
        return par[0].axisValueLabel+'</br>'+par[0].seriesName+' : '+par[0].data+'</br>'+
            par[1].seriesName+' : '+par[1].data+'</br>'+par[2].seriesName+' : '+par[2].data+'%';
    }
  },
  legend: {
    // 自定义
    data: ['问题总数', '未整改数', '未整改率'],
    left: 'right',
    padding: [5, 60],
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
    axisTick: {
      alignWithLabel: true
    },
  },
  yAxis: [
    {
      type: 'value',
      name: '问题数',
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
          return index === 0 ? '' : value;
        },
      },
      minInterval: 1,
    },
    {
      show: false,
      type: 'value',
      name: '未整改率（%）',
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
      name: '问题总数',
      type: 'bar',
      yAxisIndex: 0,
      // 后台返回数据
      data: [],
      itemStyle: {
        color: '#42a1ff',
      },
      barMaxWidth: '35%',
      label: {
        show: true,
        position: 'top',
        formatter: function (params) {
          return +params.value === 0 ? '' : params.value;
        },
      },
    },
    {
      name: '未整改数',
      type: 'bar',
      yAxisIndex: 0,
      // 后台返回数据
      data: [],
      barMaxWidth: '35%',
      itemStyle: {
        color: '#f3b219',
      },
      label: {
        show: true,
        position: 'top',
        formatter: function (params) {
          return +params.value === 0 ? '' : params.value;
        },
      },
    },
    {
      name: '未整改率',
      type: 'line',
      yAxisIndex: 1,
      // 后台返回数据
      data: [],
      itemStyle: {
        color: '#AD62EB',
      },
      label: {
        show: true,
        formatter: function (params) {
          return +params.value === 0 ? '' : params.value + '%';
        },
      },
    },
  ]
};
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
    };
  },
  components: {
    chartTab: function () {
      return import('@/lookBoard/components/chart-tab/index.vue');
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
      return this.$$merge(this.$$deepClone(DefaultChartOption), this.chartData, {
        title: {
          text: t.Title || t.Name,
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
        this.echartIns.on('click', function(params) {
            if(self.hierarchyType !== 3){                
                self.openLayer(params.name);
            }
        })
      } else {
        this.echartIns.setOption(this.computedEchartOps, true);
      }
    },
    fetchData: function () {
      var vm = this;
      // 注意分组的顺序
      var type = this.groups.findIndex(function (g) {
        return g.map(function (item) { return item.Code; }).includes((vm.computedCurrentModuleData.Code));
      });
      var subData = {
        hierarchyType: this.hierarchyType,
        type: type, // 0 质量 1 安全
        itemId: this.structId, // 下拉选择项(公司Id或项目Id)
        // startTime: '',
        // endTime: '',
      };
      this.$$get('/api/reportBoardDailyCheck/reportBoardDailyCheck', subData)
        .then(function (res) {
          vm.chartData = res.data;
          vm.$nextTick(vm.initEcharts);
        }).catch(function (err) {
          if (err.message) {
            vm.$message.error(err.message);
          }
        });
    },
    openLayer: function(params) {
        var $alert = $(".qs-panel");
        var self = this;
        var step;
            this.pagination = {
                total: 0,
                index: 1,
                size: 10
            }
            this.itemType = this.hierarchyType;
            this.searchList.itemId = this.structId;
            this.searchList.year = params.split('-')[0];
            this.searchList.month = +params.split('-')[1];
            step = this.searchList.year;
            step -= 11;
            this.yearOpt = Array.apply(null,{length:21}).map(function (){step++;return {value: step, label: ''}});
            this.getStructures();
            this.search();
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
            url: '/api/reportBoardDailyCheck/reportBoardDailyCheckListView', 
            type: 'get',
            isLoad: true,
            data: {
                type: self.tabIndex,
                hierarchyType: self.hierarchyType,
                itemId: self.searchList.itemId,
                selectTime: self.searchList.year + '-' + self.searchList.month,
                pageIndex: self.pagination.index,
                pageSize: self.pagination.size
            },
            success: function(data, res) {
                if(res.Code == 0) {
                    self.layerTable = data.Rows;
                    self.pagination.total = data.Total;
                    // console.log('111', self.tableCol[+self.hierarchyType - 1].table)
                }
            }
        })
    },
    getStructures: function() {
        var self = this;
        if(this.hierarchyType == 1) {
            var url = '/api/structures/reportAllCompany';
            var data = {}
        }else if(this.hierarchyType == 2) {
            var url = '/api/structures/reportstruTreeByUserId';
            var data = {}
        }
        $.request({ 
            url: url, 
            type: 'get',
            isLoad: true,
            data: data,
            success: function(data, res) {
                if(res.Code == 0) {
                    self.companyOpt = [];
                    if(self.hierarchyType == 1) {
                        self.companyOpt = data;
                    }else {
                        self.companyOpt = data;
                    }
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
    handleProjectTreeNodeClick: function (nodeData) {
        // if ((+nodeData.Type) === 1 || (+nodeData.Type) === 2) {
        //   this.searchList.itemId = nodeData.Id;
        //   this.itemType = nodeData.Type + 1;
        // }
    },
    /**
     * 项目树节点是否可点
     */
    isProDisabled: function (nodeData) {
        return !(+nodeData.Type === 2 || +nodeData.Type === 1);
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
    height: 300px;
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
</style>
