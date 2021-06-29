<template>
  <!-- 验房缺陷分类排行 -->
  <div>
        <div class="chart_module">
            <chart-tab v-if="computedEnabledTabs && computedEnabledTabs.length > 1" v-model="tabIndex" :data="computedEnabledTabs" :props="{ label: 'Name' }"></chart-tab>
            <div class="charts_container">
            <div class="title_left_border">
            </div>
            <div v-if="noData" class="nodata_block">暂无数据</div>
            <div
                ref="echart"
                class="chart_stack-bar"></div>
            </div>
        </div>
      <div class="show-box auto-alert-box">
        <div class="slc-box">
            <ul class="list-unstyled index-choose-list clearfix">
                <li>
                    <span class="w-82" style="font-size:14px">检查内容</span>
                    <!-- <el-select v-model="checkItemId" 
                    size="small" 
                    placeholder="可按检查内容筛选" 
                    @change="getItemId" clearable>
                        <el-option v-for="item in checkItemData" 
                        :label="item.Name" :value="item.Id">
                        </el-option>
                    </el-select> -->
                    <el-select v-model="checkItemId" placeholder="请选择检查内容" filterable size="small" @change='getItemId'
                    clearable remote :remote-method="getCheckItemData">
                        <el-option v-for="item in checkItemData" :key="item.Id" :label="item.Name"
                            :value="item.Id" >
                        </el-option>
                    </el-select>
                </li>
                <li>
                    <el-button type="primary" size="small" @click="searchFunc">搜索</el-button>
                </li>
            </ul>
        </div>
        <div>
            <el-table :data="tableData" stripe style="width: 100%">
                <el-table-column label="排名" type='index'>
                </el-table-column>
                <el-table-column align="center" prop="questTypeName" label="检查内容">
                </el-table-column>
                <el-table-column align="center" prop="questAllCount" label="缺陷总数">
                </el-table-column>
                <el-table-column align="center" prop="WaitResolveCount" label="未整改数">
                </el-table-column>
                <el-table-column align="center" prop="ResolveCountRate" label="整改率">
                    <template scope="props">
                        {{props.row.ResolveCountRate}}%
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-box">
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="param.pageIndex"
                        :page-size="param.pageSize" :page-sizes="pageArr" layout="total, sizes, prev, pager, next,jumper"
                        :total="pageTotal">
                    </el-pagination>
                </div>
        </div>
    </div>
  </div>

</template>

<script>
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
    bottom: 0,
    top: 40,
    containLabel: true
  },
  series: [],
  color: ""
};

var HierarchyType;

var CustomChartOption = [{
  toolbox: {
            show: true,
            feature: {
                myTool: {
                    show: true,
                    title: '更多',
                    icon:'path://M432.45,595.444c0,2.177-4.661,6.82-11.305,6.82c-6.475,0-11.306-4.567-11.306-6.82s4.852-6.812,11.306-6.812C427.841,588.632,432.452,593.191,432.45,595.444L432.45,595.444z M421.155,589.876c-3.009,0-5.448,2.495-5.448,5.572s2.439,5.572,5.448,5.572c3.01,0,5.449-2.495,5.449-5.572C426.604,592.371,424.165,589.876,421.155,589.876L421.155,589.876z M421.146,591.891c-1.916,0-3.47,1.589-3.47,3.549c0,1.959,1.554,3.548,3.47,3.548s3.469-1.589,3.469-3.548C424.614,593.479,423.062,591.891,421.146,591.891L421.146,591.891zM421.146,591.891',
                    z:'999',
                    left:'center',
                    onclick: function (){
                        if(HierarchyType === 3){
                            return false
                        }else{
                            var $alert = $(".show-box");
                            layer.open({
                                type: 1,
                                title: ['验房缺陷分类排名'],
                                shade: 0.001,
                                area: ['80%', '80%'],
                                resize: false,
                                content: $alert,
                            })
                        }  
                    }
                }
            }
  },
  title: {
    text: ""
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
      },
      itemStyle: {
        color: '#42a1ff',
      },
    }]
}];

