<!-- 
    代理商资金状况表
-->
<template>
    <div class="agentFund">
    	<v-breadcrumb firstMenu="财务管理" secondMenu="代理商资金状况表"></v-breadcrumb>
    	<div class="nav">
    		<div class="col-md-12">
    			<div class="portlet box blue">
    				<div class="portlet-title">
						<div class="caption">代理商资金状况表</div>
					</div>
					<div class="portlet-body">
						<div class="operate">
							<v-selectCompany v-on:_returnResult="_getSelectCompany"></v-selectCompany>
							<span class="spanLeft">范围：</span>
							<el-select v-model="inquire.self" placeholder="请选择" class="ml10">
							    <el-option v-for="item in self"
							      :key="item.value" :label="item.label" :value="item.value">
							    </el-option>
							</el-select>
						</div>
						<div class="operate">
							<span>选择时间：</span>
						    <el-date-picker v-model="selectDate" type="daterange" start-placeholder="开始日期"
                        		 end-placeholder="结束日期" value-format="yyyy-MM-dd" @change="datePicker"
                        		 :picker-options="pickerOptions0"></el-date-picker>	
						    <span class="spanLeft">代理商帐号：</span>
						    <div class="input-medium input-inline">
						    	<el-input
								  placeholder="请输入代理商帐号"
								  v-model="inquire.phone"
								  clearable>
								</el-input>
						    </div>
							<span class="spanLeft">代理商名称：</span>
							<div class="input-medium input-inline">
								<el-input
								  placeholder="请输入代理商名称"
								  v-model="inquire.name"
								  clearable>
								</el-input>
							</div>
							<button type="button" class="btn btn-success" @click="handleFind">查询</button>
							<button type="button" class="btn btn-primary" @click="handleExport">导出</button>
						</div>
						<div class="table-scrollable">
							<el-table :data="tableData" border show-summary :summary-method="getSummaries">
								<el-table-column prop="company_name" label="名称"> </el-table-column>
								<el-table-column prop="phone" label="账号"> </el-table-column>
								<el-table-column prop="levelStr" label="级别"> </el-table-column>
								<el-table-column prop="parent_company_name" label="所属上级"> </el-table-column>
								<el-table-column prop="balance" label="当前权益"> </el-table-column>
							    <el-table-column prop="turnover" label="营业额"> </el-table-column>
							    <el-table-column prop="profit" label="盈亏"> </el-table-column>
							    <el-table-column prop="serviceAmount" label="服务费"> </el-table-column>
							    <el-table-column prop="serviceAmount1" label="服务费收益"> </el-table-column>
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
import selectCompany from '@/components/tool/selectCompany' // 4级联动	
export default {
    name: 'agentFund', // 结构名称
    data() {
        return {
            // 数据模型
            self:[
            	{ value: true,label: '查自身'},
        		{ value: false,label: '查下属'}
            ],//范围
            selectDate: null,
            inquire:{"self": true,startTime: '',endTime: '',selectedId: '',phone: '',name: '' },//查询条件
            tableData:[],//列表数据
            total: 0,//列表总数
        	pageNum:1,//当前页数
            sumTable:{},//列表合计
          	pickerOptions0: {
          		disabledDate(time) {
            		return time.getTime() > Date.now() - 8.64e7;
          		}
        	} 
        }
    },
    components:{
    	'v-breadcrumb': breadcrumb,
    	'v-selectCompany': selectCompany
    },
    created() {
    	this.inquire.selectedId = this.userInfo.id
    },
    mounted() {
        this.$nextTick(function() {
        });
    },
    destroyed() {
    },
    methods: {
    	// 获取四级联动的值
        _getSelectCompany(_val) {
            for (var _key in _val) {
            	if (_val[_key] != null) { 
            		this.inquire.selectedId = _val[_key] 
            	}
            }
        },
    	// 日期选择器
        datePicker() {
            if (this.selectDate) {
                this.inquire.startTime = this.selectDate[0];
                this.inquire.endTime = this.selectDate[1];
            } else {
                this.inquire.startTime = null;
                this.inquire.endTime = null;
            }
        },
		//获取代理商资金状况
		getList() {
			if(this.inquire.selectedId == '') {
				this.$message('请选择范围');
				return;
			}
			if(this.selectDate == null) {
				this.$message('请选择时间');
				return;
			}
			var that = this,
				reqUrl = this.baseUrl + '/erp/report/proxyTotalAmountPage',
				params = {
					pageNum: this.pageNum,
					pageSize: this.pageSize,
					self: this.inquire.self,
					userId: this.inquire.selectedId,
					startDate: this.inquire.startTime,
					endDate: this.inquire.endTime
				};
			if(this.inquire.phone != '') {
				params.phone = this.inquire.phone; //代理商代码
			}
			if(this.inquire.name != '') {
				params.name = this.inquire.name; //代理商名称
			}
			this.$http.get(reqUrl, {params: params}).then(function(res) {
				if(!res) {
					return;
				}
				that.total = res.list.total;
				that.tableData = res.list.list;
				that.sumTable = { 
					'balance': res.balance,
					'serviceAmount': res.service,
					'serviceAmount1': res.service1,
					'turnover': res.turnover,
					'profit': res.profit
				}
			})

		},
		handleFind() {
			this.pageNum = 1;
			this.getList();
		},
        //分页-当前页面
        handlePaging(_pageNum) {
    		this.pageNum = _pageNum;
			this.getList();
    	},
        //列表总计
        getSummaries(param){
	    	const { columns, data } = param;
    		const sums = [];
    		var that = this;
    		columns.forEach(function(column, index) {
		        sums[0] = '合计1';
		        sums[4] = that.sumTable.balance;//当前权益
		        sums[6] = that.sumTable.profit;//盈亏 
		        sums[5] = that.sumTable.turnover;//营业额 
          		sums[7] = that.sumTable.serviceAmount;//服务费 
          		sums[8] = that.sumTable.serviceAmount1;//服务费收益  
    		})
    		return sums;
	    },
	    //导出
	    handleExport() {
	    	if(this.inquire.selectedId == '') {
				this.$message('请选择范围');
				return;
			}
			if(this.selectDate == null) {
				this.$message('请选择时间');
				return;
			}
	    	var downloadUrl = this.baseUrl + '/erp/report/proxyTotalAmount/export?' 
	    		+ 'token=' + this.token + '&self=' + this.inquire.self + '&userId=' + this.inquire.selectedId
	    		+ '&startDate=' + this.inquire.startTime + '&endDate=' + this.inquire.endTime;
	    		
	    	if(this.inquire.phone != '') {
				downloadUrl = downloadUrl + '&phone=' + this.inquire.phone; //代理商代码
			}
			if(this.inquire.name != '') {
				var reg = new RegExp("[\\u4E00-\\u9FFF]+", "g");
                if (reg.test(this.inquire.name)) {
                    downloadUrl = downloadUrl + '&name=' + encodeURI(encodeURI(this.inquire.name));
                }
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