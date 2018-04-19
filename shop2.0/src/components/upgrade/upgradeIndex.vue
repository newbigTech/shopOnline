<!-- 升级专区 => 首页[列表页] -->
<template>
    <div class="upgradeList" :style="{'min-height': (clientH * 10) + 'px'}">
       <!-- banner -->
       <div class="banner">
	  		<mt-swipe :showIndicators="showIndicators">
	          <mt-swipe-item v-for="(item,index) in bannerList" :key="index">
	            <img width="100%" height="100%" 
	                :src="item.broadcastingImageUrl"
	                :title="item.title" 
	                @click="$router.push(item.interlinkage)" />
	          </mt-swipe-item>
			</mt-swipe>
	  	</div>
	  	<div class="nav">
	  		<div class="nav-top">
		  		<div class="tabs" ref="navTabs">
		  			<span v-for="(item, index) in tabsList" @click="handleTabs(item.classifyId)"
		  				 :class="classifyId == item.classifyId ? 'active' : ''">
		  				{{item.classifyName}}
		  			</span>
		  		</div>
	  		</div>
	  		<div class="nav-con">
	  			<div class="nav-item" v-for="item in navConList">
	  				<!--<div class="goods-img">
	  					<img :src="item.goodsPic" @click="handleLinkUp('goods', item)" />
		  				<img src="/static/img/img-upgrade.png" />
		  				<img :src="item.maxUpgradeImgurl" @click="handleLinkUp('upGoods', item)" />
	  				</div>
	  				<div class="goods-title">{{item.goodsName}}</div>
	  				<div class="goods-prize">{{item.goodsPrice}}</div>-->
	  				<div class="goods-info">
	  					<div class="goods-img">
	  						<img :src="item.goodsPic" @click="handleLinkUp('goods', item)" />
	  					</div>
	  					<div class="goods-title">{{item.goodsName}}</div>
	  					<div class="goods-prize"><span>￥</span>{{item.goodsPrice}}</div>
	  				</div>
	  				<img src="/static/img/img-upgrade.png" class="img-upgrade" v-if="goodsType == 1" />
	  				<img src="/static/img/img-upgrade02.png" class="img-upgrade" v-if="goodsType == 2" />
	  				<div class="goods-info">
	  					<div class="goods-img">
	  						<img :src="item.maxUpgradeImgurl" @click="handleLinkUp('upGoods', item)" />
	  					</div>
		  				<div class="goods-title">{{item.maxGoodName}}</div>
	  					<div class="goods-prize"><span>￥</span>{{item.upgradePrice}}</div>
	  				</div>
	  			</div>
	  			<div class="load-more">
	  				<span v-if="total > navConList.length && total > pageSize" @click="loadMore">点击加载更多</span>
	  				<span v-if="total <= navConList.length && total > pageSize">没有更多了~</span>
  				</div>
	  		</div>
	  	</div>
	  	<!--<index-bar :currTab='currTab'></index-bar>-->
    </div>
