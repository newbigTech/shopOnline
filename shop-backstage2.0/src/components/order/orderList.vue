<!-- 订单列表 =>[普通订单管理] -->
<template>
    <div class="orderList">
        <v-breadcrumb firstMenu="订单" secondMenu="订单列表"></v-breadcrumb>
        <div class="nav row">
            <div class="col-md-12">
                <div class="portlet box red">
                    <div class="portlet-title">
                        <div class="caption">订单列表</div>
                    </div>
                    <div class="portlet-body">
                        <div class="operate">
                            <form class="form-inline">
                                <div class="form-group">
                                    <span>订单编号：</span>
                                    <div class="input-medium input-inline">
                                        <el-input placeholder="请输入订单编号" v-model="selectForm.totalOrderNo" clearable> </el-input>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <span>归属代理：</span>
                                    <div class="input-medium input-inline">
                                        <el-input placeholder="请输入代理" v-model="selectForm.proxyName" clearable> </el-input>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <span>订单状态：</span>
                                    <select class="form-control input-small input-inline" v-model="selectForm.ordersState">
                                        <option value="">全部</option>
                                        <option value="1">待发货 </option>
                                        <option value="2">已发货</option>
                                        <option value="3">已退货 </option>
                                        <option value="4">已收货</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    &nbsp;&nbsp;
                                    <button type="button" class="btn btn-primary" @click="_selectData">查询</button>
                                </div>
                            </form>
                            <br>
                            <div class="['collapse in']" id="collapseExample">
                                <form class="form-inline">
                                	<!--<div class="form-group">
                                        <span>商品名称：</span>
                                        <div class="input-medium input-inline">
                                            <el-input placeholder="请输入商品名称" v-model="selectForm.goodsName" clearable> </el-input>
                                        </div>
                                    </div>-->
                                    <div class="form-group">
                                        <span>用户手机：</span>
                                        <div class="input-medium input-inline">
                                            <el-input placeholder="请输入用户手机号" v-model="selectForm.acceptPhone" clearable> </el-input>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <span>订单时间：</span>
                                        <el-date-picker v-model="selectDate" type="daterange" start-placeholder="开始日期"
                                        	 end-placeholder="结束日期" value-format="yyyy-MM-dd" @change="datePicker"></el-date-picker>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div class="table-scrollable">
                            <el-table :data="tableData" ref="tableDataShow" highlight-current-row >
                                <el-table-column type="index" width="50" align="center"></el-table-column>
                                <el-table-column prop="customerCode" label="用户ID"></el-table-column>
                                <el-table-column prop="totalOrderNo" label="订单编号"></el-table-column>
                                <el-table-column prop="payTime" label="付款时间" width="100">
                                    <template slot-scope="scope"> {{ formatDate(scope.row.payTime) }} </template>
                                </el-table-column>
                                <el-table-column prop="acceptUser" label="收货人"></el-table-column>
                                <el-table-column prop="acceptPhone" label="手机号"></el-table-column>
                                <!--<el-table-column prop="goodsName" label="商品名称"></el-table-column>-->
                                <el-table-column prop="freight" label="运费(元)"> </el-table-column>
                                <el-table-column prop="finalAmount" label="实付金额(元)"></el-table-column>
                                <el-table-column prop="type" label="状态" align="center">
                                    <template slot-scope="scope">
                                        <span v-if="scope.row.type == 1"> 待发货  </span>
                                        <span v-if="scope.row.type == 2"> 已发货  </span>
                                        <span v-if="scope.row.type == 3"> 已退货  </span>
                                        <span v-if="scope.row.type == 4"> 已收货  </span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="proxyName" label="归属代理"></el-table-column>
                                <el-table-column prop="" label="操作" width="130">
                                    <template slot-scope="scope">
                                        <!--<a href="javascript:;" @click="_openDelivery(scope.row)" class="btn btn-sm btn-success">发货</a>-->
                                        <a href="javascript:;" @click="_openDetails(scope.row)" class="btn btn-sm btn-primary">详情</a>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                        <el-pagination layout="prev, pager, next" v-if="page.total > page.size" :page-size="page.size" :current-page="page.num"
                        	 :total="page.total" v-on:current-change="_handlePaging"></el-pagination>
                    </div>
                </div>
            </div>
        </div>
        <el-dialog title="普通商品订单详情" :visible.sync="goodsVisible" v-if="newData != null" center>
            <h4>快递信息</h4>
            <div class="form-horizontal col-sm-12">
                <div class="form-group col-sm-4 ">
                    <label class="col-sm-5 control-label">订单编号:</label>
                    <div class="col-sm-7">
                        <p class="form-control-static">{{newData.ordersNo}}</p>
                    </div>
                </div>
                <div class="form-group col-sm-4 ">
                    <label class="col-sm-5 control-label">快递公司:</label>
                    <div class="col-sm-7">
                        <p class="form-control-static" v-if="newData.logisticsCompany != null">{{newData.logisticsCompany}}</p>
                        <p class="form-control-static" v-else>暂无</p>
                    </div>
                </div>
                <div class="form-group col-sm-4 ">
                    <label class="col-sm-5 control-label">快递单号:</label>
                    <div class="col-sm-7">
                        <p class="form-control-static" v-if="newData.logisticsNumber != null">{{newData.logisticsNumber}}</p>
                        <p class="form-control-static" v-else>暂无</p>
                    </div>
                </div>
            </div>
            <h4>收货信息</h4>
            <div class="form-horizontal col-sm-12">
                <div class="form-group col-sm-4 ">
                    <label class="col-sm-5 control-label">收件人:</label>
                    <div class="col-sm-7">
                        <p class="form-control-static">{{newData.acceptName}}</p>
                    </div>
                </div>
                <div class="form-group col-sm-4 ">
                    <label class="col-sm-5 control-label">收件人手机:</label>
                    <div class="col-sm-7">
                        <p class="form-control-static" v-if="newData.acceptPhone != null">{{newData.acceptPhone}}</p>
                        <p class="form-control-static" v-else>暂无</p>
                    </div>
                </div>
                <div class="form-group col-sm-4 ">
                    <label class="col-sm-5 control-label">详细地址:</label>
                    <div class="col-sm-7">
                        <p class="form-control-static" v-if="newData.acceptAdress != null">{{newData.acceptAdress}}</p>
                        <p class="form-control-static" v-else>暂无</p>
                    </div>
                </div>
            </div>
            <h4>用户信息</h4>
            <div class="form-horizontal col-sm-12">
                <div class="form-group col-sm-4 ">
                    <label class="col-sm-5 control-label">用户姓名:</label>
                    <div class="col-sm-7">
                        <p class="form-control-static" v-if="newData.trueName != null">{{newData.trueName}}</p>
                        <p class="form-control-static" v-else>暂无</p>
                    </div>
                </div>
                <div class="form-group col-sm-4 ">
                    <label class="col-sm-5 control-label">用户昵称:</label>
                    <div class="col-sm-7">
                        <p class="form-control-static" v-if="newData.nickName != null">{{newData.nickName}}</p>
                        <p class="form-control-static" v-else>暂无</p>
                    </div>
                </div>
                <div class="form-group col-sm-4 ">
                    <label class="col-sm-5 control-label">用户手机号:</label>
                    <div class="col-sm-7">
                        <p class="form-control-static" v-if="newData.phone != null">{{newData.phone}}</p>
                        <p class="form-control-static" v-else>暂无</p>
                    </div>
                </div>
            </div>
            <h4>商品信息</h4>
            <el-table :data="newDatas">
                <el-table-column property="proSimg" label="商品图片">
                    <template slot-scope="scope">
                        <img :src="scope.row.proSimg" class="img-goods" :alt="scope.row.proName" width="50px" height="50px">
                    </template>
                </el-table-column>
                <el-table-column property="proName" label="商品名称"></el-table-column>
                <el-table-column property="productPrice" label="单价(元)"></el-table-column>
                <el-table-column property="procount" label="数量"></el-table-column>
                <el-table-column property="proSizesName" label="尺寸/大小"></el-table-column>
                <el-table-column property="proColorName" label="颜色"></el-table-column>
                <el-table-column property="countMoney" label="小计(元)" width="140"></el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button class="btn btn-primary" @click=" _closeVisible ">关 闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import breadcrumb from '@/components/tool/breadcrumb' //面包屑
