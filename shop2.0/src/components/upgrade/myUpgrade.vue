<!-- 
    我的升级订单列表
    item.ordersState 订单状态 => 0待付款 1已付款 2.升级中 3.升级完成 4.兑换积分 5.退货 6.回购 7.发起申请中 8.提货中 9.确认收货
    item.upWay 订单升级类型 => 0.未升级 1.拆红包 2.猜奇偶
    item.upState 中间结果 => 0.未升级 1.小升级 2.大升级 3.升级中
    item.jiou 单双结果 =>  0:双[偶数] 1:单[奇数]
 -->
<template>
    <div id="myUpgrade" class="goods-default-skin" :style="{'min-height': clientH *10 +'px'}">
        <ul class="dataList" v-if="dataList.length > 0">
            <li class="items" v-for="item, index in dataList">
                <div class="header">
                    <span class="time"> 参与时间:{{ formatDate(item.createTime, 'time') }} </span>
                    <span class="state" v-if=" item.ordersState == 0 "> 待付款 </span>
                    <span class="state" v-else-if=" item.ordersState == 1 || item.ordersState == 2 || item.ordersState == 3 ">
                        <template v-if=" item.issueNum != 0 "> 开奖期号:{{ item.issueNum }} </template>
                        <template v-else> 待处理 </template>
                    </span>
                    <span class="state" v-else-if=" item.ordersState == 4 "> 已兑换 {{ item.rebackPoint }} 积分</span>
                    <span class="state" v-else-if=" item.ordersState == 5 "> 订单已取消 </span>
                    <span class="state" v-else-if=" item.ordersState == 6 "> 已回收 </span>
                    <span class="state" v-else-if=" item.ordersState == 7 || item.ordersState == 8 "> 待收货 </span>
                    <span class="state" v-else-if=" item.ordersState == 9 "> 已完成 </span>
                </div>
                <div class="content" @click="item.type!='3'?$router.push({
                    path: '/upDetail',
                    query: {
                        recordId: item.goodsId,
                        proCode: ( item.upState == 2 ? item.upGoodsCode : item.goodsCode ),
                        type: ( item.upState == 2 ? 'maxUpgrade' : 'upgrade' )
                    }
                }):''">
                    <div class="cover"> <img :src="item.goodsPic"> </div>
                    <div class="desc">
                        <div class="line">
                            <div class="goods-name">
                                <span> {{ item.goodsName }} </span>
                                <template v-if="item.type=='1'"> <span class="tag-label"> 促销 </span> </template>
                                <template v-else-if="item.type=='2'"> <span class="tag-label"> 增值 </span> </template>
                                <template v-else-if="item.type=='3'"> <span class="tag-label"> 体验 </span> </template>
                            </div>
                            <div class="state-box">
                                <span class="state" v-if=" item.ordersState == 0 "> </span>
                                <span class="state" v-else-if=" item.ordersState == 1 "> 付款完成 </span>
                                <span class="state" v-else-if=" item.ordersState == 2 "> 升级中 </span>
                                <span class="state" v-else-if=" item.ordersState == 5 "> 退货成功 </span>
                                <span class="state" v-else-if=" item.ordersState == 7 "> 发货申请中 </span>
                                <span class="state" v-else-if=" item.ordersState == 8 "> 提货中 </span>
                                <span class="state" v-else-if=" item.ordersState == 9 "> 提货完成 </span>
                                <span class="state" v-else>
                                    <template v-if=" item.upState == 1 "> 小升级</template>
                                    <template v-else-if=" item.upState == 2 "> 大升级</template>
                                    <template v-else-if=" item.upState == 3 "> 升级中</template>
                                    <template v-else> </template>
                                </span>
                                <span class="result" v-if=" item.ordersState != 1 && item.ordersState != 5 ">
                                    <template v-if=" item.jiou == 0 ">藕</template>
                                    <template v-else-if=" item.jiou == 1 ">鸡</template>
                                    <template v-else>
                                        <template v-if="item.upState != 0 && item.upWay != 0"> 猜红包 </template>
                                    </template>
                                </span>
                            </div>
                        </div>
                        <div class="line min-line">
                            <span class="price">¥{{ item.goodsPrice }}</span>
                            <span>×{{ item.proCount }}</span>
                            <span class="number">订单编号:{{ item.ordersNo }}</span>
                        </div>
                    </div>
                </div>
                <div class="footer">
                    <div class="payprice">
                        <span>合计: ¥{{ item.finalAmount }}</span>
                    </div>
                    <div class="sys-box">
                        <template v-if=" item.ordersState == 1 ">
                            <a href="JavaScript:;" class="sys" @click=" _gotoVue(item, '3') ">提货</a>
                            <a href="JavaScript:;" class="sys" v-if="item.type != '3' " @click=" _toReturnGoods(item) ">退货</a>
                            <a href="JavaScript:;" class="sys" @click=" _gotoVue(item, '1') ">红包</a>
                            <a href="JavaScript:;" class="sys active" @click=" _gotoVue(item, '2') ">升级</a>
                        </template>
                        <template v-else-if=" item.ordersState == 3 ">
                            <template v-if=" item.upState == 1 ">
                                <a href="JavaScript:;" class="sys small" @click=" _toIntegral(item) " v-if=" item.type == '1' ">积分兑换</a>
                                <a href="JavaScript:;" class="sys small" @click=" _toRecycling(item) " v-else-if=" item.type == '2' ">回收</a>
                            </template>
                            <template v-else-if=" item.upState == 2 ">
                                <a href="JavaScript:;" class="sys small" @click=" _toRecycling(item) " v-if=" item.type == '1' ">回收</a>
                            </template>
                            <a href="JavaScript:;" class="sys small active" @click=" _gotoVue(item, '3') ">提货</a>
                        </template>
                        <template v-else-if=" item.ordersState == 8 || item.ordersState == 9">
                            <a href="JavaScript:;" :class="['sys small'] + [ item.ordersState == 6 ? ' active': '' ]" @click=" _toSeeLogistics(item) ">查看物流</a>
                            <a href="JavaScript:;" class="sys small active" @click=" _toConfirmGoods(item) " v-if=" item.ordersState == 8 ">确认收货</a>
                        </template>
                        <template v-else></template>
                    </div>
                </div>
            </li>
            <li v-if=" dataList.length >= page.size ">
                <template v-if=" dataList.length < page.total ">
                    <div class="more" @click=" _getMore ">点击加载更多</div>
                </template>
                <template v-else>
                    <div class="more" @click="">没有更多了</div>
                </template>
            </li>
        </ul>
        <div class="error-box" v-else>
            <div class="error-icon">
                <img src="/static/img/noOrder.png" alt="">
            </div>
            <div class="error-help">您还没有相关的订单</div>
        </div>
        <mt-popup v-model="model.visible" popup-transition="popup-fade" v-if="model != null ">
            <div class="model-header" v-if="model.showHeader">
                <span> {{ model.header }} </span>
            </div>
            <div :class="['model-content'] + [ model.secondContent != '' ? ' samll' : '' ]">
                <div class="content" v-html="model.content"></div>
                <div class="content" v-html="model.secondContent" v-if="model.secondContent"></div>
            </div>
            <div class="model-footer">
                <a href="JavaScript:;" :class=" [ 'btn ' ] + model.actionClass + [ model.showCancel ? '' : ' big' ]" v-if="model.showAction" @click=" _action "> {{ model.actionText }} </a>
                <a href="JavaScript:;" :class=" [ 'btn ' ] + model.cancelClass " v-if="model.showCancel" @click=" model.visible = false "> {{ model.cancelText }} </a>
            </div>
        </mt-popup>
        <nav-bar></nav-bar>
    </div>
