// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import Mint from 'mint-ui';
import 'mint-ui/lib/style.css'
Vue.use(Mint);

import '@/assets/fonts/iconfont/iconfont.css' //图标字体
import '@/assets/fonts/fzlantingheis-r-gbregular/stylesheet.css' //兰亭黑
import '@/assets/fonts/fzlantinghei-l-gbkregular/stylesheet.css' //兰亭细黑 

import http from '@/util/http' //请求参数
import config from '@/util/config' //配置参数 和 公共函数

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>'
})
