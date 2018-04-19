<!-- 
    售后详情 [退款/退货] == 状态
    => 申请(apply)
        => 商家同意(consent)
            => 买家退货物流(waiting)
                => 成功(success)

        => 商家拒绝(reject)
            => 修改申请{ruturn}

        => 取消申请[关闭](close)
 -->
<template>
    <div id="afterSalesState" :style="{height:bodyHeight}" v-if="asOrder != null">
        <template v-if="asOrder.checkState == '0'">
            <div class="prompt-box" v-if="asOrder.exchangeStatus == '0'">
                <div class="state">等待商家处理
                    <template class="val" v-if="asOrder.exchangeType == 1">退货</template>
                    <template class="val" v-else-if="asOrder.exchangeType == 2">换货</template>
                    <template class="val" v-else-if="asOrder.exchangeType == 3">退款</template>
                    申请</div>
                <div class="item callback">如果商家同意: <span>申请将达成 <template v-if="asOrder.exchangeType != 3">并需要您退货给商家</template> </span></div>
                <div class="item callback">如果商家拒绝: <span>将需要您修改
                    <template class="val" v-if="asOrder.exchangeType == 1">退货</template>
                    <template class="val" v-else-if="asOrder.exchangeType == 2">换货</template>
                    <template class="val" v-else-if="asOrder.exchangeType == 3">退款</template>
                申请</span></div>
                <div class="item callback">如果商家未处理: <span>超过 {{ formatDate(asOrder.autoEndTime) }} 则申请达成<template v-if="asOrder.exchangeType != 3">需要您退货</template></span></div>
            </div>
            <div class="prompt-box" v-else>
                <div class="state">
                    <template class="val" v-if="asOrder.exchangeType == 1">退货</template>
                    <template class="val" v-else-if="asOrder.exchangeType == 2">换货</template>
                    <template class="val" v-else-if="asOrder.exchangeType == 3">退款</template>
                    关闭</div>
                <div class="item cause">关闭原因:<span>由于您取消退款或逾期未修改退款申请</span></div>
                <div class="item time">关闭时间:<span>{{ formatDate(asOrder.endTime, 'time') }}</span></div>
            </div>
        </template>
        <template v-if="asOrder.checkState == '1'">
            <div class="prompt-box" v-if="asOrder.exchangeStatus == '1'">
                <div class="state">商家已同意您的
                    <template class="val" v-if="asOrder.exchangeType == 1">退货</template>
                    <template class="val" v-else-if="asOrder.exchangeType == 2">换货</template>
                    <template class="val" v-else-if="asOrder.exchangeType == 3">退款</template>
                    申请</div>
                <div class="item callback">请填写快递信息</div>
                <div class="item callback">快递公司:
                    <div class="select-box">
                        <select v-model="expressSelected">
                            <option v-for="item, index in expressCompanyName" v-bind:value="item.compCode" :key="index">{{ item.compName }}</option>
                        </select>
                    </div>
                </div>
                <div class="item callback">快递单号:
                    <div class="input-box">
                        <input type="text" class="express delivery number" v-model="expressCode" @click="expressCode == '请填写快递单号'? expressCode='': null ">
                    </div>
                </div>
            </div>
            <div class="prompt-box" v-if="asOrder.exchangeStatus == '2'">
                <div class="state">等待商家收货</div>
                <div class="item callback">商家收到货后我们会第一时间安排退款</div>
                <div class="item callback">您可以选择查看物流来获取物流信息</div>
            </div>
            <div class="prompt-box" v-if="asOrder.exchangeStatus == '3'">
                <div class="state">等待商家退款</div>
                <div class="item callback">我们会第一时间安排退款</div>
                <div class="item callback">您可以选择查看物流来获取物流信息</div>
            </div>
            <div class="prompt-box" v-if="asOrder.exchangeStatus == '4'">
                <div class="state">
                    <template class="val" v-if="asOrder.exchangeType == 1">退货</template>
                    <template class="val" v-else-if="asOrder.exchangeType == 2">换货</template>
                    <template class="val" v-else-if="asOrder.exchangeType == 3">退款</template>
                    成功</div>
                <div class="item time">退款成功时间:<span>{{ formatDate(asOrder.endTime, 'time') }}</span></div>
                <div class="item money">退款金额: <span class="price">￥{{ asOrder.finalAmount }}</span></div>
                <div class="item money">退款积分: <span class="price">{{ asOrder.refundPoint }}</span></div>
                <div class="item callback">退款去向:
                    <span class="callback" v-if="asOrder.refundSource == 1">积分</span>
                    <span class="callback" v-else-if="asOrder.refundSource == 2">微信</span>
                    <span class="callback" v-else-if="asOrder.refundSource == 3">积分微信混合</span>
                    <span class="callback" v-else-if="asOrder.refundSource == 4">余额</span>
                    <span class="callback" v-else-if="asOrder.refundSource == 5">积分余额混合</span>
                </div>
            </div>
            <div class="prompt-box" v-if="asOrder.exchangeStatus == '5'">
                <div class="state">
                    <template class="val" v-if="asOrder.exchangeType == 1">退货</template>
                    <template class="val" v-else-if="asOrder.exchangeType == 2">换货</template>
                    <template class="val" v-else-if="asOrder.exchangeType == 3">退款</template>
                    关闭</div>
                <div class="item cause">关闭原因:<span>由于您取消退款或逾期未修改退款申请</span></div>
                <div class="item time">关闭时间:<span>{{ formatDate(asOrder.endTime, 'time') }}</span></div>
            </div>
        </template>
        <template v-if="asOrder.checkState == '2'">
            <div class="prompt-box" v-if="asOrder.exchangeStatus == '5'">
                <div class="state">
                    <template class="val" v-if="asOrder.exchangeType == 1">退货</template>
                    <template class="val" v-else-if="asOrder.exchangeType == 2">换货</template>
                    <template class="val" v-else-if="asOrder.exchangeType == 3">退款</template>
                    关闭</div>
                <div class="item cause">关闭原因:<span>由于您取消退款或逾期未修改退款申请</span></div>
                <div class="item time">关闭时间:<span>{{ formatDate(asOrder.endTime, 'time') }}</span></div>
            </div>
            <div class="prompt-box" v-else>
                <div class="state">请修改
                    <template class="val" v-if="asOrder.exchangeType == 1">退货</template>
                    <template class="val" v-else-if="asOrder.exchangeType == 2">换货</template>
                    <template class="val" v-else-if="asOrder.exchangeType == 3">退款</template>
                    申请</div>
                <div class="item">修改时间:<span>{{ formatDate(asOrder.autoEndTime, 'time') }}</span></div>
                <div class="item callback fg"><span class="">拒绝理由:</span><span class="line2">{{ asOrder.refuseReason }}</span></div>
            </div>
        </template>
        <mt-cell title="协商详情" is-link @click.native="_goNegotiate"></mt-cell>
        <div class="order-info">
            <ul class="items">
                <li class="item">
                    <label for="">商品名称</label><span class="val">{{ asOrder.productName }}</span>
                </li>
                <li class="item">
                    <label for="">售后类型</label>
                    <span class="val" v-if="asOrder.exchangeType == 1"> 退货 </span>
                    <span class="val" v-else-if="asOrder.exchangeType == 2"> 换货 </span>
                    <span class="val" v-else-if="asOrder.exchangeType == 3"> 退款 </span>
                </li>
                <li class="item">
                    <label for="">退款金额</label><span class="val">{{ asOrder.refundAmount }}</span>
                </li>
                <li class="item">
                    <label for="">退款原因</label><span class="val">{{ asOrder.exchangeReason }}</span>
                </li>
                <li class="item">
                    <label for="">售后说明</label><span class="val">{{ asOrder.exchangeDesc }}</span>
                </li>
                <li class="item">
                    <label for="">售后编号</label><span class="val">{{ asOrder.exchangeNo }}</span>
                </li>
                <li class="item">
                    <label for="">申请时间</label><span class="val">{{ formatDate(asOrder.applyTime, 'time') }}</span>
                </li>
            </ul>
        </div>
        <!-- checkState: 0.待审核, 1.通过, 2.拒绝 -->
        <template v-if="asOrder.checkState == '1'">
            <!-- checkState == 1.通过 -->
            <div class="system-box content" v-if="asOrder.exchangeStatus == '1'">
                <!-- exchangeStatus == 1.等待退货 -->
                <a href="javascript:;" class="order big button" @click="_action">提交</a>
            </div>
        </template>
        <template v-else>
            <div class="system-box" v-if="asOrder.exchangeStatus != '5'">
                <a href="javascript:;" class="order button" @click="_goAfterSales">修改售后申请</a>
                <a href="javascript:;" class="order button active" @click="_closeAfterSales">撤销售后申请</a>
            </div>
        </template>
    </div>
