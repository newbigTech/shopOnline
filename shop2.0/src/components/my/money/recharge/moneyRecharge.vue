<!-- 账户余额-充值 -->
<template>
    <div class="moneyRecharge" :style="{'height': (clientH * 10) +'px'}">
    	<div class="data">
    		<p>充值金额</p>
    		<div class="input-item">
    			<span>¥</span>
    			<input type="text" v-model="moneyNum" min="0" />
    		</div>
    	</div>
    	<div class="pay-way">
    		<p>选择支付方式</p>
    		<div class="way-item">
    			<i class="iconfont icon-weixinzhifu"></i>
    			<span class="way-text">微信支付</span>
    			<span class="way-sign iconfont icon-correct"></span>
    		</div>
    	</div>
    	<div class="btn">
    		<button class="btn-next" @click="handleNext">下一步</button>
    	</div>
    </div>
</template>
<script>
export default {
    name: 'moneyRecharge', // 账户余额-充值
    data() {
        return {
        	moneyNum: 100
        }
    },
    created() {
    	
    },
    mounted() {
        this.$nextTick(function() { 
        	document.title = '充值';
        	var _loginWay = localStorage.getItem('_loginWay');
			if(_loginWay == 'weixin') {
				this.getWxInfo();//微信授权后获取微信用户信息
			} 
        });
    },
    methods: {
    	handleNext() {
			if(this.moneyNum == '' || this.moneyNum == '0' || this.moneyNum <= 0) {
				this.$toast('请输入充值金额');
				return;
			}
			//判断是否微信授权
			if(this.userInfo.wxId == null || this.userInfo.wxId == '') { //没有授权时
		 		localStorage.setItem('_loginWay', 'weixin');
				var redirect_uri = this.onlineUrl + '/moneyRecharge';
				this.handleWxAuthor(redirect_uri);
			} else { //已经授权
			 	this.wxRecharge();
			}
			
    	},
    	//微信充值
    	wxRecharge() {
    		var that = this,
    			reqUrl = this.baseUrl + '/account/weixinRecharge',
    			params = { 
    				rechargeAmount: parseFloat(this.moneyNum) //充值金额
    			}
			this.$http.post(reqUrl, params).then(function(res) {
				if(!res) {
					return;
				}
				var obj = {
                    "appId": res.appId, //公众号名称，由商户传入     
                    "timeStamp": res.timeStamp, //时间戳，自1970年以来的秒数     
                    "nonceStr": res.nonceStr, //随机串     
                    "package": res.package,//微信支付ID
                    "signType": res.signType, //微信签名方式：     
                    "paySign": res.paySign //微信签名  
                }
				var succesPath = that.onlineUrl + '/mRSuccess?orderNo=' +  res.orderNo;//充值订单号
				var errorPath = that.onlineUrl + '/moneyRecharge';
                that.getWxPay(obj, succesPath, errorPath);
			});
    	}
    }

}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style scoped>
.moneyRecharge {
	background: #f5f5f5;
	overflow: hidden;
}
.data {
	margin: 2.0rem;
	border: 0.5rem;
	background: #fff;
}
.data > p {
	color: #333;
	font-size: 1.3rem;
	padding: 3.6rem 2.2rem 3.0rem 2.2rem;
}
.input-item {
	position: relative;
	top: 0;
	left: 0;
}
.input-item > span {
	position: absolute;
	top: 1.3rem;
	left: 2.3rem;
	font-size: 2.1rem;
	color: #333;
}
.input-item > input {
	width: calc(100% - 5.4rem);
	margin: 0 2.2rem 4.8rem 2.2rem;
	background: #fff;
	border: none;
	font-size: 2.7rem;
	padding: 0.5rem 0.5rem 0.5rem 2.0rem;
	border-bottom: 0.05rem solid #f0f0f0;
}
.pay-way {
	padding: 2.5rem 2.0rem;
}
.pay-way > p {
	text-align: center;
	color: #999;
	font-size: 1.4rem;
	margin-bottom: 4.2rem;
}
.way-item {
	vertical-align: middle;
}
.way-item i {
	float: left;
	color: #5ac539;
	font-size: 2.0rem;
	margin-right: 1.0rem;
}
.way-item .way-text {
	color: #333;
	font-size: 1.5rem;
}
.way-item .way-sign {
	float: right;
	color: #d5282e;
	font-size: 1.6rem;
	margin-right: 0.3rem;
	padding-top: 0.2rem;
}
.btn {
	position: fixed;
	bottom: 5.0rem;
	left: 0;
	right: 0;
	margin: 0 2.0rem;
}
.btn .btn-next {
	width: 100%;
	height: 4.5rem;
	line-height: 4.5rem;
	background: #d5282e;
	color: #fff;
	font-size: 1.5rem;
	border-radius: 0.5rem;
}
</style>
