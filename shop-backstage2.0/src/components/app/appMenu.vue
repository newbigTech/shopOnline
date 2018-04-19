<!-- 菜单配置 -->
<template>
    <div class="templateName">
        <v-breadcrumb :firstMenu="breadcrumbs.first" :secondMenu="breadcrumbs.second"></v-breadcrumb>
        <div class="nav row">
            <div class="col-md-12">
                <div class="portlet box red">
                    <div class="portlet-title">
                        <div class="caption">{{breadcrumbs.second}}</div>
                    </div>
                    <div class="portlet-body">
                        <div class="operate">
                            <button type="button" class="btn btn-primary" @click=" _handleItem ">
                                {{tableData.length > 0 ? '编辑' : '添加' }}{{breadcrumbs.second}}
                            </button>
                        </div>
                        <div class="table-scrollable">
                            <el-table :data="tableData">
                                <el-table-column type="index" prop="" label=""> </el-table-column>
                                <el-table-column prop="paramOne" label="名称"> </el-table-column>
                                <el-table-column prop="" label="图片">
                                    <template slot-scope="scope">
                                        <img :src="scope.row.imgUrl" class="icon-img">
                                    </template>
                                </el-table-column>
                                <el-table-column prop="" label="创建时间">
                                    <template slot-scope="scope">
                                        {{formatDate(scope.row.createTime, 'time')}}
                                    </template>
                                </el-table-column>
                            </el-table>
                            <el-pagination layout="prev, pager, next" v-if=" page.total > page.size" :page-size=" page.size " :current-page=" page.current " :total=" page.total " v-on:current-change=" _paging"></el-pagination>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <el-dialog class="menuBox" ::title="breadcrumbs.second" width="34%" :visible.sync=" visible " @close=" visible = false " lock-scroll center>
            <div class="list-group">
                <div :class="['list-group-item '] + [index>1?'mt':'']" v-for="item, index in menuList" :key="index">
                    <h4 class="title">第{{index+1}}菜单</h4>
                    <div class="input-group">
                        <label class="input-group-addon">名称</label>
                        <input type="text" class="form-control" v-model="item.paramOne">
                    </div>
                    <div class="input-group">
                        <label class="input-group-addon">图片</label>
                        <div class="el-upload el-upload--picture-card" @click=" _upImg(index) ">
                            <i class="el-icon-plus" v-if="item.imgUrl == ''"></i>
                            <img :src="item.imgUrl" v-else>
                        </div>
                    </div>
                </div>
                <input ref="upFile" class="file" type="file" accept="image/jpeg" @change=" _upFile ">
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click=" _onSave ">确 定</el-button>
                <el-button @click="visible = false">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import breadcrumb from '@/components/tool/breadcrumb'
export default {
    name: 'templateName',
    components: { 'v-breadcrumb': breadcrumb },
    data() {
        return {
            breadcrumbs: { first: 'APP管理', second: '菜单配置' },
            page: { total: 1, size: 10, current: 1 },
            tableData: [],
            visible: false,
            imgFile: '',
            indexed: null,
            menuList: []
        }
    },
    created() {
        this._getData();
    },
    mounted() {
        this.$nextTick(function() {});
    },
    methods: {
        // 获取数据
        _getData() {
            var _that = this;
            this.$http.get(this.baseUrl + '/productCate/findConfiguration', {
                params: { configType: 4 }
            }).then(function(res) {
                if (!res) { return }
                _that.tableData = res.aList;
            })
        },
        // 分页
        _paging(_current) {
            this.page.current = _current;
            this._getData();
        },
        // 打开窗口
        _handleItem() {
            this.visible = true;
            if (this.tableData.length > 0) {
                this.menuList = [];
                for (var i = 0; i < this.tableData.length; i++) {
                    this.menuList.push({ imgUrl: this.tableData[i].imgUrl, paramOne: this.tableData[i].paramOne, id: this.tableData[i].id });
                }
            } else {
                for (var i = 0; i < 4; i++) {
                    this.menuList.push({ imgUrl: '', paramOne: '', id: '' })
                }
            }
        },
        // 点击上传
        _upImg(_index) {
            this.indexed = _index;
            this.$refs.upFile.click();
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
        _upFile(files) {
            var ev = event || window.event,
                elem = ev.currentTarget,
                imgElem = elem.nextElementSibling,
                files = this.uploadImgFn(elem),
                _that = this,
                formData = new FormData();
            this.beforeAvatarUpload(files.fileObj);
            formData.append("token", this.token);
            formData.append("filePathKey", 'appconfigImgPath '); //添加升级商品图片时
            formData.append("fileCategory", '1'); //1:单文件 2:多文件
            formData.append("file", files.fileObj); //多文件时，参数名为files： xx,files:xx...
            this.$http.post(this.baseUrl + '/upload/files', { formData: formData }).then(function(res) {
                if (!res) { return }
                _that.menuList[_that.indexed].imgUrl = res.path;
            });
        },
        _onSave() {
            var _that = this,
                formData = new FormData();
            formData.append("token", this.token);
            formData.append("configType", 4);
            formData.append("handleType", this.tableData.length > 0 ? 2 : 1);
            for (var i = 0; i < this.menuList.length; i++) {
                formData.append("appList["+i+"].imgUrl", this.menuList[i].imgUrl);
                formData.append("appList["+i+"].paramOne", this.menuList[i].paramOne);
                if (this.tableData.length>0) {
                    formData.append("appList["+i+"].id", this.menuList[i].id);                
                }
            }
            this.$http.post(this.baseUrl + '/app/appConfig', {
                formData: formData
            }).then(function(res) {
                console.log(res);
                if (!res) { return }
                _that.visible = false;
                _that._getData();
            })
        }
    }
}

</script>
<style type="text/css">
.menuBox h4.title {
    display: block;
    margin-bottom: 10px;
    text-align: center;
}

.menuBox .el-upload--picture-card {
    width: 100px;
    height: 100px;
    line-height: 98px;
}

.menuBox .el-upload--picture-card img {
    width: 100%;
    height: auto;
    max-height: 100%;
}

.menuBox .list-group-item {
    width: 50%;
    float: left;
}

.menuBox .list-group-item.mt {
    margin-top: 15px;
}

.menuBox .input-group~.input-group {
    margin-top: 15px;
}

.menuBox .input-group .input-group-addon {
    background: white;
    border: none;
}

.menuBox .list-group {
    margin-bottom: 0;
}

.menuBox .list-group:after {
    content: '';
    display: block;
    clear: both;
}

input.file {
    display: none;
}

</style>
<style scoped>
.icon-img {
    width: 120px;
    height: auto;
}

</style>
