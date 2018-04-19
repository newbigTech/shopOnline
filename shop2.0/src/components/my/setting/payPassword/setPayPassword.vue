<!-- 重置/设置支付密码 -->
<template>
    <div id="resetPayPassword">
        <div class="content">
            <template v-if="one.state">
                <div class="text-box input-hd">
                    <p class="gray">我们会将<span class="blue">验证码</span>发送到您的手机</p>
                    <p class="phone-num">{{phoneNum}}</p>
                </div>
                <div class="input-box">
                    <div class="input-item u-three-input">
                        <span>验证码</span>
                        <input type="tel" maxlength="6" placeholder="请输入验证码" v-model="code" @input="handleNumberCode" />
                        <button type="button" v-if="!hadSendSp" @click="sendCode" :disabled="flag">{{codeBtnText}}</button>
                        <span class="text-gray" v-if="hadSendSp">{{sendTimeSp}}s后重发</span>
                    </div>
                </div>
                <div class="u-submit-box">
                    <button v-if="code.length<6">下一步</button>
                    <button class="active" v-else="code" @click="oneBtn">下一步</button>
                </div>
            </template>
            <template v-if="two.state">
                <div class="text-box">
                    <p class="gray">请为帐号<span>{{encryptPhone(phoneNum)}}</span></p>
                    <p class="">设置6位数支付密码</p>
                </div>
                <div class="box">
                    <pwd-input :redBorder="redBorder" @result="twoGetPwd"></pwd-input>
                </div>
                <div class="hint">支付密码不能是重复、连续的数字</div>
            </template>
            <template v-if="three.state">
                <div class="text-box input-hd">
                    <p>请再次输入</p>
                </div>
                <div class="box">
                    <pwd-input :redBorder="redBorder" @result="threeGetPwd"></pwd-input>
                </div>
                <div class="u-submit-box ok-btn">
                    <button @click="threeBtn">下一步</button>
                </div>
            </template>
        </div>
    </div>
</template>
<script>
import pwdInput from '@/components/tool/pwdInput' //密码输入框

import { Toast } from 'mint-ui';
var phoneReg = /^1[3|4|5|7|8][0-9]{9}$/;

export default {
    name: 'setPayPassword',
    components: {
        'pwd-input': pwdInput
    },
    data() {
        return {
            phoneNum: this.userInfo.phone,
            phone: this.userInfo.phone,
            oldPassword: 111111,
            password1: null,
            password2: null,
            one: {
                state: true,
                inpVal: "",
            },
            two: {
                state: false,
            },
            three: {
                state: false,
            },
            redBorder: true, //红色边框
            hadSendSp: false, //显示发送验证码按钮
            sendTimeSp: 60, //发送验证码间隔时间
            code: '', //验证码
            time1: '', //定时器
            codeBtnText: '获取验证码', //获取验证码按钮文字   
            flag: false
        }
    },
    props: {
        // 集成父级参数
    },
    mounted() {
        this.$nextTick(function() {
            document.title = '设置支付密码';
            this.phoneNum = this.encryptPhone(this.userInfo.phone); //手机号码加密

            var hadSendSp = eval(localStorage.getItem('hadSendSp')); //是否发送了验证码
            var sendTimeSp = localStorage.getItem('sendTimeSp'); //发送验证码时间间隔
            if (hadSendSp != null) {
                this.hadSendSp = hadSendSp;
                this.sendTimeSp = sendTimeSp;
                if (eval(hadSendSp)) {
                    this.hadSendSp = true;
                    this.countDown();
                }
//              this.codeBtnText = '重新获取';
            }
        })
    },
    destroyed() {
        // console.group('销毁完成状态===============》destroyed');
        window.clearInterval("time1");
        localStorage.removeItem('hadSendSp'); //是否发送了验证码
        localStorage.removeItem('sendTimeSp'); //发送验证码时间间隔       
    },
    methods: {
        //验证码只能输入数字
        handleNumberCode: function() {
            this.code = this.verifyNumber(this.code).value;
        },
        //获取验证码
        sendCode: function() {
        	if(this.flag) { return; }
        	this.flag = true;
        	
            var that = this;
            var reqUrl = this.baseUrl + '/user/password/getVerifyCode';
            var params = { phone: this.phone };
            if (this.userInfo.payPassword) { //ture为重置支付密码
                params.type = '4';
            } else { //ture为设置支付密码
                params.type = '2';
            }
            this.$http.post(reqUrl, params).then(function(res) {
            	that.flag = false;
                if (!res) { return; }
                that.$toast('验证码发送成功');
                that.hadSendSp = true;
                that.handleCode();
            });
        },
        //发送验证码
        handleCode: function() {
//          this.hadSendSp = true;
            localStorage.setItem('hadSendSp', true); //已经发送了验证码
            localStorage.setItem('sendTimeSp', 60);
            this.countDown();
        },
        //倒计时
        countDown: function() {
            var that = this;
            this.time1 = setInterval(function() {
                that.sendTimeSp--;
                if (that.sendTimeSp == 0) {
                    that.sendTimeSp = 60;
                    that.hadSendSp = false;
                    window.clearInterval(that.time1);
                }
                localStorage.setItem('hadSendSp', that.hadSendSp);
                localStorage.setItem('sendTimeSp', that.sendTimeSp);
            }, 1000);
        },
        oneBtn: function() {
            if (!this.code) {
                this.$toast('请输入验证码');
                return;
            }
            this.handleVerifyCode();
        },
        //确认短信验证码是否正确
        handleVerifyCode: function() {
            var that = this;
            var reqUrl = this.baseUrl + '/user/password/VerifyPasseord';
            var params = {
                phone: this.phone,
                verifyCode: this.code
            };
            if (this.userInfo.payPassword) { //ture为重置支付密码
                params.type = '4';
            } else { //ture为设置支付密码
                params.type = '2';
            }
            this.$http.post(reqUrl, params)
                .then(function(res) {
                    if (!res) {
                        return;
                    }
                    that.one.state = false;
                    that.two.state = true;
                    that.three.state = false;
                });
        },
        threeBtn: function() {
            this.threeGetPwd();
//          this.$router.push({
//              name: 'MySetting'
//          });
        },
        twoGetPwd: function(val) {
            this.password1 = val;

            this.one.state = false;
            this.two.state = false;
            this.three.state = true;

        },
        threeGetPwd: function(val) {
            if (val != this.password1) {
                this.$toast('两次输入密码不一致');
                return;
            }
            this.password2 = val;
            this.setPwd();
        },
        //设置密码
        setPwd: function() {
            var that = this;
            var reqUrl = this.baseUrl + '/user/password/update';
            var params = {
                phone: this.phone,
                verifyCode: this.code,
                newPassword: this.password1,
                confirmPassword: this.password2
            }
            if (this.userInfo.payPassword) { //ture为重置支付密码
                params.type = '4';
            } else { //ture为设置支付密码
                params.type = '2';
            }
            this.$http.post(reqUrl, params)
                .then(function(res) {
                    if (!res) {
                        that.one.state = false;
                        that.two.state = true;
                        that.three.state = false;
                        return;
                    }
                    window.clearInterval(that.time1);
                    localStorage.setItem('hadSendSp', false);
                    localStorage.setItem('sendTimeSp', 60);
                    
					if(!that.userInfo.payPassword) {
						that.userInfo.payPassword = true;
						localStorage.setItem('userInfo', JSON.stringify(that.userInfo));
					}
					
                    that.$toast('修改成功');
                    that.$router.go(-1);
                });
        },
        onInp: function() {
            //input 焦点事件
            //              var inp = document.querySelectorAll(".pawDiv input");
            //              for(var i = 0;i < inp.length;i++){
            //                  inp[i].onblur = function(){
            //                      this.style.fontSize = "3rem";
            //                  };
            //                  inp[i].onfocus = function(){
            //                      this.style.fontSize = "1rem";
            //                  };
            //              }
        },
    }
}

