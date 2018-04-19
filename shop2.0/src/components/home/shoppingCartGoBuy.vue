<!-- 去付款 -->
<template>
    <div class="goBuy">
        <!--<div class="header">
            <header-bar></header-bar>
        </div>-->
        <div class="nav">
            <div class="line"></div>
            <div class="address" @click="goAddress" v-if="defaultAddress!=null">
                <h3> <span>{{defaultAddress.consignee}}</span> <span>{{defaultAddress.phone}}</span> </h3>
                <p> 
                	<span class="default-sign" v-if="defaultAddress.isDefaultAddress == 0">默认</span> 
                	<span>{{defaultAddress.province}} {{defaultAddress.city}} {{defaultAddress.county}}</span> 
                </p> 
                <i class="iconfont">&#xe60c;</i>
            </div>
            <div class="address" @click="$router.push({path: '/addAddress', query: {'entrance': 'shopBuy'} })" v-else>
                <h3> <i class="icon iconfont icon-zhuyi" style="color: red;"></i> <span>提示:</span>&nbsp;&nbsp;<span>没有收货地址</span></h3>
                <p><span>请添加收货地址</span></p>
                <i class="iconfont">&#xe60c;</i>
            </div>
            <div class="part">
                <div class="part-item">
                    <span>可用积分：{{userAccount.pointAmount}}</span>
                    <span class="fr">本次购买送 {{userAccount.givePoint}} 积分</span>
                </div>
                <div class="part-item">
                    <div :class="['input-checkbox ']+[deduction?'on':'']">
                        <input ref="checkInputBox" type="checkbox" name="vehicle" v-model="deduction" @change="_setPayPrice(deduction)"/>
                    </div>
                    <span @click="$refs.checkInputBox.click()">可抵扣</span>
                    <span class="fr">￥{{userAccount.totalAmount}}</span>
                    <!-- <span> <input type="checkbox" v-model="deduction" @change="_setPayPrice(deduction)" />可抵扣 </span> -->
                </div>
            </div>
            <div class="part">
                <div class="part-item"><span>商品合计</span><span class="fr">￥{{orderInfo.allPrice}}</span></div>
                <div class="part-item"><span>运费</span><span class="fr">￥{{orderInfo.freight}}</span></div>
                <div class="part-item"><span>优惠</span><span class="fr">-￥{{orderInfo.favour}}</span></div>
                <div class="part-item"><span>需付款</span><span class="fr">￥{{orderInfo.payPrice}}</span></div>
            </div>
            <div class="product-info" v-for="item in goodList">
                <img :src="item.proSimg" />
                <div class="right">
                    <h2>{{item.proTitle}}</h2><span class="num">×{{item.quantity}}</span>
                    <p>
						<span v-if="item.proColorName != '无'">{{item.proColorName}}</span>&nbsp;&nbsp;
						<span v-if="item.proSizesName != '无'">{{item.proSizesName}}</span>
					</p>
                    <p class="prize">￥{{item.productPrice}} <span class="old-prize">￥{{item.productOrigiPrice}}</span> </p>
                </div>
            </div>
        </div>
        <div class="btm">
            <span>应付：￥{{orderInfo.payPrice}}</span>
            <button ref="goBuyBtn" @click="handleBuy">去付款</button>
        </div>
        <!-- 支付密码框 -->
		<pay-pop :viewPop="popupVisible" @result="getPwd" @result2="_closePop"></pay-pop>
    </div>
</template>
<script>
//import headerBar from '@/components/header/headerBar'
import payPop from '@/components/tool/payPop' //密码支付弹框

