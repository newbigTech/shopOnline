<!-- 绑定手机 -->
<template>
    <div class="bindMobile">
		<div class="info">
    		为保障您的账户安全，请绑定您的手机号码
    	</div>
    	<div class="nav">
	    	<div class="mobile">
	    		<mt-field placeholder="请输入手机号" type="tel" v-model="phoneVal" :attr="{maxlength: 11}"
    				@keyup.native="handlePhone"></mt-field>
	    		<!--<input type="text" placeholder="请输入手机号码" v-model="phoneVal" />-->
	    	</div>
	    	<div class="code">
	    		<mt-field placeholder="请输入验证码" type="tel" :attr="{maxlength: 6}" v-model="codeVal"
	    			 class="input-code" @keyup.native="handleVerifyNumber"></mt-field>
	    		<!--<input type="text" placeholder="请输入验证码" v-model="codeVal" />-->
	    		<button class="btn-send" type="button" v-if="!hadSendBm" @click="sendCode" :disabled="signFlag">{{codeBtnText}}</button>
				<span class="text-gray" v-if="hadSendBm">{{sendTimeBm}}s后重发</span>
	    	</div>
	    	<div class="btn">
	    		<button @click="handleBind">确认绑定</button>
	    	</div>
	    	<div class="login">
	    		<span @click="$router.push('/login')">直接登录</span>
	    	</div>
    	</div>
    	<div class="btm">
		<p>绑定过程中遇到问题?</p>
		<p>请联系<span @click="hanldleContact">在线客服</span>，我们随时为您服务
			<!--或联系电话客服<a href="tel: 0731-82197426">{{serviceTel}}</a>-->
		</p>
		<!--<p>我们随时为您服务</p>-->
	</div>
    </div>