</template>
<script>
import { MessageBox } from 'mint-ui';
export default {
    name: 'refunds',
    data() {
        return {
            pageQuery: null,
            bodyHeight: document.documentElement.clientHeight + 'px',
            asOrder: null,
            expressSelected: 'EMS',
            expressCompanyName: [
                { value: 'SF', name: '顺丰快递[SF]' },
                { value: 'YTO', name: '圆通快递[YTO]' },
                { value: 'ZTO', name: '中通快递[ZTO]' },
                { value: 'STO', name: '申通快递[STO]' },
                { value: 'ZJS', name: '宅急送[ZJS]' },
                { value: 'EMS', name: '中国邮政[EMS]' },
            ],
            expressCode: '请填写快递单号'
        }
    },
    mounted() {
        document.title = '售后';
        this.pageQuery = this.$route.query;
        this._getData();
    },
    methods: {
        // 获取售后详情
        _getData() {
            var _that = this;
            this.$http.get(this.baseUrl + '/front/exchangeOrder/findExchangeDetail', {
                params: { token: this.token, customerCode: this.userInfo.customerCode, exchangeNo: this.pageQuery.no }
            }).then(function(res) {
                if (!res) { return }
                // res.checkState = 1;
                // res.exchangeStatus = 1;
                if (res.exchangeStatus == 1) {
                    _that._getLogistics();
                }
                _that.asOrder = res;
            });
        },

        // 获取物流列表
        _getLogistics() {
            var _that = this;
            this.$http.get(this.baseUrl + '/logisticsInfo/logisticsDic', {
                params: { token: this.token, customerCode: this.userInfo.customerCode }
            }).then(function(res) {
                if (!res) { return }
                _that.expressCompanyName = res.WQBMap;
            })
        },

        // 去售后订单 => 协商详情
        // 售后是否结束 
        // return true => 结束
        // return false => 未结束
        _goNegotiate() {
            var _status;
            if (this.asOrder.exchangeStatus == 4 || this.asOrder.exchangeStatus == 5) { _status = true } else { _status = false }
            this.$router.push({ name: 'MyAfterSalesNegotiate', query: { no: this.pageQuery.no, state: _status } })
        },

        // 修改售后申请
        _goAfterSales() {
            this.$router.push({ name: 'MyAfterSales', query: { id: this.asOrder.ordersNo } })
        },

        // 撤销售后申请
        _closeAfterSales() {
            MessageBox.confirm('撤销申请后您将不能重新发起售后申请,是否确认撤销?').then(action => {
                var _that = this;
                this.$http.post(this.baseUrl + '/front/exchangeOrder/cancelExchangeOrder', {
                    token: this.token,
                    customerCode: this.userInfo.customerCode,
                    exchangeNo: this.pageQuery.no
                }).then(function(res) {
                    console.log(res);
                    if (!res) { return }
                    _that.$router.push({ name: 'MyAfterSalesList' });
                });
            }).catch(() => { this.$toast('取消操作!') });
        },

        // 提交物流,信息
        _action() {
            var _that = this;
            this.$http.post(this.baseUrl + '/front/exchangeOrder/addExchangeExpress', {
                token: this.token,
                customerCode: this.userInfo.customerCode,
                exchangeNo: this.pageQuery.no,
                expressCompanyName: this.expressSelected,
                expressCode: this.expressCode
            }).then(function(res) {
                if (!res) { return }
                _that._getData();
            });
        }
    }
}

</script>
<style>
@import 'afterSales.css'

</style>
