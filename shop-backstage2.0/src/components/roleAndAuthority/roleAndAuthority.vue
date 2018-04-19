<!-- 角色与权限 -->
<template>
    <div class="roleAndAuthority">
    	<v-breadcrumb firstMenu="角色与权限" secondMenu="角色管理和权限管理"></v-breadcrumb>
    	<div class="nav row">
    		<div class="col-md-12">
    			<div class="portlet box red">
					<div class="portlet-title">
						<div class="caption">角色管理和权限管理</div>
					</div>
					<div class="portlet-body">
						<div class="operate">
							<button type="button" class="btn btn-success" @click="handleAdd">增加</button> 
						</div>
						<div class="table-scrollable">
							<div class="tabs col-lg-5">
								<el-tabs v-model="activeName" @tab-click="handleClick">
								    <el-tab-pane label="角色管理" name="first">
								    	<el-table :data="roleList">
										    <el-table-column prop="roleName" label="角色名称"> </el-table-column>
										    <el-table-column prop="" label="操作">
										    	<template slot-scope="scope">
										    		<span class="btn default btn-xs blue" @click="handleAllot(scope.row)">权限 </span>
										    		<span class="btn default btn-xs purple" @click="handleEdit(scope.row)">修改 </span>
										    		<span class="btn default btn-xs red"  @click="handleDelete(scope.row)">删除 </span>
										    	</template>
										    </el-table-column>
									    </el-table>
								    </el-tab-pane>
								    <el-tab-pane label="权限管理" name="second">
								    	<el-table :data="authorityList">
										    <el-table-column prop="privName" label="权限名称"> </el-table-column>
										    <el-table-column prop="" label="操作">
										    	<template slot-scope="scope">
										    		<span class="btn default btn-xs blue" @click="handleAllot(scope.row)">菜单 </span>
										    		<span class="btn default btn-xs purple" @click="handleEdit(scope.row)">修改 </span>
										    		<span class="btn default btn-xs red"  @click="handleDelete(scope.row)">删除 </span>
										    	</template>
										    </el-table-column>
									    </el-table>
								    </el-tab-pane>
								</el-tabs>
							</div>
						</div>
					</div>
    			</div>
    		</div>
    	</div>
    	
    	<!-- 弹出框 -->
    	<el-dialog :title="operateType" :visible.sync="dialogVisible" width="25%"  @close="handleCancle">
    		<div class="col-lg-pull-5">
    			<select class="form-control input-small input-inline" v-model="addType" :disabled="operateType == '修改'">
					<option value="角色">角色</option>
					<option value="权限">权限</option>
				</select>		
    		</div>
    		<div class="col-lg-pull-5" v-if="addType == '角色'">
    			<input type="text" class="form-control input-inline" placeholder="角色名称" v-model="currObj.roleName">			
    		</div>
    		<div class="col-lg-pull-5" v-if="addType == '权限'">
    			<input type="text" class="form-control input-inline" placeholder="权限名称" v-model="currObj.privName">			
    		</div>
			<span slot="footer" class="dialog-footer">
				 <el-button type="primary" @click="handleSave">确 定</el-button>
			    <el-button @click="handleCancle">取 消</el-button>
			</span>
		</el-dialog>
    </div>
</template>
<script>
import breadcrumb from '@/components/tool/breadcrumb'	//面包屑	
	
