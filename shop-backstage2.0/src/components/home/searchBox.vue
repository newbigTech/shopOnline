<!-- 搜索框 -->
<template>
    <div class="searchBox">
    	<v-breadcrumb firstMenu="首页" secondMenu="搜索框"></v-breadcrumb>
    	<div class="nav row">
    		<div class="col-md-12">
    			<div class="portlet box red">
					<div class="portlet-title">
						<div class="caption">搜索框推荐列表</div>
					</div>
					<div class="portlet-body">
						<div class="operate">
							<button type="button" class="btn btn-primary" @click="handleSearchBox">添加</button>
							<button type="button" class="btn btn-danger" @click="handleRemove">批量删除</button>
						</div>
						<div class="table-scrollable">
							<el-table :data="tableData"  @selection-change="handleSelection">
							    <el-table-column type="selection" prop="" width="50"></el-table-column>
							    <el-table-column prop="searchName" label="名称"> </el-table-column>
							    <el-table-column prop="createTime" label="创建时间"> </el-table-column>
							    <el-table-column prop="realName" label="创建人"> </el-table-column>
							    <el-table-column prop="isView" label="是否显示">
							    	<template slot-scope="scope">
							    		<span v-if="scope.row.isShow == 1">显示 </span>
										<span v-if="scope.row.isShow == 0">不显示 </span>
							    	</template>
							    </el-table-column>
							    <el-table-column prop="" label="操作" width="200">
							    	<template slot-scope="scope">
							    		<span class="btn default btn-xs purple"  @click="handleSearchBox(scope.row)">修改 </span>
										<span class="btn default btn-xs red" @click="handleRemove(scope.row)">删除</span>
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
    	<!-- 弹框 -->
    	<el-dialog title="" :visible.sync="dialogVisible" width="50%" @close="handleCancle">
		  	<div class="dialog-title">{{dialogTitle}}</div>
		  	<div class="dialog-con">
		  		<div class="dialog-item">
		  			<div class="col-md-4 ta-right">关键词名称：</div>
		  			<div class="col-md-7"><input type="text" v-model="searchBoxObj.searchName" /></div>
		  		</div>
		  		<div class="dialog-item">
		  			<div class="col-md-4 ta-right">排序：</div>
		  			<div class="col-md-7"><input type="text" class="input-small" v-model="searchBoxObj.sort" /></div>
		  		</div>
		  		<div class="dialog-item">
		  			<div class="col-md-4 ta-right">是否显示：</div>
		  			<div class="col-md-7">
		  				<el-radio-group v-model="searchBoxObj.isShow">
						    <el-radio label="1">显示</el-radio>
						    <el-radio label="0">不显示</el-radio>
						</el-radio-group>
					</div>
		  		</div>
		  	</div>
		  	<div class="dialog-btm ta-center">
		  		<button type="button" class="btn btn-primary" @click="handleSave">保存</button>
				<button type="button" class="btn btn-default" @click="handleCancle">取消</button>
		  	</div>
		</el-dialog>
    </div>
</template>
<script>
import breadcrumb from '@/components/tool/breadcrumb'	//面包屑	

export default {
    name: 'searchBox',
    components: {
    	'v-breadcrumb': breadcrumb
	},
    data() {
        return {
        	tableData: [],
        	dialogVisible: false,
        	searchBoxObj: {'searchName': '', 'sort': 1, 'isShow': '1', 'createBy': ''},
//      	isView: '显示',
        	dialogTitle: '添加',
        	currentPage: 1,//当前页
        	total: 0,//总共条数
        	searchIds: [],
        	searchIdsLen: 0
        }
    },
    mounted() {
        this.$nextTick(function() {
        	this.getList();
        });
    },
    methods: {
    	handleSelection: function(val) {
    		var arr = [];
    		for(var i = 0;i < val.length;i++) {
    			arr.push(val[i].searchId);
    		}
    		this.searchIds = arr;
    		this.searchIdsLen = val.length;
    	},
    	getList: function() {
    		var that = this;
			var reqUrl = this.baseUrl + '/search/findSearchBox';
			var params = {
				pageSize: this.pageSize,
				pageNum: this.currentPage
			}
			this.$http.get(reqUrl, {params: params})
			.then(function(res) {
				if(!res) {
					return;
				}
				that.tableData = res.searchBoxList;
				for(var i = 0;i < that.tableData.length;i++) {
					var ct = that.tableData[i].createTime;
					that.tableData[i].createTime = that.formatDate(new Date(parseInt(ct)), 'time');
				}
				that.total = res.total;
 			});
    	},
    	//分页
    	handlePaging: function(currentPage) {
    		this.currentPage = currentPage;
    		this.getList();
    	},
    	//管理搜索框
    	handleSearchBox: function(item) {
    		if(item.searchId != null) {
    			this.dialogTitle = '修改'
    			this.searchBoxObj.searchName = item.searchName;
    			this.searchBoxObj.sort = item.sort;
    			this.searchBoxObj.isShow = item.isShow.toString();
    			this.searchBoxObj.searchId = item.searchId;
    		} else {
    			this.dialogTitle = '添加';
    		}
    		this.dialogVisible = true;
    	},
    	//保存搜索框信息
    	handleSave: function() {
    		if(this.searchBoxObj.searchName == '') {
    			this.$message('关键词名称不能为空');
				return;
    		}
    		if(this.searchBoxObj.sort == '') {
    			this.$message('排序不能为空');
				return;
    		}
    		var that = this;
    		var reqUrl;
    		if(this.dialogTitle == '修改') {
    			reqUrl = this.baseUrl + '/search/updateSearchBox';
    		} else {
    			reqUrl = this.baseUrl + '/search/addSearchBox';
    			this.searchBoxObj.isShow =  this.searchBoxObj.isShow;//parseInt(this.searchBoxObj.isShow);
    		}
			this.searchBoxObj.createBy =  this.userInfo.userId;
			
			this.$http.post(reqUrl, this.searchBoxObj)
			.then(function(res) {
				if(!res) {
					return;
				}
				that.$message('保存成功');
				that.dialogVisible = false;
				that.searchBoxObj = {'searchName': '', 'sort': 1, 'isShow': '1', 'createBy': ''};
				that.getList();
 			});
    	},
    	//取消
    	handleCancle: function() {
    		this.searchBoxObj = {'searchName': '', 'sort': 1, 'isShow': '1', 'createBy': ''};
    		this.dialogVisible = false;
    	},
    	//删除
    	handleRemove: function(item) {
    		if(item.searchId == undefined && this.searchIdsLen == 0) {
    			this.$message('请选择删除项');
				return;
    		}
    		var that = this;
			this.$confirm('确认删除吗').then(function() {
				if(item.searchId != undefined) { //单个删除
					that.searchIds = [item.searchId];
					that.searchIdsLen = 1;
				} 
				var reqUrl = that.baseUrl + '/search/deleteSearchBox';
				var params = {
					searchIds: that.searchIds
				}
				that.$http.post(reqUrl, params)
				.then(function(res) {
					if(!res) {
						return;
					}
					if(res.result != 'success') {
						that.$message('删除失败');
						return;
					}
					that.$message('删除成功');
					that.total = that.total - that.searchIdsLen;
					var maxPage = Math.ceil(that.total / that.pageSize);
					if(that.total <= (that.currentPage * that.pageSize) && that.currentPage > maxPage && that.currentPage > 1) {
						that.currentPage--;
					}
					that.getList();
	 			});
				
			})
    		
    	}
    }
}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style scoped>
@import url("./css/dialog.css");
</style>
