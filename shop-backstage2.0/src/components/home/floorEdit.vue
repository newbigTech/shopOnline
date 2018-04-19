<!-- 楼层编辑 -->
<template>
    <div class="floorEdit">
        <v-breadcrumb firstMenu="首页" secondMenu="楼层编辑"></v-breadcrumb>
        <div class="nav row">
            <div class="col-md-12">
                <div class="portlet box red">
                    <div class="portlet-title">
                        <div class="caption">楼层元素列表</div>
                    </div>
                    <div class="portlet-body">
                        <div class="operate">
                            <span>楼层：</span>
                            <select class="form-control input-small input-inline" v-model="exhibitionKey">
                                <!-- <option value="">请选择</option> -->
                                <option :value="item.exhibitionId" v-for="item in floorSelects">{{item.exhibitionTitle}}</option>
                            </select>
                            <span>元素名称：</span>
                            <input type="text" class="form-control input-inline" placeholder="元素名称" v-model="elementName">
                            <button type="button" class="btn btn-success" @click="getElementList">查询</button>
                        </div>
                        <div class="operate">
                            <button type="button" class="btn btn-primary" @click="handleManage">添加</button>
                            <button type="button" class="btn btn-danger" @click="handleDeleteMany">批量删除</button>
                        </div>
                        <div class="table-scrollable">
                            <el-table :data="tableData" @selection-change="handleSelection">
                                <el-table-column type="selection" prop="" width="50"></el-table-column>
                                <el-table-column prop="resourceId" label="商品ID"> </el-table-column>
                                <el-table-column prop="elementName" label="商品名称"> </el-table-column>
                                <el-table-column prop="sort" label="排序"> </el-table-column>
                                <el-table-column prop="img" label="图片" width="120">
                                    <template slot-scope="scope">
                                        <img :src="scope.row.imgPath" class="goods-img" />
                                    </template>
                                </el-table-column>
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
                                        <span class="btn default btn-xs purple" @click="handleManage(scope.row)">修改 </span>
                                        <span class="btn default btn-xs red" @click="handleDelete(scope.row)">删除
                                        </span>
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
        <el-dialog :title="dialogTitle" width="40%" :visible.sync="dialogVisible" @close="handleCancel">
            <!-- <div class="dialog-title">{{dialogTitle}}</div> -->
            <div class="dialog-con">
                <div class="dialog-item">
                    <div class="col-md-4 ta-right">图片规格：</div>
                    <div class="col-md-7">
                        <el-radio-group v-model="elementObj.spec">
                            <el-radio label="1">正方形</el-radio>
                            <el-radio label="2">长方形</el-radio>
                        </el-radio-group>
                    </div>
                </div>
                <div class="dialog-item">
                    <div class="col-md-4 ta-right">
                        <span style="color: red">*</span>
                    选择商品：</div>
                    <div class="col-md-7">
                        <a class="btn btn-default" @click=" goodsListModelVisible = true ">选择</a>
                        <!-- <div class="input-group">
                            <input type="text" class="form-control" placeholder="关联商品或品牌CODE" disabled="disabled" v-model="elementObj.resourceId" />
                            <input type="text" class="form-control" placeholder="Search for...">
                            <span class="input-group-btn">
                                <a class="btn btn-default" @click=" goodsListModelVisible = true ">选择</a>
                            </span>
                        </div> -->
                    </div>
                </div>
                <div class="dialog-item">
                    <div class="col-md-4 ta-right">元素名称：</div>
                    <div class="col-md-7">
                        <input type="text" placeholder="元素名称" v-model="elementObj.elementName" />
                    </div>
                </div>
                <div class="dialog-item">
                    <div class="col-md-4 ta-right">元素副标题：</div>
                    <div class="col-md-7">
                        <input type="text" placeholder="元素副标题" v-model="elementObj.elementHint" />
                    </div>
                </div>
                <div class="dialog-item row">
                    <div class="col-md-4 ta-right">图片：</div>
                    <div class="col-md-7 lineHeight">
                        <div class="rowScoped">
                            <div :class="['col-md-3 '] + [elementImg != '' ? '': 'hide']">
                                <ul class="el-upload-list el-upload-list--picture-card">
                                    <li tabindex="0" class="lineHeight el-upload-list__item is-success" style="" @click="$refs.uploadImg.click()">
                                        <img :src="elementImg" class="el-upload-list__item-thumbnail " v-if="elementImg!=''">
                                        <a class="el-upload-list__item-name">
                                            <i class="el-icon-document"></i>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div tabindex="0" :class="['el-upload el-upload--picture-card '] + [elementImg == '' ? '': 'hide']" @click="$refs.uploadImg.click()">
                            <i data-v-24678e2e="" class="el-icon-plus"></i>
                            <input type="file" name="file" class="el-upload__input" ref="uploadImg" id="uploadImg" @change="handleUpload" />
                        </div>
                    </div>
                </div>
                <div class="dialog-item hide">
                    <div class="col-md-4 ta-right">元素链接：</div>
                    <div class="col-md-7">
                        <input type="text" placeholder="元素链接" v-model="elementObj.link" />
                    </div>
                </div>
                <div class="dialog-item">
                    <div class="col-md-4 ta-right">排序：</div>
                    <div class="col-md-7">
                        <input type="number" class="input-small" placeholder="排序" v-model="elementObj.sort" />
                    </div>
                </div>
                <div class="dialog-item">
                    <div class="col-md-4 ta-right">是否显示：</div>
                    <div class="col-md-8">
                        <el-radio-group v-model="elementObj.state">
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
        <v-goodsListModel :visible="goodsListModelVisible" v-on:visible="setGoodsVisible" v-on:getGoods="getSelectedGoods"></v-goodsListModel>
    </div>
