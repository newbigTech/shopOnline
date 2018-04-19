<!-- 红酒专区 -->
<template>
    <div class="wineArea">
    	<div class="con">
    		<img src="../../assets/img/wineArea01.png" />
    		<img src="../../assets/img/wineArea02.png" />
    		<img src="../../assets/img/wineArea03.png" class="wine-img" @click="$router.push('/wineDetail')" />
    		<img src="../../assets/img/wineArea04.png" />
    		<img src="../../assets/img/wineArea05.png" class="wine-img" @click="$router.push('/wineDetail')" />
    	</div>
    </div>
</template>
<script>
export default {
    name: 'wineArea', // 红酒专区
    data() {
        return {
        	
        }
    },
    created() {
    	document.title = '红酒专题';
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
.wine-img {
	width: calc(100% - 3.0rem) !important;
	margin: 1.5rem 1.5rem 2.0rem 1.5rem;
}
</style>
