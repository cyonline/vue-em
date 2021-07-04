 <template>
  <!-- 交付情况分析/交付缺陷分析 -->
  <div>
        <div class="chart_module">
            <chart-tab v-if="computedEnabledTabs && computedEnabledTabs.length > 1" v-model="tabIndex" :data="computedEnabledTabs" :props="{ label: 'Name' }"></chart-tab>
            <div class="charts_container">
            <div class="title_left_border"></div>
            <div
                ref="echart"
                class="chart_stack-bar"></div>
            </div>
            
        </div>
        <div class="show-data-box auto-alert-box">
            <div>
                <ul class="list-unstyled index-choose-list clearfix">
                    <li>
                        <span class="w-40" >公司</span>
                        <el-select v-show="hierarchyType === 1"  v-model="itemId" placeholder="请选择公司" size="small" filterable class="struct_tree" clearable>
                        <el-option
                        v-for="item in companyData"
                        :key="item.Id"
                        :value="item.Id"
                        :label="item.Name"
                        class="struct_option_item"></el-option>
                        </el-select>
                        <el-select v-show="hierarchyType === 2"  v-model="itemId" placeholder="请选择公司" size="small" filterable class="struct_tree" clearable>
                        <el-option
                        v-for="item in projectData"
                        :key="item.Id"
                        :value="item.Id"
                        :label="item.Name"
                        class="struct_option_item"></el-option>
                        </el-select>
                    </li>
                    <li class="date">
                        <el-select class="date" v-model="year" placeholder="请选择年份" size="small" filterable class="struct_tree" @change="chooseY">
                            <el-option class="date"
                            v-for="item in yearOpt"
                            :value="item.year"
                            :label="item.year"
                            class="struct_option_item"></el-option>
                        </el-select>
                        <span>年</span>
                       <el-select size="small" v-model="month" placeholder="请选择月份">
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
                        <el-button type="primary" size="small" @click="searchFunc">搜索</el-button>
                    </li>
                </ul>
            </div>
            <div class="wrap">
                <el-table :data="tableData" stripe style="width: 100%">
                    <el-table-column prop="date" label="排名" type='index'>
                    </el-table-column>
                    <el-table-column align="center" v-if="hierarchyType === 1" prop="ItemName" label="公司">
                    </el-table-column>
                    <el-table-column align="center" v-if="hierarchyType === 2" prop="ItemName" label="项目">
                    </el-table-column>
                    <el-table-column align="center" v-if='tabIndex === 1' prop="QuestCount" label="缺陷总数">
                    </el-table-column>
                    <el-table-column align="center" v-if='tabIndex === 1' prop="WaitResolveCount" label="未整改数">
                    </el-table-column>
                    <el-table-column align="center" v-if='tabIndex === 1' prop="ResolveCountRate" label="整改率">
                        <template slot-scope="props">
                            {{props.row.ResolveCountRate}}%
                        </template>
                    </el-table-column>
                    <el-table-column align="center" v-if='tabIndex === 0' prop="DeliverCount" label="交付总户数">
                    </el-table-column>
                    <el-table-column align="center" v-if='tabIndex === 0' prop="FirstDoCount" label="有意见接收">
                    </el-table-column>
                    <el-table-column align="center" v-if='tabIndex === 0' prop="SuccessCount" label="无意见接收">
                    </el-table-column>
                    <el-table-column align="center" v-if='tabIndex === 0' label="一次交付率">
                        <template slot-scope="props">
                            {{props.row.OneDliveryRate}}%
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination-box">
                    <el-pagination @size-change="handleSizeChange" 
                    @current-change="handleCurrentChange" :current-page="param.pageIndex"
                    :page-size="param.pageSize" :page-sizes="pageArr" 
                    layout="total, sizes, prev, pager, next,jumper"
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
    data: [],
    left: 'right',
    padding: [5, 60],
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
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
        show: false,
        formatter: function (value, index) {
          return index === 0 ? '' :  value;
        },
      },
    },
  ],
  series: [],
};
var CustomChartOption = [{
  title: {
    text: "交付情况分析"
  },
  yAxis: [{
    name: "交付户数"
  }, {
    name: "一次性交付率（%）",
  }],
  legend: {
    data: ["有意见交付", "无意见交付", "交付总户数", "一次交付率"]
  },
  series: [{
      type: "bar",
      label: {
        normal: {
          show: true,
          position: "top",
          formatter: function (params) {
            return +params.value === 0 ? '' : params.value;
          },
        }
      },
      // 后台返回数据
      data: [],
      barMaxWidth: '25%',
      itemStyle: {
        color: "#f3b219"
      }
    },
    {
      type: "bar",
      label: {
        normal: {
          show: true,
          position: "top",
          formatter: function (params) {
            return +params.value === 0 ? '' : params.value;
          },
        }
      },
      // 后台返回数据
      data: [],
      barMaxWidth: '25%',
      itemStyle: {
        color: "#3ed4c4"
      }
    },
    {
      type: "bar",
      label: {
        normal: {
          show: true,
          position: "top",
          formatter: function (params) {
            return +params.value === 0 ? '' : params.value;
          },
        }
      },
      // 后台返回数据
      data: [],
      barMaxWidth: '25%',
      itemStyle: {
        color: "#42a1ff"
      }
    },
    {
      type: "line",
      yAxisIndex: 1,
      // 后台返回数据
      data: [],
      label: {
        normal: {
          show: true,
          formatter: function (params) {
            return +params.value === 0 ? '' : params.value + '%';
          },
        }
      },
      itemStyle: {
        color: "#42a1ff"
      }
    }
  ]
}, {
  title: {
    text: "交付缺陷分析"
  },
  legend: {
    data: ["缺陷总数", "未整改数", "整改率"]
  },
  yAxis: [{
    name: "缺陷数"
  }, {
    name: "整改率（%）",
  }],
  series: [{
      type: "bar",
      label: {
        normal: {
          show: true,
          position: "top",
          formatter: function (params) {
            return +params.value === 0 ? '' : params.value;
          },
        }
      },
      // 后台返回数据
      data: [],
      barMaxWidth: '35%',
      itemStyle: {
        color: "#f3b219"
      }
    },
    {
      type: "bar",
      label: {
        normal: {
          show: true,
          position: "top",
          formatter: function (params) {
            return +params.value === 0 ? '' : params.value;
          },
        }
      },
      // 后台返回数据
      data: [],
      barMaxWidth: '35%',
      itemStyle: {
        color: "#3ed4c4"
      }
    },
    {
      type: "line",
      yAxisIndex: 1,
      // 后台返回数据
      data: [],
      label: {
        normal: {
          show: true,
          formatter: function (params) {
            return +params.value === 0 ? '' : params.value + '%';
          },
        }
      },
      itemStyle: {
        color: "#42a1ff"
      }
    }
  ]
}];

