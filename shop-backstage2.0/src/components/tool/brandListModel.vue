<!-- 品牌楼层元素 -->
<template>
	<el-dialog title="选择商品" width="50%" lock-scroll :visible.sync=" modelShow " @close=" modelShow = false ">
        <div class="operate">
            <span>品牌名称：</span>
            <input type="text" class="form-control input-inline" placeholder="元素名称" v-model="selectForm.name">
            <button type="button" class="btn btn-success" @click="_querySearch">查询</button>
        </div>
        <div class="table-scrollable">
            <el-table :data="tableData">
                <!--<el-table-column type="selection" width="50"></el-table-column>-->
                <el-table-column prop="brandOrder" sortable label="排序" width="80" align="center"> </el-table-column>
                <el-table-column prop="brandName" label="品牌名称"> </el-table-column>
                <el-table-column prop="homeBanner" label="首页品牌图" width="120" align="center">
                    <template slot-scope="scope">
                        <img :src="scope.row.homeBanner" class="brand-img" width="100%" height="100%" />
                    </template>
                </el-table-column>
                <!--<el-table-column prop="detailBanner" label="详情品牌图" width="280" align="center">
                    <template slot-scope="scope">
                        <img :src="scope.row.detailBanner" class="brand-img" />
                    </template>
                </el-table-column>-->
                <el-table-column prop="createUser" label="创建人" align="center"> </el-table-column>
                <el-table-column prop="createTime" label="创建时间" align="center">
                    <template slot-scope="scope">
                        {{formatDate(scope.row.createTime, 'time')}}
                    </template>
                </el-table-column>
                <el-table-column prop="isView" label="是否显示" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.state==1"> 显示 </span>
                        <span v-else-if="scope.row.state==0"> 不显示 </span>
                        <span v-else></span>
                    </template>
                </el-table-column>
                <el-table-column prop="" label="操作" width="80">
                    <template slot-scope="scope">
                        <span class="btn default btn-xs purple" @click=" selectedGoods(scope.row) "> 选择 </span>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination layout="prev, pager, next" v-if="page.total > page.size" :page-size="page.size" :current-page="page.current" :total="page.total" v-on:current-change=" _handlePaging "></el-pagination>
        </div>
	</el-dialog>
</template>
<script>
export default {
    name: 'floorEdit',
    data() {
        return {
            tableData: [],
            page: { total: 0, current: 1, size: 10 },
            selectForm: { name: '' },
            delectBrand: [],
            modelShow: false,
        }
    },
    watch: {
        visible: function(val, oldVal) {
            this.modelShow = val;
            this.selectForm = {
                name: ''
            };
            this._selectData(null);
        },
        modelShow: function(val, oldVal) {
            this.$emit('visible', val)
        }
    },
    props: {
        visible: Boolean
    },
    mounted() {
    	this.$nextTick(function() {
    		this._selectData();
    	})
    },
    methods: {
        // 查询列表数据
        _selectData() {
            var _that = this,
                _params = { token: this.token, pageNum: this.page.current, pageSize: this.page.size }
            if (this.selectForm.name != '') {
                _params.brandName = this.selectForm.name;
            }
            this.$http.get(this.baseUrl + '/brand/findBrands', {
                params: _params
            }).then(function(res) {
                if (!res) { return }
                _that.tableData = res.orderList;
                _that.page = { total: res.total, size: res.pageSize, current: res.pageNum };
            }).catch(function(error) {
                // console.log("%c 品牌 => 查询数据 %c " + error, "color:green", 'color:red');
            });
        },
        //模糊搜索
        _querySearch() {
        	this.page.current = 1;
        	this._selectData();
        },
        // 分页查询
        _handlePaging(_current) {
            this.page.current = _current;
            this._selectData();
        },
        // 选择 商品列表, 传给父级
        selectedGoods(item) {
            this.modelShow = false;
            this.$emit('getList', item)
        },
    }
}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style scoped>
@import url("../home/css/dialog.css");
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

</style>
