<!-- 
	运营中心资金明细
-->
<template>
    <div class="operatorFundDetails">
    	<v-breadcrumb firstMenu="财务管理" secondMenu="运营中心资金明细"></v-breadcrumb>
    	<div class="nav row">
    		<div class="col-md-12">
    			<div class="portlet box blue">
    				<div class="portlet-title">
						<div class="caption">运营中心资金明细</div>
					</div>
					<div class="portlet-body">
						<div class="operate">
							<span><v-selectCompany v-on:_returnResult="_getSelectCompany"></v-selectCompany></span>
							<!--<span class="spanLeft">范围：</span>
							<el-select v-model="inquire.range" placeholder="请选择" class="ml10" @change="pageReset">
							    <el-option v-for="item in range"
							      :key="item.value" :label="item.label" :value="item.value">
							    </el-option>
							</el-select>-->
						</div>
						<div class="operate">
							<span>选择时间：</span>
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
						    <!--<span class="spanLeft">运营中心帐号：</span>
						    <div class="input-medium input-inline">
						    	<el-input
								  placeholder="请输入运营中心帐号"
								  v-model="inquire.phone"
								  clearable
								  @change="pageReset">
								</el-input>
						    </div>
							<span class="spanLeft">运营中心名称：</span>
							<div class="input-medium input-inline">
								<el-input
								  placeholder="请输入运营中心名称"
								  v-model="inquire.name"
								  clearable
								  @change="pageReset">
								</el-input>
							</div>-->
							<button type="button" class="btn btn-success" @click="getList">查询</button>
							<button type="button" class="btn btn-primary" @click="handleExcel">导出</button>
						</div>
						<div class="operate">
							营业额：<span style="font-weight: bold;margin-right: 50px;" v-text="revenue"></span>
							<!--盈亏：<span style="font-weight: bold;" v-text="status"></span>-->
						</div>
						<div class="table-scrollable">
							<el-table :data="tableData" >
								<el-table-column prop="phone" label="帐号"> </el-table-column>
							    <el-table-column prop="company_name" label="名称"> </el-table-column>
							    <el-table-column prop="create_date" label="日期"> </el-table-column>
							    <el-table-column prop="balance" label="当前权益"> </el-table-column>
							    <el-table-column prop="turnover" label="日营业额"> </el-table-column>
							    <el-table-column prop="levelStr" label="层级"> </el-table-column>
							    <el-table-column prop="parent_company_name" label="上级机构"> </el-table-column>
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

<script type="text/ecmascript-6">
import breadcrumb from '@/components/tool/breadcrumb' //面包屑	
import selectCompany from '@/components/tool/selectCompany' // 4级联动
	
export default {
    name: 'operatorFundDetails', // 结构名称
    data() {
        return {
            // 数据模型
            range:[
            	{ value: true,label: '查自身'},
        		{ value: false,label: '查下属'}
            ],//范围
            inquire:{"range":true,},//查询条件
            revenue:null,//营业额
            status:null,//盈亏
            tableData:[],//列表数据
            total: null,//列表总数
        	pageNum:1,//当前页数
        	pageSize:10,//每页条数
        	selectedId:'',//4级联动需要的ID
        	resetVal:false,//是否需要重置页面
        	startTime: '',
        	endTime: '',
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
        
       //改变状态时从头开始查询
    	pageReset() {
    		this.resetVal = true;
    	},
    	// 获取四级联动的值
        _getSelectCompany(_val) {
            for (var _key in _val) {
            	if (_val[_key] != null) { 
            		this.selectedId = _val[_key] 
            	}
            }
        },
        //分页-当前页面
        handlePaging(_pageNum) {
    		this.pageNum = _pageNum;
			this.getList();
    	},
    	//列表
    	getList() {
    		if (this.resetVal == true) {
    			this.pageNum = 1;
    			this.resetVal = false;
    		}
    		if (!this.inquire.time) {
    			this.$message({
    				message: '时间必须填写!',
		          	type: 'error'
    			});
    			return;
    		} else {
    			this.startTime = this.inquire.time[0].split(" ")[0];
    			this.endTime = this.inquire.time[1].split(" ")[0];
    		}
    		var params = {
    			token:this.token,
    			pageNum:this.pageNum,
    			pageSize:this.pageSize,
    			startDate:this.startTime,
    			endDate:this.endTime,
    			userId:this.selectedId,
    			self:true
    		};
//  		//用户手机
//  		if(this.inquire.phone) {
//  			params.phone = this.inquire.phone;
//  		}
//  		//用户姓名
//  		if(this.inquire.name) {
//  			params.name = this.inquire.name;
//  		}
    		var that =this;
    		var reqUrl = this.baseUrl + '/erp/report/centerDetailsPage';
    		
    		this.$http.post(reqUrl,params).then(function(res) {
    			if (!res) {
    				return;
    			}
    			that.total = res.list.total;
    			that.tableData = res.list.list;
    			that.revenue = res.turnover;
    			that.status = res.profit;
    		})
    	},
    	//导出
    	handleExcel() {
    		var downloadUrl = this.baseUrl + '/erp/report/centerDetails/export'+'?';
    		downloadUrl = downloadUrl +'token='+this.token;
    		downloadUrl += '&'+'userId='+ this.selectedId;
    		downloadUrl += '&'+'self='+ this.inquire.range;
	    	//查询时间条件
			if (!this.inquire.time) {
    			this.$message({
    				message: '时间必须填写!',
		          	type: 'error'
    			});
    			return;
    		} else {
    			this.startTime = this.inquire.time[0].split(" ")[0];
    			this.endTime = this.inquire.time[1].split(" ")[0];
    			downloadUrl += '&'+'startDate='+ this.startTime;
    			downloadUrl += '&'+'endDate='+ this.endTime;
    		}
    		//用户手机
//  		if(this.inquire.phone) {
//  			downloadUrl += '&'+'phone='+ this.inquire.phone;
//  		}
    		//用户姓名
//  		if(this.inquire.name) {
//  			downloadUrl += '&'+'name='+ this.inquire.name;
//  		}
    		window.open(downloadUrl);
   		}	
    }

}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style scoped>
@import './finance.css';

</style>