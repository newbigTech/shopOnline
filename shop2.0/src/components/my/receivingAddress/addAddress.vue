<!-- 增加收货地址 -->
<template>
    <div class="addAddress">
        <div class="content">
            <div class="inp-item">
                <input type="text" name="userName" id="userName" v-model="addressForm.consignee" placeholder="姓名" maxlength="10" />
            </div>
            <div class="inp-item">
                <input type="tel" name="userPhone" pattern="[0-9]" id="userPhone" maxlength="11" v-model="addressForm.phone" placeholder="手机号" />
            </div>
            <div class="inp-item">
                <div :class="['disabled-address ']+[ addressVisible ? 'active' : '' ]" @click="_showVisible">{{addressForm.province}} {{addressForm.city}} {{addressForm.county}}</div>
            </div>
            <div class="inp-item">
                <input type="text" name="address-detailed" id="userName" v-model="addressForm.address" placeholder="详细地址，如楼道、楼牌号等" />
            </div>
            <div class="radio-box" @click="_setDefault">
                <i :class="['iconfont icon-icon-check ']+[ addressForm.isDefaultAddress == 0 ? 'active' : '']"></i>设为默认地址
            </div>
            <div class="btn-box">
                <div class="u-btn btn-left" @click="_handleCancle">取消</div>
                <div class="u-btn btn-right" @click="_onSubmit">保存</div>
            </div>
        </div>
        <mt-popup v-model="addressVisible" position="bottom">
            <div class="picker-toolbar">
                <span class="mint-datetime-action mint-datetime-confirm" @click="addressVisible = false">确定</span>
                <span class="mint-datetime-action mint-datetime-cancel" @click="addressVisible = false">取消</span>
            </div>
            <mt-picker v-if="addressVisible" :slots="addressSolts" @change="_changeAddress"></mt-picker>
        </mt-popup>
    </div>
</template>
<script>
import addressList from './address3.json'
export default {
    name: 'addAddress',
    data() {
        return {
            addressForm: {consignee: '', phone: '', province: '省份', city: '城市', county: '区县', address: '', isDefaultAddress: 1 },
            addressVisible: false,
            addressSolts: [
                { flex: 1, className: 'slot1', textAlign: 'center', value: '', values: Object.keys(addressList), defaultIndex: 0 },
                { divider: true, content: '-', className: 'slot2'  },
                { flex: 1, className: 'slot3', textAlign: 'center', value: '', values: null },
                { divider: true, content: '-', className: 'slot4' },
                { flex: 1, className: 'slot5', textAlign: 'center', value: '', values: null }
            ],
            entrance: '', //进入地址管理的入口
        }
    },
    watch: {
        'addressVisible': function(val,oldVal){
            if (val) {
                document.body.style.position = 'fixed';
            }else{
                document.body.style.position = 'static';
            }
        }
    },
    created() {
    	var entrance = this.$route.query.entrance;
        if (entrance != null) {
            this.entrance = entrance;
        }
        this._getFrom();
    },
    destroyed() {
     // localStorage.removeItem('ADSDOC');
    },
    methods: {
        // 设置 表单和页面标题
        _getFrom() {
            if (this.$route.query.id != null) {
                this.addressForm = JSON.parse(decodeURIComponent(localStorage.getItem('ADSDOC')));
                document.title = '修改收货地址';
            } else {
                this.addressForm = { consignee: '', phone: '', province: '省份', city: '城市', county: '区县', address: '', isDefaultAddress: 1 }
                document.title = '新增收货地址';
            }
        },
        // 设置 默认地址
        _setDefault() {
            this.addressForm.isDefaultAddress == 0 ? this.addressForm.isDefaultAddress = 1 : this.addressForm.isDefaultAddress = 0
        },
        // 默认 省市区
        _showVisible(picker) {
            this.addressVisible = true;
            for (var i = 0; i < Object.keys(addressList).length; i++) {
                if (this.addressForm.province == Object.keys(addressList)[i]) { this.addressSolts[0].defaultIndex = i }
            }
            this.addressSolts[0].values = Object.keys(addressList);
            if (this.addressForm.province == '省份') {
                this.addressForm.province = '';
                this.addressForm.city = '';
                this.addressForm.county = '';
            } else {
                this.addressSolts[0].value = this.addressForm.province;
                this.addressSolts[2].values = Object.keys(addressList[this.addressForm.province]);
                this.addressSolts[2].value = this.addressForm.city;
                this.addressSolts[4].values = addressList[this.addressForm.province][this.addressForm.city];
                this.addressSolts[4].value = this.addressForm.county;
            }
        },
        // 修改 省市区
        _changeAddress(picker, values) {
            if (addressList[values[0]]) {  //这个判断类似于v-if的效果（可以不加，但是vue会报错，很不爽）                             
                picker.setSlotValues(1, Object.keys(addressList[values[0]])); // Object.keys()会返回一个数组，当前省的数组                           
                picker.setSlotValues(2, addressList[values[0]][values[1]]); // 区/县数据就是一个数组
                this.addressForm.province = values[0];
                this.addressForm.city = values[1];
                this.addressForm.county = values[2];
            }
        },
        // 提交表单, 回到列表页面
        _onSubmit() {
            if (!this.addressForm.consignee) { this.$toast('请输入名字'); return }
            if (!this.verifyPhone(this.addressForm.phone)) { return }
            if (this.addressForm.province == '省份') { this.$toast('请选择您所在的省市区'); return }
            if (!this.addressForm.address) { this.$toast('请输入详细地址'); return }
            var _src,
                _params = this.addressForm,
                _that = this;
            if (this.addressForm.acceptAddressId == undefined) {
                _src = '/acceptAddress/addAcceptAddress';
            } else {
                _src = '/acceptAddress/updateAcceptAddress';
            }
            _params.token = this.token;
            _params.customerCode = this.userInfo.customerCode;
            this.$http.post(this.baseUrl + _src, _params).then(function(res) {
                if (!res) { return }
                if (_that.entrance != '') {
                    var path = '';
                    if(_that.entrance == 'goBuy') {
                        path = '/goBuy'
                    }
                    if(_that.entrance == 'shopBuy') {
                        path = '/shoppingCartGoBuy'
                    }
                    if(_that.entrance == 'pickGoods') {
                        path = '/pickGoods'
                    }                    
                    _that.$router.push({
                        path: path,
                        query: { 'addressId': _that.addressForm.acceptAddressId }
                    })
                    return;
                }else{
                    _that.$router.push({ name: 'MyReceivingAddress', query: { entrance: _that.entrance }});
                }
            });
        },
        //取消
        _handleCancle() {
        	var query;
        	if(this.entrance != '') {
        		query = {entrance: this.entrance}
        	}
        	this.$router.push({ name: 'MyReceivingAddress', query: query })
        }
          
    }
}

</script>
<style scoped>
@import './address.css'

</style>
