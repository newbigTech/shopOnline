<!-- 优惠券管理 - 优惠券列表 -->
<template>
	<div class="coupon">
		<v-breadcrumb firstMenu="优惠券管理" secondMenu="优惠券列表"></v-breadcrumb>
    	<div class="nav row">
    		<div class="col-md-12">
    			<div class="portlet box red">
    				<div class="portlet-title">
						<div class="caption">优惠券列表</div>
					</div>
					<div class="portlet-body">
						<div class="operate">
							<div class="form-item">
                                <span>选择时间：</span>
                                <el-date-picker v-model="selectTime" type="datetimerange" start-placeholder="开始时间"
                                	 end-placeholder="结束时间" value-format="yyyy-MM-dd HH:mm:ss" @change="datePicker"></el-date-picker>
                                <span style="margin-left: 10px;">优惠券类型：</span>
                                <el-select v-model="inquire.type" placeholder="请选择" class="ml10">
								    <el-option v-for="item in type"
								      :key="item.value" :label="item.label" :value="item.value">
								    </el-option>
								</el-select>
								<span style="margin-left: 10px;">是否上架：</span>
                                <el-select v-model="inquire.shelves" placeholder="请选择" class="ml10">
								    <el-option v-for="item in status"
								      :key="item.value" :label="item.label" :value="item.value">
								    </el-option>
								</el-select>
                            </div>
                            <div class="form-item">
                            	<span style="margin-left: 10px;">优惠券名称：</span>
                                <div class="input-medium input-inline">
                                    <el-input placeholder="请输入优惠券名称" v-model="inquire.name" clearable> </el-input>
                                </div>
                                <button type="button" class="btn btn-primary" @click="queryList" style="margin-left: 30px;">查询</button>
                            </div>
						</div>
						<div class="operate">
							<button type="button" class="btn btn-success" @click="handleAc">添加</button> 
						</div>
						<div class="table-scrollable">
							<el-table :data="tableData" >
								<el-table-column prop="name" label="优惠券名称"> </el-table-column>
							    <el-table-column prop="type" label="关联类型">
							    	<template slot-scope="scope">
							    		<span v-if="scope.row.type == '1'">体验券</span>
							    		<span v-if="scope.row.type == '2'">现金券</span>
							    		<span v-if="scope.row.type == '3'">满减券</span>
							    	</template>
							    </el-table-column>
							    <el-table-column prop="startTime" label="开始时间" width="100">
							    	<template slot-scope="scope">
							    		<span>{{formatDate(scope.row.startTime, 'time')}}</span>
							    	</template>
							    </el-table-column>
							    <el-table-column prop="endTime" label="结束时间" width="100">
							    	<template slot-scope="scope">
							    		<span>{{formatDate(scope.row.endTime, 'time')}}</span>
							    	</template>
							    </el-table-column>
							    <el-table-column prop="validEndTime" label="有效期至" width="100">
							    	<template slot-scope="scope">
							    		<span v-if="scope.row.validTime == '1'">{{scope.row.validDay}}(天)</span>
							    		<span v-if="scope.row.validTime == '2'">{{scope.row.validEndTime}}</span>
							    	</template>
							    </el-table-column>
							    <el-table-column prop="shelves" label="是否上架">
							    	<template slot-scope="scope">
							    		<span v-if="scope.row.shelves == '0'">否</span>
							    		<span v-if="scope.row.shelves == '1'">是</span>
							    	</template>
							    </el-table-column>
							    <el-table-column prop="number" label="投放总量(个)"> </el-table-column>
							    <el-table-column prop="amount" label="单个金额(元)"> </el-table-column>
							    <el-table-column prop="totalMoney" label="总金额"> </el-table-column>
							    <el-table-column prop="alreadyReceived" label="已领取"> </el-table-column>
							    <el-table-column prop="unclaimed" label="未领取"> </el-table-column>
							    <el-table-column prop="haveExpired" label="已过期"> </el-table-column>
							    <el-table-column prop="" label="操作" width="100">
							    	<template slot-scope="scope">
							    		<span class="btn default btn-xs purple" @click="handleAc(scope.row)">编辑</span>
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

<script type="text/ecmascript-6">
	import breadcrumb from '@/components/tool/breadcrumb' //面包屑
	
	export default {
		name:'coupon',
		components: {
       		'v-breadcrumb': breadcrumb
    	},
    	data() {
    		return {
    			selectTime: null,
    			inquire:{'name': '','type':'','shelves':''},//查询条件
    			type:[
    				{ value: '',label: '全部'},
    				{ value: '1',label: '体验券'},
    				{ value: '2',label: '现金券'},
    				{ value: '3',label: '满减券'}
    			],//类型
    			status:[
    				{ value: '',label: '全部'},
    				{ value: '1',label: '是'},
    				{ value: '0',label: '否'}
    			],//状态
    			tableData:[],//列表数据
	            total: null,//列表总数
	        	pageNum:1,//当前页数
    		}
    	},
    	created() {
    		this.getList();
	    },
    	methods:{
    		// 起止时间处理
	        datePicker() {
	            if (this.selectTime) {
	                this.inquire.startTime = this.selectTime[0];
	                this.inquire.endTime = this.selectTime[1];
	            } else {
	                this.inquire.startTime = null;
	                this.inquire.endTime = null;
	            }
	        },
    		//分页
	        handlePaging(pageNum) {
	    		this.pageNum = pageNum;
	    		this.getList();
	    	},
    		//查询按钮
    		queryList() {
    			this.pageNum = 1;
    			this.getList();
    		},
    		//获取列表
    		getList() {
				var that = this,
					reqUrl = this.baseUrl + '/protocol/findDiscountCouponById',
					params = {
						pageNum: this.pageNum,
						pageSize: this.pageSize
					}
				if(this.inquire.type != '') {
    				params.type = this.inquire.type;
    			}
				if(this.inquire.name != '') {
    				params.name = this.inquire.name;
    			}
				if(this.selectTime != null) {
    				params.startTime = this.inquire.startTime;
    				params.endTime = this.inquire.endTime;
    			}
				if(this.inquire.shelves != '') {
    				params.shelves = this.inquire.shelves;
    			}
				this.$http.get(reqUrl, {params: params}).then(function(res) {
					if(!res) {
						return;
					}
					that.total = res.total;
					that.tableData = res.awardList;
				})
    		},
    		//添加
    		handleAc(item) {
    			var query = {};
    			if(item.id != null) {
    				query = {id: item.id};
    			} else {
    				query = {};
    			}
    			this.$router.push({
	                path: '/couponAdd',
	                query: query
	            });
    		}
    	}
	}
</script>

<style scoped>
.form-item {
	margin-bottom: 20px;
}	
</style>