<!-- 权限列表 -->
<template>
    <div class="list">
        <v-breadcrumb firstMenu="运营中心管理" secondMenu="权限列表"></v-breadcrumb>
        <div class="nav">
            <div class="col-sm-12">
                <div class="box blue portlet">
                    <div class="portlet-title">
                        <div class="caption">
                            <label class="center-block"> <!-- <i class="fa fa-users"></i> --> 权限列表 </label>
                        </div>
                    </div>
                    <div class="portlet-body">
                        <div class="operate">
                            <span>菜单名称：</span>
                            <div class="input-medium input-inline">
                                <el-input placeholder="请输入名称" v-model="selectForm.menuName" clearable> </el-input>
                            </div>
                            <a href="JavaScript:;" class="btn btn-success" @click=" _actionSelect ">查询</a>
                            <a href="JavaScript:;" class="btn btn-info" @click=" _addIndex ">新增</a>
                        </div>
                        <div class="table-scrollable" v-if="tableData.length > 0">
                            <el-table :data="tableData" style="width: 100%" height="560">
                                <el-table-column prop="menuId" width="50" label="ID"> </el-table-column>
                                <el-table-column prop="menuOrder" width="50" label="排序"> </el-table-column>
                                <el-table-column prop="menuName" label="菜单名称"> </el-table-column>
                                <el-table-column prop="menuUrl" label="菜单链接"> </el-table-column>
                                <el-table-column prop="parentId" label="上一级菜单编号"> </el-table-column>
                                <el-table-column prop="" label="父|子菜单">
                                    <template slot-scope="scope">
                                        <span class="text-info" v-if="scope.row.isParent == 1">父菜单</span>
                                        <span class="" v-if="scope.row.isLeaf == 1">子菜单</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="状态" width="" align="center">
                                    <template slot-scope="scope">
                                        <template v-if="scope.row.status == 1"> 正常 </template> <template v-else> 冻结 </template>
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作" width="90" align="right">
                                    <template slot-scope="scope">
                                        <a href="javascript:;" class="text-success" @click=" _headleEdit(scope.row)"> 修改 </a>
                                        <br>
                                        <a href="javascript:;" class="text-info" @click=" _headleDelete(scope.row) "> 删除 </a>
                                        <br>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                        <div class="row">
                            <div class="col-sm-12">
                                <el-pagination background layout="prev, pager, next" v-if="page.total > page.size" :page-size="page.size" :current-page="page.current" :total="page.total" v-on:current-change="_handlePaging">
                                </el-pagination>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 弹出框 -->
        <el-dialog :title=" menuObj.isNew + '菜单'" :visible.sync="menuVisible" width="30%" @close=" menuVisible = false">
            <div class="col-sm-10 col-sm-offset-1">
                <form class="form-horizontal">
                    <div class="form-group">
                        <label class="col-sm-3 control-label" for="menuName">菜单名称：</label>
                        <div class="col-sm-9">
                            <input type="text" class="form-control" id="menuName" v-model="menuObj.menuName" placeholder="请输入菜单名称...">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-3 control-label" for="menuUrl">菜单链接：</label>
                        <div class="col-sm-9">
                            <input type="text" class="form-control" id="menuUrl" v-model="menuObj.menuUrl" placeholder="请输入菜单链接...">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-3 control-label" for="menuOrder">排序：</label>
                        <div class="col-sm-9">
                            <input type="text" class="form-control" id="menuOrder" v-model="menuObj.menuOrder" placeholder="请输入排序...">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-3 control-label" for="status">状态：</label>
                        <div class="col-sm-9">
                            <el-radio v-model="menuObj.status" :label="invalidStatus">冻结</el-radio>
                            <el-radio v-model="menuObj.status" :label="normalStatus">正常</el-radio>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-3 control-label" for="menuData">父菜单：</label>
                        <div class="col-sm-9">
                            <el-select v-model="selected">
                                <el-option v-for="item, index in menuData " :key="item.menuId" :value="item.menuName"> {{ item.menuName }} </el-option>
                            </el-select>
                        </div>
                    </div>
                </form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click=" _handleSave ">确 定</el-button>
                <el-button @click=" menuVisible = false ">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import breadcrumb from '@/components/tool/breadcrumb' //面包屑
