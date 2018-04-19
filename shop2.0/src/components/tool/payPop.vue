<!-- 输入支付密码弹框 -->
<template>
    <div class="payPop">
    	<div class="pop" v-if="viewPop">
			<mt-popup v-model="viewPop" pop-transition="popup-fade" :closeOnClickModal="ff">
				<div class="close-pop"><span @click="closePop">×</span></div>
				<h2>请输入支付密码</h2>
				<template v-if="isGetMoney">
					<h3 class="title">提现</h3>
					<h1>¥520</h1>
				</template>
				<template v-if="!isGetMoney">
					<h3>请输入6位数数字支付密码</h3>
				</template>
				<pwd-input @result="getPwd"></pwd-input>
				<p :class="isGetMoney ? 'ta-right' : ''"><span @click="$router.push('/setPayPassword')">忘记密码？</span></p>
			</mt-popup>
		</div>
    </div>
</template>
<script>
import pwdInput from '@/components/tool/pwdInput'
export default {
    name: 'payPop', // 输入支付密码弹框
	components: {
		'pwd-input': pwdInput
	},
    data() {
        return {
        	ff: false,//关闭点击遮盖层隐藏掉弹框的功能
        }
    },
    watch: {
    	
    },
    props: {
    	'viewPop': { //是否显示弹框
    		type: Boolean,
    		default: false
    	},
    	'isGetMoney': { //是否为提现
    		type: Boolean,
    		default: false
    	},
    	'moneyNum': {//提现金额
    		type: Number,
    		default: 0
    	},
    },
    created() {   
    	
    },
    mounted() {
        this.$nextTick(function() {
        	
        });
    },
    destroyed() {
    	document.body.removeAttribute('style');
    },
    methods: {
        //关闭密码输入框
		closePop() {
			document.body.removeAttribute('style');
			this.$emit('result2', false);
		},
		//获取密码
		getPwd(val) {
			this.$emit('result', val);//给父组件传最后的密码值
		}
    }

}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style scoped>
.mint-popup { width: 28rem; height: 20.6rem; text-align: center; border-radius: 0.5rem; padding: 2.0rem; }
.close-pop { font-size: 2.4rem; text-align: right; color: #333;cursor: pointer; }
.pop h2 { color: #333; font-size: 1.6rem; margin-bottom: 1.5rem; }
.pop h3 { color: #999; font-size: 1.4rem; margin-bottom: 2.8rem; }
.pop h3.title { color: #333; font-size: 1.4rem; }
.pop h1 { color: #333; font-size: 2.5rem; margin-bottom: 2.2rem; margin-top: -1.1rem; }
.pop p { text-align: center; color: #305694; font-size: 1.3rem; margin-top: 4.1rem; }
.pop p.ta-right {margin-top: 1.8rem; text-align: right;color: #0078ff; }
</style>
