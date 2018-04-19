<template>
    <div id="app" :style="{height: winH + 'px'}">
        <router-view/>
    </div>
</template>
<script>
export default {
    name: 'App'
}

</script>
<style>
@import './assets/css/reset.css';
@import './assets/css/base.css';
#app {
    font-family: "微软雅黑";
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #697882;
}

</style>
