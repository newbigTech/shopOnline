<!-- 
    业务员资金状况表
-->
<template>
    <div class="salesmanFund">
    	<v-breadcrumb firstMenu="财务管理" secondMenu="业务员资金状况表"></v-breadcrumb>
    	<div class="nav">
    		<div class="col-md-12">
    			<div class="portlet box blue">
    				<div class="portlet-title">
						<div class="caption">业务员资金状况表</div>
					</div>
					<div class="portlet-body">
						<div class="operate">
							<v-selectCompany v-on:_returnResult="_getSelectCompany"></v-selectCompany>
						</div>
						<div class="operate">
                            <template v-if="userInfo.userType < 2">
    							<span>选择代理商：</span>
    						    <el-select v-model="inquire.agent" placeholder="请选择" class="ml10" @change="agentInteract">
    							    <el-option v-for="item in agent"
    							      :key="item.id" :label="item.label" :value="item.id">
    							    </el-option>
    							</el-select>
                            </template>
							<span class="spanLeft">选择团队：</span>
							<el-select v-model="inquire.team" placeholder="请选择" class="ml10" @change="teamInteract">
							    <el-option v-for="item in team"
							      :key="item.id" :label="item.label" :value="item.id">
							    </el-option>
							</el-select>
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
							<button type="button" class="btn btn-success" @click="getList">查询</button>
							<button type="button" class="btn btn-primary" @click="handleExcel">导出</button>
						</div>
						<div class="table-scrollable">
							<el-table :data="tableData">
								<el-table-column prop="create_time" label="日期"> </el-table-column>
								<el-table-column prop="phone" label="手机号"> </el-table-column>
								<el-table-column prop="id_card_name" label="姓名"> </el-table-column>
								<el-table-column prop="agent_name" label="所属代理商"> </el-table-column>
							    <el-table-column prop="final_amount" label="营业额"> </el-table-column>
							    <el-table-column prop="service_amount" label="服务费"> </el-table-column>
							    <el-table-column prop="service_profit" label="服务费收益"> </el-table-column>
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
    name: 'salesmanFund', // 结构名称
    data() {
        return {
            // 数据模型
            agent:[],//代理商
    		team:[],//团队
    		inquire:{"agent":'',"team":''},//查询条件
            tableData:[],//列表数据
            total: null,//列表总数
        	pageNum:1,//当前页数
        	pageSize:10,//每页条数
        	selectedId:'',//4级联动需要的ID
        	resetVal:false,//是否需要重置页面
        	finallyID:'',//联动后最后的ID
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
        'selectedId':function(curVal, oldVal){

            if (this.userInfo.userType < 2) { // 获取代理商
            	var params = {
        			token:this.token,
        			parentId:this.selectedId,
        			type:2
        		};
        		this.inquire.agent = curVal;
        		this.finallyID = curVal;
        		var agent = this.agent;
        		agent = [{id:curVal,label:"全部"}];
        		var that =this;
        		var reqUrl = this.baseUrl + '/erp/user/selectCompany';
        		this.$http.get(reqUrl,{params:params}).then(function(res) {
        			if (!res) {
        				return;
        			}
        			for(var i=0;i<res.length;i++){
        				agent.push({id:res[i]['id'],label:res[i]['companyName']})
        			}
        			that.agent = agent;
        		})
            }else { // 获取团队
                this.inquire.agent = this.selectedId;
                this.agentInteract();
            }
        },
//      'inquire.agent':function(cur, old){
//      	this.inquire.team = cur;
//      }
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
        //分页-当前页面
        handlePaging(_pageNum) {
    		this.pageNum = _pageNum;
			this.getList();
    	},
    	// 获取四级联动的值
        _getSelectCompany(_val) {
            for (var _key in _val) {
            	if (_val[_key] != null) { 
            		this.selectedId = _val[_key] 
            	}
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
    			userId:this.finallyID
    		};
    		//选择中的用户手机
    		if(this.inquire.phone) {
    			params.phone = this.inquire.phone;
    		}
    		//选择中的用户姓名
    		if(this.inquire.name) {
    			params.userName = this.inquire.name;
    		}
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
    		}
    		var that =this;
    		var reqUrl = this.baseUrl + '/erp/report/salesmanFundDetail';
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
    		var downloadUrl = this.baseUrl + '/erp/report/salesmanFundDetail/export'+'?';
    		downloadUrl = downloadUrl +'token='+this.token;
    		downloadUrl += '&'+'userId='+ this.finallyID;
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
    	//六级联动
    	agentInteract() {
    		this.finallyID = this.inquire.agent;
    		var params = {
    			token:this.token,
    			parentId:this.inquire.agent,
    			type:3
    		};
    		var team = this.team;
    		team = [{id:this.inquire.agent,label:"全部"}];
    		var that =this;
    		var reqUrl = this.baseUrl + '/erp/user/selectCompany';
    		this.$http.get(reqUrl,{params:params}).then(function(res) {
    			if (!res) {
    				return;
    			}
    			for(var i=0;i<res.length;i++){
    				team.push({id:res[i]['id'],label:res[i]['companyName']})
    			}
    			that.team = team;
    		})
    		that.inquire.team = that.inquire.agent;
    	},
    	teamInteract() {
    		this.finallyID = this.inquire.team;
    	}
    }

}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style scoped>
@import './finance.css';

</style>