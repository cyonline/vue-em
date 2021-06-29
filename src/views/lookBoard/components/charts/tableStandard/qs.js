// 质量与安全分析
var sortList = [
    {   
        table: [{                            // table-column的标准
            prop: '',
            label: '排名',
            align: 'left',
            type: 'index',
            width: '50',      
        }, {
            prop: 'ItemName',
            label: '公司',
            align: 'left',
            type: '',
            width: '',
            formatter: function(row, column, cellValue) {
                return cellValue;
            }
        }, {
            prop: 'QuestionNum',
            label: '问题总数',
            align: 'left',
            type: '',
            width: '120',
            formatter: function(row, column, cellValue) {
                return cellValue;
            }
        }, {
            prop: 'NotCloseNum',
            label: '未整改数',
            align: 'left',
            type: '',
            width: '120',
            formatter: function(row, column, cellValue) {
                return cellValue;
            }
        }, {
            prop: 'NotCloseNumRate',
            label: '未整改率',
            align: 'left',
            type: '',
            width: '120',
            formatter: function(row, column, cellValue) {
                return cellValue + '%';
            }
        }]
    }, {
        table: [{                            // table-column的标准
            prop: '',
            label: '排名',
            align: 'left',
            type: 'index',
            width: '50',      
        }, {
            prop: 'ItemName',
            label: '项目',
            align: 'left',
            type: '',
            width: '',
            formatter: function(row, column, cellValue) {
                return cellValue;
            }
        }, {
            prop: 'QuestionNum',
            label: '问题总数',
            align: 'left',
            type: '',
            width: '120',
            formatter: function(row, column, cellValue) {
                return cellValue;
            }
        }, {
            prop: 'NotCloseNum',
            label: '未整改数',
            align: 'left',
            type: '',
            width: '120',
            formatter: function(row, column, cellValue) {
                return cellValue;
            }
        }, {
            prop: 'NotCloseNumRate',
            label: '未整改率',
            align: 'left',
            type: '',
            width: '120',
            formatter: function(row, column, cellValue) {
                return cellValue + '%';
            }
        }]
    }
]

export default sortList