</template>
<script>
import { Popup } from 'mint-ui';
import navbar from '@/components/tool/navbar' //快速导航栏
export default {
    name: 'myUpgrade',
    components: {
        'nav-bar': navbar
    },
    data() {
        return {
            page: { total: 10, current: 1, size: 10 }, // 页面数据参数
            dataList: [], // 显示数据组
            pageQuery: null, // 页面接受参
            model: { visible: false },
            currentData: null, // 当前数据
        }
    },
    created() {
        this.pageQuery = this.$route.query;
        document.title = '升级订单';
    },
    mounted() {
        this.$nextTick(function() {
            this._getData();
        });
    },
    methods: {
        /**
         * [_gotoVue 去其他页面 ]
         * @param  {[type]} _scope [订单数据]
         * @param  {[type]} type   [type: 1:猜红包, 2:猜奇偶, 3:提货]
         * @return {[type]}        [离开页面,缓存订单数据]
         */
        _gotoVue(_scope, type) {
            var _routerName;
            switch (type) {
                case '1':
                    _routerName = 'guessGift';
                    break;
                case '2':
                    _routerName = 'guessSize';
                    break;
                case '3':
                    _routerName = 'pickGoods';
                    break;
            }
            this.$router.push({ name: _routerName, query: { id: _scope.ordersNo } });
            this._setCookie('_UPRODERID', encodeURI(_scope.ordersNo), 2, 1);
        },
        // 加载更多
        _getMore() {
            this.page.current++;
            this._getData();
        },
        // 获取数据
        _getData() {
            this.model.visible = false;
            var _that = this;
            this.$http.get(this.baseUrl + '/promotion/userOrderList', {
                params: { customerCode: this.userInfo.customerCode, pageNum: this.page.current, pageSize: this.page.size }
            }).then(function(res) {
                if (!res) { return false }
                _that.page.total = res.total;
                if (_that.page.current == 1) {
                    _that.dataList = res.aatList;
                } else {
                    for (var i = 0; i < res.aatList.length; i++) { _that.dataList.push(res.aatList[i]) }
                }
            });
        },
        // 申请收回 [弹框] 
        // 增值专区回收：升级前商品价格*数量*1.15  
        // 促销专区回收：升级后商品价格*数量
        _toRecycling(_scope) {
            this.currentData = _scope;
            this.model = { visible: true, showHeader: true, header: '申请收回', secondContent: '', actionType: 'recycling', showAction: true, actionClass: '', actionText: '确定', showCancel: true, cancelClass: 'active', cancelText: '取消' };
            if (_scope.type == 2) {
                this.model.content = '<strong>' + this.onlyMoney(this.NumberMul(this.NumberMul(this.currentData.goodsPrice, this.currentData.proCount), 1.15).toString()) + '</strong> 元将退回至账户余额中';
            } else if (_scope.type == 1) {
                this.model.content = '<strong>' + this.onlyMoney(this.NumberMul(this.currentData.goodsPrice, this.currentData.proCount).toString()) + '</strong> 元将退回至账户余额中';
            }
        },
        // 申请收回 => 结果 [刷新数据]
        _goRecycling() {
            var _that = this;
            this.$http.post(this.baseUrl + '/promotion/recoveryOrder', {
                token: this.token,
                customerCode: this.userInfo.customerCode,
                ordersNo: this.currentData.ordersNo
            }).then(function(res) {
                if (!res) { return _that.model.visible = false; }
                _that._getData();
            })
        },
        // 申请退货 [弹框]
        _toReturnGoods(_scope) {
            this.currentData = _scope;
            this.model = { visible: true, showHeader: false, header: '申请退货', content: '确定退货', secondContent: '', actionType: 'returnGoods', showAction: true, actionClass: '', actionText: '确定', showCancel: true, cancelClass: 'active', cancelText: '取消' };
        },
        // 申请退货 => 返回结果 [刷新数据,提示框]
        _goReturnGoodsResult() {
            var _that = this;
            this.$http.post(this.baseUrl + '/promotion/returnApply', {
                token: this.token,
                customerCode: this.userInfo.customerCode,
                ordersNo: this.currentData.ordersNo
            }).then(function(res) {
                if (!res) { return _that.model.visible = false; }
                _that.model = { visible: true, showHeader: true, header: '退货成功', content: '<strong>' + res.finalAmount + '</strong> 元将退回至账户余额中', secondContent: '', actionType: 'closeModel', showAction: true, actionClass: 'active', actionText: '确定', showCancel: false, cancelClass: '', cancelText: '取消' };
            });
        },
        // 申请兑换积分 [弹框设置]
        _toIntegral(_scope) {
            this.currentData = _scope;
            this.model = {
                visible: true,
                showHeader: false,
                header: '申请兑换积分',
                content: '<i class="icon iconfont icon-Prompt"></i> 是否将本商品兑换成积分?',
                secondContent: '',
                actionType: 'integral',
                showAction: true,
                actionClass: 'active',
                actionText: '确定',
                showCancel: true,
                cancelClass: '',
                cancelText: '取消'
            };
        },
        // 积分兑换成功 => 请求后台返回提示. [弹框设置]
        _goIntegralMessage() {
            var _that = this;
            this.$http.post(this.baseUrl + '/promotion/exchangeOrder', {
                token: this.token,
                customerCode: this.userInfo.customerCode,
                ordersNo: this.currentData.ordersNo
            }).then(function(res) {
                if (!res) { return _that.model.visible = false; }
                _that.model = {
                    visible: true,
                    showHeader: true,
                    header: '兑换成功',
                    content: '商品价值 : <strong>' + res.finalAmount + '</strong> 元',
                    secondContent: '兑换积分 : <strong>' + res.rebackPoint + '</strong> 分',
                    actionType: 'closeModel',
                    showAction: true,
                    actionClass: 'active',
                    actionText: '确定',
                    showCancel: false,
                    cancelClass: '',
                    cancelText: '取消'
                };
            })
        },
        // 确认收货 => 没有设计稿 [弹框设置]
        _toConfirmGoods(_scope) {
            this.currentData = _scope;
            this.model = {
                visible: true,
                showHeader: false,
                header: '确认是否收货?',
                content: '<i class="icon iconfont icon-Prompt"></i>' + ' 请确认是否收到本商品?',
                secondContent: '',
                actionType: 'confirmGoods',
                showAction: true,
                actionClass: 'active',
                actionText: '确定',
                showCancel: true,
                cancelClass: '',
                cancelText: '取消'
            };
        },
        // 确认收货 => 刷新数据
        _goConfirmGoodsResult() {
            var _that = this;
            this.$http.post(this.baseUrl + '/promotion/receiptOrder', {
                token: this.token,
                customerCode: this.userInfo.customerCode,
                ordersNo: this.currentData.ordersNo,
            }).then(function(res) {
                if (!res) { return _that.model.visible = false; }
                _that._getData();
            });
        },
        // 查看物流 [弹框设置]
        _toSeeLogistics(_scope) {
            // console.log(_scope);
            // this.currentData = _scope;
            this.$router.push({ name: 'MyOrderLogistics', query: { id: _scope.ordersNo, type: 'upOrder' } });
        },
        // 弹框 => 提交按钮
        _action() {
            /*  状态: => 0待付款 1已付款 2.升级中 3.升级完成 4.兑换积分 5.退货 6.回购 7.发起申请中 8.提货中 9.确认收货 */
            switch (this.model.actionType) {
                case "confirmGoods":
                    this._goConfirmGoodsResult();
                    break;
                case "integral": // 兑换积分
                    this._goIntegralMessage()
                    break;
                case "returnGoods": // 退货
                    this._goReturnGoodsResult()
                    break;
                case "recycling": // 回收
                    this._goRecycling();
                    break;
                case "closeModel": // 确定信息 关闭
                    this._getData();
                    break;
            }
        },
    }
}

</script>
<style>
#myUpgrade .model-content .content strong {
    font-weight: bold;
    color: #333333;
}

</style>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style scoped>
@import url(./myupgrade.css);

</style>
