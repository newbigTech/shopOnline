<!-- 售后订单列表 -->
<template>
    <div id="afterSalesList">
        <div class="order-item" v-for="order, index in orderList" :key="index">
            <div class="order-title">
                <div class="shop">
                    <span class="name">售后订单号:</span>
                    <span class="name">{{order.ordersNo}}</span>
                </div>
                <div class="order-state"><i class="icon iconfont icon-iconenter"></i></div>
            </div>
            <div class="order-info" @click="_afterSalesInfo(order)">
                <div class="order-cover" v-if="order.productSimg!=null"><img :src="order.productSimg" alt=""></div>
                <div class="order-desc">
                    <div class="order-name">{{order.productName}}</div>
                    <div class="order-help">
                        <span class="goods-number">x{{order.exchangeNumber}}</span>
                        <span class="key">颜色 {{order.proColorName}}</span>
                        <span class="key">尺码 {{order.proSizesName}}</span>
                    </div>
                    <div class="order-price afterSales">退款金额<span class="price">￥{{order.refundAmount}}</span></div>
                </div>
            </div>
            <div class="order-system">
                <!-- {{order.exchangeType}} {{order.exchangeStatus}} -->
                <div class="order-state">
                    <i :class="['icon iconfont ']+[order.exchangeType == '1'?'icon-tuikuan':'icon-tuihuo']"></i>
                    <span>
                        <template class="val" v-if="order.exchangeType == '1'">退货</template>
                        <template class="val" v-else-if="order.exchangeType == '2'">换货</template>
                        <template class="val" v-else-if="order.exchangeType == '3'">退款</template>
                    </span>
                    <template v-if="order.checkState=='0'">
                        <span v-if="order.exchangeStatus == '0'">买家申请成功</span>
                        <span v-if="order.exchangeStatus == '5'">
                            <template class="val" v-if="order.exchangeType == '1'">退货</template>
                            <template class="val" v-else-if="order.exchangeType == '2'">换货</template>
                            <template class="val" v-else-if="order.exchangeType == '3'">退款</template>
                            关闭 买家撤销申请
                        </span>
                    </template>
                    <template v-if="order.checkState=='1'">
                        <span v-if="order.exchangeStatus == '1'">等待买家退货</span>
                        <span v-if="order.exchangeStatus == '2'">等待商家收货</span>
                        <span v-if="order.exchangeStatus == '3'">等待商家退款</span>
                        <span v-if="order.exchangeStatus == '4'">商家已经退款 </span>
                        <span v-if="order.exchangeStatus == '5'">
                            <template class="val" v-if="order.exchangeType == '1'">退货</template>
                            <template class="val" v-else-if="order.exchangeType == '2'">换货</template>
                            <template class="val" v-else-if="order.exchangeType == '3'">退款</template>
                            关闭
                        </span>
                    </template>
                    <template v-if="order.checkState=='2'">
                        <span v-if="order.exchangeStatus == '5'">
                            <template class="val" v-if="order.exchangeType == '1'">退货</template>
                            <template class="val" v-else-if="order.exchangeType == '2'">换货</template>
                            <template class="val" v-else-if="order.exchangeType == '3'">退款</template>
                            关闭
                        </span>
                        <span v-else>商家拒绝申请</span>
                    </template>
                </div>
                <a href="javascript:;" @click="_afterSalesInfo(order)" class="order button active received">查看详情</a>
            </div>
        </div>
        <div class="footer-box" v-if="orderList.length > 9">
            <template v-if="showMore">
                <div class="more" @click="_getMore">点击加载更多</div>
            </template>
            <template v-else>
                <div class="more" @click="_getMore">没有更多了</div>
            </template>
        </div>
        <div class="error-box" v-if="orderList.length == 0">
            <div class="error-icon">
                <img :src="'./static/img/error.png'" alt="">
            </div>
            <div class="error-help">
                <p class="goHome">
                    暂无退货/退款</br>
                    <a href="javascript:;" class="link" onclick="window.history.go(-1)">后退一步</a>
                    <router-link class="link" :to="{ name: 'MyUser'}">回个人中心</router-link>
                    <router-link class="link" :to="{ name: 'Index'}">去首页逛逛</router-link>
                </p>
            </div>
        </div>
        <!-- <div class="footer-box" v-if="orderList.length == 0"><div class="more">暂无退货/退款</div></div> -->
        
    </div>
</template>
<script>
export default {
    name: 'refunds',
    components: {
    },
    data() {
        return {
            pageQuery: null,
            page: {
                total: 0,
                current: 1,
                size: 10,
            },
            showMore: false, //是否展示更多
            orderList: [],
        }
    },
    mounted() {
        document.title = '售后列表';
        this.pageQuery = this.$route.query;
        this._getOrderLIst();
    },
    methods: {
        // 获取更多
        _getMore() {
            if (this.orderList.length < this.page.total) {
                this.page.current++;
                this._getOrderLIst();
            }
        },
        /**
         * 获取订单列表
         * @return {[type]} [description]
         */
        _getOrderLIst() {
            var _that = this;
            this.$http.get(this.baseUrl + '/front/exchangeOrder/findExchangeList', {
                params: {
                    token: this.token,
                    customerCode: this.userInfo.customerCode,
                    pageSize: this.page.size,
                    pageNum: this.page.current
                }
            }).then(function(res) {
                if (!res) { return }
                _that.page.total = res.total;
                if (_that.page.current == 1) {
                    _that.orderList = res.aatList;
                } else {
                    for (var i = 0; i < res.aatList.length; i++) {
                        _that.orderList.push(res.aatList[i]);
                    }
                }
                if (_that.page.total > _that.orderList.length) {
                    _that.showMore = true;
                } else {
                    _that.showMore = false;
                }
            });
        },
        _afterSalesInfo(_order) {
            this.$router.push({
                name: 'MyAfterSalesState',
                query: { no: _order.exchangeNo, code: _order.exchangeCode }
            });
        }
    }
}

</script>
<style>
@import '/afterSales.css'

</style>
