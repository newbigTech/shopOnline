<!--
	我的=>账户余额=>提现详情
-->
<template>
	<div class="withDrawResult">
		<div class="cont">
			<div class="nav">
				<div class="left top"><i class="icon iconfont icon-correct over"></i></div>
				<div class="right">
					<h2 class="title">提现申请已提交</h2>
					<p class="text">{{withDrawInfo.bankInfo}}</p>
					<p class="text">{{withDrawInfo.withDrawMoney}}元</p>
				</div>
			</div>
			<div class="nav other">
				<div class="left bottom"><i class="icon iconfont icon-qian wait"></i></div>
				<div class="right">
					<h2 class="title other">等待银行处理</h2>
				</div>
			</div>
		</div>
		<div class="button" @click="$router.push('/moneyIndex')">完成</div>
	</div>
</template>

<script type="text/ecmascript-6">
export default {
	data() {
		return {
			withDrawInfo: {},
		}
	},
 	created() {
        
        this.withDrawInfo = JSON.parse(localStorage.getItem('withDrawInfo'));
    },
    mounted(){
		this.$nextTick(function(){
			document.title = '提现完成';
  		})
	},
	methods:{
		
	},
	destroyed() {
    	localStorage.removeItem('withDrawInfo');
    },
} 
</script>

<style scoped>
.withDrawResult{
	
}
.withDrawResult .cont{
	height: 13rem;
	padding: 2.9rem 0 0 2.9rem;
}
.withDrawResult .cont .nav{
	height: 6.5rem;
	display: flex;
}
.withDrawResult .cont .nav.other{
	margin-top: 4rem;
}
.withDrawResult .cont .nav .right{
	flex: 1;
	padding-left: 1.7rem;
	position: relative;
}
.withDrawResult .cont .nav .icon{
	width: 2.5rem;
	height: 2.5rem;
	border-radius: 50%;
	font-size: 2.5rem;
}
.withDrawResult .cont .nav .icon.over{
	color: #5ac539;
}
.withDrawResult .cont .nav .icon.wait{
	color: #e6e6e6;
}
.withDrawResult .cont .nav .right .title{
	font-size: 1.5rem;
	color: #333333;
}
.withDrawResult .cont .nav .right .text{
	margin-top: 1rem;
	font-size: 1.3rem;
	color: #999999;
}
.withDrawResult .cont .nav .right .title.other{
	line-height: 2.5rem;
}
.withDrawResult .cont .nav .top{
	position: relative;
}
.withDrawResult .cont .nav .top:after{
	display: block;
	content: '';
	height: 4.5rem;
	width: 0.2rem;
	position: absolute;
	left: 1.2rem;
	top: 2rem;
	background: #5ac539;
}
.withDrawResult .cont .nav .bottom{
	position: relative;
}
.withDrawResult .cont .nav .bottom:after{
	display: block;
	content: '';
	height: 4.5rem;
	width: 0.2rem;
	position: absolute;
	left: 1.2rem;
	top: -4rem;
	background: #e6e6e6;
}
.withDrawResult .button{
	/*width: 33.5rem;*/
	width: 90%;
	height: 4.5rem;
	line-height: 4.5rem;
	margin: 0 5%;
	margin-top: 9rem;
	background-color: #d4282d;
	border-radius: 0.5rem;
	color: #fff;
	font-size: 1.5rem;
	text-align: center;
}
</style>