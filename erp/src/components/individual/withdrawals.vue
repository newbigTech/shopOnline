<!-- 个人信息 -->
<template>
    <div class="personalInfo">
    	<v-breadcrumb firstMenu="个人中心" secondMenu="账户提现"></v-breadcrumb>
    	<div class="nav">
    		<div class="col-md-12">
    			<div class="portlet box blue">
					<div class="portlet-title">
						<div class="caption">账户提现</div>
					</div>
					<div class="portlet-body">
						<table class="data-table">
							<tr>
								<td>到账银行：</td>
								<td>
									<span v-if="!bindBank">还未<span class="text-blue" @click="goBind('add')">绑定银行卡</span></span>
									<template v-if="bindBank">
										<span>{{bankName}}</span>
										<span>{{bankNo}}</span>
										<button class="btn btn-success" v-if="bindBank"  @click="goBind('update')">变更银行卡</button>
									</template>
								</td>
							</tr>
							<tr>
								<td>账户余额(元)：  </td>
								<td>{{ accountData.accountMoney }}</td>
							</tr>
							<tr>
								<td>可提金额(元)： </td>
								<td>{{accountData.withdrawAmount}}</td>
							</tr>
							<tr>
								<td>提现金额： </td>
								<td>
									<el-input type="number" placeholder="请输入金额" v-model="money" min="0">
									    <template slot="append">元</template>
									</el-input>
								</td>
							</tr>
						</table>
						<button class="btn btn-danger ml200" @click="handleNext">下一步</button>
					</div>
    			</div>
    		</div>
    	</div>
    
    	<!-- 绑定银行卡弹框 -->
    	<el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="30%" @close="handleCancle">
    		<!-- 绑定或变更银行卡 -->
    		<template v-if="isBind">
    			<div class="dialog-item">
	    			<span>银行卡号：</span>	
	    			<input type="text" placeholder="请输入银行卡卡号" v-model="bindObj.bank_no" maxlength="25">
	    			<p class="text-red">请输入持卡人本人的银行卡号</p>
	   			</div>
	   			<div class="dialog-item">
	    			<span>姓名：</span>	
	    			<input type="text" class="form-control input-inline" placeholder="请输入持卡人完整姓名" v-model="bindObj.id_card_name"
	    				 readonly="readonly">	
	    		</div>
	    		<div class="dialog-item">
	    			<span>证件类型：</span>	
	    			<input type="text" class="form-control input-inline" v-model="bindObj.papType" readonly="readonly">	
	    		</div>
	    		<div class="dialog-item">
	    			<span>证件号：</span>	
	    			<input type="text" class="form-control input-inline" placeholder="请输入证件号" v-model="bindObj.id_card"
	    				 readonly="readonly" maxlength="18">	
	    			<p class="text-red">请填写银行预留信息,一经绑定无法修改</p>
	    		</div>
	    		<div class="dialog-item">
	    			<span>手机号：</span>	
	    			<input type="text" class="form-control input-inline" v-model="bindObj.bank_phone">	
	    		</div>
	    	</template>
	    	<!-- 提现下一步 -->
	    	<template v-if="!isBind">
	    		<h4 class="money-title">金额<span>{{money}}</span>元</h4>
	    		<div class="dialog-item">
	    			<span>手机验证码：</span>	
	    			<input type="text" v-model="verifyCode" maxlength="6">	
	    			<button class="btn btn-default btn-send" @click="sendCode" v-if="!hadSend">获取验证码</button>
	    			<button class="btn btn-default btn-send" v-if="hadSend">{{sendTime}}s后重发</button>
	    		</div>
	    	</template>
			<div slot="footer" class="dialog-footer">
			    <el-button @click="handleCancle">取 消</el-button>
			    <el-button type="primary" @click="handleBind" v-if="isBind">确 定</el-button>
			    <el-button type="primary" @click="handleWithdraw" v-if="!isBind">确 定</el-button>
			</div>
		</el-dialog>
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
        	hadSend: false,
        	sendTime: 60,
           	bindBank: true,//是否绑定了银行卡
           	dialogTitle: '绑定银行卡',
           	accountData: {},
           	bankName: '',
           	bankNo: '',
           	money: 100,
           	isAdd: true,//当前是添加银行卡
           	isBind: true,//是否为绑定银行卡
           	dialogVisible: false,
           	bindObj: {papType: '身份证'},
           	verifyCode: '',
           	time1: null
        }
    },
    created() {
    	var hadSend = localStorage.getItem('hadSend');
    	var sendTime = localStorage.getItem('sendTime');
    	if(hadSend != null && sendTime != null) {
    		this.sendTime = parseInt(sendTime);
    		this.countTime();
    	}
    },
    mounted() {
        this.$nextTick(function() {
        	this.getAccountData();
        });
    },
    destroyed() {
		// console.group('销毁完成状态===============》destroyed');
		window.clearInterval(this.time1);
		localStorage.removeItem('hadSend'); //是否发送了验证码
		localStorage.removeItem('sendTime'); //发送验证码时间间隔       
	},
    methods: {
    	//查询账户信息
    	getAccountData(){
    		var that = this,
        		reqUrl = this.baseUrl + '/account/info',
				params = { userId: this.userInfo.id }
			this.$http.get(reqUrl, { params: params })
			.then(function(res) {
				if(!res) { return; }
				that.accountData = res;
				that.accountData.accountMoney = that.NumberAdd(res.balance, res.service_balance);
				var bankInfo = res.bankInfo;
				that.bindObj = {
					papType: '身份证',
					id_card_name:  res.id_card_name,
					id_card: res.id_card
				}
				if(bankInfo != undefined) {
					that.bindObj.bank_no = res.bank_no;
					that.bindObj.bank_phone = res.bank_phone;
					that.bankName = bankInfo.bank_name;
					that.bankNo = that.encryBankNo(res.bank_no);
					that.bankNo != '' ? that.bindBank = true : that.bindBank = false; 
					
				} else {
					if(res.bank_no != undefined) {
						that.bindBank = true;
					} else {
						that.bindBank = false;
					}
				}
   			});
    	},
    	//去绑定银行卡
    	goBind(param) {
    		this.isBind = true;
    		this.dialogVisible = true;
    		if(param == 'add') {
    			this.isAdd = true;
    			this.dialogTitle = '绑定银行卡';
    		} else {
    			this.isAdd = false;
    			this.dialogTitle = '变更银行卡';
    		} 
    	},
    	//下一步
    	handleNext() {
    		if(!this.bindBank) { //没有绑定卡时，得先绑定卡
    			this.$message('请先绑定银行卡');
    			return;
    		}
    		if(parseFloat(this.money) > parseFloat(this.accountData.withdrawAmount)) {
    			this.$message('提现金额不能大于可提现金额');
    			return;
    		}
    		
    		//校验 提现申请
    		var that = this,
        		reqUrl = this.baseUrl + '/account/checkSaveWithdrawInfo',
				params = { 
					userId: this.userInfo.id,
					bankCard: this.bindObj.bank_no,
					amountStr: this.money
				}
			this.$http.post(reqUrl, params)
			.then(function(res) {
				if(!res) { return; }
				that.dialogVisible = true;
	    		that.dialogTitle = '账户提现';
	    		that.isBind = false;
   			});
    	},
    	//取消绑定
    	handleCancle() {
    		this.dialogVisible = false;
    	},
    	//确认绑定
    	handleBind() {
    		var that = this,
        		reqUrl = this.baseUrl + '/account/checkBankInfo',
				params = { 
					userId: this.userInfo.id,
					bankCard: this.bindObj.bank_no,
					phone: this.bindObj.bank_phone
				}
			this.$http.post(reqUrl, params)
			.then(function(res) {
				if(!res) { return; }
				that.dialogVisible = false;
				that.getAccountData();
   			});
    	},
    	//发送验证码
    	sendCode() {
    		var that = this,
        		reqUrl = this.baseUrl + '/account/sendSMS',
				params = { phone: this.bindObj.bank_phone }
			this.$http.post(reqUrl, params)
			.then(function(res) {
				if(!res) { return; }
				that.$message('验证码发送成功');
				that.countTime();
   			});
    	},
    	//倒计时
    	countTime() {
    		var that = this;
    		that.hadSend = true;
    		localStorage.setItem('hadSend', that.hadSend);
    		this.time1 = setInterval(function() {
    			if(that.sendTime <= 1) {
    				window.clearInterval(that.time1);
    				that.sendTime = 60;
    				that.hadSend = false;
    				localStorage.removeItem('sendTime');
    				localStorage.removeItem('hadSend');
    				return;
    			}
    			that.sendTime--;
    			localStorage.setItem('sendTime', that.sendTime);
    		}, 1000)
    	},
    	//保存提现
    	handleWithdraw() {
    		if(this.verifyCode == '') {
    			this.$message('验证码不能为空');
    			return;
    		}
    		var that = this,
        		reqUrl = this.baseUrl + '/account/saveWithdrawInfo',
				params = {  
					phone: this.bindObj.bank_phone,
					verifyCode: this.verifyCode,
					businessType: 'erpWithdraw',
					userId: this.userInfo.id,
					bankCard: this.bindObj.bank_no,
					amountStr: this.money
				}
			this.$http.post(reqUrl, params)
			.then(function(res) {
				if(!res) { return; }
				that.$message('提现成功');
				that.dialogVisible = false;
				that.getAccountData();
   			});
    	}
    }

}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style scoped>
.data-table {
	margin-bottom: 20px;
}
.data-table tr td {
	padding: 20px 10px;
}
.data-table tr td:nth-child(1) {
	width: 200px;
	text-align: right;
}
.data-table  tr td span {
	margin-right: 10px;
}
.ml200 {
	margin-left: 200px;
}
.text-blue {
	color: #3598dc;
	text-decoration: underline;
	cursor: pointer;
}
.text-red {
	margin-left: 110px;
	color: #f1353d;
}
.money-title {
	text-align: center;
	margin-bottom: 20px;
}
.money-title > span {
	color: #f3565d;
	font-size: 24px;
	padding: 0 5px;
	font-weight: bold;
}
.dialog-item {
	position: relative;
	left: 0;
	top: 0;
	text-align: center;
}
.btn-send {
	position: absolute;
	top: 0;
	left: 70%;
	width: 100px;
	height: 45px;
	border: 1px solid #e5e5e5;
}
</style>
