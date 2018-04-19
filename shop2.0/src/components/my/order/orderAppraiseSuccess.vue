<!-- 订单评价 - 结果 -->
<template>
    <div id="orderAppraiseSuccess">
        <div class="success-box">
            <div class="thanks">感谢您的评价!</div>
            <div class="help-text">
                <span>春风十里不如您的一句满意~</span>
                <i class="icon iconfont icon-iconfontzhifeiji"></i>
            </div>
            <div class="callback-box">
                <router-link class="callback" :to="{ name: 'MyUser' }">个人中心</router-link>
                <router-link class="callback" :to="{ name: 'Index' }">首页逛逛</router-link>
            </div>
        </div>
        <div class="success-help">
            <i class="icon iconfont icon-gou"></i>
            <span>评论成功</span>
        </div>
        <div class="Recommended-goods" v-if="roderList!=null">
            <div class="title-box">以下商品还未进行评价哦</div>
            <ul class="goodLists">
                <li v-for="roder, index in roderList" :key="index" @click.stop="_goGoodsInfo(roder)">
                    <div class="cover"><img :src="roder.proSimg"></div>
                    <div class="desc">
                        <label>{{roder.proName}}</label>
                        <a href="javasript:;" class="appraise" @click.stop="_goAppraise(roder)">评价</a>
                    </div>
                </li>
            </ul>
            <div class="footer-box" v-if="roderList.length >= page.size">
                <template v-if="showMore">
                    <div class="more" @click="_getMore">点击加载更多</div>
                </template>
                <template v-else>
                    <div class="more">没有更多了</div>
                </template>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'orderAppraiseSuccess',
    data() {
        return {
            bodyHeight: document.documentElement.clientHeight + 'px',
            page: { current: 1, total: 0, size: 10 },
            showMore: false, //是否展示更多
            roderList: []
        }
    },
    mounted() {
        this.getOrderList();
        document.title = '订单评价';
    },
    methods: {
        // 获取更需数据 => ok
        _getMore() {
            this.page.current++;
            this.getOrderList();
        },
        getOrderList() {
            var _that = this;
            this.$http.get(this.baseUrl + '/order/findNoEvaluateProduct', {
                params: { token: this.token, customerCode: this.userInfo.customerCode, pageNum: this.page.current, pageSize: this.page.size }
            }).then(function(res) {
                if (!res) { return }
                _that.page.total = res.total;
                if (_that.page.current == 1) {
                    _that.roderList = res.productList;
                } else {
                    for (var i = 0; i < res.productList.length; i++) {
                        _that.roderList.push(res.productList[i])
                    }
                }
                if (_that.roderList.length < _that.page.total) {
                    _that.showMore = true;
                } else {
                    _that.showMore = false;
                }
            });
        },
        _goGoodsInfo(_order) {
            this.$router.push({ name: 'PdDetails', query: { proCode: _order.productId } });
        },
        _goAppraise(_order) {
            this.$router.push({
                name: 'MyOrderAppraise',
                query: {
                    No: _order.totalOrdersNo,
                    status: 4
                }
            });
        }
    }
}

</script>
<style>
@import './order.css'

</style>
