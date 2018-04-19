<!-- 订单管理 -售后-->
<template>
    <div class="order">
        <v-breadcrumb firstMenu="订单" secondMenu="售后"></v-breadcrumb>
        <div class="nav row">
            <div class="col-md-12">
                <div class="portlet box red">
                    <div class="portlet-title">
                        <div class="caption">售后订单列表</div>
                    </div>
                    <div class="portlet-body">
                        <div class="operate">
                            <span>订单时间：</span>
                            <el-date-picker v-model="selectDate" type="month" placeholder="选择日期"></el-date-picker>
                            <span>订单状态：</span>
                            <select class="form-control input-small input-inline" v-model="selectForm.status">
                                <option value="">全部</option>
                                <option value="0">待处理</option>
                                <option value="1">等待退货</option>
                                <option value="2">等待收货</option>
                                <option value="3">待退款</option>
                                <option value="4">已退款</option>
                                <option value="5">撤销</option>
                            </select>
                            <span>订单编号：</span>
                            <div class="input-medium input-inline">
                                <el-input placeholder="请输入订单编号" v-model="selectForm.id" clearable> </el-input>
                            </div>
                            &nbsp;&nbsp;
                            <button type="button" class="btn btn-success" @click="_selectData">查询</button>
                        </div>
                        <div class="table-scrollable">
                            <el-table :data="tableData" ref="tableDataShow" highlight-current-row @selection-change="_handleCurrentChange">
                                <el-table-column type="index" width="50" align="center"></el-table-column>
                                <el-table-column prop="ordersNo" label="订单编号"></el-table-column>
                                <el-table-column prop="applyTime" label="申请时间">
                                    <template slot-scope="scope"> {{formatDate(scope.row.applyTime, 'time')}} </template>
                                </el-table-column>
                                <el-table-column prop="exchangeNo" label="退货编号"></el-table-column>
                                <el-table-column prop="exchangeType" label="退货状态">
                                    <template slot-scope="scope">
                                        <!-- {{scope.row.checkState}} {{scope.row.exchangeStatus}} -->
                                        <span class="state btn-info" v-if="scope.row.checkState == 0"> 待审核</span>
                                        <span class="state btn-success" v-if="scope.row.checkState == 1"> 通过</span>
                                        <span class="state btn-danger" v-if="scope.row.checkState == 2"> 拒绝</span>
                                        <span v-if="scope.row.exchangeStatus == 0"> 待处理</span>
                                        <span v-if="scope.row.exchangeStatus == 1"> 等待退货</span>
                                        <span v-if="scope.row.exchangeStatus == 2"> 等待收货</span>
                                        <span v-if="scope.row.exchangeStatus == 3"> 待退款</span>
                                        <span v-if="scope.row.exchangeStatus == 4"> 已退款</span>
                                        <span v-if="scope.row.exchangeStatus == 5"> 撤销</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="详情">
                                    <template slot-scope="scope">
                                        <a href="javascript:;" class="btn default btn-xs blue" @click="_handleDetail(scope.row)">详情 </a>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="" label="操作" width="200">
                                    <template slot-scope="scope">
                                        <div v-if="scope.row.checkState == 0 && scope.row.exchangeStatus != 5">
                                            <a href="javascript:;" @click="_openSuccessBox(scope.row)" class="btn default btn-xs purple">同意 </a>
                                            <a href="javascript:;" @click="_openErrorBox(scope.row)" class="btn default btn-xs red">拒绝</a>
                                        </div>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                        <el-pagination layout="prev, pager, next" v-if="page.total > page.size" :page-size="page.size" :current-page="page.num" :total="page.total" v-on:current-change="_handlePaging"></el-pagination>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import breadcrumb from '@/components/tool/breadcrumb' //面包屑

