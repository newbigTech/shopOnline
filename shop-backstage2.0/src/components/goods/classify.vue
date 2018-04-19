<!-- 商品分类管理 -->
<template>
    <div class="classify">
    	<v-breadcrumb firstMenu="商品" secondMenu="商品分类"></v-breadcrumb>
    	<div class="nav row">
    		<div class="col-md-12">
    			<div class="portlet box red">
					<div class="portlet-title">
						<div class="caption">商品分类列表</div>
					</div>
					<div class="portlet-body">
						<div class="operate">
							<!--<button type="button" class="btn btn-primary" @click="dialogVisible = true">
								添加
							</button>-->
							<!--<button type="button" class="btn btn-danger">
								批量删除
							</button>-->
						</div>
						<div class="table-scrollable">
							<el-table :data="tableData">
							    <!--<el-table-column type="selection" prop="" width="50"></el-table-column>-->
							    <el-table-column prop="className" label="分类名称">
							    	<template slot-scope="scope">
							    		<span class="text-link" @click="$router.push({path:'/secondClassify',query:{id:scope.row.classId}})">{{scope.row.className}}</span>
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
							    		<span v-if="scope.row.classLink != '' && scope.row.classLink != null">{{ scope.row.classLink }}</span>
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
		  			<div class="col-md-3 ta-right">分类图片：</div>
		  			<div class="col-md-7">
		  				<!--<div class="img-wrap">-->
			  				<input type="file" name="file" id="uploadImg" @change="handleUpload" />
			  				<img :src="chanelImgSrc" class="chanel-img" v-if="chanelImgSrc" />
		  				<!--</div>-->
					</div>
		  		</div>
		  		<div class="dialog-item">
		  			<div class="col-md-3 ta-right">分类名称：</div>
		  			<div class="col-md-8"><input type="text" placeholder="分类名称" v-model="channelObj.channelName" disabled="disabled"/></div>
		  		</div>
		  		<div class="dialog-item">
		  			<div class="col-md-3 ta-right">排序：</div>
		  			<div class="col-md-8"><input type="number" class="input-small" placeholder="排序" v-model="channelObj.channelSort" onKeyUp="this.value=this.value.replace(/[^\.\d]/g,'');this.value=this.value.replace('.','');"/></div>
		  		</div>
		  		<div class="dialog-item">
		  			<div class="col-md-3 ta-right">分类链接：</div>
		  			<div class="col-md-8"><input type="text" placeholder="分类链接" v-model="channelObj.channelLink" /></div>
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
    name: 'classify',
  	components: {
    	'v-breadcrumb': breadcrumb
	},
    data() {
        return {
        	tableData: [],
        	total:null,
        	currentPage:1,
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
        	this.getOneClassify();
        });
    },
    methods: {
    	//获取一级分类数据
    	getOneClassify: function(){
    		var that = this;
			var reqUrl = this.baseUrl + '/productInfo/getProTypePageList';
			var params = {
				token: that.token,
				//文档参数 (必选)
				currentPage:that.currentPage,
				pageSize: that.pageSize,
				typeCategory:1
			}
			
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
			this.getOneClassify();
    	},
    	//修改
    	handleManage: function(item){
    		console.log(item);
    		if(item != null){
    			this.dialogTitle = '修改';
    			this.code = item.productTypeCode;
    			this.channelObj.channelName = item.className;
    			if(item.classLink != null){
    				this.channelObj.channelLink = item.classLink;
    			}
    			if(item.sort){
    				this.channelObj.channelSort = item.sort;
    			}
    			if(item.classIcon){
    				this.chanelImgSrc = item.classIcon;
    			}
    			this.channelObj.channelSta = item.isShow;
    		}
    		this.dialogVisible = true;
    	},
    	//取消
    	handleCancel: function() {
    		this.dialogVisible = false;
    		this.channelObj = {'channelSta': '1','channelLink': ''};
    		this.chanelImgSrc = '';
    		document.getElementById('uploadImg').value = '';
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
    	//图片上传修改
    	handleUpload: function() {
    		var inputFileObj = document.getElementById('uploadImg');
    		var files = this.uploadImgFn(inputFileObj);
            
            this.beforeAvatarUpload(files.fileObj);
    		this.channelObj.file = files.fileObj;
    		this.chanelImgSrc = files.fileUrl;
    	},
    	//保存
    	handleSave: function(){
//  		if(!this.channelObj.channelLink) {
//  			this.$message('请输入分类链接');
//  			return;
//  		}
    		if(!this.channelObj.channelSort) {
    			this.$message('请输入分类排序');
    			return;
    		}
    		
			var formData = new FormData();
    		formData.append('token', this.token);
			formData.append('typeCode', this.code);
			if(this.channelObj.channelLink != '') {
    			formData.append('typeLink', this.channelObj.channelLink);
    		}
            formData.append('isShow', this.channelObj.channelSta);
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
	   			that.getOneClassify();
   			});
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
/*.img-wrap {
	position: relative;
	border: 1px dashed #999;
	width: 83px;
	height: 83px;
	background-color: #f5f5f5;
}
.img-wrap input {
	position: absolute;
	left: 0;
	top: 0;
	width: 80px;
	height: 80px;
	opacity: 0;
	filter:Alpha(opacity=0);
}*/
.chanel-img {
	width: 80px;
	max-height: 80px;
}
</style>
