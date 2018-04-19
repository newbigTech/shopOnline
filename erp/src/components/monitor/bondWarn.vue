<!-- 保证金预警监控 -->
<template>
    <div class="bondWarn">
    	<v-breadcrumb firstMenu="实时监控" secondMenu="保证金预警监控"></v-breadcrumb>
    	<div class="nav">
    		<div class="col-md-12">
    			<div class="portlet box blue">
					<div class="portlet-title">
						<div class="caption">保证金预警监控</div>
					</div>
					<div class="portlet-body">
						<div class="table-scrollable">
							<el-table :data="tableData" :row-class-name="tableRowClassName">
								<el-table-column prop="company_name" label="代理商名称"> </el-table-column>
								<!--<el-table-column prop="agentCode" label="代理商代码"></el-table-column>-->
								<el-table-column prop="id_card_name" label="负责人"> </el-table-column>
								<el-table-column prop="phone" label="手机号"> </el-table-column>
								<el-table-column prop="yesterday" label="期初权益"> </el-table-column>
								<el-table-column prop="balance" label="当前权益"> </el-table-column>
								<el-table-column prop="userAmount" label="用户余额"> </el-table-column>
								<el-table-column prop="parent_company_name" label="所属"> </el-table-column>
								<el-table-column prop="percent" label="百分比"> </el-table-column>
								<el-table-column prop="service" label="预警比例"> </el-table-column>
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
    name: 'bondWarn', // 保证金预警监控
    components: {
        'v-breadcrumb': breadcrumb
    },
    data() {
        return {
            tableData: [],
            total: 0,//总数
			pageNum: 1,//当前页数
			timer: null,//定时器
        }
    },
    created() {
    	this.judgeTime();
    },
    mounted() {
        this.$nextTick(function() {
        	this.getList();	
        });
    },
    destroyed() {
        window.clearInterval(this.timer);
    },
    methods: {
    	//获取保证金预警监控列表
    	getList() {
    		var that = this,
    			reqUrl = this.baseUrl + '/erp/report/proxyMoneyWarning',
    			params = { 
    				pageSize: this.pageSize,
    				pageNum: this.pageNum
    			}
			this.$http.get(reqUrl, {params: params}).then(function(res) {
				if(!res) {
					return;
				}
				that.tableData = res.list;
				that.total = res.total;
			})
    	},
    	handlePaging(currPage) {
    		this.pageNum = currPage;
    		this.getList();
    	},
    	judgeTime() {
			//获取当期时分秒的毫秒数
	    	var d = new Date(),
	    		h = d.getHours(),
	    		m = d.getMinutes(),
	    		s = d.getSeconds(),
	    		currTime = (h * 60 * 60 * 1000) + (m * 60 * 1000) + (s * 1000);
	    	
	    	//两点到十点不请求
	    	var time1 = 2 * 60 * 60 * 1000;
	    	var time2 = 10 * 60 * 60 * 1000;
	    	if(currTime > time1 && currTime < time2) {
	    		return;
	    	}
	    	this.refreshData();
    	},
    	//一分钟更新一次。24小时制，02:00停止刷新，10:00开始刷新。
    	refreshData() {
    		var that = this;
    		this.timer = setInterval(function() {
    			that.getList();
    		}, 60000);
    	},
    	tableRowClassName({row, rowIndex}) {
            // 1: 百分比 < 预警比例 标红显示
            // 2: 百分比 >= 预警比例 标准显示
    		if(row.percent < row.service) {
          		return 'red-row';
        	}
            return '';
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
