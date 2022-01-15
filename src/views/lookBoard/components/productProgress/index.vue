<template>
    <card class="productProgress" title="项目生产进度" @do-more="doMore">
        <div slot="right-title"> 更多</div>
        <div class="filter">
            <div class="filter-item" v-if="hierarchyType!=3">
                <span class="label">项目名称</span>
                <span class="value">
                    <tree-select-corp v-if="hierarchyType==1" v-model="stageId" :type="'stage'" :change="clickProTree" :set-node-disabled="isCanChoose" project-status="1"></tree-select-corp>
                    <tree-select v-if="hierarchyType==2" 
                        :data="projectData" 
                        :cur-key="stageId" node-key="Id" 
                        :change="clickProTree" :on-all="false" 
                        :props="projectTreeDataModel" 
                        :expand-all="false" 
                        :expanded="openProjectTree" project-status="1"></tree-select>
                    <div class="select-input"></div>
                    <div class="select-tip" v-if="!!stageName">
                        已选：{{stageName}}
                    </div>
                </span>
                
            </div>
            <div class="filter-item">
                <span class="label">楼栋</span>
                <span class="value">
                    <el-select v-model="buildingIdsArr" multiple @change="buildingChange" placeholder="" size="small">
                        <el-option
                        v-for="item in buildingOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item">
                        </el-option>
                    </el-select>
                    <div class="select-input">
                        <span class="select-item">{{selectedBuildingStr}}</span>
                        
                    </div>
                    <div class="select-tip" v-if="!!selectedBuildingStr">
                        已选：{{selectedBuildingStr}}
                    </div>
                </span>
                
            </div>
            <div class="filter-item progress">
                <span class="label">施工进度</span>
                <span class="value">
                    <span class="select-item">{{constructData.ConstructionSchedule||'--'}}</span>
                    <div class="progress-tip" v-if="!!constructData.ConstructionSchedule">{{constructData.ConstructionSchedule}}</div>
                </span>
                
            </div>
            <div class="filter-item">
                <span class="label">进度更新时间</span>
                <span class="value">{{constructData.ProgressUpdateTime|formatTime}}</span>
            </div>    
        </div>
        <div class="content">
            <div class="right">
                <div class="behavior-box">
                    <div class="left">
                        <!-- <span class="no-border"></span> -->
                        <span v-for="item in progressData.Floors" :key="item"><i>{{item}}</i></span>
                        <span class="no-border"></span>
                    </div>
                    <div class="behavior" v-for="(item,i) in progressData.BuildData" :key="i" >
                        <span class="house" :class="!v.FloorId?'noFloor':v.IsFinish?'finished':'nofinish'" 
                            v-for="(v,key) in item.FinishData " 
                            :key="key"><i>{{v.FinishDate|formatTime('mm-dd')}}</i>
                            <div class="house-tip">{{item.BuildingName}}</div>
                            </span>
                            
                        <div class="behaviorName">{{item.BuildingName}}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="mark">
            <span class="mark-block"></span><span class="mark-text">系统记录验收进度</span>
        </div>
    </card>
</template>
<script>
import card from '@/views/lookBoard/components/common/card.vue';
// import data from '@/views/lookBoard/components/productProgress/data.js';

