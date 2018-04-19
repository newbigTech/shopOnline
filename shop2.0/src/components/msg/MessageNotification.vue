<!--通知消息-->
<template>
  <div id="MessageNotification" :style="{'min-height': clientH *10 +'px'}">
    <!--<div class="header">
      <header-bar></header-bar>
      <div class="line"></div>
    </div>-->
    <template v-if="integrals.length > 0">
      <!--Full-->
      <div class="notification_box" v-for="item in integrals">
        <div class="notification_box_time">
          <span>{{item.time}}</span>
        </div>
        <div class="notification_box_content">
          <a>
            <h2>
							积分变动通知<span>&gt;</span>
						</h2>
            <div class="notification_box_content_nav">
              <h4>您的积分账户变更如下：</h4>
              <p class="change">
                <template>
                  <i v-if="item.type ==1">增加</i>
                  <i v-else>减少</i>
                </template>
                积分：<span>{{item.transactionNumber}}</span></p>
              <p class="remainder">积分余额：<span>{{item.remainingNumber}}</span></p>
              <p class="reason">变动原因：
                <template>
                  <span v-if="item.pointType ==1">订单交易赠送积分</span>
                  <span v-else-if="item.pointType ==2">邀请奖励</span>
                  <span v-else-if="item.pointType ==3">积分抽奖消耗</span>
                  <span v-else-if="item.pointType ==4">抽奖获取</span>
                  <span v-else-if="item.pointType ==5">积分购买商品</span>
                  <span v-else-if="item.pointType ==6">售后退回</span>
                  <span v-else-if="item.pointType ==7">升级订单兑换</span>
                  <span v-else>取消订单退回</span>
                </template>
              </p>
            </div>
          </a>
        </div>
      </div>
      <div class="more" v-if="showMore" @click="loadMore">点击加载更多</div>
      <div class="more" v-if="noMore&&total != 0">没有更多了~</div>
    </template>
    <template v-if="integrals.length == 0">
      <div class="error-box" :style="{'height': clientH * 10 +'px'}">
        <div class="error-icon"><img src="./img/nothing.png" alt="" /></div>
        <div class="error-help">暂无通知消息</div>
        <!-- <div class="goshopping">
          <router-link class="goBtn" :to="{name:'Index'}">去挑选</router-link>
        </div> -->
      </div>
    </template>
  </div>
</template>
<script>
//import headerBar from '@/components/header/headerBar'

export default {
  name: 'MessageNotification',
  components: {
//  'header-bar': headerBar
  },
  data() {
    return {
      integrals: [],
      pageNum: 1, //当前页面
      showMore: false, //是否展示更多
      noMore: false, //是否展示没有更多
      total: 0, //总共条数
    }
  },
  mounted() {
    this.$nextTick(function() {
      this.getNotifyMessage();
    })
  },
  methods: {
    //查询通知消息
    getNotifyMessage() {
      var that = this;
      var reqUrl = this.baseUrl + '/notifyMessage/getNotifyMessage';
      var params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      this.$http.get(reqUrl, { params: params }).then((res) => {
        if (!res) {
          return
        }
        that.total = res.total;
        if (that.pageNum == 1) {
          that.integrals = res.nmList;
        } else {
          for (var i = 0; i < res.nmList.length; i++) {
            that.integrals.push(res.nmList[i]);
          }
        }
        if (that.total > that.integrals.length) {
          that.showMore = true;
        } else {
          that.showMore = false;
          that.noMore = true;
        }
      })
    },
    //加载更多
    loadMore: function() {
      var maxPage = Math.ceil(this.total / this.pageSize);
      if (this.pageNum < maxPage) {
        this.pageNum++;
        this.getNotifyMessage();
      }
    }
  }
}

</script>
<style scoped>
.clearfix:after {
  content: "";
  display: block;
  clear: both;
}
.header {
  position: relative;
  margin-bottom: 2.5rem;
}
.line {
  height: 0.1rem;
  width: 100%;
  background: #ebebeb;
  position: fixed;
  left: 0;
  top: 3.7rem;
}


/*通知消息start*/

#MessageNotification {
  margin: 0 auto;
  background: #f5f5f5;
}
#MessageNotification .notification_box {
  margin: 0 auto;
  height: 23.7rem;
  width: calc(100% - 3rem);
  background: #f5f5f5;
}
#MessageNotification .notification_box_time {
  height: 1.8rem;
  line-height: 1.8rem;
  text-align: center;
  padding-top: 0.6rem;
}
#MessageNotification .notification_box_time span {
  display: inline-block;
  min-width: 5rem;
  padding: 0 0.5rem;
  color: #fff;
  background: #ddd;
  font-size: 1.2rem;
}
#MessageNotification .notification_box_content {
  margin-top: 2rem;
  background: #fff;
  height: 16.5rem;
}
#MessageNotification .notification_box_content a {
  display: block;
  width: calc(100% - 2rem);
  height: 13rem;
  margin: 0 auto;
  padding-top: 2.1rem;
  text-decoration: none;
}
#MessageNotification .notification_box_content a h2 {
  font-size: 1.6rem;
  color: #333;
  font-weight: normal;
  padding-bottom: 0.5rem;
}
#MessageNotification .notification_box_content a h2 span {
  display: inline-block;
  float: right;
  font-size: 1.6rem;
  color: #333333;
}
#MessageNotification .notification_box_content_nav {
  margin-top: 0.7rem;
  border-top: 0.1rem solid #e5e5e5;
  color: #666;
  font-size: 1.4rem;
  padding-top: 1.2rem;
}
#MessageNotification .notification_box_content_nav h4 {
  font-size: 1.4rem;
  font-weight: normal;
  margin-bottom: 0.8rem;
}
#MessageNotification .notification_box_content_nav p {
  padding-top: 0.6rem;
}
#MessageNotification .change i {
  font-style: normal;
}
.more {
  text-align: center;
  line-height: 2.0rem;
  font-size: 1.4rem;
  color: #666;
  padding-bottom: 1rem;
}


/*通知消息end*/

.error-box {
  margin: 0 auto;
  /*height: 53.5rem;*/
}
.error-box .error-icon {
  text-align: center;
}
.error-box .error-icon>img {
  width: 17.6rem;
  height: 15.8rem;
  margin-top: 9rem;
}
.error-box .error-help {
  font-size: 1.8rem;
  margin-top: 2.3rem;
  text-align: center;
  color: #666;
}
.error-box .goshopping .goBtn {
  font-size: 1.2875rem;
  line-height: 3.75rem;
  display: block;
  box-sizing: border-box;
  width: 9.5rem;
  height: 3.75rem;
  margin: 0 auto;
  text-align: center;
  color: #333;
  border: 1px solid #999;
  border-radius: .25rem;
}

</style>
