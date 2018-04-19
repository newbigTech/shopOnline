<!-- 商品分类管理 - 二级分类 -->
<template>
    <div class="classify">
    	<v-breadcrumb firstMenu="商品" secondMenu="商品分类" thirdMenu="二级分类"></v-breadcrumb>
    	<div class="nav row">
    		<div class="col-md-12">
    			<div class="portlet box red">
					<div class="portlet-title">
						<div class="caption">商品二级分类列表</div>
					</div>
					<div class="portlet-body">
						<div class="operate">
							<!--<button type="button" class="btn btn-primary" @click="dialogVisible = true">
								<i class="fa fa-plus"></i> 添加
							</button>
							<button type="button" class="btn btn-danger">
								<i class="fa fa-edit"></i> 修改
							</button>-->
						</div>
						<div class="table-scrollable">
							<el-table :data="tableData">
							    <!--<el-table-column type="selection" prop="" width="50"></el-table-column>-->
							    <el-table-column prop="className" label="分类名称">
							    	<template slot-scope="scope">
							    		<span>{{scope.row.className}}</span>
							    	</template>
							    </el-table-column>
							    <el-table-column prop="classIcon" label="分类图片">
							    	<template slot-scope="scope">
							    		<img v-if="scope.row.classIcon" :src="scope.row.classIcon" class="goods-img" />
							    		<span v-else>暂无</span>
							    	</template>
							    </el-table-column>
							    <el-table-column prop="classLink" label="链接">
							    	<template slot-scope="scope">
							    		<span v-if="scope.row.classLink">{{ scope.row.classLink }}</span>
							    		<span v-else>暂无</span>
							    	</template>
							    </el-table-column>
							     <el-table-column prop="isShow" label="是否显示">
							    	<template slot-scope="scope">
							    		<span v-if="scope.row.isShow == 1">显示 </span>
							    		<span v-else>不显示 </span>
							    	</template>
							    </el-table-column>
							    <el-table-column label="操作" width="80">
							    	<template slot-scope="scope">
							    		<span class="btn default btn-xs purple" @click="handleManage(scope.row)">修改 </span>
							    		<!--<span class="btn default btn-xs red">删除</span>-->
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
    	<el-dialog title="" :visible.sync="dialogVisible">
		  	<div class="dialog-title">{{dialogTitle}}</div>
		  	<div class="dialog-con">
		  		<div class="dialog-item">
		  			<div class="col-md-4 ta-right">分类主图：</div>
		  			<div class="col-md-8">
		  				<input type="file" name="file" id="uploadImg" @change="handleUpload" />
		  				<img :src="chanelImgSrc" class="chanel-img" v-if="chanelImgSrc" />
					</div>
		  		</div>
		  		<div class="dialog-item">
		  			<div class="col-md-4 ta-right">分类名称：</div>
		  			<div class="col-md-8"><input type="text" placeholder="分类名称" v-model="channelObj.channelName" disabled="disabled"/></div>
		  		</div>
		  		<div class="dialog-item">
		  			<div class="col-md-4 ta-right">排序：</div>
		  			<div class="col-md-8"><input type="text" placeholder="排序" class="input-small" v-model="channelObj.channelSort"/></div>
		  		</div>
		  		<div class="dialog-item">
		  			<div class="col-md-4 ta-right">分类链接：</div>
		  			<div class="col-md-8"><input type="text" placeholder="分类链接" v-model="channelObj.channelLink"/></div>
		  		</div>
		  		<div class="dialog-item">
		  			<div class="col-md-4 ta-right">是否显示：</div>
		  			<div class="col-md-8">
		  				<el-radio-group v-model="isView">
						    <el-radio label="1">是</el-radio>
						    <el-radio label="2">否</el-radio>
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
    name: 'classify',
  	components: {
    	'v-breadcrumb': breadcrumb
	},
    data() {
        return {
        	id: null,
        	total:null,
        	currentPage:1,
        	tableData: [],
        	dialogVisible: false,
        	dialogTitle: '添加',
        	isView: '1',
        	code: null,
        	chanelImgSrc:'',
        	channelObj:{'channelSta':'1','channelLink': ''},
        }
    },
    mounted() {
        this.$nextTick(function() {
        	this.id = this.$route.query.id;
        	this.getAllClassify();
        });
    },
    methods: {
    	//获取分类
    	getAllClassify: function(){
    		var params = {
    			token: this.token,
    			currentPage: this.currentPage,
    			pageSize: this.pageSize,
    			typeCategory: 2,
    			classNId: this.id
    		}
    		var that = this;
			var reqUrl = this.baseUrl + '/productInfo/getProTypePageList';
			
			this.$http.get(reqUrl, {params:params}).then(function(res) {
				if(!res) {
					return;
				}
				that.total = res.proClassCount;
				that.tableData = res.proClassList;
 			});
    	},
    	//分页
    	handlePaging: function(_currentPage) {
    		this.currentPage = _currentPage;
			this.getGoodsRecord();
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
    	//图片上传
    	handleUpload: function(){
    		var inputFileObj = document.getElementById('uploadImg');
    		var files = this.uploadImgFn(inputFileObj);
            this.beforeAvatarUpload(files.fileObj);
    		this.channelObj.file = files.fileObj;
    		this.chanelImgSrc = files.fileUrl;
    	},
    	//修改
    	handleManage: function(item){
    		if(item != null){
    			this.dialogTitle = '修改';
    			this.code = item.productTypeCode;
    			this.channelObj.channelName = item.className;
    			if(item.classLink){
    				this.channelObj.channelLink = item.classLink;
    			}
    			if(item.sort){
    				this.channelObj.channelSort = item.sort;
    			}
    			if(item.classIcon){
    				this.chanelImgSrc = item.classIcon;
    			}
    		}
    		this.dialogVisible = true;
    	},
    	//保存
    	handleSave: function(){
//  		if(!this.channelObj.channelLink) {
//  			this.$message('请输入分类链接');
//  			return;
//  		}
    		if(!this.channelObj.channelSort) {
    			this.$message('请输入排序');
    			return;
    		}
    		
			var formData = new FormData();
    		formData.append('token', this.token);
			formData.append('typeCode', this.code);
			if(this.channelObj.channelLink != '') {
    			formData.append('typeLink', this.channelObj.channelLink);
    		}
            formData.append('isShow', parseInt(this.isView));
            formData.append('sort', parseInt(this.channelObj.channelSort));
			if(this.channelObj.file){
	            formData.append('file', this.channelObj.file);
			}
			
    		var that = this;
			var reqUrl = this.baseUrl + '/productBusi/modifyProClassType';
			this.$http.post(reqUrl, {formData:formData}).then(function(res) {
				if(!res) {
					return;
				}
				that.$message({
		          	message: '修改成功',
		          	type: 'success'
		        });
				that.handleCancel();
	    		//重新获取
	   			that.getAllClassify();
   			});
    	},
    	//取消
    	handleCancel: function(){
    		this.dialogVisible = false;
    		this.channelObj = {'channelSta': '1'};
    		this.chanelImgSrc = '';
    		document.getElementById('uploadImg').value = '';
    	},
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
.text-link:hover {
	color: #cb5a5e;
	text-decoration: underline;
	cursor: pointer;
}
.chanel-img {
	width: 80px;
	max-height: 80px;
}
</style>
