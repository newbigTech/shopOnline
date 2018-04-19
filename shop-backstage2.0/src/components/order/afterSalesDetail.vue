<!-- 订单管理 -详情-->
<template>
    <div class="orderDetail">
        <v-breadcrumb firstMenu="订单" secondMenu="售后详情"></v-breadcrumb>
        <div class="nav row">
            <div class="col-md-12">
                <div class="portlet box red">
                    <div class="portlet-title">
                        <div class="caption">售后详情</div>
                    </div>
                    <div class="portlet-body">
                        <el-table :data="tableData">
                            <el-table-column prop="ordersNo" label="订单编号"> </el-table-column>
                            <el-table-column prop="productName" label="商品名称"> </el-table-column>
                            <el-table-column prop="origiPrice" label="商品价格"></el-table-column>
                            <el-table-column prop="price" label="成交价格"> </el-table-column>
                            <el-table-column prop="exchangeNumber" label="购买数量"> </el-table-column>
                        </el-table>
                        <div class="service-detail" v-if="dataObj!=null">
                            <h4>服务单明细</h4>
                            <div class="form-horizontal">
                                <div class="form-group">
                                    <label class="col-md-2 control-label" for="title">服务类型：</label>
                                    <div class="col-md-5" v-if="dataObj.exchangeType == 1">退货</div>
                                    <div class="col-md-5" v-if="dataObj.exchangeType == 2">换货</div>
                                    <div class="col-md-5" v-if="dataObj.exchangeType == 3">退款</div>
                                </div>
                                <div class="form-group">
                                    <label class="col-md-2 control-label" for="title">提交数量：</label>
                                    <div class="col-md-5">{{dataObj.exchangeNumber}}</div>
                                </div>
                                <div class="form-group">
                                    <label class="col-md-2 control-label" for="title">问题描述：</label>
                                    <div class="col-md-5">{{dataObj.exchangeDesc}}</div>
                                </div>
                                <div class="form-group">
                                    <label class="col-md-2 control-label" for="title">商品返回方式 ：</label>
                                    <div class="col-md-5">
                                        <template v-if="dataObj.exchangeType == 1">快递至工厂</template>
                                        <template v-if="dataObj.exchangeType == 2">快递至工厂</template>
                                        <template v-if="dataObj.exchangeType == 3">无需退货</template>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="col-md-2 control-label" for="title">手机号：</label>
                                    <div class="col-md-5">{{dataObj.phone}}</div>
                                </div>
                                <div class="form-group">
                                    <label class="col-md-2 control-label" for="title">快递公司：</label>
                                    <div class="col-md-5">{{dataObj.expressCompany}}</div>
                                </div>
                                <div class="form-group">
                                    <label class="col-md-2 control-label" for="title">快递单号：</label>
                                    <div class="col-md-5">{{dataObj.expressCode}}</div>
                                </div>
                            </div>
                            <button type="button" class="btn " @click="$router.push({name: 'afterSales'})">返回</button>
                        </div>
                        <div class="logistics">
                            <el-tabs v-model="activeName" @tab-click="_handleClick">
                                <el-tab-pane label="协商记录" name="first">
                                    <div class="logistics-item" v-for="item, index in listData" :key='index'>
                                        <div class="title">
                                            <template v-if="item.operType == 1"> 买家 </template>
                                            <template v-if="item.operType == 2"> 客服 </template>
                                            <template v-if="item.operType == 3"> 系统 </template>
                                            <span class="time">{{ formatDate(item.operTime,'time') }}</span>
                                        </div>
                                        <div class="con">
                                            <p>
                                                <template v-if="item.operType == 1"> 买家 </template>
                                                <template v-if="item.operType == 2"> 客服 </template>
                                                <template v-if="item.operType == 3"> 系统 </template>
                                                于 {{ formatDate(item.operTime,'time') }} {{item.helpText}}
                                            </p>
                                            <template v-if="item.msgType == 1">
                                                <p>退款类型: {{ item.exchangeReason}} </p>
                                                <p>退款金额: ￥{{ item.refundAmount }} </p>
                                                <p>退款说明: {{ item.message }} </p>
                                            </template>
                                            <template v-else-if="item.msgType == 10">
                                                <p> {{ item.message }} </p>
                                            </template>
                                            <template v-else>
                                                <p>
                                                    <span v-if="item.msgType == 6">拒绝理由</span>
                                                    <span v-if="item.msgType == 7">留言内容</span> {{ item.message }}
                                                </p>
                                            </template>
                                            <div v-if="item.imgs != 'undefined' && item.imgs !='' && item.imgs != null">
                                                <img :src="img" v-for="img, imgindex in item.imgList" :key="imgindex" />
                                            </div>
                                        </div>
                                    </div>
                                </el-tab-pane>
                                <el-tab-pane label="发表留言" name="second">
                                    <textarea class="logistics-ta" v-model="inputText"></textarea>
                                    还可以输入 <strong :class="inputDisable?'text-danger':''">{{actionForm.textlength - actionForm.text.length}}</strong> 字
                                    <div class="buttom-box">
                                        <label>上传凭证<span>(最多三张)</span></label>
                                        <div class="image" v-if="imageVisible">
                                            <div class="imageUrl" v-for="img, index in imageList" :key="index">
                                                <div class="delImage" @click="_delImage(index)">-</div>
                                                <div class="showimg"><img :src="img.src" alt=""></div>
                                            </div>
                                        </div>
                                        <div class="avatar-uploader">
                                            <div class="el-upload el-upload--text" @click="$refs.cameraImg.click() ">
                                                <i class="icon iconfont icon-xinfeng"></i>
                                                <input type="file" name="file" ref="cameraImg" @change="_handleUpload" />
                                                <span>添加照片</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="mt20">
                                        <button type="button" class="btn primary" @click="_action">发表留言凭证</button>
                                        <button type="button" class="btn default">取消</button>
                                    </div>
                                </el-tab-pane>
                            </el-tabs>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { Message } from 'element-ui';
