<!-- 去付款 -->
<template>
    <div class="goBuy">
        <div class="nav">
            <div class="line"></div>
            <div class="address" @click="goAddress" v-if="defaultAddress!=null">
                <h3> <span>{{defaultAddress.consignee}}</span> <span>{{defaultAddress.phone}}</span> </h3>
                <p>
                    <span class="default-sign" v-if="defaultAddress.isDefaultAddress == 0">默认</span>
                    <span>{{defaultAddress.province}}{{defaultAddress.city}}{{defaultAddress.county}}</span>
                </p>
                <i class="iconfont">&#xe60c;</i>
            </div>
            <div class="address" @click="$router.push({path: '/addAddress', query: {'entrance': 'goBuy'} })" v-else>
                <h3> <i class="icon iconfont icon-zhuyi" style="color: red;"></i> <span>提示:</span>&nbsp;&nbsp;<span>没有收货地址</span></h3>
                <p><span>请添加收货地址</span></p>
                <i class="iconfont">&#xe60c;</i>
            </div>
            <div class="part">
                <div class="part-item">
                    <span>可用积分：{{deductionObj.pointAmount}}</span>
                    <span class="fr">本次购买送{{deductionObj.givePoint}}积分</span>
                </div>
                <div class="part-item">
                    <div :class="['input-checkbox ']+[deduction?'on':'']">
                        <input ref="checkInputBox" type="checkbox" name="vehicle" v-model="deduction" @change="changeDeduction" />
                    </div>
                    <span @click="$refs.checkInputBox.click()">可抵扣</span>
                    <span class="fr">￥{{deductionObj.totalAmount}}</span>
                </div>
            </div>
            <div class="part">
                <div class="part-item">
                    <span>商品合计</span>
                    <span class="fr">￥{{moneyInfo.origiPriceAll}}</span>
                </div>
                <div class="part-item">
                    <span>运费</span>
                    <span class="fr">￥{{freight}}</span>
                </div>
                <div class="part-item">
                    <span>优惠</span>
                    <span class="fr">-￥{{moneyInfo.favour}}</span>
                </div>
                <div class="part-item">
                    <span>需付款</span>
                    <span class="fr">￥{{moneyInfo.priceAll}}</span>
                </div>
            </div>
            <div class="product-info" v-for="item in currProSkuList">
                <img :src="currProObjList[0].proSimg" />
                <div class="right">
                    <h2>{{item.proTitle}}</h2><span class="num">×{{item.choiseNum}}</span>
                    <p>
                        <span v-if="item.skuColor != '无'">{{item.skuColor}}</span>&nbsp;&nbsp;
                        <span v-if="item.skuSize != '无'">{{item.skuSize}}</span>
                    </p>
                    <p class="prize">￥{{item.productPrice}}
                        <span class="old-prize">￥{{item.productOrigiPrice}}</span>
                    </p>
                </div>
            </div>
        </div>
        <div class="btm">
            <span>应付：￥{{moneyInfo.priceAll}}</span>
            <button ref="goBuyBtn" @click="handleBuy">去付款</button>
        </div>
        <pay-pop :viewPop="popupVisible" @result="getPwd" @result2="closePop"></pay-pop>
    </div>
