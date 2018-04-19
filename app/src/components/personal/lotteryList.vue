<!--
	我的=>开奖榜单
-->
<template>
	<div class="lotteryList" :style="{'height': clientH *10 +'px'}">
		<div class="pic">
			<img src="./img/lotteryList.png" alt="" />
		</div>
		<div class="content" >
			<div class="title">
				<img src="./img/lotteryList_bg1.png" alt="" />
				<div class="head border-1px">
					<ul>
						<li class="text" :style="{'flex':'1','margin-left':'0'}">开奖时间</li>
						<li class="text" :style="{'width':'8rem','margin-left':'0'}">开奖期号</li>
						<li class="text" :style="{'width':'6rem'}">开奖号码</li>
						<li class="text" :style="{'width':'4.5rem'}">结果</li>
					</ul>
				</div>
			</div>
			<div class="detail">
				<ul class="details">
					<li class="list border-1px" v-for="item in table">
						<ul>
							<li class="text" :style="{'flex':'1','margin-left':'0'}" v-html="item.createTime"></li>
							<li class="text num" :style="{'width':'8.5rem','margin-left':'0'}" v-html="item.issueName"></li>
							<li class="text" :style="{'width':'6rem'}" v-html="item.lotteryNum"></li>
							<li class="text" :style="{'width':'4rem'}">
								<span class="result" v-if="item.lotteryStatus == 0">
									<template>
										<span v-if="item.lotteryString == '奇'">鸡</span>
										<span v-else>藕</span>
									</template>
								</span>
								<!--<span class="result plan" v-if="item.lotteryStatus == 1">0</span>-->
							</li>
						</ul>
					</li>
				</ul>
				<div class="more" v-if="showMore" @click="loadMore">点击加载更多</div>
      			<div class="more" v-if="noMore&&total != 0">没有更多了~</div>
			</div>
			<div class="wave">
				<img src="./img/lotteryList_bg2.png"/>
			</div>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
export default {
	name:'',
	data() {
		return {
			table:[],
			pageNum: 1, //当前页面
			pageSize:10,
	      	showMore: false, //是否展示更多
	      	noMore: false, //是否展示没有更多
	      	total: null, //总共条数
		}
	},
	mounted() {
	    this.$nextTick(function() {
	    	document.title = '开奖榜单';
//	    	this.findAward();
	    })
	},
	methods:{
		//查询开奖榜单列表
		findAward() {
			var that = this,
				reqUrl = this.baseUrl + '/upgrade/findAwardByUser',
				params = {
					pageNum: this.pageNum,
					pageSize: this.pageSize
				}
			this.$http.get(reqUrl, {params: params}).then((res) => {
				if(!res) {
					return;
				}
				that.total = res.total;
				//时间戳
				for(var i = 0; i < res.awardList.length; i++) {
					res.awardList[i].createTime = that.formatDate(res.awardList[i].createTime, 'time')
				}
				if(that.pageNum == 1) {
					that.table = res.awardList;
				} else {
					for(var i = 0; i < res.awardList.length; i++) {
						that.table.push(res.awardList[i]);
					}
				}
				if(that.total > that.table.length) {
					that.showMore = true;
				} else {
					that.showMore = false;
					that.noMore = true;
				}
			})
		},
		//加载更多
	    loadMore: function() {
	      	var maxPage = Math.ceil(this.total / this.pageSize);
	      	if (this.pageNum < maxPage) {
	        	this.pageNum++;
	        	this.findAward();
	      	}
	    },
	}
}
</script>

<style scoped>
.lotteryList{
	position: relative;
	height: 100%;
}
.lotteryList .pic{
	position: fixed;
	left: 0;
	top: 0;
	width: 100%;
	height: 17.7rem;
}
.lotteryList .pic>img{
	width: 100%;
	height: 17.7rem;
}
.lotteryList .content{
	padding-top: 18.5rem;
	height: 100%;
	background: #f4f4f4;
	box-sizing: border-box;
}
.lotteryList .content .title{
	width: 100%;
	text-align: center;
	position: relative;
}
.lotteryList .content .title>img{
	width: calc(100% - 1.5rem);
	height: 0.9rem;
}
.lotteryList .content .title .head{
	margin: 0 auto;
	width: calc(100% - 2.4rem);
	height: 4rem;
	background: rgba(255, 255, 255, 0.82);
	position: relative;
}
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
.lotteryList .content .title .head:after{
	position: absolute;
	display: block;
	left: 0;
	bottom: 0;
	border-top: 1px solid #dbdbdb;
	content: ' ';
	width: 100%;
}
.lotteryList .content .title .head>ul{
	height: 4rem;
	display: flex;
}
.lotteryList .content .title .head .text{
	font-size: 1.3rem;
	text-align: center;
	float: left;
	margin-left: 1rem;
	line-height: 4rem;
}
.lotteryList .content .detail{
	width: calc(100% - 2.4rem);
	height: 35rem;
	background: #fff;
	margin: 0 auto;
	position: relative;
	overflow: auto;
}
.lotteryList .content .detail::-webkit-scrollbar {/*滚动条整体样式*/
    width: 4px;     /*高宽分别对应横竖滚动条的尺寸*/
    height: 4px;
}
.lotteryList .content .detail::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
    border-radius: 5px;
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    background: rgba(0,0,0,0.2);
}
.lotteryList .content .detail::-webkit-scrollbar-track {/*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    border-radius: 0;
    background: #f4f4f4;
}
.lotteryList .content .detail .list{
	width: 100%;
	height: 3.2rem;
	position: relative;
}
.lotteryList .content .detail .list:after{
	position: absolute;
	display: block;
	left: 0;
	bottom: 0;
	border-top: 1px solid #dbdbdb;
	content: ' ';
	margin-left: 0.6rem;
	width: calc(100% - 0.6rem);
}
.lotteryList .content .detail .list>ul{
	display: flex;
}
.lotteryList .content .detail .list .text{
	height: 3rem;
	margin-left: 1rem;
	line-height: 3rem;
	text-align: center;
	font-size: 1.1rem;
	float: left;
}
.lotteryList .content .detail .list .text.num{
	color: #d4282d;
}
.lotteryList .content .detail .list .text .result{
	display: inline-block;
	width: 2rem;
	height: 2rem;
	line-height: 1.9rem;
	border-radius: 50%;
	background-color: #e8373d;
	color: #fefefe;
}
.lotteryList .content .detail .list .text .result.plan{
	background-color: #4257f5;
}
.lotteryList .content .wave{
	width: calc(100% - 2.4rem);
	height: 14px;
	margin: 0 auto;
}
.lotteryList .content .wave>img{
	max-width: 100%;
    max-height: 100%;
}
.more {
   margin-top:1rem ;
  text-align: center;
  font-size: 1.2rem;
  color: #666;
}
</style>