<!-- 邀请好友的注册 -->
<template>
	<div class="register">
		<div class="header">
			<h2 v-if="success"><i class="iconfont icon-gou"></i>注册成功</h2>
			<!--<header-bar :isWhite="true"></header-bar>-->
		</div>
		<div class="nav" v-if="!success">
			<div class="top">
				<div class="logo">
					<img src="../../assets/img/logo--register.png" />
				</div>
				<h2>{{title}}</h2>
				<h3>{{adInfo}}</h3>
			</div>
			<div class="input-group">
				<div class="input-item input-person">
					<mt-field placeholder="请输入手机号" type="tel" class="input-common" :attr="{maxlength: 11}" v-model="phone" @keyup.native="handlePhone"></mt-field>
					<i class="iconfont">&#xe602;</i>
				</div>
				<div class="input-item input-validate">
					<mt-field placeholder="请输入短信验证码" type="tel" class="input-common" :attr="{maxlength: 6}" v-model="verifyCode" @keyup.native="handleNumber"></mt-field>
					<i class="iconfont">&#xe61c;</i>
					<button class="btn-send" @click="handleRegPhone" v-if="!hadSendReg" :disabled="signFlag">{{codeBtnText}}</button>
					<span class="text-gray" v-if="hadSendReg">{{sendTimeReg}}秒后重发</span>
				</div>
				<div class="input-item input-pwd">
					<mt-field placeholder="请输入密码" :type="pwdType" class="input-common" :attr="{maxlength: 20}" v-model="pwd" @keyup.native="handleVerifyPwd" onpaste="return false;"></mt-field>
					<i class="iconfont">&#xe61c;</i>
					<i class="iconfont icon-eye" v-if="showPwd" @click="handleShowPwd">&#xe8ee;</i>
					<i class="iconfont icon-eye-close" v-if="!showPwd" @click="handleShowPwd">&#xe615;</i>
				</div>
				<div class="warn-info" v-if="showWarn"><i class="iconfont">&#xe6ce;</i>{{warnInfo}}</div>
				<div class="input-item btn" v-if="viewPwdLogin">
					<button class="btn-red gray" v-if="(phone.length<11) || (pwd.length<6)">接受邀请</button>
					<button class="btn-red" @click="register" v-else>接受邀请</button>
				</div>
			</div>
		</div>
		<div class="success-con" v-if="success">
			<div class="part">
				<p class="text-orange">长按二维码进入商城</p>
				<p class="fingerprint"><img src="./img/fingerprint.png" /></p>
				<!--<p class="code">
					<img src="./img/code.png" />
				</p>-->
				<div ref="twoCode" id="qart"></div>
			</div>
		</div>
	</div>
</template>

