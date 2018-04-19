<!-- 模型： 购物车
    DOM 结构
-->
<template>
    <div class="shoppingCart" :style="{height: BH}">
        <!--<div class="headerBg">
            <header-bar :isWhite="false"></header-bar>
        </div>-->
        <template v-if="shopcartList.length > 0">
            <div class="menu" v-if="goodList.length>0"><a href="javascript:;" @click="switchState" class="btn right">{{edit?'完成':'编辑'}}</a></div>
            <div class="shopping-conentBox">
                <div class="goodList" v-if="goodList.length>0">
                    <ul class="itemList">
                        <li class="item" v-for="good,index in goodList" :key="index">
                            <div class="content" ref="content" @touchstart='touchStart' @touchmove='touchMove' @touchend='touchEnd'>
                                <div class="sys" @click="selectCheck(good)">
                                    <div :class="['input-checkbox ']+[good.check?'on':'']">
                                        <input type="checkbox" name="vehicle" :value="good.check">
                                    </div>
                                </div>
                                <div class="good" @click="$router.push({ name:'PdDetails', query:{ proCode: good.productId}})">
                                    <div class="cover"><img :src="good.proSimg" class="response-img" alt=""></div>
                                    <div class="info-box">
                                        <div class="info" v-if="!edit">
                                            <span class="name">{{good.proTitle}}</span>
                                            <span class="number">×{{good.quantity}}</span>
                                            <p class="desc">
                                            	<span v-if="good.proColorName != null && good.proColorName != '' && good.proColorName != '无'">
                                            		{{good.proColorName}}
                                            	</span>&nbsp;&nbsp;
                                            	<span v-if="good.proSizesName != null && good.proSizesName != '' && good.proSizesName != '无'">
                                            		{{good.proSizesName}}
                                            	</span>
                                            </p>
                                        </div>
                                        <div class="info-desc" v-else>
                                            <span class="desc" v-if="(good.proColorName != null && good.proColorName != '' && good.proColorName != '无') || (good.proSizesName != null && good.proSizesName != '' && good.proSizesName != '无')">
                                            	已选择: 
                                            	<span v-if="good.proColorName != null && good.proColorName != '' && good.proColorName != '无'">
                                            		{{good.proColorName}}
                                            	</span>&nbsp;&nbsp;
                                            	<span v-if="good.proSizesName != null && good.proSizesName != '' && good.proSizesName != '无'">
                                            		{{good.proSizesName}}
                                            	</span>
                                            </span>
                                        	<span class="right"><i class="icon iconfont icon-return-copy"></i></span>
                                        </div>
                                        <div class="set">
                                            <span class="price">￥<span class="number">{{good.productPrice}}</span></span>
                                            <div class="number-box">
                                                <span :class="['cut ']+[good.quantity==1?'disable':'']" @click.stop="cutGood(good)">-</span>
                                                <span class="val">{{good.quantity}}</span>
                                                <span class="add" @click.stop="addGood(good)">+</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="remove" ref='remove' @click="deleteGood(good)">
                                <i class="icon iconfont icon-shanchu"></i>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="lose goodList" v-if="loseList.length>0">
                    <ul class="itemList">
                        <li class="title">
                            <span>失效宝贝{{loseList.length}}件</span>
                            <a class="close" @click="clearLose" href="javascript:;">清除失效宝贝</a>
                        </li>
                        <li class="item" v-for="lose,index in loseList" :key="index">
                            <div class="content" ref="content" @touchstart='touchStart' @touchmove='touchMove' @touchend='touchEnd'>
                                <div class="sys"><span class="key">失效</span></div>
                                <div class="good">
                                    <div class="cover"><img :src="lose.proSimg" class="response-img" alt=""></div>
                                    <div class="info-box">
                                        <div class="info">
                                            <span class="name">{{lose.proTitle}}</span>
                                            <p class="desc">
                                            	<span v-if="lose.proColorName != null && lose.proColorName != '' && lose.proColorName != '无'">
                                            		{{lose.proColorName}}
                                            	</span>&nbsp;&nbsp;
                                            	<span v-if="lose.proSizesName != null && lose.proSizesName != '' && lose.proSizesName != '无'">
                                            		{{lose.proSizesName}}
                                            	</span>
                                            </p>
                                        </div>
                                        <div class="set">
                                            <span class="price">￥<span class="number">{{lose.productPrice}}</span></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="remove" ref='remove' @click="deleteGood(lose)">
                                <i class="icon iconfont icon-shanchu"></i>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="shopping-btnBox">
                <div class="sys">
                    <div class="help-text" @click="allCheck">
                        <div :class="['input-checkbox ']+[allgood?'on':'']">
                            <input type="checkbox" name="allorder" :value="allgood">
                        </div>
                        <span>已选({{orderNumber}})</span>
                    </div>
                </div>
                <div class="price" v-if="!edit">
                    <div class="help-text">应付:￥<span class="help-price"><span class="val">{{onPrice.toFixed(2)}}</span></span>
                    </div>
                </div>
                <div :class="['btn '] +[!orderState?'disable':'']"  @click='action(edit)'>
                    <a href="javascript:;" class="order-btn">{{edit?'删除':'下单'}}</a>
                </div>
            </div>
        </template>
        <template v-else>
            <div class="error-box">
                <div class="error-icon"><img :src="'./static/img/shoping.png'" alt=""></div>
                <div class="error-help">这里有全球一万件好货</div>
                <div class="goshopping">
                    <router-link class="goBtn" :to="{name:'Index'}">去挑选</router-link>
                </div>
            </div>
        </template>
    </div>
