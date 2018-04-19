<!-- 楼层管理 -->
<template>
    <div class="floor floorEdit">
        <v-breadcrumb firstMenu="首页" secondMenu="楼层管理"></v-breadcrumb>
        <div class="nav row">
            <div class="col-md-12">
                <div class="portlet box red">
                    <div class="portlet-title">
                        <div class="caption">楼层列表</div>
                    </div>
                    <div class="portlet-body">
                        <div class="operate">
                            <span>楼层名称：</span>
                            <input type="text" class="form-control input-inline" placeholder="楼层名称" v-model="exhibitionTitle">
                            <button type="button" class="btn btn-primary" @click=" handleFind ">查询</button>
                        </div>
                        <div class="operate">
                            <button type="button" class="btn btn-primary" @click=" handleManage(null) ">添加</button>
                            <button type="button" class="btn btn-danger" @click=" handleDeleteMany ">批量删除</button>
                        </div>
                        <div class="table-scrollable">
                            <el-table :data="tableData" @selection-change="handleSelection">
                                <el-table-column type="selection" prop="" width="50"></el-table-column>
                                <el-table-column prop="exhibitionTitle" label="楼层名称"> </el-table-column>
                                <el-table-column prop="type" label="楼层类型"> 
                                    <template slot-scope="scope">
                                        <span v-if="scope.row.type==1">普通楼层</span>
                                        <span v-if="scope.row.type==2">品牌楼层</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="sort" label="排序"> </el-table-column>
                                <el-table-column prop="createTime" label="创建时间"> </el-table-column>
                                <el-table-column prop="createBy" label="创建人"> </el-table-column>
                                <el-table-column prop="isView" label="是否显示">
                                    <template slot-scope="scope">
                                        <span v-if="scope.row.state==1">显示</span>
                                        <span v-if="scope.row.state==0">不显示</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="" label="操作" width="200">
                                    <template slot-scope="scope">
                                        <span class="btn default btn-xs purple" @click=" handleManage(scope.row)">修改 </span>
                                        <span class="btn default btn-xs red" @click=" handleDelete(scope.row) ">删除</span>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <el-pagination layout="prev, pager, next" v-if="total > pageSize" :page-size="pageSize" :current-page="currentPage" :total="total" v-on:current-change="handlePaging"></el-pagination>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 弹框 -->
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" @close="handleCancel">
            <div class="dialog-con">
                <div class="dialog-item">
                    <div class="col-md-4 ta-right">楼层类型：</div>
                    <div class="col-md-7">
                        <el-radio-group v-model="floorObj.type">
                            <el-radio :disabled="disabled" label="1">普通楼层</el-radio>
                            <el-radio :disabled="disabled" label="2">品牌楼层</el-radio>
                        </el-radio-group>
                    </div>
                </div>
                <div class="dialog-item">
                    <div class="col-md-4 ta-right">楼层名称：</div>
                    <div class="col-md-7">
                        <input type="text" placeholder="楼层名称" v-model="floorObj.exhibitionTitle" />
                    </div>
                </div>
                <div class="dialog-item">
                    <div class="col-md-4 ta-right">楼层副标题：</div>
                    <div class="col-md-7">
                        <input type="text" placeholder="楼层副标题" v-model="floorObj.exhibitionHint" />
                    </div>
                </div>
                <div class="dialog-item">
                    <div class="col-md-4 ta-right">楼层唯一编码：</div>
                    <div class="col-md-7">
                        <input type="text" placeholder="楼层唯一编码" v-model="floorObj.exhibitionCode" />
                    </div>
                </div>
                <div class="dialog-item">
                    <div class="col-md-4 ta-right">排序：</div>
                    <div class="col-md-7">
                        <input type="number" class="input-small" placeholder="排序" v-model="floorObj.sort" />
                    </div>
                </div>
                <div class="dialog-item row">
                    <div class="col-md-4 ta-right">楼层图标：</div>
                    <div class="col-md-7 lineHeight">
                        <div class="rowScoped">
                            <div :class="['col-md-3 '] + [floorObj.icon != '' ? '': 'hide']">
                                <ul class="el-upload-list el-upload-list--picture-card">
                                    <li tabindex="0" class="lineHeight el-upload-list__item is-success" style="" @click="$refs.upLoadIcon.click()">
                                        <img :src="floorObj.icon" class="el-upload-list__item-thumbnail " v-if="floorObj.icon!=''">
                                        <a class="el-upload-list__item-name">
                                            <i class="el-icon-document"></i>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div tabindex="0" :class="['el-upload el-upload--picture-card '] + [floorObj.icon == '' ? '': 'hide']" @click="$refs.upLoadIcon.click()">
                            <i class="el-icon-plus"></i>
                            <input type="file" name="file" class="el-upload__input" ref="upLoadIcon" id="upLoadIcon" @change=" _handleUpload" />
                        </div>
                    </div>
                </div>
                <div class="dialog-item">
                    <div class="col-md-4 ta-right">是否显示：</div>
                    <div class="col-md-8">
                        <el-radio-group v-model="floorObj.state">
                            <el-radio label="1">显示</el-radio>
                            <el-radio label="0">不显示</el-radio>
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
import breadcrumb from '@/components/tool/breadcrumb' //面包屑 

