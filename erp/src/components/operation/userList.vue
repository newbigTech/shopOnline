<!-- 用户列表 -->
<template>
    <div class="salesmanFund">
        <v-breadcrumb firstMenu="运营中心管理" secondMenu="用户列表"></v-breadcrumb>
        <div class="nav">
            <div class="col-md-12">
                <div class="portlet box blue">
                    <div class="portlet-title" v-if="userInfo.userType == 0">
                        <div class="caption">用户列表</div>
                    </div>
                    <div class="portlet-body">
                        <div class="operate">
                            <v-selectCompany v-on:_returnResult="_getSelectID"></v-selectCompany>
                        </div>
                        <div class="operate">
                            <template v-if="userInfo.userType < 2">
                                <span>选择代理商：</span>
                                <el-select v-model="queryForm.agentID" placeholder="请选择" class="ml10" @change=" _agentSelect ">
                                    <el-option v-for="item, index in agentList" :key="item.id" :label="item.companyName" :value="item.id"> </el-option>
                                </el-select>
                            </template>
                            <span class="spanLeft">选择团队：</span>
                            <el-select v-model="queryForm.teamID" placeholder="请选择" class="ml10" @change=" _teamSelect ">
                                <el-option v-for="item, index in teamList" :key="item.id" :label="item.companyName" :value="item.id"> </el-option>
                            </el-select>
                            <span class="spanLeft">用户手机号：</span>
                            <div class="input-medium input-inline">
                                <el-input type="text" placeholder="请输入用户手机号" v-model="queryForm.phone" clearable> </el-input>
                            </div>
                            <button type="button" class="btn btn-success" @click=" _getTableData ">查询</button>
                        </div>
                        <div class="table-scrollable">
                            <el-table :data="tableData">
                                <el-table-column prop="nick_name" label="昵称"> </el-table-column>
                                <el-table-column prop="phone" label="手机号"> </el-table-column>
                                <el-table-column prop="register_type" label="注册来源">
                                    <template slot-scope="scope">
                                        <template v-if="scope.row.register_type == 1">微信注册</template>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="recommend_phone" label="推荐人手机"> </el-table-column>
                                <el-table-column prop="register_date" label="激活时间"> </el-table-column>
                                <el-table-column prop="" label="操作">
                                    <template slot-scope="scope">
                                        <a href="javascript:;" class="text-primary" @click=" _goMoneyDesc(scope.row.phone)"> 资金详情 </a>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <el-pagination layout="prev, pager, next" v-if="page.total > page.size" :page-size="page.size" :current-page="page.current" :total="page.total" v-on:current-change="_handlePaging"></el-pagination>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <el-dialog :title="model.title" :visible.sync="model.visible" width="70%" :before-close=" _closeModel " left>
            <div class="table-scrollable">
                <el-table :data="model.moneyData" height="400">
                    <el-table-column prop="trade_time" label="日期" width="200"> </el-table-column>
                    <el-table-column prop="phone" label="用户手机号"> </el-table-column>
                    <el-table-column prop="true_name" label="用户姓名"> </el-table-column>
                    <el-table-column prop="source_type" label="类型">
                        <template slot-scope="scope">
                            <template v-if="scope.row.source_type == 'amount'"> 现金 </template>
                            <template v-else-if="scope.row.source_type == 'point'"> 积分 </template>
                        </template>
                    </el-table-column>
                    <el-table-column prop="account_type" label="类型">
                        <template slot-scope="scope">
                            <template v-if="scope.row.source_type == 'amount'">
                                <template v-if="scope.row.account_type == 1">订单交易</template>
                                <template v-else-if="scope.row.account_type == 2">提现</template>
                                <template v-else-if="scope.row.account_type == 3">充值</template>
                                <template v-else-if="scope.row.account_type == 4">回收交易</template>
                                <template v-else-if="scope.row.account_type == 5">退货</template>
                            </template>
                            <template v-else-if="scope.row.source_type == 'point'">
                                <template v-if="scope.row.account_type == 1">订单交易</template>
                                <template v-else-if="scope.row.account_type == 2">邀请奖励</template>
                                <template v-else-if="scope.row.account_type == 3">积分抽奖</template>
                                <template v-else-if="scope.row.account_type == 4">抽奖获取</template>
                                <template v-else-if="scope.row.account_type == 5">积分兑换</template>
                                <template v-else-if="scope.row.account_type == 6">售后退回</template>
                                <template v-else-if="scope.row.account_type == 7">升级订单兑换</template>
                                <template v-else-if="scope.row.account_type == 8">取消退回</template>
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column prop="amount" label="金额(元)">
                        <template slot-scope="scope">
                            <template v-if="scope.row.source_type == 'amount'"><span class="text-success">¥</span><span class="text-success">{{scope.row.amount}}</span></template>
                        </template>
                    </el-table-column>
                    <el-table-column prop="account_amount" label="剩余金额(元)">
                        <template slot-scope="scope">
                            <template v-if="scope.row.source_type == 'amount'"><span class="text-success">¥</span><span class="text-success">{{scope.row.account_amount}}</span></template>
                        </template>
                    </el-table-column>
                    <el-table-column prop="amount" label="积分(积分)">
                        <template slot-scope="scope">
                            <template v-if="scope.row.source_type == 'point'"><span class="text-info">{{parseInt(scope.row.amount).toFixed(0)}}</span></template>
                        </template>
                    </el-table-column>
                    <el-table-column prop="account_amount" label="剩余积分(积分)">
                        <template slot-scope="scope">
                            <template v-if="scope.row.source_type == 'point'"><span class="text-info">{{parseInt(scope.row.account_amount).toFixed(0)}}</span></template>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination layout="prev, pager, next" v-if="model.total > model.size" :page-size="model.size" :current-page="model.current" :total="model.total" v-on:current-change="_handlePagingModel"></el-pagination>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click=" _handleExcel ">导 出</el-button>
                <el-button type="" @click=" _closeModel ">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import breadcrumb from '@/components/tool/breadcrumb' //面包屑     
