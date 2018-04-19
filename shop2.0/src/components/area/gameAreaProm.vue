<!-- 促销专区游戏规则 -->
<template>
    <div class="gameAreaProm">
    	<div class="con">
    		<img src="../../assets/img/gameRuleProm.jpg" />
    	</div>
    </div>
</template>
<script>
export default {
    name: 'gameAreaProm', // 促销专区游戏规则
    data() {
        return {
        	
        }
    },
    created() {
    	document.title = '促销专区游戏规则';
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
.con {
	width: 100%;
	background: #f5f5f5;
}
.con > img {
	display: block;
	width: 100%;
}
</style>
