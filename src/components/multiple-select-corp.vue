// var MultipleSelectCorp = Vue.extend({
//     template: '<div class="projectTree_alert_box alert-box">' +
//         '   <div class="projectTree_alert_box__content">' +
//         '       <div class="projectTree_alert_box__left borderr">' +
//         '           <el-tree ref="projectTree" class="border_none" v-if="reloadTree" :data="treeData" show-checkbox :node-key="nodeKey" :default-checked-keys="defaultCheckedKeys" :default-expanded-keys="defaultExpandedKeys" :props="treeProps" @check-change="handleProjectTreeCheckChange"></el-tree>' +
//         '       </div>' +
//         '       <div class="projectTree_alert_box__right">' +
//         '           <p>已选{{ checkedNodes.length }}个项目</p>' +
//         '           <div class="pr">' +
//         '               <el-tag type="primary" :key="tag.Id" v-for="tag in checkedNodes" :closable="true" :close-transition="false" @close="handleStageTagClose(tag)" class="stage_tag">' +
//         '                   {{ tag.ParentName }} - {{ tag.Name }}' +
//         '               </el-tag>' +
//         '           </div>' +
//         '       </div>' +
//         '   </div>' +
//         '</div>',
//     props: {
//         type: {
//             type: Boolean,
//             default: 'stage',
//         },
//         treeProps: {
//             type: Object,
//             default: function() {
//                 return {
//                     label: 'Name',
//                     children: 'ChildNodes',
//                 }
//             }
//         },
//         nodeKey: {
//             type: String,
//             default: 'Id',
//         }
//     },
//     data: function() {
//         return {
//             treeData: [],
//             defaultExpandedKeys: [],
//             defaultCheckedKeys: [],
//             checkedNodes: [],
//             reloadTree:true,
//         }
//     },
//     created: function() {
//         this.getTreeData()
//     },
//     methods: {
//         handleProjectTreeCheckChange: function(data, checked, indeterminate) {
//             var _this = this;
//             var condition = false;
//             if (this.type === 'corp') {
//                 condition = data.CorpType == "2";
//             } else if (this.type === 'stage') {
//                 condition = data.Type === 3;
//             }
//             if (checked && condition) {
//                 this.checkedNodes.push(data);
//             } else if (condition) {
//                 var checkedIds = this.checkedNodes.map(function(item) {
//                     return item[_this.nodeKey]
//                 });
//                 var idx = 0;
//                 checkedIds.forEach(function(item, index) {
//                     if (item === data[_this.nodeKey]) {
//                         idx = index;
//                     }
//                 });
//                 if (idx > -1) {
//                     this.checkedNodes.splice(idx, 1);
//                 }
//             }
//         },
//         handleStageTagClose: function(tag) {
//             this.$refs.projectTree.setChecked(tag.Id, false, true);
//         },
//         getNodeData: function(treeData, nodeId) {
//             var _this = this;
//             var checkedNode = {};
//             if (!nodeId) {
//                 return {};
//             }
//             var fn = function(data) {
//                 data.forEach(function(node) {
//                     if (node[_this.nodeKey] === nodeId) {
//                         checkedNode = node;
//                     } else if (node[_this.treeProps.children] && node[_this.treeProps.children].length) {
//                         fn(node[_this.treeProps.children]);
//                     }
//                 })
//             }
//             fn(treeData);
//             return checkedNode;
//         },
//         getTreeData: function() {
//             var _this = this;
//             var requestApi = '';
//             if (this.type === 'section') {
//                 requestApi = '/api/assessCheckTask/getSectionTree';
//             } else if (this.type === 'corp') {
//                 requestApi = '/projectBuilding/getSpecialCheckProjectTreeData?isOnlyContainStru=true';
//             } else {
//                 var isContainStage = this.type === 'stage';
//                 requestApi = '/projectBuilding/getSpecialCheckProjectTreeData?isContainStage=' + isContainStage;
//             }
//             $.request({
//                 url: requestApi,
//                 type: "get",
//                 isLoad: true,
//                 success: function(data) {
//                     _this.treeData = data;
//                     _this.checkedNodes = [];
//                     _this.defaultCheckedKeys = [];
//                     var defaultNode = JSON.parse(window.sessionStorage.getItem("DefaultItem") || '{}');
//                     if (defaultNode.Id) {
//                         $.getDefaultExpandTree(_this.treeData, defaultNode.ParentId || defaultNode.Id, _this.treeData, _this.defaultExpandedKeys)
//                         if (_this.defaultExpandedKeys.length) {
//                             _this.$nextTick(function() {
//                                 var nodeData = _this.getNodeData(_this.treeData, defaultNode.Id);
//                                 // 默认节点在树中不存在，则判断其父节点是否在树中，（存在常用设置中设置了常用分期，而有些地方树只到项目，此时默认选中分期所在的项目）
//                                 if (nodeData[_this.nodeKey]) {
//                                     _this.checkedNodes.push(nodeData);
//                                     _this.defaultCheckedKeys.push(nodeData.Id);
//                                     _this.$emit('callback', _this.checkedNodes);
//                                 } else {
//                                     nodeData = _this.getNodeData(_this.treeData, defaultNode.ParentId);
//                                     if (nodeData[_this.nodeKey]) {
//                                         _this.checkedNodes.push(nodeData);
//                                         _this.defaultCheckedKeys.push(nodeData.Id);
//                                         _this.$emit('callback', _this.checkedNodes);
//                                     }
//                                 }
//                             });
//                         }
//                     } else {
//                         // 默认选中第一个的子级中的第一个
//                         _this.setDefaultExpandedKeys(_this.treeData, _this.defaultExpandedKeys);
//                         if (_this.defaultExpandedKeys.length) {
//                             var nodeData = _this.getNodeData(_this.treeData, _this.defaultExpandedKeys[_this.defaultExpandedKeys.length - 1]);
//                             _this.checkedNodes.push(nodeData);
//                             _this.defaultCheckedKeys.push(nodeData.Id);
//                             _this.$emit('callback', _this.checkedNodes);
//                         }
//                     }
//                     _this.reloadTree = false
//                     _this.$nextTick(function(){
//                         _this.reloadTree = true
//                     })
//                     // _this.$emit('callback', _this.checkedNodes);
//                 }
//             });
//         },
//         setDefaultExpandedKeys: function(data, expandedKeys) {
//             if (data && data.length) {
//                 if (data[0] && data[0][this.nodeKey]) {
//                     expandedKeys.push(data[0][this.nodeKey]);
//                 }

