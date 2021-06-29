<template>
    <div id="table_container">
        <div class="tab-Layer" v-if="tabShow">
            <div class="tab-section">
                <el-radio-group v-model="currentTabName">
                    <el-radio-button  
                        v-for="(section, index) in sectionList" 
                        :key="section.name || index" 
                        :label="section.name" @click.stop.native="tabChange(section)"></el-radio-button>
                </el-radio-group>
            </div>
        </div>
        <div class="table-Layer">
            <div class="table-box" v-for="(tableStandard, index) in currentTable" :key="tableStandard.id || index" :style="{width: computeWidth()}">
                <div class="title">
                    <h4>{{tableStandard.tableTitle}}</h4>
                    <span @click.stop="moreChange(tableStandard,index)">{{tableStandard.moreName}}
                        <i class="iconfont" :class="tableStandard.icon"></i>
                    </span>
                </div>
                <div class="stat-table">
                    <el-table stripe :data="table[tableStandard.id]" style="width: 100%">
                        <el-table-column 
                            v-for="(item, index) in tableStandard.items" 
                            :key="item.id || index" 
                            :type="item.type" 
                            :align="item.align" 
                            :width="item.width" 
                            :label="item.label" 
                            :prop="item.prop"
                            :formatter="item.formatter"
                            show-overflow-tooltip></el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
        <div class="layout-panel-b">
            <ul  class="input-control mb-0 pb-0 list-unstyled index-choose-list clearfix">
                <li>
                    <span>排序方式</span>
                    <el-select size="small" v-model="projectType" placeholder="请选择排序方式" @change="changeSort()">
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>

                </li>
                <li v-if="indexType == 0 || indexType == 1">
                    <span >年度</span>
                    <el-date-picker v-model="yearValue" type="year"   placeholder="请选择年度"></el-date-picker>
                </li>
                <li  v-if="indexType == 1">
                    <span>问题性质</span>
                    <el-select size="small" v-model="lightType" clearable placeholder="请选择问题性质" @change="changeSort()">
                        <el-option
                        v-for="item in requestData"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </li>
                <li>
                    <span>关键字</span>
                        <el-input 
                            placeholder="可按项目名称进行搜索" 
                            size="small" 
                            v-model="queryStr">
                        </el-input>
                </li>
                <li>
                    <el-button type="primary" @click="queryMoreData" size="small">搜索</el-button>
                </li>
            </ul>
            <div class="table-box" style="border-right: none" v-if="requestType == 0">
                <div class="stat-table">
                    <el-table stripe :data="currentCheckTable">
                        <el-table-column type="index" align="center" width="50" label="排名" show-overflow-tooltip>
                            <template scope="scope"><span>{{scope.$index+(pageIndex - 1) * pageSize + 1}} </span></template>
                        </el-table-column>
                        <el-table-column align="center" prop="StageName" label="项目名称" show-overflow-tooltip></el-table-column>
                        <el-table-column align="center" prop="SpecialCheckScore" label="专项检查得分" show-overflow-tooltip></el-table-column>
                        <el-table-column align="center" prop="AssessCheckScore" label="评估检查得分" show-overflow-tooltip></el-table-column>
                    </el-table>
                </div>
            </div>
            <div class="table-box" style="border-right: none" v-if="requestType == 1">
                <div class="stat-table">
                    <el-table stripe :data="currentCheckTable">
                        <el-table-column type="index" align="center" width="50" label="排名" show-overflow-tooltip>
                            <template scope="scope"><span>{{scope.$index+(pageIndex - 1) * pageSize + 1}} </span></template>
                        </el-table-column>
                        <el-table-column align="center" prop="SupplierName" label="合作单位" show-overflow-tooltip></el-table-column>
                        <el-table-column align="center" prop="questCnt" label="问题总数" show-overflow-tooltip></el-table-column>
                        <el-table-column align="center" prop="TimeCompeleteCntRate" label="整改率" show-overflow-tooltip></el-table-column>
                        <el-table-column align="center" prop="ResolveCountRate" label="及时整改率" show-overflow-tooltip></el-table-column>
                    </el-table>
                </div>
            </div>
            <div class="table-box" style="border-right: none" v-if="requestType == 2">
                <div class="stat-table">
                    <el-table stripe :data="currentCheckTable">
                        <el-table-column type="index" align="center" width="50" label="排名" show-overflow-tooltip>
                            <template scope="scope"><span>{{scope.$index+(pageIndex - 1) * pageSize + 1}} </span></template>
                        </el-table-column>
                        <el-table-column align="center" prop="StageName" label="项目名称" show-overflow-tooltip></el-table-column>
                        <el-table-column align="center" prop="QuestionRectifyRate" label="问题整改率" show-overflow-tooltip></el-table-column>
                        <el-table-column align="center" prop="QuestionCount" label="问题总数" show-overflow-tooltip></el-table-column>
                        <el-table-column align="center" prop="QuestionTimelyRate" label="及时整改率" show-overflow-tooltip></el-table-column>
                    </el-table>
                </div>
            </div>
            <div class="page-container" v-if="moreTotal !== 0">
                <el-pagination
                    :total="moreTotal"
                    :page-size="pageSize"
                    @current-change="pageChange"
                    :current-page.sync="pageIndex"
                    @size-change="handleSizeChange"
                    :page-sizes="[10, 20, 50, 100]"
                    layout="total, sizes, prev, pager, next, jumper">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import groupSort from '@/lookBoard/components/problem-stat/statStandard/group/sort.js' // 合作单位排名

