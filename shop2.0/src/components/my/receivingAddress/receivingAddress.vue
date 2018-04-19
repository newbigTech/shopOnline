<!-- 收货地址 列表 -->
<template>
    <div class="receivingAddress">
        <!--<div class="header">
            <header-bar :isWhite="false"></header-bar>
        </div>-->
        <div class="content">
            <div class="address-list" v-if="addressList.length != 0">
                <div class="address-hd"></div>
                <div class="address-item-ct clearfix" v-for="item, index in addressListSort">
                    <div class="item-box" @touchstart='touchStart' @touchmove='touchMove' @touchend='touchEnd'>
                        <a class="clearfix" @click="setDefault(index)">
                            <div class="item-name">
                                <div class="name ellipsis">{{item.consignee}}</div>
                                <div class="active-icon" v-if="item.isDefaultAddress == 0"><span>默认</span></div>
                            </div>
                            <div class="item-address">
                                <div class="user-phone">{{item.phone}}</div>
                                <div class="address-detailed ellipsis">{{item.province}}, {{item.city}}, {{item.county}} {{item.address}}</div>
                            </div>
                        </a>
                        <div class="item-edit">
                            <i class="iconfont icon-bianji" @click="goEditAddress(index)"></i>
                        </div>
                    </div>
                    <div class="remove" ref='remove' @click="removeAddress(index)"><i class="icon iconfont icon-shanchu"></i></div>
                </div>
                <div class="btn-box" style="text-align: center;">
                    <!-- <div class="u-btn btn-left" @click="">微信添加</div>
                    <div class="u-btn btn-right" @click="addAddress">+新建地址</div> -->
                    <div class="u-btn" style="width: 100%; margin-bottom: 1rem; color: #d4282d; border-color: #d4282d;" @click="addAddress">+新建地址</div>
                </div>
            </div>
            <div class="footer-box" v-if="addressList.length > 9">
                <template v-if="showMore">
                    <div class="more" @click="_getMore">点击加载更多</div>
                </template>
                <template v-else>
                    <div class="more" @click="_getMore">没有更多了</div>
                </template>
            </div>
            <div class="noAddress" v-if="addressList.length == 0">
                <div class="noAddress-ct">
                    <div class="img-wrap"><img src="../../../assets/img/nothing.png" /></div>
                    <div class="text">您暂未添加收货地址</div>
                </div>
                <div class="btn-box" style="text-align: center;">
                    <!-- <div class="u-btn btn-left">微信添加</div> -->
                    <!-- <div class="u-btn btn-right" @click="addAddress">+新建地址</div> -->
                    <div class="u-btn" style="width: 100%; margin-bottom: 1rem; color: #d4282d; border-color: #d4282d;" @click="addAddress">+新建地址</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { MessageBox } from 'mint-ui';
