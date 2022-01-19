<template>
    <card class="company-data" title="项目资料">
        <div slot="right-title" @click="doMore">更多></div>
        <template>
            <div class="container">
                <div class="com-item">
                    <div class="data-box" style="background-color: #eef5ff;">
                        <div class="box-item">
                                <div class="icon-box month"></div>
                                <span class="title">本月新增数</span>
                        </div>
                            <span class="number">{{proData.AddMonthCount}}</span>
                    </div>
                    <!-- <div class="echart-box"> -->
                        <div ref="echart" class="chart_stack-bar"></div>
                    <!-- </div> -->
                </div>
                <div class="com-item">
                    <div class="data-box" style="background-color:#ecf7f7 ;">
                            <div class="box-item">
                                <div class="icon-box"><div class="icon-img"></div></div>
                                <span class="title">累计新增数</span>
                            </div>
                            <span class="number">{{proData.AdditionsCount}}</span>
                    </div>
                    <div ref="echart2" class="chart_stack-bar"></div>
                </div>
            </div>
        </template>
    </card>  
</template>

<script>
import card from "@/views/lookBoard/components/common/card.vue"
var DefaultChartOption = {
    backgroundColor: '#fff',
    grid: {
        left: 0,
        right: 0,
        bottom: 10,
        top: 20,
        containLabel: true
    },
    series: [],
    color: ""
};
var CustomChartOption = [{
    yAxis: {
        show: true,
    },
    xAxis: {
        type: "category",
        data: [],
        inverse: false,
        axisLine: {
            lineStyle: {
                color: '#666',
            },
        },
        axisTick: {
            show: false,
        },
        axisLabel: {
            interval:0,
            // rotate: 40,
            formatter:function(value){
                var ret = '';
                if(!value) return '';
                var maxLength = 3;
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
        }
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
            position: 'top',
            color: '#333',
        },
        itemStyle: {
            color: '#5891EE',
        },
        }]
}];

export default {
    name: 'project-data',
    data: function() {
        return {
            proData: {
                AddMonthCount: 0,
                AdditionsCount: 0,
                
            },
            chartData:null,
            chartData2:null,
            
        }
    },
    props:{
        // 层级(1.集团，2.公司，3.项目)
        hierarchyType: {
            type: Number|String,
            required: true,
            default: function () {
                return 0;
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
    components:{
        'card':card
    },
    watch: {
        hierarchyType: function () {
            this.fetchData();
        },
        structId: function () {
            this.fetchData();
        },
    },
    methods:{
        doMore:function(){
            var content = '/web/em/dataManagement.html?layer=1&stageId=' + this.structId
                layer.open({
                    type: 2,
                    title: ["文档"],
                    shade: 0.001,
                    area: ['100%', '100%'],
                    resize: false,
                    content: content
                });
        },
        /**
     * 更新和初始化echart
     */
        initEcharts: function () {
            var self = this;
            // if (!this.echartIns) {
            //     var echartIns = this.$echarts.init(this.$refs.echart);
            //     // console.info(this.computedEchartOps)
            //     echartIns.setOption(this.computedEchartOps);
            //     echartIns.__INITED__ = true;
            //     this.echartIns = echartIns;
            // } else {
            //     this.echartIns.setOption(this.computedEchartOps, true);
            // }
        },
        initEcharts2: function () {
            var self = this;
            // if (!this.echartIns2) {
            //     var echartIns2 = this.$echarts.init(this.$refs.echart2);
            //     echartIns2.setOption(this.computedEchartOps2);
            //     echartIns2.__INITED__ = true;
            //     this.echartIns2 = echartIns2;
            // } else {
            //     this.echartIns2.setOption(this.computedEchartOps2, true);
            // }
        },
        fetchData: function () {
            var vm = this;
            var subData = {
                hierarchyType: this.hierarchyType,
                commonId: this.structId, // 下拉选择项(公司Id或项目Id)
            };
            vm.initEcharts()
            vm.initEcharts2()
            // this.$$get('/api/engineeringReportBoard/dataManageFile', subData)
            //     .then(function (res) {
            //         // console.info('RES',res)
            //         vm.proData.AddMonthCount = res.data.AddMonthCount;
            //         vm.proData.AdditionsCount = res.data.AdditionsCount;
            //         vm.chartData = {
            //             xAxis: res.data.AddMonthData.xAxis,
            //             series: res.data.AddMonthData.series,
            //         };
            //         vm.chartData2 = {
            //             xAxis: res.data.AdditionsData.xAxis,
            //             series: res.data.AdditionsData.series,
            //         };
            //         vm.chartData2.series[0].itemStyle = {
            //             color: '#63CECE',
            //         };
            //         // vm.noData = !res.data.AddMonthData.xAxis || !res.data.AddMonthData.xAxis.data || !res.data.AddMonthData.xAxis.data.length;
            //         vm.$nextTick(vm.initEcharts);
            //         vm.$nextTick(vm.initEcharts2);
            //     }).catch(function (err) {
            //         if (err.message) {
            //             vm.$message.error(err.message);
            //         }
            //     });
        },
    },
    mounted:function(){
        this.fetchData();
    },
    computed: {
        computedEchartOps: function () {
            // return this.$$merge(this.$$deepClone(DefaultChartOption),this.$$deepClone(CustomChartOption[0]), this.chartData, true);
        },
        computedEchartOps2: function () {
            // return this.$$merge(this.$$deepClone(DefaultChartOption),this.$$deepClone(CustomChartOption[0]), this.chartData2, true);
        },
    },
}
</script>

<style>
  .company-data .container{
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        height: 100%;
    }
    .com-item {
        height: 50%;
        display: flex;
        flex-direction: column;
        /* height: 100px; */
    }
  
    .icon-box {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 30px; 
        height: 30px;
        border-radius: 8px;
        margin: 0 5px;
        background-color: #E5F5F5
    }
    .icon-box.month {
        /* background-image: url("../../../../../static/images/month.png"); */
        background-size: 15px 15px;
        background-repeat: no-repeat;
        background-position: center;
    }
    .icon-box .icon-img {
        width: 15px;
        height: 15px;
        border-radius: 2px;
        background: #32CED5;
    }
    .com-item .data-box {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        padding:2px ;
        /* background-color: #eef5ff; */
        border-radius: 5px;
    }
    .com-item .echart-boxs{
        flex: 4;
    }
    .com-item .data-box .number {
        font-size: 20px;
        font-weight: bold;
        padding: 5px;
    }
    .box-item{
        display: flex;
        align-items: center;
        padding: 5px;
    }
    .chart_stack-bar {
        width: 100%;
        height: calc( 100% - 44px);
    }
</style>