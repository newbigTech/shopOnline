<!--
	我的=>账户明细=>余额明细
-->
<template>
	<div class="balance" :style="{'min-height': clientH *10 +'px'}">
		<div class="tab border-1px">
			<div class="tabItem" v-for="(tab,index) in tabs" v-html="tab" :class="{'active':index == clickNum}" @click=tabChange(index)></div>
		</div>
		<template v-if="table.length > 0">
			<ul class="details">
				<li class="detailsCont border-1px" v-for="item in table" @click="getDetails(item)">
					<div class="left">
						<div class="top">
							<template>
								<span v-if="item.accountType == 1">订单交易</span>
								<span v-else-if="item.accountType == 2">提现</span>
								<span v-else-if="item.accountType == 3">充值</span>
								<span v-else-if="item.accountType == 4">回收交易</span>
								<span v-else-if="item.accountType == 5">退货</span>
								<span v-else>提现退回</span>
							</template>
						</div>
						<div class="bottom" v-html="item.tradeTime"></div>
					</div>
					<div class="right">
						<template>
							<span v-if="item.type == 1">+</span>
							<span v-else>-</span>
						</template>
						{{item.amount}}元
					</div>
				</li>
			</ul>
			<div class="more" v-if="total > table.length" @click="loadMore">点击加载更多</div>
  			<div class="more" v-else>没有更多了~</div>
		</template>
		<template v-else>
			<div class="nothing">
				<div class="nothingPic"><img src="./img/nothing.png" alt="" /></div>
				<div class="nothingTxt">暂无记录</div>
			</div>
		</template>
	</div>
</template>

<script type="text/ecmascript-6">
export default {
	data() {
		return {
			tabs:['全部','订单交易','提现','充值','回收交易','退货'],
			clickNum:0,
			table:[],
			pageNum: 1, //当前页面
	      	total: null, //总共条数
		}
	},
 	components: {
	},
	mounted() {
	    this.$nextTick(function() {
	    	document.title = '账户明细';
	    	this.getSomething();
	    });
	},
	created() {
		var type = this.$route.query.type;
		if(type != undefined) {
			this.tabChange(parseInt(type));
		}
	},
	methods:{
		//tab切换
		tabChange(index) {
			this.clickNum = index;
			this.pageNum = 1;	
		    this.getSomething();
		},
		//获取列表
		getSomething() {
			var that = this;
			var reqUrl = this.baseUrl + '/accountinfo/findAccountDetailsInfo';
			var params = {
				pageNum: this.pageNum,
				pageSize: this.pageSize
			}
			if (that.clickNum > 0) {
				params.accountType = that.clickNum;
			}
			this.$http.get(reqUrl, {params: params}).then((res) => {
				if(!res) {
					return;
				}
				that.total = res.total;
				//时间戳
				for(var i = 0; i < res.aList.length; i++) {
					res.aList[i].tradeTime = that.formatDate(res.aList[i].tradeTime, 'time')
				}
				if(that.pageNum == 1) {
					that.table = res.aList;
				} else {
					for(var i = 0; i < res.aList.length; i++) {
						that.table.push(res.aList[i]);
					}
				}
			})
		},
		//加载更多
	    loadMore: function() {
	      var maxPage = Math.ceil(this.total / this.pageSize);
	      if (this.pageNum < maxPage) {
	        this.pageNum++;
	        this.getSomething();
	      }
	    },
		//获取详情
		getDetails(item) {
			if(item.accountType == 2 || item.accountType == 3 || item.accountType == 6){
				this.$router.push({
					query:{
						DetailsId:item.accountDetalisId
					},
					name:'payDetails'
				})
			}else{
				this.$router.push({
					name:'recycleDetails',
					query:{
						DetailsId:item.accountDetalisId
					}
				})
			}
		}
	}
}
</script>

<style scoped>
@media (-webkit-min-device-pixel-ratio:1.5),(min-device-pixel-ratio:1.5) {
	.border-1px:after{
		-webkit-transform: scaleY(0.7);
        transform: scaleY(0.7);
	}
}
@media (-webkit-min-device-pixel-ratio:2),(min-device-pixel-ratio:2){
	.border-1px:after{
		-webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);
	}
}
.balance{
	background: #f5f5f5;
}
.balance .tab{
	display: flex;
	width: 100%;
	height: 5.8rem;
	background: #fff;
	position: relative;
}	
.balance .tab:after{
	position: absolute;
	display: block;
	left: 0;
	bottom: 0;
	border-top: 1px solid #d9d9d9;
	content: ' ';
	width: 100%;
}
.balance .tab .tabItem{
	flex: 1;
	height: 5.8rem;
	line-height: 5.8rem;
	font-size: 1.3rem;
	color: #333333;
	text-align: center;
}
.balance .tab .tabItem:nth-child(2),.balance .tab .tabItem:nth-child(5){
	flex: 1.5;
}
.balance .tab .tabItem.active{
	color: #d4282d;
	position: relative;
}
.balance .tab .tabItem.active:after{
	position: absolute;
	display: block;
	left: 50%;
	margin-left: -2rem;
	bottom: 0.1rem;
	content: ' ';
	width: 4rem;
	height: 0.2rem;
	background: #d4282d;
}
.balance .nothing .nothingPic{
	padding-top: 11.5rem;
	text-align: center;
}
.balance .nothing .nothingPic>img{
	height: 17.5rem;
	width: 19rem;
}
.balance .nothing .nothingTxt{
	margin-top: 2.3rem;
	text-align: center;
	font-size: 1.5rem;
	color: #666666;
}
.balance .details .detailsCont{
	height: 6rem;
	width: 100%;
	position: relative;
	display: flex;
}
.balance .details .detailsCont:after{
	position: absolute;
	display: block;
	left: 0;
	bottom: 0;
	border-top: 1px solid #d9d9d9;
	content: ' ';
	width: 100%;
}
.balance .details .detailsCont .left,.balance .details .detailsCont .right{
	flex: 1;
	height: 6rem;
	color: #333;
	font-size: 1.5rem;
}
.balance .details .detailsCont .left{
	padding-left: 2rem;
	display: flex;
	flex-direction:column;
}
.balance .details .detailsCont .left .top{
	flex: 1;
	position: relative;
}
.balance .details .detailsCont .left .top>span{
	position: absolute;
	left: 0;
	bottom: 0.5rem;
}
.balance .details .detailsCont .left .bottom{
	flex: 1;
	color: #999999;
	font-size: 1.2rem;
}
.balance .details .detailsCont .right{
	line-height: 6rem;
	padding-right: 2rem;
	text-align: right;
}
.more {
	margin-top: 2rem;
	text-align: center;
	font-size: 1.3rem;
	color: #666;
}
</style>