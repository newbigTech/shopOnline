<!-- 管理轮播图 -->
<template>
    <div class="goods">
        <v-breadcrumb firstMenu="首页" secondMenu="轮播图" thirdMenu="管理轮播图"></v-breadcrumb>
        <div class="nav row">
            <div class="col-md-12">
                <div class="portlet box red">
                    <div class="portlet-title">
                        <div class="caption">管理轮播图</div>
                    </div>
                    <div class="portlet-body">
                        <div class="form-horizontal">
                            <div class="form-group">
                                <label class="col-md-3 control-label" for="title">图片：</label>
                                <div class="col-md-5">
                                    <input type="file" id="uploadImg" @change="handleUpload" name="file" />
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-md-3 control-label" for="title">图片预览：</label>
                                <div class="col-md-5">
                                    <img :src="bannerObj.broadcastingImageUrl" class="banner-img" />
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-md-3 control-label" for="title">标题：</label>
                                <div class="col-md-5">
                                    <input type="text" class="form-control input-small input-inline" placeholder="标题" v-model="bannerObj.bannerTitle" />
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-md-3 control-label" for="title">简介：</label>
                                <div class="col-md-5">
                                    <textarea class="textarea-common" v-model="bannerObj.bannerComments"></textarea>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-md-3 control-label" for="title">链接：</label>
                                <div class="col-md-5">
                                    <input type="text" class="form-control input-large input-inline" placeholder="链接" 
                                    	v-model="bannerObj.bannerLink" :disabled="bannerObj.bannerTypeId == 2" ref="bannerLink" />
                                    <!--<b class="text-red">注：请添加链接前缀，如http://</b>-->
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-md-3 control-label" for="title">排序：</label>
                                <div class="col-md-5">
                                    <input type="number" class="form-control input-small input-inline" min="1" placeholder="排序" v-model="bannerObj.bannerSort" />
                                </div>
                            </div>
                             <div class="form-group">
                                <label class="col-md-3 control-label" for="title">显示位置：</label>
                                <div class="col-md-5">
                                    <el-radio-group v-model="bannerObj.showLocation" class="radio-group">
                                        <el-radio label="1">首页 Banner</el-radio>
                                        <el-radio label="2">升级专区 Banner</el-radio>
                                        <el-radio label="3">增值专区 Banner</el-radio>
                                    </el-radio-group>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-md-3 control-label" for="title">类型：</label>
                                <div class="col-md-5">
                                    <el-radio-group v-model="bannerObj.bannerTypeId" class="radio-group" @change="handleType">
                                        <el-radio label="1">普通</el-radio>
                                        <el-radio label="2">品牌</el-radio>
                                    </el-radio-group>
                                    <button class="btn btn-default ml10" v-if="bannerObj.bannerTypeId == '2'" @click="brandListModelVisible = true">选择品牌</button>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-md-3 control-label" for="title">是否显示：</label>
                                <div class="col-md-5">
                                    <el-radio-group v-model="bannerObj.bannerIsShow" class="radio-group">
                                        <el-radio label="1">显示</el-radio>
                                        <el-radio label="0">不显示</el-radio>
                                    </el-radio-group>
                                </div>
                            </div>
                        </div>
                        <div class="operate ta-center">
                            <button type="button" class="btn btn-success" @click="handleSave">保存</button>
                            <button type="button" class="btn default" @click="handleCancle">取消</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    	<v-brandList :visible="brandListModelVisible" v-on:visible="setBrandVisible" v-on:getList="getSelectedBrand"></v-brandList>
    </div>
