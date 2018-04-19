<!-- 楼层编辑 -->
<template>
    <div class="floorEdit">
        <v-breadcrumb firstMenu="首页" secondMenu="品牌楼层编辑"></v-breadcrumb>
        <div class="nav row">
            <div class="col-md-12">
                <div class="portlet box red">
                    <div class="portlet-title">
                        <div class="caption">品牌直供</div>
                    </div>
                    <div class="portlet-body">
                        <div class="operate">
                            <span>品牌名称：</span>
                            <input type="text" class="form-control input-inline" placeholder="元素名称" v-model="selectForm.name">
                            <button type="button" class="btn btn-success" @click=" _selectData ">查询</button>
                        </div>
                        <div class="operate">
                            <button type="button" class="btn btn-primary" @click=" _handleBrand() ">添加</button>
                            <button type="button" class="btn btn-danger" @click=" _handleBrandDelete ">批量删除</button>
                        </div>
                        <div class="table-scrollable">
                            <el-table :data="tableData" @selection-change=" _handleSelection ">
                                <el-table-column type="selection" width="50"></el-table-column>
                                <el-table-column prop="brandOrder" sortable label="排序" width="80"> </el-table-column>
                                <el-table-column prop="brandName" label="品牌名称"> </el-table-column>
                                <el-table-column prop="homeBanner" label="首页品牌图" width="280" align="center">
                                    <template slot-scope="scope">
                                        <img :src="scope.row.homeBanner" class="brand-img" />
                                    </template>
                                </el-table-column>
                                <el-table-column prop="detailBanner" label="详情品牌图" width="280" align="center">
                                    <template slot-scope="scope">
                                        <img :src="scope.row.detailBanner" class="brand-img" />
                                    </template>
                                </el-table-column>
                                <el-table-column prop="createUser" label="创建人" align="center"> </el-table-column>
                                <el-table-column prop="createTime" label="创建时间" align="center">
                                    <template slot-scope="scope">
                                        {{formatDate(scope.row.createTime, 'time')}}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="isView" label="是否显示" align="center">
                                    <template slot-scope="scope">
                                        <span v-if="scope.row.state==1"> 显示 </span>
                                        <span v-else-if="scope.row.state==0"> 不显示 </span>
                                        <span v-else></span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="" label="操作" width="200" align="right">
                                    <template slot-scope="scope">
                                        <span class="btn default btn-xs purple" @click=" _handleBrand(scope.row) "> 修改 </span>
                                        <span class="btn default btn-xs red" @click=" _handleDelete(scope.row.id) "> 删除 </span>
                                        <span class="btn default btn-xs green" @click=" _lookBrandGoodsList(scope.row) "> 商品列表 </span>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <el-pagination layout="prev, pager, next" v-if="page.total > page.size" :page-size="page.size" :current-page="page.current" :total="page.total" v-on:current-change=" _handlePaging "></el-pagination>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <el-dialog :title="brandForm.title" width="30%" :visible.sync="brandForm.visible" @close=" _handleCancel ">
            <div class="dialog-con">
                <div class="dialog-item">
                    <div class="col-md-3 ta-right">品牌名称：</div>
                    <div class="col-md-9">
                        <input type="text" placeholder="请输入品牌名称..." v-model="brandForm.name" />
                    </div>
                </div>
                <div class="dialog-item row">
                    <div class="col-md-3 ta-right">首页品牌图：</div>
                    <div class="col-md-9 lineHeight">
                        <div class="rowScoped">
                            <div :class="['col-md-3 '] + [brandForm.indexBanner != '' ? '': 'hide']">
                                <ul class="el-upload-list el-upload-list--picture-card">
                                    <li tabindex="0" class="lineHeight el-upload-list__item is-success" style="" @click="$refs.indexBanner.click()">
                                        <img :src="brandForm.indexBanner" class="el-upload-list__item-thumbnail " v-if="brandForm.indexBanner!=''">
                                        <a class="el-upload-list__item-name">
                                            <i class="el-icon-document"></i>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div tabindex="0" :class="['el-upload el-upload--picture-card '] + [brandForm.indexBanner == '' ? '': 'hide']" @click="$refs.indexBanner.click()">
                            <i class="el-icon-plus"></i>
                            <input type="file" name="file" class="el-upload__input" ref="indexBanner" id="indexBanner" @change=" _handleUpload('index') " />
                        </div>
                    </div>
                </div>
                <div class="dialog-item row">
                    <div class="col-md-3 ta-right">详情品牌图：</div>
                    <div class="col-md-9 lineHeight">
                        <div class="rowScoped">
                            <div :class="['col-md-3 '] + [brandForm.detailsBanner != '' ? '': 'hide']">
                                <ul class="el-upload-list el-upload-list--picture-card">
                                    <li tabindex="0" class="lineHeight el-upload-list__item is-success" style="" @click="$refs.detailsBanner.click()">
                                        <img :src="brandForm.detailsBanner" class="el-upload-list__item-thumbnail " v-if="brandForm.detailsBanner!=''">
                                        <a class="el-upload-list__item-name">
                                            <i class="el-icon-document"></i>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div tabindex="0" :class="['el-upload el-upload--picture-card '] + [brandForm.detailsBanner == '' ? '': 'hide']" @click="$refs.detailsBanner.click()">
                            <i class="el-icon-plus"></i>
                            <input type="file" name="file" class="el-upload__input" ref="detailsBanner" id="detailsBanner" @change=" _handleUpload('details') " />
                        </div>
                    </div>
                </div>
                <div class="dialog-item">
                    <div class="col-md-3 ta-right">详情链接：</div>
                    <div class="col-md-9">
                        <input type="text" placeholder="请输入链接地址" v-model="brandForm.link" />
                    </div>
                </div>
                <div class="dialog-item">
                    <div class="col-md-3 ta-right">排序：</div>
                    <div class="col-md-9">
                        <input type="number" class="input-small" placeholder="排序" v-model="brandForm.sort" />
                    </div>
                </div>
                <div class="dialog-item">
                    <div class="col-md-3 ta-right">是否显示：</div>
                    <div class="col-md-9">
                        <el-radio-group v-model="brandForm.state">
                            <el-radio label="1">显示</el-radio>
                            <el-radio label="0">不显示</el-radio>
                        </el-radio-group>
                    </div>
                </div>
            </div>
            <div class="dialog-btm ta-center">
                <button type="button" class="btn btn-primary" @click=" _handleSave ">保存</button>
                <button type="button" class="btn btn-default" @click=" _handleCancel ">取消</button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import breadcrumb from '@/components/tool/breadcrumb' //面包屑 
