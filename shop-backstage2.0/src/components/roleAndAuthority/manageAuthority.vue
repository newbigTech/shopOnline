<!-- 管理权限 -->
<template>
    <div class="user">
    	<v-breadcrumb firstMenu="角色与权限" secondMenu="管理权限"></v-breadcrumb>
    	<div class="nav row">
    		<div class="col-md-12">
    			<div class="portlet box red">
					<div class="portlet-title">
						<div class="caption">管理权限</div>
					</div>
					<div class="portlet-body">
						<p class="title">权限名称：{{currPrivObj.privName}}</p>
						<div class="auth-item" v-for="item in menuList">
							<p>{{item.menuName}}</p>
							<el-checkbox-group v-model="checkMenuList" class="mt20">
							    <el-checkbox v-for="childObj in item.childrenMenu" @change="handleCheckChange(item.childrenMenu, $event)"
							    	:label="childObj.menuId" :key="childObj.menuId">
							    	{{childObj.menuName}}
							    </el-checkbox>
							</el-checkbox-group>
						</div>
						<div class="operate">
							<button type="button" class="btn btn-success" @click="handleSave">确定</button>
							<button type="button" class="btn default" @click="handleCancle">取消</button>
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
    	 	checkAll: false,
	        checkMenuList: [],//选中菜单
	        isIndeterminate: true,
	        privId: '',//当前角色id
        	menuList: {},//菜单数据
        	currPrivObj: {},//当前权限信息
        }
    },
    mounted() {
        this.$nextTick(function() {
        	this.privId = this.$route.query.privId;
        	
        	this.getMenuList();
			this.getMenuByPriv();
        });
    },
    methods: {
    	handleCheckChange: function(menuList, e) {
    		var checkMenuList = this.checkMenuList;
    		var tmp = [];
			for(var i in checkMenuList){
				if(tmp.indexOf(checkMenuList[i])==-1){
					tmp.push(checkMenuList[i]);
				}
			}
    		this.checkMenuList = tmp;
      	},
      	//获取所有菜单(有分层,没有分页)
      	getMenuList: function() {
      		var that = this;
			var reqUrl = this.baseUrl + '/sys/menu/findAllMenu';
			var params = {
				token: this.token
			};
			this.$http.get(reqUrl, {params: params})
			.then(function(res) {
				if(!res) {
					return;
				}
				that.menuList = res.menuList;
   			});
      	},
      	//获取当前权限下的所有菜单
      	getMenuByPriv: function() {
      		var that = this;
			var reqUrl = this.baseUrl + '/sys/permission/findMenuByprivId';
			var params = {
				token: this.token,
				code: this.privId
			};
			this.$http.get(reqUrl, {params: params})
			.then(function(res) {
				if(!res) {
					return;
				}
				that.currPrivObj = res.privInfo;
				var listMenu = res.privInfo.listMenu;
				var menuList = [];
				for(var i = 0;i < listMenu.length;i++) {
					if(listMenu[i].parentId != null) {
						menuList.push(listMenu[i].menuId);
					}
//					menuList.push(listMenu[i].parentId);
				}
				//去重复
				var tmp = [];
				for(var i in menuList) {
					if(menuList[i] != null) {
						if(tmp.indexOf(menuList[i])==-1){
							tmp.push(menuList[i]);
						}
					}
				}
	    		that.checkMenuList = tmp;
   			});
      	},
      	//保存修改
    	handleSave: function() {
    		for(var i = 0;i < this.menuList.length;i++) {
    			var menuObj = this.menuList[i];
    			if(menuObj.childrenMenu == undefined) {
    				continue;
    			}
    			for(var k = 0;k < menuObj.childrenMenu.length;k++) {
    				var childObj = menuObj.childrenMenu[k];
    				for(var j = 0;j < this.checkMenuList.length;j++) {
    					var checkObj = this.checkMenuList[j];
    					if(checkObj == childObj.menuId) {
    						this.checkMenuList.push(childObj.parentId);
    					}
    				}
				}
			}
    		//去重复
    		var tmp = [];
			for(var i in this.checkMenuList) {
				if(this.checkMenuList[i] != null) {
					if(tmp.indexOf(this.checkMenuList[i])==-1){
						tmp.push(this.checkMenuList[i]);
					}
				}
			}
			this.checkMenuList = tmp;
    		var that = this;
			var reqUrl = this.baseUrl + '/sys/permission/bind';
			var params = {
				token: this.token,
				type: '2',//1=角色与权限关系绑定，2=权限与菜单关系绑定，3=操作员与角色关系绑定
				parentId: this.privId,
				childIds: this.checkMenuList //选中菜单
			};
			this.$http.post(reqUrl, {sendJson:JSON.stringify(params)})
			.then(function(res) {
				if(!res) {
					return;
				}
				that.$message('操作成功');
				that.$router.push({
					path: '/roleAndAuthority',
					query: {'activeName': 'second'}
				});
   			});
    	},
    	//取消
    	handleCancle: function() {
    		this.$router.push({
				path: '/roleAndAuthority',
				query: {'activeName': 'second'}
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
.auth-item {
	margin: 0 40px 30px 40px;
}
.auth-item > p {
	padding: 8px 10px;
	background: #eee;
}
.operate {
	margin-left: 50px;
}
.mt20 {
	margin-top: 20px;
}
</style>
