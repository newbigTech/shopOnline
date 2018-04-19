<!--商城活动-->
<template>
  <div id="ShopSales" :style="{'min-height': clientH *10 +'px'}">
    <!--<div class="header">
      <header-bar></header-bar>
      <div class="line"></div>
    </div>-->
    <template v-if="shops.length > 0">
      <!--Full-->
      <div class="sales_box" v-for="item in shops">
        <div class="sales_box_time"><span>{{item.create_time}}</span></div>
        <div class="sales_box_content">
          <a :href="item.page_link"><img :src="item.act_img">
					<span>{{item.act_title}}</span>
					</a>
          <div class="endShadow" v-if="item.state == 2">
            <div>已结束</div>
          </div>
        </div>
      </div>
      <div class="more" v-if="showMore" @click="loadMore">点击加载更多</div>
      <div class="more" v-if="noMore&&total != 0">没有更多了~</div>
    </template>
    <template v-if="shops.length == 0">
      <div class="error-box" :style="{'height': clientH * 10 +'px'}">
        <div class="error-icon"><img src="./img/nothing.png" alt=""/></div>
        <div class="error-help">暂无商城活动</div>
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
  name: 'ShopSales',
  components: {
//  'header-bar': headerBar
  },
  data() {
    return {
      shops: [],
      pageNum: 1, //当前页面
      showMore: false, //是否展示更多
      noMore: false, //是否展示没有更多
      total: 0, //总共条数
    }
  },
  mounted() {
    this.$nextTick(function() {
      this.findActivity();
    })
  },
  methods: {
    //获取商城活动
    findActivity() {
      var that = this;
      var reqUrl = this.baseUrl + '/front/activityInfo/findActivity';
      var params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      this.$http.get(reqUrl, { params: params }).then((res) => {
        if (!res) {
          return;
        }
        that.total = res.total;
        for (var i = 0; i < res.activityInfo.length; i++) {
          res.activityInfo[i].create_time = that.formatDate(res.activityInfo[i].create_time, 'time')
        }
        if (that.pageNum == 1) {
          that.shops = res.activityInfo;
        } else {
          for (var i = 0; i < res.activityInfo.length; i++) {
            that.shops.push(res.activityInfo[i]);
          }
        }
        if (that.total > that.shops.length) {
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
        this.findActivity();
      }
    },
    //时间戳
    formatDate(param, type = null) {
      var a = new Date(param);
      var m = a.getMonth() + 1;
      if (m < 10) {
        m = '0' + m;
      }
      var d = a.getDate();
      if (d < 10) {
        d = '0' + d;
      }
      var b = a.getFullYear() + '-' + m + '-' + d;

      if (type != null) {
        var h = a.getHours();
        if (h < 10) {
          h = '0' + h;
        }
        var mm = a.getMinutes();
        if (mm < 10) {
          mm = '0' + mm;
        }
        //				var ss = a.getSeconds();
        //				if(ss < 10) {
        //					ss = '0' + ss;
        //				}
        b = b + ' ' + h + ':' + mm;
      }
      return b;
    },

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
  margin-bottom: 1.1rem;
  position: relative;
}
.line {
  height: 0.1rem;
  width: 100%;
  background: #ebebeb;
  position: fixed;
  left: 0;
  top: 3.7rem;
}

/*商城活动start*/

#ShopSales {
  margin: 0 auto;
  background: #f5f5f5;
}
#ShopSales .sales_box {
  height: 22.2rem;
  margin: 0 auto;
  width: calc(100% - 3rem);
}
#ShopSales .sales_box_time {
  height: 1.8rem;
  line-height: 1.8rem;
  text-align: center;
  padding-top: 0.6rem;
}
#ShopSales .sales_box_time span {
  display: inline-block;
  padding: 0 0.5rem;
  min-width: 5rem;
  height: 1.8rem;
  line-height: 1.8rem;
  text-align: center;
  font-size: 1.2rem;
  background: #ddd;
  color: #fff;
}
#ShopSales .sales_box_content {
  width: 100%;
  height: 15rem;
  margin-top: 2rem;
  background: #fff;
  position: relative;
}
#ShopSales .sales_box_content a {
  display: block;
  width: calc(100% - 2.5rem);
  height: 12.5rem;
  margin: 0 auto;
  padding-top: 1.2rem;
  position: relative;
}
#ShopSales .sales_box_content a img {
  width: 100%;
  height: 12.5rem;
}
#ShopSales .sales_box_content a span {
  display: inline-block;
  width: 100%;
  height: 3.2rem;
  line-height: 3.2rem;
  position: absolute;
  bottom: 0;
  left: 0;
  background: #090909;
  opacity: 0.8;
  color: #fff;
  font-size: 1.4rem;
  text-indent: 1em;
  /*文字溢出*/
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}
.more {
  text-align: center;
  line-height: 2.0rem;
  font-size: 1.4rem;
  color: #666;
  padding-bottom: 1rem;
}
#ShopSales .sales_box .endShadow {
  width: 100%;
  height: 15rem;
  position: absolute;
  left: 0;
  top: 0;
  background: rgba(122, 122, 122, 0.5);
  z-index: 50;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}
#ShopSales .sales_box .endShadow>div {
  margin: 0 auto;
  width: 10rem;
  height: 3.5rem;
  line-height: 3.5rem;
  border: 0.1rem solid #ffffff;
  color: #fff;
  font-size: 1.7rem;
  letter-spacing: 0.1rem
}

/*商城活动end*/

.error-box {
  margin: 0 auto;
  height: 100%;
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
