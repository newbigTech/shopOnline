// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/index.js'
Vue.use(ElementUI)

//字体文件
import '@/assets/font/iconfont.css' //图标字体
import '@/../static/plugin/font-awesome/css/font-awesome.css' //特殊字体
import '@/../static/plugin/bootstrap/css/bootstrap.css' //
import '@/../static/plugin/uniform/css/uniform.default.css' //
import '@/assets/css/components.css' //
import '@/../static/plugin/layout/css/layout.css' //

import axios from 'axios'
Vue.prototype.$http = axios

Vue.config.productionTip = false

import http from '@/util/http'  //请求参数
import config from '@/util/config'  //配置参数 和 公共函数

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
