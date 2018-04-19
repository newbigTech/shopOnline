<!-- 首页导航栏 -->
<template>
    <div class="home-tabs">
  		<template v-for="item in tabsList">
	  		<div :class="['tabs-item '] + [ tabsActive == item.title ? 'active' : '' ]" @click="handleTabs(item.title)">
	  			<i :class="['iconfont '] + [item.activeIconName]" v-if="tabsActive == item.title"></i>
	  			<i :class="['iconfont '] + [item.iconName]" v-else></i>
	  			<span>{{item.title}}</span>
	  		</div>
  		</template>
  	</div>
</template>
<script>
export default {
    name: 'navbar', // 结构名称
    data() {
        return {
           	tabsList: [
				{'iconName': 'icon-zhuye-1', 'activeIconName': 'icon-zhuye-', 'title': '首页'},
        		{'iconName': 'icon-shengji-', 'activeIconName': 'icon-shengji21', 'title': '活动'},
        		{'iconName': 'icon-fenlei-1', 'activeIconName': 'icon-fenlei-', 'title': '分类'},
        		{'iconName': 'icon-wode-1', 'activeIconName': 'icon-wode-', 'title': '我的'}
        	],
        	tabsActive: '首页' ,//底部导航栏选中值
        }
    },
    created() {
    },
    props: {
    	'currTab': {
    		type: String,
    		default: '首页'
    	}
    },
    mounted() {
        this.$nextTick(function() {
        	this.tabsActive = this.currTab;
        });
    },
    methods: {
    	//导航栏切换
    	handleTabs(val) {
    		localStorage.removeItem('_firstClassId');//删除当前选择的一级分类id（firstClass页面）
    		
    		this.tabsActive = val;
    		if(val == '首页') { this.$router.push('/'); }
    		else if(val == '活动') { this.$router.push('/areaIndex'); }
    		else if(val == '分类') { this.$router.push('/firstClass'); }
    		else { this.$router.push('/user'); }
    	}
    }
}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style scoped>
.home-tabs {
	position: fixed;
	bottom: 0;
	width: 100%;
	max-width: 54rem;
	height: 4.9rem;
	background: #fff;
	overflow: hidden;
	padding-bottom: constant(safe-area-inset-bottom);
}
.home-tabs .tabs-item {
	float: left;
	width: 25%;
	text-align: center;
	border-top: 0.05rem solid #dedede;
	cursor: pointer;
}
.tabs-item > i {
	display: block;
	font-style: normal;
	font-size: 2.2rem;
	margin: 0.7rem auto 0.6rem auto;
}
.tabs-item > span {
	color: #404040;
	font-size: 1.0rem;
}
.tabs-item.active span,
.tabs-item.active i {
	color: #ff4443;
}
</style>
