import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './router'



// vue-router 版本在3.0+加上以下代码
// const originalPush = VueRouter.prototype.push
// VueRouter.prototype.push = function push(location, onResolve, onReject) {
//   console.info('xx')
//   if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
//   return originalPush.call(this, location,onResolve, onReject).catch(err => err)
// }

Vue.use(VueRouter)

export default function createRouter(beforeEach,afterEach){
    const router = new VueRouter({
        mode: 'hash',
        routes,
    });
    // 路由守卫
    router.beforeEach((to,from,next)=>{
      console.info(to,from)
      if(to.name!=='login'){
        let userName = window.localStorage.getItem('username')|| '';
        if(!userName){
          next({name:'login'})
        }else{
          next();
        }
      }else{
        next();
      }
    })
    return router;
}