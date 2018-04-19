<!-- 订单评价 -->
<template>
    <div id="orderAppraise" :style="{'min-height' : bodyHeight}" v-if="orderData != null">
        <ul class="goodList">
            <li class="ordersInfoList" v-for="good, _index in orderData" :key="_index">
                <div ref="orderBox" class="order-box">
                    <div class="cover"><img :src="good.proSimg" alt=""></div>
                    <div class="order-name">{{good.proName}}</div>
                </div>
                <div ref="appraiseBox" class="appraise-box" v-if="actionFrom.length > 0">
                    <div class="edit-div-box">
                        <textarea class="edit-div" @blur="actionFrom[_index].text = _setFocus(actionFrom[_index].text)" @click="actionFrom[_index].text = _getFocus(actionFrom[_index].text)" :value="actionFrom[_index].text" @input="actionFrom[_index].text = $event.target.value"></textarea>
                    </div>
                    <div :class="['number-box '] + [actionFrom[_index].text.length > maxLength?'active': '']">{{actionFrom[_index].text.length}}/{{maxLength}}</div>
                    <div class="buttom-box">
                        <label class="help-text">上传凭证<span>(最多三张)</span></label>
                        <div class="image" v-if="actionFrom[_index].imgVisible">
                            <div class="imageUrl" v-for="img, _imgIndex in actionFrom[_index].imgList" :key="_imgIndex">
                                <div class="delImage" @click="_delImage(actionFrom[_index].imgList, _imgIndex)">-</div>
                                <div class="showimg"><img :src="img.src" alt=""></div>
                            </div>
                        </div>
                        <div class="avatar-uploader" v-if="actionFrom[_index].imgList.length < 3">
                            <div class="el-upload el-upload--text" @click="visibleIndex = _index; headerVisible = true ">
                                <i class="icon iconfont icon-zhaoxiangji"></i>
                                <span>添加照片</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div ref="starsBox" class="stars-box" v-if="isNew && actionFrom.length > 0">
                    <label for="">商品评价</label>
                    <ul class="star">
                        <li v-for="n, _starIndex in 5" @click="actionFrom[_index].star = n" :class="n > actionFrom[_index].star ? '' : 'active'">
                            <template v-if="n > actionFrom[_index].star"><i class="icon iconfont icon-xingxingdianjiqian"></i></template>
                            <template v-else><i class="icon iconfont icon-xingxingdianjihou"></i></template>
                        </li>
                    </ul>
                </div>
            </li>
        </ul>
        <div class="footer-box"><a href="javascript:;" class="action" @click="_actionData">提交评价</a></div>
        <input type="file" name="file" ref="cameraImg" capture="camera" accept="image/*" @change="_handleUpload('camera')" />
        <input type="file" name="file" ref="uploadImg" @change="_handleUpload()" />
        <mt-actionsheet ref="headerVisible" :actions="headerActions" v-model="headerVisible"></mt-actionsheet>
    </div>
