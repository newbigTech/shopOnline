<!-- 
    订单明细
-->
<template>
    <div class="orderFund">
    	<v-breadcrumb firstMenu="财务管理" secondMenu="订单明细"></v-breadcrumb>
    	<div class="nav">
    		<div class="col-md-12">
    			<div class="portlet box blue">
    				<div class="portlet-title">
						<div class="caption">订单明细</div>
					</div>
					<div class="portlet-body">
						<div class="operate">
							<span>类型：</span>
							<el-select v-model="inquire.type" placeholder="请选择" class="ml10" @change="pageReset">
							    <el-option v-for="item in type"
							      :key="item.value" :label="item.label" :value="item.value">
							    </el-option>
							</el-select>
							<span class="spanLeft">升级模式：</span>
							<el-select v-model="inquire.upgrade" placeholder="请选择" class="ml10" @change="pageReset">
							    <el-option v-for="item in upgrade"
							      :key="item.value" :label="item.label" :value="item.value">
							    </el-option>
							</el-select>
							<span class="spanLeft">选择时间：</span>
							<el-date-picker
						      v-model="inquire.time"
						      type="daterange"
						      range-separator="-"
						      value-format="yyyy-MM-dd HH:mm:ss" 
						      start-placeholder="开始日期"
						      end-placeholder="结束日期"
						      @change="pageReset"
						      :picker-options="pickerOptions0">
						    </el-date-picker>
						</div>
						<div class="operate">
							<span>订单号：</span>
						    <div class="input-medium input-inline">
						    	<el-input
								  placeholder="请输入订单号"
								  v-model="inquire.num"
								  clearable
								  @change="pageReset">
								</el-input>
						    </div>
							<span class="spanLeft">商品名称：</span>
							<div class="input-medium input-inline">
								<el-input
								  placeholder="请输入商品名称"
								  v-model="inquire.name"
								  clearable
								  @change="pageReset">
								</el-input>
							</div>
							<button type="button" class="btn btn-success" @click="findList">查询</button>
							<button type="button" class="btn btn-primary" @click="handleExcel">导出</button>
						</div>
						<div class="table-scrollable">
							<el-table :data="tableData" >
								<el-table-column prop="create_time" label="日期"> </el-table-column>
								<el-table-column prop="orders_no" label="订单编号"> </el-table-column>
							    <el-table-column prop="goods_name" label="商品名称"> </el-table-column>
							    <el-table-column prop="count" label="数量"> </el-table-column>
							    <el-table-column prop="goods_price" label="商品单价"> </el-table-column>
							    <el-table-column prop="final_amount" label="商品总价"> </el-table-column>
							    <el-table-column prop="" label="类型">
							    	<template slot-scope="scope">
							    		<span v-if="scope.row.order_type == '1'">升级订单</span>
							    		<span v-else-if="scope.row.order_type == 'ordinary'">普通订单</span>
							    		<span v-else>增值订单</span>
							    	</template>
							    </el-table-column>
							    <el-table-column prop="" label="升级模式"> 
							    	<template slot-scope="scope">
							    		<span v-if="scope.row.up_way == 0">未升级</span>
							    		<span v-else-if="scope.row.up_way == 1">拆红包</span>
							    		<span v-else>猜奇偶</span>
							    	</template>
							    </el-table-column>
							    <el-table-column prop="old_price" label="成本"> </el-table-column>
							    <el-table-column prop="service_amount" label="服务费"> </el-table-column>
							    <el-table-column prop="margin" label="利润"> </el-table-column>
							    <el-table-column prop="postage" label="邮费"> </el-table-column>
							    <el-table-column prop="profit" label="盈亏"> </el-table-column>
							</el-table>
							<!--页面插件-->
						 	<el-pagination layout="prev, pager, next" v-if="total > pageSize"
			    			:page-size="pageSize" :current-page="pageNum" :total="total"
							 v-on:current-change="handlePaging"></el-pagination>
						</div>
					</div>
    			</div>
    		</div>
    	</div>
    </div>
</template>
<script>
import breadcrumb from '@/components/tool/breadcrumb' //面包屑		
	
