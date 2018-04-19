<template>
  <div id="app" :style="{height: winH + 'px'}">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app',
  mounted() {
    this.$nextTick(function() {
    	document.title = this.title;
    });
	},
}
</script>

<style>
@import './assets/css/reset.css';
@import './assets/css/base.css';
#app {
  /*font-family: 'Avenir', Helvetica, Arial, sans-serif;*/
 	font-family: "Open Sans",sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #666;
}
</style>
