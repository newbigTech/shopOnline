<template>
	<div class="monitoring">
		<v-breadcrumb firstMenu="报表" secondMenu="注单监控报表"></v-breadcrumb>
		<div class="nav row">
			<div class="col-md-12">
				<div class="portlet box red">
					<div class="portlet-title">
                        <div class="caption">注单监控报表</div>
                    </div>
                    <div class="portlet-body">
                    	<div class="operate">
                    		<span class="demonstration">注单时间：</span>
                    		<el-date-picker
						      v-model="timeVal"
						      type="date"
						      value-format="yyyy-MM-dd"
						      :picker-options="pickerOptions1"
						      placeholder="选择日期">
						    </el-date-picker>
						    <el-button type="primary" @click="inquire">查询</el-button>
                    	</div>
                    	
                    	<div class="table-scrollable">
                    		<el-table :data="tableData" border max-height="650">
                    			<el-table-column prop="issueName" label="期号"> </el-table-column>
							    <el-table-column prop="lotteryNum" label="开奖号码"> </el-table-column>
							    <el-table-column prop="lotteryString" label="开奖结果"> </el-table-column>
							    <el-table-column prop="jiTotalAmount" label="奇数总金额"> </el-table-column>
							    <el-table-column prop="ouTotalAmount" label="偶数总金额"> </el-table-column>
							    <el-table-column prop="ratio" label="比例"> </el-table-column>
						    </el-table>
                    	</div>
                    </div>
				</div>
			</div>
		</div>
	</div>
</template>

<script type="text/ecmascript-6"> 
	import breadcrumb from '@/components/tool/breadcrumb' //面包屑
	
	export default {
		name: 'monitoring',
	    components: {
	        'v-breadcrumb': breadcrumb
	    },
	    data() {
	    	return {
	    		timeVal:'',
	    		pickerOptions1: {
		        	disabledDate(time) {
		            	return time.getTime() > Date.now();
			        },
		    	},//时间的范围
		    	tableData:[],//列表数据
		    	timer:'',//需要传递的时间参数
		    	timeList:null,//定时器
	    	}
	    },
	    mounted() {
	        this.$nextTick(function() {
	        	var date = new Date(); 
				var mon = date.getMonth() + 1;
				var day = date.getDate();
				var nowDay = date.getFullYear() + "-" + (mon<10?"0"+mon:mon) + "-" +(day<10?"0"+day:day);
				this.timeVal = nowDay;
	        	this.inquire();
	        });
	    },
	    beforeDestroy() {
	        // console.group('销毁前状态  ===============》beforeDestroy');
	        clearInterval(this.timeList)
	    },
	    methods:{
	    	//查询
	    	inquire() {
	    		this.timer = this.timeVal;
	    		this.findList();
	    		let that = this;
	    		this.timeList = setInterval(function(){
	    			that.findList();
	    		},10000)
	    	},
	    	//获取列表
	    	findList() {
	    		var params = {
	    			createTime:this.timer
	    		};
	    		var that =this;
	    		var reqUrl = this.baseUrl + '/jioucount/findjioucountList';
	    		
	    		this.$http.get(reqUrl,{params:params}).then(function(res) {
	    			if (!res) {
	    				return;
	    			}
	    			that.total = res.total;
	    			that.tableData = res.jiouinfoList;
	    		})
	    	}
	    }
	}
</script>

<style scoped>
	
</style>