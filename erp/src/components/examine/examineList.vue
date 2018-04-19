<!-- 审核列表 -->
<template>
	<div class="bondWarn">
		<v-breadcrumb firstMenu="审核管理" secondMenu="审核列表"></v-breadcrumb>
		<div class="nav">
			<div class="col-lg-12">
				<div class="portlet box blue">
					<div class="portlet-title">
						<div class="caption">审核列表</div>
					</div>
					<div class="portlet-body">
						<div class="operate">
							<el-date-picker v-model="dateRange" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" @change="pageReset"></el-date-picker>
							<span>状态：</span>
							<select class="form-control input-small input-inline" v-model="state" @change="pageReset">
								<option value="1">待审核</option>
								<option value="2">已通过</option>
								<option value="3">驳回</option>
							</select>
							<button type="button" class="btn btn-success" @click="getList">查询</button>
							<button type="button" class="btn btn-primary" @click="handleExcel">导出</button>
						</div>
						<div class="table-scrollable">
							<el-table :data="tableData">
								<el-table-column prop="createDateStr" label="日期"> </el-table-column>
								<el-table-column prop="name" label="负责人"> </el-table-column>
								<el-table-column prop="phone" label="手机号"> </el-table-column>
								<el-table-column prop="levelStr" label="级别"></el-table-column>
								<el-table-column prop="proxyName" label="代理名称"> </el-table-column>
								<el-table-column prop="parentName" label="所属上级"> </el-table-column>
								<el-table-column prop="parentUserName" label="所属上级负责人"> </el-table-column>
								<el-table-column prop="parentPhone" label="上级负责人手机号"> </el-table-column>
								<el-table-column prop="stateStr" label="状态">
								</el-table-column>
								<el-table-column prop="" label="营业执照">
									<template slot-scope="scope">
										<a class="text-info" @click="handleLook(scope.row)">查看</a>
									</template>
								</el-table-column>
								<el-table-column prop="" label="操作" width="100">
									<template slot-scope="scope">
										<template v-if="userType == 0 && scope.row.state == 1">
											<a class="text-success" @click="handlePass(scope.row)">通过</a>
											<br />
											<a class="text-warning" @click="handleReject(scope.row)">驳回 </a>
										</template>
										<template v-if="scope.row.state == 3">
											<a class="text-success" @click="handleReason(scope.row)">查看原因</a>
											<br />
											<a class="text-warning" v-if="scope.row.parentId == userId" @click="handleRestart(scope.row)">重新发起 </a>
										</template>
									</template>
								</el-table-column>
							</el-table>
							<el-pagination layout="prev, pager, next" v-if="total > pageSize" :page-size="pageSize" :current-page="currentPage" :total="total" v-on:current-change="handlePaging"></el-pagination>
						</div>
					</div>

				</div>
			</div>
		</div>
		<!--营业执照弹框-->
		<el-dialog title="营业执照" :visible.sync="centerDialogVisible" width="65%" center>
			<div class="license" style="width: 100%;text-align: center;">
				<img :src="licenseImg" alt="" />
			</div>
			<span slot="footer" class="dialog-footer">
            <el-button @click="centerDialogVisible = false">确定</el-button>
          </span>
		</el-dialog>
		<!--重新发起弹框-->
		<el-dialog :title="createObj.title" :visible.sync="dialogVisible" width="60%" center>
            <el-form ref="createObj" :model="createObj" :rules="rules" label-width="100px">
                <div class="row">
                    <div class="col-sm-4">
                        <el-form-item label="编辑">
                            <el-radio disabled v-model="createObj.type" label="1">运营中心</el-radio>
                            <el-radio disabled v-model="createObj.type" label="2">代理商</el-radio>
                        </el-form-item>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-12">
                        <label class="el-form-item__label" style="width: 200px; text-align: left; font-weight: bold">上属机构</label>
                    </div>
                    <div class="col-sm-4">
                        <el-form-item label="姓名">
                            <el-input v-model="createObj.leaderName" placeholder="请输入负责人姓名..." :disabled="true"></el-input>
                        </el-form-item>
                    </div>
                    <div class="col-sm-4">
                        <el-form-item label="所属">
                            <el-input v-model="createObj.leaderCompany" placeholder="请输入所属..." :disabled="true"></el-input>
                        </el-form-item>
                    </div>
                    <div class="col-sm-4">
                        <el-form-item label="手机号">
                            <el-input v-model="createObj.leaderPhone" placeholder="请输入手机号..." :disabled="true"></el-input>
                        </el-form-item>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-12">
                        <label class="el-form-item__label" style="width: 200px; text-align: left; font-weight: bold">负责人信息</label>
                    </div>
                    <div class="col-sm-4">
                        <el-form-item label="账号" prop="phone">
                            <el-input v-model="createObj.phone" :maxlength="11" placeholder="请输入手机号..."></el-input>
                        </el-form-item>
                    </div>
                    <div class="col-sm-4">
                        <el-form-item label="登录密码" prop="password">
                            <el-input type="password" v-model="createObj.password" placeholder="请输入登录名..." :disabled="true"></el-input>
                        </el-form-item>
                    </div>
                    <div class="col-sm-4">
                        <el-form-item label="姓名" prop="name">
                            <el-input v-model="createObj.name" placeholder="请输入负责人姓名..."></el-input>
                        </el-form-item>
                    </div>
                    <div class="col-sm-4">
                        <el-form-item label="身份证号" prop="idCard">
                            <el-input v-model="createObj.idCard" :maxlength="18" :minlength="15" placeholder="请输入身份证..."></el-input>
                        </el-form-item>
                    </div>
                    <div class="col-sm-4">
                        <el-form-item label="公司名称" prop="companyName">
                            <el-input v-model="createObj.companyName" placeholder="请输入公司或个体商户名称..."></el-input>
                        </el-form-item>
                    </div>
                    <div class="col-sm-4">
                        <el-form-item label="营业执照" prop="businessLicense">
                            <el-input v-model="createObj.businessLicense" placeholder="请输入营业执照编号..."></el-input>
                        </el-form-item>
                    </div>
                    <div class="col-sm-8">
                        <el-form-item label="备注" prop="remark">
                            <el-input v-model="createObj.remark" placeholder="请输入备注...." type="textarea" :rows="4" :resize="'none'"></el-input>
                        </el-form-item>
                    </div>
                    <div class="col-sm-4">
                        <el-form-item label="营业执照">
                            <el-upload class="avatar-uploader" 
                            	:action="baseUrl+ '/erp/user/upload/img'" 
                            	:show-file-list="false" 
                            	:on-success="handleAvatarSuccess" 
                            	:before-upload="beforeAvatarUpload"
                            	:data="{'token':token}">
                                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                        </el-form-item>
                    </div>
                </div>
                <el-form-item>
                    <el-button type="success" @click="submitForm('createObj') ">提 交</el-button>
                    <el-button @click="dialogVisible = false ">取 消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
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
			// 负责人校验
			var validateChinese = (rule, value, callback) => {
				if(value === '') {
					callback(new Error('请输入负责人姓名'));
				} else {
					if(!this._isChinese(value)) {
						callback(new Error('请输入中文'));
					}
					callback();
				}
			};
			// 手机号校验
			var validatePhone = (rule, value, callback) => {
				if(value === '') {
					callback(new Error('请输入手机号'));
				} else {
					if(!this._isPhone(value)) {
						callback(new Error('请输入正确的手机号'));
					}
					callback();
				}
			};
			// 身份证校验
			var validateIDCard = (rule, value, callback) => {
				if(value === '') {
					callback(new Error('请输入身份证'));
				} else {
					if(!this._isCardNo(value)) {
						callback(new Error('请输入正确的身份证'));
					}
					callback();
				}
			};
			// 图片校验
			var validateImgSrc = (rule, value, callback) => {
	            if (value === '') { callback(new Error('请输入上传营业执照')) } else { callback() }
	        };
	        //备注校验
	        var validateRemarkSrc = (rule, value, callback) => {
	            if (value === '') { callback(new Error('请输入备注')) } else { callback() }
	        };
			return {
				state: 1, //查询条件-状态
				dateRange: null, //查询条件-时间段
				startTime: '',
				endTime: '',
				tableData: [],
				total: null, //总数
				currentPage: 1, //当前页数
				userId: '', //用户id
				userType:'',//用户类型
				licenseImg: '', //营业执照弹框路径
				centerDialogVisible: false, //营业执照弹框
				imageUrl: '', //上传营业执照里面图片
				imageServerUrl: '', //上传营业执照图片路径
				dialogVisible: false, //重新发起弹框
				id: '', //重新发起必传id
				resetVal: false, //是否需要重置页面
				createObj: {
					title: '重新发起', //  标题
					leaderName: '', //  上级姓名
					leaderCompany: '', //  上级所属
					leaderPhone: '', //  上级手机号
					type: '', //  是   string  1 运营中心 2 代理商
					phone: '', //  是   string  手机号码
					password: '666666', //  是   string  面膜
					name: '', //  是   string  负责人姓名
					companyName: '', //  是   string  公司名称
					imageServerUrl: '', //  是   string  营业执照图片路径
					businessLicense: '', //  是   string  营业执照编号
					idCard: '', //  是   string  身份证
					remark: '', //  是   string  备注
				},
				rules: {
					imageServerUrl: [
                   	 	{ required: true, validator: validateImgSrc, trigger: 'change' }
                	],
					phone: [
						// { required: true, message: '请输入负责人手机号,作为账号', trigger: 'change' },
						// { min: 13, max: 13, message: '请输入正确的手机号', trigger: 'blur' },
						{
							validator: validatePhone,
							trigger: 'blur'
						}
					],
					password: [{
							required: true,
							message: '请输入登录密码',
							trigger: 'change'
						},
						{
							min: 6,
							max: 12,
							message: '长度在 6 到 12 个字符',
							trigger: 'blur'
						}
					],
					name: [
						// { required: true, message: '请输入负责人名称', trigger: 'change' },
						// { min: 4, max: 10, message: '长度在 4 到 10 个字符', trigger: 'blur' },
						{
							required: true,
							validator: validateChinese,
							trigger: 'blur'
						}
					],
					idCard: [
						// { required: true, message: '请输入负责人身份证', trigger: 'change' },
						// { min: 15, max: 18, message: '长度在 15 到 18 个字符', trigger: 'blur' },
						{
							required: true,
							validator: validateIDCard,
							trigger: 'blur'
						}
					],
					companyName: [{
							required: true,
							message: '请输入负责人公司或个体商业',
							trigger: 'change'
						},
						{
							min: 1,
							message: '负责人公司或个体商业必须填写',
							trigger: 'blur'
						}
					],
					remark:[{ required: true, validator: validateRemarkSrc, trigger: 'change' }],
					businessLicense: [{
							required: true,
							message: '请输入营业执照编号',
							trigger: 'change'
						},
						{
							min: 1,
							message: '营业执照编号必须填写',
							trigger: 'blur'
						}
					]
				},
			}
		},
		mounted() {
			this.$nextTick(function() {
				this.userId = this.userInfo.id;
				this.userType = this.userInfo.userType
			});
		},
		methods: {
			//分页
			handlePaging(_currentPage) {
				this.currentPage = _currentPage;
				this.getList();
			},
			//改变状态时从头开始查询
			pageReset() {
				this.resetVal = true;
			},
			//查询
			getList() {
				if(this.resetVal == true) {
					this.currentPage = 1;
					this.resetVal = false;
				}
				// 时间
				if(!this.dateRange) {
					return this.$message({
						message: '查询时间必须填写!',
						type: 'error'
					});
				} else {
					this.startTime = this.dateRange[0];
					this.endTime = this.dateRange[1];
				}
				var params = {
					token: this.token,
					pageNum: this.currentPage,
					pageSize: this.pageSize,
					startDate: this.startTime,
					endDate: this.endTime,
					state: this.state
				};
				var that = this;
				var reqUrl = this.baseUrl + '/erp/user/apply/list';
				this.$http.post(reqUrl, params).then(function(res) {
					if(!res) {
						return;
					}
					that.total = res.total;
					var tableData = res.list;
					for(var i = 0; i < tableData.length; i++) {
						var creatTime = tableData[i].createDateStr;
						tableData[i].createDateStr = that.formatDate(creatTime);
					}
					that.tableData = tableData;
				})
			},
			//通过
			handlePass(item) {
				var that = this;
				this.$confirm('确定通过此项审核吗？').then(function() {
					var reqUrl = that.baseUrl + '/erp/user/pass/userTemp';
					var params = {
						token: that.token,
						id: item.id,
					}
					that.$http.post(reqUrl, params).then(function(res) {
						if(!res) {
							return;
						}
						if(res === true) {
							that.$message({
								type: 'success',
								message: '通过成功!'
							});
						} else {
							that.$message({
								type: 'error',
								message: '通过失败!'
							});
						}
						that.getList();
					})
				}).catch(function() {
					that.$message({
						type: 'info',
						message: '已取消'
					});
				})
			},
			//驳回
			handleReject(item) {
				var that = this;
				this.$prompt('驳回原因(必填)', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					inputPattern: /\S{1,}/,
					inputErrorMessage: '请填写驳回原因'
				}).then(function({
					value
				}) {
					var reqUrl = that.baseUrl + '/erp/user/return/userTemp';
					var params = {
						token: that.token,
						id: item.id,
						remarks: value
					}
					that.$http.post(reqUrl, params).then(function(res) {
						if(!res) {
							return;
						}
						if(res === true) {
							that.$message({
								type: 'success',
								message: '驳回成功!'
							});
						} else {
							that.$message({
								type: 'error',
								message: '驳回失败!'
							});
						}
						that.getList();
					})
				}).catch(function() {
					that.$message({
						type: 'info',
						message: '已取消操作'
					});
				})
			},
			//查看
			handleLook(item) {
				this.licenseImg = item.blImg;
				this.centerDialogVisible = true;
			},
			//原因
			handleReason(item) {
				var str = item.returnReason;
				this.$alert(str, '驳回原因', {
					confirmButtonText: '我知道了'
				}).then(function() {})
			},
			//重新
			handleRestart(item) {
				this.createObj.leaderName = item.parentUserName;
				this.createObj.leaderCompany = item.parentName;
				this.createObj.leaderPhone = item.parentPhone;
				this.createObj.type = item.type.toString();
				this.createObj.phone = item.phone;
				this.createObj.name = item.name;
				this.createObj.idCard = item.idCard;
				this.createObj.companyName = item.proxyName;
				this.createObj.businessLicense = item.blNo;
				this.createObj.remark = item.remark;
				this.imageUrl = item.blImg;
				this.id = item.id;
				this.dialogVisible = true;
			},
			//确认重新发起
			submitForm(formName) {
				var _that = this;
				this.$refs[formName].validate((valid) => {
					if(valid) {
						_that.saveMsg();
					} else {
						return this.$message.error('请填写正确信息!');
					}
				});
			},
			//发送数据
			saveMsg() {
				var formData = new FormData();
				formData.append('token', this.token);
				formData.append('id', this.id);
				formData.append('name', this.createObj.name);
				formData.append('phone', this.createObj.phone);
				formData.append('type', this.createObj.type);
				formData.append('proxyName', this.createObj.companyName);
				formData.append('blImg',this.imageServerUrl !== ''?this.imageServerUrl:this.imageUrl);
				formData.append('blNo', this.createObj.businessLicense);
				formData.append('idCard', this.createObj.idCard);
				formData.append('remark', this.createObj.remark);
				var _that = this;
				this.$http.post(this.baseUrl + '/erp/user/update/userTemp', {
					formData: formData
				}).then(function(res) {
					if(!res){
						return
					}
					_that.$message({
						type: 'success',
						message: '申请成功!'
					});
					_that.dialogVisible = false;
					_that.getList();
				})
			},

			//导出
			handleExcel() {
				//时间
				if(!this.dateRange) {
					this.$message({
						message: '导出列表时间必须填写!',
						type: 'error'
					});
					return;
				} else {
					this.startTime = this.dateRange[0].split(" ")[0];
					this.endTime = this.dateRange[1].split(" ")[0];
				}
				var downloadUrl = this.baseUrl + '/erp/user/apply/list/export' + '?';
				downloadUrl = downloadUrl + 'token=' + this.token;
				downloadUrl += '&' + 'startDate=' + this.startTime;
				downloadUrl += '&' + 'endDate=' + this.endTime;
				downloadUrl += '&' + 'state=' + this.state;
				window.open(downloadUrl);
			},

			//饿了么图片
			// 上传完成后操作
			handleAvatarSuccess(res, file) {
				this.imageUrl = URL.createObjectURL(file.raw);
				this.imageServerUrl = res.data;
			},
			// 上传限制
			beforeAvatarUpload(file) {
				const isJPG = file.type === 'image/jpeg';
				const isPNG = file.type === 'image/png';
				const isLt2M = file.size / 1024 / 1024 < 5;
				if((!isJPG) && (!isPNG)) {
					this.$message.error('上传图片只能是JPG或者PNG格式!');
				}
				if(!isLt2M) {
					this.$message.error('上传图片大小不能超过 5MB!');
				}
				return (isJPG || isPNG) && isLt2M;
			},

		}

	}
