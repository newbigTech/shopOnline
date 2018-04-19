<!-- 登录 -->
<template>
	<div class="login">
		<div class="logo">
			<a >
				<img src="../../assets/img/logo-login.png" />
			</a>
		</div>
		<div class="content">
			<!-- 登录 -->
			<div class="login-form">
				<h3 class="form-title">后台管理系统</h3>
				<div class="form-group">
					<label class="control-label visible-ie8 visible-ie9">用户名</label>
					<input class="form-control form-control-solid placeholder-no-fix" type="text" autocomplete="off" placeholder="用户名" v-model="username" @keyup.enter="handleLogin"> 
				</div>
				<div class="form-group">
					<label class="control-label visible-ie8 visible-ie9">密码</label>
					<input class="form-control form-control-solid placeholder-no-fix" type="password" autocomplete="off" placeholder="密码" v-model="userpwd" @keyup.enter="handleLogin">
				</div>
				<div class="form-actions">
					<button type="submit" class="btn btn-success uppercase" @click="handleLogin">登录</button>
					<!--<label class="rememberme check">
						<div class="checker">
							<span @click="handleRem($event)"><input type="checkbox" name="remember" value="1"></span>
						</div>Remember 
					</label>-->
					<!--<a class="forget-password" @click="forgetPwd">Forgot Password?</a>-->
				</div>
				<div class="copyright">
					2018湖南宏裕程网络科技有限公司版权所有
					<!--<a id="register-btn" class="uppercase" @click="showLogin = false">Create an account</a>-->
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import { Message } from 'element-ui';
	export default {
		name: 'login',
		components: {

		},
		data() {
			return {
				username: '',
				userpwd: '',
			}
		},
		mounted() {
			this.$nextTick(function() {
				
			});
		},
		methods: {
			//记住密码
			handleRem: function(e) {
				if(e.currentTarget.className == 'checked') {
					e.currentTarget.className = '';
				} else {
					e.currentTarget.className = 'checked';
				}
			},
			//登录
			handleLogin: function() {
				var that = this;
				var reqUrl = this.baseUrl + '/sysbak/login';
				var params = {
					username: this.username,
					password: this.userpwd
				}
				this.$http.post(reqUrl, params)
				.then(function(res) {
					if(!res) {
						return;
					}
					localStorage.setItem('bsUserInfo', JSON.stringify(res));
					localStorage.setItem('token', res.token);
					that.$message('登录成功');
					that.$router.push('/');
	 			});
			}
		}
	}
</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style scoped>
.login {
	width: 100%;
	height: 100%;
	background-color: #364150 !important;
}

.login .logo {
	margin: 0 auto;
	padding: 15px;
	padding-top: 60px;
	text-align: center;
}

.logo img {
	width: 114px;
}

.login .content {
	background-color: #eceef1;
	width: 400px;
	margin: 30px auto 10px auto;
	padding: 30px;
	padding-top: 20px;
	overflow: hidden;
	position: relative;
}

.login .content h3 {
	color: #4db3a5;
	text-align: center;
	font-size: 28px;
	font-weight: 400 !important;
}

.login .content h4 {
	color: #555;
}

.login .content .login-form,
.login .content .forget-form {
	padding: 0px;
	margin: 0px;
}

.login .content .form-control {
	border: none;
	background-color: #dde3ec;
	height: 43px;
	color: #8290a3;
	border: 1px solid #dde3ec;
}

.login .content .form-control:focus,
.login .content .form-control:active {
	border: 1px solid #c3ccda;
}

.login .content .form-control::-moz-placeholder {
	color: #8290a3;
	opacity: 1;
}

.login .content .form-control:-ms-input-placeholder {
	color: #8290a3;
}

.login .content .form-control::-webkit-input-placeholder {
	color: #8290a3;
}

.login .content select.form-control {
	padding-left: 9px;
	padding-right: 9px;
}

.login .content .forget-form {
	display: none;
}

.login .content .register-form {
	display: none;
}

.login .content .form-title {
	font-weight: 300;
	margin-bottom: 25px;
}

.login .content .form-actions {
	clear: both;
	border: 0px;
	border-bottom: 1px solid #eee;
	padding: 0px 30px 25px 30px;
	margin-left: -30px;
	margin-right: -30px;
}

.login .content .form-actions .checkbox {
	margin-left: 0;
	padding-left: 0;
}

.login .content .forget-form .form-actions {
	border: 0;
	margin-bottom: 0;
	padding-bottom: 20px;
}

.login .content .register-form .form-actions {
	border: 0;
	margin-bottom: 0;
	padding-bottom: 0px;
}

.login .content .form-actions .btn {
	margin-top: 1px;
}

.login .content .form-actions .btn-success {
	font-weight: 600;
	padding: 10px 20px !important;
}

.login .content .form-actions .btn-default {
	font-weight: 600;
	padding: 10px 25px !important;
	color: #6c7a8d;
	background-color: #ffffff;
	border: none;
}

.login .content .form-actions .btn-default:hover {
	background-color: #fafaff;
	color: #45b6af;
}

.login .content .forget-password {
	font-size: 14px;
	float: right;
	display: inline-block;
	margin-top: 10px;
}

.login .content .check {
	color: #8290a3;
}

.login .content .check .checker span {
	margin-top: -2px;
}

.login .content .rememberme {
	float: right;
	margin-left: 8px;
	margin-top: 10px;
}

.login .content .create-account {
	margin: 0 -40px -40px -40px;
	padding: 15px 0 17px 0;
	text-align: center;
	background-color: #6c7a8d;
	-webkit-border-radius: 0 0 7px 7px;
	-moz-border-radius: 0 0 7px 7px;
	-ms-border-radius: 0 0 7px 7px;
	-o-border-radius: 0 0 7px 7px;
	border-radius: 0 0 7px 7px;
}

.login .content .create-account p a {
	font-weight: 600;
	font-size: 14px;
	color: #c3cedd;
}

.login .content .create-account a {
	display: inline-block;
	margin-top: 5px;
}

/* footer copyright */

.login .copyright {
	/*text-align: center;
	margin: 0 auto 30px 0;
	padding: 10px;
	color: #7a8ca5;
	font-size: 13px;*/
	
	margin: 0 -40px -32px -40px;
    padding: 15px 0 15px 0;
    text-align: center;
    background-color: #6c7a8d;
    border-radius: 0 0 7px 7px;
	color: #c3cedd;
}


@media (max-width: 440px) {
	/***
  Login page
  ***/
	.login .logo {
		/*margin-top: 10px;*/
	}
	.login .content {
		width: 280px;
		margin-top: 10px;
	}
	.login .content h3 {
		font-size: 22px;
	}
	.forget-password {
		display: inline-block;
		margin-top: 20px;
	}
	.login-options .social-icons {
		float: left;
		padding-top: 3px;
	}
	.login .checkbox {
		font-size: 13px;
	}
}
</style>