<!-- 
    售后详情 => 协商详情
 -->
<template>
    <div id="afterSalesNegotiate" :style="{'min-height':bodyHeight}">
        <template v-if="pageQuery != null && pageQuery.state != true ">
            <template v-if="!showInput">
                <div class="negotiate-box" @click="_goNegotiate">
                    <input type="text" placeholder="请输入留言(必填)">
                </div>
            </template>
            <template v-else>
                <div class="negotiate-box on" id="input-box">
                    <textarea rows="3" id="negotiateText" v-model="negotiateText" autofocus></textarea>
                    <div :class="['number-box ']+ [negotiateTextInput >= negotiateTextLength ? 'active': '']">{{negotiateTextInput}}/{{negotiateTextLength}}</div>
                </div>
                <div class="negotiate-box on">
                    <label>上传凭证<span>(最多三张)</span></label>
                    <div class="buttom-box">
                        <div class="image" v-if="imageVisible">
                            <div class="imageUrl" v-for="img, index in imageList" :key="index">
                                <div class="delImage" @click="_delImage(index)">-</div>
                                <div class="showimg"><img :src="img.src" alt=""></div>
                            </div>
                        </div>
                        <div class="avatar-uploader" v-if="imageList.length < 3">
                            <div class="el-upload el-upload--text" @click=" headerVisible = true ">
                                <i class="icon iconfont icon-zhaoxiangji"></i>
                                <span>添加照片</span>
                            </div>
                        </div>
                    </div>
                    <div class="negotiate-action">
                        <a href="javascript:;" class="action active" @click="_actionFrom">发表留言</a>
                        <a href="javascript:;" class="action" @click="showInput = false">取消</a>
                    </div>
                </div>
            </template>
        </template>
        <div class="negotiates-list">
            <div class="negotiate-item" v-for="_ngobj, _index in negotiates" :key="_index">
                <div class="userInfo" v-if="_ngobj.operType == 1">
                    <div class="cover"><img :src="userInfo.phoneUrl" alt=""></div>
                    <div class="info">
                        <span class="name">{{ _ngobj.operName }}</span>
                        <span class="time">{{ formatDate(_ngobj.operTime, 'time') }}</span>
                    </div>
                </div>
                <div class="userInfo" v-else>
                    <div class="cover"><img :src="AdminUser.header" alt=""></div>
                    <div class="info">
                        <span class="name">{{ AdminUser.name }}
                            <template v-if="_ngobj.operType == 2">卖家</template>
                            <template v-if="_ngobj.operType == 3">系统</template>
                        </span>
                        <span class="time">{{ formatDate(_ngobj.operTime, 'time') }}</span>
                    </div>
                </div>
                <ul class="negotiate-desc">
                    <li class="item">
                        <template v-if="_ngobj.operType == 1">买家</template>
                        <template v-if="_ngobj.operType == 2">卖家</template>
                        <template v-if="_ngobj.operType == 3">系统</template>
                        ({{_ngobj.operName}}) &nbsp;于&nbsp; {{ formatDate(_ngobj.operTime, 'time') }}&nbsp; {{ _ngobj.helpText }}
                    </li>
                    <template v-if="_ngobj.msgType == '1' || _ngobj.msgType == '2'">
                        <li class="item">
                            <span class="title">退款类型: </span>
                            <span class="val" v-if="_ngobj.exchangeType == 1">退货</span>
                            <span class="val" v-else-if="_ngobj.exchangeType == 2">换货</span>
                            <span class="val" v-else-if="_ngobj.exchangeType == 3">退款</span>
                        </li>
                        <li class="item"><span class="title">退款金额: </span><span class="val">￥{{ _ngobj.refundAmount }}</span></li>
                        <li class="item"><span class="title">退款原因: </span><span class="val">{{ _ngobj.exchangeReason }}</span></li>
                        <li class="item"><span class="title">退款说明: </span><span class="val">{{ _ngobj.message }}</span></li>
                    </template>
                    <template v-else-if="_ngobj.msgType == '10'">
                        <li class="item"><span class="val">{{_ngobj.message}}</span></li>
                    </template>
                    <template v-else-if="_ngobj.msgType == '5' || _ngobj.msgType == '3'"></template>
                    <template v-else>
                        <li class="item"><span class="title min">内容: </span>
                            <!-- <span class="val">{{_ngobj.message}}</span> -->
                            <span class="val" v-html="_ngobj.message"></span>
                        </li>
                    </template>
                    <li class="item img" v-if="_ngobj.imgs != 'undefined' && _ngobj.imgs !='' && _ngobj.imgs != null">
                        <div class="cover" v-for="_img, _index in _ngobj.imgList" :key="_index" @click="_seeBigImg(_img)">
                            <img :src="_img" alt="">
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <input type="file" name="file" ref="cameraImg" capture="camera" accept="image/*" @change="_handleUpload('camera')" />
        <input type="file" name="file" ref="uploadImg" @change="_handleUpload()" />
        <mt-actionsheet ref="headerVisible" :actions="headerActions" v-model="headerVisible"></mt-actionsheet>
        <div class="img-pop" v-if="showBigImg" @click="showBigImg = false">
            <img :src="bigImg" />
        </div>
    </div>
