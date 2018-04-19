<!-- 评论 -->
<template>
    <div class="comment">
    	<!--<div class="header">
    		<header-bar></header-bar>
    	</div>-->
    	<template v-if="commentList.length == 0">
    		<div class="no-data" :style="{height: (clientH * 10) + 'px'}">
    			<img src="/static/img/nomsg.png" />
    			<p>竟然一条评论都没有</p>
    		</div>
		</template>
    	<template v-if="commentList.length > 0">
	    	<div class="tabs">
	    		<span class="active" @click="handleTabs($event, 'all')">全部（{{commentNum}}）</span>
	    		<span @click="handleTabs($event, 'pic')">有图（{{commentPicNum}}）</span>
	    	</div>
	    	<div class="comment-group">
				<div class="comment-item" v-for="item in commentList">
					<div class="account">
						<img :src="item.photoUrl == null ||item.photoUrl == '' ? '/static/img/header.png' : item.photoUrl" />
						<h3>
							<span v-html="item.nickName == null || item.nickName == '' ? item.phone : item.nickName"></span>
							<img src="./img/grade1.png" class="grade"/>
							<!-- 星级 -->
							<template v-for="obj in item.evaluateList">
								<template v-if="obj.isAdd == '0'">
									<img src="./img/icon-star.png" class="icon-star" v-for="i in parseInt(obj.evaluateScore)"/>
								</template>
							</template>
						</h3>
					</div>
					<template v-for="obj in item.evaluateList">
						<template v-if="obj.isAdd == '0'">
							<div class="info">
								{{obj.evaluateTime}}&nbsp;&nbsp;
								<span>{{item.colorName}}&nbsp;&nbsp;{{item.sizeName}}</span>
							</div>
							<div class="con">
								<div class="con-text">{{obj.evaluateContent}}</div>
								<div class="con-img" v-if="obj.evaluateImgs != ''">
									<img :src="imgPath" v-for="imgPath in obj.evaluateImgs" @click="handleBigImg(imgPath)" />
								</div>
							</div>
						</template>
						<template v-if="obj.isAdd == '1'">
							<h2 class="add-con">追加评价：</h2>
							<div class="info">
								{{obj.evaluateTime}}&nbsp;&nbsp;
								<!--<span>{{item.colorName}};{{item.sizeName}}</span>-->
							</div>
							<div class="con">
								<div class="con-text">{{obj.evaluateContent}}</div>
								<div class="con-img" v-if="obj.evaluateImgs != ''">
									<img :src="imgPath" v-for="imgPath in obj.evaluateImgs" @click="handleBigImg(imgPath)" />
								</div>
							</div>
						</template>
					</template>
				</div>
			</div>
		</template>
    	<!-- 查看大图 -->
    	<div class="img-pop" v-if="showBigImg" @click="showBigImg = false">
    		<mt-swipe :show-indicators="false" :auto="0" :defaultIndex="defaultIndex">
				<mt-swipe-item v-for="item, index in imgList" :key="index"><img :src="item" /></mt-swipe-item>
			</mt-swipe>
    	</div>
    </div>
</template>
<script>
//import headerBar from '@/components/header/headerBar'	

