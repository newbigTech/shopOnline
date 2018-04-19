<!-- 提现列表 -->
<template>
    <div class="withdrawalsList">
    	<v-breadcrumb firstMenu="提现" secondMenu="提现管理"></v-breadcrumb>
    	<div class="nav row">
			<div class="col-md-12">
				<div class="portlet box red">
					<div class="portlet-title">
						<div class="caption">提现管理</div>
					</div>
					<div class="portlet-body">
						<div class="operate">
							<div class="block" style="display: inline-block;">
								<span class="demonstration">申请时间：</span>
								<el-date-picker v-model="timeVal" type="datetimerange" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" @change="pageReset"></el-date-picker>
							</div>
							<span>账户类型：</span>
							<select class="form-control input-small input-inline" v-model="accountType" @change="pageReset">
								<option value="0">全部</option>
								<option value="1">用户</option>
								<option value="2">机构</option>
							</select>
							<span>状态：</span>
							<select class="form-control input-small input-inline" v-model="state" @change="pageReset">
								<option value="0">全部</option>
								<option value="1">待处理</option>
								<option value="2">已处理</option>
								<option value="3">已退回</option>
							</select>
							<span>手机号：</span>
							<input class="form-control input-small input-inline" type="text" v-model="goodsNum" placeholder="请输入手机号" @change="pageReset" />
								
							<button type="button" class="btn btn-success" @click="findWithdrawRecord()">查询</button>
							<button type="button" class="btn btn-success" @click="resetBtn">重置</button>
							<button type="button" class="btn btn-success" @click="exportExcel">导出</button>
						</div>
						<div class="table-scrollable">
							<el-table :data="goodsRecord">
								<el-table-column prop="phone" label="手机号"></el-table-column>
								<el-table-column prop="companyName" label="机构名称"> </el-table-column>
								<el-table-column prop="realName" label="持卡人姓名"> </el-table-column>
								<el-table-column prop="createTime" label="申请时间" width="110"> </el-table-column>
								<el-table-column prop="withdrawAmount" label="提现金额(元)"> </el-table-column>
								<el-table-column prop="bankName" label="银行名称"> </el-table-column>
								<el-table-column prop="bankcard" label="卡号"> </el-table-column>
								<el-table-column prop="bankPhone" label="银行预留手机"> </el-table-column>
								<el-table-column label="账户类型"> 
									<template slot-scope="scope">
										<span v-if="scope.row.accountType == 1">用户</span>
										<span v-else>机构</span>
									</template>
								</el-table-column>
								<el-table-column label="状态">
									<template slot-scope="scope">
										<span v-if="scope.row.state == 1">待处理</span>
										<span v-else-if="scope.row.state == 2">已处理</span>
										<span v-else>已退回</span>
									</template>
									
								</el-table-column>
								<el-table-column prop="" label="操作">
									<template slot-scope="scope">
										<template v-if="scope.row.state == 1">
											<span class="btn default btn-xs purple" @click="handleTurn(scope.row)">转账</span>
											<span class="btn default btn-xs red" @click="handleReturn(scope.row)">退回</span>
										</template>
										<template v-else-if="scope.row.state == 3">
											<span class="btn default btn-xs blue" @click="handleLook(scope.row)">查看</span>
										</template> 
										<template v-else>
											
										</template> 
									</template>
								</el-table-column>
							</el-table>
							<el-pagination layout="prev, pager, next" v-if="total > pageSize"
			    			:page-size="pageSize" :current-page="currentPage" :total="total"
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
    name: 'withdrawalsList', // 提现列表
    components: {
		'v-breadcrumb': breadcrumb
	},
    data() {
        return {
        	accountType: 0, //账户类型
        	state:0,//状态
        	timeVal: '', //time对象
        	goodsNum:null,//查询用户手机号
        	startTime: '',//商品添加时间
        	endTime: '',//商品结束时间
        	goodsRecord: [],//列表
        	total:null,//列表总数
        	currentPage:1,//当前页面
        	resetVal:false,//是否需要重置页面
        }
    },
    created() {
    	
    },
    mounted() {
        this.$nextTick(function() {
        	this.findWithdrawRecord();
        });
    },
    destroyed() {
    	
    },
    methods: {
    	//日期选择器
    	datePicker() {
    		if(this.timeVal){
    			this.startTime = this.timeVal[0];
    			this.endTime = this.timeVal[1];
    		}else{
    			this.startTime = null;
    			this.endTime = null;
    		}
    	},
    	//转账
    	handleTurn(item) {
    		var that = this;
    		this.$confirm('确定"转账"操作吗？').then(function() {
//				var reqUrl = that.baseUrl + '/trans/updateTransFeraccounts';
				var reqUrl = that.baseUrl + '/back/withdrawals/launch',
					params = {
						customerCode: item.customerCode,
						//参数(必填)
						serialNumber:item.serialNumber,
					}
				that.$http.post(reqUrl, params).then(function(res) {
					if (!res) { return; }
					that.$message({
		            	type: 'success',
		           	 	message: '转账成功' 
		          	});   
		          	that.findWithdrawRecord();
				})
    		}).catch(function() {
	        	that.$message({
		            type: 'info',
		            message: '已取消操作'
	          	});   
	        })
    	},
    	//退回
    	handleReturn(item) {
        	var that = this;
    		this.$prompt('退回原因(必填)', {
	          confirmButtonText: '确定',
	          cancelButtonText: '取消',
	          inputPattern:/\S{1,}/,
	          inputErrorMessage: '请填写退回原因'
	        }).then(function({ value }) {
				var reqUrl = that.baseUrl + '/withdraw/returnWithdraw';
				var params = {
					token: that.token,
					//参数(必填)
					serialNumber:item.serialNumber,
					rejectReason:value
				}
				that.$http.post(reqUrl, params).then((res) => {
					if (!res) {
						return;
					}
					that.$message({
		            	type: 'success',
		           	 	message: '退回成功' 
		          	});   
		          	that.findWithdrawRecord();
				});
	        }).catch(function() {
	        	that.$message({
	            type: 'info',
	            message: '已取消操作'
	          });   
	        })
    	},
    	//查看退回原因
    	handleLook(item) {
    		var that = this;
			var reqUrl = this.baseUrl + '/withdraw/findReturnReason';
			var params = {
				token: that.token,
				//参数(必填)
				serialNumber:item.serialNumber,
			}
			this.$http.get(reqUrl, {params:params}).then((res) => {
				if (!res) {
					return;
				}
				var str = res.rejectReason;
		    	this.$alert(str, '退款原因', {confirmButtonText: '我知道了'})
		    	.then(function() {
		    		
		    	})
			})
    		
    	},
    	//分页
    	handlePaging: function(_currentPage) {
    		this.currentPage = _currentPage;
			this.findWithdrawRecord();
    	},
    	//改变状态时从头开始查询
    	pageReset() {
    		this.resetVal = true;
    	},
    	//查询提现列表
    	findWithdrawRecord() {
    		if (this.resetVal == true) {
    			this.currentPage = 1;
    			this.resetVal = false;
    		}
    		var params = {
				//参数(必填)
				pageNum: this.currentPage,
				pageSize: this.pageSize//组件中 默认值是10
			}
    		//时间条件
    		if (this.timeVal) {
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
			//类型条件
    		if(this.accountType != 0){
    			params.accountType = this.accountType;
    		}
    		//状态条件
    		if (this.state != 0) {
    			params.state = this.state;
    		}
    		//手机号
    		if (this.goodsNum) {
    			params.phone = this.goodsNum;
    		}
    		var that = this;
			var reqUrl = this.baseUrl + '/withdraw/findWithdrawDetails';
			this.$http.get(reqUrl, {params: params}).then(function(res) {
				if(!res) {
					return;
				}
				that.total=res.total;
				var tableData=res.wList;			
				for(var i=0;i<tableData.length;i++){
				   	var creatTime=tableData[i].createTime;
				   	tableData[i].createTime = that.formatDate(creatTime,'time');
				}
				that.goodsRecord = tableData;
			})
    	},
    	//重置
    	resetBtn() {
    		this.timeVal = '';
    		this.accountType = 0;
    		this.state = 0;
    		this.goodsNum = null;
    		this.currentPage = 1;
    		this.findWithdrawRecord();
    	},
    	//导出Excel
    	exportExcel() {
    		var downloadUrl = this.baseUrl + '/withdraw/exportWithdrawInfo'+'?';
//			var downloadUrl =  'http://192.168.1.252:8080/withdraw/exportWithdrawInfo'+'?';
	    	downloadUrl = downloadUrl +'token='+this.token;
	    	//查询时间条件
			if(this.timeVal){
    			this.startTime = this.timeVal[0];
    			this.endTime = this.timeVal[1];
    			if(this.startTime && this.endTime){
    				downloadUrl += '&'+'beginTime='+this.startTime;
    				downloadUrl += '&'+'endTime='+this.endTime;
				}
			}
			//类型条件
    		if(this.accountType != 0){
    			downloadUrl += '&'+'accountType='+this.accountType;
    		}
    		//状态条件
    		if (this.state != 0) {
    			downloadUrl += '&'+'state='+this.state;
    		}
    		//手机号
    		if (this.goodsNum) {
    			downloadUrl += '&'+'phone='+this.goodsNum;
    		}
    		downloadUrl += '&'+'download=1';
    		window.open(downloadUrl);
    	},
    }

}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style scoped>

</style>