</template>
<script>
import { Indicator } from 'mint-ui';
export default {
    name: 'bindMobile', 
    data() {
        return {
        	showBind: true,//显示绑定手机号码
        	phoneVal: '', //手机号码
        	codeVal: '', //验证码
        	codeBtnText: '获取验证码',
        	hadSendBm: false,//是否已发送验证码
        	sendTimeBm: 60,//发送验证码间隔时间
        	bindUserInfo: {},//绑定商城的用户信息
        	signFlag: false,
        	time1: null
        }
    },
    mounted() {
    	this.$nextTick(function() {
    		document.title = this.title + '-绑定手机号';
    		
			var hadSendBm = eval(localStorage.getItem('hadSendBm')); //是否发送了验证码
	  		var sendTimeBm = localStorage.getItem('sendTimeBm');//发送验证码时间间隔
	  		if(hadSendBm != null) {
	  			this.hadSendBm = hadSendBm;
	  			this.sendTimeBm = sendTimeBm;
	  			if(eval(hadSendBm)) {
	  				this.hadSendBm = true;
	  				this.countDown();
	  			}
//	  			this.codeBtnText = '重新获取';
	  		}
    	})
    },
    destroyed() {
		// console.group('销毁完成状态===============》destroyed');
		window.clearInterval(this.time1);
		localStorage.removeItem('hadSendBm'); //是否发送了验证码
		localStorage.removeItem('sendTimeBm'); //发送验证码时间间隔       
	},
    methods: {
    	//验证手机号
	  	handlePhone: function() {
			this.$nextTick(function() {
		  		if(this.verifyNumber(this.phoneVal).state) {
					this.phoneVal = this.verifyNumber(this.phoneVal).value;
				} else {
					this.phoneVal = this.verifyNumber(this.phoneVal).value;
				}
			});
	  	},
    	//验证码格式
	  	handleVerifyNumber: function(){
			this.$nextTick(function() {
		  		if(this.verifyNumber(this.codeVal).state) {
					this.codeVal = this.verifyNumber(this.codeVal).value;
				} else {
					this.codeVal = this.verifyNumber(this.codeVal).value;
				}
			});
	  	},
    	//获取验证码
    	sendCode: function() {
    		if(this.phoneVal == '') {
    			this.$toast('请输入手机号码');
    			return;
    		}
    		if(!this.verifyPhone(this.phoneVal)) { return; }
    		if(this.signFlag) { return; }
    		this.signFlag = true;
    		
    		var that = this;
			var reqUrl = this.baseUrl + '/loginSMS/wechatSend';
			var params = {username: this.phoneVal};
			this.$http.post(reqUrl, params).then(function(res) {
				that.signFlag = false;
				if(!res) {
					return;
				}
				if(res.wechatSmsResult != 'success') {
					that.$toast('验证码发送失败');
					return;
				}
				that.$toast('验证码发送成功');
				that.handleCode();
 			});
    	},
		//发送验证码
	  	handleCode: function() {
	  		this.hadSendBm = true;
	  		localStorage.setItem('hadSendBm', true);//已经发送了验证码
			localStorage.setItem('sendTimeBm', 60);
			this.countDown();
	  	},
	  	//倒计时
	  	countDown: function() {
	  		var that = this;
			this.time1 = setInterval(function() {
				that.sendTimeBm--;
				if(that.sendTimeBm == 0) {
					that.sendTimeBm = 60;
					that.hadSendBm = false;
					window.clearInterval(that.time1);
				}
				localStorage.setItem('hadSendBm', that.hadSendBm);
				localStorage.setItem('sendTimeBm', that.sendTimeBm);
			}, 1000);
	  	},
    	//确认绑定
    	handleBind: function() {
    		this.handleVerifyCode();
    	},
    	//确认短信验证码是否正确
	  	handleVerifyCode: function() {
	  		var that = this;
			var reqUrl = this.baseUrl + '/customer/wechatBindNext'; //微信绑定商城客户验证码校验
			var _wxLoginInfo = JSON.parse(localStorage.getItem('_wxLoginInfo'));
			var params = {
				bindPhone: this.phoneVal,
				reciveVerify: this.codeVal,
				openId: _wxLoginInfo.openid
			};
			this.$http.get(reqUrl, {params: params})
			.then(function(res) {
				if(!res) {
					return;
				}
//				res.phoneType 手机号类型(1.已注册但未绑定微信的手机号码 2.未注册的手机号码)
				var _wxLoginInfo = {
					openid: res.openid, //微信OPENID
					wxLoginCode: res.loginMa //微信登录码
				}
				localStorage.setItem('_wxLoginInfo', JSON.stringify(_wxLoginInfo));
				that.$toast('绑定成功');
				that.goWxLogin(_wxLoginInfo);
 			});
	  	},
	  	//微信用户绑定商城用户
/*  	bindUser: function() {
	  		var that = this;
			var reqUrl = this.baseUrl + '/customer/wechatBindSet';
			var bindUserInfo = JSON.parse(localStorage.getItem('wxUserInfo'));
			var params = {
				bindPhone: this.phoneVal,
				reciveVerify: this.codeVal,
//				bindPwd: 绑定设置登录密码
				openid: bindUserInfo.openid,
				nickname: bindUserInfo.wxnick,
				sex: bindUserInfo.wxsex,
				country: bindUserInfo.wxcountry,
				province: bindUserInfo.wxprince,
				city: bindUserInfo.wxcity,
				addr: bindUserInfo.wxAddr
			};
			this.$http.post(reqUrl, params)
			.then(function(res) {
				if(!res) {
					return;
				}
 			});
	  	}*/
		//联系客服
        hanldleContact() {
            var that = this;
            setTimeout(function() {
            	ysf.config({
	                uid: "1442286211167"
	            });
	            ysf.open();
            }, 500)
        }
    }
}
</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style scoped>
.info {
	color: #a8a8a8;
	font-size: 1.5rem;
	margin: 2.0rem auto;
	text-align: center;
}
.nav > div {
	width: 81%;
	height: 3.5rem;
	margin: 1.0rem auto;
}
/*.nav > .mobile > input,
.nav > .code > input,
.nav > .code > button {
	border: 0.1rem solid #a8a8a8;
	border-radius: 0.6rem;
	padding: 0 1.2rem;
	height: 100%;
}*/
.nav > .mobile > input {
	width: 100%;
	height: 100%;
}
.nav > .code > input {
	width: 63%;
}
.nav > .code > button {
	float: right;
	width: 33%; 
	background: #fff;
	color: #666;
	box-sizing: border-box;
	font-size: 1.3rem;
}
.nav > .btn {
	height: 4.4rem;
	background-image: linear-gradient(#ff4242, #ff4242), 
	linear-gradient(#ff4242, #ff4242);
	border-radius: 0.5rem;
	margin-top: 4.0rem;
	margin-bottom: 2.0rem;
}
.nav > .btn > button {
	width: 100%;
	height: 100%;
	background: transparent;
	color: #fff;
	font-size: 1.7rem;
}
.nav > .login {
	text-align: right;
	color: #ff4242;
	font-size: 1.3rem;
}
.nav > .login > span {
	text-decoration: underline;
}
.btm > p {
	width: 81%;
	font-size: 1.3rem;
	color: #a8a8a8;
	line-height: 2.0rem;
	margin: 0 auto;
}
.btm > p > span,
.btm > p > a {
	color: #4d4d4d;
	text-decoration: underline;
}
.text-gray {
	position: absolute;
	top: 0;
	right: 0;
	font-size: 1.5rem; 
	width: 33%;
	height: 3.8rem;
	line-height: 3.8rem;
	text-align: center;
	color: #a8a8a8;
	margin-left: 1.0rem;
	border: 0.05rem solid #a8a8a8;
	border-radius: 0.3rem;
}
.nav > .code {
	position: relative;
	top: 0;
	left: 0;
	height: 4.0rem;
	margin-top: 1.3rem;
}
.input-code {
	width: 63%;
}
.btn-send {
	position: absolute;
	top: 0rem;
	right: 0;
	width: 33%;
	height: 3.8rem;
	line-height: 3.8rem;
	background: #fff;
	border: 0.05rem solid #a8a8a8;
	border-radius: 0.3rem;
	color: #a8a8a8;
	font-size: 1.3rem;
}
</style>
