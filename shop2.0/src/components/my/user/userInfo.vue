<!-- 模型：我的 => 个人信息 -->
<template>
    <div :class="['userInfo '] + [ inputVisible ? 'on' : '' ]" id="userInfo" :style="{ height : bodyHeight }">
        <!--<div class="header">
            <header-bar :isWhite=" false "></header-bar>
        </div>-->
        <div class="content" v-if="userDesc!=null">
            <mt-cell title="头像" class="header" @click.native=" headerVisible = true " is-link>
                <div class="header-img"><img :src=" userDesc.photoUrl==null ? userDesc.defaultImg : userDesc.photoUrl " alt=""></div>
            </mt-cell>
            <div class="line"></div>
            <mt-cell title="用户ID">
                <div class="item"><span class="value">{{ userDesc.customerId }}</span></div>
            </mt-cell>
            <div class="line"></div>
            <mt-cell title="登录方式">
                <div class="item"><span class="value">{{ userDesc.accountType }}</span></div>
            </mt-cell>
            <div class="line"></div>
            <mt-cell title="手机号">
                <div class="item"><span class="value">{{ userDesc.phone }}</span></div>
            </mt-cell>
        </div>
        <div class="content" v-if="userDesc!=null">
            <mt-cell title="昵称" is-link @click.native="openInputPicker( 'nickName', userDesc.nickName )">
                <div class="item"><span class="value">{{ userDesc.nickName }}</span></div>
            </mt-cell>
            <div class="line"></div>
            <mt-cell title="性别" is-link @click.native="sexVisible = true">
                <div class="item"><span class="value">{{ userDesc.sex }}</span></div>
            </mt-cell>
            <div class="line"></div>
            <mt-cell title="出生日期" is-link @click.native="openDatePicker">
                <div class="item"><span class="value">{{ userDesc.birthday }}</span></div>
            </mt-cell>
            <div class="line"></div>
            <mt-cell title="邮箱" is-link @click.native="openInputPicker( 'email', userDesc.email )">
                <div class="item"><span class="value">{{ userDesc.email }}</span></div>
            </mt-cell>
        </div>
        <input type="file" name="file" ref="cameraImg" capture="camera" accept="image/*" @change="handleUpload('camera')" />
        <input type="file" name="file" ref="uploadImg" @change="handleUpload()" />
        <!-- 头像修改 -->
        <mt-actionsheet ref="headerVisible" :actions="headerActions" v-model="headerVisible"></mt-actionsheet>
        <!-- 性别修改 -->
        <mt-actionsheet ref="sexVisible" :actions="sexActions" v-model="sexVisible" cancelText></mt-actionsheet>
        <!-- 生日日期 -->
        <mt-datetime-picker ref="picker" type="date" year-format="{value}年" month-format="{value}月" date-format="{value}日" v-model="birthdayVisible" :startDate="new Date('1950-01-01')" :endDate="new Date('2020-12-30')" @confirm="handleConfirm"> </mt-datetime-picker>
        <!-- 通用输入框 -->
        <template v-if="inputVisible.show">
            <div class="modal-body default">
                <div class="input-box">
                    <input type="text" v-model="inputVisible.action" @keyup.13="changeInputActions">
                    <a class="close" @click="inputVisible.action = ''"></a>
                </div>
                <div class="input-action" @click="changeInputActions"><a href="javascript:;" class="action">确认</a></div>
            </div>
            <div class="modal-backdrop default in" @click="closeInputPicker"></div>
        </template>
    </div>
