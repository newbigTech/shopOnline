<!-- 首页 -->
<template>
    <div class="home">
    	<header-bar :isHome="isHome"></header-bar>
        <!-- banner -->
        <div class="banner">
            <mt-swipe :showIndicators="showIndicators">
                <mt-swipe-item v-for="(item,index) in bannerList" :key="index">
                    <img width="100%" height="100%" :src="item.broadcastingImageUrl" :title="item.title" @click="$router.push(item.interlinkage)" />
                </mt-swipe-item>
            </mt-swipe>
        </div>
        <!-- 播报 -->
        <div class="broadcast">
        	<div class="broadcast-con">
	        	<i class="iconfont icon-xiaoxi"></i>
	        	<span>{{noteContent}}</span>
        	</div>
        </div>
        <div class="spacing"></div>
        <!-- 频道 -->
        <div class="menu">
            <ul>
                <li v-for="item in channelList" @click="handleLink(item)">
                    <!--<span class="iconfont icon">&#xe6ca;</span>-->
                    <img :src="item.icon" />
                    <p>{{item.name}}</p>
                </li>
            </ul>
        </div>
        <!-- 专区 -->
        <div class="spacing"></div>
        <div class="area">
            <div class="area-item" @click="$router.push('/upgradeIndex?goodsType=1')">
                <h3>促销专区</h3>
                <p>积分换好礼</p>
                <img src="../../assets/img/img-prom.png" />
            </div>
            <div class="area-item" @click="$router.push('/upgradeIndex?goodsType=2')">
                <h3>增值专区</h3>
                <p>代金券购好礼</p>
                <img src="../../assets/img/img-incre.png" />
            </div>
        </div>
        <!-- 楼层 -->
        <template v-for="item in floorList">
        	<div class="spacing"></div>
        	<!-- 普通楼层 -->
        	<template v-if="item.type == '1'">
	            <div class="floor">
	            	<div class="floor-title">
	            		<h2>{{item.exhibitionTitle}}</h2>
		                <div class="floor-icon">
		                	<img :src="item.icon" />
		                </div>
	            	</div>
	                <product-list :exhibitionId="item.exhibitionId"></product-list>
	            </div>
            </template>
            <!-- 品牌直供 -->
            <template v-if="item.type == '2'">
	            <div class="floor floor-brand">
	            	<div class="floor-title">
	            		<h2>{{item.exhibitionTitle}}</h2>
	            		<div class="floor-icon">
		                	<img :src="item.icon" />
		                </div>
	            	</div>
	                <div class="brand-con" v-for="brandObj,index in brandInfoList">
		                <div class="brand-img"  @click="handleBrand(brandObj)">
		                	<img :src="brandObj.homeBanner" />
		                </div>
		                <div class="brand-goods" v-if="brandObj.brandList.length > 0">
		                	<div class="bgs-item" v-for="goods in brandObj.brandList" @click="handleDetail(goods.proCode)">
		                		<div class="bgs-item-img">
		                			<img :src="goods.imgPath" />
		                		</div>
		                		<h3>{{goods.proTitle}}</h3>
		                		<p><i>￥</i>{{goods.proSalePrice}}</p>
		                	</div>
		                </div>
		                <div class="spacing12" v-if="index < (brandInfoList.length - 1)"></div>
	                </div>
	            </div>
            </template>
        </template>
        <!-- 首页下方导航栏 -->
        <div class="h49"></div>
        <index-bar></index-bar>
        <!--领取优惠券-->
        <div class="coupon" :style="{'display':coupon.display,'overflow':coupon.overflow}">
        	<div class="pic">
        		<img :src="receiveImg" @click="$router.push('/registerArea')" />
        		<span class="close" @click="couponClose">
        			<img src="../../assets/img/coupon2.png" alt="" />
        		</span>
        	</div>
        </div>
    </div>
</template>
<script>
import headerBar from '@/components/header/headerBar'
import productList from '@/components/class/productList' //商品列表
import indexBar from '@/components/tool/indexBar' //一级页面导航栏

