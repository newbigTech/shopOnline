<!-- 确认支付密码 -->
<template>
    <div id="confirmPassword">
        <div class="content">
            <div class="text-box input-hd">
                <p>输入支付密码后即可更换</p>
            </div>
            <div class="box">
                <pwd-input :redBorder="redBorder" @result="getPwd"></pwd-input>
            </div>
            <div class="u-submit-box ok-btn">
                <button @click="getPwd">下一步</button>
            </div>
        </div>
    </div>
</template>
<script>
import pwdInput from '@/components/tool/pwdInput' //密码输入框

import { Toast } from 'mint-ui';
export default {
    name: 'changePhone',
    components: {
        'pwd-input': pwdInput
    },
    data() {
        return {
            thisPassword: 111111,
            redBorder: true
        }
    },
    mounted() {
        document.title = '变更手机号';
    },
    destroyed() {
       document.body.removeAttribute('style');
    },
    methods: {
        getPwd: function(val) {
        	if(val == '') {
        		this.$toast('请输入密码');
        	}
        	this.verifyPwd(val);
        },
        //校验支付密码
        verifyPwd: function(val) {
        	var that = this;
			var reqUrl = this.baseUrl + '/updatePhone/paypassword';
			var params = {
				payPassword: val
			}
			this.$http.get(reqUrl, {params: params}).then(function(res) {
				if(!res) {
					return;
				}
				if(res.result != 'success') {
					that.$toast('支付密码校验失败');
					return;
				}
				document.body.removeAttribute('style');
//				that.$toast('支付密码校验成功');
				that.$router.push('/changePhone');
			});
        },
        yesBtn: function() {

        },
        noBtn: function() {

        }
    }
}

</script>
<style scoped>
#confirmPassword {
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

.content .box {
    margin-top: 3rem;
    width: 100%;
    height: 4.8rem;
    padding: 0 1.5rem;
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
    margin-top: 3.5rem;
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

</style>
