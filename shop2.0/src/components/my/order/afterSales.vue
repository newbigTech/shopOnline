<!-- 申请售后 -->
<template>
    <div id="afterSales" :style="{height : bodyHeight}">
        <template v-if="afterSalesShow == true">
            <div class="from-box" v-model="dataFrom">
                <div class="item" @click="typeVisible=true">
                    <label>退款类型</label>
                    <div :class="['val ']+[typeVisibleState == true?'on':'']">{{dataFrom.type}}</div>
                    <i class="icon iconfont icon-caret"></i>
                </div>
                <div class="item" v-if="showReceive" @click="changeVisible = true">
                    <label>收货状态</label>
                    <div :class="['val ']+[changeVisibleState == true?'on':'']">{{dataFrom.isReceiveText}}</div>
                    <i class="icon iconfont icon-caret"></i>
                </div>
                <div class="item" @click="causeVisible = true">
                    <label>退款原因</label>
                    <div :class="['val ']+[causeVisibleState == true?'on':'']">{{dataFrom.cause}}</div>
                    <i class="icon iconfont icon-caret"></i>
                </div>
                <div class="item">
                    <label>退款金额</label>
                    <div class="val">
                        <input ref="amount" @change="_changeAmount" class="amount" type="number" :disabled="dataFrom.amountDisable" v-model="dataFrom.amount" :placeholder="'请输入退款金额'">
                        <span class="help">最多<span class="active">¥{{dataFrom.finalAmount}}</span></span>
                    </div>
                </div>
                <div class="item info" @click="_clearInfo">
                    <label>
                        退款说明<span class="help">(可不填)</span>
                    </label>
                    <div class="val info">
                        <textarea class="instruction" name="instruction" @change="_changeInfo" v-model="dataFrom.instruction"></textarea>
                    </div>
                </div>
                <div class="item image">
                    <label>上传凭证<span>(最多三张)</span></label>
                    <div class="buttom-box">
                        <div class="image" v-if="imageShowVisible">
                            <div class="imageUrl" v-for="img, index in imageList" :key="index">
                                <div class="delImage" @click="_delImage(index)">-</div>
                                <div class="showimg"><img :src="img.src" alt=""></div>
                            </div>
                        </div>
                        <div class="avatar-uploader" v-if="imageList.length < 3">
                            <div class="el-upload el-upload--text" @click=" imagesVisible = true ">
                                <i class="icon iconfont icon-zhaoxiangji"></i>
                                <span>添加照片</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="footer-box" :style="{height:FH}"><a href="javascript:;" class="action" @click="_action">提交申请</a></div>
            <mt-actionsheet ref="typeVisible" :actions="typeActions" v-model="typeVisible" cancelText></mt-actionsheet>
            <mt-actionsheet ref="changeVisible" :actions="changeActions" v-model="changeVisible" cancelText></mt-actionsheet>
            <mt-actionsheet ref="causeVisible" :actions="causeActions" v-model="causeVisible" cancelText></mt-actionsheet>
        </template>
        <template v-else>
            <div class="error-box">
                <div class="error-icon">
                    <img :src="'./static/img/error.png'" alt="">
                </div>
                <div class="error-help">
                    尊敬的用户，您已错过了申请售后的时间（交易完成7天内），如果您有换货或维修的祈求，建议您和客服协商。如需要帮助，您可以向客服提问
                    <p class="goHome">
                        <a href="javascript:;" class="link" onclick="window.history.go(-1)">后退一步</a>
                        <router-link class="link" :to="{ name: 'MyUser'}">回个人中心</router-link>
                        <router-link class="link" :to="{ name: 'Index'}">去首页逛逛</router-link>
                    </p>
                </div>
            </div>
        </template>
        <input type="file" name="file" ref="cameraImg" capture="camera" accept="image/*" @change="_handleUpload('camera')" />
        <input type="file" name="file" ref="uploadImg" @change="_handleUpload()" />
        <mt-actionsheet ref="imagesVisible" :actions="headerActions" v-model="imagesVisible"></mt-actionsheet>
    </div>
