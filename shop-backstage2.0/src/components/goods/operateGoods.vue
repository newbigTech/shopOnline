<!-- 添加商品 -->
<template>
    <div class="goods">
        <v-breadcrumb firstMenu="商品" secondMenu="商品管理" thirdMenu="添加商品"></v-breadcrumb>
        <div class="nav row">
            <div class="col-md-12">
                <div class="portlet box red">
                    <div class="portlet-title">
                        <div class="caption">添加商品</div>
                    </div>
                    <div class="portlet-body">
                        <div class="form-horizontal">
                            <div class="form-group">
                                <label class="col-md-3 control-label" for="title"><b class="text-red">*</b>商品标题：</label>
                                <div class="col-md-5">
                                    <input type="text" class="form-control" v-model="title" @input="txtLength('title','titleLength')" placeholder="" maxlength="50">
                                </div>
                                <div class="col-md-2 u-text-num">
                                    <span>{{ titleLength }}/60</span>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-md-3 control-label" for="title"><b class="text-red">*</b>商品副标题：</label>
                                <div class="col-md-5">
                                    <textarea class="textarea-common" v-model="subTitle" @input="txtLength('subTitle','subTitleLength')" placeholder="" maxlength="150"></textarea>
                                </div>
                                <div class="col-md-2 u-text-num">
                                    <span>{{ subTitleLength }}/150</span>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-md-3 control-label" for="title"><b class="text-red">*</b>分类：</label>
                                <div class="col-md-5">
                                    <select class="form-control input-small input-inline" v-model="oneClassify">
                                        <option value="left">选择分类</option>
                                    </select>
                                    <select class="form-control input-small input-inline" v-model="twoClassify">
                                        <option value="left">选择分类</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-md-3 control-label" for="title"><b class="text-red">*</b>价格（原价）：</label>
                                <div class="col-md-5">
                                    <input type="text" class="form-control input-small input-inline" placeholder="" v-model="primeCost">
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-md-3 control-label" for="title">价格（销售价）：</label>
                                <div class="col-md-5">
                                    <input type="text" class="form-control input-small input-inline" placeholder="" v-model="price">
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-md-3 control-label" for="title"><b class="text-red">*</b>赠送积分比例：</label>
                                <div class="col-md-5">
                                    <input type="text" class="form-control input-small input-inline" placeholder="" v-model="giveRatio">%
                                </div>
                            </div>
                            <div class="form-group u-form-mb">
                                <label class="col-md-3 control-label" for="title"><b class="text-red">*</b>商品属性：</label>
                                <div class="col-md-9">
                                    <input type="text" class="form-control input-small input-inline u-attrName" v-model="attr.val" v-for="attr, index in attrs" placeholder="请输入属性名">
                                    <button type="button" class="btn btn-primary" @click="addGoodVal()">添加</button>
                                    <button type="button" class="btn btn-danger" @click="delGoodVal()">删除</button>
                                    <button type="button" class="btn btn-primary" @click="addGoodAttr(true)">增加属性</button>
                                    <button type="button" class="btn btn-warning" @click="delGoodAttr">删除属性</button>
                                </div>
                            </div>
                            <div class="form-group" v-if="itemLists.length > 0">
                                <label class="col-md-3 control-label" for="title"></label>
                                <div class="col-md-8">
                                    <table class="table table-bordered table-hover u-table-input">
                                        <thead>
                                        	<tr>
                                        		<th v-for="attr, index in attrs" :key="index">{{ attr.val }}</th>
                                        		<th>价格</th>
                                        		<th>库存</th>
                                        	</tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="item, index in itemLists" :key="index">
                                                <td v-for="attr, index in item" :key="index">
                                                    <input type="text" name="" v-model="attr.val">
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <!-- <div class="form-group u-form-mb" v-for="item,index in itemLists" v-if="item.default === 0">
                                <label class="col-md-3 control-label" for="title"><b class="text-red">*</b>商品属性：</label>
                                <div class="col-md-9">
                                    <input type="text" class="form-control input-small input-inline u-attrName" placeholder="请输入属性名" v-model="item.attrName">
                                    <input type="text" class="form-control input-small input-inline u-attrVal" placeholder="请输入属性值" v-model="item.attrVal">
                                    <input type="text" class="form-control input-small input-inline u-attrVal" placeholder="请输入属性值" v-if="item.addAttrList.length!=0" v-for="addList,index in item.addAttrList" v-model="addList.attrVal">
                                    <button type="button" class="btn btn-primary" @click="handleAddGoodsVal(item)">添加</button>
                                    <button type="button" class="btn btn-danger" @click="handleDelGoodsVal(item)">删除</button>
                                    <button type="button" class="btn btn-primary" @click="handleAddGoodsAttr(item)">增加属性</button>
                                    <button type="button" class="btn btn-warning" @click="handleMake">生成表格</button>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-md-3 control-label" for="title"></label>
                                <div class="col-md-8">
                                    <table class="table table-bordered table-hover u-table-input">
                                        <thead>
                                            <tr><th v-for="item in (propertyList.property)">{{item}}</th></tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(item, $index) in (propertyList.valData)">
                                                <td>{{item.color}}</td>
                                                <td>{{item.size}}</td>
                                                <td>{{item.stock}}</td>
                                                <td>{{item.prize}}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div> -->
                            <div class="form-group">
                                <label class="col-md-3 control-label" for="title">总库存：</label>
                                <div class="col-md-5">
                                    <input type="text" class="form-control input-small input-inline" placeholder="" v-model="totalStock">
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-md-3 control-label" for="title">商品状态：</label>
                                <div class="col-md-5">
                                    <el-radio-group v-model="goodsStatus">
                                        <el-radio :label="1">上架</el-radio>
                                        <el-radio :label="2">售罄</el-radio>
                                        <el-radio :label="3">下架</el-radio>
                                    </el-radio-group>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-md-3 control-label" for="title">商品图片：</label>
                                <div class="col-md-9">
                                    <p class="u-goods-img">商品图片大小不能超过3MB；<span class="text-red"> 700×700 </span>以上图片上传后自动提供放大镜功能。</p>
                                    <el-upload action="https://jsonplaceholder.typicode.com/posts/" list-type="picture-card" 
                                    	:on-preview="handlePictureCardPreview" 
                                    	:on-remove="handleRemove" 
                                    	:on-success="handleSuccess"
                                    	:before-upload="beforeAvatarUpload"
                                    	:limit="10"
                                    	:on-exceed="handleExceed">
                                        <i class="el-icon-plus"></i>
                                    </el-upload>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-md-3 control-label" for="title">详情图片：</label>
                                <div class="col-md-9">
                                    <div id="editor" style="z-index: 2000!important;"></div>
                                    <div class="operate ta-right">
                                        <span>内容正文每5分钟自动保存一次。</span>
                                        <button type="button" class="btn btn-primary">立即保存</button>
                                        <button type="button" class="btn default"> 恢复编辑历史</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="operate ta-center">
                            <button type="button" class="btn btn-success">保存</button>
                            <button type="button" class="btn default">取消</button>
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
    name: 'goods',
    components: {
        'v-breadcrumb': breadcrumb
    },
    data() {
        return {
            title: null, //标题
            titleLength: 0, //标题长度
            subTitle: null, //副标题
            subTitleLength: 0, //副标题长度
            itemLists: [],
            attrs: [{ val: null }],
            oneClassify: "left",//一级分类
           	twoClassify: "left",//二级分类
            primeCost: null,//价格(原价)
            price: null,//销售价
            giveRatio: null,//赠送比例
            totalStock: null,//总库存
            goodsStatus: 1, //商品状态
            dialogImageUrl: '',//上传图片路径
        	dialogVisible: false,
            // itemLists: [{
            //         'default': 0,
            //         'attrName': '颜色',
            //         'attrVal': '黄色',
            //         'addAttrList': [
            //             { 'attrVal': '白色' },
            //             { 'attrVal': '蓝色' },
            //         ]
            //     },
            //     {
            //         'attrName': '尺寸',
            //         'attrVal': 'M',
            //         'addAttrList': [
            //             { 'attrVal': 'L' },
            //             { 'attrVal': 'N' },
            //         ]
            //     },
            // ],
            
            tableData: [
               	{
                   'id': 1,
                   'num': '998',
                   'name': '协议1',
                   'img': '../static/img/img01.png',
                   'sort': '1',
                   'time': '2017-13-23 05:20:20',
                   'stock': 135,
                   'person': 'xxx',
                   'isView': '显示'
               	}
            ],

            // propertyList: {
            //     'property': ['颜色', '尺码', '库存数量', '价格'],
            //     'valData': [
            //         { 'color': '黄色', 'size': 'L', 'stock': 153, 'prize': 85.00 },
            //         { 'color': '黄色', 'size': 'M', 'stock': 126, 'prize': 85.00 },
            //         { 'color': '红色', 'size': 'L', 'stock': 22, 'prize': 85.00 },
            //         { 'color': '红色', 'size': 'M', 'stock': 36, 'prize': 85.00 },
            //         { 'color': '黑色', 'size': 'L', 'stock': 13, 'prize': 85.00 },
            //         { 'color': '黑色', 'size': 'M', 'stock': 58, 'prize': 85.00 }
            //     ]
            // },
            //商品属性数组
        }
    },
    mounted() {
        this.$nextTick(function() {
            this.initEditor();
        });
    },
    methods: {
        //增加属性值
        addGoodVal () {
//          this.itemLists = [];
            this.attrs.push({ val: null });
        },
        //删除属性值
        delGoodVal () {
//          this.itemLists = [];
            if ( this.attrs.length == 1 ) { return }
            this.attrs.splice( this.attrs.length -1, 1);
        },
        //增加商品属性
        addGoodAttr (_flag) {
//          if (_flag) { this.itemLists = [] }
            var _arr = []
            for (var i = 0; i < this.attrs.length+2; i++) { _arr.push({ val: null }) } 
            this.itemLists.push(_arr);
             console.log(
                '商品属性 数组:' + JSON.stringify(this.attrs),
                '商品属性 表格:' + JSON.stringify(this.itemLists)
            );
        },
        //删除商品属性
        delGoodAttr (){
//          var _length;
//          ( this.itemLists.length >= 9 ? _length = 0: _length = 9 - this.itemLists.length)
//          for (var i = 0; i < _length ; i++) {
//              this.addGoodAttr();
//          }
			if(this.itemLists.length == 1) {
				this.$confirm('已经是最后一个了，确定继续删除？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$message({
						type: 'success',
						message: '删除成功!'
					});
					var length = this.itemLists.length;
					this.itemLists.splice(length - 1, 1);
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
					return false;
				});
			}else{
				var length = this.itemLists.length;
				this.itemLists.splice(length - 1, 1);
			}
