<!-- 升级商品详情 -->
<template>
    <div class="upDetail">
        <div class="product-img">
            <mt-swipe>
                <mt-swipe-item v-for="(item,index) in imgList" :key="index">
                    <img :src="item.source" width="100%" height="100%" @click="handleImg(index)" />
                </mt-swipe-item>
            </mt-swipe>
        </div>
        <div :class="['img-btm '] + [ upBefore ? 'mt49' : '' ]">
            <div class="product-meta">
                <div class="title">
                    <span class="sign" v-if="goodsData.sellWay == '1'">自营</span>
                    <span class="sign" v-if="goodsData.sellWay == '0'">非自营</span>
                    <span>{{goodsData.goodsName}}</span>
                </div>
                <div class="hit-title">{{goodsData.goodsSubtitle}}</div>
                <div class="prize"><i>¥</i>{{goodsData.goodsPrice}}</div>
                <div class="freight">运费: {{countEms}}元(首件{{goodsData.emsFee}}元,此后每件依次加{{goodsData.addEmsFee}}元)</div>
                <div class="count" v-if="upBefore">
                    <span class="title">数量:</span>
                    <div class="operate">
                        <span :class="['symbol '] + [ countNum > 1 ? 'bg-gray' : '']" @click="handleCount('reduce')">-</span>
                        <span class="num bg-gray">{{countNum}}</span>
                        <span :class="['symbol '] + [ countNum < 20 ? 'bg-gray' : '']" @click="handleCount('add')">+</span>
                    </div>
                </div>
            </div>
            <div class="block-gray"></div>
            <div class="product-detail">
                <h3>商品详情</h3>
                <div class="detail-con" v-for="item in goodsData.goodsDetailImgList">
                    <img :src="item.source" width="100%" />
                </div>
            </div>
        </div>
        <div class="buy" v-if="upBefore">
            <span class="money">
                <span>余额：</span>
            <span>{{accountMoney}}<label>(元)</label></span>
            </span>
            <button class="btn-buy" @click="handleBuy">立即购买</button>
        </div>
        <!-- 查看大图 -->
        <div class="img-pop" v-if="showBigImg" @click="showBigImg = false">
            <mt-swipe :show-indicators="false" :auto="0" :defaultIndex="defaultIndex">
                <mt-swipe-item v-for="(item,index) in imgList" :key="index">
                    <img :src="item.source" />
                </mt-swipe-item>
            </mt-swipe>
        </div>
    </div>
</template>
<script>
export default {
    name: 'upDetail',
    components: {},
    data() {
        return {
            queryData: {
                recordId: '', //商品记录id
                proType: '', //升级商品/大升级商品
                proCode: '' //商品code
            }, //列表传给详情页的值
            goodsData: {}, //商品信息
            imgList: [],
            upBefore: true, //true为升级前
            countNum: 1, //数量控制为小于20
            accountMoney: 0, //账户余额
            countEms: 0, //运费
            showBigImg: false, //查看商品图片状态
            defaultIndex: 0, //查看大图 默认图片下标
        }
    },
    created() {
        document.title = '商品详情';
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    },
    mounted() {
        this.$nextTick(function() {
            // this.queryData = {
            //     recordId: this.$route.query.recordId,
            //     proType: this.$route.query.type,
            //     proCode: this.$route.query.proCode
            // };
            this.queryData = {
                recordId: 48,
                proType: 'upgrade',
                proCode: '60dec12bd7fb443e8c4cf22a7b2dfb74'
            };
            this.getDetail();
        });
    },
    methods: {
        // 获取升级商品详情
        getDetail() {
            // var that = this,
            //     params = { id: this.queryData.recordId };
            // if (this.queryData.proType == 'upgrade') {
            //     params.goodId = this.queryData.proCode
            //     this.upBefore = true;
            //     if (this.userInfo && this.token != null) {
            //         this.getMoney();
            //     }
            // } else {
            //     params.maxUpgradeId = this.queryData.proCode;
            //     this.upBefore = false;
            // }
            // this.$http.get(this.baseUrl + '/product/findProductByID', , { params: params }).then(function(res) {
            //     if (!res) { return }
            //     if (res == '商品过期') { return that.$router.push('/goodsExpired') }
            //     that.goodsData = res;
            //     that.imgList = res.goodsImgList;
            //     that.countEms = res.emsFee;
            // });
            // this.upBefore = false;
            var res = {
                addEmsFee: 5,
                emsFee: 10,
                goodId: "9e96ef7905e84497bdc08b3867225e0c",
                goodsDetailImgList: [{
                    orders: 1,
                    source: "http://test.img.mall.yipingoo.com/resources//home/promproduct/20180402/a8484630-17f4-4168-8e58-04d18eb8dbc0.jpg",
                }],
                goodsImgList: [{
                    orders: 1,
                    source: "http://test.img.mall.yipingoo.com/resources//home/promproduct/20180402/1fa0d16f-c1f7-4138-a6f4-513ac314885b.jpg"
                }],
                goodsName: "茅台王子酒",
                goodsPrice: 208,
                goodsSkuNo: "HUC0101020301JIUB",
                goodsSpecColor: "无",
                goodsSpecSize: "无",
                goodsSubtitle: "ADFADFASDF",
                id: 792,
                isBuy: 1,
                sellWay: "1"
            };
            this.goodsData = res;
            this.imgList = res.goodsImgList;
            this.countEms = res.emsFee;
            this.getMoney();
        },
        //查询账户余额
        getMoney() {
            // var that = this;
            // this.$http.get(this.baseUrl + '/account/getMyAccount').then(function(res) {
            //     if (!res) { return; }
            //     that.accountMoney = res.accountAmount; //账户余额
            // });
            var res = {
                accountAmount: 10093419.67,
                bankrollId: 25,
                customerCode: "6ebfe21938d447c498585736b12faac1",
                isBalance: 10033220.35,
                minBalance: 0.01,
                pointAmount: 25895,
                version: 287,
            }
            this.accountMoney = res.accountAmount; //账户余额
        },
        handleImg(index) {
            this.defaultIndex = index;
            this.showBigImg = true;
        },
        //商品数量添加或减少
        handleCount(param) {
            if (param == 'reduce') { // 减
                if (this.countNum == 1) {return}
                this.countNum--;
            }
            if (param == 'add') { // 加
                if (this.countNum == 20) { return }
                this.countNum++;
            }
            var _temp;
            if (this.countNum > 1) {
                _temp = this.NumberMul(this.countNum - 1, this.goodsData.addEmsFee);
            } else {
                _temp = 0;
            }
            this.countEms = this.NumberAdd(this.goodsData.emsFee, _temp);
        },
        //立即购买
        handleBuy() {
            if ((!this.userInfo) || (this.token == null)) {
                return this.$toast('请先登录');
            }
            var that = this;
            this.$http.post(this.baseUrl + '/promotion/addOrder', {
                finalAmount: this.NumberMul(this.goodsData.goodsPrice, this.countNum),
                proId: this.goodsData.id,
                goodId: this.goodsData.goodId,
                proCount: this.countNum
            }).then(function(res) {
                if (!res) { return }
                localStorage.setItem('orderInfo', JSON.stringify(res));
                that.$toast('购买成功')
                // that.$router.push('/upGoBuy');
            });
        }
    }

}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style scoped>
.upDetail {
    width: 100%;
}