</script>
<style scoped>
* {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
}

#resetPayPassword {
    background-color: #FAFAFA;
    min-height: 100vh;
}


/*.content { padding: 0 1.45rem; }*/

.content .text-box {
    font-size: 1.56rem;
    line-height: 2.57rem;
    padding: 2.1rem;
    text-align: center;
    background-color: #fff;
}

.content .text-box.input-hd {
    padding: 2.5rem 0;
}

.content .text-box .gray {
    color: #A8A8A8;
}

.content .text-box .blue {
    color: #5dbfff;
}

.content .text-box .phone-num {
    font-size: 1.8rem;
}

.content .input-box {}

.content .input-box .u-three-input {
    display: flex;
    display: -webkit-flex;
    background-color: #fff;
    height: 5rem;
    align-items: center;
    margin-top: 1rem;
    padding: 0 1.5rem;
}

.u-three-input span {
    font-size: 1.38rem;
    line-height: 3.6rem;
    flex: 1.5;
}

.u-three-input input {
    font-size: 1.38rem;
    line-height: 3.6rem;
    flex: 5.5;
    padding-left: 0.5rem;
}

.u-three-input button {
    font-size: 1.2rem;
    line-height: 2.8rem;
    height: 2.8rem;
    flex: 2;
    margin-left: 1rem;
    border: 0.1rem solid #ccc;
    color: #666;
    background-color: #fff;
    border-radius: 0.5rem;
}

.u-submit-box {
    margin-top: 5rem;
    padding: 0 1.5rem;
}

.u-submit-box.ok-btn {
    margin-top: 3.5rem;
}

.u-submit-box button {
    height: 4.15rem;
    width: 100%;
    background-color: #d9d9d9;
    color: #fff;
    font-size: 1.56rem;
    border-radius: 0.5rem;
}

.u-submit-box button.active {
    background-color: #FF4242;
}

.content .box {
    margin-top: 3rem;
    width: 100%;
    height: 4.8rem;
    padding: 0 1.5rem;
}

.content .box.active {
    background-color: #fbc9c9;
}

.content .box .pawDiv {
    width: 16.6%;
    height: 4.05rem;
    border-right: 0.1rem solid #E5E5E5;
    float: left;
}

.content .box .pawDiv:last-child {
    border-right: 0;
}

.content .box .pawDiv input {
    width: 100%;
    height: 4.05rem;
    text-align: center;
    font-size: 1rem;
    padding: 0.8rem 0;
}


/*.content .box .pwd-input-box { min-width: auto; }*/

.pwd-input-box {
    border-radius: 0.5rem;
}


/*.content .box .pawDiv input:focus { font-size: 3rem; }
.content .box .pawDiv input:blur { font-size: 3rem; }*/

.content .hint {
    font-size: 1.2875rem;
    text-align: center;
    line-height: 2.57rem;
    color: #A8A8A8;
    margin-top: 1rem;
}

.u-three-input span.text-gray {
    font-size: 1.2rem;
    line-height: 3.0rem;
    flex: 1.5;
}

</style>
