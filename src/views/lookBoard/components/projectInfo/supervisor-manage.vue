<template>
    <card class="project-situation" title="监理管理">
        <template>
            <div slot="right-title" @click="doMore">更多></div>
            <div class="container">
                <div class="filter-type" style="display: flex">
                    <div class="filter-type-item">
                        <div class="type-item">月度管理行为记录数</div>
                        <div class="type-item" style="margin-top: 8px">{{supData.MonthlyManagementBehaviorCount}}次</div>
                    </div>
                    <div class="filter-type-item">
                        <div class="type-item">周管理行为记录数</div>
                        <div class="type-item" style="margin-top: 8px">{{supData.WeekManagementBehaviorCount}}次</div>
                    </div>
                </div>
                <div class="hr"></div>
                <div class="filter-title">
                    <span @click="goMore2" class="more-btn">更多></span>
                    <span @click="checkfilter(3)" :class="{'active': currentIdx === 3}">本年</span>
                    <span @click="checkfilter(2)" :class="{'active': currentIdx === 2}">本季</span>
                    <span @click="checkfilter(1)" :class="{'active': currentIdx === 1}">本月</span>
                    <span @click="checkfilter(0)" :class="{'active': currentIdx === 0}">昨日</span>
                </div>
                <div class="filter-content">
                    <div class="item-box">
                        <span class="til">送阅及时率</span>
                        <div class="num">
                            <span>{{supData.TimelyDeliveryRate}}%</span>
                            <div class="f-r">
                                <canvas id="bgCanvas1" width="20" height="20"></canvas>
                                <canvas id="myCanvas1" width="20" height="20"></canvas>
                            </div>
                        </div>
                        <span class="til">项目审阅率</span>
                        <div class="num">
                            <span>{{supData.TotalReadRate}}%</span>
                            <div class="f-r">
                                <canvas id="bgCanvas2" width="20" height="20"></canvas>
                                <canvas id="myCanvas2" width="20" height="20"></canvas>
                            </div>
                        </div>
                    </div>
                    <div class="item-box">
                        <span class="til">送阅完成率</span>
                        <div class="num">
                            <span>{{supData.PendingCompletionRate}}%</span>
                             <div class="f-r">
                                <canvas id="bgCanvas3" width="20" height="20"></canvas>
                                <canvas id="myCanvas3" width="20" height="20"></canvas>
                            </div>
                        </div>
                        <span class="til">日志异常数</span>
                        <div class="num">{{supData.AbnormalLogSummaryCount}}次</div>
                    </div>
                </div>
            </div>
        </template>
    </card>  
</template>

<script>
import card from "@/views/lookBoard/components/common/card.vue"
export default {
    name: 'supervisor-manage',
    data: function() {
        return {
            supData: {},
            currentIdx: 0,
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
        currentIdx: function() {
            this.fetchData();
        }
    },
    methods:{
        doMore:function(){
            var content = '/web/em/supervisorManage.html?layer=1&stageId=' + this.structId
            layer.open({
                type: 2,
                title: ["监理日志管理"],
                shade: 0.001,
                area: ['100%', '100%'],
                resize: false,
                content: content
            });
            // var content = '/web/em/supervisorManage.html?layer=1&stageId=' + this.structId
            // layer.open({
            //     type: 2,
            //     title: ["监理日志管理"],
            //     shade: 0.001,
            //     area: ['100%', '100%'],
            //     resize: false,
            //     content: content
            // });
        }, 
        goMore2: function() {
                var content = '/web/em/ReportForm.html?layer=1&stageId=' + this.structId
                layer.open({
                    type: 2,
                    title: ["统计"],
                    shade: 0.001,
                    area: ['100%', '100%'],
                    resize: false,
                    content: content
                });

        },
        checkfilter: function(val) {
            this.currentIdx = val
        },
        fetchData: function () {
            var vm = this;
            var subData = {
                hierarchyType: this.hierarchyType,
                commonId: this.structId, // 下拉选择项(公司Id或项目Id)
                type: this.currentIdx
            };
            // this.$$get('/api/engineeringReportBoard/supervisionManagement', subData)
            // .then(function (res) {
            //     vm.supData = res.data
            //     vm.createSector({
            //         dom:'#myCanvas1',
            //         r:10,
            //         ang: res.data.TimelyDeliveryRate * 360 * 0.01,
            //         color:"#388D91"
            //     })
            //     vm.createSector({
            //         dom:'#myCanvas2',
            //         r:10,
            //         ang: res.data.TotalReadRate * 360 * 0.01,
            //         color:"#388D91"
            //     })
            //     vm.createSector({
            //         dom:'#myCanvas3',
            //         r:10,
            //         ang: res.data.PendingCompletionRate * 360 * 0.01,
            //         color:"#388D91"
            //     })
            // }).catch(function (err) {
            //     if (err.message) {
            //         vm.$message.error(err.message);
            //     }
            // });
        },
        createSector: function(options){
            // let {dom,r,x=r,y=r,ang,color} = options;
            var dom = options.dom
            var r = options.r
            var x = options.r
            var y = options.r
            var ang = options.ang
            var color = options.color
            // console.info(dom,x,y)
            var c=document.querySelector(dom);
            c.width = 2*r;  // 重新给画布设置宽高，相当于清空画布内容
            c.height = 2*r;
            var ctx=c.getContext("2d");
            
            ctx.beginPath();
            ctx.translate(x, y); // 重新映射画布起始点位置
            ctx.moveTo(0,0) // 从圆心开始画线
            ctx.arc(0,0,r,-0.5*Math.PI,-0.5*Math.PI+0.5*ang/90*Math.PI); // 画弧线
                            
            ctx.closePath();
            ctx.fillStyle = color;
            ctx.fill();
            ctx.strokeStyle="transparent"
            ctx.stroke();
            return ctx;
        },
        circleInit:function(){
            this.createSector({
                dom:'#bgCanvas1',
                r:10,
                ang: 360,
                color:"#EBF3F4"
            })
            this.createSector({
                dom:'#bgCanvas2',
                r:10,
                ang: 360,
                color:"#EBF3F4"
            })
            this.createSector({
                dom:'#bgCanvas3',
                r:10,
                ang: 360,
                color:"#EBF3F4"
            })
        }
    },
    mounted:function(){
        this.fetchData();
        this.circleInit();
    },
}
</script>

<style>
.container .filter-type {
    display: flex;
}
.container .filter-type .filter-type-item {
    width: 50%;
}
.type-item {
    width: 100%; 
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow:ellipsis;
}
.container .filter-title{
    display: flex;
    flex-direction: row-reverse;
    margin-bottom: 10px;
}
.container .filter-title span {
    margin-left: 5px;
    cursor: pointer;
}
.active {
    color: #388D91;
}
.container .filter-title .more-btn {
    color: #388D91;
    margin-left: 20px;
}
.container .filter-content {
    display: flex;
    justify-content: space-between;
}
.container .filter-content .item-box {
    width: 50%;
}
.til {
    display: block;
    width: 100%;
    text-align: center;
    margin-top: 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow:ellipsis;
}
.num {
    width: 50px;
    height: 30px;
    margin: 8px auto 0;
    font-size: 14px;
}
.f-r {
    float: right;
    position: relative;
}
#bgCanvas1,#myCanvas1,#bgCanvas2,#myCanvas2,#bgCanvas3,#myCanvas3{
    position: absolute;
    left:0;
    top:0;
}
.hr{
    height: 0;
    margin-top: 10px;
    margin-bottom: 10px;
    border: 0;
    border-top: 1px solid #eeeeee;
}
</style>