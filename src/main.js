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
import './style/layout.css';

import * as Base from './utils/base'
import utils from './utils/utils'
import webConfig from './utils/config'

import axios from 'axios'
import http from './utils/http'
import store from './store'
require('./mock')
import * as echarts from 'echarts'; // 引入方式要注意  同 const echarts = require('echarts')

Vue.prototype.$Base = Base;
Vue.prototype.$request = axios;
Vue.prototype.$echarts = echarts;
Vue.prototype.$utils = utils;
Vue.prototype.$webConfig = webConfig;
Vue.prototype.$http = http;

Vue.use(ElementUI);
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router:createRouter(),
  render: h => h(App)
})
