<!--物流通知-->
<template>
  <div id="LogisticsNotification" :style="{'min-height': clientH *10 +'px'}">
    <!--<div class="header">
      <header-bar></header-bar>
      <div class="line"></div>
    </div>-->
    <!--full-->
    <template v-if="logistics.length > 0">
      <div class="logistics_box" v-for="item in logistics">
        <div class="logistics_box_time">{{item.times}}</div>
        <div class="logistics_box_content">
<!--          <a @click="goDetails(item)">-->
						<a>
            <div class="logistics_box_status">
              <p class="state">
                <template>
                  <span class="blue" v-if="item.state == 2">订单已发货</span>
                  <span class="green" v-if="item.state == 3">订单已签收</span>
                </template>
              </p><span>{{item.logisticComp}}</span>
            </div>
            <div class="logistics_box_info">
              <div class="logistics_box_icon clearfix">
                <img :src="item.productSimg">
              </div>
              <div class="logistics_box_nav clearfix">
                <h3>{{item.productName}}</h3>
                <p>订单号:{{item.totalOrdersNo}}</p>
              </div>
            </div>
          </a>
        </div>
      </div>
      <div class="more" v-if="showMore" @click="loadMore">点击加载更多</div>
      <div class="more" v-if="noMore&&total != 0">没有更多了~</div>
    </template>
    <template v-if="logistics.length == 0">
      <div class="error-box" :style="{'height': clientH * 10 +'px'}">
        <div class="error-icon"><img src="./img/nothing.png" alt=""/></div>
        <div class="error-help">暂无物流信息</div>
        <!-- <div class="goshopping">
          <router-link class="goBtn" :to="{name:'Index'}">去挑选</router-link>
        </div> -->
      </div>
    </template>
  </div>
</template>
<script>
//import headerBar from '@/components/header/headerBar'
//import navbar from '@/components/tool/navbar' //快速导航栏
export default {
  name: 'LogisticsNotification',
  components: {
//  'header-bar': headerBar
  },
  data() {
    return {
      logistics: [],
      pageNum: 1, //当前页面
      showMore: false, //是否展示更多
      noMore: false, //是否展示没有更多
      total: 0, //总共条数
    }
  },
  mounted() {
    this.$nextTick(function() {
      this.getLogNotice();
    })
  },
  methods: {
    //获取物流信息
    getLogNotice() {
      var that = this;
      var reqUrl = this.baseUrl + '/logisticsNotice/getLogNotice';
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
          that.logistics = res.lnList;
        } else {
          for (var i = 0; i < res.lnList.length; i++) {
            that.logistics.push(res.lnList[i]);
          }
        }
        if (that.total > that.logistics.length) {
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
        this.getLogNotice();
      }
    },
    //跳转
    goDetails(item) {
      this.$router.push({
        name: 'MyOrderInfo',
        query: {
          id: item.totalOrdersNo
        }
      })
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
  margin-bottom: 1.6rem;
}

.line {
  height: 0.1rem;
  width: 100%;
  background: #ebebeb;
  position: fixed;
  left: 0;
  top: 3.7rem;
}



/*物流通知start*/

#LogisticsNotification {
  margin: 0 auto;
  /*min-height: 60rem;*/
  background: #f5f5f5;
}

#LogisticsNotification .logistics_box {
  margin: 0 auto;
  width: calc(100% - 3rem);
  height: 18.5rem;
}



/*物流通知time*/

#LogisticsNotification .logistics_box_time {
  min-width: 10rem;
  height: 0.9rem;
  line-height: 0.9rem;
  margin: 0 auto;
  text-align: center;
  font-size: 1.2rem;
  color: #999;
  padding-top: 0.6rem;
}



/*物流通知内容*/

#LogisticsNotification .logistics_box_content {
  height: 14rem;
  margin-top: 1.1rem;
  background: #fff;
  border-radius: 0.3;
}

#LogisticsNotification .logistics_box_content a {
  display: block;
  width: calc(100% - 2.5rem);
  height: 11rem;
  margin: 0 auto;
  position: relative;
  text-decoration: none;
}



/*物流通知  发货状态*/

#LogisticsNotification .logistics_box_status {
  line-height: 5rem;
  height: 5rem;
  border-bottom: 0.1rem solid #e5e5e5;
}

#LogisticsNotification .logistics_box_status .state {
  display: inline-block;
  height: 5rem;
  line-height: 5rem;
  min-width: 9.5rem;
  font-size: 1.6rem;
}

#LogisticsNotification .logistics_box_status .red {
  color: #ff5a00;
}

#LogisticsNotification .logistics_box_status .green {
  color: #01a33a;
}

#LogisticsNotification .logistics_box_status .blue {
  color: #0078ff;
}

#LogisticsNotification .logistics_box_status>span {
  display: inline-block;
  height: 1.9rem;
  line-height: 1.9rem;
  font-size: 1.2rem;
  min-width: 4rem;
  padding: 0 1rem;
  text-align: center;
  border: solid 0.1rem #ccc;
  border-radius: 0.4rem;
  color: #333333;
}



/*物流通知 详情*/

#LogisticsNotification .logistics_box_info {
  width: 100%;
  height: 7.8rem;
}



/* 物流通知  左边的icon*/

#LogisticsNotification .logistics_box_icon {
  width: 7.8rem;
  height: 7.8rem;
  line-height: 7.8rem;
  float: left;
}

#LogisticsNotification .logistics_box_icon img {
  vertical-align: middle;
  width: 6.3rem;
  height: 6.3rem;
}



/*物流通知   右边的文字*/

#LogisticsNotification .logistics_box_nav {
  width: calc(100% - 8rem);
  height: 7.8rem;
  float: left;
}

#LogisticsNotification .logistics_box_nav h3 {
  margin-top: 1rem;
  font-weight: normal;
  font-size: 1.4rem;
  line-height: 1.8rem;
  color: #666;
  /*文字溢出*/
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

#LogisticsNotification .logistics_box_nav p {
  margin-top: 1.2rem;
  font-size: 1.3rem;
  color: #666;
  font-family: MicrosoftYaHeiLight;
}

.more {
  text-align: center;
  line-height: 2.0rem;
  font-size: 1.4rem;
  color: #666;
  padding-bottom: 1rem;
}

/*物流通知end*/
.error-box {
  margin: 0 auto;
  /*height: 53.5rem;*/
}
.error-box .error-icon {
    /*margin-top: 9rem;*/
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
