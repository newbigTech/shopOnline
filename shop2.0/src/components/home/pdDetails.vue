<!-- 商品详情 -->
<template>
    <div class="pdDetails">
    	<!--<div class="header">
    		<header-bar></header-bar>
    	</div>-->
    	<div class="nav">
    		<div class="product-data" v-if="!showJoinCart">
    			<div class="product-img">
    				<mt-swipe :showIndicators="showIndicators">
					  <mt-swipe-item v-for="(item,index) in productObj.imgList" :key="index">
					  	<img :src="item" width="100%" height="100%"  @click="handleImg(index)" />
					  </mt-swipe-item>
					</mt-swipe>
					<div class="banner-cover" v-if="productObj.proSale == '1'">
						<img src="/static/img/nosale.png"  />
					</div>
    			</div>
    			<div class="img-btm">
	    			<div class="product-meta">
	    				<div class="title">
	    					<span class="sign" v-html="(productObj.manageModel == 1) ? '自营' : '代理'"></span>
	    					<span>{{productObj.proTitle}}</span>
	    				</div>
	    				<div class="detail">{{productObj.proHitTitle}}</div>
						<div class="prize">
							<span class="new-prize"><i>¥</i>{{productPrice}}</span>
							<span class="integral">送{{integral}}积分</span>
						</div>
						<div class="old-prize"><i>¥</i>{{productOrigiPrice}}</div>
						<div class="right">
							<p class="comment-num">{{commentNum}}</p>
							<p class="comment-title">用户评价</p>
							<button @click="$router.push('/comment')">查看</button>
						</div>
	    			</div>
	    			<div class="product-tip">
	    				<span><i class="iconfont">&#xe98c;</i>正品保证</span>
	    				<span><i class="iconfont">&#xe98c;</i>闪电发货</span>
	    				<span><i class="iconfont">&#xe98c;</i>七天退换</span>
	    			</div>
    			</div>
    			<div class="choice">
    				<mt-cell :title="chioceTitle" is-link @click.native="showJoinCart = true"></mt-cell>
    			</div>
    			<div class="comment">
    				<mt-cell title="用户评价" :value="commentVal" is-link @click.native="$router.push('/comment')"></mt-cell>
    				<template v-for="item in commentList">
	    				<div class="comment-item">
	    					<div class="account">
	    						<img :src="item.photoUrl == null ||item.photoUrl == '' ? '/static/img/header.png' : item.photoUrl" />
								<h3>
									<span v-html="item.nickName == null || item.nickName == '' ? item.phone : item.nickName"></span>
									<img src="./img/grade1.png" class="grade"/>
									<!-- 星级 -->
									<template v-for="obj in item.evaluateList">
										<template v-if="obj.isAdd == '0'">
											<img src="./img/icon-star.png" class="icon-star" v-for="i in parseInt(obj.evaluateScore)"/>
										</template>
									</template>
								</h3>
	    					</div>
	    					<template v-for="obj in item.evaluateList">
	    						<template v-if="obj.isAdd == '0'">
		    						<div class="info">
			    						{{obj.evaluateTime}}&nbsp;&nbsp;
			    						<span>{{item.colorName}}&nbsp;&nbsp;{{item.sizeName}}</span>
			    					</div>
		    						<div class="con">
			    						<div class="con-text">{{obj.evaluateContent}}</div>
			    						<div class="con-img">
			    							<img :src="imgPath" v-for="imgPath in obj.evaluateImgs" />
			    						</div>
			    					</div>
		    					</template>
		    					<!-- 追评 -->
		    					<template v-if="obj.isAdd == '1'">
		    						<div class="add-comment-title">追加评价：</div>
		    						<div class="info">
			    						{{obj.evaluateTime}}&nbsp;&nbsp;
			    					</div>
		    						<div class="con">
			    						<div class="con-text">{{obj.evaluateContent}}</div>
			    						<div class="con-img">
			    							<img :src="imgPath" v-for="imgPath in obj.evaluateImgs" />
			    						</div>
			    					</div>
		    					</template>
	    					</template>
	    				</div>
    				</template>
    			</div>
    			<div class="product-detail">
    				<h3>商品详情</h3>
    				<div class="detail-con" v-html="productObj.proRemark"></div>
    			</div>
    		</div>
    		<template v-if="showJoinCart">
    			<div class="nav-top">
	    			<img :src="productObj.proSimg" />
	    			<div class="nav-top-right">
	    				<div class="prize">
	    					<span class="new-prize">价格：￥{{choiseInfo.newPrize}}</span>
	    					<p class="old-prize">￥{{choiseInfo.oldPrize}}</p>
	    				</div>
	    				<template v-if="!((specialLabels[0].colorChildValue.length == 1 && specialLabels[0].colorChildValue[0].name == '无') && (specialLabels[1].sizeChildValue.length == 1 && specialLabels[1].sizeChildValue[0].name == '无'))">
		    				<div class="info">
		    					<span>已选择：</span>
		    					<span v-for="item in choiseText">
		    						<span v-if="item.name != '无'">{{item.name}}</span>&nbsp;&nbsp;
		    					</span>
		    				</div>
	    				</template>
	    			</div>
	    		</div>
	    		<div class="choise">
	    			<template v-for="item in specialLabels">
	    				<template v-if="item.skuColor != undefined">
	    					<template v-if="(item.colorChildValue.length == 1 && item.colorChildValue[0].name != '无') || item.colorChildValue.length > 1">
	    						<div class="choise-item">
		    						<h3 class="choise-title">{{item.skuColor}}</h3>
				    				<div class="choise-option">
				    					<template v-for="obj in item.colorChildValue">
				    						<span :class="obj.isActive ? 'active' : ''" @click="handleLight(item, $event, obj)"
				    							v-if="(!obj.disable) && obj.name != '无' && obj.name != '无'">
					    						{{obj.name}}
					    					</span>
				    					</template>
				    				</div>
			    				</div>
	    					</template>
	    				</template>
	    				<template v-if="item.skuSize != undefined">
	    					<template v-if="(item.sizeChildValue.length == 1 && item.sizeChildValue[0].name != '无') || item.sizeChildValue.length > 1">
		    					<div class="choise-item">
			    					<h3 class="choise-title">{{item.skuSize}}</h3>
			    					<div class="choise-option">
				    					<template v-for="obj in item.sizeChildValue">
				    						<span :class="obj.isActive ? 'active' : ''" @click="handleLight(item, $event, obj)"
				    							v-if="(!obj.disable) && obj.name != '无' && obj.name != '无'">
					    						{{obj.name}}
					    					</span>
				    					</template>
				    				</div>
			    				</div>
		    				</template>
	    				</template>
		    			<!--<template v-if="item.skuColor != undefined">
			    				<h3 class="choise-title">{{item.skuColor}}</h3>
			    				<template v-if="(item.colorChildValue.length == 1 && item.colorChildValue[0].name == '') || item.colorChildValue.length == 0">
			    					<div class="choise-option">
		    							<span class="disable">无</span>
		    						</div>
	    						</template>
		    					<template v-else>
				    				<div class="choise-option">
				    					<template v-for="obj in item.colorChildValue">
				    						<span :class="obj.isActive ? 'active' : ''" @click="handleLight(item, $event, obj)"
				    							v-if="(!obj.disable) && obj.name != '无' && obj.name != '无'">
					    						{{obj.name}}
					    					</span>
					    					<span class="disable" v-if="obj.disable || obj.name == '无'">
					    						{{obj.name}}
					    					</span>
				    					</template>
				    				</div>
			    				</template>
		    				</template>
		    				<template v-if="item.skuSize != undefined">
		    					<h3 class="choise-title">{{item.skuSize}}</h3>
		    					<template v-if="(item.sizeChildValue.length == 1 && item.sizeChildValue[0].name == '') || item.sizeChildValue.length == 0">
		    						<div class="choise-option">
		    							<span class="disable">无</span>
		    						</div>
	    						</template>
		    					<template v-else>
				    				<div class="choise-option">
				    					<template v-for="obj in item.sizeChildValue">
				    						<span :class="obj.isActive ? 'active' : ''" @click="handleLight(item, $event, obj)"
				    							v-if="(!obj.disable) && obj.name != '无' && obj.name != '无'">
					    						{{obj.name}}
					    					</span>
					    					<span class="disable" v-if="obj.disable || obj.name == '无'">
					    						{{obj.name}}
					    					</span>
				    					</template>
				    				</div>
			    				</template>
		    				</template>-->
	    			</template>
	    			<div class="num">	
	    				<div class="num-title">数量</div>
	    				<div class="num-operate">
	    					<span @click="handleCount('remove')" :class="{'disable': choiseNum == 1}">-</span>
	    					<span>{{choiseNum}}</span>
	    					<span @click="handleCount('add')">+</span>
	    				</div>
	    			</div>
	    		</div>
    		</template>
    	</div>
   		<div class="buy" v-if="!showJoinCart">
			<a class="iconfont" @click="hanldleContact">&#xe667;</a><!-- 联系客服 -->
   			<a class="iconfont" @click="handleCollect" v-if="!hadCollect">&#xe603;</a>
   			<a class="iconfont had-collect" @click="cancleCollect" v-if="hadCollect">&#xe72f;</a>
   			<button class="btn-buy" @click="handleGoBuy" v-if="productObj.proSale == '0'">立即购买</button>
   			<button class="btn-buy no-sale" v-if="productObj.proSale == '1'">立即购买</button>
   			<button class="btn-add" @click="handleChoose" v-if="productObj.proSale == '0'">加入购物车</button>
   			<button class="btn-add no-sale" v-if="productObj.proSale == '1'">加入购物车</button>
   		</div>
   		<div class="btm" v-if="showJoinCart">
			<button @click="showJoinCart = !showJoinCart">返回</button>
   			<button @click="handleBuy">立即购买</button>
   			<button @click="handleAdd">加入购物车</button>
		</div>
		<!--  下架 遮罩层 -->
		<div class="detail-cover" v-if="productObj.proSale == '1'"></div>
		
		<!-- 查看大图 -->
    	<div class="img-pop" v-if="showBigImg" @click="showBigImg = false">
    		<mt-swipe :show-indicators="false" :auto="0" :defaultIndex="defaultIndex">
			 	<mt-swipe-item v-for="(item,index) in productObj.imgList" :key="index">
				  	<img :src="item" />
			  	</mt-swipe-item>
			</mt-swipe>
    	</div>
    </div>
