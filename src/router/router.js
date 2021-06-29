// import Vue from 'vue'
// import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import test from '@/components/test'


import lookBoardRoutes from '@/router/modules/lookboardRoutes'

import IndexComponent from '../views/index'
// Vue.use(Router)

const routes = [
  
    {
      path: '/',
      name: 'index',
      component: IndexComponent
    },
    {
      path:'/test',
      name: 'test',
      component: test
    },
    // lookBoardRoutes,

]
routes.push.apply(routes,lookBoardRoutes); // 注意其他路由模块注入方法


export default routes;
// export default new Router({
//   routes: 
// })
