<!-- 登录 -->
<template>
    <div class="login">
        <div class="content">
        	<div class="logo">
	        	<img src="../../../static/img/bg-title.png" />
	        </div>
	        <div class="login-form">
                <div class="form-item" @click="handleItem">
                	<i class="iconfont icon-zhanghao"></i>
                    <input class="form-input" type="text" autocomplete="off" placeholder="请输入手机号" v-model="userPhone" @keyup.enter="handleLogin">
                </div>
                <div class="form-item" @click="handleItem">
                	<i class="iconfont icon-mima"></i>
                    <input class="form-input" type="password" autocomplete="off" placeholder="请输入密码" v-model="userPwd" @keyup.enter="handleLogin">
                </div>
                <div class="item-login">
                    <button class="btn-login" @click="handleLogin">登录</button>
                </div>
            </div>
        </div>
        <div class="login-btm">
            2018湖南宏裕程网络科技有限公司版权所有
        </div>
    </div>
</template>
<script>
export default {
    name: 'login',
    components: {

    },
    data() {
        return {
            userPhone: '', //手机号
            userPwd: '', //密码
            valiCode: '', //验证码
        }
    },
    mounted() {
        this.$nextTick(function() {});
    },
    methods: {
        //登录
        handleLogin() {
        	var that = this,
        		reqUrl = this.baseUrl + '/erp/user/login',
				params = {
					phone: this.userPhone,
					pwd: this.userPwd
				}
			this.$http.post(reqUrl, params)
			.then(function(res) {
				if(!res) {
					return;
				}
				localStorage.setItem('userInfo', JSON.stringify(res.user));
				localStorage.setItem('token', res.token);
				that.$message('登录成功');
				if(res.user.userType != 3) { //0平台 	1运营中心	2代理商
					that.$router.push('/home');
				}
				if(res.user.userType == 3) { //3业务员
					that.$router.push('/personalInfo');
				}
   			});
        	
//          localStorage.setItem('userInfo', JSON.stringify({ username: 'admin' }));
//          localStorage.setItem('token', 's4d45e7ef11e85e15e15')
//          this.$router.push('/');
        },
        handleItem(e) {
//      	console.log(document.getElementsByClassName('form-item')[0]);
        	document.getElementsByClassName('form-item')[0].className = 'form-item';
        	document.getElementsByClassName('form-item')[1].className = 'form-item';
        	e.currentTarget.className = 'form-item active';
//      	console.log(e.currentTarget)
        }
    }
}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style scoped>
@import url(./login.css);

</style>
