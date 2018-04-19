<!-- 回到顶部 -->
<template>
    <div class="back-top">
    	<div class="nav" @click="backTop" v-if="toTop">
			<img src="../home/img/backTop.png" />
		</div>
    </div>
</template>
<script>
export default {
    name: 'back-top', // 回到顶部
    data() {
        return {
            toTop: false, //回到顶部状态
            timer: null,
            currentPosition: null,
            
        }
    },
    mounted() {
        this.$nextTick(function() {
        	window.addEventListener('scroll', this.needBackTop); //监听滚动事件
        });
    },
    methods: {
        //判断是否回到顶部
    	needBackTop: function() {
    		var curHeight = (document.documentElement.scrollTop || document.body.scrollTop) * 0.1; 
	        if (curHeight > (this.clientH * 1.2) ) {  
	          this.toTop = true;                         
	        } else {  
	          this.toTop = false;  
	        }  
    	},
    	//回到顶部
    	backTop: function() {
    		var that = this;
			this.timer = setInterval(function() {
				that.runToTop();
			}, 1);
    	},
    	runToTop: function() {  
			var currentPosition = document.documentElement.scrollTop || document.body.scrollTop; 
			currentPosition = currentPosition - 100;//20;
			if(currentPosition > 0) {  
				window.scrollTo(0, currentPosition);  
			} else {
				window.scrollTo(0, 0);  
				window.clearInterval(this.timer);  
			}  
		}  
    }
}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style scoped>
.back-top > .nav {
	position: fixed;
	right: 1.2rem;
	bottom: 7.0rem;
	width: 4.1rem;
	height: 4.1rem;
}
.back-top > .nav > img {
	width: 100%;
	height: 100%;
}
</style>
