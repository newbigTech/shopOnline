<!-- 意见反馈 -->
<template>
    <div class="notice">
    	<v-breadcrumb firstMenu="其他" secondMenu="意见反馈"></v-breadcrumb>
    	<div class="nav row">
    		<div class="col-md-12">
    			<div class="portlet box red">
					<div class="portlet-title">
						<div class="caption">意见反馈列表</div>
					</div>
					<div class="portlet-body">
						<div class="operate">
							<div class="col-md-4">
								<span class="demonstration">选择时间：</span>
								<el-date-picker v-model="timeVal" type="datetimerange" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" ></el-date-picker>
							</div>
							<div class="col-md-3">
								<span>选择类型：</span>
								<el-select v-model="typeVal" placeholder="请选择" class="ml10">
								    <el-option v-for="item in options"
								      :key="item.value" :label="item.label" :value="item.value">
								    </el-option>
								</el-select>
							</div>
							<div class="col-md-1">
								 <el-button type="primary" @click="query">查询</el-button>
							</div>
						</div>
						<div class="operate">
							<button type="button" class="btn btn-danger" @click="handleRemove">删除</button>
						</div>
						<div class="table-scrollable">
							<el-table :data="tableData" ref="multipleTable" tooltip-effect="dark" @selection-change="handleSelectionChange">
								<el-table-column type="selection" prop="" width="50"></el-table-column>
							    <el-table-column prop="phone" label="用户手机"> </el-table-column>
							    <el-table-column prop="nickName" label="用户昵称"> </el-table-column>
							    <el-table-column prop="problemType" label="问题类型" >
							    	<template slot-scope="scope" >
							    		<span v-if="scope.row.problemType == '1'">功能异常</span>
							    		<span v-if="scope.row.problemType == '2'">体验问题</span>
							    		<span v-if="scope.row.problemType == '3'">新功能建议</span>
							    		<span v-if="scope.row.problemType == '4'">其他</span>
							    	</template>
							    </el-table-column>
							    <el-table-column prop="submissionTime" label="提交时间"> </el-table-column>
							    <el-table-column prop="" label="操作" width="100">
							    	<template slot-scope="scope">
							    		<span class="btn default btn-xs" 
							    			@click="getSysFeedbackDetail(scope.row);dialogVisible = true" > 查看 </span>
							    	</template>
							    </el-table-column>
						    </el-table>
						    <el-pagination layout="prev, pager, next" v-if="total>pageSize"
			    			:page-size="pageSize" :current-page="currentPage"  :total="total" 							v-on:current-change="handlePaging"></el-pagination>
						</div>
					</div>
    			</div>
    		</div>
    	</div>
		<!-- 弹框 -->
    	<el-dialog title="" :visible.sync="dialogVisible">
		  	<div class="dialog-title">反馈描述</div>
		  	<div class="dialog-con">
		  		<div class="dialog-item">
					<div class="detail-text">{{this.descriptionText}}</div>
		  		</div>
		  		<div class="dialog-item">
		  			<img :src="item" v-if="item" class="detail-img" v-for="(item, index) in descriptionImgList" 
		  				:key="index"  @click="getImgDetail(index);innerVisible = true"/>
		  		</div>
		  	</div>
		  	<!--内层的图片详情-->
		  	<el-dialog
		      width="40%"
		      title="图片详情"
		      :visible.sync="innerVisible"
		      append-to-body center>
		      <div class="detail-img-cont">
		      	<img :src="imgDetail" class="detail-img-cont-pic"/>
		      </div>
		    </el-dialog>
		</el-dialog>
    </div>
</template>
<script>
import breadcrumb from '@/components/tool/breadcrumb'	//面包屑
	
