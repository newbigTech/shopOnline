<!-- 系统管理 -->
<template>
	<div class="sysConfig">
		<v-breadcrumb firstMenu="系统管理" secondMenu="系统配置"></v-breadcrumb>
    	<div class="nav">
    		<div class="col-md-12">
    			<div class="portlet box blue">
					<div class="portlet-title">
						<div class="caption">系统配置</div>
					</div>
					<div class="portlet-body">
						<div class="operate">
							<span>参数名称：</span>
							<div class="input-medium input-inline">
                                <el-input placeholder="请输入参数名称" v-model="inquire.name" clearable> </el-input>
                            </div>
                            <span>参数模块：</span>
                            <div class="input-medium input-inline">
                                <el-input placeholder="请输入参数模块" v-model="inquire.modules" clearable> </el-input>
                            </div>
                            <span>参数类型：</span>
                            <div class="input-medium input-inline">
                                <el-input placeholder="请输入参数类型" v-model="inquire.type" clearable> </el-input>
                            </div>
                            <span>参数状态：</span>
                            <el-select v-model="inquire.state" placeholder="请选择" class="ml10">
							    <el-option v-for="item in state"
							      :key="item.value" :label="item.label" :value="item.value">
							    </el-option>
							</el-select>
							<button type="button" class="btn btn-success" @click="findByParam">查询</button>
							<button type="button" class="btn btn-danger" @click="sysAddOrEdit">新增</button>
						</div>
						<div class="table-scrollable">
							<el-table :data="tableData" >
							    <el-table-column prop="config_id" label="参数ID"> </el-table-column>
							    <el-table-column prop="param_name" label="参数名字"> </el-table-column>
							    <el-table-column prop="param_value" label="参数值"> </el-table-column>
							    <el-table-column prop="param_type" label="参数类型"> </el-table-column>
							    <el-table-column prop="remarks" label="描述"> </el-table-column>
							    <el-table-column prop="" label="参数状态">
							    	<template slot-scope="scope">
							    		<span v-if="scope.row.param_state == 1">有效</span>
										<span v-else>失效</span>
							    	</template>
							    </el-table-column>
							    <el-table-column prop="update_time" label="修改时间"> </el-table-column>
							    <el-table-column prop="ext1" label="扩展字段"> </el-table-column>
							    <el-table-column prop="remarks" label="备注"> </el-table-column>
							    <el-table-column prop="" label="操作" width="200">
							    	<template slot-scope="scope">
							    		<span class="btn default btn-xs purple" @click="sysAddOrEdit(scope.row)">修改 </span>
										<!--<span class="btn default btn-xs red" @click="">删除</span>-->
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
		<el-dialog :title="dialog.title" :visible.sync="dialogVisible" width="30%" center>
	  		<div class="dialog-item" v-if="dialog.title !='添加'">
    			<span>参数ID：</span>	{{dialog.configId}}
    		</div>
	  		<div class="dialog-item">
	  			<span>参数名称：</span>
	  			<input type="text" v-model="dialog.paramName"/>
	  		</div>
	  		<div class="dialog-item">
	  			<span>参数值：</span>
	  			<input type="text"  v-model="dialog.paramValue"/>
	  		</div>
	  		<div class="dialog-item">
	  			<span>参数类型：</span>
	  			<input type="text" class="input-other" v-model="dialog.paramType"/>
	  		</div>
	  		<div class="dialog-item">
	  			<span>所属模块：</span>
	  			<input type="text" class="input-other" v-model="dialog.paramModule"/>
	  		</div>
	  		<div class="dialog-item">
	  			<span>参数状态：</span>
  				<el-radio-group v-model="dialog.paramState">
				    <el-radio :label="1">有效</el-radio>
				    <el-radio :label="0">失效</el-radio>
				</el-radio-group>
	  		</div>
	  		<div class="dialog-item">
	  			<span>拓展字段：</span>
	  			<input type="text" v-model="dialog.ext1"/>
	  		</div>
	  		<div class="dialog-item">
	  			<span class="va-top">备注：</span>
  				<textarea v-model="dialog.remarks"></textarea>
	  		</div>
		  	<div slot="footer" class="dialog-footer">
		  		<button type="button" class="btn btn-primary" @click="saveSys">保存</button>
				<button type="button" class="btn btn-default" @click="dialogVisible = false">取消</button>
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
			state:[
			{"value":"2","label":"全部"},
			{"value":"0","label":"失效"},
			{"value":"1","label":"有效"}
			],
			inquire:{"state":"2"},//查询条件
			dialogVisible:false,//新增或修改的弹框
			total: null,//数据总数
			currentPage: 1,//当前页面
			dialog: {"paramState":''}//弹框数据
		}
	},
	mounted() {
        this.$nextTick(function() {
        	this.findByParam();
        });
    },
	methods:{
		 //分页-当前页面
        handlePaging(_currentPage) {
    		this.currentPage = _currentPage;
			this.findByParam();
    	},
    	//查询列表
    	findByParam() {
    		var params = {
    			token:this.token,
    			pageNum:this.currentPage,
    			pageSize:this.pageSize
    		};
    		if (this.inquire.name) {
    			params.paramName = this.inquire.name;
    		}
    		if (this.inquire.modules) {
    			params.paramModule = this.inquire.modules;
    		}
    		if (this.inquire.type) {
    			params.paramType = this.inquire.type;
    		}
    		if(this.inquire.state != 2) {
    			params.paramState = this.inquire.state;
    		}
    		var that =this;
    		var reqUrl = this.baseUrl + '/erp/config/findByParam';
    		
    		this.$http.get(reqUrl,{params:params}).then((res) => {
    			if (!res) {
    				return;
    			}
    			this.total = res.total;
    			var tableData=res.list;		
				for(var i=0;i<tableData.length;i++){
				   	var creatTime=tableData[i].create_time;
				   	var updateTime=tableData[i].update_time;
				   	tableData[i].create_time = that.formatDate(creatTime,'time');
				   	tableData[i].update_time = that.formatDate(updateTime,'time');
				}
    			that.tableData = tableData;
    		})
    	},
    	//新增或者修改
		sysAddOrEdit(item) {
			if (item.config_id) {
				this.dialog.title = '修改';
				this.dialog.paramState = item.param_state;
			}else{
				this.dialog.title = '添加';
				this.dialog.paramState = '';
			}
			this.dialog.configId = item.config_id;
			this.dialog.paramName = item.param_name;
			this.dialog.paramValue = item.param_value;
			this.dialog.paramType = item.param_type;
			this.dialog.paramModule = item.param_module;
			this.dialog.ext1 = item.ext1;
			this.dialog.remarks= item.remarks;
			this.dialogVisible = true;
		},
		//保存新增或修改系统配置
		saveSys() {
			if (this.dialog.configId) {
				this.saveAsUpdate();
			}else{
				this.saveAsAdd();
			}
		},
		//保存新增
		saveAsAdd() {
			//必选
    		if (!this.dialog.paramName) {
    			this.$message({
    				message: '参数名称必须填写!',
		          	type: 'error'
    			});
    			return;
    		};
    		if (!this.dialog.paramValue) {
    			this.$message({
    				message: '参数值必须填写!',
		          	type: 'error'
    			});
    			return;
    		};
    		if (!this.dialog.paramModule) {
    			this.$message({
    				message: '所属模块必须填写!',
		          	type: 'error'
    			});
    			return;
    		};
    		if (this.dialog.paramState === '') {
    			this.$message({
    				message: '参数状态不能为空!',
		          	type: 'error'
    			});
    			return;
    		};
    		if (!this.dialog.remarks) {
    			this.$message({
    				message: '备注不能为空!',
		          	type: 'error'
    			});
    			return;
    		};
    		var params = {
    			token:this.token,
    			paramName:this.dialog.paramName,
    			paramValue:this.dialog.paramValue,
    			paramModule:this.dialog.paramModule,
    			paramState:this.dialog.paramState,
    			remarks:this.dialog.remarks
    		};
    		//可选
    		if(this.dialog.paramType){
    			params.paramType = this.dialog.paramType;
    		}
			if(this.dialog.ext1){
    			params.ext1 = this.dialog.ext1;
    		}
    		var that = this;
			var reqUrl = this.baseUrl + '/erp/config/insert';
			this.$http.post(reqUrl, params).then(function(res) {
				if(!res) {
					return;
				}
				that.$message({
		          	message: '新增系统设置成功！',
		          	type: 'success'
    			});
    			that.dialogVisible = false;
    			that.findByParam();
			})
		},
		//保存修改
		saveAsUpdate() {
			//必选
    		if (!this.dialog.paramName) {
    			this.$message({
    				message: '参数名称必须填写!',
		          	type: 'error'
    			});
    			return;
    		};
    		if (!this.dialog.paramValue) {
    			this.$message({
    				message: '参数值必须填写!',
		          	type: 'error'
    			});
    			return;
    		};
    		if (!this.dialog.paramModule) {
    			this.$message({
    				message: '所属模块必须填写!',
		          	type: 'error'
    			});
    			return;
    		};
    		if (this.dialog.paramState === '') {
    			this.$message({
    				message: '参数状态不能为空!',
		          	type: 'error'
    			});
    			return;
    		};
    		if (this.dialog.remarks === '') {
    			this.$message({
    				message: '备注不能为空!',
		          	type: 'error'
    			});
    			return;
    		};
    		var params = {
    			token:this.token,
    			configId:this.dialog.configId,
    			paramName:this.dialog.paramName,
    			paramValue:this.dialog.paramValue,
    			paramModule:this.dialog.paramModule,
    			paramState:this.dialog.paramState,
    			remarks:this.dialog.remarks
    		};
    		//可选
			if(this.dialog.paramType){
    			params.paramType = this.dialog.paramType;
    		}
			if(this.dialog.ext1){
    			params.ext1 = this.dialog.ext1;
    		}
    		var that = this;
			var reqUrl = this.baseUrl + '/erp/config/update';
			this.$http.post(reqUrl, params).then(function(res) {
				if(!res) {
					return;
				}
				that.$message({
		          	message: '修改成功！',
		          	type: 'success'
    			});
    			that.dialogVisible = false;
    			that.findByParam();
			})
		}
	}
}
</script>

<style scoped>
.va-top {
	vertical-align: top;
}
</style>