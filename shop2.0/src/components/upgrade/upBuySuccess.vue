<!-- 升级产品购买成功 -->
<template>
    <div class="upBuySuccess">
        <div class="top">
            <h3><img src="../../../static/img/close-white.png" @click="$router.push('/myUpgrade')" /></h3>
            <p>下单成功</p>
        </div>
        <div class="choice">
            <h3>您需要升级产品吗？</h3>
            <button class="btn-red" @click="$router.push({ path:'/guessSize', query: { id: ordersNo }})">猜鸡藕</button>
            <button class="btn-red" @click="$router.push({ path:'/guessGift', query: { id: ordersNo }})">猜红包</button>
            <button class="btn-white" @click="$router.push({ path:'/pickGoods', query: { id: ordersNo }})">去提货</button>
        </div>
    </div>
</template>
<script>
export default {
    name: 'upBuySuccess', // 升级产品购买成功
    data() {
        return {
            ordersNo: '',
        }
    },
    created() {
    	var ordersNo = this.$route.query.ordersNo;
    	if(ordersNo != undefined) {
    		this.ordersNo = ordersNo;
    	} else {
    		this.$router.push('/user');
    	}
//      this.orderInfo = JSON.parse(localStorage.getItem('orderInfo'));
        localStorage.removeItem('orderInfo');
    },
    mounted() {
        this.$nextTick(function() {

        });
    },
    destroyed() {

    },
    methods: {

    }

}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style scoped>
.top {
    width: 100%;
    height: 15.6rem;
    background-image: url(../../../static/img/bg-upSuccess.png);
    background-size: 100% 100%;
}

.top>h3 {
    padding: 1.5rem;
    text-align: right;
}

.top>h3 img {
    width: 2.25rem;
    height: 2.25rem;
    cursor: pointer;
}

.top>p {
    font-size: 1.5rem;
    color: #fff;
    text-align: center;
    margin-top: 4.6rem;
}

.choice>h3 {
    color: #000;
    font-size: 1.5rem;
    text-align: center;
    margin-top: 7.0rem;
    margin-bottom: 2.6rem;
}

.choice>button {
    width: calc(100% - 6.5rem);
    height: 4.5rem;
    font-size: 1.7rem;
    margin: 1.8rem 3.25rem;
    border-radius: 0.2rem;
}

.choice>button.btn-red {
    background-image: linear-gradient(-90deg,
    #f42925 0%,
    #f8472d 55%,
    #fc6435 100%);
    color: #fff;
}

.choice>button.btn-white {
    background: #fff;
    color: #f42a25;
    border-style: solid;
    border-width: 0.1rem;
    border-image-source: linear-gradient(-90deg,
    #f42925 0%,
    #f8472d 50%,
    #fc6435 100%);
    border-image-slice: 1;
    box-sizing: border-box;
}

</style>
