// Vue.component('flow-progress',{
//     name:'flow-progress',
//     template:'<div class="flow-progress-wrap"><ul><slot></slot></ul></div>',
//     props:{

//     },
//     methods:{
//         setChildProps:function () {
//             if(!this.$children){
//                 return
//             }
//             var len = this.$children.length
//             this.$children.forEach(function(child,index){
//                 child.isLast = index === len - 1 
//                 child.isFirst = index === 0
//             })
//         }
//     },
// })