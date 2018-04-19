<!-- 管理后台用户 -->
<template>
    <div class="manageOperator">
    	<v-breadcrumb firstMenu="用户" secondMenu="管理后台用户"></v-breadcrumb>
    	<div class="nav row">
    		<div class="col-md-12">
    			<div class="portlet box red">
					<div class="portlet-title">
						<div class="caption">管理后台用户</div>
						<!--<div class="tools">
							<a href="#" class="reload" data-original-title="" title=""></a>
						</div>-->
					</div>
					<div class="portlet-body">
						<div class="form-horizontal">
							<div class="form-group">
								<label class="col-md-3 control-label" for="title">登录账号：</label>
								<div class="col-md-5">
									<input type="text" id="nameInput" class="form-control" placeholder="登录账号" :disabled="!viewAdd"
										v-model="operatorObj.username" @blur="verifyName($event)">
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label" for="title">手机号：</label>
								<div class="col-md-5">
									<input type="text" class="form-control" placeholder="手机号" v-model="operatorObj.phone" @blur="handlePhone($event)">
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label" for="title">姓名：</label>
								<div class="col-md-5">
									<input type="text" class="form-control" placeholder="姓名" v-model="operatorObj.realname">
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label" for="title">角色：</label>
								<div class="col-md-9">
									<el-checkbox-group  v-model="operatorObj.roleIds" :min="1" class="check-group" >
									    <el-checkbox v-for="item in roleList" :label="item.roleId" :key="item.roleId">
									    	{{item.roleName}}
									    </el-checkbox>
									</el-checkbox-group>
								</div>
							</div>
							<div class="form-group" v-if="viewAdd">
								<label class="col-md-3 control-label" for="title"></label>
								<div class="col-md-5">默认密码为： {{operatorObj.password}}</div>
							</div>
							<div class="form-group" v-if="!viewAdd">
								<label class="col-md-3 control-label" for="title"></label>
								<div class="col-md-5">
									<button type="button" class="btn btn-primary" @click="resetPwd">重置密码为666666</button>
								</div>
							</div>
						</div>
						<div class="operate ta-center">
							<button type="button" class="btn btn-success" @click="handleSave">确定</button>
							<button type="button" class="btn default" @click="$router.push('/operator')">取消</button>
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
    name: 'manageOperator', // 添加操作员
    components: {
    	'v-breadcrumb': breadcrumb
	},
    data() {
        return {
           	roleList: ['运营', '客服', '财务', '技术', '产品'],
           	checkedRole: ['运营', '客服'],
          	viewAdd: true,
          	operatorObj: {'password': '666666', 'roleIds': []},
          	currOperId: '',//当前操作员id
        }
    },
    mounted() {
        this.$nextTick(function() {
        	var opType = this.$route.query.type;
        	if(opType == 'add') {
        		this.viewAdd = true;
        	} else {
        		this.viewAdd = false;
        		this.currOperId = this.$route.query.operatorId;
        		this.getDetail();
        	}
        	
        	this.getRoleList();
        });
    },
    methods: {
    	//查询所有角色
    	getRoleList: function() {
    		var that = this;
			var reqUrl = this.baseUrl + '/sys/permission/find';
			var params = {
				type: '1',//类型（1为角色，2为权限）
				token: this.token
			}
			this.$http.get(reqUrl, {params: params})
			.then(function(res) {
				if(!res) {
					return;
				}
				that.roleList = res.list;
   			});
    	},
    	//获取
    	getDetail: function() {
    		var that = this;
			var reqUrl = this.baseUrl + '/user/findSysUserDetail';
			var params = {
				userId: this.currOperId,	
				token: this.token
			}
			this.$http.get(reqUrl, {params: params})
			.then(function(res) {
				if(!res) {
					return;
				}
				that.operatorObj = res.user;
				var roleIds =  res.user.roleIds;
				if(that.operatorObj.roleIds != null) {
					that.operatorObj.roleIds = roleIds.split(',');
				} else {
					that.operatorObj.roleIds = [];
				}
   			});
    	},
    	//验证手机号
    	handlePhone: function(e) {
    		if(this.operatorObj.phone) {
				var f = this.verifyPhone(this.operatorObj.phone);
				if(!f) {
					this.$message('请输入正确手机号码');
					e.currentTarget.focus();
					return;
				}
			}
    	},
    	//验证管理员用户名唯一性
    	verifyName: function(e) {
    		if(!this.operatorObj.username) {
    			return;
    		}
			var that = this;
			var reqUrl = this.baseUrl + '/user/validateUnique';
			var params = {
				username: this.operatorObj.username,
				token: this.token
			}
			this.$http.get(reqUrl, {params: params})
			.then(function(res) {
				if(!res) {
					e.target.focus();
					return;
				}
				if(!res.isUnique) {
					that.$message('用户名有重复');
					document.getElementById('nameInput').focus();
					return;
				}	
   			});
    	},
    	//重置密码
    	resetPwd: function() {
    		var that = this;
			var reqUrl = this.baseUrl + '/userBusi/resetPwd';
			var params = {
				userId: this.currOperId,
				token: this.token
			}
			this.$http.post(reqUrl, params)
			.then(function(res) {
				if(!res) {
					return;
				}
				if(res.isResetPwd) {
					that.$message('重置密码成功');
				}
   			});
    	},
    	//保存添加  或 保存修改
		handleSave: function() {
			if(!this.operatorObj.username) {
				this.$message('请输入登录账号');
				return;
			}
			if(!this.operatorObj.phone) {
				this.$message('请输入手机号码');
				return;
			}
			if(this.operatorObj.phone) {
				var f = this.verifyPhone(this.operatorObj.phone);
				if(!f) {
					this.$message('请输入正确手机号码');
					return;
				}
			}
			if(!this.operatorObj.realname) {
				this.$message('请输入姓名');
				return;
			}
			if(this.operatorObj.roleIds == null || this.operatorObj.roleIds.length == 0 ) {
				this.$message('请至少选择一种角色');
				return;
			}
			this.operatorObj.token = this.token;
			var that = this;
			var reqUrl;
			
			if(this.viewAdd) {
				reqUrl = this.baseUrl + '/userBusi/add';
			} else {
				reqUrl = this.baseUrl + '/userBusi/updSysUser';
			}
			
			this.$http.post(reqUrl, this.operatorObj)
			.then(function(res) {
				if(!res) {
					return;
				}
				that.$message('操作成功');
				that.$router.push('/operator');
 			});
		}
    }

}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style scoped>
.check-group {
	margin-top: 6px;
}
.info {
	text-align: right;
}
.form-group {
    margin-bottom: 15px;
}
</style>
