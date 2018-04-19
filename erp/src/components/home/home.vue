<!-- 首页数据 -->
<template>
    <div class="home">
        <v-breadcrumb firstMenu="首页"></v-breadcrumb>
        <div class="nav">
            <div class="col-md-12">
                <div class="portlet box blue">
                    <div class="portlet-title">
                        <div class="caption">{{userInfo.companyName}}&nbsp;&nbsp;&nbsp;数据概览</div>
                    </div>
                    <div class="portlet-body">
                        <table class="data-table">
                            <tr>
                                <td>本月新增用户(个): </td>
                                <td>{{dataObj.dateUserNum}}</td>
                            </tr>
                            <tr>
                                <td>当前用户总数(个): </td>
                                <td>{{dataObj.allUserNum}}</td>
                            </tr>
                            <tr>
                                <td>本月充值金额(元): </td>
                                <td>{{dataObj.recharge}}</td>
                            </tr>
                            <tr>
                                <td>本月提现金额(元): </td>
                                <td>{{dataObj.withdraw}}</td>
                            </tr>
                            <tr>
                                <td>本月营业额(元): </td>
                                <td>{{dataObj.money}}</td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import breadcrumb from '@/components/tool/breadcrumb' //面包屑
export default {
    name: 'home', // 首页
    components: {
        'v-breadcrumb': breadcrumb
    },
    data() {
        return {
        	dataObj: {}
        }
    },
    created() {

    },
    mounted() {
        this.$nextTick(function() {
			this.getData();
        });
    },
    methods: {
    	//获取首页数据
    	getData() {
    		var that = this,
    			reqUrl = this.baseUrl + '/erp/home/info',
    			params = { token: this.token };
			this.$http.post(reqUrl, params).then(function(res) {
				if(!res) { return; }
				that.dataObj = res;
			})
    	}
    }

}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style scoped>
.data-table tr td {
    padding: 20px 30px;
    border: 1px solid #aaa;
}

</style>
