<!-- 商城公告 -->
<template>
    <div class="notice">
    	<v-breadcrumb firstMenu="消息" secondMenu="商城公告"></v-breadcrumb>
    	<div class="nav row">
    		<div class="col-md-12">
    			<div class="portlet box red">
					<div class="portlet-title">
						<div class="caption">商城公告列表</div>
					</div>
					<div class="portlet-body">
						<div class="operate">
							<button type="button" class="btn btn-primary" @click="handleAc">添加</button>
							<button type="button" class="btn btn-danger" @click="handleDc">批量删除</button>
						</div>
						<div class="table-scrollable">
							<el-table :data="tableData"  @selection-change="handleSelection">
								<el-table-column type="selection" prop="" width="50"></el-table-column>
							    <el-table-column prop="noteTitle" label="标题"> </el-table-column>
							    <el-table-column prop="noteContent" label="内容"> </el-table-column>
							    <el-table-column prop="" label="操作" width="200">
							    	<template slot-scope="scope">
							    		<span class="btn default btn-xs purple"  @click="handleAc(scope.row)">编辑 </span>
										<span class="btn default btn-xs red" @click="handleRemove(scope.row)">删除</span>
							    	</template>
							    </el-table-column>
						    </el-table>
						    <el-pagination layout="prev, pager, next" v-if="total>pageSize"
			    			:page-size="pageSize" :current-page="currentPage"  :total="total" 							v-on:current-change="handlePaging"></el-pagination>
						</div>
					</div>
    			</div>
    		</div>
    	</div>
		<!-- 弹框 -->
    	<el-dialog title="" :visible.sync="dialogVisible">
		  	<div class="dialog-title">{{dialogTitle}}</div>
		  	<div class="dialog-con">
		  		<div class="dialog-item">
		  			<div class="col-md-4 ta-right">请输入标题：</div>
		  			<div class="col-md-8"><input type="text" v-model="noticeTitle"/></div>
		  		</div>
		  		<div class="dialog-item">
		  			<div class="col-md-4 ta-right">请输入内容：</div>
		  			<div class="col-md-8">
		  				<textarea class="textarea-box" v-model="noticeCont"></textarea>
		  			</div>
		  		</div>
		  	</div>
		  	<div class="dialog-btm ta-center">
		  		<el-button type="primary" @click="addOrEditSysNotice()" >确 定</el-button>
				<el-button @click="dialogVisible = false">取 消</el-button>
		  	</div>
		</el-dialog>
    </div>
</template>
<script>
import breadcrumb from '@/components/tool/breadcrumb'	//面包屑
	
