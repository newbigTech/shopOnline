<!-- 我的积分 -->
<template>
    <div id="myInviting" class="div-border-box">
        <!--<div class="header">
            <header-bar :isWhite="false"></header-bar>
        </div>-->
        <div class="content">
            <div class="inviting-details">
                <div class="round-box">
                    <p>积分</p>
                    <p class="integral-num">{{ pointAmount }}</p>
                </div>
                <div class="u-three-list">
                    <ul class="clearfix">
                        <li>
                            <div class="name" @click="$router.push({name: 'Integral'})"><i class="iconfont icon-fangzi1"></i>积分乐园</div>
                        </li>
                        <!--<li>
                            <div class="name"  @click="$router.push({name: 'myCode'})"><i class="iconfont icon-jinbi"></i>赚取积分</div>
                        </li>-->
                        <li>
                            <div class="name"  @click="$router.push({path: '/userOrderList?type=all'})"><i class="iconfont icon-dingdan"></i>我的订单</div>
                        </li>
                    </ul>
                </div>
                <div class="rule-box" @click="message.show = true"><i class="iconfont icon-yiwen"></i>积分规则</div>
            </div>
            <div class="division-line">积分明细</div>
            <div class="inviting-list">
                <div class="three-box-img-item clearfix" v-for="item in goList">
                    <div class="item-left">
                        <div class="item-ct">
                            <div class="text" v-if="item.pointType==1">订单交易赠送积分</div>
                            <div class="text" v-if="item.pointType==2">邀请奖励</div>
                            <div class="text" v-if="item.pointType==3">积分抽奖</div>
                            <div class="text" v-if="item.pointType==4">抽奖获取</div>
                            <div class="text" v-if="item.pointType==5">积分兑换商品</div>
                            <div class="text" v-if="item.pointType==6">售后退回</div>
                            <div class="text" v-if="item.pointType==7">升级订单兑换</div>
                            <div class="text" v-if="item.pointType==8">取消订单退回</div>
                            <div class="gray-text">{{ formatDate(item.tradeTime, 'time')}}</div>
                        </div>
                    </div>
                    <div class="item-right">
                        <span :class="item.type == 2?'add':'reduce'">{{item.type == 2?'-':''}}{{item.transactionNumber}}积分</span>
                    </div>
                </div>
                <div class="load-more" @click="loadMore" v-if="showMore">加载更多</div>
            </div>
        </div>
        <!-- 积分规则 -->
        <div class="message-model on" v-if="message.show">
            <div class="title-box">
                <i class="icon" @click="message.show = false">×</i>
                <h3>{{message.data.protocol_name}}</h3>
                <p><span class="help-text">{{formatDate(message.data.update_time,'time')}}</span></p>
            </div>
            <div class="content-box">
                <div v-html="message.data.content"></div>
            </div>
            <div class="footer-box">
                <a href="javascript:;" class="btn btn-active" @click="message.show = false">知道了</a>
            </div>
            <div class="message-bg"></div>
        </div>
    </div>
</template>
<script>
//import headerBar from '@/components/header/headerBar'
export default {
    name: 'myIntegral',
    components: {
//      'header-bar': headerBar
    },
    data() {
        return {
            page: { size: 10, num: 1 },
            pointAmount: 0,
            goList: [],
            integralMsg: { total: '4873', invitedNum: '612', registeredNum: '107', consumedNum: '105', },
            itemList: [
                { id: 10, name: '积分抽奖', time: '2017-10-20 08:45', num: 150, state: 1 },
                { id: 11, name: '邀请奖励', time: '2017-10-21 08:45', num: -180, state: 2 },
                { id: 12, name: '订单完成', orderNum: '58958478457', time: '2017-10-22 08:45', num: 150, state: 3 }
            ],
            message: {
                show: false,
                data: null,
            },
            showMore: false,
            total: 0
        }
    },
    mounted() {
        document.title = '我的积分';
        this._getData();
        this._getDataList();
        this._getDataDoc();
    },
    methods: {
        // 获取积分
        _getData() {
            var _that = this;
            this.$http.get(this.baseUrl + '/mypoint/select', {
                params: { customerCode: this.userInfo.customerCode, token: this.token }
            }).then(function(res) {
                _that.pointAmount = res.pointAmount;
                if (!res) { return }
            })
        },
        // 获取积分明细记录
        _getDataList() {
            var _that = this;
            this.$http.get(this.baseUrl + '/point/findPointByCustormer', {
                params: { customerCode: this.userInfo.customerCode, token: this.token, pageSize: this.pageSize, pageNum: this.page.num }
            }).then(function(res) {
                if (!res) { return }
               	if(_that.page.num  == 1) {
					_that.goList = res.pointList;
				} else {
					for(var i = 0;i < res.pointList.length;i++) {
						_that.goList.push(res.pointList[i]);
					}
				}
                _that.total = res.total;
                if(_that.total > _that.pageSize) {
                	_that.showMore = true;
                }
            })
        },
        //加载更多积分明细记录
        loadMore() {
        	var maxPage = Math.ceil(this.total / this.pageSize);
			if(this.page.num < maxPage) {
				this.page.num++;
				this._getDataList();
			} else {
				this.$toast('没有更多了');
				this.showMore = false;
			}
        },
        _getDataDoc() {
//          this.message.data = JSON.parse(localStorage.getItem('_messageIntegral'));
//          if (this.message.data != null) { return this.message.show = true }
            var that = this;
            //1：用户服务协议 2：隐私政策 3：抽奖规则 4：积分规则
            this.$http.get(this.baseUrl + '/protocol/selectIsShow', {
                params: { type: '4' }
            }).then(function(res) {
                if (!res) { return; }
//              that.message.show = true;
                that.message.data = res.list[0];
                localStorage.setItem('_messageIntegral', JSON.stringify(res.list[0]));
            });
        }
    }
}

</script>
<style scoped>
@import '../../../assets/css/itemCommon.css';
@import 'integral.css';
.load-more {text-align: center;font-size: 1.2rem;line-height: 2.6rem;color: #555;}
</style>