</template>
<script>
//import headerBar from '@/components/header/headerBar'
import { Indicator } from 'mint-ui';
export default {
    components: {
        //      'header-bar': headerBar 
    },
    name: 'userInfo', // 结构名称
    data() {
        return {
            bodyHeight: document.documentElement.clientHeight + 'px', // 高度
            // userDesc: JSON.parse(localStorage.getItem('userDesc')),
            userDesc: null,
            customerCode: this.userInfo.customerCode,
            headerVisible: false,
            headerActions: [ // 个人头像 => 功能
                { name: '拍照', method: this.getCamera },
                { name: '从相册中选择', method: this.getLibrary },
            ],
            sexVisible: false,
            sexActions: [ // 个人性别 => 功能
                { name: '男', method: this.setSexMen },
                { name: '女', method: this.setSexWomen },
            ],
            birthdayVisible: new Date(),
            inputVisible: { show: false, type: '', action: '' }, // input 通用输入框
        }
    },
    destroyed() {
        Indicator.close();
    },
    created() {
        this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (this.userInfo == null) {
            this.$router.push({ 'name': 'Login' });
        } else {
            this.getUserInfo();
        }
        document.title = '个人信息';
    },
    mounted() {
        this.$nextTick(function() {});
    },
    beforeDestroy() {
        document.body.style.position = 'static';
    },
    methods: {
        // 获取个人 => 基本信息
        getUserInfo() {
            var that = this;
            this.$http.get(this.baseUrl + '/customerInfo/getCustomerInfo', {
                params: { customerCode: this.customerCode }
            }).then(function(res) {
                if (!res) { return }
                that.userDesc = res;
                switch (that.userDesc.gender) {
                    case 1:
                        that.userDesc.sex = '男';
                        break;
                    case 2:
                        that.userDesc.sex = '女';
                        break;
                    case 3:
                        that.userDesc.sex = '';
                        break;
                }
                that.userInfo.phoneUrl = that.userDesc.photoUrl;
                that.userDesc.defaultImg = '/static/img/header.png';
                that.userInfo.phone = that.userDesc.phone;
                that.userInfo.accountType = that.userDesc.accountType;
                that.userInfo.nickName = that.userDesc.nickName;
                that.userInfo.gender = that.userDesc.gender;
                that.userInfo.birthday = that.userDesc.birthday;
                that.userInfo.email = that.userDesc.email;
                localStorage.setItem('userInfo', JSON.stringify(that.userInfo));
            });
        },

        // 打开照相机
        getCamera() { this.$refs.cameraImg.click() },

        // 打开相册
        getLibrary() { this.$refs.uploadImg.click() },

        // 上传个人头像
        handleUpload(_tagter) {
            var files,
                that = this,
                formData = new FormData();
            if (_tagter != null) { 
            	files = this.uploadImgFn(this.$refs.cameraImg) 
            } else { 
            	files = this.uploadImgFn(this.$refs.uploadImg) 
            }
            if(!files){ return; }
            Indicator.open({ text: '图片上传中...' });
            
            this.userDesc.photoUrl = files.fileUrl;
            formData.append('token', this.token);
            formData.append('customerCode', this.customerCode);
            formData.append('file', files.fileObj);
            this.$http.post(this.baseUrl + '/photo/updatePhoto', { formData: formData }).then(function(res) {
                Indicator.close();
                if (!res) { return }
            }).catch(function(error){
                Indicator.close();
            });
        },

        // 设置为男性
        setSexWomen() {
            this.userDesc.sex = '女';
            this.userDesc.gender = '2';
            this.upUserData('2');
        },

        // 设置为女性
        setSexMen() {
            this.userDesc.sex = '男';
            this.userDesc.gender = '1';
            this.upUserData('2');
        },

        // 打开 日期面板
        openDatePicker() {
            this.$refs.picker.open();
            console.log(this.userDesc.birthday);
            if (this.userDesc.birthday != null) {
                this.birthdayVisible = this.userDesc.birthday;
            } else {
                this.userDesc.birthday = new Date();
            }
            if (this.$refs.picker.visible) {
                document.body.style.position = 'fixed';
            }
        },

        // 关闭 日期面板
        handleConfirm(e) {
            this.userDesc.birthday = this.setDateFormat(this.birthdayVisible);
            this.birthdayVisible = this.userDesc.birthday;
            this.upUserData('3');
            document.body.style.position = 'static';
        },

        // 打开 通用输入框
        openInputPicker(type, _temp) {
            if (type == 'email') { document.title = '修改邮箱'; }
            if (type == 'nickName') { document.title = '修改昵称'; }
            console.log(type)
            this.inputVisible = { show: true, action: _temp, type: type }
        },

        // 输入框值改变 触发
        changeInputActions(ev) {
            document.title = '个人信息';
            switch (this.inputVisible.type) {
                case 'nickName':
                    this.upUserData('1');
                    break;
                case 'email':
                    if (this.verifyEmail(this.inputVisible.action)) { return this.$toast('请输入正确邮箱') }
                    this.upUserData('4');
                    break;
            }
        },

        // 关闭 通用输入狂
        closeInputPicker() { this.inputVisible.show = false },

        // 更新个人 信息
        upUserData(_type) {
            var _params = { token: this.token, customerCode: this.customerCode, type: _type };
            switch (_type) {
                case '1':
                    _params.nickName = this.inputVisible.action;
                    break;
                case '2':
                    _params.gender = this.userDesc.gender;
                    break;
                case '3':
                    _params.birthday = this.userDesc.birthday;
                    break;
                case '4':
                    _params.email = this.inputVisible.action;
                    break;
            }
            var that = this;
            this.$http.post(this.baseUrl + '/update/userdetails', _params).then(function(res) {
                if (!res) { return }
                that.closeInputPicker();
                that.getUserInfo();
            });
        }
    }
}

</script>
<style scoped>
@import 'user.css'

</style>
