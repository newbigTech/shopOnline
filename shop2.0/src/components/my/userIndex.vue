<!-- 模型：我的 => 个人中心 -->
<template>
    <div class="MyUser" id="MyUser">
        <!--<header-bar :isWhite=" true "></header-bar>-->
        <!--<div class="headerBg"></div>-->
        <div id="information" class="seticon" v-if=" userDesc!= null ">
            <div class="box">
                <!--<div :class=" ['grade '] + [ userDesc.grade==1 ? 'yellow' : 'green' ]"><span>{{ userDesc.grade==1 ?' 普通' : 'Vip' }}</span></div>-->
                <div class="setting right" @click="$router.push({ name: 'MySetting' })"><i class="icon iconfont icon-shezhi"></i></div>
            </div>
            <div class="user info">
                <div :class=" ['header '] + [ userDesc.photoUrl==null || userDesc.photoUrl=='' ? 'default' : '' ]" @click="$router.push({ name: 'MyUserInfo' })">
                    <img :src=" userDesc.photoUrl==null || userDesc.photoUrl=='' ? userDesc.defaultImg : userDesc.photoUrl " alt="">
                </div>
                <div class="name" @click="$router.push({ name: 'MyUserInfo' })">
                    {{userDesc.nickName}}
                    <span class="sign">普通</span>
                </div>
                <div class="operate">
                    <span @click="$router.push('/moneyRecharge')"><i class="iconfont">&#xe624;</i>充值</span>
                    <span @click="$router.push('/withDraw')"><i class="iconfont">&#xe612;</i>提现</span>
                </div>
            </div>
            <div class="itemLists">
                <div class="item" v-for=" item, index in itemLists " :key=" index " @click="$router.push({ name: item.path })">
                    <div class="item-val">{{parseFloat( item.number ) > 100000000 ? Math.floor(parseFloat( item.number / 100000000 ) *100) / 100  + '亿' : (   parseFloat( item.number ) > 10000 ? Math.floor(parseFloat( item.number / 10000 ) *100) / 100 + '万' : item.number ) }} </div>
                    <div class="item-title">{{ item.title }}</div>
                    <span class="line"></span>
                </div>
            </div>
        </div>
        <!-- 我的升级 upgrade -->
        <div id="upgrade" class="seticon">
            <div class="title box">
                <div class="span inline-black">我的升级</div>
            </div>
            <div class="items state">
                <div class="item" @click="$router.push({ name: 'MyUpgrade'})">
                    <!--<span class="number upOrder" v-if="unPromotionOrders>0">{{unPromotionOrders}}</span>-->
                    <span class="number" :style="{'display': unPromotionOrders == 0 ? 'none':'block'}">{{unPromotionOrders}}</span>
                    <i class="icon iconfont icon-shengji"></i>
                    <div class="text name">升级订单</div>
                </div>
                <div class="item" @click="$router.push({ name: 'lotteryList'})">
                    <i class="icon iconfont icon-bangdan"></i>
                    <div class="text name">开奖榜单</div>
                </div>
                <div class="item" @click="$router.push({ name: 'upgadeRecord',query: {tabShow: 0}})">
                    <i class="icon iconfont icon-jilu"></i>
                    <div class="text name">升级记录</div>
                </div>
                <div class="item" @click="$router.push({ name: 'upgadeRecord',query: {tabShow: 1}})">
                    <i class="icon iconfont icon-icon-test"></i>
                    <div class="text name">红包记录</div>
                </div>
                <div class="item" @click="$router.push('/balance?type=4')">
                    <i class="icon iconfont icon-huigou006"></i>
                    <div class="text name">回收记录</div>
                </div>
            </div>
        </div>
        <!-- 我的订单 -->
        <div id="orders" class="seticon">
            <div class="title box">
                <div class="span inline-black">我的订单</div>
                <!--<router-link class="inline-black" :to="{ name: 'MyOrderList', query: { type: 'all' }}">查看订单 <i class="icon iconfont icon-return-copy"></i></router-link>-->
            </div>
            <div class="items state">
                <div class="item" @click="$router.push({ name: 'MyOrderList', query: { type: 'paying' }})">
                    <!--<span class="number" v-if="createOrderNum>0">{{createOrderNum}}</span>-->
                    <span class="number" :style="{'display': createOrderNum == 0 ? 'none':'block'}">{{createOrderNum}}</span>
                    <i class="icon iconfont icon-fukuan"></i>
                    <div class="text name">待付款</div>
                </div>
                <div class="item" @click="$router.push({ name: 'MyOrderList', query: { type: 'received' }})">
                	<!--<span class="number" v-if="payOrderNum>0">{{payOrderNum}}</span>-->
                	<span class="number" :style="{'display': payOrderNum == 0 ? 'none':'block'}">{{payOrderNum}}</span>
                    <i class="icon iconfont icon-truck"></i>
                    <div class="text name">待收货</div>
                </div>
                <div class="item" @click="$router.push({ name: 'MyOrderList', query: { type: 'appraise' }})">
                	<span class="number" :style="{'display': completeOrderNum == 0 ? 'none':'block'}">{{completeOrderNum}}</span>
                    <i class="icon iconfont icon-hua"></i>
                    <div class="text name">待评价</div>
                </div>
                <div class="item" @click="$router.push({ name: 'MyAfterSalesList'})">
                    <!--<span class="number" v-if="returnOrderNum>0">{{returnOrderNum}}</span>-->
                    <span class="number" :style="{'display': returnOrderNum == 0 ? 'none':'block'}">{{returnOrderNum}}</span>
                    <i class="icon iconfont icon-tuihuotuikuan"></i>
                    <div class="text name">退款/售后</div>
                </div>
                <div class="item" @click="$router.push({ name: 'MyOrderList', query: { type: 'all' } })">
                    <!--<span class="number"></span>-->
                    <i class="icon iconfont icon-dingdan1"></i>
                    <div class="text name">全部订单</div>
                </div>
            </div>
        </div>
        <!-- 我的服务 -->
        <div id="system" class="seticon">
            <div class="title box">
                <div class="span inline-black">我的服务</div>
            </div>
            <ul class="functions">
                <li class="item border-none" @click="$router.push({ name: 'MyReceivingAddress' })">
                    <i class="icon darkred iconfont icon-dizhi"></i>
                    <div class="name"><span>地址管理</span></div>
                </li>
                <li class="item border-none" @click="$router.push({ name: 'myCode' })" v-if="userInfo.isExtend == '1'">
                    <i class="icon blue iconfont icon-yaoqing"></i>
                    <div class="name"><span>邀请好友</span></div>
                </li>
                <li class="item border-none" @click="hanldleContact">
                    <i class="icon yellows iconfont icon-kefu"></i>
                    <div class="name">
                        <span>客服中心 </span>
                    </div>
                </li>
                <li class="item border-none" @click="$router.push({ name:'opinion' })">
                    <i class="icon purple iconfont icon-fankui"></i>
                    <div class="name"><span>意见反馈</span></div>
                </li>
                <li class="item border-none" @click="$router.push({ name:'helpCenter' })">
                    <i class="icon red iconfont icon-yiwen"></i>
                    <div class="name"><span>帮助中心</span></div>
                </li>
                <!--<li class="item border-none" @click="$toast('敬请期待')">
                    <i class="icon gray iconfont icon-jingqingqidai"></i>
                    <div class="name"><span>敬请期待</span></div>
                </li>-->
            </ul>
        </div>
        <index-bar :currTab="currTab"></index-bar>
    </div>