import breadcrumb from '@/components/tool/breadcrumb' //面包屑
export default {
    name: 'orderDetail',
    components: {
        'v-breadcrumb': breadcrumb
    },
    data() {
        return {
            dataObj: null,
            tableData: [],
            listData: [],
            page: {
                size: 10,
                current: 1,
                total: 0,
            },
            imageVisible: false,
            imageList: [],
            activeName: 'first',
            inputText: '',
            inputDisable: false,
            actionForm: {
                text: '',
                textlength: 200,
                imgs: null,
            }
        }
    },
    created() {
        this.pageQuery = this.$route.query;
        this.$nextTick(function() {
            this._getData();
            this._getDataList();
        });
    },
    watch: {
        inputText: function(val, oldval) {
            if (val.length > this.actionForm.textlength) {
                this.inputDisable = true;
            }
            this.actionForm.text = val;
        }
    },
    methods: {
        // 获取数据
        _getData() {
            var _that = this;
            this.$http.get(this.baseUrl + '/back/exchangeOrder/findExchangeDetail', {
                params: {
                    token: this.token,
                    exchangeNo: this.pageQuery.no
                }
            }).then(function(res) {
                if (!res) { return }
                console.log(res);
                _that.dataObj = res;
                _that.tableData.push(res);
            });
        },
        // 获取协商记录
        _getDataList() {
            var _that = this;
            this.$http.get(this.baseUrl + '/back/exchangeOrder/findExchangeMsgList', {
                params: {
                    token: this.token,
                    exchangeNo: this.pageQuery.no,
                    pageSize: this.page.size,
                    pageNum: this.page.current
                }
            }).then(function(res) {
                if (!res) { return }
                _that.page.total = res.total;
                for (var i = 0; i < res.aatList.length; i++) {
                    var _obj = res.aatList[i];
                    switch (res.aatList[i].msgType) {
                        case 1:
                            _obj.helpText = '申请售后';
                            break;
                        case 2:
                            _obj.helpText = '修改售后';
                            break;
                        case 3:
                            _obj.helpText = '撤销售后';
                            break;
                        case 4:
                            _obj.helpText = '主动留言';
                            break;
                        case 5:
                            _obj.helpText = '同意申请';
                            break;
                        case 6:
                            _obj.helpText = '拒绝申请';
                            break;
                        case 7:
                            _obj.helpText = '主动留言';
                            break;
                        case 8:
                            _obj.helpText = '退款成功';
                            break;
                        case 9:
                            _obj.helpText = '售后完成';
                            break;
                        case 10:
                            _obj.helpText = '添加售后快递';
                            break;
                        case 11:
                            _obj.helpText = '自动关闭';
                            break;
                        case 12:
                            _obj.helpText = '自动同意';
                            break;
                    }
                    if (res.aatList[i].imgs != null) {
                        _obj.imgList = res.aatList[i].imgs.split(',');
                    } else {
                        _obj.imgList = [];
                    }
                    _that.listData.push(_obj);
                }
                if (_that.page.total > _that.listData.length) {
                    _that.page.current++
                        _that._getDataList();
                }
            })
        },

        // 切换清空留言
        _handleClick: function() {
            if (this.activeName == 'second') {
                this.inputDisable = false;
                this.actionForm.text = '';
                this.inputText = '';
            }
        },

        // 上传限制
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isPNG = file.type === 'image/png';
            const isLt2M = file.size / 1024 / 1024 < 5;
            var isIMG = true;
            if (!isJPG) {
                if (!isPNG) {
                    this.$message.error('上传图片只能是 JPG, PNG 格式!');
                    isIMG = false;
                }
            }
            if (!isLt2M) {
                this.$message.error('上传图片大小不能超过 5MB!');
            }
            return isIMG && isLt2M;
        },
        // 上传图片
        _handleUpload() {
            var _that = this,
                files = this.uploadImgFn(this.$refs.cameraImg),
                _formData = new FormData();
            this.beforeAvatarUpload(files.fileObj);
            _formData.append('token', this.token);
            _formData.append('customerCode', this.userInfo.customerCode);
            _formData.append('files', files.fileObj);
            this.$http.post(this.baseUrl + '/front/exchangeOrder/uploadExchangeFiles', {
                formData: _formData
            }).then(function(res) {
                if (!res) { return }
                _that.imageVisible = true;
                if (2 >= _that.imageList.length) {
                    _that.imageList.push({ src: res.filePath });
                } else {
                    _that.imageList.splice(_that.imageList.length - 1, 1, { src: res.filePath });
                }
            });
        },

        // 删除图片
        _delImage(_index) {
            this.imageList.splice(_index, 1);
        },

        // 提交,并验证
        _action() {
            if (this.inputDisable) { this.$message('留言内容过长'); }
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
            this.$http.post(this.baseUrl + '/back/exchangeOrder/addExchangeMsg', {
                token: this.token,
                exchangeNo: this.pageQuery.no,
                exchangeDesc: this.actionForm.text,
                userId: this.userInfo.userId,
                imgs: _imgsUrl
            }).then(function(res) {
                if (!res) { return; }
                _that.listData = [];
                _that._getDataList();
                _that.activeName = 'first';
            });
        }
    }
}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style scoped>
.buttom-box {
    width: auto;
    height: auto;
    border-radius: .5rem;
    margin-top: 1rem;
}

