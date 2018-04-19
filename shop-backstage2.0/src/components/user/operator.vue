<!-- 后台用户管理 -->
<template>
    <div class="operator">
    	<v-breadcrumb firstMenu="用户" secondMenu="后台用户管理"></v-breadcrumb>
		<div class="nav row">
    		<div class="col-md-12">
    			<div class="portlet box red">
					<div class="portlet-title">
						<div class="caption">后台用户管理</div>
					</div>
					<div class="portlet-body">
						<div class="operate">
							<span>登录账号：</span>
							<input type="text" class="form-control input-inline" placeholder="登录账号" v-model="username">								
							<span>角色：</span>
							<select class="form-control input-small input-inline"  v-model="roleKey">
								<option value="">--选择角色--</option>
								<option v-for="item in roleList" :value="item.roleId">{{item.roleName}}</option>
							</select>	
							<span>姓名：</span>
							<input type="text" class="form-control input-inline" placeholder="姓名" v-model="realname">			
							<button type="button" class="btn btn-primary" @click="handleFind">查询</button> 
						</div>
						<div class="operate">
							<button type="button" class="btn btn-success" @click="handleAdd">添加用户</button> 
						</div>
						<div class="table-scrollable">
							<el-table :data="tableData" >
							    <!--<el-table-column type="selection" prop="" width="50"></el-table-column>-->
							    <el-table-column prop="" type="index" label="序号" width="70"> </el-table-column>
							    <el-table-column prop="username" label="登录账号"> </el-table-column>
							    <el-table-column prop="realname" label="姓名"> </el-table-column>
							    <el-table-column prop="phone" label="手机号"> </el-table-column>
							    <el-table-column prop="rolenames" label="角色"> </el-table-column>
					         	<el-table-column prop="status" label="账户状态">
					         		<template slot-scope="scope">
					         			<el-switch v-model="scope.row.status" @change="changeStatus(scope.row)"
							      			active-color="#de3e51" inactive-color="#aaa"><!--  active-text="冻结" inactive-text="正常" -->
							      		</el-switch>
							    	</template>
					         	</el-table-column>
							    <el-table-column prop="" label="操作" width="200">
							    	<template slot-scope="scope">
							    		<span class="btn default btn-xs purple" v-if="scope.row.status"  @click="handleEdit(scope.row)">管理用户 </span>
							    	</template>
							    </el-table-column>
						    </el-table>
						    <el-pagination layout="prev, pager, next" v-if="totalCount > pageSize"
			    			:page-size="pageSize" :current-page="currentPage" :total="totalCount"
							 v-on:current-change="handlePaging"></el-pagination>
						</div>
					</div>
    			</div>
    		</div>
    	</div>
    </div>
</template>
<script>
import breadcrumb from '@/components/tool/breadcrumb'	//面包屑
export default {
    name: 'operator', // 添加操作员
    components: {
    	'v-breadcrumb': breadcrumb
	},
    data() {
        return {
            tableData: [],
        	flag: true,
        	currentPage: 1,//当前页
        	pageSize: 10,//单页条数
        	totalCount: 0,//总共条数
        	username: '',
        	realname: '',
        	roleKey: '',
        	roleList: [],//角色列表
        }
    },
    mounted() {
        this.$nextTick(function() {
        	this.getList();
        	this.getRoleList();
        });
    },
    methods: {
    	//获取后台用户列表
    	getList: function() {
    		var that = this;
			var reqUrl = this.baseUrl + '/user/findSysUsers';
			var params = {
				token: this.token,
				currentPage: this.currentPage,
				pageSize: this.pageSize,
			};
			if(this.username != '') {
				params.username = this.username;
			}
			if(this.realname != '') {
				params.realname = this.realname;
			}
			if(this.roleKey != '') {
				params.roleKey = this.roleKey;
			}
			this.$http.get(reqUrl, {params: params})
			.then(function(res) {
				if(!res) {
					return;
				}
				that.totalCount = res.totalCount;
				var list = res.sysUsers;
//				
//				if(that.totalCount > that.pageSize) {
//					for(var i = 0;i < list.length;i++) {
//						that.tableData.push()
//					}
//				} else {
//					
//				}
				
				
				
//				var tempList = {};
//				var arr = [];
				for(var i = 0; i < list.length;i++) {
					//状态
					if(parseInt(list[i].status) == that.normalStatus) {//有效
						list[i].status = true;
					} else if(parseInt(list[i].status) == that.invalidStatus) {//无效
						list[i].status = false;
					}
//					
//					//id相同的数据合并
//					var di = list[i];
//				    var n = di.userId;
//				    if(!tempList[n]){
//				        tempList[n] = di.roleName;
//				        arr.push(di);
//				    } else {
//				        for(var j = 0; j < arr.length; j++){
//				            var aj = arr[j];
//				            if(aj.userId == n){
//				                aj.roleName += '、' + di.roleName;
//				                that.totalCount -= 1;
//				                break;
//				            }
//				        }
//				    }
				}
				that.tableData = list;
//				that.tableData = arr;
//				that.totalCount = arr.length;
 			});
    	},
    	//迷糊搜索
    	handleFind: function() {
    		this.currentPage = 1;
    		this.getList();
    	},
    	handlePaging: function(currentPage) {
    		this.currentPage = currentPage;
			this.getList();
    	},
    	//获取所有角色
    	getRoleList: function() {
    		var that = this;
			var reqUrl = this.baseUrl + '/sys/permission/find';
			var params = {
				token: this.token,
				type: '1'
			};
			this.$http.get(reqUrl, {params: params})
			.then(function(res) {
				if(!res) {
					return;
				}
				that.roleList = res.list;
 			});
    	},
    	//去添加用户
    	handleAdd: function() {
    		this.$router.push({
				path: '/manageOperator',
				query: {
					'type': 'add'
				}
			});
    	},
    	//修改状态
		changeStatus: function(item) {
			var that = this;
			if(!item.status) {
				item.status = true;
			 	this.$confirm('确认失效吗?', '提示')
				.then(() => {
				 	item.status = this.invalidStatus;
		          	that.updateStatus(item);
		        }).catch(() => {
					item.status = true;
		        });
			} else {
				item.status = false;
			 	this.$confirm('确认有效吗?', '提示')
			 	.then(() => {
			 		item.status = this.normalStatus;
		          	that.updateStatus(item);
		        }).catch(() => {
					item.status = false;
		        });
			}
		},
		//修改状态方法
		updateStatus: function(item) {
			var that = this;
			var reqUrl = this.baseUrl + '/userBusi/updEffctive';
			var params = {
				token: this.token,
				userId: item.userId,
				effective: item.status
			};
			this.$http.post(reqUrl, params)
			.then(function(res) {
				if(!res) {
					return;
				}
				that.getList();
 			});
		},
    	//管理用户
    	handleEdit: function(item) {
    		this.$router.push({
				path: '/manageOperator',
				query: {
					'operatorId': item.userId,
					'type': 'edit'
				}
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
</style>
