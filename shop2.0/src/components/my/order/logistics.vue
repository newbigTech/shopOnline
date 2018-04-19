<!-- 物流详情页面 -->
<template>
    <div id="LogisticsDetails">
        <template v-if="isUpRrder">
            <div class="goods" v-if="upOrderAddress!=null">
                <div class="company-name">{{upOrderAddress.stateText}}</div>
                <div class="goods-cover">
                    <img :src="upOrderAddress.goodsPic" alt="">
                </div>
                <div class="company">
                    <ul class="company-info">
                        <li>物流公司: {{upOrderAddress.expressName}}</li>
                        <li>运单编号: {{upOrderAddress.expressNo}}</li>
                        <li>物流电话: {{upOrderAddress.compPhone}}</li>
                    </ul>
                </div>
            </div>
        </template>
        <template v-else>
            <div class="goods" v-if="logisticsInfo != null">
                <div class="company-name">{{logisticsInfo.stateText}}</div>
                <div class="goods-cover">
                    <img :src="logisticsInfo.proSimg" alt="">
                </div>
                <div class="company">
                    <ul class="company-info">
                        <li>物流公司: {{logisticsInfo.expName}}</li>
                        <li>运单编号: {{logisticsInfo.expressWaybill}}</li>
                        <li>物流电话: {{logisticsInfo.compPhone}}</li>
                    </ul>
                </div>
            </div>
        </template>
        <div class="goos-compInfo" v-if="show">
            <label>物流跟踪</label>
            <ul class="items">
                <li class="address">
                    <i class="icon iconfont icon-dizhi1"></i>
                    <span>地址:{{pageQuery.address}}</span>
                </li>
                <li class="item" v-if="logisticsInfo.state==0">
                    <i class="icon active"></i>
                    <span>暂无物流</span>
                </li>
                <li class="item" v-for="comp, _index in itemListSort" :key="_index" v-else>
                    <i :class="['icon '] + [_index == 0 ? 'active' : '']"></i>
                    <span :class="['text '] + [_index == 0 ? 'active' : '']">{{comp.AcceptStation}}</span>
                    <span :class="['time '] + [_index == 0 ? 'active' : '']">{{comp.AcceptTime}}</span>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
export default {
    name: 'Logistics', // 结构名称
    data() {
        return {
            pageQuery: null,
            logisticsInfo: {
                compInfo: null
            },
            show: false,
            isUpRrder: false,
            upOrderAddress: null,
        }
    },
    computed: {
        itemListSort: function() {
            var _arr = [];
            if (this.logisticsInfo.compInfo != null) {
                for (var i = this.logisticsInfo.compInfo.length - 1; i >= 0; i--) {
                    _arr.push(this.logisticsInfo.compInfo[i])
                }
                return _arr;
            }
        }
    },
    created() {
        document.title = '查看物流';
        this.pageQuery = this.$route.query;
        if (this.pageQuery.sku == null) {
            this.isUpRrder = true;
            this._getLogistics();
        } else {
            this.isUpRrder = false;
            this._getData();
        }
        this.$nextTick(function() {});
    },
    mounted() {
		this.$nextTick(function() {
			document.title = '订单物流';
		})
    },
    methods: {
        // 获取普通订单物流
        _getData() {
            var _that = this;
            this.$http.get(this.baseUrl + '/order/findOrderLogistics', {
                params: { token: this.token, customerCode: this.userInfo.customerCode, totalOrdersNo: this.pageQuery.id, proSkuNo: this.pageQuery.sku }
            }).then(function(res) {
                if (!res) { return }
                // res.state = 1;
                // res.compInfo = [{"AcceptStation": "[沧州市] [沧州肃宁]的客户一已收件 电话:15354029064", "AcceptTime": "2018-01-07 19:28:23"}, {"AcceptStation": "[沧州市] 快件离开 [沧州肃宁]已发往[长沙中转部]", "AcceptTime": "2018-01-07 20:09:20"}, {"AcceptStation": "[沧州市] 快件到达 [沧衡转运中心]", "AcceptTime": "2018-01-07 22:07:59"}, {"AcceptStation": "[沧州市] 快件离开 [沧衡转运中心]已发往[长沙中转部]", "AcceptTime": "2018-01-09 18:33:56"}, {"AcceptStation": "[长沙市] 快件到达 [长沙中转部]", "AcceptTime": "2018-01-11 03:49:27"}, {"AcceptStation": "[长沙市] 快件离开 [长沙中转部]已发往[长沙南站]", "AcceptTime": "2018-01-11 03:49:38"}, {"AcceptStation": "[长沙市] 快件到达 [长沙南站]", "AcceptTime": "2018-01-11 06:21:26"}, {"AcceptStation": "[长沙市] [长沙南站]的P1任重庆正在第1次派件 电话:18774048346 请保持电话畅通、耐心等待", "AcceptTime": "2018-01-11 10:21:11"}, {"AcceptStation": "[长沙市] [长沙南站]的派件已签收 感谢使用中通快递,期待再次为您服务!", "AcceptTime": "2018-01-11 12:31:27"} ];
                _that.show = true;
                _that.logisticsInfo = res;
                switch (res.state) {
                    case '0':
                        _that.logisticsInfo.stateText = '商品未发货';
                    case '1':
                        _that.logisticsInfo.stateText = '卖家发货';
                        break;
                    case '2':
                        _that.logisticsInfo.stateText = '运输途中';
                        break;
                    case '3':
                        _that.logisticsInfo.stateText = '买家签收';
                }
            });
        },
        // 获取升级订单物流
        _getLogistics() {
            var _that = this;
            this.$http.get(this.baseUrl + '/promotion/findOrderDeliveryInfo', {
                params: { customerCode: this.userInfo.customerCode, token: this.token, ordersNo: this.pageQuery.id }
            }).then(function(res) {
                if (!res) { return }
                _that.upOrderAddress = res;
                _that._getLogisticsList(res);
                _that.pageQuery.address = res.address;
            })
        },
        // 获取物流信息
        _getLogisticsList(_item) {
            // _item.expressNo = '454244690951';
            // _item.compCode = 'ZTO';
            var _that = this;
            this.$http.get(this.baseUrl + '/logisticsInfo/query', {
                params: { n: _item.expressNo, t: _item.compCode }
            }).then(function(res) {
                if (!res) { return }
                _that.show = true;
                _that.logisticsInfo.compInfo = res.Traces;
                _that.logisticsInfo.state = res.State;
            })
        },
    }
}

</script>
<style>
@import './logistics.css'

</style>
