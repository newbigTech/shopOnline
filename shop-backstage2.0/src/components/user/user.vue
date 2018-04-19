<!-- 用户管理 -->
<template>
    <div class="user">
    	<v-breadcrumb firstMenu="用户" secondMenu="商城用户管理"></v-breadcrumb>
    	<div class="nav row">
    		<div class="col-md-12">
    			<div class="portlet box red">
					<div class="portlet-title">
						<div class="caption">商城用户管理</div>
					</div>
					<div class="portlet-body">
						<div class="operate">
								<span>用户手机号：</span>
								<input type="text" class="form-control input-inline" placeholder="用户手机号" v-model="userPhone" maxlength="11" onkeyup="value=value.replace(/[^\d]/g,'')">								
								<span>用户ID：</span>
								<input type="text" class="form-control input-inline" placeholder="用户ID" v-model="userID" onkeyup="value=value.replace(/[^\d]/g,'')">								
							<button type="button" class="btn btn-primary" @click="getCustomerInfo()">查询</button> 
						</div>
						<div class="table-scrollable">
							<el-table :data="tableData"  @selection-change="handleSelection">
							    <el-table-column prop="customer_id" label="用户ID" > </el-table-column>
							    <el-table-column prop="phone" label="手机号"> </el-table-column>
							    <el-table-column prop="" label="登录方式">
							    	<template slot-scope="scope">
							    		<span v-if="scope.row.loginType == 1">密码登录</span>
							    		<span v-if="scope.row.loginType == 2">短信验证码登录</span>
							    		<span v-if="scope.row.loginType == 3">微信</span>
							    		<span v-if="scope.row.loginType == 4">QQ</span>
							    		<span v-if="scope.row.loginType == 5">微博</span>
							    	</template>
							    </el-table-column>
							    <el-table-column prop="nick_name" label="用户昵称"> </el-table-column>
							    <el-table-column prop="finalAmount" label="累计消费金额(元)"> </el-table-column>
					         	<el-table-column prop="orderCount" label="累计订单数量"> </el-table-column>	
					         	<el-table-column prop="" label="账户状态">
					         		<template slot-scope="scope">
							    		<span v-if="scope.row.state == 'A'">正常</span>
							    		<span v-if="scope.row.state == 'F'">冻结</span>
							    	</template>
					         	</el-table-column>	
							    <el-table-column prop="" label="操作" width="200">
							    	<template slot-scope="scope">
							    		<el-switch v-model="scope.row.handleState" active-color="#cb5a5e" inactive-color="#ccc" @change="changeState(scope.row)"></el-switch>
							    	</template>
							    </el-table-column>
						    </el-table>
						</div>
					</div>
    			</div>
    		</div>
    	</div>
    </div>
</template>
<script>
import breadcrumb from '@/components/tool/breadcrumb'	//面包屑	
	
export default {
    name: 'user',
    components: {
    	'v-breadcrumb': breadcrumb
	},
    data() {
        return {
        	tableData: [],
        	userPhone:'',
        	userID:'',
        	state:''
        }
    },
    mounted() {
        this.$nextTick(function() {
        	
        });
    },
    methods: {
    	handleSelection: function() {
    		
    	},
    	//查询按钮
    	getCustomerInfo() {
    		this.$router.push({
				path: '/user', 
				query: {
					customerId: this.userID,
					phone:this.userPhone
				}
			})
    		var that = this;
			var reqUrl = this.baseUrl + '/backCustomer/getCustomerInfoByParam';
			var params = {
					token: that.token,
					//参数(必填)
					customerId: that.userID,
					phone: that.userPhone
			}
			this.$http.get(reqUrl, {params: params}).then((res) =>{
				if(!res) {
						return;
				}
				that.tableData = res.customerInfoList;
				for(var i=0;i<res.customerInfoList.length;i++){
					if(res.customerInfoList[i].state=='F'){that.tableData[i].handleState = false}
					else{that.tableData[i].handleState = true}
				}
				
			})
    	},
    	//恢复与冻结
    	changeState(item){
    		this.$confirm('确定这样操作吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					if(item.state == 'A'){this.state = 'F'}
					else{this.state = 'A'}
					var that = this;
					var reqUrl = this.baseUrl + '/backCustomer/frozenCustomer';
					var params = {
						token: that.token,
						//参数(必填)
						customerCode: item.customer_code,
						state:that.state
					}
					this.$http.post(reqUrl, params).then((res) => {
						if(!res) {
							return;
						}
						that.$message({
				          	message: '恭喜你，变更成功！',
				          	type: 'success'
	        			});
	        			that.getCustomerInfo();
					})
				}).catch(() => {
					this.$message({
			            type: 'info',
			            message: '已取消操作'
			          });
				})
    	}
    }
}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style scoped>
.operate {
	min-height: 30px;
	margin-bottom: 20px;
	clear: both;
}
.operate > input,
.operate > select {
	margin: 10px;
}
</style>
