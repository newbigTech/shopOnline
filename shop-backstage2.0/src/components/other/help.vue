<!-- 帮助中心 -->
<template>
    <div class="help">
        <v-breadcrumb firstMenu="其他" secondMenu="帮助中心"></v-breadcrumb>
        <div class="nav row">
            <div class="col-md-12">
                <div class="portlet box red">
                    <div class="portlet-title">
                        <div class="caption">帮助中心 > 分类管理</div>
                    </div>
                    <div class="portlet-body">
                        <div class="operate">
                            <button type="button" class="btn btn-primary" @click="newClassData"><i class="fa fa-plus"></i> 添加分类</button>
                        </div>
                        <div class="table-scrollable">
                            <el-menu default-active="1" class="el-menu-vertical-demo" background-color="#eee" text-color="#666">
                                <el-submenu :index="index.toString()" v-for="item, index in answerList" :key="index">
                                    <template slot="title">
                                    	<span class="classify-big"><i class="el-icon-menu"></i>
                                        <span>{{item.classifyName}}</span>
                                        <span class="number" v-if="item.questionList.length>0">[{{item.questionList.length}}]</span></span>
                                        
                                        <button type="button" class="btn btn-default" @click.stop="newProblemData(item)"><i class="fa fa-plus"></i> 添加问题</button>
                                        <button type="button" class="btn btn-default" @click.stop="editClassData(item)"><i class="fa fa-edit"></i> 编辑</button>
                                    </template>
                                    <el-menu-item :index="index.toString()" v-for="single,index in item.questionList" :key="index">
                                        <span class="classify-small"><i>{{single.questionName}}</i></span>
                                        <button type="button" class="btn btn-default" @click="editProblemData(single)">编辑</button>
                                        <button type="button" class="btn btn-default" @click="delectConfirm(single)">删除</button>
                                        <span class="icon-img"><i class="el-icon-success"></i>有帮助（{{single.helpful}}）</span>
                                        <span class="icon-img"><i class="el-icon-error"></i>无帮助（{{single.notHelpful}}）</span>
                                    </el-menu-item>
                                </el-submenu>
                            </el-menu>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <el-dialog :visible.sync="classVisible">
            <div class="dialog-title">{{classTitle}}</div>
            <div class="dialog-con">
                <div class="dialog-item">
                    <div class="col-md-4 ta-right">分类名称：</div>
                    <div class="col-md-8">
                        <input type="text" v-model="classObj.classifyName" />
                    </div>
                </div>
                <div class="dialog-item">
                    <div class="col-md-4 ta-right">图片上传：</div>
                    <div class="col-md-8">
                        <div class="el-upload el-upload--picture-card" @click="$refs.uploadClassImg.click()">
                            <i class="el-icon-plus"></i>
                            <input type="file" ref="uploadClassImg" @change="handleUpload" name="file" />
                        </div>
                    </div>
                </div>
                <div class="dialog-item" v-if="classObj.blobimg!=null">
                    <div class="col-md-4 ta-right">图片预览：</div>
                    <div class="col-md-8">
                        <img :src="classObj.blobimg" class="blobimg" alt="">
                    </div>
                </div>
                <div class="dialog-item">
                    <div class="col-md-4 ta-right">排序：</div>
                    <div class="col-md-8">
                    	<input type="number" class="form-control input-small input-inline" min="1"  v-model="classObj.classifySort"/>
                    </div>
                </div>
                <div class="dialog-item">
                    <div class="col-md-4 ta-right">是否显示：</div>
                    <div class="col-md-8">
                        <el-radio-group v-model="classObj.isShow">
                            <el-radio label="显示">是</el-radio>
                            <el-radio label="不显示">否</el-radio>
                        </el-radio-group>
                    </div>
                </div>
            </div>
            <div class="dialog-btm ta-center">
                <button type="button" class="btn btn-primary" @click="updateClassData">保存</button>
                <button type="button" class="btn btn-default" @click="classVisible = false">取消</button>
            </div>
        </el-dialog>
        <el-dialog :visible.sync="problemVisible">
            <div class="dialog-title">{{problemTitle}}</div>
            <div class="dialog-con">
                <div class="dialog-item">
                    <div class="col-md-4 ta-right">请输入问题：</div>
                    <div class="col-md-8">
                        <input type="text" v-model="problemObj.questionName" />
                    </div>
                </div>
                <div class="dialog-item">
                    <div class="col-md-4 ta-right">请输入答案：</div>
                    <div class="col-md-8">
                        <textarea class="textarea-box" v-model="problemObj.questionAnswer"></textarea>
                    </div>
                </div>
                <div class="dialog-item">
                    <div class="col-md-4 ta-right">排序：</div>
                    <div class="col-md-8">
                    	<input type="number" class="form-control input-small input-inline" min="1" v-model="problemObj.questionSort"/>
                    </div>
                </div>
                <div class="dialog-item">
                    <div class="col-md-4 ta-right">是否显示：</div>
                    <div class="col-md-8">
                        <el-radio-group v-model="problemObj.isShow">
                            <el-radio label="显示">是</el-radio>
                            <el-radio label="不显示">否</el-radio>
                        </el-radio-group>
                    </div>
                </div>
            </div>
            <div class="dialog-btm ta-center">
                <button type="button" class="btn btn-primary" @click="updateProblemData">保存</button>
                <button type="button" class="btn btn-default" @click="problemVisible = false">取消</button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import breadcrumb from '@/components/tool/breadcrumb' //面包屑
