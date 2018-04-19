<!-- 修改/变更手机号码 -->
<template>
    <div id="changePhone">
        <div class="content">
            <div v-if="state == '1'">
                <div class="text-box">
                    <p>请填写您原来的手机号</p>
                </div>
                <div class="form-box">
                    <input type="tel" name="phone" maxlength="11" placeholder="请输入原来的手机号" v-model="phoneVal" />
                    <div class="u-submit-box">
                        <button @click="oneDown">下一步</button>
                    </div>
                </div>
            </div>
            <div v-if="state == '2'">
                <div class="text-box">
                    <p>短信验证码将发送到您的手机</p>
                    <p class="phone-num">{{ encryptPhone(phoneVal) }}</p>
                </div>
                <div class="form-box">
                    <div class="box">
                        <input type="tel" name="phone" maxlength="6" v-model="codeVal" placeholder="请输入验证码" />
                        <!--<button>点击获取</button>-->
                        <button type="button" v-if="!hadSendCp1" @click="sendCode" :disabled="signFlag">{{codeBtnText1}}</button>
                        <span class="text-gray" v-if="hadSendCp1">{{sendTimeCp1}}s后重发</span>
                    </div>
                    <div class="u-submit-box">
                        <button @click="twoDown">下一步</button>
                    </div>
                </div>
            </div>
            <div v-if="state == '3'">
                <div class="text-box">
                    <p class="gray">你现在使用的手机号码是<span>{{encryptPhone(phoneVal)}}</span></p>
                    <p>变更号码后，下次登录需要使用新手机号码</p>
                </div>
                <div class="form-box">
                    <div class="box">
                        <input type="tel" name="phone" maxlength="11" v-model="newPhoneVal" placeholder="请输入新的手机号码" />
                        <button type="button" v-if="!hadSendCp2" @click="sendCode" :disabled="signFlag2">{{codeBtnText2}}</button>
                        <span class="text-gray" v-if="hadSendCp2">{{sendTimeCp2}}s后重发</span>
                        <!--<button>点击获取</button>-->
                    </div>
                    <input type="tel" name="phone" maxlength="6" v-model="newCodeVal" placeholder="请输入验证码" />
                    <div class="u-submit-box">
                        <button @click="threeDown">下一步</button>
                    </div>
                </div>
            </div>
            <div v-if="state == '4'">
                <div class="form-box u-ok">
                    <div class="ok-box">
                        <div class="icon-box">
                            <i class="iconfont icon-gou"></i>
                        </div>
                        <p class="red">变更手机号成功</p>
                        <p>您的新手机号<span>{{ newPhoneVal }}</span></p>
                        <div class="u-submit-box">
                            <button @click="fourBtn">完成</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { Toast } from 'mint-ui';