export default {
    name: 'home',
    components: {
        'header-bar': headerBar,
        'product-list': productList,
        'index-bar': indexBar
    },
    data() {
        return {
        	isHome: true, //是否为首页头部
            bannerList: [],
            toTop: false, //回到顶部
            channelList: [], //频道数据
            floorList: [], //楼层
            coupon:{"display":"none","overflow":"auto"},//优惠券弹框
            receiveImg: '',
            noteContent: '',//播报内容
            brandInfoList: [],//品牌楼层信息和楼层元素信息
            showIndicators: true,//是否显示轮播图的焦点
        }
    },
    created() {
        var that = this,
            _date = new Date();
//      this.bannerList = JSON.parse(sessionStorage.getItem('BANNER' + _date.getMonth() + _date.getDate()));
//      this.channelList = JSON.parse(sessionStorage.getItem('CHANNEL' + _date.getMonth() + _date.getDate()));
//      this.floorList = JSON.parse(sessionStorage.getItem('FLOOR' + _date.getMonth() + _date.getDate()));
//      if (this.bannerList == null) {
//          this.getBanner();
//      }
//      if (this.channelList == null) {
//          this.getChannel();
//      }
//      if (this.floorList == null) {
//          this.getFloor();
//      }
//		this.loadCoupon();
    },
    mounted() {
		this.$nextTick(function() {
			document.title = this.title;
			this.getBanner();
			this.loadCoupon();
		})
    },
    destroyed() {
        //清空 首页侧边栏展示会出现的样式
//      document.getElementById('app').style.position = null;
//      document.getElementById('app').style.top = null;
        var _date = new Date();
//      console.log('准备删除 sessionStorage');
        // sessionStorage.removeItem('BANNER' + _date.getMonth() + _date.getDate())
        // sessionStorage.removeItem('CHANNEL' + _date.getMonth() + _date.getDate())
        // sessionStorage.removeItem('FLOOR' + _date.getMonth() + _date.getDate())
       
    },
    methods: {
    	/* 加载优惠券 */
    	loadCoupon() {
    		if(this.userInfo == null) {
    			return;
    		}
    		if(this.userInfo.couponId == null) {
    			return;
    		}
    		var couponHadView = localStorage.getItem('couponHadView');
			if(couponHadView != null) {
				this.coupon.display = 'none';
	    		this.coupon.overflow = 'auto';	
			} else {
				localStorage.setItem('couponHadView', 'already');
				this.receiveImg = this.userInfo.receiveImg;
				this.coupon.display = 'block';
	    		this.coupon.overflow = 'hidden';
			}
    	},
        /**
         * 跳转到 我的
         * @return {[type]} [description]
         */
        handleMy: function() {
            if (!this.userInfo) {
                this.$toast('请先登录');
                return this.$router.push('/login');
            }
            this.$router.push({ name: 'MyUser' })
        },
        //获取banner
        getBanner: function() {
            var that = this,
                _date = new Date();
            this.$http.get(this.baseUrl + '/mallBanner/banners', {
                params: { bannerCounts: 10, showLocation: '1' } //1:商城首页 2：促销专区 3：增值专区)
            }).then(function(res) {
            	that.getBroadcast();
                if (!res) { return; }
                that.bannerList = res.mallBannerList;
                if(that.bannerList.length <= 1){that.showIndicators = false;}
                sessionStorage.setItem('BANNER' + _date.getMonth() + _date.getDate(), JSON.stringify(that.bannerList));
            });
        },
        //获取播报内容
        getBroadcast() {
        	var that = this;
            this.$http.get(this.baseUrl + '/notice/findAnnouncement', { params: {} }).then(function(res) {
            	that.getChannel();
                if (!res) { return; }
                that.noteContent = res.note_content;
            });
        },
        //获取商城频道
        getChannel: function() {
            var that = this,
                _date = new Date();
            this.$http.get(this.baseUrl + '/mallChannel/channels', { params: { channelCounts: 8 } }).then(function(res) {
            	that.getFloor();
                if (!res) { return; }
                that.channelList = res.channels;
                sessionStorage.setItem('CHANNEL' + _date.getMonth() + _date.getDate(), JSON.stringify(that.channelList));
            });
        },
        //获取商城展示楼层
        getFloor: function() {
            var that = this,
                _date = new Date();
            this.$http.get(this.baseUrl + '/mallExhibition/getExhibition', { params: {} }).then(function(res) {
            	that.getBrandList();
                if (!res) { return; }
                that.floorList = res.mallExhibitions;
                sessionStorage.setItem('FLOOR' + _date.getMonth() + _date.getDate(), JSON.stringify(that.floorList));
            });
        },
        //查询品牌主楼楼层元素
        getBrandList() {
        	var that = this;
            this.$http.get(this.baseUrl + '/brand/findBrandProductInfo', { params: {} }).then(function(res) {
                if (!res) { return; }
                that.brandInfoList = res.brandInfoList;
            });
        },
        //跳转品牌详情
        handleBrand(brandObj) {
        	this.$router.push({
        		path: '/brandDetail',
        		query: {
        			brandId: brandObj.brandId //品牌id
        		}
        	});
        },
        //跳转到商品详情
    	handleDetail(proCode) {
    		this.$router.push({
    			path: '/pdDetails',
    			query: {
    				proCode: proCode
    			}
    		});
    		if(!this.userInfo) { //没有登录时，足迹缓存到本地
    			var _myFootprint = JSON.parse(localStorage.getItem('_myFootprint'));
    			var currTime = this.setDateFormat(new Date(),'time');
    			if(_myFootprint != null) {
    				for(var i = 0;i < _myFootprint.length;i++) {
	    				if(_myFootprint[i].proCode == proCode) {
	    					_myFootprint.splice(i, 1);
	    				}
	    			}
	    			_myFootprint.splice(0, 0, {'proCode': proCode, 'time': currTime});
    				
    			} else {
    				_myFootprint = [{'proCode': proCode,  'time': currTime}];
    			}
      			localStorage.setItem('_myFootprint', JSON.stringify(_myFootprint)); 
				return;
			}
    		this.handleAddFoot(proCode);//添加足迹
    	},
    	//新增我的足迹
    	handleAddFoot: function(productId) {
    		var that = this;
			var reqUrl = this.baseUrl + '/myFootprint/addMyFootprint';
			var params = {
				productId: productId
			}
			this.$http.post(reqUrl, params)
			.then(function(res) {
				if(!res) {
					return;
				}
				if(res.result != 'success') {
					return;
				}
 			});
    	},
        //链接
        handleLink: function(item) {
            if (item.name == '我的' || item.name == '积分乐园' || item.name == '我的订单') {
                if (!this.userInfo) {
                    this.$toast('请先登录');
                    return this.$router.push('/login');
                }
            }
            this.$router.push(item.link);
        },
        //优惠券领取
        couponGet:function() {
        	var reqUrl = this.baseUrl + '/coupon/addCouponInfo',
				that = this,
				params = {couponId: this.userInfo.couponId};
			this.$http.post(reqUrl, params).then(function(res) {
				if(!res) {return;}
				that.$toast('领取成功');
				that.coupon.display = 'none';
        		that.coupon.overflow = 'auto';
			})
        	
        },
        //优惠券关闭
        couponClose:function() {
        	this.coupon.display = 'none';
        	this.coupon.overflow = 'auto';
        }
    }
}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style scoped>
.home {
    position: relative;
    top: 0;
    left: 0;
}

