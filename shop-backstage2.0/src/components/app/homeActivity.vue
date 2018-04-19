<!-- 首页活动图层配置 -->
<template>
    <div id="homeActivity">
    	<v-breadcrumb :firstMenu="breadcrumbs.first" :secondMenu="breadcrumbs.second"></v-breadcrumb>
    	<div class="nav row">
    		<div class="col-md-12">
    			<div class="portlet box red">
    				<div class="portlet-title">
						<div class="caption">{{breadcrumbs.second}}</div>
					</div>
					<div class="portlet-body">
						 <div class="operate">
                            <button type="button" class="btn btn-primary" @click="handleAc">
                                {{tableData.length > 0 ? '编辑' : '添加' }}{{breadcrumbs.second}}
                            </button>
                        </div>
						<div class="table-scrollable">
							<el-table :data="tableData" >
							    <el-table-column prop="imgUrl" label="图片">
							    	<template slot-scope="scope">
							    		<img :src="scope.row.imgUrl" class="table-img" />
							    	</template>
							    </el-table-column>
							    <el-table-column prop="link" label="链接"></el-table-column>
							</el-table>
							 <el-pagination layout="prev, pager, next" v-if="total > pageSize"
			    			:page-size="pageSize" :current-page="pageNum" :total="total"
							 v-on:current-change="handlePaging"></el-pagination>
						</div>
					</div>
    			</div>
    		</div>
    	</div>
    	<!-- 弹出框 -->
    	<el-dialog  :title="dialogTitle" :visible.sync="dialogVisible" width="30%" @close="handleCancle">
    		<div class="dialog-item">
    			<span>图片：</span>	
				<el-upload class="avatar-uploader" 
                	:action="baseUrl+ '/upload/files'" 
                	:show-file-list="false" 
                	:on-success="uploadSuccess" 
                	:before-upload="beforeUpload"
                	:data="{'token':token,'filePathKey':'appconfigImgPath','fileCategory':'1'}">
                    <img v-if="dialogObj.imgUrl" :src="dialogObj.imgUrl" ref="dialogImg">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
                <el-popover ref="popover1" placement="bottom" width="400" trigger="click">
    				<img :src="dialogObj.imgUrl" class='big-img'>
				</el-popover>
				<span class="text-blue" v-if="dialogObj.imgUrl != ''" v-popover:popover1>查看</span>
    		</div>
    		<div class="dialog-item">
    			<span>链接：</span>	
    			<input type="text" class="form-control input-inline" placeholder="请输入链接地址" v-model="dialogObj.link">			
    		</div>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="handleSave">确 定</el-button>
			    <el-button @click="handleCancle">取 消</el-button>
			</span>
		</el-dialog>
    </div>
</template>
<script>
import breadcrumb from '@/components/tool/breadcrumb' //面包屑
export default {
    name: 'homeActivity', // 首页活动图层配置 
    data() {
        return {
        	breadcrumbs: { first: 'APP管理', second: '首页活动图层配置' },
            tableData: [],
            total: 0,
            pageNum: 1,
            dialogTitle: '首页活动图层配置',
            dialogVisible: false,
            showBigImg: false,
            dialogObj: {}
        }
    },
    components: {
   		'v-breadcrumb': breadcrumb
	},
    created() {
    	this._getData();
    },
    mounted() {
        this.$nextTick(function() {
        	
        });
    },
    methods: {
    	//获取列表数据
    	_getData() {
    		var that = this,
				reqUrl = this.baseUrl + '/productCate/findConfiguration',
				params = { configType: 2 }; //1.App开机页配置2.首页活动图层配置3.每日签到配置4.菜单配置,不传是查询所有
			this.$http.get(reqUrl, {params: params}).then(function(res) {
				if(!res) { return; }
				that.tableData = res.aList;
			})
    	},
    	//弹框
    	handleAc() {
    		this.dialogObj.id = this.tableData[0].id;
    		this.dialogObj.imgUrl = this.tableData[0].imgUrl;
    		this.dialogObj.link = this.tableData[0].link;
    		this.dialogVisible = true;
    	},
    	//上传图片之前
    	beforeUpload(file) {
    		const isJPG = file.type === 'image/jpeg';
    		const isPNG = file.type === 'image/png';
			const isLt2M = file.size / 1024 / 1024 < 2;
			if((!isJPG) && (!isPNG)) {
				this.$message.error('上传图片只能是JPG或者PNG格式!');
			}
			if(!isLt2M) {
				this.$message.error('上传图片大小不能超过 2MB!');
			}
			return (isJPG || isPNG) && isLt2M;
    	},
    	//图片上传成功
    	uploadSuccess(res, file) {
			this.dialogObj.imgUrl = res.data.path;
			this.$refs.dialogImg.src = res.data.path;
    	},
    	//取消
    	handleCancle() {
    		this.dialogObj = {};
    		this.dialogVisible = false;
    		this._getData();
    	},
    	//保存修改
    	handleSave() {
            var _that = this,
                formData = new FormData();
	            formData.append("token", this.token);
	            formData.append("configType", 2);
	            formData.append("handleType", this.tableData.length > 0 ? 2 : 1); //1.新增，2.修改
	            formData.append("appList[0].link", this.dialogObj.link);
	            formData.append("appList[0].imgUrl", this.dialogObj.imgUrl);
            if (this.tableData.length > 0) {
                formData.append("appList[0].id", this.dialogObj.id);
            }
            this.$http.post(this.baseUrl + '/app/appConfig', { formData: formData })
            .then(function(res) {
                if (!res) { return }
                _that.dialogVisible = false;
                _that._getData();
            })
    	}
    }
}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style scoped>
.dialog-item {
	margin-bottom: 20px;
}
.dialog-item > span:nth-child(1) {
	display: inline-block;
	width: 100px;
	text-align: right;
}
.dialog-item > span.text-blue {
	width: auto;
	text-decoration: underline;
	cursor: pointer;
	margin-left: 10px;
}
img.big-img {
	width: 100%;
	height: auto;
}
.table-img {
	width: 100px;
	height: auto;
}
.avatar-uploader {
	display: inline-block;
    width: 62px;
    height: 62px;
    border: 1px dashed #d9d9d9;
}
.avatar-uploader .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 55px;
    height: 55px;
    line-height: 55px;
    text-align: center;
}
.avatar-uploader .el-upload img {
    width: 60px;
    max-height: 60px;
}
</style>
