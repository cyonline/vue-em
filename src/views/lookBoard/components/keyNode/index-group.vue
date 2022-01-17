<template>
    <card class="keyNode" title="里程碑节点"  @do-more="doMore">
        <div slot="right-title"> 更多</div>
        <div class="left">
            <div ref="echart" class="chart_stack-bar"></div>
            <img src="/static/images/echart-bg.png" id="bg_img" style="display:none" />
        </div>
        <div class="right">
            <div class="r-item"><span>节点总数</span><span>{{TotalCount}}</span></div>
            <div class="r-item"><span>逾期未完成节点数</span><span>{{NoCompleteCount}}</span></div>
            <div class="r-item"><span>逾期未完成重要节点数</span><span>{{NoCompleteKeyCount}}</span></div>
        </div>
    </card>
</template>
<script>
import card from '@/views/lookBoard/components/common/card.vue';
// import data from '@/views/lookBoard/components/keyNode/data.js';
var value = 0, // 值，0~1之间
startAngle = 225, // 开始角度
endAngle = -45, // 结束角度
splitCount = 50, // 刻度数量
pointerAngle = (startAngle - endAngle) * (1 - value) + endAngle; // 当前指针（值）角度
var DefaultChartOption = {
    series: [
        {
            type: 'gauge',
            radius: '90%',
            startAngle: pointerAngle,
            endAngle: endAngle,
            splitNumber: 1,
            axisLine: {
                show: false,
                lineStyle: {
                    width: 3,
                    opacity: 0
                }
            },
            title: { show: false },
            detail: {
                backgroundColor: '#fff',
                width: '60%',
                lineHeight: 25,
                height: 10,
                borderRadius: 8,
                offsetCenter: [0, '-15%'],
                valueAnimation: true,
                formatter: function (value) {
                    return '{a|完成率}' +'\n'+'{value|' +  (value*100).toFixed(1)+ '%'+ '}';
                },
                rich: {
                    value: {
                        fontSize: 40,
                        fontWeight: 'normal',
                        color: '#333'
                    },
                    a: {
                        fontSize: 14,
                        color: '#666',
                        padding:[0,0,30,0]
                    }
                }
                    
            },
            splitLine: { show: false },
            axisTick: {
                length: 20,
                splitNumber: Math.ceil((1 - value) * splitCount),
                lineStyle: {
                    color: '#ddd',
                    width: 3
                }
            },
            axisLabel: { show: false },
            pointer: { show: false },
            itemStyle: {},
            
            data: [
                {
                    value: value,
                    name: 'test gauge'
                }
            ]
        },
        {
            type: 'gauge',
            radius: '90%',
            startAngle: startAngle,
            endAngle: pointerAngle,
            splitNumber: 1,
            axisLine: {
                show: false,
                lineStyle: {
                    width: 3,
                    opacity: 0
                }
            },
            title: { show: false },
            detail: { show: false },
            splitLine: { show: false },
            axisTick: {
                length: 20,
                splitNumber: Math.ceil(value * splitCount),
                lineStyle: {
                    // color: {
                    //   image: document.getElementById('bg_img'),
                    //   repeat: 'no-repeat'
                    // },
                    color: '#ddd',
                    width: 3
                }
            },
            axisLabel: { show: false },
            pointer: { show: false },
            itemStyle: {},
            data: [
                {
                    value: value,
                    name: 'test gauge'
                }
            ]
        },
        
        ]
};
export default {
    name:'keyNode',
    data:function(){
        return {
            data:{},
            sectionOptions:[],
            sectionId: '',
            nodeData:[],
            echartIns: null,
            chartData: {},
            NoCompleteCount:0,
            NoCompleteKeyCount:0,
            TotalCount:0,
        }
    },
    components:{
        'card':card,
    },
    props:{
        // 层级(1.集团，2.公司，3.项目)
        hierarchyType: {
            type: Number|String,
            required: false,
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
    methods: {
        //格式化时间
        formatDate: function(date) {
            if (!date) {
                return "--";
            }
            var splitStr = "";
            if (date.indexOf("T") > -1) {
                splitStr = "T";
            } else if (date.indexOf(" ") > -1) {
                splitStr = " ";
            }
            return date.split(splitStr)[0];
        },
        getNodeData:function(){
            var _this = this;
            
        },
        /**
         * 更新和初始化echart
         */
        initEcharts: function () {
            var self = this;
            console.info('computedEchartOps',this.computedEchartOps)
            // if (!this.echartIns) {
            //     var echartIns = window.echarts.init(this.$refs.echart);
            //     // console.info(this.computedEchartOps)
            //     echartIns.setOption(this.computedEchartOps);
            //     echartIns.__INITED__ = true;
            //     this.echartIns = echartIns;
            // } else {
            //     this.echartIns.setOption(this.computedEchartOps, true);
            // }
        },
        fetchData: function () {
            var vm = this;
            var subData = {
                hierarchyType: this.hierarchyType,
                commonId: this.structId,
            };
            // this.$$get('/api/engineeringReportBoard/milestoneNodeInfo', subData)
            //     .then(function (res) {
            //         console.info('res',res)
            //         var value = res.data.CompleteRate/100;
            //         vm.NoCompleteCount = res.data.NoCompleteCount;
            //         vm.NoCompleteKeyCount = res.data.NoCompleteKeyCount;
            //         vm.TotalCount = res.data.TotalCount;
            //         pointerAngle = (startAngle - endAngle) * (1 - value) + endAngle;
            //         vm.chartData = {
            //             series: [{
            //                 startAngle: pointerAngle,
            //                 axisTick: {
            //                     splitNumber: Math.ceil((1 - value) * splitCount),
            //                 },
            //                 data: [{
            //                     value: value
            //                 }]
            //             },{
            //                 endAngle: pointerAngle,
            //                 axisTick: {
            //                     splitNumber: Math.ceil(value * splitCount),
            //                     lineStyle: {
            //                         color: {
            //                         image: document.getElementById('bg_img'),
            //                         repeat: 'no-repeat'
            //                         },
            //                     }
            //                 },
            //                 data: [{
            //                     value: value
            //                 }]
            //             }]
            //         };
            //         vm.$nextTick(vm.initEcharts);
            //     }).catch(function (err) {
            //         if (err.message) {
            //             vm.$message.error(err.message);
            //         }
            //     });
            
        },
        doMore:function(){
            var that =this
            var stageId = ''
            if(!that.structId){
                stageId = '1'
            }else{
                stageId =that.structId
            }
            var content = '../../../../pages/em/milestoneNodeInfoReport/milestoneNodeInfoReport.html?hierarchyType='+that.hierarchyType+'&stageId=' + stageId
                layer.open({
                    type: 2,
                    title: ["查看详情"],
                    shade: 0.001,
                    area: ['100%', '100%'],
                    resize: false,
                    content: content
                });
        },
    },
    mounted:function() {
        this.fetchData();
        this.initEcharts();
    },
    watch:{
        hierarchyType: function () {
            this.fetchData();
        },
        structId: function () {
            this.fetchData();
        },
    }
}
</script>
<style >
    .keyNode{
        overflow: hidden;
    }
    .keyNode .left{
        position: relative;
        width: 300px;
        height: 100%;
        float:left;
    }
    .keyNode .chart_stack-bar {
        position: absolute;
        top: -10px;
        width: 300px;
        height: 300px;

    }
    .keyNode .right{
        float:left;
        width: calc(100% - 300px);
        padding: 1vw;
    }
    .keyNode .right .r-item{
        margin: 20px;
        font-size: 16px;
        display: flex;
        justify-content: space-between;
    }
    .keyNode .right .r-item span{

    }
</style>