<!-- 订单列表 =>[升级订单管理] -->
<template>
    <div class="orderList">
        <v-breadcrumb firstMenu="升级专区" secondMenu="升级订单列表"></v-breadcrumb>
        <div class="nav row">
            <div class="col-md-12">
                <div class="portlet box red">
                    <div class="portlet-title">
                        <div class="caption">升级订单列表</div>
                    </div>
                    <div class="portlet-body">
                        <div class="operate">
                        	<div class="form-item">
                                <span>订单时间：</span>
                                <el-date-picker v-model="selectDate" type="daterange" start-placeholder="开始日期"
                                	 end-placeholder="结束日期" value-format="yyyy-MM-dd" @change="datePicker"></el-date-picker>
                            </div>
                             <div class="form-item">
                                <span>订单状态：</span>
                                <select class="form-control input-medium input-inline" v-model="selectForm.ordersState">
                                    <option value="">全部</option>
                                    <option value="5">已退货</option>
                                    <option value="7">待发货</option>
                                    <option value="8">已发货</option>
                                    <option value="9">已收货</option>
                                </select>
                            </div>
                            <div class="form-item">
                                <span>收货人手机：</span>
                                <div class="input-medium input-inline">
                                    <el-input placeholder="请输入用户手机号" v-model=" selectForm.acceptPhone" clearable> </el-input>
                                </div>
                            </div>
                           <div class="form-item">
                                <span>订单编号：</span>
                                <div class="input-medium input-inline">
                                    <el-input placeholder="请输入订单编号" v-model=" selectForm.ordersNo" clearable> </el-input>
                                </div>
                            </div>
                            <div class="form-item">
                                <span>归属代理：</span>
                                <div class="input-medium input-inline">
                                    <el-input placeholder="请输入代理" v-model=" selectForm.proxyName" clearable> </el-input>
                                </div>
                            </div>
                            <div class="form-item">
                                <span>商品名称：</span>
                                <div class="input-medium input-inline">
                                    <el-input placeholder="请输入商品名称" v-model=" selectForm.goodsName" clearable> </el-input>
                                </div>
                            </div>
                            <div class="form-item">
                             	<span>订单类型：</span>
								<select class="form-control input-medium input-inline" v-model="type">
									<option value="">全部</option>
									<option value="1">促销专区</option>
									<option value="2">增值专区</option>
									<option value="3">体验专区</option>
								</select>
							</div>
							<button type="button" class="btn btn-primary" @click="_selectData">查询</button>
                        </div>
                        <div class="table-scrollable">
                            <el-table :data="tableData" ref="tableDataShow" highlight-current-row @selection-change="_handleCurrentChange">
                                <el-table-column type="index" width="50" align="center"></el-table-column>
                                <!--<el-table-column prop="customerCode" label="用户ID"></el-table-column>-->
                                <el-table-column prop="type" label="订单类型">
                                	<template slot-scope="scope">
                                		<span v-if="scope.row.type == 1"> 促销专区 </span>
                                        <span v-if="scope.row.type == 2"> 增值专区 </span>
                                        <span v-if="scope.row.type == 3"> 体验专区 </span>
                                	</template>
                                </el-table-column>
                                <el-table-column prop="ordersNo" label="订单编号"></el-table-column>
                                <el-table-column prop="" label="付款时间">
                                    <template slot-scope="scope"> {{ formatDate(scope.row.createTime, 'time') }} </template>
                                </el-table-column>
                                <el-table-column prop="acceptUser" label="收货人"></el-table-column>
                                <el-table-column prop="acceptPhone" label="手机号"></el-table-column>
                                <el-table-column prop="goodsId" label="商品ID"></el-table-column>
                                <el-table-column prop="goodsName" label="商品名称"></el-table-column>
                                <el-table-column prop="goodsPrice" label="单价(元)"></el-table-column>
                                <el-table-column prop="proCount" label="数量" width="50" ></el-table-column>
                                <el-table-column prop="postage" label="运费(元)" ></el-table-column>
                                <el-table-column prop="finalAmount" label="实付金额(元)"></el-table-column>
                                <el-table-column prop="ordersState" label="状态">
                                    <template slot-scope="scope">
                                        <span v-if="scope.row.ordersState == 5"> 已退货 </span>
                                        <span v-if="scope.row.ordersState == 7"> 待发货 </span>
                                        <span v-if="scope.row.ordersState == 8"> 已发货 </span>
                                        <span v-if="scope.row.ordersState == 9"> 已收货 </span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="proxyName" label="归属代理"></el-table-column>
                                <el-table-column prop="" label="操作" width="130">
                                    <template slot-scope="scope">
                                        <!--<a href="javascript:;" @click="_openDelivery(scope.row)" class="btn btn-sm btn-success"
                                        	 v-if="scope.row.ordersState == 7">发货</a>-->
                                        <a href="javascript:;" @click="_openDetails(scope.row)" class="btn btn-sm btn-primary">详情</a>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                        <el-pagination layout="prev, pager, next" v-if="page.total > pageSize"
                        	 :page-size="page.size" :current-page="page.num"
                        	 :total="page.total" v-on:current-change="_handlePaging"></el-pagination>
                    </div>
                </div>
            </div>
        </div>
        <!-- 订单详情 -->
        <el-dialog title="升级商品订单详情" width="1080px" :visible.sync="goodsVisible" v-if="newData != null" center>
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
                        <p class="form-control-static" v-if="newData.expressName != null">{{newData.expressName}}</p>
                        <p class="form-control-static" v-else>暂无</p>
                    </div>
                </div>
                <div class="form-group col-sm-4 ">
                    <label class="col-sm-5 control-label">快递单号:</label>
                    <div class="col-sm-7">
                        <p class="form-control-static" v-if="newData.expressNo != null">{{newData.expressNo}}</p>
                        <p class="form-control-static" v-else>暂无</p>
                    </div>
                </div>
            </div>
            <h4>收货信息</h4>
            <div class="form-horizontal col-sm-12">
                <div class="form-group col-sm-4 ">
                    <label class="col-sm-5 control-label">收件人:</label>
                    <div class="col-sm-7">
                        <p class="form-control-static">{{newData.acceptUser}}</p>
                    </div>
                </div>
                <div class="form-group col-sm-4 ">
                    <label class="col-sm-5 control-label">收件手机号:</label>
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
                    <label class="col-sm-5 control-label">手机号码:</label>
                    <div class="col-sm-7">
                        <p class="form-control-static" v-if="newData.customerPhone != null">{{newData.customerPhone}}</p>
                        <p class="form-control-static" v-else>暂无</p>
                    </div>
                </div>
            </div>
            <h4>商品信息</h4>
            <el-table :data="newDatas" border>
                <el-table-column property="date" label="商品图片">
                    <template slot-scope="scope">
                        <img :src="scope.row.goodsPic" class="img-goods" :alt="scope.row.goodsName">
                    </template>
                </el-table-column>
                <el-table-column property="goodsName" label="商品名称"></el-table-column>
                <el-table-column property="goodsPrice" label="单价(元)"></el-table-column>
                <el-table-column property="proCount" label="数量"></el-table-column>
                <!--<el-table-column property="finalAmount" label="小计(元)"></el-table-column>-->
                <el-table-column property="isUp" label="升级与否"></el-table-column>
                <el-table-column property="upWay" label="游戏种类">
                	<template slot-scope="scope">
                        <span v-if="scope.row.upWay == 0"> 未参与 </span>
                        <span v-if="scope.row.upWay == 1"> 猜红包 </span>
                        <span v-if="scope.row.upWay == 2"> 猜单双 </span>
                    </template>
                </el-table-column>
                <el-table-column property="upState" label="升级状态">
                	<template slot-scope="scope">
                        <span v-if="scope.row.upState == 0"> 未升级 </span>
                        <span v-if="scope.row.upState == 1"> 小升级 </span>
                        <span v-if="scope.row.upState == 2"> 大升级 </span>
                        <span v-if="scope.row.upState == 2"> 升级中 </span>
                    </template>
                </el-table-column>
                <el-table-column property="postage" label="运费(元)"></el-table-column>
                <el-table-column property="finalAmount" label="订单实付金额(元)" width="140"></el-table-column>
            </el-table>
        </el-dialog>
        <!-- 发货 -->
		<el-dialog title="商品发货" width="500px" :visible.sync="goodsVisible2" center @close="_closeVisible2">
			<div class="form-group">
    			<span>快递公司：</span>	
    			<el-select placeholder="请选择" v-model="ecName">
			    	<el-option v-for="item in ecList" :key="item.compCode" :label="item.compName" :value="item.compName"></el-option>
			  	</el-select>
    		</div>
    		<div class="form-group" >
    			<span>快递单号：</span>	
    			<input type="text" class="form-control input-inline" placeholder="快递单号" v-model="ecNo" >			
    		</div>
    		<div class="form-group btm">
    			<button class="btn btn-primary" @click="sureDeliver">确认</button>
    			<button class="btn btn-default" @click="_closeVisible2">取消</button>
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
            selectForm: { goodsName: '', ordersState: '', acceptPhone: '', ordersNo: '', startTime: '', endTime: '', agent: '' },
            page: { num: 1, total: 0 },
            tableData: [],
            newData: null,
            newDatas: [],
            goodsVisible: false,
            messageVisible: false,
            goodsVisible2: false,
            ecList: [],//快递公司列表
            ecName: '',//快递公司名称
            ecNo: '',//快递单号
            ordersNo: '',//订单编号
            type: '',//所属专区  1.促销专区2.增值专区
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
        // 获取数据 - 升级订单列表
        _getData() {
        	var params = {
				pageNum: this.page.num,
				pageSize: this.pageSize
			},
			that = this,
			reqUrl = this.baseUrl + '/promotion/findOrderPage';
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
			if(this.selectForm.ordersNo != '') {
				params.ordersNo = this.selectForm.ordersNo;
			}
			if(this.selectForm.proxyName != '') {
				params.proxyName = this.selectForm.proxyName;
			}
			if(this.selectForm.goodsName != '') {
				params.goodsName = this.selectForm.goodsName;
			}
			if(this.type != '') {
				params.type = this.type;
			}
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
        // 条件查询数据
        _selectData() {
            this.page.num = 1;
            this._getData();
        },
        // 选中行
        _handleCurrentChange() {},
        // 打开详情
        _openDetails(_order) {
        	//查询订单详情
        	var params = { orderId: _order.orderId },
				that = this,
				reqUrl = this.baseUrl + '/promotion/findOrderInfo';
			this.$http.get(reqUrl, {params: params}).then(function(res) {
				if(!res) {
					return;
				}
				that.goodsVisible = true;
				that.newData = res.orderInfo;
				that.newDatas = [that.newData];
 			});
        },
        _closeVisible() {
            this.newData = null;
            this.newDatas = [];
            this.goodsVisible = false;
        },
        _closeVisible2() {
        	this.ecName = '';//快递公司名称
            this.ecNo = '';//快递单号
            this.ordersNo = '';//订单编号
        	this.goodsVisible2 = false;
        },
        //获取快递公司列表
        getExpressCompany() {
        	var params = {},
        		that = this,
				reqUrl = this.baseUrl + '/logisticsInfo/logisticsDic';
			this.$http.get(reqUrl, { params: params }).then(function(res) {
				if(!res) {
					return;
				}
				that.ecList = res.WQBMap;
 			});
        },
        // 发货
        _openDelivery(_order) {
        	this.ordersNo = _order.ordersNo;
        	this.goodsVisible2 = true;
        	this.getExpressCompany();
        },
        //确认发货
        sureDeliver() {
        	if(this.ecName == '') {
        		this.$message('请选择快递公司');
        		return;
        	}
        	if(this.ecNo == '') {
        		this.$message('请输入快递单号');
        		return;
        	}
        	//升级订单发货
        	var params = { 
	        		ordersNo: this.ordersNo, //	订单号
	        		expressNo: this.ecNo,  //物流单号
	        		expressName: this.ecName //物流名称
	        	},
				that = this,
				reqUrl = this.baseUrl + '/promotion/addDeliveryInfo';
			this.$http.post(reqUrl, params).then(function(res) {
				if(!res) {
					return;
				}
				that.$message('发货成功');
				that._getData();
				that.goodsVisible2 = false;
 			});
        }
    }

}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style scoped>
.img-goods {
	width: 50px;
	height: auto;
}
.form-group > span {
	display: inline-block;
	width: 120px;
	text-align: right;
}
.btm {
	text-align: center;
	padding-top: 20px;
}
.operate .form-item {
	display: inline-block;
	margin: 10px;
}
.form-item  > span {
	display: inline-block;
	width: 100px;
	text-align: right;
}
</style>
