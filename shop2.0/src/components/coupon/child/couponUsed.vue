<!--我的-优惠券-已使用-->
<template>
	<div class="couponUsed" :style="{'min-height':navClientH + 'px','display':notFlash}">
		<template v-if="table.length > 0">
			<ul class="tab">
				<li class="tabItem" v-for="item in table">
					<div class="left">
						￥<span>{{item.amount}}</span>
					</div>
					<div class="right">
						<div class="top">
							<div class="name">
								{{item.name}}
							</div>
							<div class="use">
								<span>已使用</span>
							</div>
						</div>
						<div class="timeLimit border-1px">
							有效期至&nbsp;{{item.validTime}}
						</div>
						<div class="remarks">
							{{item.descript}}
						</div>
					</div>
					<span class="semicircle bbb"></span>
					<span class="semicircle aaa"></span>
				</li>
			</ul>
		</template>
		<template v-else>
			<div class="nothing">
				<div class="nothingPic">
					<img src="../../../assets/img/couponNothing.png"/>
				</div>
				<div class="nothingTxt">您还没有优惠券</div>
			</div>
		</template>
	</div>
</template>

<script type="text/ecmascript-6">
	export default {
		data() {
			return {
				table:[],
		      	notFlash:'block',
			}
		},
		props:{
			'tabHeight':{
				type:Number,
				default:null
			}
		},
		created() {
			document.title = '优惠券';
        	this.getList();
		},
		computed:{
			navClientH() {
				var clientH = document.documentElement.clientHeight - this.tabHeight;
				return clientH;
			}
		},
    	mounted() {
			this.$nextTick(function() {
				
			})
	    },
	    methods: {
	    	getList() {
	    		var that = this,
	    			params = {status: '2'}, //状态(1:未使用 ，2:已使用)
	    			reqUrl = this.baseUrl + '/coupon/findCouponByStatus';
	            this.$http.get(reqUrl, {params: params}).then(function(res) {
	                if (!res) { return; }
	                that.table = res.couponList;
	            });
	    	}
	    }
	}
</script>

<style scoped>
.couponUsed{
	background: #f5f5f5;
}
.couponUsed .tab{
	width: calc(100% - 3.1rem);
	margin: 0 auto;
	padding-top: 0.9rem;
	box-sizing: border-box;
}
.couponUsed .tab .tabItem{
	display: flex;
	width: 100%;
	height: 10.8rem;
	margin-bottom: 0.9rem;
	background: #fff;
	position: relative;
}	
.couponUsed .tab .tabItem .left{
	height: 100%;
	line-height: 10.8rem;
	width: 11.4rem;
	background: url(../../../assets/img/couponUsed.png) left top no-repeat;
	background-size: 100% auto;
	text-align: center;
	font-size: 1.5rem;
	color: #fff;
}
.couponUsed .tab .tabItem .left>span{
	font-size: 3.6rem;
}
.couponUsed .tab .tabItem .right{
	flex: 1;
	height: 100%;
	padding-left: 1.4rem;
	padding-right: 1.5rem;
	display: flex;
	flex-direction:column;

}
.couponUsed .tab .tabItem .right .top{
	width: 100%;
	height: 4.5rem;
	line-height: 4.5rem;
	color: #333;
	font-size: 1.5rem;
	display: flex;
}
.couponUsed .tab .tabItem .right .top .name{
	flex: 1;
}
.couponUsed .tab .tabItem .right .top .use{
	width: 7rem;
	height: 4.5rem;
	line-height: 4.5rem;
	text-align: center;
	color: #999;
}
.couponUsed .tab .tabItem .right .top .use>span{
	display:inline-block;
	width: 100%;
	height: 2.3rem;
	line-height: 2.3rem;
	font-size: 1.1rem;
	border: 1px solid #999;
	border-radius: 0.4rem;
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
.couponUsed .tab .tabItem .right .timeLimit{
	padding-top: 2.1rem;
	box-sizing: border-box;
	font-size: 1rem;
	color: #999;
	height: 3.2rem;
	position: relative;
}
.couponUsed .tab .tabItem .right .timeLimit:after{
	position: absolute;
	display: block;
	left: 0;
	top: 0;
	border-top: 1px dotted #e0e0e0;
	content: ' ';
	width: 100%;
}
.couponUsed .tab .tabItem .right .remarks{
	flex: 1;
	padding-top: 0.9rem;
	font-size: 1rem;
	color: #999;
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
}
.couponUsed .tab .tabItem .semicircle{
	width: 0.5rem;
	height: 1rem;
	background: #f5f5f5;
	position: absolute;
	top: 50%;
	margin-top: -0.5rem;
}
.couponUsed .tab .tabItem .semicircle.bbb{
	border-radius:0 0.5rem 0.5rem 0;
	left: 0;
}
.couponUsed .tab .tabItem .semicircle.aaa{
	right: 0;
	border-radius:0.5rem 0 0 0.5rem;
}
.couponUsed .nothing{
	padding-top: 7.5rem;
}
.couponUsed .nothing .nothingPic{
	width: 16.5rem;
	margin: 0 auto;
}
.couponUsed .nothing .nothingPic>img{
	width: 100%;
}
.couponUsed .nothing .nothingTxt{
	margin-top: 3.5rem;
	text-align: center;
	font-size: 1.5rem;
	color: #666666;
}
</style>