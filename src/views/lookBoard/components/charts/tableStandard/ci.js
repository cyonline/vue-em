// 质量与安全分析
var sortList = [
    {                               // table-column的标准
        prop: '',
        label: '排名',
        align: 'left',
        type: 'index',
        width: '50'
    }, {
        prop: 'questTypeName',
        label: '问题分类',
        align: 'left',
        type: '',
        width: '',
        formatter: function(row, column, cellValue) {
            return cellValue;
        }
    }, {
        prop: 'questtypeCount',
        label: '问题总数',
        align: 'left',
        type: '',
        width: '120',
        formatter: function(row, column, cellValue) {
            return cellValue;
        }
    }, {
        prop: 'WaitResolveCount',
        label: '未整改数',
        align: 'left',
        type: '',
        width: '120',
        formatter: function(row, column, cellValue) {
            return cellValue;
        }
    }, {
        prop: 'ResolveCountRate',
        label: '整改率',
        align: 'left',
        type: '',
        width: '120',
        formatter: function(row, column, cellValue) {
            return cellValue + '%';
        }
    }
]

export default sortList