// 公司排名，合作单位排名
var sortList = [
    {
        name: '合作单位排名',                        // tab切换的标签name
        table: [{                                   // tab页签下的table规范，数组可有多组table
            id: 'supQuestCount',                              // id标志不同的table的规范，也作为table数据的唯一标识
            moreId: "SupplierQuestionMore",
            tableTitle: '合作单位问题数排名',         // table的title
            more: true,                             // 是否显示tabletitle右侧的按钮
            moreName: '更多',                        // 按钮 name
            icon: 'icon-xiangzuo-copy', // 按钮 icon
            code:'010',         
            items: [{                               // table-column的标准
                prop: '',
                label: '排名',
                align: '',
                type: 'index',
                width: '50'
            },
             {
                prop: 'SupplierName',
                label: '合作单位',
                align: '',
                type: '',
                width: '',
                formatter: function(row, column, cellValue) {
                    return cellValue;
                }
            }, {
                prop: 'questCnt',
                label: '问题总数',
                align: '',
                type: '',
                width: '120',
                formatter: function(row, column, cellValue) {
                    return cellValue;
                }
            }]
        }, {
            id: 'supResovleCount',
            moreId: "SupplierResovleMore",
            tableTitle: '合作单位整改率排名',
            more: true,
            moreName: '更多',
            icon: 'icon-xiangzuo-copy',
            code:'013',      
            items: [{
                prop: '',
                label: '排名',
                align: '',
                type: 'index',
                width: '50'
            },
             {
                prop: 'SupplierName',
                label: '合作单位',
                align: '',
                type: '',
                width: '',
                formatter: function(row, column, cellValue) {
                    return cellValue;
                }
            }, {
                prop: 'ResolveCountRate',
                label: '问题整改率',
                align: '',
                type: '',
                width: '120',
                formatter: function(row, column, cellValue) {
                    return cellValue + '%';
                }
            }]
        }, {
            id: 'supResovleRate',
            moreId: "SupplierResovleCompleteTimeMore",
            tableTitle: '合作单位及时整改率排名',
            more: true,
            moreName: '更多',
            icon: 'icon-xiangzuo-copy',
            code:'014',     
            items: [{
                prop: '',
                label: '排名',
                align: 'left',
                type: 'index',
                width: '50',
            },
                 {
                prop: 'SupplierName',
                label: '合作单位',
                align: 'left',
                type: '',
                width: '',
                formatter: function(row, column, cellValue) {
                    return cellValue;
                }
            }, {
                prop: 'TimeCompeleteCntRate',
                label: '及时整改率',
                align: 'left',
                type: '',
                width: '120',
                formatter: function(row, column, cellValue) {
                    return cellValue + '%';
                }
            }]
        }]
    },
    {
        name: '更多合作单位排名',                        // tab切换的标签name
        table: [{                                   // tab页签下的table规范，数组可有多组table
            id: 'SupplierQuestionMore',                              // id标志不同的table的规范，也作为table数据的唯一标识
            tableTitle: '问题数合作单位排名',         // table的title
            more: true,                             // 是否显示tabletitle右侧的按钮
            moreName: '更多',                        // 按钮 name
            icon: 'icon-xiangzuo-copy',             // 按钮 icon
            items: [
                {
                    prop: 'questCountIdx',
                    label: '排名',
                    align: '',
                    type: '',
                    width: '50',
                    formatter: function (row, column, cellValue) {
                        return cellValue;
                    }
                }, {
                prop: 'SupplierName',
                label: '合作单位',
                align: '',
                type: '',
                width: '',
                formatter: function(row, column, cellValue) {
                    return cellValue;
                }
            }, {
                prop: 'questCnt',
                label: '问题总数',
                align: '',
                type: '',
                width: '80',
                formatter: function(row, column, cellValue) {
                    return cellValue;
                }
            }, {
                prop: 'ResolveCountRate',
                label: '整改率',
                align: '',
                type: '',
                width: '80',
                formatter: function(row, column, cellValue) {
                    return cellValue + "%";
                }
            }, {
                prop: 'TimeCompeleteCntRate',
                label: '及时整改率',
                align: '',
                type: '',
                width: '80',
                formatter: function(row, column, cellValue) {
                    return cellValue + "%";
                }
            }]
        }]
    },
    {
        name: '合作单位排名',                        // tab切换的标签name
        table: [{                                   // tab页签下的table规范，数组可有多组table
            id: 'supQuestCount',                              // id标志不同的table的规范，也作为table数据的唯一标识
            moreId: "SupplierQuestionMore",
            tableTitle: '项目专项得分排名( 本年度)',         // table的title
            more: true,                             // 是否显示tabletitle右侧的按钮
            moreName: '更多',                        // 按钮 name
            icon: 'icon-xiangzuo-copy',             // 按钮 icon
            items: [{                               // table-column的标准
                prop: '',
                label: '排名',
                align: '',
                type: 'index',
                width: '50'
            },
             {
                prop: 'SupplierName',
                label: '项目',
                align: '',
                type: '',
                width: '',
                formatter: function(row, column, cellValue) {
                    return cellValue;
                }
            }, {
                prop: 'questCnt',
                label: '得分',
                align: '',
                type: '',
                width: '120',
                formatter: function(row, column, cellValue) {
                    return cellValue;
                }
            }]
        }, {
            id: 'supResovleCount',
            moreId: "SupplierResovleMore",
            tableTitle: '合作单位整改率排名',
            more: true,
            moreName: '更多',
            icon: 'icon-xiangzuo-copy',
            items: [{
                prop: '',
                label: '排名',
                align: '',
                type: 'index',
                width: '50'
            },
             {
                prop: 'SupplierName',
                label: '合作单位',
                align: '',
                type: '',
                width: '',
                formatter: function(row, column, cellValue) {
                    return cellValue;
                }
            }, {
                prop: 'ResolveCountRate',
                label: '问题整改率',
                align: '',
                type: '',
                width: '120',
                formatter: function(row, column, cellValue) {
                    return cellValue + '%';
                }
            }]
        }, {
            id: 'supResovleRate',
            moreId: "SupplierResovleCompleteTimeMore",
            tableTitle: '项目整改率排名',
            more: true,
            moreName: '更多',
            icon: 'icon-xiangzuo-copy',
            items: [{
                prop: '',
                label: '排名',
                align: 'left',
                type: 'index',
                width: '50',
            },
                 {
                prop: 'SupplierName',
                label: '项目',
                align: 'left',
                type: '',
                width: '',
                formatter: function(row, column, cellValue) {
                    return cellValue;
                }
            }, {
                prop: 'TimeCompeleteCntRate',
                label: '问题整改率',
                align: 'left',
                type: '',
                width: '120',
                formatter: function(row, column, cellValue) {
                    return cellValue + '%';
                }
            }]
        }]
    },
    {
        name: '合作单位排名',                        // tab切换的标签name
        table: [{                                   // tab页签下的table规范，数组可有多组table
            id: 'supQuestCount',                              // id标志不同的table的规范，也作为table数据的唯一标识
            moreId: "SupplierQuestionMore",
            tableTitle: '项目专项得分排名( 本年度)',         // table的title
            more: true,                             // 是否显示tabletitle右侧的按钮
            moreName: '更多',                        // 按钮 name
            icon: 'icon-xiangzuo-copy',             // 按钮 icon
            code:'016',
            items: [{                               // table-column的标准
                prop: '',
                label: '排名',
                align: '',
                type: 'index',
                width: '50'
            },
             {
                prop: 'StageName',
                label: '项目',
                align: '',
                type: '',
                width: '',
                formatter: function(row, column, cellValue) {
                    return cellValue;
                }
            }, {
                prop: 'SpecialCheckScore',
                label: '得分',
                align: '',
                type: '',
                width: '120',
                formatter: function(row, column, cellValue) {
                    return cellValue;
                }
            }]
        }, {
            id: 'supResovleRate',
            moreId: "SupplierResovleCompleteTimeMore",
            tableTitle: '项目整改率排名',
            more: true,
            moreName: '更多',
            icon: 'icon-xiangzuo-copy',
            code:'015',
            items: [{
                prop: '',
                label: '排名',
                align: 'left',
                type: 'index',
                width: '50',
            },
                 {
                prop: 'StageName',
                label: '项目',
                align: 'left',
                type: '',
                width: '',
                formatter: function(row, column, cellValue) {
                    return cellValue;
                }
            }, {
                prop: 'QuestionRectifyRate',
                label: '问题整改率',
                align: 'left',
                type: '',
                width: '120',
                // formatter: function(row, column, cellValue) {
                //     return cellValue + '%';
                // }
            }]
        }]
    },
    // ,{
    //     name: '公司排名',
    //     table: [{
    //         id: '123',
    //         tableTitle: '问题数公司排名',
    //         more: true,
    //         moreName: '更多',
    //         icon: 'icon-xiangzuo-copy',
    //         items: [{
    //             prop: '',
    //             label: '排名',
    //             align: '',
    //             type: 'index',
    //             width: ''
    //         }, {
    //             prop: '',
    //             label: '公司排名',
    //             align: '',
    //             type: '',
    //             width: ''
    //         }, {
    //             prop: '',
    //             label: '问题总数',
    //             align: '',
    //             type: '',
    //             width: ''
    //         }]
    //     }, {
    //         id: '123',
    //         tableTitle: '问题整改率公司排名',
    //         more: true,
    //         moreName: '更多',
    //         icon: 'icon-xiangzuo-copy',
    //         items: [{
    //             prop: '',
    //             label: '排名',
    //             align: '',
    //             type: 'index',
    //             width: ''
    //         }, {
    //             prop: '',
    //             label: '公司排名',
    //             align: '',
    //             type: '',
    //             width: ''
    //         }, {
    //             prop: '',
    //             label: '问题整改率',
    //             align: '',
    //             type: '',
    //             width: ''
    //         }]
    //     }, {
    //         id: '123',
    //         tableTitle: '问题未整改数公司排名',
    //         more: true,
    //         moreName: '更多',
    //         icon: 'icon-xiangzuo-copy',
    //         items: [{
    //             prop: '',
    //             label: '排名',
    //             align: '',
    //             type: 'index',
    //             width: ''
    //         }, {
    //             prop: '',
    //             label: '公司排名',
    //             align: '',
    //             type: '',
    //             width: ''
    //         }, {
    //             prop: '',
    //             label: '未整改数',
    //             align: '',
    //             type: '',
    //             width: ''
    //         }]
    //     }]
    // }
]

export default sortList