</template>
<script>
import breadcrumb from '@/components/tool/breadcrumb' //面包屑
import brandListModel from '@/components/tool/brandListModel' //品牌楼层元素
export default {
    name: 'goods',
    components: {
        'v-breadcrumb': breadcrumb,
        'v-brandList': brandListModel
    },
    data() {
        return {
            goodsStatus: '1', //商品状态
            isView: '不显示',
            bannerImg: '',
            bannerObj: { showLocation: '1', bannerTypeId: '1', bannerIsShow: '1', broadcastingImageUrl: '' },
            bannerId: '',
            viewAdd: true,
            brandListModelVisible: false
        }
    },
    mounted() {
        this.$nextTick(function() {
            var bannerId = this.$route.query.bannerId;
            if (bannerId != undefined) {
                this.bannerObj.bannerId = bannerId;
                this.viewAdd = false;
                this.getDetail();
            }
        });
    },
    methods: {
        handleUpload: function() {
            var inputFileObj = document.getElementById('uploadImg');
            var files = this.uploadImgFn(inputFileObj);
            this.bannerObj.file = files.fileObj;
            this.bannerObj.broadcastingImageUrl = files.fileUrl;
        },
        //保存添加或保存修改
        handleSave: function() {
            if (!this.bannerObj.bannerTitle) {
                this.$message('请输入标题');
                return;
            }
            if (!this.bannerObj.bannerLink) {
                this.$message('链接不能为空');
                return;
            }
            if (!this.bannerObj.bannerSort) {
                this.$message('请输入排序');
                return;
            }

            var that = this;
            var reqUrl;
            var formData = new FormData();
            formData.append('token', this.token);            
            formData.append('bannerTitle', this.bannerObj.bannerTitle);            
            formData.append('bannerLink', this.bannerObj.bannerLink);
            formData.append('bannerSort', parseInt(this.bannerObj.bannerSort));            
            formData.append('bannerIsShow', parseInt(this.bannerObj.bannerIsShow));
            formData.append('bannerTypeId', parseInt(this.bannerObj.bannerTypeId));  
            formData.append('showLocation', parseInt(this.bannerObj.showLocation)); 
            formData.append('bannerComments', this.bannerObj.bannerComments);
            if (this.viewAdd) { //添加
                reqUrl = this.baseUrl + '/bannerBusi/add';
                if (!this.bannerObj.file) {
                    this.$message('请选择图片文件');
                    return;
                }
                formData.append('file', this.bannerObj.file);
                formData.append('createBy', this.userInfo.userId);
            } else { //修改
                reqUrl = this.baseUrl + '/bannerBusi/update';
                formData.append('bannerId', this.bannerObj.bannerId);
                formData.append('modifyBy', this.userInfo.userId);
                if (this.bannerObj.file) {
                    formData.append('file', this.bannerObj.file);
                }
            }
            this.$http.post(reqUrl, { formData: formData })
                .then(function(res) {
                    if (!res) {
                        return;
                    }
                    that.$message('保存成功');
                    that.$router.push('/banner');
                });
        },
        //取消
        handleCancle: function() {
            this.$router.push('/banner');
        },
        //获取banner详情
        getDetail: function() {
            var that = this;
            var reqUrl = this.baseUrl + '/bannerInfo/findBanner';
            var params = {
                token: this.token,
                bannerId: this.bannerObj.bannerId
            }
            this.$http.get(reqUrl, { params: params }).then(function(res) {
                if (!res) {
                    return;
                }
                var bannerObj = res.bannerObj;
                var obj = {};
                obj.bannerTitle = bannerObj.title;
                obj.bannerComments = bannerObj.synopsis;
                obj.bannerLink = bannerObj.interlinkage;
                obj.bannerSort = bannerObj.sortCode;
                obj.bannerIsShow = bannerObj.isShow;
                obj.broadcastingImageUrl = bannerObj.broadcastingImageUrl;
                obj.bannerTypeId = bannerObj.bannerTypeId; //banner类型(1:普通，2：品牌)
                obj.showLocation = bannerObj.showLocation; //显示位置(1:商城首页 2：促销专区 3：增值专区)
                obj.bannerId = bannerObj.broadcastingId;
                that.bannerObj = obj;
            });
        },
        //选择banner类型
        handleType() {
        	if(this.bannerObj.bannerTypeId == '2') { //弹框选择品牌
        		
        	} else {
        		
        	}
        },
        // 关闭视图
        setBrandVisible(flag) {
            this.brandListModelVisible = flag;
        },
        // 选着商品, 设置信息
        getSelectedBrand(item) {
        	var interlinkage = '/brandDetail?brandId=' + item.id;
        	this.bannerObj.bannerLink = interlinkage;
        }
    }
}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style scoped>
.goods-img {
    width: 100px;
    height: 50px;
}

#editor {
    width: 100%;
    height: 330px;
}

.textarea-common {
    width: 100%;
    height: 50px;
    resize: none;
    border: 1px solid #e5e5e5;
    border-radius: 4px;
}

.radio-group {
    /*line-height: 46px;*/
}

.banner-img {
    width: 500px;
    height: 100px;
}

</style>
