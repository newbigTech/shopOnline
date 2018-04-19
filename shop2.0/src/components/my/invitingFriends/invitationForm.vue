<!-- 邀请好友表单 （不需要） -->
<template>
	<div id="invitationForm">
		<div class="content">
			<div class="ct-hd"></div>
			<div class="nav">
				<div class="logo">logo</div>
				<div class="text-box">
					<p>益品购</p>
					<p class="gray">logen或营销短语</p>
				</div>
				<div class="input-group">
					<div class="input-item input-person">
						<i class="iconfont">&#xe602;</i>
						<div class="input-box">
							<input type="text" placeholder="请输入手机号" />
							<i class="iconfont icon-iconfontcolor92 u-del"></i>
						</div>
					</div>
					<div class="input-item verification-code">
						<i class="iconfont">&#xe61c;</i>
						<div class="input-box">
							<input type="text" placeholder="请输入短信验证码" />
							<i class="iconfont icon-iconfontcolor92 u-del"></i>
						</div>
						<button class="btn-send">获取验证码</button>
					</div>
					<div class="input-item">
						<i class="iconfont">&#xe61c;</i>
						<div class="input-box">
							<input type="password" placeholder="请输入登录密码" />
							<i class="iconfont icon-iconfontcolor92 u-del"></i>
						</div>
						<a href="javascript:;" class="iconfont icon-biyan"></a>
					</div>
					<div class="input-item btn">
						<button class="btn-red" @click="$router.push({name: 'invitationSuccess'})">接受邀请</button>
					</div>
				</div>
			</div>
			<div class="ct-ft">
				<p>宏裕程网络科技有限公司版权所有</p>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'invitationForm',
		data() {
			return {

			}
		},
		mounted() {
			document.title = '邀请您体验益品购';
		},
		methods: {

		}
	}
</script>

<style scoped>
	#invitationForm .content {
		width: 100%;
	}
	
	.content .ct-hd {
		position: relative;
		top: 0;
		left: 0;
		height: 15rem;
		background-image: url(../../login/img/bg-red.png);
		background-size: 100% auto;
		background-repeat: no-repeat;
		font-size: 2rem;
	}
	
	.content .ct-ft {
		padding: 5rem 0 1.5rem;
		text-align: center;
		color: #999;
		font-size: 1.3rem;
	}
	
	.nav {
		position: relative;
		top: 0;
		left: 0;
		width: 87%;
		/*height: 43rem;*/
		background: #fff;
		margin: -7.8rem auto 0 auto;
		border-radius: 1.5rem;
		box-shadow: -0.2rem 0 1rem rgba(255, 66, 66, 0.15), 0 -0.2rem 1rem rgba(255, 66, 66, 0.15), 0.6rem 0 1rem rgba(255, 66, 66, 0.15), 0 1rem 1rem rgba(255, 66, 66, 0.15);
		-webkit-box-shadow: 0.3rem 0.45rem 1.75rem 0.2rem rgba(255, 66, 66, 0.15);
		box-shadow: 0.3rem 0.45rem 1.75rem 0.2rem rgba(255, 66, 66, 0.15);
		padding-top: 5rem;
		padding-bottom: 3.5rem;
	}
	
	.nav .text-box {
		padding-bottom: 4.7rem;
		text-align: center;
		line-height: 2.5rem;
		font-size: 1.7rem;
		color: #333;
		margin-top: 1.5rem;
	}
	
	.nav .text-box .gray {
		font-size: 1.6rem;
		color: #999;
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
		font-size: 2.6rem;
		color: #ff4242;
		box-shadow: 0.2rem 0.5rem 0.5rem rgba(255, 66, 66, 0.15);
	}
	
	input {
		background: #fff;
	}
	
	.input-group .input-item {
		display: flex;
		display: -webkit-flex;
		width: 85%;
		height: 4rem;
		margin: 0 auto 2.5rem;
		border-bottom: 0.1rem solid rgba(0, 0, 0, 0.2);
		align-items: center;
	}
	
	.input-group .input-item .input-box {
		position: relative;
		width: calc(100% - 1.8rem);
	}
	
	.input-group .input-item .input-box i {
		position: absolute;
		top: 1rem;
		right: 0.3rem;
		font-size: 1.5rem;
		height: 1.5rem;
		line-height: 1.5rem;
		color: #ccc;
	}
	
	.input-group .input-item:nth-child(3) {
		padding-bottom: 0;
		margin-bottom: 3.5rem;
	}
	
	.input-group .input-item:last-child {
		border-bottom: 0;
		padding-bottom: 0;
		margin-bottom: 0;
	}
	
	.input-item .iconfont {
		font-size: 1.8rem;
		height: 1.8rem;
		line-height: 1.8rem;
		color: rgba(0, 0, 0, 0.5);
	}
	
	.input-item:first-child .iconfont:first-child {
		margin-top: 0.8rem;
	}
	
	.input-item:nth-child(2) .iconfont:first-child,
	.input-item:nth-child(3) .iconfont:first-child {
		margin-top: -0.1rem;
	}
	
	.input-group .input-item.verification-code .input-box {
		width: calc(100% - 8.3rem);
	}
	
	.input-group .input-item .input-box input {
		box-sizing: border-box;
		-webkit-box-sizing: border-box;
		display: block;
		height: 3.9rem;
		line-height: 3.9rem;
		width: 100%;
		padding-left: 0.5rem;
		font-size: 1.4rem;
		padding-right: 2rem;
	}
	
	.input-group .input-item.verification-code input {
		box-sizing: border-box;
	}
	
	.input-group .input-item.verification-code a {
		position: absolute;
		left: auto;
		right: 0;
		top: 0.5rem;
		width: 2rem;
		height: 2rem;
		background: #fff;
		color: #808080;
		font-size: 1.8rem;
	}
	
	.input-item>span {
		color: #666;
		font-size: 1.3rem;
	}
	
	.input-item .btn-send {
		display: block;
		width: 7rem;
		height: 2.5rem;
		text-align: center;
		color: #808080;
		border: 0.1rem solid #d6d6d6;
		border-radius: 0.5rem;
		background: #fff;
		font-size: 1.2rem;
	}
	
	.fr {
		float: right;
	}
	
	.btn-red {
		width: 100%;
		height: 4rem;
		line-height: 4rem;
		background: #ff4242;
		color: #fff;
		font-size: 1.7rem;
		border-radius: 0.5rem;
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
	
	.input-group .operate {
		margin-top: 4.0rem;
		margin-bottom: 2.0rem;
	}
	
	.input-group .btn {
		padding-bottom: 2.0rem;
	}
</style>