<!-- 邀请二维码 -->
<template>
	<div id="myCode" class="div-border-box">
		<div class="content">
			<div class="code-box">
				<div class="ct-hd">
					<div class="item-box">
						<img :src="userInfo.phoneUrl == null ? '/static/img/header.png' : userInfo.phoneUrl"/>
						<div class="item-text">
							<div class="ellipsis">
								<span v-html="userInfo.nickName == null || '' ? encryptPhone(userInfo.phone) : userInfo.nickName"></span>的二维码</div>
							<div class="gray">邀请好友有惊喜哦</div>
						</div>
					</div>
					<div class="img-box">
						<div ref="twoCode" id="qart"></div>
					</div>
					<div class="text">
						<a href="javascript:;">长按保存图片</a>
					</div>
				</div>
				<div class="ct-bd">
					<p>点击右上角分享给好友获得奖励</p>
					<div class="btn-share" @click="handleShare">分享给好友</div>
					<div class="link-box">
						<a class="mg-right" href="javascript:;" @click="$router.push({name: 'MyInvitingFriends'})">奖励邀请</a>
						<a href="javascript:;" @click="$router.push({name: 'myInviting'})">我的邀请</a>
					</div>
				</div>
			</div>
		</div>
		<!-- 提示：点击右上角分享 -->
		<div class="prompt-con" v-if="showPrompt" @click="showPrompt = false">
			<img src="./img/info.png" width="100%" height="100%"/>
		</div>
	</div>
