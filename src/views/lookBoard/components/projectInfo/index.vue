<template>
    <card class="project-situation" title="项目概况" @do-more="doMore">
        <!-- <div slot="right-title">更多></div> -->
        <template>
            <div class="container">
                <div class="info"><span class="label">项目名称</span><span class="value">{{data.ProjectName||'--'}}</span></div>
                <div class="info"><span class="label">曾用名</span><span class="value">{{data.ProjectOldName||'--'}}</span></div>
                <div class="info"><span class="label">容积率</span><span class="value">{{data.VolumeRate||'--'}}</span></div>
                <div class="info"><span class="label">占地面积</span><span class="value">{{data.LandUseArea||'--'}}m²</span></div>
                <div class="info"><span class="label">建筑面积</span><span class="value">{{data.BuildingArea||'--'}}m²</span></div>
                <div class="info"><span class="label">建筑层数</span><span class="value">{{data.BuildingStoreys||'--'}}</span></div>
                <div class="info"><span class="label">建设类型</span><span class="value">{{data.BuildingType||'--'}}</span></div>
                <div class="info"><span class="label">建设单位</span><span class="value">{{data.ConstructionUnit||'--'}}</span><span class="valueMore">{{data.ConstructionUnit}}</span></div>
                <div class="info"><span class="label">监理单位</span><span class="value" >{{data.SupervisorSupplierName||'--'}}</span><span class="valueMore">{{data.SupervisorSupplierNameStr}}</span></div>
                <div class="info"><span class="label">勘察单位</span><span class="value">{{data.SurveyUnit||'--'}}</span><span class="valueMore">{{data.SurveyUnit}}</span></div>
                <div class="info"><span class="label">施工单位</span><span class="value">{{data.ProgressUnit||'--'}}</span><span class="valueMore">{{data.ProgressUnit}}</span></div>
                <div class="info"><span class="label">设计单位</span><span class="value">{{data.DesignyUnit||'--'}}</span><span class="valueMore">{{data.DesignyUnit}}</span></div>

            </div>
        </template>
    </card>  
</template>

<script>
import card from "@/views/lookBoard/components/common/card.vue"
export default {
    name:'project-info',
    data:function(){ 
        return{

        }
    },
    props:{
        // 层级(1.集团，2.公司，3.项目)
        hierarchyType: {
            type: Number|String,
            required: false,
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
        data: {
            type:Object,
            required: true,
            default: function(){
                return {}
            }
        }
    },
    components:{
        'card':card
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
        }
    },
    created:function(){

    },
    mounted:function(){
        
    },
}
</script>
<style>
    .project-situation .container{
        /* padding-left: 10px;
        margin-top: 10px; */
    }
    .container .info{
        height: 30px;
        line-height: 30px;
        overflow: hidden;
    }
    .container .info .label{
        display: inline-block;
        width: 54px;
        text-align-last: justify;
        margin-right:15px;
        float:left;
    }
    .container .info .value{
        display: inline-block;
        width: calc(100% - 80px);
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        float:left;
        position: relative;
    }
    .container .info .valueMore{
        position: absolute;
        display: none;
        left: 100px;
        width: 200px;
        z-index: 99;
        line-height: 1.5;
        padding: 5px;
        background:#fff;
        border:1px solid #ccc;
        cursor: pointer;
    }
    .container .info:hover .valueMore{
        display: block;
        
    }
</style>