//          console.log(
//              '商品属性 数组:' + JSON.stringify(this.attrs),
//              '商品属性 表格:' + JSON.stringify(this.itemLists)
//          );
        },
        initEditor: function() {
            this.editor = new E('#editor');
            this.editor.customConfig.onchange = (html) => {
            	console.log(html);
//              this.course.content.handout = html
            }
            // this.editor.customConfig.uploadImgServer = this.uploadImgUrl; //此接口不行  
            // this.editor.customConfig.uploadImgParams = {
            //     action: 'uploadimage',
            //     token: this.token  // 属性值会自动进行 encode ，此处无需 encode
            // }
            // this.editor.customConfig.uploadImgParamsWithUrl = true;
            // this.editor.customConfig.uploadFileName = 'image';
            // this.editor.customConfig.uploadImgHooks = {
            //     customInsert: function (insertImg, result, editor) {
            //     var url = result.success.domain + result.success.path;
            //         insertImg(url);
            //     }
            // }
            this.editor.create();
        },
        handleSelection: function() {
        },
        //商城协议编辑或添加
        handleProtocol: function(item) {
            if (item.id != null) {
            }
            this.$router.push('/operateProtocol')
        },
        
        //商品图片 => 上传限制 => 大小限制
        beforeAvatarUpload: function(file) {
			const isJPG = file.type === 'image/jpeg';
	        const isLt2M = file.size / 1024 / 1024 < 3;
	
	        if (!isJPG) {
	          this.$message.error('上传图片只能是 JPG 格式!');
	        }
	        if (!isLt2M) {
	          this.$message.error('上传图片大小不能超过 2MB!');
	        }
	        return isJPG && isLt2M;
	   	},
        //商品图片 => 上传限制 => 数量限制
	   	handleExceed: function (files, fileList) {
	   		this.$message.warning(`当前限制选择 10 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
	   	},
        //商品图片 => 上传成功
        handleSuccess: function() {
			console.log(file, fileList);
        },
        //商品图片 => 图片放大
        handlePictureCardPreview: function() {
        	this.dialogImageUrl = file.url;
        	this.dialogVisible = true;
        	console.log(this.dialogImageUrl);
        },
        //商品图片 => 图片移除
        handleRemove: function() {
        	console.log(file, fileList);
        },
        //字数控制
        txtLength: function(_elem, _target) {
            this[_target] = this[_elem].length;
        },
    }
}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style type="text/css">
	.w-e-text-container {
		z-index: 2000!important;
	}
</style>
<style scoped>
.goods-img {
    width: 100px;
    height: 50px;
}

#editor {
    width: 100%;
    height: 330px;
}

.textarea-common {
    width: 100%;
    height: 50px;
    resize: none;
    border: 1px solid #e5e5e5;
    border-radius: 4px;
}

.u-form-mb {
    margin-bottom: 0;
}

.u-form-mb input,
.u-form-mb button {
    margin-bottom: 15px;
}

.u-table-input tr td input {
    width: 100%;
    height: 100%;
    border: 1px solid #ddd;
}

.form-horizontal .u-text-num {
    padding-top: 7px;
    margin-left: -15px;
}
.u-goods-img {
	padding-top: 7px;
	line-height: 20px;
	margin-bottom: 15px;
}
</style>
