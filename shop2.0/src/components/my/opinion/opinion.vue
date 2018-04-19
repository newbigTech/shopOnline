<!--意见反馈 -->
<template>
    <div id="opinion" class="div-border-box">
        <div class="content">
            <div class="ct-hd clearfix">
                <div class="u-fl">
                    <p>精益求精</p>
                    <p>只为您提供更好的品质购物</p>
                </div>
                <div class="img-box"></div>
            </div>
            <div class="ct-bd">
                <div class="bd-tit">
                    反馈问题类型
                    <router-link class="right" :to="{ name: 'opinionList'}">反馈记录</router-link>
                </div>
                <ul class="type clearfix">
                    <li @click="curId = 0" :class="{ 'active':curId===0 }">
                        <a href="javascript:;">
                            <div v-if="curId===0" class="active-box">
                                <i class="iconfont icon-caret"></i>
                            </div>
                            {{ opinionType[0].name }}
                        </a>
                    </li>
                    <li @click="curId = 1" :class="{ 'active':curId===1 }">
                        <a href="javascript:;">
                            <div v-if="curId===1" class="active-box">
                                <i class="iconfont icon-caret"></i>
                            </div>
                            {{ opinionType[1].name }}
                        </a>
                    </li>
                    <li @click="curId = 2" :class="{ 'active':curId===2 }">
                        <a href="javascript:;">
                            <div v-if="curId===2" class="active-box">
                                <i class="iconfont icon-caret"></i>
                            </div>
                            {{ opinionType[2].name }}
                        </a>
                    </li>
                    <li @click="curId = 3" :class="{ 'active':curId===3 }">
                        <a href="javascript:;">
                            <div v-if="curId===3" class="active-box">
                                <i class="iconfont icon-caret"></i>
                            </div>
                            {{ opinionType[3].name }}
                        </a>
                    </li>
                </ul>
                <div class="textarea-box">
                    <textarea name="opinion" placeholder="选择问题类型帮助我们更快处理您的反馈" v-model="textarea" @input="textNum" maxlength="500"></textarea>
                    <span>{{ textLength }}/500</span>
                </div>
                <div class="img-upload">
                    <ul class="clearfix">
                        <!--<label style="display: block; margin-bottom: 1rem;">上传凭证<span>(最多三张)</span></label>-->
                        <li v-for="(item,index) in imageList" v-if="imageUrlShow" :style="{height:liWidth}">
                            <img :src="item" />
                            <div class="u-del" @click="delImage(index)">一</div>
                        </li>
                        <li class="add-upload" @click="openAction" :style="{height:liWidth}" v-if="imageList.length <= 3">
                            <div class="box">
                                <p class="iconBox"><i class="iconfont icon-zhaoxiangji"></i></p>
                                <p>添加照片</p>
                            </div>
                        </li>
                    </ul>
                </div>
                <button class="u-submit" :class="{active:textLength < 1 ?false:true}" @click.prevent="submitFeedback">提交</button>
            </div>
            <mt-actionsheet :actions="actions" v-model="sheetVisible"></mt-actionsheet>
            <input type="file" name="file" ref="cameraImg" capture="camera" accept="image/*" @change="handleUpload('camera')" />
            <input type="file" name="file" ref="uploadImg" accept="image" @change="handleUpload()" />
        </div>
    </div>