export default {
    name: 'notice',
    components: {
    	'v-breadcrumb': breadcrumb
	},
    data() {
        return {
        	tableData: [],
        	dialogVisible: false,
        	isView: '显示',
        	dialogTitle: '',
        	shape: '1',
        	total: null,//总数
        	currentPage:1,//当前页数
        	multipleSelection:[],//勾选
        	noticeTitle:'',//弹框商城公告标题
        	noticeCont:'',//弹框商城公告内容
        	noticeId:'',//弹框商城公告ID
        }
    },
    mounted() {
        this.$nextTick(function() {
        	this.getSysNotice();
        });
    },
    methods: {
    	//select
    	handleSelection: function(val) {
    		var arr = [];
    		for(var i = 0;i<val.length;i++){
    			arr.push(val[i].noteId);
    		}
    		this.multipleSelection = arr;
    	},
    	//分页
    	handlePaging: function(_currentPage) {
    		this.currentPage = _currentPage;
			this.getSysNotice();
    	},
    	//添加和修改
    	handleAc: function(item) {
    		if(item.noteId != null) {
    			this.dialogTitle = '编辑',
    			this.noticeId = item.noteId
    		} else {
    			this.dialogTitle = '添加'
    		}
    		this.noticeTitle = item.noteTitle;
    		this.noticeCont = item.noteContent;
    		this.dialogVisible = true;
    		
    	},
    	//批量删除
    	handleDc: function(){
    		if(this.multipleSelection.length == 0){
    			this.$message({
		          	message: '请勾选需要删除的内容！',
		          	showClose: true,
		          	type: 'warning'
    			});
	        	return		
    		};
    		this.$confirm('确定删除?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					var that = this;
					var reqUrl = this.baseUrl + '/sysNotice/deleteSysNotice';
					var params = {
						token: that.token,
						//参数(必填)
						noteIds: that.multipleSelection
					}
					this.$http.post(reqUrl, params).then((res) => {
						if(!res) {
							return;
						}
						that.$message({
				          	message: '恭喜你，删除成功！',
				          	type: 'success'
	        			});
	        			//重新加载数据
						that.getSysNotice();
					});
				})
    	},
    	handlePictureCardPreview: function() {
    		
    	},
    	//删除
    	handleRemove: function(item) {
    		this.$confirm('确定删除?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					var that = this;
					var reqUrl = this.baseUrl + '/sysNotice/deleteSysNotice';
					var params = {
						token: that.token,
						//参数(必填)
						noteIds: item.noteId
					}
					this.$http.post(reqUrl, params).then((res) => {
						if(!res) {
							return;
						}
						that.$message({
				          	message: '恭喜你，删除成功！',
				          	type: 'success'
	        			});
	        			//重新加载数据
						that.getSysNotice();
					});
				})
    	},
    	//获取商城公告
    	getSysNotice() {
    		var params = {
					token: this.token,
					//参数(必填)
					pageNum: this.currentPage,
					pageSize: this.pageSize//组件中 默认值是10
				}
    		
    		var that = this;
			var reqUrl = this.baseUrl + '/sysNotice/getSysNotice';
			this.$http.get(reqUrl, {params: params}).then(function(res) {
					if(!res) {
						return;
					}
					that.total=res.total;
					that.tableData=res.snList;					
			})
    	},
    	//判断是编辑还是增加
    	addOrEditSysNotice(){
    		if(this.dialogTitle.indexOf('添加') != -1){
    			this.addSysNotice();
    		}
    		else{
    			this.updateSysNotice();
    		}
    	},
    	//新增商城公告
    	addSysNotice() {
    		if(!this.noticeTitle){
    			this.$message('新增商城公告标题不能为空!');
    			return;
    		}
    		if(!this.noticeCont){
    			this.$message('新增商城公告内容不能为空!');
    			return;
    		}
    		
    			var that = this;
				var reqUrl = this.baseUrl + '/sysNotice/addSysNotice';
				var params = {
						token: that.token,
						//参数(必填)
						noteTitle: that.noticeTitle,
						noteContent: that.noticeCont
				}
				this.$http.post(reqUrl, params).then(function(res) {
						if(!res) {
							return;
						}
						that.$message({
				          message: '新增商城公告成功!',
				          type: 'success'
				        });	
				        that.dialogVisible = false;
				        that.getSysNotice();
				})
    		
    	},
    	//编辑商城公告
    	updateSysNotice(){
    		if(!this.noticeTitle){
    			this.$message('编辑商城公告标题不能为空!');
    			return;
    		}
    		if(!this.noticeCont){
    			this.$message('编辑商城公告内容不能为空!');
    			return;
    		}
    		var that = this;
			var reqUrl = this.baseUrl + '/sysNotice/updateSysNotice';
			var params = {
					token: that.token,
					//参数(必填)
					noteTitle: that.noticeTitle,
					noteContent: that.noticeCont,
					noteId:that.noticeId
			}
			this.$http.post(reqUrl, params).then(function(res) {
					if(!res) {
						return;
					}
					that.$message({
			          message: '编辑成功!',
			          type: 'success'
			        });	
			        that.dialogVisible = false;
			        that.getSysNotice();
			})
    	},
    }
}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style scoped>
@import url("../home/css/dialog.css");
.goods-img  {
	width: 100px;
	height: 50px;
}
.textarea-box {
	width: 100%;
	height: 300px;
	line-height: 25px;
	resize: none;
	border: 1px solid #ccc;
}
</style>

