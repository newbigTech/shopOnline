<!-- 提货单页面 -->
<template>
    <div id="pickGoods" class="goods-default-skin" v-if="orderData != null ">
        <div class="address" @click="_goAddress" v-if="defaultAddress != null">
            <i class="header-line"></i>
            <div class="address-item">
                <div class="item-name">
                    <div class="name ellipsis">{{ defaultAddress.consignee }}</div>
                    <div class="active-icon" v-if="defaultAddress.isDefaultAddress == 0 "><span>默认</span></div>
                </div>
                <div class="item-address">
                    <div class="user-phone">{{ defaultAddress.phone }}</div>
                    <div class="address-detailed ellipsis">{{ defaultAddress.province }},{{ defaultAddress.city }},{{ defaultAddress.county }}</div>
                </div>
                <div class="item-edit"><i class=""></i></div>
            </div>
        </div>
        <div class="address" @click="$router.push({path: '/addAddress', query: {'entrance': 'pickGoods'} })" v-else>
            <i class="header-line"></i>
            <div class="address-item">
                <div class="item-name">
                <div class="name ellipsis"><i class="icon iconfont icon-zhuyi" style="color: red;"></i> <span>提示:</span></div>
                </div>
                <div class="item-address">
                    <div class="user-phone">没有收货地址</div>
                    <div class="address-detailed ellipsis">请添加收货地址</div>
                </div>
                <div class="item-edit"><i class=""></i></div>
            </div>
        </div>
        <div class="cost">
            <span class="title">运费</span>
            <span class="price"> ¥ {{ orderData.freight }}</span>
        </div>
        <div class="goods">
            <div class="cover"> <img :src="orderData.goodsPic"> </div>
            <div class="desc">
                <div class="line">
                    <span class="goods-name ellipsis"> {{ orderData.goodsName }} </span>
                    <span class="goods-number"> × {{ orderData.proCount }} </span>
                </div>
                <div class="line">
                    <span class="goods-desc"> {{ orderData.goodsDesc }} </span>
                </div>
                <div class="last line">
                    <span class="goods-price"> <i>¥</i>{{ orderData.goodsPrice }}</span>
                </div>
            </div>
        </div>
        <div class="btm">
            <span>应付：¥ {{ orderData.freight }}</span>
            <button ref="goBuyBtn" @click=" _handleBuy ">付款提货</button>
        </div>
        <mt-popup v-model="model.visible" popup-transition="popup-fade" v-if="model != null ">
            <div class="model-header" v-if="model.showHeader">
                <span> {{ model.header }} </span>
            </div>
            <div :class="['model-content'] + [ model.secondContent != '' ? ' ' : '' ]">
                <div class="content" style="text-align: left;" v-html="model.content"></div>
                <div class="content" style="text-align: left;" v-html="model.secondContent" v-if="model.secondContent"></div>
            </div>
            <div class="model-footer">
                <a href="JavaScript:;" :class=" [ 'btn ' ] + model.actionClass + [ model.showCancel ? '' : ' big' ]" v-if="model.showAction" @click=" _action "> {{ model.actionText }} </a>
                <a href="JavaScript:;" :class=" [ 'btn ' ] + model.cancelClass " v-if="model.showCancel" @click=" model.visible = false "> {{ model.cancelText }} </a>
            </div>
        </mt-popup>
    </div>
