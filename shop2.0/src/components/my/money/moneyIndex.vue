<!-- 账户余额首页 -->
<template>
    <div class="moneyIndex" :style="{'height': (clientH * 10) +'px'}">
        <div class="top">
            <span @click="handleDetail">账户明细</span>
        </div>
        <div class="data">
            <p>账户余额(元)</p>
            <h1>￥{{moneyInfo.accountAmount}}</h1>
        </div>
        <div class="btn">
            <button class="btn-recharge" @click="$router.push('/moneyRecharge')">充值</button>
            <button class="btn-get" @click="$router.push('/withDraw')">提现</button>
        </div>
        <div class="btm">
            <span @click="handleBankcard" v-html="hadBank ? '管理我的银行卡' : '添加银行卡'"></span>
        </div>
    </div>
</template>
<script>
import { MessageBox } from 'mint-ui';
export default {
    name: 'moneyIndex', // 账户余额
    components: {
    },
    data() {
        return {
            hadBank: false, //是否已经绑定了银行卡
            hadPayPassword: false,//是否设置了支付密码  0未设置，1已经设置
            moneyInfo: [], //账户余额信息
        }
    },
    created() {
        
    },
    mounted() {
        this.$nextTick(function() {
        	document.title = '账户余额';
            this.isBind();
            this.findMoney();
        });
    },
    methods: {
        //查询我的账户余额
        findMoney() {
            var that = this;
            var reqUrl = this.baseUrl + '/account/getMyAccount';
            this.$http.get(reqUrl).then(function(res) {
                if (!res) {
                    return;
                }
                that.moneyInfo = res;
//              localStorage.setItem('moneyInfo', JSON.stringify(res));
            });
        },
        //账户明细
        handleDetail() {
            this.$router.push('/balance');
        },
        //管理银行卡
        handleBankcard() {
            if (this.hadBank) {
                this.$router.push('/myBankCard'); //到我的银行卡页面
            } else { //去添加银行卡
            	//判断是否有支付密码
            	if(!this.hadPayPassword) {
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
            }
        },
        //查询是否设置支付密码和绑定银行卡
        isBind() {
            var that = this;
            var reqUrl = this.baseUrl + '/bankcard/check';
            this.$http.get(reqUrl).then(function(res) {
                if (!res) { return; }
                //0未绑定，1已经绑定
                res.isBindCard == 0 ? that.hadBank = false : that.hadBank = true;
                res.isPayPassword == 0 ? that.hadPayPassword = false : that.hadPayPassword = true;
                if (res.isBindCard == 1) {
                    localStorage.setItem('bankData', JSON.stringify(res));
                }
            });
        }
    }

}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style scoped>
.moneyIndex {
    background: #f5f5f5;
}

.moneyIndex .top {
    padding: 1.3rem 2.0rem;
    text-align: right;
}

.top>span {
    text-decoration: underline;
    color: #333;
    font-size: 1.1rem;
    cursor: pointer;
}

.data {
    padding: 2.7rem 0;
    text-align: center;
    color: #333;
}

.data>p {
    font-size: 1.5rem;
    margin-bottom: 1.9rem;
}

.data>h1 {
    font-size: 4.0rem;
}

.btn {
    padding: 2.3rem 2.0rem;
}

.btn button {
    width: 100%;
    height: 4.5rem;
    line-height: 4.5rem;
    border-radius: 0.3rem;
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
}

.btn button.btn-recharge {
    background: #d4282d;
    color: #fff;
}

.btn button.btn-get {
    background: #fff;
    color: #818181;
    border: 0.05rem solid #e6e6e6;
    box-sizing: border-box;
}

.btm {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 5.0rem;
    text-align: center;
}

.btm span {
    font-size: 1.4rem;
    color: #0078ff;
    cursor: pointer;
}

</style>
