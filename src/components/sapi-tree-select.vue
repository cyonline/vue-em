<template>
    <div>
        <el-select :popper-class="popperClass" :disabled="disabledSelect" size="small" v-model="curLabel" :placeholder="placeholder" class="vertical-middle" 
               @visible-change="startSelect" :clearable="clearable" @clear="clearSelect" >
            <el-option :value="curLabel" class="tree-select-box" ref="treeSelectBox">
               <el-input size="small" class="m-b-xs" placeholder="输入关键字过滤" v-model="treeFilterText" 
                   v-if="filterable" @click.native.stop=""></el-input>' 
               <el-tree ref="treeSelect" :data="data" :node-key="nodeKey" :props="props" :render-content="treeSelectRender"
                   :default-expand-all="expandAll" :default-expanded-keys="expandeds" :expand-on-click-node="true" 
                   @node-click="clickPartTree" :filter-node-method="funFilterTree" lazy :load="loadNode"></el-tree>
            </el-option>
        </el-select>
    </div>
</template>
<script>
export default {
    name:'tree-select',
    data() {
        return {
            showDown: false,
            curLabel: null,
            treeFilterText: '',
            pathTemp: ''
        }
    },
    props: {
        data: { type: Array, default: [] },
        nodeKey: { type: String, default: '' },
        curKey: { type: String, default: '' }, // 当前选中的节点
        placeholder: { type: String, default: '' },
        props: { type: Object, default: { label: 'label', children: 'children' } },
        onAll: { type: Boolean, default: false }, // 是否所有节点可选
        expandAll: { type: Boolean, default: false }, // 是否展开所有
        expanded: { type: Array }, // 默认展开的节点（设置此属性时应将expandAll设为false）
        expandParent: { type: Boolean, default: false }, // 默认展开子节点父节点不会展开，以此控制是否要循环出父节点
        change: { type: Function }, // change事件,返回节点数据
        disabled: { type: Function }, // 是否禁用节点(true 是/ false 否)
        filterable: { type: Boolean, default: false }, // 是否支持筛选
        clearable: { type: Boolean, default: false }, // 是否支持清空，清空回调将返回一个空对象{}
        disabledSelect: { type: Boolean, default: false },
        popperClass: { type: String, default: 'select-popper-' + +new Date() },
    },
    
    computed: {
        expandeds: function() {
            if (this.expandParent) {
                var expanded = [];
                this.expanded.map(function(val) {
                    this.pathTemp = [];
                    this.getIdPath(this.data, val);
                    expanded = expanded.concat(this.pathTemp || []);
                }.bind(this))
                return expanded;
            }
            return this.expanded;
        }
    },
    methods: {
        treeSelectRender: function(h, n) {
            var _this = this;
            Vue.component('select-tree-child', {
                template: '<div class="tree-child">' +
                    '   <div class="tree-node-bg" :class=\'{"tree-selected": curKey == node.key}\'></div>' +
                    '   <div class="tree-child-name">{{node.label}}</div>' +
                    '</div>',
                data: function() {
                    if (!n.data[_this.props.children] || !n.data[_this.props.children].length) {
                        n.node.isLeaf = true;
                    }
                    return {
                        node: n.node,
                        curKey: _this.curKey
                    }
                },
            })
            return h("select-tree-child");
        },
        loadNode: function(node, resolve) {
            var vm = this;
            setTimeout(function() {
                var data = !node.data ? [] : node.data[vm.props.children] || [];
                resolve(data);
            }, 100)
        },
        startSelect: function(state) {
            if (state) {
                setTimeout(function() {
                    $(this.$refs.treeSelectBox.$el).closest('.el-select-dropdown__wrap').scrollTop(0);
                }.bind(this))
            }
        },
        funFilterTree: function(keywords, data, node) {
            var _this = this;
            if (!keywords) return true;
            var searchTreeData = function(keywords, data, node) {
                if (data[_this.props.label].indexOf(keywords) !== -1) {
                    return true;
                }

                if (node.parent && node.parent.data && node.parent.data[_this.props.label]) {
                    return searchTreeData(keywords, node.parent.data, node.parent);
                }

                return false;
            }

            var flag = searchTreeData(keywords, data, node);

            return flag;
        },
        clickPartTree: function(item, node, ele) {
            if (item) {
                if (this.nodeKey && this.curKey == item[this.nodeKey]) {
                    setTimeout(function() {
                        $(ele.$el).parents('.tree-select-box').click();
                    })
                    return;
                }
                if (!this.onAll && item[this.props.children] && item[this.props.children].length > 0) {
                    return;
                }

                if (this.disabled && this.disabled(item)) {
                    return;
                }

                this.showDown = false;
                this.curLabel = item[this.props.label];
                this.curKey = item[this.nodeKey];
                if (this.change) {
                    this.change(item);
                }
            } else {
                console.error('tree-select: 节点为空');
            }

            setTimeout(function() {
                $(ele.$el).parents('.tree-select-box').click();
            })
        },
        clearSelect: function() {
            this.curLabel = '';
            this.curKey = '';
            if (this.change) {
                this.change({});
            }
        },
        getLabel: function(data) {
            var _this = this;
            !data && (data = this.data);
            if (this.curKey) {
                data.map(function(val) {
                    if (val[_this.nodeKey] == _this.curKey) {
                        _this.curLabel = val[_this.props.label];
                    }
                    if (val[_this.props.children]) {
                        _this.getLabel(val[_this.props.children]);
                    }
                })
            }
        },
        // 补全id全路径 便于直接获取
        fullIdPath: function(data, path) {
            !data && (data = this.data);
            !path && (path = []);
            data.forEach(function(val) {
                var children = val[this.props.children];
                val.treeSelectPath = path.concat([val[this.nodeKey]]);
                if (children && children.length > 0) {
                    this.fullIdPath(children, val.treeSelectPath);
                }
            }.bind(this))
        },
        // 根据id获取路径
        getIdPath: function(data, id) {
            for (var i = 0; i < data.length; i++) {
                if (this.pathTemp && this.pathTemp.length) {
                    break; // 已找到，直接结束遍历
                }
                var val = data[i];
                var children = val[this.props.children];
                if (val[this.nodeKey] == id) {
                    this.pathTemp = val.treeSelectPath || [];
                    break;
                }
                if (children && children.length > 0) {
                    this.getIdPath(children, id);
                }
            }
        },
    },
    watch: {
        curKey: function(val) {
            if (!this.curKey) {
                return this.curLabel = '';
            }
            if (this.curLabel === null || this.curLabel === '') {
                this.getLabel();
            }
        },
        // 异步data处理赋值延迟
        data: function(val) {
            if (this.curLabel === null || this.curLabel === '') {
                this.getLabel();
            }

            if (this.expandParent) {
                this.fullIdPath();
            }
        },
        treeFilterText: function(val) {
            this.$refs.treeSelect.filter(this.treeFilterText, val);
        }
    },
}
</script>