import selectCompany from '@/components/tool/selectCompany' // 4级联动
export default {
    name: 'salesmanFund', // 结构名称
    data() {
        return {
            selectedID: '', // 4级联动需要的ID
            agentList: [], // 代理商列表
            teamList: [], // 团队列表
            queryForm: { agentID: '', teamID: '' }, // 查询表单 [ agent:代理商, team:团队 ]
            tableData: [], // 列表数据
            page: { total: null, current: 1, size: 10, }, // 列表分页
            finallyID: '', // 联动后最后的ID
            model: {
                visible: false,
                title: '资金流水',
                moneyData: [],
                total: null,
                current: 1,
                size: 10,
                phone: '',
            }
        }
    },
    components: {
        'v-breadcrumb': breadcrumb,
        'v-selectCompany': selectCompany
    },
    watch: {
        'selectedID': function(curVal, oldVal) {
            this.queryForm.agentID = curVal;
            var _that = this;
            if (this.userInfo.userType < 2) { // 获取代理商
                this.$http.get(this.baseUrl + '/erp/user/selectCompany', { params: { token: this.token, parentId: this.selectedID, type: 2 } }).then(function(res) {
                    if (!res) { return }
                    _that.agentList = res;
                    _that.agentList.unshift({ id: curVal, companyName: "全部" });
                });
            } else { // 获取团队
                this.queryForm.agentID = this.selectedID;
                this._agentSelect();
            }
            this.finallyID = curVal; // 查询ID => 4级联动ID
        },
    },
    created() {
        // 设置默认 查询ID
        this.selectedID = this.userInfo.id
    },
    mounted() {
        this.$nextTick(function() {});
    },
    methods: {
        // 获取四级联动的值
        _getSelectID(_val) {
            for (var _key in _val) {
                if (_val[_key] != null) { this.selectedID = _val[_key] }
            }
        },
        // 选择代理商 => 获取团队
        _agentSelect() {
            var _that = this;
            this.$http.get(this.baseUrl + '/erp/user/selectCompany', { params: { token: this.token, parentId: this.queryForm.agentID, type: 3 } }).then(function(res) {
                if (!res) { return; }
                _that.teamList = res;
                _that.teamList.unshift({ id: _that.queryForm.agentID, companyName: "全部" });
            });
            this.queryForm.teamID = this.queryForm.agentID;
            this.finallyID = this.queryForm.agentID; // 查询ID => 选择代理商ID
        },
        // 选择团队
        _teamSelect() {
            this.finallyID = this.queryForm.teamID; // 查询ID => 选择团队ID
        },
        // 获取列表
        _getTableData() {
            var that = this,
                params = { token: this.token, pageNum: this.page.current, pageSize: this.page.size, userId: this.finallyID }; // 查询手机号
            if (this.queryForm.phone != null) {
                this.page.current = 1;
                params.phone = this.queryForm.phone;
            }
            this.$http.get(this.baseUrl + '/erp/report/customerDetail', { params: params }).then(function(res) {
                if (!res) { return }
                that.page.total = res.total;
                that.tableData = res.list;
            })
        },
        // 分页-当前页面
        _handlePaging(_current) {
            this.page.current = _current;
            this._getTableData();
        },
        // 分页-当前页面
        _handlePagingModel(_current) {
            this.model.current = _current;
            this._goMoneyDesc(this.model.phone);
        },
        // 导出
        _handleExcel() {
            var downloadUrl = this.baseUrl + '/erp/report/customerFundDetail/export?';
            downloadUrl = downloadUrl + 'token=' + this.token;
            downloadUrl += '&' + 'userId=' + this.finallyID;
            downloadUrl += '&' + 'phone=' + this.model.phone;
            // 选择中的用户手机
            // if (this.model.phone) { downloadUrl += '&' + 'phone=' + this.model.phone; }
            window.open(downloadUrl);
        },
        // 查看资金流水
        _goMoneyDesc(_phone) {
            this.model.phone = _phone;
            this.model.visible = true;
            var _that = this;
            this.$http.post(this.baseUrl + '/erp/report/customerFundDetail', {
                token: this.token,
                phone: _phone,
                pageNum: this.model.current,
                pageSize: this.model.size,
            }).then(function(res) {
                if (!res) { return }
                _that.model.moneyData = res.list;
                _that.model.total = res.total;
            })
        },
        _closeModel() {
            this.model.visible = false
        }
    }
}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style scoped>
.operate {
    margin: 10px 0 20px 0;
}

.ml10 {
    margin-left: 10px;
}

.spanLeft {
    margin-right: 10px;
    margin-left: 10px;
}

.button-left {
    margin: 0 10px 0 30px;
}

</style>
