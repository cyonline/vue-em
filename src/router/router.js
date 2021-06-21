// import Vue from 'vue'
// import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import test from '@/components/test'

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
    }
  
]
export default routes;
// export default new Router({
//   routes: 
// })