export default {
    name: 'stat-table',
    data: function() {
        return {
            table: {},                               // key是table的标识，value是请求后的数据
            sectionList: [],
            currentTable: Array,
            currentTabName: '模拟验房统计',
            currentCheckTable: [],  //当前查看的更多的表格
            keyWord: "",
            pageIndex: 1,
            pageSize: 10,
            options: [],
            moreHierarchyType: {
                '1-1': 1,
                '2-1': 2,
                '3-1': 3
            },
            currentCheckTableStantard: "",
            moreTotal: 1,
            queryStr: "",
            requestType: "",
            requestData: [
                {
                    label:"轻微", 
                    value: 0
                },
                {
                    label:"一般", 
                    value: 1
                },
                {
                    label:"严重", 
                    value: 2
                }
            ],
            projectType: "",
            lightType: null,
            yearValue:'',
            indexType:null
        }
    },
    props: {
        tabShow: {
            type: Boolean,
            default: function() {
                return false;
            }
        },      
        showType: {
            type: String,   // 层级(1.集团，2.公司，3.项目) 次级(1.排名，2.检查，3.统计)
            default: function() {
                return '';
            }
        }, 
        permissions: {
            type: Function,
            required: true
        },
        itemId: {
            type: String,
        }
    },
    methods: {
        changeSort:function(){
            this.getMoreData(1);
        },
        tabChange: function(tab) {
            this.currentTable = tab.table;
            console.log(this.currentTable)
            this.currentTabName = tab.name;
            this.$emit('tabChange', tab);
        },
        queryMoreData: function () {
            this.keyWord = this.queryStr;
            this.getMoreData(1);
        },
        getMoreData: function(page, callback) {
            var vm = this;
            this.pageIndex = page;
            // if(this.indexType == 1){
            //     this.options = [
            //         {
            //             label:"问题总数", 
            //             value: 0
            //         },
            //         {
            //             label:"问题整改率", 
            //             value: 1
            //         },
            //         {
            //             label:"整改及时率", 
            //             value: 2
            //         }
            //     ]
            //     $.request({
            //         url: "/api/reportBoardDelive/supMore",
            //         type: "get",
            //         isLoad: true,
            //         data: {
            //             ReportBoardType: vm.moreHierarchyType[vm.showType],
            //             sortType: vm.projectType,
            //             CommonId: vm.itemId,
            //             pageIndex: vm.pageIndex,
            //             pageSize: vm.pageSize,
            //             keyWord: vm.keyWord
            //         },
            //         success: function (data, res) {
            //             if (res.Code === 0) {
            //                 console.log(".......................", data)
            //                 vm.currentCheckTable = data.Rows;
            //                 vm.currentCheckTable.forEach(function(item){
            //                     item.TimeCompeleteCntRate = item.TimeCompeleteCntRate + '%'
            //                     item.ResolveCountRate = item.ResolveCountRate + '%'
            //                 })
            //                 vm.moreTotal = data.Total;
            //                 if (typeof callback == "function") {
            //                     callback();
            //                 }
            //             } else {
            //                 vm.$message({
            //                     type: "warning",
            //                     message: res.Message
            //                 })
            //                 console.log(res.Message);
            //             }
            //         }
            //     })
            // }else 
            if(this.indexType == 0){
                this.options = [
                    {
                        label:"专项检查得分", 
                        value: 0
                    },
                    {
                        label:"评估检查得分", 
                        value: 1
                    },
                ]
                $.request({
                    url: "/api/reportBoardSpecialAssess/projectScoreRange",
                    type: "get",
                    isLoad: true,
                    data: {
                        "type" : vm.projectType,
                        "year": $.formatDateTime(vm.yearValue).split("-")[0],
                        "keyword": vm.queryStr,
                        "pageIndex":vm.pageIndex,
                        "pageSize": vm.pageSize
                    },
                    success: function (data, res) {
                        if (res.Code === 0) {
                            if(res.Data){
                                vm.currentCheckTable = res.Data.Rows;
                                vm.moreTotal = res.Data.Total;
                                if (typeof callback == "function") {
                                    callback();
                                }
                            }else{
                                vm.currentCheckTable = []
                                vm.moreTotal = 0
                            }
                            
                        } else {
                            vm.$message({
                                type: "warning",
                                message: res.Message
                            })
                            console.log(res.Message);
                        }
                    }
                })
            }else if(this.indexType == 1){
                this.options = [
                    {
                        label:"整改率", 
                        value: 0
                    },
                    {
                        label:"问题总数", 
                        value: 1
                    },
                    {
                        label:"及时整改率", 
                        value: 2
                    }
                ]
                var request = {
                    sort: vm.projectType,
                    keyWord: vm.queryStr,
                    year: $.formatDateTime(vm.yearValue).split("-")[0],
                    severity: vm.lightType,
                    pageIndex: vm.pageIndex,
                    pageSize: vm.pageSize
                }
                $.request({
                    url: "/api/reportBoardGeneral/reportBoardProjectQuestScore",
                    type: "get",
                    isLoad: true,
                    data: request,
                    success: function (data, res) {
                        if (res.Code === 0) {
                            vm.currentCheckTable = res.Data.Rows;
                            vm.moreTotal = res.Data.Total;
                            if (typeof callback == "function") {
                                callback();
                            }
                        } else {
                            vm.$message({
                                type: "warning",
                                message: res.Message
                            })
                            console.log(res.Message);
                        }
                    }
                })
            }
            
        },
        handleSizeChange: function (size) {
            console.log(size)
            this.pageSize = size;
            this.getMoreData(1);
        },
        pageChange: function (page) {
            this.getMoreData(page);
        },
        moreChange: function(tableObj,index) {
            this.projectType = 0
            // new Date().getFullYear()
            this.yearValue = new Date()
            this.indexType = index
            var tableId = tableObj.id;
            this.$emit('moreChange', tableId);
            this.keyWord = "";
            this.queryStr = "";
            var title = ''
            switch (tableObj.id) {
                case 'supQuestCount':
                    this.requestType = 0;
                    title = '项目专项得分排名'
                    break;

                case 'supResovleCount':
                    this.requestType = 1;
                    break;

                case 'supResovleRate':
                    title = '项目整改率排名'
                    this.requestType = 2;
                    break;
            
                default:
                    break;
            }

            this.currentCheckTableStantard = groupSort[1].table[0];
            console.log(this.currentCheckTableStantard,232);
            this.currentCheckTableStantard.items.forEach(function(ele,idx){
                if(idx > 2){
                    ele.width = '150';
                    ele.align = 'center'
                }
            })
            this.getMoreData(1 ,function (tableTitle) {
                var $alert = $(".layout-panel-b");
                window.layer.open({
                    type: 1,
                    title: title,
                    shade: 0.0001,
                    content: $alert,
                    area: ['80%', '90%'],
                    resize: false,
                    btn: []
                });
            });
        },
        computeWidth: function() {
            return Math.floor((100/this.currentTable.length)*100)/100+'%';
        },  
        /**
         * 获取table
         */
        tableInfoInit: function() {
            // $.formatDateTime(new Data()).split("-")[0]
            var self = this;
            $.request({ 
                url: "/api/reportBoardSpecialAssess/projectScoreRange", 
                type: "get",
                isLoad: true,
                data: {
                    "type" : self.projectType,
                    "year": new Date().getFullYear(),
                    "keyword": "",
                    "pageIndex":0,
                    "pageSize": 10
                },
                success: function(data, res) {
                    if(res.Code == 0) {
                        if(res.Data){
                            self.table = {
                                supQuestCount :res.Data.Rows
                            }
                        }else{
                            self.table.supQuestCount = []
                        }

                        var permissionList = self.permissions(['015','016'])
                        var codes = permissionList.map(function(item){
                            return item.ReportBoardMenuModularCode
                        })
                        var list = groupSort[3]
                        list.table = list.table.filter(function(item){
                            return codes.indexOf(item.code) > -1
                        })

                        self.currentTable = list.table;
                        self.currentTabName = list.name;
                    }
                }
            })
        },
        getQuestScore: function() {
            var self = this;
            var request = {
                    sort: self.projectType,
                    keyWord: "",
                    year: new Date().getFullYear(),
                    severity: "",
                    pageIndex: 0,
                    pageSize: 10
                }
                
            $.request({ 
                url: "/api/reportBoardGeneral/reportBoardProjectQuestScore", 
                type: "get",
                isLoad: true,
                data: request,
                success: function(data, res) {
                    setTimeout(function(){
                        if(res.Code == 0) {
                            if(res.Data){
                                self.table = {
                                    supQuestCount:self.table.supQuestCount,
                                    supResovleRate: res.Data.Rows
                                }
                            }else{
                                self.table = {
                                    supQuestCount:self.table.supQuestCount,
                                    supResovleRate: []
                                }
                            }
                        }
                    },500)
                },
            })
        },
    },
    watch: {
        tabShow: function(newVal, oldVal) {
            console.log(this.tabShow)
        },
        showType: function(newVal, oldVal) {
            // this.showTypeChange();
        },
        itemId: function(newVal, oldVal) {
            // this.showTypeChange();
        },
        yearValue: function(){
            // this.getMoreData()
        }
    },
    created: function() {   
        this.projectType = 0
        this.tableInfoInit()
        this.getQuestScore()
        // this.showTypeChange()
    },
}
</script>

