<!-- 加载已同步且编辑过的商品信息 -->
<template>
    <el-dialog title="选择商品" width="50%" lock-scroll :visible.sync=" modelShow " @close=" modelShow = false ">
        <div class="operate">
            <span>商品名称：</span>
            <input class="form-control input-small input-inline" type="text" v-model="goodsForm.name" placeholder="请输入商品名称" />
            <!--<span>商品状态：</span>
            <select class="form-control input-small input-inline" v-model="goodsForm.state">
                <option value="2">全部</option>
                <option value="0">销售中</option>
                <option value="1">下架</option>
            </select>-->
            <span>商品分类：</span>
            <select class="form-control input-small input-inline" v-model="goodsForm.oneSelected" @change="getTwoClass">
                <option value="info">请选择...</option>
                <option v-for="item, oneIndex in oneClass" :key="oneIndex" :value="item.classId"> {{ item.className }} </option>
            </select>
            <select class="form-control input-small input-inline" v-model="goodsForm.twoSelected">
                <option v-if=" twoClass.length == 0 " value="info">暂无</option>
                <option v-else value="info">请选择..</option>
                <option v-for="item, twoIndex in twoClass" :key="twoIndex" :value="item.productTypeCode"> {{ item.className }} </option>
            </select>
            <button type="button" class="btn btn-success" @click="ClassQuery">查询</button>
        </div>
        <el-table :data=" goodsList " height="400">
            <el-table-column prop="proId" label="ID" width="60" align="left"></el-table-column>
            <el-table-column prop="proTitle" label="商品标题" width="300" align="center"> </el-table-column>
            <el-table-column prop="proSimg" label="图片" width="120" align="center">
                <template slot-scope="scope">
                    <img :src="scope.row.proSimg" class="goods-img" />
                </template>
            </el-table-column>
            <el-table-column prop="proBrand" label="商品品牌" align="center"> </el-table-column>
            <el-table-column prop="proBrand" label="商品类型" align="right">
                <template slot-scope="scope">
                    <span v-if="scope.row.prodCate == 1">普通商品</span>
                    <span v-else-if="scope.row.prodCate == 2">促销专区</span>
                    <span v-else-if="scope.row.prodCate == 3">增值专区</span>
                </template>
            </el-table-column>
            <el-table-column prop="" label="操作" align="right">
                <template slot-scope="scope">
                    <span class="btn default btn-xs green" @click="selectedGoods(scope.row)">选择</span>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination layout="prev, pager, next" v-if=" page.total > page.size " :page-size=" page.size " :current-page=" page.current " :total=" page.total " v-on:current-change=" _handlePaging "></el-pagination>
    </el-dialog>
</template>
<script>
export default {
    name: '', // 商品列表弹框
    data() {
        return {
            goodsForm: {
                name: '',
                state: '2',
                oneSelected: 'info',
                twoSelected: '',
            },
            modelShow: false,
            goodsList: [],
            page: { current: 1, size: 10, total: 1 },
            oneStorage: null,
            oneClass: [],
            twoClass: [],
        }
    },
    watch: {
        visible: function(val, oldVal) {
            this.modelShow = val;
            this.goodsForm = {
                name: '',
                state: '2',
                oneSelected: 'info',
                twoSelected: '',
            };
            this._getGoodsList(null);
        },
        modelShow: function(val, oldVal) {
            this.$emit('visible', val)
        }
    },
    props: {
        visible: Boolean
    },
    mounted() {
        this._getGoodsList(null);
        this.$nextTick(function() {
            this.getOneClass();
        });
    },
    methods: {
        //获取一级商品类别
        getOneClass: function() {
            var that = this;
            this.$http.get(this.baseUrl + '/productInfo/getProTypeOptions', { params: { token: this.token, lv: "1" } }).then(function(res) {
                if (!res) { return; }
                that.oneClass = res.typeOptions;
            });
        },
        //获取 二级商品类别
        getTwoClass: function() {
            this.goodsForm.twoSelected = 'info';
            var that = this;
            // 设置一级商品 code
            if (this.goodsForm.oneSelected == 'info') {
                this.oneStorage = null;
            } else {
                for (var i = 0; i < this.oneClass.length; i++) {
                    if (this.oneClass[i].classId == this.goodsForm.oneSelected) {
                        this.oneStorage = this.oneClass[i].productTypeCode;
                    }
                }
            }
            this.$http.get(this.baseUrl + '/productInfo/getSecondLvProTypes', {
                params: { token: this.token, typeCode: this.goodsForm.oneSelected }
            }).then(function(res) {
                if (!res) { return; }
                that.twoClass = res.types;
            });
        },
        // 模糊搜索
        ClassQuery: function() {
            var proCode;
            if (this.goodsForm.twoSelected == 'info') {
                proCode = this.oneStorage;
            } else {
                proCode = this.goodsForm.twoSelected;
            }
            this.page.current = 1;
            this._getGoodsList(proCode);
        },
        // 选择 商品列表, 传给父级
        selectedGoods(_goods) {
            this.modelShow = false;
            this.$emit('getGoods', _goods)
        },
        // 获取商品列表 proCode 商品code
        _getGoodsList: function(proCode) {
            var that = this,
                params = { pageNum: this.page.current, pageSize: this.page.size };
            if (this.goodsForm.state != '2') { params.proSale = this.goodsForm.state }
            if (this.goodsForm.name != '') { params.proTitle = this.goodsForm.name }
            if (proCode != '') { params.proClass = proCode }
            this.$http.get(this.baseUrl + '/productInfo/findEditProducts', { //  /productInfo/getProducts
                params: params
            }).then(function(res) {
                that.goodsList = res.synProductList;
                that.page.total = res.total;
            })
        },
        // 商品列表分页
        _handlePaging: function(_currentPage) {
            this.page.current = _currentPage;
            this._getGoodsList();
        },
    }

}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style scoped>


</style>
