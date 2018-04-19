<!--商城公告-详情-->
<template>
	<div id="AnnouncementDetails" :style="{'min-height': clientH *10 +'px'}">
		<!--<div class="header">
    		<header-bar></header-bar>
    		<div class="line"></div>
    	</div>-->
		<div class="details_box">
			<h3>{{title}}</h3>
			<span>{{time}}</span>
			<p v-for="item in details">{{item}}</p>
		</div>
	</div>
</template>

<script>
//	import headerBar from '@/components/header/headerBar'	
export default {
	name: 'AnnouncementDetails',
	components: {
//	  	'header-bar': headerBar
	},
	data(){
		return{
			title:'',
			time:'',
			details:[],
			pageNum:null,
			noticeId:null,
		}
	},
	mounted(){
		 this.$nextTick(function(){
			this.getDetails()
		 })
	},
	methods:{
		getDetails(){
			var mallDetails = JSON.parse(localStorage.getItem('_mallDetails'));
			this.title = mallDetails.noteTitle;
			this.time = mallDetails.time;
			var details = mallDetails.noteContent;
			var arr = [];
			arr =details.replace(/\r/g,'').split('\n');
   			this.details = arr;
 		}
 	},

}
</script>

<style scoped>
.clearfix:after {
	content: "";
	display: block;
	clear: both;
}
.header{
	position: relative;
	margin-bottom: 2.5rem;
}
.line{
	height: 0.1rem;
	width: 100%;
	background: #ebebeb;
	position: fixed;
	left: 0;
	top: 3.7rem;
}
/*商城公告-详情start*/
#AnnouncementDetails{
	margin: 0 auto;
	margin-top: 0.1rem;
}
#AnnouncementDetails .details_box{
	margin: 0 auto;
	width: calc(100% - 3rem);
	padding-top: 0.6rem;
}
#AnnouncementDetails .details_box h3{
	font-size: 1.6rem;
	color: #333333;
	font-weight: normal;
}
#AnnouncementDetails .details_box span{
	display: block;
	width: 100%;
	color: #999999;
	font-size: 1.2rem;
	margin-top: 1rem;
	padding-bottom: 1rem;
	border-bottom: 0.1rem solid #e5e5e5;
}

#AnnouncementDetails .details_box p{
	font-size: 1.3rem;
	line-height: 2.5rem;
	text-indent: 2em;
	color: #666;
	margin-top: 1.5rem;
	margin-bottom: 1rem;
}

/*商城公告-详情end*/
</style>