export default {
    name: 'order',
    components: {
        'v-breadcrumb': breadcrumb
    },
    data() {
        return {
            tableData: [],
            currentRow: null,
            selectDate: null,
            selectForm: { id: '', year: '', month: '', status: '' },
            page: { size: 10, num: 1, total: 0 }
        }
    },
    mounted() {
        this._getData();
    },
    methods: {
        // 根据条件 搜索
        _selectData() {
            console.log(this.selectDate);
            if (this.selectDate == null || this.selectDate == "") {
                this.selectForm.year = "";
                this.selectForm.month = "";
            } else {
                this.selectForm.year = new Date(this.selectDate).getFullYear();
                this.selectForm.month = new Date(this.selectDate).getMonth() + 1;
            }
            this.page.num = 1;
            this._getData();
            // this.selectForm = { id: '', year: '', month: '', status: '' };
        },
        // 获取数据
        _getData: function() {
            var _that = this;
            this.$http.get(this.baseUrl + '/back/exchangeOrder/findUsersExchangeList', {
                params: {
                    token: this.token,
                    pageSize: this.page.size,
                    pageNum: this.page.num,
                    ordersNo: this.selectForm.id,
                    year: this.selectForm.year,
                    month: this.selectForm.month,
                    exchangeStatus: this.selectForm.status,
                }
            }).then(function(res) {
                if (!res) { return }
                _that.tableData = res.aatList;
                _that.page = { size: res.pageSize, num: res.pageNum, total: res.total };
            })
        },
        // 分页
        _handlePaging: function(currentPage) {
            this.page.num = currentPage;
            this._getData();
        },
        // 设置表格中样式
        _setCurrent: function(row) {
            this.$refs.tableDataShow.setCurrentRow(row);
        },
        // 表格点击,
        _handleCurrentChange: function(val) {
            this.currentRow = val;
        },
        // 订单详情
        _handleDetail: function(_item) {
            this.$router.push({
                name: 'afterSalesDetail',
                query: {
                    no: _item.exchangeNo
                }
            })
        },
        // 同意询问框
        _openSuccessBox: function(_item) {
            let _hander;
            const _c = this.$createElement;
            if (_item.exchangeType == "1") { _hander = "退货"; }
            if (_item.exchangeType == "2") { _hander = "换货"; }
            if (_item.exchangeType == "3") { _hander = "退款"; }
            this.$msgbox({
                title: '请确认同意' + _hander,
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                message: _c('div', null, [
                    _c('ul', null, [
                        _c('li', null, '订单内容:'),
                        _c('li', { style: 'margin: .5em 0 .5rem 2em' }, '商品: ' + _item.productName),
                        _c('li', { style: 'margin: .5em 0 .5rem 2em' }, '颜色: ' + _item.proColorName),
                        _c('li', { style: 'margin: .5em 0 .5rem 2em' }, '尺码: ' + _item.proSizesName),
                        _c('li', { style: 'margin: .5em 0 .5rem 2em' }, '时间: ' + _item.applyTime),
                        _c('li', { style: 'margin: .5em 0 .5rem 2em' }, '金额: ' + _item.refundAmount),
                    ]),
                    _c('p', { style: 'margin-button: 15px;' }, [
                        _c('span', null, '您是否'),
                        _c('i', { style: 'color: #3598dc; font-style: normal; margin: 0 5px;' }, '同意'),
                        _c('span', null, '该笔订单的'),
                        _c('i', { style: 'color: #cb5a5e; font-style: normal; margin: 0 5px;' }, _hander),
                        _c('span', null, '处理?'),
                    ]),
                ]),
                // beforeClose: (action, instance, done) => {
                //     if (action === 'confirm') {
                //         instance.confirmButtonLoading = true;
                //         instance.confirmButtonText = '执行中...';
                //         setTimeout(() => {
                //             done();
                //             setTimeout(() => { instance.confirmButtonLoading = false; }, 300)
                //         }, 3000);
                //     } else {
                //         done();
                //         this.$message({ message: '取消订单[' + _item.ordersNo + '] ' + _hander + ' 操作', type: 'warning' });
                //     }
                // }
            }).then(action => {
                var _that = this;
                this.$http.post(this.baseUrl + '/back/exchangeOrder/auditExchangeOrder', {
                    token: this.token,
                    userId: this.userInfo.userId,
                    exchangeNo: _item.exchangeNo,
                    checkState: 1,
                }).then(function(res) {
                    if (!res) { return }
                    _that.$message({ type: 'success', message: '售后单号[' + _item.exchangeNo + '], ' + _hander + '提交成功' });
                    _that._getData();
                });
            }).catch(() => {
                this.$message({ type: 'info', message: '已取消操作' });
            });
        },
        // 拒绝询问框
        _openErrorBox: function(_item) {
            var _temp = '';
            let _hander;
            const _c = this.$createElement;
            if (_item.exchangeType == "1") { _hander = "退货"; }
            if (_item.exchangeType == "2") { _hander = "换货"; }
            if (_item.exchangeType == "3") { _hander = "退款"; }
            this.$msgbox({
                // this.$prompt(
                title: '请确认拒接' + _hander,
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                showInput: true,
                inputType: 'text',
                inputValue: '',
                // inputPattern:  /^[\s]{0,}$|^[\w\s]{7,}$/g,
                // inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
                // inputErrorMessage: '邮箱格式不正确',
                // inputErrorMessage: '请去掉多余空格',
                message: _c('div', null, [
                    _c('ul', null, [
                        _c('li', null, '订单内容:'),
                        _c('li', { style: 'margin: .5em 0 .5rem 2em; line-height: 1.6rem;' }, '商品: ' + _item.productName),
                        _c('li', { style: 'margin: .5em 0 .5rem 2em; line-height: 1.6rem;' }, '颜色: ' + _item.proColorName),
                        _c('li', { style: 'margin: .5em 0 .5rem 2em; line-height: 1.6rem;' }, '尺码: ' + _item.proSizesName),
                        _c('li', { style: 'margin: .5em 0 .5rem 2em; line-height: 1.6rem;' }, '时间: ' + _item.applyTime),
                        _c('li', { style: 'margin: .5em 0 .5rem 2em; line-height: 1.6rem;' }, '金额: ' + _item.refundAmount),
                    ]),
                    _c('p', { style: 'margin-button: 15px;' }, [
                        _c('span', null, '您确定'),
                        _c('i', { style: 'color: #3598dc; font-style: normal; margin: 0 5px;' }, '拒绝'),
                        _c('span', null, '该笔订单的'),
                        _c('i', { style: 'color: #cb5a5e; font-style: normal; margin: 0 5px;' }, _hander),
                    ]),
                    _c('p', { style: 'margin-button: 15px;' }, [
                        _c('span', { style: 'color: #3598dc; font-style: normal; margin-right: 5px;' }, '拒绝理由:'),
                    ]),
                ]),
                // beforeClose: (action, instance, done) => {
                //     if (action === 'confirm') {
                //         instance.confirmButtonLoading = true;
                //         instance.confirmButtonText = '执行中...';
                //         setTimeout(() => {
                //             done();
                //             setTimeout(() => { instance.confirmButtonLoading = false; }, 300)
                //         }, 3000);
                //     } else {
                //         done();
                //         this.$message({ message: '取消订单[' + _item.ordersNo + '] ' + _hander + ' 操作', type: 'warning' });
                //     }
                // }
            }).then(({ value }) => {
                console.log('then', value);
                var _that = this;
                this.$http.post(this.baseUrl + '/back/exchangeOrder/auditExchangeOrder', {
                    token: this.token,
                    userId: this.userInfo.userId,
                    exchangeNo: _item.exchangeNo,
                    refuseReason: value,
                    checkState: 2,
                }).then(function(res) {
                    if (!res) { return }
                    _that.$message({ type: 'success', message: '售后单号[' + _item.exchangeNo + '], ' + _hander + '提交成功' });
                    _that._getData();
                });
            }).catch(() => {
                console.log('catch', _temp);
                this.$message({ type: 'info', message: '已取消操作' });
            });
        }
    }
}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style>
table span.state {
    text-align: center;
    font-weight: 500;
    margin-right: 1rem;
    width: 5rem;
    display: inline-block;
}

.goods-img {
    width: 100px;
    height: 50px;
}

.operate span {
    margin-left: 10px;
}

.operate span.el-input__prefix {
    margin-left: 0px;
}

.portlet-body .operate * {
    vertical-align: middle;
}

.portlet-body .operate .el-date-editor * {
    line-height: 1;
}

</style>
