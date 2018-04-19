<!-- 帮助详情 -->
<template>
    <div id="helpDetails" class="div-border-box">
        <div class="content" v-if="question!=null">
            <div class="problem-box mt">
                <p><span class="problem-icon">问</span> {{question.questionName}}</p>
            </div>
            <div class="answer-box">
                <span class="answer-icon">答</span>
                <div class="tit-body">
                	<p v-for="item in questionDetails" class="questionDetails">{{item}}</p>
                	
                </div>
            </div>
            <div class="help-evaluate">
                <div class="split">解答对您有帮助吗？</div>
                <div class="btn-evaluate clearfix">
                    <template v-if="!isClick">
                        <div class="u-fl">
                            <button @click="_isClick('1')"><i class="iconfont icon-fabulous"></i>有帮助</button>
                        </div>
                        <div class="u-fr">
                            <button @click="_isClick('2')" class="rotate"><i class="iconfont icon-fabulous"></i>没帮助</button>
                        </div>
                    </template>
                    <template v-else>
                        <div class="evaluate-success">
                            <div v-if="clickStatus==1" class="yes"><i class="iconfont icon-zan2"></i>有帮助 | 我们会继续努力的！</div>
                            <div v-if="clickStatus==2" class="no"><i class="iconfont icon-zan2"></i>没帮助 | 我们会尽快改进，谢谢！</div>
                        </div>
                    </template>
                </div>
            </div>
        </div>
        <!--<div class="text-two-item">
            <div class="clearfix">
                <div class="item-left">咨询电话 <span>(9:00-24:00)</span> </div>
                <div class="item-right"><a href="tel:40058852885">400-5885-2885</a></div>
            </div>
        </div>-->
    </div>
</template>
<script>
export default {
    name: 'helpDetails',
    data() {
        return {
            clickStatus: 0,
            pageQuery: null,
            question: null,
            isClick: false,
            questionDetails:[]
        }
    },
    created() {
        this.pageQuery = this.$route.query;
        document.title = '帮助中心-' + this.$route.query.title;
        this._getData(this.$route.query.id)
    },
    methods: {
        _getData(_ID) {
            var _that = this;
            this.$http.get(this.baseUrl + '/help/findQuestion', {
                params: { token: this.token, customerCode: this.userInfo.customerCode, questionId: _ID }
            }).then(function(res) {
                if (!res) { return }
                _that.question = res;
                var details = res.questionAnswer;
                var arr = [];
                arr =details.replace(/\r/g,'').split('\n');
                _that.questionDetails =arr ;
                
            })
        },
        _isClick(_state){
            var _that = this;
            this.$http.post(this.baseUrl + '/help/addPraise', {
                token: this.token,
                customerCode: this.userInfo.customerCode,
                questionId: this.pageQuery.id,
                praiseStatus: parseInt(_state)
            }).then(function (res) {
                if (!res) {return}
                _that.isClick = true;
                _that.clickStatus = _state;
            })
        }
    }
}

</script>
<style scoped>
@import '../../../assets/css/itemCommon.css';
@import 'help.css';

.questionDetails{
	font-size: 1.3rem;
	line-height: 1.5rem;
	color: #666;
	margin-top: 0.5rem;
	margin-bottom: 0.5rem;
}
</style>
