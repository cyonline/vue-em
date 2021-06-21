<template>
  <div class="sapi-project-tree">
    <div v-if="filterable">
      <el-input
        v-model.trim="treeFilterText"
        :maxlength="50"
        placeholder="输入关键字搜索"
        size="small"
        icon="search"
      ></el-input>
    </div>
    <div>
      <el-tree
        ref="projectTree"
        :data="treeData"
        :current-node-key="currentNodeId"
        :show-checkbox="showCheckbox"
        :node-key="nodeKey"
        :props="props"
        :highlight-current="!showCheckbox"
        :default-expand-all="false"
        :default-expanded-keys="defaultExpandedKeys"
        :expand-on-click-node="true"
        @node-click="clickPartTree"
        :filter-node-method="funFilterTree"
      ></el-tree>
    </div>
  </div>
</template>
<script>
export default {
    name: 'sapi-project-tree',
    data() {
        return {
            treeData: [],
            currentNodeId: "",
            treeFilterText: "",
            pathTemp: "",
            defaultExpandedKeys: [],
            props: {
                label: "Name",
                children: "ChildNodes"
            },
            parentId: "ParentId",
            nodeKey: "Id"
        };
    },
    props: {
        type: {
            type: String,
            default: "stage"
        },
        value: { type: String, default: "" }, // 当前选中的节点
        filterable: { type: Boolean, default: false }, // 是否支持筛选
        showCheckbox: { type: Boolean, default: false } // 是否显示复选框
    },
    created: function() {
        this.currentNodeId = this.value;
        if (this.type === 'department') {
            this.nodeKey = 'StruId';
            this.props = {
                label: 'StruName',
                children: 'Childs',
            };
            this.parentId = 'ParentStruId';
        }
        this.getTreeData();
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
        getCheckedNodes: function(leafOnly) {
            return this.$refs.projectTree.getCheckedNodes(leafOnly);
        },
        getCheckedKeys: function(leafOnly) {
            return this.$refs.projectTree.getCheckedKeys(leafOnly);
        },
        setCheckedKeys: function(nodeKeys) {
            return this.$refs.projectTree.setCheckedKeys(nodeKeys);
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
            if (this.showCheckbox) {
                return;
            }
            if (item) {
                if (this.nodeKey && this.currentNodeId == item[this.currentNodeId]) {
                    return;
                }

                // if (this.disabled && this.disabled(item)) {
                //     return;
                // }

                this.currentNodeId = item[this.nodeKey];
                this.$emit('input', this.currentNodeId);
                this.$emit('node-click', item, node, ele);
            } else {
                console.error('tree-select: 节点为空');
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
        getTreeData: function() {
            var _this = this;
            var requestApi = '';
            if (this.type === 'department') {
                requestApi = '/api/structures';
            } else if (this.type === 'section') {
                requestApi = '/api/assessCheckTask/getSectionTree';
            } else if (this.type === 'corp') {
                requestApi = '/projectBuilding/getSpecialCheckProjectTreeData?isOnlyContainStru=true';
            } else if (this.type === 'area') {
                requestApi = '/projectBuilding/companyProjectStage?flag=5&hasParent=true';
            } else {
                var isContainStage = this.type === 'stage';
                requestApi = '/projectBuilding/getSpecialCheckProjectTreeData?isContainStage=' + isContainStage;
            }
            this.defaultExpandedKeys = [];
            $.request({
                url: requestApi,
                type: "get",
                isLoad: true,
                success: function(data) {
                    _this.treeData = data;

                    var defaultNode = JSON.parse(window.sessionStorage.getItem("DefaultItem") || '{}');
                    _this.currentNodeId = defaultNode.Id || '';
                    if (_this.currentNodeId) {
                        _this.getDefaultExpandTree(_this.treeData, defaultNode.ParentId || defaultNode.Id, _this.treeData, _this.defaultExpandedKeys)
                        if (_this.defaultExpandedKeys.length) {
                            _this.$nextTick(function() {
                                var nodeData = _this.getNodeData(_this.treeData, _this.currentNodeId);
                                // 默认节点在树中不存在，则判断其父节点是否在树中，（存在常用设置中设置了常用分期，而有些地方树只到项目，此时默认选中分期所在的项目）
                                if (!nodeData[_this.nodeKey]) {
                                    nodeData = _this.getNodeData(_this.treeData, defaultNode.ParentId);
                                }

                                if (nodeData[_this.nodeKey]) {
                                    _this.$emit('input', nodeData[_this.nodeKey]);
                                    _this.$emit('node-click', nodeData);
                                }
                            });
                        } else {
                            // 默认展开第一级
                            _this.setDefaultExpandedKeys(_this.treeData, _this.defaultExpandedKeys);
                        }
                    } else {
                        // 默认选中第一个的子级中的第一个
                        _this.setDefaultExpandedKeys(_this.treeData, _this.defaultExpandedKeys);
                        if (_this.defaultCheckedFirstChild && _this.defaultExpandedKeys.length) {
                            _this.currentNodeId = _this.defaultExpandedKeys[_this.defaultExpandedKeys.length - 1];
                            var nodeData = _this.getNodeData(_this.treeData, _this.currentNodeId);
                            _this.$emit('input', _this.currentNodeId);
                            _this.$emit('node-click', nodeData);
                        }
                    }
                }
            });
        },
        setDefaultExpandedKeys: function(data, expandedKeys) {
            if (data && data.length) {
                if (data[0] && data[0][this.nodeKey]) {
                    expandedKeys.push(data[0][this.nodeKey]);
                }

                if (data[0][this.props.children] && data[0][this.props.children].length) {
                    this.setDefaultExpandedKeys(data[0][this.props.children], expandedKeys);
                }
            }
        },
        getNodeData: function(treeData, nodeId) {
            var _this = this;
            var checkedNode = {};
            if (!nodeId) {
                return {};
            }
            var fn = function(data) {
                data.forEach(function(node) {
                    if (node[_this.nodeKey] === nodeId) {
                        checkedNode = node;
                    } else if (node[_this.props.children] && node[_this.props.children].length) {
                        fn(node[_this.props.children]);
                    }
                })
            }
            fn(treeData);
            return checkedNode;
        },
        getDefaultExpandTree: function(tree, parentId, $tree, arr) {
            var _this = this;
            tree.forEach(function(node) {
                if (node[_this.nodeKey] === parentId) {
                    arr.push(node[_this.nodeKey]);
                    _this.getDefaultExpandTree($tree, node[_this.parentId], $tree, arr);
                } else {
                    if (!!node[_this.props.children] && node[_this.props.children].length) {
                        _this.getDefaultExpandTree(node[_this.props.children], parentId, $tree, arr)
                    }
                }
            })
        },
    },
    watch: {
        value: function(val) {
            if (val) {
                this.currentNodeId = val;
                var nodeData = this.getNodeData(this.treeData, this.currentNodeId);
                this.defaultExpandedKeys = [];
                if (nodeData[this.nodeKey]) {
                    this.getDefaultExpandTree(this.treeData, nodeData[this.parentId], this.treeData, this.defaultExpandedKeys);
                    this.$emit('node-click', nodeData);
                } else {
                    this.currentNodeId = '';
                    this.$emit('input', this.currentNodeId);
                    this.setDefaultExpandedKeys(this.treeData, this.defaultExpandedKeys);
                }
            }
        },
        treeFilterText: function(val) {
            this.$refs.projectTree.filter(this.treeFilterText, val);
        }
}
};
</script>