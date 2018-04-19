<!-- 密码输入框 -->
<template>
	<div id="confirm">
		<div class="confirm-msgbox-wrapper">
			<div class="confirm-msgbox">
				<div class="confirm-msgbox-header">
					<div class="confirm-msgbox-title">
						<i class="iconfont icon-zhuyi"></i>
					</div>
				</div>
				<div class="confirm-msgbox-content">
					<div class="confirm-msgbox-message">
						<p>为了您的资金账户安全</p>
						<p>请先设置支付密码</p>
					</div>
					<div class="confirm-msgbox-input" style="display: none;">
						<input placeholder="" type="text">
						<div class="confirm-msgbox-errormsg" style="visibility: hidden;"></div>
					</div>
				</div>
				<div class="confirm-msgbox-btns">
					<button class="confirm-msgbox-btn confirm-msgbox-cancel " style="">取消</button>
					<button class="confirm-msgbox-btn confirm-msgbox-confirm ">立即前往</button>
				</div>
			</div>
		</div>
		<div class="v-shade-box"></div>
	</div>
</template>
<script>
	export default {
		name: 'confirm', // 确认弹出框
		props: {
	    	//红色边框
//	    	'redBorder': {
//	    		type: Boolean,
//	    		default: false
//	    	}
	    },
		data() {
			return {

			}
		},
		props: {
			
		},
		mounted() {
			
		},
		methods: {
			
		}
	}
</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style scoped>
	.confirm-msgbox-wrapper {
		position: absolute;
		z-index: 2001;
	}
	
	.v-shade-box {
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		opacity: .5;
		background: #000;
		z-index: 2000;
	}
	
	.confirm-msgbox {
		position: fixed;
		top: 50%;
		left: 50%;
		-webkit-transform: translate3d(-50%, -50%, 0);
		transform: translate3d(-50%, -50%, 0);
		background-color: #fff;
		width: 70%;
		border-radius: 3px;
		font-size: 16px;
		-webkit-user-select: none;
		overflow: hidden;
		-webkit-backface-visibility: hidden;
		backface-visibility: hidden;
		-webkit-transition: .2s;
		transition: .2s;
	}
	
	.confirm-msgbox-header {
		padding: 15px 0 0;
	}
	
	.confirm-msgbox-content {
		padding: 0.5px 1rem 1rem;
		border-bottom: 1px solid #ddd;
		min-height: 4rem;
		position: relative;
	}
	
	.confirm-msgbox-input {
		padding-top: 1.5rem;
	}
	
	.confirm-msgbox-input input {
		border: 1px solid #dedede;
		border-radius: 5px;
		padding: 4px 5px;
		width: 100%;
		-webkit-appearance: none;
		-moz-appearance: none;
		appearance: none;
		outline: none;
	}
	
	.confirm-msgbox-input input.invalid {
		border-color: #ff4949;
	}
	
	.confirm-msgbox-input input.invalid:focus {
		border-color: #ff4949;
	}
	
	.confirm-msgbox-errormsg {
		color: red;
		font-size: 12px;
		min-height: 18px;
		margin-top: 2px;
	}
	
	.confirm-msgbox-title {
		text-align: center;
		padding-left: 0;
		margin-bottom: 0;
		font-size: 16px;
		font-weight: 700;
		color: #333;
	}
	
	.confirm-msgbox-title i {
		font-size: 2.5rem;
		color: #999;
	}
	
	.confirm-msgbox-message {
		color: #333;
		margin: 0;
		font-size: 1.6rem;
		text-align: center;
		line-height: 2.5rem;
	}
	
	.confirm-msgbox-btns {
		display: -webkit-box;
		display: -ms-flexbox;
		display: flex;
		height: 4.8rem;
		line-height: 4.8rem;
	}
	
	.confirm-msgbox-btn {
		line-height: 35px;
		display: block;
		background-color: #fff;
		-webkit-box-flex: 1;
		-ms-flex: 1;
		flex: 1;
		margin: 0;
		border: 0;
		font-size: 1.4rem;
	}
	
	.confirm-msgbox-btn:focus {
		outline: none;
	}
	
	.confirm-msgbox-btn:active {
		background-color: #fff;
	}
	
	.confirm-msgbox-cancel {
		color: #999999;
		width: 50%;
		border-right: 1px solid #ddd;
	}
	
	.confirm-msgbox-confirm {
		color: #26a2ff;
		width: 50%;
	}
	
	.confirm-msgbox-confirm:active {
		color: #26a2ff;
	}
	
	.msgbox-bounce-enter {
		opacity: 0;
		-webkit-transform: translate3d(-50%, -50%, 0) scale(0.7);
		transform: translate3d(-50%, -50%, 0) scale(0.7);
	}
	
	.msgbox-bounce-leave-active {
		opacity: 0;
		-webkit-transform: translate3d(-50%, -50%, 0) scale(0.9);
		transform: translate3d(-50%, -50%, 0) scale(0.9);
	}
</style>