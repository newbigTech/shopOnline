<template>
    <div id="app">
        <router-view/>
    </div>
</template>
<script>
export default {
    name: 'App'
}

methods: {
    window.vue = this;
}

</script>
<style>
@import './assets/css/reset.css';
@import './assets/css/base.css';

#app {
    font-family: "Microsoft YaHei";
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #333;
}

</style>
