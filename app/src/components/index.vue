<template>
	<div class="hello">
		<h1>{{ msg }}</h1>
		<router-link to="/integralClub">积分乐园</router-link>
		<router-link to="/gameSize">猜单双</router-link>
		<router-link to="/gameGift">猜红包</router-link>
        <router-link to="/myUpgrade">升级订单（退货退款）</router-link>
		<router-link to="/afterSales">我的订单（售后、查看物流）</router-link>
		<router-link to="/">帮助中心</router-link>
		<router-link to="/upgadeRecord/upgadesRecord">升级记录</router-link>
		<router-link to="/upgadeRecord/packetRecord">红包记录</router-link>
		<router-link to="/lotteryList">开奖榜单</router-link>
		<!--<h2>Essential Links</h2>
		<ul>
			<li>
				<a href="https://vuejs.org" target="_blank">
					Core Docs
				</a>
			</li>
			<li>
				<a href="https://forum.vuejs.org" target="_blank">
					Forum
				</a>
			</li>
			<li>
				<a href="https://chat.vuejs.org" target="_blank">
					Community Chat
				</a>
			</li>
			<li>
				<a href="https://twitter.com/vuejs" target="_blank">
					Twitter
				</a>
			</li>
			<br>
			<li>
				<a href="http://vuejs-templates.github.io/webpack/" target="_blank">
					Docs for This Template
				</a>
			</li>
		</ul>
		<h2>Ecosystem</h2>
		<ul>
			<li>
				<a href="http://router.vuejs.org/" target="_blank">
					vue-router
				</a>
			</li>
			<li>
				<a href="http://vuex.vuejs.org/" target="_blank">
					vuex
				</a>
			</li>
			<li>
				<a href="http://vue-loader.vuejs.org/" target="_blank">
					vue-loader
				</a>
			</li>
			<li>
				<a href="https://github.com/vuejs/awesome-vue" target="_blank">
					awesome-vue
				</a>
			</li>
		</ul>-->
	</div>
</template>

<script>
	export default {
		name: 'HelloWorld',
		data() {
			return {
				msg: '页面链接'
			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hello {
	padding: 2.0rem;
	font-size: 1.5rem;
	line-height: 2.4rem;
}
h1 {
	margin-bottom: 1.6rem;
}
a {
	display: block;
	font-weight: bold;
	text-decoration: underline;
}
</style>