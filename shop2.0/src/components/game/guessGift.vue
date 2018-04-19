<!-- 组件 -->
<template>
    <div id="guessGift" :style=" { height : bodyHeight } ">
        <div class="gift-help">
            <span @click=" _helpDoc ">游戏规则&gt;</span>
        </div>
        <div class="gift-box">
            <div class="red-boxs">
                <section :class=" [ 'red-bog left'] + [ selected == 1 ? ' active' : '' ]">
                    <div :class=" [ 'red-bog-box' ] + [ show == 1 && selected == 1 ? ' active' : '' ] + [ show == 2 && selected == 1 ? ' selected' : '' ] + [ show == 3 && selected == 1 ? ' hide' : '' ]" ref="redBag" @click.stop="bounced(1)">
                        <span class="title">猜</span>
                    </div>
                    <i class="bg"></i>
                </section>
                <section :class=" [ 'red-bog right' ] + [ selected == 2 ?' active' : '' ]">
                    <div :class=" [ 'red-bog-box' ] + [ show == 1 && selected == 2 ? ' active' : '' ] + [ show == 2 && selected == 2 ? ' selected' : '' ] + [ show == 3 && selected == 2 ? ' hide' : '' ]" ref="redBag" @click.stop="bounced(2)">
                        <span class="title">猜</span>
                    </div>
                    <i class="bg"></i>
                </section>
            </div>
            <template v-if=" selected != 0">
                <div class="redbag-background"></div>
            </template>
        </div>
        <!-- <template v-if="resultShow"> -->
            <div ref="closeBox" :class="['closeResultBox '] + [ showclose ? 'active ' : '' ] + [ resultShow ? '' : 'hide' ]">
                <a href="JavaScript:;" class="" @click=" closeRedBag ">×</a>
            </div>
            <div :class="['gift-result-box '] + [ resultShow ? '' : 'hide' ]" v-if=" result != null ">
                <div class="header" v-if=" result.upState == '2' ">
                    <div class="light-box">
                        <i class="light"></i>
                    </div>
                    <h3 class="title">升级成功</h3>
                    <div class="light-bg"></div>
                </div>
                <div class="content">
                    <div class="cover">
                        <img :src="result.goodsPic">
                    </div>
                    <div class="desc">
                        <p> <span>{{ result.goodsName }}</span>
                        <p> <span>商品价格：</span><span>{{ result.goodsPrice }}</span> </p>
                    </div>
                </div>
                <div class="footer">
                    <a href="JavaScript:;" class="gift-action" @click="closeRedBag">完成</a>
                </div>
            </div>
        <!-- </template> -->
        <!-- 活动规则 -->
        <div class="message-model on" v-if="rule.show">
            <div class="title-box">
                <i class="icon" @click="rule.show = false">×</i>
                <h3>{{rule.title}}</h3>
                <p><span class="help-text">{{formatDate(rule.time,'time')}}</span></p>
            </div>
            <div class="content-box">
                <div v-html="rule.content"></div>
            </div>
            <div class="footer-box">
                <a href="javascript:;" class="btn btn-active" @click="rule.show = false">知道了</a>
            </div>
            <div class="message-bg"></div>
        </div>
    </div>
</template>
<script>
import { MessageBox, Indicator } from 'mint-ui';
export default {
    name: 'guessGift',
    data() {
        return {
            bodyHeight: document.documentElement.clientHeight + 'px',
            selected: 0, // 选中左右
            showclose: false, // 关闭按钮动画
            show: 0, // 弹框动画步骤
            resultShow: false, // 返回结果[中奖,为中间]
            result: {
                goodsName: '',
                goodsPic: '',
                goodsPrice: '',
            }, // 返回结果
            rule: {
                show: false,
                title: null,
                content: null
            }
        }
    },
    created() {
        this.pageQuery = this.$route.query;
        
    },
    mounted() {
        this.$nextTick(function() {document.title = '猜红包';});
    },
    methods: {
        _helpDoc() {
            var _that = this;
            this.$http.get(this.baseUrl + '/protocol/selectIsShow', { params: { type: '7' } }).then(function(res) {
                if (!res) { return }
                _that.rule = {show: true, title: res.list[0].protocol_name, time: res.list[0].update_time, content: res.list[0].content }
            });
        },
        // 关闭窗口
        closeRedBag() {
            this.$router.push({ name: 'MyUpgrade' });
        },
        // 提问对话框
        bounced(_index) {
            var _that = this;
            if (this.selected == 0) {
                MessageBox({
                    title: '',
                    message: '是否确定选择此红包?',
                    confirmButtonText: '确认',
                    confirmButtonClass: 'guessGiftactive',
                    showCancelButton: true
                }).then(function(action) {
                    if (action == 'confirm') {
                        _that.getAnimate(_index);
                    }
                });
            }
        },
        // 红包动画
        getAnimate(_index) {
            this.selected = _index; // 红包动画一[放大,定位]
            var _that = this;
            setTimeout(function() {_that.show = 1 }, 500); // 红包动画二[特效,翻转]
            setTimeout(function() {
                _that.show = 3;
                _that.getResult();
            }, 1500); // 红包动画三[停止,结果]
        },
        // 得到结果
        getResult() {
            this.resultShow = true;
            var _that = this;
            setTimeout(function() { _that.showclose = true }, 500); // 关闭窗口动画
            this.$http.post(this.baseUrl + '/redPacket/openPacket', {
                ordersNo: this.pageQuery.id,
                token: this.token,
                customerCode: this.userInfo.customerCode
            }).then(function(res) {
                if (!res) { return }
                _that.result = res;
            })
        }
    }

}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style>
@import url(./guessSize.css);

</style>
