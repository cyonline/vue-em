<template>
    <div class="tree-select-corp">
        <tree-select
        ref="treeSelectCorp"
        :popper-class="popperClass"
        :cur-key="currentNodeId"
        :data="treeData"
        :props="treeProps"
        :node-key="nodeKey"
        :placeholder="placeholder"
        :expand-all="expandAll"
        :expanded="defaultExpandedKeys"
        :change="handleNodeChange"
        :disabled-select="disabledSelect"
        :disabled="setNodeDisabled"
        :on-all="onAll"
        :filterable="filterable"
        :clearable="clearable"
        ></tree-select>
    </div>
</template>
<script>
export default {
        name: "tree-select-corp",
        data() {
            return {
                type: '',
                currentNodeId: '',
                treeData: [],
                treeProps: {
                    label: 'Name',
                    children: 'ChildNodes',
                },
                nodeKey: 'Id',
                expandAll: false,
                defaultExpandedKeys: [],
            }
        },

        props: {
        // 选择类型 分期：stage 项目：project 标段：section 公司：corp 区域：area
        type: {
            type: String,
            default: 'stage',
        },
        value: {
            type: String,
            default: '',
        },
        placeholder: {
            type: String,
            default: '请选择分期',
        },
        filterable: {
            type: Boolean,
            default: true,
        },
        clearable: {
            type: Boolean,
            default: false,
        },
        change: {
            type: Function,
        },
        onAll: {
            type: Boolean,
            default: true,
        },
        setNodeDisabled: {
            type: Function,
        },
        disabledSelect: {
            type: Boolean,
            default: false,
        },
        popperClass: {
            type: String,
            default: 'select-popper-' + +new Date()
        },
        defaultCheckedFirstChild: { type: Boolean, default: true },
    },
    
    watch: {
        value: function(val) {
            this.currentNodeId = val;
        },
    },
    created: function() {
        this.currentNodeId = this.value;
        this.getTreeData();
    },
    methods: {
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
                    } else if (node[_this.treeProps.children] && node[_this.treeProps.children].length) {
                        fn(node[_this.treeProps.children]);
                    }
                })
            }
            fn(treeData);
            return checkedNode;
        },
        getTreeData: function() {
            var _this = this;
            var requestApi = '';
            if (this.type === 'section') {
                requestApi = '/api/assessCheckTask/getSectionTree';
            } else if (this.type === 'corp') {
                requestApi = '/projectBuilding/getSpecialCheckProjectTreeData?isOnlyContainStru=true';
            } else if (this.type === 'area') {
                requestApi = '/projectBuilding/companyProjectStage?flag=5&hasParent=true';
            } else {
                var isContainStage = this.type === 'stage';
                requestApi = '/projectBuilding/getSpecialCheckProjectTreeData?isContainStage=' + isContainStage;
            }
            $.request({
                url: requestApi,
                type: "get",
                isLoad: true,
                success: function(data) {
                    _this.treeData = data;
                    var defaultNode = JSON.parse(window.sessionStorage.getItem("DefaultItem") || '{}');
                    _this.currentNodeId = defaultNode.Id || '';
                    if (_this.currentNodeId) {
                        $.getDefaultExpandTree(_this.treeData, defaultNode.ParentId || defaultNode.Id, _this.treeData, _this.defaultExpandedKeys)
                        if (_this.defaultExpandedKeys.length) {
                            _this.$nextTick(function() {
                                var nodeData = _this.getNodeData(_this.treeData, _this.currentNodeId);
                                // 默认节点在树中不存在，则判断其父节点是否在树中，（存在常用设置中设置了常用分期，而有些地方树只到项目，此时默认选中分期所在的项目）
                                if (nodeData[_this.nodeKey] && (!_this.setNodeDisabled || (typeof _this.setNodeDisabled === 'function' && !_this.setNodeDisabled(nodeData)))) {
                                    _this.$emit('input', _this.currentNodeId);
                                    _this.handleNodeChange(nodeData);
                                } else {
                                    nodeData = _this.getNodeData(_this.treeData, defaultNode.ParentId);
                                    if (nodeData[_this.nodeKey] && (!_this.setNodeDisabled || (typeof _this.setNodeDisabled === 'function' && !_this.setNodeDisabled(nodeData)))) {
                                        _this.$emit('input', defaultNode.ParentId);
                                        _this.handleNodeChange(nodeData);
                                    }
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
                            var nodeId = _this.defaultExpandedKeys[_this.defaultExpandedKeys.length - 1];
                            var nodeData = _this.getNodeData(_this.treeData, nodeId);
                            if(nodeData.Type != 3 && _this.type=="stage"){
                                return
                            }
                            if (nodeData[_this.nodeKey] && (!_this.setNodeDisabled || (typeof _this.setNodeDisabled === 'function' && !_this.setNodeDisabled(nodeData)))) {
                                _this.currentNodeId = nodeId;
                                _this.$emit('input', _this.currentNodeId);
                                _this.handleNodeChange(nodeData);
                            }
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

                if (data[0][this.treeProps.children] && data[0][this.treeProps.children].length) {
                    this.setDefaultExpandedKeys(data[0][this.treeProps.children], expandedKeys);
                }
            }
        },
        handleNodeChange: function(node) {
            this.currentNodeId = node[this.nodeKey];
            this.$emit('input', this.currentNodeId);
            if (typeof this.change === 'function') {
                this.change(node);
            }
        },
    },
};
</script>