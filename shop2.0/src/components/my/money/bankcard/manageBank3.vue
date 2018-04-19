<!-- 添加银行卡/管理银行卡 -->
<template>
    <div class="manageBank" :style="{'height': clientH * 10 +'px'}">
        <!-- 绑定银行卡 -->
        <div class="bind-con">
            <div class="step3" :style="{'height': clientH * 10 +'px'}">
                <p class="warn">本次操作需要短信确认，请输入{{encryptPhone(stepData.phone)}}收到的短信验证码</p>
                <div class="code">
                    <mt-field placeholder="填写验证码" type="tel" :attr="{maxlength: 6}" v-model="stepData.codeVal"
                    	 class="input-code" @keyup.native="handleVerifyNumber"></mt-field>
                    <button class="btn-send" type="button" v-if="!hadSendBk" @click="sendCode" :disabled="signFlag">{{codeBtnText}}</button>
                    <span class="text-gray" v-else>{{sendTimeBk}}s后重发</span>
                </div>
                <div class="btn">
                    <button class="btn-red" v-if="stepData.codeVal.length == 6" @click="handleNext('four')">下一步</button>
                    <button class="btn-red" v-else disabled="disabled">下一步</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { MessageBox } from 'mint-ui';
export default {
    name: 'manageBank', // 结构名称
    data() {
        return {
            isNew: true,
            stepData: {
                cardNo: '', // 银行卡号[显示]
                bankName: '', // 银行名称
                bankcardIcon: '', // 银行图标
                bankcardBackPicture: '', // 银行卡背景
                cardKind: '', // 银行卡类型
                userName: '', // 持卡人
                cardType: '',
                idCardNo: '', // 身份证
                phone: '', // 手机号
                codeVal: '' // 验证码
            },
            cardObj: null,
            hadSendBk: false,
            sendTimeBk: 60,
            codeBtnText: '获取验证码',
            countDown: null,
            redBorder: false,
            queryData: {},
            signFlag: false
        }
    },
    created() {
        document.title = '绑定银行卡';
        this.stepData = JSON.parse(localStorage.getItem('bankStepData'));
    },
    mounted() {
        this.$nextTick(function() {
        	var isNew = this.$route.query.isNew;
        	if(isNew == 'true' || isNew == true) { 
        		this.isNew = true; 
        		document.title = '添加银行卡';
        	} else {
        		this.isNew = false; 
        		document.title = '变更银行卡';
        	}
        	var hadSendBk = localStorage.getItem('hadSendBk');
        	var sendTimeBk = localStorage.getItem('sendTimeBk');
        	if(hadSendBk == null || sendTimeBk == null) {
        		this.sendCode();
        	} 
        	if(hadSendBk == true || hadSendBk == 'true') {
        		this.hadSendBk = true;
        		this.sendTimeBk = parseInt(sendTimeBk);
        		this._countDown();
        	}
        	if(hadSendBk == false || hadSendBk == 'false') {
        		this.hadSendBk = false;
        		this.sendTimeBk = 60;
        		this._countDown();
        	}
//      	this.$router.push('/manageBank1?isNew='+ this.isNew);
        	
        });
    },
    destroyed() {
    	window.clearInterval(this.countDown);
    	localStorage.removeItem('hadSendBk');
    	localStorage.removeItem('sendTimeBk');
    },
    methods: {
    	 // 发送短信
        sendCode() {
        	if(this.signFlag) { return; }
    		this.signFlag = true;
        	
            var that = this;
            this.$http.post(this.baseUrl + '/bankcard/getVerifyCode', {
                mobile: this.stepData.phone,
                type: this.isNew ? '1' : '2'
            }).then(function(res) {
            	that.signFlag = false;
                if (!res) { return }
                that.$toast('验证码发送成功');
                that.hadSendBk = true;
                that.sendTimeBk = 60;
                that._countDown();
            });
        },
        // 下一步
        handleNext(param) {
            this._upCardData();
        },
        // 验证码格式
        handleVerifyNumber() {
            this.$nextTick(function() {
                if (this.verifyNumber(this.stepData.codeVal).state) {
                    this.stepData.codeVal = this.verifyNumber(this.stepData.codeVal).value;
                } else {
                    this.stepData.codeVal = this.verifyNumber(this.stepData.codeVal).value;
                }
            });
        },
        // 步骤二已经发送了短信    进入倒计时
        _countDown() {
            var that = this;
            this.countDown = setInterval(function() {
                that.sendTimeBk--;
                if (that.sendTimeBk == 0) {
                    that.sendTimeBk = 60;
                    that.hadSendBk = false;
                    window.clearInterval(that.countDown);
                }
                localStorage.setItem('hadSendBk', that.hadSendBk);
                localStorage.setItem('sendTimeBk', that.sendTimeBk);
            }, 1000);
        },
        // 添加银行卡|更改银行卡
        _upCardData() {
        	if(this.stepData.codeVal == '') {
        		this.$toast('验证码不能为空');
        		return;
        	}
        	if(this.stepData.codeVal.length != 6) {
        		this.$toast('请输入正确验证码');
        		return;
        	}
            var _that = this;
            this.$http.post(this.baseUrl + (this.isNew ? '/bankcard/addBankcard' : '/bankcard/changeBankcard'), {
                token: this.token,
                customerCode: this.userInfo.customerCode,
                verifyCode: this.stepData.codeVal,
                bankcard: this.deleteSpaceAll(this.stepData.cardNo),
                mobile: this.stepData.phone,
                realName: this.isNew ? this.stepData.userName : null,
                cardNo: this.isNew ? this.stepData.idCardNo : null,
            }).then(function(res) {
                if (!res) { 
                	return; 
                }
                _that.$router.push('/manageBankSuccess?isNew=' + _that.isNew);
            })
        }
    }

}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style scoped>
.manageBank {
    background: #f5f5f5;
    overflow: hidden;
}

