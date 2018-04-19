<template>
	<div class="orderList">
		<v-breadcrumb firstMenu="报表" secondMenu="订单总表"></v-breadcrumb>
		<div class="nav row">
			<div class="col-md-12">
				<div class="portlet box red">
					<div class="portlet-title">
                        <div class="caption">订单总表</div>
                    </div>
                    <div class="portlet-body">
                    	<div class="operate">
                    		<span class="demonstration">选择时间：</span>
							<el-date-picker v-model="timeVal" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" ></el-date-picker>
							<span>选择类型：</span>
							<el-select v-model="typeVal" placeholder="请选择" class="ml10">
							    <el-option v-for="item in options"
							      :key="item.value" :label="item.label" :value="item.value">
							    </el-option>
							</el-select>
							<el-button type="info" style="margin-left: 20px;" @click="resetSButton">重置</el-button>
							<el-button type="primary" @click="findOrder">查询</el-button>
							<el-button type="success" round style="float: right;margin-right: 180px;" icon="el-icon-download" @click="downloadReport">下载当前报表</el-button>
                    	</div>
                    	<!--table1是汇总-->
                    	<div class="table-scrollable">
                    		<el-table :data="totalTable" :row-class-name="tableRowClassName">
                    			<el-table-column prop="" label=""> </el-table-column>
							    <el-table-column prop="totalAmount" label="总营业额(元)"> </el-table-column>
							    <el-table-column prop="finalAmount" label="总现金收入(元)"> </el-table-column>
							    <el-table-column prop="usePoint" label="总积分收入(积分)" ></el-table-column>
							    <el-table-column prop="profit" label="总利润(元)"> </el-table-column>
							    <el-table-column prop="count" label="总订单数(笔)"></el-table-column>
							    <el-table-column prop="givePoint" label="总赠送(积分)"></el-table-column>
						    </el-table>
                    	</div>
                    	<div class="table-scrollable">
                    		<!--table2是详情-->
						    <el-table :data="dailyTable" border show-summary :summary-method="getSummaries">
                    			<el-table-column prop="createTime" label="时间"> </el-table-column>
							    <el-table-column prop="totalAmount" label="营业额(元)"> </el-table-column>
							    <el-table-column prop="finalAmount" label="现金收入(元)"> </el-table-column>
							    <el-table-column prop="usePoint" label="积分收入(积分)" ></el-table-column>
							    <el-table-column prop="profit" label="利润(元)"> </el-table-column>
							    <el-table-column prop="count" label="订单数(笔)"></el-table-column>
							    <el-table-column prop="givePoint" label="赠送(积分)"></el-table-column>
						    </el-table>
						    <el-pagination
							      @size-change="handleSizeChange"
							      @current-change="handleCurrentChange"
							      :current-page="currentPage"
							      :page-sizes="[10, 20, 50]"
							      :page-size="pageSize"
							      layout="total, sizes, prev, pager, next, jumper"
							      :total="total"
								  v-if="total">
						    </el-pagination>
                		</div>
                    </div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import breadcrumb from '@/components/tool/breadcrumb' //面包屑

export default{
	name: 'orderList',
    components: {
        'v-breadcrumb': breadcrumb
    },
    data () {
    	return {
    		options:[
        		{ value: 'a',label: '全部'},
        		{ value: '0',label: '未完成'},
	      		{ value: '1',label: '已完成'},
        	],
        	timeVal: '',//time对象
        	typeVal: 'a',//查询类型
        	totalTable:[],//总的列表
        	dailyTable:[],//查询列表
        	sumTable:[],//合计列表
        	total: null,//总数
        	currentPage:1,//当前页数
        	pageSize:10,//每页数目
        	startTime: null,//商品添加时间
        	endTime: null,//商品结束时间
    	}
    },
    mounted(){
    	this.$nextTick(function() {
        	this.findOrder();
        });
    },
    methods:{
    	tableRowClassName({row, rowIndex}) {
		    if (rowIndex == 0) {
		      return ' success-row  other';
		    }
		    return '';
	    },
	    //分页-每页条数
	    handleSizeChange(_pageSize) {
	        this.pageSize = _pageSize;
	        this.findOrder();
	    },
	    //分页-当前页数
	    handleCurrentChange(_currentPage) {
	       this.currentPage = _currentPage;
	       this.findOrder();
	    },
	    //查询按钮
	    findOrder(){
	    	var params = {
				token: this.token,
				//参数(必填)
				pageIndex: this.currentPage,
				pageSize: this.pageSize
			}
	    	//查询时间条件
			if(this.timeVal){
    			this.startTime = this.timeVal[0];
    			this.endTime = this.timeVal[1];
			}else{
    			this.startTime = null;
    			this.endTime = null;
			}
			if(this.startTime && this.endTime){
				params.startTime = this.startTime;
				params.endTime = this.endTime;
			}
			//查询类型
			if(this.typeVal != 'a'){
				params.state = this.typeVal;
			}
			var that = this;
			var reqUrl = this.baseUrl + '/report/order/findOrder';
			this.$http.get(reqUrl, {params: params}).then((res) => {
				if(!res) {
					return;
				}
				that.total = res.totalCount;
				that.totalTable= res.allStatList;
				that.dailyTable=res.list;
				if (res.statList[0] == null) {
					that.sumTable = [];
				}else{
					that.sumTable = res.statList[0];
				}
			})
	    },
	    //总计
	    getSummaries(param){
	    	const { columns, data } = param;
    		const sums = [];
    		columns.forEach((column, index) => {
		        sums[0] = '总计';
		        sums[1]=this.sumTable.totalAmount; //营业额
		        sums[2]=this.sumTable.finalAmount;//现金收入
		        sums[3]=this.sumTable.usePoint;//积分收入
		        sums[4]=this.sumTable.profit;//利润
		        sums[5]=this.sumTable.count;//订单数
		        sums[6]=this.sumTable.givePoint;//赠送
    		})
    		return sums;
	    },
	    //重置按钮
	    resetSButton(){
	    		this.typeVal = 'a';
	    		this.timeVal='';
	    		this.pageSize=10;
	    		this.currentPage=1;
				var params = {
				token: this.token,
				//参数(必填)
				pageIndex: this.currentPage,
				pageSize: this.pageSize
			}
			var that = this;
			var reqUrl = this.baseUrl + '/report/order/findOrder';
			this.$http.get(reqUrl, {params: params}).then((res) => {
				if(!res) {
					return;
				}
				that.total = res.totalCount;
				that.totalTable= res.allStatList;
				that.dailyTable=res.list;
				that.sumTable = res.statList[0];
			})
	    },
	     //下载按钮
	    downloadReport() {
	    	var downloadUrl = this.baseUrl + '/report/exportOrder/exportOrder'+'?';
	    	downloadUrl = downloadUrl +'token='+this.token;
	    	downloadUrl += '&'+'pageIndex='+this.currentPage;
	    	downloadUrl += '&'+'pageSize='+this.pageSize;
	    	//查询时间条件
			if(this.timeVal){
    			this.startTime = this.timeVal[0];
    			this.endTime = this.timeVal[1];
    			if(this.startTime && this.endTime){
    				downloadUrl += '&'+'startTime='+this.startTime;
    				downloadUrl += '&'+'endTime='+this.endTime;
				}
			}
			//收支类型
			if(this.typeVal != 'a'){
				downloadUrl += '&'+'state='+this.typeVal;
			}
			downloadUrl += '&'+'download=1';
			window.open(downloadUrl);
	    }
    }
}
</script>

<style>
.el-table .success-row.other {
    background: #f0f9eb;
  }
</style>