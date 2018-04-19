<!-- 意见反馈列表 -->
<template>
    <div id="opList" class="list">
        <div class="itemList" v-if="dataList.length > 0">
            <div class="item-box" v-for="item, _idnex in dataList" :key="_idnex">
                <div class="item-header">
                    <span class="type">
                        <template v-if="item.problemType =='1'">功能异常</template>
                        <template v-if="item.problemType =='2'">体验问题</template>
                        <template v-if="item.problemType =='3'">新功能建议</template>
                        <template v-if="item.problemType =='4'">其他</template>                    
                    </span>
                    <span class="time">{{formatDate(item.submissionTime)}}</span>
                </div>
                <div class="item-content">
                    <div class="desc">{{item.feedbackDescription}}</div>
                    <div class="imgs" v-if="
                        item.feedbackImgUrl1!=null && item.feedbackImgUrl1 != '' ||
                        item.feedbackImgUrl2!=null && item.feedbackImgUrl2 != '' ||
                        item.feedbackImgUrl3!=null && item.feedbackImgUrl3 != '' ||
                        item.feedbackImgUrl4!=null && item.feedbackImgUrl4 != ''
                        ">
                        <template v-if="item.feedbackImgUrl1!=null && item.feedbackImgUrl1 != ''"><img :src="item.feedbackImgUrl1" alt=""></template>
                        <template v-if="item.feedbackImgUrl2!=null && item.feedbackImgUrl2 != ''"><img :src="item.feedbackImgUrl2" alt=""></template>
                        <template v-if="item.feedbackImgUrl3!=null && item.feedbackImgUrl3 != ''"><img :src="item.feedbackImgUrl3" alt=""></template>
                        <template v-if="item.feedbackImgUrl4!=null && item.feedbackImgUrl4 != ''"><img :src="item.feedbackImgUrl4" alt=""></template>
                    </div>
                </div>
            </div>
            <div class="footer-box">
                <template v-if="showMore">
                    <div class="more" @click="_getMore">点击加载更多</div>
                </template>
                <template v-else>
                    <div class="more" @click="_getMore">没有更多了</div>
                </template>
            </div>
        </div>
        <template v-else>
            <div class="error-box">
                <div class="error-icon"><img :src="'./static/img/notop.png'" alt=""></div>
                <div class="error-help">暂无意见反馈记录 </div>
            </div>
        </template>
    </div>
</template>
<script>
export default {
    name: 'opList',
    data() {
        return {
            page: { Size: 10, current: 1, total: 0 },
            showMore: false,
            dataList: []
        }
    },
    created() {
        this._getData();
    },
    mounted() {
        this.$nextTick(function() {})
    },
    methods: {
         _getMore() {
            console.log('test');
            if (this.dataList.length < this.page.total) {
                this.page.current++;
                this._getData();
            }
        },
        _getData() {
            var _that = this;
            this.$http.get(this.baseUrl + '/feedback/getFeedback', {
                params: {
                    token: this.token,
                    customerCode: this.userInfo.customerCode,
                    pageSize: this.page.Size,
                    pageNum: this.page.current
                }
            }).then(function (res) {
                if (!res) { return }
                _that.page.total = res.total;
                if ( _that.page.current == 1) {
                    _that.dataList = res.cfList; // 第一页数据
                } else {
                    for (var i = 0; i < res.cfList.length; i++) { 
                        _that.dataList.push(res.cfList[i]);
                    } //第一页以后数据
                }
                if (_that.dataList.length < _that.page.total) { _that.showMore = true } else { // 显示更多按钮
                    _that.showMore = false // 不显示更多按钮
                }
            });
        }
    }
}

</script>
<style scoped>
@import 'list.css'

</style>
