<!-- 系统管理 -->
<template>
	<div class="sysConfig">
		<v-breadcrumb firstMenu="其他" secondMenu="系统管理"></v-breadcrumb>
    	<div class="nav row">
    		<div class="col-md-12">
    			<div class="portlet box red">
					<div class="portlet-title">
						<div class="caption">系统管理</div>
					</div>
					<div class="portlet-body">
						<div class="operate">
							<button type="button" class="btn btn-primary" @click="callDialog">添加</button>
							<button type="button" class="btn btn-success" @click="refreshConfig()">刷新</button>
						</div>
						<div class="table-scrollable">
							<el-table :data="tableData" >
							    <el-table-column prop="configId" label="参数ID"> </el-table-column>
							    <el-table-column prop="paramName" label="参数名字"> </el-table-column>
							    <el-table-column prop="paramValue" label="参数值"> </el-table-column>
							    <el-table-column prop="paramType" label="参数类型"> </el-table-column>
							    <el-table-column prop="remarks" label="描述"> </el-table-column>
							    <el-table-column prop="paramState" label="参数状态">
							    	<template slot-scope="scope">
							    		<span v-if="scope.row.paramState == 1">有效</span>
										<span v-if="scope.row.paramState == 0">失效</span>
							    	</template>
							    </el-table-column>
							    <el-table-column prop="updateTime" label="更新时间"> </el-table-column>
							    <el-table-column prop="" label="操作" width="200">
							    	<template slot-scope="scope">
							    		<span class="btn default btn-xs green" @click="findConfigDetail(scope.row)">详情 </span>
							    		<span class="btn default btn-xs purple" @click="callDialog(scope.row)">修改 </span>
										<span class="btn default btn-xs red" @click="deleteConfig(scope.row)">删除</span>
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
    	<!-- 新增或者修改弹框 -->
    	<el-dialog title="" :visible.sync="dialogVisible" width="50%" >
		  	<div class="dialog-title">{{dialog.title}}</div>
		  	<div class="dialog-con">
		  		<div class="dialog-item" v-if="dialog.title !='添加'">
		  			<div class="col-md-4 ta-right">参数ID：</div>
		  			<div class="col-md-8">{{dialog.configId}}</div>
		  		</div>
		  		<div class="dialog-item">
		  			<div class="col-md-4 ta-right">参数名字：</div>
		  			<div class="col-md-8"><input type="text" v-model="dialog.paramName"/></div>
		  		</div>
		  		<div class="dialog-item">
		  			<div class="col-md-4 ta-right">参数值：</div>
		  			<div class="col-md-8"><input type="text"  v-model="dialog.paramValue"/></div>
		  		</div>
		  		<div class="dialog-item">
		  			<div class="col-md-4 ta-right">参数类型：</div>
		  			<div class="col-md-8"><input type="text" class="input-other" v-model="dialog.paramType"/></div>
		  		</div>
		  		<div class="dialog-item">
		  			<div class="col-md-4 ta-right">所属模块：</div>
		  			<div class="col-md-8"><input type="text" class="input-other" v-model="dialog.paramModule"/></div>
		  		</div>
		  		<div class="dialog-item">
		  			<div class="col-md-4 ta-right">参数状态：</div>
		  			<div class="col-md-8">
		  				<el-radio-group v-model="dialog.paramState">
						    <el-radio label="1">有效</el-radio>
						    <el-radio label="0">失效</el-radio>
						</el-radio-group>
					</div>
		  		</div>
		  		<div class="dialog-item">
		  			<div class="col-md-4 ta-right">拓展字段：</div>
		  			<div class="col-md-8"><input type="text" v-model="dialog.ext1"/></div>
		  		</div>
		  		<div class="dialog-item">
		  			<div class="col-md-4 ta-right">描述：</div>
		  			<div class="col-md-8">
		  				<textarea class="textarea-box" v-model="dialog.remarks"></textarea>
		  			</div>
		  		</div>
		  	</div>
		  	<div class="dialog-btm ta-center">
		  		<button type="button" class="btn btn-primary" @click="addOrUpdateConfig()">保存</button>
				<button type="button" class="btn btn-default" @click="dialogVisible = false">取消</button>
		  	</div>
		</el-dialog>
		<!-- 查看详情弹框 -->
    	<el-dialog title="" :visible.sync="dialogDetailsVisible" width="50%" >
		  	<div class="dialog-title">查看详情</div>
		  	<div class="dialog-con">
		  		<div class="dialog-item">
		  			<div class="col-md-4 ta-right">参数ID：</div>
		  			<div class="col-md-8">{{dialogDetails.configId}}</div>
		  		</div>
		  		<div class="dialog-item">
		  			<div class="col-md-4 ta-right">参数名字：</div>
		  			<div class="col-md-8">{{dialogDetails.paramName}}</div>
		  		</div>
		  		<div class="dialog-item">
		  			<div class="col-md-4 ta-right">参数值：</div>
		  			<div class="col-md-8">{{dialogDetails.paramValue}}</div>
		  		</div>
		  		<div class="dialog-item">
		  			<div class="col-md-4 ta-right">参数类型：</div>
		  			<div class="col-md-8">{{dialogDetails.paramType}}</div>
		  		</div>
		  		<div class="dialog-item">
		  			<div class="col-md-4 ta-right">所属模块：</div>
		  			<div class="col-md-8">{{dialogDetails.paramModule}}</div>
		  		</div>
		  		<div class="dialog-item">
		  			<div class="col-md-4 ta-right">参数状态：</div>
		  			<div class="col-md-8">
		  				{{dialogDetails.paramState}}
					</div>
		  		</div>
		  		<div class="dialog-item">
		  			<div class="col-md-4 ta-right">拓展字段：</div>
		  			<div class="col-md-8">{{dialogDetails.ext1}}</div>
		  		</div>
		  		<div class="dialog-item">
		  			<div class="col-md-4 ta-right">描述：</div>
		  			<div class="col-md-8">
		  				{{dialogDetails.remarks}}
		  			</div>
		  		</div>
		  		<div class="dialog-item">
		  			<div class="col-md-4 ta-right">创建时间：</div>
		  			<div class="col-md-8">{{dialogDetails.createTime}}</div>
		  		</div>
		  		<div class="dialog-item">
		  			<div class="col-md-4 ta-right">更新时间：</div>
		  			<div class="col-md-8">{{dialogDetails.updateTime}}</div>
		  		</div>
		  	</div>
		</el-dialog>
	</div>
