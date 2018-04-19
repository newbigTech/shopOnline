<!-- 楼层编辑 -->
<template>
    <div class="floorEdit">
        <v-breadcrumb firstMenu="品牌楼层" secondMenu="品牌商品管理"></v-breadcrumb>
        <div class="nav row">
            <div class="col-md-12">
                <div class="portlet box red">
                    <div class="portlet-title">
                        <div class="caption">{{pageQuery.name}} >> 商品列表</div>
                    </div>
                    <div class="portlet-body">
                        <div class="operate">
                            <span>品牌名称：</span>
                            <input type="text" class="form-control input-inline" placeholder="元素名称" v-model="selectForm.name">
                            <button type="button" class="btn btn-success" @click=" _selectData ">查询</button>
                        </div>
                        <div class="operate">
                            <button type="button" class="btn btn-primary" @click=" _handleBrand() ">添加</button>
                            <button type="button" class="btn btn-danger" @click=" _handleBrandDelete ">批量删除</button>
                        </div>
                        <div class="table-scrollable">
                            <el-table :data="tableData" @selection-change=" _handleSelection ">
                                <el-table-column type="selection" width="50"></el-table-column>
                                <el-table-column prop="proName" label="商品名称"> </el-table-column>
                                <el-table-column prop="proClass" label="商品类别"> </el-table-column>
                                <el-table-column prop="proSalePrice" label="价格"> </el-table-column>
                                <el-table-column prop="proSimg" label="图片" width="280" align="center">
                                    <template slot-scope="scope">
                                        <img :src="scope.row.proSimg" class="brand-img" />
                                    </template>
                                </el-table-column>
                                <el-table-column prop="createTime" label="创建时间" align="center">
                                </el-table-column>
                                <el-table-column prop="proOrder" sortable label="排序" width="120" align="center">
                                    <template slot-scope="scope">
                                        <input type="number" class="input-sort" v-model="scope.row.proOrder" @blur=" _editSort(scope.row)">
                                    </template>
                                </el-table-column>
                                <el-table-column prop="" label="操作" width="200" align="right">
                                    <template slot-scope="scope">
                                        <span class="btn default btn-xs red" @click=" _handleDelete(scope.row.brandProRefId) "> 删除 </span>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <el-pagination layout="prev, pager, next" v-if="page.total > page.size" :page-size="page.size" :current-page="page.current" :total="page.total" v-on:current-change=" _handlePaging "></el-pagination>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <v-goodsListModel :visible="goodsListModelVisible" v-on:visible="_setGoodsVisible" v-on:getGoods="_getSelectedGoods"></v-goodsListModel>
    </div>
</template>
<script>
import breadcrumb from '@/components/tool/breadcrumb' //面包屑 
import goodsListModel from '@/components/goods/goodsListModel' //商品列表弹框 
export default {
    name: 'floorEdit',
    components: {
        'v-breadcrumb': breadcrumb,
        'v-goodsListModel': goodsListModel,
    },
    data() {
        return {
            pageQuery: { name: '' },
            BrandID: null,
            tableData: [],
            page: { total: 0, current: 1, size: 10 },
            selectForm: { name: '' },
            delectBrand: [],
            goodsListModelVisible: false
        }
    },
    mounted() {
        this.pageQuery = this.$route.query;
        this.BrandID = this.pageQuery.id;
        this.$nextTick(function() {
            this._selectData();
        });
    },
    methods: {
        _editSort(_goods){
            if(_goods.proOrder == null ){
                this.$message('放弃排序修改');
                return this._selectData();
            }
            if (_goods.proOrder<0) {
                this.$message('排序失败,请输入正整数');
                return this._selectData();
            }
            var _that = this;
            this.$http.post(this.baseUrl + '/brandProRef/modifyOrder', {
                token: this.token,
                brandProDefId: _goods.brandProRefId,
                proOrder: _goods.proOrder
            }).then(function(res){
                if (!res) { return}
                _that._selectData();
            }).catch(function(error) {
                _that._selectData();
            });
        },
        // 选着商品, 设置信息
        _getSelectedGoods(_goods) {
            var _that = this;
            this.$http.post(this.baseUrl + '/brandProRef/addBrandPro', {
                token: this.token,
                brandId: this.BrandID,
                proCode: _goods.proCode,
                createUser: this.userInfo.username
            }).then(function(res) {
                if (!res) { return _that.$message('添加失败') }
                _that._selectData();
                _that.$message('添加成功');
            }).catch(function(error) {
                return _that.$message('添加失败');
            });
        },
        // 关闭视图
        _setGoodsVisible(flag) {
            this.goodsListModelVisible = flag;
        },
        // 查询列表数据
        _selectData() {
            var _that = this,
                _params = { token: this.token, pageNum: this.page.current, pageSize: this.page.size, brandId: this.BrandID }
            if (this.selectForm.name != '') {
                _params.proName = this.selectForm.name;
            }
            this.$http.get(this.baseUrl + '/brandProRef/getBrandProInfos', {
                params: _params
            }).then(function(res) {
                if (!res) { return }
                _that.tableData = res.products;
                _that.page = { total: res.total, size: res.pageSize, current: res.pageNum };
            }).catch(function(error) {
                // console.log("%c 品牌 => 查询数据 %c " + error, "color:green", 'color:red');
            });
        },
        // 分页查询
        _handlePaging(_current) {
            this.page.current = _current;
            this._selectData();
        },
        // 添加品牌
        _handleBrand(_brand) {
            this.goodsListModelVisible = true;
        },
        // 列表 选中行
        _handleSelection(_val) {
            this.delectBrand = [];
            for (var i = 0; i < _val.length; i++) {
                this.delectBrand.push(_val[i].brandProRefId);
            }
        },
        // 删除品牌[批量]
        _handleBrandDelete() {
            if (this.delectBrand.length == 0) {
                return this.$message('请选择删除项');
            } else {
                var that = this;
                this.$confirm('确认删除吗').then(function() {
                    that.$http.post(that.baseUrl + '/brandProRef/deleteBrandPros', { brandProRefIds: JSON.stringify(that.delectBrand), token: that.token }).then(function(res) {
                        if (!res) { return; }
                        that.$message('删除成功');
                        that._selectData();
                    }).catch(function(error) {
                        // console.log("%c 品牌 => 删除品牌 %c " + error, "color:green", 'color:red');
                    });
                });
            }
        },
        // 删除品牌
        _handleDelete(_ID) {
            this.delectBrand = [];
            this.delectBrand.push(_ID);
            this._handleBrandDelete();
        }
    }
}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style scoped>
@import url("./css/dialog.css");
.lineHeight {
    min-height: 60px;
    max-height: 90px;
    overflow: hidden;
    line-height: 1;
}

.brand-img {
    max-width: 280px;
    max-height: 120px;
}

.floor-img {
    width: 50px;
    height: 50px;
    margin-top: 10px;
}

.rowScoped {
    margin-right: -15px;
    margin-left: -15px;
}

.dialog-con .input-group-btn {
    line-height: 1;
}

.dialog-con .input-group-btn>.btn {
    height: 40px;
    line-height: 30px;
    border-radius: 0 4px 4px 0;
    border: 1px solid #ccc;
}
input.input-sort { border: none; width: 100%; text-align: center; }
input.input-sort:focus { border: 1px solid #ddd; }
</style>
