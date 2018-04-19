<!-- 登录 -->
<template>
	<div class="login">
		<div class="header">
			<!--<header-bar :isWhite="true"></header-bar>-->
		</div>
		<div class="nav">
			<div class="logo">
				<img src="../../assets/img/logo--register.png" />
			</div>
			<div class="input-group">
				<div class="input-item input-person">
					<mt-field placeholder="请输入手机号" type="tel" class="input-common" :attr="{maxlength: 11}" v-model="phone" @keyup.native="handlePhone"></mt-field>
					<i class="iconfont">&#xe602;</i>
				</div>
				<div class="input-item input-pwd" v-if="viewPwdLogin">
					<mt-field placeholder="请输入密码" :type="pwdType" class="input-common" :attr="{maxlength: 20}" v-model="pwd" @keyup.native="handleVerifyPwd" onpaste="return false;"></mt-field>
					<i class="iconfont">&#xe61c;</i>
					<i class="iconfont icon-eye" v-if="showPwd" @click="handleShowPwd">&#xe8ee;</i>
					<i class="iconfont icon-eye-close" v-if="!showPwd" @click="handleShowPwd">&#xe615;</i>
				</div>
				<div class="input-item input-validate" v-if="!viewPwdLogin">
					<mt-field placeholder="请输入短信验证码" type="tel" class="input-common" :attr="{maxlength: 6}" v-model="verifyCode" @keyup.native="handleNumber"></mt-field>
					<i class="iconfont">&#xe61c;</i>
					<button class="btn-send" @click="sendCode" v-if="!hadSend" :disabled="signFlag">{{codeBtnText}}</button>
					<span class="text-gray" v-if="hadSend">{{sendTime}}s后重发</span>
				</div>
				<div class="warn-info" v-if="showWarn"><i class="iconfont">&#xe6ce;</i>{{warnInfo}}</div>
				<div class="input-item operate">
					<span @click="$router.push('/register')">注册账号</span>
					<span class="fr" v-if="viewPwdLogin" @click="handleForget">忘记密码</span>
				</div>
				<div class="input-item btn" v-if="viewPwdLogin">
					<button class="btn-red gray" v-if="(phone.length<11) || (pwd.length<6)">登录</button>
					<button class="btn-red" @click="login" v-else>登录</button>
				</div>
				<div class="input-item btn" v-else>
					<button class="btn-red gray" v-if="(phone.length<11) || (verifyCode.length<6)">登录</button>
					<button class="btn-red" @click="login" v-else>登录</button>
				</div>
				<div class="input-item ta-center">
					<a class="text-red" v-if="viewPwdLogin" @click="changeLogin">无密码快速登录</a>
					<a class="text-red" v-if="!viewPwdLogin" @click="changeLogin">使用密码登录</a>
				</div>
			</div>
		</div>
		<div class="btm" v-if="viewPwdLogin">
			<span class="wechat" @click="otherLogin('wechat')"><i class="iconfont">&#xe61b;</i>微信</span>
			<span class="qq" @click="otherLogin('qq')"><i class="iconfont">&#xe644;</i>QQ</span>
			<span class="weibo" @click="otherLogin('weibo')"><i class="iconfont">&#xe614;</i>微博</span>
		</div>
	</div>
</template>

