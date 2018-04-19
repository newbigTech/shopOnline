<!--商城公告-->
<template>
  <div id="MallAnnouncement" :style="{'min-height': clientH *10 +'px'}">
    <!--<div class="header">
      <header-bar></header-bar>
      <div class="line"></div>
    </div>-->
    <template v-if="noticeList.length > 0">
      <!--Full-->
      <div class="announcement_box" v-for="(item,index) in noticeList">
        <div class="announcement_box_time">
          <span>{{item.time}}</span>
        </div>
        <div class="announcement_box_content">
          <a @click="getDetails(item)">
            <h2>{{item.noteTitle}}<span>&gt;</span></h2>
            <div class="announcement_box_content_nav">
              <p>{{item.noteContent}}</p>
            </div>
          </a>
        </div>
      </div>
      <div class="more" v-if="showMore" @click="loadMore">点击加载更多</div>
      <div class="more" v-if="noMore&&total != 0">没有更多了~</div>
    </template>
    <template v-if="noticeList.length == 0">
      <div class="error-box" :style="{'height': clientH * 10 +'px'}">
        <div class="error-icon"><img src="./img/nothing.png" alt="" /></div>
        <div class="error-help">暂无商城公告</div>
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
  name: 'MallAnnouncement',
  data() {
    return {
      noticeList: [], //商城公告列表
      pageNum: 1, //当前页面
      showMore: false, //是否展示更多
      noMore: false, //是否展示没有更多
      total: 0, //总共条数
    }
  },
  components: {
//  'header-bar': headerBar
  },

  mounted() {
    this.$nextTick(function() {
      this.getNoticeInfo();
    })
  },
  methods: {
    //获取商城公告
    getNoticeInfo() {
      var that = this;
      var reqUrl = this.baseUrl + '/notice/getNoticeInfo';
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
          that.noticeList = res.snList;
        } else {
          for (var i = 0; i < res.snList.length; i++) {
            that.noticeList.push(res.snList[i]);
          }
        }
        if (that.total > that.noticeList.length) {
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
        this.getNoticeInfo();
      }
    },
    //跳转
    getDetails(item) {
      localStorage.setItem('_mallDetails', JSON.stringify(item)); //当前商品信息
      this.$router.push({
        path: '/announcementDetails',
        query: {
          noteId: item.noteId
        }
      })
    }
  },

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

/*商城公告start*/

#MallAnnouncement {
  margin: 0 auto;
  /*margin-top: 0.1rem;*/
  background: #f5f5f5;
}
#MallAnnouncement .announcement_box {
  height: 19rem;
  margin: 0 auto;
  width: calc(100% - 3rem);
}
#MallAnnouncement .announcement_box_time {
  height: 1.8rem;
  line-height: 1.8rem;
  text-align: center;
  font-size: 1.2rem;
  padding-top: 0.6rem;
}
#MallAnnouncement .announcement_box_time span {
  display: inline-block;
  min-width: 5rem;
  padding: 0 0.5rem;
  color: #fff;
  background: #ddd;
}
#MallAnnouncement .announcement_box_content {
  margin-top: 2rem;
  background: #fff;
  height: 11.5rem;
}
#MallAnnouncement .announcement_box_content a {
  display: block;
  width: calc(100% - 2.5rem);
  height: 9.5rem;
  margin: 0 auto;
  padding-top: 1.5rem;
  text-decoration: none;
  box-sizing: border-box;
}
#MallAnnouncement .announcement_box_content a h2 {
  font-size: 1.6rem;
  color: #333;
  font-weight: normal;
}
#MallAnnouncement .announcement_box_content a h2 span {
  float: right;
}
#MallAnnouncement .announcement_box_content_nav {
  margin-top: 1.3rem;
  border-top: 1px solid #e5e5e5;
  color: #666;
  font-size: 1.4rem;
  height: 3rem;
  padding-top: 1.6rem;
}
#MallAnnouncement .announcement_box_content_nav p {
  color: #666;
  font-size: 1.4rem;
  height: 4rem;
  line-height: 2rem;
  /*文字溢出*/
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
.more {
  text-align: center;
  line-height: 2.0rem;
  font-size: 1.4rem;
  color: #666;
  padding-bottom: 1rem;
}

/*商城公告end*/
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