export default {
    name: 'help',
    components: {
        'v-breadcrumb': breadcrumb
    },
    data() {
        return {
            classVisible: false,
            problemVisible: false,
            answerList: [],
            classObj: {
                classifyId: 0,
                classifyName: '',
                classifySort: 0,
                isShow: '显示',
                blobimg: null,
                file: null
            },
            problemObj: {
                questionId: 0,
                helpClassifyId: 0,
                questionName: '',
                questionAnswer: '',
                questionSort: 0,
                isShow: '显示',
            },
            classTitle:'',
            problemTitle:''
        }
    },
    mounted() {
        this.getData();
        this.$nextTick(function() {});
    },
    methods: {
        // 获取数据
        getData() {
            var that = this;
            this.$http.get(this.baseUrl + '/help/findAllClassIfy', {
                params: { token: this.token }
            }).then(function(res) {
                if (!res) { return }
                that.answerList = res.classIfyList;
            });
        },
        // 添加新分类
        newClassData() {
            this.classObj = {
                classifyId: 0,
                classifyName: '',
                classifySort: '',
                isShow: '显示',
                blobimg: null,
                file: null
            };
            this.classTitle = '添加新分类';
            this.classVisible = true;
        },
        // 修改分类
        editClassData(_data) {
        	this.classTitle = '编辑分类';
            var that = this;
            this.$http.get(this.baseUrl + '/help/findClassIfyById', {
                params: { token: this.token, classifyId: _data.classifyId }
            }).then(function(res) {
                if (!res) { return }
                that.classVisible = true;
                that.classObj.classifyId = res.classifyId;
                that.classObj.file = null;
                that.classObj.blobimg = res.classifyImgUrl;
                that.classObj.classifyName = res.classifyName;
                that.classObj.classifySort = res.classifySort;
                that.classObj.isShow = (res.isShow == 1 ? '显示' : '不显示');
            });
        },
        // 添加|更新分类
        updateClassData() {
            var that = this,
                formData = new FormData();
            formData.append('token', this.token);
            if (this.classObj.classifyId != 0) { formData.append('classifyId', this.classObj.classifyId) }
            formData.append('classifyName', this.classObj.classifyName);
            formData.append('classifySort', this.classObj.classifySort);
            formData.append('isShow', this.classObj.isShow == '显示' ? '1' : '0');
            if(this.classObj.file!=null){ formData.append('file', this.classObj.file) }
            this.$http.post(this.baseUrl + (this.classObj.classifyId == 0 ? '/help/addClassify' : '/help/updateClassify'), {
                formData: formData
            }).then(function(res) {
                if (!res) { return }
                if (res.result == "success") {
                    that.classVisible = false;
                    that.$message({ type: 'success', message: that.classObj.classifyId == 0 ? '添加成功' : '更新成功!' });
                    that.getData();
                }
            });
        },
        // 添加新问题
        newProblemData(_data) {
        	this.problemTitle = '添加新问题';
            this.problemVisible = true;
            this.problemObj = {
                questionId: 0,
                helpClassifyId: _data.classifyId,
                questionName: '',
                questionAnswer: '',
                questionSort: '',
                isShow: '显示',
            };
        },
        // 修改问题
        editProblemData(_data) {
        	this.problemTitle = '编辑问题';
            var that = this;
            this.$http.get(this.baseUrl + '/help/findQuestionById', {
                params: { token: this.token, questionId: _data.questionId }
            }).then(function(res) {
                if (!res) { return }
                that.problemVisible = true;
                that.problemObj.questionId = res.questionId;
                that.problemObj.helpClassifyId = res.helpClassifyId;
                that.problemObj.questionName = res.questionName;
                that.problemObj.questionAnswer = res.questionAnswer;
                that.problemObj.questionSort = res.questionSort;
                that.problemObj.isShow = (res.isShow == '1' ? '显示' : '不显示');
            });
        },
        // 修改问题
        updateProblemData() {
            var that = this,
                formData = new FormData();
            formData.append('token', this.token);
            if (this.problemObj.questionId != 0) { formData.append('questionId', this.problemObj.questionId) }
            formData.append('helpClassifyId', this.problemObj.helpClassifyId);
            formData.append('questionName', this.problemObj.questionName);
            formData.append('questionAnswer', this.problemObj.questionAnswer);
            formData.append('questionSort', this.problemObj.questionSort);
            formData.append('isShow', this.problemObj.isShow == '显示' ? '1' : '0');
            this.$http.post(this.baseUrl + (this.problemObj.questionId == 0 ? '/help/addQuestion' : '/help/updateQuestion'), {
                formData: formData
            }).then(function(res) {
                if (!res) { return }
                if (res.result == "success") {
                    that.problemVisible = false;
                    that.$message({ type: 'success', message: that.problemObj.questionId == 0 ? '添加成功' : '更新成功!' });
                    that.getData();
                }
            });
        },
        // 删除问题
        delectConfirm(_data) {
            this.$confirm('此操作将永久删除该问题, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.delectProblemData(_data);
            }).catch(() => {
                this.$message({ type: 'info', message: '已取消删除' });
            });
        },
        delectProblemData(_data) {
            var that = this;
            this.$http.post(this.baseUrl + '/help/deleteQuestion', {
                token: this.token,
                questionId: _data.questionId
            }).then(function(res) {
                // console.log(res);
                if (!res) { return }
                if (res.result == "success") {
                    that.problemVisible = false;
                    that.getData();
                    that.$message({ type: 'success', message: '删除成功!' });
                }
            });
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
        // 图片上传
        handleUpload: function() {
            var inputFileObj = this.$refs.uploadClassImg;
            var files = this.uploadImgFn(inputFileObj);
            this.beforeAvatarUpload(files.fileObj);
            this.classObj.file = files.fileObj;
            this.classObj.blobimg = files.fileUrl;
        },
    }
}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style scoped>
@import url("../home/css/dialog.css");
.el-upload--picture-card input[type="file"] {
    opacity: 0;
}

.blobimg {
    width: auto;
    height: auto;
    max-width: 100px;
    max-height: 100px;
}

.goods-img {
    width: 100px;
    height: 50px;
}

.textarea-box {
    width: 100%;
    height: 100px;
    line-height: 25px;
    resize: none;
    border: 1px solid #ccc;
}

.el-submenu span~.btn-default {
    margin-left: 1rem;
}

.el-submenu span.number {
    color: #000;
    margin-left: .25rem;
    font-weight: 500;
}

.el-submenu.is-opened .el-submenu__title i.el-icon-menu,
.el-submenu.is-opened .el-submenu__title span {
    color: #000;
}


.el-menu-item span {
    color: #999;
}

.el-menu-item.is-active span {
    color: #666;
}
.icon-img{
	margin-left: 100px;
}
.classify-big{
	display: inline-block;
	width: 200px;
}
.classify-small{
	display: inline-block;
	width: 150px;
}
.classify-small>i{
	font-style: normal;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 1;
	overflow: hidden;
}
</style>
