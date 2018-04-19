<!-- 二级分类 -->
<template>
    <div class="secondClass">
    	<!--<div class="header">
    		<header-bar></header-bar>
    	</div>-->
    	<div class="search" @click="$router.push('/search')">
    		<p><i class="iconfont">&#xe616;</i>搜索商品</p>
    	</div>
    	<div class="nav">
    		<div class="nav-menu" v-if="secondClassList.length > 0">
    			<div class="nav-menu-con">
    				<span v-for="(item, $index) in secondClassList" :id="'second' + $index" 
    					:class="{'active': item.isActive}"  @click="handleSelect($event, item)" >
    					 <!--:class="{'active':secondClassId == undefined && $index == 0}"--> 
    					{{item.className}}
    				</span>
    			</div>
    		</div>
    		<div class="nav-con">
    			<product-list :classId="classCode"></product-list>
    		</div>
    	</div>
    </div>
</template>
<script>
//import headerBar from '@/components/header/headerBar'
import productList from '@/components/class/productList' //商品列表

export default {
    name: 'secondClass', // 二级分类
    components: {
//	  	'header-bar': headerBar,
	  	'product-list': productList
	},
    data() {
        return {
        	selectMenu: 1,
        	secondClassList: [],
        	firstClassId: '',
        	secondClassId: '',
        	classCode: '',//商品二级分类CODE
        }
    },
    watch: {
    	$route: function(a, b) {
    		this.secondClassId = this.$route.query.secondClassId;//二级分类id
    		this.getSecondClass();
    	}
    },
    created() {
//	      document.body.scrollTop = document.documentElement.scrollTop = 0;
    },
    mounted() {
        this.$nextTick(function() {
        	document.title = '商品列表';
        	var firstClassId = this.$route.query.firstClassId; //一级分类id
        	this.secondClassId = this.$route.query.secondClassId; //二级分类id
        	if(firstClassId != undefined) {
        		this.firstClassId = firstClassId;
        		this.getSecondClass();
        	} else {
        		this.$router.go(-1);
        	}
        });
    },
    methods: {
    	//选择菜单
    	handleSelect: function(e, item) {
    		var spanArr = document.getElementsByClassName('nav-menu')[0].getElementsByTagName('span');
    		for(var i = 0;i < spanArr.length;i++) {
    			spanArr[i].className = '';
    		}
    		e.currentTarget.className = 'active';
    		
    		this.classCode = item.productTypeCode; //商品列表传的参数 (商品二级分类code)
    		
    		this.$router.push({
    			path: '/secondClass',
    			query: {'firstClassId': this.firstClassId,'secondClassId': item.classId}
    		});
    	},
    	//获取二级分类
    	getSecondClass: function() {
    		var that = this;
			var reqUrl = this.baseUrl + '/productInfo/getSecondLvProTypes'
			var params = {
				typeCode: this.firstClassId,
				isShow: '1'//isShow=1时前端使用，不传时后台使用
			}
			this.$http.get(reqUrl, {params: params})
			.then(function(res) {
				if(!res) { return; }
				that.secondClassList = res.types;
				for(var i = 0;i < that.secondClassList.length;i++) { 
					that.secondClassList[i].isActive = false;
				}
				
				if(that.secondClassId != undefined) {
	        		for(var i = 0;i < that.secondClassList.length;i++) {
	        			if(that.secondClassList[i].classId == that.secondClassId) {
	        				that.secondClassList[i].isActive = true;
	        				that.classCode = that.secondClassList[i].productTypeCode;
	        			}
	        		}
        		} else {
	        		that.secondClassList[0].isActive = true;
	        		that.classCode = that.secondClassList[0].productTypeCode;
	        	}
   			});
    	}
    }
}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style scoped>
.nav {
	border-top: 0.1rem solid #ebebeb;
}
.nav-menu {
	width: 100%;
	height: 3.5rem;
	line-height: 3.5rem;
	color: #333;
	font-size: 1.3rem;
	border-bottom: 0.05rem solid #ebebeb;
	white-space: nowrap;
	overflow: hidden;
}
.nav-menu .nav-menu-con {
	width: 100%;
	height: 4.0rem;
	overflow-x: auto;
	overflow-y: hidden;
}
.nav-menu .nav-menu-con > span {
	display: inline-block;
	height: 3.5rem;
	line-height: 3.5rem;
	padding: 0 0.6rem;
	margin-left: 1.3rem;
}
.nav-menu .nav-menu-con > span.active {
	height: 3.37rem;
	border-bottom: 0.2rem solid #d4282d;
	color: #d4282d;
}
.search {
	/*height: 3.0rem;
	 padding: 0.7rem 1.0rem;*/
	height: 32px;
	padding: 7px 10px;
}
.search > p {
	width: 100%;
	/*height: 3.2rem;
	line-height: 3.2rem;*/
	height: 32px;
	line-height: 32px;
	margin: 0 auto;
	background: #ededed;
	border-radius: 0.5rem;
	font-size: 1.4rem;
	text-align: center;
	color: #999;
}
.search > p > i {
	font-size: 1.4rem;
	color: #666;
	margin-right: 0.7rem;
}
</style>
