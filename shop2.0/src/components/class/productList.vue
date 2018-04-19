<!-- 商品列表 -->
<template>
    <div class="productList">
    	<div class="nav">
    		<template v-if="exhibitionId != null">
				<ul class="common-ul other">
					<!-- 楼层元素 -->
					<template v-for="item in floorProList">
						<li v-if="item.spec == 1"  @click="handleDetail(item.resourceId)">
			  				<img :src="item.imgPath" class="picture" />
			  				<div class="data">
			  					<!--<div class="info">{{item.elementHint}}</div>-->
				  				<!--<span class="integral">赠{{item.minIntegal}}积分</span>-->
				  				<div class="title other">{{item.elementName}}</div>
				  				<div class="prize">
			  						<i class="iconfont">￥</i>{{item.minSalePrice}}<span class="integral other">赠{{item.minIntegal}}积分</span>
				  				</div>
			  				</div>
			  			</li>
			  			<li v-if="item.spec == 2" class="full-item" @click="handleDetail(item.resourceId)">
			  				<img :src="item.imgPath" class="picture" />
			  				<div class="data">
				  				<span class="integral">赠{{item.minIntegal}}积分</span>
				  				<div class="title">{{item.elementName}}</div>
				  				<div class="info">{{item.elementHint}}</div>
				  				<div class="prize">
			  						<i class="iconfont">￥</i>{{item.minSalePrice}}
				  				</div>
			  				</div>
			  			</li>
		  			</template>
	  			</ul>
	  		</template>
	  		<template v-else>
		  		<ul class="common-ul">
		  			<!-- 商品列表 -->
					<li v-for="item in proList" @click="handleDetail(item.proCode)">
		  				<img :src="item.prosimg" class="picture" />
		  				<div class="data">
		  					<div class="info">{{item.proHit}}</div>
			  				<span class="integral">赠{{item.jifen}}积分</span>
			  				<div class="title">{{item.proName}}</div>
			  				<div class="prize">
		  						<i class="iconfont">¥</i>{{item.xsjia}}
			  				</div>
		  				</div>
		  			</li>
		  		</ul>
	  		</template>
	  		<div class="no-data" :style="{height: clientH + 'rem'}"  v-if="proList.length == 0 && exhibitionId == null">
	  			<img src="../../../src/assets/img/noResult.png" />
	  			<p>抱歉，暂无搜索结果</p>
	  		</div>
		</div>
    </div>
