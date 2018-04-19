<!--我的邀请列表-->
<template>
	<div class="myInviting div-border-box">
		<!--<div class="header">
			<header-bar :isWhite="false"></header-bar>
		</div>-->
		<div class="content">
			<div class="inviting-list">
				<div class="line"></div>
				<template v-if="itemList.length > 0">
					<div class="three-box-img-item clearfix" v-for="item in itemList">
						<div class="item-left">
							<div class="item-img">
								<img :src="item.photoUrl == null || item.photoUrl =='' ? '/static/img/header.png' : item.photoUrl"/>
							</div>
							<div class="item-ct">
								<div class="text" v-html="item.nickName == null || item.nickName == '' ? encryptPhone(item.phone) : item.nickName"></div>
								<div class="gray-text">{{ encryptPhone(item.phone) }}</div>
							</div>
						</div>
						<div class="item-right">
							<div class="time">{{ item.datetime }}</div>
						</div>
					</div>
					<div class="more" v-if="showMore" @click="loadMore">加载更多</div>	
				</template>
				<div class="no-data" v-if="itemList.length == 0">暂无数据</div>
			</div>
		</div>
	</div>
</template>

<script>
//	import headerBar from '@/components/header/headerBar'
	//import add from '@/components/my/receivingAddress/addAddress'
	export default {
		name: 'myInviting',
		components: {
//			'header-bar': headerBar
		},
		data() {
			return {
				itemList: [],
				pageNum: 1,//当前页数
				total: 0,//总共条数
				showMore: false
			}
		},
		mounted() {
			this.$nextTick(function() {
				document.title = '我的邀请';
				this.getInviteList();
			})
		},
		methods: {
			//查询我的邀请好友记录
			getInviteList: function() {
				var that = this;
				var reqUrl = this.baseUrl + '/inviteFriends/getInvite';
				var params = {
					customerCode: this.userInfo.customerCode,
					pageNum: this.pageNum,
					pageSize: this.pageSize
				}
				this.$http.get(reqUrl, {params: params}).then(function(res) {
					if(!res) {
						return;
					}	
					that.total = res.total;
					if(that.pageNum == 1) {
						that.itemList = res.ifList;
					} else {
						for(var i = 0;i < res.ifList.length;i++) {
							that.itemList.push(res.ifList[i]);
						}
					}
					if(that.total > that.pageSize) {
						that.showMore = true;
					}
         		});
			},
			//加载更多
			loadMore: function() {
				var maxPage = Math.ceil(that.total / that.pageSize);
				if(this.pageNum < maxPage) {
					this.pageNum++;
					this.getInviteList();
				} else {
					this.$toast('没有更多了');
					this.showMore = false;
				}
			}
		}
	}
</script>

<style scoped>
@import '../../../assets/css/itemCommon.css';
.three-box-img-item {
	height: 6.5rem;
	padding: 1.5rem 1.2rem;
}
.three-box-img-item .item-left .item-img {
	width: 3.5rem;
	height: 3.5rem;
}
.three-box-img-item .item-left .item-ct .text {
	font-size: 1.2rem;
	line-height: 1.5rem;
	margin-bottom: 0.5rem;
	
}
.three-box-img-item .item-left .item-ct .gray-text {
	font-size: 1.1rem;
	line-height: 1.5rem
}
.three-box-img-item .item-right {
	margin-top: 1.5rem;
}
.three-box-img-item .item-right .time {
	font-size: 1.1rem;
	line-height: 2.4rem;
}
.more {
	text-align: center;
	line-height: 2.0rem;
	font-size: 1.4rem;
	color: #666;
	margin-top: 1.0rem;
}
.no-data {
	text-align: center;
	font-size: 1.2rem;
	color: #aaa;
	padding-top: 2.0rem;
}
</style>