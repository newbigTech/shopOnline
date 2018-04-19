<!-- 提示(手机号码不符) -->
<template>
    <div class="phoneWarn" :style="{'height': (clientH * 10) +'px'}">
    	<div class="con">
    		<h2>提示【手机号码不符】</h2>
    		<p>
    			你的手机号与银行预留手机号不符，请本人带一张通、身份证件到柜台，或通过专业版—账户管理—客户联系资料修改，修改你的手机号码。
    		</p>
    	</div>
    </div>
</template>
<script>
export default {
    name: 'phoneWarn', // 提示(手机号码不符)
    data() {
        return {
        	
        }
    },
    created() {
    	document.title = '提示(手机号不符)';
    },
    mounted() {
        this.$nextTick(function() {
        	
        });
    },
    methods: {
    	
    }

}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style scoped>
.phoneWarn {
	background: #f5f5f5;
	overflow: hidden;
}
.con {
	background: #fff;
	margin-top: 1.5rem;
}
.con > h2 {
	font-size: 1.6rem;
	line-height: 2.8rem;
	color: #333;
	padding: 2.2rem 1.3rem 1.2rem 1.3rem;
}
.con > p {
	font-size: 1.5rem;
	line-height: 3.0rem;
	color: #999;
	margin: 0 1.3rem;
	padding: 1.6rem 0 3.5rem 0;
	border-top: 0.05rem solid #e5e5e5;
}
</style>
