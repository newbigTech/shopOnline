<!-- 添加银行卡/管理银行卡 （不需要）-->
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
                    <mt-field v-model="stepData.cardNo" label="卡号" placeholder="请输入卡号" class="part-item" :attr="{maxlength: 23}" ref="cardno" :data-ref="'cardno'" @keyup.native="_handleCardInfo"></mt-field>
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
                <div class="btn" v-if=" stepData.cardNo.length > 16 ">
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
                    	 :data-ref="'cardno'" @keyup.native="_handleCardInfo"></mt-field>
                </div>
                <div class="part">
                    <div class="part-bank">
                        <mt-field label="银行" placeholder="" class="part-item" v-model="stepData.bankName" :disabled="true"></mt-field>
                        <img :src="stepData.bankcardIcon" class="icon-bank" v-if="stepData.bankcardIcon != ''" />
                    </div>
                </div>
                <div class="btn" v-if=" stepData.cardNo.length > 19 ">
                    <button class="btn-red" @click="handleNext('two')">提交</button>
                </div>
                <div class="btn" v-else>
                    <button class="btn-red" @click="handleNext('two')" disabled="disabled">提交</button>
                </div>
            </div>
            <div class="step2" v-if="step == 2">
                <div class="part">
                    <mt-field label="卡类型" placeholder="银行卡类型" class="part-item" v-model="stepData.cardType" :disabled="true"></mt-field>
                    <mt-field type="number" label="手机号" placeholder="银行预留手机号" :attr="{maxlength: 11}" class="part-item" v-model="stepData.phone"></mt-field>
                    <div class="help-text" v-if="!isPhone">手机号输入不合法! </div>
                    <!--<i class="iconfont icon-zhuyi" @click="$router.push('/phoneWarn')"></i>-->
                </div>
                <div class="btn">
                    <button class="btn-red" @click="handleNext('three')">下一步</button>
                </div>
                <p class="warn">信息已安全加密，仅用于银行验证</p>
            </div>
            <div class="step3" v-if="step == 3" :style="{'height': clientH * 10 +'px'}">
                <p class="warn">本次操作需要短信确认，请输入{{encryptPhone(stepData.phone)}}收到的短信效验码</p>
                <div class="code">
                    <mt-field placeholder="填写校验码" type="tel" :attr="{maxlength: 6}" v-model="stepData.codeVal" class="input-code" @keyup.native="handleVerifyNumber"></mt-field>
                    <button class="btn-send" type="button" v-if="hadSendBk" @click="sendCode">{{codeBtnText}}</button>
                    <span class="text-gray" v-else>{{sendTimeBk}}s后重发</span>
                </div>
                <div class="btn">
                    <button class="btn-red" @click="handleNext('four')">下一步</button>
                </div>
            </div>
            <div class="step4" v-if="step == 4" :style="{'height': (clientH * 10) +'px'}">
                <div class="part">
                    <div class="icon"><i class="iconfont icon-correct"></i></div>
                    <p class="warn">{{stepData.bankName}}</p>
                    <p class="warn">{{stepData.cardKind}} 尾号{{stepData.cardNo.substring(stepData.cardNo.length-3)}}</p>
                    <p class="text">添加成功</p>
                </div>
                <div class="btn">
                    <button class="btn-red" @click="$router.push('/myBankCard')">完成</button>
                </div>
            </div>
        </div>
        <div class="phone-warn" v-if="showWarn">
        	<phone-warn></phone-warn>
        </div>
    </div>
