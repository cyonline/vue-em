<template>
    <div id="table_container">
        <div class="table-Layer">
            <div class="table-box" style="width:100%">
                <div class="title">
                    <h4>评估检查 {{titleDesc}}</h4>
                    <span @click.stop="moreClick()">更多
                        <i class="iconfont icon-xiangzuo-copy"></i>
                    </span>
                </div>
                <div class="stat-table">
                    <el-table stripe :data="tableData" style="width: 100%">
                        <el-table-column label="任务名称" prop="TaskName" show-overflow-tooltip></el-table-column>
                        <el-table-column label="任务类型" prop="AssessType" show-overflow-tooltip>
                            <template scope="scope">
                               {{options[scope.row.AssessType].label}}
                            </template>
                        </el-table-column>
                        <el-table-column label="状态" prop="TaskStateDesc" show-overflow-tooltip></el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
        <div class="layout-panel-accesscheck">
            <div class="input-control">
                <!-- <span>检查类型</span>
                <div class="input-container" style="width: 150px">
                    <el-select size="small" v-model="assessType" placeholder="请选择检查类型">
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </div> -->
                <span>编号</span>
                <div class="input-container">
                    <el-input 
                        placeholder="可按任务编号搜索" 
                        size="small" 
                        v-model="taskNo">
                    </el-input>
                </div>
                <span>关键字</span>
                <div class="input-container">
                    <el-input 
                        placeholder="可按任务名称搜索" 
                        size="small" 
                        v-model="keyWord">
                    </el-input>
                </div>
                <el-button type="primary" @click="queryMoreData" size="small">搜索</el-button>
            </div>
            <div class="table-box" style="border-right: none">
                <div class="stat-table">
                    <el-table stripe border class="task-table" :data="currentCheckTable" width="100%">
                        <el-table-column prop="TaskNo" label="任务编号" width="300"></el-table-column>
                        <el-table-column prop="TaskName" label="任务名称"></el-table-column>
                        <el-table-column label="评估地区" show-overflow-tooltip>
                            <template scope="scope">
                                {{getCompanyName(scope.row.companyList)}}
                            </template>
                        </el-table-column>
                        <el-table-column label="创建时间" width="150">
                            <template scope="scope">
                                {{$.formatDateTime(scope.row.CreateTime, 1)}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="TaskStateDesc" label="状态" width="120"></el-table-column>
                        <el-table-column label="操作" width="120">
                            <template scope="scope">
                                <el-button class="btn-mini" title="详情" @click="funDetail(scope.row)">
                                    <i class="iconfont icon-interface4 text-primary"></i>
                                </el-button>
                            </template>
                        </el-table-column>
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

        <div class="layout-panel-accesscheck-detail alert-p-15 auto-alert-box">
            <div class="form-group">
                <span class="w-75 text-gray">任务编号</span>
                <span class="detail-info">{{taskDetailData.taskNo}}</span>
            </div>
            <div class="form-group">
                <span class="w-75 text-gray">任务名称</span>
                <span class="detail-info">{{taskDetailData.taskName}}</span>
            </div>
            <div class="form-group">
                <span class="w-75 text-gray">任务类型</span>
                <span class="detail-info">{{getTypeName(taskDetailData.taskType)}}</span>
            </div>
            <h5 class="h-title m-t-lg"><span>评估地区</span></h5>
            <div v-if="taskDetailData.taskType == 2 || taskDetailData.taskType == 3" key="checkersTable">
                <el-table ref="taskCheckersTable" :data="taskDetailData.checkersData" border>
                    <el-table-column prop="ProjectName" label="评估项目" :show-overflow-tooltip="true" width="200"></el-table-column>
                    <el-table-column prop="StageName" label="评估项目分期" :show-overflow-tooltip="true" v-if="taskDetailData.taskType == 3"></el-table-column>
                    <el-table-column prop="Checkers" label="评估人员" :show-overflow-tooltip="true">
                        <template scope="scope">
                            <span v-for="(item,index) in scope.row.Checkers" :key="index+'checker'">
                                <span>{{item.CheckerName}}</span>
                                <span v-if="index<scope.row.Checkers.length-1">、</span>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="LeaderName" label="评估组长" :show-overflow-tooltip="true" width="120"></el-table-column>
                </el-table>
            </div>
            <div v-if="taskDetailData.taskType == 0 || taskDetailData.taskType == 1" key="ExecutorsTable">
                <el-table ref="taskExecTable" :data="taskDetailData.Executors" border>
                    <el-table-column prop="AreaCompanyName" label="评估地区" :show-overflow-tooltip="true" width="200"></el-table-column>
                    <el-table-column prop="SupplierName" label="评估公司" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column prop="EmployeeName" label="评估公司负责人" :show-overflow-tooltip="true" width="200"></el-table-column>
                </el-table>
            </div>
        </div>

    </div>
</template>

<script>
export default {
    name: 'stat-table',
    data: function() {
        return {
            tableData: [],                               // key是table的标识，value是请求后的数据
            currentCheckTable: [],  //当前查看的更多的表格
            keyWord: "",
            pageIndex: 1,
            pageSize: 10,
            options: [
                {
                    label:"综合评估", 
                    value: 0
                },
                {
                    label:"月度区域评估", 
                    value: 1
                },
                {
                    label:"月度地区评估", 
                    value: 2
                },
                {
                    label:"周评估", 
                    value: 3
                },

            ],
            moreTotal: 1,
            queryStr: "",
            taskNo: "",
            assessType: "",
            titleDesc: "",
            taskDetailData: {
                taskNo: '',
                taskName: '',
                taskType: '',
                Executors: [],
                checkersData: []
            }
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
            type: String,   // (1.集团，2.公司，3.项目)
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
        tabChange: function(tab) {
            this.$emit('tabChange', tab);
        },
        queryMoreData: function () {
            this.getMoreData(1);
        },
        getMoreData: function(page, callback) {
            var vm = this;
            this.pageIndex = page;
            $.request({
                url: "/api/assessCheckTask/agentList",
                type: "get",
                isLoad: true,
                data: {
                    AssessType: vm.assessType,
                    TaskNo: vm.taskNo,
                    KeyWord: vm.keyWord,
                    PageSize: vm.pageSize,
                    PageIndex: vm.pageIndex
                },
                success: function (data, res) {
                    if (res.Code === 0) {
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
                    }
                }
            })
        },
        handleSizeChange: function (size) {
            this.pageSize = size;
            this.getMoreData(1);
        },
        pageChange: function (page) {
            this.getMoreData(page);
        },
        moreClick: function(tableObj) {
            this.taskNo = "";
            this.keyWord = "";
            this.getMoreData(1 ,function () {
                var $alert = $(".layout-panel-accesscheck");
                window.layer.open({
                    type: 1,
                    title: "看板/评估检查任务",
                    shade: 0.0001,
                    content: $alert,
                    area: ['80%', '80%'],
                    resize: false,
                    btn: []
                });
            });
        },
        getCompanyName: function(list) {
            var nameArr = [];
            list.forEach(function(val) {
                nameArr.push(val.CompanyName);
            })
            return nameArr.join(',');
        },
        /**
         * 获取table
         */
        tableInfoInit: function(url, type, d) {
            var self = this;
            d["TaskNo"] = "";
            d["KeyWord"] = "";
            d["PageSize"] = 10;
            d["PageIndex"] = 1;
            $.request({ 
                url: url, 
                type: type,
                isLoad: true,
                data: d,
                success: function(data, res) {
                    if(res.Code == 0) {
                        self.tableData = data.Rows;
                        console.log(self.tableData)
                    }
                }
            })
        },
        showTypeChange: function() {
            switch(this.showType) {
                case '1':
                    this.assessType = 0;
                    this.titleDesc = "(综合评估检查)";
                    this.tableInfoInit('/api/assessCheckTask/agentList', 'GET', {
                        "AssessType" : 0,// 1、集团
                    });
                    break;                    
                case '2': 
                    this.assessType = 2;
                    this.titleDesc = "(月度(地区)评估检查)";
                    this.tableInfoInit('/api/assessCheckTask/agentList', 'GET', {
                        "AssessType" : 2, // 2、公司
                    });
                    break;  
                case '3': 
                    this.assessType = 3;
                    this.titleDesc = "(周评估检查)";
                    this.tableInfoInit('/api/assessCheckTask/agentList', 'GET', {
                        "AssessType" : 3, // 3、项目
                    });
                    break; 
                default: break;
            }
        },
        getTypeName: function(type) {
            return ['综合评估', '月度区域评估', '月度地区评估', '周评估'][type];
        },
        // 查看详情
        funDetail: function(item) {
            var _this = this;
            var $alert = $('.layout-panel-accesscheck-detail');

            this.taskDetailData.taskNo = item.TaskNo;
            this.taskDetailData.taskName = item.TaskName;
            this.taskDetailData.taskType = item.AssessType;

            this.getTaskAreaCompany(item.TaskId);

            layer.open({
                type: 1,
                title: ['查看详情'],
                shade: 0.001,
                area: ['800px', '80%'],
                resize: false,
                content: $alert,
                btn: []
            })
        },
        getTaskAreaCompany: function(taskId) {
            var _this = this;
            var checkers = [];
            var isWeekType = _this.taskDetailData.taskType == 2 || _this.taskDetailData.taskType == 3;
            this.taskDetailData.Executors = [];
            this.taskDetailData.checkersData = [];
            $.request({
                url: isWeekType ? "/api/assessCheckOnLine/taskDetail" : "/api/assessCheckTask/getTaskAreaCompany",
                type: "get",
                isLoad: true,
                data: {
                    taskId: taskId
                },
                success: function(data) {
                    if (isWeekType) {
                        data.TaskProjects.forEach(function(items) {
                            _this.taskDetailData.checkersData.push(items);
                        });
                    } else {
                        _this.taskDetailData.Executors = data;
                    }
                }
            });
        },
    },
    watch: {
        showType: function(newVal, oldVal) {
            this.showTypeChange();
        },
        assessType: function(newVal, oldVal) {
            // this.pageChange(1);
        }
    },
    filters: {
        accessTypeName: function(type) {
            switch(type) {
                case '0':
                     return '综合评估';
                case '1':
                     return '月度区域评估';
                case '2':
                     return '月度地区评估';
                case '4':   
                     return '周评估';
            }
        }
    },
    created: function() {   
        this.showTypeChange();
    },
}
</script>

<style scoped>
#table_container .layout-panel-accesscheck{
    display: none;
}
#table_container .page-container{
    display: table;
    margin: 10px auto;
}
#table_container .layout-panel-accesscheck .input-control{
    padding: 10px 24px;
}
#table_container .layout-panel-accesscheck .input-control .input-container{
    display: inline-block;
    width: 200px;
    margin-left: 5px;
    margin-right: 15px;
}
#table_container .layout-panel-accesscheck .input-control .input-container,
#table_container .layout-panel-accesscheck .input-control span,
#table_container .layout-panel-accesscheck .input-control button
{
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
    display: inline-block;
    padding: 0 24px;
    border-right: 1px solid #c1cbda;    
    vertical-align: top;
    width: 100%;
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
#table_container .layout-panel-accesscheck-detail {
    display: none;
}
</style>