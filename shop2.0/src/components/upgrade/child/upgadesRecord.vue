<!--
	我的=>升级记录
-->
<template>
	<div class="upgadesRecord" :style="{'min-height':navClientH*10 + 'px','display':notFlash}">
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
				<div class="nothingPic"><img src=".././img/nothing.png" alt="" /></div>
				<div class="nothingTxt">暂无升级记录</div>
			</div>
		</template>
	</div>
</template>

<script type="text/ecmascript-6">
	export default {
		data() {
			return {
				table:[],
				pageNum: 1, //当前页面
		      	showMore: false, //是否展示更多
		      	noMore: false, //是否展示没有更多
		      	total: null, //总共条数
		      	notFlash:'none',
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
		    })
		},
		created() {
			this.findUpgrade();
		},
		methods:{
			//查询升级记录列表
			findUpgrade() {
				var that = this;
				var reqUrl = this.baseUrl + '/upgrade/findUpgradeionByUser';
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
					that.notFlash = 'block';
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
}
.upgadesRecord .tabSize .tabSizeItem{
	font-size: 1.3rem;
	color: #999999;
	text-align: center;
}
.upgadesRecord .tabSize .tabSizeItem.A{
	width: 15rem;
}
.upgadesRecord .tabSize .tabSizeItem.B{
	width: 16rem;
		display: -webkit-box;
	  -webkit-box-orient: vertical;
	  -webkit-line-clamp: 1;
	  overflow: hidden;
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
	margin-top: 2rem;
	text-align: center;
	font-size: 1.3rem;
	color: #666;
}
</style>