export default {
    name: 'roleAndAuthority',
    components: {
    	'v-breadcrumb': breadcrumb
	},
    data() {
        return {
        	roleList: [],
        	authorityList: [],
        	activeName: 'first',
        	dialogVisible: false,
        	addType: '角色',//添加类型
        	roleName: '',//角色名称
        	authName: '',//权限名称
        	findType: '1',//1为角色，2为权限
        	currObj: {},//当前对象
        	operateType: '添加',//操作类型
        }
    },
    mounted() {
        this.$nextTick(function() {
        	var activeName = this.$route.query.activeName;
        	if(activeName != undefined) {
        		this.activeName = 'second';
        		this.findType = '2';
        	} else {
        		this.activeName = 'first';
        		this.findType = '1';
        	}
        	this.getList();
        });
    },
    methods: {
    	//查询权限或者角色列表
    	getList: function() {
    		var that = this;
			var reqUrl = this.baseUrl + '/sys/permission/find';
			var params = {
				token: this.token,
				type: this.findType
			};
			this.$http.get(reqUrl, {params: params})
			.then(function(res) {
				if(!res) {
					return;
				}
				if(that.findType == '1') {//角色列表
					that.roleList = res.list;
				}
				if(that.findType == '2') {//权限列表
					that.authorityList = res.list;
				}
 			});
    	},
    	handleClick: function() {
    		if(this.activeName == 'first') {//角色
    			this.findType = '1';
    			this.addType = '角色';
    		} else {//权限
    			this.findType = '2';
    			this.addType = '权限';
    		}
    		this.getList();
    	},
    	//去增加角色或权限
    	handleAdd: function() {
    		this.operateType = '添加';
    		this.dialogVisible = true;
    	},
    	//去修改角色或权限
    	handleEdit: function(item) {
    		this.currObj = item;
    		this.dialogVisible = true;
    		this.operateType = '修改';
    		if(this.activeName == 'first') {
    			this.addType = '角色';
    		} else {
    			this.addType = '权限';
    		}
    	},
    	//增加角色或权限  / 修改角色或权限
    	handleSave: function() {
    		var that = this;
    		var reqUrl;
    		var params = {token: this.token};
    		if(this.operateType == '添加') {
    			reqUrl = this.baseUrl + '/sys/permission/add';
    		} else {
    			reqUrl = this.baseUrl + '/sys/permission/modify';
    			
    			if(this.addType == '权限') {//权限
	    			params.code = this.currObj.privId;
	    		}
	    		if(this.addType == '角色') {//角色
	    			params.code = this.currObj.roleId; 
	    		}
    		}
    		
    		if(this.addType == '权限') {//权限
    			params.type = '2';
    			params.name = this.currObj.privName;
    		}
    		if(this.addType == '角色') {//角色
    			params.type = '1';
    			params.name = this.currObj.roleName
    		}
			this.$http.post(reqUrl, params)
			.then(function(res) {
				if(!res) {
					return;
				}
				that.$message('操作成功');
				that.getList();
				that.dialogVisible = false;
				that.currObj = {};
   			});
    	},
    	//取消修改或添加
    	handleCancle: function() {
    		this.dialogVisible = false;
    		this.currObj = {};
    		this.getList();
    	},
    	//删除权限 或角色
    	handleDelete: function(item) {
    		var that = this;
    		this.$confirm('确定删除吗？')
    		.then(function() {
	    		var reqUrl = that.baseUrl + '/sys/permission/delete';
	    		var params = {token: that.token};
	    		
	    		if(that.activeName == 'second') {//权限
	    			params.type = '2';
	    			params.code = item.privId;
	    		}
	    		if(that.activeName == 'first') {//角色
	    			params.type = '1';
	    			params.code = item.roleId;
	    		}
				that.$http.post(reqUrl, params)
				.then(function(res) {
					if(!res) {
						return;
					}
					that.$message('删除成功');
					that.getList();
	   			});
    		})
    	},
    	//分配权限  或 分配菜单
    	handleAllot: function(item) {
	  		var query = {},path;
	  		if(this.activeName == 'first') {//去修改角色
	  			query = {
	  				'roleId': item.roleId
	  			}
	  			path =  '/manageRole';
	  		}
	  		if(this.activeName == 'second') {//去修改权限
	  			query = {
	  				'privId': item.privId
	  			}
	  			path =  '/manageAuthority';
	  		}
	  		this.$router.push({
				path: path,
				query: query
			});
    	}
    }
}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style scoped>
.operate {
	min-height: 30px;
	margin-bottom: 20px;
	clear: both;
}
.operate > input,
.operate > select {
	margin: 10px;
}
.tabs {
	padding: 20px;
}
.col-lg-pull-5 {
	margin-bottom: 20px;
}
</style>
