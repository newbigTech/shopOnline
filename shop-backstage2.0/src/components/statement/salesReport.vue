<template>
	<div class="salesReport">
		<v-breadcrumb firstMenu="报表" secondMenu="售后"></v-breadcrumb>
		<div class="nav row">
			<div class="col-md-12">
				<div class="portlet box red">
					<div class="portlet-title">
                        <div class="caption">售后数据</div>
                    </div>
                    <div class="portlet-body">
                    	<div class="operate">
                    		<span class="demonstration">选择时间：</span>
							<el-date-picker v-model="timeVal" type="datetimerange" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" ></el-date-picker>
							<span>选择类型：</span>
							<el-select v-model="typeVal" placeholder="请选择" class="ml10">
							    <el-option v-for="item in options"
							      :key="item.value" :label="item.label" :value="item.value">
							    </el-option>
							</el-select>
							<el-button type="info" style="margin-left: 20px;">重置</el-button>
							<el-button type="primary" @click="findExchangeList">查询</el-button>
                    	</div>
                    	<!--table1是汇总-->
                    	<div class="table-scrollable">
                    		<el-table :data="totalTable" :row-class-name="tableRowClassName">
                    			<el-table-column prop="" label=""> </el-table-column>
							    <el-table-column prop="" label="总营业额(元)"> </el-table-column>
							    <el-table-column prop="" label="总现金收入(元)"> </el-table-column>
							    <el-table-column prop="" label="总积分收入(积分)" ></el-table-column>
							    <el-table-column prop="" label="总利润(元)"> </el-table-column>
							    <el-table-column prop="" label="总订单数(笔)"></el-table-column>
							    <el-table-column prop="" label="总赠送(积分)"></el-table-column>
						    </el-table>
                    	</div>
                    	<div class="table-scrollable">
                    		<!--table2是详情-->
						    <el-table :data="dailyTable" border show-summary>
                    			<el-table-column prop="" label="时间"> </el-table-column>
							    <el-table-column prop="" label="营业额(元)"> </el-table-column>
							    <el-table-column prop="" label="现金收入(元)"> </el-table-column>
							    <el-table-column prop="" label="积分收入(积分)" ></el-table-column>
							    <el-table-column prop="" label="利润(元)"> </el-table-column>
							    <el-table-column prop="" label="订单数(笔)"></el-table-column>
							    <el-table-column prop="" label="赠送(积分)"></el-table-column>
						    </el-table>
						    <el-pagination
							      @size-change="handleSizeChange"
							      @current-change="handleCurrentChange"
							      :current-page="currentPage"
							      :page-sizes="[10, 20, 50]"
							      :page-size="pageSize"
							      layout="total, sizes, prev, pager, next, jumper"
							      :total="total"
							      v-if="total>pageSize">
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
	name: 'salesReport',
    components: {
        'v-breadcrumb': breadcrumb
    },
    data () {
    	return {
    		options:[
        		{ value: '0',label: '全部'},
        		{ value: '1',label: '已完成'},
	      		{ value: '2',label: '未完成'},
        	],
        	timeVal: '',//time对象
        	typeVal: '0',//查询类型
        	totalTable:[],//总的列表
        	dailyTable:[],//查询列表
        	total: null,//总数
        	currentPage:1,//当前页数
        	pageSize:10,//每页数目
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
	    },
	    //分页-当前页数
	    handleCurrentChange(_currentPage) {
	       this.currentPage = _currentPage
	    },
	    //查询按钮
	    findExchangeList(){
	    	var params = {
				token: this.token,
				//参数(必填)
				pageNum: this.currentPage,
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
				params.beginTime = this.startTime;
				params.endTime = this.endTime;
			}
			//查询类型
			
			var that = this;
			var reqUrl = this.baseUrl + '';
			this.$http.get(reqUrl, {params: params}).then((res) => {
				if(!res) {
					return;
				}
			})
	    },
    }
}
</script>

<style scoped>
  .el-table .success-row {
    background: #f0f9eb;
  }
</style>