<!--
	我的=>账户明细=>商品回收详情
-->
<template>
	<div class="recycleDetails">
		<p class="tab">流水号:<span class="data">{{table.serialNumber}}</span></p>
		<p class="tab">类型:
			<template>
				<span class="data" v-if="table.accountType == 1">订单交易</span>
				<span class="data" v-else-if="table.accountType == 4">回收交易</span>
				<span class="data" v-else>退货</span>
			</template>
		</p>
		<p class="tab">金额:
			<span class="data" style="font-weight: bold;">{{table.amount}}元</span>
		</p>
		<p class="tab">支付方式:
			<template>
				<span class="data" v-if="table.payType == 1">微信支付 </span>
				<span class="data" v-else>账户交易 </span>
			</template>
		</p>
		<p class="tab">时间:<span class="data" v-text="table.tradeTime"></span></p>
		<div class="name">商品名称:
			<div class="cont" style="overflow:hidden">
				<div class="nameCont">
					<template>
						<template v-if="table.accountType == 1">
							<template 
								v-if="table.remarks.indexOf('运费') != -1 && table.upState == 2">
							{{table.upGoodsName}}
							</template>
							<template  v-else>{{table.goodsName}}</template>
						</template>
						<template v-else-if="table.accountType == 4">
							<template  v-if="table.upState == 2">{{table.upGoodsName}}</template>
							<template v-else>{{table.goodsName}}</template>
						</template>
						<template v-else>
							<template>{{table.goodsName}}</template>
						</template>
					</template>
				</div>
			</div>
		</div>
		<p class="tab">数量:<span class="data">{{table.goodsCount}}</span></p>
		<p class="tab">订单编号:<span class="data">{{table.ordersNo}}</span></p>
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
.recycleDetails{
	padding-top: 1.5rem;
}
.recycleDetails .tab{
	padding: 0 1.5rem;
	height: 3.4rem;
	line-height: 3.4rem;
	font-size: 1.4rem;
	color: #999999;
	zoom: 1;
	overflow:auto; 
}
.recycleDetails .name{
	margin-top: 1rem;
	padding: 0 1.5rem;
	height: 4rem;
	line-height: 2rem;
	font-size: 1.4rem;
	color: #999999;
	display: flex;
}
.recycleDetails .name .cont{
	flex: 1;
	margin-left: 4.7rem;
	color: #333333;
}
.recycleDetails .name .cont .nameCont{
	display: inline-block;
	float: right;
}
.recycleDetails .tab .data{
	display: inline-block;
	color: #333333;
	float: right;
}
</style>