</template>
<script>
//import indexBar from '@/components/tool/indexBar' //一级页面导航栏
export default {
    name: 'upgradeList', // 升级专区首页
    data() {
        return {
//      	currTab: '活动',
        	bannerList: [],
        	tabsList: [],
        	navConList:[],
        	pageNum: 1,
        	total: 0,
        	goodsType: 1,//类型（1：促销专区2：增值专区）
        	classifyId: '',//当前分类id
        	showIndicators: true,//是否显示轮播图的焦点
        }
    },
    components: {
//	  	'index-bar': indexBar
	},
    created() {
    	var goodsType = this.$route.query.goodsType;
    	if(goodsType != undefined) {
    		this.goodsType = parseInt(goodsType);
    		if(this.goodsType == 1) {
    			document.title = '促销专区';
    		} else {
    			document.title = '增值专区';
    		}
    	} else {
    		this.$router.go(-1);
    	}
    },
    mounted() {
        this.$nextTick(function() {
        	//默认选中第一项tab
        	this.getBanner();
        	this.getProCateList();
        });
    },
    methods: {
    	//获取banner
    	getBanner() {
    		var that = this;
			var reqUrl = this.baseUrl + '/mallBanner/banners';
			var params = {
				bannerCounts: 10
			}
			//banner图片类型（1:商城banner 2：升级商城banner 3：增值专区banner）
			if(this.goodsType == 1) {
				params.showLocation = '2';
			} else {
				params.showLocation = '3';
			}
			this.$http.get(reqUrl, {params: params})
			.then(function(res) {
				if(!res) {
					return;
				}
				that.bannerList = res.mallBannerList;
				if(that.bannerList.length <= 1) {
					that.showIndicators = false;
				}
 			});
    	},
    	//获取商品分类
    	getProCateList() {
    		var that = this,
				reqUrl = this.baseUrl + '/productCate/findProCateList';
			this.$http.get(reqUrl)
			.then(function(res) {
				if(!res) {
					return;
				}
				that.tabsList = res.proCates;
				
				var _upgradeClassfyId = localStorage.getItem('_upgradeClassfyId');
		    	if(_upgradeClassfyId != null) {
		    		that.classifyId = _upgradeClassfyId;
		    	} else {
		    		that.classifyId = that.tabsList[0].classifyId;
		    	}
				that.handleTabs(that.classifyId);
 			});
    	},
    	//品类切换
    	handleTabs(classifyId) {
    		localStorage.setItem('_upgradeClassfyId', classifyId);
    		
    		this.pageNum = 1;
    		this.navConList = [];
    		this.classifyId = classifyId;
    		this.getGoodsList();
    	},
    	//获取单个分类下的商品列表
    	getGoodsList() {
    		var that = this,
				reqUrl = this.baseUrl + '/product/findProductByType',
				params = {
					pageNum: this.pageNum,
					pageSize: this.pageSize,
					goodTypeId: this.classifyId,
					goodsType: this.goodsType
				}
			this.$http.get(reqUrl, {params: params})
			.then(function(res) {
				if(!res) {
					return;
				}
				if(that.pageNum == 1) {
					that.navConList = res.productList;
				} else {
					for(var i = 0;i < res.productList.length;i++) {
						var obj = res.productList[i];
						that.navConList.push(obj);
					}
				}
				that.total = res.total;
 			});
    	},
    	//加载更多
    	loadMore() {
    		this.pageNum++;
    		this.getGoodsList();
    	},
    	//进入升级商品详情页
    	handleLinkUp(param, item) {
    		var query = {'recordId': item.id};
    		if(param == 'goods') {
    			query.proCode = item.goodId;
    			query.type = 'upgrade';
    		} else {
    			query.proCode = item.maxUpgradeId;
    			query.type = 'maxUpgrade';
    		}
    		this.$router.push({
    			path: '/upDetail',
    			query: query
    		});
    	}
    }

}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style scoped>
.upgradeList {
	/*background: #fff;*/
	width: 100%;
	min-height: 10rem;
	background-image: url(../../../static/img/upgrade-btm.png);
	background-repeat: no-repeat;
	background-position-y: bottom;
	background-size: 100% auto;
	/*background: url(../../assets/img/upgradeIndex-bg.png);*/
}
.banner {
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 17.7rem;
	background: #ddd;
}
.nav {
	font-size: 1.3rem;
	padding-top: 17.7rem;
	/*padding-bottom: 4.9rem;*/
}
.nav-top {
	width: 100%;
	/*height: 4.7rem;*/
	height: 47px;
	white-space: nowrap;
	border-bottom: 0.05rem solid #d9d9d9;
	background: #fff;
	overflow: hidden;
}
.tabs {
	width: 100%;
	height: 52px;
	line-height: 45px;
	/*height: 5.2rem;
	line-height: 4.5rem;*/
	color: #333;
	font-size: 1.3rem;
	overflow-x: auto;
	clear: both;
}
.tabs > span {
	display: inline-block;
	/*height: 4.7rem;*/
	height: 45px;
	/*padding: 0 0.6rem;*/
	padding: 0 6px;
	margin: 0 1.8rem 0 1.8rem;
	cursor: pointer;
}
.tabs > span.active {
	/*height: 4.5rem;
	 border-bottom: 0.2rem solid #d4282d;*/
	height: 45px;
	border-bottom: 2px solid #d4282d;
	color: #d4282d;
	box-sizing: content-box;
}
.nav-con {
	/*width: calc(100% - 3.0rem);*/
	width: 100%;
	height: auto;
	min-height: 10.0rem;
	/*padding: 1.5rem;*/
	/*background: #f5f5f5;*/
	background-image: url(../../../static/img/upgrade-flower.png);
	background-repeat: no-repeat;
	background-position-x: right;
	background-size: 9.3rem 8.6rem;
}
.nav-item {
	display: flex;
	/*width: calc(100% - 4.4rem);*/
	/*padding: 1.3rem 2.2rem;*/
	width: calc(100% - 6.6rem);
	padding: 1.3rem 3.3rem 0 3.3rem;
	/*padding: 1.3rem 3.3rem 3rem 3.3rem;*/
	/*background: #fff;*/
	cursor: pointer;
	margin-bottom: 0.5rem;
	/*background-image: url(../../assets/img/upgradeIndex-border.png);*/
	/*background-size: 100% 100%;*/
	background-repeat: no-repeat;
	background-position-y: bottom;
	background-size: 30.0rem 5.6rem;
}
.nav-item:first-child {
	padding-top: 6.1rem;
}
.nav-item:nth-child(odd) {
	padding-bottom: 3.0rem;
	background-image: url(../../../static/img/upgrade-item-bg.png);
	background-position-x: right;
}
.nav-item:nth-child(even) {
	padding-bottom: 3.0rem;
	background-image: url(../../../static/img/upgrade-item-bg2.png);
	background-position-x: left;
}
.nav-item:nth-last-child(1),
.nav-item:last-child {
	background: #ff0000 !important;
	padding-bottom: 0;
	background-image: none;
}
.nav-item .goods-info {
	flex: 1;
	text-align: center;
	/*width: 14.2rem;
	height: 14.2rem;*/
}
.nav-item .goods-info .goods-img {
	/*width: 9.3rem;*/
	width: 100%;
	height: 9.0rem;
	/*height: 11.4rem;*/
	/*line-height: 11.4rem;*/
	text-align: center;
	vertical-align: middle;
}
.goods-img > img {
	width: auto;
	max-width: 100%;
	height: auto;
	max-height: 100%;
	vertical-align: middle;
}
.nav-item .goods-info .goods-title {
	width: 100%;
	height: 1.4rem;
	line-height: 1.5rem;
	margin: 1.2rem 0 1.0rem 0;
	font-size: 1.2rem;
	color: #333;
	word-break: break-all;
	/*text-overflow: ellipsis;*/
	/*white-space: nowrap;*/
	overflow: hidden;
}
.nav-item .goods-info .goods-prize {
	color: #d4282d;
	font-size: 1.4rem;
}
.nav-item .goods-info .goods-prize > span {
	font-size: 1.1rem;
	/*margin-right: 0.1rem;*/
}
.nav-item .img-upgrade {
	/*width: 5.6rem;
	height: 5.6rem;
	margin: 4.6rem 2.3rem;*/
	width: 7.9rem;
	height: 7.9rem;
	margin: 0 2.2rem;
}
@media only screen and (max-width: 350px) {
	.nav-item .goods-info .goods-img {
		height: 10rem;
		line-height: 10rem;
	}
	.nav-item .img-upgrade {
		width: 4.5rem;
		height: 4.5rem;
		margin: 4.2rem 2.1rem;
	}
}
.load-more {
	width: 100%;
	/*height: 5.0rem;*/
	/*line-height: 5.0rem;*/
	text-align: center;
	color: #666;
	font-size: 1.4rem;
	padding-bottom: 1.0rem;
	/*background-image: url(../../../static/img/upgrade-btm.png);*/
	/*background-size: 100% 100%;*/
	/*margin-top: -5.0rem;*/
	/*background: #fff;*/
	/*margin-bottom: 1.0rem;*/
}
</style>