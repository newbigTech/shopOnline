<!-- 个人信息 -->
<template>
    <div class="personalInfo">
    	<v-breadcrumb firstMenu="个人中心" secondMenu="个人信息"></v-breadcrumb>
    	<div class="nav">
    		<div class="col-md-12">
    			<div class="portlet box blue">
					<div class="portlet-title">
						<div class="caption">个人信息</div>
					</div>
					<div class="portlet-body">
						<table class="data-table">
							<tr>
								<td>账号：</td>
								<td>{{userData.phone}}</td>
							</tr>
							<tr>
								<td>机构名称：</td>
								<td>{{userData.companyName}}</td>
							</tr>
							<tr>
								<td>姓名：</td>
								<td>{{userData.id_card_name}}</td>
							</tr>
							<tr>
								<td>所属机构：</td>
								<td>{{userData.parent_company_name}}</td>
							</tr>
							<tr v-if="userData.user_type != '3'">
								<td>账户资金：</td>
								<td>{{ userData.accountMoney }}</td>
							</tr>
							<tr v-if="userData.user_type != '3'">
								<td>可提金额：</td>
								<td>{{userData.withdrawAmount}}</td>
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
    name: 'personalInfo', // 个人信息
    components: {
        'v-breadcrumb': breadcrumb
    },
    data() {
        return {
        	userData: {},//用户信息
        }
    },
    created() {
    },
    mounted() {
        this.$nextTick(function() {
        	this.getUserData();
        });
    },
    methods: {
    	//查询用户信息
    	getUserData() {
    		var that = this,
        		reqUrl = this.baseUrl + '/erp/user/personalInformation',
				params = { userId: this.userInfo.id }
			this.$http.get(reqUrl, { params: params })
			.then(function(res) {
				if(!res) { return; }
				that.userData = res;
				if(res.agent_name != undefined) {
					that.userData.companyName = res.agent_name;
				} else {
					that.userData.companyName = res.company_name;
				}
				that.userData.accountMoney = that.NumberAdd(res.balance, res.service_balance);
   			});
    	}
    }

}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style scoped>
.data-table tr td {
	padding: 20px 10px;
}
.data-table tr td:nth-child(1) {
	width: 200px;
	text-align: right;
}
</style>
