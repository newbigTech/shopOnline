<!-- 红酒详情-->
<template>
    <div class="wineDetail">
    	<div class="con">
    		<img src="../../assets/img/wineDetail01.jpg" />
    	</div>
    </div>
</template>
<script>
export default {
    name: 'wineDetail', // 红酒详情
    data() {
        return {
        	
        }
    },
    created() {
    	document.title = '红酒详情';
//  	document.body.scrollTop = document.documentElement.scrollTop = 0;
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
