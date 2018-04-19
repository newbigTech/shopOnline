<!-- 帮助查询 -->
<template>
    <div id="helpQuery" class="div-border-box">
        <div class="content">
            <div class="query-box clearfix">
                <div class="query">
                    <div class="clearfix">
                        <i class="iconfont icon-sousuo"></i>
                        <input v-model="inputSearch" type="text" placeholder="有问题？点我搜搜看吧" @keydown="_enterInput" />
                        <i v-if="inputSearch!=''" class="icon-close iconfont icon-iconfontcolor92" @click="_clearSearch"></i>
                    </div>
                </div>
                <template v-if="inputSearch!=''">
                    <button @click="_searchQuestion">搜索</button>
                </template>
                <template v-else>
                    <button @click="$router.push({ name: 'helpCenter' })">取消</button>
                </template>
            </div>
            <div class="ct-bd">
                <mt-cell v-for="item,index in questionList" :key="index" :title="item.questionName" is-link @click.native="_goDetails(item)"></mt-cell>
            </div>
            <div v-if="!isNoData" class="no-item">你搜索的不存在！</div>
        </div>
    </div>
</template>
<script>
import { Cell } from 'mint-ui';
export default {
    name: 'helpQuery',
    data() {
        return {
            questionList: [],
            dataCookie: null,
            inputSearch: '',
            isNoData: true
        }
    },
    created() {
        this._getData();
        document.title = '帮助中心-搜索';
    },
    watch: {
        // 搜索 内容触发 显示列表数据
        inputSearch: function(val, oldVal) {
            if (val == '') {
                this.questionList = this.dataCookie;
                return
            }
        }
    },
    methods: {
        // 获取推荐问题
        _getData() {
            var _that = this;
            this.$http.get(this.baseUrl + '/help/findHelpfulQuestion', {
                params: { token: this.token, customerCode: this.userInfo.customerCode }
            }).then(function(res) {
                if (!res) { return }
                _that.questionList = res.questionList;
                _that.dataCookie = _that.questionList;
            })
        },
        // 绑定 搜索 键盘按下事件
        _enterInput(ev) {
            ev = ev || event;
            var el = ev.currentTarget;
            if (ev.keyCode == 13) {
                this._searchQuestion();
            }
        },
        // 清空 搜索, 读取推荐问题 [缓存] 
        _clearSearch() {
            this.inputSearch = '';
            this.questionList = this.dataCookie;
        },
        // 搜索 问题
        _searchQuestion() {
            var _that = this;
            this.$http.get(this.baseUrl + '/help/searchQuestion', {
                params: { token: this.token, customerCode: this.userInfo.customerCode, questionName: this.inputSearch, pageSize: 10, pageNum: 1 }
            }).then(function(res) {
                if (!res) { return }
                _that.questionList = res.questionList;
            })
        },
        // 去 问题详情页
        _goDetails(_item) {
            this.$router.push({ name: 'helpDetails', query: { id: _item.questionId, title: _item.questionName } });
        }
    }
}

</script>
<style scoped>
@import '../../../assets/css/itemCommon.css';
@import 'help.css'

</style>