export default {
    name: 'orderFund', // 结构名称
    data() {
        return {
            // 数据模型
            type:[
    			{ value: '0',label: '全部'},
        		{ value: 'ordinary',label: '普通订单'},
	      		{ value: '1',label: '升级订单'},
	      		{ value: '2',label: '增值订单'}
    		],//类别
    		upgrade:[
    			{ value: '3',label: '全部'},
    			{ value: '0',label: '未升级'},
    			{ value: '1',label: '红包模式'},
        		{ value: '2',label: '奇偶模式'}
    		],//升级模式
            inquire:{"type":"0","upgrade":"3"},//查询条件
            tableData:[],//列表数据
            total: null,//列表总数
        	pageNum:1,//当前页数
        	pageSize:10,//每页条数
        	startTime: '',//开始时间
        	endTime: '',//结束时间
        	resetVal:false,//是否需要重置页面
        	pickerOptions0: {
          		disabledDate(time) {
            		return time.getTime() > Date.now() - 8.64e7;
          		}
        	} 
        }
    },
    components:{
    	'v-breadcrumb': breadcrumb
    },
    watch: {
        // 监控集合
    },
    props: {
        // 集成父级参数
    },
    beforeCreate() {
        // console.group('创建前状态  ===============》beforeCreate');
    },
    created() {
        // console.group('创建完毕状态===============》created');
    },
    beforeMount() {
        // console.group('挂载前状态  ===============》beforeMount');
    },
    mounted() {
        // console.group('挂载结束状态===============》mounted');
        this.$nextTick(function() {
            // console.log('执行完后，执行===============》mounted');
        });
    },
    beforeUpdate() {
        // console.group('更新前状态  ===============》beforeUpdate');
    },
    updated() {
        // console.group('更新完成状态===============》updated');
    },
    beforeDestroy() {
        // console.group('销毁前状态  ===============》beforeDestroy');
    },
    destroyed() {
        // console.group('销毁完成状态===============》destroyed');
    },
    methods: {
        // 方法 集合
        
        //分页-当前页面
        handlePaging(_pageNum) {
    		this.pageNum = _pageNum;
			this.findList();
    	},
    	//查询列表
    	findList() {
    		if (this.resetVal == true) {
    			this.pageNum = 1;
    			this.resetVal = false;
    		}
    		if (!this.inquire.time) {
    			this.$message({
    				message: '查询时间必须填写!',
		          	type: 'error'
    			});
    			return;
    		} else {
    			var startTime = this.inquire.time[0];
    			startTime = Date.parse(startTime);
    			startTime = startTime.toString();
    			startTime = startTime.substring(0,startTime.length-3);
				this.startTime = startTime;
				
				var endTime = this.inquire.time[1];
    			endTime = Date.parse(endTime);
    			endTime = endTime.toString();
    			endTime = endTime.substring(0,endTime.length-3);
				this.endTime = endTime;
    		}
    		var params = {
    			token:this.token,
    			pageNum:this.pageNum,
    			pageSize:this.pageSize,
    			startTime:this.startTime,
    			endTime:this.endTime
    		};
    		//类型条件
    		if(this.inquire.type != 0){
    			params.orderType = this.inquire.type;
    		}
    		//升级模式
    		if(this.inquire.upgrade != 3) {
    			params.upWay = this.inquire.upgrade;
    		}
    		//订单编号
    		if(this.inquire.num) {
    			params.ordersNo = this.inquire.num;
    		}
    		//商品名称
    		if(this.inquire.name) {
    			params.productName = this.inquire.name;
    		}
    		var that =this;
    		var reqUrl = this.baseUrl + '/erp/report/ordersDetail';
    		
    		this.$http.get(reqUrl,{params:params}).then(function(res) {
    			if (!res) {
    				return;
    			}
    			that.total = res.total;
    			that.tableData = res.list;
    		})
    	},
    	//改变状态时从头开始查询
    	pageReset() {
    		this.resetVal = true;
    	},
    	//导出
    	handleExcel() {
    		var downloadUrl = this.baseUrl + '/erp/report/ordersDetail/export'+'?';
    		downloadUrl = downloadUrl +'token='+this.token;
	    	//查询时间条件
			if (!this.inquire.time) {
    			this.$message({
    				message: '导出时间必须填写!',
		          	type: 'error'
    			});
    			return;
    		} else {
    			var startTime = this.inquire.time[0];
    			startTime = Date.parse(startTime);
    			startTime = startTime.toString();
    			startTime = startTime.substring(0,startTime.length-3);
				this.startTime = startTime;
				
				var endTime = this.inquire.time[1];
    			endTime = Date.parse(endTime);
    			endTime = endTime.toString();
    			endTime = endTime.substring(0,endTime.length-3);
				this.endTime = endTime;
				
				downloadUrl += '&'+'startTime='+this.startTime;
				downloadUrl += '&'+'endTime='+this.endTime;
    		}
			//类型条件
    		if(this.inquire.type != 0){
    			downloadUrl += '&'+'orderType='+ this.inquire.type;
    		}
    		//升级模式
    		if(this.inquire.upgrade != 3) {
    			downloadUrl += '&'+'upWay='+ this.inquire.upgrade;
    		}
    		//订单编号
    		if(this.inquire.num) {
    			downloadUrl += '&'+'ordersNo='+ this.inquire.num;
    		}
    		//商品名称
    		if(this.inquire.name) {
    			downloadUrl += '&'+'productName='+ this.chineseToURI(this.inquire.name);
    		}
    		window.open(downloadUrl);
    	}
    }

}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style scoped>
@import './finance.css';

</style>