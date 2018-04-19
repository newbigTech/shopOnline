<!-- 一级分类 -->
<template>
    <div class="firstClass">
    	<!--<div class="header">
    		<header-bar></header-bar>
    	</div>-->
    	<div class="search" @click="$router.push('/search')">
    		<p><i class="iconfont">&#xe616;</i>搜索商品</p>
    	</div>
    	<div class="nav" :style="{height: minNavH + 'px'}">
    		<div class="nav-left"><!-- :style="{height: minNavH + 'rem'}"-->
    			<ul ><!--:style="{height: minNavH + 'rem'}"-->
    				<li v-for="(item, $index) in classList" :id="'first' + $index" :class="{'active': item.isActive}" 
    					@click="handleSecond(item)">
    					{{item.className}}
    				</li>
    			</ul>
    		</div>
    		<div class="nav-right" ><!--:style="{height: minNavH + 'rem'}"-->
    			<div class="top-img">
    				<img :src="classImg" @click="handleClassLink" />
    			</div>
    			<div class="part">
    				<div class="part-title"><i>—</i>{{secondTitle}}<!--推荐区--><i>—</i></div>
    				<div class="part-con">
    					<div class="part-item" v-for="item in list" @click="handleLink(item)">
    						<img :src="item.classIcon" />
    						<h3>{{item.className}}</h3>
    					</div>
    				</div>
    			</div>
    		</div>
    	</div>
    	<index-bar :currTab="currTab"></index-bar>
    </div>
</template>
<script>
//import headerBar from '@/components/header/headerBar'	
import indexBar from '@/components/tool/indexBar' //一级页面导航栏

export default {
    name: 'firstClass', // 一级分类
    components: {
//	  	'header-bar': headerBar,
	  	'index-bar': indexBar
	},
    data() {
        return {
        	currTab: '分类',
        	minNavH: 0,
        	classList: [],
        	list: [],
        	typeCode: '',
        	secondTitle: '',
        	currentPage: 1,
        	classImg: '',//一级分类的banner图 
        	classLink: '',////一级分类的banner图
        }
    },
    created() {
    	var _firstClassId = localStorage.getItem('_firstClassId');
    	if(_firstClassId != null) {
    		this.typeCode = _firstClassId;
    	}
    },
    mounted() {
        this.$nextTick(function() {
        	document.title = '商品分类';
        	this.minNavH = (this.clientH * 10) - 45 - 49; //- 4.9;//3;
        	this.getFirstClass();
        });
    },
    methods: {
    	//获取一级分类
  		getFirstClass: function() {
			var that = this;
			var reqUrl = this.baseUrl + '/productInfo/getProTypesByLv';
			var params = {
//				currentPage: this.currentPage,
//				pageSize: 100,
				lv: '1'//分类种类（1.大类 2.小类）
			}
			this.$http.get(reqUrl, {params: params})
			.then(function(res) {
				if(!res) {
					return;
				}
				that.classList = res.types;
				var classObj = [];
				for(var i = 0;i < that.classList.length;i++) {
    				that.classList[i].isActive = false;
    				if(that.typeCode == '') {
						that.classList[0].isActive = true;
						classObj = that.classList[0];
					} else {
						if(that.classList[i].classId == that.typeCode) {
							that.classList[i].isActive = true;
							classObj = that.classList[i];
						}
					}
        		}
				
				that.secondTitle = classObj.className;
				that.typeCode = classObj.classId;
				that.classImg = classObj.classIcon;
				that.classLink = classObj.classLink;
				that.getSecondByFirst();
   			});
  		},
  		handleSecond: function(item) { 
  			this.typeCode = item.classId;
  			
  			for(var i = 0;i < this.classList.length;i++) {
  				this.classList[i].isActive = false;
  			}
  			item.isActive = true;
  			this.classImg = item.classIcon;
  			this.classLink = item.classLink;
  			this.secondTitle = item.className;
  			this.getSecondByFirst();
  			
  			localStorage.setItem('_firstClassId', this.typeCode);//存入当前选择的一级分类id
  		},
  		//一级分类banner图的链接
  		handleClassLink: function() {
  			this.$router.push({
  				path: this.classLink
  			});
  		},
  		//根据一级菜单获取对应的二级菜单
  		getSecondByFirst: function(item) {
  			var that = this;
			var reqUrl = this.baseUrl + '/productInfo/getSecondLvProTypes';
			var params = {
				typeCode: this.typeCode,//上级分类编号
				isShow: '1'//isShow=1时前端使用，不传时后台使用
			}
			this.$http.get(reqUrl, {params: params})
			.then(function(res) {
				if(!res) {
					return;
				}
				that.list = res.types;
   			});
  		},
  		//跳转到二级分类页面
    	handleLink: function(item) {
    		var query = {
    			'firstClassId': item.classNId,
	  			'secondClassId': item.classId
	  		}
	  		this.$router.push({
	  			query: query,
	  			path: '/secondClass'
	  		});
    	}
    }

}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style scoped>
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
.nav {
	display: flex;
	border-top: 0.05rem solid #d9d9d9;
	color: #333;
	font-size: 1.5rem;
	overflow: hidden;
}
.nav-left {
	width: 8.5rem;
	border-right: 0.05rem solid #d9d9d9;
	overflow: hidden;
}
.nav-left > ul {
	width: 9.1rem;
	height: 100%;
	padding: 1.0rem 0;
	overflow-x: hidden;
	overflow-y: auto;
}
.nav-left > ul > li {
	margin: 2.0rem 0;
	padding: 0.4rem 0;
	text-align: center;
	font-size: 1.5rem;
}
.nav-left > ul > li.active
/*,.nav-left > ul > li:first-child*/ {
	border-left: 0.3rem solid #d4282d;
	color: #d4282d;
}
.nav-right {
	flex: 1;
	background: #fff;
	overflow-y: auto;
}
.nav-right .top-img {
	width: 90%;
	height: 9.0rem;
	margin: 1.5rem auto;
}
.nav-right .top-img > img {
	width: 100%;
	height: 100%;
	border-radius: 0.2rem;
	background: #dcdcdc;
}
.nav-right .part {
	padding: 0.5rem 1.0rem;
}
.nav-right .part .part-title {
	text-align: center;
	font-size: 1.2rem;
}
.nav-right .part .part-title > i {
	color: #d4d4d4;
	margin: 0 1.0rem;
}
.nav-right .part .part-con {
	width: 100%;
	clear: both;
}
.part-con .part-item {	
	float: left;
	width: 33.3%;
	text-align: center;
	margin: 2.6rem auto 1.7rem auto;
}
.part-con .part-item > img {
	width: 4.0rem;
	height: 4.0rem;
	border-radius: 4.0rem;
	background: #dcdcdc;
}
.part-con .part-item > h3 {
	width: 100%;
	height: 1.3rem;
	line-height: 1.3rem;
	color: #333;
	font-size: 1.3rem;
	margin-top: 1.0rem;
	overflow: hidden;
}
</style>
