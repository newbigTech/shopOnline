<!-- 茶叶-烟溪红专区 -->
<template>
	<div class="yanxihong">
		<div class="cont">
			<img src="../../assets/img/yanxihong1.png" />
			<div class="tab">
				<div class="tabItem">
					<img src="../../assets/img/yanxihong2.png"/>
				</div>
				<div class="tabItem">
					<img src="../../assets/img/yanxihong3.png"/>
				</div>
				<div class="tabItem">
					<img src="../../assets/img/yanxihong4.png"/>
				</div>
				<div class="tabItem">
					<img src="../../assets/img/yanxihong5.png"/>
				</div>
				<div class="tabItem">
					<img src="../../assets/img/yanxihong6.png"/>
				</div>
				<div class="tabItem">
					<img src="../../assets/img/yanxihong7.png"/>
				</div>
			</div>
			
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
export default {
	name:'yanxihong',
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
.yanxihong .cont{
	width: 100%;
	background: #fff;
}
.yanxihong .cont>img{
	width: 100%;
}
.yanxihong .cont .tab{
	display: flex;
	flex-wrap:wrap;
}
.yanxihong .cont .tab .tabItem{
	width: 50%;
}
.yanxihong .cont .tab .tabItem>img{
	width: 100%;
}
</style>