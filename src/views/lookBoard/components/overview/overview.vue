<template>
    <div id="overview-container" v-if="show" >
        <div class="overview-box" v-for="(content, index) in contentList" :key="index">
            <div class="title">
                <h4>{{content.title}}</h4>
            </div>
            <div class="box">
                <div class="item" v-for="(item, index) in content.tabs" :key="index" :style="{width: computeWidth(content)}">
                    <div class="tabs">
                        <p class="num">{{item.num}}
                        </p>
                        <p class="name">{{item.name}}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data: function() {
        return {
            show: false,
            contentList: [{
                title: '',            // 总览标题
                numbers: 3,                          // 每行个数
                tabs: [{                             // 每个小方格
                    name: '',
                    num: '',
                }]
            }],
            qualityList: {},
            payList: {}
        }        
    },
    props: {
        // 层级(1.集团，2.公司，3.项目)
        hierarchyType: {
            type: Number,
            required: true,
            default: function () {
                return 0;
            },
        },
        itemId: {
            type: String,
            required: false,
            default: function () {
                return '';
            },
        },
        permissions: {
            type: Function,
            required: true
        },
        panelType: {
            type: Number
        }
    },
    watch: {
        hierarchyType: function() {
            this.overviewQuality()
        },
        itemId: function() {
            this.overviewQuality();
        },
        panelType: function() {
            this.overviewQuality();
        }
    },
    methods: {
        computeWidth: function(content) {
            return Math.floor((100/content.numbers) * 100)/100+'%';
        },
        // 获取质量指标总览 （hierarchyType：1集团质量指标总览，2公司质量指标总览，3项目质量指标总览）
        setView: function(data) {
            this.contentList = [];
            if(this.permissions(['001']).length > 0){
                this.qualityList.tabs = [{                             
                    name: '质量问题数',
                    num: data.QualityQuestionNum,
                },{    
                    name: '未整改数',                         
                    num: data.QualityNotCloseNum ,
                },{                            
                    name: '整改率',
                    num: data.QualityCloseRate,
                },{                             
                    name: '安全问题数',
                    num: data.SafetyQuestionNum,
                },{                             
                    name: '未整改数',
                    num: data.SafetyNotCloseNum,
                },{                             
                    name: '整改率',
                    num: data.SafetyCloseRate,
                },{                             
                    name: '严重问题数',
                    num: data.SeverityQuestionNum,
                },{                             
                    name: '未整改数',
                    num: data.SeverityNotCloseNum,
                },{                             
                    name: '整改率',
                    num: data.SeverityCloseRate,
                }];
                this.contentList.push(this.qualityList)
            }
            if(this.permissions(['002']).length > 0) {
                this.payList.tabs = [{
                    name: '一次交付率',
                    num: data.AbarbeitungPassRate,
                }, {
                    name: '缺陷未整改数',
                    num: data.DeliverNotCloseNum
                }, {
                    name: '整改率',
                    num: data.DeliverPassRate
                }]  
                this.contentList.push(this.payList)
            }                 
        },
        setProjectView: function(data) {
            this.contentList = [];
            if(this.permissions(['001']).length > 0) {
                var projectGeneralRecord = data.projectGeneralRecord
                this.qualityList.tabs = [{                             
                        name: '问题总数',
                        num: projectGeneralRecord.QuestionNum ,
                    },{    
                        name: '未整改数',                         
                        num: projectGeneralRecord.QuestionNotCloseNum  ,
                    },{                            
                        name: '整改率',
                        num: projectGeneralRecord.QuestionCloseRate ,
                    },{                             
                        name: '安全问题数',
                        num: data.SafetyQuestionNum ,
                    },{                             
                        name: '质量问题数',
                        num: data.QualityQuestionNum ,
                    },{                             
                        name: '',
                        num: '' ,
                    },{                             
                        name: '严重问题数',
                        num: data.SeverityQuestionNum ,
                    },{                             
                        name: '一般问题数',
                        num: projectGeneralRecord.OrdinaryQuestionNum ,
                    },{                             
                        name: '轻微问题数',
                        num: projectGeneralRecord.SlightNum,
                    },{                             
                        name: '报验总数',
                        num: projectGeneralRecord.AcceptanceAllNum ,
                    },{                             
                        name: '痛点工序验收数',
                        num: projectGeneralRecord.PainAcceptanceNum ,
                    },{                             
                        name: '关键工序验收数',
                        num: projectGeneralRecord.KeyAcceptanceNum ,
                    }]
                this.contentList.push(this.qualityList)
            }
            if (this.permissions(['002']).length > 0) {
                var deliverGeneralRecord = data.projectGeneralRecord.deliverGeneralRecord;
                this.payList.tabs = [{
                    name: '一次交付率',
                    num: data.AbarbeitungPassRate,
                }, {
                    name: '交付总数',
                    num: deliverGeneralRecord.DeliverAllNum 
                }, {
                    name: '未交付数',
                    num: deliverGeneralRecord.NotDeliverNum 
                },{
                    name: '已接收数',
                    num: deliverGeneralRecord.ReceiveDeliverNum ,
                },{
                    name: '整改率',
                    num: data.DeliverPassRate
                } ,{
                    name: '交付缺陷数',
                    num: deliverGeneralRecord.DeliverQuestionNum 
                },{
                    name: '未整改数',
                    num: data.DeliverNotCloseNum ,
                }, {
                    name: '未接收数',
                    num: deliverGeneralRecord.NotReceiveDeliverNum 
                }]
                this.contentList.push(this.payList)
            }
        },
        overviewQuality: function() {
            var self = this;
            this.qualityList = {};
            this.payList = {};
            $.request({ 
                url: "/api/reportBoardGeneral/reportBoardGeneral", 
                type: "GET",
                isLoad: true,
                data: {
                    type: self.hierarchyType,
                    itemId: self.itemId
                },
                success: function(data, res) {
                    if(res.Code == 0) {
                        self.show = true;
                        if(self.hierarchyType == 1){
                            if(self.permissions(['001']).length > 0) {
                                self.qualityList = {
                                    title: '集团质量指标总览',
                                    numbers: 3,                            
                                }
                            }
                            if(self.permissions(['002']).length > 0) {
                                self.payList = {
                                    title: '集团交付指标总览',
                                    numbers: 3,  
                                }
                            }
                            self.setView(data);
                        }else if(self.hierarchyType == 2) {
                            if(self.permissions(['001']).length > 0) {
                                self.qualityList = {
                                    title: '公司质量指标总览',
                                    numbers: 3,                            
                                }
                            }
                            if(self.permissions(['002']).length > 0) {
                                self.payList = {
                                    title: '公司交付指标总览',
                                    numbers: 3,  
                                }
                            }
                            self.setView(data);
                        }else if(self.hierarchyType == 3) {
                            if(self.permissions(['001']).length > 0) {
                                self.qualityList = {
                                    title: '项目质量指标总览',
                                    numbers: 3,                            
                                }
                            }
                            if(self.permissions(['002']).length > 0) {
                                self.payList = {
                                    title: '项目交付指标总览',
                                    numbers: 4,  
                                }
                            }
                            self.setProjectView(data);
                        }
                    }
                }
            });
        },
    },
    mounted: function () {
        this.overviewQuality();
    },
}
</script>