.header {
    background: #fff;
}

.banner {
    position: absolute;
    left: 0;
    top: 4.5rem;
    width: 100%;
    /*height: 17.7rem;*/
    height: 22.0rem;
    background: #ddd;
}
.broadcast {
	margin-top: 22rem;
	height: 3.5rem;
	line-height: 3.5rem;
}
.broadcast i.icon-xiaoxi {
	position: absolute;
	left: 0;
	top: 0;
	display: inline-block;
	width: 4.4rem;
	height: 100%;
	background-color: #ffffff;
	box-shadow: 1px 0 0 0 #e5e5e5;
	text-align: center;
	color: #fe4a4a;
	background: #fff;
	z-index: 10;
}
.broadcast-con { 
	position: relative; 
	top: 0; 
	width: 100%; 
	height: 3.5rem;
	line-height: 3.5rem;
	background-color: #fff; 
	overflow: hidden; 
}
.broadcast-con:before{ 
	content: ''; 
	display: block; 
	position: absolute; 
	width: 4.4rem; 
	height: 100%; 
	top: 0;
	left: 0; 
}
.broadcast-con span { 
	position: absolute; 
	min-width: calc(100% - 4.5rem); 
	width: auto; 
	display: inline-block; 
	line-height: 3.5rem; 
	font-size: 1.3rem; 
	color: #361d03; 
	white-space: nowrap; 
    animation-name: notice; 
    animation-duration: 28s; 
    animation-play-state: running; 	
    animation-timing-function: linear; 
    animation-delay: .2s; 
    animation-iteration-count: infinite; 
    animation-direction: normal;
}
@keyframes notice {
	0% {
		left: calc(100%); 
		right: auto;
	}
	100% { 
		left: -200%; 
		right: auto; 
	}
}
.menu {
    /*margin-top: 17.7rem;*/
    /*margin-top: 22rem;*/
    background: #fff;
    clear: both;
}