</template>
<script>
//import headerBar from '@/components/header/headerBar';
import indexBar from '@/components/tool/indexBar' //一级页面导航栏
export default {
    components: {
        //      'header-bar': headerBar,
        'index-bar': indexBar
    },
    name: 'userInfo',
    data() {
        return {
            currTab: '我的',
            scroll: '',
            userDesc: {
                accountAmount : 0,
                collectProductNum : 0,
                couponNum : 0,
                footNum : 0,
                nickName : '',
                defaultImg: '/static/img/header.png',
                photoUrl : '',
                pointAmount : 0,
                unPromotionOrders : 0,
            },
            itemLists: [
                { title: '余额', path: 'moneyIndex', number: 0 },
                { title: this.onGood.onUnit, path: 'MyIntegral', number: 0 },
                { title: '优惠券', path: 'Coupon', number: 0 },
                { title: '收藏', path: 'MyCollect', number: 0 },
                { title: '足迹', path: 'MyTrace', number: 0 }
            ],
            unPromotionOrders: 0, //未处理的升级订单数量
            payOrderNum: 0,
            createOrderNum: 0,
            completeOrderNum: 0,
            returnOrderNum: 0,
        }
    },
    mounted() {
        this.userInfo = JSON.parse(localStorage.getItem('userInfo')); //登录之后的用户信息
        this.token = localStorage.getItem('token'); //登录之后的token
        // this.getData();
        this.$nextTick(function() {
            document.title = '我的';
            this.getUserData();
        });
        // window.addEventListener('scroll', this.pageScroll);
    },
    methods: {
    	//v2.0 - 查询我的个人信息
    	getUserData() {
    		var that = this,
      			reqUrl = this.baseUrl + '/personInfo/findPersonInfo';
			this.$http.get(reqUrl)
			.then(function(res) {
				if(!res) { return; }
				that.userDesc = res;
				that.userDesc.grade = 1;
				that.userDesc.defaultImg = '/static/img/header.png';
				var couponNum = 0;
				if( res.couponNum != undefined) {couponNum = res.couponNum};
				that.itemLists = [
	           		{ title: '余额', path: 'moneyIndex', number: res.accountAmount },
	                { title: '积分', path: 'MyIntegral', number: res.pointAmount },
	                { title: '优惠券', path: 'Coupon', number: couponNum },
	                { title: '收藏', path: 'MyCollect', number: res.collectProductNum },
	                { title: '足迹', path: 'MyTrace', number: res.footNum }
	            ];
	            res.unPromotionOrders < 100 ? that.unPromotionOrders = res.unPromotionOrders : that.unPromotionOrders = '99+';//未处理的升级订单
	            that.getOrderMax();
 			});
    		
    	},
        // 添加足迹
        handleAddFoot(_footerList) {
            var _that = this,
                _productList = '';
            for (var i = 0; i < _footerList.length; i++) {
                if (i == _footerList.length - 1) {
                    _productList = _productList + _footerList[i].proCode;
                } else {
                    _productList = _productList + _footerList[i].proCode + ',';
                }
            }
            this.$http.post(this.baseUrl + '/myFootprint/addMyFootprint', {
                productId: _productList
            }).then(function(res) {
                if (!res) { return }
                if (res.result != 'success') { return }
                _that.getTrace(); // 获取我的足迹 
            });
        },
        // 获取个人 => 基本信息
        //      getData() {
        //          var _that = this;
        //          this.$http.get(this.baseUrl + '/customerInfo/getCustomerInfo', {
        //              params: { customerCode: this.userInfo.customerCode, token: this.token }
        //          }).then(function(res) {
        //              if (!res) { return _that.$router.push({ 'name': 'Login' }) }
        //              if (res == 0) { return _that.$router.push({ 'name': 'Login' }) }
        //              if (res.nickName == null) { res.nickName = '请修改昵称' }
        //              _that.userDesc = res;
        //              _that.userDesc.grade = 1;
        //              _that.userDesc.defaultImg = '/static/img/header.png';
        //              _that.getMoney();//我的余额
        //              _that.getIntegral(); // 我的积分
        //              _that.getCollect(); // 我的收藏
        //              var _footerList = JSON.parse(localStorage.getItem('_myFootprint'));
        //              if (_footerList != null) {
        //                  _that.handleAddFoot(_footerList); // 添加我的足迹
        //              } else {
        //                  _that.getTrace(); // 获取我的足迹 
        //              }
        //              _that.getOrderMax(); // 我的订单
        //          });
        //      },
        // 获取我的 => 余额
        //      getMoney() {
        //          var that = this;
        //          this.$http.get(this.baseUrl + '/account/getMyAccount').then(function(res) {
        //              if (!res) { return }
        //              that.itemLists[0].number = res.accountAmount;
        //          });
        //      },
        //      // 获取我的 => 积分
        //      getIntegral() {
        //          var that = this;
        //          this.$http.get(this.baseUrl + '/mypoint/select', {
        //              params: { customerCode: this.userInfo.customerCode, token: this.token }
        //          }).then(function(res) {
        //              if (!res) { return }
        //              that.itemLists[1].number = res.pointAmount;
        //          });
        //      },
        //      // 获取我的 => 收藏
        //      getCollect() {
        //          var that = this;
        //          this.$http.get(this.baseUrl + '/collectProduct/getCollectProduct', {
        //              params: { customerCode: this.userInfo.customerCode, token: this.token, pageNum: 1, pageSize: 10 }
        //          }).then(function(res) {
        //              if (!res) { return }
        //              that.itemLists[2].number = res.total;
        //          });
        //      },
        //      // 获取我的 => 足迹
        //      getTrace() {
        //          var that = this;
        //          this.$http.get(this.baseUrl + '/myFootprint/getMyFootprint', {
        //              params: { customerCode: this.userInfo.customerCode, token: this.token, pageNum: 1, pageSize: 10 }
        //          }).then(function(res) {
        //              if (!res) { return }
        //              that.itemLists[2].number = 0;
        //              for (var i = 0; i < res.list.length; i++) {
        //                  that.itemLists[3].number = that.itemLists[2].number + res.list[i].footprintList.length;
        //              }
        //          });
        //      },
        // 获取我的 => 订单
        getOrderMax() {
            var that = this;
            this.$http.get(this.baseUrl + '/order/countOrderByCustomerCode', {
                params: { customerCode: this.userInfo.customerCode, token: this.token }
            }).then(function(res) {
                res.payOrderNum < 100 ? that.payOrderNum = res.payOrderNum : that.payOrderNum = '99+'; //待收货订单数量
                res.createOrderNum < 100 ? that.createOrderNum = res.createOrderNum : that.createOrderNum = '99+';//待付款订单数量
                res.completeOrderNum < 100 ? that.completeOrderNum = res.completeOrderNum : that.completeOrderNum = '99+';//待评价订单数量
                res.returnOrderNum < 100 ? that.returnOrderNum = res.returnOrderNum : that.returnOrderNum = '99+';//退货的订单数量
            });
        },
        // 页面滚动轴事件
        pageScroll() {
            this.scroll = document.documentElement.scrollTop || document.body.scrollTop;
            if (this.scroll == 0) {
                document.getElementById('publicHeader').setAttribute('class', 'nav white');
            } else {
                document.getElementById('publicHeader').setAttribute('class', 'nav');
            }
        }
    },
    beforeDestroy() {
        window.removeEventListener('scroll', this.pageScroll);
        localStorage.removeItem('_myFootprint')
    },
    destroyed() {
        window.removeEventListener('scroll', this.pageScroll);
        localStorage.removeItem('_myFootprint')
    }
}

</script>
<style scoped>
@import './userIndex.css';

</style>
