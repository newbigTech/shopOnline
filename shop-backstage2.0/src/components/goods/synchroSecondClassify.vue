<!-- 商品分类同步管理 - 二级分类 -->
<template>
    <div class="synchroSecondClassify">
    	<v-breadcrumb firstMenu="商品" secondMenu="商品同步分类" thirdMenu="二级分类"></v-breadcrumb>
    	<div class="nav row">
    		<div class="col-md-12">
    			<div class="portlet box red">
					<div class="portlet-title">
						<div class="caption">商品分类同步二级列表</div>
					</div>
					<div class="portlet-body">
						<div class="operate">
							<button type="button" class="btn btn-primary" @click="handleBatchSynchro">
								批量同步
							</button>
						</div>
						<div class="table-scrollable">
							<el-table :data="twoClassifyData"  @selection-change="handleSelection">
							    <el-table-column type="selection" prop="" width="50"></el-table-column>
							    <el-table-column prop="ClassName" label="二级分类名称"></el-table-column>
							    <el-table-column label="操作" width="150">
							    	<template slot-scope="scope">
										<span class="btn default btn-xs purple" @click="handleOnlySynchro()">同步</span>
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
//      	tableData: [
//      		{'name': '二级分类1', 'isView': true, 'img': '../static/img/img01.png','isView2': true}
//      	],
//      	dialogTitle: '添加',
//      	isView: '1',
			id: null,
        	classifyDemo: [],
			twoClassifyData: []
        }
    },
    mounted() {
        this.$nextTick(function() {
        	this.id = this.$route.query.id;
        	this.getAllClassify();
        });
    },
    methods: {
    	getAllClassify: function() {
			var that = this;
			var reqUrl = this.baseUrl + '/productType/getTypes';
			var params = {
				token: this.token,
			}
			this.$http.get(reqUrl, {params: params}).then(function(res) {
				if(!res) {
					return;
				}
				that.classifyDemo = res.Result;
				that.getTwoClassify();
   			});
		},
		//获取二级分类
    	getTwoClassify: function() {
    		var dataArr = [];
    		var twoClassify = this.classifyDemo;
    		for(var i = 0;i<twoClassify.length;i++) {
				if(twoClassify[i].Class_N == 2){
	    			if(twoClassify[i].Class_N_Id == this.id){
	    				dataArr.push(twoClassify[i]);
					}
    			}
    		}
    		this.twoClassifyData = dataArr;
    	},
    	//二级分类单个同步
    	handleOnlySynchro: function() {
    		
    	},
    	//多选
    	handleSelection: function (_selection) {
    		console.log(_selection);
    	},
    	//二级分类批量同步
    	handleBatchSynchro: function() {
    		
    	},
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