</template>
<script>
import { Indicator } from 'mint-ui';
export default {
    name: 'refunds',
    data() {
        return {
            pageQuery: null, // 页面参数
            afterSalesShow: true, // 时候可以申请售后
            bodyHeight: document.documentElement.clientHeight + 'px', // 设置页面高度
            BH: document.documentElement.clientHeight, // 页面高度
            FH: '', // 提交按钮高度

            typeVisibleState: false, // 退款类型 选中后样式
            typeVisible: false, // 退款类型 视图快关
            typeActions: [ // 退款类型 选项
                { name: '我要退货', method: this._callback },
                // { name: '我要换货', method: this._callbackChange },
                { name: '我要退款(无需退货)', method: this._callbackMoney },
            ],

            showReceive: false,
            changeVisibleState: false, // 是否收货 选中后样式
            changeVisible: false, // 是否收货 视图快关
            changeActions: [ // 是否收货 选项
                { name: '未收到货', method: this._changAction1 },
                { name: '已收到货', method: this._changAction2 },
            ],

            causeVisibleState: false, // 退款原因 选中后样式
            causeVisible: false, // 退款原因 视图快关
            causeActions: [ // 退款原因 选项
                { name: '7天无理由退换货', method: this._causeAction1 },
                { name: '退运费', method: this._causeAction2 },
                { name: '质量问题', method: this._causeAction3 },
                { name: '尺寸与商品描述不符', method: this._causeAction4 },
                { name: '保质期与产品描述不符', method: this._causeAction5 },
                { name: '商家发错货', method: this._causeAction6 },
                { name: '有破损、污渍、变形', method: this._causeAction7 },
                { name: '未按约定时间发货', method: this._causeAction8 },
            ],

            imageShowVisible: false, // 凭证图片 显示状态
            imagesVisible: false, // 凭证图片 视图快关
            headerActions: [ // 凭证图片 选项
                { name: '拍照', method: this.getCamera },
                { name: '从相册中选择', method: this.getLibrary },
            ],
            imageList: [], // 凭证图片 数组存储

            dataFrom: { // 需要提交的表单
                type: '请选择退款类型', // 退款类型 显示文字
                changeType: null, // 退款类型 值
                cause: '请选择退款原因', // 退款原因
                isReceiveText: '请选择是否收到货', // 是否收货 显示文字
                isReceive: null, // 是否收货 值
                finalAmount: 0, // 可退款最大金额
                amount: '请输入退款金额', // 退款金额
                amountDisable: false,
                instruction: '请您详细填写退款说明', // 退款说明
                imgUrl: '' // 凭证图片结合
            },
        }
    },
    created() {
        this.pageQuery = this.$route.query;
    },
    destroyed() {
        Indicator.close();
        document.title = ''; // 注销页面标题
    },
    mounted() {
        this._changeDate();
        this.$nextTick(function() {
        	document.title = '售后';
            this._getOrder();
            this._getData();
        });
    },
    methods: {
        // 获取售后详情
        _getData() {
            var _that = this;
            this.$http.get(this.baseUrl + '/front/exchangeOrder/findExchangeDetail', {
                params: { token: this.token, customerCode: this.userInfo.customerCode, ordersNo: this.pageQuery.id }
            }).then(function(res) {
                if (!res) { return }
                var _type;
                _that.dataFrom.changeType = res.exchangeType; // 退款类型 值
                switch (res.exchangeType) {
                    case 1:
                        _that.dataFrom.type = '我要退货'; // 退款类型 显示文字
                        break;
                    case 2:
                        _that.dataFrom.type = '我要换货'; // 退款类型 显示文字
                        break;
                    case 3:
                        _that.dataFrom.type = '我要退款(无需退货)'; // 退款类型 显示文字          
                        _that.showReceive = true; // 是否收货 值
                        _that.changeVisibleState = true;
                        if (res.isReceive == 0) {
                            _that.dataFrom.isReceiveText = '未收到货'; // 是否收货 显示文字
                            _that.dataFrom.amountDisable = true;
                        }else{
                            _that.dataFrom.isReceiveText = '已收到货'; // 是否收货 显示文字
                            _that.dataFrom.amountDisable = false;
                        }
                        break;
                }
                _that.dataFrom.isReceive = res.isReceive;
                _that.dataFrom.cause = res.exchangeReason; // 退款原因
                if (res.exchangeDesc != undefined ) {
                    _that.dataFrom.instruction = res.exchangeDesc; // 退款说明
                }
                _that.dataFrom.amount = res.finalAmount; // 退款金额            
                _that.typeVisibleState = true;
                _that.causeVisibleState = true;
                if (res.imgs != null) {
                    _that.imageList = [];
                    var _srcList = res.imgs.split(',');
                    for (var i = 0; i < _srcList.length; i++) {
                        _that.imageList.push({src: _srcList[i]});
                    }
                    _that.imageShowVisible = true;                }
            });
        },
        // 打开照相机
        getCamera() { this.$refs.cameraImg.click() },

        // 打开相册
        getLibrary() { this.$refs.uploadImg.click() },

        // 退款类型 => 我要退货
        _callback() {
            this.dataFrom.type = '我要退货';
            this.typeVisibleState = true;
            this.dataFrom.changeType = 1;
            this.dataFrom.amountDisable = false;
            this.showReceive = false;
        },

        // 退款类型 => 我要换货
        _callbackChange() {
            this.dataFrom.type = '我要换货';
            this.typeVisibleState = true;
            this.dataFrom.changeType = 2;
            this.dataFrom.amount = '';
            this.dataFrom.amountDisable = false;
            this.showReceive = false;
        },

        // 退款类型 => 我要退款(无需退货
        _callbackMoney() {
            this.dataFrom.type = '我要退款(无需退货)';
            this.typeVisibleState = true;
            this.dataFrom.changeType = 3;
            this.dataFrom.amount = '';
            this.dataFrom.amountDisable = false;
            this.showReceive = true;
        },

        // 收货状态 => 未收到货
        _changAction1() {
            this.dataFrom.isReceiveText = '未收到货';
            this.dataFrom.amount = this.dataFrom.finalAmount;
            this.dataFrom.amountDisable = true;
            this.dataFrom.isReceive = '0';
            this.changeVisibleState = true;
        },

        // 收货状态 => 已收到货
        _changAction2() {
            this.dataFrom.isReceiveText = '已收到货';
            this.dataFrom.amount = '';
            this.dataFrom.amountDisable = false;
            this.dataFrom.isReceive = '1';
            this.changeVisibleState = true;
        },

        // 退款原因 => 集合
        _causeAction1() { this.dataFrom.cause = '7天无理由退换货', this.causeVisibleState = true; },
        _causeAction2() { this.dataFrom.cause = '退运费', this.causeVisibleState = true; },
        _causeAction3() { this.dataFrom.cause = '质量问题', this.causeVisibleState = true; },
        _causeAction4() { this.dataFrom.cause = '尺寸与商品描述不符', this.causeVisibleState = true; },
        _causeAction5() { this.dataFrom.cause = '保质期与产品描述不符', this.causeVisibleState = true; },
        _causeAction6() { this.dataFrom.cause = '商家发错货', this.causeVisibleState = true; },
        _causeAction7() { this.dataFrom.cause = '有破损、污渍、变形', this.causeVisibleState = true; },
        _causeAction8() { this.dataFrom.cause = '未按约定时间发货', this.causeVisibleState = true; },

        // 判断时候可以申请售后
        _changeDate() {
            var _that = this;
            this.$http.get(this.baseUrl + '/front/exchangeOrder/checkExchange', {
                params: { ordersNo: this.pageQuery.id, token: this.token, customerCode: this.userInfo.customerCode }
            }).then(function(res) {
                if (res == 'false' || !res) {
                    return _that.afterSalesShow = false
                } else {
                    _that.afterSalesShow = true;
                }
            });
        },

        // 获取订单
        _getOrder() {
            this.order = JSON.parse(localStorage.getItem('_afterSales'));
            if (!this.order) { return }
            this.dataFrom.finalAmount = this.NumberMul(this.order.ordersInfoList[0].count, this.order.ordersInfoList[0].productPrice);
            // console.clear();
        },

        // 控制最大退款金额
        _changeAmount(ev) {
            if (parseFloat(this.$refs.amount.value) > parseFloat(this.dataFrom.finalAmount)) {
                this.$refs.amount.value = this.dataFrom.finalAmount;
                this.dataFrom.amount = this.$refs.amount.value;
            }
            ev = ev || event;
            var el = ev.currentTarget;
            el.setAttribute('class', 'on amount');
        },

        // 退款说明输入后样式
        _changeInfo(ev) {
            ev = ev || event;
            var el = ev.currentTarget;
            el.setAttribute('class', 'on instruction');
        },

        // 清空默认退款说明
        _clearInfo() {
            this.dataFrom.instruction == '请您详细填写退款说明' ? this.dataFrom.instruction = '' : null
        },

        // 上传图片
        _handleUpload(_tagter) {
            var files,
                _that = this,
                _formData = new FormData();
            if (_tagter != null) { files = this.uploadImgFn(this.$refs.cameraImg) } else { files = this.uploadImgFn(this.$refs.uploadImg) }
            if(!files){ return; }
            Indicator.open({text: '图片上传中...'});
            _formData.append('token', this.token);
            _formData.append('customerCode', this.userInfo.customerCode);
            _formData.append('files', files.fileObj);
            this.$http.post(this.baseUrl + '/front/exchangeOrder/uploadExchangeFiles', {
                formData: _formData
            }).then(function(res) {
                Indicator.close();
                if (!res) { return }
                _that.imageShowVisible = true;
                if (2 >= _that.imageList.length) {
                    _that.imageList.push({ src: res.filePath });
                } else {
                    _that.imageList.splice(_that.imageList.length - 1, 1, { src: res.filePath });
                }
            }).catch(function(error){
                Indicator.close();
            });
        },

        // 删除图片
        _delImage(_index) { this.imageList.splice(_index, 1) },

        // 提交申请
        _action() {
            if (this.dataFrom.type == "请选择退款类型") { return this.$toast('请选择 退货类型!') }
            if (this.dataFrom.changeType == 3) {
                if (this.dataFrom.isReceiveText == "请选择是否收到货") { return this.$toast('请选择 收货状态!') }
            }
            if (this.dataFrom.cause == "请选择退款原因") { return this.$toast('请选择 退货原因!') }
            if (this.dataFrom.amount == "请输入退款金额") { this.dataFrom.amount = 0 }
            if (this.dataFrom.instruction == "请您详细填写退款说明") { this.dataFrom.instruction = ''; }
            var _that = this,
                _params = {
                    token: this.token,
                    ordersNo: this.pageQuery.id,
                    customerCode: this.userInfo.customerCode,
                    exchangeType: this.dataFrom.changeType,
                    refundAmount: this.dataFrom.amount,
                    exchangeReason: this.dataFrom.cause,
                    exchangeDesc: this.dataFrom.instruction,
                };
            if (this.dataFrom.changeType == 3) { _params.isReceive = this.dataFrom.isReceive; }
            if (this.imageList.length > 0) {
                for (var i = 0; i < this.imageList.length; i++) {
                    if (i == this.imageList.length - 1) {
                        this.dataFrom.imgUrl = this.dataFrom.imgUrl + this.imageList[i].src;
                    } else {
                        this.dataFrom.imgUrl = this.dataFrom.imgUrl + this.imageList[i].src + ',';
                    }
                }
                _params.imgs = this.dataFrom.imgUrl;
            }
            this.$http.post(this.baseUrl + '/front/exchangeOrder/addOrUpdateExchange', _params).then(function(res) {
                if (!res) { return }
                _that.$router.push({ name: 'MyAfterSalesState', query: { no: res.exchangeNo, code: res.exchangeCode } });
            });
        }
    }
}

</script>
<style>
@import 'afterSales.css'

</style>