<style>
#table_container .layout-panel-b{
    display: none;
}
#table_container .page-container{
    display: table;
    margin: 10px auto;
}
#table_container .layout-panel-b .input-control{
    padding: 10px 24px;
}
#table_container .layout-panel-b .input-control .input-container{
    display: inline-block;
    width: 200px;
    margin-left: 5px;
    margin-right: 15px;
}
#table_container .layout-panel-b .input-control .input-container,#table_container .layout-panel-b .input-control span{
    vertical-align: middle;
}
#table_container .tab-Layer{
    margin-bottom: 40px;
}
#table_container .tab-section {    
    text-align: center;
    border-bottom: 1px solid #c1cbda;
}
.tab-section .el-radio-button .el-radio-button__inner {
    background-color: #efeff4;
    border-bottom: none;
    padding: 9px 15px;
    min-width: 80px;
    border-right: 1px solid #bfcbd9;
}
#table_container .tab-section .el-radio-button__orig-radio:checked+.el-radio-button__inner {
    background-color: #42a1ff;
}
#table_container .tab-section .el-radio-button:first-child .el-radio-button__inner {
    border-radius: 2px;
}
#table_container .tab-section .el-radio-button:last-child .el-radio-button__inner {
    border-radius: 2px;
}
#table_container .table-Layer .title {
    padding-bottom: 20px;

}
#table_container .table-Layer h4 {
    display: inline-block;
    margin: 0;
    padding-left: 10px;
	height: 20px;
	line-height: 23px;
  font-size: 15px;
  font-weight: bold;
	letter-spacing: 0px;
	color: #333333;
    border-left: 4px solid #42a1ff;
}
#table_container .table-Layer span {
    display: inline-block;
    color: #42a1ff;
    float: right;
}
#table_container .table-Layer span:hover {
    color: #42a1ff;
    cursor: pointer;
}
#table_container .table-Layer {
    letter-spacing: 0;
}
#table_container .table-box {
    width: 100%;
    display: inline-block;
    padding: 0 24px;
    border-right: 1px solid #c1cbda;    
    vertical-align: top;
}
#table_container .table-Layer .table-box:first-child {
    padding-left: 0;
}
#table_container .table-Layer .table-box:last-child {
    padding-right: 0;
    border-right: none;
}
#table_container .stat-table {
    /* padding-left: 15px; */
}
.el-date-editor--year input{
    height: 30px;
}
.mb-0{
    margin-bottom: 0;
} 
.pb-0{
    padding-bottom: 0 !important;
}
</style>