export default {
    name: '',
    data() {
        return {
            menuVisible: false,
            tableData: [],
            menuData: [],
            selectForm: { menuName: '', menuNumber: '' },
            invalidStatus: '冻结',
            normalStatus: '正常',
            menuObj: { isNew: '添加', menuName: '', menuUrl: '', menuOrder: '', status: '正常', parentId: '' },
            selected: '',
            page: { total: 1, size: 10, current: 1 }
        }
    },
    watch: {
        'selected': function(val, oldVal) {
            for (var i = 0; i < this.menuData.length; i++) {
                if (this.menuData[i].menuName == val) {
                    this.menuObj.parentId = this.menuData[i].menuId;
                }
            }
        }
    },
    components: {
        'v-breadcrumb': breadcrumb
    },
    mounted() {
        this.$nextTick(function() {
            this._getData();
            this._getMenu();
        });
    },
    methods: {
        // 获取数据
        _getData(_menuName) {
            var _that = this,
                _params = {
                    pageNum: this.page.current,
                    pageSize: this.page.size,
                    token: this.token
                }
            if (_menuName != undefined) { _params.menuName = _menuName }
            this.$http.post(this.baseUrl + '/erp/menu/select', _params).then(function(res) {
                if (!res) { return }
                _that.tableData = res.list;
                _that.page = { current: res.pageNum, size: res.pageSize, total: res.total };
            });
        },
        // 分页
        _handlePaging(_current) {
            this.page.current = _current;
            this._getData();
        },
        // 获取所有父级菜单
        _getMenu() {
            var _that = this;
            this.$http.post(this.baseUrl + '/erp/menu/findParent', { token: this.token }).then(function(res) {
                if (!res) { return }
                _that.menuData = res;
            })
        },
        // 查询菜单
        _actionSelect() { this._getData(this.selectForm.menuName) },

        // 添加菜单
        _addIndex() {
            this.menuVisible = true; // 显示窗口
            this.selected = ''; // 下拉选项为空
            this.menuObj = { isNew: '添加', menuId: '', menuName: '', menuUrl: '', menuOrder: '', status: '正常', parentId: '' }; // 添加菜单默认对象
        },
        // 修改菜单
        _headleEdit(_obj) {
            this.menuVisible = true; // 显示窗口
            this.menuObj = { isNew: '修改', menuId: _obj.menuId, menuName: _obj.menuName, menuUrl: _obj.menuUrl, menuOrder: _obj.menuOrder, status: (_obj.status == 1 ? '正常' : '冻结'), parentId: _obj.parentId }; // 修改菜单默认对象
            for (var i = 0; i < this.menuData.length; i++) {
                if (_obj.parentId == this.menuData[i].menuId) { this.selected = this.menuData[i].menuName } // 设置下拉选项值
            }
        },
        _handleSave() {
            var _that = this,
                _src,
                _params = {
                    menuName: this.menuObj.menuName,
                    menuUrl: this.menuObj.menuUrl,
                    menuOrder: this.menuObj.menuOrder,
                    status: (this.menuObj.status == '正常' ? 1 : 2),
                    isParent: (this.menuObj.parentId == '' ? 1 : 0),
                    isLeaf: (this.menuObj.parentId == '' ? 0 : 1),
                    parentId: this.menuObj.parentId,
                }
            if (this.menuObj.menuId == '') { _src = '/erp/menu/add'; } else {
                _src = '/erp/menu/update';
                _params.menuId = this.menuObj.menuId;
            }
            this.$http.post(this.baseUrl + _src, _params).then(function(res) {
                if (!res) { return }
                _that.menuVisible = false;
                _that._getData();
                _that.$message({ type: 'success', message: _that.menuObj.isNew + '成功!' });
            });
        },
        // 删除菜单
        _headleDelete(_obj) {
            var _that = this;
            this.$confirm('是否删除菜单？').then(() => {
                this.$http.post(this.baseUrl + '/erp/menu/delete', {
                    menuId: _obj.menuId
                }).then(function(res) {
                    if (!res) { return }
                    _that._getData();
                });
            }).catch(() => {
                this.$message({ type: 'info', message: '已取消删除' });
            });
        }
    }
}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style scoped>


</style>