.buttom-box label {
    width: 100%;
    display: block;
    float: left;
    margin-bottom: 1rem;
}

.buttom-box .image {
    display: inline-block;
    width: auto;
    height: 6rem;
    vertical-align: top;
}

.buttom-box .image .imageUrl {
    position: relative;
    display: inline-block;
    width: 6rem;
    height: 6rem;
    margin-right: 1rem;
}

.buttom-box .image .imageUrl .delImage {
    font-size: 2rem;
    font-weight: 500;
    line-height: 1.25rem;
    position: absolute;
    top: -.35rem;
    right: -.35rem;
    width: 1.5rem;
    height: 1.5rem;
    text-align: center;
    vertical-align: middle;
    color: white;
    border-radius: 50%;
    background-color: #ff4242;
}

.buttom-box .image .imageUrl .showimg {
    overflow: hidden;
    width: 100%;
    height: 100%;
}

.buttom-box .image .imageUrl img {
    width: auto;
    max-width: 100%;
    height: auto;
    min-height: 100%;
    border-radius: .5rem;
}

.avatar-uploader {
    position: relative;
    display: inline-block;
    overflow: hidden;
    width: 6rem;
    height: 6rem;
    vertical-align: top;
    border: 1px dotted #ececec;
    border-radius: .5rem;
}

.avatar-uploader input[type="file"] {
    display: none;
}

.avatar-uploader .el-upload.el-upload--text {
    width: 100%;
    padding: 1rem 0;
}

.avatar-uploader i.icon {
    font-size: 2rem;
    display: block;
    width: 100%;
    line-height: 2.4rem;
    text-align: center;
    margin: 0 auto;
}

.avatar-uploader span {
    display: block;
    text-align: center;
    width: 100%;
    margin-top: .5rem;
}

.goods-img {
    width: 100px;
    height: 50px;
}

.operate span {
    margin-left: 10px;
}

.service-detail,
.logistics {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px dashed #ccc;
}

.service-detail .col-md-5 {
    padding-top: 10px;
}

.logistics-ta {
    width: 500px;
    height: 200px;
    resize: none;
}

.logistics-item {
    margin: 20px;
}

.logistics-item .title {
    line-height: 30px;
    font-size: 15px;
    color: #666;
    border-bottom: 1px solid #ccc;
}

.logistics-item .title .time {
    font-size: 12px;
    color: #aaa;
}

.logistics-item .con {
    padding: 10px 0;
}

.logistics-item .con p {
    line-height: 24px;
    margin: 0;
}

.logistics-item .con img {
    width: 120px;
    height: 120px;
    margin: 10px 10px 10px 0;
}

.mt20 {
    margin-top: 20px;
}

</style>