export default {
  name: 'CheckItem',
  data: function () {
    return {
        itemId:'',//公司Id
        checkItemId:'',//检查项ID
        computedPanelIndex:'',
        checkItemData:[],
        tableData:[],
        pageArr:webInit.pageArr,
        pageTotal:0,
        param:{
            pageSize: webInit.pageSize,
            pageIndex: 1
        },
      tabIndex: 0,
      offSetIndex: 0,
      //
      // echartOps: [],
      echartIns: null,
      //
      chartData: {},
      //
      noData: true,
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
      var vm = this;
      var t = this.computedCurrentModuleData;
      t.Name = "验房缺陷分类排名"
      // 注意分组的顺序
      var optionIdx = this.groups.findIndex(function (g) {
        return g.map(function (item) { return item.Code; }).includes((vm.computedCurrentModuleData.Code));
      });
      return this.$$merge(this.$$deepClone(DefaultChartOption), this.$$deepClone(CustomChartOption[optionIdx]), this.chartData, {
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
    hierarchyType: function (hi) {
        hierarchyType = hi;
      this.fetchData();
    },
    structId: function () {
      this.fetchData();
      this.getTableData();
        this.getCheckItemData();

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
    created:function() {
        this.getCheckItemData();
        this.getTableData();
        HierarchyType = this.hierarchyType;
    },
    methods: {
        /**
         * 更新和初始化echart
         */
        initEcharts: function () {
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
        vm.chartData = {};
        // 注意分组的顺序
        var idx = this.groups.findIndex(function (g) {
            return g.map(function (item) { return item.Code; }).includes((vm.computedCurrentModuleData.Code));
        });
        var m = {
            0 : {
            url: '/api/reportBoardDelive/checkQuest',
            request: {
                hierarchyType: vm.hierarchyType,
                itemId: vm.structId,
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
        getTableData:function(itemId,hi){
            var that = this;
            console.log(that.structId,582)
            var o = itemId ? itemId :that.structId;
            var h = hi ? hi : that.hierarchyType;
            $.request({
                url: "/api/reportBoardDelive/app/deliverQuest",
                    type: "get",
                    isLoad: true,
                    data:{
                        hierarchyType:h,
                        itemId:o,
                        checkItemId:that.checkItemId,
                        pageIndex:that.param.pageIndex,
                        pageSize:that.param.pageSize
                    },
                    success: function (data, res) {
                        if (res.Code == 0) {
                            that.tableData = data.Rows;
                            that.pageTotal = data.Total;
                        }
                    }
            })
        },
        getItemId:function(){
            this.getTableData(this.checkItemId);
        },
        handleSizeChange:function(val){
            this.param.pageSize = val;
                        if (this.param.pageIndex == 1) {
                            this.getTableData(this.itemId);
                        } else {
                            this.param.pageIndex = 1;
                        }
        },
        handleCurrentChange:function(val){
            this.param.pageIndex = val;
            this.getTableData(this.itemId);
        },
        searchFunc:function(){
            this.getTableData(this.itemId);
        },
        getCheckItemData:function(val){
            var _this = this;
                $.request({
                    url: "/api/checkItem",
                    type: "get",
                    data: {
                        keyword:val,
                        pageIndex: _this.param.pageIndex,
                        pageSize: _this.param.pageSize,
                    },
                    isLoad: true,
                    success: function (data, res) {
                        if (res.Code == 0) {
                            console.log(data,629)
                            _this.checkItemData = data.Rows;
                        }
                    }
                })                    
            
        },
        handleProjectTreeNodeClick: function (nodeData) {
            if ((+nodeData.Type) === 2) {
            this.itemId = nodeData.Id;
            this.getTableData(this.itemId,3)
            }
        },
        /**
         * 项目树节点是否可点
         */
        isProDisabled: function (nodeData) {
            return nodeData.Type !== 2;
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
  /* #region */
  .nodata_block {
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
  .show-box{
      padding: 15px;
      box-sizing: border-box;
  }
</style>
