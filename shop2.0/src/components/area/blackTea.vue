<!-- 茶叶-安化黑茶专区 -->
<template>
	<div class="blackTea">
		<div class="cont">
			<img src="../../assets/img/blackTeaBG1.png" />
			<div class="clickPic">
				<img src="../../assets/img/blackTea1.png"/>
			</div>
			<img src="../../assets/img/blackTeaBG2.png"/>
			<div class="clickPic">
				<img src="../../assets/img/blackTea2.png"/>
			</div>
			<img src="../../assets/img/blackTeaBG3.png"/>
			<div class="clickPic">
				<img src="../../assets/img/blackTea3.png"/>
			</div>
			<img src="../../assets/img/blackTeaBG4.png"/>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
export default {
	name:'blackTea',
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
.blackTea .cont{
	width: 100%;
	background: #27221f;
}
.blackTea .cont>img{
	width: 100%;
}
.blackTea .cont .clickPic{
	width: calc(100% - 3.2rem);
	margin: 0 auto;
	
}
.blackTea .cont .clickPic>img{
	width: 100%;
}
</style>