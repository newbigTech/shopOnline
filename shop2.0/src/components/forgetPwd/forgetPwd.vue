<!-- 忘记密码 -->
<template>
    <div :class="['forgetPwd ']+[currentStep == 3 ? 'bg-gray' : '']"  :style="{height: (clientH - 7) + 'rem'}">
        <div class="step"  v-if="currentStep != 3">
            <div class="active"> <i>1</i>
                <p>验证身份</p> <span class="line"></span>
            </div>
            <div :class="currentStep >= 2 ? 'active' : '' "> <i>2</i>
                <p>修改登录密码</p> <span class="line"></span>
            </div>
            <div :class="currentStep == 3 ? 'active' : '' "> <i>3</i>
                <p>完成</p>
            </div>
        </div>
        <div class="step-one" v-if="currentStep == 1">
            <div class="input-group">
                <mt-field placeholder="请输入手机号" type="number" v-model="phone.text" 
                	:disabled="phone.disable" :attr="{maxlength: 11}"
                	 @keyup.native="phone.text = _handleNumber(phone.text)" v-if="updateType == '3'">
                </mt-field>
                <mt-field placeholder="请输入手机号" type="text" 
                	v-model="phone.encryptPhone" :disabled="phone.disable" v-else>
                </mt-field>
                <div class="code-group">
                    <mt-field placeholder="请输入验证码" type="tel" :attr="{maxlength: 6}" v-model="code" class="input-code" @keyup.native="code = _handleNumber(code)"></mt-field>
                    <button :class="send.ing?'btn-send':'text-gray'" @click="_sendCode" :disabled="signFlag">{{ send.text }}</button>
                </div>
            </div>
            <div class="btn">
                <button :class="(phone.text.length < 6) || (code.length < 6)?'btn-gray':'btn-red'" :disabled="(phone.text.length < 6) || (code.length < 6)" @click="_handleNext(1)">下一步</button>
            </div>
        </div>
        <div class="step-two" v-if="currentStep == 2">
            <p class="warn">请输入您新的登录密码，6-20个数字或英文字符</p>
            <div class="input-group">
                <mt-field placeholder="输入新密码" :attr="{maxlength: 20}" type="password" onpaste="return false;" v-model="passwordForm.text" @keyup.native="passwordForm.text = _handlePassword(passwordForm.text)"></mt-field>
                <mt-field placeholder="确认新密码" :attr="{maxlength: 20}" type="password" onpaste="return false;" v-model="passwordForm.countText" @keyup.native="passwordForm.countText = _handlePassword(passwordForm.countText)"></mt-field>
            </div>
            <div class="btn">
                <button :class="(passwordForm.text.length < 6) || (passwordForm.countText.length < 6)?'btn-gray':'btn-red'" :disabled="(passwordForm.text.length < 6) || (passwordForm.countText.length < 6)" @click="_handleNext(2)">确定</button>
            </div>
        </div>
        <!-- 完成 -->
        <div class="step-three" v-if="currentStep == 3">
            <div class="success-info">
                <div class="iconfont">&#xe61e;</div>
                <p>登录密码修改成功</p>
            </div>
            <div class="btn">
                <button class="btn-red" @click="_handleNext(3)">完成</button>
            </div>
        </div>
        <div class="btm" v-if="currentStep < 3">
            <h2>小提示</h2>
            <p>1、为保障您的账户安全，建议您定期更改您的登录密码，并设定密码为高强度的复杂密码；</p>
            <p>2、若该手机号无法接收验证短信，请 <a  @click="hanldleContact">联系客服</a> 申诉更改验证手机</p>
        </div>
    </div>