export default {
    name:'productProgress',
    data: function(){
        return {
            // data:data,
            stageId:'',
            stageName:'',
            buildingOptions:[
                {'label':'全部','value':''}
            ],
            buildingIdsArr: [],
            buildingIds:'',
            progressData:{
                Floors:[],
                BuildData:[]
            },
            selectedBuilding:[],
            selectedBuildingStr:'全部',
            constructData:{},
            projectData:[],
            projectTreeDataModel: {
                label: "Name",
                children: "ChildNodes"
            },
            openProjectTree:[],
            timer:null,
            showBuildingName:false,
        }
    },
    components:{
        'card':card,
    },
    filters:{
        formatTime:function(date,f){
            var newDate = '';
            newDate = date&&date.split('T')[0] || '--'
            
            if(f== 'mm-dd'){ 
                var m = new Date(newDate).getMonth()+1;
                var d = new Date(newDate).getDate();
                newDate = date?m+'-'+d:''
            }
            return newDate
        }
    },
    props:{
        // 层级(1.集团，2.公司，3.项目)
        hierarchyType: {
            type: Number|String,
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
    },
    methods: {
        doMore:function(){
            console.info('更多生产进度,', this.structId)
            var content = '/web/em/productionProgressKanbanNew.html?layer=1&stageId=' + this.stageId
                layer.open({
                    type: 2,
                    title: ["生产进度看板"],
                    shade: 0.001,
                    area: ['100%', '100%'],
                    resize: false,
                    content: content
                });
        },
        clickProTree:function(node){
            console.info('node',node,node.Id);
            this.stageId = node.Id;
            this.stageName = node.Name;
        },
        isCanChoose:function(item){
            return item.Type!=3
        },
        getFirstNode:function(data){
            var o = null;
            var vm = this;
            (data || []).some(function(node) {
            if (node.Type === 3) { // Type  2项目 3分期
                o = node;
                vm.openProjectTree.push(node.Id);
                return true;
            }
            var children = node[vm.projectTreeDataModel.children];
            if (children && children.length) {
                o = vm.getFirstNode(children);
                if (o) {
                vm.openProjectTree.push(node.Id);
                return true;
                }
            }
            return false;
            });
            return o;
        },
        getProjectData: function() {
            var _this = this;
            _this.openProjectTree = [];
            $.request({
                url: '/project/porjectStageSection?projectStatus=1',
                type: "get",
                isLoad: true,
                data: {
                    companyId: _this.structId,
                    isContainSection: false,
                },
                success: function(data) {
                    _this.projectData = data;
                    var firstNode = _this.getFirstNode(data)||{};
                    console.info('firstNode',firstNode)
                    // _this.stageId = firstNode.Id||'';
                }
            });
            
        },
        buildingChange:function(data){
            // console.info('楼栋',data)
            if(!data) return;
            this.selectedBuilding = data.slice();
            this.selectedBuildingStr = '';
            this.buildingIds = '';
            this.selectedBuilding.forEach(function(ele,index,arr){
                if(!ele) return;
                this.selectedBuildingStr+=index==arr.length-1?ele.label:ele.label+',';
                this.buildingIds+=index==arr.length-1?ele.value:ele.value+',';
            },this)
            if(!this.buildingIds){
                this.selectedBuildingStr = '全部'
            }            
            this.getProgressData();
        },
        getBuildData: function() {
            var _this = this;
            
            // $.request({
            //     url: '/projectBuilding/getBuildings',
            //     type: "get",
            //     isLoad: true,
            //     data: {
            //         stageIds: _this.stageId,
            //         BuildingTypeIds:'add1efd2-92f2-41fa-9e44-9c0a00a1a077'
            //     },
            //     success: function(data) {
            //         _this.buildingOptions = data.map(function(ele){
            //             return {
            //                 label: ele.BuildingName,
            //                 value: ele.BuildingId,
            //             }
            //         });
            //         // console.log('_this.buildingOptions:', _this.buildingOptions)
            //     }
            // });
            
        },
        getProgressData: function(){
            var _this = this;
            // $.request({
            //     url: '/api/reportBoardManagementBehavior/reportBoardProductionProgress',
            //     type: "get",
            //     isLoad: true,
            //     data: {
            //         stageId: _this.stageId,
            //         buildingIds: _this.buildingIds,
            //     },
            //     success: function(data) {
            //         _this.progressData = data;
            //         // console.log('_this.getProgressData:',data)
            //     }
            // });
        },
        getConstructionSchedule:function(){
            var _this = this;
            // $.request({
            //     url: '/api/engineeringReportBoard/constructionSchedule',
            //     type: "get",
            //     isLoad: true,
            //     data: {
            //         stageId: _this.stageId,
            //     },
            //     success: function(data) {
            //         _this.constructData = data;

            //     }
            // });
        },
        getDefaultStage:function(){
            var _this = this;
            // $.request({
            //     url: '/api/reportBoardManagementBehavior/reportBoardProductionProgressStage',
            //     type: "get",
            //     isLoad: true,
            //     data: {
            //         hierarchyType:_this.hierarchyType,
            //         commonId: _this.structId,
            //     },
            //     success: function(data) {
            //         console.info('默认分期',data)
            //         _this.stageId = data?data.StageId:'';
            //     }
            // });
        }
    },
    mounted:function() {
        this.stageId = this.structId;
        if(this.hierarchyType==1){ // 集团默认置空，以便组件自动选取第一个分期
            // this.stageId = '';
            this.getDefaultStage();
        }
        if(this.hierarchyType==2){
            
            this.getProjectData();
            this.getDefaultStage();
        }
        
        this.getBuildData();
        this.getProgressData();
        this.getConstructionSchedule()
    },
    watch:{
        structId:function(n,o){
            // if(n==o) return;
            console.info('xxx',n)
            if(this.hierarchyType!=2){
                this.stageId = n;
            }
            
            if(this.hierarchyType==2){
                this.getProjectData();
                this.getDefaultStage();
            }
        },
        stageId:function(n){
            var _this = this;
            if(this.timer){
                clearTimeout(this.timer);
            }
            this.timer = setTimeout(function(){
                _this.getBuildData();
                _this.buildingIdsArr = [];
                _this.selectedBuilding = [];
                _this.selectedBuildingStr = '全部';
                _this.buildingIds = '';
                _this.getProgressData();
                _this.getConstructionSchedule()
            },1000)
            
        }
    }
}
</script>
<style>
    .productProgress .filter .el-select .el-input .el-icon-caret-top{
        width:15px!important;
        
    }
    .productProgress .filter .el-input__icon + .el-input__inner{
        padding-right:15px!important;
        border:0;
        padding: 0;
        font-size: 16px;
    }
    .productProgress .filter .el-select__tags{
        display: none!important;

    }
</style>
<style scoped>
    .productProgress .filter{
        display: flex;
        justify-content: space-around;
    }
    .productProgress .filter .filter-item{
        display: block;
        width: 100%;
        height: 70px;
    }
    .productProgress .filter .filter-item .label{
        display: block;
        line-height: 30px;
    }
    .productProgress .filter .filter-item .value{
        display: block;
        width: 100%;
        max-width: 120px;
        font-size: 16px;
        line-height: 30px;
        position: relative;
        
    }
    .productProgress .filter .filter-item.progress .select-item{
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: block;
        width: 100%;
        height: 35px
    }
    .productProgress .filter .filter-item.progress .value:hover  .progress-tip{
        display: block;
    }
    .productProgress .filter .filter-item.progress .progress-tip{
        /* display: none; */
        position: absolute;
        top: 35px;
        left:0;
        width: 200px;
        font-size: 14px;
        background: #fff;
        display: none;
        box-shadow: 0px 1px 4px #ccc;
        padding:5px 10px;
        z-index: 999;
    }
    .productProgress .content{
        width: 100%;
        height: calc( 100% - 96px);
        display: flex;
    }
    .productProgress .content .left{
            /* width: 60px; */
            width: 30px;
            height: 100%;
    }
    .productProgress .content .left span{
        display: inline-block;
        font-size: 12px;
        width: 30px;
        height: 16px;
        line-height: 14px;
        border:1px solid #ddd;
        border-radius: 3px;
        text-align: center;
        /* margin:1px 0; */
    }
    .productProgress .content .left span i{
        display: inline-block;
        font-size: 12px;
        font-style: normal;
        width:100%;
        height: 100%;
        transform: scale(0.8);
    }
    .productProgress .content .left span.no-border{
        border:0;
    }
            
    .productProgress .content .right{
        display: inline-block;
        width: 100%;
        height: 100%;
        position: relative;
        /* overflow-x: scroll; */
    }  
    .productProgress .content .right .behavior-box{
        display: flex;
        flex-wrap: nowrap;
        width: auto;
        /* position: absolute; */
        bottom: 0;
    }
    .productProgress .content .right .behavior-box .behavior{
        width: 40px;
        min-width: 29px;
        height: 100%;
        margin-left: 8px;
        /* overflow: hidden; */
    }
    .productProgress .content .right .behavior-box .behavior span{
        display: inline-block;
        font-size: 12px;
        float:left;
        width: 100%;
        height: 16px;
        text-align: center;
        /* line-height: 18px; */
        color: #fff;
        background: #2DB1B8;
        border:1px solid #fff;
        border-radius: 3px;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin:1px 0;
    }
    .productProgress .content .right .behavior-box .behavior span i{
        display: inline-block;
        font-size: 12px;
        font-style: normal;
        width:100%;
        height: 100%;
        transform: scale(0.8);
    }
    .productProgress .content .right .behavior-box .behavior .house{
        position: relative;
    }
    .productProgress .content .right .behavior-box .behavior .house:hover .house-tip{
        display:inline-block;
    }
    .productProgress .content .right .behavior-box .behavior .house .house-tip{
        position: absolute;
        left:40px;
        top:-2px;
        border:1px solid #aaa;
        background: #fff;
        display: none;
        color:#000;
        z-index:99;
    }
    .productProgress .content .right .behavior-box .behavior .finishedRate{
        background: #fff;
        color: #000;
    }
    .productProgress .content .right .behavior-box .behavior .finished{
        cursor: pointer;
        border:1px solid #2DB1B8;
    }
    .productProgress .content .right .behavior-box .behavior .behaviorName{
        background:#fff;
        color: #000;
    }
    .productProgress .content .right .behavior-box .behavior .nofinish{
        background:#fff;
        border:1px solid #ddd;
    }
    .productProgress .content .right .behavior-box .behavior .noFloor{
        background:#FFF;
        color:#fff;
    }
    .productProgress .content .right{
        overflow: hidden;
    }
    .productProgress .content .right:hover{
        overflow-x:auto;
        overflow-y:auto;
        width: 100%;
        height: 100%;
    }
    .productProgress .content .right::-webkit-scrollbar{
        height: 10px;
        width: 10px;
        background-color: transparent;
        position: absolute;
    }

    .productProgress .content .right::-webkit-scrollbar-track {
        border-radius: 10px;
    } /* 滚动条的滑轨背景颜色 */

    .productProgress .content .right::-webkit-scrollbar-thumb {
        border-radius: 10px;
        background-color: #ccc;
    } /* 滑块颜色 */
    .productProgress .mark{
        text-align:center;
        margin: 10px;
    }
    .productProgress .mark .mark-block{
        display: inline-block;
        width: 40px;
        height:25px;
        background: #2DB1B8;
    }
    .productProgress .mark .mark-text{
        vertical-align: top;
        margin-left: 5px;
    }
    .select-input{
        position: absolute;
        top:0;
        width: calc(100% - 15px);
        height: 35px;
        padding:2px;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;

    }
    .select-tip{
        position: absolute;
        top:35px;
        width: 200px;
        font-size: 14px;
        background: #fff;
        display: none;
        box-shadow: 0px 1px 4px #ccc;
        padding:5px 10px;
        z-index: 999;
    }
    .select-input:hover + .select-tip{
        display: block;
    }
</style>