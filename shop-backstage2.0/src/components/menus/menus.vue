<!-- 菜单管理 -->
<template>
    <div class="operator">
    	<v-breadcrumb firstMenu="菜单" secondMenu="菜单管理"></v-breadcrumb>
		<div class="nav row">
    		<div class="col-md-12">
    			<div class="portlet box red">
					<div class="portlet-title">
						<div class="caption">菜单管理</div>
					</div>
					<div class="portlet-body">
						<div class="operate">
							<span>菜单名称：</span>
							<input type="text" class="form-control input-inline" placeholder="菜单名称" v-model="menuName">								
							<span>上一级菜单编号：</span>
							<input type="text" class="form-control input-inline" placeholder="上一级菜单编号" v-model="parentId">		
							<button type="button" class="btn btn-primary" @click="handleFind">查询</button> 
						</div>
						<div class="operate">
							<button type="button" class="btn btn-success" @click="goAdd">添加</button> 
						</div>
						<div class="table-scrollable">
							<el-table :data="tableData">
							    <!--<el-table-column type="selection" prop="" width="50"></el-table-column>-->
							    <el-table-column prop="menuOrder" label="排序" width="100"> </el-table-column>
							    <el-table-column prop="menuId" label="菜单编号"> </el-table-column>
							    <el-table-column prop="menuName" label="菜单名称"> </el-table-column>
							    <el-table-column prop="parentId" label="上一级菜单编号"> </el-table-column>
							    <el-table-column prop="parentName" label="上一级菜单名称"> </el-table-column>
							    <el-table-column prop="" label="图标"> 
							    	<template slot-scope="scope">
							    		<img :src="scope.row.menuImg" class="draw-img" />
							    	</template>
							    </el-table-column>
							    <el-table-column prop="" label="操作">
							    	<template slot-scope="scope">
							    		<span class="btn default btn-xs purple"  @click="goEdit(scope.row)">修改 </span>
							    		<span class="btn default btn-xs red"  @click="handleDelete(scope.row)">删除 </span>
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
    	
    	<!-- 弹出框 -->
    	<el-dialog  :title="dialogTitle" :visible.sync="dialogVisible" width="30%" @close="handleCancle">
    		<div class="col-lg-pull-5">
    			<span>菜单名称：</span>	
    			<input type="text" class="form-control input-inline" placeholder="菜单名称" v-model="menuObj.menuName">	
    		</div>
    		<div class="col-lg-pull-5">
    			<span>菜单链接：</span>	
    			<input type="text" class="form-control input-inline" placeholder="菜单链接" v-model="menuObj.menuUrl"  :disabled="menuObj.isFoundChild == '是'">			
    		</div>
    		<div class="col-lg-pull-5">
    			<span>状态：</span>	
    			<el-radio v-model="menuObj.status" :label="invalidStatus">失效</el-radio>
  				<el-radio v-model="menuObj.status" :label="normalStatus">正常</el-radio>	
    		</div>
    		<div class="col-lg-pull-5">
    			<span>父菜单：</span>	
    			<select class="form-control input-small input-inline" v-model="menuObj.parentId" :disabled="menuObj.isFoundChild == '是'">
					<option :value="item.menuId" v-for="item in parentMenuList" v-if="item.menuId != menuObj.menuId">{{item.menuName}}</option>
				</select>	
    		</div>
    		<div class="col-lg-pull-5">
    			<span>排序：</span>	
    			<input type="text" class="form-control input-inline" placeholder="排序" v-model="menuObj.menuOrder"  :disabled="menuObj.isFoundChild == '是'">
    		</div>
    		<div class="col-lg-pull-5">
    			<span style="vertical-align: top;">图标：</span>	
    			<el-upload class="avatar-uploader" 
                	:action="baseUrl+ '/upload/files'" 
                	:show-file-list="false" 
                	:on-success="handleAvatarSuccess" 
                	:before-upload="beforeAvatarUpload"
                	:data="{'token':token,'filePathKey':'sysMenuImgPath','fileCategory':'1'}">
                    <img v-if="imageUrl" :src="imageUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
    		</div>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="handleSave">确 定</el-button>
			    <el-button @click="handleCancle">取 消</el-button>
			</span>
		</el-dialog>
    </div>
