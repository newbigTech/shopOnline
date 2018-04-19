<!-- 帮助列表 -->
<template>
    <div id="helpList" class="div-border-box">
        <div class="content">
            <mt-cell v-for="item, index in itemSortData" :key="index" :title="item.questionName" is-link @click.native="_goDetails(item)"></mt-cell>
        </div>
    </div>
</template>
<script>
import { Cell } from 'mint-ui';
export default {
    name: 'helpList',
    data() {
        return {
            itemData: [],
            pageSize: 10,
            pageCurrent: 1
        }
    },
    created() {
        document.title = '帮助中心-' + this.$route.query.title;
        this.itemData = [];
        this._getData(this.$route.query.id)
    },
    computed: {
        itemSortData: function() {
            return this.itemData.sort((a, b) => a.questionSort - b.questionSort);
        }
    },
    methods: {
        _getData(_ID) {
            var _that = this;
            this.$http.get(this.baseUrl + '/help/findQuestionsByClassifyId', {
                params: { token: this.token, customerCode: this.userInfo.customerCode, classifyId: _ID, pageSize: this.pageSize, pageNum: this.pageCurrent }
            }).then(function(res) {
                if (!res) { return }
                for (var i = 0; i < res.questionList.length; i++) {
                    _that.itemData.push(res.questionList[i]);
                }
                if (_that.itemData.length != res.total) {
                    _that.pageCurrent = 2;
                    _that._getData(_ID);
                }
            })
        },
        _goDetails(_item) {
            this.$router.push({ name: 'helpDetails', query: { id: _item.questionId, title: _item.questionName }});
        }
    }
}

</script>
<style scoped>
@import '../../../assets/css/itemCommon.css';
.content .mint-cell:after {
    position: absolute;
    background-color: #E5E5E5;
    content: " ";
    right: 0;
    bottom: 0;
    left: 1.5rem;
    height: 0.1rem;
}

</style>