</template>
<script>
export default {
    name: 'forgetPwd',
    data() {
        return {
            currentStep: 1,
            phone: null, //手机号码
            downTime: null,
            send: { ing: true, text: '获取验证码', time: 60 }, // 定时器
            code: '', // 验证码
            passwordForm: { text: '', countText: '' },
            signFlag: false
        }
    },
    props: {
        // 修改密码类型：1.修改手机, 2.设置支付密码，3.忘记密码, 4.重置支付密码
        updateType: { type: String, default: '3' }, // 默认: 忘记密码
    },
    created() {
        this._setPhoneInput();
        this._countTime();
    },
    destroyed() {
        window.clearInterval(this.downTime);
        localStorage.removeItem('_handSendTime');
    },
    methods: {
        // 设置 手机号码 显示
        _setPhoneInput() {
            if (this.updateType == '3') {
                this.phone = { text: '', disable: false }
                document.title = '忘记密码';
            } else {
                this.phone = { text: this.userInfo.phone, encryptPhone:  this.encryptPhone(this.userInfo.phone), disable: true }
                document.title = '重置登录密码';
            }
        },
        // 获取验证码
        _sendCode() {
        	if(this.phone.text == '') {
        		this.$toast('请输入手机号码');
        		return;
        	}
        	if(this.updateType == '5') {
        		 this.phone.text = this.userInfo.phone;
        	}
        	if(!this.verifyPhone(this.phone.text)) { return; }
        	if(this.signFlag) { return; }
    		this.signFlag = true;
    		
            if (this.send.time < 60) { return; }
            
//          this._countTime(true);
            var that = this;
            this.$http.post(this.baseUrl + '/user/password/getVerifyCode', { phone: this.phone.text, type: '3'/*this.updateType*/ }).then(function(res) {
                that.signFlag = false;
                if (!res) { return }// that.send.count = 0; }
                that.$toast('验证码发送成功');
                that._countTime(true);
            });
            
        },
        // 倒计时
        _countTime(_flg) {
            if (_flg) {
            	 this.send = { ing: false, text: '60s后重发', time: 60 };
//              this.send = { count: 1, ing: false, text: '60s后重发', time: 60 };
            } else {
                if (!localStorage.getItem('_handSendTime')) { return }
                this.send = { ing: false, text: '60s后重发', time: parseInt(localStorage.getItem('_handSendTime')) };
            }
            var _that = this;
            this.downTime = setInterval(function() {
                _that.send.time--;
                if (_that.send.time == 0) {
                    _that.send = { ing: true, text: '获取验证码', time: 60 }
                    window.clearInterval(_that.downTime);
                    return
                }
                _that.send.text = _that.send.time + 's后重发';
                localStorage.setItem('_handSendTime', _that.send.time);
            }, 1000);
        },
        // 下一步
        _handleNext: function(_step) {
            switch (_step) {
                case 1:
                 	this._handleVerifyCode(_step);
                   	
//                  if (!this._handleVerifyCode()) { return }
//                  this.currentStep = _step + 1;
                    break;
                case 2:
                    // if (!this.passwordForm.text) { return this.$toast('请输入新登录密码'); }
                    // if (!this.passwordForm.countText) { return this.$toast('请输入确认密码'); }
                    if (this.passwordForm.text != this.passwordForm.countText) { return this.$toast('两次密码输入不一致'); }
                    this._handleForget(_step);
//                  if (!this._handleForget()) { return }
//                  this.currentStep = _step + 1;
                    break;

                case 3:
                	if(this.updateType == '3') {
                		localStorage.setItem('logIn', true);
                    	this.$router.push({ name: 'Login' });
                	} else {
                		this.$router.push('/user');
                	}
                    break;
            }
        },
        // 更新密码. =>> 修改登录/支付密码
        _handleForget: function(_step) {
            var that = this;
            this.$http.post(this.baseUrl + '/user/password/update', {
                phone: this.phone.text,
                verifyCode: this.code,
                newPassword: this.passwordForm.text,
                confirmPassword: this.passwordForm.countText,
                type: '3'//this.updateType
            }).then(function(res) {
                if (!res) { return false }
                window.clearInterval(that.downTime);
                localStorage.removeItem('_handSendTime');
                that.currentStep = _step + 1;
                return true;
            })
        },
        //确认短信验证码是否正确
        _handleVerifyCode: function(_step) {
            var that = this;
            this.$http.post(this.baseUrl + '/user/password/VerifyPasseord', {
                phone: this.phone.text,
                verifyCode: this.code,
                type: '3'//this.updateType
            }).then(function(res) {
            	if(!res) { return; }
                if (res.result != "success") { return false; }
                that.currentStep = _step + 1;
                return true;
            });
        },
        // 返回密码: 屏蔽汉字和空格
        _handlePassword: function(_pass) {
            return this.verifyPwd(_pass).state ? _pass = this.verifyPwd(_pass).value : _pass = this.verifyPwd(_pass).value
        },
        // 验证码,和手机格式
        _handleNumber: function(_code) {
            return this.verifyNumber(_code).state ? _code = this.verifyNumber(_code).value : _code = this.verifyNumber(_code).value
        }
    }

}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style scoped>
@import 'password.css'

</style>
