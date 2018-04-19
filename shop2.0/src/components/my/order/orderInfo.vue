<!-- 订单详情 -->
<template>
    <div id="orderInfo">
        <!--<div class="headerBg">
            <header-bar :isWhite="false"></header-bar>
        </div>-->
        <template v-if="orderInfo != null">
            <div class="order-state-box" v-if="orderDesc != null">
                <div class="icon state"> <img :src="orderDesc.icon" alt=""> </div>
                <div class="state-help">{{orderDesc.state}}</div>
                <div class="state-help-text" v-if="orderInfo.ordersState == 1">
                    还剩 {{ 0 >= orderInfo.orderList[0].remainCancelTime ? 0 : orderInfo.orderList[0].remainCancelTime }} 小时自动关闭
                </div>
                <div class="state-help-text" v-else>{{orderDesc.help}}</div>
            </div>
            <div class="order-box">
                <template v-if="logistics != null && orderInfo.ordersState >= 3">
                    <div class="order-received" @click="_goLogisticsInfo(orderInfo.orderList[0])">
                        <div class="cover"><i class="icon iconfont icon-daishouhuo"></i></div>
                        <div class="description" v-if="logistics.state == '1'">
                            <div class="state on">卖家发货</div>
                            <div class="createTime">{{logistics.time}}</div>
                        </div>
                        <div class="description" v-if="logistics.state == '2' || logistics.state == '3'">
                            <div class="state">{{logistics.text}}</div>
                            <div class="createTime">{{logistics.time}}</div>
                        </div>
                        <div class="description" v-else>
                            <div class="state noting">{{logistics.text}}</div>
                        </div>
                        <i class="icon right iconfont icon-iconenter"></i>
                    </div>
                </template>
                <div class="user-address-box">
                    <div class="map">
                        <i class="icon darkred iconfont icon-dizhi1"></i>
                    </div>
                    <div class="desc">
                        <div class="userName">收货人: {{orderInfo.acceptUser}}</div>
                        <div class="moblie">{{orderInfo.acceptPhone}}</div>
                        <div class="address">收货地址: {{orderInfo.acceptAddress}}</div>
                    </div>
                </div>
            </div>
            <div class="order-box">
                <div class="order-title">
                    <div class="shop"><i class="icon iconfont icon-fangzi"></i><span class="name">{{onGood.title}}</span></div>
                </div>
                <template v-for="order, index in orderInfo.orderList">
                    <div class="order-goods" v-for="good, index in order.ordersInfoList">
                        <div class="order-info" @click="$router.push({ name: 'PdDetails', query: { proCode: good.productId } })">
                            <div class="order-cover"><img :src="good.proSimg" alt=""></div>
                            <div class="order-describe">
                                <div class="order-name">{{good.proName}}</div>
                                <p class="order-desc">商品分类: {{good.proColorName}}色, 尺码:{{good.proSizesName}}</p>
                                <p class="order-help"><span class="key">七天退货</span></p>
                            </div>
                            <div class="order-price-box">
                                <div class="order-price">￥{{good.productPrice}}</div>
                                <div class="order-price-old">￥{{good.productOrigiPrice}}</div>
                                <div class="order-number">x {{good.count}}</div>
                            </div>
                            <div class="order-system" v-if="orderInfo.orderList.length > 1">
                                <!-- 多个商品 => 状态对应功能 -->
                                <template v-if="order.ordersState == '3' || order.ordersState == '7'">
                                    <!-- 商品待收货: 3.商品已付款, 7.商品已发货 -->
                                    <a href="javascript:;" @click.stop="_goLogisticsInfo(order)" class="order button received">查看物流</a>
                                </template>
                                <template v-else-if="order.ordersState == '4' || order.ordersState == '5' || order.ordersState == '6'">
                                    <!-- 已完成: 4.商品已完成, 5.商品已评价, 6.订单已追评-->
                                    <template v-if="good.isReturns == '0'">
                                        <a href="javascript:;" @click.stop="_afterSales(order)" class="order button appraise">申请售后</a>
                                    </template>
                                    <template v-else-if="good.isReturns == '1'">
                                        <a href="javascript:;" @click.stop="_afterSales(order)" class="order button appraise">修改售后 </a>
                                    </template>
                                    <a href="javascript:;" @click.stop="$router.push({ name: 'PdDetails', query: { proCode: good.productId } })" class="order button active complete">再次购买</a>
                                </template>
                            </div>
                        </div>
                    </div>
                </template>
                <ul class="order-item">
                    <li class="item"><span class="title">商品总价</span><span class="val">￥{{orderInfo.totalAmount}}</span></li>
                    <li class="item"><span class="title">折扣</span><span class="val">-￥{{orderInfo.totalDeductionAmount}}</span></li>
                    <li class="item"><span class="title">运费(快递)</span><span class="val">+￥{{orderInfo.totalFreight}}</span></li>
                    <li class="item"><span class="title">积分抵扣</span><span class="val">-￥{{orderInfo.totalChangeAmount}}</span></li>
                    <li class="item"><span class="title strong">订单总价</span><span class="val strong">￥{{orderInfo.totalFinalAmount}}</span></li>
                    <li class="line"></li>
                    <li class="item"><span class="title active">需付款</span><span class="val active">￥{{orderInfo.totalFinalAmount}}</span></li>
                </ul>
            </div>
            <div class="order-box">
                <div class="order-Give">
                    <div class="content">
                        <label class="key">积分</label><strong>送<span class="key">{{orderInfo.totalGivePoint}}</span>积分</strong></div>
                    <ul class="description">
                        <li>
                            <label class="item">订单编号</label> : <span class="val">{{orderInfo.totalOrdersNo}}</span></li>
                        <li>
                            <label class="item">创建时间</label> : <span class="val">{{formatDate(orderInfo.createTime, 'time')}}</span></li>
                    </ul>
                </div>
                <div class="order-system">
                    <!-- 订单状态对应功能 -->
                    <!-- {{orderInfo.ordersState}} -->
                    <template v-if="orderInfo.ordersState == '3' || orderInfo.ordersState == '7'">
                        <!-- 待收货: 3.订单已付款, 7.订单已发货 -->
                        <a href="javascript:;" v-if="orderInfo.orderList.length == 1" @click="_goLogisticsInfo(orderInfo.orderList[0])" class="order button received">查看物流</a>
                        <a href="javascript:;" @click="_confirmReceived(orderInfo)" class="order button active received">确认收货</a>
                    </template>
                    <template v-else-if="orderInfo.ordersState == '1'">
                        <!-- 待付款: 1.生成已订单 -->
                        <a href="javascript:;" @click="_closeOrder(orderInfo)" class="order button paying">取消订单</a>
                        <a href="javascript:;" @click="_payOrder(orderInfo)" class="order button active paying">去支付</a>
                    </template>
                    <template v-else-if="orderInfo.ordersState == '4' || orderInfo.ordersState == '5' || orderInfo.ordersState == '6'">
                        <template v-if="orderInfo.ordersState == '4'">
                            <!-- 待评价: 4.订单已完成 -->
                            <a href="javascript:;" @click="_goAppraise(orderInfo)" class="order button appraise">立即评价</a>
                        </template>
                        <template v-else-if="orderInfo.ordersState == '5'">
                            <!-- 待评价: 5.订单已评价 -->
                            <a href="javascript:;" @click="_goAppraise(orderInfo)" class="order button appraise">追加评价</a>
                        </template>
                        <template v-else-if="orderInfo.ordersState == '6'">
                            <!-- 已完成: 6.订单已追评 -->
                            <a href="javascript:;" @click="_delOrder(orderInfo)" class="order button complete">删除订单</a>
                        </template>
                        <template v-if="orderInfo.orderList.length == 1">
                            <template v-if="orderInfo.orderList[0].ordersInfoList[0].isReturns == '0'">
                                <a href="javascript:;" @click="_afterSales(orderInfo.orderList[0])" class="order button appraise">申请售后</a>
                            </template>
                            <template v-else-if="orderInfo.orderList[0].ordersInfoList[0].isReturns == '1'">
                                <a href="javascript:;" @click="_afterSales(orderInfo.orderList[0])" class="order button appraise">修改售后</a>
                            </template>
                            <a href="javascript:;" @click="$router.push({ name: 'PdDetails', query: { proCode: orderInfo.orderList[0].ordersInfoList[0].productId } })" class="order button active complete">再次购买</a>
                        </template>
                    </template>
                    <template v-else>
                        <!-- 已取消: 2.订单已取消 -->
                        <a href="javascript:;" @click="_delOrder(order)" class="order button return">删除订单</a>
                    </template>
                </div>
            </div>
        </template>
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
    name: 'orderInfo',
    data() {
        return {
            ff: false,
            pageQuery: null,
            orderInfo: null,
            orderDescList: [
                { state: '等待付款', help: '', icon: './static/img/paying.png' }, // 待付款
                { state: '已取消', help: '您的订单已取消', icon: './static/img/return.png' }, // 订单已取消
                { state: '等待收货', help: '您的商品已经在路上了', icon: './static/img/received.png' }, // 待收货
                { state: '已完成', help: '您的订单已完成', icon: './static/img/complete.png' }, // 交易完成 => 待评价
            ],
            orderDesc: null,
            logistics: null,
            logisticsInfo: null,
            popupVisible: false
        }
    },
    created() {
    	
    },
    mounted() {
        this.$nextTick(function() {
        	document.title = '订单详情';
        	
            this.pageQuery = this.$route.query;
            this._getData();

            var _loginWay = localStorage.getItem('_loginWay');
            if (_loginWay == 'weixin') {
                this.getWxInfo(); //微信授权后获取微信用户信息
            }
        })

    },
    methods: {
        // 获取订单状态
        _getData() {
            var _that = this;
            this.$http.get(this.baseUrl + '/order/findOrderById', {
                params: { token: this.token, customerCode: this.userInfo.customerCode, totalOrdersNo: this.pageQuery.id }
            }).then(function(res) {
                if (!res) { return }
                _that.orderInfo = res;
                if (_that.orderInfo.orderList.length == 1) {
                    _that._getLogistics(_that.orderInfo.orderList[0].totalOrdersNo, _that.orderInfo.orderList[0].ordersInfoList[0].proSkuNo); // 单个商品查询物流
                }
                // res.ordersState: 1.生成已订单, 2.取消已订单, 3.订单已付款. 4.订单已完成, 5.订单已评价, 6.订单已完成, 7.订单已发货
                switch (res.ordersState) {
                    case 1:
                        _that.orderDesc = _that.orderDescList[0];
                        break;
                    case 2:
                        _that.orderDesc = _that.orderDescList[1];
                        break;
                    case 3:
                    case 7:
                        _that.orderDesc = _that.orderDescList[2];
                        break;
                    case 4:
                    case 5:
                    case 6:
                        _that.orderDesc = _that.orderDescList[3];
                        break;
                }
            });
        },

        // 获取物流数据 
        _getLogistics(_totalOrdersNo, _proSkuNo) {
            var _that = this;
            this.$http.get(this.baseUrl + '/order/findOrderLogistics', {
                params: { token: this.token, customerCode: this.userInfo.customerCode, totalOrdersNo: _totalOrdersNo, proSkuNo: _proSkuNo }
            }).then(function(res) {
                if (!res) { return }
                if (res.state != 0) {
                    _that.logistics = {
                        state: res.state,
                        time: res.compInfo[res.compInfo.length - 1].AcceptTime,
                        text: res.compInfo[res.compInfo.length - 1].AcceptStation
                    }
                    _that.logisticsInfo = res;
                    localStorage.setItem('_logistics', JSON.stringify(_that.logisticsInfo));
                } else {
                    _that.logistics = res;
                }
            })
        },

        // 确认收货 => ok
        _confirmReceived(_orderObj) {
            MessageBox.confirm('确定执行此操作[确认收货]?').then(action => {
                var _that = this;
                this.$http.post(this.baseUrl + '/order/completeOrder', { token: this.token, customerCode: this.userInfo.customerCode, totalOrdersNo: _orderObj.totalOrdersNo }).then(function(res) {
                    if (!res) { return } _that.$toast('收货成功!');
                    _that._getData();
                });
            }).catch(() => { that.$toast('放弃 收货操作!') });
        },

        // 取消订单 => ok
        _closeOrder(_orderObj) {
            MessageBox.confirm('确定执行此操作[取消订单]?').then(action => {
                var _that = this;
                this.$http.post(this.baseUrl + '/order/cancelOrder', { token: this.token, customerCode: this.userInfo.customerCode, totalOrdersNo: _orderObj.totalOrdersNo }).then(function(res) {
                    if (!res) { return } _that.$toast('取消成功!');
                    _that.$router.push({ name: 'MyOrderList', query: { type: 'all' } });
                });
            }).catch(() => { that.$toast('放弃 取消操作!') });
        },

        // 删除订单 => ok
        _delOrder(_orderObj) {
            MessageBox.confirm('确定执行此操作[删除订单]?').then(action => {
                var _that = this;
                this.$http.post(this.baseUrl + '/order/deleteOrder', { token: this.token, customerCode: this.userInfo.customerCode, totalOrdersNo: _orderObj.totalOrdersNo }).then(function(res) {
                    if (!res) { return } _that.$toast('删除成功!');
                    _that.$router.push({ name: 'MyOrderList', query: { type: 'all' } });
                });
            }).catch(() => { that.$toast('放弃 删除操作!') });
        },

        // 去评价 ok
        _goAppraise(_orderObj) {
            this.$router.push({ name: 'MyOrderAppraise', query: { No: _orderObj.totalOrdersNo, status: _orderObj.ordersState } });
        },

        // 再次购买 ok
        _againOrder(_orderObj) {
            this.$router.push({ name: 'PdDetails', query: { proCode: _orderObj } })
        },

        // 售后服务
        _afterSales(_orderObj) {
            localStorage.setItem('_afterSales', JSON.stringify(_orderObj)); // 缓存售后子订单
            this.$router.push({ name: 'MyAfterSales', query: { id: _orderObj.ordersNo } });
        },

        // 支付订单
        _payOrder(_orderObj) {
            if (_orderObj.totalFinalAmount == 0) { //积分支付
                if (!this.userInfo.payPassword) { //没有设置支付密码时
                    var that = this;
                    MessageBox({message: '您还未设置支付密码', confirmButtonText: '立即前往', showCancelButton: true }).then(function(action) {
                        if (action == 'confirm') {return that.$router.push('/setPayPassword') }
                    })
                } else {
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
                //     var redirect_uri = this.onlineUrl + '/userOrderInfo?id=' + _orderObj.totalOrdersNo;
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
            this.pointPay(val);
        },
        //积分支付
        pointPay(val) {
            var that = this;
            var reqUrl = this.baseUrl + '/order/updateOrder';
            var params = {
                totalOrdersNo: this.orderInfo.totalOrdersNo, //总订单号
                payPassword: val, //支付密码
            }
            this.$http.post(reqUrl, params)
                .then(function(res) {
                    Indicator.close();
                    if (res.code == '9998' && res.description == '支付密码错误次数过多,请稍后再试') { //支付次数过多)
                        that.$router.push({
                            query: {
                                'id': that.orderInfo.totalOrdersNo, //订单id
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
                        }, 1000);
                        that.$toast('支付失败');
                        return;
                    }
                    that.$router.push({
                        path: '/buySuccess',
                        query: { 'orderId': that.orderInfo.totalOrdersNo }
                    });
                });
        },
        //微信支付
        wxPay(_orderObj) {
            var that = this;
            var params = {
                totalOrdersNo: this.orderInfo.totalOrdersNo,
                finalAmount: this.orderInfo.totalFinalAmount
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
                    var path = that.onlineUrl + '/buySuccess?orderId=' + that.orderInfo.totalOrdersNo;
                    that.getWxPay(obj, path);
                });
        },
        // 关闭弹框
        _closePop(val) {
        	document.body.removeAttribute('style');
//          document.body.style.height = 'auto';
//          document.body.style.overflow = 'auto';
            this.popupVisible = val;
            this.$toast('支付未成功');
        },
        // 查看物流
        _goLogisticsInfo(_orderObj) {
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
<style scoped>
@import './order.css'

</style>