.product-img {
    position: absolute;
    right: 0;
    top: 0;
    width: 100%;
    height: 37.5rem;
    background: #eee;
}

.product-img>img {
    width: 100%;
    height: 100%;
}

.img-btm {
    width: 100%;
    padding-top: 37.5rem;
}

.product-meta {
    min-height: 3.0rem;
    margin: 1.0rem 1.5rem;
}

.product-meta .title {
    color: #242424;
    font-size: 1.5rem;
}

.product-meta .title .sign {
    float: left;
    background: #e93b3d;
    border-radius: 0.2rem;
    color: #fff;
    font-size: 1.0rem;
    padding: 0.2rem;
    margin-right: 0.2rem;
}

.product-meta .hit-title {
    color: #666;
    font-size: 1.3rem;
    margin-top: 1.1rem;
}

.product-meta .prize {
    color: #e93b3d;
    font-size: 1.9rem;
    font-weight: bold;
    margin-top: 1.7rem;
}

.product-meta .prize i {
    font-size: 1.2rem;
    font-style: normal;
    margin-right: 0.4rem;
    font-weight: bold;
}

.product-meta .freight {
    color: #666;
    font-size: 1.2rem;
    margin-top: 1.7rem;
    margin-bottom: 1.8rem;
}

.count {
    padding: 1.5rem 0 0.5rem 0;
    border-top: 0.05rem solid #e6e6e6;
}

.count>.title {
    line-height: 3.5rem;
    font-size: 1.2rem;
    color: #333;
}

.count>.operate {
    float: right;
}

.count>.operate span {
    display: inline-block;
    height: 3.3rem;
    line-height: 3.3rem;
    vertical-align: text-bottom;
}

.count>.operate .symbol {
    width: 4.4rem;
    font-size: 2.0rem;
    color: #999;
    text-align: center;
    cursor: pointer;
    background: #fbfbfb;
}

.count>.operate .num {
    padding: 0 2.2rem;
    font-size: 1.7rem;
    color: #333;
    text-align: center;
    margin-top: -1.0rem;
}

.count>.operate .symbol.bg-gray,
.bg-gray {
    background: #f5f5f5;
}

.block-gray {
    width: 100%;
    height: 0.8rem;
    background: #f5f5f5;
}

.product-detail {
    padding: 1.5rem;
}

.product-detail h3 {
    color: #333;
    font-size: 1.3rem;
    margin-bottom: 1.8rem;
}

.detail-con,
.detail-con>img {
    line-height: 0;
    margin: 0;
}

.buy {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 4.9rem;
    background: #fbfbfb;
    border-top: 0.05rem solid #d9d9d9;
    box-sizing: border-box;
    padding-bottom: constant(safe-area-inset-bottom);
}

.buy .money {
    color: #666;
    font-size: 1.3rem;
    line-height: 4.9rem;
    margin-left: 2.25rem;
}

.buy .money span:nth-child(2) {
    color: #e93b3d;
    font-weight: bold;
    font-size: 1.5rem;
}

.buy .money span:nth-child(2) label {
    font-size: 1.0rem;
    font-weight: bold;
}

.buy .btn-buy {
    float: right;
    width: 13.2rem;
    height: 4.9rem;
    background: #e93b3d;
    color: #fff;
    font-size: 1.5rem;
}

.mt49 {
    margin-bottom: 4.9rem;
}

.img-pop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 1.0);
    vertical-align: sub;
}

.img-pop img {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    margin: auto;
}

</style>
