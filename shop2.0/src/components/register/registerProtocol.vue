<template>
	<div id="registerProtocol">
		<!--<div class="header">
    		<header-bar></header-bar>
    	</div>-->
		<div class="content">
			<template v-if="protoObj == null">
				<div class="no-data">暂无数据</div>
			</template>
			<template v-if="protoObj != null">
				<div class="ct-hd">
					<div class="tit">{{protoObj.protocol_name}}</div>
					<div class="time">{{protoObj.create_time}}</div>
				</div>
				<div class="ct-bd">
					<div v-html="protoObj.content"></div>
				</div>
			</template>
		</div>
	</div>
</template>

<script>
//	import headerBar from '@/components/header/headerBar'
	
	export default {
		name: 'registerProtocol',
		components: {
//		  	'header-bar': headerBar,
		},
		data() {
			return {
				title:'注册协议标题',
				time:'2017-11-26 13:45',
				content: [],
				protoObj: {},
				protoType: ''
			}
		},
		mounted() {
			this.$nextTick(function() {
				document.title = '注册协议';
				this.protoType = this.$route.query.protoType;
				this.getProtoDetail();
			})
		},
		methods: {
			//获取单条协议详情
			getProtoDetail: function() {
	    		var that = this;
				var reqUrl = this.baseUrl + '/protocol/selectIsShow';
				var params = {
					type: this.protoType//1：用户服务协议 2：隐私政策 3：抽奖规则 4：积分规则
				};
				this.$http.get(reqUrl, {params: params})
				.then(function(res) {
					if(!res) {
						return;
					}
					var protoObj;
					if(res.list.length == 0) {
						protoObj = null
					} else {
						protoObj = res.list[0];
						protoObj.create_time = that.setDateFormat(new Date(protoObj.create_time), 'time');
					}
					that.protoObj = protoObj;
	 			});
			}
		}
	}
</script>
<style>
#registerProtocol ol,
#registerProtocol p {
	line-height: 2.0rem;
	font-size: 1.2rem;
	margin: 0.5rem 0;
}
</style>
<style scoped>
.content {
	padding: 0 1.5rem;
}
.content .ct-hd {
	box-sizing: border-box;
	height: 6.5rem;
	border-bottom: 0.1px solid #E5E5E5;
	padding: 1.8rem 0 1rem;
}
.content .ct-hd .tit {
	font-size: 1.6rem;
	line-height: 2.2rem;
	color: #333;
}
.content .ct-hd .time {
	font-size: 1.2rem;
	line-height: 1.5rem;
	color: #999;
}
.content .ct-bd {
	
}
.content .ct-bd p {
	text-indent: 2.5rem;
	font-size: 1.3rem;
	line-height: 2.5rem;
	margin-top: 1rem;
}
.no-data {
	font-size: 1.2rem;
	color: #a8a8a8;
	text-align: center;
	padding-top: 2.0rem;
}
</style>