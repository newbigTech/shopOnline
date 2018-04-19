<!-- 轮播图管理 -->
<template>
    <div class="banner">
        <v-breadcrumb firstMenu="首页" secondMenu="轮播图"></v-breadcrumb>
        <div class="nav row">
            <div class="col-md-12">
                <div class="portlet box red">
                    <div class="portlet-title">
                        <div class="caption">首页轮播图列表信息</div>
                    </div>
                    <div class="portlet-body">
                        <div class="operate">
                            <form class="form-inline">
                                <div class="form-group">
                                    <span>名称：</span>
                                    <div class="input-medium input-inline">
                                        <el-input placeholder="请输入名称" v-model=" bannerTitle " clearable> </el-input>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <span>状态：</span>
                                    <select class="form-control input-small input-inline" v-model="bannerIsShow">
                                        <option value="">全部</option>
                                        <option value="0">不显示</option>
                                        <option value="1">显示</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <span>显示位置：</span>
                                    <select class="form-control input-small input-inline" v-model="showLocation">
                                        <option value="">全部</option>
                                        <option value="1">首页banner</option>
                                        <option value="2">升级专区banner</option>
                                        <option value="3">增值专区banner</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <button type="button" class="btn btn-primary" @click="handleFind">查询</button>
                                </div>
                            </form>
                        </div>
                        <div class="operate">
                            <button type="button" class="btn btn-primary" @click="handleManage">添加</button>
                            <button type="button" class="btn btn-danger" @click="handleDeleteMany">批量删除</button>
                        </div>
                        <div class="table-scrollable">
                            <el-table :data="tableData" @selection-change="handleSelection">
                                <el-table-column type="selection" prop="" width="50"></el-table-column>
                                <el-table-column prop="sortCode" label="排序" width="80" align="center" sortable> </el-table-column>
                                <el-table-column prop="title" label="名称"> </el-table-column>
                                <el-table-column prop="" label="图片" width="120">
                                    <template slot-scope="scope">
                                        <img :src="scope.row.broadcastingImageUrl" class="goods-img" />
                                    </template>
                                </el-table-column>
                                <el-table-column prop="interlinkage" label="链接"> </el-table-column>
                                <el-table-column prop="createTime" label="创建时间" sortable> </el-table-column>
                                <el-table-column prop="publishUser" label="创建人"> </el-table-column>
                                <el-table-column prop="isView" label="是否显示">
                                    <template slot-scope="scope">
                                        <span v-if="scope.row.isShow == 0">不显示</span>
                                        <span v-if="scope.row.isShow == 1">显示</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="showLocation" label="显示位置">
                                    <template slot-scope="scope">
                                        <span v-if="scope.row.showLocation == 1">首页banner</span>
                                        <span v-if="scope.row.showLocation == 2">升级专区banner</span>
                                        <span v-if="scope.row.showLocation == 3">增值专区banner</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="bannerTypeId" label="类型">
                                    <template slot-scope="scope">
                                        <span v-if="scope.row.bannerTypeId == 1">普通</span>
                                        <span v-if="scope.row.bannerTypeId == 2">品牌</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="" label="操作">
                                    <template slot-scope="scope">
                                        <span class="btn default btn-xs purple" @click="handleManage(scope.row)">修改 </span>
                                        <span class="btn default btn-xs red" @click="handleDelete(scope.row)">删除</span>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <el-pagination layout="prev, pager, next" v-if="total > pageSize" :page-size="pageSize" :current-page="currentPage" :total="total" v-on:current-change="handlePaging"></el-pagination>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import breadcrumb from '@/components/tool/breadcrumb' //面包屑     

export default {
    name: 'banner',
    components: {
        'v-breadcrumb': breadcrumb
    },
    data() {
        return {
            tableData: [],
            currentPage: 1,
            total: 0,
            bannerTitle: '',
            bannerIsShow: '',
            showLocation: '',
            bannerIdArrays: '', //选中的banner
            bannerIdArraysLen: 0,
        }
    },
    mounted() {
        this.$nextTick(function() {
            this.getBannerList();
        });
    },
    methods: {
        //选中行
        handleSelection: function(val) {
            this.bannerIdArrays = '';
            this.bannerIdArraysLen = val.length;
            if (val.length > 0) {
                for (var i = 0; i < val.length; i++) {
                    if (i == 0) { this.bannerIdArrays = val[0].broadcastingId } else { this.bannerIdArrays = this.bannerIdArrays + ',' + val[i].broadcastingId }
                }
            }
        },
        // 获取Banner列表数据
        getBannerList: function() {
            var _that = this;
            this.$http.get(this.baseUrl + '/bannerInfo/pageList', {
                params: {
                    token: this.token,
                    pageSize: this.pageSize,
                    currentPage: this.currentPage,
                    bannerTitle: this.bannerTitle != '' ? this.bannerTitle : null,
                    bannerIsShow: this.bannerIsShow != '' ? this.bannerIsShow : null,
                    showLocation: this.showLocation != '' ? this.showLocation : null //显示位置(1:商城首页 2：促销专区 3：增值专区)
                }
            }).then(function(res) {
                if (!res) { return }
//              console.log(res);
                _that.tableData = res.bannerList;
                _that.total = res.bannerCount;
            });
        },
        // 翻页
        handlePaging: function(currentPage) {
            this.currentPage = currentPage;
            this.getBannerList();
        },
        // 模糊搜索
        handleFind: function() {
            this.currentPage = 1;
            this.getBannerList();
        },
        // 添加/修改Banner 
        handleManage: function(item) {
            var query = {};
            if (item.broadcastingId != null) {
                query.bannerId = item.broadcastingId;
            }
            this.$router.push({
                query: query,
                path: '/operateBanner'
            })
        },
        // 删除单个Banner
        handleDelete: function(item) {
            var that = this;
            this.$confirm('确认删除吗').then(function() {
                that.$http.post(that.baseUrl + '/bannerBusi/del', {
                    token: that.token,
                    bannerId: item.broadcastingId,
                }).then(function(res) {
                    if (!res) { return }
                    if (!res.isDelBanner) { return that.$message('删除失败') }
                    that.$message('删除成功');
                    that.total--;
                    var maxPage = Math.ceil(that.total / that.pageSize);
                    if (that.total <= (that.currentPage * that.pageSize) && that.currentPage > maxPage && that.currentPage > 1) {
                        that.currentPage--;
                    }
                    that.getBannerList();
                });
            })
        },
        // 批量删除
        handleDeleteMany: function() {
            if (this.bannerIdArrays == '') { return this.$message('请选择删除项') }
            var that = this;
            this.$confirm('确认删除吗').then(function() {
                that.$http.post(that.baseUrl + '/bannerBusi/batchDel', {
                    token: that.token,
                    bannerIdArrays: that.bannerIdArrays,
                }).then(function(res) {
                    if (!res) { return }
                    if (!res.isBatchDelBanner) { return that.$message('删除失败') }
                    that.$message('删除成功');
                    that.total = that.total - that.bannerIdArraysLen;
                    var maxPage = Math.ceil(that.total / that.pageSize);
                    if (that.total <= (that.currentPage * that.pageSize) && that.currentPage > maxPage && that.currentPage > 1) {
                        that.currentPage--;
                    }
                    that.getBannerList();
                });
            })
        }
    }
}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style scoped>
.goods-img {
    width: 100px;
    height: 50px;
}

</style>