</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style scoped>
	.border-1px {
		border-top: 1px solid #e5e5e5;
		padding-top: 10px;
		font-size: 20px;
		color: #999;
	}
	
	.ta-right,
	.ta-center {
		font-size: 14px;
		padding-right: 0;
	}
	
	.ta-right {
		text-align: right;
	}
	
	.ta-center {
		text-align: center;
	}
	
	.lineBlock .img-wrap {
		display: inline-block;
		vertical-align: top;
		position: relative;
		width: 120px;
		height: 120px;
		margin-right: 20px;
		margin-bottom: 10px;
		border: 1px dashed #ddd;
		border-radius: 5px;
	}
	
	.lineBlock .img-wrap .del {
		position: absolute;
		top: -5px;
		right: -5px;
		width: 15px;
		height: 15px;
		line-height: 12px;
		color: #fff;
		background-color: #CB5A5E;
		text-align: center;
		border-radius: 50%;
		cursor: pointer;
		z-index: 500;
		font-size: 20px;
	}
	
	.lineBlock .img-wrap input {
		position: absolute;
		left: 0;
		top: 0;
		width: 120px;
		height: 120px;
		filter: alpha(opacity=0);
		opacity: 0;
	}
	
	.lineBlock .img-wrap img {
		width: 120px;
		height: 120px;
		border-radius: 5px;
	}
	
	.lineBlock .img-add {
		display: inline-block;
		vertical-align: top;
		position: relative;
		width: 120px;
		height: 120px;
		line-height: 120px;
		color: #ddd;
		font-size: 48px;
		text-align: center;
		border: 1px dashed #ddd;
		border-radius: 5px;
		margin-bottom: 10px;
	}
	
	.lineBlock .img-add input {
		position: absolute;
		top: 0;
		left: 0;
		width: 120px;
		height: 120px;
		filter: alpha(opacity=0);
		opacity: 0;
	}
	
	.input-aaa {
		width: 100%;
		height: 32px;
		background-color: #fff;
		background-image: none;
		border-radius: 4px;
		border: 1px solid #dcdfe6;
		box-sizing: border-box;
		color: #606266;
		display: inline-block;
		font-size: inherit;
		line-height: 1;
		outline: 0;
		padding: 0 15px;
	}


</style>

<style>
.el-form-item {
    /*margin-bottom: 10px;*/
}

.avatar-uploader {
    width: 100px;
    height: 100px;
}

.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 100%;
    height: 100%;
}

.el-upload {
    display: inline-block;
    text-align: center;
    cursor: pointer;
    outline: none;
}

.avatar-uploader .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 98px;
    height: 98px;
    line-height: 98px;
    text-align: center;
}

.avatar-uploader .el-upload img {
    width: 100px;
    max-height: 100px;
}

.avatar-uploader input[type="file"] {
    display: none;
}

</style>
