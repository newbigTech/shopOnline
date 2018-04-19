<!--
	我的=>账户余额=>提现
-->
<template>
	<div class="withDraw" :style="{'min-height': clientH *10 +'px'}">
		<div class="bank">
			<div class="name">到账银行卡</div>
			<template>
				<div class="choose" v-if="!hadBind" @click="goToBind">
					<span>请先绑定银行卡</span>
					<i class="iconfont icon-return-copy"></i>
				</div>
				<div class="choose other" v-if="hadBind">{{bankInfo}}</div>
			</template>
		</div>
		<div class="money">
			<p class="name">提现金额<!--（免收服务费）-->
				<span @click="getWithdrawRule">提现规则</span>
			</p>
			<div class="number border-1px">￥
				<span>
					<input type="text" class="input" v-model="inputNum" @keyup="onlyNumber" ref="trouble">
				</span>
			</div>
			<div class="balance">
				<template>
					<span v-show="inputNum == ''">可提现金额{{moneyInfo.isBalance}}元</span>
					<span v-show="inputNum <= moneyInfo.isBalance && inputNum != ''">今日可提现<i>{{times}}</i>次，
						额外扣除￥{{serviceMoney}}元手续费(费率0.6%)
					</span>
					<span v-show="inputNum > moneyInfo.isBalance" :style="{'color':'#d4282d'}">金额超过可提现金额</span>
				</template>
				<p><span class="all" @click="getAll">全部提现</span></p>
			</div>
		</div>
		<div class="affirm active" v-if="moneyInfo.isBalance>=inputNum && (inputNum != '')" @click="withdraw">确认提现</div>
		<div class="affirm" v-else>确认提现</div>
		<!-- 温馨提示 -->
		<div class="warn-info">
			<h4>温馨提示：</h4>
			<p>提现时需缴纳提现金额0.6%的手续费（微信支付收取）</p>
		</div>
		
		<!-- 支付密码框 -->
		<pay-pop :viewPop="popupVisible" @result="getPwd" @result2="closePop"></pay-pop>
		
        <!-- 提现规则 -->
        <div class="message-model on" v-if="showRule">
            <div class="title-box">
                <i class="icon" @click="showRule = false">×</i>
                <h3>{{roleInfo.protocol_name}}</h3>
                <p><span class="help-text">{{formatDate(roleInfo.update_time,'time')}}</span></p>
            </div>
            <div class="content-box">
                <div v-html="roleInfo.content"></div>
            </div>
            <div class="footer-box">
                <a href="javascript:;" class="btn btn-active" @click="showRule = false">知道了</a>
            </div>
            <div class="message-bg"></div>
        </div>
	</div>
</template>

