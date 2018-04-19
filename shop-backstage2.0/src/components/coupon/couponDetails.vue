<!-- 优惠券管理 - 体验券商品 -体验券商品详情-->
<template>
    <div class="couponDetails">
        <v-breadcrumb firstMenu="优惠券管理" secondMenu="体验券商品详情"></v-breadcrumb>
        <div class="nav row">
            <div class="col-md-12">
                <div class="portlet box red">
                    <div class="portlet-title">
                        <div class="caption">体验券商品详情</div>
                    </div>
                    <div class="portlet-body">
                        <div class="dialog-title" v-html="conTitle"></div>
                        <div class="dialog-con container">
                            <div class="top row">
                                <div class="dialog-item">
                                    <!-- 专区 -->
                                    <div class="col-md-2 ta-right">所属专区：</div>
                                    <div class="col-md-4">{{goodAreaName}}</div>
                                </div>
                            </div>
                            <div class="row">
                                <!--左边-->
                                <div class="left col-md-6">
                                    <!--名称-->
                                    <div class="dialog-item">
                                        <div class="col-md-4 ta-right">商品名称：</div>
                                        <div class="col-md-5">
                                        	<!--<el-autocomplete class="inline-input" 
                                        		v-model="dialog.goodsName"
                                        		:fetch-suggestions="_querySearch" 
                                        		placeholder="请输入商品名称" @select="_handleSelect">
                                        	</el-autocomplete>-->
                                        	<div class="input-group">
                                                <input type="text" class="form-control" placeholder="商品名称" v-model="dialog.goodsName" />
                                                <span class="input-group-btn">
                                                    <a class="btn btn-default" @click="openGoodsList('goodsName')">选择</a>
                                                </span>
                                            </div>
                                           <!-- <el-select v-model="dialog.goodId" placeholder="请选择" @change="selectGoods(1)">
                                                <el-option v-for="item in goods" :key="item.proCode" :label="item.proTitle" :value="item.proCode">
                                                </el-option>
                                            </el-select>-->
                                        </div>
                                        <div class="col-md-3">销售价:{{specList.tagPrice}}</div>
                                    </div>
                                    <!--ID-->
                                    <div class="dialog-item">
                                        <div class="col-md-4 ta-right">商品ID：</div>
                                        <div class="col-md-8">
                                            <input type="text" v-model="dialog.goodId" readonly="true" />
                                        </div>
                                    </div>
                                    <!--副标题-->
                                    <div class="dialog-item">
                                        <div class="col-md-4 ta-right">商品副标题：</div>
                                        <div class="col-md-8">
                                            <input type="text" v-model="dialog.goodsSubtitle" />
                                        </div>
                                    </div>
                                    <!--规格-->
                                    <div class="dialog-item">
                                        <div class="col-md-4 ta-right">商品规格：</div>
                                        <div class="col-md-6">
                                            <el-select v-model="goodsSkuCode" placeholder="请选择" class="ml10 classDetailsLeft" @change="selectSpec(1)">
                                                <el-option v-for="item in specList.listspec" :key="item.value" :label="[item.proSize]+[' ']+[item.proColor]" :value="item.proSkuCode">
                                                </el-option>
                                            </el-select>
                                        </div>
                                        <div class="col-md-2"></div>
                                    </div>
                                    <!--价格-->
                                    <div class="dialog-item">
                                        <div class="col-md-4 ta-right">商品价格：</div>
                                        <div class="col-md-8">
                                            <input type="number" min="0" v-model="dialog.goodsPrice" readonly="true" />
                                        </div>
                                    </div>
                                    <!--成本-->
                                    <div class="dialog-item">
                                        <div class="col-md-4 ta-right">商品成本：</div>
                                        <div class="col-md-5">
                                            <input type="number" min="0" v-model="dialog.oldPrice" @blur="calcuPrize(1)" />
                                        </div>
                                        <div class="col-md-3">分销价:{{specList.salePrice}}</div>
                                    </div>
                                    <!--利润-->
                                    <div class="dialog-item">
                                        <div class="col-md-4 ta-right">商品利润：</div>
                                        <div class="col-md-8">
                                            <input type="number" min="0" v-model="dialog.lc" @blur="calcuPrize(1)" />
                                        </div>
                                    </div>
                                    <!--邮费-->
                                    <div class="dialog-item">
                                        <div class="col-md-4 ta-right">商品邮费：</div>
                                        <div class="col-md-8">
                                            <input type="number" min="0" v-model="dialog.emsFee" />
                                        </div>
                                    </div>
                                    <!--递增邮费-->
                                    <div class="dialog-item">
                                        <div class="col-md-4 ta-right">递增邮费：</div>
                                        <div class="col-md-8">
                                            <input type="number" min="0" v-model="dialog.addEmsFee" />
                                        </div>
                                    </div>
                                    <!--主图-->
                                    <div class="dialog-item row classDetailsPadding">
                                        <div class="col-md-4 ta-right">商品主图：</div>
                                        <div class="col-md-8">
                                            <div class="lineBlock">
                                                <div class="img-wrap" v-for="item,index in dialog.productImgs">
                                                    <span class="del" @click="handleRemove('productImgs', index)">-</span>
                                                    <input type="file" accept="image/jpeg" @change="handleUpload('productImgs',index)" />
                                                    <img :src="item" />
                                                </div>
                                                <div class="img-add">+
                                                    <input type="file" accept="image/jpeg" @change="handleUpload('productImgs')" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!--右边-->
                                <div class="right col-md-6">
                                    <!--名称-->
                                    <div class="dialog-item">
                                        <div class="col-md-4 ta-right">升级商品名称：</div>
                                        <div class="col-md-5">
                                        	<!--<el-autocomplete class="inline-input" 
                                        		v-model="dialog.maxGoodName" 
                                        		:fetch-suggestions="_querySearch" 
                                        		placeholder="请输入商品名称" @select="_handleSelect2">
                                        	</el-autocomplete>-->
                                        	<div class="input-group">
                                                <input type="text" class="form-control" placeholder="商品名称" v-model="dialog.maxGoodName" />
                                                <span class="input-group-btn">
                                                    <a class="btn btn-default" @click="openGoodsList('maxGoodName')">选择</a>
                                                </span>
                                            </div>
                                            <!--<el-select v-model="dialog.maxUpgradeId" placeholder="请选择" @change="selectGoods(2)">
                                                <el-option v-for="item in goods" :key="item.goodsName" :label="item.proTitle" :value="item.proCode">
                                                </el-option>
                                            </el-select>-->
                                        </div>
                                        <div class="col-md-3">销售价:{{upSpecList.tagPrice}}</div>
                                    </div>
                                    <!--ID-->
                                    <div class="dialog-item">
                                        <div class="col-md-4 ta-right">升级商品ID：</div>
                                        <div class="col-md-8">
                                            <input type="text" v-model="dialog.maxUpgradeId" readonly="true" />
                                        </div>
                                    </div>
                                    <!--副标题-->
                                    <div class="dialog-item">
                                        <div class="col-md-4 ta-right">升级商品副标题：</div>
                                        <div class="col-md-8">
                                            <input type="text" v-model="dialog.upgradeSubtitle" />
                                        </div>
                                    </div>
                                    <!--规格-->
                                    <div class="dialog-item">
                                        <div class="col-md-4 ta-right">升级商品规格：</div>
                                        <div class="col-md-6">
                                            <el-select v-model="upGoodsSkuCode" placeholder="请选择" @change="selectSpec(2)">
                                                <el-option v-for="item in upSpecList.listspec" :key="item.value" :label="[item.proSize]+[' ']+[item.proColor]" :value="item.proSkuCode">
                                                </el-option>
                                            </el-select>
                                        </div>
                                        <div class="col-md-2"></div>
                                    </div>
                                    <!--价格-->
                                    <div class="dialog-item">
                                        <div class="col-md-4 ta-right">升级商品价格：</div>
                                        <div class="col-md-8">
                                            <input type="number" min="0" v-model="dialog.upgradePrice" readonly="true" />
                                        </div>
                                    </div>
                                    <!--成本-->
                                    <div class="dialog-item">
                                        <div class="col-md-4 ta-right">升级商品成本：</div>
                                        <div class="col-md-5">
                                            <input type="number" min="0" v-model="dialog.maxOldPrice" @blur="calcuPrize(2)" />
                                        </div>
                                        <div class="col-md-3">分销价:{{upSpecList.salePrice}}</div>
                                    </div>
                                    <!--利润-->
                                    <div class="dialog-item">
                                        <div class="col-md-4 ta-right">升级商品利润：</div>
                                        <div class="col-md-8">
                                            <input type="number" min="0" v-model="dialog.maxLc" @blur="calcuPrize(2)" />
                                        </div>
                                    </div>
                                    <!--邮费-->
                                    <div class="dialog-item">
                                        <div class="col-md-4 ta-right">升级商品邮费：</div>
                                        <div class="col-md-8">
                                            <input type="number" min="0" v-model="dialog.maxEmsFee" />
                                        </div>
                                    </div>
                                    <!--递增邮费-->
                                    <div class="dialog-item">
                                        <div class="col-md-4 ta-right">升级商品递增邮费：</div>
                                        <div class="col-md-8">
                                            <input type="number" min="0" v-model="dialog.maxAddEmsFee" />
                                        </div>
                                    </div>
                                    <!--主图-->
                                    <div class="dialog-item row classDetailsPadding">
                                        <div class="col-md-4 ta-right">升级商品主图：</div>
                                        <div class="col-md-8">
                                            <div class="lineBlock">
                                                <div class="img-wrap" v-for="item,index in dialog.maxProductImgs">
                                                    <span class="del" @click="handleRemove('maxProductImgs', index)">-</span>
                                                    <input type="file" accept="image/jpeg" @change="handleUpload('maxProductImgs',index)" />
                                                    <img :src="item" />
                                                </div>
                                                <div class="img-add">+
                                                    <input type="file" accept="image/jpeg" @change="handleUpload('maxProductImgs')" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!--概率等杂项-->
                            <div class="bottom border-shangmian">
                                <div class="dialog-item">
                                    <div class="col-md-2 ta-right">升级概率：</div>
                                    <div class="col-md-2">
                                        <input type="number" min="0" max="100" v-model="dialog.maxOdds" />
                                    </div>
                                    <div class="col-md-2 ta-right">排 序：</div>
                                    <div class="col-md-2">
                                        <input type="number" v-model="dialog.orders" />
                                    </div>
                                    <div class="col-md-2 ta-right">商品状态：</div>
                                    <div class="col-md-2">
                                        <el-select v-model="dialog.status" class="ml10">
                                            <el-option v-for="item in dialogStatus" :key="item.value" :label="item.label" :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="dialog-btm ta-center">
                            <el-button type="primary" @click="handleSave">确 定</el-button>
                            <el-button @click="handleCancle">取 消</el-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <v-goodsListModel :visible="goodsListModelVisible" v-on:visible="setGoodsVisible" v-on:getGoods="getSelectedGoods"></v-goodsListModel>
    </div>
