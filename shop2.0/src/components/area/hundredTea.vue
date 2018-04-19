<!-- 茶叶-百年茂记专区 -->
<template>
	<div class="hundredTea">
		<div class="cont">
			<img src="../../assets/img/hundredTea1.png" />
			<img src="../../assets/img/hundredTea2.png"/>
			<img src="../../assets/img/hundredTea3.png" style="margin-top: 10px;"/>
			<img src="../../assets/img/hundredTea4.png"/>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
export default {
	name:'hundredTea',
	data() {
		return {
			
		}
	},
	mounted() {
		this.$nextTick(function() {
			
		})
	},
	methods:{
		
	}
}
</script>

<style scoped>
.hundredTea .cont{
	width: 100%;
	background: #fff;
}
.hundredTea .cont>img{
	width: 100%;
}
</style>