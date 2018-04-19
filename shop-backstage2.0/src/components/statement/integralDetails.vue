<template>
	<div class="integralDetails">
		<v-breadcrumb firstMenu="报表" secondMenu="积分明细查询"></v-breadcrumb>
		<div class="nav row">
			<div class="col-md-12">
				<div class="portlet box red">
					<div class="portlet-title">
                        <div class="caption">积分明细查询</div>
                    </div>
                    <div class="portlet-body">
                    	<div class="operate">
                    		<span class="demonstration">选择时间：</span>
							<el-date-picker v-model="timeVal" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" ></el-date-picker>
							<span style="margin-left: 30px;">收支：</span>
							<el-select v-model="budgetVal" placeholder="请选择" class="ml10">
							    <el-option v-for="item in budget"
							      :key="item.value" :label="item.label" :value="item.value">
							    </el-option>
							</el-select>
							<span style="margin-left: 30px;">选择类型：</span>
							<el-select v-model="typeVal" placeholder="请选择" class="ml10">
							    <el-option v-for="item in options"
							      :key="item.value" :label="item.label" :value="item.value">
							    </el-option>
							</el-select>
							
                    	</div>
                    	<div class="operate">
                    		<span>用户手机号：</span><input type="text" v-model="userPhone" class="form-control input-inline" placeholder="必填"  maxlength="11" onkeyup="value=value.replace(/[^\d]/g,'')" />
                    		<el-button type="info" style="margin-left: 100px;" @click="resetSButton">重置</el-button>
							<el-button type="primary" @click="findPointDetail">查询</el-button>
							<el-button type="success" round style="float: right;margin-right: 180px;" icon="el-icon-download" @click="downloadReport">下载当前报表</el-button>
                    	</div>
                    	<div class="table-scrollable">
						    <el-table :data="tableData" border show-summary :summary-method="getSummaries">
                    			<el-table-column prop="" label="交易时间">
                    				<template slot-scope="scope">
                    					<span>{{formatDate(scope.row.trade_time,'time')}}</span>
                    				</template>
                    			</el-table-column>
							    <el-table-column prop="" label="交易类型 ">
							    	<template slot-scope="scope">
							    		<span v-if="scope.row.point_type == 1">订单交易</span>
							    		<span v-if="scope.row.point_type == 2">邀请奖励</span>
							    		<span v-if="scope.row.point_type == 3">积分抽奖</span>
							    		<span v-if="scope.row.point_type == 4">抽奖获取</span>
							    		<span v-if="scope.row.point_type == 5">积分兑换</span>
							    		<span v-if="scope.row.point_type == 6">售后退回</span>
							    	</template>
							    </el-table-column>
							    <el-table-column prop="" label="收支类型">
							    	<template slot-scope="scope">
							    		<span v-if="scope.row.type == 1">收入</span>
							    		<span v-if="scope.row.type == 2">支出</span>
							    	</template>
							    </el-table-column>
							    <el-table-column prop="transaction_number" label="积分交易额"></el-table-column>
							    <el-table-column prop="remaining_number" label="积分剩余"></el-table-column>
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
	name: 'integralDetails',
    components: {
        'v-breadcrumb': breadcrumb
    },
    data () {
    	return {
    		budget:[
    			{ value: '0',label: '全部'},
        		{ value: '1',label: '收入'},
	      		{ value: '2',label: '支出'},
    		],
    		options:[
        		{ value: '0',label: '全部'},
        		{ value: '1',label: '订单交易'},
	      		{ value: '2',label: '邀请奖励'},
	      		{ value: '3',label: '积分抽奖'},
	      		{ value: '4',label: '抽奖获取'},
	      		{ value: '5',label: '积分兑换'},
	      		{ value: '6',label: '售后退回'}
        	],
        	timeVal: '',//time对象
        	typeVal: '0',//查询类型
        	budgetVal:'0',//查询收支类型
        	clickVal:'',//
        	tableData:[],//列表
        	incomeTable:[],//总计收入
        	expenseTable:[],//总计支出
        	total: null,//总数
        	currentPage:1,//当前页数
        	pageSize:10,//每页数目
        	userPhone:'',//用户手机号
        	startTime: null,//商品添加时间
        	endTime: null,//商品结束时间
    	}
    },
    mounted(){
    	this.$nextTick(function() {
        	
        });
    },
    methods:{
    	tableRowClassName({row, rowIndex}) {
		    if (rowIndex == 0) {
		      return 'success-row';
		    }
		    return '';
	    },
	    //分页-每页条数
	    handleSizeChange(_pageSize) {
	        this.pageSize = _pageSize;
	         	 this.findPointDetail();
	    },
	    //分页-当前页数
	    handleCurrentChange(_currentPage) {
	       this.currentPage = _currentPage;
	       this.findPointDetail();
	    },
	    //查询按钮
	    findPointDetail(){
	    	this.clickVal = this.budgetVal;
	    	//手机号
			if(!this.userPhone){
				this.$message({
			          	message: '请输入正确手机号！',
			          	type: 'warning'
        			});
        			return;
			}
			if(this.userPhone.length != '11'){
				this.$message({
			          	message: '请输入正确手机号！',
			          	type: 'warning'
        			});
        			return;
			}
	    	var params = {
				token: this.token,
				//参数(必填)
				currentPage: this.currentPage,
				pageSize: this.pageSize,
				phone:this.userPhone
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
			//收支类型
			if(this.budgetVal != 0){
				params.type = this.budgetVal;
			}
			//查询类型
			if(this.typeVal != 0){
				params.state = this.typeVal;
			}
			
			var that = this;
			var reqUrl = this.baseUrl + '/report/point/findPointDetail';
			this.$http.get(reqUrl, {params: params}).then((res) => {
				if(!res) {
					return;
				}
				that.total = res.totalCount;
				that.tableData = res.list;
				for(var i=0;i<res.statList.length;i++){
					if(res.statList[i].pointType == 1){
						that.incomeTable = res.statList[i].transactionNumber
					}
					if(res.statList[i].pointType == 2){
						that.expenseTable = res.statList[i].transactionNumber
					}
				}
			})
	    },
	    //总计
	    getSummaries(param){
	    	const { columns, data } = param;
    		const sums = [];
    		columns.forEach((column, index) => {
		        if(this.clickVal == 1){
		        	sums[0] = '积分总和';
		        	sums[1]=''; 
		        	sums[2]='收入'; 
		        	sums[3]=this.incomeTable;//收入
		        	sums[4]='';
		        }
		        else if(this.clickVal == 2){
		        	sums[0] = '积分总和';
		        	sums[1]=''; 
		        	sums[2]='支出'; 
		        	sums[3]=this.expenseTable;//收入
		        	sums[4]='';
		        }
		        else{
		        	sums[0] = '积分总和';
			        sums[1]='收入'; 
			        sums[2]=this.incomeTable;//收入
			        sums[3]='支出';
			        sums[4]=this.expenseTable;//支出
		        }
    		})
    		return sums;
	    },
	    //重置
	    resetSButton(){
	    	this.timeVal='';
    		this.pageSize=10;
    		this.currentPage=1;
    		this.budgetVal='0';
    		this.typeVal='0';
    		this.tableData=[];
    		this.userPhone ='';
	    },
	    //下载按钮
	    downloadReport() {
	    	var downloadUrl = this.baseUrl + '/report/exportPoint/exportPointDetail'+'?';
	    	downloadUrl = downloadUrl +'token='+this.token;
	    	downloadUrl += '&'+'currentPage='+this.currentPage;
	    	downloadUrl += '&'+'pageSize='+this.pageSize;
	    	downloadUrl += '&'+'phone='+this.userPhone;
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
			if(this.budgetVal != 0){
				downloadUrl += '&'+'type='+this.budgetVal;
			}
			//查询类型
			if(this.typeVal != 0){
				downloadUrl += '&'+'state='+this.typeVal;
			}
			downloadUrl += '&'+'download=1';
			window.open(downloadUrl);
	    }
    }
}
</script>

<style scoped>
  .el-table .success-row {
    background: #f0f9eb;
  }
</style>