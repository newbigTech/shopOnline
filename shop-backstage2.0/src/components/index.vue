<!-- 首页 -->
<template>
    <div class="index">
    	<!-- header -->
    	<div class="header">
    		<div class="logo">
    			<div class="logo-img" v-if="viewLogo" >
    				<img src="../assets/img/logo-index.png" />
    			</div>
    			<!--<i class="iconfont icon-list" @click="handleMenu">&#xe6cb;</i>-->
    		</div>
    		<div class="data">
    			<div class="user-data">
					<!--<img src="../assets/img/photo.jpg" />-->
					<el-dropdown>
					  	<span class="el-dropdown-link">
					    	{{userInfo.username}}<i class="el-icon-arrow-down el-icon--right"></i>
					  	</span>
					  	<el-dropdown-menu slot="dropdown">
						    <el-dropdown-item @click.native="goUpdatePwd">修改密码</el-dropdown-item>
						    <!--<el-dropdown-item @click.native="handleExit">退出登录</el-dropdown-item>-->
					  	</el-dropdown-menu>
					</el-dropdown>
    			</div>
    			<span class="iconfont icon-signout" @click="handleExit">退出登录</span>
    		</div>
	  	</div>
	  	<!-- header END --> 
	  	<div class="nav" :style="{height: sidebarH + 'px'}">
	  		<!-- sidebar -->
		  	<div class="sidebar" >
		  		<el-menu :router="routerFlag" :unique-opened="routerFlag"
					 @open="handleOpen" @close="handleClose" :collapse="hiddenMenu"
					 background-color="#364150" text-color="#b4bcc8" 
					 active-text-color="#f1f1f1" active-background-color="#f1f1f1">
				  <template v-for="(item, index) in menuList"  v-if="item.isParent == 1">
					  <el-submenu :index="(index).toString()">
					    <template slot="title">
					    	<!--<i class="iconfont icon-home"></i>-->
					    	<span slot="title">
					    		<i class="menuIcon" v-if="item.menuImg"><img :src="item.menuImg"/></i>
					    		{{item.menuName}}
					    	</span>
					    </template>
					    <template v-for="(single, index) in (item.childrenMenu)">
	                        <el-menu-item :index="single.menuUrl">
	                            <!--<i class="menuIcon" v-if="single.menuImg"><img :src="single.menuImg"/></i>-->
                            	{{single.menuName}}
	                        </el-menu-item>
	                    </template>
					  </el-submenu>
				  </template>
				</el-menu>
				<!--<el-menu :router="routerFlag"
					 @open="handleOpen" @close="handleClose" :collapse="hiddenMenu"
					 background-color="#364150" text-color="#b4bcc8" 
					 active-text-color="#f1f1f1" active-background-color="#f1f1f1">
				  <template v-for="(item, index) in $router.options.routes"  v-if="item.type == 'sider'">
					  <el-submenu :index="(index).toString()">
					    <template slot="title">
					    	<i class="iconfont" v-html="item.icon"></i>
					    	<span slot="title">{{item.title}}</span>
					    </template>
					    <template v-for="(single, index) in (item.children)" v-if="single.type == 'sider'">
	                        <el-menu-item :index="single.path" >
	                            {{single.title}}
	                        </el-menu-item>
	                    </template>
					  </el-submenu>
				  </template>
				</el-menu>-->
		  	</div>
		  	<!-- sidebar END -->
		  	<!-- content -->
		  	<div class="content">
		  		<router-view></router-view>
		  	</div>
		  	<!-- content END -->
	  	</div>
   		<!-- 修改密码弹框 -->
   		<el-dialog title="修改密码" :visible.sync="dialogVisible" width="30%" @close="handleCancle">
   			<div class="col-lg-pull-5">
    			<span>原密码：</span>	
    			<input type="password" class="form-control input-inline" placeholder="原密码" v-model="pwdObj.oldPassword">	
    		</div>
    		<div class="col-lg-pull-5">
    			<span>新密码：</span>	
    			<input type="password" class="form-control input-inline" placeholder="新密码" v-model="pwdObj.newPassword">	
    		</div>
    		<div class="col-lg-pull-5">
    			<span>确认密码：</span>	
    			<input type="password" class="form-control input-inline" placeholder="确认密码" v-model="pwdObj.confirmPassword">	
    		</div>
			<span slot="footer" class="dialog-footer">
			    <el-button @click="handleCancle">取 消</el-button>
			    <el-button type="primary" @click="handleUpdatePwd">确 定</el-button>
			</span>
		</el-dialog>
    </div>
