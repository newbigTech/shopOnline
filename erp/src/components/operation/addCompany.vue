<!-- 组件 -->
<template>
    <div class="addCompany">
        <el-dialog :title="createObj.title" :visible.sync="createObj.visible" width="60%" @close=" _close ">
            <el-form ref="createObj" :model="createObj" :rules="rules" label-width="110px">
                <div class="row">
                    <div class="col-sm-4">
                        <el-form-item label="新增类型">
                            <el-radio v-model="createObj.type" label="1" v-if="!createObj.isCompany">运营中心</el-radio>
                            <el-radio v-model="createObj.type" label="2">代理商</el-radio>
                        </el-form-item>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-12">
                        <label class="el-form-item__label" style="width: 200px; text-align: left; font-weight: bold">上属机构</label>
                    </div>
                    <div class="col-sm-4">
                        <el-form-item label="姓名">
                            <el-input v-model="createObj.leaderName" placeholder="请输入负责人姓名..." :disabled="true"></el-input>
                        </el-form-item>
                    </div>
                    <div class="col-sm-4">
                        <el-form-item label="所属">
                            <el-input v-model="createObj.leaderCompany" placeholder="请输入所属..." :disabled="true"></el-input>
                        </el-form-item>
                    </div>
                    <div class="col-sm-4">
                        <el-form-item label="手机号">
                            <el-input v-model="createObj.leaderPhone" placeholder="请输入手机号..." :disabled="true"></el-input>
                        </el-form-item>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-12">
                        <label class="el-form-item__label" style="width: 200px; text-align: left; font-weight: bold">负责人信息</label>
                    </div>
                    <div class="col-sm-4">
                        <el-form-item label="账号" prop="phone">
                            <el-input v-model="createObj.phone" :maxlength="11" placeholder="请输入手机号..."></el-input>
                        </el-form-item>
                    </div>
                    <div class="col-sm-4">
                        <el-form-item label="登录密码">
                            <el-input type="password" v-model="createObj.password" placeholder="请输入登录名..." :disabled="true"></el-input>
                        </el-form-item>
                    </div>
                    <div class="col-sm-4">
                        <el-form-item label="姓名" prop="name">
                            <el-input v-model="createObj.name" placeholder="请输入负责人姓名..."></el-input>
                        </el-form-item>
                    </div>
                    <div class="col-sm-4">
                        <el-form-item label="身份证号" prop="idCard">
                            <el-input v-model="createObj.idCard" :maxlength="18" :minlength="15" placeholder="请输入身份证..."></el-input>
                        </el-form-item>
                    </div>
                    <div class="col-sm-4">
                        <el-form-item label="公司名称" prop="companyName">
                            <el-input v-model="createObj.companyName" placeholder="请输入公司或个体商户名称..."></el-input>
                        </el-form-item>
                    </div>
                    <div class="col-sm-4">
                        <el-form-item label="营业执照编号" prop="businessLicense">
                            <el-input v-model="createObj.businessLicense" placeholder="请输入营业执照编号..."></el-input>
                        </el-form-item>
                    </div>
                    <div class="col-sm-8">
                        <el-form-item label="备注">
                            <el-input v-model="createObj.remark" placeholder="请输入备注...." type="textarea" :rows="4" :resize="'none'"></el-input>
                        </el-form-item>
                    </div>
                    <div class="col-sm-4">
                        <el-form-item label="上传营业执照" prop="imageServerUrl">
                            <el-upload class="avatar-uploader" :action="baseUrl+ '/erp/user/upload/img'" :data="{ 'token': token }" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                        </el-form-item>
                    </div>
                </div>
                <el-form-item>
                    <el-button type="success" @click=" _onSubmit('createObj') ">提 交</el-button>
                    <el-button type="warning" @click=" _resetForm('createObj') ">重 置</el-button>
                    <el-button @click=" _close ">取 消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: '', // 结构名称
    data() {
        // 中文校验
        var validateChinese = (rule, value, callback) => {
            if (value === '') { callback(new Error('请输入负责人姓名')) } else {
                if (!this._isChinese(value)) { callback(new Error('请输入中文')) }
                callback();
            }
        };
        // 手机号校验
        var validatePhone = (rule, value, callback) => {
            if (value === '') { callback(new Error('请输入手机号')) } else {
                if (!this._isPhone(value)) { callback(new Error('请输入正确的手机号')) }
                var _that = this;
                this.$http.post(this.baseUrl + '/erp/user/check/phone', { phone: this.createObj.phone }).then(function(res) {
                    if (!res) { return }
                    if (!res.state) { callback(new Error(res.message)) } else {
                        callback();
                    }
                });
            }
        };
        // 身份证校验
        var validateIDCard = (rule, value, callback) => {
            if (value === '') { callback(new Error('请输入身份证')) } else {
                if (!this._isCardNo(value)) { callback(new Error('请输入正确的身份证')) }
                callback();
            }
        };
        // 身份证校验
        var validateImgSrc = (rule, value, callback) => {
            if (value === '') { callback(new Error('请输入上传营业执照')) } else { callback() }
        };
        return {
            createObj: {
                visible: false, // 是否显示
                isCompany: false, // 是否低级中运中心
                title: '新增', // 标题
                leaderName: '', // 上级姓名
                leaderCompany: '', // 上级所属
                leaderPhone: '', // 上级手机号
                type: '1', // 是[string]1 运营中心 2 代理商
                phone: '', // 是[string]手机号码
                password: '666666', // 是[string]面膜
                name: '', // 是[string]负责人姓名
                companyName: '', // 是[string]公司名称
                imageServerUrl: '', // 是[string]营业执照图片路径
                businessLicense: '', // 是[string]营业执照编号
                idCard: '', // 是[string]身份证
                remark: '', // 是[string]备注
            },
            rules: {
                imageServerUrl: [
                    { required: true, validator: validateImgSrc, trigger: 'change' }
                ],
                phone: [
                    { required: true, validator: validatePhone, trigger: 'blur' }
                ],
                password: [
                    { required: true, min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
                ],
                name: [
                    { required: true, validator: validateChinese, trigger: 'blur' }
                ],
                idCard: [
                    { required: true, validator: validateIDCard, trigger: 'blur' }
                ],
                companyName: [
                    { required: true, message: '请输入负责人公司或个体商业', trigger: 'change' },
                    // { min: 5, max: 30, message: '长度在 5 到 30 个字符', trigger: 'blur' }
                ],
                businessLicense: [
                    { required: true, message: '请输入营业执照编号', trigger: 'change' },
                    // { min: 5, max: 30, message: '长度在 5 到 30 个字符', trigger: 'blur' }
                ]
            },
            imageUrl: null,
        }
    },
    watch: {
        'isShow': function(val, oldVal) {
            this.createObj.visible = val;
        }
    },
    props: {
        'isShow': Boolean
    },
    created() {
        if (this.userInfo.companyLevel == 4) {
            this.createObj.isCompany = true;
            this.createObj.type = '2';
        }
    },
    mounted() {
        this._setLeader();
        this.$nextTick(function() {});
    },
    methods: {
        // 设置上级信息
        _setLeader() {
            this.createObj.leaderName = this.userInfo.idCardName;
            this.createObj.leaderCompany = this.userInfo.companyName;
            this.createObj.leaderPhone = this.userInfo.phone;
        },
        // 关闭弹框
        _close() {
            this.createObj.visible = false;
            this.$emit('_setClose', this.createObj.visible);
        },
        // 上传完成后操作
        handleAvatarSuccess(res, file) {
            this.imageUrl = URL.createObjectURL(file.raw);
            this.createObj.imageServerUrl = res.data;
        },
        // 上传限制
        beforeAvatarUpload(file) {
            console.log(file.type);
            const isJPG = file.type === 'image/jpeg';
            // const isGIF = file.type === 'image/gif';
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
        // 提交, 校验数据
        _onSubmit(formName) {
            var _that = this;
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    _that._onSave();
                } else {
                    return this.$message.error('请填写正确信息!');
                }
            });
        },
        // 保存数据
        _onSave() {
            var _that = this,
                formData = new FormData();
            formData.append('token', this.token);
            formData.append('name', this.createObj.name);
            formData.append('phone', this.createObj.phone);
            formData.append('type', this.createObj.type);
            formData.append('proxyName', this.createObj.companyName);
            formData.append('blImg', this.createObj.imageServerUrl);
            formData.append('blNo', this.createObj.businessLicense);
            formData.append('idCard', this.createObj.idCard);
            formData.append('remark', this.createObj.remark);
            this.$http.post(this.baseUrl + '/erp/user/apply/user', {
                formData: formData
            }).then(function(res) {
                if (!res) { return }
                _that.createObj.state = 'success';
                _that.$emit('_setResult', _that.createObj);
                _that.$confirm('您已成功提交申请等待审核中', '', {
                    confirmButtonText: '确定',
                    showCancelButton: false,
                    type: 'success'
                }).then(() => {
                    _that.$message({ type: 'success', message: '申请成功!' });
                    _that._close();
                }).catch(() => {});
            });
        },
        // 重置表单
        _resetForm(formName) {
            this.$refs[formName].resetFields();
        }
    },
}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style>
.el-form-item {
    /*margin-bottom: 10px;*/
}

.avatar-uploader {
    width: 100px;
    height: 100px;
}

.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 100%;
    height: 100%;
}

.el-upload {
    display: inline-block;
    text-align: center;
    cursor: pointer;
    outline: none;
}

.avatar-uploader .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 98px;
    height: 98px;
    line-height: 98px;
    text-align: center;
}

.avatar-uploader .el-upload img {
    width: 100px;
    max-height: 100px;
}

.avatar-uploader input[type="file"] {
    display: none;
}

</style>