</template>
<script>
import { MessageBox } from 'mint-ui';
import { Indicator } from 'mint-ui';
export default {
    name: 'orderAppraise',
    data() {
        return {
            pageQuery: null,
            isNew: true,
            bodyHeight: (document.documentElement.clientHeight - 84) + 'px',
            orderData: null,
            goodList: null,
            maxLength: 140,
            actionFrom: [],
            page: { size: 10, num: 1 },
            visibleIndex: null,
            headerVisible: false,
            headerActions: [ // 个人头像 => 功能
                { name: '拍照', method: this.getCamera },
                { name: '从相册中选择', method: this.getLibrary },
            ],
        }
    },
    created() {
       
    },
    destroyed() {
        Indicator.close();
    },
    mounted() {
        document.title = '订单评价';
        this.pageQuery = this.$route.query;
        this.isNew = this.pageQuery.status == 4 ? true : false;
        this.isNew ? this.appraiseText = '分享你的购买心得吧' : this.appraiseText = '亲，有什么需要追加的评价么？';
        this._getOrderData();
        this.$nextTick(function() {
        	document.title = '订单评价';
        });
    },
    methods: {
        // 打开照相机
        getCamera() { this.$refs.cameraImg.click() },

        // 打开相册
        getLibrary() { this.$refs.uploadImg.click() },

        // 获取订单 => 数据. 判断是否为新评价
        _getOrderData() {
            var _that = this;
            this.$http.get(this.baseUrl + '/order/findEvaluateProduct', {
                params: {
                    customerCode: this.userInfo.customerCode,
                    totalOrdersNo: this.pageQuery.No,
                    pageSize: this.page.size,
                    pageNum: this.page.num,
                    token: this.token
                }
            }).then(function(res) {
                if (!res) { return }
                _that.orderData = res.evaluateList;
                for (var i = 0; i < res.evaluateList.length; i++) {
                    _that.actionFrom.push({
                        evaluateProductCode: res.evaluateList[i].productId,
                        evaluateProductSkuCode: res.evaluateList[i].productSkuCode,
                        text: _that.appraiseText,
                        length: 0,
                        star: 0,
                        imgVisible: false,
                        imgList: []
                    });
                }
            });
        },

        // 清空默认评论内容
        _getFocus(_target) {
            if (_target == '分享你的购买心得吧' || _target == '亲，有什么需要追加的评价么？') {
                return '';
            }
            return _target;
        },

        // 离开评论内容, 没填写.写入提示
        _setFocus(_target) {
            if (_target == '') {
                if (this.isNew) {
                    return '分享你的购买心得吧';
                } else {
                    return '亲，有什么需要追加的评价么？';
                }
            }
            return _target;
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
            this.$http.post(this.baseUrl + '/order/uploadEvaluateFiles', {
                formData: _formData
            }).then(function(res) {
                Indicator.close();
                if (!res) { return }
                _that._handleAvatarSuccess(res.filePath);
            }).catch(function(error){
                Indicator.close();
            });
        },

        // 显示图片
        _handleAvatarSuccess(_imgUrl) {
            var _arr = this.actionFrom[this.visibleIndex].imgList;
            this.actionFrom[this.visibleIndex].imgVisible = true;
            if (2 >= _arr.length) {
                _arr.push({ src: _imgUrl });
            } else {
                _arr.splice(_arr.length - 1, 1, { src: _imgUrl });
            }
        },

        // 删除照片 =>没好
        _delImage(_target, _index) { _target.splice(_index, 1) },

        // 提交订单评论
        _actionData() {
            var _list = [],
                _that = this;
            var _flg = false;
            if (this.isNew) {
                for (var i = 0; i < this.actionFrom.length; i++) {
                    if (this.actionFrom[i].star > 0) { _flg = true }
                    if (this.actionFrom[i].text == '分享你的购买心得吧') { this.actionFrom[i].text = ''; }
                }
            } else {
                for (var i = 0; i < this.actionFrom.length; i++) {
                    if (this.actionFrom[i].text != '亲，有什么需要追加的评价么？') { _flg = true }
                }
            }
            for (var i = 0; i < this.actionFrom.length; i++) {
                if (this.actionFrom[i].text.length > this.maxLength ) {
                    return this.$toast('评价内容过长!')
                }
            }
            if (this.isNew && !_flg) { return this.$toast('请输评价等级!') }
            if (!this.isNew && !_flg) { return this.$toast('请输入评价!') }
            for (var i = 0; i < this.actionFrom.length; i++) {
                var imgurl = ''; // 评价图片数组
                for (var j = 0; j < this.actionFrom[i].imgList.length; j++) {
                    if (j == this.actionFrom[i].imgList.length - 1) {
                        imgurl = imgurl + this.actionFrom[i].imgList[j].src;
                    } else {
                        imgurl = imgurl + this.actionFrom[i].imgList[j].src + ',';
                    }
                }
                var temp = {
                    evaluateProductCode: this.actionFrom[i].evaluateProductCode,
                    evaluateProductSkuCode: this.actionFrom[i].evaluateProductSkuCode,
                    evaluateImgs: imgurl
                } // 商品信息
                if (this.isNew) {
                    if (this.actionFrom[i].star > 0) {
                        temp.evaluateScore = this.actionFrom[i].star;
                        temp.evaluateContent = this.actionFrom[i].text;
                        _list.push(temp);
                    }
                } else {
                    if (this.actionFrom[i].text != '亲，有什么需要追加的评价么？') {
                        temp.evaluateContent = this.actionFrom[i].text;
                        _list.push(temp);
                    }
                } // 是否第一次评价                
            }
            var params = {
                customerCode: this.userInfo.customerCode,
                totalOrderNo: this.pageQuery.No,
                evaluateList: _list,
                token: this.token
            }
            this.$http.post(this.baseUrl + '/order/addOrderEvaluate', { sendJson: JSON.stringify(params) }).then(function(res) {
                if (!res) { return }
                _that.$router.push({
                    name: 'MyOrderAppraiseSuccess',
                })
            });
        },
    }
}

</script>
<style>
@import './order.css'

</style>