export default {
    name: 'notice',
    components: {
    	'v-breadcrumb': breadcrumb
	},
    data() {
        return {
        	total: null,//总数
        	currentPage:1,//当前页数
        	tableData: [],//
        	timeVal: '',//time对象
        	options:[
        		{ value: '0',label: '全部'},
        		{ value: '1',label: '功能异常'},
	      		{ value: '2',label: '体验问题'},
        		{ value: '3',label: '新功能建议'},
        		{ value: '4',label: '其他'}
        	],
        	typeVal: '0',//问题类型
        	dialogVisible: false,
        	descriptionText:'',//反馈描述
        	descriptionImgList:[],//反馈描述图片
        	feedbackIds:[],//意见反馈ID
        	multipleSelection: [],//勾选
        	startTime: null,//商品添加时间
        	endTime: null,//商品结束时间
        	innerVisible:false,//内层图片弹框
        	imgDetail:''
        }
    },
    created() {
    	
    },
    mounted() {
        this.$nextTick(function() {
        	this.getSysFeedbackInfo();
        	
        });
    },
    methods: {
    	handleSelectionChange: function(val) {
    		var arr = [];
    		for(var i = 0;i<val.length;i++){
    			arr.push(val[i].feedbackId);
    		}
    		this.multipleSelection = arr;
    	},
    	//删除
    	handleRemove: function() {
    		if(this.multipleSelection.length == 0){
//  			alert('请勾选需要删除的内容！')
    			this.$message({
				          	message: '请勾选需要删除的内容！',
				          	showClose: true,
				          	type: 'warning'
	        			});
	        	return		
    		}
    		this.$confirm('确定删除?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
    			//删除
					var that = this;
					var reqUrl = this.baseUrl + '/feedback/deleteSysFeedback';
					var params = {
						token: that.token,
						//参数(必填)
						feedbackIds: that.multipleSelection
					}
					this.$http.post(reqUrl, params).then(function(res) {
						if(!res) {
							return;
						}
						that.$message({
				          	message: '恭喜你，删除成功！',
				          	type: 'success'
	        			});
	        			//重新加载数据
						that.getSysFeedbackInfo();
		 			});
    		})
    	},
    	//获取数据
    	getSysFeedbackInfo: function(){
				var params = {
					token: this.token,
					//参数(必填)
					pageNum: this.currentPage,
					pageSize: this.pageSize
				}
				//查询类型条件
				if(this.typeVal != 0){
					params.problemType = this.typeVal;
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
    			
		  		var that = this;
				var reqUrl = this.baseUrl + '/feedback/getSysFeedbackInfo';
				
				this.$http.get(reqUrl, {params: params}).then(function(res) {
					if(!res) {
						return;
					}
					that.total=res.total;
					that.tableData=res.cfList;					
			})
		},
		//分页
    	handlePaging: function(_currentPage) {
    		this.currentPage = _currentPage;
			this.getSysFeedbackInfo();
    	},
    	//查看详情
    	getSysFeedbackDetail:function(item){
    		var params = {
					token: this.token,
					//参数(必填)
					feedbackId: item.feedbackId,
				}
		  		var that = this;
				var reqUrl = this.baseUrl + '/feedback/getSysFeedbackDetail';
				
				this.$http.get(reqUrl, {params: params}).then(function(res) {
					if(!res) {
						return;
					}
					that.descriptionText = res.feedbackDescription;
					that.descriptionImgList = [];
					that.descriptionImgList.push(res.feedbackImgUrl1);
					that.descriptionImgList.push(res.feedbackImgUrl2);
					that.descriptionImgList.push(res.feedbackImgUrl3);
					that.descriptionImgList.push(res.feedbackImgUrl4);
				})
    	},
    	//查询按钮
    	query(){
    		this.getSysFeedbackInfo();
    	},
    	getImgDetail(index){
    		this.imgDetail = this.descriptionImgList[index];
    	}
    }
}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style scoped>
@import url("../home/css/dialog.css");
.goods-img  {
	width: 100px;
	height: 50px;
}
.textarea-box {
	width: 100%;
	height: 100px;
	resize: none;
	border: 1px solid #ccc;
}
.operate {
	min-height: 30px;
	clear: both;
	margin-bottom: 20px;
}
.detail-text {
	line-height: 26px;
	font-size: 16px;
	text-indent: 20px;
	margin: 20px 0;
	word-wrap:break-word;
}
.detail-img {
	width: 100px;
	height: 100px;
	margin-right: 10px;
	cursor: pointer;
}
.detail-img-cont {
	text-align: center;
}
.detail-img-cont-pic {
	max-width: 100%;
	height: auto;
}
</style>

