<template>
    <div class="index" id="index">
		<v-home></v-home>
    </div>
</template>
<script>
import home from '@/components/home/home'   

export default {
    name: 'index',
    components: {
        'v-home': home
    },
    data() {
        return {
            
        }
    },
    created() {
//     	document.body.scrollTop = document.documentElement.scrollTop = 0;
    },
    mounted() {
        this.$nextTick(function() {
//        document.body.scrollTop = document.documentElement.scrollTop = 0;
        });
    },
    methods: {
        
    }
}

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* 此处仅供开发前期方便, 后期删除 */
h1.show { display: block; font-size: 36px; text-align: center; margin: 30px auto; }
h1.show a { color: #48dddd; }
</style>
