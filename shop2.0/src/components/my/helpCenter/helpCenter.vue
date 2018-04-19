<!-- 帮助中心  -->
<template>
    <div id="helpCenter" class="div-border-box">
        <div class="content">
            <div class="query-box">
                <div class="query" @click="$router.push({name: 'helpQuery'})">
                    <i class="iconfont icon-sousuo"></i> 有问题？点我搜搜看吧~
                </div>
            </div>
            <div class="ct-bd">
                <div class="help-item" v-for="item, index in itemSortData" :key="index" v-if="item.isShow==1">
                    <div class="item-left">
                        <router-link :to="{ name:'helpList', query: { id: item.classifyId, title: item.classifyName }}">
                            <p><img :src=" item.classifyImgUrl "></p>
                            <p>{{ item.classifyName }}</p>
                        </router-link>
                    </div>
                    <div class="item-right clearfix">
                        <div class="u-fl" v-for="child in item.questionList">
                            <router-link :to="{ name:'helpDetails', query: { id: child.questionId, title: child.questionName }}">
                                {{ child.questionName }}
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'helpCenter',
    data() {
        return {
            itemData: []
        }
    },
    created() {
        console.clear();
        document.title = '帮助中心';
        this._getData();
    },
    computed: {
        itemSortData: function() {
            return this.itemData.sort((a, b) => a.classifySort - b.classifySort);
        }
    },
    methods: {
        _getData() {
            var _that = this;
            this.$http.get(this.baseUrl + '/help/findClassIfy', {
                params: { token: this.token, customerCode: this.userInfo.customerCode, pageSize: 10, pageNum: 1 }
            }).then(function(res) {
                if (!res) { return }
                _that.itemData = res.classIfyList;
            });
        }
    }
}

</script>
<style scoped>
@import '../../../assets/css/itemCommon.css';
@import 'help.css'

</style>