</template>
<script>
export default {
    name: 'pickGoods',
    data() {
        return {
            pageQuery: null,
            orderData: null,
            defaultAddress: null, //默认地址
            model: { visible: false }
        }
    },
    created() {
        document.title = '提货单';
        this.pageQuery = this.$route.query;
        if (this.pageQuery.id == null) {
            this.pageQuery.id = decodeURI(this._getCookie('_UPRODERID'));
        }
    },
    mounted() {
        this.$nextTick(function() {
            this._getAddress();
            this._getData();
        });
    },
    methods: {
        // 取得一个区间的随机整数
        _rand(n, m) {
            var random = Math.floor(Math.random() * (m - n + 1) + n);
            return random;
        },
        // 获取数据
        _getData() {
            var _that = this;
            this.$http.get(this.baseUrl + '/promotion/findOrderDeliveryDetail', {
                params: { ordersNo: this.pageQuery.id, token: this.token, customerCode: this.userInfo.customerCode }
            }).then(function(res) {
                if (!res) { return }
                _that.orderData = res;
                _that.orderData.freight = _that.NumberAdd(res.postage, _that.NumberMul((parseInt(res.proCount) - 1), res.addFee))
            });
        },
        //查询收货地址
        _getAddress: function() {
            var addressId = this.$route.query.addressId;
            var _that = this;
            this.$http.get(this.baseUrl + '/acceptAddress/getAcceptAddress', {
                params: { pageNum: 1, pageSize: this.pageSize, token: this.token, customerCode: this.userInfo.customerCode }
            }).then(function(res) {
                if (!res) { return }
                if (res.total == 0) {
                    // return _that.$router.push({ path: '/addAddress', query: { 'entrance': 'pickGoods' } })
                    return _that.defaultAddress = null;
                }
                for (var i = 0; i < res.aatList.length; i++) {
                    var _flag = false;
                    if (addressId != null) { //有选择地址  显示选择的地址
                        if (parseInt(addressId) == res.aatList[i].acceptAddressId) {
                            _that.defaultAddress = res.aatList[i];
                            break;
                        }
                    } else { //没有选择地址
                        if (res.aatList[i].isDefaultAddress == 0) { // 显示默认地址
                            res.aatList[i].phone = _that.encryptPhone(res.aatList[i].phone);
                            _that.defaultAddress = res.aatList[i];
                            _flag = true;
                            break;
                        }
                    }
                }
                if ((!_flag) && (addressId == undefined)) { // 没有收货地址 显示第一个地址
                    res.aatList[0].phone = _that.encryptPhone(res.aatList[0].phone);
                    _that.defaultAddress = res.aatList[0];
                }
            });
        },
        // 选择地址
        _goAddress: function() {
            this.$router.push({ path: '/receivingAddress', query: { 'entrance': 'pickGoods' } });
        },
        // 支付弹框提示
        _handleBuy() {
            if (this.defaultAddress == null ) {
                return this.$toast('请选择收货地址');
            }
            this.model = { visible: true, showHeader: false, header: '', content: '运费首件' + this.orderData.postage + '元,此后每件依次加' + this.orderData.addFee + '元', secondContent: '您本次需要支付运费:' + this.orderData.freight + '元', actionType: '', showAction: true, actionClass: 'active', actionText: '确定', showCancel: true, cancelClass: '', cancelText: '取消' };
        },
        // 确定 => 去支付
        _action() {
            var _that = this;
            this.$http.post(this.baseUrl + '/promotion/addDeliveryRecord', {
                token: this.token,
                customerCode: this.userInfo.customerCode,
                ordersNo: this.pageQuery.id,
                postage: this.orderData.freight,
                acceptAddressId: this.defaultAddress.acceptAddressId
            }).then(function(res) {
                if (!res) { return }
                var _result = { ordersNo: res.deliveryNo, finalAmount: res.postage, returnRouterName: 'MyUpgrade' };
                if (_that.orderData.freight == 0) {
                    _that._moneyPay(_result.ordersNo, _result.finalAmount);
                } else {
                    _that.$router.push({ name: 'upGoBuy', query: { type: 'upOrder' } });
                    localStorage.setItem('_uproderinfo', JSON.stringify(_result));
                }
            });
        },
        //余额支付
        _moneyPay(_ordersNo, _finalAmount) {
            var _that = this;
            this.$http.post(this.baseUrl + '/promotion/balancePayOrder', {
                ordersNo: _ordersNo,
                finalAmount: _finalAmount,
                payModel: '2'
            }).then(function(res) {
                if (!res) { return; }
                _that.$toast('支付成功');
                localStorage.removeItem('accountMoney');
                _that.$router.push({ name: 'MyUpgrade' });
            });
        }
    }
}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style scoped>
@import url(./pickGoods.css);
@import url(./myupgrade.css);

</style>
