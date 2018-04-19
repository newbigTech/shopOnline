<!-- 重置/设置手机号码 -->
<template>
    <div id="resetLoginPassword" class="div-border-box">
        <forget-pwd :updateType="'5'" :phoneDisable="phoneDisable"></forget-pwd>
    </div>
</template>
<script>
import { Toast } from 'mint-ui';
import forgetPwd from '../../../forgetPwd/forgetPwd' //忘记密码

export default {
    name: 'changePhone',
    data() {
        return {
            scheduleState: false,
            show: true,
            bodyHeight: document.documentElement.clientHeight + 'px',
            one: {
                state: true,
                inpVal: "",
                inpCode: "",
                validateCode: 123456,
            },
            two: {
                state: false,
                passWord: "",
                okPassWord: "",
            },
            three: {
                state: false,
            },
            phoneDisable: true
        }
    },
    components: { "forget-pwd": forgetPwd },
    created() {
        document.title = '重置登录密码';
    },
    methods: {}
}

</script>
<style scoped>


</style>