.menu ul {
    padding: 0.8rem 0 1.2rem 0;
    overflow: hidden;
}

.menu ul li {
    position: relative;
    top: 0;
    left: 0;
    float: left;
    width: 17%;
    margin: 0 4%;
    text-align: center;
    border-radius: 0.6rem;
}

/*.menu ul li:hover {
    background: #f5f5f5;
}*/

.menu ul li>img {
    display: inline-block;
    /*width: 3.6rem;
    height: 3.6rem;
    line-height: 3.6rem;*/
    width: 2.2rem;
    height: 2.35rem;
    line-height: 2.35rem;
    margin-top: 0.4rem;
    /*border-radius: 3.6rem;*/
}

.menu ul li:nth-child(3)>img {
    width: 2.4rem;
}

.menu ul li .icon {
    display: inline-block;
    width: 3.6rem;
    height: 3.6rem;
    line-height: 3.6rem;
    border-radius: 3.6rem;
    color: #fff;
    font-size: 1.7rem;
    font-weight: lighter;
}

.menu ul li>p {
    /*margin-top: 0.7rem;*/
    margin-top: 0.8rem;
    /*line-height: 2.8rem;*/
    color: #333;
    font-size: 1.1rem;
}

.menu ul li:nth-child(1) .icon {
    border: 0.05rem solid #ffa749;
    background: #ffcd97;
    font-size: 1.6rem;
    line-height: 3.6rem;
}

.menu ul li:nth-child(2) .icon {
    border: 0.05rem solid #77bfee;
    background: #a9d9f8;
}

.menu ul li:nth-child(3) .icon {
    border: 0.05rem solid #ff696c;
    background: #ffa3a4;
}

.menu ul li:nth-child(4) .icon {
    border: 0.05rem solid #88aeff;
    background: #b8ceff;
}

.menu ul li:nth-child(5) .icon {
    border: 0.05rem solid #8ae6a9;
    background: #b0eec5;
}

.menu ul li:nth-child(6) .icon {
    border: 0.05rem solid #c39dfd;
    background: #d7bbfe;
}

.menu ul li:nth-child(7) .icon {
    border: 0.05rem solid #88aeff;
    background: #b8ceff;
    line-height: 3.9rem;
}

.menu ul li:nth-child(8) .icon {
    border: 0.05rem solid #ff696c;
    background: #ffa3a4;
    font-size: 2.0rem;
}

.area {
    display: flex;
    width: 100%;
    height: 17.5rem;
    background: #f5f5f5;
}

.area .area-item {
    flex: 1;
    height: 100%;
    text-align: center;
    background: #fff;
    margin-right: 0.5rem;
}

.area .area-item:last-child {
    margin-right: 0;
}

.area-item>h3 {
    height: 1.35rem;
    font-family: 'MicrosoftYaHeiLight';
    font-size: 1.4rem;
    letter-spacing: 0.1rem;
    color: #1a1a1a;
    margin-top: 2.9rem;
    margin-bottom: 1.05rem;
}

.area-item>p {
    height: 1.15rem;
    font-family: 'MicrosoftYaHeiLight';
    font-size: 1.2rem;
    letter-spacing: 0.1rem;
    color: #999999;
}

.area-item:nth-child(1)>img {
    width: 7.95rem;
    height: 4.65rem;
    margin-top: 3.6rem;
}

.area-item:nth-child(2)>img {
    width: 8.55rem;
    height: 5.25rem;
    margin-top: 3.0rem;
}

.floor,
.hot,
.like {
    display: block;
    background: #fff;
    /*margin-top: 1.0rem;*/
    clear: both;
}