var phoneReg = /^1[3|4|5|7|8][0-9]{9}$/;
export default {
    name: 'changePhone',
    data() {
        return {
            phoneVal: '',
            codeVal: '',
            newPhoneVal: '',
            newCodeVal: '',
            state: '1',
            signFlag: false,
            signFlag2: false,
         	codeBtnText1: '获取验证码', //获取验证码按钮文字   
         	codeBtnText2: '获取验证码', //获取验证码按钮文字   
     		hadSendCp1: false, //显示发送验证码按钮
       	 	sendTimeCp1: 60, //发送验证码间隔时间
     		hadSendCp2: false, //显示发送验证码按钮
       	 	sendTimeCp2: 60, //发送验证码间隔时间
            time1: '',
            time2: '',
            changeInfo: {'state': '1', 'currrPhone': ''},//缓存修改信息
        }
    },
    mounted() {
    	this.$nextTick(function() {
    		document.title = '变更手机号';
    		
    		this.initData();
    	})
    },
    destroyed() {
        // console.group('销毁完成状态===============》destroyed');
        window.clearInterval("time1");
        window.clearInterval("time2");
        localStorage.removeItem('hadSendCp1'); //是否发送了验证码
        localStorage.removeItem('sendTimeCp1'); //发送验证码时间间隔       
        localStorage.removeItem('hadSendCp2'); //是否发送了验证码
        localStorage.removeItem('sendTimeCp2'); //发送验证码时间间隔       
    },
    methods: {
    	initData() {
    		var hadSendCp1 = eval(localStorage.getItem('hadSendCp1')); //是否发送了验证码
            var sendTimeCp1 = localStorage.getItem('sendTimeCp1'); //发送验证码时间间隔
            if (hadSendCp1 != null) {
                this.hadSendCp1 = hadSendCp1;
                this.sendTimeCp1 = sendTimeCp1;
                if (eval(hadSendCp1)) {
                    this.hadSendCp1 = true;
                    this.countDown1();
                }
//              this.codeBtnText1 = '重新获取';
            }
            
            var hadSendCp2 = eval(localStorage.getItem('hadSendCp2')); //是否发送了验证码
            var sendTimeCp2 = localStorage.getItem('sendTimeCp2'); //发送验证码时间间隔
            if (hadSendCp2 != null) {
                this.hadSendCp2 = hadSendCp2;
                this.sendTimeCp2 = sendTimeCp2;
                if (eval(hadSendCp2)) {
                    this.hadSendCp2 = true;
                    this.countDown2();
                }
//              this.codeBtnText2 = '重新获取';
            }
            
            var _changeInfo = JSON.parse(localStorage.getItem('_changeInfo'));
            if(_changeInfo != null) {
            	this.state = _changeInfo.state;
            	if(this.state == '2') {
            		this.phoneVal = _changeInfo.currrPhone;
            	} else if(this.state == '3') {
            		this.phoneVal = _changeInfo.currrPhone;
            	} else if(this.state == '4') {
            		this.newPhoneVal = _changeInfo.currrPhone;
            	}
//          	this.changeInfo = _changeInfo;
            }
    		
    	},
        oneDown() {
            if (!phoneReg.test(this.phoneVal)) {
                this.$toast('请输入正确的手机号码');
                return;
            }
            var that = this;
            var reqUrl = this.baseUrl + '/updatePhone/phone';
            var params = {
            	oldPhone: this.phoneVal
            }
            this.$http.get(reqUrl, {params: params}).then(function(res) {
                if (!res) { return; }
                if(res.result != 'success') {
                	 that.$toast('原手机号码校验失败');
                	 return;
                }
                that.state = '2';
                that.changeInfo = {'state': that.state, 'currrPhone': that.phoneVal};
                localStorage.setItem('_changeInfo', JSON.stringify(that.changeInfo));
            });
        },
        //发送验证码
        sendCode() {
        	var phone = '',phoneType = '';
        	if(this.state == '2') {
        		if(this.phoneVal == '') {
        			this.$toast('请输入原手机号码');
                	return;
        		}
        		if(this.signFlag) {
        			return;
        		}
        		this.signFlag = true;
        		phone = this.phoneVal;
        		phoneType = '2';
        	}
        	if(this.state == '3') {
        		if(!phoneReg.test(this.newPhoneVal)) {
        			this.$toast('请输入正确的号码');
                	return;
        		}
        		if(this.newPhoneVal == '') {
        			this.$toast('请输入新手机号码');
                	return;
        		}
        		if(this.signFlag2) {
        			return;
        		}
        		this.signFlag2 = true;
        		phone = this.newPhoneVal;
        		phoneType = '1';
        	}
        	var that = this;
            this.$http.post(this.baseUrl + '/user/password/getVerifyCode', { phone: phone, type: '1', phoneType: phoneType}).then(function(res) {
                if(that.state == '2') { 
                	that.signFlag = false;
                }
               	if(that.state == '3') { 
                	that.signFlag2 = false;
                }
                if (!res) { return; }
                that.$toast('验证码发送成功');
                that.handleCode();
            });
        },
        //发送验证码的状态
        handleCode() {
        	if(this.state == '2') {
        		this.hadSendCp1 = true;
        		localStorage.setItem('hadSendCp1', true); //已经发送了验证码
            	localStorage.setItem('sendTimeCp1', 60);
            	this.countDown1();
        	}
            if(this.state == '3') {
            	if(this.newPhoneVal == this.phoneVal) {
            		this.$toast('新手机号码与原手机号码相同');
            		return;
            	}
            	this.hadSendCp2 = true;
        		localStorage.setItem('hadSendCp2', true); //已经发送了验证码
            	localStorage.setItem('sendTimeCp2', 60);
            	this.countDown2();
        	}
            
        },
        //倒计时
        countDown1() {
            var that = this;
        	this.time1 = setInterval(function() {
        		that.sendTimeCp1--;
                if (that.sendTimeCp1 == 0) {
                    that.sendTimeCp1 = 60;
                    that.hadSendCp1 = false;
                    window.clearInterval(that.time1);
                }
                localStorage.setItem('hadSendCp1', that.hadSendCp1);
                localStorage.setItem('sendTimeCp1', that.sendTimeCp1);
        	}, 1000);
        },
        countDown2() {
        	var that = this;
        	this.time2 = setInterval(function() {
        		that.sendTimeCp2--;
                if (that.sendTimeCp2 == 0) {
                    that.sendTimeCp2 = 60;
                    that.hadSendCp2 = false;
                    window.clearInterval(that.time2);
                }
                localStorage.setItem('hadSendCp2', that.hadSendCp2);
                localStorage.setItem('sendTimeCp2', that.sendTimeCp2);
        	}, 1000);
        },
        //校验验证码
        verifyCode() {
        	var phone = '',verifyCode = '';
        	if(this.state == '2') {
        		phone = this.phoneVal;
        		verifyCode = this.codeVal;
        	}
        	if(this.state == '3') {
        		if(this.newPhoneVal == this.phoneVal) {
        			this.$toast('新手机号码与原手机号码相同');
        			return;
        		}
        		phone = this.newPhoneVal;
        		verifyCode = this.newCodeVal;
        	}
        	var that = this;
            this.$http.post(this.baseUrl + '/user/password/VerifyPasseord', 
            	{phone: phone, verifyCode: verifyCode, type: '1'})
            .then(function(res) {
                if (!res) { return false; }
                if(res.result != 'success') { that.$toast('检验失败'); }
				
				if(that.state == '3') {
					that.handleUpdate();
				} else {
					that.state = (parseInt(that.state) + 1).toString();
					
					that.changeInfo = {'state': that.state, 'currrPhone': phone};
					 localStorage.setItem('_changeInfo', JSON.stringify(that.changeInfo));
				}
            });
        },
        twoDown() {
        	if(this.codeVal == '') {
        		that.$toast('请输入验证码');
            	return;
        	}
        	//校验 验证码
        	this.verifyCode();
        },
        threeDown() {
        	if(this.newCodeVal == '') {
        		that.$toast('请输入验证码');
            	return;
        	}
        	//校验 验证码
        	this.verifyCode();
        },
        //修改手机号码
        handleUpdate() {
        	var that = this;
        	var params = {phone: this.newPhoneVal, verifyCode: this.newCodeVal, type: '1'};
            this.$http.post(this.baseUrl + '/updatePhone/revamp', params)
            .then(function(res) {
                if (!res) { return false; }
                //修改成功
				that.state = '4';
				
				that.changeInfo = {'state': that.state, 'currrPhone': that.newPhoneVal};
				 localStorage.setItem('_changeInfo', JSON.stringify(that.changeInfo));
            });
        },
        fourBtn() {
        	localStorage.removeItem('_changeInfo');
            this.$router.push({  name: 'MySetting' });
        },
    }
}

