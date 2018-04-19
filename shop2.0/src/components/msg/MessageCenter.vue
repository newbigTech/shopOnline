<!--消息中心-->
<template>
	<div id="MessageCenter" class="clearfix" :style="{'min-height': clientH *10 +'px'}">
		<!--<div class="header">
    		<header-bar></header-bar>
    		<div class="line"></div>
    	</div>-->
			<!--商城活动-->
			<router-link :to="{ name: 'ShopSales'}">
				<div class="message_box">
					<div class="message_box_icon clearfix">
						<img src="./img/msg1.png">
						<template v-if="activity!=null && activity.counts != 0">
							<span v-if="activity.counts<=99" v-text="activity.counts"></span>
							<span v-if="activity.counts>99">99+</span>
						</template>
					</div>
					<div class="message_box_content clearfix">
						<h3>商城活动<span v-if="activity !=null">{{activity.times}}</span></h3>
						<p v-if="activity">{{activity.title}}</p>
						<p v-if="!activity">暂无活动</p>
						<i></i>
					</div>
				</div>
			</router-link>
			<!--物流通知-->
			<router-link :to="{ name: 'LogisticsNotification'}">
				<div class="message_box">
					<div class="message_box_icon clearfix">
						<img src="./img/msg2.png">
						<template v-if="logistics!=null && logistics.counts != 0" >
							<span v-if="logistics.counts<=99" v-text="logistics.counts"></span>
							<span v-if="logistics.counts>99">99+</span>
						</template>
					</div>
					<div class="message_box_content clearfix">
						<h3>物流通知<span v-if="logistics !=null">{{logistics.times}}</span></h3>
						<p>此处可以查看您的订单物流通知</p>
						<i></i>
					</div>
				</div>
			</router-link>
			<!--商城公告-->
			<router-link :to="{ name: 'MallAnnouncement'}">
				<div class="message_box">
					<div class="message_box_icon clearfix">
						<img src="./img/msg3.png">
						<template v-if="notice!=null &&notice.counts != 0">
							<span v-if="notice.counts<=99" v-text="notice.counts"></span>
							<span v-if="notice.counts>99">99+</span>
						</template>
					</div>
					<div class="message_box_content clearfix">
						<h3>商城公告<span v-if="notice">{{notice.times}}</span></h3>
						<p>点击查看您的商城公告</p>
						<i></i>
					</div>
				</div>
			</router-link>
			<!--通知消息-->
			<router-link :to="{ name: 'MessageNotification'}">
				<div class="message_box">
					<div class="message_box_icon clearfix">
						<img src="./img/msg4.png">
						<template v-if="notifyMsg!=null && notifyMsg.counts != 0"> 
							<span v-if="notifyMsg.counts<=99" v-text="notifyMsg.counts"></span>
							<span v-if="notifyMsg.counts>99">99+</span>
						</template>
					</div>
					<div class="message_box_content clearfix">
						<h3>通知消息<span v-if="notifyMsg">{{notifyMsg.times}}</span></h3>
						<p>您的积分账户变动如下:</p>
						<i></i>
					</div>
				</div>
			</router-link>
			<!--在线客服-->
			<div href="#" @click="hanldleContact">
				<div class="message_box">
					<div class="message_box_icon clearfix">
						<img src="./img/msg5.png">
					</div>
					<div class="message_box_content clearfix">
						<h3>在线客服</h3>
						<p>点击查看您与客服的沟通记录</p>
						<i></i>
					</div>
				</div>
			</div>
		</div>
</template>

<script>
//import headerBar from '@/components/header/headerBar'	
export default {
  name: 'MessageCenter',
  components: {
//	  	'header-bar': headerBar
	},
  data () {
    return {
     activity:[],
     notifyMsg:[],
     notice:[],
     logistics:[]
    }
  },
  mounted(){
  		 this.$nextTick(function(){
  		 	this.getMessage();
			document.title =this.title+'-'+'消息中心';
  		 })
  	},
  methods:{
  	//查询消息中心
  	getMessage() {
  		var that = this;
		var reqUrl = this.baseUrl + '/message/getMessage';
		var params = {
		}
		this.$http.get(reqUrl, {params: params}).then((res) => {
			if(!res){
				return
			}
			that.activity = res.activity;
			that.notifyMsg = res.notifyMsg;
			that.notice = res.notice;
			that.logistics = res.logisticsNotice;
		})
  	}
  }
}
  
</script>

<style scoped>
			.clearfix:after {
				content: "";
				display: block;
				clear: both;
			}
			.header{
				position: relative;
			}
			.line{
				height: 0.1rem;
				width: 100%;
				background: #ebebeb;
				position: fixed;
				left: 0;
				top: 3.7rem;
			}
			/*消息中心start*/
			#MessageCenter {
				box-sizing: border-box;
				margin: 0 auto;
				margin-top: 0.1rem;
			}
			
			#MessageCenter .message_box {
				margin: 0 auto;
				height: 7.5rem;
				width: calc(100% - 3rem);
			}
			/*消息中心  左边的icon*/
			#MessageCenter .message_box_icon {
				width: 5.5rem;
				height: 7.5rem;
				line-height: 7.5rem;
				text-align: center;
				float: left;
				position: relative;
			}
			
			#MessageCenter .message_box_icon img {
				vertical-align: middle;
				width: 4.9rem;
				height: 4.9rem;
				border-radius: 1rem;
			}
			
			#MessageCenter .message_box_icon span {
				display: block;
				width: 1.8rem;
				height: 1.8rem;
				line-height: 1.8rem;
				background: #ff4242;;
				color: #fff;
				position: absolute;
				right: 0;
				top: 1rem;
				border-radius: 1.8rem;
				font-size: 1.2rem;
			}
			/*消息中心  右边的文字*/
			#MessageCenter .message_box_content {
				width: calc(100% - 5.5rem);
				height: 4rem;
				float: right;
				text-indent: 1em;
			}
			
			#MessageCenter .message_box_content h3 {
				margin-top: 1.6rem;
				font-weight: normal;
				font-size: 1.5rem;
				height: 2rem;
				color: #333;
			}
			
			#MessageCenter .message_box_content span {
				font-size: 1.2rem;
				float: right;
				height: 2rem;
				line-height: 1.3rem;
				color: #999;
			}
			
			#MessageCenter .message_box_content p {
				margin-top: 0.7rem;
				font-size: 1.3rem;
				color: #666;
				height: 1.5rem;
				line-height: 1.7rem;
				/*文字溢出*/
				display: -webkit-box;
-webkit-box-orient: vertical;
-webkit-line-clamp: 1;
overflow: hidden;
			}
			#MessageCenter .message_box_content i{
				display: block;
				height: 1.5rem;
				border-bottom: 0.1rem solid #e5e5e5;
			}
			/*消息中心end*/
			[v-cloak] {
			  display: none;
			}
</style>