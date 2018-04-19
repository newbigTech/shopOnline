<!-- 升级专区 - 分类列表 -->
<template>
    <div class="upClassList">
    	<v-breadcrumb firstMenu="升级专区" secondMenu="分类列表"></v-breadcrumb>
    	<div class="nav row">
    		<div class="col-md-12">
    			<div class="portlet box red">
    				<div class="portlet-title">
						<div class="caption">分类列表</div>
					</div>
					<div class="portlet-body">
						<!--<div class="operate operate-tabs">
							<button type="button" :class="['btn-tab '] + [showProm ? 'active' : '']" @click="handleTab">促销商品</button> 
							<button type="button" :class="['btn-tab '] + [showProm ? '' : 'active']" @click="handleTab">增值商品</button> 
						</div>-->
						<div class="operate">
							<button type="button" class="btn btn-primary" @click="handleAc">添加分类</button> 
						</div>
						<div class="table-scrollable">
							<el-table :data="tableData" >
								<el-table-column prop="classifyName" label="分类名称"> </el-table-column>
							    <el-table-column prop="sort" label="排序"> </el-table-column>
							    <el-table-column prop="createTime" label="创建时间"> </el-table-column>
							    <el-table-column prop="creater" label="创建人"> </el-table-column>
							    <el-table-column prop="isShow" label="是否显示"> </el-table-column>
							    <el-table-column prop="" label="操作" width="200">
							    	<template slot-scope="scope">
							    		<span class="btn default btn-xs purple" @click="handleAc(scope.row)">修改 </span>
										<span class="btn default btn-xs red" @click="handleRemove(scope.row.classifyId)">删除</span>
										<span class="btn default btn-xs green" @click="goDetails(scope.row)">详情 </span>
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
    	<!--弹框-->
    	<el-dialog  :title="dialogTitle" :visible.sync="dialogVisible" width="35%" @close="handleClose">
    		<div class="col-lg-pull-5">
    			<span>分类名称：</span>	
    			<input type="text" v-model="dialogObj.classifyName" class="form-control input-inline" placeholder="分类名称">	
    		</div>
    		<div class="col-lg-pull-5">
    			<span>排序：</span>	
    			<input type="number" min="1" v-model="dialogObj.sort" class="form-control input-inline" placeholder="排序" >			
    		</div>
    		<div class="col-lg-pull-5" v-if="viewIsShow">
    			<span>是否显示：</span>	
				<el-radio v-model="dialogObj.isShow" label="1">显示</el-radio>
 				<el-radio v-model="dialogObj.isShow" label="0">不显示</el-radio>
    		</div>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="addOrEdit">保 存</el-button>
			    <el-button @click="handleClose">取 消</el-button>
			</span>
		</el-dialog>
    </div>
</template>
<script>
import breadcrumb from '@/components/tool/breadcrumb'	//面包屑	
	
export default {
    name: 'upClassList', // 结构名称
    components: {
    	'v-breadcrumb': breadcrumb
	},
    data() {
        return {
            // 数据模型
            tableData:[],
            total: 0,//总数
        	pageNum: 1,//当前页数
        	dialogVisible:false,//弹框触发条件
        	dialogTitle: '修改',
        	dialogObj:{'isShow': '1'},//弹框的内容
        	viewIsShow: true,//是否显示‘isShow’选项
        	isShowList: [{'label': '1', 'value': '显示'},{'label': '0', 'value': '不显示'}],
        	showProm: true
        }
    },
    created() {
    },
    mounted() {
        this.$nextTick(function() {
        	this.getList();
        });
    },
    methods: {
    	//获取升级分类列表
    	getList() {
    		var params = {
				pageNum: this.pageNum,
				pageSize: this.pageSize
			}
	  		var that = this;
			var reqUrl = this.baseUrl + '/productCate/findProCatePage';
			this.$http.get(reqUrl, {params: params}).then(function(res) {
				if(!res) {
					return;
				}
				that.tableData = res.proCateList;
				that.total = res.total;
 			});
    	},
        //分页
        handlePaging(pageNum) {
    		this.pageNum = pageNum;
    		this.getList();
    	},
    	//添加或修改弹框
    	handleAc(item) {
    		this.dialogVisible = true;
    		if(!item.classifyId) {
    			this.viewIsShow = false;
    			this.dialogTitle = "添加分类";
    		} else {
    			this.viewIsShow = true;
    			this.dialogTitle = "修改分类";
//  			this.dialogObj = item;
    			this.dialogObj.classifyId = item.classifyId;
    			this.dialogObj.classifyName = item.classifyName;
    			this.dialogObj.sort = item.sort;
//  			//0:不显示 1:显示
//				console.log(item.isShow)
				if(item.isShow == '显示') {
					this.dialogObj.isShow = '1';
				} else {
					this.dialogObj.isShow = '0';
				}
//  			item.isShow == '显示' ? this.dialogObj.isShow = '1' : this.dialogObj.isShow = '0';
    		}
    		
    	},
    	fnC() {
    		console.log(this.dialogObj.isShow)
    	},
    	//弹框保存按钮
    	addOrEdit() {
    		var params = {
    			classifyName: this.dialogObj.classifyName,
    			sort: this.dialogObj.sort
    		}
			var that = this,reqUrl,msg;
			if(this.dialogTitle == '添加分类') {
				params.createCode = this.userInfo.userId;
				reqUrl = this.baseUrl + '/productCate/addProductCate';
    			msg = '添加成功';
    		} else {
    			params.classifyId = this.dialogObj.classifyId;
    			params.isShow = this.dialogObj.isShow;
    			reqUrl = this.baseUrl + '/productCate/updateProductCate';
    			msg = '修改成功';
    		}
			this.$http.post(reqUrl, params).then(function(res) {
				if(!res) {
					return;
				}
				that.dialogVisible = false;
				that.dialogObj = {'isShow': '1'};
				that.$message(msg);
				that.getList();
 			});
    	},
    	handleClose() {
    		this.dialogVisible = false;
			this.dialogObj = {'isShow': '1'};
    	},
    	//删除
    	handleRemove(classifyId) {
    		var that = this;
    		this.$confirm('确定删除?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(function() {
				var params = {
					token: that.token,
					classifyIds: classifyId,
				}
				var reqUrl = that.baseUrl + '/productCate/deleteProductCate';
				that.$http.post(reqUrl, params).then(function(res) {
					if(!res) {
						return;
					}
					that.$message('删除成功');
					that.getList();
	 			});
			}, function(){})
    	},
    	//查看详情
    	goDetails(item) {
    		this.$router.push({
    			path:'/upGoodsList',
    			query:{
    				goodTypeId: item.classifyId
    			}
    		})
    	},
    	handleTab() {
    		this.showProm = !this.showProm;
    	}
    }

}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style scoped>
@import url("../home/css/dialog.css");	
	
.operate {
	min-height: 30px;
	margin-bottom: 20px;
	clear: both;
}
.operate > input,
.operate > select {
	margin: 10px;
}
.col-lg-pull-5 {
	margin-bottom: 15px;
}
.col-lg-pull-5 > span {
	display: inline-block;
	width: 100px;
	text-align: right;
}
.operate.operate-tabs {
	border-bottom: 1px solid #ddd;
}
.btn-tab {
	height: 40px;
	line-height: 40px;
	background: #fff;
	border: none;
	margin-right: 20px;
	outline: none;
}
.btn-tab.active {
	color: #cb5a5e;
	border-bottom: 4px solid #cb5a5e;
}
</style>