</template>
<!--<script src="../../../../static/js/vconsole.min.js"></script>-->
<script>
import { Actionsheet,Indicator  } from 'mint-ui';
export default {
    name: 'opinion',
    data() {
        return {
            liWidth: '',
            sheetVisible: false,
            actions: [{
                    name: '拍照',
                    method: this.getCamera
                },
                {
                    name: '从相册中选择',
                    method: this.getLibrary
                },
            ],
            opinionType: [{
                    name: '功能异常'
                },
                {
                    name: '体验问题'
                },
                {
                    name: '新功能建议'
                },
                {
                    name: '其他'
                }
            ],
            curId: 0,
            textarea: '',
            textLength: 0,
            imageUrl: '',
            imageList: [],
            imageUrlShow: false,
            fileList: [], //上传图片文件数组
            uploading: false,//是否正在上传图片  true:正在上传
        }
    },
    mounted() {
        this.$nextTick(function() {
            document.title = '意见反馈';
            this.liWidth = document.querySelector('.ct-bd .img-upload ul li').offsetWidth + 'px';
        })
    },
    destroyed() {
       	Indicator.close();
    },
    methods: {
        openAction() {
        	
            this.sheetVisible = true;
        },
        //textarea字数限制
        textNum() {
            this.textLength = this.textarea.length;
        },
        // 打开照相机
        getCamera() { this.$refs.cameraImg.click() },
        //从相册选取
        getLibrary() {
            //              this.$refs.alploader.$el.children[0].click();
            this.$refs.uploadImg.click();
        },
        // 上传图片
        handleUpload(_tagter) {
            var files,
                that = this,
                formData = new FormData();
            if (_tagter != null) { 
            	files = this.uploadImgFn(this.$refs.cameraImg);
            } else { 
            	files = this.uploadImgFn(this.$refs.uploadImg);
            }
            if (!files) { return; }
            
            if (that.fileList.length > 3) {
                that.$toast('最多允许上传4张图片');
                return;
            }
            this.imageList.push(files.fileUrl);
            this.imageUrlShow = true;

			Indicator.open({text: '图片上传中...'});
			
            formData.append('token', this.token);
            formData.append('customerCode', this.userInfo.customerCode);
            formData.append('files', files.fileObj);
            //意见反馈图片上传
            this.$http.post(this.baseUrl + '/feedback/uploadFeedbackFiles', { formData: formData })
            .then(function(res) {
            	Indicator.close();
                if (!res) { return }
                that.fileList.push(res.feedbackImgUrl1);
            }).catch(function() { Indicator.close(); });
        },

        /**
         * 上传照片成功处理
         * @param  {[type]} res  [description]
         * @param  {[type]} file [description]
         * @return {[type]}      [description]
         */
        //          handleAvatarSuccess(res, file) {
        //              this.imageUrl = URL.createObjectURL(file.raw);
        //              this.imageUrlShow = true;
        //              if ( 3 >= this.imageList.length) {
        //                  this.imageList.push({src:this.imageUrl});
        //              }else{
        //                  this.imageList.splice(this.imageList.length-1, 1, {src:this.imageUrl});
        //              }
        //          },
        /**
         * 上传照片限制
         */
        //          beforeAvatarUpload(file) {
        //              const isJPG = file.type === 'image/jpeg';
        //              const isLt2M = file.size / 1024 / 1024 < 2;
        //  
        //              if (!isJPG) {
        //                  this.$message.error('上传头像图片只能是 JPG 格式!');
        //              }
        //              if (!isLt2M) {
        //                  this.$message.error('上传头像图片大小不能超过 2MB!');
        //              }
        //              return isJPG && isLt2M;
        //          },
        /**
         * 删除照片
         */
        delImage(_index) {
            this.imageList.splice(_index, 1);
            this.fileList.splice(_index, 1);
        },
        /*
         *提交意见 
         */
        submitFeedback() {
            var that = this;
            var reqUrl = this.baseUrl + '/feedback/addFeedback';
            var curId = String(that.curId + 1);
            var params = {
                feedbackDescription: this.textarea,
                problemType: curId // 问题类型（1.功能异常2.体验问题3.新功能建议4.其他）
            }
            //              var formData = new FormData();
            //              formData.append('feedbackDescription', that.textarea);
            //              formData.append('problemType', curId);// 问题类型（1.功能异常2.体验问题3.新功能建议4.其他）
            if (this.fileList.length > 0) {
                for (var i = 0; i < this.fileList.length; i++) {
                    params['feedbackImgUrl' + (i + 1)] = this.fileList[i];
                }
                //                  for(var i = 0;i < this.imageList.length;i++) {
                //                      formData.append('files', this.fileList[i]);
                //                  }
            }
            this.$http.post(reqUrl, params).then(function(res) {
                if (!res) {
                    return;
                }
                that.$toast('意见反馈提交成功');
                that.$router.push({ name: 'MyUser' });
            });

        },

    }
}

</script>
<style scoped>
@import '../../../assets/css/itemCommon.css';
div {
    box-sizing: border-box;
}

.content {
    position: relative;
    width: 100%;
}

.content .ct-hd {
    height: 8.75rem;
    background-color: #ff4c42;
    padding: 2rem 0 2rem 2.6rem;
    text-align: left
}

.content .ct-hd .img-box {
    float: right;
    margin-right: 2rem;
    width: 9.8rem;
    height: 4.5rem;
    background: url(img/bg_msg.png) no-repeat;
    background-size: contain;
}

.content .ct-hd .img-box img {
    width: 100%;
    height: 100%;
}

.content .ct-hd p {
    font-size: 1.5rem;
    line-height: 2.575rem;
    color: #fff;
}

.content .ct-bd {
    padding: 2.16rem 1.25rem 0;
}

.ct-bd .bd-tit {
    font-size: 1.38rem;
    padding-bottom: 0.66rem;
    color: #333;
    border-bottom: 0.1rem solid #eee;
}

.ct-bd .bd-tit .right {
    vertical-align: bottom;
    font-size: 1.2rem;
    color: #333333;
    display: inline-block;
    float: right;
}

.ct-bd ul.type {
    margin: 0.83rem auto 0;
}

.ct-bd ul.type li {
    position: relative;
    box-sizing: border-box;
    float: left;
    width: 23.5%;
    height: 2.83rem;
    line-height: 2.83rem;
    border: 0.1rem solid #e4e4e4;
    text-align: center;
    font-size: 1.195rem;
    margin-right: 2%;
    border-radius: 0.33rem;
    margin-bottom: 0.83rem;
}

.ct-bd ul.type li a {
    color: #333;
}

.ct-bd ul.type li:last-child {
    margin-right: 0;
}