//                 if (data[0][this.treeProps.children] && data[0][this.treeProps.children].length) {
//                     this.setDefaultExpandedKeys(data[0][this.treeProps.children], expandedKeys);
//                 }
//             }
//         },
//     }
// })

// Vue.component('multiple-select-corp', {
//     template: '<el-input @click.native="openCorpSelectDialog" :value="checkedNodesName" size="small" readonly :placeholder="placeholder"></el-input>',
//     props: {
//         type: {
//             type: Boolean,
//             default: 'stage',
//         },
//         treeProps: {
//             type: Object,
//             default: function() {
//                 return {
//                     label: 'Name',
//                     children: 'ChildNodes',
//                 }
//             }
//         },
//         nodeKey: {
//             type: String,
//             default: 'Id',
//         },
//         placeholder: {
//             type: String,
//             default: '请选择项目',
//         },
//     },
//     data: function() {
//         return {
//             checkedNodesName: '',
//         }
//     },
//     created: function() {
//         this.mountCorpSelectDialog();
//     },
//     methods: {
//         mountCorpSelectDialog: function() {
//             var _this = this;
//             var dialogContent = document.getElementById('projectTree_alert_box');
//             if (!dialogContent) {
//                 var mountEle = document.createElement('div');
//                 document.body.appendChild(mountEle);
//                 this.corpSelect = new MultipleSelectCorp({
//                     el: mountEle,
//                     propsData: {
//                         type: _this.type,
//                         treeProps: _this.treeProps,
//                         nodeKey: _this.nodeKey,
//                     }
//                 });
//                 this.corpSelect.$on('callback', function(checkedNodes) {
//                     _this.handleDefaultCheck(checkedNodes);
//                 })
//             }
//         },
//         handleDefaultCheck: function(checkedNodes) {
//             var _this = this;
//             if (checkedNodes.length > 1) {
//                 var tipWord = this.type === 'corp' ? '公司' : '项目';
//                 _this.checkedNodesName = checkedNodes[0][_this.treeProps.label] + '···等多个' + tipWord;
//             } else {
//                 _this.checkedNodesName = checkedNodes.map(function(node) {
//                     return node[_this.treeProps.label];
//                 });
//             }
//             var checkedNodeIds = checkedNodes.map(function(item) {
//                 return item[_this.nodeKey]
//             })
//             _this.$emit('change', checkedNodeIds, checkedNodes)
//         },
//         openCorpSelectDialog: function() {
//             var _this = this;
//             if ($('.projectTree_alert_box')[0]) {
//                 window.layer.open({
//                     type: 1,
//                     title: '选择项目',
//                     shade: [0.0001],
//                     area: ['60%', '80%'],
//                     resize: false,
//                     closeBtn: 0,
//                     content: $('.projectTree_alert_box'),
//                     btn: ['确认', '取消'],
//                     btn1: function(index) {
//                         var checkedNodes = _this.corpSelect.checkedNodes;
//                         var checkedNodeIds = checkedNodes.map(function(item) {
//                             return item[_this.nodeKey];
//                         });

//                         if (checkedNodes.length > 1) {
//                             var tipWord = this.type === 'corp' ? '公司' : '项目';
//                             _this.checkedNodesName = checkedNodes[0][_this.treeProps.label] + '···等多个' + tipWord;
//                         } else {
//                             _this.checkedNodesName = checkedNodes.map(function(node) {
//                                 return node[_this.treeProps.label];
//                             });
//                         }

//                         _this.$emit('change', checkedNodeIds, _this.corpSelect.checkedNodes);
//                         window.layer.close(index);
//                     },
//                     btn2: function() {
//                         _this.checkedNodesName = '';
//                         // 循环去取消树的选中状态，这样又会导致handleProjectTreeCheckChange被触发多次，蛋疼~
//                         _this.corpSelect.checkedNodes.forEach(function(item) {
//                             _this.corpSelect.$refs.projectTree.setChecked(item.Id, false, true);
//                         });
//                         _this.corpSelect.$refs.projectTree.setCheckedKeys([]); // 清除所有
//                         _this.corpSelect.checkedNodes = [];
//                         _this.$emit('change', [], []);
//                     },
//                 });
//             }
//         },
//     }
// })