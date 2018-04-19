<!-- 管理角色 -->
<template>
    <div class="user">
    	<v-breadcrumb firstMenu="角色与权限" secondMenu="管理角色"></v-breadcrumb>
    	<div class="nav row">
    		<div class="col-md-12">
    			<div class="portlet box red">
					<div class="portlet-title">
						<div class="caption">管理角色</div>
					</div>
					<div class="portlet-body">
						<p class="title">角色名称：{{currRoleObj.privName}}</p>
						<div class="role-item" v-for="item in privList">
							<el-checkbox-group v-model="checkPrivList">
								<h3><el-checkbox :label="item.privId">{{item.privName}}</el-checkbox></h3>
							</el-checkbox-group>
							<p>
								<template v-for="menuItem in item.listMenu">
									<label>{{menuItem.menuName}}</label>
									(<template v-for="(obj, $index) in menuItem.childrenMenu">
										<span>{{obj.menuName}}</span>
									</template>)
								</template>
							</p>
						</div>
						<!--<div class="role-item" v-for="item in privList">
							<h3><el-checkbox v-model="item.privId">{{item.privName}}</el-checkbox></h3>
							<p>
								<span>菜单名称</span>
								<span>菜单名称</span>
								<span>菜单名称</span>
								<span>菜单名称</span>
								<span>菜单名称</span>
							</p>
						</div>-->
						<!--<div class="role-item">
							<h3><el-checkbox>权限1</el-checkbox></h3>
							<p>
								<span>菜单名称</span>
								<span>菜单名称</span>
								<span>菜单名称</span>
								<span>菜单名称</span>
								<span>菜单名称</span>
							</p>
						</div>-->
						<div class="operate">
							<button type="button" class="btn btn-success" @click="handleSave">确定</button>
							<button type="button" class="btn default" @click="$router.push('/roleAndAuthority')">取消</button>
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
    name: 'user',
    components: {
    	'v-breadcrumb': breadcrumb
	},
    data() {
        return {
        	roleId: '',//当前角色id
        	roleName: '',//角色名称
        	childIds: [],//权限ID数组
        	privList: {},//权限数据
        	currRoleObj: {},//当前角色信息
        	checkPrivList: [],//当前角色的权限
        }
    },
    mounted() {
        this.$nextTick(function() {
        	this.roleId = this.$route.query.roleId;
        	
        	this.getPrivList();
        	this.getDetailByRole();
        });
    },
    methods: {
      	handleCheckedChange: function(value) {
//	        let checkedCount = value.length;
//	        this.checkAll = checkedCount === this.cities.length;
//	        this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
	    },
    	//获取所有权限列表 以及 权限下的所有菜单
    	getPrivList: function() {
    		var that = this;
			var reqUrl = this.baseUrl + '/sys/permission/find';
			var params = {
				token: this.token,
				type: '2' //1为角色，2为权限
			};
			this.$http.get(reqUrl, {params: params})
			.then(function(res) {
				if(!res) {
					return;
				}
				that.privList = res.list;
				
//				for(var i = 0;i < that.privList.length;i++) {
//					that.getMenuByPriv(that.privList[i].)
//				}
				
   			});
    	},
    	//获取一个权限下的所有菜单
    	getMenuByPriv: function(code) {
    		var that = this;
			var reqUrl = this.baseUrl + '/sys/permission/findMenuByprivId';
			var params = {
				'token': this.token,
				'code': code //权限ID
			};
			this.$http.get(reqUrl, {params: params})
			.then(function(res) {
				if(!res) {
					return;
				}
   			});
    	},
    	//获取角色下所有权限和菜单
    	getDetailByRole: function() {
    		var that = this;
			var reqUrl = this.baseUrl + '/sys/permission/findMenuByRoleId';
			var params = {
				token: this.token,
				code: this.roleId
			};
			this.$http.get(reqUrl, {params: params})
			.then(function(res) {
				if(!res) {
					return;
				}
				that.currRoleObj = res;
//				console.log(res)
				var privList = that.currRoleObj.privList;
				for(var i = 0;i < privList.length;i++) {
					that.checkPrivList.push(privList[i].privId);
				}
   			});
    	},
    	//保存修改
    	handleSave: function() {
    		var that = this;
			var reqUrl = this.baseUrl + '/sys/permission/bind';
			var params = {
				token: this.token,
				type: '1', //1=角色与权限关系绑定，2=权限与菜单关系绑定，3=操作员与角色关系绑定
				parentId: this.roleId,
				childIds: this.checkPrivList //权限ID数组
			};
			this.$http.post(reqUrl, {sendJson:JSON.stringify(params)})
			.then(function(res) {
				if(!res) {
					return;
				}
				that.$message('操作成功');
				that.$router.push('/roleAndAuthority');
   			});
    	}
    }
}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style scoped>
.title {
	font-size: 16px;
	line-height: 30px;
	margin-bottom: 10px;
}
.role-item {
	margin-bottom: 20px;
	margin-left: 50px;
}
.role-item h3 {
	line-height: 30px;
	margin-bottom: 10px;
}
.role-item > p {
	line-height: 30px;
	font-size: 14px;
}
.role-item > p > span {
	margin: 0 5px;
}
.role-item > p > label {
	margin-left: 20px;
}
.role-item > p > label:first-child {
	margin-left: 0;
}
.operate {
	margin-left: 50px;
}
</style>