</template>
<script>
export default {
	name: 'myCode',
	data() {
		return {
			wxConfig:{},//微信配置信息
			showPrompt: false,
			signFlag: null
		}
	},
	created() {
//		document.body.scrollTop = document.documentElement.scrollTop = 0;
        this.loadScript();
    },
	mounted() {
		this.$nextTick(function() {
			document.title = '邀请好友';
            
            var that = this;
            var signFlag = localStorage.getItem('_myCodeSign');
            if(signFlag != null) {
            	this.signFlag = signFlag;
            }
            var ua = navigator.userAgent.toLowerCase();  
		    if(ua.match(/MicroMessenger/i)=="micromessenger") {  //微信端
		    	setTimeout(function(){that.getSignInfo();}, 1000)//获取签名信息
            	if(this.isIosOrAndroid() == 'IOS' && (this.signFlag != null)) {
            		setTimeout(function(){that.qrcode();}, 1000)//生成二维码
            	}
            	if(this.isIosOrAndroid() == 'Android') {
            		setTimeout(function(){
	           			that.qrcode();//生成二维码
	           		}, 1000)
            	}
		    } else {
		    	setTimeout(function() {
	       			that.qrcode();//生成二维码
	       		}, 1000)
		    }
       })
	},
	destroyed() {
		localStorage.removeItem('_myCodeSign');
    },
	methods: {
		loadScript: function() {
			//微信js
			const s1 = document.createElement('script');
            s1.type = 'text/javascript';
            s1.src = 'http://res.wx.qq.com/open/js/jweixin-1.2.0.js';
            document.body.appendChild(s1);
            
            //生成二维码
            const s2 = document.createElement('script');
	        s2.type = 'text/javascript';
	        s2.src = '/static/js/qrcode.js';
	        document.body.appendChild(s2);
		},
		//生成二维码
		qrcode: function() {
            var qrCodeUrl = this.userInfo.qrCode;
            if(qrCodeUrl == null) {
            	this.$toast('推广二维码为空');
            	return;
            }
        	var qrcode = new QRCode(document.getElementById("qart"), {
        	 	width: 190,
        	 	height: 190
        	});
	        qrcode.makeCode(qrCodeUrl);
		},
		//分享给好友
		handleShare: function() {
			var ua = navigator.userAgent.toLowerCase();  
		    if(ua.match(/MicroMessenger/i)=="micromessenger") {  
		    	this.showPrompt = true;
		    } else {  
		    	this.$toast('请在微信中打开');
		    }  
		},
		//获取微信签名信息
		getSignInfo: function() {
    		var that = this;
			var reqUrl = this.baseUrl + '/wx/getWxSignature';
			var params = {'url': this.onlineUrl + '/myCode'}
			this.$http.get(reqUrl, {params: params})
			.then(function(res) {
				if(!res) {
					return;
				}
				that.wxConfig = res;
				that.handleWxSdk();
   			});
		},
		//触发微信sdk
		handleWxSdk: function() {
			var phone = this.userInfo.phone;
			var onlineUrl = this.onlineUrl;
			wx.config({
			    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
			    appId: this.wxConfig.appId, // 必填，公众号的唯一标识
			    timestamp: this.wxConfig.timestamp, // 必填，生成签名的时间戳
			    nonceStr: this.wxConfig.nonceStr, // 必填，生成签名的随机串
			    signature: this.wxConfig.signature,// 必填，签名，见附录1
			    jsApiList: ['checkJsApi','onMenuShareAppMessage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
			});
			wx.ready(function() {
				wx.checkJsApi({
					jsApiList: ['onMenuShareAppMessage']
				});
				wx.onMenuShareAppMessage({
					title: '正品货物，你需要的这里都有，全场买一送一！', // 分享标题
					desc: '还有等额积分赠送，买100元送100积分，积分等额抵现！', // 分享描述
					link: onlineUrl + '/inviteRegister?phone=' + phone,// 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
					imgUrl: '', // 分享图标
					type: 'link', // 分享类型,music、video或link，不填默认为link
					dataUrl: '' // 如果type是music或video，则要提供数据链接，默认为空
				});
//				wx.hideMenuItems({menuList: ["menuItem:share:timeline"]});
			});	
			
			if(this.isIosOrAndroid() == 'IOS' && (this.signFlag == null)) {
				localStorage.setItem('_myCodeSign', 'already');
				location.reload();
			}
		}
	}
}
</script>

<style scoped>
@import '../../../assets/css/itemCommon.css';
.content {
	box-sizing: border-box;
	min-height: 100vh;
	background-image:-webkit-linear-gradient(0deg,#ffe167 0%,#ffd409 80%);
	background-image: -webkit-linear-gradient(0deg,#ffe167 0%,#ffd409 80%); /* Safari 5.1 - 6.0 */
	background-image: -o-linear-gradient(0deg,#ffe167 0%,#ffd409 80%); /* Opera 11.1 - 12.0 */
	background-image: -moz-linear-gradient(0deg,#ffe167 0%,#ffd409 80%); /* Firefox 3.6 - 15 */
	background-image: linear-gradient(0deg,#ffe167 0%,#ffd409 80%);
}
.gray {
	color: #999;	
}
.content div {
	box-sizing: border-box;
}
.content .code-box {
	padding: 3.3rem 0;
	/*padding: 3.3rem 3.5rem 0;*/
}
.content .code-box .ct-hd {
	width: 30.0rem;/*100%;*/
	height: 37.5rem;
	background: url(../../../assets/img/bgCode.png) no-repeat;
	background-size: 100% auto;
	background-color: #f6d12f;
	box-shadow: 2px 8px 24px 2px 
		rgba(212, 174, 1, 0.35);
	margin: 0 auto;
}
.content .code-box .ct-bd {
	margin: 0 auto;
	font-size: 1.6rem;
	color: #763b00;
	text-align: center;
	padding: 3.1rem 0;
} 
.content .code-box .ct-bd p {
	padding-bottom: 1rem;
}
.content .code-box .btn-share {
	display: block;
	width: 30.0rem;
	line-height: 4.5rem;
	height: 4.5rem;
	font-size: 1.6rem;
	color: #fff;
	background-color: #ff7800;
	border-radius: 0.5rem;
	margin: 0 auto 3.5rem auto;
	cursor: pointer;
}
.code-box .ct-hd .item-box {
	display: flex;
	width: 100%;
	height: 29%;
	padding-top: 2rem;
	justify-content: center;
}
.code-box .ct-hd .item-box img {
	width: 5.5rem;
	height: 5.5rem;
	border-radius: 50%;
}
.code-box .ct-hd .item-box .item-text {
	width: calc(100% - 12.5rem);
	padding-left: 1rem;
	font-size: 1.533rem;
	line-height: 2.3rem;
}
.code-box .img-box {
	position: relative;
	top: 0;
	left: 0;
	width: 20rem;
	height: 20rem;
/*	padding: 2rem 5.5rem 0;*/
	margin: 0 auto;
	text-align: center;
/*	background: #eee;*/
}
.img-box div {
	position: absolute;
	left: calc(50% - 95px);
	top: 0;
	text-align: center;
}
.code-box .img-box img {
	width: 100%;
	height: 100%;
}
.code-box .text {
	text-align: center;
	font-size: 1.3rem;
	margin-top: 1.8rem;
}
.code-box .text a {
	color: #666;
}
.code-box .link-box {
	position: relative;
}
.code-box .link-box:before {
	content: '';
	display: block;
	position: absolute;
	left: calc(50% - 0.05rem);
	height: 1.5rem;
	width: 1px;
	background-color: #763b00;
}
.code-box .link-box a {
	color: #763b00;
	font-size: 1.5rem;
}
.code-box .link-box a.mg-right {
	margin-right: 4rem;
}
.prompt-con {
	position: fixed;
	top: 0;
	/*left: 0;*/
	width: 100%;
	max-width: 54rem;
	height: 100%;
	/*background-image: url(img/info.png);*/
	/*background-size: 100% 100%;*/
	background-position-x: center;
}

</style>