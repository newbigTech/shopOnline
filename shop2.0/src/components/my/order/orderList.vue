<!-- 
    订单列表 
-->
<template>
    <div id="orderList" ref="orderMain">
        <!--<div class="headerBg">
            <header-bar :isWhite="false"></header-bar>
        </div>-->
        <mt-navbar v-model="selected" @click.native="_changeCurrentTab">
            <mt-tab-item id="all">全部</mt-tab-item>
            <mt-tab-item id="received">待收货</mt-tab-item>
            <mt-tab-item id="paying">待付款</mt-tab-item>
            <mt-tab-item id="appraise">待评价</mt-tab-item>
            <mt-tab-item id="complete">已完成</mt-tab-item>
            <mt-tab-item id="return">已取消</mt-tab-item>
        </mt-navbar>
        <div class="order-item" v-for="order, _orderIndex in orderList" :key="_orderIndex">
            <div class="order-title">
                <div class="shop"><i class="icon iconfont icon-fangzi"></i><span class="name">{{ onGood.title }}</span></div>
                <div class="order-state">
                    <template v-if="order.totalStatus=='3' || order.totalStatus=='7'"><span class="received">待收货</span></template>
                    <template v-else-if="order.totalStatus=='1'"><span class="paying">待付款</span></template>
                    <template v-else-if="order.totalStatus=='4' || order.totalStatus=='5'"><span class="appraise">交易完成</span></template>
                    <template v-else-if="order.totalStatus=='2'"><span class="return">订单已取消</span></template>
                    <template v-else><span class="complete">已完成</span></template>
                </div>
            </div>
            <template v-for="goods in order.orderNoList">
                <div class="order-info" @click="$router.push({ name: 'MyOrderInfo', query: { id: goods.totalOrdersNo } })" v-for="gd in goods.ordersInfoList">
                    <div class="order-cover"> <img :src="gd.proSimg" alt=""> </div>
                    <div class="order-describe">
                        <div class="order-name">{{ gd.proName }}</div>
                        <p class="order-desc">商品分类: {{ gd.proColorName }}, 尺码:{{ gd.proSizesName }}</p>
                        <p class="order-help"><span class="key">七天退货</span></p>
                    </div>
                    <div class="order-price-box">
                        <div class="order-price">￥ {{ gd.productPrice }} </div>
                        <div class="order-price-old">￥{{ gd.productOrigiPrice }}</div>
                        <div class="order-number">x {{ gd.count }}</div>
                    </div>
                </div>
            </template>
            <div class="order-desc-box">
                <span class="title">共</span><span class="val">{{ order.totalCount }}</span><span class="title">件商品</span>
                <span class="title strong">合计: </span><span class="val strong">￥{{ order.totalAmount }}</span>
            </div>
            <div class="order-system">
                <!-- 订单状态对应功能 -->
                <!-- {{order.totalStatus}}, {{order.orderNoList.length}} -->
                <template v-if="order.totalStatus=='1'">
                    <!-- 待付款: 1.生成已订单 -->
                    <a href="javascript:;" @click="_closeOrder(order)" class="order button paying">取消订单</a>
                    <a href="javascript:;" @click="_payOrder(order)" class="order button active paying">去支付</a>
                </template>
                <template v-else-if="order.totalStatus=='2'">
                    <!-- 已取消: 2.订单已取消 -->
                    <a href="javascript:;" @click="_delOrder(order)" class="order button return">删除订单</a>
                </template>
                <template v-else-if="order.totalStatus=='3' || order.totalStatus=='7'">
                    <!-- 待收货: 3.订单已付款, 7.订单已发货 -->
                    <template v-if="order.orderNoList.length==1">
                        <a href="javascript:;" @click="_eveReceived(order.orderNoList[0])" class="order button received">查看物流</a>
                    </template>
                    <a href="javascript:;" @click="_confirmReceived(order)" class="order button active received">确认收货</a>
                </template>
                <template v-else-if="order.totalStatus=='4' || order.totalStatus=='5' || order.totalStatus=='6'">
                    <a href="javascript:;" @click="_goAppraise(order)" class="order button appraise" v-if="order.totalStatus=='4'">立即评价</a>
                    <!-- 待评价: 4.订单已完成 -->
                    <a href="javascript:;" @click="_goAppraise(order)" class="order button appraise" v-else-if="order.totalStatus=='5'">追加评价</a>
                    <!-- 待评价: 5.订单已评价 -->
                    <a href="javascript:;" @click="_delOrder(order)" class="order button complete" v-else-if="order.totalStatus=='6'">删除订单</a>
                    <!-- 已完成: 6.订单已追评 -->
                    <template v-if="order.orderNoList.length==1">
                        <!-- 单个商品 => 待评价: 4.订单已完成, 待评价: 5.订单已评价, 已完成: 6.订单已追评 -->
                        <template v-if="order.orderNoList[0].ordersInfoList[0].isReturns == '0'">
                            <a href="javascript:;" @click="_afterSales(order.orderNoList[0])" class="order button appraise"> 申请售后 </a>
                        </template>
                        <template v-else-if="order.orderNoList[0].ordersInfoList[0].isReturns == '1'">
                            <a href="javascript:;" @click="_afterSales(order.orderNoList[0])" class="order button appraise"> 修改售后 </a>
                        </template>
                        <a href="javascript:;" @click="_againOrder(order)" class="order button active complete">再次购买</a>
                    </template>
                </template>
            </div>
        </div>
        <template v-if="orderList.length == 0">
            <div class="error-box">
                <div class="error-icon"><img :src="'./static/img/noOrder.png'" alt=""></div>
                <div class="error-help">您还没有相关的订单</div>
                <!-- <div class="goshopping"> <router-link class="goBtn" :to="{name:'Index'}">去挑选</router-link> </div> -->
            </div>
        </template>
        <div class="footer-box" v-if="orderList.length >= page.size">
            <template v-if="showMore">
                <div class="more" @click="_getMore">点击加载更多</div>
            </template>
            <template v-else>
                <div class="more" @click="_getMore">没有更多了</div>
            </template>
        </div>
        <!-- 支付密码框 -->
        <pay-pop :viewPop="popupVisible" @result="_getPassword" @result2="_closePop"></pay-pop>
    </div>