export default {
    name: 'floor',
    components: {
        'v-breadcrumb': breadcrumb
    },
    data() {
        return {
            tableData: [
                { 'id': 1, 'name': '猜你喜欢', 'sort': 1, 'time': '2017-12-23 05:20:20', 'person': 'xxx', 'isView': '显示' },
            ],
            currentPage: 1,
            total: 0,
            exhibitionTitle: '',
            dialogVisible: false,
            isView: '显示',
            dialogTitle: '添加',
            floorObj: { state: '1', icon: '', type: '1' },
            disabled: false,
            exhibitionIdArrays: '', //批量删除的楼层id集
            exhibitionIdArraysLen: 0
        }
    },
    mounted() {
        this.$nextTick(function() {
            this.getList();
        });
    },
    methods: {
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
        // 删除图片
        _handleUpload() {
            var inputFileObj = this.$refs.upLoadIcon,
                _that = this,
                formData = new FormData();
            var files = this.uploadImgFn(inputFileObj);
            this.beforeAvatarUpload(files.fileObj);
            formData.append("token", this.token);
            formData.append("filePathKey", 'floorIcon ');
            formData.append("fileCategory", '1');
            formData.append("file", files.fileObj);
            this.$http.post(this.baseUrl + '/upload/files', { formData: formData }).then(function(res) {
                if (!res) { return }
                _that.floorObj.icon = res.path;
            });
        },
        //获取楼层列表
        getList: function() {
            var that = this;
            var reqUrl = that.baseUrl + '/exhibition/exhibitionPageList';
            var params = {
                token: this.token,
                pageSize: this.pageSize,
                currentPage: this.currentPage
            }
            if (this.exhibitionTitle != '') {
                params.exhibitionTitle = this.exhibitionTitle;
            }
            this.$http.get(reqUrl, { params: params })
                .then(function(res) {
                    if (!res) {
                        return;
                    }
                    that.total = res.exhibitionCount;
                    that.tableData = res.exhibitionList;
                });
        },
        //分页
        handlePaging: function(currentPage) {
            this.currentPage = currentPage;
            this.getList();
        },
        handleFind: function() {
            this.currentPage = 1;
            this.getList();
        },
        //管理搜索框
        handleManage: function(item) {
            if (item != null) {
                this.dialogTitle = '修改';
                this.floorObj.state = item.state;
                this.floorObj.exhibitionId = item.exhibitionId;
                this.floorObj.exhibitionTitle = item.exhibitionTitle;
                this.floorObj.exhibitionHint = item.exhibitionHint;
                this.floorObj.exhibitionCode = item.exhibitionCode;
                this.floorObj.sort = item.sort;
                this.floorObj.type = item.type;
                this.floorObj.icon = item.icon;
                this.disabled = true;
            } else {
                this.dialogTitle = '添加';
                this.floorObj.exhibitionTitle = '';
                this.floorObj.exhibitionHint = '';
                this.floorObj.exhibitionCode ='';
                this.floorObj.sort = '';
                this.floorObj.type = '1',
                this.floorObj.icon = '';
                this.floorObj.state = '1';
                this.disabled = false;
            }
            this.dialogVisible = true;
        },
        //保存添加或保存修改
        handleSave: function() {
            if (!this.floorObj.exhibitionTitle) {
                this.$message('请输入楼层名称');
                return;
            }
            if (!this.floorObj.exhibitionHint) {
                this.$message('请输入楼层副标题');
                return;
            }
            if (!this.floorObj.exhibitionCode) {
                this.$message('请输入楼层唯一编码');
                return;
            }
            if (!this.floorObj.sort) {
                this.$message('请输入排序');
                return;
            }
            if (this.floorObj.icon == '') {
                return this.$message('请上传图标');
            }
            var that = this;
            var reqUrl;
            if (this.dialogTitle == '添加') {
                reqUrl = that.baseUrl + '/exhibitionBusi/exhibitionAdd';
                this.floorObj.createBy = this.userInfo.userId;
            } else {
                reqUrl = that.baseUrl + '/exhibitionBusi/exhibitionUpd';
                this.floorObj.exhibitionCode = this.floorObj.exhibitionCode;
                this.floorObj.updateBy = this.userInfo.userId;
            }
            this.floorObj.token = this.token;
            this.floorObj.sort = parseInt(this.floorObj.sort);
            this.$http.post(reqUrl, this.floorObj).then(function(res) {
                if (!res) { return; }
                that.$message('保存成功');
                that.dialogVisible = false;
                that.getList();
                // that.floorObj = { 'state': '1' };
            });
        },
        //取消
        handleCancel: function() {
            this.dialogVisible = false;
            this.getList();
        },
        handleSelection: function(val) {
            this.exhibitionIdArrays = '';
            this.exhibitionIdArraysLen = val.length;
            if (val.length > 0) {
                for (var i = 0; i < val.length; i++) {
                    if (i == 0) {
                        this.exhibitionIdArrays = val[0].exhibitionId;
                    } else {
                        this.exhibitionIdArrays = this.exhibitionIdArrays + ',' + val[i].exhibitionId;
                    }
                }
            }
        },
        //单个删除
        handleDelete: function(item) {
            var that = this;
            this.$confirm('确认删除吗').then(function() {
                var reqUrl = that.baseUrl + '/exhibitionBusi/exhibitionDel';
                var params = {
                    exhibitionId: item.exhibitionId,
                    token: that.token
                }
                that.$http.post(reqUrl, params)
                    .then(function(res) {
                        if (!res) {
                            return;
                        }
                        if (!res.isDelExhibition) {
                            that.$message('删除失败');
                            return;
                        }
                        that.$message('删除成功');
                        that.total--;
                        var maxPage = Math.ceil(that.total / that.pageSize);
                        if (that.total <= (that.currentPage * that.pageSize) && that.currentPage > maxPage && that.currentPage > 1) {
                            that.currentPage--;
                        }
                        that.getList();
                    });
            })
        },
        //批量删除
        handleDeleteMany: function() {
            if (this.exhibitionIdArrays == '') {
                this.$message('请选择删除项');
                return;
            }
            var that = this;
            this.$confirm('确认删除吗').then(function() {
                var reqUrl = that.baseUrl + '/exhibitionBusi/exhibitionBatchDel';
                var params = {
                    exhibitionIdArrays: that.exhibitionIdArrays,
                    token: that.token
                }
                that.$http.post(reqUrl, params)
                    .then(function(res) {
                        if (!res) {
                            return;
                        }
                        if (!res.isBatchDelExhibition) {
                            that.$message('删除失败');
                            return;
                        }
                        that.$message('删除成功');
                        that.total = that.total - that.exhibitionIdArraysLen;
                        var maxPage = Math.ceil(that.total / that.pageSize);
                        if (that.total <= (that.currentPage * that.pageSize) && that.currentPage > maxPage && that.currentPage > 1) {
                            that.currentPage--;
                        }
                        that.getList();
                    });
            })
        },
    }
}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style scoped>
@import url("./css/dialog.css");
.brand-img {
    max-width: 280px;
    max-height: 120px;
}

.floor-img {
    width: 50px;
    height: 50px;
    margin-top: 10px;
}

.rowScoped {
    margin-right: -15px;
    margin-left: -15px;
}

.dialog-con .input-group-btn {
    line-height: 1;
}

.dialog-con .input-group-btn>.btn {
    height: 40px;
    line-height: 30px;
    border-radius: 0 4px 4px 0;
    border: 1px solid #ccc;
}

</style>