export default {
  name: 'DeliveryAnalysis',
  data: function () {
    return {
        value:'',
        year:'',
        month:'',
        itemId:'',
        hieType:'',
        yearOpt:[],
        monthOpt: Array.apply(null,{length:12}).map(function (v, i){i++;return {value: i, label: ''}}),
        computedPanelIndex:'',
        companyData:[],
        projectData:[],
        projectTreeDataModel: {
          label: 'Name',
          children: 'ChildNodes',
        },
        tableData:[],
        tableData1:[],
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
      required: true,
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
    itemId:function(itemId){
        this.getTableData();
    },
    date:function(o){
        console.log(o)
    },
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
    chooseY:function(n){
        console.log(JSON.stringify(this.yearOpt))
    },
    initEcharts: function () {
      if (!this.echartIns) {
        var echartIns = window.echarts.init(this.$refs.echart);
        echartIns.setOption(this.computedEchartOps, true);
        echartIns.__INITED__ = true;
        this.echartIns = echartIns;
      } else {
        this.echartIns.setOption(this.computedEchartOps, true);
      }
      var $alert = $(".show-data-box");
      var that = this;
      this.echartIns.on('click',function(param){
          if(that.hierarchyType === 3){
              return false;
          }
          that.year = ''; that.month = '';
          that.year = param.name.split('-')[0];
          that.month = param.name.split('-')[1];
          that.yearOpt = [];
          var m = that.year;
          for(var i = 0;i<=10;i++){
              var obj = {};
              obj.year = parseInt(m)-i;
              that.yearOpt.unshift(obj)
          }
          for(var i = 1;i<=10;i++){
              var obj = {};
              obj.year = parseInt(m)+i;
              that.yearOpt.push(obj)
          }
          that.itemId = that.structId;
          that.getTableData();
          layer.open({
            type: 1,
            title: that.tabIndex ? ['交付缺陷分析']:['交付情况分析'],
            shade: 0,
            area: ['80%', '80%'],
            resize: false,
            content: $alert,
            cancel: function () {
                //右上角关闭回调
                that.itemId = ''; 
                that.yearOpt = [];
            }
          });
      })
    },
    fetchData: function () {
      var vm = this;
      // 注意分组的顺序
      var idx = this.groups.findIndex(function (g) {
        return g.map(function (item) { return item.Code; }).includes((vm.computedCurrentModuleData.Code));
      });
      var m = {
        // 交付情况分析
        0 : {
          url: '/api/reportBoardDelive',
          request: {
            hierarchyType: vm.hierarchyType,
            commonId: vm.structId,
          },
        },
        // 交付缺陷分析
        1 : {
          url: '/api/reportBoardDelive/quest',
          request: {
            hierarchyType: vm.hierarchyType,
            commonId: vm.structId,
          },
        },
      };
      this.$$get(m[idx].url, m[idx].request)
        .then(function (res) {
          vm.chartData = res.data;
          vm.$nextTick(vm.initEcharts);
        }).catch(function (err) {
          if (err.message) {
            vm.$message.error(err.message);
          }
        });
    },
    getTableData:function(){
        var that = this;
        $.request({
              url: "/api/reportBoardDelive/app/deliverList",
                type: "get",
                isLoad: true,
                data:{
                    reportType:that.tabIndex,
                    hierarchyType:that.hierarchyType,
                    itemId:that.itemId,
                    selectTime:that.year+'-'+that.month+'-01',
                    pageSize:that.param.pageSize,
                    pageIndex:that.param.pageIndex
                },
                success: function (data, res) {
                    if (res.Code == 0) {
                        that.tableData = data.Rows;
                        that.pageTotal = data.Total;
                    }
                }
          })
    },
    handleSizeChange:function(val){
        this.param.pageSize = val;
                    if (this.param.pageIndex == 1) {
                        this.getTableData();
                    } else {
                        this.param.pageIndex = 1;
                    }
    },
    handleCurrentChange:function(val){
        this.param.pageIndex = val;
        this.getTableData();
    },
    searchFunc:function(){
        this.getTableData();
    },
    getCompanyData:function(val){
        var _this = this;
        $.request({
                url: "/api/structures/reportAllCompany",
                type: "get",
                isLoad: true,
                success: function (data, res) {
                    if (res.Code == 0) {
                        _this.companyData = data;
                    }
                }
            }) 
    },
    getProjData:function(val){
        var _this = this;
            $.request({
                url: "/api/structures/reportstruTreeByUserId",
                type: "get",
                
                isLoad: true,
                success: function (data, res) {
                    if (res.Code == 0) {
                        _this.projectData = data;
                    }
                },
            })
    },
    handleProjectTreeNodeClick: function (nodeData) {
          this.itemId = nodeData.Id;
          this.getTableData()
      },
    /**
       * 项目树节点是否可点
       */
    isProDisabled: function (nodeData) {
        return !(nodeData.Type == 2 || nodeData.Type == 1);
    },
  },
  created:function() {
      this.getProjData();
      this.getCompanyData();
      
  },
}
</script>

<style>
    .wrap table{
        width: 100% !important;
    }
    .el-table__empty-block{
        width: 100% !important;
    }
</style>


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
  .show-data-box{
      padding: 15px;
      box-sizing: border-box;
  }
</style>

