<template>
    <card class="project-situation" title="集团巡检/第三方评估">
        <template slot="right-title">
            <span @click="checkfilter(0)" class="filer-btn" :class="{'active': currentIdx === 0}">上季</span>
            <span @click="checkfilter(1)" class="filer-btn" :class="{'active': currentIdx === 1}" style="margin-left: 8px">本年</span>
        </template>
        <template>
            <div class="container">
                <div class="top-item">
                    <div class="item-title">
                        <span style="width: 120px">集团巡检综合得分</span>
                        <span>{{groupData.Score}}</span>
                        <span class="more-btn" @click="goGroupMore">更多></span>
                    </div>
                    <div class="item-content">
                        <div style="width: 40%">
                            <div style="display:flex; justify-content: space-between">
                                <span>管理行为</span>
                                <span>{{groupData.ManagementBehaviorScore}}</span>
                            </div>
                        </div>
                        <div style="width: 40%">
                            <div style="display:flex; justify-content: space-between">
                                <span>质量风险</span>
                                <span>{{groupData.QualityRiskScore}}</span>
                            </div>
                        </div>
                    </div>
                    <div class="item-content">
                        <div style="width: 40%">
                            <div style="display:flex; justify-content: space-between">
                                <span>安全文明</span>
                                <span>{{groupData.SafeCivilizedScore}}</span>
                            </div>
                        </div>
                        <div style="width: 40%">
                            <div style="display:flex; justify-content: space-between">
                                <span>安全事故</span>
                                <span>{{groupData.SafetyIncidentScore}}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <hr>
                <div class="bottom-item">
                    <div class="item-title">
                        <span style="width: 120px">第三方评估综合得分</span>
                        <span>{{thirdData.Score}}</span>
                        <span class="more-btn" @click="goThirdMore">更多></span>
                    </div>
                    <div class="item-content">
                        <div style="width: 40%">
                            <div style="display:flex; justify-content: space-between">
                                <span>实测合格率</span>
                                <span>{{thirdData.MeasuredPassRateScore}}</span>
                            </div>
                        </div>
                        <div style="width: 40%">
                            <div style="display:flex; justify-content: space-between">
                                <span>质量风险</span>
                                <span>{{thirdData.QualityRiskScore}}</span>
                            </div>
                        </div>
                    </div>
                    <div class="item-content">
                        <div style="width: 40%">
                            <div style="display:flex; justify-content: space-between">
                                <span>安全文明</span>
                                <span>{{thirdData.SafeCivilizedScore}}</span>
                            </div>
                        </div>
                        <div style="width: 40%">
                            <div style="display:flex; justify-content: space-between">
                                <span>功能性试验</span>
                                <span>{{thirdData.FunctionalTestScore}}</span>
                            </div>
                        </div>
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
            groupData: {},
            thirdData: {},
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
        goGroupMore: function() {
            console.info('goGroupMore')
            var content = '/pages/em/InspectionManageControl/InspectionManage/InspectionManage.html?layer=1&menuId=layer&stageId=' + this.structId+'&insType=0'
                layer.open({
                    type: 2,
                    title: ["详情"],
                    shade: 0.001,
                    area: ['100%', '100%'],
                    resize: false,
                    content: content
                });
        },
        goThirdMore: function(){
            console.info('goThirdMore')
            // pages/em/thirdPartyEvaluationControl/checkEvalResult/checkEvalResult.html?menuId=38A3616A-1846-465A-8189-BF3B13F4AF17
             var content = '/pages/em/thirdPartyEvaluationControl/checkEvalResult/checkEvalResult.html?layer=1&menuId=layer&stageId=' + this.structId+'&assessType=1'
                layer.open({
                    type: 2,
                    title: ["详情"],
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
            // this.$$get('/api/engineeringReportBoard/groupQualityInspection', subData)
            // .then(function (res) {
            //     vm.groupData = res.data
            // }).catch(function (err) {
            //     if (err.message) {
            //         vm.$message.error(err.message);
            //     }
            // });
            // this.$$get('/api/engineeringReportBoard/thirdParityAssess', subData)
            // .then(function (res) {
            //     vm.thirdData = res.data
            // }).catch(function (err) {
            //     if (err.message) {
            //         vm.$message.error(err.message);
            //     }
            // });
        },
    },
    created: function() {
        this.fetchData();
    },
    mounted:function(){
        
    },
}
</script>

<style>
.filer-btn { 
    color: #324057;
}
.active {
    color: #388D91;
}
.more-btn {
    color: #388D91;
    cursor: pointer;
}
.item-title {
    display: flex;
    justify-content: space-between;
}
.item-content {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
}
</style>