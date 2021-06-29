// 质量与安全分析
var sortList = [
    {                               // table-column的标准
        prop: '',
        label: '排名',
        align: '',
        type: 'index',
        width: '50'
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
        prop: 'SeriousnessNum',
        label: '严重',
        align: 'left',
        type: '',
        width: '120',
        formatter: function(row, column, cellValue) {
            return cellValue;
        }
    }, {
        prop: 'OrdinaryQuestionNum',
        label: '一般',
        align: 'left',
        type: '',
        width: '120',
        formatter: function(row, column, cellValue) {
            return cellValue;
        }
    }, {
        prop: 'SlightNum',
        label: '轻微',
        align: 'left',
        type: '',
        width: '120',
        formatter: function(row, column, cellValue) {
            return cellValue;
        }
    }
]

export default sortList