export default {
    name: 'orderList',
    components: {
        'v-breadcrumb': breadcrumb
    },
    data() {
        return {
            selectDate: null,
            selectForm: { acceptPhone: '', totalOrderNo: '', goodsName: '', ordersState: '', startTime: '', endTime: '', proxyName: '' },
            page: { size: 10, num: 1, total: 0 },
            tableData: [],
            newData: null,
            newDatas: [],
            goodsVisible: false,
            messageVisible: false
        }
    },
    mounted() {
        this.$nextTick(function() {
            this._getData();
        });
    },
    methods: {
        // 日期选择器
        datePicker() {
            if (this.selectDate) {
                this.selectForm.startTime = this.selectDate[0];
                this.selectForm.endTime = this.selectDate[1];
            } else {
                this.selectForm.startTime = null;
                this.selectForm.endTime = null;
            }
        },
        // 获取数据 - 订单列表
        _getData() {
        	var params = {
				pageNum: this.page.num,
				pageSize: this.pageSize
			},
			that = this,
			reqUrl = this.baseUrl + '/generalorder/findordersPage';
			if(this.selectDate != null) {
				params.startTime = this.selectForm.startTime;
				params.endTime = this.selectForm.endTime;
			}
			if(this.selectForm.ordersState != '') {
				params.ordersState = this.selectForm.ordersState;
			}
			if(this.selectForm.acceptPhone != '') {
				params.acceptPhone = this.selectForm.acceptPhone;
			}
			if(this.selectForm.totalOrderNo != '') {
				params.totalOrderNo = this.selectForm.totalOrderNo;
			}
			if(this.selectForm.proxyName != '') {
				params.proxyName = this.selectForm.proxyName;
			}
//			if(this.selectForm.goodsName != '') {
//				params.goodsName = this.selectForm.goodsName;
//			}
			this.$http.get(reqUrl, {params: params}).then(function(res) {
				if(!res) {
					return;
				}
				that.tableData = res.orderList;
				that.page.total = res.total;
 			});
        },
        // 分页
        _handlePaging(currPage) {
        	this.page.num = currPage;
        	this._getData();
        },
        // 查询数据
        _selectData() {
            this.page.num = 1;
            this._getData();
        },
        // 选中行
        _handleCurrentChange() {},
        // 打开详情
        _openDetails(_order) {
        	//获取订单详情
        	var params = { totalOrderNo: _order.totalOrderNo },
				that = this,
				reqUrl = this.baseUrl + '/generalorder/findOrderInfo';
			this.$http.get(reqUrl, {params: params}).then(function(res) {
				if(!res) {
					return;
				}
				that.goodsVisible = true;
				that.newData = res.orderInfo;
				var newDatas = res.proInfoList;
				for(var i = 0;i < newDatas.length;i++) {
					var obj = newDatas[i];
					obj.countMoney = that.NumberMul(obj.productPrice, obj.procount);
				}
				that.newDatas = newDatas;
 			});
        },
        _closeVisible() {
            this.newData = null;
            this.newDatas = [];
            this.goodsVisible = false;
        },
        // 发货
        _openDelivery(_order) {}
    }

}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style scoped>


</style>
