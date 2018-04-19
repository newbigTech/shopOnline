<template>
    <router-view></router-view>
</template>
<script>
export default {
    data() {
        return {}
    },
    created() {
        if (this.token == null && this.userInfo == null) {
            return this.$router.push({ 'name': 'Login' });
        }
    },
    watch: {
        // 如果路由有变化，会再次执行该方法
        $route: function(val, oldVal) {
            // console.log(val.name, oldVal.name, val);
            // 订单评价完成 => 返回 => 订单申请 ====> 订单申请列表
            // if (oldVal.name == 'MyOrderAppraise' && val.name == 'MyOrderAppraiseSuccess') {
            //     this.$router.push({ name: 'MyOrderList', query: { type: 'appraise' } });
            // }
            // 订单售后完成 => 返回 => 订单申请 ====> 订单申请列表
            // if (oldVal.name == 'MyAfterSalesState' && val.name == 'MyAfterSales') {
            //     this.$router.push({
            //         name: 'MyAfterSalesList'
            //     });
            // }
        }
    },
}

</script>