<style scoped>
#overview-container {
    width: 100%;
	background-color: transparent;
	border-radius: 4px;
    padding: 18px 25px;
}
#overview-container h4 {
	height: 20px;
    line-height: 20px;
    border-left: 4px solid #69a4e0;
  font-size: 15px;
  font-weight: bold;
	letter-spacing: 0px;
    color: #333333;
    margin-top: 0px;
    margin-bottom: 5px;
    padding-left: 10px;
}
#overview-container .box {
    overflow: hidden;
}
#overview-container .overview-box:first-child .box {
    /* border-bottom: solid 1px #c1cbda;    */
}
#overview-container .box .item {
    /* display: inline-block; */
    letter-spacing: 0px;
    text-align: center;
    float: left;
    height: 85px;
    border-bottom: solid 1px #c1cbda;    
    margin-bottom: -1px;
}
#overview-container .box .item .num {
    height: 25px;
	font-size: 18px;
	line-height: 20px;
    color: #42a1ff;
    margin: 0;
    margin-top: 15px;
}
#overview-container .box .item .name {
    margin: 0;
    margin-top: 12px;
	height: 18px;
	font-size: 12px;
	line-height: 18px;
	color: #666666;
}
#overview-container .tabs {
	height: 47px;
	border-left: solid 1px #c1cbda;
    margin-left: -1px;
}
#overview-container .overview-box {
  margin-top: 20px;
}
#overview-container .overview-box:first-child {
    margin-top: 0px;
}
</style>
