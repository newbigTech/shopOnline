<template>
    <div id="app" :style="{'min-height': clientH *10 +'px'}">
        <router-view/>
        <!-- 回到顶部 -->
        <back-top></back-top>
        
        <!-- 快速导航栏 -->
   		<nav-bar></nav-bar>
    </div>
</template>
<script>
import backTop from '@/components/tool/backTop' //回到顶部
import navbar from '@/components/tool/navbar' //快速导航栏
export default {
    name: 'app',
    data() {
    	return {
    	}
    },
    components: {
	  	'back-top': backTop,
	  	'nav-bar': navbar
	},
    created() {
       	document.body.scrollTop = document.documentElement.scrollTop = 0;
       	
       	//清空 首页侧边栏展示会出现的样式
       	document.getElementById('app').style.position = null;
       	document.getElementById('app').style.top = null;
    },
    mounted() {
        this.$nextTick(function() {
            //禁止复制
            document.body.onselectstart = document.body.oncontextmenu = function() { return false; };
            document.title = this.title;
            
            //第三方客服
//         const s = document.createElement('script');
//         s.type = 'text/javascript';
//         s.src = 'https://qiyukf.com/script/f66be35e85026afe562d310df49518f8.js';
//         document.body.appendChild(s);
//          
        });
    }
}

</script>
<style>
@import './assets/css/reset.css';
@import './assets/css/base.css';

#app {
	width: 100%;
    font-family: "Microsoft YaHei";
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #333;
}

</style>
