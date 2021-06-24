import Vue from 'vue'
import App from './App'
// import routes from './router/router'
import createRouter from './router/createRouter'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'; //注意别掉了
import './style/common.css';
import './style/common@hyk.css';
import './style/normalize.css';

import './style/common.less';

import * as Base from './utils/base'
import axios from 'axios'
import store from './store'
require('./mock')
Vue.prototype.$Base = Base;
Vue.prototype.$http = axios;

Vue.use(ElementUI);
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router:createRouter(),

  render: h => h(App)
})
