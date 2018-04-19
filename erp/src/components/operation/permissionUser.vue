<!-- 用户权限管理 -->
<template>
    <div class="list">
        <v-breadcrumb firstMenu="运营中心管理" secondMenu="用户权限管理"></v-breadcrumb>
        <div class="nav">
            <div class="col-sm-12">
                <div class="box blue portlet">
                    <div class="portlet-title">
                        <div class="caption">
                            <label class="center-block"> <!-- <i class="fa fa-users"></i> --> 用户权限管理 </label>
                        </div>
                    </div>
                    <div class="portlet-body">
                        <div class="operate">
                            <span>姓名：</span>
                            <div class="input-medium input-inline">
                                <el-input placeholder="请输入姓名" v-model="selectedObj.name" clearable> </el-input>
                            </div>
                            <span>手机号：</span>
                            <div class="input-medium input-inline">
                                <el-input placeholder="请输入手机号" v-model="selectedObj.phone" clearable> </el-input>
                            </div>
                            <span>状态：</span>
                            <el-select v-model="selectedObj.state" placeholder="请选择">
                                <el-option v-for="item in states" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                            </el-select>
                            <a href="JavaScript:;" class="btn btn-success" @click=" _getData ">查询</a>
                            <a href="JavaScript:;" class="btn btn-warning" @click=" _resetSelected ">重置</a>
                            <!-- <a href="JavaScript:;" class="btn btn-primary" @click=" _downFile ">导出</a> -->
                            <a href="JavaScript:;" class="btn btn-danger" @click=" _addIndex ">新增</a>
                        </div>
                        <div class="table-scrollable">
                            <el-table :data="tableData" style="width: 100%" height="500">
                                <el-table-column prop="id" width="50" align="center"></el-table-column>
                                <el-table-column prop="id_card_name" label="姓名"> </el-table-column>
                                <el-table-column prop="phone" label="手机号"> </el-table-column>
                                <el-table-column prop="company_name" label="所属单位"> </el-table-column>
                                <el-table-column prop="state" label="状态">
                                    <template slot-scope="scope">
                                        <template v-if="scope.row.state == 2 || scope.row.state == 3">
                                            <el-tooltip :content="scope.row.state == 2 ? '正常' : '冻结' " placement="top">
                                                <el-switch v-model="scope.row.state" active-color="#13ce66" inactive-color="#ff4949" :active-value="2" :inactive-value="3" @change="_editState(scope.row)"> </el-switch>
                                            </el-tooltip>
                                        </template>
                                        <template v-else-if="scope.row.state == 4">
                                            已删除
                                        </template>
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作" width="90" align="right">
                                    <template slot-scope="scope">
                                        <template v-if="scope.row.state != 4">
                                            <a href="javascript:;" class="text-info" @click=" _openEditAdmin(scope.row) "> 权限设置 </a>
                                            <br>
                                            <a href="javascript:;" class="text-warning" @click=" _delectAdmin(scope.row)"> 删除 </a>
                                            <br>
                                        </template>
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
        <el-dialog title="权限设置" :visible.sync="perTree.visible" width="30%" :before-close=" _closeTreeModel " center>
            <div class="permission-box">
                <el-input placeholder="请输入关键字进行过滤" v-model="perTree.filter"> </el-input>
                <el-tree ref="perTree" node-key="menu_id" show-checkbox :filter-node-method="_treeFilter" :data="perTree.list" :default-expanded-keys="[ 114, 118, 121, 123, 132, 138]" :props="perTree.props"> </el-tree>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click=" _actionTreeModel ">确 定</el-button>
                <el-button type="" @click=" _closeTreeModel ">取 消</el-button>
            </div>
        </el-dialog>
        <el-dialog title="添加子账户" :visible.sync="createObj.visible" width="30%" :before-close=" _handleClose " center>
            <el-form ref="createObj" :model="createObj" :rules="rules" label-width="110px">
                <el-form-item label="登录账户" prop="phone">
                    <el-input v-model="createObj.phone" placeholder="请输入账户..."></el-input>
                </el-form-item>
                <el-form-item label="登录密码" prop="password">
                    <el-input v-model="createObj.password" placeholder="" type="password" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="confirmPassword">
                    <el-input v-model="createObj.confirmPassword" placeholder="" type="password" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="createObj.name" placeholder="请输入姓名..."></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click=" _actionAdminModel('createObj') ">确 定</el-button>
                <el-button type="warning" @click=" _resetForm('createObj') ">重 置</el-button>
                <el-button type="" @click=" _handleClose ">取 消</el-button>
            </div>
        </el-dialog>
        <el-dialog title="下属角色与用户迁移" :visible.sync="delObj.visible" width="16%" :before-close=" _closeDeleModel " center>
            <div class="demo-input-suffix">
                继承用户
                <el-autocomplete class="inline-input" v-model="delObj.name" :fetch-suggestions=" _querySearch " placeholder="请输入用户姓名..." @select="_handleSelect"></el-autocomplete>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click=" _actionDel ">确 定</el-button>
                <el-button type="" @click=" _closeDeleModel ">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import breadcrumb from '@/components/tool/breadcrumb' //面包屑