</template>
<script>
//import headerBar from '@/components/header/headerBar'
export default {
    name: 'pdDetails',
    components: {
//	  	'header-bar': headerBar
	},
    data() {
        return {
        	proCode: '',
        	hadCollect: false,//收藏状态
        	productObj: {},
        	integral: '',
        	productOrigiPrice: '',
        	productPrice: '',
        	showJoinCart: false,
        	choiseText: [{'name': ''},{'name': ''}],//已选择内容
        	choiseNum: '1',//选择数量
        	specialList: [],//sku商品数据
        	specialLabels: [],//规格数据
        	productCollectId: '',//收藏id
        	commentList: [],//评论列表数据
        	commentNum: 0,//评论总条数
        	choiseInfo: {},//选择时的价格信息
        	chioceTitle: '选择   颜色   尺码',
        	commentVal: '查看全部',
        	showBigImg: false,//查看商品图片状态
        	defaultIndex: 0,//查看大图 默认图片下标
        	showIndicators: true,//是否显示轮播图的焦点
        }
    },
    created() {
//	     document.body.scrollTop = document.documentElement.scrollTop = 0;
       
//     document.title = '商品详情';
    },
    mounted() {
        this.$nextTick(function() {
   			document.title = '商品详情';
// 			document.body.scrollTop = document.documentElement.scrollTop = 0;
        	var proCode = this.$route.query.proCode;
        	if(proCode != undefined) {
        		this.proCode = proCode;
        		this.getDetail();
        	}
        });
    },
    methods: {
    	//去选择尺码颜色等	
    	handleChoose: function() {
    		this.showJoinCart = true;
    	},
    	//查询商品收藏状态
    	getColectStatus: function() {
    		var that = this;
			var reqUrl = this.baseUrl + '/collectProduct/getCollectState';
			var params = {
				productId: this.proCode
			}
			this.$http.get(reqUrl, {params: params})
			.then(function(res) {
				if(!res) {
					that.hadCollect = false;
					return;
				}
				if(res.result == 'false') {
					that.hadCollect = false;
				} else {
					that.productCollectId = res.productCollectId;
					that.hadCollect = true;
				}
			})
    	},
    	//获取商品详情
    	getDetail: function() {
    		var that = this;
			var reqUrl = this.baseUrl + '/productInfo/getProductDetail';
			var params = {
				proCode: this.proCode
			}
			this.$http.get(reqUrl, {params: params})
			.then(function(res) {
				if(!res) {
					return;
				}
				that.productObj = res.productDetailInfo; //商品详情信息
                that.productObj.proRemark = that.productObj.proRemark.replace(/\%26/g, "&");
//				document.title = that.productObj.proTitle;
				var imgList = that.productObj.imgList.split(',');
				var arr = [];
				for(var i = 0;i < imgList.length;i++) {
					var img = imgList[i].split('|');
					arr.push(img[1]);
				}
				that.productObj.imgList = arr;
				if(that.productObj.imgList.length <= 1) {
					that.showIndicators = false;
				}
				that.token = localStorage.getItem('token');
				that.userInfo = localStorage.getItem('userInfo');
				var _currProObjList = [that.productObj];
				localStorage.setItem('_currProObjList', JSON.stringify(_currProObjList)); //当前商品信息
				that.getMinSkuData();
 				that.specialList = that.productObj.specialList; //SKU数据
 				that.specialLabels = that.productObj.specialLabels;//规格数据
 				localStorage.setItem('_specialLabels', JSON.stringify(that.specialLabels)); //当前商品信息
 				that.dealSpecialLabels();

 				//商品是否下架
				if(that.productObj.proSale == '0') {
					if(that.userInfo && that.token != null) {//商品状态(0.销售中 1.下架 2.全部)
						that.getColectStatus();
					}
	        		that.getCommentList();// 获取评论信息
				}
			});
    	},
    	//获取销售价最低的SKU数据
    	getMinSkuData: function() {
			var obj = this.productObj.specialList[0];
    		var specialList = this.productObj.specialList
    		var len = specialList.length;
    		for (var i = 1; i < len; i++){ 
				if (specialList[i].productPrice < obj.productPrice) { 
					obj = specialList[i]; 
				} 
			} 
			this.productPrice = obj.productPrice; //商品默认价格
			this.productOrigiPrice = obj.productOrigiPrice; //商品默认原价
			this.integral = obj.productIntegral; //商品默认显示积分
			
			this.choiseInfo = {
				'newPrize': this.productPrice,
				'oldPrize': this.productOrigiPrice
			}
    	},
    	//处理规格数据
    	dealSpecialLabels: function() {
    		for(var i = 0;i < this.specialLabels.length;i++) {
				var item = this.specialLabels[i];
				//颜色
				if(item.skuColor != undefined) {
					var arr = [];
					for(var j = 0;j < item.colorChildValue.length;j++) {
						arr[j] = {
							'name': item.colorChildValue[j],
							'disable': false,
							'isActive': false
						}
					}
					this.specialLabels[i].colorChildValue = arr;
				}
				//尺寸
				if(item.skuSize != undefined) {
					var arr = [];
					for(var j = 0;j < item.sizeChildValue.length;j++) {
						arr[j] = {
							'name': item.sizeChildValue[j],
							'disable': false,
							'isActive': false
						}
					}
					this.specialLabels[i].sizeChildValue = arr;
				}
			}
    	},
    	//点亮样式
    	handleLight: function(item, e, obj) {
    		var oA = obj.isActive;
    		//颜色
    		if(item.skuColor != undefined) {
    			// item.colorChildValue
    			var colorChildValue = item.colorChildValue;
    			for(var i = 0; i < colorChildValue.length;i++) {
    				colorChildValue[i].isActive = false;
    			}
    			this.choiseText[0].name = obj.name;
    			if(oA) {  //当前为选中，点击就取消选中
    				this.choiseText[0].name = ''; 
    				var a = this.specialLabels[1].sizeChildValue;
    				for(var i = 0;i < a.length;i++) {
    					a[i].disable = false;
    				}
    			}
    		}
    		//尺寸
    		if(item.skuSize != undefined) {
    			var sizeChildValue = item.sizeChildValue;
    			for(var i = 0; i < sizeChildValue.length;i++) {
    				sizeChildValue[i].isActive = false;
    			}
    			this.choiseText[1].name = obj.name;
    			if(oA) { //当前为选中，点击就取消选中
    				this.choiseText[1].name = ''; 
    				var a = this.specialLabels[0].colorChildValue;
    				for(var i = 0;i < a.length;i++) {
    					a[i].disable = false;
    				}
    			}
    		}
    		oA ? obj.isActive = false : obj.isActive = true
//  		obj.isActive = true;
    		this.handleSkuData();
    	},
    	//处理sku数据
    	handleSkuData: function() {
    		//规格都选择了时
    		if(this.choiseText[0].name != '' && this.choiseText[1].name != '') {
    			for(var i = 0;i < this.specialList.length;i++) {  
    				var obj = this.specialList[i];
    				if(obj.skuColor == this.choiseText[0].name && obj.skuSize == this.choiseText[1].name) {
    					this.choiseInfo = {
    						'newPrize': obj.productPrice,
    						'oldPrize': obj.productOrigiPrice
    					}
    					this.chioceTitle = ' 已选择  ' + obj.skuColor + ' ' + obj.skuSize; 
    				}
    			}
    		}
    		//选择了颜色  获取sku商品的尺寸
			if(this.choiseText[0].name != '') {
				var arr = [];
	    		for(var i = 0;i < this.specialList.length;i++) { 
	    			var obj = this.specialList[i];
	    			var checkColor = this.choiseText[0].name;
	    			if(obj.skuColor == checkColor) {
	    				arr.push(obj);
	    			}
	    		}
    			this.deploySize(arr);
			} 
			//选择了尺寸  获取sku商品的颜色
			if(this.choiseText[1].name != '') {
				var arr = [];
	    		for(var i = 0;i < this.specialList.length;i++) { 
	    			var obj = this.specialList[i];
	    			var checkSize = this.choiseText[1].name;
	    			if(obj.skuSize == checkSize) {
	    				arr.push(obj);
	    			}
	    		}
    			this.deployColor(arr);
			}
    	},
		//部署当前选择的颜色下的 尺寸规格
		deploySize: function(arr) {
			var specSize = this.specialLabels[1].sizeChildValue;
			
			for(var j = 0;j < specSize.length;j++) {
				specSize[j].disable = true;
				for(var i = 0;i < arr.length;i++) {
					if(arr[i].skuSize == specSize[j].name) {
						specSize[j].disable = false;
					}
				}
			}
			this.specialLabels[1].sizeChildValue = specSize;
		},
		//部署当前选择的 尺寸下的 颜色规格
		deployColor: function(arr) {
			var specColor = this.specialLabels[0].colorChildValue;
			
			for(var j = 0;j < specColor.length;j++) {
				specColor[j].disable = true;
				for(var i = 0;i < arr.length;i++) {
					if(arr[i].skuColor == specColor[j].name) {
						specColor[j].disable = false;
					} 
				}
			}
			this.specialLabels[0].colorChildValue = specColor;
		},
    	//计算数量
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
    	//获取当前sku数据
    	getCurrSku: function() {
    		if((!this.userInfo) || (this.token == null)) {
    			this.$toast('请先登录');
    			this.$router.push('/login');
				return false;
			}
    		
    		var colorChildValue = this.specialLabels[0].colorChildValue; //颜色规格数组
    		if(this.choiseText[0].name == '' && colorChildValue.length > 0) {
    			var a1 = (colorChildValue.length == 1 && colorChildValue[0].name != '' && colorChildValue[0].name != '无');
    			var a2 = (colorChildValue.length > 1);
    			if(a1 || a2) {
	    			this.$toast('请选择颜色');
    				return false;
    			}
    		}
    		var sizeChildValue = this.specialLabels[1].sizeChildValue;//尺寸规格数组
    		if(this.choiseText[1].name == '' && sizeChildValue.length > 0) {
    			var b1 = (sizeChildValue.length == 1 &&  sizeChildValue[0].name != '' &&  sizeChildValue[0].name != '无');
    			var b2 = (sizeChildValue.length > 1);
    			if(b1 || b2) { 
	    			this.$toast('请选择尺寸');
    				return false;
	    		}
    		}	
    		//选择规格情况一：颜色规格为‘无’ 时
    		if(colorChildValue.length == 1) {
    			if(colorChildValue[0].name == '无' || colorChildValue[0].name == '') {
    				this.choiseText[0].name = '无';
    			}
    		}
    		//选择规格情况二：尺寸规格为‘无’ 时
    		if(sizeChildValue.length == 1) {
    			if(sizeChildValue[0].name == '无' || sizeChildValue[0].name == '') {
    				this.choiseText[1].name = '无';
    			}
    		}
    		var skuInfoList = [];
    		var skuInfo = {};
    		//根据选中的规格 匹配sku商品信息
    		for(var i = 0;i < this.specialList.length;i++) { 
    			var obj = this.specialList[i];
    			var checkSize = this.choiseText[1].name;
    			var checkColor = this.choiseText[0].name;
    			
    			if(obj.skuSize == checkSize && obj.skuColor == checkColor) {
    				skuInfo = obj; //sku商品信息
    			}
    		}
    		//选择规格情况三：两个规格都为'无'
    		var t1 = colorChildValue.length == 1 && colorChildValue[0].name == '';
    		var t2 = colorChildValue.length == 1 && colorChildValue[0].name == '无';
    		var t3 = sizeChildValue.length == 1 && sizeChildValue[0].name == '';
    		var t4 = sizeChildValue.length == 1 && sizeChildValue[0].name == '无';
    		if((t1 && t3) || (t1 && t4) || (t2 && t3) || (t2 && t4)) {
    			skuInfo = this.specialList[0];
    		}
    		
    		skuInfo.proTitle = this.productObj.proTitle;
    		skuInfo.choiseNum = parseInt(this.choiseNum);
    		skuInfo.proCode = this.proCode;
    		skuInfoList.push(skuInfo);
    		
    		localStorage.setItem('_currProSkuList', JSON.stringify(skuInfoList));
    		return true;
    	},
    	//去购买
    	handleGoBuy: function() {
    		if(this.chioceTitle == '选择   颜色   尺码') {
    			this.showJoinCart = true;
    			return;
    		} 
    		if(!this.getCurrSku()) {
    			return;
    		}
			
    		this.$router.push('/goBuy');
    	},
    	//立即购买
    	handleBuy: function() {
    		//获取sku商品
    		if(!this.getCurrSku()) {
    			return;
    		}
			
    		this.$router.push('/goBuy');
    	},
    	//加入购物车
    	handleAdd: function() {
    		//获取sku商品
    		if(!this.getCurrSku()) {
    			return;
    		}
    		
    		var that = this;
			var reqUrl = this.baseUrl + '/shopcart/addShopcart';
			var obj = JSON.parse(localStorage.getItem('_currProSkuList'))[0];
			var params = {
				productId: this.productObj.proCode,
				sku: obj.skuNo,//商品sku
				quantity: obj.choiseNum //商品数量 （默认为1）
			}
			this.$http.post(reqUrl, params)
			.then(function(res) {
				if(res == 0) {
					that.$toast('登录已失效，请重新登录');
					that.$router.push('/login');
					return;
				}
				if(!res) {
					return;
				}
				if(res != 'success') {
					that.$toast('加入购物车失败');
					return;
				}
				that.$toast('已加入购物车');
 			});
    	},
    	//收藏商品
    	handleCollect: function() {
//  		if(!this.userInfo) {
//				this.$toast('请先登录');
//				return;
//			}
			if((!this.userInfo) || this.token == null) {
				this.$toast('请先登录');
				return;
			}
    		
    		var that = this;
			var reqUrl = this.baseUrl + '/collectProduct/addCollectProduct';
			var params = {
				productId: this.proCode
			}
			this.$http.post(reqUrl, params)
			.then(function(res) {
				if(!res) {
					return;
				}
				that.$toast('收藏成功');
				that.productCollectId = res.productCollectId;
				that.hadCollect = true;
 			});
    	},
    	//取消收藏商品
    	cancleCollect: function() {
    		var that = this;
			var reqUrl = this.baseUrl + '/collectProduct/deleteCollectProduct';
			//var productIds = [this.productCollectId];
			var params = {
				productCollectId: parseInt(this.productCollectId)//productIds
			}
			this.$http.post(reqUrl, params)
			.then(function(res) {
				if(!res) {
					return;
				}
				if(res.result == 'failed') {
					that.$toast('取消收藏失败');
					return;
				}
				that.$toast('取消收藏成功');
				that.hadCollect = false;
 			});
    	},
    	//获取登录客户评价列表
    	getCommentList: function() {    		
    		var that = this;
			var reqUrl = this.baseUrl + '/productInfo/mallEvaluates';
			var params = {
				evaluateProductCode:  this.proCode,//评价商品CODE
				isNew: '1',//是否最新一条商品评论（1.是 2.否）
			}
			this.$http.get(reqUrl, {params: params})
			.then(function(res) {
				if(!res) {
					return;
				}
				that.commentNum = res.allEvaluateCount;
				var commentList = res.mallEvaluate;
				if(commentList.length > 0) { 
					var commentObj = commentList[0];
					//昵称加密
					var nickName = commentObj.nickName;
					if(nickName != null && nickName != '') {
						var f = nickName.substr(0, 1);
						var l = nickName.substr(nickName.length - 1, 1);
						commentObj.nickName = f + '***' + l;
					}
					//图片处理
					var evaluateList = commentObj.evaluateList;
					for(var i = 0;i < evaluateList.length;i++) {
						var evaluateObj = evaluateList[i];
						if(evaluateObj.evaluateImgs != null && evaluateObj != '') {
							var arr = (evaluateObj.evaluateImgs).split(',');
							evaluateObj.evaluateImgs = arr;
						}
					}
					that.commentVal = '查看全部';
				} else {
					that.commentVal = '暂无评论';
				}
				that.commentList = commentList;		
				
				if(that.commentNum > 999) {
					that.commentNum = '999+';
				}
 			});
    	},
        //查看商品图片
        handleImg(index) {
        	this.defaultIndex = index;
        	this.showBigImg = true;
        }
    }
}

