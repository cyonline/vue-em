import HelloWorld from '@/components/HelloWorld'
import test from '@/components/test'
import layout from "@/components/layout/layout.vue";


import lookBoardRoutes from '@/router/modules/lookboardRoutes'

import IndexComponent from '@/views/index'
import LoginComponent from '@/views/index/login.vue'
// Vue.use(Router)

const routes = [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: LoginComponent,
    },
    {
      path: '/index',
      name: 'index',
      component: IndexComponent,
      children:[
        {
          path:'helloWorld', // 子路由不加/就会在父级路由后面添加路由,加了/会作为一个独立的路由
          name: 'helloWorld',
          component: HelloWorld
        },
        {
          path:'test',
          name: 'test',
          component: test
        },
      ]
    },
    {
      path: '/lookBoard',
      name: 'lookBoard',
      component: layout,
      children:lookBoardRoutes,
    },
    {
      path: '/engineerManage',
      name: 'engineerManage',
      component: layout,
      children:lookBoardRoutes,
    },
    // {
    //   path: '**',
    //   redirect: { name:'index'}
    // },
    
    // lookBoardRoutes,

]
// routes.push.apply(routes,lookBoardRoutes); // 注意其他路由模块注入方法


export default routes;
// export default new Router({
//   routes: 
// })