</template>
<script type="text/ecmascript-6">
import breadcrumb from '@/components/tool/breadcrumb' //面包屑     
import goodsListModel from '@/components/goods/goodsListModel' //商品列表弹框 
export default {
    name: 'couponDetails', // 结构名称
    data() {
        return {
            pageNum: 1,
            queryInfo: { //商品列表传过来的升级商品信息
                'goodsTypeId': '', //升级商品分类id
                'proCode': '', //商品主键Id
            },
            conTitle: '',
            goodAreaName: '体验专区', //所属专区
            goodTypeName: '', //分类名称
            dialog: {
            	'goodName': '',
            	'maxGoodName': '',
            	'oldPrice': null,
            	'maxOldPrice': null,
            	'lc': null,
            	'maxLc': null,
            	'servicePrice': '0',
            	'maxServicePrice': '0',
            	'emsFee': null,
            	'maxEmsFee': null,
            	'addEmsFee': null,
            	'maxAddEmsFee': null,
                'productImgs': [],
//              'prodetailImgs': [],
                'maxProductImgs': [],
//              'maxprodetailImgs': [],
                'status': '1',
                'goodsType': '3', //所属专区id  3:体验专区
                'orders': ''
            }, //内容
            goods: [], //商品列表选项
            specList: {}, //商品规格信息 + 分销价 + 市场价
            upSpecList: {}, //升级商品规格信息 + 分销价 + 市场价
            goodsSkuCode: '', //商品skuCode
            upGoodsSkuCode: '', //升级商品skuCode
            mainImg: '', //商品主图
            mainImgVisible: false, //商品主图预览
            upMainImg: '', //升级商品主图
            upMainImgVisible: false, //升级商品主图预览
            detailsImg: '', //商品详情图
            detailsImgVisible: false, //商品详情图预览
            upDetailsImg: '', //升级商品详情图
            upDetailsImgVisible: false, //升级商品详情图预览
            dialogStatus: [{ value: '1', label: '已上架' }, { value: '0', label: '已下架' }], //弹框商品状态
            goodsList: [],
            goodsListModelVisible: false,
            goodsListModelType: null,
        }
    },
    watch: {
        // 商品 成本
        'dialog.oldPrice': function(val, oldVal) { if (val != null) { this.dialog.oldPrice = this.doubleFloat(val); } },
        // 商品 利润
        'dialog.lc': function(val, oldVal) { if (val != null) { this.dialog.lc = this.doubleFloat(val); } },
        // 商品 服务费
//      'dialog.servicePrice': function(val, oldVal) { if (val != null) { this.dialog.servicePrice = this.doubleFloat(val); } },
        // 商品 邮费
        'dialog.emsFee': function(val, oldVal) { if (val != null) { this.dialog.emsFee = this.doubleFloat(val); } },
        // 商品 递增邮费
        'dialog.addEmsFee': function(val, oldVal) { if (val != null) { this.dialog.addEmsFee = this.doubleFloat(val); } },
        
        // 升级商品 成本
        'dialog.maxOldPrice': function(val, oldVal) { if (val != null) { this.dialog.maxOldPrice = this.doubleFloat(val); } },
        // 升级商品 利润
        'dialog.maxLc': function(val, oldVal) { if (val != null) { this.dialog.maxLc = this.doubleFloat(val); } },
        // 升级商品 服务费
//      'dialog.maxServicePrice': function(val, oldVal) { if (val != null) { this.dialog.maxServicePrice = this.doubleFloat(val); } },
        // 升级商品 邮费
        'dialog.maxEmsFee': function(val, oldVal) { if (val != null) { this.dialog.maxEmsFee = this.doubleFloat(val); } },
        // 升级商品 递增邮费
        'dialog.maxAddEmsFee': function(val, oldVal) { if (val != null) { this.dialog.maxAddEmsFee = this.doubleFloat(val); } },
    },
    components: {
        'v-breadcrumb': breadcrumb,
        'v-goodsListModel': goodsListModel
    },
    mounted() {
        //选择商品名称 -》显示响应的规格、销售价、分销价
        this.$nextTick(function() {
            this.addOrEdit();
        });
    },
    methods: {
        //进入判断是添加还是修改
        addOrEdit(item) {
            this.queryInfo.proCode = this.$route.query.mainId;

            if (this.queryInfo.proCode != undefined) {
                this.conTitle = '修改体验券商品';
                this.getDetail();
            } else {
                this.conTitle = '添加体验券商品';
            }
//          this.getGoodsTypeList();
            this.getGoodsList();
        },
        //查询升级商品分类列表
//      getGoodsTypeList() {
//          var params = {
//              pageNum: this.pageNum,
//              pageSize: this.maxPageSize
//          }
//          var that = this,
//              reqUrl = this.baseUrl + '/productCate/findProCatePage';
//          this.$http.get(reqUrl, { params: params }).then(function(res) {
//              if (!res) {
//                  return;
//              }
//              var proCateList = res.proCateList;
//              for (var i = 0; i < proCateList.length; i++) {
//                  var obj = proCateList[i];
//                  if (obj.classifyId == that.queryInfo.goodsTypeId) {
//                      that.goodTypeName = obj.classifyName;
//                  }
//              }
//              that.total = res.total;
//          });
//      },
        //查询升级商品列表
//      getGoodsList() {
//          var params = {},
//              that = this,
//              reqUrl = this.baseUrl + '/product/findProductNames';
//          this.dialog.goodsType == 1 ? params.proCate = '2' : params.proCate = '3'; //1：积分商城 2:促销专区 3：增值专区
//          this.$http.get(reqUrl, { params: params }).then(function(res) {
//              if (!res) {
//                  return;
//              }
//              that.goods = res.listNames;
//          });
//      },
        //查询商品详情
        getDetail() {
            var params = { id: this.queryInfo.proCode },
                that = this,
                reqUrl = this.baseUrl + '/product/findProductInfoById';
            this.$http.get(reqUrl, { params: params }).then(function(res) {
                if (!res) { return; }
                var productDetail = res.productDetail;
                that.dialog = productDetail;
                that.goodTypeName = productDetail.classifyName;
                that.dialog.goodsName = productDetail.goodsName;
                that.dialog.maxGoodName = productDetail.maxGoodName;
                that.dialog.goodsPrice = productDetail.goodsPrice.toString();
                that.dialog.upgradePrice = productDetail.upgradePrice.toString();
                that.dialog.oldPrice = productDetail.oldPrice.toString();
                that.dialog.maxOldPrice = productDetail.maxOldPrice.toString();
                that.dialog.lc = productDetail.lc.toString();
                that.dialog.maxLc = productDetail.maxLc.toString();
                that.dialog.servicePrice = productDetail.servicePrice.toString();
                that.dialog.maxServicePrice = productDetail.maxServicePrice.toString();
                that.dialog.emsFee = productDetail.emsFee.toString();
                that.dialog.maxEmsFee = productDetail.maxEmsFee.toString();
                that.dialog.addEmsFee = productDetail.addEmsFee.toString();
                that.dialog.maxAddEmsFee = productDetail.maxAddEmsFee.toString();
                that.dialog.status = productDetail.status.toString();
                that.dialog.orders = productDetail.orders.toString();
                that.dialog.maxOdds = productDetail.maxOdds.toString();
                that.dialog.productImgs = that.dealImg(productDetail.productImgs);
//              that.dialog.prodetailImgs = that.dealImg(productDetail.prodetailImgs);
                that.dialog.maxProductImgs = that.dealImg(productDetail.maxProductImgs);
//              that.dialog.maxprodetailImgs = that.dealImg(productDetail.maxprodetailImgs);
                that.goodsSkuCode = productDetail.goodsSpecSize + ' ' + productDetail.goodsSpecColor;
                that.upGoodsSkuCode = productDetail.upgradeSpecSize + ' ' + productDetail.upgradeSpecColor;

                //获取规格、销售价、分销价信息
                that.getGoodsSpec(1);
                that.getGoodsSpec(2);
            });
        },
        openGoodsList(_type) {
            this.goodsListModelType = _type;
            this.goodsListModelVisible = true;
        },
        // 选着商品, 设置信息
        getSelectedGoods(_goods) {
            var _item = {
                id: _goods.proCode,
                value: _goods.proTitle
            };
            if (this.goodsListModelType == 'goodsName') {
                this._handleSelect(_item);
            }
            if (this.goodsListModelType == 'maxGoodName') {
                this._handleSelect2(_item);
            }
        },
        // 关闭视图
        setGoodsVisible(flag) {
            this.goodsListModelVisible = flag;
        },
        //处理图片，字符串转数组
        dealImg(imgs) {
            var arr;
            imgs == '' ? arr = [] : arr = imgs.split(',');
            return arr;
        },
        //选择商品
        selectGoods(param) {
            for (var i = 0; i < this.goods.length; i++) {
                var obj = this.goods[i];

                if (param == 1) {
                    if (obj.proCode == this.dialog.goodId) {
                        this.dialog.goodsName = obj.proTitle;
                        this.goodsSkuCode = '';
                    }
                } else {
                    if (obj.proCode == this.dialog.maxUpgradeId) {
                        this.dialog.maxGoodName = obj.proTitle;
                        this.upGoodsSkuCode = '';
                    }
                }
            }
            //查询商品规格
            this.getGoodsSpec(param);
        },
        // 加载可选择的商品
        getGoodsList() {
        	var that = this,
        		params = {
        			proCate: '1' //1：积分商城 2:促销专区 3：增值专区
        		}
    	  	this.$http.get(this.baseUrl + '/product/findProductNames', {params: params})
    	  	.then(function(res) {
                if (!res) { return; }
                var list = res.listNames;
                var arr = [];
                for(var i = 0;i < list.length;i++) {
                	var obj = list[i];
                	arr[i] = { 'id': obj.proCode, 'value': obj.proTitle };
                }
                that.goodsList = arr;
                return that.goodsList;
            });
        },
        //商品 模糊搜索
        _querySearch(queryString, cb) {
            var restaurants = this.goodsList;
            var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        // 检索反应
        createFilter(queryString) {
            var restaurant = this.goodsList;
            return function(restaurant) {
                return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
            };
        },
         //商品 下拉选中
        _handleSelect(_item) {
            this.dialog.goodId = _item.id;
            this.dialog.goodsName = _item.value;
            this.goodsSkuCode = ''; //清空规格
            //查询商品规格
            this.getGoodsSpec(1);
        },
         //升级商品 下拉选中
        _handleSelect2(_item) {
            this.dialog.maxUpgradeId = _item.id;
            this.dialog.maxGoodName = _item.value;
            this.upGoodsSkuCode = '';//清空规格
            //查询商品规格
            this.getGoodsSpec(2);
        },
        //查询产品规格
        getGoodsSpec(param) {
            var params = {},
                that = this,
                reqUrl = this.baseUrl + '/product/getProColorAndSizeByCode';
            param == 1 ? params.proCode = this.dialog.goodId : params.proCode = this.dialog.maxUpgradeId;
            this.$http.get(reqUrl, { params: params }).then(function(res) {
                if (!res) {
                    return;
                }
                if (param == 1) {
                    that.specList = {
                        'listspec': res.listspec, //商品规格
                        'salePrice': res.salePrice, //分销价
                        'tagPrice': res.tagPrice //市场价
                    }
                } else {
                    that.upSpecList = {
                        'listspec': res.listspec, //升级商品规格
                        'salePrice': res.salePrice, //升级商品分销价
                        'tagPrice': res.tagPrice //升级商品市场价
                    }
                }
            });
        },
        //选择规格
        selectSpec(param) {
            if (param == 1) {
                var list = this.specList.listspec;
                for (var i = 0; i < list.length; i++) {
                    var obj = list[i];
                    if (obj.proSkuCode == this.goodsSkuCode) {
                        this.dialog.goodsSpecColor = obj.proColor;
                        this.dialog.goodsSpecSize = obj.proSize;
                        this.dialog.goodsSkuNo = obj.proSkuNo;
                    }
                }
            } else { //大升级商品
                var list = this.upSpecList.listspec;
                for (var i = 0; i < list.length; i++) {
                    var obj = list[i];
                    if (obj.proSkuCode == this.upGoodsSkuCode) {
                        this.dialog.upgradeSpecColor = obj.proColor;
                        this.dialog.upgradeSpecSize = obj.proSize;
                        this.dialog.upgradeSkuNo = obj.proSkuNo;
                    }
                }
            }
        },
        //计算价格
        calcuPrize(param) {
            if (param == 1) { //商品
                if (this.dialog.oldPrice != undefined && this.dialog.lc != undefined) {
                    // var goodsPrice = parseFloat(this.dialog.oldPrice) + parseFloat(this.dialog.servicePrice) + parseFloat(this.dialog.lc);
                    var goodsPrice = this.NumberAdd(parseFloat(this.dialog.oldPrice), parseFloat(this.dialog.lc));
                    this.$set(this.dialog, 'goodsPrice', goodsPrice);
                }
            } else { //大升级商品
                if (this.dialog.maxOldPrice != undefined && this.dialog.maxLc != undefined) {
                    // var upgradePrice = parseFloat(this.dialog.maxOldPrice) + parseFloat(this.dialog.maxServicePrice) + parseFloat(this.dialog.maxLc);
                    var upgradePrice = this.NumberAdd(parseFloat(this.dialog.maxOldPrice), parseFloat(this.dialog.maxLc));
                    this.$set(this.dialog, 'upgradePrice', upgradePrice);
                }
            }
        },
        /**
         * 上传图片 
         * a: 图片文件
         * b: 'add':添加图片  'change'替换图片
         * c: 标记改变哪个字段
         * d: 替换图片时，图片的下标
         */
        uploadImg(a, b, c, index = null) {
            //          var params = {
            //                  filePathKey: 'promproductImgPath',
            //                  fileCategory: '1', 
            //                  file: a //多文件时，参数名为files： xx,files:xx...
            //              },
            var that = this,
                reqUrl = this.baseUrl + '/upload/files', //上传图片地址
                formData = new FormData();
            formData.append("token", that.token);
            formData.append("filePathKey", 'promproductImgPath'); //添加升级商品图片时
            formData.append("fileCategory", '1'); //1:单文件 2:多文件
            formData.append("file", a); //多文件时，参数名为files： xx,files:xx...
            this.$http.post(reqUrl, { formData: formData }).then(function(res) {
                if (!res) {
                    return;
                }
                var imgPath = res.path;
                if (b == 'add') {
                    if (c == 'productImgs') {
                        that.dialog.productImgs.push(imgPath);
//                  } else if (c == 'prodetailImgs') {
//                      that.dialog.prodetailImgs.push(imgPath);
                    } else if (c == 'maxProductImgs') {
                        that.dialog.maxProductImgs.push(imgPath);
//                  } else {
//                      that.dialog.maxprodetailImgs.push(imgPath);
                    }
                } else {
                    if (c == 'productImgs') {
                        that.$set(that.dialog.productImgs, index, imgPath);
//                  } else if (c == 'prodetailImgs') {
//                      that.$set(that.dialog.prodetailImgs, index, imgPath);
                    } else if (c == 'maxProductImgs') {
                        that.$set(that.dialog.maxProductImgs, index, imgPath);
//                  } else {
//                      that.$set(that.dialog.maxprodetailImgs, index, imgPath);
                    }
                }
            });
        },
        //去上传图片
        handleUpload(param, index = null) {
            var ev = event || window.event,
                files = this.uploadImgFn(ev.currentTarget);
            if (!files) { return; }
            var f = '';
            index == null ? f = 'add' : f = 'change';
            this.uploadImg(files.fileObj, f, param, index);
        },
        //删除图片
        handleRemove(param, index) {
            var ev = event || window.event,
                elem = ev.currentTarget,
                imgElem = elem.parentElement;
            if (param == 'productImgs') {
                this.dialog.productImgs.splice(index, 1);
//          } else if (param == 'prodetailImgs') {
//              this.dialog.prodetailImgs.splice(index, 1);
            } else if (param == 'maxProductImgs') {
                this.dialog.maxProductImgs.splice(index, 1);
//          } else {
//              this.dialog.maxprodetailImgs.splice(index, 1);
            }
        },
        //将图片数组 转换为 带逗号的字符串
        imgArrToStr(imgArr) {
            var obj = '';
            var len = imgArr.length;
            if (len == 0) {
                return '';
            }
            for (var i in imgArr) {
                var str = imgArr[i];
                if (i > 0) {
                    obj = obj + ',' + str;
                } else {
                    obj = str;
                }
            }
            return obj;
        },
        //保存商品
        handleSave() {
            //非空校验
            if (this.isNull(this.dialog.goodsName)) {
                this.$message('商品名称不能为空！');
                return;
            }
            if (this.isNull(this.dialog.maxGoodName)) {
                this.$message('升级商品名称不能为空！');
                return;
            }
            if (this.isNull(this.dialog.goodsSubtitle)) {
                this.$message('商品副名称不能为空！');
                return;
            }
            if (this.isNull(this.dialog.upgradeSubtitle)) {
                this.$message('升级商品副名称不能为空！');
                return;
            }
            if (this.isNull(this.goodsSkuCode)) {
                this.$message('商品规格不能为空！');
                return;
            }
            if (this.isNull(this.upGoodsSkuCode)) {
                this.$message('升级商品规格不能为空！');
                return;
            }
            if (this.isNull(this.dialog.oldPrice.toString())) {
                this.$message('商品成本不能为空！');
                return;
            }
            if (this.isNull(this.dialog.maxOldPrice.toString())) {
                this.$message('升级商品成本不能为空！');
                return;
            }
            if (this.isNull(this.dialog.lc.toString())) {
                this.$message('商品利润不能为空！');
                return;
            }
            if (this.isNull(this.dialog.maxLc.toString())) {
                this.$message('升级商品利润不能为空！');
                return;
            }
//          if (this.isNull(this.dialog.servicePrice.toString())) {
//              this.$message('商品服务费不能为空！');
//              return;
//          }
//          if (this.isNull(this.dialog.maxServicePrice.toString())) {
//              this.$message('升级商品服务费不能为空！');
//              return;
//          }
            // if(this.isNull(this.dialog.goodsPrice)) {
            //     this.$message('商品价格不能为空！');
            //     return;
            // }
            // if(this.isNull(this.dialog.upgradePrice)) {
            //     this.$message('升级商品价格不能为空！');
            //     return;
            // }
            if (this.isNull(this.dialog.emsFee.toString())) {
                this.$message('商品邮费不能为空！');
                return;
            }
            if (this.isNull(this.dialog.maxEmsFee.toString())) {
                this.$message('升级商品邮费不能为空！');
                return;
            }
            if (this.isNull(this.dialog.addEmsFee.toString())) {
                this.$message('商品递增邮费不能为空！');
                return;
            }
            if (this.isNull(this.dialog.maxAddEmsFee.toString())) {
                this.$message('升级商品递增邮费不能为空！');
                return;
            }
            if (this.dialog.productImgs.length == 0) {
                this.$message('商品主图不能为空！');
                return;
            }
            if (this.dialog.maxProductImgs.length == 0) {
                this.$message('升级商品主图不能为空！');
                return;
            }
//          if (this.dialog.prodetailImgs.length == 0) {
//              this.$message('商品详情图不能为空！');
//              return;
//          }
//          if (this.dialog.maxprodetailImgs.length == 0) {
//              this.$message('升级商品详情图不能为空！');
//              return;
//          }
            if (this.isNull(this.dialog.maxOdds)) {
                this.$message('升级概率不能为空！');
                return;
            }
            if (this.isNull(this.dialog.orders)) {
                this.$message('排序不能为空！');
                return;
            }

            //将图片数组 转换为 带逗号的字符串
            this.dialog.productImgs = this.imgArrToStr(this.dialog.productImgs);
//          this.dialog.prodetailImgs = this.imgArrToStr(this.dialog.prodetailImgs);
            this.dialog.maxProductImgs = this.imgArrToStr(this.dialog.maxProductImgs);
//          this.dialog.maxprodetailImgs = this.imgArrToStr(this.dialog.maxprodetailImgs);
            this.saveData();
        },
        //调取保存接口
        saveData() {
            var that = this,
                reqUrl = '',
                msg = '';
            if (this.queryInfo.proCode != undefined) { //修改时
                reqUrl = this.baseUrl + '/product/updateProduct';
                msg = '修改成功';
            } else { //添加时
                reqUrl = this.baseUrl + '/product/addProduct';
                msg = '添加成功';
            }
            this.$http.post(reqUrl, this.dialog).then(function(res) {
                if (!res) {
                    that.dialog.productImgs = that.dealImg(that.dialog.productImgs);
//                  that.dialog.prodetailImgs = that.dealImg(that.dialog.prodetailImgs);
                    that.dialog.maxProductImgs = that.dealImg(that.dialog.maxProductImgs);
//                  that.dialog.maxprodetailImgs = that.dealImg(that.dialog.maxprodetailImgs);
                    return;
                }
                that.$message(msg);
                that.$router.push({
                    path: '/couponGoods'
                });
            });
        },
        //取消
        handleCancle() {
            this.$router.push({
                path: '/couponGoods'
            });
        }
    }

}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style scoped>
@import url("../home/css/dialog.css");

.draw-img {
    width: 50px;
    height: 50px;
}

.border-shangmian {
    border-top: 1px solid #000;
}

.classDetailsPadding {
    padding-bottom: 20px;
}

.classDetailsLeft {
    margin-left: 0;
}

.classDetailsWidth {
    width: 100%;
}

.classDetailsImg {
    width: 50px;
    height: 50px;
}

.left,
.right {
    height: 100%;
}

.bottom {
    padding-top: 15px;
}

.lineBlock .img-wrap {
    display: inline-block;
    vertical-align: top;
    position: relative;
    width: 120px;
    height: 120px;
    margin-right: 20px;
    margin-bottom: 10px;
    border: 1px dashed #ddd;
    border-radius: 5px;
}

.lineBlock .img-wrap .del {
    position: absolute;
    top: -5px;
    right: -5px;
    width: 15px;
    height: 15px;
    line-height: 12px;
    color: #fff;
    background-color: #CB5A5E;
    text-align: center;
    border-radius: 50%;
    cursor: pointer;
    z-index: 500;
    font-size: 20px;
}

.lineBlock .img-wrap input {
    position: absolute;
    left: 0;
    top: 0;
    width: 120px;
    height: 120px;
    filter: alpha(opacity=0);
    opacity: 0;
}

.lineBlock .img-wrap img {
    width: 120px;
    height: 120px;
    border-radius: 5px;
}

.lineBlock .img-add {
    display: inline-block;
    vertical-align: top;
    position: relative;
    width: 120px;
    height: 120px;
    line-height: 120px;
    color: #ddd;
    font-size: 48px;
    text-align: center;
    border: 1px dashed #ddd;
    border-radius: 5px;
    margin-bottom: 10px;
}

.lineBlock .img-add input {
    position: absolute;
    top: 0;
    left: 0;
    width: 120px;
    height: 120px;
    filter: alpha(opacity=0);
    opacity: 0;
}

.portlet {
    min-width: 1200px;
}
.border-shangmian {
    border-top: 1px solid #000;
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
