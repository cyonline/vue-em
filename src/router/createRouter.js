import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './router'


Vue.use(VueRouter)

// vue-router 版本在3.0+加上以下代码
// const originalPush = VueRouter.prototype.push
// VueRouter.prototype.push = function push(location, onResolve, onReject) {
//   if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
//   return originalPush.call(this, location).catch(err => err)
// }


export default function createRouter(beforeEach,afterEach){
    const router = new VueRouter({
        mode: 'hash',
        routes,
    });
    return router;
}