<!-- 添加银行卡/管理银行卡 -->
<template>
    <div class="manageBank" :style="{'height': clientH * 10 +'px'}">
        <!-- 绑定银行卡 -->
        <div class="bind-con">
            <div class="step2">
                <div class="part">
                    <mt-field label="卡类型" placeholder="银行卡类型" class="part-item" v-model="stepData.cardType" :disabled="true"></mt-field>
                    <mt-field type="number" label="手机号" placeholder="银行预留手机号" :attr="{maxlength: 11}" class="part-item" v-model="stepData.phone"></mt-field>
                    <!--<div class="help-text" v-if="!isPhone">手机号输入不合法! </div>-->
                    <!--<i class="iconfont icon-zhuyi" @click="$router.push('/phoneWarn')"></i>-->
                </div>
                <div class="btn">
                	<button class="btn-red" v-if="stepData.phone.length == 11" @click="handleNext('three')">下一步</button>
                    <button class="btn-red" v-else disabled="disabled">下一步</button>
                </div>
                <p class="warn">信息已安全加密，仅用于银行验证</p>
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
            isPhone: true,
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
        });
    },
    methods: {
        // 下一步
        handleNext(param) {
        	if(this.stepData.phone == '') {
        		this.$toast('手机号码不能为空');
        		return;
        	}
            if (!this.verifyPhone(this.stepData.phone)) { return; }
            localStorage.setItem('bankStepData', JSON.stringify(this.stepData));
            this.$router.push('/manageBank3?isNew=' + this.isNew);
//          this.sendCode();
        }
        // 验证码格式
/*        handleVerifyNumber() {
            this.$nextTick(function() {
                if (this.verifyNumber(this.stepData.codeVal).state) {
                    this.stepData.codeVal = this.verifyNumber(this.stepData.codeVal).value;
                } else {
                    this.stepData.codeVal = this.verifyNumber(this.stepData.codeVal).value;
                }
            });
        },
        // 发送短信
        sendCode() {
            var that = this;
            this.$http.post(this.baseUrl + '/bankcard/getVerifyCode', {
                mobile: this.stepData.phone,
                type: this.isNew ? '1' : '2'
            }).then(function(res) {
                if (!res) { return }
				localStorage.setItem('hadSendBk', true);
                localStorage.setItem('sendTimeBk', 60);
                localStorage.setItem('bankStepData', JSON.stringify(that.stepData));
                that.$router.push('/manageBank3?isNew=' + that.isNew);
            });
        }*/
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
    line-height: 3.8rem;
    background: #fff;
    border: 0.05rem solid #a8a8a8;
    border-radius: 0.3rem;
    color: #666;
    font-size: 1.3rem;
    text-align: center;
    cursor: pointer;
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
