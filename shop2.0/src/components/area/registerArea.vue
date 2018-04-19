<!-- 注册专区（新人注册送体验券） -->
<template>
    <div id="registerArea" :style="{'min-height': (clientH * 10) + 'px'}">
    	<div class="top">
    		<img src="../../assets/img/new-register-top.png" />
    	</div>
    	<div class="nav">
    		<div class="nav-top">
    			<span class="money"><i>￥</i>38</span>
    			<span class="text">新人体验劵</span>
    		</div>
    		<div class="nav-btm">
    			<!--<p>有效期至2018-04-11</p>-->
    			<p>益品购</p>
    			<p>体验券商品通用，其他商品除外</p>
    		</div>
    	</div>
    	<div class="btm">
    		<button class="btn-red" @click="handleClick" v-if="receiveFlag == 1">立即领取</button>
    		<button class="btn-red-border" @click="$router.push('/coupon')" v-if="receiveFlag == 2">已领取</button>
    		<button class="btn-red-border" v-if="receiveFlag == 3">噢~ 你来晚了，券已领完</button>
    	</div>
    </div>
</template>
<script>
export default {
    name: 'registerArea', // 注册专区（新人注册送体验券）
    data() {
        return {
        	receiveFlag: 1,//1:立即领取2、已领取，3、已领完
        	couponId: '',//优惠券id
        }
    },
    created() {
    	
    },
    mounted() {
        this.$nextTick(function() {
        	if(this.userInfo == null) { //没有登录
        		this.receiveFlag = 1;
        	} else {
        		//判断是否领取
        		this.isReceive();
        	}
        });
    },
    destroyed() {
    	
    },
    methods: {
    	//判断是否领取了优惠券
    	isReceive() {
    		var reqUrl = this.baseUrl + '/coupon/getIsCoupon',
				that = this,
				params = {};
			this.$http.get(reqUrl, {params: params}).then(function(res) {
				if(!res) {return;}
				if(res.isReceive == 'success') { //已经领取
					that.receiveFlag = 2;
				} else {
					if(res.couponId == null) { //优惠券过期或领完等情况
						that.receiveFlag = 3;
					} else { //立即领取
						that.receiveFlag = 1;
						that.couponId = res.couponId;
					}
				}
			})
    	},
    	/**
    	 * 	已经领取  “已领取”
			登录了且没有领取     “立即领取”   -》调领取接口
			没有登录	“立即领取”	-》 去登录
    	 */
    	handleClick() {
    		if(this.userInfo == null) { //没有登录
        		this.$router.push('/login');
	       } else { //登录了，且没有领取
        		var reqUrl = this.baseUrl + '/coupon/addCouponInfo',
					that = this,
					params = {couponId: this.couponId};
				this.$http.post(reqUrl, params).then(function(res) {
					if(!res) {return;}
					that.$toast('领取成功');
					that.$router.push('/coupon');
				})
	        }
    	}
    }

}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style scoped>
#registerArea {
	background: #f5f5f5;
}
.top,
.top > img {
	width: 100%;
}
.nav {
	width: 78%;
	height: 14.8rem;
	margin: 0 auto;
	background-image: url(../../assets/img/new-register-bg.png);
	background-size: 100% 100%;
	text-align: center;
}
.nav > img {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
}
.nav .nav-top {
	height: 7.0rem;
	line-height: 7.0rem;
	margin: 0 3.5rem;
	/*padding: 2.2rem 0 1.8rem 0;*/
	border-bottom: 0.05rem dashed #e0e0e0;
}
.nav-top > span.money {
	color: #e5493d;
	font-size: 4.2rem;
	margin-right: 1.75rem;
	/*font-weight: bold;*/
}
.nav-top > span.money > i {
	font-size: 1.95rem;
	font-style: normal;
}
.nav-top > span.text {
	color: #525252;
	font-size: 1.7rem;
}
.nav .nav-btm {
	padding: 2.0rem 0;
}
.nav .nav-btm > p {
	color: #525252;
	font-size: 1.0rem;
	margin-bottom: 0.85rem;
}
.nav .nav-btm > p:last-child {
	margin-bottom: 0;
}
.btm {
	width: 78%;
	margin: 4.5rem auto 0 auto;
}
.btm > button {
	width: 100%;
	height: 4.5rem;
	line-height: 4.5rem;
	border-radius: 0.5rem;
	text-align: center;
	font-size: 1.7rem;
}
.btn-red {
	background-image: linear-gradient(
		#e5493d, 
		#e5493d), 
	linear-gradient(
		#b3b3b3, 
		#b3b3b3);
	background-blend-mode: normal, 
		normal;
	color: #fff;
}
.btm > button.btn-red:hover {
	box-shadow: 0.2rem 0.2rem 0.2rem #b3b3b3;
}
.btn-red-border {
	border: 0.05rem solid #e5493d;
	color: #e5493d;
	background: #fff;
}
</style>
