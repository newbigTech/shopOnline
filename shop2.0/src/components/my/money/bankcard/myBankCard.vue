<!-- 我的银行卡 -->
<template>
    <div class="myBankCard">
        <div class="card" v-if=" cardObj != null ">
            <div class="item">
                <img :src="cardObj.bankcardBackPicture" class="bg-img" />
                <div class="item-data">
                    <div class="name">{{cardObj.bankName}}</div>
                    <div class="type">{{cardObj.cardKind}}</div>
                    <div class="num">{{cardObj.cardNoRepeated}}</div>
                    <div class="user">持卡人：{{cardObj.realNameRepeated}}</div>
                </div>
            </div>
        </div>
        <div class="btm">
            <span @click="handleManage">{{isNew?'添加银行卡':'变更银行卡'}}</span>
        </div>
        
    </div>
</template>
<script>
export default {
    name: 'myBankCard', // 我的银行卡
    data() {
        return {
            cardObj: null,
            isNew: true
        }
    },
    components: {
    },
    created() {
        document.title = '我的银行卡';
    },
    mounted() {
        this.$nextTick(function() {
            this._getBankCrad();
        });
    },
    methods: {
    	//查询是否设置支付密码和绑定银行卡
        _getBankCrad() {
            var _that = this;
            this.$http.get(this.baseUrl + '/bankcard/check', {
                params: { customerCode: this.userInfo.customerCode }
            }).then(function(res) {
                if (!res) { return }
                if (res.isBindCard == 0) { _that.isNew = true } //没有绑定银行卡时
                if(res.isBindCard == 1) {
                	_that.isNew = false;
                	_that.cardObj = res.bankList[0];
	                _that.cardObj.cardNoRepeated = _that._bankCrad(_that.cardObj.bankcard);
	                _that.cardObj.realNameRepeated = _that._bankName(_that.cardObj.realName);
	                _that._setCookie('_CARDOBJ', encodeURI(JSON.stringify(_that.cardObj)), 1, 1);
                }
            });
        },
        //管理或添加银行卡
        handleManage() {
        	//查询操作银行卡次数
        	var _that = this;
            this.$http.get(this.baseUrl + '/bankcard/getCounts', {
                params: { customerCode: this.userInfo.customerCode }
            }).then(function(res) {
                if (!res) { return }
                if(res.result == 'success') {
                	_that.$router.push({ path: '/manageBank1', query: { isNew: _that.isNew }})
                }
            });
        }
    }
}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style scoped>
.card {
    padding: 2.2rem 1.5rem;
}

.card .item {
    width: 100%;
    height: 18.2rem;
    font-size: 1.6rem;
    color: #fff;
    box-shadow: 0.2rem 2.05rem 1.65rem 0.05rem rgba(176, 176, 176, 0.22);
}

.item {
    position: relative;
    top: 0;
    left: 0;
}

.item .bg-img {
    width: 100%;
    height: 100%;
    z-index: -1;
}

.item .item-data {
    position: absolute;
    top: 0;
    left: 0;
}

.item .name,
.item .type {
    margin-left: 6.8rem;
}

.item .name {
    padding-top: 2.6rem;
}

.item .type {
    font-size: 1.2rem;
    margin-top: 0.45rem;
}

.item .num,
.item .user {
    margin-left: 2.3rem;
}

.item .num {
    margin-top: 4.8rem;
    font-size: 1.8rem;
}

.item .user {
    margin-top: 3.1rem;
    font-size: 1.4rem;
}

.btm {
    position: absolute;
    bottom: 2.2rem;
    left: 0;
    right: 0;
    font-size: 1.7rem;
    color: #333;
    text-align: center;
    cursor: pointer;
}

</style>
