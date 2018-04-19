<!-- 搜索 -->
<template>
    <div class="search">
    	<div class="operate">
    		<i class="iconfont">&#xe616;</i>
    		<input type="text" :placeholder="searchDefault" v-model="searchText" @focus="handleFocus" @keydown="goSearch($event)" />
    		<!--<span v-if="searchText ==''" @click="$router.go(-1)">取消</span>-->
    		<span @click="handleSearch">搜索</span>
    	</div>
    	<template v-if="!showResult">
    		<div class="search-group" v-if="historyList.length > 0">
	    		<h3>
	    			<span>历史记录</span>
	    			<span class="iconfont" @click="deleteHistory">&#xe601;</span>
	    		</h3>
	    		<div class="history-con">
	    			<span v-for="item in historyList" @click="handleDetail(item, 'history')">{{item.searchWord}}</span>
	    		</div>
	    	</div>
	    	<div class="search-group">
	    		<h3>
	    			<span>热门搜索</span>
	    		</h3>
	    		<div>
	    			<template v-for="item in hotList">
	    				<span @click="handleDetail(item, 'hot')" :class="{red: item.isRemark == 1}">{{item.wordName}}</span>
	    			</template>
	    		</div>
	    	</div>
    	</template>
    	<div class="nav" v-if="showResult">
    		<div class="nav-con">
    			<product-list :proTitle="proTitle"></product-list>
    		</div>
    	</div>
    </div>
</template>
<script>
import productList from '@/components/class/productList' //商品列表
import { MessageBox } from 'mint-ui';
	
