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
                    <span @click.stop="moreClick(tableStandard)">{{tableStandard.moreName}}
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
        <div class="layout-panel">
            <div class="input-control">
                <span>排序方式</span>
                <div class="input-container" style="width: 150px">
                    <el-select size="small" v-model="requestType" placeholder="请选择排序方式" @change="changeSort()">
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <span>关键字</span>
                <div class="input-container">
                    <el-input 
                        placeholder="可按合作单位名称进行搜索" 
                        size="small" 
                        v-model="queryStr">
                    </el-input>
                </div>
                <el-button type="primary" @click="queryMoreData" size="small">搜索</el-button>
            </div>
            <div class="table-box" style="border-right: none">
                <div class="stat-table">
                    <el-table stripe :data="currentCheckTable">
                        <el-table-column 
                            v-for="(item, index) in currentCheckTableStantard.items" 
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
            options: [
                {
                    label:"问题总数", 
                    value: 0
                },
                {
                    label:"问题整改率", 
                    value: 1
                },
                {
                    label:"整改及时率", 
                    value: 2
                }
            ],
            moreHierarchyType: {
                '1-1': 1,
                '2-1': 2,
                '3-1': 3
            },
            currentCheckTableStantard: "",
            moreTotal: 1,
            queryStr: "",
            requestType: ""
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
            if(this.requestType == '0'){
                // groupSort[1].forEach(function(ele){
                    groupSort[1].table.forEach(function(vals){
                        vals.items.forEach(function(items,idx){
                            if(idx == '0'){
                                items.prop = 'questCountIdx';
                            }
                        })
                    })
                // })
            }else if(this.requestType == '1'){
                // groupSort[1].forEach(function(ele){
                    groupSort[1].table.forEach(function(vals){
                        vals.items.forEach(function(items,idx){
                            if(idx == '0'){
                                items.prop = 'resolveCountIdx';
                            }
                        })
                    })
                // })
            }else{
                // groupSort[1].forEach(function(ele){
                    groupSort[1].table.forEach(function(vals){
                        vals.items.forEach(function(items,idx){
                            if(idx == '0'){
                                items.prop = 'CompleteTimeCountIdx';
                            }
                        })
                    })
                // })
            }
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
        getTableStandard: function (id) {
            return groupSort[1].table.filter(function (item) {
                return item.id == id
            })[0]
        },
        getMoreData: function(page, callback) {
            var vm = this;
            this.pageIndex = page;
            $.request({
                url: "/api/reportBoardDelive/supMore",
                type: "get",
                isLoad: true,
                data: {
                    ReportBoardType: vm.moreHierarchyType[vm.showType],
                    sortType: vm.requestType,
                    CommonId: vm.itemId,
                    pageIndex: vm.pageIndex,
                    pageSize: vm.pageSize,
                    keyWord: vm.keyWord
                },
                success: function (data, res) {
                    if (res.Code === 0) {
                        console.log(".......................", data)
                        vm.currentCheckTable = data.Rows;
                        vm.moreTotal = data.Total;
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
        },
        handleSizeChange: function (size) {
            console.log(size)
            this.pageSize = size;
            this.getMoreData(1);
        },
        pageChange: function (page) {
            this.getMoreData(page);
        },
        moreClick: function(tableObj) {
            var tableId = tableObj.id;
            this.$emit('moreChange', tableId);
            this.keyWord = "";
            this.queryStr = "";

            switch (tableObj.id) {
                case 'supQuestCount':
                    this.requestType = 0;
                    break;

                case 'supResovleCount':
                    this.requestType = 1;
                    break;

                case 'supResovleRate':
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
                var $alert = $(".layout-panel");
                window.layer.open({
                    type: 1,
                    title: "合作单位排名",
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
        tableInfoInit: function(url, type, d) {
            var self = this;
            $.request({ 
                url: url, 
                type: type,
                isLoad: true,
                data: d,
                success: function(data, res) {
                    if(res.Code == 0) {
                        self.table = data;
                        self.currentTable = self.sectionList[0].table;
                        self.currentTabName = self.sectionList[0].name;
                    }
                }
            })
        },
        showTypeChange: function() {
            this.sectionList = [];
            var list = [];
            // console.log(this.permissions(['010','013','014']))
            var permissionList = this.permissions(['010','013','014'])
            switch(this.showType) {
                case '1-1':
                    if(permissionList.length > 0) {
                        list.push(groupSort[0]);
                    }
                    this.tableInfoInit('/api/reportBoardDelive/sup', 'GET', {
                        "hierarchyType" : 1,// 1、集团
                    });
                    break;                    
                case '2-1': 
                    if(permissionList.length > 0) {
                        list.push(groupSort[0]);
                    }
                    this.tableInfoInit('/api/reportBoardDelive/sup', 'GET', {
                        "hierarchyType" : 2, // 2、公司
                        "CommonId" : this.itemId
                    });
                    break;  
                case '3-1': 
                    if(permissionList.length > 0) {
                        list.push(groupSort[0]);
                    }
                    this.tableInfoInit('/api/reportBoardDelive/sup', 'GET', {
                        "hierarchyType" : 3, // 3、项目
                        "CommonId" : this.itemId
                    });
                    break; 
                default: break;
            }
            var codes = permissionList.map(function(item){
                    return item.ReportBoardMenuModularCode
                })
                list[0].table = list[0].table.filter(function(item){
                    return codes.indexOf(item.code) > -1
                })
               
            console.log('list',list)
            this.sectionList = list
        }
    },
    watch: {
        tabShow: function(newVal, oldVal) {
            console.log(this.tabShow)
        },
        showType: function(newVal, oldVal) {
            this.showTypeChange();
        },
        itemId: function(newVal, oldVal) {
            this.showTypeChange();
        }
    },
    created: function() {   
        this.showTypeChange()
    },
}
</script>

<style>
#table_container .layout-panel{
    display: none;
}
#table_container .page-container{
    display: table;
    margin: 10px auto;
}
#table_container .layout-panel .input-control{
    padding: 10px 24px;
}
#table_container .layout-panel .input-control .input-container{
    display: inline-block;
    width: 200px;
    margin-left: 5px;
    margin-right: 15px;
}
#table_container .layout-panel .input-control .input-container,#table_container .layout-panel .input-control span{
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
</style>