</template>
<script>
//import headerBar from '@/components/header/headerBar'
import payPop from '@/components/tool/payPop' //密码支付弹框
import { MessageBox, Indicator } from 'mint-ui';
export default {
    components: {
        //      'header-bar': headerBar,
        'pay-pop': payPop
    },
    name: 'orderList',
    data() {
        return {
            pageTitle: '我的订单', // 页面标题
            pageQuery: null, // 页面参数
            serverData: [], // 服务器数据
            selected: null, // TAB选项
            orderList: [], // 当前列表数据
            page: { total: 0, current: 1, size: 10 }, // 页面参数
            tabStatus: null,
            showMore: false, //是否展示更多
            popupVisible: false, // 支付界面
            currOrderObj: {}, //当前订单对象
            closeFlag: false
        }
    },
    mounted() {
        document.title = this.pageTitle;
        this.pageQuery = this.$route.query;
        var _type = localStorage.getItem('_orderTab');
        if (_type != null) {
            this.selected = _type;
        } else {
            this.selected = this.pageQuery.type;
        }
        this._changeCurrentTab();
        this.$nextTick(function() {
            var _loginWay = localStorage.getItem('_loginWay');
            if (_loginWay == 'weixin') {
                this.getWxInfo(); //微信授权后获取微信用户信息
            }
        });
    },
    destroyed() {
        document.title = ''; // 注销页面标题
        localStorage.removeItem('_orderTab'); // 清空缓存TAB选项
    },
    methods: {
        // 切换 TAB => ok
        _changeCurrentTab() {
            switch (this.selected) {
                case 'all':
                    this.tabStatus = '';
                    break;
                case 'received': // 待收货: 3.订单已付款, 7.订单已发货
                    this.tabStatus = '3';
                    break;
                case 'paying': // 待付款: 1.生成已订单
                    this.tabStatus = '1';
                    break;
                case 'appraise': // 待评价: 4.订单已完成, 5.订单已评价
                    this.tabStatus = '4';
                    break;
                case 'complete': // 已完成: 6.订单已追评
                    this.tabStatus = '6';
                    break;
                case 'return': // 已取消: 2.订单已取消
                    this.tabStatus = '2';
                    break;
            }
            this.page.current = 1;
            this._getData();
            localStorage.setItem('_orderTab', this.selected); // 缓存当前 tab 选项
        },

        // 获取订单列表数据 => ok
        _getData() {
            var _that = this,
                _params;
            _params = {
                customerCode: this.userInfo.customerCode,
                token: this.token,
                pageNum: this.page.current,
                pageSize: this.page.size
            };
            if (this.tabStatus != '') { _params.orderStatus = this.tabStatus } // 全部订单, 不传 tabStatus
            this.$http.get(this.baseUrl + '/order/findOrderByCustomerCode', { params: _params }).then(function(res) {
                if (!res) { return }
                _that.page.total = res.total;
                if (_that.page.current == 1) { _that.orderList = res.orderList; } else { // 第一页数据
                    for (var i = 0; i < res.orderList.length; i++) { _that.orderList.push(res.orderList[i]) } //第一页以后数据
                }
                if (_that.orderList.length < _that.page.total) { _that.showMore = true } else { // 显示更多按钮
                    _that.showMore = false // 不显示更多按钮
                }
            });
        },

        // 获取更需数据 => ok
        _getMore() {
            if (this.orderList.length < this.page.total) {
                this.page.current++;
                this._getData();
            }
        },

        // 确认收货 => ok
        _confirmReceived(_orderObj) {
        	var _that = this;
            MessageBox.confirm('确定执行此操作[确认收货]?').then(function(action) {
                _that.$http.post(_that.baseUrl + '/order/completeOrder', { token: _that.token, customerCode: _that.userInfo.customerCode, totalOrdersNo: _orderObj.totalOrdersNo })
                .then(function(res) {
                    if (!res) { return } _that.$toast('收货成功!');
                    _that._getData();
                });
            }).catch(function() { _that.$toast('放弃 收货操作!') });
        },

        // 取消订单 => ok
        _closeOrder(_orderObj) {
        	var _that = this;
            MessageBox.confirm('确定执行此操作[取消订单]?').then(function(action) {
                _that.$http.post(_that.baseUrl + '/order/cancelOrder', { token: _that.token, customerCode: _that.userInfo.customerCode, totalOrdersNo: _orderObj.totalOrdersNo }).then(function(res) {
                    if (!res) { return } _that.$toast('取消成功!');
                    _that._getData();
                });
            }).catch(function() { _that.$toast('放弃 取消操作!') });
        },

        // 删除订单 => ok
        _delOrder(_orderObj) {
        	var _that = this;
            MessageBox.confirm('确定执行此操作[删除订单]?').then(function(action) {
                _that.$http.post(_that.baseUrl + '/order/deleteOrder', { token: _that.token, customerCode: _that.userInfo.customerCode, totalOrdersNo: _orderObj.totalOrdersNo }).then(function(res) {
                    if (!res) { return } _that.$toast('删除成功!');
                    _that._getData();
                });
            }).catch(function() { _that.$toast('放弃 删除操作!') });
        },

        // 去评价 ok
        _goAppraise(_orderObj) {
            // localStorage.setItem('_orderAppraise', JSON.stringify(_orderObj)); // 缓存需要评价的订单
            this.$router.push({
                name: 'MyOrderAppraise',
                query: {
                    No: _orderObj.totalOrdersNo,
                    status: _orderObj.totalStatus
                }
            });
        },

        // 再次购买 ok
        _againOrder(_orderObj) {
            this.$router.push({ name: 'PdDetails', query: { proCode: _orderObj.orderNoList[0].ordersInfoList[0].productId } })
        },

        // 售后服务 ok
        _afterSales(_orderObj) {
            localStorage.setItem('_afterSales', JSON.stringify(_orderObj)); // 缓存售后子订单
            this.$router.push({ name: 'MyAfterSales', query: { id: _orderObj.ordersNo } });
            // this.$router.push({ name: 'MyAfterSales', query: { id: _orderObj.orderNoList[0].ordersNo } });
        },

        // 支付订单
        _payOrder(_orderObj) {
            console.log(JSON.stringify(_orderObj));
            this.currOrderObj = _orderObj;
            if (_orderObj.totalFinalAmount == 0) { //积分支付
                if (!this.userInfo.payPassword) { //没有设置支付密码时
                    var that = this;
                    MessageBox({ message: '您还未设置支付密码', confirmButtonText: '立即前往', showCancelButton: true }).then(function(action) {
                        if (action == 'confirm') { return that.$router.push('/setPayPassword') }
                    })
                } else {
                    this.$refs.orderMain.style.height = (this.clientH * 10) + 'px';
                    this.$refs.orderMain.style.overflow = 'hidden';
                    this.popupVisible = true;
                }
            } else {
                var comOrderInfo = {
                    totalOrdersNo: _orderObj.totalOrdersNo, //订单编号
                    finalAmount: _orderObj.totalFinalAmount //支付金额
                }
                localStorage.setItem('comOrderInfo', JSON.stringify(comOrderInfo));
                this.$router.push('/choosePayWay');
                // if (this.userInfo.wxId == null || this.userInfo.wxId == '') {
                //     localStorage.setItem('_loginWay', 'weixin');
                //     var redirect_uri = this.onlineUrl + '/userOrderList?type=paying';
                //     this.handleWxAuthor(redirect_uri);
                // } else {
                //     this.wxPay(_orderObj);
                // }
            }
        },

        // 获取从子组件传来的密码值
        _getPassword(val) {
            var that = this;
            this.popupVisible = false;
            Indicator.open({
                text: '支付中...',
                spinnerType: 'fading-circle'
            });
            this.$refs.orderMain.removeAttribute('style');
//          this.$refs.orderMain.style.height = 'auto';
//          this.$refs.orderMain.style.overflow = 'auto';

            this.pointPay(val);
        },

        //积分支付
        pointPay(val) {
            var that = this;
            var reqUrl = this.baseUrl + '/order/updateOrder';
            var params = {
                totalOrdersNo: this.currOrderObj.totalOrdersNo, //总订单号
                payPassword: val, //支付密码
            }
            this.$http.post(reqUrl, params)
                .then(function(res) {
                    Indicator.close();
                    this.$refs.orderMain.removeAttribute('style');
//                  that.$refs.orderMain.style.height = 'auto';
//                  that.$refs.orderMain.style.overflow = 'auto';
                    if (res.code == '9998' && res.description == '支付密码错误次数过多,请稍后再试') { //支付次数过多)
                        that.$router.push({
                            query: {
                                'id': that.currOrderObj.totalOrdersNo, //订单id
                                'type': '1', //生成订单 未付款

                            },
                            path: '/userOrderInfo'
                        })
                        return;
                    }
                    if (!res) {
                        setTimeout(function() {
                            that.popupVisible = true;
                        }, 1000);
                        return;
                    }
                    if (res.result != 'success') {
                        setTimeout(function() {
                            that.popupVisible = true;
                        }, 1000)
                        that.$toast('支付失败');
                        return;
                    }
                    that.$router.push({
                        path: '/buySuccess',
                        query: { 'orderId': that.currOrderObj.totalOrdersNo }
                    });
                });
        },

        //微信支付
        wxPay(_orderObj) {
            var that = this;
            var params = {
                totalOrdersNo: this.currOrderObj.totalOrdersNo,
                finalAmount: this.currOrderObj.totalFinalAmount
            }
            this.$http.post(this.baseUrl + '/order/weixinPay', params)
                .then(function(res) {
                    if (!res) {
                        return;
                    }
                    var obj = {
                        "appId": res.appId, //公众号名称，由商户传入     
                        "timeStamp": res.timeStamp, //时间戳，自1970年以来的秒数     
                        "nonceStr": res.nonceStr, //随机串     
                        "package": res.package, //微信支付ID
                        "signType": res.signType, //微信签名方式：     
                        "paySign": res.paySign //微信签名 
                    }
                    var path = that.onlineUrl + '/buySuccess?orderId=' + that.currOrderObj.totalOrdersNo;
                    that.getWxPay(obj, path);
                });
        },

        // 关闭弹框
        _closePop(val) {
        	this.$refs.orderMain.removeAttribute('style');
        	document.body.removeAttribute('style');
//          this.$refs.orderMain.style.height = 'auto';
//          this.$refs.orderMain.style.overflow = 'auto';
//          document.body.style.height = 'auto';
//          document.body.style.overflow = 'auto';
            //没有支付成功时   进入订单详情页
            this.popupVisible = val;
            this.$toast('支付未成功');
        },

        // 查看物流
        _eveReceived(_orderObj) {
            this.$router.push({
                name: 'MyOrderLogistics',
                query: {
                    id: _orderObj.totalOrdersNo,
                    sku: _orderObj.ordersInfoList[0].proSkuNo,
                    address: _orderObj.acceptAddress
                }
            });
        },
    }
}

</script>
<style>
@import './order.css';

</style>
