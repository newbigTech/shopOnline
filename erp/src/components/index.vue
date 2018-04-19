<!-- 首页 -->
<template>
    <div class="index">
        <!-- header -->
        <div class="header">
            <div class="logo">
                <div class="logo-img" v-if="viewLogo" @click="goHome">
                   <img src="../../static/img/bg-title.png" />
                </div>
                <span class="el-dropdown-link">欢迎您，{{userInfo.idCardName}}</span>
            </div>
            <div class="data">
                <span class="iconfont icon-signout" @click="goUpdatePwd">修改密码</span>
                <span class="iconfont icon-signout" @click="handleExit">退出登录</span>
            </div>
        </div>
        <!-- header END -->
        <div class="nav container-fluid" :style="{height: sidebarH + 'px'}">
            <!-- sidebar -->
            <div class="sidebar">
                <!-- 静态文件里的路由 -->
                <!-- <el-menu :router="routerFlag" :collapse="hiddenMenu" background-color="#fff" text-color="#485a6a" active-text-color="#5b9bd1">
                    <template v-for="(item, index) in $router.options.routes" v-if="item.type == 'sider'">
                        <el-submenu :index="(index).toString()">
                            <template slot="title"> <span slot="title">{{item.title}}</span> </template>
                            <template v-for="(single, index) in (item.children)" v-if="single.type == 'sider'">
                                {{single.path}}
                                <el-menu-item :index="single.path">
                                <el-menu-item :index="single.path" :route="{ path: single.path, query : { id : userInfo.id }}">
                                    <template v-if="single.name == 'operationList'">
                                        <span v-if="userInfo.userType == 0"> 平台管理 </span>
                                        <span v-if="userInfo.userType == 1"> 运营中心管理 </span>
                                        <span v-if="userInfo.userType == 2"> 代理商管理 </span>
                                        <span v-if="userInfo.userType == 3"> 业务员管理 </span>
                                    </template>
                                    <template v-else>
                                        {{single.title}}
                                    </template>
                                </el-menu-item>
                            </template>
                        </el-submenu>
                    </template>
                </el-menu> -->
                <!-- 获取动态菜单 -->
                <el-menu :router="routerFlag" :unique-opened="routerFlag" :collapse="hiddenMenu"
                     background-color="#fff" text-color="#485a6a" 
                     active-text-color="#5b9bd1">
                  <template v-for="(item, index) in menuList"  v-if="item.is_parent == 1">
                      <el-submenu :index="(index).toString()">
                        <template slot="title">
                            <span slot="title">{{item.menu_name}}</span>
                        </template>
                        <template v-for="(single, index) in (item.children)">
                            <el-menu-item :index="single.menu_url" :route="{ path: single.menu_url, query : { id : userInfo.id }}">
                                {{single.menu_name}}
                            </el-menu-item>
                        </template>
                      </el-submenu>
                  </template>
                </el-menu>
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
            <div class="dialog-item">
                <span>手机号：</span>
                <span>{{userInfo.phone}}</span>
            </div>
            <div class="dialog-item">
                <span>旧密码：</span>
                <input type="password" placeholder="请输入旧密码" v-model="pwdObj.oldPwd">
            </div>
            <div class="dialog-item">
                <span>新密码：</span>
                <input type="password" placeholder="请输入新密码" v-model="pwdObj.newPwd">
            </div>
            <div class="dialog-item">
                <span>确认密码：</span>
                <input type="password" placeholder="请确认密码" v-model="pwdObj.confirmPwd">
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
            viewLogo: true, //显示logo
            hiddenMenu: false, //是否展开菜单
            routerFlag: true,
            sidebarH: 0, //侧边栏高度
            username: 'Nike',
            menuList: [], //菜单数组
            dialogVisible: false,
            pwdObj: { 'oldPwd': '', 'newPwd': '', 'confirmPwd': '' }
        }
    },
    mounted() {
        this.$nextTick(function() {
            this.sidebarH = this.winH - 75;
            this.getMenu();
        });
    },
    methods: {
        //根据用户获取菜单
        getMenu() {
            var that = this,
                reqUrl = this.baseUrl + '/erp/user/findMenu',
                params = { userId: this.userInfo.id };
            this.$http.get(reqUrl, { params: params }).then(function(res) {
                if (!res) { return; }
                that.menuList = res;
            });
        },
        //菜单展开或收缩
        handleMenu() {
            this.hiddenMenu = !this.hiddenMenu;
            this.viewLogo = !this.viewLogo;
        },
        //退出登录
        handleExit() {
            var that = this;
            this.$confirm('确认退出吗?').then(function() {
                localStorage.clear();
                that.$router.push('/login');
            });
        },
        goUpdatePwd() {
            this.dialogVisible = true;
        },
        //修改密码取消
        handleCancle() {
            this.dialogVisible = false;
            this.pwdObj = { 'oldPwd': '', 'newPwd': '', 'confirmPwd': '' };
        },
        //确认修改密码
        handleUpdatePwd() {
            if (this.pwdObj.oldPwd == '') {
                this.$message('请输入旧密码');
                return;
            }
            if (this.pwdObj.newPwd == '') {
                this.$message('请输入新密码');
                return;
            }
            if (this.pwdObj.confirmPwd == '') {
                this.$message('请确认密码');
                return;
            }
            if (this.pwdObj.confirmPwd != this.pwdObj.newPwd) {
                this.$message('两次密码输入不一致');
                return;
            }
            var that = this,
                reqUrl = this.baseUrl + '/erp/user/update',
                params = { phone: this.userInfo.phone, oldPwd: this.pwdObj.oldPwd, pwd: this.pwdObj.newPwd };
            this.$http.post(reqUrl, params).then(function(res) {
                if (!res) { return; }
                that.$message('密码修改成功,请重新登录');
                window.localStorage.clear();
                that.$router.push('/login');
            });
        },
        //点击logo 回到首页
        goHome() {
            if(this.userInfo.userType != 3) { //0平台  1运营中心   2代理商
                this.$router.push('/home');
            }
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
    height: 75px;
    min-height: 75px;
    background: #fff;
}
.header .logo {
    float: left;
    /*width: 235px;*/
    line-height: 60px;
    padding-left: 15px;
}
.header .logo .logo-img {
    display: inline-block;
    width: 300px;
    height: 100%;
    /*line-height: 30px;*/
    margin-right: 58px;
    margin-top: 10px;
    cursor: pointer;
}
.header .logo .logo-img>img {
    width: 100%;
    height: 30px;
    vertical-align: middle;
    margin-top: -6px;
}
.header .icon-list {
    font-size: 24px;
    margin-top: 20px;
    cursor: pointer;
}
.header .data {
    float: right;
    height: 75px;
    line-height: 75px;
    padding-right: 20px;
}
.header .data .user-data {
    display: inline-block;
}
.header .data .user-data>img {
    width: 29px;
    height: 29px;
    border-radius: 29px;
    vertical-align: middle;
    overflow: hidden;
}
.header .data .user-data .el-dropdown-link {
    color: #3598dc;
    margin-left: 5px;
}
.header .data .icon-signout {
    vertical-align: middle;
    color: #aaa;
    margin-left: 15px;
    cursor: pointer;
}
.header .data .icon-signout:hover {
    text-decoration: underline;
}
/* header END */

.nav {
    display: flex;
    /*background: #eef1f5;*/
    background: #e9ecf3;
}
/* sidebar */

.sidebar {
    overflow-y: auto;
    margin: 20px;
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
    /*background: #eef1f5;*/
    overflow-y: auto;
    padding: 20px 0;
}
/* content END */

.dialog-item {
    margin-bottom: 20px;
}
.dialog-item span {
    display: inline-block;
    width: 100px;
    text-align: right;
}
</style>
