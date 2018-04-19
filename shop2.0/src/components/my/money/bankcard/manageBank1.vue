<!-- 添加银行卡/管理银行卡 -->
<template>
    <div class="manageBank" :style="{'height': clientH * 10 +'px'}">
        <!-- 验证身份 -->
        <div class="verify" v-if="!hadVerify">
            <p>请输入支付密码，以验证身份</p>
            <pwd-input :redBorder="redBorder" @result="getPwd"></pwd-input>
        </div>
        <!-- 绑定银行卡 -->
        <div class="bind-con" v-if="hadVerify">
            <div class="step1" v-if="step == 1 && isNew">
                <p class="warn">请绑定本人的储蓄卡，目前只支持绑定一张卡</p>
                <div class="part">
                    <mt-field v-model="stepData.cardNo" label="卡号" placeholder="请输入卡号" class="part-item" :attr="{maxlength: 23}" ref="cardno" 
                    	:data-ref="'cardno'" @keyup.native="_handleCardInfo" @focus.native="_handleCardInfo"></mt-field>
                    <div class="part-bank">
                        <mt-field label="银行" placeholder="" class="part-item" v-model="stepData.bankName" readonly="readonly" :disabled="true"></mt-field>
                        <img :src="stepData.bankcardIcon" class="icon-bank" v-if="stepData.bankcardIcon != ''" />
                    </div>
                </div>
                <p class="warn">持卡人一经绑定无法修改</p>
                <div class="part">
                    <mt-field label="持卡人" placeholder="请输入持卡人姓名" class="part-item" v-model="stepData.userName"></mt-field>
                    <mt-field label="身份证号" placeholder="请输入身份证号" :attr="{maxlength: 18}" class="part-item" v-model="stepData.idCardNo"></mt-field>
                    <div class="help-text" v-if="!isCardNo">身份证输入不合法! </div>
                </div>
                <div class="btn" v-if="stepData.cardNo.length >= 19">
                    <button class="btn-red" @click="handleNext('two')">提交</button>
                </div>
                <div class="btn" v-else>
                    <button class="btn-red" @click="handleNext('two')" disabled="disabled">提交</button>
                </div>
            </div>
            <div class="step1" v-if="step == 1 && (!isNew)">
                <p class="warn">更换成功后，仅能使用新卡充值、提现。</p>
                <div class="part">
                    <mt-field label="持卡人" class="part-item" v-model="stepData.userName" :disabled="true" ></mt-field>
                    <mt-field v-model="stepData.cardNo" label="卡号" placeholder="请输入卡号" class="part-item" :attr="{maxlength: 23}" ref="cardno"
                    	 :data-ref="'cardno'" @keyup.native="_handleCardInfo" @focus.native="_handleCardInfo"></mt-field>
                </div>
                <div class="part">
                    <div class="part-bank">
                        <mt-field label="银行" placeholder="" class="part-item" v-model="stepData.bankName" :disabled="true"></mt-field>
                        <img :src="stepData.bankcardIcon" class="icon-bank" v-if="stepData.bankcardIcon != ''" />
                    </div>
                </div>
                <div class="btn" v-if=" stepData.cardNo.length >= 19 ">
                    <button class="btn-red" @click="handleNext('two')">提交</button>
                </div>
                <div class="btn" v-else>
                    <button class="btn-red" @click="handleNext('two')" disabled="disabled">提交</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import pwdInput from '@/components/tool/pwdInput' //密码输入框
import { MessageBox } from 'mint-ui';
export default {
    name: 'manageBank', // 结构名称
    data() {
        return {
            hadVerify: false,
            isCardNo: true,
            isPhone: true,
            isNew: true,
            step: 1,
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
            redBorder: false,
        }
    },
    components: { 'pwd-input': pwdInput},
    created() {
//      document.title = '我的银行卡';
        this.cardObj = this._getCookie('_CARDOBJ');
        var hadVerify = localStorage.getItem('hadVerify');
        hadVerify == undefined ? this.hadVerify = false : this.hadVerify = true;
    },
    watch: {
        "stepData.cardNo": function(_val, _oldVal) {
            this.stepData.cardNo = this._setBankCrad(_val);
            this.$refs.cardno.currentValue = this._setBankCrad(_val);
            
            if (this.stepData.cardNo.length < 7) { 
            	this.stepData.bankName = '';
            	this.stepData.bankcardIcon = '';
            }
        },
        "stepData.idCardNo": function(val, _oldVal) {
            this.isCardNo = true;
        },
        "stepData.phone": function(val, _oldVal) {
            this.isPhone = true;
        }
    },
    mounted() {
        this._isNewCard();
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
    destroyed() {
    },
    methods: {
        // [添加银行卡|更改银行卡],
        // 不是, 不处理
        // 是, 服用用户信息
        _isNewCard() {
            if (this.cardObj != null && this.cardObj != undefined && this.cardObj != '') {
                this.cardObj = JSON.parse(decodeURI(this.cardObj));
                this.stepData.userName = this.cardObj.realName;
                this.stepData.phone = '';//this.cardObj.mobile;
                this.stepData.idCardNo = this.cardObj.cardNo;
                this.isNew = false;
            }
        },
        // 密码校验
        getPwd(val) {
            document.title = '绑定银行卡';
            var that = this;
            this.$http.post(this.baseUrl + '/bankcard/checktPayPassword', {
                payPassword: val
            }).then(function(res) {
				if(res == '支付密码错误') {
					that.hadVerify = false;
					return;
				}
				if(res.code == '9998' && res.description == '支付密码错误次数过多,请稍后再试') { //支付次数过多)
					that.popupVisible = false;
					return;
				}
				if(!res) { return; }
                that.hadVerify = true;
            });
        },
        // 通过银行卡号查询银行名称
        _handleCardInfo() {
            if (this.stepData.cardNo.length < 7) { return; } //加上空格后的长度
            
            if(this.stepData.bankName != '') { return; } //获取到了银行卡名称和icon
            
            var cardBin = this.deleteSpaceAll(this.stepData.cardNo),
            	cardBin = cardBin.substring(0, 6),
            	that = this;
            this.$http.get(this.baseUrl + '/bankcard/getBankName', {
                params: { cardBin: cardBin }
            }).then(function(res) {
            	if(!res) { return; } 
//          	if(res == null) {
//              	that.$toast('银行卡号不合法');
//              	return;
//              }
                that.stepData.bankName = res.bankName;
                that.stepData.bankcardIcon = res.bankcardIcon;
                that.stepData.bankcardBackPicture = res.bankcardBackPicture;
                that.stepData.cardKind = res.cardKind;
                that.stepData.cardType = res.bankName + '\t' + res.cardKind;
            });
        },
        // 下一步
        handleNext() {
        	if(this.stepData.cardNo == '') {
        		this.$toast('银行卡号不能为空');
        		return;
        	}
        	if(this.stepData.userName == '') {
        		this.$toast('持卡人不能为空');
        		return;
        	}
        	if(this.stepData.idCardNo == '') {
        		this.$toast('身份证号不能为空');
        		return;
        	}
        	this.stepData.cardNo = this.deleteSpaceAll(this.stepData.cardNo);
        	localStorage.setItem('bankStepData', JSON.stringify(this.stepData));
        	
        	var cardNo = this.deleteSpaceAll(this.stepData.cardNo);
        		cardNo = cardNo.substring(0, 6);
            var that = this;
            this.$http.get(this.baseUrl + '/bankcard/getBankName', {
                params: { cardBin: cardNo }
            }).then(function(res) {
            	if(!res) { return; } 
            	that.$router.push('/manageBank2?isNew=' + that.isNew);
            });
           	
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