import { MessageBox,Indicator } from 'mint-ui';
export default {
    name: 'goBuy',
    components: {
//      'header-bar': headerBar,
        'pay-pop': payPop
    },
    data() {
        return {
            defaultAddress: null, // 默认地址
            shoppingCartList: null,
            goodList: null, // 商品数组
            goodListInfo: [], // 商品信息集合
            orderInfo: {}, // 订单详情
            userAccount: {}, //抵扣对象信息
            deduction: false, // 抵扣状态
            popupVisible: false, // 支付界面
        }
    },
    created() {
        this._getAddress();
        this.$nextTick(function() {
        	var _loginWay = localStorage.getItem('_loginWay');
			if(_loginWay == 'weixin') {
				this.getWxInfo();//微信授权后获取微信用户信息
			} 
        });
        // this._fingIntegral();        
    },
     mounted() {
        this.$nextTick(function() {
        	document.title = '下单';
        });
    },
    methods: {
        // 查询收货地址
        _getAddress: function() {
        	var addressId = this.$route.query.addressId;
			var that = this;
			var reqUrl = this.baseUrl + '/acceptAddress/getAcceptAddress';

			var params = {
				pageNum: 1,
				pageSize: this.pageSize,
			}
			this.$http.get(reqUrl, {params: params})
			.then(function(res) {
				if(!res) {
					return;
				}
				if(res.total == 0) {
					// that.$router.push({path: '/addAddress', query: {'entrance': 'shopBuy'} });
                    that._getData();
					return that.defaultAddress = null;
				}
				var aatList = res.aatList;
				for(var i = 0; i < aatList.length; i++) {
					var f = false;
					//有选择地址  显示选择的地址
					if(addressId != null) {
						if(parseInt(addressId) == aatList[i].acceptAddressId) {
							that.defaultAddress = aatList[i];
							break;
						}
					} else {//没有选择地址
						// 显示默认地址
						if(aatList[i].isDefaultAddress == 0) {
							aatList[i].phone = that.encryptPhone(aatList[i].phone);
							that.defaultAddress = aatList[i];
							f = true;
							break;
						}
					}
				}
				//没有收货地址   显示第一个地址
				if((!f) && (addressId == undefined)) {
					aatList[0].phone = that.encryptPhone(aatList[0].phone);
					that.defaultAddress = aatList[0];
				}
				that._getData();
			});
        },

        // 获取下单 商品数据, 商品信息数组
        _getData: function() {
            this.shoppingCartList = [];
            this.goodList = JSON.parse(decodeURIComponent(localStorage.getItem('_goods')));
            for (var i = 0; i < this.goodList.length; i++) {
                this.goodListInfo.push({ proCount: this.goodList[i].quantity, proSku: this.goodList[i].sku, proCode: this.goodList[i].productId });
                this.shoppingCartList.push(this.goodList[i].id)
            }
            // console.log(this.shoppingCartList);
            this._setPayPrice(false);
        },

        // 我的积分和查询抵扣
        _fingIntegral: function() {
            var _that = this;
            this.$http.get(this.baseUrl + '/order/findPointAndDeduction', {
                params: { token: this.token, customerCode: this.userInfo.customerCode, type: this.deduction ? 1 : 2, orderPro: JSON.stringify(this.goodListInfo) }
            }).then(function(res) {
                if (!res) { return; }
                _that.userAccount = res;
                return true;
            });
            return false
        },

        // 获取 计算 => 使用积分 => 商品金额
        _setPayPrice: function(_fag) {
            this.orderInfo.allPrice = 0; /* 商品合计 => 原价总金额 */
            this.orderInfo.freight = this.freight /* 邮费 */
            this.orderInfo.favour = 0; /* 优惠 */
            this.orderInfo.payPrice = 0; /* 支付金额 */
            this.orderInfo.totalAmount = 0; /* 销售总额度 */
            if (this._fingIntegral()) { return }
            this.orderInfo.discountAmount = this.userAccount.totalAmount; /* 可用折扣金额 */
            for (var i = 0; i < this.goodList.length; i++) {
                this.orderInfo.allPrice = this.NumberAdd(
                    this.orderInfo.allPrice,
                    this.NumberMul(this.goodList[i].productOrigiPrice, this.goodList[i].quantity) /* 总金额: = 原价 * 数量 */
                );
                this.orderInfo.favour = this.NumberAdd(
                    this.orderInfo.favour,
                    this.NumberMul(
                        this.NumberDiv(this.goodList[i].productOrigiPrice, this.goodList[i].productPrice), /* 优惠价 = 原价 - 销售价 */
                        this.goodList[i].quantity
                    ) /* 优惠总价 */
                );
                this.orderInfo.totalAmount = this.NumberAdd(
                    this.orderInfo.totalAmount,
                    this.NumberMul(this.goodList[i].productPrice, this.goodList[i].quantity ) /* 商品销售额度 = 销售价 * 数量 */
                )/* 销售总额度 */
            }
            if (_fag) {
//              console.log(this.userAccount.discountAmount);
                this.orderInfo.payPrice = this.NumberDiv(
                    this.NumberDiv(
                        this.NumberDiv(
                            this.orderInfo.allPrice,
                            this.orderInfo.favour
                        ),
                        parseFloat(this.orderInfo.freight)
                    ),
                    this.orderInfo.discountAmount
                );
            } else {
                this.orderInfo.payPrice = this.NumberDiv(
                    this.NumberDiv(
                        this.orderInfo.allPrice,
                        this.orderInfo.favour
                    ),
                    parseFloat(this.orderInfo.freight)
                );
            }
        },

        // 创建订单
        _createOrder: function(param = null) {
        	var cN = this.$refs.goBuyBtn.className;
			if(cN == 'btn-gray') {
				return false;
			}
			if(this.defaultAddress.acceptAddressId == undefined) {
				this.$toast('请选择收货地址');
			}
        	this.$refs.goBuyBtn.className = 'btn-gray';
            var that = this,
            	finalAmount = this.orderInfo.payPrice.toString();
            this.$http.post(this.baseUrl + '/order/addOrder', {
                sendJson: JSON.stringify({
                    acceptAddressId: this.defaultAddress.acceptAddressId,
                    orderSource: 1,
                    totalAmount: this.orderInfo.totalAmount.toString(),
                    freight: this.freight,
                    finalAmount: finalAmount,
                    orderPro: this.goodListInfo,
                    token: this.token,
                    customerCode: this.userInfo.customerCode,
                    usePoint: this.deduction ? (this.userAccount.userPoint).toString() : '0.00',
                    changeAmount: this.deduction ? (this.userAccount.totalAmount).toString() : '0.00',
                    shopcartIds: this.shoppingCartList
                })
            }).then(function(res) {
                if (!res) { return false }
//              that.popupVisible = true;
				if(param == null) {  //直接支付
					that.orderId = res.totalOrdersNo;
					that.handlePay();
	                return true;
				} else {//选择支付方式
					var comOrderInfo = {
						totalOrdersNo: res.totalOrdersNo, //订单编号
						finalAmount: finalAmount //支付金额
					}
					localStorage.setItem('comOrderInfo', JSON.stringify(comOrderInfo));
					that.$router.push('/choosePayWay');
				}
            });
        },

        // 去付款
        handleBuy: function() {
            if (this.defaultAddress == null ) {
                return this.$toast('请选择收货地址');
            }
        	if(this.orderInfo.payPrice == 0) {//积分支付
				if(!this.userInfo.payPassword) { //没有设置支付密码时
					var that = this;
					MessageBox({
						message: '您还未设置支付密码',
						confirmButtonText: '立即前往',
						showCancelButton: true
					}).then(function(action) {
						if(action == 'confirm') {
							that.$router.push('/setPayPassword');
						}
					})
				} else {
					this._createOrder();
				}
			} else {
//				if(this.userInfo.wxId == null || this.userInfo.wxId == '') {
//			 		localStorage.setItem('_loginWay', 'weixin');
//					var redirect_uri = this.onlineUrl + '/shoppingCartGoBuy';
//					this.handleWxAuthor(redirect_uri);
//				} else {
				 	this._createOrder('choose');
//				}
			}
        },
        //支付
		handlePay: function() {
			//积分抵消支付
			this.popupVisible = true;
			/*if(this.orderInfo.payPrice == 0) { 
				this.popupVisible = true;
			} else { //第三方支付（微信）
				this.wxPay();
			}*/
		},
        // 获取从子组件传来的密码值
        getPwd: function(val) {
        	var that = this;
			this.popupVisible = false;
			Indicator.open({
				text: '支付中...',
				spinnerType: 'fading-circle'
			});
			this.pointPay(val);
        },
		//积分支付
		pointPay: function(val) {
			var that = this;
			var reqUrl = this.baseUrl + '/order/updateOrder';
			var params = {
				totalOrdersNo: this.orderId,//总订单号
				payPassword: val,//支付密码
			}
			this.$http.post(reqUrl, params)
				.then(function(res) {
					Indicator.close();
					if(res.code == '9998' && res.description == '支付密码错误次数过多,请稍后再试') { //支付次数过多)
						that.$router.push({
							query: {
								'id': that.orderId, //订单id
								'type': '1', //生成订单 未付款
		
							},
							path: '/userOrderInfo'
						})
						return;
					}
					if(!res) {
						setTimeout(function(){
							that.popupVisible = true;
						}, 1000)
						return;
					}
					if(res.result != 'success') {
						setTimeout(function(){
							that.popupVisible = true;
						}, 1000)
						that.$toast('支付失败');
						return;
					}
					that.$router.push({
						path: '/buySuccess',
						query: {'orderId': that.orderId}
					});
				});
		},
		//微信支付
		/*wxPay: function() {
			var that = this;
    		var params = {
    			totalOrdersNo: this.orderId,
    			finalAmount: this.orderInfo.payPrice
    		}
			this.$http.post(this.baseUrl + '/order/weixinPay', params)
			.then(function(res) {
				if(!res) {
					return;
				}
				var obj = {
                    "appId": res.appId, //公众号名称，由商户传入     
                    "timeStamp": res.timeStamp, //时间戳，自1970年以来的秒数     
                    "nonceStr": res.nonceStr, //随机串     
                    "package": res.package, //微信支付ID
                    "signType": res.signType, //微信签名方式：     
                    "paySign": res.paySign //微信签名 
                }
				var succesPath = that.onlineUrl + '/buySuccess?orderId=' + that.orderId;
				var errorPath = that.onlineUrl + '/userOrderInfo?id=' + that.orderId + '&type=1';
                that.getWxPay(obj, succesPath, errorPath);
                
			});
		},*/
        // 关闭弹框
        _closePop: function(val) {
            //没有支付成功时   进入订单详情页
            document.body.removeAttribute('style');
//          document.body.style.height = 'auto';
//			document.body.style.overflow = 'auto';
            this.popupVisible = val;
            this.$toast('支付未成功');
            this.$router.push({
				query: {
					'id': this.orderId, //订单id
					'type': '1', //生成订单 未付款

				},
				path: '/userOrderInfo'
			})
        },
        //选择地址
		goAddress: function() {
			this.$router.push({
				path: '/receivingAddress',
				query: {
					'entrance': 'shopBuy'
				}
			})
		}
    }
}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style scoped>
@import 'goBuy.css'
</style>
