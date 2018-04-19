<!-- 商品过期不存在 / 商品已下架 -->
<template>
    <div class="goodsExpired">
        <div class="havenot-con" :style="{minHeight: (clientH*10) + 'px'}">
            <img src="/static/img/house.png" />
            <p>商品过期不存在</p>
            <template v-if="ordersNo != undefined">
                <br>
                <p>订单号: {{ordersNo}}</p>
            </template>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            ordersNo: null
        }
    },
    created() {
        this.ordersNo = this.$route.query.ordersNo;
    },
}

</script>
<style scoped>
.havenot-con {
    text-align: center;
    background: #f5f5f5;
}

.havenot-con img {
    width: 15rem;
    height: auto;
    margin-top: 10.0rem;
    margin-bottom: 1.6rem;
}

.havenot-con>p {
    color: #666;
    font-size: 1.5rem;
}

</style>
