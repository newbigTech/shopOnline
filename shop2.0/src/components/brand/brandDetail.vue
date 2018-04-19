<!-- 品牌详情页 -->
<template>
    <div id="brandDetail" class="brand-detail" :style="{'min-height': (clientH * 10) + 'px'}">
    	<div class="brand-info">
    		<div class="brand-banner">
    			<img :src="brandInfo.detailBanner" />
    		</div>
    		<div class="brand-title">
    			<h2>{{brandInfo.brandName}}</h2>
    		</div>
    	</div>
    	<div class="brand-goods">
    		<div class="bgs-item" v-for="item in brandInfo.brandList" @click="handleDetail(item.proCode)">
    			<div class="bgs-item-img">
    				<img :src="item.imgPath" />
    			</div>
    			<div class="bgs-item-title">{{item.proTitle}}</div>
    			<div class="bgs-item-prize"><i>￥</i>{{item.proSalePrice}}</div>
    		</div>
    	</div>
    </div>
</template>
<script>
export default {
    name: 'brandDetail', // 品牌详情页
    data() {
        return {
        	brandId: '',//品牌id
        	brandInfo: []
        }
    },
    created() {
//		document.body.scrollTop = document.documentElement.scrollTop = 0;
    },
    mounted() {
        this.$nextTick(function() {
        	var brandId = this.$route.query.brandId;
        	if(brandId == undefined) {
        		this.$router.go(-1);
        	} else {
        		this.brandId = brandId;
        		this.getBrandInfo();
        	}
        });
    },
    destroyed() {
    	
    },
    methods: {
    	//获取当前品牌信息
    	getBrandInfo() {
    		var that = this;
            this.$http.get(this.baseUrl + '/brand/findBrandProductInfo', 
            	{ params: { id: this.brandId } })
            .then(function(res) {
                if (!res) { return; }
                that.brandInfo = res.brandInfoList[0];
            });
    	},
    	//跳转到商品详情
    	handleDetail(proCode) {
    		this.$router.push({
    			path: '/pdDetails',
    			query: {
    				proCode: proCode
    			}
    		});
    		if(!this.userInfo) { //没有登录时，足迹缓存到本地
    			var _myFootprint = JSON.parse(localStorage.getItem('_myFootprint'));
    			var currTime = this.setDateFormat(new Date(),'time');
    			if(_myFootprint != null) {
    				for(var i = 0;i < _myFootprint.length;i++) {
	    				if(_myFootprint[i].proCode == proCode) {
	    					_myFootprint.splice(i, 1);
	    				}
	    			}
	    			_myFootprint.splice(0, 0, {'proCode': proCode, 'time': currTime});
    				
    			} else {
    				_myFootprint = [{'proCode': proCode,  'time': currTime}];
    			}
      			localStorage.setItem('_myFootprint', JSON.stringify(_myFootprint)); 
				return;
			}
    		this.handleAddFoot(proCode);//添加足迹
    	},
    	//新增我的足迹
    	handleAddFoot: function(productId) {
    		var that = this;
			var reqUrl = this.baseUrl + '/myFootprint/addMyFootprint';
			var params = {
				productId: productId
			}
			this.$http.post(reqUrl, params)
			.then(function(res) {
				if(!res) {
					return;
				}
				if(res.result != 'success') {
					return;
				}
 			});
    	}
    }
}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style scoped>
.brand-detail {
	background: #fff;
}
.brand-info {
	width: 100%;
}
.brand-info .brand-banner {
	width: 100%;
	/*max-height: 39.5rem;*/
}
.brand-banner > img {
	width: 100%;
	height: auto;
	/*max-height: 39.5rem;*/
}
.brand-info .brand-title {
	text-align: center;
	height: 3.4rem;
	padding: 0.5rem 0;
	background-image: url(../../assets/img/brand-top-bg.png);
	background-size: 100% 2.6rem;
	background-repeat: no-repeat;
	background-position-x: center;
	background-position-y: center;
	margin: 1.0rem 0;
}
.brand-title > h2 {
	color: #333;
	font-size: 1.5rem;
	margin-top: 1.2rem;
}
.brand-goods {
	width: calc(100% - 2.0rem);
	padding: 0 1.0rem;
	clear: both;
}
.brand-goods:after{
	display: block; 
	content: ""; 
	clear: both;
}
.brand-goods .bgs-item {
	float: left;
	width: calc(50% - 0.5rem);
	font-size: 1.2rem;
	margin-bottom: 1.0rem;
}
.brand-goods .bgs-item:nth-child(2n+1) {
	margin-right: 1.0rem;
}
.bgs-item .bgs-item-img {
	width: 100%;
	height: 15.8rem;
	text-align: center;
	vertical-align: middle;
	/*background: #f7f7f7;*/
}
.bgs-item .bgs-item-img > img {
	width: auto;
	height: auto;
	max-width: 100%;
	max-height: 15.8rem;
}
.bgs-item .bgs-item-title {
	width: 100%;
	height: 1.4rem;
	line-height: 1.46rem;
	margin-top: 1.0rem;
	margin-bottom: 0.4rem;
	font-size: 1.4rem;
	color: #333;
	overflow: hidden;
}
.bgs-item .bgs-item-prize {
	margin-bottom: 0.2rem;
	font-size: 1.5rem;
	color: #d4282d;
}
.bgs-item .bgs-item-prize > i {
	font-size: 1.1rem;
	font-style: normal;
}
</style>