</template>
<script>
import payPop from '@/components/tool/payPop' //密码支付弹框
import { MessageBox, Indicator } from 'mint-ui';
export default {
    name: 'goBuy',
    components: { 'pay-pop': payPop },
    data() {
        return {
            deductible: 'valueF',
            options: {
                label: '可抵扣'
            },
            popupVisible: false,
            currProSkuList: [], //当前商品的sku信息 数组 （包含sku数量）
            currProObjList: [], //当前商品信息 数组
            deduction: false,
            deductionObj: {
                'totalAmount': '0.00',
                'pointAmount': '0.00',
                'userPoint': '0.00'
            }, //抵扣对象信息
            moneyInfo: {},
            defaultAddress: {}, //默认地址
            orderPro: [], //商品信息集合
            orderTotalAmount: '0.00', //创建订单传的总金额
            checkInteg: '2', //1为勾选了积分抵扣，2为没勾选积分抵扣
            orderId: '', //生成的订单id
        }
    },
    created() {
//	    document.body.scrollTop = document.documentElement.scrollTop = 0;
        if ((!this.userInfo) || this.token == null) {
            this.$toast('登录已失效,请重新登录');
            return this.$router.push('/login');
        }
    },
    mounted() {
        this.$nextTick(function() {
        	document.title = '下单';
            this.currProSkuList = JSON.parse(localStorage.getItem('_currProSkuList')); //当前商品的sku信息 数组
            this.currProObjList = JSON.parse(localStorage.getItem('_currProObjList')); //当前商品信息 数组
            if (this.token != null) { this.getAddress(); }
            var _loginWay = localStorage.getItem('_loginWay');
            if (_loginWay == 'weixin') {
                this.getWxInfo(); //微信授权后获取微信用户信息
            }
        });
    },
    methods: {
        //我的积分和查询抵扣
        fingIntegral: function() {
            var that = this;
            var orderPro = [];
            for (var i = 0; i < this.currProSkuList.length; i++) {
                var item = this.currProSkuList[i];
                var obj = {
                    proCount: item.choiseNum,
                    proSku: item.skuNo, //'U361562B01S01'
                    proCode: item.proCode //'f8a61e858e724a78becbd08b50bbecef'
                }
                orderPro.push(obj);
            }
            this.orderPro = orderPro; //商品信息集合
            this.$http.get(this.baseUrl + '/order/findPointAndDeduction', { params: { orderPro: JSON.stringify(this.orderPro), type: this.checkInteg } }).then(function(res) {
                if (!res) { return; }
                that.deductionObj = res;
            });
        },
        //选择是否积分抵扣
        changeDeduction: function() {
            var origiPriceAll = 0,
                priceAll = 0,
                proIntegralAll = 0;
            for (var i = 0; i < this.currProSkuList.length; i++) {
                var item = this.currProSkuList[i];
                origiPriceAll = this.NumberAdd(origiPriceAll, this.NumberMul(item.productOrigiPrice, item.choiseNum)); /* 商品合计 */

                priceAll = this.NumberAdd(priceAll, this.NumberMul(item.productPrice, item.choiseNum)); //需付款
                proIntegralAll = this.NumberAdd(proIntegralAll, item.productIntegral);
            }
            this.orderTotalAmount = priceAll;
            var favour = this.NumberDiv(origiPriceAll, priceAll);
            this.moneyInfo = {
                origiPriceAll: origiPriceAll,
                priceAll: priceAll,
                proIntegralAll: proIntegralAll, //购买送的总积分
                favour: favour //优惠
            }
            if (this.deduction) {
                this.moneyInfo.priceAll = this.NumberDiv(priceAll, this.deductionObj.totalAmount);
                this.checkInteg = '1';
            } else {
                this.checkInteg = '2';
            }
            this.fingIntegral();
        },
        //查询收货地址
        getAddress: function() {
            var addressId = this.$route.query.addressId;
            var that = this;
            this.$http.get(this.baseUrl + '/acceptAddress/getAcceptAddress', { params: { pageNum: 1, pageSize: this.pageSize, } }).then(function(res) {
                if (!res) { return; }
                if (res.total == 0) {
                    that.fingIntegral();
                    that.changeDeduction();
                    return that.defaultAddress = null;
                }
                var aatList = res.aatList;
                for (var i = 0; i < aatList.length; i++) {
                    var f = false;
                    //有选择地址  显示选择的地址
                    if (addressId != null) {
                        if (parseInt(addressId) == aatList[i].acceptAddressId) {
                            that.defaultAddress = aatList[i];
                            break;
                        }
                    } else { //没有选择地址
                        // 显示默认地址
                        if (aatList[i].isDefaultAddress == 0) {
                            aatList[i].phone = that.encryptPhone(aatList[i].phone);
                            that.defaultAddress = aatList[i];
                            f = true;
                            break;
                        }
                    }
                }
                //没有收货地址   显示第一个地址
                if ((!f) && (addressId == undefined)) {
                    aatList[0].phone = that.encryptPhone(aatList[0].phone);
                    that.defaultAddress = aatList[0];
                }
                that.fingIntegral();
                that.changeDeduction();
            });
        },
        //关闭弹框
        closePop: function(val) {
        	document.body.removeAttribute('style');
//          document.body.style.height = 'auto';
//          document.body.style.overflow = 'auto';
            this.popupVisible = val;
            //没有支付成功时   进入订单详情页
            this.$toast('支付未成功');
            //userOrderInfo
            this.$router.push({ query: { 'id': this.orderId, 'type': '1', }, path: '/userOrderInfo' })
        },
        //获取从子组件传来的密码值
        getPwd: function(val) {
            var that = this;
            this.popupVisible = false;
            Indicator.open({ text: '支付中...', spinnerType: 'fading-circle' });
            this.pointPay(val);
        },
        //创建订单
        createOrder: function(param = null) {
            var cN = this.$refs.goBuyBtn.className;
            if (cN == 'btn-gray') {
                return false;
            }
            if (this.defaultAddress.acceptAddressId == undefined) {
                this.$toast('请选择收货地址');
            }
            this.$refs.goBuyBtn.className = 'btn-gray';
            var that = this,
                reqUrl = this.baseUrl + '/order/addOrder',
                finalAmount = (this.moneyInfo.priceAll).toString(),
                params = {
                    acceptAddressId: this.defaultAddress.acceptAddressId, //地址信息集合
                    orderSource: 1, //订单来源：1：微信下单
                    totalAmount: this.orderTotalAmount.toString(), //(this.moneyInfo.priceAll - parseFloat(this.freight)).toString(), //总金额
                    // usePoint: this.deductionObj.pointAmount,//使用积分
                    // changeAmount: this.deductionObj.totalAmount,//抵扣金额
                    freight: this.freight, //运费
                    finalAmount: finalAmount, //最终支付金额
                    orderPro: this.orderPro, //订单商品
                    token: this.token,
                    customerCode: this.userInfo.customerCode
                }
            if (this.deduction) {
                params.usePoint = (this.deductionObj.userPoint).toString(); //使用积分
                params.changeAmount = (this.deductionObj.totalAmount).toString(); //抵扣金额
            } else {
                params.usePoint = '0.00'; //使用积分
                params.changeAmount = '0.00'; //抵扣金额
            }
            this.$http.post(reqUrl, { sendJson: JSON.stringify(params) })
                .then(function(res) {
                    if (!res) {
                        that.$refs.goBuyBtn.className = '';
                        return false;
                    }
                    //  that.$toast('订单创建成功');
                    if (param == null) {
                        that.orderId = res.totalOrdersNo;
                        that.handlePay();
                        return true;
                    } else {
                        var comOrderInfo = {
                            totalOrdersNo: res.totalOrdersNo, //订单编号
                            finalAmount: finalAmount //支付金额
                        }
                        localStorage.setItem('comOrderInfo', JSON.stringify(comOrderInfo));
                        that.$router.push('/choosePayWay');
                    }

                });
        },
        //去付款
        handleBuy: function() {
            if (this.defaultAddress == null ) {
                return this.$toast('请选择收货地址');
            }
            if (this.moneyInfo.priceAll == 0) { //积分支付
                if (!this.userInfo.payPassword) { //没有设置支付密码时
                    var that = this;
                    MessageBox({
                        message: '您还未设置支付密码',
                        confirmButtonText: '立即前往',
                        showCancelButton: true
                    }).then(function(action) {
                        if (action == 'confirm') {
                            that.$router.push('/setPayPassword');
                        }
                    })
                } else {
                    this.createOrder();
                }
            } else {
                // if(this.userInfo.wxId == null || this.userInfo.wxId == '') {
                //      localStorage.setItem('_loginWay', 'weixin');
                //  var redirect_uri = this.onlineUrl + '/goBuy';
                //  this.handleWxAuthor(redirect_uri);
                // } else {
                // }
                this.createOrder('choose');
            }

        },
        //支付
        handlePay: function() {
            //积分抵消支付
            this.popupVisible = true;
            /*if(this.moneyInfo.priceAll == 0) { 
                this.popupVisible = true;
            } else { //第三方支付（微信）
                this.wxPay();
            }*/
        },
        //积分支付
        pointPay: function(val) {
            var that = this;
            var reqUrl = this.baseUrl + '/order/updateOrder';
            var params = {
                totalOrdersNo: this.orderId, //总订单号
                payPassword: val, //支付密码
            }
            this.$http.post(reqUrl, params)
                .then(function(res) {
                    Indicator.close();
                    if (res.code == '9998' && res.description == '支付密码错误次数过多,请稍后再试') { //支付次数过多)
                        return that.$router.push({ query: { 'id': that.orderId, 'type': '1' }, path: '/userOrderInfo' })
                    }
                    if (!res) {
                        setTimeout(function() { that.popupVisible = true; }, 1000);
                        return;
                    }
                    if (res.result != 'success') {
                        setTimeout(function() { that.popupVisible = true; }, 1000)
                        return that.$toast('支付失败');
                    }
                    that.$router.push({ path: '/buySuccess', query: { 'orderId': that.orderId } });
                });
        },
        //微信支付
        /*wxPay: function(){
                var that = this;
                var params = {
                    totalOrdersNo: this.orderId,
                    finalAmount: this.moneyInfo.priceAll
                }
                this.$http.post(this.baseUrl + '/order/weixinPay', params)
                .then(function(res) {
                    if(!res) {
                        return;
                    }
                    var obj = {
                        "appId": res.appId, //公众号名称，由商户传入     
                        "timeStamp": res.timeStamp, //时间戳，自1970年以来的秒数     
                        "nonceStr": res.nonceStr, //随机串     
                        "package": res.package,//微信支付ID
                        "signType": res.signType, //微信签名方式：     
                        "paySign": res.paySign //微信签名 
                    }
                    var succesPath = that.onlineUrl + '/buySuccess?orderId=' + that.orderId;
                    var errorPath = that.onlineUrl + '/userOrderInfo?id=' + that.orderId + '&type=1';
                    that.getWxPay(obj, succesPath, errorPath);
                });
            },*/
        //选择地址
        goAddress: function() {
            this.$router.push({ path: '/receivingAddress', query: { 'entrance': 'goBuy' } })
        }
    }
}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style scoped>
@import 'goBuy.css'

</style>
