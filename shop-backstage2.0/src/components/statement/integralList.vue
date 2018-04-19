<template>
	<div class="integralList">
		<v-breadcrumb firstMenu="报表" secondMenu="积分总表"></v-breadcrumb>
		<div class="nav row">
			<div class="col-md-12">
				<div class="portlet box red">
					<div class="portlet-title">
                        <div class="caption">积分总表</div>
                    </div>
                    <div class="portlet-body">
                    	<div class="operate">
                    		<span class="demonstration">选择时间：</span>
							<el-date-picker v-model="timeVal" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" ></el-date-picker>
							<el-button type="info" style="margin-left: 100px;" @click="resetSButton">重置</el-button>
							<el-button type="primary"  @click="findPoint">查询</el-button>
							<el-button type="success" round style="float: right;margin-right: 180px;" icon="el-icon-download" @click="downloadReport">下载当前报表</el-button>
                    	</div>
                    	<!--table1是汇总-->
                    	<div class="table-scrollable">
                    		<el-table :data="totalTable" :row-class-name="tableRowClassName">
                    			<el-table-column prop="" label=""> </el-table-column>
							    <el-table-column prop="trade" label="总订单交易"> </el-table-column>
							    <el-table-column prop="invite" label="总邀请奖励"> </el-table-column>
							    <el-table-column prop="lotteryDraw" label="总积分抽奖" ></el-table-column>
							    <el-table-column prop="draw" label="总抽奖获取"> </el-table-column>
							    <el-table-column prop="exchange" label="总积分兑换"></el-table-column>
							    <el-table-column prop="goback" label="总售后退回"></el-table-column>
						    </el-table>
                    	</div>
                    	<div class="table-scrollable">
                    		<!--table2是详情-->
						    <el-table :data="dailyTable" border show-summary :summary-method="getSummaries">
                    			<el-table-column prop="tradeTime" label="时间"> </el-table-column>
							    <el-table-column prop="trade" label="订单交易"> </el-table-column>
							    <el-table-column prop="invite" label="邀请奖励"> </el-table-column>
							    <el-table-column prop="lotteryDraw" label="积分抽奖" ></el-table-column>
							    <el-table-column prop="draw" label="抽奖获取"> </el-table-column>
							    <el-table-column prop="exchange" label="积分兑换"></el-table-column>
							    <el-table-column prop="goback" label="售后退回"></el-table-column>
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
	name: 'integralList',
    components: {
        'v-breadcrumb': breadcrumb
    },
    data () {
    	return {
        	timeVal: '',//time对象
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
        	this.findPoint();
        });
    },
    methods:{
    	tableRowClassName({row, rowIndex}) {
		    if (rowIndex == 0) {
		      return 'success-row other';
		    }
		    return '';
	    },
	    //分页-每页条数
	    handleSizeChange(_pageSize) {
	        this.pageSize = _pageSize;
	        this.findPoint();
	    },
	    //分页-当前页数
	    handleCurrentChange(_currentPage) {
	       this.currentPage = _currentPage;
	       this.findPoint();
	    },
	    //查询按钮
	    findPoint(){
	    	var params = {
				token: this.token,
				//参数(必填)
				currentPage: this.currentPage,
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
			var that = this;
			var reqUrl = this.baseUrl + '/report/point/findPoint';
			this.$http.get(reqUrl, {params: params}).then((res) => {
				if(!res) {
					return;
				}
				that.total = res.totalCount;
				that.totalTable = res.pointAllStatList;
				that.dailyTable = res.list;
				that.sumTable = res.pointStatList[0];
			})
	    },
	    //总计
	    getSummaries(param){
	    	const { columns, data } = param;
    		const sums = [];
    		columns.forEach((column, index) => {
		        sums[0] = '总计';
		        sums[1]=this.sumTable.trade; //订单交易
		        sums[2]=this.sumTable.invite;//邀请奖励
		        sums[3]=this.sumTable.lotteryDraw;//积分抽奖
		        sums[4]=this.sumTable.draw;//抽奖获取
		        sums[5]=this.sumTable.exchange;//积分兑换
		        sums[6]=this.sumTable.goback;//售后退回
    		})
    		return sums;
	    },
	    //重置
	    resetSButton(){
	    	this.timeVal='';
    		this.pageSize=10;
    		this.currentPage=1;
			var params = {
				token: this.token,
				//参数(必填)
				currentPage: this.currentPage,
				pageSize: this.pageSize
			}
			var that = this;
			var reqUrl = this.baseUrl + '/report/point/findPoint';
			this.$http.get(reqUrl, {params: params}).then((res) => {
				if(!res) {
					return;
				}
				that.total = res.totalCount;
				that.totalTable = res.pointAllStatList;
				that.dailyTable = res.list;
				that.sumTable = res.pointStatList[0];
			})
	    },
	    //下载按钮
	    downloadReport() {
	    	var downloadUrl = this.baseUrl + '/report/exportPoint/exportPoint'+'?';
	    	downloadUrl = downloadUrl +'token='+this.token;
	    	downloadUrl += '&'+'currentPage='+this.currentPage;
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