<script type="text/ecmascript-6">
import payPop from '@/components/tool/payPop' //密码支付弹框
import { MessageBox,Indicator } from 'mint-ui';
export default {
	data() {
		return {
			popupVisible: false,
			inputNum: '',
			maxNum:0,
			times:3,
			hadBind: true,
			bankInfo: '',
			moneyInfo: [],
			hadPayPwd: false,//是否设置了支付密码
			showRule: false,
			roleInfo: null,//提现规则
			serviceMoney: 1.2,//最低提现200
		}
	},
	components: {
		'pay-pop': payPop
	},
	created() {
        
    },
	mounted(){
		this.$nextTick(function(){
			document.title = '提现';
			this.findMoney();
			this.isBind();
			this.getMoneyTimes();
//			this.getWithdrawRule();
  		})
	},
	methods:{
		//查询我的账户余额
        findMoney() {
            var that = this;
            var reqUrl = this.baseUrl + '/account/getMyAccount';
            this.$http.get(reqUrl).then(function(res) {
                if (!res) {
                    return;
                }
                that.moneyInfo = res;
                that.maxNum = res.accountAmount;
                that.serviceMoney = (that.moneyInfo.minBalance * 0.006).toFixed(2);
            });
        },
		//查询是否设置支付密码和绑定银行卡
        isBind() {
            var that = this,
            	reqUrl = this.baseUrl + '/bankcard/check';
            this.$http.get(reqUrl).then(function(res) {
                if (!res) { return; }
                //0未绑定，1已经绑定
                res.isBindCard == 0 ? that.hadBind = false : that.hadBind = true;
                //是否有支付密码
                res.isPayPassword == 0 ? that.hadPayPwd = false : that.hadPayPwd = true;
                if (res.isBindCard == 1) {
                	localStorage.setItem('bankData', JSON.stringify(res));
                	var bankList = res.bankList[0];
                	var str = '(' + bankList.bankcard.substring(bankList.bankcard.length-4) + ')';
                	that.bankInfo = bankList.bankName + str;
                }
            });
        },
        //获取提现次数接口
        getMoneyTimes() {
        	var that = this,
            	reqUrl = this.baseUrl + '/posit/findAcitvityNum';
            this.$http.get(reqUrl).then(function(res) {
                if (!res) { return; }
                that.times = res.result;
            });
        },
		//输入保留两位小数的金额
		onlyNumber() {
			this.inputNum = this.onlyMoney(this.$refs.trouble.value);
			if(this.inputNum < this.moneyInfo.minBalance) {
				this.serviceMoney = (this.moneyInfo.minBalance * 0.006).toFixed(2);
				return;
			}
			this.countService();
		},
		//计算手续费
		countService() {
			this.serviceMoney = (parseFloat(this.inputNum) * 0.006).toFixed(2);
		},
		//全部提现
		getAll() {
			this.inputNum = this.moneyInfo.isBalance;
			this.countService();
		},
		//确认提现
		withdraw() {
			if( this.inputNum < this.moneyInfo.minBalance) {
				this.$toast('提现金额不能低于' + this.moneyInfo.minBalance + '元');
				return;
			}
			var that = this,
            	reqUrl = this.baseUrl + '/withdraw/checkWithdrawInfo',
            	params = { withdrawAmount: this.inputNum }
            this.$http.post(reqUrl,params).then(function(res) {
                if (!res) { return; }
                if(res.result != "success") {
                	that.$toast('提现失败');
                	return;
                }
                that.popupVisible = true;
            });
		},
		//绑定银行卡
		goToBind() {
			//先判断有误支付密码
			if(!this.hadPayPwd) {
				var that = this;
                MessageBox({
                    title: '',
                    message: '还未设置支付密码',
                    confirmButtonText: '立即设置',
                    cancelButtonText: '取消',
                    showCancelButton: true
                }).then(function(action) {
                    if (action == 'confirm') { //去 设置支付密码
                        that.$router.push('/setPayPassword');
                    } else {}
                })
                return;
			}
			//查询操作银行卡次数
			var _that = this;
            this.$http.get(this.baseUrl + '/bankcard/getCounts', {
                params: { customerCode: this.userInfo.customerCode }
            }).then(function(res) {
                if (!res) { return }
                if(res.result == 'success') {
                	 _that.$router.push('/manageBank1?isNew=true');
                }
            });
		},
		getPwd(val) {
			Indicator.open({
				text: '提现中...',
				spinnerType: 'fading-circle'
			});
			this.popupVisible = false;
			//校验提现密码
			var that = this,
				reqUrl = this.baseUrl + '/bankcard/checktPayPassword',
				params = {payPassword: val};
			this.$http.post(reqUrl, params)
			.then(function(res) {
				Indicator.close();
				if(res == '支付密码错误') {
					setTimeout(function(){
						that.popupVisible = true;
					}, 1000);
					return;
				}
				if(res.code == '9998' && res.description == '支付密码错误次数过多,请稍后再试') { //支付次数过多)
					that.popupVisible = false;
					return;
				}
				if(!res) { return; }
				that.applyGet();//申请提现提交
 			});
		},
		closePop(val) {
			this.popupVisible = val;
		},
		//申请提现提交
		applyGet() {
			var that = this,
				reqUrl = this.baseUrl + '/withdraw/addWithdraw',
				params = {withdrawAmount: this.inputNum};
			this.$http.post(reqUrl, params)
			.then(function(res) {
				if(!res) { return; }
				that.$router.push('/withDrawResult');
				var info = {'bankInfo': that.bankInfo, 'withDrawMoney': that.inputNum }
				localStorage.setItem('withDrawInfo', JSON.stringify(info));
 			});
		},
		//提现规则
		getWithdrawRule() {
			var that = this,
				reqUrl = this.baseUrl + '/protocol/selectIsShow',
				params = {type: 5};
			this.$http.get(reqUrl, {params: params})
			.then(function(res) {
				if(!res) { return; }
				var list = res.list;
				if(list.length > 0) {
					that.showRule = true;
					that.roleInfo = res.list[0];
				} else {
					that.showRule = false;
				}
 			});
		}
	}
}
</script>

