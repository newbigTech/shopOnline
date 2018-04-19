<!--
	我的=>账户明细=>充值提现详情
-->
<template>
	<div class="payDetails">
		<p class="tab">流水号:<span class="data">{{table.serialNumber}}</span></p>
		<p class="tab">类型:
			<template>
				<span class="data" v-if="table.accountType == 2">提现</span>
				<span class="data" v-else-if="table.accountType == 3">充值</span>
				<span class="data" v-else>提现退回</span>
			</template>
		</p>
		<p class="tab">
			<template>
				<span v-if="table.accountType == 2">提现金额:</span>
				<span v-else>金额:</span>
			</template>
			<span class="data" style="font-weight: bold;">{{table.amount}} 元</span>
		</p>
		<p class="tab" v-if="table.accountType == 3">支付方式:
			<template>
				<span class="data" v-if="table.payType == 1">微信支付 </span>
				<span class="data" v-else>账户交易 </span>
			</template>
		</p>
		<p class="tab" v-if="table.accountType == 2">手续费:<span class="data">{{table.brokerage}} 元</span></p>
		<p class="tab">时间:<span class="data" v-text="table.tradeTime"></span></p>
		<p class="tab">状态:
		<template>
			<span class="data" v-if="table.status == 1">成功</span>
			<span class="data" v-else-if="table.status == 2">失败</span>
			<span class="data" v-else>处理中</span>
		</template></p>
		<div class="name">备注:
			<div class="cont">
				<div class="nameCont">
					{{table.remarks}}
				</div>
			</div>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
export default {
	data() {
		return{
			table:[],
			infoId:{},
		}
	},
	mounted() {
		this.$nextTick(function() {
			document.title = '详细信息';
			this.infoId = this.$route.query.DetailsId;
			this.getAccountDetalis();
		})
	},
	created() {
		
	},
	methods:{
		//获取详情
		getAccountDetalis() {
			var that = this;
			var reqUrl = this.baseUrl + '/accountinfo/getAccountDetalis';
			var params = {
				accountDetalisId: this.infoId
			}
			this.$http.get(reqUrl, {params: params}).then((res) => {
				if(!res) {
					return;
				}
				res.tradeTime = that.formatDate(res.tradeTime, 'time');
				that.table = res;
			})
		}
	}
}
</script>

<style scoped>
.payDetails{
	padding-top: 1.5rem;
}
.payDetails .tab{
	padding: 0 1.5rem;
	height: 3.4rem;
	line-height: 3.4rem;
	font-size: 1.4rem;
	color: #999999;
	zoom: 1; 
	overflow:auto; 
}
.payDetails .tab .data{
	display: inline-block;
	color: #333333;
	float: right;
}
.payDetails .tab.text{
	margin-top: 1rem;
	min-height: 2rem;
	height: auto;
	line-height: 2rem;
}
.payDetails .tab.text .data{
	max-width: calc(100% - 7.5rem);
	text-align: right;
}
.payDetails .tab.text.active .data{
	text-align: left;
}
.payDetails .name{
	margin-top: 1rem;
	padding: 0 1.5rem;
	height: 4rem;
	line-height: 2rem;
	font-size: 1.4rem;
	color: #999999;
	display: flex;
}
.payDetails .name .cont{
	flex: 1;
	margin-left: 4.7rem;
	color: #333333;
}
.payDetails .name .cont .nameCont{
	display: inline-block;
	float: right;
}
</style>