</script>
<style scoped>
#changePhone {
    background-color: #FAFAFA;
    min-height: 100vh;
}

.content * {
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
}

.content .text-box {
    font-size: 1.56rem;
    line-height: 2.6rem;
    padding: 2.5rem 0;
    text-align: center;
    background-color: #fff;
}

.content .text-box .gray {
    color: #A8A8A8;
}

.content .text-box .phone-num {
    font-size: 1.8rem;
    font-weight: bold;
}

.content .form-box {
    margin: 1rem 0;
}

.content .form-box input:nth-child(2) {
    margin-top: 1rem;
}

.content .form-box.u-ok {
    margin: 0;
}

.content .form-box .box {
    display: flex;
    display: -webkit-flex;
    align-items: center;
    background-color: #fff;
    line-height: 4.6rem;
    height: 4.6rem;
}

.content .form-box .box input {
    flex: 3;
}

.content .form-box .box button {
    flex: 1;
    margin: 0 1.5rem;
    line-height: 2.75rem;
    height: 2.75rem;
    width: 7.5rem;
    border: 0.1rem solid #e2e2e2;
    text-align: center;
    font-size: 1.195rem;
    color: #666;
    background-color: #fff;
    border-radius: 0.5rem;
}

.content .form-box input {
    display: block;
    width: 100%;
    line-height: 3.6rem;
    height: 5rem;
    font-size: 1.42rem;
    padding: 1.2rem 1.3rem;
}

.content .u-submit-box {
    padding: 0 1.3rem;
    margin-top: 5rem;
}

.content .u-submit-box button {
    display: block;
    width: 100%;
    height: 4.15rem;
    line-height: 4.15rem;
    background-color: #ff4242;
    border-radius: 0.5rem;
    font-size: 1.56rem;
    color: #fff;
}

.content .form-box.u-ok {
    padding: 4.6rem 2.25rem 0;
}

.content .ok-box {
    padding: 3.75rem 0 3.5rem;
    text-align: center;
    background-color: #fff;
    border-radius: 1rem;
    box-shadow: 0px 3px 24px 0px rgba(138, 132, 132, 0.08);
}

.content .ok-box .u-submit-box {
    margin-top: 3rem;
}

.content .ok-box .icon-box {
    margin-bottom: 2.5rem;
}

.content .ok-box .icon-box i {
    font-size: 5.2rem;
    color: #B3B3B3;
}

.content .ok-box p {
    font-size: 1.75rem;
    color: #666;
    margin-bottom: 1rem;
}

.content .ok-box p.red {
    color: #ff4242;
}
.text-gray {
	font-size: 1.2rem;
	color: #a8a8a8;
	margin-right: 1.5rem;
}
</style>
