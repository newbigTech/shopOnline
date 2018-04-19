<!-- 商品评价 -->
<template>
    <div class="activity">
    	<v-breadcrumb firstMenu="消息" secondMenu="商品评价"></v-breadcrumb>
    	<div class="nav row">
    		<div class="col-md-12">
    			<div class="portlet box red">
					<div class="portlet-title">
						<div class="caption">商品评价列表</div>
					</div>
					<div class="portlet-body">
						<div class="operate">
                            <form class="form-inline">
                                <div class="form-group">
                                    <label for="exampleInputName2">商品code：</label>
                                    <div class="input-group">
                                        <input type="text" class="form-control" placeholder="关联商品或品牌CODE" v-model="proName" disabled="disabled" />
                                        <span class="input-group-btn">
                                            <a class="btn btn-default" @click="openGoodsList">选择</a>
                                        </span>
                                    </div>
                                </div>

                                <div class="form-group">
        							<button type="button" class="btn btn-primary" @click="handleSearch">查询</button>&nbsp;&nbsp;
        							<span>共计{{commCount}}条评价</span>
                                </div>
                            </form>
                            <!-- <input type="text" class="form-control input-inline input-medium" placeholder="商品code" v-model="proCode">&nbsp;&nbsp; -->
						</div>
						<div class="table-scrollable" v-if="tableData.length>0">
							<template v-for="item in tableData">
								<div class="part">
									<div class="user-info">
										<div class="col-md-3">
											<img :src="item.photoUrl" class="photo" />
											<div class="account">
												<p class="username">{{item.nickName}}</p>
												<p>{{item.phone}}</p>
											</div>
										</div>
										<div class="col-md-3 time">{{item.evaluateList[0].evaluateTime}}</div>
										<div class="col-md-3 star">
											<span v-for="i in parseInt(item.evaluateList[0].evaluateScore)">★</span>
											<span class="unlit-star" v-for="i in (5 - parseInt(item.evaluateList[0].evaluateScore))">☆</span>
										</div>
										<div class="col-md-3 view">
											<el-switch v-model="item.viewFlag" active-color="#cb5a5e" inactive-color="#ccc"
												 active-text="显示" inactive-text="隐藏" @change="changeStatus(item)"></el-switch>
						      				</el-switch>
										</div>
									</div>	
									<template v-for="obj in item.evaluateList">
										<div class="comment-info" v-if="obj.isAdd == '0'">
											<div class="comment-text">{{obj.evaluateContent}}</div>
											<div class="comment-img" v-if="obj.evaluateImgs != ''">
												<img :src="imgPath" v-for="imgPath in obj.evaluateImgs" />
											</div>
										</div>
										<div class="comment-info" v-if="obj.isAdd == '1'">
											<div class="part-top">
												<div class="col-md-3 add-comment-title">
													追评：
												</div>
												<div class="col-md-3 time">{{obj.evaluateTime}}</div>
											</div>
											<div class="comment-text">{{obj.evaluateContent}}</div>
											<div class="comment-img" v-if="obj.evaluateImgs != ''">
												<img :src="imgPath" v-for="imgPath in obj.evaluateImgs" />
											</div>
										</div>
									</template>
								</div>
							</template>
						</div>
						<el-pagination layout="prev, pager, next" v-if="commCount > pageSize"
			    			:page-size="pageSize" :current-page="currentPage" :total="commCount"
							 v-on:current-change="handlePaging"></el-pagination>
					</div>
    			</div>
    		</div>
    	</div>
        <v-goodsListModel :visible="goodsListModelVisible" v-on:visible="setGoodsVisible" v-on:getGoods="getSelectedGoods"></v-goodsListModel>
    </div>
