<!-- 我的收藏 -->
<template>
    <div class="my-collect" :style="{'height': clientH * 10 +'px'}">
       <!-- <div class="header">
            <header-bar :isWhite=" false "></header-bar>
        </div>-->
        <template v-if="goodList.length > 0">
	        <ul v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
	            <li class="item" v-for="item in goodList">
	                <div class="item-box" ref="item" @touchstart='touchStart' @touchmove='touchMove' @touchend='touchEnd'>
	                    <div class="cover" @click="$router.push({ name: 'PdDetails', query: { proCode: item.productId } })"><img :src="item.source" alt=""></div>
	                    <div class="body" @click="$router.push({ name: 'PdDetails', query: { proCode: item.productId } })">
	                        <div class="good-name">{{item.proTitle}}</div>
	                        <div class="good-desc">
	                            <div class="desc">
	                                <div class="goods-desc">{{item.proHitTitle}}</div>
	                            </div>
	                            <div class="integral">赠送<span class="red">{{item.productIntegral}}</span>积分</div>
	                        </div>
	                        <div class="good-price">￥{{item.productPrice}}</div>
	                    </div>
	                </div>
	                <div class="remove" ref='remove' @click="_delItem(item)"><i class="icon iconfont icon-shanchu"></i></div>
	            </li>
	        </ul>
        </template>
        <div class="no-data" v-if="goodList.length == 0">
        	<img src="./img/nothing.png" />
        	<p>暂无收藏数据</p>
        </div>
    </div>
</template>
<script>
//import headerBar from '@/components/header/headerBar'
export default {
    name: 'my-collect', // 结构名称
//  components: { 'header-bar': headerBar },
    data() {
        return {
            bodyHeight: document.documentElement.clientHeight + 'px', // 高度
            loadMore: null,
            goodList: []
        }
    },
    created() {
        this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (this.userInfo == null) {
            this.$router.push({ 'name': 'Login' })
        } else {
            this.customerCode = this.userInfo.customerCode;
            this._getData();
        }
        document.title = '收藏';
    },
    mounted() {
        this.$nextTick(function() {});
    },
    methods: {
        // 获取 收藏 数据
        _getData() {
            var _that = this;
            this.$http.get(this.baseUrl + '/collectProduct/getCollectProduct', {
                params: { customerCode: this.customerCode, pageNum: 1, pageSize: 10 }
            }).then(function(res) {
                if (!res) { return }
                _that.goodList = res.cpList;
            });
        },
        // 删除 收藏
        _delItem(item) {
            for (var i = 0; i < this.$refs.item.length; i++) {
                this.$refs.item[i].style.cssText = 'transform:translateX(0px)';
            }
            var _that = this;
            this.$http.post(this.baseUrl + '/collectProduct/deleteCollectProduct', {
                customerCode: this.customerCode,
                token: this.token,
                productCollectId: item.productCollectId
            }).then(function(res) {
                if (!res) { return }
                _that.$toast('取消收藏成功');
                _that._getData();
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
        }
    }

}

</script>
<style scoped>
@import 'collect.css'
</style>