</template>
<script>
//import headerBar from '@/components/header/headerBar'
export default {
//  components: { 'header-bar': headerBar },
    name: 'shoppingCart',
    data() {
        return {
            selectIndex: null,
            BH: document.documentElement.clientHeight + 'px',
            startX: 0, // 触摸位置
            endX: 0, // 结束位置
            moveX: 0, // 滑动时的位置
            disX: 0, // 移动距离
            deleteSlider: '', // 滑动时的效果,使用v-bind:style="deleteSlider"
            edit: false,
            orderState: false,
            shopcartList: [], // 购物车商品
            goodList: [], // 购物车有效商品
            loseList: [], // 购物车失效商品
            allgood: false,
            orderList: [],
            orderNumber: 0,
            editList: [],
            payList: [],
            onPrice: 0.00,
        }
    },
    watch: {
        orderList: function(val, oldVal) {
            val.length > 0 ? this.orderState = true : this.orderState = false;
            this.orderNumber = 0;
            for (var i = 0; i < val.length; i++) { this.orderNumber += val[i].quantity; }
        },
        edit: function(val, oldVal) {
            for (var i = 0; i < this.goodList.length; i++) {
                this.goodList[i].check = false;
            }
            this.allgood = false;
        }
    },
    created() {
        if(this.userInfo == null) {
        	this.$router.push({ 'name': 'Login' });
        	return;
        }
        document.title = '购物车';
        this.getData();
    },
    mounted() {
        this.$nextTick(function() {});
    },
    methods: {
        // 获取数据
        getData() {
            this.goodList = [];
            this.loseList = [];
            var that = this;
            this.$http.get(this.baseUrl + '/shopcart/findShopcartByCustomerCode', {
                params: { token: this.token, customerCode: this.userInfo.customerCode, pageNum: 1, pageSize: 100 }
            }).then(function(res) {
                if (!res) { return }
                that.shopcartList = res.shopcartList;
                for (var i = 0; i < res.shopcartList.length; i++) {
                    res.shopcartList[i].check = false;
                    res.shopcartList[i].proSale == "1" ? that.loseList.push(res.shopcartList[i]) : that.goodList.push(res.shopcartList[i])
                }
            });
        },
        // 修改购物车商品数量
        editGood(_good) {
            var that = this;
            this.$http.post(this.baseUrl + '/shopcart/modifyShopcart', {
                sendJson: JSON.stringify({ token: this.token, customerCode: this.userInfo.customerCode, shopcartList: [{ id: _good.id, quantity: _good.quantity }] })
            }).then(function(res) {
                if (!res) { return }
            });
        },
        // 删除购物车商品
        deleteGood(_good, ev) {
            ev = ev || event;
            var el = ev.currentTarget;
            el.style.cssText = "transform:translateX(0px)";
            for (var i = 0; i < this.goodList.length; i++) {
                if (this.goodList[i].id == _good.id) { this.goodList.splice(i, 1) }
            }
            for (var i = 0; i < this.loseList.length; i++) {
                if (this.loseList[i].id == _good.id) { this.loseList.splice(i, 1) }
            }
            var _delList = [];
            _delList.push(_good.id);
            this.deleteShoppingGood(_delList);
        },
        // 删除购物车商品
        deleteShoppingGood(_delList) {
            var that = this;
            this.$http.post(this.baseUrl + '/shopcart/removeShopcart', {
                sendJson: JSON.stringify({ token: this.token, shopcartId: _delList, customerCode: this.userInfo.customerCode })
            }).then(function(res) {
                if (!res) { return }
                that.$toast('删除成功!');
                that.onPrice = 0;
                that.orderNumber = 0;
                that.orderList=[];
                that.getData();
            })
        },
        // 切换状态
        switchState() {
            (this.edit ? this.edit = false : this.edit = true);
            this.onPrice = 0;
            this.orderNumber = 0;
            this.orderList=[];
            if (this.$refs.content.length != 0) {
                for (var i = 0; i < this.$refs.content.length; i++) {
                    this.$refs.content[i].style = "transform:translateX(0px)";
                }
            }
        },
        // 清空失效宝贝
        clearLose() {
            var _delList = [];
            for (var i = 0; i < this.loseList.length; i++) {
                _delList.push(this.loseList[i].id)
            }
            this.deleteShoppingGood(_delList);
        },
        // 需要商品
        selectCheck(_good) {
            _good.check = !_good.check;
            if (_good.check) {
                this.orderList.push(_good);
            } else {
                for (var i = 0; i < this.orderList.length; i++) {
                    if (this.orderList[i].id == _good.id) { this.orderList.splice(i, 1) }
                }
            }
            this.allgood = true;
            for (var i = 0; i < this.goodList.length; i++) {
                if (!this.goodList[i].check) { this.allgood = false }
            }
            this.payMoney();
        },
        // 支付金额
        payMoney() {
            this.onPrice = 0;
            this.orderNumber = 0;
            for (var i = 0; i < this.orderList.length; i++) {
                this.orderNumber += this.orderList[i].quantity;
                this.onPrice = this.onPrice + this.orderList[i].productPrice * this.orderList[i].quantity;
            }
        },
        // 下单 / 删除宝贝
        action(_edit) {
            if (!this.orderState) { return }
            if (_edit) {
                var _delList = [];
                for (var i = 0; i < this.orderList.length; i++) { _delList.push(this.orderList[i].id) }
                this.deleteShoppingGood(_delList);
            } else {
                localStorage.setItem('_goods', encodeURIComponent(JSON.stringify(this.orderList)));
                this.$router.push({ name: 'MyShoppingCartGoBuy' })
            }
        },
        // 全选商品
        allCheck(_temp) {
            this.allgood = !this.allgood;
            if (this.allgood) {
                this.orderList = [];
                for (var i = 0; i < this.goodList.length; i++) {
                    this.goodList[i].check = true;
                    this.orderList.push(this.goodList[i]);
                }
            } else {
                this.orderList = [];
                for (var i = 0; i < this.goodList.length; i++) {
                    this.goodList[i].check = false;
                }
            }
            this.payMoney();
        },
        // 商品-1
        cutGood(_good) {
            if (_good.quantity > 1) {
                _good.quantity--;
                this.payMoney();
                this.editGood(_good);
            }
        },
        // 商品+1
        addGood(_good) {
            _good.quantity++;
            this.payMoney();
            this.editGood(_good);
        },
        // 滑动开始
        touchStart(ev) {
            ev = ev || event
            if (ev.touches.length == 1) {
                this.startX = ev.touches[0].clientX;
            }
        },
        // 滑动中
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
        }
    }
}

</script>
<style scoped>
@import './shopping.css';

</style>