</template>
<script>
import breadcrumb from '@/components/tool/breadcrumb'	//面包屑
export default {
    name: 'operator', // 添加操作员
    components: {
    	'v-breadcrumb': breadcrumb
	},
    data() {
        return {
            tableData: [],
        	pageNum: 1,//当前页数
        	pageSize: 10,//每页条数
        	total: 0,//总共条数
        	menuName: '',//条件-菜单名称
        	parentId: '',//条件-上一级菜单编号
        	flag: true,
        	dialogVisible: false,
        	dialogTitle: '添加',
        	menuObj: {status: this.normalStatus},//菜单对象
        	parentMenuList: {},//父菜单数组
        	imageUrl: '', //上传里面图片
			imageServerUrl: '', //上传图片路径
        }
    },
    mounted() {
        this.$nextTick(function() {
        	this.getMenuList();
        	this.getParentMenu();
        });
    },
    methods: {
    	//获取所有可用菜单列表
    	getMenuList: function() {
    		var that = this;
			var reqUrl = this.baseUrl + '/sys/menu/getMenu'; // 'sys/menu/findAllMenu';
			var params = {
				token: this.token,
				pageNum: this.pageNum,
				pageSize: this.pageSize
			};
			if(this.menuName != '') {
				params.menuName = this.menuName;
			}
			if(this.parentId != '') {
				params.parentId = this.parentId;
			}
			this.$http.get(reqUrl, {params: params})
			.then(function(res) {
				if(!res) {
					return;
				}
				that.tableData = res.menuList;
				that.total = res.total;//总共条数
				that.pageNum = res.pageNum;//当前页数
				that.pageSize = res.pageSize;//每页条数
 			});
    	},
    	//条件查询
    	handleFind: function() {
    		this.pageNum = 1;
    		this.getMenuList();
    	},
    	//菜单分页
    	handlePaging: function(pageNum) {
    		this.pageNum = pageNum;
			this.getMenuList();
    	},
    	//获取所有父菜单
    	getParentMenu: function() {
    		var that = this;
			var reqUrl = this.baseUrl + '/sys/menu/findAllParentMenu';
			var params = {token: this.token};
			this.$http.get(reqUrl, {params: params})
			.then(function(res) {
				if(!res) {
					return;
				}
				that.parentMenuList = res.menuList;
 			});
    	},
    	//去添加
    	goAdd: function() {
    		this.dialogTitle = '添加';
    		this.dialogVisible = true;
    		this.menuObj = {status: this.normalStatus};//菜单对象
    		this.imageUrl = '';
    		this.imageServerUrl = '';
    	},
    	//去修改
    	goEdit: function(item) {
    		this.dialogTitle = '修改';
    		this.dialogVisible = true;
//  		this.menuObj = item;
			this.menuObj.menuId = item.menuId;
			this.menuObj.menuName = item.menuName;
			this.menuObj.menuUrl = item.menuUrl;
			this.menuObj.status = item.status;
			this.menuObj.parentId = item.parentId;
			this.menuObj.menuOrder = item.menuOrder;
			this.imageUrl = item.menuImg;
			this.menuObj.menuImg = item.menuImg;
			this.imageServerUrl = '';
    	},
    	//保存修改 或 保存添加
    	handleSave: function() {
    		var that = this;
    		var reqUrl;
    		if(this.dialogTitle == '修改') {
    			reqUrl = this.baseUrl + '/sys/menu/modifyMenu';
    		} else {
    			reqUrl = this.baseUrl + '/sys/menu/add';
    		}
    		this.menuObj.token = this.token;
    		if (this.imageServerUrl) {
    			this.menuObj.menuImg = this.imageServerUrl;
    		} 
    		if(this.menuObj.parentId == null) {
    			if(this.menuObj.menuUrl != null && this.menuObj.menuUrl != '') {
    				this.$message('父菜单不需要菜单链接');
    				this.menuObj.menuUrl = null;
    				return;
    			}
    			delete this.menuObj.menuUrl;
    			delete this.menuObj.parentId;
    			delete this.menuObj.parentName;
    		} else {
    			if(!this.menuObj.menuUrl) {
    				this.$message('请输入菜单链接');
    				return;
    			}
    		}
    		if (!this.menuObj.menuOrder) {
    			this.$message('排序不能为空');
				return;
    		}
			this.$http.post(reqUrl, this.menuObj)
			.then(function(res) {
				if(!res) {
					return;
				}
				that.$message('操作成功');
				that.menuObj = {status: 1};
				that.dialogVisible = false;
				that.getMenuList();
				that.getParentMenu();
   			});
    	},
    	//取消修改 或 去取消添加
    	handleCancle: function() {
    		this.dialogVisible = false;
    		this.menuObj = {status: this.normalStatus};//菜单对象
//  		this.getMenuList();
    	},
    	//删除
    	handleDelete: function(item) {
    		if(item.isFoundChild == '是') {//该菜单下有子菜单
    			this.$message('该菜单下有子菜单,不能删除');
    			return;
    		}
    		var that = this;
    		this.$confirm('确认删除吗？')
    		.then(function() {
    			var reqUrl = that.baseUrl + '/sys/menu/deleteMenu';
	    		var params = {menuId: item.menuId, token: that.token};
				that.$http.post(reqUrl, params)
				.then(function(res) {
					if(!res) {
						return;
					}
					that.$message('删除成功');
					that.total--;
					var maxPage = Math.ceil(that.total / that.pageSize);
					if(that.total <= (that.currentPage * that.pageSize) && that.currentPage > maxPage && that.currentPage > 1) {
						that.currentPage--;
					}
					that.getMenuList();
					that.getParentMenu();
	 			});
    		})
    	},
    	
    	//饿了么图片
		// 上传完成后操作
		handleAvatarSuccess(res, file) {
			this.imageUrl = URL.createObjectURL(file.raw);
			this.imageServerUrl = res.data.path;
		},
		// 上传限制
		beforeAvatarUpload(file) {
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
    }
}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style scoped>
.operate {
	min-height: 30px;
	margin-bottom: 20px;
	clear: both;
}
.operate > input,
.operate > select {
	margin: 10px;
}
.col-lg-pull-5 {
	margin-bottom: 15px;
}
.col-lg-pull-5 > span {
	display: inline-block;
	width: 100px;
	text-align: right;
}
.draw-img  {
	width: 50px;
	height: 50px;
}
</style>
<style>
.el-form-item {
    /*margin-bottom: 10px;*/
}

.avatar-uploader {
	display: inline-block;
    width: 60px;
    height: 60px;
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
    width: 55px;
    height: 55px;
    line-height: 55px;
    text-align: center;
}

.avatar-uploader .el-upload img {
    width: 60px;
    max-height: 60px;
}

.avatar-uploader input[type="file"] {
    display: none;
}

</style>