</template>

<script>
import breadcrumb from '@/components/tool/breadcrumb'	//面包屑	

export default {
	name: 'sysConfig',
    components: {
    	'v-breadcrumb': breadcrumb
	},
	data() {
		return {
			tableData:[],
			dialogVisible:false,//新增或修改的弹框
			dialogDetailsVisible:false,//查看详情弹框
			total: null,//总数
        	currentPage:1,//当前页数
        	dialog:{ //弹框
        		'title':'',//标题
        		'configId':'',//参数ID
	        	'paramName':'',//参数名字
	        	'paramValue':'',//参数值
	        	'paramType':'',//参数类型
	        	'paramModule':'',//所属模块
	        	'paramState':null,//参数状态
	        	'ext1':'',//拓展字段
	        	'remarks':''//描述
        	},
        	dialogDetails:{ //查看详情弹框内容
        		'configId':'',//参数ID
	        	'paramName':'',//参数名字
	        	'paramValue':'',//参数值
	        	'paramType':'',//参数类型
	        	'paramModule':'',//所属模块
	        	'paramState':null,//参数状态
	        	'ext1':'',//拓展字段
	        	'remarks':'',//描述
	        	'createTime':'',//创建时间
	        	'updateTime':''//更新时间
        	},
        	configId:null//查看详情需要的参数ID
		}
	},
	mounted() {
        this.$nextTick(function() {
        	this.findConfigList();
        });
    },
	methods:{
		//新增或修改系统参数
		callDialog(item){
			if(item.configId != null) {
    			this.dialog.title = '修改';
    			this.dialog.configId = item.configId;
	    		this.dialog.paramName = item.paramName;
	    		this.dialog.paramValue = item.paramValue;
	    		this.dialog.paramType = item.paramType;
	    		this.dialog.paramModule = item.paramModule;
	    		this.dialog.paramState = item.paramState.toString();
	    		this.dialog.ext1 = item.ext1;
	    		this.dialog.remarks = item.remarks;
    		} else {
    			this.dialog.title = '添加';
    			this.dialog.configId = '';
	    		this.dialog.paramName = '';
	    		this.dialog.paramValue = '';
	    		this.dialog.paramType ='' ;
	    		this.dialog.paramModule = '';
	    		this.dialog.paramState = '';
	    		this.dialog.ext1 = '';
	    		this.dialog.remarks = '';
    		}
    		this.dialogVisible = true;
    		
		},
		//查询系统参数列表
		findConfigList(){
			var params = {
				token: this.token,
				//参数(必填)
				pageNum: this.currentPage,
				pageSize: this.pageSize//组件中 默认值是10
			}
			var that = this;
			var reqUrl = this.baseUrl + '/back/sysConfig/findConfigList';
			this.$http.get(reqUrl, {params: params}).then(function(res) {
				if(!res) {
					return;
				}
				that.total=res.total;
				var tableData=res.aatList;			
				for(var i=0;i<tableData.length;i++){
				   	var creatTime=tableData[i].createTime;
				   	tableData[i].createTime = that.formatDate(creatTime);
				   	var updateTime=tableData[i].updateTime;
				   	tableData[i].updateTime = that.formatDate(updateTime);
				}
				that.tableData = tableData;					
			})
		},
		//分页
    	handlePaging: function(_currentPage) {
    		this.currentPage = _currentPage;
			this.findConfigList();
    	},
    	//判断是编辑还是增加
    	addOrUpdateConfig(){
    		if(!this.dialog.paramName){
    			this.$message('参数名字不能为空!');
    			return;
    		};
    		if(!this.dialog.paramValue){
    			this.$message('参数值不能为空!');
    			return;
    		};
    		if(this.dialog.title.indexOf('修改') != -1){
    			if(!this.dialog.configId){
    			this.$message('修改时参数ID不能为空!');
    			return;
    			}
    		};
    		//新增和修改必选paramName和paramValue
    		var params = {
				token: this.token,
				//参数(必填)
				paramName: this.dialog.paramName,
				paramValue: this.dialog.paramValue
			}
    		//修改时候必须configId
    		if(this.dialog.title.indexOf('修改') != -1){
    			params.configId = this.dialog.configId;
    		}
    		//可选参数paramType
    		if(this.dialog.paramType){
					params.paramType = this.dialog.paramType;
			}
    		//可选参数paramModule
    		if(this.dialog.paramModule){
					params.paramModule = this.dialog.paramModule;
			}
    		//可选参数paramState
    		if(this.dialog.paramState){
					params.paramState = this.dialog.paramState;
			}
    		//可选参数ext1
    		if(this.dialog.ext1){
					params.ext1 = this.dialog.ext1;
			}
    		//可选参数remarks
    		if(this.dialog.remarks){
					params.remarks = this.dialog.remarks;
			}
    		var that = this;
			var reqUrl = this.baseUrl + '/back/sysConfig/addOrUpdateConfig';
			this.$http.post(reqUrl, params).then((res) => {
				if(!res){return}
				if(this.dialog.title.indexOf('修改') != -1){
					that.$message({
			          message: '修改成功!',
			          type: 'success'
			        });	
			        this.dialogVisible = false;
			        this.findConfigList();
				}else{
					that.$message({
			          message: '新增成功!',
			          type: 'success'
			        });	
			        this.dialogVisible = false;
			        this.findConfigList();
				}
			})
    	},
    	//查看详情
    	findConfigDetail(item){
    		this.configId = item.configId;
    		var params = {
				token: this.token,
				//参数(必填)
				configId: this.configId,
			}
    		var that = this;
			var reqUrl = this.baseUrl + '/back/sysConfig/findConfigDetail';
			this.$http.get(reqUrl, {params: params}).then((res) => {
				if(!res){return}
				that.dialogDetails.configId = res.configId;
	    		that.dialogDetails.paramName = res.paramName;
	    		that.dialogDetails.paramValue = res.paramValue;
	    		that.dialogDetails.paramType = res.paramType;
	    		that.dialogDetails.paramModule = res.paramModule;
	    		that.dialogDetails.paramState = res.paramState.toString();
	    		that.dialogDetails.ext1 = res.ext1;
	    		that.dialogDetails.remarks = res.remarks;
	    		that.dialogDetails.createTime = that.formatDate(res.createTime);
	    		that.dialogDetails.updateTime = that.formatDate(res.updateTime);
	    		that.dialogDetailsVisible = true;
			})
    	},
    	//删除
    	deleteConfig(item){
    		this.configId = item.configId;
    		this.$confirm('确定删除?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					var that = this;
					var reqUrl = this.baseUrl + '/back/sysConfig/deleteConfig';
					var params = {
						token: that.token,
						//参数(必填)
						configId: that.configId
					}
					this.$http.post(reqUrl, params).then((res) => {
						if(!res) {
							return;
						}
						that.$message({
				          	message: '删除成功！',
				          	type: 'success'
	        			});
	        			//重新加载数据
						that.findConfigList();
					})
			})
    	},
    	//刷新
		refreshConfig(){
			var params = {
				token: this.token,
				//参数(必填)
			}
			var that = this;
			var reqUrl = this.baseUrl + '/back/sysConfig/refreshConfig';
			this.$http.get(reqUrl, {params: params}).then(() => {
				that.$message({
		          	message: '刷新成功！',
		          	type: 'success'
    			});
    			//重新加载数据
				that.findConfigList();
			})
		}
	}
}
</script>

<style scoped>
@import url("../home/css/dialog.css");

.textarea-box {
	width: 100%;
	height: 100px;
	line-height: 25px;
	resize: none;
	border: 1px solid #ccc;
}
.input-other{
	width:40% !important;
}
</style>