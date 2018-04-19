// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/index.js'
Vue.use(ElementUI)

// 字体文件
   import '@/assets/font/iconfont/iconfont.css' //图标字体
import '@/../static/plugin/font-awesome/css/font-awesome.css' //特殊字体
import '@/../static/plugin/bootstrap/css/bootstrap.css' // bootstrp.css 栅格系统 => 响应式样式
import '@/../static/plugin/uniform/css/uniform.default.css' // 皮肤样式
import '@/assets/css/components.css'  // 是是是
import '@/../static/plugin/layout/css/layout.css' // 皮肤弹框样式

import axios from 'axios'
Vue.prototype.$http = axios

Vue.config.productionTip = false

import http from '@/util/http'  // 请求参数
import config from '@/util/config'  // 配置参数 和 公共函数

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
