<!-- 组件 -->
<template>
    <div class="guessSize">
        <div class="goods" game-goods="good">
            <div class="item goods" v-if="goods != null ">
                <div class="good-cover-img"> <img :src="goods.cover" alt=""> </div>
                <div class="good-desc">
                    <h3 class="good-name">{{goods.name}}</h3>
                    <p class="good-price"><i>¥</i>{{goods.price}}</p>
                </div>
            </div>
            <div class="item goods icon">
                <div class="strong">
                    <img src="/static/img/img-upgrade.png" class="img-upgrade">
                </div>
            </div>
            <div class="item goods" v-if="newgoods != null ">
                <div class="good-cover-img"> <img :src="newgoods.cover" alt=""></div>
                <div class="good-desc">
                    <h3 class="good-name">{{newgoods.name}}</h3>
                    <p class="good-price"><i>¥</i>{{newgoods.price}}</p>
                </div>
            </div>
        </div>
        <div class="game-box">
            <div class="game" game-box="content">
                <div class="control">
                    <a href="JavaScript:;" :class="['btn game-control'] + [ selected == 1 ? ' active' : '']" @click="_selectedSize(1)">奇</a>
                    <a href="JavaScript:;" :class="['btn game-control'] + [ selected == 2 ? ' active' : '']" @click="_selectedSize(2)">偶</a>
                    <!-- <a href="JavaScript:;" :class="['btn game-control'] + [selected == 3?' active':'']" @click="selected = 3">小</a> -->
                </div>
                <div class="action">
                    <a href="JavaScript:;" class="game-action" @click=" _confirmAction ">开始升级</a>
                    <a href="JavaScript:;" class="game-help" @click=" _helpDoc ">游戏规则&gt;</a>
                </div>
            </div>
            <div class="game" game-box="time" v-if=" isClose == 0 ">
                <span>
                    距离开奖时间还剩: 
                    <i>{{time[0]}}</i><i>{{time[1]}}</i> 分
                    <i>{{time[2]}}</i><i>{{time[3]}}</i> 秒
                </span>
            </div>
            <div class="game" game-box="result">
                <!-- <img src="./img/lotteryList_bg1.png" alt="" /> -->
                <h3 class="title">
                    <span class="time">开奖时间</span>
                    <span class="no">开奖期号</span>
                    <span class="number">开奖号码</span>
                    <span class="result">结果</span>
                </h3>
                <ul v-if="results.length > 0 ">
                    <li class="item" v-for="item, index in results">
                        <template v-if="item.lotteryStatus == 0">
                            <span class="time">{{formatDate(item.createTime, 'time')}}</span>
                            <span class="no">{{item.issueName}}</span>
                            <span class="number">{{item.lotteryNum}}</span>
                            <span class="">
                                <i :class="['result']+[item.lotteryString == '奇'?' zero':'']">{{item.lotteryString}}</i>
                            </span>
                        </template>
                        <template v-else>
                            <span class="time">{{formatDate(item.createTime, 'time')}}</span>
                            <span class="no">{{item.issueName}}</span>
                            <span class="number">&nbsp;未开奖</span>
                            <span class=""> 待定 </span>
                        </template>
                    </li>
                </ul>
            </div>
        </div>
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
    name: '',
    data() {
        return {
            pageQuery: null, // 页面接受参数
            goods: null, //普通商品
            newgoods: null, //升级商品
            results: [], // 返回历史记录结果
            page: { total: 10, current: 1, size: 10 }, // 页面数据参数
            selected: 0, // 奇偶数选择 1:奇, 2:偶
            isClose: 0, // 是否封盘  0.未封盘 1.已封盘
            countdown: null, // 倒计时
            time: [0, 0, 0, 0], // 倒计时 显示时间
            timeCount: null, // 倒计时 次数
            lastTime: null, // 最后时间
            rule: {
                show: false,
                title: null,
                content: null
            },
            userInfo: {
                customerCode: ''
            }
        }
    },
    created() {
        document.title = '猜奇偶';
    },
    mounted() {
        this._getGoods();
        this._getListData();
        this.$nextTick(function() {
            this._getLastTime();
        });
    },
    methods: {
        _selectedSize(_selected) {
            if (this.isClose == 0) { this.selected = _selected } else { return MessageBox({ title: '', message: '已经封盘,请稍后,等待下期...' }) }
        },
        _helpDoc() {
            var res = {
                list: [{
                    content: "<p>升级游戏规则</p>",
                    create_by: "超级管理员（勿删）",
                    create_time: 1521448991000,
                    is_delete: "0",
                    is_show: "1",
                    protocol_code: "40ab3de967424896afb15fa879183750",
                    protocol_id: 59,
                    protocol_name: "升级游戏规则",
                    sort: 1,
                    type: 6,
                    update_by: "超级管理员（勿删）",
                    update_time: 1521448991000,
                }]
            }
            this.rule = { show: true, title: res.list[0].protocol_name, time: res.list[0].update_time, content: res.list[0].content }
        },

        // 订单商品
        _getGoods() {
            var res = {
                goodsName: "海尚坊鱿鱼250g",
                goodsPic: "http://img.mall.yipingoo.com/resources//home/promproduct/20180327/96f6130c-8933-41e5-9d5f-a8c075862f35.jpg",
                goodsPrice: 61,
                upGoodsName: "海尚坊对虾250g",
                upGoodsPic: "http://img.mall.yipingoo.com/resources//home/promproduct/20180327/89b2be64-902a-4099-94f8-b822b08ca38d.jpg",
                upGoodsPrice: 65,
            };
            this.goods = { cover: res.goodsPic, name: res.goodsName, price: res.goodsPrice };
            this.newgoods = { cover: res.upGoodsPic, name: res.upGoodsName, price: res.upGoodsPrice };
        },

        // 获取开奖历史记录
        _getListData() {
            var res = {
                awardList: [
                    { "issueName": 20180328033, "createTime": 1522207852000, "lotteryNum": "", "id": 10781, "lotteryStatus": "1", "lotteryString": null, "odevityNum": null },
                    { "issueName": 20180328032, "createTime": 1522207242000, "lotteryNum": "4 9 1 5 4", "id": 10780, "lotteryStatus": "0", "lotteryString": "偶", "odevityNum": "4" },
                    { "issueName": 20180328031, "createTime": 1522206652000, "lotteryNum": "3 5 5 6 0", "id": 10779, "lotteryStatus": "0", "lotteryString": "偶", "odevityNum": "0" },
                    { "issueName": 20180328030, "createTime": 1522206062000, "lotteryNum": "0 2 9 9 6", "id": 10778, "lotteryStatus": "0", "lotteryString": "偶", "odevityNum": "6" },
                    { "issueName": 20180328029, "createTime": 1522205462000, "lotteryNum": "1 7 4 9 1", "id": 10777, "lotteryStatus": "0", "lotteryString": "奇", "odevityNum": "1" },
                    { "issueName": 20180328028, "createTime": 1522204862000, "lotteryNum": "3 0 4 5 5", "id": 10776, "lotteryStatus": "0", "lotteryString": "奇", "odevityNum": "5" },
                    { "issueName": 20180328027, "createTime": 1522204262000, "lotteryNum": "3 1 7 2 8", "id": 10775, "lotteryStatus": "0", "lotteryString": "偶", "odevityNum": "8" },
                    { "issueName": 20180328026, "createTime": 1522203662000, "lotteryNum": "8 6 7 1 8", "id": 10774, "lotteryStatus": "0", "lotteryString": "偶", "odevityNum": "8" },
                    { "issueName": 20180328025, "createTime": 1522203052000, "lotteryNum": "9 0 1 9 9", "id": 10773, "lotteryStatus": "0", "lotteryString": "奇", "odevityNum": "9" },
                    { "issueName": 20180328024, "createTime": 1522202470000, "lotteryNum": "0 8 7 7 8", "id": 10772, "lotteryStatus": "0", "lotteryString": "偶", "odevityNum": "8" }
                ]
            };
            this.results = res.awardList;
            for (var i = 0; i < this.results.length; i++) {
                if (this.results[i].lotteryString == '偶') {
                    this.results[i].lotteryString = '偶';
                } else {
                    this.results[i].lotteryString = '奇';
                }
            }
        },

        // 最后一期时间
        _getLastTime() {
            var res = {
                isClose: 0,
                openTime: 377653
            }
            this.isClose = res.isClose;
            if (this.isClose == 0) {
                this.selected = 2
                this._countdown('count', res.openTime);
            } else {
                var _this = this;
                setTimeout(function() {
                    _this._getLastTime();
                }, 120000);
            }
        },

        // 倒计时[服务器时间, 和当前时间对比]
        _countdown(_type, _time) {
            if (_type == 'end') {
                var _newDate;
                if (!_time) { _newDate = new Date(); } else { _newDate = new Date(_time) }
                var _h = _newDate.getHours(),
                    _m = _newDate.getMinutes(),
                    _s = _newDate.getSeconds(),
                    _setTime = _h + ':' + (_m + 10 > 60 ? _m - 50 : _m + 10) + ':' + _s; // 当前时间, 十分钟后
            } else if (_type == 'count') {
                var _setTime = _time;
            }
            var _that = this;
            this.countdown = setInterval(function() {
                var _result = _that._timeFn(_setTime, _type);
                _setTime = _result.dateDiff;
                if (!_result) {
                    window.clearInterval(_that.countdown);
                } else {
                    _that.time = [_result.minutesStr[0], _result.minutesStr[1], _result.secondsStr[0], _result.secondsStr[1]];
                }
            }, 1000);
        },

        // 每10分钟执行一次
        _setTimeCount() {
            var _that = this;
            this._countdown();
            this.timeCount = setInterval(function() { _that._countdown() }, 1000 * 60 * 10);
        },

        // 提交升级
        _confirmAction() {
            if (this.isClose == 1) { return MessageBox({ title: '', message: '已经封盘,请稍后,等待下期...' }) }
            var _that = this;
            MessageBox({
                title: '',
                message: '您选择的是"' + (this.selected == 2 ? '偶' : '奇') + '",确定升级吗?',
                confirmButtonText: '确认',
                confirmButtonClass: 'guessGiftactive',
                showCancelButton: true
            }).then(function(action) {
                if (action == 'confirm') {
                    _that._actionResult();
                }
            });
        },

        // 提示下单 => 返回结果
        _actionResult() {
            var res = { issueNum: 20180328035 };
            MessageBox({
                title: '下单成功',
                message: '请等待' + res.issueNum + '期开奖结果',
                confirmButtonText: '确认',
                confirmButtonClass: 'guessGiftactive',
                showCancelButton: false,
            }).then(function(action) {
                if (action == 'confirm') {
                    this.$router.push({ name: 'Index' });
                }
            });
        },
    }
}

</script>
<style>
@import 'guessSize.css';

</style>
