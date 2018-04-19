<!-- 邀请成功 -->
<template>
	<div id="invitationSuccess">
		<div class="content">
			<div class="ct-hd">
				<i class="iconfont icon-gou"></i>注册成功
			</div>
			<div class="ct-bd">
				<p>长按二维码进入商城</p>
				<div class="fingerprint">
					<img src="../../../assets/img/fingerprint.png"/>
				</div>
				<div class="qr-code-box">
					<img src="../../../../static/img/good1.jpg" alt="下载商城" />
				</div>
			</div>
			<div class="ct-footer">
				<p>宏裕程网络科技有限公司版权所有</p>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'invitationSuccess',
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
#invitationSuccess .content {
	position: relative;
	top: 0;
	left: 0;
	height: 13rem;
	background-image: url(../../login/img/bg-red.png);
	background-size: contain;
	background-repeat: no-repeat;
	font-size: 2rem;
}
.content .ct-hd {
	font-size: 2rem;
	line-height: 12rem;
	color: #fff;
	text-align: center;
}
.content .ct-hd i {
	font-size: 3.5rem;
	margin-right: 1rem;
    vertical-align: middle;
}
.content .ct-bd p {
	text-align: center;
	font-size: 1.8rem;
	margin: 3rem auto 2rem;
	color: #ff6738; 
}
.content .ct-bd .fingerprint {
	width: 30%;
	margin: 0 auto;
}
.content .ct-bd .qr-code-box {
	width: 40%;
	margin: 2rem auto;
}
.content .ct-bd .fingerprint img,
.content .ct-bd .qr-code-box img{
	width: 100%;
}
.content .ct-footer p {
	text-align: center;
	font-size: 1.4rem;
	margin: 3rem auto 2rem;
	color: #999; 
}
</style>