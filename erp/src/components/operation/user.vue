<!-- 业务员管理 -->
<template>
    <div class="list">
        <v-breadcrumb firstMenu="运营中心管理" secondMenu="业务员管理"></v-breadcrumb>
        <div class="nav">
            <div class="col-sm-12">
                <div class="box blue portlet">
                    <div class="portlet-title">
                        <div class="caption">
                            <label class="center-block"> <!-- <i class="fa fa-users"></i> --> 业务员管理 </label>
                        </div>
                    </div>
                    <div class="portlet-body">
                        <div class="operate">
                            <span>名称：</span>
                            <div class="input-medium input-inline">
                                <el-input placeholder="请输入名称" v-model="selectedObj.indexName" clearable> </el-input>
                            </div>
                            <span>手机号：</span>
                            <div class="input-medium input-inline">
                                <el-input placeholder="请输入名称" v-model="selectedObj.phone" clearable> </el-input>
                            </div>
                            <span>状态：</span>
                            <el-select v-model="selectedObj.state" placeholder="请选择">
                                <el-option v-for="item in states" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                            </el-select>
                            <a href="JavaScript:;" class="btn btn-success" @click=" _getData ">查询</a>
                            <a href="JavaScript:;" class="btn btn-primary" @click=" _downFile ">导出</a>
                        </div>
                        <div class="table-scrollable" v-if="tableData.length > 0 ">
                            <el-table :data="tableData" style="width: 100%" height="500">
                                <el-table-column type="index" width="50" align="center"></el-table-column>
                                <!-- <el-table-column prop="companyName" label="所属上级：" align="center"> </el-table-column> -->
                                <el-table-column prop="idCardName" label="姓名" align="center"> </el-table-column>
                                <el-table-column prop="phone" label="手机号" align="center"> </el-table-column>
                                <el-table-column prop="createTimeStr" label="创建时间" align="center"> </el-table-column>
                                <el-table-column prop="parentCompanyName" label="创建者" align="center"> </el-table-column>
                                <el-table-column prop="customerNum" label="客户数">
                                    <template slot-scope="scope"> {{scope.row.customerNum != null? scope.row.customerNum: 0}} </template>
                                </el-table-column>
                                <el-table-column prop="state" label="状态">
                                    <template slot-scope="scope">
                                        <el-tooltip :content="scope.row.state == 2 ? '正常' : '冻结' " placement="top">
                                            <el-switch v-model="scope.row.state" active-color="#13ce66" inactive-color="#ff4949" :active-value="2" :inactive-value="3" @change="_editState(scope.row)"> </el-switch>
                                        </el-tooltip>
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作" width="90" align="right">
                                    <template slot-scope="scope">
                                        <a href="javascript:;" class="text-info" @click=" _openDoc(scope.row.id)" v-if="scope.row.userType != null "> 详情 </a>
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
    </div>
</template>
<script>
import breadcrumb from '@/components/tool/breadcrumb' //面包屑
export default {
    data() {
        return {
            tableData: [],
            selectType: '3', // 业务员等级
            page: { total: 10, size: 10, current: 1 },
            states: [{ label: '正常', value: '2' }, { label: '冻结', value: '3' }],
            selectedObj: { indexName: '', phone: '', state: '2', },
        }
    },
    components: {
        'v-breadcrumb': breadcrumb
    },
    watch: {
        '$route.query': function(val, oldVal) {
            this.pageQuery.id = val.id;
            this.selectType = '3';
            this._getData();
        }
    },
    created() {
        this.pageQuery = this.$route.query;
    },
    mounted() {
        this.$nextTick(function() {
            this._getData();
        });
    },
    methods: {
        _openDoc(_ID) {
            this.pageQuery.id = _ID;
            this.selectType = (parseInt(this.selectType) + 1);
            this._getData();
        },
        // 获取数据
        _getData() {
            var _that = this;
            var _params = {
                pageNum: this.page.current,
                pageSize: this.page.size,
                parentCompanyId: this.pageQuery.id,
                self: false,
                state: this.selectedObj.state,
                selectType: this.selectType
            }
            if (this.selectedObj.indexName != '') { _params.companyName = this.selectedObj.indexName }
            if (this.selectedObj.phone != '') { _params.phone = this.selectedObj.phone }
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
                (_item.state == 2 ? _item.state = 3 : _item.state = 2)
            });
        },
        // 下载
        _downFile() {
            var downloadUrl = this.baseUrl + '/erp/user/exportChildUserList?' +
                'token=' + this.token +
                '&selectType=' + this.selectType +
                '&parentCompanyId=' + this.pageQuery.id +
                '&self=false' +
                '&state=' + this.selectedObj.state;
            if (this.selectedObj.indexName != '') { downloadUrl = downloadUrl + '&companyName=' + encodeURI(this.selectedObj.indexName); }
            if (this.selectedObj.phone != '') { downloadUrl = downloadUrl + '&phone=' + this.selectedObj.phone; }
            window.location.href = encodeURI(downloadUrl);
        },
    }

}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style scoped>


</style>
