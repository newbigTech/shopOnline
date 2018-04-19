<!--
	我的=>红包记录
-->
<template>
	<div class="packetRecord" :style="{'min-height':navClientH*10 + 'px','display':notFlash}">
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
								<span v-if="item.upState == 1">{{item.goodsName}}</span>
								<span v-else>{{item.upGoodsName}}</span>
							</template>
						</li>
						<li class="tabSizeItem C">
							<template>
								<span v-if="item.upState == 1">小升级</span>
								<span v-else>大升级</span>
							</template>
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
				<div class="nothingTxt">暂无红包记录</div>
			</div>
		</template>
	</div>
</template>

<script type="text/ecmascript-6">
	export default {
		data() {
			return {
				table:[
					{'createTime': '2018-02-02','goodsName': 'xxx','upGoodsName':'xxx','upState': '1'},
					{'createTime': '2018-02-02','goodsName': 'xxx','upGoodsName':'xxx','upState': '1'}
				],
				pageNum: 1, //当前页面
		      	total: null, //总共条数
		      	notFlash:'block',
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
//			this.findPacket();
		},
		methods:{
			//查询红包记录列表
			findPacket() {
				var that = this,
					reqUrl = this.baseUrl + '/upgrade/findRedPacketByUser',
					params = {
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
					that.notFlash = 'block';
				})
			},
			//加载更多
		    loadMore: function() {
		      var maxPage = Math.ceil(this.total / this.pageSize);
		      if (this.pageNum < maxPage) {
		        this.pageNum++;
		        this.findPacket();
		      }
		    },
		}
	}
</script>

<style scoped>
.packetRecord{
	background: #f5f5f5;
}	
.packetRecord .tab{
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
.packetRecord .tab:after{
	position: absolute;
	display: block;
	left: 0;
	bottom: 0;
	border-top: 1px solid #d9d9d9;
	content: ' ';
	width: 100%;
}
.packetRecord .tab .tabItem{
	color: #333333;
	font-size: 1.3rem;
	text-align: center;
}
.packetRecord .tab .tabItem.A{
	width: 15rem;
}
.packetRecord .tab .tabItem.B{
	flex: 1;
}
.packetRecord .tab .tabItem.C{
	width: 6.5rem;
}
.packetRecord .tabSize{
	width: 100%;
}
.packetRecord .tabSize .tabSizeNav{
	height: 3.9rem;
	line-height: 3.9rem;
	width: 100%;
	position: relative;
}
.packetRecord .tabSize .tabSizeNav:after{
	position: absolute;
	display: block;
	left: 0;
	bottom: 0;
	border-top: 1px solid #d9d9d9;
	content: ' ';
	width: 100%;
}
.packetRecord .tabSize .tabSizeSome{
		display: flex;
}
.packetRecord .tabSize .tabSizeItem{
	font-size: 1.3rem;
	color: #999999;
	text-align: center;
}
.packetRecord .tabSize .tabSizeItem.A{
	width: 15rem;
}
.packetRecord .tabSize .tabSizeItem.B{
	width: 16rem;
	display: -webkit-box;
  	-webkit-box-orient: vertical;
  	-webkit-line-clamp: 1;
  	overflow: hidden;
}
.packetRecord .tabSize .tabSizeItem.C{
	width: 6.5rem;
}
.packetRecord .nothing .nothingPic{
	padding-top: 11.5rem;
	text-align: center;
}
.packetRecord .nothing .nothingPic>img{
	height: 17.5rem;
	width: 19rem;
}
.packetRecord .nothing .nothingTxt{
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