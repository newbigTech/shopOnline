<!--我的-优惠券-->
<template>
	<div class="coupon" :style="{'min-height':(clientH * 10) + 'px'}">
		<div class="tab" ref="couponTab">
			<div :class="['tabItem '] + [!viewUsed ? 'active' : '']" @click="handleTab">
				<span>待使用({{unUsedNum}})</span>
			</div>
			<div :class="['tabItem '] + [viewUsed ? 'active' : '']" @click="handleTab">
				<span>已使用({{usedNum}})</span>
			</div>
		</div>
		<div class="tab-con">
			<template v-if="table.length > 0">
				<ul class="tab-con-ul">
					<li class="con-Item" v-for="item in table">
						<div :class="['left ']+[viewUsed ? 'left-gray' : '']">
							￥<span>{{item.amount}}</span>
						</div>
						<div class="right">
							<div class="top">
								<div class="name">
									{{item.name}}
								</div>
								<div :class="['use ']+[viewUsed ? 'use-gray' : '']">
									<span v-if="!viewUsed" @click="handleUse(item.couponId)">立即使用</span>
									<span v-if="viewUsed">已使用</span>
								</div>
							</div>
							<div class="timeLimit">
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
						<img src="../../assets/img/couponNothing.png"/>
					</div>
					<div class="nothingTxt">您还没有优惠券</div>
				</div>
			</template>
			<p class="look-invalid" @click="$router.push('/invalidCoupon')">查看已失效优惠券></p>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
	export default {
		name:'coupon',
		data() {
			return {
				table:[],
		      	viewUsed: false, 
		      	usedNum: 0,//使用数量
		      	unUsedNum: 0,//已使用数量
			}
		},
		created() {
			this.getList();
		},
		mounted() {
			this.$nextTick(function() {
				document.title = '优惠券';
			})
		},
		destroyed() {
			localStorage.removeItem('usedCouponList');
			localStorage.removeItem('unUsedCouponList');
	    },
		methods:{
			//tab切换
			handleTab() {
				this.viewUsed = !this.viewUsed;
				var list = [];
				if(this.viewUsed) {
					list = JSON.parse(localStorage.getItem('usedCouponList'));
				} else {
					list = JSON.parse(localStorage.getItem('unUsedCouponList'));
				}
				
				if(list == null) {
					this.getList();
				} else {
					this.table = list;
				}
			},
			getList() {
	    		var that = this,
	    			params = {}, //状态(1:未使用 ，2:已使用)
	    			reqUrl = this.baseUrl + '/coupon/findCouponByStatus';
	    		if(!this.viewUsed) {
	    			params.status = '1';
	    			params.type = '1';
	    		} else {
	    			params.status = '2';
	    			params.type = '2';
	    		}
	            this.$http.get(reqUrl, {params: params}).then(function(res) {
	                if (!res) { return; }
	                var couponList = res.couponList;
	                that.usedNum = res.count;
	                that.unUsedNum = res.unCount;
	                for(var i = 0;i < couponList.length;i++) {
		    			couponList[i].validTime = that.formatDate(couponList[i].validTime, 'time');
		    		}
	                if(!that.viewUsed) {
		    			localStorage.setItem('unUsedCouponList', JSON.stringify(couponList));
		    		} else {
		    			localStorage.setItem('usedCouponList', JSON.stringify(couponList));
		    		}
		    		that.table = couponList;
	            });
	    	},
	    	//立即使用
	    	handleUse(couponId) {
	    		this.$router.push('/experArea?couponId=' + couponId);
	    	}
	    	
		}
	}
</script>