.ct-bd ul.type li.active {
    border-color: #ff4342;
}

.ct-bd ul.type li.active .active-box {
    position: absolute;
    left: 0;
    top: 0;
    width: 1.5rem;
    height: 1.5rem;
    overflow: hidden;
    z-index: 99;
}

.ct-bd ul.type li.active .active-box i {
    position: absolute;
    top: -1rem;
    left: -1rem;
    display: inline-block;
    width: 2rem;
    text-align: center;
    height: 2rem;
    line-height: 3.5rem;
    font-size: 1rem;
    color: #fff;
    background-color: #ff4342;
    -webkit-transform: rotateZ(-45deg);
    transform: rotateZ(-45deg);
}

.ct-bd .textarea-box {
    position: relative;
    width: 100%;
    height: 14.8rem;
    margin: 0 auto;
    border: 1px solid #E4E4E4;
    padding: 0.66rem 0.5rem 1.7rem 0.5rem;
    border-radius: .42rem;
}

.ct-bd .textarea-box textarea {
    outline: none;
    width: 100%;
    height: 12rem;
    font-size: 1.4rem;
    line-height: 1.3;
    resize: none;
    border-color: rgba(255, 255, 255, 0);
}

.ct-bd .textarea-box textarea:focus {
    color: #333;
}

.ct-bd .textarea-box span {
    position: absolute;
    bottom: 0.58rem;
    right: 0.58rem;
    background-color: #fff;
    font-size: 1.2rem;
    color: #999;
}

.ct-bd .img-upload ul {
    margin-top: 1.5rem;
}

.ct-bd .img-upload ul>label {
    font-size: 1.2rem;
}

.ct-bd .img-upload ul li {
    position: relative;
    float: left;
    width: 23.5%;
    border-radius: 0.5rem;
    margin-right: 2%;
    margin-bottom: 1.6rem;
    text-align: center;
}

.ct-bd .img-upload ul li:nth-child(4n+0) {
    margin-right: 0;
}

.ct-bd .img-upload ul li img {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    border: 0.1rem solid #E8E8E8;
    border-radius: 0.5rem;
}

.ct-bd .img-upload ul li .u-del {
    position: absolute;
    top: -5px;
    right: -5px;
    width: 15px;
    height: 15px;
    line-height: 15px;
    text-align: center;
    color: #fff;
    background-color: #ff4342;
    border-radius: 50%;
    z-index: 99;
    font-size: 10px;
    font-weight: bold;
}

.ct-bd .img-upload ul li.add-upload {
    display: table;
    box-sizing: border-box;
    border: 0.1rem dashed #e8e8e8;
    color: #999;
}

.add-upload .box {
    display: table-cell;
    text-align: center;
    vertical-align: middle;
}

.add-upload .iconBox i {
    font-size: 3rem;
}

.add-upload p {
    font-size: 1.1rem;
}

.ct-bd .u-submit {
    width: 100%;
    height: 4.16rem;
    margin-top: 10rem;
    margin-bottom: 0.6rem;
    font-size: 1.56rem;
    color: #fff;
    background-color: #b3b3b3;
    border-radius: 0.5rem;
    cursor: pointer;
}

.ct-bd .u-submit.active {
    background-color: #ff4342;
}


/* 图片上传 */


/*.buttom-box { width: auto; height: auto; border-radius: .5rem; }
.buttom-box .image { width: auto; height: 6rem; display: inline-block; vertical-align: top; }
.buttom-box .image .imageUrl { display: inline-block; width: 6rem; height: 6rem; margin-right: 1rem; position: relative; }
.buttom-box .image .imageUrl .delImage { position: absolute; width: 1.5rem; height: 1.5rem; line-height: 1.25rem; font-size: 2rem; font-weight: 500; vertical-align: middle; right: -.35rem; top: -.35rem; background-color: #ff4242; color: white; border-radius: 50%; text-align: center; }
.buttom-box .image .imageUrl .showimg{ width: 100%; height: 100%; overflow: hidden; }
.buttom-box .image .imageUrl img { max-width: 100%; width: auto; min-height: 100%; height: auto; border-radius: .5rem; }
.avatar-uploader { border: 1px dotted #ececec; border-radius: .5rem; width: 6rem; display: inline-block; vertical-align: top; height: 6rem; overflow: hidden; position: relative; }
.el-upload { width: 6rem; height: 6rem; display: block; text-align: center; position: absolute; top: 0; }
.el-upload i.icon { margin: .5rem auto .25rem; color: #999999; display: block; font-size: 3rem; height: 3rem; }
.el-upload input.el-upload__input { display: none; }
.el-upload span { text-align: center; width: 100%; display: block; color: #999999; font-size: 1.1rem; line-height: normal; }*/

.avatar-uploader .el-upload {
    border: 2px dashed red;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}

.avatar {
    width: 178px;
    height: 178px;
    display: block;
    border: 2px solid red;
}

input[type='file'] {
    display: none;
}

</style>
