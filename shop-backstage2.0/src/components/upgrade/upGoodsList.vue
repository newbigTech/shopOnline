<!-- 升级专区 - 升级商品列表 -->
<template>
    <div class="upGoodsList">
    	<v-breadcrumb firstMenu="升级专区" secondMenu="升级商品列表"></v-breadcrumb>
    	<div class="nav row">
    		<div class="col-md-12">
    			<div class="portlet box red">
    				<div class="portlet-title">
						<div class="caption">升级商品列表</div>
					</div>
					<div class="portlet-body">
						<div class="operate">
							<span>所属专区：</span>
							<el-select v-model="goodArea" placeholder="请选择" class="ml10">
							    <el-option key="1" label="促销专区" value="1"></el-option>
						     	<el-option key="2" label="增值专区" value="2"></el-option>
							</el-select>
							<span class="ml18">商品分类：</span>
							<el-select v-model="goodTypeId" placeholder="请选择" class="ml10" @change="typeChange">
							    <el-option v-for="item in options"
							      :key="item.classifyId" :label="item.classifyName" :value="item.classifyId">
							    </el-option>
							</el-select>
							<el-button type="primary" class="btn btn-success ml18" @click="getList">查询</el-button>
						</div>
						<div class="operate">
							<button type="button" class="btn btn-primary" @click="handleAc">添加升级商品</button> 
						</div>
						<div class="table-scrollable">
							<el-table :data="tableData" >
								<el-table-column prop="orders" label="排序"> </el-table-column>
							    <el-table-column prop="" label="普通商品名称">
							    	<template slot-scope="scope">
							    		<span @click="handleAc(scope.row)">{{scope.row.goodsName}}</span>
							    	</template>
							    </el-table-column>
							    <el-table-column prop="goodId" label="商品ID"> </el-table-column>
							    <el-table-column prop="goodsPrice" label="普通价格"> </el-table-column>
							    <el-table-column prop="maxGoodName" label="升级商品名称"> </el-table-column>
							    <el-table-column prop="maxUpgradeId" label="升级商品ID"> </el-table-column>
							    <el-table-column prop="upgradePrice" label="升级价格"> </el-table-column>
							    <el-table-column prop="maxOdds" label="概率"> </el-table-column>
							    <el-table-column prop="status" label="状态">
							    	<template slot-scope="scope">
							    		<span v-if="scope.row.status == 0">已下架</span>
							    		<span v-if="scope.row.status == 1">已上架</span>
							    	</template>
							    </el-table-column>
							    <el-table-column prop="" label="操作" width="200">
							    	<template slot-scope="scope">
							    		<span class="btn default btn-xs purple" @click="handleAc(scope.row)">修改 </span>
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
import breadcrumb from '@/components/tool/breadcrumb'	//面包屑	

export default {
    name: 'upGoodsList', // 结构名称
    data() {
        return {
            options:[],//分类的选项
        	total: 0,//总数
        	pageNum: 1,//当前页数
        	tableData: [],
        	goodTypeId: '',//分类的类型id
        	goodArea: '1',//1：促销专区2：增值专区
        }
    },
    components:{
    	'v-breadcrumb': breadcrumb
    },
    created() {
    },
    mounted() {
        this.$nextTick(function() {
            this.goodTypeId = parseInt(this.$route.query.goodTypeId);
            var goodArea = this.$route.query.goodArea;
            if(goodArea != undefined) {
            	this.goodArea = goodArea;
            }
            this.getList();
            this.getTypeList();
        });
    },
    methods: {
    	//获取升级商品分类
    	getTypeList() {
    		var params = {
				pageNum: this.pageNum,
				pageSize: this.maxPageSize
			}
	  		var that = this;
			var reqUrl = this.baseUrl + '/productCate/findProCatePage';
			this.$http.get(reqUrl, {params: params}).then(function(res) {
				if(!res) {
					return;
				}
				that.options = res.proCateList;
 			});
    	},
    	//查询升级商品
    	getList() {
			var params = {
				pageNum: this.pageNum,
				pageSize: this.pageSize,
				goodTypeId: parseInt(this.goodTypeId),
				goodsType: this.goodArea
			}
	  		var that = this,
	  			reqUrl = this.baseUrl + '/product/findProducts';
			this.$http.get(reqUrl, {params: params}).then(function(res) {
				if(!res) {
					return;
				}
				that.tableData = res.productList;
				that.total = res.total;
 			});    		
    	},
        //分页
        handlePaging(pageNum) {
    		this.pageNum = pageNum;
    		this.getList();
    	},
    	//添加或修改
    	handleAc(item) {
    		var query = {
    				goodsTypeId: this.goodTypeId,
    				goodArea: this.goodArea
    			},
    			path = '/classDetails';
    		if(item.id != undefined) {
    			query.mainId = item.id;
    		}
    		this.$router.push({
				path: path,
				query: query
			})
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
					if(!res) {
						return;
					}
					that.$message('删除成功');
					that.getList();
	 			});    	
			}, function() {})
    	},
    	//类型改变加载不同列表
    	typeChange() {
    		
    	}
    }

}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style scoped>
.ml18 {
	margin-left: 18px;
}
</style>
