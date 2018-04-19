<!-- 商城活动 -->
<template>
    <div class="activity">
    	<v-breadcrumb firstMenu="消息" secondMenu="商城活动"></v-breadcrumb>
    	<div class="nav row">
    		<div class="col-md-12">
    			<div class="portlet box red">
					<div class="portlet-title">
						<div class="caption">商城活动列表</div>
					</div>
					<div class="portlet-body">
						<div class="operate">
							<button type="button" class="btn btn-primary" @click="handleAc">新增活动</button>
						</div>
						<div class="table-scrollable">
							<el-table :data="tableData"  @selection-change="handleSelection">
							    <el-table-column prop="act_title" label="标题"> </el-table-column>
							    <el-table-column label="图片" width="120">
							    	<template slot-scope="scope">
							    		<img :src="scope.row.act_img" class="goods-img" @click="showPic(scope.row)"/>
							    	</template>
							    </el-table-column>
							    <el-table-column prop="page_link" label="页面链接"> </el-table-column>
							    <el-table-column prop="create_time" label="添加日期" width="170"> </el-table-column>
							    <el-table-column prop="create_by" label="添加人"> </el-table-column>
							    <el-table-column prop="is_show" label="状态">
							    	<template slot-scope="scope">
							    		<span v-if="scope.row.state == 0">等待上线</span>
							    		<span v-if="scope.row.state == 1">正在进行</span>
							    		<span v-if="scope.row.state == 2">已结束</span>
							    		<span v-if="scope.row.state == 3">已删除</span>
							    	</template>
							    </el-table-column>
							    <el-table-column prop="" label="操作" width="200">
							    	<template slot-scope="scope">
										<span v-if="scope.row.state == 0">
											<span class="btn default btn-xs purple"  @click="handleAc(scope.row)">编辑 </span>
											<span class="btn default btn-xs green" @click="updateActivityState(scope.row)">上线</span>
											<span class="btn default btn-xs red"  @click="handleRemove(scope.row)">删除 </span>
										</span>
										<span v-if="scope.row.state == 1">
											<span class="btn default btn-xs purple"  @click="handleAc(scope.row)">编辑 </span> 
											<span class="btn default btn-xs red" @click="updateActivityState(scope.row)">结束</span>
										</span>
										<span v-if="scope.row.state == 2">
											<span class="btn default btn-xs red"  @click="handleRemove(scope.row)">删除 </span>
										</span>
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
		  	<div class="dialog-title">{{dialogTitle}}</div>
		  	<div class="dialog-con">
		  		<div class="dialog-item">
		  			<div class="col-md-4 ta-right">请输入标题：</div>
		  			<div class="col-md-8"><input type="text" v-model="activityTitle"/></div>
		  		</div>
		  		<div class="dialog-item">
		  			<div class="col-md-4 ta-right">请输入图片：</div>
		  			<div class="col-md-8">
		  				<input type="file" name="file" id="uploadImg" @change="handleUpload" />
		  				<img :src="drawImg" class="draw-img" v-if="drawImg" />
					</div>
		  		</div>
		  		<div class="dialog-item">
		  			<div class="col-md-4 ta-right">请输入链接：</div>
		  			<div class="col-md-8"><input type="text" v-model="activityLink"/></div>
		  		</div>
		  	</div>
		  	<div class="dialog-btm ta-center">
		  		<el-button type="primary" @click="addOrEditSysActivity()" >确 定</el-button>
				<el-button @click="dialogVisible = false">取 消</el-button>
		  	</div>
		</el-dialog>
		<!--图片详情-->
		<el-dialog
		  title="图片详情"
		  :visible.sync="dialogPicVisible"
		  width="45%"
		  center>
		  	<div style="text-align: center;">
		  		<img :src="picDetails" class="pic-details"/>
		  	</div>
					  
		</el-dialog>
    </div>
</template>
<script>
import breadcrumb from '@/components/tool/breadcrumb'	//面包屑
	