<style scoped>
@media (-webkit-min-device-pixel-ratio:1.5),(min-device-pixel-ratio:1.5) {
	.border-1px:after{
		-webkit-transform: scaleY(0.7);
        transform: scaleY(0.7);
	}
}
@media (-webkit-min-device-pixel-ratio:2),(min-device-pixel-ratio:2){
	.border-1px:after{
		-webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);
	}
}
.withDraw{
	background: #f5f5f5;
	padding-top:1.7rem;
	box-sizing: border-box;
}
.withDraw .bank{
	display: flex;
	width: calc(100% - 4rem);
	height: 4.9rem;
	line-height: 4.9rem;
	margin: 0 auto;
	background: #fff;
	border-radius: 1rem;
	font-size: 1.3rem;
	color: #333333;
}
.withDraw .bank .name{
	margin-left: 2.3rem;
	height: 4.9rem;
	width: 8.5rem;
}
.withDraw .bank .choose{
	flex: 1;
	height: 4.9rem;
	color: #999;
	margin-right: 1.2rem;
}
.withDraw .bank .choose>i{
	font-style: normal;
	float: right;
}
.withDraw .bank .choose.other{
	color: #0078ff;
}
.withDraw .money{
	width: calc(100% - 4rem);
	min-height: 15rem;
	margin: 0.7rem auto 0 auto;
	padding: 0 0 2.0rem 0;
	border-radius: 1rem;
	background: #fff;
}
.withDraw .money .name{
	width: calc(100% - 5rem);
	padding-top: 2.1rem;
	margin-left: 2.3rem;
	font-size: 1.3rem;
	color: #333;
}
.withDraw .money .name > span {
	float: right;
	color: #0078ff;
	font-size: 1.2rem;
	cursor: pointer;
}
.withDraw .money .number{
	display: flex;
	height: 3.3rem;
	line-height: 3.3rem;
	width: calc(100% - 5rem);
	margin: 0 auto;
	margin-top: 2.8rem;
	font-size: 2.1rem;
	color: #333333;
	position: relative;
}
.withDraw .money .number:after{
	position: absolute;
	display: block;
	left: 0;
	bottom: 0;
	border-top: 1px solid #d9d9d9;
	content: ' ';
	width: 100%;
}
.withDraw .money .number>span{
	width: 25rem;
	height: 3rem;
}
.withDraw .money .number .input{
	padding: 0 1rem;
	width: 100%;
	height: 3rem;
	font-size: 2.3rem;
	color: #333;
}
.withDraw .money .balance{
	width: calc(100% - 5rem);
	margin: 0 auto;
	margin-top: 2rem;
	font-size: 1.2rem;
	color: #999;
	line-height: 1.2rem;
}
.balance > span > i {
	font-style: normal;
	color: #d4282d;
}
.balance > p {
	margin-top: 1.0rem;
}
.withDraw .money .balance.active{
	color: #d4282d;
}
.withDraw .money .balance .all{
	display: inline-block;
	float: right;
	text-decoration: underline;
	color: #0078ff;
}
.withDraw .affirm{
	/*width: 33.5rem;*/
	width: calc(100% - 4rem);
	height: 4.5rem;
	line-height: 4.5rem;
	margin: 0 auto;
	margin-top: 2.6rem;
	background-color: #d9d9d9;
	border-radius: 0.5rem;
	text-align: center;
	font-size: 1.5rem;
	color: #fff;
}
.withDraw .affirm.active{
	background-color: #d4282d;
}
.rule-con {
	position: fixed;
	top: 0;
	left: 0;
	width: calc(100% - 4.0rem);
	padding: 2.0rem;
	font-size: 1.4rem;
	background: #fff;
}
.rule-con .close {
	color: #333;
	text-align: right;
	font-size: 1.5rem;
}
.rule-con .close > span {
	font-size: 2.0rem;
	margin-right: 0.5rem;
	cursor: pointer;
}
.rule-con .rule-title {
	font-size: 1.8rem;
	text-align: center;
}
.withDraw .rule-con p,
.withDraw ol {
	line-height: 2.0rem;
	font-size: 1.2rem;
	margin: 0.5rem 0;
}
.warn-info {
    width: calc(100% - 4rem);
    margin: 3.0rem auto 0 auto;
    padding: 0 0 2.0rem 0;
    font-size: 1.2rem;
}
.warn-info > h4 {
	color: #d4282d;
	margin-bottom: 0.8rem;
}
.warn-info > p {
	color: #bbb;
}
</style>