</template>
<script>
export default {
    name: 'productList', // 二级分类
    data() {
        return {
        	proList: [],
        	floorProList: [],//楼层元素数据
        	floorProList1: [],//正方形楼层元素
        	floorProList2: [],//长方形楼层元素
        }
    },
    props: {
    	exhibitionId: {//楼层id
    		type: String,
    		default: null
    	},
    	proTitle: {//商品标题
    		type: String,
    		default: null
    	},
    	classId: { //商品二级分类id
    		type: String,
    		default: null
    	}
    },
    watch: {
    	proTitle: function(a, b) {
    		this.getGoodsByTitle();
    	},
    	classId: function(a, b) {
    		this.getGoodsBySecond();
    	}
    },
    mounted() {
        this.$nextTick(function() {
        	if(this.exhibitionId != null) {
//      		var _floorProList = JSON.parse(localStorage.getItem('_floorProList' + this.exhibitionId));
//      		if(_floorProList != null) {
//      			this.floorProList = _floorProList;
//      		} else {
        			this.getGoodsByFloor();	
//      		}
        	}
        	if(this.proTitle != null) {
        		this.getGoodsByTitle();
        	}
        	if(this.classId != null) {
        		this.getGoodsBySecond();
        	}
        });
    },
    methods: {
    	//获取单个楼层下的楼层元素
    	getGoodsByFloor: function() {
    		var that = this;
			var reqUrl = this.baseUrl + '/mallExhibition/getExhibitionEles';
			var params = {
				exhibitionKey: this.exhibitionId
			}
			this.$http.get(reqUrl, {params: params})
			.then(function(res) {
				if(!res) {
					return;
				}
				that.floorProList = res.mallExhibitionElements;
//				localStorage.setItem('_floorProList' + that.exhibitionId, JSON.stringify(that.floorProList));
 			});
    	},
    	//根据商品名称查询商品
  		getGoodsByTitle: function() {
  			var that = this;
			var reqUrl = this.baseUrl + '/productInfo/getMallProducts';
			var params = {
				proTitle: this.proTitle
			}
			this.$http.get(reqUrl, {params: params})
			.then(function(res) {
				if(!res) {
					return;
				}
				that.proList = res.mallProducts;
 			});
  		},
  		//查询二级分类下的商品列表
  		getGoodsBySecond: function() {
  			if(this.classId == '') {
  				return;
  			}
  			var that = this;
			var reqUrl = this.baseUrl + '/productInfo/getMallProducts';
			var params = {
				classId: this.classId
			}
			this.$http.get(reqUrl, {params: params})
			.then(function(res) {
				if(!res) {
					return;
				}
				that.proList = res.mallProducts;
 			});
  		},
    	//查看商品详情
    	handleDetail: function(proCode) {
    		var query =  {
    			proCode: proCode
    		}
    		this.$router.push({
    			query: query,
    			path: '/pdDetails'
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
    		this.handleAddFoot(proCode); //新增足迹
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
.nav {
	background: #fff;
    /*border-top: 0.1rem solid #d9d9d9;*/
}

.common-ul {
	overflow: hidden;
    clear: both;
}

.common-ul li {
    float: left;
    width: 50%;
    height: 30rem;
    margin-left: 0;
    box-sizing: border-box;
    background: #fff;
    /*padding: 1.0rem 0.5rem 0.9rem 0.5rem;*/
}

.common-ul li:nth-child(2n) {
    padding: 1.0rem 1.0rem 1.9rem 0.5rem;
}

.common-ul li:nth-child(2n + 1) {
    padding: 1.0rem 0.5rem 1.9rem 1.0rem;
}
.common-ul.other li{
	height: 24rem;
	padding-top: 1.5rem;
	padding-bottom: 0rem;
}

.common-ul li img.picture {
    width: 100%;
    height: 17.2rem;
    border-top-left-radius: 0.2rem;
    border-top-right-radius: 0.2rem;
    margin: 0;
}

.common-ul .title {
    width: 100%;
    height: 1.4rem;
    line-height: 1.5rem;
    margin: 1.1rem 0 0.6rem 0;
    color: #333;
    font-size: 1.4rem;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}
.common-ul .title.other{
	margin-top: 1.0rem;
	margin-bottom: 0.7rem;
}

.common-ul li .data {
    margin-top: -0.2rem;
}

.common-ul .info {
    width: calc(100% - 1rem);
    height: 3.4rem;
    line-height: 3.4rem;
    font-size: 1.2rem;
    color: #a18c63;
    margin-bottom: 1.2rem;
    background: #f1ece2;
    padding: 0 0.5rem;
    border-bottom-left-radius: 0.2rem;
    border-bottom-right-radius: 0.2rem;
    box-sizing: content-box;
    overflow: hidden;
}

.prize {
    color: #d4282d;
    font-size: 1.5rem;
}

.prize i {
    font-size: 1.1rem;
    margin-right: 0.1rem;
}

.integral {
    display: inline-block;
    height: 1.5rem;
    line-height: 1.6rem;
    background: #e5686d;
    color: #fff;
    padding-left: 0.6rem;
    padding-right: 0.6rem;
    font-size: 1.0rem;
    border-radius: 0.2rem;
}
.integral.other{
	line-height: 1.5rem;
	vertical-align: top;
	margin-left: 1.4rem;
}

.common-ul li.full-item {
    width: 100%;
    height: 31rem;
    padding: 1.0rem 0 0 0;
}

.common-ul li.full-item img.picture {
    height: 21rem;
    border-radius: 0;
    margin: 0;
}

.common-ul li.full-item .data {
    padding: 1.0rem;
}

.common-ul li.full-item .info {
    width: calc(100% - 1rem);
    height: 1.2rem;
    line-height: 1.2rem;
    font-size: 1.2rem;
    color: #999;
    padding: 0;
    margin-bottom: 0.8rem;
    background: transparent;
    box-sizing: content-box;
    overflow: hidden;
}

.common-ul li.full-item .prize {
    float: right;
    margin-top: -4.6rem;
}

.common-ul li.full-item .title {
    width: calc(100% - 8.0rem);
    box-sizing: content-box;
    margin-bottom: 0.7rem;
}

.no-data {
	background: #f5f5f5;
    text-align: center;
}

.no-data>img {
    width: 17.4rem;
    height: 15.6rem;
    margin-top: 10rem;
}

.no-data>p {
    font-size: 1.5rem;
    color: #333;
    margin-top: 3.4rem;
}

</style>
