<!-- 
    用户交易明细
-->
<template>
    <div class="userFundDetails">
    	<v-breadcrumb firstMenu="财务管理" secondMenu="用户交易明细"></v-breadcrumb>
    	<div class="nav">
    		<div class="col-md-12">
    			<div class="portlet box blue">
    				<div class="portlet-title">
						<div class="caption">用户交易明细</div>
					</div>
					<div class="portlet-body">
						<div class="operate">
							<v-selectCompany v-on:_returnResult="_getSelectCompany"></v-selectCompany>
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
						    <span>类别：</span>
						    <el-select v-model="inquire.type" placeholder="请选择" class="ml10" @change="pageResetAll" :disabled="selectOff.all">
							    <el-option v-for="item in type"
							      :key="item.value" :label="item.label" :value="item.value">
							    </el-option>
							</el-select>
							<span class="spanLeft">来源：</span>
							<el-select v-model="inquire.source" placeholder="请选择" class="ml10" @change="pageReset">
							    <el-option v-for="item in source"
							      :key="item.value" :label="item.label" :value="item.value">
							    </el-option>
							</el-select>
							<span class="spanLeft">现金变动类型：</span>
							<el-select v-model="inquire.cash" placeholder="请选择" class="ml10" @change="pageReset" :disabled="selectOff.cash">
							    <el-option v-for="item in cash"
							      :key="item.value" :label="item.label" :value="item.value">
							    </el-option>
							</el-select>
							<span class="spanLeft">积分变动类型：</span>
							<el-select v-model="inquire.integral" placeholder="请选择" class="ml10" @change="pageReset" :disabled="selectOff.integral">
							    <el-option v-for="item in integral"
							      :key="item.value" :label="item.label" :value="item.value">
							    </el-option>
							</el-select>
						</div>
						<div class="operate">
						   <span class="spanLeft">用户手机号：</span>
					   		<div class="input-medium input-inline">
						    	<el-input
								  placeholder="请输入用户手机号"
								  v-model="inquire.phone"
								  clearable
								  @change="pageReset">
								</el-input>
					    	</div>
							<span class="spanLeft">用户姓名：</span>
							<div class="input-medium input-inline">
								<el-input
								  placeholder="请输入用户姓名"
								  v-model="inquire.name"
								  clearable
								  @change="pageReset">
								</el-input>
							</div>
							<button type="button" class="btn btn-success" @click="getList()">查询</button>
							<button type="button" class="btn btn-primary" @click="handleExcel">导出</button>
						</div>
						<div class="table-scrollable">
							<el-table :data="tableData" >
								<el-table-column prop="trade_time" label="日期"> </el-table-column>
								<el-table-column prop="phone" label="用户手机号"> </el-table-column>
							    <el-table-column prop="true_name" label="用户姓名"> </el-table-column>
							    <el-table-column prop="type" label="类型">
							    	<template slot-scope="scope">
							    		<template v-if="scope.row.source == 'point'">
							    			<span v-if="scope.row.type == 1">订单赠送积分</span>
								    		<span v-else-if="scope.row.type == 2">邀请奖励</span>
								    		<span v-else-if="scope.row.type == 3">积分抽奖</span>
								    		<span v-else-if="scope.row.type == 4">抽奖获取</span>
								    		<span v-else-if="scope.row.type == 5">积分兑换</span>
								    		<span v-else-if="scope.row.type == 6">售后退回</span>
								    		<span v-else>升级订单兑换</span>
							    		</template>
							    		<template v-else-if="scope.row.source == 'account'">
							    			<span v-if="scope.row.type == 1">订单交易</span>
								    		<span v-else-if="scope.row.type == 2">提现</span>
								    		<span v-else-if="scope.row.type == 3">充值</span>
								    		<span v-else-if="scope.row.type == 4">回收交易</span>
								    		<span v-else-if="scope.row.type == 5">退货</span>
								    		<span v-else>提现退回</span>
							    		</template>
							    		<template v-else>
							    			
							    		</template>
							    		
							    	</template>
							    </el-table-column>
							    <el-table-column prop="" label="金额">
							    	<template slot-scope="scope">
							    		<template>
							    			<span v-if="scope.row.bpType == 2">-{{scope.row.amount}}</span>
							    			<span v-else>+{{scope.row.amount}}</span>
							    		</template>
							    		<template>
							    			<span v-if="scope.row.source == 'point'">积分</span>
							    			<span v-else>元</span>
							    		</template>
							    	</template>
							    </el-table-column>
							    <el-table-column prop="" label="账户余额">
							    	<template slot-scope="scope">
							    		<span v-if="scope.row.source == 'point'">{{scope.row.remaining}} 积分</span>
						    			<span v-else>{{scope.row.remaining}} 元</span>
							    	</template>
							    </el-table-column>
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
    name: 'userFundDetails', // 结构名称
    data() {
        return {
            // 数据模型
            type:[
    			{ value: '0',label: '全部'},
        		{ value: 'point',label: '积分'},
	      		{ value: 'account',label: '资金'}
    		],//类别
    		source:[
    			{ value: '0',label: '全部'},
        		{ value: '1',label: '自主注册'},
	      		{ value: '2',label: '营销途径'}
    		],//来源
    		cash:[
    			{ value: '0',label: '全部'},
        		{ value: '1',label: '订单交易'},
	      		{ value: '2',label: '提现'},
	      		{ value: '3',label: '充值'},
      			{ value: '4',label: '回收交易'},
	      		{ value: '5',label: '退货'},
	      		{ value: '6',label: '提现退回'}
    		],//现金变动类型
    		integral:[
    			{ value: '0',label: '全部'},
        		{ value: '1',label: '订单赠送积分'},
	      		{ value: '2',label: '邀请奖励'},
	      		{ value: '3',label: '积分抽奖'},
	      		{ value: '4',label: '抽奖获取'},
	      		{ value: '5',label: '积分兑换'},
	      		{ value: '6',label: '售后退回'},
	      		{ value: '7',label: '升级订单兑换'}
    		],//积分变动类型
    		inquire:{"type":"0","source":"0","cash":"0","integral":"0"},//查询条件
    		selectOff:{"all":false,"cash":true,"integral":true},//判断积分和现金变动
            tableData:[],//列表数据
            total: null,//列表总数
        	pageNum:1,//当前页数
        	pageSize:10,//每页条数
        	selectedId:'',//4级联动需要的ID
        	resetVal:false,//是否需要重置页面
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
        this.selectedId = this.userInfo.id
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
        
        // 获取四级联动的值
        _getSelectCompany(_val) {
            for (var _key in _val) {
            	if (_val[_key] != null) { 
            		this.selectedId = _val[_key] 
            	}
            }
        },
        //改变状态时从头开始查询
    	pageReset() {
    		this.resetVal = true;
    	},
        //分页-当前页面
        handlePaging(_pageNum) {
    		this.pageNum = _pageNum;
			this.getList();
    	},
    	//积分和现金的状态
    	pageResetAll() {
    		this.resetVal = true;
    		if (this.inquire.type == 'point') {
    			this.selectOff.cash = true;
    			this.inquire.cash = '0';
    			this.selectOff.integral = false;
    		}else if(this.inquire.type == 'account'){
    			this.selectOff.cash = false;
    			this.selectOff.integral = true;
    			this.inquire.integral = '0';
    		}else{
    			this.selectOff.integral = true;
    			this.selectOff.cash = true;
    			this.inquire.integral = '0';
    			this.inquire.cash = '0';
    		}
    	},

    	//获取列表
    	getList() {
    		if (this.resetVal == true) {
    			this.pageNum = 1;
    			this.resetVal = false;
    		}
    		var params = {
    			token:this.token,
    			pageNum:this.pageNum,
    			pageSize:this.pageSize,
    			userId:this.selectedId
    		};
    		//时间
    		if(this.inquire.time) {
    			var startTime = this.inquire.time[0];
    			startTime = Date.parse(startTime);
    			startTime = startTime.toString();
    			startTime = startTime.substring(0,startTime.length-3);
				params.startTime = startTime;
				
				var endTime = this.inquire.time[1];
    			endTime = Date.parse(endTime);
    			endTime = endTime.toString();
    			endTime = endTime.substring(0,endTime.length-3);
    			params.endTime = endTime;
    		}else{
    			this.$message({
    				message: '时间必须填写!',
		          	type: 'error'
    			});
    			return;
    		}
    		//类别
    		if(this.inquire.type != 0){
    			params.source = this.inquire.type;
    		}
    		//来源
    		if(this.inquire.source != 0){
    			params.registerType = this.inquire.source;
    		}
    		//现金变动
    		if(this.inquire.cash != 0){
    			params.amountType = this.inquire.cash;
    		}
    		//积分变动
    		if(this.inquire.integral != 0){
    			params.pointType = this.inquire.integral;
    		}
    		//选择中的用户手机
    		if(this.inquire.phone) {
    			params.phone = this.inquire.phone;
    		}
    		//选择中的用户姓名
    		if(this.inquire.name) {
    			params.userName = this.inquire.name;
    		}
    		
    		var that =this;
    		var reqUrl = this.baseUrl + '/erp/report/transactionDetail';
    		
    		this.$http.get(reqUrl,{params:params}).then(function(res) {
    			if (!res) {
    				return;
    			}
    			that.total = res.total;
    			that.tableData = res.list;
    		})
    	},
    	//导出
    	handleExcel() {
    		var downloadUrl = this.baseUrl + '/erp/report/transactionDetail/export'+'?';
    		downloadUrl = downloadUrl +'token='+this.token;
    		downloadUrl += '&'+'userId='+ this.selectedId;
    		//类别
    		if(this.inquire.type != 0){
    			downloadUrl += '&'+'source='+ this.inquire.type;
    		}
    		//来源
    		if(this.inquire.source != 0){
    			downloadUrl += '&'+'registerType='+ this.inquire.source;
    		}
    		//现金变动
    		if(this.inquire.cash != 0){
    			downloadUrl += '&'+'amountType='+ this.inquire.cash;
    		}
    		//积分变动
    		if(this.inquire.integral != 0){
    			downloadUrl += '&'+'pointType='+ this.inquire.integral;
    		}
    		//选择中的用户手机
    		if(this.inquire.phone) {
    			downloadUrl += '&'+'phone='+ this.inquire.phone;
    		}
    		//选择中的用户姓名
    		if(this.inquire.name) {
    			downloadUrl += '&'+'userName='+ this.chineseToURI(this.inquire.name);
    		}
    		//时间
    		if(this.inquire.time) {
    			var startTime = this.inquire.time[0];
    			startTime = Date.parse(startTime);
    			startTime = startTime.toString();
    			startTime = startTime.substring(0,startTime.length-3);
				downloadUrl += '&'+'startTime='+ startTime;
				
				var endTime = this.inquire.time[1];
    			endTime = Date.parse(endTime);
    			endTime = endTime.toString();
    			endTime = endTime.substring(0,endTime.length-3);
    			downloadUrl += '&'+'endTime='+ endTime;
    		}
    		window.open(downloadUrl);
    	},
    	
    }

}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style scoped>
@import './finance.css';

</style>