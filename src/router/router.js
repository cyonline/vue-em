import HelloWorld from '@/components/HelloWorld'
import test from '@/components/test'
import layout from "@/components/layout/layout.vue";


import lookBoardRoutes from '@/router/modules/lookboardRoutes'

import IndexComponent from '@/views/index'
// Vue.use(Router)

const routes = [
    {
      path: '/',
      redirect: '/lookBoard'
    },
    {
      path: '/index',
      name: 'index',
      component: IndexComponent,
      children:[
        {
          path:'helloWorld', // 子路由不加/就会在父级路由后面添加路由
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
      path: '**',
      redirect: { name:'index'}
    },
    
    // lookBoardRoutes,

]
// routes.push.apply(routes,lookBoardRoutes); // 注意其他路由模块注入方法


export default routes;
// export default new Router({
//   routes: 
// })
