<!-- 商品同步 -->
<template>
    <div class="synchroGoods">
    	<v-breadcrumb firstMenu="商品" secondMenu="商品同步列表"></v-breadcrumb>
    	<div class="nav row">
    		<div class="col-md-12">
    			<div class="portlet box red">
					<div class="portlet-title">
						<div class="caption">商品同步列表</div>
					</div>
					<div class="portlet-body">
						<div class="operate">
							<span>选择商品状态：</span>
							<select class="form-control input-small input-inline" v-model="proSale">
								<option value="2">全部</option>
								<option value="0">销售中</option>
								<option value="1">下架</option>
							</select>
							
							<span>选择分类：</span>
							<select class="form-control input-small input-inline" v-model="oneSelected" @change="oneLever(oneSelected)">
								<option value="info">请选择一级分类</option>
								<option v-for="item,index in oneClassify" :key="index" :value="item.ClassId">{{ item.ClassName }}</option>
							</select>
							<select class="form-control input-small input-inline" v-model="twoSelected">
								<option v-if="twoClassify.length == 0" value="info">暂无</option>
								<option value="info">请选择二级分类</option>
								<option v-for="item, index in twoClassify" v-if="currentClass == item.Class_N_Id" :key="index" :value="item.ClassId">{{ item.ClassName }}</option>
							</select>
							
							<template>
								<div class="block" style="display: inline-block;">
									<span class="demonstration">选择时间范围：</span>
									<el-date-picker v-model="timeVal" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" @change="datePicker"></el-date-picker>
								</div>
							</template>
							
							<button type="button" class="btn btn-success" @click="classifyQuery">查询</button>
						</div>
						<div class="table-scrollable">
							<el-table :data="goodsAll"  @selection-change="handleSelection">
							    <el-table-column prop="ProTitle" label="商品名称" width="400"> </el-table-column>
							    <el-table-column label="图片" width="150">
							    	<template slot-scope="scope">
							    		<img :src="scope.row.ProSimg" class="goods-img" />
							    	</template>
							    </el-table-column>
							    <el-table-column prop="ProSale" label="商品状态">
							    	<template slot-scope="scope">
							    		<span>{{ handleState(scope.row.ProSale) }} </span>
							    	</template>
							    </el-table-column>
							    <el-table-column prop="ProTagPrice" label="市场价"> </el-table-column>
							    <el-table-column prop="ProFxPrice" label="分销价"> </el-table-column>
							    <el-table-column prop="ProRetPrice" label="网店销售价"> </el-table-column>
							    <el-table-column prop="ProAddTime" label="创建时间" width="200"> </el-table-column>
							    <el-table-column prop="" label="操作" width="150">
							    	<template slot-scope="scope">
							    		<span class="btn default btn-xs purple" v-if="scope.row.isSynchronized == 2"  @click="handleAloneSynchro(scope.row.ProNo)">同步 </span>
							    		<span class="btn btn-xs btn-primary" v-else  @click="handleUpload(scope.row.ProNo)">更新 </span>
							    	</template>
							    </el-table-column>
						    </el-table>
						</div>
						<el-pagination layout="prev, pager, next" v-if="goodsNum > pageSize"
		    			:page-size="pageSize" :current-page="currentPage" :total="goodsNum"
						 v-on:current-change="handlePaging"></el-pagination>
					</div>
    			</div>
    		</div>
    	</div>
    	
    	<!-- 同步商品弹框 -->
    	<el-dialog  title="提示" :visible.sync="dialogVisible" width="25%" @close="handleClose">
    		<div class="ta-center">
    			<span>是否同步商品？</span>	
    			<select v-model="prodCate">
    				<option value="1">普通商品</option>
    				<option value="2">促销专区</option>
    				<option value="3">增值专区</option>
    			</select>
    		</div>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="handleSynchro">确 定</el-button>
			    <el-button @click="handleClose">取 消</el-button>
			</span>
		</el-dialog>
    </div>
</template>
<script>
import breadcrumb from '@/components/tool/breadcrumb'	//面包屑
	
