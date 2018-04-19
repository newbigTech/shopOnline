<!-- 推荐奖励 -->
<template>
	<div class="invitingFriends div-border-box">
		<!--<div class="header">
			<header-bar :isWhite="false"></header-bar>
		</div>-->
		<div class="content">
			<div class="inviting-details">
				<div class="round-box">
					<p>已得奖励</p>
					<p class="integral-num">{{ integralMsg.rewardPoint }}</p>
					<p>积分</p>
				</div>
				<div class="u-three-list">
					<ul class="clearfix">
						<!--<li>
							<div class="name">已邀请</div>
							<div class="num"><span>{{integralMsg.hadInvite}}</span>人</div>
						</li>-->
						<li>
							<div class="name">已注册</div>
							<div class="num"><span>{{ integralMsg.parentCustCode }}</span>人</div>
						</li>
						<li>
							<div class="name">已消费</div>
							<div class="num"><span>{{ integralMsg.isPaymentNum }}</span>人</div>
						</li>
					</ul>
				</div>
			</div>
			<div class="inviting-list">
				<div class="three-box-img-item clearfix" v-for="item in itemList">
					<div class="item-left">
						<div class="item-icon-box">
							<span class="u-icon icon-jf">积</span>
						</div>
						<div class="item-ct">
							<div class="text">推荐奖励</div>
							<div class="gray-text">{{ item.time }}</div>
						</div>
					</div>
					<div class="item-right">{{ item.rewardPoint }}积分</div>
				</div>
				<div class="more" v-if="showMore" @click="loadMore">查看更多</div>
			</div>
		</div>
	</div>
</template>

<script>
//import headerBar from '@/components/header/headerBar'
//import add from '@/components/my/receivingAddress/addAddress'
export default {
	name: 'invitingFriends',
	components: {
//		'header-bar': headerBar
	},
	data() {
		return {
			integralMsg:{},
			itemList:[],
			pageNum: 1,
			total: 0,
			showMore: false
		}
	},
	mounted() {
		this.$nextTick(function() {
			document.title = '推荐奖励';
			
			this.getInviteData();
			this.getInviteRecord();
		})
	},
	methods: {
		//查询我的邀请记录
		getInviteData: function() {
			var that = this;
			var reqUrl = this.baseUrl + '/inviteFriends/getInviteFriends';
			this.$http.get(reqUrl).then(function(res) {
				if(!res) {
					return;
				}	
				that.integralMsg = res;
				if(res.rewardPoint == null) {
					that.integralMsg.rewardPoint = 0;
				}
     		});
		},
		//*查询我的邀请奖励记录
		getInviteRecord: function() {
			var that = this;
			var reqUrl = this.baseUrl + '/inviteFriends/getRewardPoint';
			var params = {
				pageNum: this.pageNum,
				pageSize: this.pageSize
			}
			this.$http.get(reqUrl, {params: params}).then(function(res) {
				if(!res) {
					return;
				}	
				if(that.pageNum == 1) {
					that.itemList = res.ifList;
				} else {
					for(var i = 0;i < res.ifList.length;i++) {
						that.itemList.push(res.ifList[i]);
					}
				}
				that.total = res.total;
				that.integralMsg.hadInvite = that.total;
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
				this.getInviteRecord();
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
.content {
	background-color: #f5f5f5;
}
.round-box {
	width: 9.5rem;
	height: 9.5rem;
	padding: 1.6rem;
} 
.round-box p {
	line-height: 2rem;
}
.invitingFriends .content .inviting-details {
	padding: 2rem 1.2rem 0;
	margin-bottom: 1rem;
	background-color: #fff;
}
.content .inviting-details .round-box .integral-num {
	line-height: 3.3rem;
} 
.content .inviting-details .round-box .integral-num {
	font-size: 2rem;
}
.content .inviting-details .u-three-list {
	padding-top: 3.0rem;
}
.u-three-list li {
	width: 50%;
	padding: 0;
	height: auto;
	padding-bottom: 2.5rem;
}
.u-three-list li .name {
	font-size: 1.3rem;
}
.u-three-list li .num {
	font-size: 1.3rem;
	margin-top: 0.2rem;
}
.u-three-list li .num span {
	font-size: 1.5rem;
}
/* 列表 */
.inviting-list {
	background-color: #fff;
}
.three-box-img-item .item-left .item-ct .text {
	font-size: 1.2rem;
}
.three-box-img-item .item-left .item-ct .gray-text {
	font-size: 1.1rem;
}
.content .three-box-img-item .item-left .item-icon-box {
	width: 3rem;
}
.content .three-box-img-item .item-left .item-ct {
	margin-left: 3rem;
}
.content .three-box-img-item .item-right {
	margin-top: 0.9rem;
	font-size: 1.3rem;
	line-height: 1.8rem;
}
.three-box-img-item .item-left .item-icon-box .u-icon {
	margin-top: 0.5rem;
}
.more {
	text-align: center;
	color: #666;
	font-size: 1.2rem;
	margin-top: 1.0rem;
}
</style>