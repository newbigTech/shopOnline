<!-- 注册成功 -->
<template>
	<div class="register">
		<div class="content">
			<div class="returnMsg-box">
				<i class="iconfont icon-gou"></i>
				<div class="account">
					您的账号1985623265
				</div>
				<div class="returnMsg">
					注册成功
				</div>
			</div>
			<button class="btn-block" @click="handleFinish">完成</button>
		</div>
  	</div>
</template>

<script>
	export default {
	  name: 'registerSuccess',
	  data () {
	    return {
	     
	    }
	  },
	  mounted() {
			this.$nextTick(function() {
				document.title = '注册成功';
			})
	  },
	  methods: {
	  	handleFinish: function() {
	  		this.$router.push('/login')
	  	}
	  }
	}
</script>

<style scoped>
.register {
	box-sizing: border-box;
	min-height: 100vh;
	padding: 5rem 2.5rem 0;
	background-color: #f5f5f5;
	margin: 0;
}
.register .content {
	padding: 0 2.5rem 3.5rem;
	background-color: #fff;
	border-radius: 1rem;
	box-shadow: 0px 3px 24px 0px 
		rgba(138, 132, 132, 0.08);
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
	border-radius:0.5rem;
}
</style>