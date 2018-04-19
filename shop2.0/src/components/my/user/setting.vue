<!-- 模型：
    DOM 结构
-->
<template>
    <div class="my-setting" :style="{height:bodyHeight}">
        <div class="content"><!-- :to='help.name' -->
            <mt-cell :title="help.text" is-link v-for="help, index in helpList" :key='index' @click.native="handleLink(help.name)" ></mt-cell>
        </div>
        <div class="goExitBox" @click="goEixt">
            <a href="javascript:;" class="goEixt">退出</a>
        </div>
    </div>
</template>
<script>
import { MessageBox } from 'mint-ui';
export default {
    name: 'my-setting', // 结构名称
    data() {
        return {
            helpList: [
                { name: 'loginPassword', text: '重置登录密码' },
                { name: 'setPayPassword', text: '设置/重置支付密码' },
                { name: 'confirmPassword', text: '修改手机号' }
            ],
            bodyHeight: document.documentElement.clientHeight + 'px', // 高度
        }
    },
	created() {
		if(this.userInfo.payPassword) {
			this.helpList[1].text = '重置支付密码';
		} else {
			this.helpList[1].text = '设置支付密码';
		}
    },
    mounted() {
        document.title = '设置';
        // this.setHelp();
    },
    methods: {
        // 退出登录
        goEixt() {
        	var that = this;
        	MessageBox.confirm('确认退出吗?').then(function(action) {
		       	window.localStorage.clear();
		        that.$router.push({ name: 'Index' });
			}, function(action) {});
        },
        // 设置选项 => 提示文本
        setHelp() {
            // this.helpList[0].text = this.userInfo.loginType == 1 ? '重置登录密码' : '设置登录密码';
            // this.helpList[1].text = this.userInfo.payPassword ? '重置支付密码' : '设置支付密码';
            // this.helpList[2].text = this.userInfo.phone.length == 11 ? '修改手机号' : '绑定手机号';
        },
        handleLink(path) {
        	//绑定/修改手机号码时，要先验证有无支付密码，如无支付密码，则提示去设置支付密码
        	if(path == 'confirmPassword') {
        		if(!this.userInfo.payPassword) { //支付密码(true:有 false:无)
        			var that = this;
        			MessageBox.confirm('暂无支付密码，前往设置').then(function(action) {
				        that.$router.push('/setPayPassword');
					}, function(action) {});
        		} else {
        			this.$router.push(path);
        		}
        	} else {
        		this.$router.push(path);
        	}
        }
    }
}

</script>
<style scoped>
@import 'user.css'

</style>