<script>
//	import headerBar from '@/components/header/headerBar'
	import { MessageBox,Indicator } from 'mint-ui';
	export default {
		name: 'login',
		components: {
//			'header-bar': headerBar
		},
		data() {
			return {
				count: 0, //防止发送2条验证码
				viewPwdLogin: true, //使用密码登录
				pwdType: 'password', //密码框的类型
				showPwd: false, //输入密码是否可见
				showWarn: false, //显示警告消息
				warnInfo: '帐号或登录密码错误，请重新输入', //警告信息
				phone: '', //'13107427726',//手机号码
				pwd: '', //密码
				verifyCode: '', //验证码
				loginState: false, //登录按钮状态
				hadSend: false, //显示发送验证码按钮
				sendTime: 60, //发送验证码间隔时间
				time1: null, //定时器
				logIn: false, //登录过的状态 或者是从注册进入的
				codeBtnText: '获取验证码', //获取验证码按钮文字
				signFlag: false,
			}
		},
		created() {
//   		document.body.scrollTop = document.documentElement.scrollTop = 0;
    	},
		mounted() {
			this.$nextTick(function() {
				document.title = '登录';

				var hadSend = eval(localStorage.getItem('hadSend')); //是否发送了验证码
				var sendTime = localStorage.getItem('sendTime'); //发送验证码时间间隔
				if(hadSend != null) {
					this.hadSend = hadSend;
					this.sendTime = sendTime;
					if(eval(hadSend)) {
						this.hadSend = true;
						this.countDown();
					}
//					this.codeBtnText = '重新获取';
				}
				var logIn = localStorage.getItem('logIn');
				if(logIn != null) {
					this.logIn = logIn;
				}
				
				var _loginWay = localStorage.getItem('_loginWay');
				if(_loginWay == 'weixin') {
					this.getWxInfo('wxLogin');//微信授权后获取微信用户信息
				} 
			})
		},
		destroyed() {
			// console.group('销毁完成状态===============》destroyed');
			window.clearInterval(this.time1);
			localStorage.removeItem('hadSend'); //是否发送了验证码
			localStorage.removeItem('sendTime'); //发送验证码时间间隔       

		},
		methods: {
			//验证手机号
			handlePhone: function() {
				//判断是否为数字
				this.$nextTick(function() {
					if(this.verifyNumber(this.phone).state) {
						this.phone = this.verifyNumber(this.phone).value;
					} else {
						this.phone = this.verifyNumber(this.phone).value;
					}
				});
			},
			//密码格式验证
			handleVerifyPwd: function() {
				this.$nextTick(function() {
					if(this.verifyPwd(this.pwd).state) {
						this.pwd = this.verifyPwd(this.pwd).value;
					} else {
						this.pwd = this.verifyPwd(this.pwd).value;
					}
				});
			},
			//验证码格式验证
			handleNumber:function(){
				//判断是否为数字
				this.$nextTick(function() {
					if(this.verifyNumber(this.verifyCode).state) {
						this.verifyCode = this.verifyNumber(this.verifyCode).value;
					} else {
						this.verifyCode = this.verifyNumber(this.verifyCode).value;
					}
				});
			},
			//是否显示密码
			handleShowPwd: function() {
				this.showPwd = !this.showPwd;
				if(this.showPwd) {
					this.pwdType = 'text';
				}
				if(!this.showPwd) {
					this.pwdType = 'password';
				}
			},
			//切换登录方式
			changeLogin: function() {
				this.viewPwdLogin = !this.viewPwdLogin;
			},
			//忘记密码
			handleForget: function() {
				this.$router.push('/forgetPwd');
			},
			//获取验证码
			sendCode: function() {
				if(!this.phone) {
					this.$toast('请输入手机号');
					return;
				}
				if(!this.verifyPhone(this.phone)) {
					return;
				}
//				if(this.count == 0){
//					this.count++;
//				}else{
//					return;
//				}	
				if(this.signFlag) { return; }
    			this.signFlag = true;
				
				var that = this;
				var reqUrl = this.baseUrl + '/loginSMS/send';
				var params = {
					username: this.phone
				};
				this.$http.post(reqUrl, params).then(function(res) {
					that.signFlag = false;
					if(!res) { return; }
					that.$toast('验证码发送成功');
					that.handleCode();
				});
			},
			//发送验证码
			handleCode: function() {
				this.hadSend = true;
				localStorage.setItem('hadSend', true); //已经发送了验证码
				localStorage.setItem('sendTime', 60);
				this.countDown();
			},
			//倒计时
			countDown: function() {
				var that = this;
				this.time1 = setInterval(function() {
					that.sendTime--;
					if(that.sendTime == 0) {
						that.sendTime = 60;
						that.hadSend = false;
						window.clearInterval(that.time1);
//						that.count = 0;
//						that.codeBtnText = '重新获取';
					}
					localStorage.setItem('hadSend', that.hadSend);
					localStorage.setItem('sendTime', that.sendTime);
				}, 1000);
			},
			//登录
			login: function() {
				var params = {};
				if(!this.phone) {
					this.$toast('请输入手机号');
					return;
				}
				if(!this.verifyPhone(this.phone)) {
					return;
				}
				if(this.viewPwdLogin) { //使用密码登录
					if(!this.pwd) {
						this.$toast('请输入密码');
						return;
					}
					params.loginType = "1";
					params.password = this.pwd;
				} else { //无密码登录
					if(!this.verifyCode) {
						this.$toast('请输入验证码');
						return;
					}
					params.loginType = "2";
					params.verifyCode = this.verifyCode;
				}
				params.username = this.phone;

				var that = this;
				var reqUrl = this.baseUrl + '/customer/login';
				this.$http.post(reqUrl, params).then(function(res) {
					if(res == '账号或密码错误') {
						MessageBox({
							title: '',
							message: '帐号或登录密码错误，请重新输入',
							confirmButtonText: '重新输入',
							cancelButtonText: '忘记密码？',
							showCancelButton: true
						}).then(function(action) {
							if(action == 'confirm') {
							} else {
								that.handleForget();
							}
						})
						return;
					}
					if(!res) {return;}
					if(res.isExitPwd == '2') { //没有设置登录密码
						MessageBox({
							title: '',
							message: '未设置登录密码',
							confirmButtonText: '前往设置',
							cancelButtonText: '取消',
							showCancelButton: true
						}).then(function(action) {
							if(action == 'confirm') {
								that.$router.push('/loginPassword');
							} else {}
						})
					}
					window.clearInterval(that.time1);
					localStorage.setItem('hadSend', false);
					localStorage.setItem('sendTime', 60);
					
					that.userInfo = res;
					that.token = res.token;
					localStorage.setItem('userInfo', JSON.stringify(res));
					localStorage.setItem('token', res.token); 
					
					if(that.logIn) {
						that.$router.push('/');
					} else {
						that.$router.go(-1);
					}
				});
			},
			//第三方登录
			otherLogin: function(param) {
				if(param == 'wechat') { 
//					location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf338c04edcea11c8'
//						+'&redirect_uri=http://hycmall.imwork.net/login'
//						+ '&connect_redirect=1&response_type=code&scope=snsapi_base&state=1#wechat_redirect';

					localStorage.setItem('_loginWay', 'weixin');
					var redirect_uri = this.onlineUrl + '/login';
					this.handleWxAuthor(redirect_uri);
				} else if(param == 'qq') {
					this.$toast('暂不支持QQ登录');
				} else if(param == 'weibo') {
					this.$toast('暂不支持微博登录');
				}
			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.login {
		width: 100%;
		background: #fff;
		overflow: hidden;
	}
	
	.header {
		position: relative;
		top: 0;
		left: 0;
		width: 100%;
		height: 15rem;
		background-image: url(img/bg-red.png);
		background-size: 100% auto;
		background-repeat: no-repeat;
	}
	
	.nav {
		position: relative;
		top: 0;
		left: 0;
		width: 87%;
		/* 27.8rem */
		/*min-width: 27.8rem;*/
		min-height: 32rem;
		background: #fff;
		margin: -7.2rem auto 0 auto;
		border-radius: 1.5rem;
		/*box-shadow: -0.2rem 0 1rem rgba(255, 66, 66, 0.15),
							0 -0.2rem 1rem rgba(255, 66, 66, 0.15),
							0.6rem 0 1rem rgba(255, 66, 66, 0.15),
							0 1rem 1rem rgba(255, 66, 66, 0.15);*/
		box-shadow: 0.3rem 0.45rem 1.75rem 0.2rem rgba(255, 66, 66, 0.15);
		padding-top: 10rem;
		margin-bottom: 4.6rem;
	}
	
	.nav .logo {
		position: absolute;
		top: -3.6rem;
		left: calc(50% - 4.55rem);
		width: 9.1rem;
		height: 9.1rem;
		line-height: 9.1rem;
		border-radius: 9.1rem;
		text-align: center;
		background: #fff;
		font-size: 2.7rem;
		color: #ff4242;
		box-shadow: 0.1rem 0.05rem 0.6rem 0.1rem rgba(255, 62, 102, 0.21);
		/*box-shadow: 0.2rem 0.5rem 0.5rem rgba(255, 66, 66, 0.15);*/
	}
	.logo > img {
		width: 9.1rem;
		height: 9.1rem;
	}
	
	input {
		background: #fff;
	}
	
	.input-group .input-item {
		position: relative;
		left: 0;
		top: 0;
		width: 85%;
		margin: 0 auto 3.7rem auto;
		clear: both;
	}
	
	.input-item .iconfont {
		position: absolute;
		left: 0;
		top: 0.5rem;
		font-size: 1.8rem;
		color: rgba(0, 0, 0, 0.5);
	}
	
	.input-item.input-person .iconfont {
		top: 0.8rem;
		left: -0.26rem;
		font-size: 2.2rem;
	}
	
	.input-group .input-item input {
		width: 100%;
		height: 3.0rem;
		line-height: 3.0rem;
		padding-left: 3.0rem;
		border: none;
		border-bottom: 0.1rem solid rgba(0, 0, 0, 0.2);
		font-size: 1.5rem;
	}
	
	.input-group .input-item .input-common {
		position: relative;
		top: 0;
		left: 0;
		width: 100%;
		height: 3.2rem;
		line-height: 3.0rem;
		padding-left: 1.0rem;
		border-bottom: 0.05rem solid rgba(0, 0, 0, 0.2);
		font-size: 1.5rem;
	}
	/*.input-group .input-item .input-common:after {
	position: absolute;
	left: 0;
	top: -0.1rem;
	content: '';
	width: 200%;
	height: 200%;
	border-bottom: 0.1rem solid rgba(0,0,0,0.2);
	transform: scale(0.5);
	transform-origin: 0 0;
}*/
	
	.input-group .input-item.input-pwd .input-common {
		padding-right: 2.2rem;
	}
	
	.input-group .input-item.input-validate .input-common {
		padding-right: 6.2rem;
	}
	
	.mint-cell {
		min-height: 3.0rem;
	}
	
	.input-item.input-pwd input {
		padding-right: 20%;
	}
	
	.input-item>span {
		color: #666;
		font-size: 1.3rem;
	}
	
	.input-item .input-code {
		padding-right: 7.5rem;
	}
	
	.input-item .btn-send {
		position: absolute;
		right: 0;
		top: 0;
		width: 7.0rem;
		height: 2.4rem;
		font-size: 1.2rem;
		border-radius: 0.5rem;
		/*border: 0.05rem solid #808080;*/
		background: #fff;
		color: #808080;
		/*box-shadow: inset 0rem -0.05rem 0.05rem -0.05rem #808080;*/
		/*box-shadow: inset -0.05rem 0 0.05rem #808080,
							inset 0 -0.05rem 0.05rem #808080,
							inset 0.05rem 0 0.05rem #808080,
							inset 0 0.05rem 0.05rem #808080;*/
	}
	
	.input-item .btn-send:after {
		position: absolute;
		left: 0;
		top: 0;
		width: 200%;
		height: 200%;
		content: '';
		border: 0.05rem solid #808080;
		border-radius: 1.0rem;
		transform: scale(0.5);
		transform-origin: 0 0;
	}
	
	.text-gray {
		position: absolute;
		right: 0.2rem;
		top: 1.0rem;
		color: #808080;
		font-size: 1.2rem;
	}
	
	.input-item .iconfont.icon-eye,
	.input-item .iconfont.icon-eye-close {
		top: 0.7rem;
		left: 90%;
		font-size: 1.9rem;
		cursor: pointer;
	}
	
	.fr {
		float: right;
	}
	
	.btn-red {
		width: 100%;
		height: 4.4rem;
		line-height: 4.4rem;
		background: #ff4242;
		color: #fff;
		font-size: 1.7rem;
		border-radius: 0.5rem;
	}
	
	.btn-red.gray {
		background: #d9d9d9;
	}
	
	.ta-center {
		text-align: center;
		padding-bottom: 5rem;
	}
	
	.text-red {
		color: #ff4242;
		font-size: 1.5rem;
		text-decoration: underline;
	}
	
	.warn-info {
		width: 85%;
		color: #ff4242;
		font-size: 1.2rem;
		margin: -1.7rem auto -1.4rem auto;
	}
	
	.warn-info .iconfont {
		margin-right: 0.7rem;
	}
	
	.input-group .operate {
		margin-top: 4.0rem;
		margin-bottom: 2.0rem;
	}
	
	.input-group .btn {
		margin-bottom: 2.3rem;
	}
	
	.btm {
		/*position: fixed;*/
		/*bottom: 2.5rem;*/
		/*left: calc(50% - 12rem);*/
		width: 25rem;
		text-align: center;
		margin: 0 auto;
	}
	
	.btm>span {
		float: left;
		font-size: 1.2rem;
		color: #a8a8a8;
		width: 8rem;
		height: 1.75rem;
		line-height: 1.7rem;
		text-align: center;
	}
	
	.btm>span:nth-child(1),
	.btm>span:nth-child(2) {
		width: calc(8rem - 0.1rem);
		border-right: 0.1rem solid #a8a8a8;
	}
	
	.btm>span .iconfont {
		font-size: 2.0rem;
		vertical-align: middle;
		margin-right: 0.1rem;
	}
	
	.btm>span.wechat .iconfont {
		color: #2dbb4b;
	}
	
	.btm>span.qq .iconfont {
		color: #1ebbfc;
	}
	
	.btm>span.weibo .iconfont {
		color: #ff0035;
	}
</style>