<script>
	import { Toast } from 'mint-ui';

	export default {
		name: 'register',
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
				hadSendReg: false, //显示发送验证码按钮
				sendTimeReg: 60, //发送验证码间隔时间
				time1: null, //定时器
				logIn: false, //登录过的状态
				codeBtnText: '获取验证码', //获取验证码按钮文字
				success: false,
				inviteInfo: '',//邀请人信息
				signFlag: false,
			}
		},
		created() {
//			document.body.scrollTop = document.documentElement.scrollTop = 0;
	        this.loadScript();
	    },
		mounted() {
			this.$nextTick(function() {
				document.title = '注册';
				
				var hadSendReg = eval(localStorage.getItem('hadSendReg')); //是否发送了验证码
				var sendTimeReg = localStorage.getItem('sendTimeReg'); //发送验证码时间间隔
				if(hadSendReg != null) {
					this.hadSendReg = hadSendReg;
					this.sendTimeReg = sendTimeReg;
					if(eval(hadSendReg)) {
						this.hadSendReg = true;
						this.countDown();
					}
//					this.obtainTxt = '重新获取';
				}
				
				var param = this.$route.query.phone;
				if(param != null) {
					this.inviteInfo = param;
				}
				
//				var that = this;
//				setTimeout(function() {
//	       			that.qrcode();//生成二维码
//	       		}, 1000)
			})
		},
		destroyed() {
			// console.group('销毁完成状态===============》destroyed');
			window.clearInterval(this.time1);
			localStorage.removeItem('hadSendReg'); //是否发送了验证码
			localStorage.removeItem('sendTimeReg'); //发送验证码时间间隔       
		},
		methods: {
			loadScript() {
				//生成二维码
	            const s2 = document.createElement('script');
		        s2.type = 'text/javascript';
		        s2.src = '/static/js/qrcode.js';
		        document.body.appendChild(s2);
			},
			//生成二维码
			qrcode: function() {
	        	var qrcode = new QRCode(document.getElementById("qart"), {
	        	 	width: 130,
	        	 	height: 130
	        	});
	        	var onlineUrl = this.onlineUrl;
		        qrcode.makeCode(onlineUrl);
			},
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
			//密码输入框
			handleShowPwd: function() {
				this.showPwd = !this.showPwd;
				if(this.showPwd) {
					this.passType = 'text';
				}
				if(!this.showPwd) {
					this.passType = 'password';
				}
			},
			//验证注册手机号码
			handleRegPhone: function() {
				if(!this.phone) {
					this.$toast('请输入手机号');
					return;
				}
				if(!this.verifyPhone(this.phone)) {
					return;
				}
				
				var that = this;
				var reqUrl = this.baseUrl + '/customer/checkPhone';
				var params = {
					phone: this.phone
				};
				this.$http.get(reqUrl, {params: params}).then(function(res) {
					if(!res) {
						return;
					}
					that.sendCode();
				});
			},
			//获取验证码
			sendCode: function() {
				if(this.signFlag) {
        			return;
        		}
        		this.signFlag = true;
				var that = this;
				var reqUrl = this.baseUrl + '/customer/getVerifyCode';
				var params = {
					phone: this.phone
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
				this.hadSendReg = true;
				localStorage.setItem('hadSendReg', true); //已经发送了验证码
				localStorage.setItem('sendTimeReg', 60);
				this.countDown();
			},
			//倒计时
			countDown: function() {
				var that = this;
//				if(this.time1 != null) {
//					return;
//				}
				this.time1 = setInterval(function() {
					that.sendTimeReg--;
					if(that.sendTimeReg == 0) {
						that.sendTimeReg = 60;
						that.hadSendReg = false;
						window.clearInterval(that.time1);
//						that.count = 0;
//						that.obtainTxt = '重新获取';
					}
					localStorage.setItem('hadSendReg', that.hadSendReg);
					localStorage.setItem('sendTimeReg', that.sendTimeReg);
				}, 1000);
			},
			//注册
			register: function() {
				var params = {};
				if(!this.phone) {
					this.$toast('请输入手机号');
					return;
				}
				if(!this.verifyPhone(this.phone)) {
					return;
				}
				if(!this.verifyCode) {
					this.$toast('请输入验证码');
					return;
				}
				if(!this.pwd) {
					this.$toast('请输入密码');
					return;
				}
				if(this.parentPhone) {
					params.parentPhone = this.parentPhone;
				}
				params.phone = this.phone;
				params.verifyCode = this.verifyCode;
				params.password = this.pwd;
				params.parentPhone = this.inviteInfo; //推荐人号码

				var that = this;
				var reqUrl = this.baseUrl + '/customer/register';
				this.$http.post(reqUrl, params).then(function(res) {
					if(!res) {
						return;
					}
					window.clearInterval(that.time1);
					localStorage.setItem('hadSendReg', false);
					localStorage.setItem('sendTimeReg', 60);
					that.success = true;
					setTimeout(function() {
		       			that.qrcode();//生成二维码
		       		}, 1000)
				});
			},
			handleFinish: function() {
				this.$router.push('/login');
			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	@import '../../assets/css/itemCommon.css';
	.register {
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
	.header > h2 {
		line-height: 14.0rem;
		text-align: center;
		font-size: 1.9rem;
		color: #fff;
	}
	.header > h2 > i {
		font-size: 3.1rem;
		vertical-align: middle;
		margin-right: 0.8rem;
	}
	.nav {
		position: relative;
		top: 0;
		left: 0;
		width: 87%;
		/* 27.8rem */
		/*min-width: 27.8rem;*/
		min-height: 35.0rem;
		background: #fff;
		margin: -7.2rem auto 0 auto;
		border-radius: 1.5rem;
		/*box-shadow: -0.2rem 0 1rem rgba(255, 66, 66, 0.15),
							0 -0.2rem 1rem rgba(255, 66, 66, 0.15),
							0.6rem 0 1rem rgba(255, 66, 66, 0.15),
							0 1rem 1rem rgba(255, 66, 66, 0.15);*/
		box-shadow: 0.3rem 0.45rem 1.75rem 0.2rem rgba(255, 66, 66, 0.15);
		padding-top: 8rem;
		margin-bottom: 5rem;
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
		/*width: 5.3rem;
		height: 5.3rem;
		margin-top: 2.0rem;*/
		width: 9.1rem;
		height: 9.1rem;
	}
	.top {
		text-align: center;
		margin-bottom: 5.0rem;
	}
	.top > h2 {
		font-size: 1.7rem;
		color: #333;
		margin-top: -1.0rem;
		margin-bottom: 0.8rem;
	}
	.top > h3 {
		font-size: 1.6rem;
		color: #999;
	}
	input {
		background: #fff;
	}
	
	.input-group .input-item {
		position: relative;
		left: 0;
		top: 0;
		width: 85%;
		margin: 0 auto 3.2rem auto;
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
		background: #B3B3B3;
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
	.success-con .part {
		text-align: center;
	}
	.success-con .part .text-orange {
		font-size: 1.9rem;
		color: #ff6738;
		margin-top: 5.0rem;
		/*margin-top: 6.0rem;*/
	}
	.success-con .part .fingerprint img {
		width: 10rem;
		height: 10rem;
		margin-top: 2.6rem;
		margin-bottom: 2.0rem;
	}
	.success-con .part #qart {
		display: inline-block;
		/*width: 13.7rem;*/
		/*height: 13.7rem;*/
		margin: 0 auto;
	}
	.success-con .part .code img,
	.success-con .part .code div {
		display: inline-block;
		width: 13.7rem;
		height: 13.7rem;
		margin-top: 2.2rem;
		background: #ccc;
	}
</style>