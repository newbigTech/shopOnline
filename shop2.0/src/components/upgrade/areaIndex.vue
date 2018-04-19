<!-- 专区列表 -->
<template>
    <div class="area-index" :style="{minHeight: (clientH * 10) + 'px'}">
    	<div class="area-index-con">
    		<div class="area-item" @click="handleLink('1')">
    			<img src="../../../static/img/img-prom.png" />
    		</div>
    		<div class="area-item" @click="handleLink('2')">
    			<img src="../../../static/img/img-incre.png" />
    		</div>
    	</div>
    	<index-bar :currTab="currTab"></index-bar>
    </div>
</template>
<script>
import indexBar from '@/components/tool/indexBar' //一级页面导航栏
export default {            
    name: 'areaIndex', // 专区列表
    components: {
	  	'index-bar': indexBar
	},
    data() {
        return {
        	currTab: '活动'
        }
    },
    created() {
    	document.title = '活动';
//		document.body.scrollTop = document.documentElement.scrollTop = 0;
    	
    	localStorage.removeItem('_upgradeClassfyId'); //upgradeIndex页面
    },
    mounted() {
        this.$nextTick(function() {
        });
    },
    methods: {
    	handleLink(param) {
    		var query;
    		if(param == '1') { //促销专区
    			query = { 'goodsType': '1' }
    		} else { //增值专区
    			query = { 'goodsType': '2' }
    		}
    		this.$router.push({
    			path: '/upgradeIndex',
    			query: query
    		})
    	}
    }

}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style scoped>
.area-index {
	background: #fff;
}
.area-index-con {
	padding: 1.5rem 1.2rem 4.9rem 1.5rem;
}
.area-item {
	margin: 0.3rem 0 1.2rem 0;
} 
.area-item,
.area-item > img {
	width: 100%;
}
</style>
