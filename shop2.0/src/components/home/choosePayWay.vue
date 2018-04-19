<!-- 普通订单-选择支付方式 -->
<template>
    <div class="choosePayWay" :style="{'height': clientH * 10 +'px'}">
    	<div class="money">
    		<p>付款金额</p>
    		<h2>¥{{ordersInfo.finalAmount}}</h2>
    	</div>
    	<div class="pay-way">
    		<div class="way-item wx" @click="handleCheck('wx')">
    			<i class="iconfont icon-weixinzhifu"></i>
    			<div class="text">
    				<p>微信</p>
    				<p>微信支付</p>
    			</div>
    			<span>
    				<i class="iconfont icon-correct" v-if="wayWx"></i>
    			</span>
    		</div>
    		<div class="way-item balance" @click="handleCheck('money')">
    			<i class="iconfont icon-qian"></i>
    			<div class="text">
    				<p>账户余额</p>
    				<p>{{accountMoney}}元</p>
    			</div>
    			<span>
    				<i class="iconfont icon-correct" v-if="!wayWx"></i>
    			</span>
    		</div>
    	</div>
    	<div class="pay">
    		<button class="btn-pay" @click="handlePay">立即支付</button>
    	</div>
    	
    	<!-- 支付密码框 -->
		<pay-pop :viewPop="popupVisible" @result="getPwd" @result2="closePop"></pay-pop>
    </div>