//import headerBar from '@/components/header/headerBar';
export default {
    name: 'receivingAddress',
//  components: { 'header-bar': headerBar },
    data() {
        return {
            noAddress: false,
            showMore: false,
            addressList: [],
            page: {
                total: 0,
                current: 1,
                size: 10,
            },
            entrance: '', //进入地址管理的入口
        }
    },
    created() {
        this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
        this.userInfo == null ? this.$router.push({ 'name': 'Login' }) : document.title = '地址管理';
        this.customerCode = this.userInfo.customerCode;
        this.getData();

        var entrance = this.$route.query.entrance;
        if (entrance != null) {
            this.entrance = entrance;
        }
    },
    computed: {
        addressListSort: function() {
            return this.addressList.sort((a, b) => a.isDefaultAddress - b.isDefaultAddress);
        }
    },
    methods: {
        // 获取更需哦
        _getMore() {
            if (this.addressList.length < this.page.total) {
                this.page.current++;
                this.getData();
            }
        },

        // 获取 收货地址 列表
        getData() {
            var that = this;
            this.$http.get(this.baseUrl + '/acceptAddress/getAcceptAddress', {
                params: { customerCode: this.userInfo.customerCode, pageNum: this.page.current, pageSize: this.page.size }
            }).then(function(res) {
                if (!res) { return }
                for (var i = 0; i < res.aatList.length; i++) {
                    that.addressList.push(res.aatList[i]);
                }
                that.page.total = res.total;
                if ( that.addressList.length < that.page.total) {
                    that.showMore = true;
                } else {
                    that.showMore = false;
                }
            });
        },
        // 去 修改地址
        goEditAddress(_index) {
            localStorage.setItem('ADSDOC', encodeURIComponent(JSON.stringify(this.addressList[_index])));
            var query = { id: this.addressList[_index].acceptAddressId };
        	if(this.entrance != '') {
        		query.entrance = this.entrance;
        	}
            this.$router.push({ name: 'addAddress', query: query });
        },
        // 设置 默认地址
        setDefault(_index) {
            if (this.entrance != '') {
            	var path = '';
            	if(this.entrance == 'goBuy') {
            		path = '/goBuy'
            	}
                if(this.entrance == 'shopBuy') {
                    path = '/shoppingCartGoBuy'
                }
            	if(this.entrance == 'pickGoods') {
            		path = '/pickGoods'
            	}
            	
                this.$router.push({
                    path: path,
                    query: { 'addressId': this.addressList[_index].acceptAddressId }
                })
                return;
            }

            for (var i = 0; i < this.addressList.length; i++) {
                i == _index ? this.addressList[i].isDefaultAddress = 0 : this.addressList[i].isDefaultAddress = 1
            }
            this.upDataAddress(_index);
        },
        // 更新 收货地址
        upDataAddress(_index) {
            var that = this;
            this.$http.post(this.baseUrl + '/acceptAddress/updateAcceptAddress', { token: this.token, customerCode: this.customerCode, acceptAddressId: this.addressList[_index].acceptAddressId, consignee: this.addressList[_index].consignee, phone: this.addressList[_index].phone, province: this.addressList[_index].province, city: this.addressList[_index].city, county: this.addressList[_index].county, address: this.addressList[_index].address, isDefaultAddress: 0 }).then(function(res) {
                if (!res) { return }
            })
        },
        // 删除 收货地址
        removeAddress(_index, ev) {
            ev = ev || event;
            var el = ev.currentTarget;
            el.style.cssText = "transform:translateX(0px)";
            MessageBox.confirm('确定删除当前地址？').then(action => {
                var that = this;
                this.$http.post(this.baseUrl + '/acceptAddress/deleteAcceptAddress', {
                    token: this.token,
                    customerCode: this.customerCode,
                    acceptAddressId: this.addressList[_index].acceptAddressId
                }).then(function(res) {
                    if (!res) { return }
                    that.addressList = [];                        
                    that.getData();
                });
            }, action => {
                this.$toast('取消删除');
            });
        },
        // 滑动开始
        touchStart(ev) {
            ev = ev || event
            if (ev.touches.length == 1) {
                this.startX = ev.touches[0].clientX;
            }
        },
        // 滑动时
        touchMove(ev) {
            ev = ev || event;
            var el = ev.currentTarget;
            let wd = this.$refs.remove[0].offsetWidth || this.$refs.remove[0].scrollWidth;
            if (ev.touches.length == 1) {
                this.moveX = ev.touches[0].clientX
                this.disX = this.startX - this.moveX;
                if (this.disX < 0 || this.disX == 0) {
                    this.deleteSlider = "transform:translateX(0px)";
                    el.style.cssText = this.deleteSlider;
                } else if (this.disX > 0) {
                    this.deleteSlider = "transform:translateX(-" + this.disX * 5 + "px)";
                    el.style.cssText = this.deleteSlider;
                    if (this.disX * 5 >= wd) {
                        this.deleteSlider = "transform:translateX(-" + wd + "px)";
                        el.style.cssText = this.deleteSlider;
                    }
                }
            }
        },
        // 滑动结束
        touchEnd(ev) {
            ev = ev || event;
            var el = ev.currentTarget;
            let wd = this.$refs.remove.offsetWidth || this.$refs.remove[0].scrollWidth;
            if (ev.changedTouches.length == 1) {
                let endX = ev.changedTouches[0].clientX;
                this.disX = this.startX - endX;
                if ((this.disX * 5) < (wd / 2)) {
                    this.deleteSlider = "transform:translateX(0px)";
                    el.style.cssText = this.deleteSlider;
                } else {
                    this.deleteSlider = "transform:translateX(-" + wd + "px)";
                    el.style.cssText = this.deleteSlider;
                }
            }
        },
        //新增地址
        addAddress() {
        	var query;
        	if(this.entrance != '') {
        		query = {entrance: this.entrance}
        	}
        	this.$router.push(
        		{ name: 'addAddress', query: query}
    		);
        }
        
    }
}

</script>
<style scoped>
@import './address.css'

</style>