export default {
    name: 'comment', 
    components: {
//	  	'header-bar': headerBar
	},
    data() {
        return {
        	commentList: [],//商品评论列表
        	showBigImg: false,//是否查看大图
        	commentNum: 0,//评论数量
        	commentPicNum: 0,//有图评论数量
        	isPic: '',
        	imgList: [],//所有图片的数据
        	defaultIndex: 0,//查看大图 默认图片下标
        }
    },
    created() {
//	    document.body.scrollTop = document.documentElement.scrollTop = 0;
    },
    mounted() {
        this.$nextTick(function() {
        	document.title = '商品评价';
        	
        	this.getCommentList();
        });
    },
    methods: {
    	//切换
    	handleTabs: function(e, tabName) {
    		var tabsArr = document.getElementsByClassName('tabs')[0].getElementsByTagName('span');
    		for(var i = 0;i < tabsArr.length;i++) {
    			tabsArr[i].className = '';
    		}
    		e.currentTarget.className = 'active';
    		if(tabName == 'all') {
    			this.isPic = '';
    		} else {
				this.isPic = '1';
    		}
    		this.getCommentList();
    	},
    	//获取登录客户评价列表
    	getCommentList: function() {
    		var that = this;
			var reqUrl = this.baseUrl + '/productInfo/mallEvaluates';
			
			var currProObjList = JSON.parse(localStorage.getItem('_currProObjList'));//当前商品信息 数组
			var params = {
				evaluateProductCode: currProObjList[0].proCode,//评价商品CODE
				isNew: '2',//是否最新一条商品评论（1.是 2.否）
			}
			if(this.isPic != '') {
				params.isPic = this.isPic;
			}
			this.$http.get(reqUrl, {params: params})
			.then(function(res) {
				if(!res) {
					return;
				}
				var commentList = res.mallEvaluate;
				that.commentNum = res.allEvaluateCount;
				that.commentPicNum = res.exitPicEvaluateCount;
				if(commentList.length > 0) { 
					var imgList = [];
					
					for(var i = 0;i < commentList.length;i++) {
						var commentObj = commentList[i];
						//昵称加密
						var nickName = commentObj.nickName;
						if(nickName != null && nickName != '') {
							var f = nickName.substr(0, 1);
							var l = nickName.substr(nickName.length - 1, 1);
							commentObj.nickName = f + '***' + l;
						}
						
						var evaluateList = commentObj.evaluateList;
						for(var j = 0;j < evaluateList.length;j++) {
							var evaluateObj = evaluateList[j];
							if(evaluateObj.evaluateImgs != null && evaluateObj.evaluateImgs != '') {
								var arr = (evaluateObj.evaluateImgs).split(',');
								evaluateObj.evaluateImgs = arr;
								imgList = imgList.concat(arr);
							}
						}
					}
					that.imgList = imgList;
				}
				that.commentList = commentList;
 			});
    	},
    	//查看大图
    	handleBigImg: function(imgPath) {
    		for(var i = 0;i < this.imgList.length;i++) {
    			if(imgPath == this.imgList[i]) {
    				this.defaultIndex = i;
    			}
    		}
    		this.showBigImg = true;
    	}
    }
}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style scoped>
.comment {
	width: 100%;
}
.header { 
	border-bottom: 0.1rem solid #d9d9d9;
}
.comment-item {
	margin-left: 1.5rem;
	border-bottom: 0.1rem solid #d7d7d7;
}
.comment-item:last-child {
	border-top: none;
}
.comment-item .account {
	padding: 1.5rem 0 1.0rem 0;
}
.account > img {
	float: left;
	width: 3.2rem;
	height: 3.2rem;
	border-radius: 3.2rem;
	vertical-align: middle;
	margin-right: 0.6rem;
}
.account h3 {
	line-height: 3.2rem;
	font-size: 1.3rem;
}
.account .grade {
	width: 1.4rem;
	height: 1.4rem;
	vertical-align: middle;
	margin-left: 0.5rem;
}
.account .icon-star {
	width: 1.4rem;
	height: 1.4rem;
	vertical-align: middle;
	margin-left: 0.5rem;
}
.comment-item .info {
	color: #666;
	font-size: 1.2rem;
	margin-bottom: 0.8rem;
}
.comment-item .con .con-text {
	color: #333;
	font-size: 1.4rem;
	line-height: 1.8rem;
	margin-bottom: 1.0rem;
	word-break: break-all;
}
.comment-item .con .con-img {
	margin-bottom: 0.4rem;
}
.comment-item .con .con-img img {
	width: 6rem;
	height: 6rem;
	border-radius: 0.2rem;
	background: #7f7f7f;
	margin-right: 0.8rem;
	margin-bottom: 0.8rem;
	cursor: pointer;
}
.comment-item .add-con {
	margin-bottom: 1.0rem;
	padding-top: 1.2rem;
    color: #d4282d;
    font-size: 1.2rem;
}
.tabs {
	width: 100%;
	height: 3.7rem;
	line-height: 3.7rem;
	border-bottom: 0.1rem solid #ebebeb;
	clear: both;
}
.tabs > span {
	float: left;
	width: 50%;
	height: 100%;
	font-size: 1.5rem;
	color: #333;
	text-align: center;
	cursor: pointer;
}
.tabs > span.active {
	color: #d4282d;
	border-bottom: 0.2rem solid #d4282d;
}

.img-pop {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 1.0);
	vertical-align: sub;
}
.img-pop img {
	position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
	width: 100%;
	margin: auto;
}
.no-data {
	text-align: center;
	background: #f5f5f5;
}
.no-data > img {
	width: 15rem;
	height: auto;
	margin-top: 10.0rem;
}
.no-data > p {
	color: #666;
	font-size: 1.5rem;
	margin-top: 2.4rem;
}
</style>