</template>
<script>
import payPop from '@/components/tool/payPop' //密码支付弹框
import { MessageBox,Indicator } from 'mint-ui';
export default {
    name: 'upGobuy', // 订单付款
    components: {
		'pay-pop': payPop
	},
    data() {
        return {
        	accountMoney: 0,//账户余额
        	ordersInfo: {//订单信息
        		finalAmount: 0, //需支付总金额
        		totalOrdersNo: '',//总订单号
    		},
            wayWx: false,
            popupVisible: false,
        }
    },
    created() {
//	  	document.body.scrollTop = document.documentElement.scrollTop = 0;
    	
    	var ordersInfo = JSON.parse(localStorage.getItem('comOrderInfo')); //普通订单信息
    	if(ordersInfo != null) {
    		this.ordersInfo = ordersInfo;
    	} else {
    		this.$router.push('/');
    	}
    },
    destroyed() {
    },
    mounted() {
        this.$nextTick(function() {
        	document.title = '选择支付方式';
        	var _loginWay = localStorage.getItem('_loginWay');
			if(_loginWay == 'weixin') {
				this.getWxInfo();//微信授权后获取微信用户信息
			} 
        	this.findMoney();
        });
    },
    methods: {
    	 //查询我的账户余额
        findMoney() {
            var that = this;
            var reqUrl = this.baseUrl + '/account/getMyAccount';
            this.$http.get(reqUrl).then(function(res) {
                if (!res) {
                    return;
                }
                that.accountMoney = res.accountAmount;
            });
        },
    	//选择支付方式
    	handleCheck(param) {
    		if(param == 'wx') { //微信支付
    			this.wayWx = true;
    		} else { //余额支付
    			this.wayWx = false;
    		}
    	},
    	//立即支付
    	handlePay() {
    		var finalAmount = parseFloat(this.ordersInfo.finalAmount);
    		var accountMoney = parseFloat(this.accountMoney);
    		
    		if(!this.wayWx) { //账户余额支付
    			if(finalAmount > accountMoney) {
	    			this.$toast('余额不足！');
	    			return;
	    		}
    			
				if(!this.userInfo.payPassword) { //没有设置支付密码时
					var that = this;
					MessageBox({
						message: '您还未设置支付密码',
						confirmButtonText: '立即前往',
						showCancelButton: true
					}).then(function(action) {
						if(action == 'confirm') {
							that.$router.push('/setPayPassword');
						}
					})
				} else { //余额支付
					this.popupVisible = true;
				}
			} else { //微信支付
				if(this.userInfo.wxId == null || this.userInfo.wxId == '') {
			 		localStorage.setItem('_loginWay', 'weixin');
					var redirect_uri = this.onlineUrl + '/choosePayWay';
					this.handleWxAuthor(redirect_uri);
				} else {
				 	this.wxPay();
				}
			}
    	},
    	//微信支付
		wxPay() {
			var that = this;
    		var params = {
    			totalOrdersNo: this.ordersInfo.totalOrdersNo, //订单编号
    			finalAmount: this.ordersInfo.finalAmount //支付金额
    		}
			this.$http.post(this.baseUrl + '/order/weixinPay', params)
			.then(function(res) {
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
				var succesPath = that.onlineUrl + '/buySuccess?orderId=' + that.ordersInfo.totalOrdersNo;
				var errorPath = that.onlineUrl + '/choosePayWay';
                that.getWxPay(obj, succesPath, errorPath);
			});
		},
    	//余额支付 - 获取从子组件传来的密码值
		getPwd(val) {
			var that = this;
			this.popupVisible = false;
			Indicator.open({
				text: '支付中...',
				spinnerType: 'fading-circle'
			});
			//判断支付密码
			var that = this,
				reqUrl = this.baseUrl + '/bankcard/checktPayPassword',
				params = {payPassword: val};
			this.$http.post(reqUrl, params)
			.then(function(res) {
				Indicator.close();
				if(res == '支付密码错误') {
					setTimeout(function(){
						that.popupVisible = true;
					}, 1000);
					return;
				}
				if(res.code == '9998' && res.description == '支付密码错误次数过多,请稍后再试') { //支付次数过多)
					that.popupVisible = false;
					return;
				}
				if(!res) { return; }
				that.moneyPay(val);
 			});
		},
		closePop() {
			this.popupVisible = false;
		},
		//余额支付
		moneyPay(val) {
			var that = this,
				reqUrl = this.baseUrl + '/order/balancePayOrder',
				params = {
					totalOrdersNo: this.ordersInfo.totalOrdersNo,
					finalAmount: this.ordersInfo.finalAmount,
					payPassword: val
				}
			this.$http.post(reqUrl, params).then(function(res) {
				Indicator.close();
				if(!res) { return; }
				that.$toast('支付成功');
				localStorage.removeItem('comOrderInfo');
				that.$router.push('/buySuccess?orderId=' + that.ordersInfo.totalOrdersNo);
 			});
		}
    }

}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style scoped>
.choosePayWay {
	background: #f5f5f5;
}
.money {
	padding: 2.5rem 0 5.0rem 0;
	background: #fff;
	text-align: center;
}
.money > p {
	color: #666;
	font-size: 1.3rem;
	margin-bottom: 1.5rem;
}
.money > h2 {
	color: #333;
	font-size: 2.1rem;
}
.way-item {
	padding: 2.0rem;
	background: #fff;
	cursor: pointer;
}
.way-item:hover {
	background: #eee;
}
.way-item > i {
	float: left;
	font-size: 2.0rem;
	margin-right: 1.0rem;
}
.wx > i {
	color: #5ac539;
	margin-top: 0.7rem;
}
.balance > i {
	color: #000;
	margin-top: 0.6rem;
}
.way-item .text {
	display: inline-block;
}
.way-item .text p:nth-child(1) {
	color: #333;
	font-size: 1.5rem;
	margin-bottom: 0.7rem;
}
.way-item .text p:nth-child(2) {
	color: #999;
	font-size: 1.1rem;
}
.way-item > span {
	float: right;
	/*width: 1.6rem;
	height: 1.6rem;*/
	width: 16px;
	height: 16px;
	border-radius: 50%;
	box-sizing: border-box;
	border: 0.05rem solid #dadada;
	margin-top: 0.9rem;
}
.way-item > span > .iconfont {
	color: #d4282d;
	font-size: 15px;
}
.pay {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 4.9rem;
	padding-bottom: constant(safe-area-inset-bottom);
}
.pay button.btn-pay {
	width: 100%;
	height: 100%;
	background: #d4282d;
	color: #fff;
	font-size: 1.5rem;
}
</style>
