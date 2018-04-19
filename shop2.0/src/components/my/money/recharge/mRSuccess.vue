<!-- 账户余额-充值成功 -->
<template>
    <div class="mRSuccess" :style="{'height': (clientH * 10) +'px'}">
    	<div class="success">
    		<p><i class="iconfont icon-correct"></i></p>
    		<h2>充值成功</h2>
    	</div>
    	<div class="info">
    		<div>
    			<span>充值方式</span>
    			<span>微信支付</span>
    		</div>
    		<div>
    			<span>充值金额</span>
    			<span>¥{{amount}}</span>
    		</div>
    	</div>
    	<div class="btn">
    		<button class="btn-red" @click="handleFinish">完成</button>
    	</div>
    </div>
</template>
<script>
export default {
    name: 'mRSuccess', // 账户余额-充值
    data() {
        return {
        	amount: 0,
        	orderNo: '',//充值订单编号
        }
    },
    created() {
    	var orderNo = this.$route.query.orderNo;
    	if(orderNo != undefined) {
    		this.orderNo = orderNo;
    		this.getRechargeInfo();
    	} else {
    		this.$router.push('/user');
    	}
    },
    mounted() {
        this.$nextTick(function() {
        	document.title = '充值成功';
        });
    },
    methods: {
    	//微信充值后查询充值金额
    	getRechargeInfo() {
    		var that = this,
    			reqUrl = this.baseUrl + '/account/rechargeDetails',
    			params = { 
    				orderNo: this.orderNo //充值订单号
    			}
			this.$http.get(reqUrl, { params: params }).then(function(res) {
				if(!res) {
					return;
				}
				that.amount = res.amount;//	充值金额
			})
    	},
    	handleFinish() {
    		this.$router.push('/moneyIndex');
    	}
    }

}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style scoped>
.mRSuccess {
	background: #f5f5f5;
	overflow: hidden;
}
.success {
	padding: 3.8rem 0;
	text-align: center;
}
.success > p > i {
	font-size: 6.8rem;
	color: #d4282d;
}
.success > h2 {
	color: #333;
	font-size: 2.0rem;
	margin-top: 1.4rem;
}
.info {
	padding: 1.8rem 2.0rem;
	background: #fff;
}
.info > div {
	font-size: 1.4rem;
}
.info > div:nth-child(1) {
	margin-bottom: 1.5rem;
}
.info > div > span:nth-child(1) {
	color: #999;
}
.info > div > span:nth-child(2) {
	color: #333;
	float: right;
}
.btn {
	margin-top: 3.5rem;
	padding: 0 2.0rem;
}
.btn .btn-red {
	width: 100%;
	height: 4.5rem;
	line-height: 4.5rem;
	background-color: #d4282d;
	border-radius: 0.3rem;
	border: solid 0.05rem #ce3638;
	color: #fff;
	font-size: 1.8rem;
}
</style>
