<!-- 头部工具条 -->
<template>
    <div class="header-bar" ref="headerBar">
        <div id="publicHeader" :class="['nav ']+[isWhite ? 'white' : '']" v-if="!isHome" ref="publicNav">
            <div class="left">
                <span class="iconfont icon-home" @click="$router.push('/')">&#xe608;</span>
            </div>
            <div class="title">{{title}}</div>
            <div class="right">
                <span class="iconfont icon-search" @click="$router.push('/search')">&#xe616;</span>
                <span class="iconfont icon-shop" @click="goShop">&#xe64a;</span>
            </div>
        </div>
        <!-- 首页的头部 -->
        <div class="nav home-nav" v-if="isHome" ref="homeNav">
            <div class="left">
                <span class="iconfont icon-home" @click="handleMenu">&#xe740;</span>
            </div>
            <div class="search" @click="$router.push('/search')">
                <i class="iconfont">&#xe616;</i>
                <span>搜索商品</span>
            </div>
            <div class="right">
                <span class="iconfont icon-shop" @click="goShop">&#xe64a;</span>
                <span class="iconfont icon-msg" @click="goMsg">&#xe605;<i class="red-point">●</i></span>
            </div>
        </div>
        <!-- 一级分类 -->
        <div id="slideCon" class="bg-pop slide" :style="{height: (clientH * 10) + 'px', display: hidden}" @click="handleMenu">
            <div class="first-class" :style="{display: hidden}">
                <ul class="first-class-ul" >
                    <li v-for="item in classList" @click="handleClass(item)">{{item.className}}</li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'headerBar',
    props: {
        // 头部显示为白色 标识 
        isWhite: {
            type: Boolean,
            default: false
        },
        isHome: { //首页的头部
            type: Boolean,
            default: false
        },
    },
    data() {
        return {
            hidden: 'none',
            classList: [],
            headerBarDom: null,
            eTop: 0 //显示侧边栏  滚动条位置
        }
    },
    mounted() {
        this.$nextTick(function() {
        	
//          this.headerBarDom = document.getElementsByClassName('header-bar')[0];
            if (this.isHome) {
                this.$refs.headerBar.style.height = '4.5rem';
            } else {
                this.$refs.headerBar.style.height = '3.7rem';
            }
            window.addEventListener('scroll', this.changeHeader); //监听滚动事件
        })
    },
    methods: {
        //改变头部样式
        changeHeader() {
            var curHeight = (document.documentElement.scrollTop || document.body.scrollTop) * 0.1; 
            if (curHeight > 0 ) {  
                if(this.isHome) {
                    if(this.$refs.homeNav != undefined) {
                        this.$refs.homeNav.style.position = 'fixed';  
                    }
                } else {
                    if(this.$refs.publicNav != undefined) { 
                        this.$refs.publicNav.style.position = 'fixed';  
                    }
                }
            } else {  
                if(this.isHome) {
                    if(this.$refs.homeNav != undefined) {
                        this.$refs.homeNav.style.position = 'relative';  
                    }
                } else {
                    if(this.$refs.publicNav != undefined) {
                        this.$refs.publicNav.style.position = 'relative';  
                    }
                }
            } 
        },
        //出现左边菜单
        handleMenu: function() {
            if (this.hidden == 'block') {
                this.hidden = 'none';
                document.getElementById('app').style.position = null;
                document.getElementById('app').style.top = null;
                window.scrollTo(0, this.eTop);
            } else {
                //获取一级分类
                this.getFirstClass();
                
                this.hidden = 'block';
                this.eTop = window.pageYOffset;
                document.getElementById('app').style.position = 'fixed';
                document.getElementById('app').style.top = '-' + this.eTop + 'px';
            }
        },
        //跳到二级分类
        handleClass: function(item) {
            var query = {
                'firstClassId': item.classId
            }
            this.$router.push({
                query: query,
                path: '/secondClass'
            });
        },
        //去购物车
        goShop: function() {
            if (!this.hadLogin()) {
                return;
            }
            this.$router.push({ name: 'MyShoppingCart' })
        },
        //进入消息
        goMsg: function() {
            if (!this.hadLogin()) {
                return;
            }
            this.$router.push('/MessageCenter')
        },
         //获取一级分类
        getFirstClass: function() {
            var that = this;
            var reqUrl = this.baseUrl + '/productInfo/getProTypesByLv';
            var params = {
                lv: '1'
            }
            this.$http.get(reqUrl, { params: params })
            .then(function(res) {
                if (!res) {
                    return;
                }
                that.classList = res.types;
            });
        }
    }
}

</script>
<style scoped>
@import 'header.css'
</style>
