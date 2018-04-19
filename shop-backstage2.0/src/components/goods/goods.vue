<!-- 商品管理 -->
<template>
	<div class="goods">
		<v-breadcrumb firstMenu="商品" secondMenu="商品管理"></v-breadcrumb>
		<div class="nav row">
			<div class="col-md-12">
				<div class="portlet box red">
					<div class="portlet-title">
						<div class="caption">商品列表</div>
					</div>
					<div class="portlet-body">
						<div class="operate">
							<button type="button" class="btn btn-danger" @click="lotDelBtn">
								批量删除
							</button>
						</div>
						<div class="operate">
							<!--<span>商品类型：</span>
							<select class="form-control input-small input-inline" v-model="prodCate">
								<option :value="item.value" v-for="item in goodsType">{{item.label}}</option>
							</select>-->
							
							<span>商品名称：</span>
							<input class="form-control input-small input-inline" type="text" v-model="goodsName" placeholder="请输入商品名称"/>
							
							<span>商品状态：</span>
							<select class="form-control input-small input-inline" v-model="goodsState">
								<option value="2">全部</option>
								<option value="0">销售中</option>
								<option value="1">下架</option>
							</select>
							
							<span>商品分类：</span>
							<select class="form-control input-small input-inline" v-model="oneSelected" @change="getTwoClassify">
								<option value="info">请选择一级分类</option>
								<option v-for="item,index in oneClassify" :key="index" :value="index">{{ item.className }}</option>
							</select>
							
							<select class="form-control input-small input-inline" v-model="twoSelected">
								<option v-if="twoClassify.length == 0" value="info">暂无</option>
								<option v-else value="info">请选择二级分类</option>
								<option v-for="item,index in twoClassify" :key="index" :value="item.productTypeCode">{{ item.className }}</option>
							</select>
							
							<button type="button" class="btn btn-success" @click="classifyQuery">查询</button>
						</div>
						<div class="table-scrollable">
							<el-table :data="goodsRecord" @selection-change="handleGoodsLotDel">
								<el-table-column type="selection" prop="" width="50"></el-table-column>
								<el-table-column prop="proTitle" label="商品标题"> </el-table-column>
								<el-table-column prop="proSimg" label="图片" width="150">
									<template slot-scope="scope">
										<img :src="scope.row.proSimg" class="goods-img" />
									</template>
								</el-table-column>
								<el-table-column prop="proBrand" label="商品品牌"> </el-table-column>
								<el-table-column prop="proBrand" label="商品类型">
									<template slot-scope="scope">
										<span v-if="scope.row.prodCate == 1">普通商品</span>
										<span v-if="scope.row.prodCate == 2">促销专区</span>
										<span v-if="scope.row.prodCate == 3">增值专区</span>
									</template>
								</el-table-column>
								<el-table-column prop="proAddTime" label="创建时间" width="200"> </el-table-column>
								<el-table-column prop="" label="操作">
									<template slot-scope="scope">
										<span class="btn default btn-xs green" @click="handleLook(scope.row.proCode)">查看</span>
										<span class="btn default btn-xs purple" @click="handleGoodsModify(scope.row.proCode)"
											v-if="scope.row.prodCate == 1">修改 </span>
										<span class="btn default btn-xs red" @click="handleGoodsDel(scope.row.proCode)">删除</span>
									</template>
								</el-table-column>
							</el-table>
							<el-pagination layout="prev, pager, next" v-if="total > pageSize"
			    			:page-size="pageSize" :current-page="currentPage" :total="total"
							 v-on:current-change="handlePaging"></el-pagination>
						</div>
					</div>
				</div>
			</div>
		</div>
		<!-- 商品code和链接详情弹框 -->
		<el-dialog class="pop" title="查看商品CODE和详情链接" :visible.sync="dialogVisible" @close="dialogVisible = false">
    		<div>
    			<label class="col-md-3">商品code：</label>	
    			<span class="col-md-9">{{codeLinkObj.code}}</span>	
    		</div>
    		<div>
    			<label class="col-md-3">商品详情链接：</label>	
    			<span class="col-md-9">{{codeLinkObj.link}}</span>	
    		</div>
		</el-dialog>
	</div>
