<!-- 协议配置 -->
<template>
    <div class="protocol">
    	<v-breadcrumb firstMenu="其他" secondMenu="商城协议"></v-breadcrumb>
    	<div class="nav row">
    		<div class="col-md-12">
    			<div class="portlet box red">
					<div class="portlet-title">
						<div class="caption">商城协议列表</div>
						<!--<div class="tools">
							<a href="#" class="reload" data-original-title="" title=""></a>
						</div>-->
					</div>
					<div class="portlet-body">
						<div class="operate">
							<button type="button" class="btn btn-primary" @click="handleProtocol">添加</button>
							<!--<button type="button" class="btn btn-danger">批量删除</button>-->
						</div>
						<div class="table-scrollable">
							<el-table :data="tableData"  @selection-change="handleSelection">
							    <!--<el-table-column type="selection" prop="" width="50"></el-table-column>-->
							    <el-table-column prop="protocol_id" label="协议编号"> </el-table-column>
							    <el-table-column prop="protocol_name" label="协议名称"> </el-table-column>
							    <el-table-column prop="sort" label="排序"> </el-table-column>
							    <el-table-column prop="create_time" label="创建时间"> </el-table-column>
							    <el-table-column prop="create_by" label="创建人"> </el-table-column>
							    <el-table-column prop="" label="是否显示">
							    	<template slot-scope="scope">
							    		<span v-if="scope.row.is_show == 1">显示</span>
							    		<span v-if="scope.row.is_show == 0">不显示</span>
							    	</template>
							    </el-table-column>
							    <el-table-column prop="" label="操作" width="200">
							    	<template slot-scope="scope">
							    		<span class="btn default btn-xs purple"  @click="handleProtocol(scope.row)">修改 </span>
										<span class="btn default btn-xs red" @click="handleDel(scope.row.protocol_id)">删除</span>
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
import breadcrumb from '@/components/tool/breadcrumb' //面包屑

export default {
    name: 'protocol',
   	components: {
    	'v-breadcrumb': breadcrumb
	},
    data() {
        return {
        	tableData: []
        }
    },
    mounted() {
        this.$nextTick(function() {
        	this.getAllProtocol();
        });
    },
    methods: {
    	//获取所有协议
    	getAllProtocol: function() {
    		var that = this;
			var reqUrl = this.baseUrl + '/protocol/selectList';
			var params = {
				token: this.token
			};
			this.$http.get(reqUrl, {params: params}).then(function(res) {
				if(!res) {
					return;
				}
				that.tableData = res.protocolList;
				for(var i = 0;i < that.tableData.length;i++) {
					that.tableData[i].create_time = that.formatDate(that.tableData[i].create_time, 'dateTime');
				}
   			});
    	},
    	handleSelection: function(val) {
    		
    	},
    	//商城协议编辑或添加
    	handleProtocol: function(item) {
    		var query = {};
    		if(item.protocol_id != null) {
    			query.id = item.protocol_id;
    		}
    		this.$router.push({
				query: query,
    			path: '/operateProtocol'
    		})
    	},
    	//商城协议删除
    	handleDel: function(_id) {
    		var that = this;
    		this.$confirm('确认删除吗？').then(function() {
    			var reqUrl = that.baseUrl + '/protocol/delete';
				var params = {
					token: that.token,
					protocolID: _id
				};
				that.$http.post(reqUrl, params).then(function(res) {
					if(!res) {
						return;
					}
					that.$message({
			          	message: '删除成功',
			          	type: 'success'
			        });
			        that.getAllProtocol();
	   			});
    		})
    	}
    }
}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style scoped>

</style>
