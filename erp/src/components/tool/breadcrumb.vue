<!-- 面包屑（当前页面路径） -->
<template>
    <div id="breadcrumb">
    	<div class="page-bar">
			<ul class="page-breadcrumb">
				<li>
					<a href="#">{{firstMenu}}</a>
					<i class="fa fa-angle-right"></i>
				</li>
				<li>
					<a href="#">{{secondMenu}}</a>
					<i class="fa fa-angle-right"  v-if="thirdMenu != null"></i>
				</li>
				<li v-if="thirdMenu != null">
					<a href="#">{{thirdMenu}}</a>
				</li>
			</ul>
		</div>
    </div>
</template>
<script>
export default {
    name: 'breadcrumb',
	props: {
		firstMenu: {
			type: String,
			default: '首页' //一级菜单名称
		},
		secondMenu: {
			type: String,
			default: null //二级菜单名称
		},
		thirdMenu: {
			type: String,
			default: null //二级菜单名称
		}
    },
    data() {
        return {
        	
        }
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
.page-bar {
	padding: 5px 10px;
}
.page-breadcrumb li a:hover {
	text-decoration: none !important;
}
</style>