export default {
    name: 'synchroGoods',
    components: {
    	'v-breadcrumb': breadcrumb
	},
    data() {
        return {
        	currentPage: 1, //当前页数
        	currentClass: 0,
        	oneSelected: 'info',//一级分类默认值
        	oneClassify:[],//一级分类数组
        	twoSelected: 'info',//二级分类默认值
        	twoClassify:[],//一级分类数组
        	
        	proClassCode: null,//商品类别
        	proSale: 2,//商品状态(0.销售中 1.下架 2.全部(默认))
        	timeVal: '', //time对象
        	startTime: null,//商品添加时间
        	endTime: null,//商品结束时间
        	
        	batchSynchro:[],//批量同步数组
        	classifyDemo:[],//所有分类
        	
	        //* 查询WQB商品记录
	        goodsNum: 0,//商品总数
	        goodsAll: [],//商品数量总和
	        downList: [],
	        dialogVisible: false,
	        proNo: '',//同步的商品货号
	        prodCate: 1,//同步商品的类型
        }
    },
    mounted() {
        this.$nextTick(function() {
        	this.getClassify();
        	this.getAllGoods();
        });
    },
    methods: {
    	//获取所有商品
    	getAllGoods: function () {
    		var params = {
				token: this.token,
				pageIndex: this.currentPage,
				pageSize: this.	pageSize
			}
	  		var that = this;
			var reqUrl = this.baseUrl + '/product/products';
			//查询条件
			//商品分类
			if(that.proClassCode && that.proClassCode != "info" && that.twoSelected == "info"){
				params.proClassCode = that.proClassCode;
			}
			if(that.proClassCode && that.twoSelected != "info"){
				params.proClassCode = that.twoSelected;
			}
			//商品状态
			if(that.proSale){
				params.proSale = that.proSale;
			}
//			商品时间
			if(that.startTime && that.endTime){
				params.startTime = that.startTime;
				params.endTime = that.endTime;
			}
			this.$http.get(reqUrl, {params:params}).then(function(res) {
				if(!res) {
					return;
				}
				that.goodsNum = parseInt(res.SumNum);
				that.goodsAll = res.Result;
   			});
    	},
    	//分页
    	handlePaging: function(currentPage) {
    		this.currentPage = currentPage;
			this.getAllGoods();
    	},
    	//商品状态
    	handleState: function(_val) {
    		if(_val == 0) {
    			return "销售中";
    		}
    		if(_val == 1) {
    			return "下架";
    		}
    		if(_val == 2) {
    			return "全部";
    		}
    	},
    	//获取所有商品类别 
    	getClassify: function() {
    		var that = this;
			var reqUrl = this.baseUrl + '/productType/getTypes';
			var params = {
				token: that.token,
			}
			this.$http.get(reqUrl, {params:params}).then(function(res) {
				if(!res) {
					return;
				}
				that.classifyDemo = res.Result;
				that.setClassify(res.Result);
   			});
    	},
    	//生成分类
    	setClassify: function(_arr){
			var oneArr = [];
			var twoArr = [];
			for(var i = 0;i<_arr.length;i++){
				if(_arr[i].Class_N == 1 && _arr[i].ClassId == _arr[i].Class_N_Id){
					oneArr.push(_arr[i]);
				}
				if(_arr[i].Class_N == 2){
					twoArr.push(_arr[i]);
				}
			}
			this.oneClassify = oneArr;
			this.twoClassify = twoArr;
    	},
    	//二级分类联动
    	oneLever: function(_val) {
    		this.currentClass = _val;
    		this.twoSelected = 'info';
    	},
    	//日期选择器
    	datePicker: function() {
    		if(this.timeVal){
    			this.startTime = this.timeVal[0];
    			this.endTime = this.timeVal[1];
    		}else{
    			this.startTime = null;
    			this.endTime = null;
    		}
    	},
    	//分类查询
    	classifyQuery: function() {
    		if(this.oneSelected != "info"){
    			this.proClassCode = this.oneSelected;
    			if(this.oneSelected && this.twoSelected != "info"){
    				this.proClassCode == this.twoSelected;
    			}
    		}else{
    			this.proClassCode = null;
    		}
    		//重新获取数据
    		this.currentPage = 1;
			this.getAllGoods(); 
    	},
    	//批量选中的ProNo值
    	handleSelection: function(val) {
    		var proNoArr = [];
    		if(val.length > 0){
    			for(var i = 0;i<val.length;i++){
    				proNoArr.push(val[i].ProNo);
    			}
    			this.batchSynchro = proNoArr;
    		}
    	},
    	//商品同步单独
    	handleAloneSynchro: function(_parame) {
    		this.proNo = _parame;
    		this.prodCate = '1';
    		this.handleSynchro();
    		/*this.dialogVisible = true;*/
    	},
    	//执行商品同步
    	handleSynchro(_parame) {
    		var that = this;
			var reqUrl = this.baseUrl + '/productBusi/synchronizeProducts';
			var params = {
				token: that.token,
				//文档参数 (必选)
				proNo: this.proNo,
				prodCate: this.prodCate
			}
			this.$http.post(reqUrl, params).then(function(res) {
				if(!res) {
					return;
				}
				that.dialogVisible = false;
				that.$message({
		          	message: res.synProSKUTip,
		          	type: 'success'
		        });
		        //重新获取所有数据
   				that.getAllGoods();
   			});
    	},
    	//商品更新单独
    	handleUpload: function(_parame) {
			this.$confirm('是否确定更新？', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
				center: true
			}).then(() => {
				var that = this;
				var reqUrl = this.baseUrl +'/productBusi/updSynWQBProduct';
				var params = {
					token: that.token,
					//文档参数 (必选)
					proNo: _parame
				}
				this.$http.post(reqUrl, params).then(function(res) {
					if(!res) {
						return;
					}
					if(res.mfSyn == 0){
				        that.$message({
				          	message: '暂无需更新',
				          	type: 'warning'
				        });
				        return;
					}
					if(res.mfSyn == 1){
						that.$message({
				          	message: '更新成功',
				          	type: 'success'
				        });
					}
					if(res.mfSyn == 2){
				        that.$message.error('更新同步失败');
					}
	   				that.getAllGoods();
	   			});
			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消更新'
				});
			});
    	},
    	//关闭弹框
    	handleClose() {
    		this.dialogVisible = false;
    	}
    }
}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style>
	.operate  {
		margin-bottom: 10px;
	}
	.operate > *  {
        vertical-align: middle;
	}
    .operate .el-range-editor * {
        line-height: 1;
    }
	.operate > button {
		margin-bottom: 0;
	}
	.goods-img  {
		width: 100px;
		height: 50px;
	}
	.ta-center {
		text-align: center;
	}
</style>
