<!-- 商品分类同步 -->
<template>
    <div id="synchroClassify">
    	<v-breadcrumb firstMenu="商品" secondMenu="商品分类"></v-breadcrumb>
    	<div class="nav row">
    		<div class="col-md-12">
    			<div class="portlet box red">
					<div class="portlet-title">
						<div class="caption">商品分类同步一级列表</div>
					</div>
					<div class="portlet-body">
						<div class="operate">
							<!--<button type="button" class="btn btn-primary" @click="handleLotSynchro">
								全部同步
							</button>-->
						</div>
						<div class="table-scrollable">
							<el-table :data="classifyDemo" style="width: 100%">
								<el-table-column type="expand">
									<template slot-scope="props">
										<el-form label-position="left" class="demo-table-expand">
											<el-form-item v-for="item,index in props.row.children" :key="index">
												<div class="col-md-6"> {{item.ClassName}} </div>
												<div class="col-md-6">
													<span class="btn default btn-xs btn-primary" v-if="item.isSyn == 1" @click="handleRenew(item)">更新</span>
													<span class="btn default btn-xs purple" v-if="item.isSyn == 2" @click="handleSynchro(item)">同步</span>
												</div>
											</el-form-item>
										</el-form>
									</template>
								</el-table-column>
								<!--<el-table-column label="商品 ID" prop="Class_N_Id" width="150"></el-table-column>-->
								<el-table-column label="分类列表" prop="ClassName"></el-table-column>
								<el-table-column label="操作" prop="">
									<template slot-scope="scope">
										<span class="btn default btn-xs btn-primary" v-if="scope.row.isSyn == 1" @click="handleRenew(scope.row)">更新</span>
										<span class="btn default btn-xs purple" v-if="scope.row.isSyn == 2" @click="handleSynchro(scope.row)">同步</span>
									</template>
								</el-table-column>
							</el-table>
						</div>
					</div>
    			</div>
    		</div>
    	</div>
    </div>
</template>
<script>
import breadcrumb from '@/components/tool/breadcrumb'	//面包屑	

export default {
    name: 'classify',
  	components: {
    	'v-breadcrumb': breadcrumb
	},
    data() {
        return {
			dialogTitle: '添加',
        	isView: '1',
			classifyDemo: [],
		}
	},
	mounted() {
			this.$nextTick(function() {
	    		this.getAllClassify();
			});
		},
	methods: {
		//获取所有分类
		getAllClassify: function() {
			this.classifyDemo = [];
			var that = this;
			var reqUrl = this.baseUrl + '/productType/getTypes';
			var params = {
				token: this.token,
				//还差参数
			}
			this.$http.get(reqUrl, {params: params}).then(function(res) {
				if(!res) {
					return;
				}
				that.getOneClassify(res.Result);
   			});
		},
		//生成分类
		getOneClassify: function (_arr) {
			for(var i = 0;i<_arr.length;i++){
				if(_arr[i].Class_N == 1){
					_arr[i].children = [];
					this.classifyDemo.push(_arr[i]);
				}
			}
			var classifyDemo = this.classifyDemo;
			for(var i = 0;i<classifyDemo.length;i++){
				for(var j = 0;j<_arr.length;j++){
					if(_arr[j].Class_N == 2){
						if(classifyDemo[i].ClassId ==_arr[j].Class_N_Id){
							classifyDemo[i].children.push(_arr[j]);
						}
					}
				}
			}
		},
		//全部同步
//		handleLotSynchro: function() {
//			var that = this;
//			var reqUrl = this.baseUrl + '/productBusi/synchronizeProClass';
//			var params = {
//				token: that.token,
//			}
//			this.$http.post(reqUrl, params).then(function(res) {
//				if(!res) {
//					return;
//				}
//				that.$message({
//		          	message: '同步成功',
//		          	type: 'success'
//			    });
// 			});
//		},
		//更新分类
    	handleRenew: function(item) {
    		var that = this;
			var reqUrl = this.baseUrl + '/productBusi/synUpdWqbProClass';
			var params = {
				wqbTypeId: item.ClassId //网渠宝商品分类ID
			}
			this.$http.post(reqUrl, params).then(function(res) {
				if(!res) {
					return;
				}
				that.$message({
		          	message: '更新成功',
		          	type: 'success'
		        });
		        that.getAllClassify();
   			});
    	},
    	//同步分类
    	handleSynchro: function(item) {
    		var that = this;
			var reqUrl = this.baseUrl + '/productBusi/synchronizeProClass';
			var params = {
				wqbClassId: item.ClassId //网渠宝商品分类ID
			}
			this.$http.post(reqUrl, params).then(function(res) {
				if(!res) {
					return;
				}
				that.$message({
		          	message: '同步成功',
		          	type: 'success'
		        });
		        that.getAllClassify();
   			});
    	}
	}
}
</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style scoped>
@import url("../home/css/dialog.css");
.goods-img  {
	width: 100px;
	height: 50px;
}
.text-link:hover {
	color: #cb5a5e;
	text-decoration: underline;
	cursor: pointer;
}
</style>
