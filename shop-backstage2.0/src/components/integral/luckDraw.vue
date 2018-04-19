<!-- 抽奖 -->
<template>
    <div class="luckDraw">
    	<v-breadcrumb firstMenu="积分乐园" secondMenu="抽奖"></v-breadcrumb>
    	<div class="nav row">
    		<div class="col-md-12">
    			<div class="portlet box red">
					<div class="portlet-title">
						<div class="caption">奖品列表</div>
					</div>
					<div class="portlet-body">
						<div class="operate">
							<button type="button" class="btn btn-primary" @click="handleManage">添加</button>
							<button type="button" class="btn btn-danger" @click="handleDelete">批量删除</button>
						</div>
						<div class="table-scrollable">
							<el-table :data="tableData"  @selection-change="handleSelection">
							    <el-table-column type="selection" prop="" width="50"></el-table-column>
							    <el-table-column prop="prizeProbability" label="奖品概率"> </el-table-column>
							    <el-table-column prop="prizeName" label="奖品名称"> </el-table-column>
							    <el-table-column prop="sort" label="排序"> </el-table-column>
							    <el-table-column prop="img" label="图片" width="120">
							    	<template slot-scope="scope">
							    		<img :src="scope.row.imgPath" class="draw-img" />
							    	</template>
							    </el-table-column>
						     	<el-table-column prop="createStr" label="创建时间" width="170"></el-table-column>
							    <el-table-column prop="createBy" label="创建人"></el-table-column>
							    <el-table-column prop="state" label="是否显示">
							    	<template slot-scope="scope">
							    		<span v-if="scope.row.state == normalStatus">显示</span>
							    		<span v-if="scope.row.state == invalidStatus">不显示</span>
							    	</template>
							    </el-table-column>
							    <el-table-column prop="" label="操作" width="200">
							    	<template slot-scope="scope">
							    		<span class="btn default btn-xs purple"  @click="handleManage(scope.row)">修改 </span>
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
    	<el-dialog title="" :visible.sync="dialogVisible" @close="handleCancel">
		  	<div class="dialog-title">{{dialogTitle}}</div>
		  	<div class="dialog-con">
		  		<div class="dialog-item">
		  			<div class="col-md-4 ta-right">奖品图片：</div>
		  			<div class="col-md-7">
		  				<input type="file" name="file" id="uploadImg" @change="handleUpload" />
		  				<img :src="drawImg" class="draw-img" v-if="drawImg!=''" />
		  				<!--<el-upload class="upload-img"
						  action="https://jsonplaceholder.typicode.com/posts/"
						  list-type="picture-card"
						  :on-preview="handlePictureCardPreview"
						  :on-remove="handleRemove">
						  <i class="el-icon-plus"></i>
						</el-upload>-->
		  			</div>
		  		</div>
		  		<div class="dialog-item">
		  			<div class="col-md-4 ta-right">奖品名称：</div>
		  			<div class="col-md-7"><input type="text" v-model="drawObj.prizeName" /></div>
		  		</div>
		  		<div class="dialog-item">
		  			<div class="col-md-4 ta-right">排序：</div>
		  			<div class="col-md-7"><input type="text" class="input-small" v-model="drawObj.sort" /></div>
		  		</div>
		  		<div class="dialog-item">
		  			<div class="col-md-4 ta-right">中奖概率：</div>
		  			<div class="col-md-7"><input type="text" class="input-small" v-model="drawObj.prizeProbability" /> %</div>
		  		</div>
		  		<div class="dialog-item">
		  			<div class="col-md-4 ta-right">奖品类型：</div>
		  			<div class="col-md-8">
		  				<select class="form-control input-small input-inline" v-model="drawObj.type" ><!-- @change="checkType" -->
							<option value="1">积分</option>
							<option value="2">谢谢参与</option>
						</select>
					</div>
		  		</div>
		  		<div class="dialog-item" v-if="drawObj.type == 1">
		  			<div class="col-md-4 ta-right">中奖所获积分：</div>
		  			<div class="col-md-7">
		  				<input type="text" class="input-small" v-model="drawObj.point" :readonly="drawObj.type == 2" />
		  			</div>
		  		</div>
		  		<div class="dialog-item">
		  			<div class="col-md-4 ta-right">是否显示：</div>
		  			<div class="col-md-8">
		  				<el-radio-group v-model="drawObj.isShow">
						    <el-radio label="1">是</el-radio>
						    <el-radio label="0">否</el-radio>
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
    name: 'luckDraw',
    components: {
    	'v-breadcrumb': breadcrumb
	},
    data() {
        return {
        	tableData: [],
        	dialogVisible: false,
        	isView: '显示',
        	dialogTitle: '添加',
        	currentPage: 1,
        	total: 0,
        	ids: '',
        	idsLen: [],
        	drawImg: '',
        	drawObj: {'isShow': '1','type': '1', 'point': 0}
        }
    },
    mounted() {
        this.$nextTick(function() {
        	this.getList();
        });
    },
    methods: {
    	handleRemove: function(file, fileList) {
//	        console.log(file, fileList);
	    },
	    handlePictureCardPreview: function(file) {
	        this.dialogImageUrl = file.url;
	        this.dialogVisible = true;
	    },
    	handleSelection: function(val) {
    		this.ids = '';
    		this.idsLen = val.length;
    		if(val.length > 0) {
    			for(var i = 0;i < val.length;i++) {
	    			if(i == 0) {
	    				this.ids = val[0].bigWheelId;
	    			} else {
	    				this.ids = this.ids + ',' + val[i].bigWheelId;
	    			}
    			}
    		}
    	},
    	//大转盘列表
    	getList: function() {
    		var that = this;
			var reqUrl = this.baseUrl + '/sysBigWheel/list';
			var params = {
				pageSize: this.pageSize,
				token: this.token,
				currentPage: this.currentPage
			}
			this.$http.get(reqUrl, {params: params})
			.then(function(res) {
				if(!res) {
					return;
				}
				that.tableData = res.list;
				that.total = res.total;
 			});
    	},
    	//分页
    	handlePaging: function(currentPage) {
    		this.currentPage = currentPage;
			this.getList();
    	},
    	//添加或修改抽奖项
    	handleManage: function(item) {
    		if(item.bigWheelId != null) {
    			this.dialogTitle = '修改';
    			this.drawImg = item.imgPath;
    			this.drawObj.id = item.bigWheelId;
    			this.drawObj.prizeName = item.prizeName;
    			this.drawObj.prizeProbability = item.prizeProbability;
    			this.drawObj.sort = item.sort;
    			this.drawObj.isShow = item.state.toString();
    			this.drawObj.type = item.type;
    			this.drawObj.point = item.point;
    		} else {
    			this.dialogTitle = '添加';
    		}
    		this.dialogVisible = true;
    	},
    	handleUpload: function() {
    		var inputFileObj = document.getElementById('uploadImg');
    		var files = this.uploadImgFn(inputFileObj);
    		this.drawObj.file = files.fileObj;
    		this.drawImg = files.fileUrl;
    	},
    	//保存修改或保存添加
    	handleSave: function() {
    		if(!this.drawObj.prizeName) {
    			this.$message('请输入奖品名称');
    			return;
    		}
    		if(!this.drawObj.prizeProbability) {
    			this.$message('请输入抽奖概率');
    			return;
    		}
    		if(!this.drawObj.sort) {
    			this.$message('请输入排序');
    			return;
    		}
    		if(!this.drawObj.type) {
    			this.$message('请选择奖品类型');
    			return;
    		}
    		if(!this.drawObj.isShow) {
    			this.$message('请选择显示状态 ');
    			return;
    		}
    		if(this.drawObj.type == 1) {
    			if(this.drawObj.point == 0) {
    				this.$message('请输入中奖所获积分');
    				return;
    			}
    		}
    		
    		var that = this;
    		var formData = new FormData();
    		formData.append('token', this.token);
    		formData.append('prizeName', this.drawObj.prizeName);
    		formData.append('prizeProbability', this.drawObj.prizeProbability);
    		formData.append('sort', this.drawObj.sort);
			formData.append('isShow', this.drawObj.isShow);
			formData.append('type',this.drawObj.type);
			formData.append('point', this.drawObj.point);
			var reqUrl;
    		if(this.dialogTitle == '添加') {
    			reqUrl = that.baseUrl + '/sysBigWheel/save';
    			if(!this.drawObj.file) {
	    			this.$message('请选择图片');
	    			return;
	    		}
    			formData.append('file', this.drawObj.file);
    			formData.append('createBy', this.userInfo.realname);
    		} else {
    			reqUrl = that.baseUrl + '/sysBigWheel/update';
    			if(this.drawObj.file) {
	    			formData.append('file', this.drawObj.file);
	    		}
    			formData.append('id', this.drawObj.id);
    			formData.append('updateBy', this.userInfo.realname);
    		}
			this.$http.post(reqUrl, {formData: formData})
			.then(function(res) {
				if(!res) {
					return;
				}
				that.$message('保存成功');
				that.dialogVisible = false;
				that.getList();
				that.drawImg = '';
//				that.currentPage = 1;
				that.drawObj = {'isShow': '1','type': '1', 'point': 0};
				document.getElementById('uploadImg').value = '';
   			});
    	},
    	//取消
    	handleCancel: function() {
    		this.dialogVisible = false;
    		this.getList();
			this.drawImg = '';
			this.drawObj = {'isShow': '1','type': '1', 'point': 0};
			document.getElementById('uploadImg').value = '';
    	},
    	//删除
    	handleDelete: function(item) {
    		if(item.bigWheelId != undefined) {
    			this.ids = item.bigWheelId;
    		}
    		var that = this;
    		this.$confirm('确认删除吗').then(function() {
    			var reqUrl = that.baseUrl + '/sysBigWheel/del';
				var params = {
					ids: that.ids,
					token: that.token
				}
				that.$http.post(reqUrl, params)
				.then(function(res) {
					if(!res) {
						return;
					}
					if(!res) {
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
    	}
    }
}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style scoped>
@import url("../home/css/dialog.css");
.draw-img  {
	width: 50px;
	height: 50px;
}
</style>

