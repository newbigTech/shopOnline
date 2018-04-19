<!-- 体验券区 -->
<template>
    <div class="experArea" :style="{minHeight: (clientH * 10) + 'px'}">
    	<div class="top">
    		<img src="../../assets/img/exper01.png" />
    	</div>
    	<div class="con">
    		<div class="goods-item" v-for="item in productList">
    			<div class="info">
	    			<div class="info-single">
	    				<img :src="item.goodsPic" />
	    				<h4>{{item.goodsName}}</h4>
	    				<p>￥{{item.goodsPrice}}</p>
	    			</div>
	    			<div class="info-single">
	    				<img :src="item.maxUpgradeImgurl" />
	    				<h4>{{item.maxGoodName}}</h4>
	    				<p>￥{{item.upgradePrice}}</p>
	    			</div>
    			</div>
    			<div class="btn">
    				<button @click="handleExper(item)">立即体验</button>
    			</div>
    		</div>
    	</div>
    	<div class="btm">
    		<img src="../../assets/img/exper02.png" />
    	</div>
    </div>
</template>
<script>
import { MessageBox, Indicator } from 'mint-ui';
export default {
    name: 'experArea', // 体验券区
    data() {
        return {
        	pageNum: 1,
        	productList: [],
        	couponId: ''
        }
    },
    created() {
    	var couponId = this.$route.query.couponId;
    	if(couponId == undefined) {
    		this.$router.go(-1);
    	} else {
    		this.couponId = couponId;
    	}
    	this.getList();
    },
    mounted() {
        this.$nextTick(function() {
        	document.title = "体验券区";
        });
    },
    methods: {
    	getList() {
    		var that = this,
    			reqUrl = this.baseUrl + '/product/findProductInfoByCouponId',
    			params = {
					pageNum: this.pageNum,
					pageSize: this.pageSize,
					couponId: this.couponId
				}
			this.$http.get(reqUrl, {params: params})
			.then(function(res) {
				if(!res) {return;}
				that.productList = res.productList;
			})
    	},
    	//立即体验
    	handleExper(item) {
    		var that = this;
    		MessageBox.confirm('使用体验券下单?',{
    			confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
    		}).then(function() {
			  var params = { 
					proId: item.proId, //商品主键id
					goodId: item.goodId//商品id
				},
	  			reqUrl = that.baseUrl + '/promotion/addExperienceOrder';
				that.$http.post(reqUrl, params).then(function(res) {
					if(!res) { return; }
					MessageBox.confirm('温馨提示：此商品为促销商品，一旦升级后不退不换。', '下单成功', {
		    			confirmButtonText: '猜红包',
						cancelButtonText: '猜鸡藕',
		    		}).then(function() { //猜红包
		    			that.$router.push({
		    				path: '/guessGift', 
		    				query: {id: res.ordersNo}
		    			})
		    		}, function() { //猜鸡藕
		    			that.$router.push({
		    				path: '/guessSize',
		    				query: {id: res.ordersNo}
		    			})
		    		})
	 			});    	
			  	
			}, function() {});
    	}
    }
}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style scoped>
.experArea {
	width: 100%;
	background-image: url(../../assets/img/bg-exper.png);
	background-size: 100% 100%;
}
.experArea .top > img,
.experArea .btm > img {
	width: 100%;
}
.experArea .con {
	margin-top: -4px;
	background-image: url(../../assets/img/exper-line.png);
	background-size: 100% 100%;
}
.goods-item {
	padding: 2.0rem 1.8rem 0.6rem 1.8rem;
}
.goods-item:nth-child(n) {
	position: relative;
	top: -1.8rem;
	left: 0;
}
.info {
	display: block;
	min-height: 17.6rem;
	clear: both;
}
.info-single {
	float: left;
	width: calc(50% - 2.0rem);
	padding: 0 1.0rem;
	text-align: center;
}
.info-single img {
	width: 100%;
	height: 12.35rem;
}
.info-single h4, 
.info-single p {
	color: #333;
}
.info-single h4 {
	width: 100%;
	height: 1.4rem;
	font-size: 1.25rem;
	margin-top: 1.8rem;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
}
.info-single p {
	font-size: 1.55rem;
	text-decoration: underline;
	margin-top: 0.85rem;
}
.btn {
	display: block;
	text-align: center;
}
.btn button {
	width: 12.5rem;
	height: 2.7rem;
	background-color: transparent;
	background-image: url(../../assets/img/exper-btn.png);
	background-size: 100% 100%;
	margin-top: 1.8rem;
	color: #400a0d;
	font-size: 1.6rem;
}
.btm {
	position: relative;
	top: -3.2rem;
	left: 0;
}
</style>
