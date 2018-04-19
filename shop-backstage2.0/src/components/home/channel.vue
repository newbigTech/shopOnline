<!-- 频道管理 -->
<template>
    <div class="channel">
    	<v-breadcrumb firstMenu="首页" secondMenu="频道管理"></v-breadcrumb>
    	<div class="nav row">
    		<div class="col-md-12">
    			<div class="portlet box red">
					<div class="portlet-title">
						<div class="caption">首页频道列表</div>
					</div>
					<div class="portlet-body">
						<div class="operate">
							<span>频道名称：</span>
							<input type="text" class="form-control input-inline" placeholder="频道名称" v-model="channelName">								
							<span>频道状态：</span>
							<select class="form-control input-small input-inline" v-model="channelSta">
								<option value="">请选择</option>
								<option value="1">显示</option>
								<option value="2">隐藏</option>
							</select>	
							<button type="button" class="btn btn-primary" @click="handleFind">查询</button> 
						</div>
						<div class="operate">
							<button type="button" class="btn btn-primary" @click="handleManage">添加</button>
							<button type="button" class="btn btn-danger" @click="handleDeleteMany">批量删除</button>
						</div>
						<div class="table-scrollable">
							<el-table :data="tableData"  @selection-change="handleSelection">
							    <el-table-column type="selection" prop="" width="50"></el-table-column>
							    <el-table-column prop="name" label="频道名称"> </el-table-column>
							    <el-table-column prop="sort" label="排序"> </el-table-column>
							    <el-table-column prop="" label="图片" width="120">
							    	<template slot-scope="scope">
							    		<img :src="scope.row.icon" class="goods-img" />
							    	</template>
							    </el-table-column>
							    <el-table-column prop="createTime" label="创建时间"> </el-table-column>
							    <el-table-column prop="createBy" label="创建人"> </el-table-column>
							    <el-table-column prop="" label="是否显示">
							    	<template slot-scope="scope">
							    		<span v-if="scope.row.state == 1">显示</span>
							    		<span v-if="scope.row.state == 2">隐藏</span>
							    	</template>
							    </el-table-column>
							    <el-table-column prop="" label="操作" width="200">
							    	<template slot-scope="scope">
							    		<span class="btn default btn-xs purple" @click="handleManage(scope.row)">修改 </span>
										<span class="btn default btn-xs red" @click="handleDelete(scope.row)">删除</span>
							    	</template>
							    </el-table-column>
						    </el-table>
						    <el-pagination layout="prev, pager, next" v-if="total > pageSize"
			    			:page-size="pageSize" :current-page="currentPage" :total="total"
							 v-on:current-change="handlePaging"></el-pagination>
						</div>
					</div>
    			</div>
    		</div>
    	</div>
    	<!-- 弹框 -->
    	<el-dialog title="" :visible.sync="dialogVisible"  @close="handleCancel">
		  	<div class="dialog-title">{{dialogTitle}}</div>
		  	<div class="dialog-con">
		  		<div class="dialog-item">
		  			<div class="col-md-3 ta-right">频道图片：</div>
		  			<div class="col-md-7">
		  				<input type="file" name="file" id="uploadImg" @change="handleUpload" />
		  				<img :src="chanelImg" class="chanel-img" v-if="chanelImg!=''" />
		  				<!--<el-upload 
		  					action="https://jsonplaceholder.typicode.com/posts/"
						  list-type="picture-card"  
						  :on-preview="handlePictureCardPreview" :on-remove="handleRemove">
						  <i class="el-icon-plus"></i>
						</el-upload>-->
					</div>
		  		</div>
		  		<div class="dialog-item">
		  			<div class="col-md-3 ta-right">频道名称：</div>
		  			<div class="col-md-8"><input type="text" placeholder="频道名称" v-model="channelObj.channelName" /></div>
		  		</div>
		  		<div class="dialog-item">
		  			<div class="col-md-3 ta-right">排序：</div>
		  			<div class="col-md-8"><input type="number" class="input-small" placeholder="排序" v-model="channelObj.channelSort" /></div>
		  		</div>
		  		<div class="dialog-item">
		  			<div class="col-md-3 ta-right">频道链接：</div>
		  			<div class="col-md-8"><input type="text" placeholder="频道链接" v-model="channelObj.channelLink" /></div>
		  		</div>
		  		<div class="dialog-item">
		  			<div class="col-md-3 ta-right">是否显示：</div>
		  			<div class="col-md-9">
		  				<el-radio-group v-model="channelObj.channelSta" >
						    <el-radio label="1">显示</el-radio>
						    <el-radio label="2">不显示</el-radio>
						</el-radio-group>
					</div>
		  		</div>
		  	</div>
		  	<div class="dialog-btm ta-center">
		  		<button type="button" class="btn btn-primary" @click="handleSave">保存</button>
				<button type="button" class="btn btn-default" @click="handleCancel">取消</button>
		  	</div>
		</el-dialog>
    </div>
