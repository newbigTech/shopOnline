<!-- 三级页面导航栏 -->
<template>
    <div class="navbar" v-if="viewNavbar">
        <div :class="['navbar-con '] + [ showNavbar ? 'active' : '' ]">
            <div class="title">
                <img src="/static/img/text-navbar.png" v-if="!showNavbar" @click="handleTabs" />
                <img src="/static/img/text-navbar2.png" v-if="showNavbar" @click="handleTabs" />
            </div>
            <div class="con"><!--  v-if="showNavbar" -->
                <template v-for="item in navbarList">
                    <div class="navbar-item" @click="handleLink(item.title)">
                        <i :class="['iconfont '] + [item.iconName]"></i>
                        <span>{{item.title}}</span>
                    </div>
                </template>
            </div>
        </div>
        <div class="bg-navbar" :style="{ height: (clientH * 10) + 'px'}" v-if="showNavbar"></div>
    </div>
</template>
<script>
export default {
    name: 'navbar', // 结构名称
    data() {
        return {
            showNavbar: false, //是否展开导航栏
            viewNavbar: true, //是否显示快速导航栏
            navbarList: [
                { 'iconName': 'icon-zhuye-1', 'activeIconName': 'icon-zhuye-', 'title': '首页' },
                { 'iconName': 'icon-shengji-', 'activeIconName': 'icon-shengji21', 'title': '活动' },
                { 'iconName': 'icon-fenlei-1', 'activeIconName': 'icon-fenlei-', 'title': '分类' },
                { 'iconName': 'icon-wode-1', 'activeIconName': 'icon-wode-', 'title': '我的' },
                { 'iconName': 'icon-gouwuche', 'activeIconName': 'icon-gouwuche', 'title': '购物车' }
            ],
            topH: 0
        }
    },
    created() {
        var that = this;
        window.addEventListener("popstate", function(e) {
            that.resetInfo();
            that.showNavbar = false;
        }, false);
        this.resetInfo();
    },
    mounted() {
        this.$nextTick(function() {
            var routeName = this.$route.name;
            if (routeName == 'Index' || routeName == 'areaIndex' ||
                routeName == 'FirstClass' || routeName == 'MyUser') { //首页 /升级首页/分类首页/个人中心首页
                this.viewNavbar = false;
            } else {
                this.viewNavbar = true;
            }


        });
    },
    watch: {
        $route(to) {
            var routeName = to.name;
            if (routeName == 'Index' || routeName == 'areaIndex' ||
                routeName == 'FirstClass' || routeName == 'MyUser') { //首页 /升级首页/分类首页/个人中心首页
                this.viewNavbar = false;
            } else {
                this.viewNavbar = true;
            }
        }
    },
    methods: {
        resetInfo() {
            document.getElementById('app').style.position = null;
            document.getElementById('app').style.top = null;
        },
        handleTabs() {
            if (this.showNavbar == false) { //打开快速导航栏时，锁定屏幕
                var a = document.documentElement.scrollTop;
                var b = document.body.scrollTop;
                if (a == 0) {
                    this.topH = b;
                } else {
                    this.topH = a;
                }
                document.getElementById('app').style.position = 'fixed';
                document.getElementById('app').style.width = '100%';
                document.getElementById('app').style.top = '-' + this.topH + 'px';
            } else {
                document.getElementById('app').style.position = null;
                document.getElementById('app').style.top = null;
                document.body.scrollTop = document.documentElement.scrollTop = this.topH;
            }
            this.showNavbar = !this.showNavbar;
        },
        //链接
        handleLink(val) {
            this.showNavbar = false;
            document.getElementById('app').style.position = null;
            document.getElementById('app').style.top = null;
            document.body.scrollTop = document.documentElement.scrollTop = 0;

            if (val == '首页') {
                this.$router.push('/');
            } else if (val == '活动') {
                this.$router.push('/areaIndex');
            } else if (val == '分类') {
                this.$router.push('/firstClass');
            } else if (val == '我的') {
                this.$router.push('/user');
            } else {
                this.$router.push('/shoppingCart');
            }
        }
    }
}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style scoped>
.navbar {
    /*height: 7.0rem;*/
    border-radius: 8px 0px 0px 8px;
    font-size: 2.0rem;
}
.navbar-con {
    position: fixed;
    bottom: 13rem;
    right: -25.2rem;
    width: 29.7rem;
    min-height: 4rem;
    /*height: 12rem;*/
    transition: 0.2s right linear;
    z-index: 101;
}
.title {
    position: absolute;
    top: 0;
    right: 25.2rem;
    display: inline-block;
    width: 4.5rem;
    height: 4.0rem;
}

.title img {
    width: 100%;
    height: 100%;
    cursor: pointer;
}
.con {
    position: absolute;
    right: 0;
    top: -3.9rem;
    width: 25.2rem;
    /*height: 12rem;*/
    background: #fff;
    padding: 0.8rem 0;
    border-radius: 0.4rem 0px 0px 0.4rem;
}
.navbar-con.active {
    right: 0;
    transition: 0.2s right linear;
}

/*@keyframes animate1 {
    from {
        right: 0;
    }
    to {
        right: 10rem;
    }
}*/

.navbar-item {
    float: left;
    width: 19%;
    margin: 0.2rem 3% 0.2rem 3%;
    padding: 0.5rem 0;
    text-align: center;
    color: #666;
}

.navbar-item>i {
    display: block;
    font-style: normal;
    margin: 0 auto 0 auto;
    font-size: 2.2rem;
}

.navbar-item>span {
    color: #666;
    font-size: 1.0rem;
}

.navbar-item:hover,
.tabs-item.active {
    background: #eee;
    border-radius: 0.5rem;
}

.bg-navbar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background: rgba(0, 0, 0, 0.3);
    z-index: 100;
}

</style>