export default {
    name: 'activity',
    components: {
    	'v-breadcrumb': breadcrumb
	},
    data() {
        return {
        	tableData: [],
        	dialogVisible: false,
        	isView: '显示',
        	dialogTitle: '添加',
        	shape: '1',
        	total: null,//总数
        	currentPage:1,//当前页数
        	activityTitle:'',//弹框商城活动标题
        	activityLink:'',//弹框商城活动链接
        	username:'',//创建者名字
        	actId:'',//活动ID
        	drawImg: '',
        	drawObj:{},
        	state:'',
        	dialogPicVisible:false,//图片详情弹框
        	picDetails:''//图片详情地址
        }
    },
    mounted() {
        this.$nextTick(function() {
        	this.getSysActivity();
        });
    },
    methods: {
    	handleSelection: function() {
    		
    	},
    	//添加和编辑
    	handleAc: function(item) {
    		if(item.act_id != null) {
    			this.dialogTitle = '编辑'
    		} else {
    			this.dialogTitle = '添加'
    		}
    		this.dialogVisible = true;
    		this.activityTitle = item.act_title;
    		this.activityLink = item.page_link;
    		this.drawImg =item.act_img;
    		this.actId = item.act_id;
    	},
    	handlePictureCardPreview: function() {
    		
    	},
    	//分页
    	handlePaging: function(_currentPage) {
    		this.currentPage = _currentPage;
			this.getSysActivity();
    	},
    	//删除
    	handleRemove: function(item) {
    		this.actId = item.act_id;
    		this.$confirm('确定删除?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					var that = this;
					var reqUrl = this.baseUrl + '/activityBusi/delete';
					var params = {
						token: that.token,
						//参数(必填)
						actId: that.actId
					}
					this.$http.post(reqUrl, params).then((res) => {
						if(!res) {
							return;
						}
						that.$message({
				          	message: '删除成功！',
				          	type: 'success'
	        			});
	        			//重新加载数据
						that.getSysActivity();
					});
				})
    	},
    	//获取商城活动
    	getSysActivity() {
    		var params = {
					token: this.token,
					//参数(必填)
					pageNum: this.currentPage,
					pageSize: this.pageSize//组件中 默认值是10
				}
    		
    		var that = this;
			var reqUrl = this.baseUrl + '/activityInfo/findActivity';
			this.$http.get(reqUrl, {params: params}).then(function(res) {
					if(!res) {
						return;
					}
					that.total=res.total;
					var tableData=res.activityInfo;			
					for(var i=0;i<tableData.length;i++){
					   	var creatTime=tableData[i].create_time;
					   	tableData[i].create_time = that.formatDate(creatTime);
					}
					that.tableData = tableData;
			})
    	},
        // 上传限制
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isPNG = file.type === 'image/png';
            const isLt2M = file.size / 1024 / 1024 < 5;
            var isIMG = true;
            if (!isJPG) {
                if (!isPNG) {
                    this.$message.error('上传图片只能是 JPG, PNG 格式!');
                    isIMG = false;
                }
            }
            if (!isLt2M) {
                this.$message.error('上传图片大小不能超过 5MB!');
            }
            return isIMG && isLt2M;
        },
    	//上传图片
    	handleUpload: function() {
    		var inputFileObj = document.getElementById('uploadImg');
    		var files = this.uploadImgFn(inputFileObj);
            this.beforeAvatarUpload(files.fileObj);
    		this.drawObj.file = files.fileObj;
    		this.drawImg = files.fileUrl;
    	},
    	//判断是编辑还是增加
    	addOrEditSysActivity(){
    		if(this.dialogTitle.indexOf('添加') != -1){
    			this.username=JSON.parse(localStorage.getItem('bsUserInfo')).username
    			this.addSysActivity();
    		}
    		else{
    			this.updateSysActivity();
    		}
    	},
    	//新增商城公告
    	addSysActivity() {
    		if(!this.activityTitle){
    			this.$message('商城活动标题不能为空!');
    			return;
    		}
    		if(!this.activityLink){
    			this.$message('商城活动链接不能为空!');
    			return;
    		}
    		if(!this.drawObj.file) {
    			this.$message('请选择图片');
    			return;
    		}
    			var that = this;
				var reqUrl = this.baseUrl + '/activityBusi/add';
				var formData = new FormData();
				formData.append('token', this.token);
	    		formData.append('actTitle', this.activityTitle);
	    		formData.append('pageLink', this.activityLink);
	    		formData.append('createBy', this.username);
				formData.append('file', this.drawObj.file);
				this.$http.post(reqUrl, {formData: formData}).then(function(res) {
						if(!res) {
							return;
						}
						that.$message({
				          message: '新增商城公告成功!',
				          type: 'success'
				        });	
				        that.dialogVisible = false;
				        that.getSysActivity();
				        document.getElementById('uploadImg').value = '';
				})
    		
    	},
    	//编辑商城活动
    	updateSysActivity(){
    		if(!this.activityTitle){
    			this.$message('编辑商城活动标题不能为空!');
    			return;
    		}
    		if(!this.activityLink){
    			this.$message('编辑商城活动链接不能为空!');
    			return;
    		}
    		var that = this;
			var reqUrl = this.baseUrl + '/activityBusi/update';
			var formData = new FormData();
			formData.append('token', this.token);
    		formData.append('actTitle', this.activityTitle);
    		formData.append('pageLink', this.activityLink);
    		formData.append('actId', this.actId);
			if(that.drawObj.file) {
    			formData.append('file', this.drawObj.file);
    		}
			else{
				formData.append('actImg', this.drawImg);
			}
			this.$http.post(reqUrl, {formData: formData}).then(function(res) {
					if(!res) {
						return;
					}
					that.$message({
			          message: '编辑商城活动成功!',
			          type: 'success'
			        });	
			        that.dialogVisible = false;
			        that.getSysActivity();
			        document.getElementById('uploadImg').value = '';
			})
    	},
    	//修改商城活动状态 上线 结束 删除
    	updateActivityState(item) {
    		this.actId = item.act_id;
    		this.state = item.state;
    		var state = parseInt(this.state);
    		state +=1;
    		state = String(state);
    		this.$confirm('你确定这样操作吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() =>{
					var that = this;
					var reqUrl = this.baseUrl + '/activityBusi/updateActivityState';
					var params = {
						token: this.token,
						//参数(必填)
						actId: that.actId,
						state: state
					}
					this.$http.post(reqUrl, params).then((res) => {
						if(!res) {
							return;
						}
						that.$message({
				          	message: '操作成功！',
				          	type: 'success'
	        			});
	        			//重新加载数据
						that.getSysActivity();
					});
				})
    	},
    	//查看图片详情
    	showPic(item) {
    		this.picDetails = item.act_img;
    		this.dialogPicVisible = true
    	},
    }
}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style scoped>
@import url("../home/css/dialog.css");
.goods-img  {
	width: 80px;
	height: 60px;
	cursor: pointer;
}
.draw-img  {
	width: 50px;
	height: 50px;
}
.pic-details{
	max-width: 100%;
	height: auto;
}
</style>
