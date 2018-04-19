<!-- 运营中心管理 -->
<template>
    <div class="list">
        <v-breadcrumb firstMenu="运营中心管理" :secondMenu="userInfo.userLevelStr"></v-breadcrumb>
        <div class="nav">
            <div class="col-sm-12">
                <div class="box blue portlet">
                    <div class="portlet-title">
                        <div class="caption">
                            <label class="center-block"> <!-- <i class="fa fa-users"></i> --> {{userInfo.userLevelStr}}管理 </label>
                        </div>
                    </div>
                    <div class="portlet-body">
                        <div class="operate">
                            <v-selectCompany v-on:_returnResult="_getSelectCompany"></v-selectCompany>
                            <span>状态：</span>
                            <el-select v-model="selectedObj.state" placeholder="请选择">
                                <el-option v-for="item in states" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                            </el-select>
                            <span>范围：</span>
                            <el-select v-model="selectedObj.self" placeholder="请选择">
                                <el-option v-for="item in selfs" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                            </el-select>
                        </div>
                        <br>
                        <div class="operate">
                            <span>运营中心名称：</span>
                            <div class="input-medium input-inline">
                                <el-input placeholder="请输入名称..." v-model="selectedObj.indexName" clearable> </el-input>
                            </div>
                            <span>运营中心账号：</span>
                            <div class="input-medium input-inline">
                                <el-input placeholder="请输入账号..." v-model="selectedObj.indexAdmin" clearable> </el-input>
                            </div>
                            <a href="JavaScript:;" class="btn btn-success" @click=" _getData ">查询</a>
                            <a href="JavaScript:;" class="btn btn-primary" @click=" _downFile ">导出</a>
                            <a href="JavaScript:;" class="btn btn-danger" @click=" _addIndex ">新增</a>
                        </div>
                        <div class="table-scrollable" v-if="tableData.length > 0">
                            <el-table :data="tableData" style="width: 100%" height="500">
                                <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
                                <el-table-column prop="companyName" label="运营中心名称" align="center"> </el-table-column>
                                <el-table-column prop="phone" label="账号" align="center"> </el-table-column>
                                <el-table-column prop="idCardName" label="负责人" align="center"> </el-table-column>
                                <el-table-column prop="userLevelStr" label="级别" align="center"> </el-table-column>
                                <el-table-column prop="createTimeStr" label="创建时间" align="center"> </el-table-column>
                                <el-table-column prop="parentCompanyName" label="所属运营中心" align="center"> </el-table-column>
                                <el-table-column prop="stateStr" label="状态" align="center">
                                    <template slot-scope="scope">
                                        <el-tooltip :content="scope.row.state == 2 ? '正常' : '冻结' " placement="top">
                                            <el-switch v-model="scope.row.state" active-color="#13ce66" inactive-color="#ff4949" :active-value="2" :inactive-value="3" @change="_editState(scope.row)"> </el-switch>
                                        </el-tooltip>
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作" width="90" align="right">
                                    <template slot-scope="scope">
                                        <template v-if="userInfo.companyLevel == 0">
                                            <a href="javascript:;" class="text-primary" @click=" _openCompany(scope.row, 'price')"> 充值保证金 </a>
                                            <br>
                                            <a href="javascript:;" class="text-primary" @click=" _openCompany(scope.row, 'warning')"> 预警保证金 </a>
                                            <br>
                                            <a href="javascript:;" class="text-primary" @click=" _openCompany(scope.row, 'server')"> 服务费 </a>
                                            <br>
                                        </template>
                                        <a href="javascript:;" class="text-info" @click="$router.push({ name: 'operationCompany', query: { id: scope.row.id }})"> 代理商 </a>
                                        <br>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                        <div class="help-text" style="height:540px;margin-top: 2rem;" v-else>
                            <div class="jumbotron" style="">
                                <h4 class="help-text">您搜索的条件,未找到数据.请重新搜索.</h4>
                                <br/>
                                <h5>暂无数据...</h5>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-sm-12">
                                <el-pagination background layout="prev, pager, next" v-if="page.total > page.size" :page-size="page.size" :current-page="page.current" :total="page.total" v-on:current-change="_handlePaging"> </el-pagination>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <el-dialog :title="companyObj.title" :visible.sync="companyObj.visible" width="26%" @close=" _closeCompany ">
            <el-form ref="companyObj" :model="companyObj" :rules="rules" label-width="110px">
                <template v-if="companyObj.type=='server'">
                    <el-form-item label="服务费">
                        <el-input v-model="companyObj.server" placeholder="">
                            <template slot="append">%</template>
                        </el-input>
                    </el-form-item>
                </template>
                <template v-else>
                    <el-form-item label="运营中心名称">
                        <el-input v-model="companyObj.companyName" placeholder="" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="账号">
                        <el-input v-model="companyObj.phone" placeholder="" :disabled="true"></el-input>
                    </el-form-item>
                    <template v-if="companyObj.type == 'price'">
                        <el-form-item label="充值" prop="price">
                            <el-input type="number" min="10" v-model="companyObj.price" auto-complete="off"></el-input>
                        </el-form-item>
                    </template>
                    <template v-else-if="companyObj.type == 'warning'">
                        <el-form-item label="预警比列" prop="warning">
                            <el-input type="number" min="10" max="100" v-model="companyObj.warning" placeholder="">
                                <template slot="append">%</template>
                            </el-input>
                        </el-form-item>
                    </template>
                </template>
                <el-form-item>
                    <el-button type="success" @click=" _onSubmit('companyObj') ">提 交</el-button>
                    <el-button type="warning" @click=" _resetForm('companyObj') ">重 置</el-button>
                    <el-button type="number" @click=" _closeCompany ">取 消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <v-add-model :isShow='isShow' v-on:_setClose='_setClose' v-on:_setResult='_getResult'></v-add-model>
    </div>