/*.floor>h2,*/
.hot>h2,
.like>h2 {
    font-size: 1.5rem;
    padding: 2.3rem 0 1.9rem 0;
    /*height: 5.5rem;*/
    /*line-height: 5.5rem;*/
    text-align: center;
}
.floor .floor-title {
	padding: 1.0rem 0;
	height: 3.3rem;
	background-image: url(../../assets/img/brand-top-bg.png);
	background-size: 100% 2.6rem;
	background-repeat: no-repeat;
	background-position-x: center;
	background-position-y: 0.8rem;
	text-align: center;
}
.floor-title > h2 {
	font-size: 1.5rem;
	margin-top: 0.3rem;
	margin-bottom: 0.3rem;
	background: transparent;
}
.floor-icon > img {
	width: auto;
	max-width: 1.6rem;
	height: auto;
	max-height: 1.6rem;
}
.floor-brand .brand-img {
	/*margin-bottom: 1.2rem;*/
}
.floor-brand .brand-img,
.floor-brand .brand-img>img {
	width: 100%;
	height: 14rem;
}
.brand-goods {
	display: flex;
	width: calc(100% - 2.4rem);
	/*padding: 0.2rem 0;*/
	margin: 1.2rem 1.2rem 0 1.2rem;
	overflow-x: auto;
}
.bgs-item {
	flex: 1;
	max-width: 11.3rem;
	text-align: center;
	margin-right: 0.8rem;
}
.bgs-item:last-child {
	margin-right: 0;
}
.bgs-item .bgs-item-img {
	width: 11.3rem;
	height: 11.5rem;
	text-align: center;
	vertical-align: middle;
}
.bgs-item .bgs-item-img > img {
	width: auto;
	height: auto;
	max-width: 11.3rem;
	max-height: 11.5rem;
}
.bgs-item > h3 {
	width: 100%;
	height: 1.2rem;
	line-height: 1.26rem;
	color: #1a1a1a;
	font-size: 1.2rem;
	margin-top: 0.4rem;
	margin-bottom: 0.4rem;
	overflow: hidden;
}
.bgs-item > p {
	color: #d4282d;
	font-size: 1.2rem;
	margin-bottom: 1.2rem;
}
.bgs-item > p >i {
	font-size: 1.1rem;
	font-style: normal;
}
.spacing,
.spacing12 {
    width: 100%;
    background: #f5f5f5;
}
.spacing {
	height: 1.0rem;
}
.spacing12 {
    height: 1.2rem;
    /*margin-bottom: 1.2rem;*/
}
.h49 {
    width: 100%;
    height: 4.9rem;
}

/*.home-tabs {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 4.9rem;
    background: #fff;
    overflow: hidden;
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
    width: 2.3rem;
    height: 2.2rem;
    font-style: italic;
    background-image: url(../../../static/img/icons-index.png);
    background-repeat: no-repeat;
    margin: 0.7rem auto 0.6rem auto;
}
i.icon-home {
    background-position: 0 0;
}
i.icon-upgrade {
    background-position: 0 -6.5rem;
}
i.icon-class {
    background-position: 0 -13.1rem;
}
i.icon-my {
    background-position: 0 -19.7rem;
}
.tabs-item > span {
    color: #404040;
    font-size: 1.0rem;
}
.tabs-item.active i.icon-home {
    background-position: -5.3rem 0;
}
.tabs-item.active i.icon-upgrade {
    background-position: -5.3rem -6.5rem;
}
.tabs-item.active i.icon-class {
    background-position: -5.3rem -13.1rem;
}
.tabs-item.active i.icon-my {
    background-position: -5.3rem -19.7rem;
}
.tabs-item.active > span {
    color: #ff4443;
}*/
.coupon{
	width: 100%;
	height: 100%;
	position: fixed;
	left: 0;
	top: 0;
	background: rgba(0,0,0,0.45);
	z-index: 1001;
}
.coupon .pic{
	padding-top: 10.5rem;
	text-align: center;
	position: relative;
}
.coupon  .pic>img{
	width: calc(100% - 4.3rem);
}
.coupon .pic .get{
	width: 26rem;
	height: 4.7rem;
	position: absolute;
	left: 50%;
	margin-left: -13rem;
	bottom:2.6rem
}
.coupon .pic .close{
	width: 2.8rem;
	height: 2.8rem;
	border-radius: 50%;
	position: absolute;
	left: 50%;
	margin-left: -1.4rem;
	bottom: -3.7rem;
}
.coupon .pic .close>img{
	width: 2.8rem;
	height: 2.8rem;
}
</style>
