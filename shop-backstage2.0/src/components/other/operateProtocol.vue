<!-- 操作协议（添加/编辑） -->
<template>
    <div id="protocol">
    	<v-breadcrumb firstMenu="其他" secondMenu="商城协议" thirdMenu="管理商城协议"></v-breadcrumb>
    	<div class="row">
    		<div class="col-md-12">
    			<div class="portlet box red">
					<div class="portlet-title">
						<div class="caption">管理商城协议</div>
						<!--<div class="tools">
							<a href="#" class="reload" data-original-title="" title=""></a>
						</div>-->
					</div>
					<div class="portlet-body">
						<div class="form-horizontal">
							<div class="form-group">
								<label for="title" class="col-md-3 control-label">协议标题:</label>
								<div class="col-md-6">
									<input type="text" class="form-control" v-model="protocolObj.protocol_name" />
								</div>
							</div>
							<div class="form-group">
								<label for="title" class="col-md-3 control-label">排序:</label>
								<div class="col-md-5">
									<input type="number" class="form-control input-small input-inline" v-model="protocolObj.sort"/>
								</div>
							</div>
							<div class="form-group">
								<label for="title" class="col-md-3 control-label">是否显示:</label>
								<div class="col-md-5">
									<el-radio-group v-model="protocolObj.is_show">
										<el-radio label="1">显示</el-radio>
										<el-radio label="0">不显示</el-radio>
									</el-radio-group>
								</div>
							</div>
							<div class="form-group">
								<label for="title" class="col-md-3 control-label">类型:</label>
								<div class="col-md-5">
									<select class="form-control input-small input-inline" v-model="protocolObj.type">
										<option :value="item.dicKey" v-for="item in protoTypeList">{{item.dicValue}}</option>
									</select>	
								</div>
							</div>
							<div class="form-group">
	                            <label class="col-md-3 control-label" for="title">协议内容：</label>
	                            <div class="col-md-9">
	                            	<div id="editor"></div>
	                            	<!--<div class="operate ta-right">
	                            		<button type="button" class="btn btn-primary" @click="submitContent">保存发布</button>
	                            		<button type="button" class="btn default" @click="clearEdit">清空内容</button>
	                            	</div>-->
	                            </div>
	                        </div>
						</div>
						<div class="operate ta-center">
							<button type="button" class="btn btn-success" @click="handleSave">确定</button>
							<button type="button" class="btn default" @click="$router.push('/protocol')">取消</button>
						</div>
					</div>
				</div>
    		</div>
    	</div>
    </div>
</template>
<script>
import breadcrumb from '@/components/tool/breadcrumb' //面包屑
import E from 'wangeditor'

export default {
    name: 'protocol',
   	components: {
    	'v-breadcrumb': breadcrumb
	},
    data() {
        return {
        	editor: null,//富文本编辑器
        	editContent: '',//富文本内容
        	uploadImgUrl: this.baseUrl + '/productBusi/uploadRichPics',//上传图片接口
        	imgNum: 0,
        	protoId: '',//修改时的协议id
        	protocolObj: {'is_show': '1', 'type': '1', 'content': null},//修改时协议对象
        	protoTypeList: [],//协议类型数据
        }
    },
    mounted() {
        this.$nextTick(function() {
        	this.initEditor();
        	this.getProtoType();
        	
        	var protoId =  this.$route.query.id;
        	if(protoId != undefined) { //修改
        		this.protoId = protoId;
        		this.getDetail();//获取协议详情
        	} 
        });
    },
    methods: {
    	//编辑器初始化
    	initEditor: function() {
	    	this.editor = new E('#editor');
		    this.editor.customConfig.onchange = (html) => {
				this.protocolObj.content = html;
		    }
		    this.editor.customConfig.uploadImgServer = this.uploadImgUrl; //此接口不行  
		    this.editor.customConfig.uploadImgParams = {
			    token: this.token  // 属性值会自动进行 encode ，此处无需 encode
			}
		    this.editor.customConfig.uploadImgParamsWithUrl = true;
		    this.editor.customConfig.uploadFileName = 'files';
		    var that = this;
		    this.editor.customConfig.uploadImgHooks = {
		    	customInsert: function (insertImg, result, editor) {
		    		if(result.data == null) {
		    			that.$message(result.resultInfo.description);
		    			return;
		    		}
		        	var url = result.data.richImgs[0].picUrl;
		        	insertImg(url);
			    }
		    }
		    this.editor.create();
	    },
		clearEdit: function() {
			this.editor.txt.clear();
		},
		//获取单个协议详情
		getDetail: function() {
			var that = this;
			var reqUrl = this.baseUrl + '/protocol/select';
			var params = {
				protocolID : this.protoId
			}
			this.$http.get(reqUrl, {params: params}).then(function(res) {
				if(!res) {
					return;
				}
				that.protocolObj = res.list[0];
				that.editor.txt.html(that.protocolObj.content);
   			});
		},
		//保存协议信息
		handleSave: function() {
			if(!this.protocolObj.protocol_name){
				this.$message({
		          	message: '协议标题不能为空!',
		          	type: 'warning'
		        });
		        return;
			}
			if(!this.protocolObj.sort){
				this.$message({
		          	message: '排序不能为空!',
		          	type: 'warning'
		        });
		        return;
			}
			if(this.protocolObj.content == null && this.protocolObj.content == ''){
				this.$message({
		          	message: '协议内容不能为空!',
		          	type: 'warning'
		        });
		        return;
			}
			var that = this;
			var params = {
				protocolName: this.protocolObj.protocol_name,
				sort: this.protocolObj.sort,
				isShow: this.protocolObj.is_show,
				type: this.protocolObj.type
			}
			params.content = this.protocolObj.content.replace(/\%/g, "%25");
			
			var formData = new FormData();
    		formData.append('protocolName', params.protocolName);
    		formData.append('sort', params.sort);
    		formData.append('isShow', params.isShow);
    		formData.append('type', params.type);
    		formData.append('content', params.content);
			
			var reqUrl;
			if(this.protoId != '') { //修改
				params.protocolID = this.protocolObj.protocol_id;
				params.updateBy = this.userInfo.realname;
				
				formData.append('protocolID', params.protocolID);
				formData.append('updateBy', params.updateBy);
				
				reqUrl = this.baseUrl + '/protocol/alter';
			} else {
				params.createBy = this.userInfo.realname;
				
				formData.append('createBy', params.createBy);
				
				reqUrl = this.baseUrl + '/protocol/add';
			}
			this.$http.post(reqUrl, {formData: formData}).then(function(res) {
				if(!res) {
					return;
				}
				that.$message('保存成功');
				that.$router.push('/protocol');
   			});
		},
		//获取协议类型
		getProtoType: function() {
			var that = this;
			var params = {
				dicType: 'PROTOCOL_TYPE'
			}
			var reqUrl= this.baseUrl + '/sys/dic/findDic';
			this.$http.get(reqUrl, {params: params}).then(function(res) {
				if(!res) {
					return;
				}
				that.protoTypeList = res.activityInfo;
   			});
		}
	}
}
</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style scoped>
#editor {
	width: 100%;
	height: 330px;
}
#protocol .form-horizontal .form-group > * {
	margin-bottom: 10px;
}
</style>
