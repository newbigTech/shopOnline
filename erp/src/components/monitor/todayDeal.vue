<!-- 用户当日成交监控 -->
<template>
    <div class="todayDeal">
    	<v-breadcrumb firstMenu="实时监控" secondMenu="用户当日成交监控"></v-breadcrumb>
    	<div class="nav">
    		<div class="col-md-12">
    			<div class="portlet box blue">
					<div class="portlet-title">
						<div class="caption">用户当日成交监控</div>
					</div>
					<div class="portlet-body">
						<div class="operate">
							<!--<span>商品：</span>
							<select class="form-control input-small input-inline" v-model="proId">
								<option value="0">商品一</option>
								<option value="1">商品二</option>
								<option value="2">商品三</option>
							</select>-->
							<span>手机号：</span>
							<div class="input-medium input-inline">
								<el-input placeholder="请输入手机号" v-model="phone" clearable></el-input>
							</div>
							<span>结算模式：</span>
							<div class="input-medium input-inline">
								<el-select v-model="upWay" clearable>
									<el-option value="" key="" label="全部" ></el-option>
									<el-option value="0" key="0" label="未升级" ></el-option>
									<el-option value="1" key="1" label="拆红包" ></el-option>
									<el-option value="2" key="2" label="猜奇偶" ></el-option>
								</el-select>
							</div>
							<span>升级结果：</span>
							<div class="input-medium input-inline">
								<el-select v-model="promotionResult" clearable>
									<el-option value="" key="" label="全部" ></el-option>
									<el-option value="0" key="0" label="未升级" ></el-option>
									<el-option value="1" key="1" label="小升级" ></el-option>
									<el-option value="2" key="2" label="大升级" ></el-option>
								</el-select>
							</div>
							<span>订单类型：</span>
							<div class="input-medium input-inline">
								<el-select v-model="orderType" clearable>
									<el-option value="" key="" label="全部" ></el-option>
									<el-option value="ordinary" key="ordinary" label="普通" ></el-option>
                                    <el-option value="promotion" key="promotion" label="升级" ></el-option>
									<el-option value="appreciation" key="appreciation" label="增值" ></el-option>
								</el-select>
							</div>
							<button type="button" class="btn btn-success" @click="handleFind">查询</button>
							<button type="button" class="btn btn-primary" @click="handleExport">导出</button>
						</div>
						<div class="table-scrollable">
							<el-table :data="tableData">
								<el-table-column prop="phone" label="用户手机号"> </el-table-column>
								<el-table-column prop="true_name" label="用户姓名"></el-table-column>
								<el-table-column prop="pro_id" label="商品ID"> </el-table-column>
								<el-table-column prop="pro_name" label="商品名称"> </el-table-column>
								<el-table-column prop="order_type" label="订单类型">
                                    <template slot-scope="scope">
										<span v-if="scope.row.order_type == 'ordinary'">普通订单</span>
                                        <span v-if="scope.row.order_type == '1'">升级订单</span>
                                        <span v-if="scope.row.order_type == '2'">增值订单</span>
									</template>
								</el-table-column>
								<el-table-column prop="jiou" label="升级选择">
									<template slot-scope="scope">
										<template v-if="scope.row.up_way == '2'">
											<span v-if="scope.row.jiou == '-1'">未参与</span>
											<span v-if="scope.row.jiou == '0'">偶数</span>
											<span v-if="scope.row.jiou == '1'">奇数</span>
										</template>
									</template>
								</el-table-column>
								<el-table-column prop="count" label="数量(件)"> </el-table-column>
								<el-table-column prop="product_price" label="商品单价(元)"> </el-table-column>
								<el-table-column prop="promotion_result" label="升级结果">
									<template slot-scope="scope">
										<span v-if="scope.row.promotion_result == '0'">未升级</span>
										<span v-if="scope.row.promotion_result == '1'">小升级</span>
										<span v-if="scope.row.promotion_result == '2'">大升级</span>
										<span v-if="scope.row.promotion_result == '3'">升级中</span>
									</template>
								</el-table-column>
								<el-table-column prop="create_time" label="时间"></el-table-column>
								<el-table-column prop="service_amount" label="服务费"> </el-table-column>
								<el-table-column prop="issue_num" label="所属期号">
									<template slot-scope="scope">
										<span v-if="scope.row.up_way == '2'">{{scope.row.issue_num}}</span>
									</template>
								</el-table-column>
								<el-table-column prop="up_way" label="结算模式">
									<template slot-scope="scope">
										<span v-if="scope.row.up_way == '0'">未升级</span>
										<span v-if="scope.row.up_way == '1'">拆红包</span>
										<span v-if="scope.row.up_way == '2'">猜奇偶</span>
									</template>
								</el-table-column>
							</el-table>
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
    name: 'todayDeal', // 用户当日成交监控
    components: {
        'v-breadcrumb': breadcrumb
    },
    data() {
        return {
        	phone: '',//查询条件-手机号
        	upWay: '',//查询条件-结算模式
        	promotionResult: '',//查询条件-升级结果
        	orderType: '',//查询条件-订单类型
            tableData: [],
            total: 0,//总数
			pageNum: 1,//当前页数
        }
    },
    created() {
    },
    mounted() {
        this.$nextTick(function() {
        	this.getList();
        });
    },
    methods: {
    	//获取用户当日成交监控
    	getList() {
    		var that = this,
    			reqUrl = this.baseUrl + '/erp/report/findTransactionToday',
    			params = { 
    				userId: this.userInfo.id,
    				pageSize: this.pageSize,
    				pageNum: this.pageNum
    			}
    		if(this.phone != '') {
    			if(this.phone.length != 11) { 
    				this.$message('请输入正确的手机号码');
    				return;
    			}
    			if(this.phone.length == 11) {
    				params.phone = this.phone;
    			}
    		}
    		if(this.upWay != '') {
    			params.up_way = this.upWay;
    		}
    		if(this.promotionResult != '') {
    			params.promotion_result = this.promotionResult;
    		}
    		if(this.orderType != '') {
    			params.order_type = this.orderType;
    		}
			this.$http.get(reqUrl, {params: params}).then(function(res) {
				if(!res) {
					return;
				}
				that.tableData = res.list.list;
				that.total = res.list.total;
			})
    	},
    	//条件查询
    	handleFind() {
    		this.pageNum = 1;
    		this.getList();
    	},
    	//分页查询
    	handlePaging(currPage) {
    		this.pageNum = currPage;
    		this.getList();
    	},
    	//导出
    	handleExport() {
    		var downloadUrl = this.baseUrl + '/erp/report/findTransactionToday/export?' 
    						+ 'token=' + this.token + '&pageNum=' + this.pageNum
    						+ '&pageSize=' + this.pageSize + '&userId=' + this.userInfo.id;
    		if(this.phone != '') {
    			if(this.phone.length != 11) { 
    				this.$message('请输入正确的手机号码');
    				return;
    			}
    			if(this.phone.length == 11) {
    				downloadUrl = downloadUrl + '&phone=' + this.phone;
    			}
    		}
    		if(this.upWay != '') {
    			downloadUrl = downloadUrl + '&up_way=' + this.upWay;
    		}
    		if(this.promotionResult != '') {
    			downloadUrl = downloadUrl + '&promotion_result=' + this.promotionResult;
    		}
    		if(this.orderType != '') {
    			downloadUrl = downloadUrl + '&order_type=' + this.orderType;
    		}
			window.open(downloadUrl);
    	}
    }

}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style scoped>
.data-table tr td {
	padding: 20px 10px;
}
.data-table tr td:nth-child(1) {
	width: 200px;
	text-align: right;
}
</style>