</template>
<script>
	import breadcrumb from '@/components/tool/breadcrumb' //面包屑

	export default {
		name: 'goods',
		components: {
			'v-breadcrumb': breadcrumb
		},
		data() {
			return {
				total: null,//总数
				currentPage: 1,//当前页数
				prodCate: 1,//普通积分商品
				goodsName: null,  //商品名称查询条件
				goodsState: 2,//商品状态(0.销售中 1.下架   -  无传参就是全部)
				proClass: null, //商品分类查询条件
				oneSelected: 'info',//一级分类值
				oneStorage: '',//一级分类值存储
				oneClassify: [], //一级分类数组查询条件
				twoSelected: 'info',//二级分类值
				twoClassify: [], //二级分类数组查询条件
				delCodeArrays: [],//批量删除勾选数组
				delCodeString: '',//批量删除勾选数组
				classifyDemo: [],//分类数据
				goodsRecord:[],//模拟分页加载已同步商品数据
				codeLinkList: null,//商品code和链接数组
				codeLinkObj: {},//商品code和链接对象
				dialogVisible: false
			}
		},
		mounted() {
			this.$nextTick(function() {
				this.getGoodsRecord();
				this.getOneClassify();
				this.getProCodeLink();
			});
		},
		methods: {
			//获取所有已同步商品
			getGoodsRecord: function() {
				var params = {
					token: this.token,
					//参数(必填)
					currentPage: this.currentPage,
					pageSize: this.pageSize,
					prodCate: this.prodCate
				}
		  		var that = this;
				var reqUrl = this.baseUrl + '/productInfo/getProducts';
				
				//商品标题
				if(that.goodsName){
					params.proTitle = that.goodsName; 
				}
				//商品状态
				if(that.goodsState && that.goodsState != 2){
					params.proSale = that.goodsState;
				}
				//商品类别
				if(that.proClass){
					params.proClass = that.proClass;
				}
//				console.log({params:params});
				this.$http.get(reqUrl, {params: params}).then(function(res) {
					if(!res) {
						return;
					}
//					console.log(res);
					that.total = res.synProductCount;
					that.goodsRecord = res.synProductList;
	 			});
			},
			//分页
	    	handlePaging: function(_currentPage) {
	    		this.currentPage = _currentPage;
				this.getGoodsRecord();
	    	},
			//获取一级商品类别
			getOneClassify: function() {
		  		var that = this;
				var reqUrl = this.baseUrl + '/productInfo/getProTypeOptions';
				var params = {
					token: this.token,
					lv: "1"
				}
				this.$http.get(reqUrl, {params: params}).then(function(res) {
					if(!res) {
						return;
					}
					that.oneClassify = res.typeOptions;
	 			});
			},
			//获取二级商品类别
			getTwoClassify: function() {
				if(this.oneSelected != 'info'){
					this.twoClassify=[];
					this.twoSelected="info";
					this.oneStorage = this.oneClassify[this.oneSelected].productTypeCode;
					var num = this.oneClassify[this.oneSelected].classId;
					
		  			var that = this;
					var reqUrl = this.baseUrl + '/productInfo/getSecondLvProTypes';
					var params = {
						token: this.token,
						typeCode: num
					}
					this.$http.get(reqUrl, {params: params}).then(function(res) {
						if(!res) {
							return;
						}
						that.twoClassify = res.types;
		 			});
				}else{
					this.oneStorage = null;
					this.twoClassify=[];
					this.twoSelected="info";
				}
			},
			//模糊搜索
			classifyQuery: function() {
				if(this.oneStorage){
	    			this.proClass = this.oneStorage;
	    			if(this.oneStorage && this.twoSelected != "info"){
	    				this.proClass = this.twoSelected;
	    			}
	    		}else{
	    			this.proClass = null;
	    		}
				//重新获取数据
				this.currentPage = 1;
				this.getGoodsRecord();
			},
			//商品添加链接
			handleGoodsAdd: function() {
		  		this.$router.push('/operateGoods')
			},
			//商品修改链接
			handleGoodsModify: function(_id) {
				this.$router.push({path:'/modifyGoods',query:{id:_id}});
			},
			//商品删除
			handleGoodsDel: function(_code) {
				this.$confirm('确定删除商品?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					//单个删除
					var that = this;
					var reqUrl = this.baseUrl + '/productBusi/delProduct';
					var params = {
						token: that.token,
						//参数(必填)
						proCode: _code,
					}
				
					this.$http.post(reqUrl, params).then(function(res) {
						if(!res) {
							return;
						}
//						console.log(res);
						that.$message({
				          	message: '恭喜你，删除成功！',
				          	type: 'success'
	        			});
	        			//重新加载数据
						that.getGoodsRecord();
		 			});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			//商品勾选
			handleGoodsLotDel: function(_selection) {
				this.delCodeArrays = [];
				for(var i = 0;i<_selection.length;i++){
					this.delCodeArrays.push(_selection[i].proCode);
				}
				this.delCodeString = this.delCodeArrays.join(',');
			},
			//商品勾选批量删除
			lotDelBtn: function() {
				if(this.delCodeArrays.length < 1){
					this.$message({
			          	message: '请先勾选需要删除的行！',
			          	type: 'warning'
			        });
			        return false;
				}
				
				this.$confirm('此操作将删除勾选文件, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					//批量删除
					var that = this;
					var reqUrl = this.baseUrl + '/productBusi/batchDelProducts';
					var params = {
						token: that.token,
						//参数(必填)
						productCodeArrays: that.delCodeString,
					}
					
					this.$http.post(reqUrl, params).then(function(res) {
						if(!res) {
							return;
						}
						that.$message({
							type: 'success',
							message: '删除成功!'
						});
						//重新加载数据
						that.getGoodsRecord();
		 			});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			//获取所有商品CODE和详情链接
			getProCodeLink: function() {
				var that = this;
				var reqUrl = this.baseUrl + '/productInfo/searchSeapros';
				var params = {};
				this.$http.get(reqUrl, {params: params})
				.then(function(res) {
					if(!res) {
						return;
					}
					that.codeLinkList = res.prolist;
//					localStorage.setItem('_codeLinkList', JSON.stringify(codeLinkList));
	 			});
			},
			//查看单个商品CODE和详情链接
			handleLook: function(proCode) {
				for(var i = 0;i < this.codeLinkList.length;i++) {
					var obj = this.codeLinkList[i];
					if(obj.code == proCode) {
						this.codeLinkObj = obj;
					}
				}
				this.dialogVisible = true;
			},
		}
	}
</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style scoped>
	.operate  {
		margin-bottom: 10px;
	}
	.operate > *  {
		margin-bottom: 10px;
	}
	.goods-img {
		width: 100px;
		height: 50px;
	}
	.pop div {
		height: 50px;
	}
	.pop label {
		/*height: 50px;*/
		text-align: right;
	}
</style>