.verify {
    padding-top: 5.9rem;
}

.verify>p {
    text-align: center;
    font-size: 1.7rem;
    line-height: 2.8rem;
    color: #333;
    margin: 0 1.5rem 4.3rem 1.5rem;
}

.bind-con {}

.help-text {
    margin: 0 1.5rem;
    color: #d5282e;
}

.bind-con .step1,
.bind-con .step2,
.bind-con .step3 {
    padding-top: 1.5rem;
}

.bind-con .warn {
    font-size: 1.4rem;
    line-height: 2.3rem;
    color: #999;
    margin-bottom: 1.3rem;
    padding: 0 1.5rem;
}

.part {
    margin-bottom: 3.9rem;
}

.part .part-item {
    background: #fff !important;
    margin-bottom: 1.0rem;
    padding: 0.1rem 1.5rem;
}

.step1 .part .part-bank {
    position: relative;
    left: 0;
    top: 0;
}

.step1 .part .part-bank .icon-bank {
    position: absolute;
    left: 8.8rem;
    bottom: 1.4rem;
    width: 2.0rem;
    height: 2.0rem;
}

.step2 .part {
    position: relative;
    left: 0;
    top: 0;
}

.step2 .warn {
    text-align: center;
    margin-top: 2.6rem;
    color: #bfbfbf;
    font-size: 1.3rem;
}

.step2 .icon-zhuyi {
    position: absolute;
    right: 1.5rem;
    bottom: 1.5rem;
    display: inline-block;
    width: 1.7rem;
    height: 1.7rem;
    color: #d5282e;
    cursor: pointer;
}

.btn {
    padding: 0 1.5rem;
}

.btn .btn-red[disabled="disabled"] {
    background-color: #d9d9d9;
}

.btn .btn-red {
    width: 100%;
    height: 4.4rem;
    line-height: 4.4rem;
    background: #d5282e;
    border-radius: 0.5rem;
    color: #fff;
    font-size: 1.7rem;
}

.step3 {
    background: #fff;
}

.step3 .code {
    position: relative;
    top: 0;
    left: 0;
    height: 4.0rem;
    margin: 1.3rem 1.5rem 3.8rem 1.5rem;
}

.step3 .input-code {
    width: 63%;
    padding-left: 1.2rem;
}

.step3 .btn-send,
.step3 .text-gray {
    position: absolute;
    top: 0rem;
    right: 0;
    width: 33%;
    height: 3.8rem;
    line-height: 4.1rem;
    background: #fff;
    border: 0.05rem solid #a8a8a8;
    border-radius: 0.3rem;
    color: #666;
    font-size: 1.3rem;
    text-align: center;
    cursor: pointer;
    box-sizing: content-box;
}

.step4 {
    background: #f5f5f5;
}

.step4 .part {
    padding: 3.1rem 0 4.6rem 0;
    text-align: center;
    background: #fff;
}

.step4 .icon {
    margin-bottom: 2.4rem;
}

.step4 .icon .iconfont {
    font-size: 6.9rem;
    color: #d4282d;
}

.step4 .part .warn {
    line-height: 1.5rem;
    margin-bottom: 0.8rem;
    font-size: 1.5rem;
}

.step4 .part .text {
    color: #333;
    font-size: 2.0rem;
    margin-top: 1.5rem;
}

.step4 .btn {
    padding: 0 1.5rem;
}

.phone-warn {
	position: fixed;
	top: 0;
	left: 0;
}
</style>