export default {
    name: 'search', // 搜索
    components: {
	  	'product-list': productList
	},
    data() {
        return {
        	searchDefault: '',//搜索框默认显示内容
            searchText: '',
            proTitle: '',
            historyList: [], //历史搜索
            hotList: [],//热门搜索数据
            showResult: false,
            searchFlag: false,
        }
    },
    created() {
//	     document.body.scrollTop = document.documentElement.scrollTop = 0;
    },
    mounted() {
        this.$nextTick(function() {
        	document.title = '搜索商品';
        	
        	this.getSearch();
        	this.getHistory();
        });
    },
    methods: {
    	handleFocus: function() {
    		this.showResult = false;
    	},
    	goSearch: function(e) {
    		if(e.keyCode == 13) {
    			this.handleSearch();
    		} 
    	},
    	handleSearch: function() {
    		if(this.searchText == '') {
    			this.searchText = this.searchDefault;
    		}
    		this.showResult = true;
    		this.proTitle = this.searchText;
    		var _historySearch = JSON.parse(localStorage.getItem('_historySearch'));
    		if(_historySearch == null) {
    			_historySearch = [{'searchWord': this.searchText}];
    		} else {
    			for(var i = 0;i < _historySearch.length;i++) {
    				if(_historySearch[i].searchWord == this.searchText) {
    					_historySearch.splice(i, 1);
    				}
    			}
    			_historySearch.splice(0, 0, {'searchWord': this.searchText});
    			if(_historySearch.length > 40) {
    				_historySearch.pop();
    			}
    		}
    		this.historyList = _historySearch;
    		localStorage.setItem('_historySearch', JSON.stringify(_historySearch));
    		if(this.token != null) {
    			this.addHistorySearch();
    		}
    	},
    	//删除历史搜索记录
    	deleteHistory: function() {
    		var that= this;
    		MessageBox({
			  message: '确认删除全部历史记录？',
			  showCancelButton: true
			}).then(function(action)  {
				if(action == 'confirm') {
					if(that.token == null) {
						that.historyList = [];
						localStorage.removeItem('_historySearch');
					} else {
						that.handleDetele();
					}
				}
			})
    	},
    	//删除历史搜索
    	handleDetele: function() {
    		var that = this;
			var reqUrl = this.baseUrl + '/search/deleteSearchRecord';
			
			var searchRecordIds = [];
			for(var i = 0;i < this.historyList.length;i++) {
				searchRecordIds.push(this.historyList[i].searchRecordId);
			}
			var params = {
				searchRecordIds: searchRecordIds
			};
			this.$http.post(reqUrl, params)
			.then(function(res) {
				if(!res) {
					return;
				}
				if(res.result != 'success') {
					this.$toast('删除失败');
					return;
				}
				that.historyList = [];
   			});
    	},
    	//获取 热门搜索数据 和 搜索框数据
    	getSearch: function() {
    		var that = this;
			var reqUrl = this.baseUrl + '/search/findSearch';
			this.$http.get(reqUrl)
			.then(function(res) {
				if(!res) {
					return;
				}
				that.hotList = res.searchWordList;
				var searchBoxList = res.searchBoxList;
				var searchBoxLen = searchBoxList.length;
				//产生0-（searchBoxList.length-1）的随机数
				var r =  Math.floor(Math.random() * searchBoxLen); 
				that.searchDefault = searchBoxList[r].searchName;
   			});
    	},
    	//获取历史搜索数据
    	getHistory: function() {
    		if(this.token == null) {//没有登录时，获取本地的历史搜索记录（最新的四十条）
    			var _historySearch = JSON.parse(localStorage.getItem('_historySearch'));
    			if(_historySearch == null) {
    				return;
    			}
    			if(_historySearch.length > 40) {
    				var arr = [];
    				for(var i = 0;i < 40;i++) {
    					arr.push(_historySearch[i]);
    				}
    				this.historyList = arr;
    			} else {
    				this.historyList = _historySearch;
    			}
    			
    		} else {
		  		var that = this;
				var reqUrl = this.baseUrl + '/search/findSearchRecord';
				var params = {};
				this.$http.get(reqUrl, {params: params})
				.then(function(res) {
					if(!res) {
						return;
					}
					that.historyList = res.searchRecordList;
	   			});
    		}
    	},
    	//查看商品详情
    	handleDetail: function(item, typeName) {
    		if(typeName == 'hot') { //热搜
    			this.searchText = item.wordName;
    		} else {//历史搜索
    			this.searchText = item.searchWord;
    		}
			this.handleSearch();
    	},
    	//添加历史搜索记录
    	addHistorySearch: function() {
    		var that = this;
			var reqUrl = this.baseUrl + '/search/addSearchRecord';
			var params = {
				searchWord: this.searchText
			};
			this.$http.post(reqUrl, params)
			.then(function(res) {
				if(!res) {
					return;
				}
				that.getHistory();
   			});
    	}
    }
}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style scoped>.search { background: #f5f5f5; }
.operate { position: relative; top: 0; left: 0; height: 3.1rem; line-height: 3.1rem; padding: 0.8rem 1.4rem; background: #fff; clear: both; }
.operate >i.iconfont { position: absolute; left: 2.6rem; top: 1.0rem; font-size: 1.4rem; }
.operate > input[type=text] { width: 85%; background: #ededed; border-radius: 0.5rem; padding-left: 3.3rem; font-size: 1.5rem; height: 3.2rem; }
.operate > span { float: right; color: #333; font-size: 1.5rem; }
.search-group { padding: 1.8rem 1.4rem; background: #fff; margin-bottom: 1.0rem; clear: both; }
.search-group > h3 { color: #999; font-size: 1.5rem; }
.search-group > h3 .iconfont { float: right; font-size: 1.7rem; }
.search-group > div > span { display: inline-block; max-width: 12.0rem; height: 1.2rem; padding: 0.7rem 1.2rem; margin-right: 1.4rem; margin-top: 1.4rem; border: 0.1rem solid #ccc; border-radius: 0.2rem; font-size: 1.5rem; color: #333; cursor: pointer; text-overflow: ellipsis; white-space: nowrap; overflow: hidden; }
.search-group > div > span.red { color: #e93b3d; border: 0.1rem solid #e93b3d; }
.search-group .history-con { max-height: 17.0rem; overflow: hidden; }
</style>
