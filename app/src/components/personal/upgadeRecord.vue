<!--
	我的=>升级记录和红包记录
-->
<template>
	<div class="upgadeRecord">
		<div class="tab" id="tab">
			<div class="tabItem" v-for="(tab,index) in tabs" :class="{'active':index == tabShow}" @click="tabChange(index)">				
				<i class="iconfont" :class="tab.icon"></i>{{tab.name}}
			</div>
		</div>
		<div class="upgadesRecord" :style="{'min-height':navClientH*10 + 'px'}" id="#upgadesRecord">
			<template v-if="table.length > 0">
				<ul class="tab border-1px">
					<li class="tabItem A">下单时间</li>
					<li class="tabItem B">商品名称</li>
					<li class="tabItem C">状态</li>
				</ul>
				<ul class="tabSize">
					<li  v-for="item in table" class="tabSizeNav border-1px">
						<ul class="tabSizeSome">
							<li class="tabSizeItem A" v-html="item.createTime"></li>
							<li class="tabSizeItem B">
								<template>
									<span v-if="item.upState == 2">{{item.upGoodsName}}</span>
									<span v-else>{{item.goodsName}}</span>
								</template>
							</li>
							<li class="tabSizeItem C">
								<span v-if="item.upState == 1">小升级</span>
								<span v-else-if="item.upState == 2">大升级</span>
								<span v-else>升级中</span>
							</li>
						</ul>
					</li>
				</ul>
				<div class="more" v-if="total > table.length" @click="loadMore">点击加载更多</div>
	      		<div class="more" v-else>没有更多了~</div>
			</template>
			<template v-else>
				<div class="nothing">
					<div class="nothingPic"><img src="./img/nothing.png" alt="" /></div>
					<div class="nothingTxt">暂无升级记录</div>
				</div>
			</template>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
export default {
	data() {
		return {
			tabs:[{"icon":"icon-jilu","name":"升级记录"},{"icon":"icon-icon-test","name":"红包记录"}],
			table:[],
			redList:[],
			upList:[],
			tabShow:null,
			pageNum: 1, //当前页面
	      	showMore: false, //是否展示更多
	      	noMore: false, //是否展示没有更多
	      	total:null,//总条数
		}
	},
	computed:{
		navClientH() {
			var clientH = document.documentElement.clientHeight * 0.1;
			return (clientH-5.3)
		}
	},
	mounted() {
	    this.$nextTick(function() {
	    	this.tabChange(this.$route.query.tabShow);
	    })
	},
	methods:{
		//切换tab
		tabChange(index) {
			this.tabShow = index;
			this.pageNum = 1;
			this.findUpgrade();
		},
		//查询升级记录列表
		findUpgrade() {
			var that = this;
			if (this.tabShow == 1) {
				var reqUrl = this.baseUrl + '/upgrade/findRedPacketByUser';
			} else{
				var reqUrl = this.baseUrl + '/upgrade/findUpgradeionByUser';
			}
			var params = {
				pageNum: this.pageNum,
				pageSize: this.pageSize
			}
			this.$http.get(reqUrl, {
				params: params
			}).then((res) => {
				if(!res) {
					return;
				}
				that.total = res.total;
				if (this.tabShow == 1) {
					that.redTotal = res.total;
					for(var i = 0; i < res.redPacketList.length; i++) {
						res.redPacketList[i].createTime = that.formatDate(res.redPacketList[i].createTime, 'time')
					}
					if(that.pageNum == 1) {
						that.table = res.redPacketList;
					} else {
						for(var i = 0; i < res.redPacketList.length; i++) {
							that.table.push(res.redPacketList[i]);
						}
					}
				} else{
					for(var i = 0; i < res.promotionList.length; i++) {
						res.promotionList[i].createTime = that.formatDate(res.promotionList[i].createTime, 'time')
					}
					if(that.pageNum == 1) {
						that.table = res.promotionList;
					} else {
						for(var i = 0; i < res.promotionList.length; i++) {
							that.table.push(res.promotionList[i]);
						}
					}
				}
			})
		},
		//加载更多
	    loadMore: function() {
			var maxPage = Math.ceil(this.total / this.pageSize);
	      if (this.pageNum < maxPage) {
	        this.pageNum++;
	        this.findUpgrade();
	      }
	    },
	}
}
</script>

<style scoped>
.upgadeRecord #tab{
	display: flex;
	width: 100%;
	height: 5.3rem;
}	
.upgadeRecord #tab .tabItem{
	flex: 1;
	text-align:center;
	font-size: 1.4rem;
	color: #999999;
	height: 5.3rem;
	line-height: 5.3rem;
	position: relative;
}
.upgadeRecord #tab .tabItem.active{
	color: #d4282d;
	
}
.upgadeRecord #tab .tabItem.active:after{
	content:"";
  	position: absolute;
  	left: 50%;
  	margin-left: -1.2rem;
  	bottom: 0;
  	width: 0;
  	height: 0;
  	border-left: 1.2rem solid transparent;
  	border-right: 1.2rem solid transparent;
  	border-bottom: 0.8rem solid #f5f5f5;
}
.upgadesRecord{
	background: #f5f5f5;
}	
.upgadesRecord .tab{
	display: flex;
	width: 100%;
	height: 4.3rem;
	line-height: 4.3rem;
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
.upgadesRecord .tab:after{
	position: absolute;
	display: block;
	left: 0;
	bottom: 0;
	border-top: 1px solid #d9d9d9;
	content: ' ';
	width: 100%;
}
.upgadesRecord .tab .tabItem{
	color: #333333;
	font-size: 1.3rem;
	text-align: center;
}
.upgadesRecord .tab .tabItem.A{
	width: 15rem;
}
.upgadesRecord .tab .tabItem.B{
	flex: 1;
}
.upgadesRecord .tab .tabItem.C{
	width: 6.5rem;
}
.upgadesRecord .tabSize{
	width: 100%;
}
.upgadesRecord .tabSize .tabSizeNav{
	height: 3.9rem;
	line-height: 3.9rem;
	width: 100%;
	position: relative;
}
.upgadesRecord .tabSize .tabSizeNav:after{
	position: absolute;
	display: block;
	left: 0;
	bottom: 0;
	border-top: 1px solid #d9d9d9;
	content: ' ';
	width: 100%;
}
.upgadesRecord .tabSize .tabSizeSome{
	display: flex;
	width: 100%;
	height: 100%;
}
.upgadesRecord .tabSize .tabSizeItem{
	height: 100%;
	font-size: 1.3rem;
	color: #999999;
	text-align: center;
}
.upgadesRecord .tabSize .tabSizeItem.A{
	width: 15rem;
}
.upgadesRecord .tabSize .tabSizeItem.B{
	width: 16rem;
	overflow: hidden;
	text-overflow:ellipsis;
	white-space: nowrap;
}
.upgadesRecord .tabSize .tabSizeItem.C{
	width: 6.5rem;
}
.upgadesRecord .nothing .nothingPic{
	padding-top: 11.5rem;
	text-align: center;
}
.upgadesRecord .nothing .nothingPic>img{
	height: 17.5rem;
	width: 19rem;
}
.upgadesRecord .nothing .nothingTxt{
	margin-top: 2.3rem;
	text-align: center;
	font-size: 1.5rem;
	color: #666666;
}
.more {
	margin-top: 1rem;
	padding-bottom: 1rem;
	text-align: center;
	font-size: 1.3rem;
	color: #666;
}
</style>