export default {
    components: { 'v-breadcrumb': breadcrumb },
    data() {
        // 手机号校验
        var validatePhone = (rule, value, callback) => {
            if (value === '') { callback(new Error('请输入手机号')) } else {
                if (!this._isPhone(value)) { callback(new Error('请输入正确的手机号')) }
                var _that = this;
                this.$http.post(this.baseUrl + '/erp/user/check/phone', { phone: this.createObj.phone }).then(function(res) {
                    if (!res) { return }
                    if (!res.state) { callback(new Error(res.message)) } else {
                        callback();
                    }
                });
            }
        };
        // 输入密码
        var validatePassWord = (rule, value, callback) => {
            if (value === '' || value == null) {
                callback(new Error('请输入密码'));
            } else {
                callback();
            }
        };
        // 确认密码
        var validateConfirmPassword = (rule, value, callback) => {
            if (value === '' || value == null) {
                callback(new Error('请再次输入密码'));
            } else if (value != this.createObj.password) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
        // 中文校验
        var validateChinese = (rule, value, callback) => {
            if (value === '') { callback(new Error('请输入负责人姓名')) } else {
                if (!this._isChinese(value)) { callback(new Error('请输入中文')) }
                callback();
            }
        };
        return {
            tableData: [], // 用户数组
            page: { total: 10, size: 10, current: 1 }, // 页面分页
            states: [{ label: '全部', value: '' }, { label: '正常', value: '2' }, { label: '冻结', value: '3' }, { label: '删除', value: '4' }], // 状态
            selectedObj: { name: '', phone: '', state: '' }, // 搜索对象
            createObj: { // 添加用户
                visible: false,
                id: null,
                phone: null,
                password: null,
                confirmPassword: null,
                name: null,
                companyName: null,
            },
            rules: {
                phone: [
                    { required: true, validator: validatePhone, trigger: 'blur' }
                ],
                name: [
                    { required: true, validator: validateChinese, trigger: 'blur' }
                ],
                password: [
                    { required: true, validator: validatePassWord, trigger: 'blur' },
                    // { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
                ],
                confirmPassword: [
                    { required: true, validator: validateConfirmPassword, trigger: 'blur' }
                ],
                companyName: [
                    { required: true, message: '请输入角色', trigger: 'change' },
                    // { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
                ]
            },
            perTree: { // 权限菜单
                id: null,
                visible: false,
                filter: '',
                list: [],
                props: { children: 'children', label: 'label', id: 'id' },
            },
            delObj: {
                visible: false,
                name: '',
                upId: null,
                id: null,
            },
            inheritUser: [],
        }
    },
    watch: {
        "perTree.filter": function(val, oldVal) {
            this.$refs.perTree.filter(val);
        }
    },
    mounted() {
        this._getData(); // 获取表格数据
        this._getPerTreeData(); // 获取可用树菜单
        this.$nextTick(function() {
            // console.log('created', this.inheritUser);
        });
    },
    methods: {
        // 筛选树结构
        _treeFilter(value, data) {
            if (!value) return true;
            return data.menu_name.indexOf(value) !== -1;
        },
        // 重置搜索表单
        _resetSelected() { this.selectedObj = { name: '', phone: '', state: '' } },
        // 获取 用户数据
        _getData() {
            var _that = this,
                _params = { userId: this.userInfo.id, pageNum: this.page.current, pageSize: this.page.size }
            if (this.selectedObj.name != '') { _params.name = this.selectedObj.name }
            if (this.selectedObj.state != '') { _params.state = this.selectedObj.state }
            if (this.selectedObj.phone != '') { _params.phone = this.selectedObj.phone }
            this.$http.post(this.baseUrl + '/erp/user/findListUserById', _params).then(function(res) {
                if (!res) { return }
                _that.tableData = res.list;
                _that.page = { current: res.pageNum, size: res.pageSize, total: res.total };
            });
        },
        // 分页 获取数据
        _handlePaging(_current) {
            this.page.current = _current;
            this._getData();
        },
        // 修改状态
        _editState(_item) {
            var _that = this;
            this.$confirm('是否更改状态？').then(() => {
                this.$http.post(this.baseUrl + '/erp/user/update/state', { state: _item.state, userId: _item.id }).then(function(res) {
                    if (!res) { return }
                    _that.$message({ type: 'success', message: '更改成功!' });
                    _that._getData();
                })
            }).catch(() => {
                this.$message({ type: 'info', message: '已取消更改!' });
                (_item.state == 2 ? _item.state = 3 : _item.state = 2)
            });
        },
        // 获取权限菜单[所有可用]
        _getPerTreeData() {
            var _that = this;
            this.$http.post(this.baseUrl + '/erp/user/findMenu', { userId: this.userInfo.id }).then(function(res) {
                if (!res) { return }
                _that.perTree.list = res;
                _that.perTree.props = { children: 'children', label: 'menu_name' };
            });
        },
        // 打开 编辑权限 => 获取点击用户已经选中权限
        _openEditAdmin(_item) {
            var _that = this,
                _selectedData = [];
            this.perTree.id = _item.id;
            this.perTree.visible = true;
            this.$http.post(this.baseUrl + '/erp/user/selectCurrentMenu', { userId: _item.id }).then(function(res) {
                if (!res) { return }
                for (var i = 0; i < res.length; i++) { _selectedData.push(res[i].menu_id) }
                _that.$refs.perTree.setCheckedKeys(_selectedData);
            });
        },
        // 提交 设置用户可用权限
        _actionTreeModel() {
            this.$prompt('请输入登录密码', '', { confirmButtonText: '确定', cancelButtonText: '取消', inputType: 'password' }).then(({ value }) => {
                var _that = this;
                this.$http.post(this.baseUrl + '/erp/menu/checkPwd', { userId: this.userInfo.id, pwd: value }).then(function(res) {
                    if (!res) { return }
                    _that._onSaveTree();
                })
            }).catch(() => {
                this.$message({ type: 'info', message: '放弃提交修改内容' });
            });
        },
        _onSaveTree() {
            var _that = this;
            this.$http.post(this.baseUrl + '/erp/menu/insertUserMenu', { userId: this.perTree.id, menuId: this.$refs.perTree.getCheckedKeys() }).then(function(res) {
                if (!res) { return }
                _that.perTree.visible = false;
                _that.$message({ type: 'success', message: '已设置成功' });
                _that._getData();
            });
        },
        // 关闭权限设置窗口
        _closeTreeModel(done) {
            this.perTree.id = null;
            this.perTree.visible = false;
            this.$message({ type: 'info', message: '已取消设置' });
            // this.$confirm('是否取消权限设置？').then(() => {
            // }).catch(() => {});
        },
        // 添加团队
        _addIndex() {
            this.createObj = { visible: true, id: null, phone: null, password: null, name: null, companyName: null };
        },
        // 提交, 校验数据
        _actionAdminModel(formName) {
            var _that = this;
            this.$refs[formName].validate((valid) => {
                if (valid) { _that._onSave() } else { return this.$message.error('请填写正确信息!') }
            });
        },
        // 保存添加f
        _onSave() {
            var _that = this;
            this.$http.post(this.baseUrl + '/erp/user/addUser', { userId: this.userInfo.id, phone: this.createObj.phone, password: this.createObj.password, name: this.createObj.name, companyName: this.createObj.name }).then(function(res) {
                if (!res) { return }
                _that.createObj.visible = false;
                _that._getData();
            })
        },
        // 重置添加表单
        _resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        // 关闭添加子窗口
        _handleClose(done) {
            this.$confirm('是否取消添加业务员？').then(() => {
                this.createObj.visible = false;
                this.$message({ type: 'info', message: '已取消添加' });
            }).catch(() => {});
        },
        // 删除询问框
        _delectAdmin(_item) {
            this.$confirm('是否删除业务员？', '提示').then(() => {
                this._downUserList(_item); // 获取可继承用户
            }).catch(() => {
                this.$message({ type: 'info', message: '放弃删除业务员' });
            });
        },
        // 加载可继承用户
        _downUserList(_item) {
            var _that = this,
                _params = { userId: this.userInfo.id, delUserId: _item.id };
            if (this.delObj.name != '') { _params.name = this.delObj.name }
            this.$http.post(this.baseUrl + '/erp/user/findListUserByName', _params).then(function(res) {
                if (!res) { return [] }
                for (var i = 0; i < res.length; i++) { _that.inheritUser.push({ 'value': res[i].id_card_name, "id": res[i].id }) }
                _that.delObj = { visible: true, name: '', upId: null, id: _item.id };
            });
        },
        // 模糊搜索,建议
        _querySearch(queryString, cb) {
            this.inheritUser.filter(this.createFilter(queryString));
            var restaurants = this.inheritUser;
            var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        // 检索反应
        createFilter(queryString) {
            var restaurant = this.inheritUser;
            return (restaurant) => {
                return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
            };
        },
        // 删除弹框 下拉选中
        _handleSelect(_item) {
            console.log(_item);
            this.delObj.upId = _item.id;
            // var _that = this;
            // this.$http.post(this.baseUrl + '/erp/user/updateParentInfo', {
            //     delUserId: this.delObj.id,
            //     updateUserId: this.delObj.upId
            // }).then(function(res) {
            //     console.log(res);
            //     if (!res) { return }
            //     _that.delObj = { visible: false, name: '', upId: null, id: null };
            //     _that.$message({ type: 'success', message: '删除成功' });
            //     return _that._getData();
            // });
        },
        _actionDel() {
            var _that = this;
            this.$http.post(this.baseUrl + '/erp/user/updateParentInfo', {
                delUserId: this.delObj.id,
                updateUserId: this.delObj.upId
            }).then(function(res) {
                console.log(res);
                if (!res) { return }
                _that.delObj = { visible: false, name: '', upId: null, id: null };
                _that.$message({ type: 'success', message: '删除成功' });
                return _that._getData();
            });
        },
        // 关闭删除
        _closeDeleModel() {
            this.delObj.visible = false;
            this.$message({ type: 'info', message: '取消删除' });
        }
    }

}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style scoped>
.permission-box {
    height: 500px;
    overflow-y: auto;
}

</style>