export default {
    name: 'floorEdit',
    components: {
        'v-breadcrumb': breadcrumb
    },
    data() {
        return {
            tableData: [],
            page: { total: 0, current: 1, size: 10 },
            selectForm: { name: '' },
            brandForm: { id: null, title: '添加品牌', visible: false, name: '', indexBanner: '', detailsBanner: '', link: '', sort: '', state: '1' },
            delectBrand: [],
        }
    },
    mounted() {
        this._selectData();
    },
    methods: {
        // 查询列表数据
        _selectData() {
            var _that = this,
                _params = { token: this.token, pageNum: this.page.current, pageSize: this.page.size }
            if (this.selectForm.name != '') {
                _params.brandName = this.selectForm.name;
            }
            this.$http.get(this.baseUrl + '/brand/findBrands', {
                params: _params
            }).then(function(res) {
                if (!res) { return }
                _that.tableData = res.orderList;
                _that.page = { total: res.total, size: res.pageSize, current: res.pageNum };
            }).catch(function(error) {
                // console.log("%c 品牌 => 查询数据 %c " + error, "color:green", 'color:red');
            });
        },
        // 分页查询
        _handlePaging(_current) {
            this.page.current = _current;
            this._selectData();
        },
        // 添加|修改品牌
        _handleBrand(_brand) {
            // console.log(_brand);
            if (_brand != null) {
                this.brandForm = { id: _brand.id, title: '修改品牌', visible: true, name: _brand.brandName, indexBanner: _brand.homeBanner, detailsBanner: _brand.detailBanner, link: _brand.detailBannerUrl, sort: _brand.brandOrder, state: _brand.state.toString() };
            } else {
                this.brandForm = { id: null, title: '添加品牌', visible: true, name: '', indexBanner: '', detailsBanner: '', link: '', sort: '0', state: '1' };
            }
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
        _handleUpload(_type) {
            var inputFileObj,
                _that = this,
                formData = new FormData();
            if (_type == 'index') {
                inputFileObj = this.$refs.indexBanner;
            } else {
                inputFileObj = this.$refs.detailsBanner;
            }
            var files = this.uploadImgFn(inputFileObj);
            this.beforeAvatarUpload(files.fileObj);
            formData.append("token", this.token);
            formData.append("filePathKey", 'appconfigImgPath ');
            formData.append("fileCategory", '1');
            formData.append("file", files.fileObj);
            this.$http.post(this.baseUrl + '/upload/files', { formData: formData }).then(function(res) {
                if (!res) { return }
                if (_type == 'index') {
                    _that.brandForm.indexBanner = res.path;
                } else {
                    _that.brandForm.detailsBanner = res.path;
                }
            });
        },
        // 保存品牌信息
        _handleSave() {
            var _that = this,
                _src,
                _params = {
                    brandName: this.brandForm.name,
                    homeBanner: this.brandForm.indexBanner,
                    detailBanner: this.brandForm.detailsBanner,
                    detailBannerUrl: this.brandForm.link,
                    state: this.brandForm.state,
                }
            if (this.brandForm.sort != null) {
                if (this.brandForm.sort < 0) {
                    return this.$message('排序只能为正整数');
                }
                _params.brandOrder = this.brandForm.sort;
            }
            if (this.brandForm.name == '') {
                return this.$message('请输入品牌名称');
            }
            if (this.brandForm.indexBanner == '') {
                return this.$message('请上传首页品牌图');
            }
            if (this.brandForm.detailsBanner == '') {
                return this.$message('请上传详情品牌图');
            }
            if (this.brandForm.link == '') {
                return this.$message('请输入品牌详情链接地址');
            }
            if (this.brandForm.id != null) {
                _src = this.baseUrl + '/brand/updateBrand';
                _params.id = this.brandForm.id;
            } else {
                _src = this.baseUrl + '/brand/addBrand';
                _params.createUser = this.userInfo.username;
            }
            this.$http.post(_src, _params).then(function(res) {
                if (!res) { return }
                _that._handleCancel();
                _that._selectData();
            }).catch(function(error) {
                // console.log("%c 品牌 => " + (this.brandForm.id != null ? '修改' + this.brandForm.id : '添加') + "品牌 %c " + error, "color:green", 'color:red');
            });
        },
        // 关闭品牌编辑弹框
        _handleCancel() {
            this.brandForm = { id: null, title: '添加品牌', visible: false, name: '', indexBanner: '', detailsBanner: '', link: '', sort: '0', state: '1' };
        },
        // 列表 选中行
        _handleSelection(_val) {
            this.delectBrand = [];
            for (var i = 0; i < _val.length; i++) {
                this.delectBrand.push(_val[i].id);
            }
            // console.log(_val, this.delectBrand);
        },
        // 删除品牌[批量]
        _handleBrandDelete() {
            if (this.delectBrand.length == 0) {
                return this.$message('请选择删除项');
            } else {
                var that = this;
                this.$confirm('确认删除吗').then(function() {
                    that.$http.post(that.baseUrl + '/brand/deleteBrand', { ids: that.delectBrand, token: that.token }).then(function(res) {
                        if (!res) { return; }
                        that.$message('删除成功');
                        that._selectData();
                    }).catch(function(error) {
                        // console.log("%c 品牌 => 删除品牌 %c " + error, "color:green", 'color:red');
                    });
                });
            }
        },
        // 删除品牌
        _handleDelete(ID) {
            this.delectBrand = [];
            this.delectBrand.push(ID);
            this._handleBrandDelete();
        },
        // 查看品牌商品列表
        _lookBrandGoodsList(_item) {
            this.$router.push({ name: 'FindBrandGoods', query: { id: _item.id, name: _item.brandName } });
        },
    }
}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style scoped>
@import url("./css/dialog.css");
.lineHeight {
    min-height: 60px;
    max-height: 90px;
    overflow: hidden;
    line-height: 1;
}

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