</template>
<script>
import breadcrumb from '@/components/tool/breadcrumb'	//面包屑
import goodsListModel from '@/components/goods/goodsListModel' //商品列表弹框 
export default {
    name: 'activity',
    components: {
    	'v-breadcrumb': breadcrumb,
        'v-goodsListModel': goodsListModel,
	},
    data() {
        return {
        	tableData: [],
        	dialogVisible: false,
        	isView: '显示',
        	dialogTitle: '添加',
        	shape: '1',
        	viewFlag: true,
        	currentPage: 1,
        	proCode: '',
            proName: '',
        	commCount: 0,//评论总条数
            goodsListModelVisible: false,
        }
    },
    mounted() {
        this.$nextTick(function() {
        	// this.getList();
        });
    },
    methods: {
        // 关闭视图
        setGoodsVisible(flag) {
            this.goodsListModelVisible = flag;
        },
        // 选择商品
        getSelectedGoods(_item){
            this.proName = _item.proTitle;
            this.proCode = _item.proCode;
        },
        openGoodsList(){
            this.goodsListModelVisible = true;
        },
    	//获取评论列表
    	getList: function() {
            if (this.proCode == '') { return this.$message('请选选着商品！'); }
    		var that = this;
			var reqUrl = this.baseUrl + '/productInfo/getProEvaluates';
			var params = {
				currentPage: this.currentPage,
				pageSize: this.pageSize
			}
			if(this.proCode != '') {
				params.evaluateProductCode = this.proCode;
			}
			this.$http.get(reqUrl, {params: params}).then(function(res) {
                if(!res) {return; }
				that.commCount = res.total;
				var commentList = res.evaluates;
				if(commentList.length > 0) { 
					for(var i = 0;i < commentList.length;i++) {
						var commentObj = commentList[i];
						
						var evaluateList = commentObj.evaluateList;
						for(var j = 0;j < evaluateList.length;j++) {
							if(evaluateList[0].evaluateHidden == '1') {
								commentObj.viewFlag = true;
							} else {
								commentObj.viewFlag = false;
							}
							
							var evaluateObj = evaluateList[j];
							if(evaluateObj.evaluateImgs != null && evaluateObj.evaluateImgs != '') {
								var arr = (evaluateObj.evaluateImgs).split(',');
								evaluateObj.evaluateImgs = arr;
							}
						}
					}
				}
				that.tableData = commentList;
 			});
    	},
    	//条件搜索
    	handleSearch: function() {
    		this.currentPage = 1;
    		this.getList();
    	},
    	handlePaging: function(_currentPage) {
    		this.currentPage = _currentPage;
			this.getList();
    	},
    	changeStatus: function(item) {
    		item.viewFlag = !item.viewFlag;
    		var that = this,hiddenSta = '1';
    		if(!item.viewFlag) {
    			this.$confirm('确认显示吗？').then(function() {
    				hiddenSta = '1';
    				that.handleStatus(item, hiddenSta);
    			},function() {})
    		} else {
    			this.$confirm('确认隐藏吗？').then(function() {
    				hiddenSta = '2';
    				that.handleStatus(item, hiddenSta);
    			},function() {})
    		}
    	},
    	//更新商品评论屏蔽状态
    	handleStatus: function(item, hiddenSta) {
    		var that = this;
			var reqUrl = this.baseUrl + '/productBusi/updEvaluateSta';
			var obj = item.evaluateList[0];
			var params = {
				hiddenSta: hiddenSta,
				proSku: obj.evaluateProductSkuCode,
				orderNo: obj.totalOrderNo
			}
			if(this.proCode != '') {
				params.evaluateProductCode = this.proCode;
			}
			this.$http.post(reqUrl, params)
			.then(function(res) {
				if(!res) {
					return;
				}
				that.getList();
 			});

    	}
    }
}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style scoped>
@import url("../home/css/dialog.css");
.dialog-con .input-group-btn {
    line-height: 1;
}

.dialog-con .input-group-btn>.btn {
    height: 40px;
    line-height: 30px;
    border-radius: 0 4px 4px 0;
    border: 1px solid #ccc;
}
.goods-img  {
	width: 100px;
	height: 50px;
}
.table-scrollable {
	padding: 20px;
}
.user-info {
	min-height: 60px;
}
.user-info .photo {
	width: 50px;
	height: 50px;
	border-radius: 50px;
}
.user-info .account {
	margin-left: 60px;
}
.account .username {
	font-size: 18px;
	/*font-weight: bold;*/
	margin-bottom: 10px;
}
.account .phone {
	font-size: 15px;
}
.user-info .time {
	line-height: 50px;
	font-size: 16px;
}
.user-info .star {
	line-height: 50px;
	font-size: 24px;
}
.star span.unlit-star {
	margin-left: -6px;
	margin-right: 6px;
}
.user-info .view {
	line-height: 50px;
}
.comment-info  .comment-text {
	font-size: 15px;
	line-height: 26px;
	text-indent: 20px;
	margin-bottom: 10px;
}
.comment-info .comment-img {
	margin: 5px 0 10px 0;
}
.comment-info .comment-img img {
	width: 100px;
	height: 100px;
	margin-right: 10px;
}
.part {
	margin-bottom: 30px;
	border-bottom: 1px dashed #aaa;
}
.part:last-child {
	border-bottom: none;
}
.part .part-top {
	min-height: 30px;
	margin-top: 20px;
}
.add-comment-title {
	color: #d4282d;
}
</style>