</template>
<script>
import pwdInput from '@/components/tool/pwdInput' //密码输入框
import { MessageBox } from 'mint-ui';
import phoneWarn from '@/components/my/money/bankcard/phoneWarn' //预留手机号码提示
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
            hadSendBk: true,
            sendTimeBk: 60,
            codeBtnText: '获取验证码',
            countDown: null,
            redBorder: false,
            queryData: {},
            showWarn: false,
        }
    },
    components: { 'pwd-input': pwdInput, 'phone-warn': phoneWarn },
    created() {
        document.title = '我的银行卡';
        this.cardObj = this._getCookie('_CARDOBJ');
    },
    watch: {
        "stepData.cardNo": function(_val, _oldVal) {
            this.stepData.cardNo = this._setBankCrad(_val);
            this.$refs.cardno.currentValue = this._setBankCrad(_val);
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
        	if((isNew != undefined) && isNew) { 
        		this.isNew = true; 
        	} else {
        		this.isNew = false; 
        	}
            this._listenBack();
        });
    },
    destroyed() {
        window.clearInterval(this.time1);
        localStorage.removeItem('hadSendBk'); // 是否发送了验证码
        localStorage.removeItem('sendTimeBk'); // 发送验证码时间间隔       
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
        // 监听浏览的返回事件
        _listenBack() {
        	var state = {
                title: "title",
                url: "/manageBank"
            };
            window.history.pushState(state, "title", "/manageBank?isNew=" + this.isNew);
            var that = this;
            window.addEventListener("popstate", function(e) {
                if (that.step == 4) {
                    that.$router.push('/moneyIndex');
                } else if (that.step == 3) {
                	that.$router.push({
                		path: '/manageBank',
                		query: {isNew: that.isNew}
                	});
                    that.hadVerify = true;
                    that.step = 2;
                } else if (that.step == 2) {
                	console.log(that.hadVerify);
                	console.log(that.isNew);
//              	that.$router.push({
//              		path: '/manageBank',
//              		query: {isNew: that.isNew}
//              	});
                	that.hadVerify = true;
                    that.step = 1;
                } else if(that.step == 1) {
                	var path = '';
                	if(that.isNew) {
                		path = '';
                	} else {
                		path = '/myBankCard';
                	}
                	that.$router.push(path);
                }
            }, false);
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
            if (this.stepData.cardNo.length != 7) { return }
            var that = this;
            this.$http.get(this.baseUrl + '/bankcard/getBankName', {
                params: { cardBin: this.deleteSpaceAll(this.stepData.cardNo) }
            }).then(function(res) {
                if (!res) { return }
                that.stepData.bankName = res.bankName;
                that.stepData.bankcardIcon = res.bankcardIcon;
                that.stepData.bankcardBackPicture = res.bankcardBackPicture;
                that.stepData.cardKind = res.cardKind;
                that.stepData.cardType = res.bankName + '\t' + res.cardKind;
            });
        },
        // 下一步
        handleNext(param) {
            if (param == 'two') {
                if (!this._isCardNo(this.stepData.idCardNo)) { return this.isCardNo = false; }
                this.step = 2;
            } else if (param == 'three') {
                if (!this.verifyPhone(this.stepData.phone)) { return this.isPhone = false; }
                this.sendCode();
            } else if (param == 'four') {
                this._upCardData();
            }
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
        // 发送短信
        sendCode() {
            this.hadSendBk = false;
            var that = this;
            this.$http.post(this.baseUrl + '/bankcard/getVerifyCode', {
                mobile: this.stepData.phone,
                type: this.isNew ? '1' : '2'
            }).then(function(res) {
                // console.log(res);
                localStorage.setItem('hadSendBk', false); //已经发送了验证码
                localStorage.setItem('sendTimeBk', 60);
                that._countDown();
                if (!res) { return }
                that.step = 3;
            });
        },
        // 倒计时
        _countDown() {
            var that = this;
            this.countDown = setInterval(function() {
                that.sendTimeBk--;
                if (that.sendTimeBk == 0) {
                    that.sendTimeBk = 60;
                    that.hadSendBk = true;
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
                realName: _isNewCard ? this.stepData.userName : null,
                cardNo: _isNewCard ? this.stepData.idCardNo : null,
            }).then(function(res) {
                if (!res) { 
                	that.step = 1; 
                	that.hadVerify = true;
                	return; 
                }
                _that.step = 4;
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
    background-color: gray;
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