</script>
<style>
.product-detail .detail-con img {
    width: 100%;
}
</style>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style scoped>
.pdDetails {
	/*background: #f5f5f5;*/
}
.product-data {
	background: #f5f5f5;
}
.product-img {
	position: absolute;
	left: 0;
	top: 0;
	/*top: 3.7rem;*/
	width: 100%;
	height: 31.4rem;
}
.banner-cover {
	position: absolute;
	top: 12.5rem;
	left: calc(50% - 4.75rem);
	z-index: 100;
}
.banner-cover > img {
	width: 9.5rem;
	height: 9.5rem;
}
.img-btm,
.comment,
.product-detail {
	background: #fff;
	margin-bottom: 1.0rem;
}
.img-btm {
	margin-top: 31.4rem;
}
.product-meta {
	position: relative;
	top: 0;
	left: 0;
	padding: 1.5rem 0;
	margin: 0 1.5rem;
	border-bottom: 0.05rem solid #e6e6e6;
}
.product-meta .title {
	width: calc(100% - 7.2rem);
	line-height: 1.4rem;
	color: #242424;
	font-size: 1.5rem;
	overflow: hidden;
}
.product-meta .title span:nth-child(2) {
	line-height: 2.0rem;
}
.product-meta .title span.sign {
	/*display: inline-block;*/
	float: left;
	height: 1.4rem;
	line-height: 1.5rem;
	background: #e93b3d;
	font-size: 1.0rem;
	color: #fff;
	padding-left: 0.3rem;
	padding-right: 0.3rem;
	/*padding: 0rem 0.3rem;*/
	margin-right: 0.3rem;
	margin-top: 0.2rem;
	border-radius: 0.2rem;
}
.product-meta .detail {
	width: calc(100% - 7.0rem);
	/*height: 1.4rem;*/
	line-height: 1.4rem;
	color: #666;
	font-size: 1.3rem;
	margin-top: 1.1rem;
	overflow: hidden;
}
.product-meta .prize {
	color: #e93b3d;
	margin-top: 1.7rem;
	line-height: 1.0rem;
	vertical-align: middle;
}
.product-meta .prize .new-prize {
	font-size: 1.9rem;
	font-weight: bold;
}
.product-meta .prize .new-prize > i {
	font-size: 1.4rem;
	font-style: normal;
	margin-right: 0.3rem;
	font-weight: bold;
}
.product-meta .prize .integral {
	/*display: inline-block;*/
	font-size: 1.0rem;
	border: 0.05rem solid #e93b3d;
	border-radius: 0.2rem;
	padding: 0.1rem 0.4rem 0 0.4rem;
	vertical-align: super;
	margin-left: 0.6rem;
}
.product-meta .old-prize {
	color: #999;
	font-size: 1.2rem;
	margin-top: 1.25rem;
	text-decoration: line-through;
}
.product-meta .old-prize > i {
	font-style: normal;
}
.product-meta .right {
	position: absolute;
	right: 0;
	top: 1.5rem;
	text-align: center;
	padding: 1.0rem 0 1.5rem 1.5rem;
	border-left: 0.05rem dashed #d9d9d9;
}
.product-meta .right p {
	color: #e93b3d;
}
.product-meta .right p.comment-num {
	font-size: 1.8rem;
}
.product-meta .right p.comment-title {
	font-size: 1.2rem;
	margin: 0.9rem 0;
}
.product-meta .right > button {
	border-radius: 0.2rem;
	border: 0.05rem solid #7f7f7f;
	background: #fff;
	padding: 0.3rem 1.2rem;
	color: #333;
}
.product-tip {
	margin: 0 1.5rem;
	padding: 1.5rem 0;
}
.product-tip span {
	display: inline-block;
	width: 32%;
	color: #666;
	font-size: 1.3rem;
}
.product-tip span:nth-child(2) {
	text-align: center;
}
.product-tip span:nth-child(3) {
	text-align: right;
}
.product-tip span > i {
	color: #e93b3d;
	font-size: 1.1rem;
	margin-right: 0.4rem;
}
.choice {
	/*padding-left: 0.6rem;*/
	background: #fff;
	margin-bottom: 1.0rem;
}
.comment-item {
	margin-left: 1.5rem;
	border-top: 0.05rem solid #d7d7d7;
}
.comment-item .account {
	padding: 1.5rem 0 1.0rem 0;
}
.account > img {
	float: left;
	width: 3.2rem;
	height: 3.2rem;
	border-radius: 3.2rem;
	vertical-align: middle;
	margin-right: 0.6rem;
}
.account h3 {
	line-height: 3.2rem;
	font-size: 1.3rem;
}
.account .grade {
	width: 1.4rem;
	height: 1.4rem;
	vertical-align: middle;
	margin-left: 0.5rem;
}
.account .icon-star {
	width: 1.4rem;
	height: 1.4rem;
	vertical-align: middle;
	margin-left: 0.5rem;
}
.comment-item .info {
	color: #666;
	font-size: 1.2rem;
	margin-bottom: 1.3rem;
}
.comment-item .info span {
	margin-right: 0.5rem;
}
.comment-item .con {
	margin-right: 1.5rem;
}
.comment-item .con .con-text {
	color: #333;
	font-size: 1.4rem;
	line-height: 2.0rem;
	margin-bottom: 1.0rem;
}
.comment-item .con .con-img {
	margin-bottom: 0.4rem;
}
.comment-item .con .con-img img {
	width: 6rem;
	height: 6rem;
	border-radius: 0.2rem;
	background: #7f7f7f;
	margin-right: 0.8rem;
	margin-bottom: 0.8rem;
}
.product-detail {
	padding: 1.5rem 1.5rem 4.9rem 1.5rem;
	font-size: 1.2rem;
}
.product-detail > h3 {
	color: #333;
	font-size: 1.4rem;
	margin-bottom: 1.5rem;
}
.product-detail .detail-con {
	/*line-height: 1.8rem;*/
	line-height: 0;
	font-size: 1.2rem;
	overflow: hidden;
}
.product-detail .detail-con img {
	width: 100%;
}
.buy {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 4.95rem;
	line-height: 4.95rem;
	background: #fff;
	border-top: 0.05rem solid #d9d9d9;
	padding-bottom: constant(safe-area-inset-bottom);
}
.buy span.iconfont,
.buy a.iconfont {
	float: left;
	/*display: inline-block;*/
	width: 14.5%;
	font-size: 2.1rem;
	text-align: center;
	color: #7f7f7f;
	box-sizing: border-box;
}
.buy span.iconfont:nth-child(1),
.buy a.iconfont:nth-child(1) {
	border-right: 0.05rem solid #d9d9d9;
}
.buy a.iconfont.had-collect {
	color: #e93b3d;
}
.buy .btn-buy,
.buy .btn-add {
	float: left;
	width: 35%;
	height: 4.9rem;
	background: #fff;
	color: #333;
	font-size: 1.5rem;
	box-sizing: border-box;
}
.buy .btn-buy {
	border-left: 0.05rem solid #d9d9d9;
}
.buy .btn-add {
	float: right;
	width: 36%;
	background: #e93b3d;
	color: #fff;
}
.buy .btn-buy.no-sale {
	border-right: 0.05rem solid #d9d9d9;
}
.buy .btn-buy.no-sale,
.buy .btn-add.no-sale {
	color: #999;
	background: #fbfbfb !important;
}
/* 加入购物车 */
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
	cursor: pointer;
}
.choise-item .choise-option span.active {
	color: #e93b3d;
	border: 0.1rem solid #e93b3d;
}
.choise-item .choise-option span.disable {
	color: #cdcdcd;
	border: 0.1rem solid #cdcdcd;
}

.num .num-operate {
	clear: both;
}
.num .num-operate span,
.num .num-operate > input[type='number'] {
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
.num .num-operate span:nth-child(2),
.num .num-operate > input[type='number'] {
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
.num .num-operate > input[type='number'] {
	
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
.no-data {
	font-size: 1.2rem;
	color: #aaa;
}
.add-comment-title {
	font-size: 1.2rem;
	margin-bottom: 1.0rem;
	color: #e93b3d;
}
.detail-cover {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0,0,0,0);
}
.img-pop {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 1.0);
	vertical-align: sub;
}
.img-pop img {
	position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
	width: 100%;
	margin: auto;
}
</style>
