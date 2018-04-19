<!-- 优惠券管理 - 优惠券商品 -->
<template>
	<div class="couponGoods">
		<v-breadcrumb firstMenu="优惠券管理" secondMenu="体验券商品"></v-breadcrumb>
    	<div class="nav row">
    		<div class="col-md-12">
    			<div class="portlet box red">
    				<div class="portlet-title">
						<div class="caption">体验券商品</div>
					</div>
					<div class="portlet-body">
						<div class="operate">
							<div class="form-item">
								<span>商品名称：</span>
                                <div class="input-medium input-inline">
                                    <el-input placeholder="请输入商品名称" v-model="inquire.goodsName" clearable> </el-input>
                                </div>
                                <button type="button" class="btn btn-primary" @click="queryList" style="margin-left: 30px;">查询</button>
                            </div>
						</div>
						<div class="operate">
							<button type="button" class="btn btn-success" @click="handleAc">添加</button> 
						</div>
						<div class="table-scrollable">
							<el-table :data="tableData" >
								<el-table-column prop="orders" label="排序" width="50"> </el-table-column>
							    <el-table-column prop="goodsName" label="普通商品名称"> </el-table-column>
							    <el-table-column prop="goodId" label="商品ID"> </el-table-column>
							    <el-table-column prop="goodsPrice" label="普通价格（元）"> </el-table-column>
							    <el-table-column prop="maxGoodName" label="升级商品名称"> </el-table-column>
							    <el-table-column prop="maxUpgradeId" label="升级商品ID"> </el-table-column>
							    <el-table-column prop="upgradePrice" label="升级价格（元）"> </el-table-column>
							    <el-table-column prop="status" label="状态">
							    	<template slot-scope="scope">
							    		<span v-if="scope.row.status == '0'">已下架</span>
							    		<span v-if="scope.row.status == '1'">已上架</span>
							    	</template>
							    </el-table-column>
							    <el-table-column prop="" label="操作">
							    	<template slot-scope="scope">
							    		<span class="btn default btn-xs purple" @click="handleAc(scope.row)">编辑</span>
							    		<span class="btn default btn-xs red" @click="handleRemove(scope.row)">删除</span>
							    	</template>
							    </el-table-column>
							</el-table>
							 <el-pagination layout="prev, pager, next" v-if="total > pageSize"
			    			:page-size="pageSize" :current-page="pageNum" :total="total"
							 v-on:current-change="handlePaging"></el-pagination>
						</div>
					</div>
    			</div>
    		</div>
    	</div>
	</div>
</template>

<script type="text/ecmascript-6">
	import breadcrumb from '@/components/tool/breadcrumb' //面包屑
	
	export default {
		name:'couponGoods',
		components: {
       		'v-breadcrumb': breadcrumb
    	},
    	data() {
    		return {
    			inquire:{'goodsName': ''},//查询条件
    			tableData:[],//列表数据
	            total: 0,//列表总数
	        	pageNum:1,//当前页数
    		}
    	},
    	created() {
    		this.getList();
	    },
    	methods:{
    		//分页
	        handlePaging(pageNum) {
	    		this.pageNum = pageNum;
	    		this.getList();
	    	},
    		//查询按钮
    		queryList() {
    			this.pageNum = 1;
    			this.getList();
    		},
    		//获取列表
    		getList() {
				var reqUrl = this.baseUrl + '/product/findProducts',
					that = this,
					params = {
						pageNum: this.pageNum,
						pageSize: this.pageSize,
						goodsType: 3 //类型（1：促销专区2：增值专区3：体验商品）
					};
				if(this.inquire.goodsName != '') {
					params.goodsName = this.inquire.goodsName;
				}
				this.$http.get(reqUrl, {params: params}).then(function(res) {
					if(!res) {
						return;
					}
					that.total = res.total;
					that.tableData = res.productList;
				})
    		},
    		//添加
    		handleAc(item) {
    			var query = {};
    			if(item.id != null) {
    				query = {mainId: item.id};
    			} else {
    				query = {};
    			}
    			this.$router.push({
	                path: '/couponDetails',
	                query: query
	            });
    		},
    		//删除
    		handleRemove(item) {
    			var that = this;
	    		this.$confirm('确定删除?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(function() {
					var params = { id: item.id },
			  			reqUrl = that.baseUrl + '/product/deleteProduct';
					that.$http.post(reqUrl, params).then(function(res) {
						if(!res) { return; }
						that.$message('删除成功');
						that.getList();
		 			});    	
				}, function() {})
    		}
    	}
	}
</script>

<style scoped>
	
</style>