<style scoped>
.coupon {
	background: #f5f5f5;
}
.coupon .tab {
	display: flex;
	width: 100%;
	height: 4.5rem;
	width: 100%;
	background: #fff;
}
.tab .tabItem {
	flex: 1;
	font-size: 1.3rem;
	color: #666666;
	height: 4.5rem;
	line-height: 4.5rem;
}
.tab .tabItem:first-child {
	text-align: right;
	padding-right: 3.5rem;
}
.tab .tabItem:last-child {
	padding-left: 3.5rem;
}
.tab .tabItem span {
	padding: 0 0.6rem;
	height: 4.3rem;
}
.tab .tabItem.active {
	color: #d4282d;
}
.tab .tabItem.active > span {
	display: inline-block;
	border-bottom: 0.2rem solid #d4282d;
}
.tab-con .tab-con-ul {
	width: calc(100% - 3.1rem);
	margin: 0 auto;
	padding-top: 0.9rem;
	box-sizing: border-box;
}
.tab-con-ul .con-Item {
	display: flex;
	width: 100%;
	height: 10.8rem;
	margin-bottom: 0.9rem;
	background: #fff;
	position: relative;
}
.con-Item .left{
	height: 100%;
	line-height: 10.8rem;
	width: 11.4rem;
	background-size: 100% auto;
	text-align: center;
	font-size: 1.5rem;
	color: #fff;
	background-image: url(../../assets/img/couponUnused.png);
	background-repeat: no-repeat;
}
.con-Item .left.left-gray{
	background-image: url(../../assets/img/couponUsed.png);
}
.con-Item .left>span{
	font-size: 3.6rem;
}
.con-Item .right{
	flex: 1;
	height: 100%;
	padding-left: 1.4rem;
	padding-right: 1.5rem;
	display: flex;
	flex-direction:column;
}
.con-Item .right .top{
	width: 100%;
	height: 4.5rem;
	line-height: 4.5rem;
	color: #333;
	font-size: 1.5rem;
	display: flex;
}
.con-Item .right .top .name{
	flex: 1;
}
.con-Item .right .top .use{
	width: 7rem;
	height: 4.5rem;
	line-height: 4.5rem;
	text-align: center;
	color: #d4282d;
}
.con-Item .right .top .use.use-gray{
	color: #999;
}
.con-Item .right .top .use>span{
	display:inline-block;
	width: 100%;
	height: 2.3rem;
	line-height: 2.3rem;
	font-size: 1.1rem;
	border: 1px solid #d4282d;
	border-radius: 0.4rem;
}
.con-Item .right .top .use.use-gray>span{
	border: 1px solid #999;
}
/*@media (-webkit-min-device-pixel-ratio:1.5),(min-device-pixel-ratio:1.5) {
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
}*/
.con-Item .right .timeLimit{
	padding-top: 2.1rem;
	box-sizing: border-box;
	font-size: 1.0rem;
	color: #999;
	height: 3.2rem;
	position: relative;
}
.con-Item .right .timeLimit:after{
	position: absolute;
	display: block;
	left: 0;
	top: 0;
	border-top: 1px dotted #e0e0e0;
	content: ' ';
	width: 100%;
}
.con-Item .right .remarks{
	flex: 1;
	padding-top: 0.9rem;
	font-size: 1rem;
	color: #999;
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
}
.con-Item .semicircle{
	width: 0.5rem;
	height: 1rem;
	background: #f5f5f5;
	position: absolute;
	top: 50%;
	margin-top: -0.5rem;
}
.con-Item .semicircle.bbb{
	border-radius:0 0.5rem 0.5rem 0;
	left: 0;
}
.con-Item .semicircle.aaa{
	right: 0;
	border-radius:0.5rem 0 0 0.5rem;
}
.look-invalid {
	line-height: 3.6rem;
	font-size: 1.2rem;
	color: #409eff;
	text-align: center;
}
.nothing{
	padding-top: 7.5rem;
}
.nothing .nothingPic{
	width: 16.5rem;
	margin: 0 auto;
}
.nothing .nothingPic>img{
	width: 100%;
}
.nothing .nothingTxt{
	margin-top: 3.5rem;
	text-align: center;
	font-size: 1.5rem;
	color: #666666;
}
</style>