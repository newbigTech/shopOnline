<!-- 加入购物车/立即购买 -->
<template>
    <div class="joinCart">
    	<!--<div class="header">
    		<header-bar></header-bar>
    	</div>-->
    	<div class="nav">
    		<div class="nav-top">
    			<img src="../../assets/img/img01.png" />
    			<div class="nav-top-right">
    				<div class="prize">
    					<span class="new-prize">价格：￥168</span>
    					<p class="old-prize">￥399</p>
    				</div>
    				<div class="info">
    					<span>已选择：</span>
    					<span v-for="item in choiseText">{{item}}</span>
    				</div>
    			</div>
    		</div>
    		<div class="choise">
    			<div class="choise-item" v-for="item in choiseList">
    				<h3 class="choise-title">{{item.title}}</h3>
    				<div class="choise-option">
    					<span class="choise-span" v-for="o in item.option" @click="handleLight(item, $event)">{{o}}</span>
    				</div>
    			</div>
    			<div class="num">	
    				<div class="num-title">数量</div>
    				<div class="num-operate">
    					<span @click="handleCount('remove')" :class="{'disable': choiseNum == 1}">-</span>
    					<span>{{choiseNum}}</span>
    					<span @click="handleCount('add')">+</span>
    				</div>
    			</div>
    		</div>
    	</div>
    	<div class="btm">
    		<button @click="$router.go(-1)">返回</button>
   			<button @click="handleBuy">立即购买</button>
   			<button @click="handleAdd">加入购物车</button>
   		</div>
    </div>
</template>
<script>
//import headerBar from '@/components/header/headerBar'	

export default {
    name: 'joinCart', 
    components: {
//	  	'header-bar': headerBar
	},
    data() {
        return {
        	choiseText: [],//已选择内容
        	choiseList:[
        		{'title': '颜色', 'option': ['松柏绿', '茶香粉']},
        		{'title': '尺寸', 'option': ['1.2M', '1.5M', '1.8M']}
        	],
        	choiseNum: '1',//选择数量
        }
    },
    mounted() {
        this.$nextTick(function() {
        	
        });
    },
    methods: {
    	//点亮样式
    	handleLight: function(item, e) {
    		for(var i = 0;i < this.choiseList.length;i++) {
    			if(item.title == this.choiseList[i].title) {
    				var op = document.getElementsByClassName('choise-item')[i].getElementsByClassName('choise-option')[0];
    				var opSpan = op.getElementsByTagName('span');
    				for(var j = 0;j < opSpan.length;j++) {
    					opSpan[j].className = "";
    				}
    			}
    		}
    		e.currentTarget.className = "active";
    		this.choiseText = e.currentTarget.innerHTML;
    	},
    	//计算
    	handleCount: function(param) {
    		//减
    		if(param == 'remove') {
    			if(this.choiseNum <= 1) {
    				return;
    			}
    			this.choiseNum--;
    		}
    		//加
    		if(param == 'add') {
    			this.choiseNum++;
    		}
    	},
    	//去购买
    	handleBuy: function() {
    		this.$router.push('/goBuy');
    	},
    	//加入购物车
    	handleAdd: function() {
    		this.$toast('已加入购物车');
    	}
    }

}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style scoped>
.nav {
	border-top: 0.1rem solid #ebebeb;
}
.nav-top {
	line-height: 2.0rem;
	padding: 1.5rem;
}
.nav-top > img {
	float: left;
	width: 8.5rem;
	height: 8.5rem;
	border-radius: 0.2rem;
	margin-right: 1.2rem;
}
.nav-top-right {
	padding-top: 2.2rem;
}
.nav-top-right .new-prize {
	color: #e93b3d;
	font-size: 1.5rem;
}
.nav-top-right .old-prize {
	color: #999;
	font-size: 1.2rem;
	text-decoration: line-through;
}
.nav-top-right .info {
	color: #333;
	font-size: 1.5rem;
}
.choise-item,
.num {
	padding: 1.6rem 1.4rem;
}
.choise-item .choise-title,
.num .num-title {
	font-size: 1.5rem;
	color: #242424;
	margin-bottom: 1.4rem;
}
.choise-item .choise-option span {
	display: inline-block;
	padding: 1.1rem 1.0rem;
	color: #333;
	font-size: 1.3rem;
	border-radius: 0.2rem;
	border: 0.1rem solid #7f7f7f;
	margin-right: 1.5rem;
}
.choise-item .choise-option span.active {
	color: #e93b3d;
	border: 0.1rem solid #e93b3d;
}
.num .num-operate {
	clear: both;
}
.num .num-operate span {
	float: left;
	height: 3.5rem;
	line-height: 3.5rem;
	text-align: center;
	color: #333;
}
.num .num-operate span:first-child,
.num .num-operate span:last-child {
	width: 4.7rem;
	border: 0.1rem solid #7f7f7f;
	font-size: 2.0rem;
}
.num .num-operate span:nth-child(2) {
	padding: 0 1.0rem;
	min-width: 4.4rem;
	border-top: 0.1rem solid #7f7f7f;
	border-bottom: 0.1rem solid #7f7f7f;
	font-size: 1.5rem;
}
.num .num-operate span.disable {
	border: 0.1rem solid #cdcdcd;
	border-right: 0.1rem solid #7f7f7f;
}
.btm {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 4.9rem;
	line-height: 4.9rem;
	background: #fff;
	border-top: 0.1rem solid #d9d9d9;
	padding-bottom: constant(safe-area-inset-bottom);
}
.btm button {
	float: left;
	width: 35%;
	height: 100%;
	background: #fff;
	color: #333;
	font-size: 1.5rem;
	text-align: center;
}
.btm button:nth-child(1) {
	width: 30%;
	height: 100%;
	background: #fff;
	border-right: 0.1rem solid #d9d9d9;
}
.btm button:nth-child(3) {
	background: #e93b3d;
	color: #fff;
}
</style>
