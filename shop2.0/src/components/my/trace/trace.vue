<!-- 我的足迹 -->
<template>
    <div class="footprint" :style="{height:bodyHeight}">
        <!--<div class="header">
            <header-bar :isWhite="false"></header-bar>
        </div>-->
        <div class="content">
            <div v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
                <div class="box" v-for="itemList in goodList">
                    <p class="time">{{itemList.dateTime}}</p>
                    <ul>
                        <li class="item" v-for="item, index in itemList.footprintList">
                            <div class="item-box" ref="item" @touchstart='touchStart' @touchmove='touchMove' @touchend='touchEnd'>
                                <div class="cover" @click="$router.push({ name: 'PdDetails', query: { proCode: item.productId } })"><img :src="item.source" alt=""></div>
                                <div class="body" @click="$router.push({ name: 'PdDetails', query: { proCode: item.productId } })">
                                    <div class="good-name">{{item.proTitle}}</div>
                                    <div class="good-desc">
                                        <div class="desc ellipsis">{{item.proHitTitle}}</div>
                                    </div>
                                    <div class="good-price ellipsis">￥{{item.productPrice}}</div>
                                </div>
                            </div>
                            <div class="remove" ref='remove' @click="_delItem(item)"><i class="icon iconfont icon-shanchu"></i></div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
//import headerBar from '@/components/header/headerBar'
export default {
    name: 'footprint', // 结构名称
    components: {
//      'header-bar': headerBar
    },
    data() {
        return {
            bodyHeight: document.documentElement.clientHeight + 'px', // 高度
            loadMore: null,
            page: {
                num: 1,
                size: 10
            },
            goodList: []
        }
    },
    created() {
        document.title = '我的足迹';
        this._getData();
    },
    methods: {
        // 获取足迹数据
        _getData() {
            var _that = this;
            this.$http.get(this.baseUrl + '/myFootprint/getMyFootprint', {
                params: {
                    customerCode: this.userInfo.customerCode,
                    token: this.token,
                    pageNum: this.page.num,
                    pageSize: this.page.size
                }
            }).then(function(res) {
                if (!res) { return }
                _that.goodList = res.list;
            })
        },

        // 删除足迹
        _delItem(_item) {
            for (var i = 0; i < this.$refs.item.length; i++) {
                this.$refs.item[i].style.cssText = 'transform:translateX(0px)';
            }
            var _that = this;
            this.$http.post(this.baseUrl + '/myFootprint/deleteMyFootprint', {
                token: this.token,
                customerCode: this.userInfo.customerCode,
                footprintId: _item.footprintId
            }).then(function(res) {
                if (!res) { return }
                _that.$toast('删除足迹成功');
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
@import 'trace.css'

</style>
