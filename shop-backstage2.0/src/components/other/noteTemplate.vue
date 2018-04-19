<!-- 短信模板 -->
<template>
	<div class="noteTemplate">
		<v-breadcrumb firstMenu="其他" secondMenu="短信模板"></v-breadcrumb>
		<div class="nav row">
			<div class="col-md-12">
				<div class="portlet box red">
					<div class="portlet-title">
						<div class="caption">短信模板</div>
					</div>
					<div class="portlet-body">
						<div class="table-scrollable">
							<el-table :data="tableData"><!--  @selection-change="handleSelection" -->
								<el-table-column prop="id" label="编号" width="100"> </el-table-column>
								<el-table-column prop="title" label="功能/用途/标题" width="300"> </el-table-column>
								<el-table-column prop="content" label="文案描述"> </el-table-column>
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
		name: 'noteTemplate',
		components: {
			'v-breadcrumb': breadcrumb
		},
		data() {
			return {
				tableData: [{
					'id': 1,
					'title': '功能/用途/标题',
					'content': '想要钱人民币 一切的一切都得靠你自己 我外婆都告诉我说这一条真理 因为爹地妈咪除了生命没东西给你 看我快乐的点着 我说哈利路亚'
				}],
			}
		},
		mounted() {
			this.$nextTick(function() {

			});
		},
		methods: {
			handlePictureCardPreview: function() {

			},
		}
	}
</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style scoped>
	@import url("../home/css/dialog.css");
</style>