</template>
<script>
import { Indicator } from 'mint-ui';
export default {
    name: 'refunds',
    data() {
        return {
            showBigImg: false,
            bigImg: null,
            pageQuery: null,
            page: { total: 0, current: 1, size: 10, },
            showInput: false,
            bodyHeight: document.documentElement.clientHeight + 'px',
            negotiates: [],
            imageUrl: '',
            imageList: [],
            imageVisible: false,
            negotiateText: '输入留言(必填)',
            negotiateTextInput: 0,
            negotiateTextLength: 140,
            headerVisible: false,
            headerActions: [ // 个人头像 => 功能
                { name: '拍照', method: this.getCamera },
                { name: '从相册中选择', method: this.getLibrary },
            ],
        }
    },
    created() {
        document.title = '协商详情';
    },
    watch: {
        negotiateText: function(val, oldVal) { this.negotiateTextInput = this._getStringLen(val) }
    },
    mounted() {
        this.pageQuery = this.$route.query;
        this._getData();
    },
    destroyed() {
        Indicator.close();
    },
    methods: {
        // 打开照相机
        getCamera() { this.$refs.cameraImg.click() },

        // 打开相册
        getLibrary() { this.$refs.uploadImg.click() },

        // 获取数据
        _getData() {
            var _that = this;
            this.negotiates = [];
            this.$http.get(this.baseUrl + '/front/exchangeOrder/findExchangeMsgList', {
                params: {
                    token: this.token,
                    customerCode: this.userInfo.customerCode,
                    exchangeNo: this.pageQuery.no,
                    pageSize: this.page.size,
                    pageNum: this.page.current
                }
            }).then(function(res) {
                if (!res) { return }
                for (var i = 0; i < res.aatList.length; i++) {
                    var _obj = res.aatList[i];
                    switch (res.aatList[i].msgType) {
                        case 1:
                            _obj.helpText = '发起售后申请';
                            break;
                        case 2:
                            _obj.helpText = '修改售后申请';
                            break;
                        case 3:
                            _obj.helpText = '撤销售后申请';
                            break;
                        case 4:
                            _obj.helpText = '留言';
                            break;
                        case 5:
                            _obj.helpText = '同意申请';
                            break;
                        case 6:
                            _obj.helpText = '拒绝申请';
                            break;
                        case 7:
                            _obj.helpText = '留言';
                            break;
                        case 8:
                            _obj.helpText = '退款成功';
                            break;
                        case 9:
                            _obj.helpText = '售后完成';
                            break;
                        case 10:
                            _obj.helpText = '添加退货快递';
                            break;
                        case 11:
                            _obj.helpText = '自动关闭';
                            break;
                        case 12:
                            _obj.helpText = '自动同意';
                            break;
                    }
                    if (res.aatList[i].imgs != null) { _obj.imgList = res.aatList[i].imgs.split(',') }
                    _that.negotiates.push(_obj);
                }
            })
        },

        // 去协商, 编辑信息
        _goNegotiate() {
            this.showInput = true;
            this.negotiateText = '';
        },

        // 获取字符串的实际长度
        _getStringLen(str) {
            var _length = 0,
                _code = -1;
            for (var i = 0; i < str.length; i++) {
                _code = str.charCodeAt(i);
                if (_code >= 0 && _code <= 128) {
                    _length += 1;
                } else { _length += 2; }
            }
            return _length;
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
                _that.imageVisible = true;
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
        _delImage(_index) {
            this.imageList.splice(_index, 1);
        },

        //查看大图
        _seeBigImg(_img) {
            this.showBigImg = true;
            this.bigImg = _img;
        },

        // 提交留言
        _actionFrom() {
            if (this.negotiateText == '' || this.negotiateText == null) { return this.$toast('请输入留言!') }
                var _message = this.negotiateText.replace(/\n|\r\n/g,"<br>");
            // console.log(_message, this.negotiateText);
            // return;
            if (this.negotiateTextInput >= this.negotiateTextLength) { return this.$toast('输入留言过长,请修改留言!') }
            if (this.imageList.length > 0) {
                var _imgsUrl = '';
                for (var i = 0; i < this.imageList.length; i++) {
                    if (i == this.imageList.length - 1) {
                        _imgsUrl = _imgsUrl + this.imageList[i].src;
                    } else {
                        _imgsUrl = _imgsUrl + this.imageList[i].src + ',';
                    }
                }
            }
            var _that = this;
            this.$http.post(this.baseUrl + '/front/exchangeOrder/addExchangeMsg', {
                token: this.token,
                customerCode: this.userInfo.customerCode,
                exchangeNo: this.pageQuery.no,
                exchangeDesc: _message,
                imgs: _imgsUrl
            }).then(function(res) {
                if (!res) { return }
                _that.showInput = false;
                _that.imageList = [];
                _that._getData();
            });
        }
    }
}

</script>
<style>
@import './afterSales.css';
</style>
<style>
.editInputBox { color: #333; background-color: red;}
.edit-div { padding: .5rem 1rem; border-radius: .5rem; overflow-y: auto; color: #b2b2b2; font-size: 1.2rem; line-height: 1.6rem; box-sizing: border-box;}
.edit-div:focus { border: 1px dotted #666; border: none; color: rgba(0,0,0,.7); outline: none; }
</style>