</template>
<script>
import breadcrumb from '@/components/tool/breadcrumb' //面包屑 
import goodsListModel from '@/components/goods/goodsListModel' //商品列表弹框 
export default {
    name: 'floorEdit',
    components: {
        'v-breadcrumb': breadcrumb,
        'v-goodsListModel': goodsListModel,
    },
    data() {
        return {
            tableData: [],
            currentPage: 1,
            total: 0,
            exhibitionKey: '', //楼层id
            elementName: '', //元素名称
            dialogVisible: false,
            isView: '显示',
            dialogTitle: '添加',
            shape: '1', //形状
            elementObj: { 'spec': '1', 'state': '1', imgPath: '' }, //楼层元素对象
            elementImg: '',
            elementIsServer: false,
            elementId: '',
            floorSelects: [],
            exhibitionEleIdArrays: '', //批量删除的楼层元素ID集
            exhibitionEleIdArraysLen: 0,
            goodsListModelVisible: false
        }
    },
    mounted() {
        this.getFloorList();
        this.$nextTick(function() {
        });
    },
    methods: {
        // 选着商品, 设置信息
        getSelectedGoods(_goods) {
            this.elementObj.elementName = _goods.proTitle;
            this.elementObj.elementHint = _goods.proHitTitle;
            this.elementObj.imgPath = _goods.proSimg;
            this.elementImg = _goods.proSimg;
            this.elementIsServer = true;
            this.elementObj.resourceId = _goods.proCode;
            this.elementObj.link = '/upDetail';
            this.elementObj.sort = _goods.proSort != null ? _goods.proSort : 0;
        },
        // 关闭视图
        setGoodsVisible(flag) {
            this.goodsListModelVisible = flag;
        },
        //获取 楼层数据
        getFloorList: function() {
            var that = this;
            this.$http.get(that.baseUrl + '/exhibition/exhibitionOptions', { params: { token: this.token } }).then(function(res) {
                // console.log(res);
                if (!res) { return; }
                that.floorSelects = res.floorSelects;
                that.exhibitionKey = that.floorSelects[0].exhibitionId;
                that.getElementList();
            });
        },
        //通过楼层id  获取单个楼层元素列表  
        getElementList: function() {
            if (this.exhibitionKey == '') { return this.$message('请选择楼层') }
            var that = this;
            var params = {
                token: this.token,
                exhibitionKey: this.exhibitionKey,
                currentPage: this.currentPage,
                pageSize: this.pageSize
            }
            if (this.elementName != '') {
                params.elementName = this.elementName;
            }
            this.$http.get(that.baseUrl + '/exhibition/exhibitionElePageList', { params: params }).then(function(res) {
                if (!res) { return; }
                that.tableData = res.exhibitionEleList;
                that.total = res.exhibitionEleCount;
            });
        },
        //分页
        handlePaging: function(currentPage) {
            this.currentPage = currentPage;
            this.getElementList();
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
        // 上传图片
        handleUpload: function() {
            var inputFileObj = document.getElementById('uploadImg');
            var files = this.uploadImgFn(inputFileObj);
            this.beforeAvatarUpload(files.fileObj);
            this.elementObj.file = files.fileObj;
            this.elementImg = files.fileUrl;
            this.elementIsServer = false;
        },
        //管理搜索框
        handleManage: function(item) {
            if (item.elementId != null) {
                this.dialogTitle = '修改';
                this.exhibitionKey = item.exhibitionId;
                this.elementObj.exhibitionId = item.exhibitionId;
                this.elementObj.elementId = item.elementId;
                this.elementObj.resourceId = item.resourceId;
                this.elementObj.elementHint = item.elementHint;
                this.elementObj.elementName = item.elementName;
                this.elementObj.type = item.type;
                this.elementObj.link = item.link;
                this.elementObj.spec = item.spec;
                this.elementObj.sort = item.sort;
                this.elementObj.state = item.state;

                this.elementObj.imgPath = item.imgPath;
                this.elementImg = item.imgPath;
                this.elementIsServer = true;
            } else {
                if (!this.exhibitionKey) {
                    return this.$message('请选择楼层');
                }
                this.dialogTitle = '添加';
            }
            this.dialogVisible = true;
        },
        //获取单个详情
        // getDetail: function() {
        //     var that = this;
        //     this.$http.get(this.baseUrl + '/exhibition/exhibitionEleDetail', {
        //         params: { elementId: this.elementId, token: this.token }
        //     }).then(function(res) {
        //         if (!res) {return; }
        //         var eleObj = res.eleObj;
        //         that.elementObj.exhibitionId = eleObj.exhibitionId;
        //         that.elementObj.elementId = eleObj.elementId;
        //         that.elementObj.elementHint = eleObj.elementHint;
        //         that.elementObj.elementName = eleObj.elementName;
        //         that.elementObj.imgPath = eleObj.imgPath;
        //         that.elementObj.type = eleObj.type;
        //         that.elementObj.link = eleObj.link;
        //         that.elementObj.spec = eleObj.spec;
        //         that.elementObj.sort = eleObj.sort;
        //         that.elementObj.state = eleObj.state;
        //         console.log(that.elementObj)
        //     });
        // },
        //保存修改或保存添加
        handleSave: function() {
            if (!this.elementObj.elementName) {
                return this.$message('请输入元素名称');
            }
            if (!this.elementObj.elementHint) {
                return this.$message('请输入元素副标题');
            }
            if (!this.elementObj.resourceId) {
                return this.$message('请先选择商品');
            }
            if (!this.elementObj.link) {
                return this.$message('请输入元素链接');
            }
            if (!this.elementObj.sort) {
                return this.$message('请输入排序');
            }
            var that = this;
            var formData = new FormData();
            formData.append('token', this.token);
            formData.append('elementName', this.elementObj.elementName);
            formData.append('spec', this.elementObj.spec);
            formData.append('elementHint', this.elementObj.elementHint);
            formData.append('type', '1');
            formData.append('link', this.elementObj.link);
            formData.append('sort', parseInt(this.elementObj.sort));
            formData.append('state', this.elementObj.state);          
            formData.append('resourceId', this.elementObj.resourceId); //关联商品或品牌ID
            formData.append('exhibitionKey', this.exhibitionKey);
            var reqUrl;
            if (this.dialogTitle == '添加') {
                reqUrl = that.baseUrl + '/exhibitionBusi/exhibitionEleAdd';
                if (this.elementIsServer) {
                    formData.append('imgPath', this.elementObj.imgPath);
                }else{
                    if (!this.elementObj.file) {
                        return this.$message('请选择图片');
                    }
                    formData.append('file', this.elementObj.file);
                }
                formData.append('createBy', this.userInfo.userId);
            } else {
                reqUrl = that.baseUrl + '/exhibitionBusi/exhibitionEleUpd';
                if (this.elementIsServer) {
                    formData.append('imgPath', this.elementObj.imgPath);
                }else{
                    if (!this.elementObj.file) {
                        return this.$message('请选择图片');
                    }
                    formData.append('file', this.elementObj.file);
                }
                formData.append('elementId', this.elementObj.elementId);
                formData.append('updateBy', this.userInfo.userId);
            }
            this.$http.post(reqUrl, { formData: formData }).then(function(res) {
                if (!res) { return; }
                that.$message('保存成功');
                that.dialogVisible = false;
                that.getElementList();
                that.elementImg = '';
                that.currentPage = 1;
                that.elementObj = { 'spec': '1', 'state': '1' }; //楼层元素对象
                document.getElementById('uploadImg').value = '';
            });
        },
        //取消
        handleCancel: function() {
            this.dialogVisible = false;
            this.getElementList();
            this.elementImg = '';
            this.elementObj = { 'spec': '1', 'state': '1' }; //楼层元素对象
            document.getElementById('uploadImg').value = '';
        },
        //删除
        handleDelete: function(item) {
            var that = this;
            this.$confirm('确认删除吗').then(function() {
                that.$http.post(that.baseUrl + '/exhibitionBusi/exhibitionEleDel', { elementId: item.elementId, token: that.token }).then(function(res) {
                    if (!res) { return; }
                    if (!res.isDelExhibitionEle) {
                        return that.$message('删除失败');
                    }
                    that.$message('删除成功');
                    that.total--;
                    var maxPage = Math.ceil(that.total / that.pageSize);
                    if (that.total <= (that.currentPage * that.pageSize) && that.currentPage > maxPage && that.currentPage > 1) {
                        that.currentPage--;
                    }
                    that.getElementList();
                });
            })
        },
        handleSelection: function(val) {
            this.exhibitionEleIdArrays = '';
            this.exhibitionEleIdArraysLen = val.length;
            if (val.length > 0) {
                for (var i = 0; i < val.length; i++) {
                    if (i == 0) {
                        this.exhibitionEleIdArrays = val[0].elementId;
                    } else {
                        this.exhibitionEleIdArrays = this.exhibitionEleIdArrays + ',' + val[i].elementId;
                    }
                }
            }

        },
        //批量删除
        handleDeleteMany: function() {
            if (this.exhibitionEleIdArrays == '') {
                this.$message('请选择删除项');
                return;
            }
            var that = this;
            this.$confirm('确认删除吗').then(function() {
                that.$http.post(that.baseUrl + '/exhibitionBusi/exhibitionEleBatchDel', { exhibitionEleIdArrays: that.exhibitionEleIdArrays, token: that.token }).then(function(res) {
                    if (!res) { return; }
                    if (!res.isBatchDelExhibitionEle) {
                        return that.$message('删除失败');
                    }
                    that.$message('删除成功');
                    that.total = that.total - that.exhibitionEleIdArraysLen;
                    var maxPage = Math.ceil(that.total / that.pageSize);
                    if (that.total <= (that.currentPage * that.pageSize) && that.currentPage > maxPage && that.currentPage > 1) {
                        that.currentPage--;
                    }
                    that.getElementList();
                });
            })
        }
    }
}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style scoped>
@import url("./css/dialog.css");
.lineHeight {
    line-height: 1;
}

.goods-img {
    width: 50px;
    height: 50px;
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
