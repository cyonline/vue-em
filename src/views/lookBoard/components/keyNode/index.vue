<template>
    <card class="keyNode" title="里程碑节点">
        <div slot="right-title">
            <div class="keyNode-select" style="width:80px;">
                <el-select v-model="sectionId" placeholder="请选择" size="mini">
                    <el-option
                    v-for="item in sectionOptions"
                    :key="item.SectionId"
                    :label="item.SectionName"
                    :value="item.SectionId">
                    </el-option>
                </el-select>
            </div>
        </div>
        <div class="info">
            <div class="info-item">
                <span class="label">开工日期</span>
                <span class="value">{{formatDate(data.PlanStartTime)}}</span>
            </div>
            <div class="info-item">
                <span class="label">交楼时间</span>
                <span class="value">{{formatDate(data.PlanEndTime)}}</span>
            </div>
            <div class="info-item">
                <span class="label">已施工天数</span>
                <span class="value">{{data.WorkDay}}</span>
            </div>
            <div class="info-item">
                <span class="label">总工期天数</span>
                <span class="value">{{data.TotalDay}}</span>
            </div>
        </div>
        <div class="">
            <process-flow :process-data="nodeData"></process-flow>
        </div>
    </card>
</template>
<script>
import card from '@/views/lookBoard/components/common/card.vue';
import processFlow from '@/views/lookBoard/components/keyNode/process-flow.vue';
// import data from '@/views/lookBoard/components/keyNode/data.js';

export default {
    name:'keyNode',
    data:function(){
        return {
            data:{},
            sectionOptions:[],
            sectionId: '',
            nodeData:[],
        }
    },
    components:{
        'card':card,
        'processFlow':processFlow
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
            $.request({
                url: '/api/engineeringReportBoard/milestoneNode',
                type: "get",
                isLoad: true,
                data: {
                    sectionId: _this.sectionId,
                },
                success: function(data) {
                    console.info('节点数据',data)
                    _this.data = data;
                    _this.nodeData = data.MilestoneNodeWorkItemList||[];
                }
            });
        },
        getSection: function(){
            var _this = this;
            $.request({
                url: '/projectBuilding/getSections',
                type: "get",
                isLoad: true,
                data: {
                    stageId: _this.structId,
                },
                success: function(data) {
                    _this.sectionOptions = data;
                    // console.log('_this.标段:', data)
                    _this.sectionId = !!data.length?data[0].SectionId:'';
                    // _this.getNodeData();
                }
            });
            
        }
    },
    mounted:function() {
        this.getSection();
    },
    watch:{
        sectionId:function(n){
            this.getNodeData();
        },
        structId:function(n){
            this.getSection();
        }
    }
}
</script>
<style scoped>
    .keyNode .info{
        display: flex;
        margin-bottom: 40px;
    }
    .keyNode .info .info-item{
        display: inline-block;
        width: 25%;
        /* height: 100px; */
    }
    .keyNode .info .info-item>span{
        display: block;
        line-height: 30px;
    }

</style>
<style >
    .keyNode-select .el-select .el-input .el-icon-caret-top{
        width:15px!important;
    }
    .keyNode-select .el-input__icon + .el-input__inner{
        padding-right:15px!important;
        border:0;
    }
    /* .el-select .el-input__inner {
        margin-ri
    } */
</style>