</template>
<script>
import breadcrumb from '@/components/tool/breadcrumb' // 面包屑
import selectCompany from '@/components/tool/selectCompany' // 4级联动
import addCompanyModel from '@/components/operation/addCompany' // 添加窗口
export default {
    components: { 'v-breadcrumb': breadcrumb, 'v-selectCompany': selectCompany, 'v-add-model': addCompanyModel },
    data() {
        var validatePrice = (rule, value, callback) => {
            if (!this._isNumber(value)) { callback(new Error('请输入正确金额')) } else { if (value <= 0) { callback(new Error('请输入大于0的数')) } else if (value < 10) { callback(new Error('至少充值10元')) } }
        };
        var validateWarning = (rule, value, callback) => {
            if (!this._isNumber(value)) { callback(new Error('请输入正确比例')) } else { if (value <= 0) { callback(new Error('请输入大于0的数')) } else if (value < 10) { callback(new Error('至少为10')) } else if (value > 100) { callback(new Error('不能大于100')) } }
        };
        return {
            tableData: [],
            page: { total: 10, size: 10, current: 1 },
            states: [{ label: '正常', value: '2' }, { label: '冻结', value: '3' }],
            selfs: [{ label: '查下属', value: false }, { label: '查自身', value: true }],
            selectedObj: { self: true, state: '2', indexName: '', indexAdmin: '', id: null },
            isShow: false,
            companyObj: { title: '保证金管理', visible: false, type: null, price: null, companyName: null, phone: null, server: null, warning: null },
            rules: {
                price: [{ required: true, message: '数字不能为空', trigger: 'change' }, { validator: validatePrice, trigger: 'change' }],
                warning: [{ required: true, message: '比例不能为空', trigger: 'change' }, { validator: validateWarning, trigger: 'change' }]
            }
        }
    },
    created() {
        console.clear();
        this.selectedObj.id = this.userInfo.id;
    },
    mounted() {
        this.$nextTick(function() {
            this._getData();
        });
    },
    methods: {
        // 打开保证金窗口
        _openCompany(_item, _type) {
            console.log(_item);
            this.companyObj = { id: _item.id, visible: true, type: _type, companyName: _item.companyName, phone: _item.phone, price: null, warning: null, server: _item.service };
            switch (_type) {
                case 'price':
                    this.companyObj.title = '充值保证金';
                    break;
                case 'warning':
                    this.companyObj.title = '设置保证金预警比列';
                    this._getWarning(_item.id);
                    break;
                case 'server':
                    this.companyObj.title = '设置服务费';
                    break;
            }
        },

        // 获取预警比列
        _getWarning(_id) {
            var _that = this;
            this.$http.post(this.baseUrl + '/erp/user/query/warning', { userId: _id }).then(function(res) {
                if (!res) { return 0 }
                _that.companyObj.warning = res;
            })
        },

        // 提交, 校验数据
        _onSubmit(formName) {
            if (this.companyObj.type == 'price') {
                var value = this.companyObj.price;
                if (!this._isNumber(value)) { return this.$message('请输入正确金额') } else {
                    if (value <= 0) { return this.$message('请输入大于0的数') } else if (value < 10) { return this.$message('至少充值10元') }
                }
            } else if (this.companyObj.type == 'warning') {
                var value = this.companyObj.warning;
                if (!this._isNumber(value)) { return this.$message('请输入正确比例') } else {
                    if (value <= 0) { return this.$message('请输入大于0的数') } else if (value < 10) { return this.$message('至少为10') } else if (value > 100) {
                        return this.$message('不能大于100');
                    }
                }
            } else if (this.companyObj.type == 'server') {
                var value = this.companyObj.server;
                if (!this._isNumber(value)) { return this.$message('请输入正确比例') } else {
                    if (value <= 0) { return this.$message('请输入大于0的数') } else if (value < 10) { return this.$message('至少为10') } else if (value > 100) {
                        return this.$message('不能大于100');
                    }
                }
            }
            this._onSave();
            // var _that = this;
            // this.$refs[formName].validate((valid) => { if (valid) { _that._onSave() } else { return this.$message.error('请填写正确信息!') } });
        },
        // 提交数据, 充值保证金 和 设置 保证金比例
        _onSave() {
            var _that = this,
                _src, _params = { userId: this.companyObj.id };
            if (this.companyObj.type == 'price') {
                _src = '/erp/user/recharge/proxy';
                _params.proxy = this.companyObj.price;
            } else if (this.companyObj.type == 'warning') {
                _src = '/erp/user/update/waring';
                _params.waring = this.companyObj.warning;

            } else if (this.companyObj.type == 'server') {
                _src = '/erp/user/update/config';
                _params.service = this.companyObj.server
            }
            this.$http.post(this.baseUrl + _src, _params).then(function(res) {
                if (!res) { return }
                _that.companyObj.visible = false;
                _that._getData();
            });
        },
        // 重置表单
        _resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        // 关闭表单
        _closeCompany() {
            this.companyObj.visible = false;
        },
        // 获取四级联动 选中的值
        _getSelectCompany(_val) {
            this.selectedObj.id = _val.id;
        },
        // 获取|查询数据
        _getData() {
            var _that = this;
            var _params = { token: this.token, pageNum: this.page.current, pageSize: this.page.size, parentCompanyId: this.selectedObj.id, self: this.selectedObj.self, state: this.selectedObj.state, selectType: '1' }
            if (this.selectedObj.indexName != '') { _params.companyName = this.selectedObj.indexName }
            if (this.selectedObj.indexAdmin != '') { _params.phone = this.selectedObj.indexAdmin }
            this.$http.post(this.baseUrl + '/erp/user/selectChildUserList', _params).then(function(res) {
                if (!res) { return }
                _that.tableData = res.list;
                _that.page = { current: res.pageNum, size: res.pageSize, total: res.total };
            });
        },
        // 分页获取数据
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
                    _that._getData();
                })
            }).catch(() => {
                this.$message({ type: 'info', message: '已取消更改!' });
                console.log(_item.state);
                (_item.state == 2 ? _item.state = 3 : _item.state = 2)
            });
        },
        // 导出
        _downFile() {
            var downloadUrl = this.baseUrl + '/erp/user/exportChildUserList?' +
                'token=' + this.token +
                '&selectType=' + (parseInt(this.userInfo.userType) + 1) +
                '&parentCompanyId=' + this.selectedObj.id +
                '&self=' + this.selectedObj.self +
                '&state=' + this.selectedObj.state;
            if (this.selectedObj.indexName != '') { downloadUrl = downloadUrl + '&companyName=' + encodeURI(this.selectedObj.indexName); }
            if (this.selectedObj.indexAdmin != '') { downloadUrl = downloadUrl + '&phone=' + this.selectedObj.indexAdmin; }
            window.location.href = encodeURI(downloadUrl);
        },
        // 添加运营中心
        _addIndex() {
            this.isShow = true;
        },
        // 关闭窗口. 修改父级变量
        _setClose(_result) {
            this.isShow = _result;
        },
        _getResult(_result) {
            if (_result.state == 'success') {
                this._getData();
            }
        }
    }
}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style scoped></style>
