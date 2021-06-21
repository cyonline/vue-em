// Vue.component('flow-progress-item',{
//     name:'flow-progress-item',
//     template:   '<li class="flow-progress-item">\
//                     <div class="flow-state" :class=\'{"flow-state-done":item.Finish}\'><i class="flow-state-success-icon"></i></div>\
//                     <div v-if="!isLast" class="flow-line" :class="{\'flow-line-done\':item.Finish}"></div>\
//                     <div class="flow-content">\
//                         <slot name="body" :item="item">\
//                             <div class="flow-content-header clearfix">\
//                                 <div class="left text-black-bold">\
//                                     <span>{{item.StepActionName ? item.StepActionName : ""}}{{item.StepActionStatus ? "-" + item.StepActionStatus : ""}}</span>\
//                                 </div>\
//                                 <div class="right text-gray">\
//                                     <span class="processor">操作人：{{item.HandlerName}}</span>\
//                                         <span>|</span>\
//                                     <span class="handleTime" v-if="item.Finish">操作时间：{{item.Finish ? item.HandleTime : ""}}</span>\
//                                 </div>\
//                             </div>\
//                             <div class="flow-content-middle" v-if="item.HandleDesc || (item.QuestionImages && item.QuestionImages.length)">\
//                                 <div class="explain" v-if="item.HandleDesc">{{item.HandleDesc}}</div>\
//                                 <div class="img_wrap J_albumSlider" data-role="albumSlider" v-if="item.QuestionImages && (item.QuestionImages.length)">\
//                                     <ul class="picture-slide-list clearfix">\
//                                         <template v-for="(itm,idx) in item.QuestionImages">\
//                                             <li class="mr-15" :key="idx" v-if="(itm.FileType === undefined || itm.FileType === null || itm.FileType === \'1\') ">\
//                                                 <img data-role="album" :src="itm.ImgUrl" data-title="整改照片">\
//                                             </li>\
//                                         </template>\
//                                     </ul>\
//                                 </div>\
//                             </div>\
//                         </slot>\
//                     </div>\
//                 </li>',
//     props:{
//         item:{
//             type:Object,
//             default:function(){
//                 return {}
//             }
//         }
//     },
//     data:function(){
//         return {
//             isFirst:true,
//             isLast:true,
//         }
//     },
//     mounted:function(){
//         this.$parent.setChildProps()
//         console.log('item')
//         console.log(this.item)
//     },
//     beforeDestroy:function(){
//             // this will be null
//         var $parent = this.$parent
//         this.$nextTick( function() {
//             $parent.setChildProps()
//         })
//     }
// })