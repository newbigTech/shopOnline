<!-- 注册 -->
<template>
	<div class="register">
		<div v-if="!success" class="before-success">
			<div class="input-group">
				<div class="input-item">
					<input id="phone" type="tel" maxlength="11" placeholder="请输入手机号" v-model="phone" @input="phoneShowDel" />
					<i class="iconfont icon-iconfontcolor92 color-gray" @click="delInpVal" v-show="phoneIcon"></i>
				</div>
				<div class="input-item validate-input clearfix">
					<div class="input-box">
						<input id="verifyCode" type="tel" maxlength="6" placeholder="请输入验证码" v-model="code" @input="verifyShowDel" />
						<i class="iconfont icon-iconfontcolor92 color-gray" @click="delInpVal" v-show="verifyCodeIcon"></i>
					</div>
					<button v-if="!hadSendReg" @click="handleRegPhone" :disabled="signFlag">{{ obtainTxt }}</button>
					<span class="text-gray" v-if="hadSendReg">{{sendTimeReg}}秒后获取</span>
				</div>
				<div class="input-item">
					<input id="password" :type="passType" maxlength="20" placeholder="请输入登录密码" v-model="pwd" @input="pwdShowDel" onpaste="return false;" />
					<i class="iconfont icon-iconfontcolor92 color-gray u-del" @click="delInpVal" v-show="passwordIcon"></i>
					<i class="iconfont color-gray" :class="showPwd?' icon-yanjing':'icon-biyan' " @click="handleShowPwd"></i>
				</div>
				<!--<div class="fill-referee">
					<span @click="popup">
						<span>填写推荐人</span>
					<i class="iconfont icon-caret" :class="popupInp?' rotate':''"></i>
					</span>
				</div>
				<div class="input-item" v-if="popupInp">
					<input id="parentPhone" type="tel" maxlength="11" placeholder="请输入推荐人手机号(选填)" v-model="parentPhone" @input="parentPhoneShowDel" />
					<i class="iconfont icon-iconfontcolor92 color-gray" @click="delInpVal" v-show="parentPhoneIcon"></i>
				</div>-->
				<div class="input-item">
					<button class="btn-block no-success" v-if="(!phone) || (!code) || (pwd.length<6)">下一步</button>
					<button class="btn-block success" @click="register" v-else>下一步</button>
				</div>
			</div>
			<div class="text-hint">
				注册即表示同意益品购 <span @click="$router.push({name: 'registerProtocol',query: { protoType: '1'}});">《用户服务协议》</span>
				与 <span @click="$router.push({name: 'registerProtocol',query: { protoType: '2'}});">《隐私政策》</span>条款
			</div>
		</div>
		<div :style="{height: (clientH * 10) + 'px'}" class="success-con"  v-if="success" >
			<div class="content">
				<div class="returnMsg-box">
					<i class="iconfont icon-gou"></i>
					<div class="account">
						您的账号{{phone}}
					</div>
					<div class="returnMsg">
						注册成功
					</div>
				</div>
				<button class="btn-block" @click="handleFinish">完成</button>
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
				obtainTxt: '获取验证码',
				count: 0,
				countint: 0,
				popupInp: false,
				passType: 'password', //输入框类型
				showPwd: false, //密码是否显示
				phone: '', //手机号码
				code: '', //验证码
				pwd: '', //密码
				parentPhone: null, //推荐人手机号码
				phoneIcon: false, //手机号删除图标
				verifyCodeIcon: false, //验证码删除图标
				passwordIcon: false, //密码删除图标
				parentPhoneIcon: false, //推荐人手机号删除图标
				hadSendReg: false, //显示发送验证码按钮
				sendTimeReg: 60, //发送验证码间隔时间
				success: false, //注册成功
				time1: null, //定时器
				signFlag: false
			}
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
			})
		},
		destroyed() {
			// console.group('销毁完成状态===============》destroyed');
			window.clearInterval(this.time1);
			localStorage.removeItem('hadSendReg'); //是否发送了验证码
			localStorage.removeItem('sendTimeReg'); //发送验证码时间间隔       

		},
		methods: {
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
					that.signFlag = true;
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
						that.count = 0;
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
				if(!this.code) {
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
				params.verifyCode = this.code;
				params.password = this.pwd;

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
				});
			},
			popup: function() {
				this.popupInp = !this.popupInp;
			},
			handleFinish: function() {
				localStorage.setItem('logIn', true)
				this.$router.push('/login');
			},
			//删除input内容
			delInpVal() {
				var thisElem = event.currentTarget;
				var prevElem = thisElem.previousElementSibling;
				if(prevElem.tagName == 'INPUT') {
					var prevElemId = prevElem.getAttribute("id");
					switch(prevElemId) {
						case 'phone':
							this.phone = "";
							this.phoneIcon = false;
							break;
						case 'verifyCode':
							this.code = "";
							this.verifyCodeIcon = false;
							break;
						case 'password':
							this.pwd = "";
							this.passwordIcon = false;
							break;
						case 'parentPhone':
							this.parentPhone = "";
							this.parentPhoneIcon = false;
							break;
						default:
							return;
					}
				}
			},
			//手机号输入框删除按钮显示
			phoneShowDel() {
				//判断是否为数字
				if(this.verifyNumber(this.phone).state) {
					this.phone = this.verifyNumber(this.phone).value;
				} else {
					this.phone = this.verifyNumber(this.phone).value;
				}
				//判断有值出现
				if(this.phone) {
					this.phoneIcon = true;
				} else {
					this.phoneIcon = false;
				}
			},
			//验证码输入框删除按钮显示
			verifyShowDel() {
				//判断是否为数字
				if(this.verifyNumber(this.code).state) {
					this.code = this.verifyNumber(this.code).value;
				} else {
					this.code = this.verifyNumber(this.code).value;
				}
				//判断有值出现
				if(this.code) {
					this.verifyCodeIcon = true;
				} else {
					this.verifyCodeIcon = false;
				}
			},
			//密码输入框删除按钮显示
			pwdShowDel() {
				//判断是否符合密码验证
				if(this.verifyPwd(this.pwd).state) {
					this.pwd = this.verifyPwd(this.pwd).value;
				} else {
					this.pwd = this.verifyPwd(this.pwd).value;
				}
				//判断有值出现
				if(this.pwd) {
					this.passwordIcon = true;
				} else {
					this.passwordIcon = false;
				}
			},
			//推荐人手机号输入框删除显示
			parentPhoneShowDel() {
				//判断是否为数字
				if(this.verifyNumber(this.parentPhone).state) {
					this.parentPhone = this.verifyNumber(this.parentPhone).value;
				} else {
					this.parentPhone = this.verifyNumber(this.parentPhone).value;
				}
				//判断有值出现
				if(this.parentPhone) {
					this.parentPhoneIcon = true;
				} else {
					this.parentPhoneIcon = false;
				}
			},
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	@import '../../assets/css/itemCommon.css';
	/* common */
	
	.color-gray {
		color: #d2d2d2;
	}
	/* common end */
	
	.before-success {
		padding: 2.0rem 3.5rem 0 3.5rem;
		/*margin: 2rem auto 0;*/
	}
	
	.register * {
		box-sizing: border-box;
		outline: none;
	}
	
	.register .input-group {
		padding-top: 1.5rem;
	}
	
	.input-group .input-item {
		position: relative;
		margin-bottom: 1.5rem;
	}
	
	#password {
		padding-right: 6rem;
	}
	
	.input-group .input-item input {
		box-sizing: border-box;
		width: 100%;
		font-size: 1.4rem;
		height: 4rem;
		border: 0.1rem solid #ddd;
		padding: 0.8rem 3rem 0.8rem 0.5rem;
		border-radius: 0.3rem;
		-webkit-appearance: none;
	}
	
	.input-group .input-item.validate-input .input-box {
		position: relative;
		float: left;
		width: 63%;
	}
	
	.input-group .input-item.validate-input .input-box input {
		width: 100%;
	}
	
	.input-group .validate-input button,
	.input-group .validate-input span.text-gray {
		float: right;
		font-size: 1.4rem;
		height: 4rem;
		width: 33%;
		border-radius: 0.3rem;
		background-color: #fff;
		border: 1px solid #ddd;
		color: #666;
	}
	
	.input-group .validate-input span.text-gray {
		text-align: center;
		line-height: 4rem;
	}
	
	.input-group .input-item i {
		font-size: 1.6rem;
		position: absolute;
		top: 1.2rem;
		right: 1rem;
	}
	
	.input-group .input-item i.icon-yanjing {
		font-size: 2rem;
	}
	
	.input-group .input-item i.u-del {
		right: 3.5rem;
	}
	
	.input-group .input-item i.icon-biyan {
		font-size: 1.8rem;
	}
	
	.input-group .input-item .btn-block {
		display: block;
		width: 100%;
		height: 4.5rem;
		line-height: 4.5rem;
		font-size: 1.6rem;
		color: #fff;
		background-color: #ff4242;
		border-radius: 0.5rem;
	}
	
	.input-group .input-item .btn-block.no-success {
		background-color: #d9d9d9;
	}
	
	.input-group .fill-referee {
		text-align: right;
		height: 1.5rem;
		font-size: 1.3rem;
		margin-bottom: 1.25rem;
	}
	
	.input-group .fill-referee span {
		color: #999;
	}
	
	.input-group .fill-referee span i {
		display: inline-block;
	}
	
	.input-group .fill-referee span i.rotate {
		transform: rotate(180deg);
		-ms-transform: rotate(180deg);
		/* IE 9 */
		-moz-transform: rotate(180deg);
		/* Firefox */
		-webkit-transform: rotate(180deg);
		/* Safari 和 Chrome */
		-o-transform: rotate(180deg);
		/* Opera */
	}
	
	.register .text-hint {
		font-size: 1.3rem;
		padding-top: 1rem;
		line-height: 1.8rem;
	}
	
	.register .text-hint span {
		color: #1EBBFC;
		cursor: pointer;
	}
	
	.register.messAbc i {
		font-size: 2rem;
	}
	/* registerSuccess */
	
	.success-con {
		padding: 2.0rem 3.5rem 0 3.5rem;
		background: #f5f5f5;
	}
	.register .content {
		padding: 0 2.5rem 3.5rem;
		/*margin-top: 5rem;*/
		background-color: #fff;
		border-radius: 1rem;
		box-shadow: 0px 3px 24px 0px rgba(138, 132, 132, 0.08);
	}
	
	.returnMsg-box {
		padding-top: 4rem;
		text-align: center;
		line-height: 1.5;
	}
	
	.returnMsg-box i {
		font-size: 5rem;
		color: #b3b3b3;
	}
	
	.returnMsg-box .account {
		margin-top: 1rem;
		font-size: 1.6rem;
		color: #666;
	}
	
	.returnMsg-box .returnMsg {
		font-size: 1.8rem;
		color: #ff4242;
		margin-bottom: 3em;
	}
	
	.btn-block {
		display: block;
		width: 100%;
		line-height: 4.5rem;
		height: 4.5rem;
		font-size: 1.6rem;
		color: #fff;
		background-color: #ff4242;
		border-radius: 0.5rem;
	}
	/* registerSuccess END */
</style>