</template>
<script>
import breadcrumb from '@/components/tool/breadcrumb'	//面包屑	
	
export default {
    name: 'channel',
    components: {
    	'v-breadcrumb': breadcrumb
	},
    data() {
        return {
        	tableData: [],
        	channelName: '',
        	channelSta: '',
        	dialogVisible: false,
        	dialogTitle: '添加',
        	shape: '1',//形状
        	channelObj: {'channelSta': '1'},
        	chanelImg: '',
        	currentPage: 1,
        	total: 0,
        	channelIdArrays: '',//选中的频道id
        	channelIdArraysLen: 0
        }
    },
    mounted() {
        this.$nextTick(function() {
        	this.getList();
        });
    },
    methods: {
    	//获取频道列表
    	getList: function() {
    		var that = this;
			var reqUrl = this.baseUrl + '/channelInfo/pageList';
			var params = {
				token: this.token,
				pageSize: this.pageSize,
				currentPage: this.currentPage
			}
			if(this.channelName != '') {
				params.channelName = this.channelName;
			}
			if(this.channelSta != '') {
				params.channelSta = this.channelSta;
			}
			
			this.$http.get(reqUrl, {params: params})
			.then(function(res) {
				if(!res) {
					return;
				}
				that.tableData = res.channelList;
				that.total = res.channelCount;
 			});
    	},
    	//分页
    	handlePaging: function(currentPage) {
    		this.currentPage = currentPage;
    		this.getList();
    	},
    	//模糊搜索
    	handleFind: function() {
    		this.currentPage = 1;
    		this.getList();
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
    		this.channelObj.file = files.fileObj;
    		this.chanelImg = files.fileUrl;
    	},
    	//管理频道  去修改/去添加
    	handleManage: function(item) {
    		if(item.channelId != null) {
    			this.dialogTitle = '修改';
    			this.channelObj.channelId = item.channelId;
    			this.chanelImg = item.icon;
    			this.channelObj.channelName = item.name;
    			this.channelObj.channelSort = item.sort;
    			this.channelObj.channelLink = item.link;
    			this.channelObj.channelSta = item.state;
    		} else {
    			this.dialogTitle = '添加';
    		}
    		this.dialogVisible = true;
    	},
    	//获取单个频道详情
//  	getDetail: function() {
//  		var that = this;
//			var reqUrl = this.baseUrl + '/channelInfo/getChannelDetail';
//			var params = {
//				token: this.token,
//				channelId: this.channelObj.channelId,
//			}
//			this.$http.get(reqUrl, {params: params})
//			.then(function(res) {
//				if(!res) {
//					return;
//				}
//				that.channelObj = res.channelObj;
// 			});
//  	},
    	//保存频道
    	handleSave: function() {
    		if(!this.channelObj.channelName) {
    			this.$message('请输入频道名称');
    			return;
    		}
    		if(!this.channelObj.channelSort) {
    			this.$message('请输入排序');
    			return;
    		}
    		if(!this.channelObj.channelLink) {
    			this.$message('请输入频道链接');
    			return;
    		}
    		
    		var that = this;
    		var formData = new FormData();
    		formData.append('token', this.token);
            formData.append('channelName', this.channelObj.channelName);
			formData.append('channelLink', this.channelObj.channelLink);
			formData.append('channelSta', parseInt(this.channelObj.channelSta));
            formData.append('channelSort', parseInt(this.channelObj.channelSort));
			var reqUrl;
    		if(this.dialogTitle == '添加') { //添加
    			reqUrl = this.baseUrl + '/channelBusi/add';
    			if(!this.channelObj.file) {
	    			this.$message('请选择图片');
	    			return;
	    		}
    			formData.append('file', this.channelObj.file);
    			formData.append('createPerson', this.userInfo.userId);
    		} else {//修改
    			reqUrl = this.baseUrl + '/channelBusi/upd';
    			if(this.channelObj.file) {
    				formData.append('file', this.channelObj.file);
	    		}
    			formData.append('channelId', this.channelObj.channelId);
    			formData.append('updatePerson', this.userInfo.userId);
    		}
			this.$http.post(reqUrl, {formData: formData})
			.then(function(res) {
				if(!res) {
					return;
				}
				that.$message('保存成功');
				that.dialogVisible = false;
				that.channelObj = {'channelSta': '1'};
				that.chanelImg = '';
				that.currentPage = 1;
				document.getElementById('uploadImg').value = '';
				that.getList();
 			});
    	},
    	//取消
    	handleCancel: function() {
    		this.dialogVisible = false;
    		this.channelObj = {'channelSta': '1'};
    		this.chanelImg = '';
    		document.getElementById('uploadImg').value = '';
    	},
    	//删除单个频道
    	handleDelete: function(item) {
    		var that = this;
    		this.$confirm('确认删除吗').then(function() {
    			var reqUrl = that.baseUrl + '/channelBusi/del';
				var params = {
					channelId: item.channelId,
					token: that.token
				}
				that.$http.post(reqUrl, params)
				.then(function(res) {
					if(!res) {
						return;
					}
					if(!res.isDelChannel) {
						that.$message('删除失败');
						return;
					} 
					that.$message('删除成功');
					that.total--;
					var maxPage = Math.ceil(that.total / that.pageSize);
					if(that.total <= (that.currentPage * that.pageSize) && that.currentPage > maxPage && that.currentPage > 1) {
						that.currentPage--;
					}
					that.getList();
	 			});
    		})
    	},
    	handleSelection: function(val) {
    		this.channelIdArrays = '';
    		this.channelIdArraysLen = val.length;
    		if(val.length > 0) {
    			for(var i = 0;i < val.length;i++) {
	    			if(i == 0) {
	    				this.channelIdArrays = val[0].channelId;
	    			} else {
	    				this.channelIdArrays = this.channelIdArrays + ',' + val[i].channelId;
	    			}
    			}
    		}
    	},
    	//批量删除
    	handleDeleteMany: function() {
    		if(this.channelIdArrays == '') {
    			this.$message('请选择删除项');
				return;
    		}
    		var that = this;
    		this.$confirm('确认删除吗').then(function() {
    			var reqUrl = that.baseUrl + '/channelBusi/batchDel';
				var params = {
					channelIdArrays: that.channelIdArrays,
					token: that.token
				}
				that.$http.post(reqUrl, params)
				.then(function(res) {
					if(!res) {
						return;
					}
					if(!res.isBatchDelChannel) {
						that.$message('删除失败');
						return;
					} 
					that.$message('删除成功');
					that.total = that.total - that.channelIdArraysLen;
					var maxPage = Math.ceil(that.total / that.pageSize);
					if(that.total <= (that.currentPage * that.pageSize) && that.currentPage > maxPage && that.currentPage > 1) {
						that.currentPage--;
					}
					that.getList();
	 			});
    		})
    	}
    }
}
</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style scoped>
@import url("./css/dialog.css");
.goods-img  {
	width: 40px;
	height: 40px;
}
.chanel-img {
	width: 50px;
	height: 50px;
}
</style>