</template>
<script>
export default {
    name: 'index', // 首页
    data() {
        return {
        	viewLogo: true,//显示logo
        	hiddenMenu: false ,//是否展开菜单
        	routerFlag: true,
        	sidebarH: 0,//侧边栏高度
        	username: 'Nike',
        	menuList: [],//菜单数组
        	dialogVisible: false,
        	pwdObj: {}
        }
    },
    mounted() {
        this.$nextTick(function() {
        	this.sidebarH = this.winH - 60;
        	
        	this.getMenu();
        });
    },
    methods: {
    	//菜单展开或收缩
    	handleMenu: function() {
    		this.hiddenMenu = !this.hiddenMenu;
    		this.viewLogo = !this.viewLogo;
    	},
	  	handleOpen: function(key, keyPath) {
//      	console.log(key, keyPath);
      	},
      	handleClose: function(key, keyPath) {
//      	console.log(key, keyPath);
      	},
      	//退出登录
      	handleExit: function() {
      		var that = this;
      		this.$confirm('确认退出吗?')
      		.then(function() {
      			localStorage.clear();
      			that.$router.push('/login');
      		})
      	},
      	//获取操作员可用菜单
      	getMenu: function() {
      		var that = this;
			var reqUrl = this.baseUrl + '/user/menus';
			var params = {
				userId: this.userInfo.userId,
				userType: this.userInfo.userTypeKey,
				token: this.token
			}
			this.$http.get(reqUrl, {params: params})
			.then(function(res) {
				if(!res) {
					return;
				}
				that.menuList = res.menuList;
 			});
      	},
      	//去修改密码
      	goUpdatePwd: function() {
      		this.dialogVisible = true;
      	},
      	handleCancle: function() {
      		this.dialogVisible = false;
      		this.pwdObj = {};
      	},
      	handleUpdatePwd: function() {
      		if(!this.pwdObj.oldPassword) {
      			this.$message('原密码不能为空');
      			return;
      		}
      		if(!this.pwdObj.newPassword) {
      			this.$message('新密码不能为空');
      			return;
      		}
      		if(!this.pwdObj.confirmPassword) {
      			this.$message('确认密码不能为空');
      			return;
      		}
      		if(this.pwdObj.newPassword != this.pwdObj.confirmPassword) {
      			this.$message('两次密码输入不一致');
      			return;
      		}
      		
      		this.pwdObj.token = this.token;
      		this.pwdObj.userId = this.userInfo.userId;
      		
      		var that = this;
			var reqUrl = this.baseUrl + '/user/password/modify';
			this.$http.post(reqUrl, this.pwdObj)
			.then(function(res) {
				if(!res) {
					return;
				}
				that.dialogVisible = false;
				that.pwdObj = {};
				that.$message('密码修改成功,请重新登录');
				window.localStorage.clear();
				that.$router.push('/login');
 			});
      	}
    }
}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style scoped>
/* header */
.header {
	width: 100%;
    margin: 0;
    border: 0;
    padding: 0;
    height: 60px;
    min-height: 60px;
    background: #2b3643;
}
.header .logo {
    float: left;
    width: 235px;
   	padding-left: 15px;
}
.header .logo .logo-img {
	display: inline-block;
	/*width: 120px;*/
	width: auto;
    height: 100%;
    /*line-height: 30px;*/
    margin-right: 58px;
    margin-top: 10px;
}
.header .logo .logo-img > img {
	width: 100%;
	height: 100%;
	vertical-align: top;
}
.header .icon-list {
	font-size: 24px;
	margin-top: 20px;
	cursor: pointer;
}
.header .data {
	float: right;
	height: 60px;
	line-height: 60px;
	padding-right: 20px;
}
.header .data .user-data {
	display: inline-block;
}
.header .data .user-data > img {
	width: 29px;
	height: 29px;
	border-radius: 29px;
	vertical-align: middle;
	overflow: hidden;
}
.header .data .user-data .el-dropdown-link {
	color: #c6cfda;
	margin-left: 5px;
}
.header .data .icon-signout {
	/*font-size: 26px;*/
	vertical-align: middle;
	color: #79869a;
	margin-left: 15px;
	cursor: pointer;
}    
.header .data .icon-signout:hover {
	text-decoration: underline;
}
/* header END */
.nav {
	display: flex;
}
/* sidebar */
.sidebar {
	overflow-y: auto;
}
.el-menu {
	width: 235px;
	height: 100%;
    border-right: none !important;
}
.el-menu.el-menu--collapse {
	width: 65px;
}
.el-submenu__title i.iconfont {
	font-size: 18px;
	top: 0px !important;
}
/* sidebar END */
/* content */
.content {
	flex: 1;
	height: 100%;
	background: #eef1f5;
	overflow-y: auto;
}
/* content END */
.col-lg-pull-5 {
	margin-bottom: 10px;
}
.col-lg-pull-5 span {
	display: inline-block;
	width: 80px;
	text-align: right;
}
.menuIcon{
	width: 19px;
	height: 19px;
	margin-right: 3px;
}
.menuIcon>img{
	width: 19px;
	height: 19px;
	vertical-align: text-top;
}
</style>
