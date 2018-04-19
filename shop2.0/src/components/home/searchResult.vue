<!-- 搜索结果 -->
<template>
    <div class="searchClass">
    	<div class="operate">
    		<i class="iconfont">&#xe616;</i>
    		<input type="text" placeholder="升级保温杯" v-model="searchText"  @keydown="handleSearch($event)" />
    		<!--<span v-if="searchText ==''">取消</span>-->
    		<span @click="handleSearch">搜索</span>
    	</div>
    	<div class="nav">
    		<div class="nav-con">
    			<product-list></product-list>
    		</div>
    	</div>
    </div>
</template>
<script>
import productList from '@/components/class/productList' //商品列表
//import backTop from '@/components/tool/backTop' //回到顶部

export default {
    name: 'searchClass', // 搜索结果
    components: {
	  	'product-list': productList
	},
    data() {
        return {
        	searchText: '',
        }
    },
    mounted() {
        this.$nextTick(function() {
        	
        });
    },
    methods: {
    	//选择菜单
    	handleSelect: function(e) {
    		var spanArr = document.getElementsByClassName('nav-menu')[0].getElementsByTagName('span');
    		for(var i = 0;i < spanArr.length;i++) {
    			spanArr[i].className = '';
    		}
    		e.currentTarget.className = 'active'
    	},
    	//搜索
    	handleSearch: function() {
    		
    	}
    }
}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style scoped>
.nav { border-top: 0.1rem solid #ebebeb; }
.nav-menu { width: 100%; height: 3.5rem; line-height: 3.5rem; color: #333; font-size: 1.3rem; border-bottom: 0.1rem solid #ebebeb; overflow-x: auto; white-space: nowrap;    /*overflow-y: hidden;*/ }
.nav-menu > span { display: inline-block; height: 3.5rem; line-height: 3.5rem; padding: 0 0.6rem; margin-left: 1.3rem; }
.nav-menu > span.active { height: 3.3rem; border-bottom: 0.2rem solid #d4282d; color: #d4282d; }
.operate { position: relative; top: 0; left: 0; height: 3.1rem; line-height: 3.1rem; padding: 0.8rem 1.4rem; background: #fff; clear: both; }
.operate >i.iconfont { position: absolute; left: 2.6rem; top: 1.0rem; font-size: 1.4rem; }
.operate > input[type=text] { width: 85%; background: #ededed; border-radius: 0.5rem; padding-left: 3.3rem; font-size: 1.5rem; height: 3.2rem; }
.operate > span { float: right; color: #333; font-size: 1.5rem; }
</style>
