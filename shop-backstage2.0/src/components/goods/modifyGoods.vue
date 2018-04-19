<!-- 修改商品 -->
<template>
    <div class="goods">
        <v-breadcrumb firstMenu="商品" secondMenu="商品管理" thirdMenu="修改商品"></v-breadcrumb>
        <div class="nav row">
            <div class="col-md-12">
                <div class="portlet box red">
                    <div class="portlet-title">
                        <div class="caption">修改商品</div>
                    </div>
                    <div class="portlet-body">
                        <div class="form-horizontal">
                            <div class="form-group">
                                <label class="col-md-3 control-label"><b class="text-red">*</b>商品标题：</label>
                                <div class="col-md-5">
                                    <input type="text" class="form-control" v-model="productDetailInfo.proTitle" disabled="disabled">
                                </div>
                                <!--<div class="col-md-2 u-text-num">
                                    <span>{{ titleLength }}/60</span>
                                </div>-->
                            </div>
                            <div class="form-group">
                                <label class="col-md-3 control-label"><b class="text-red">*</b>商品副标题：</label>
                                <div class="col-md-5">
                                    <textarea class="textarea-common" v-model="subTitle" @input="txtLength('subTitle','subTitleLength')" placeholder="" maxlength="150"></textarea>
                                </div>
                                <div class="col-md-2 u-text-num">
                                    <span>{{ subTitleLength }}/150</span>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-md-3 control-label"><b class="text-red">*</b>商品类别：</label>
                                <div class="col-md-5">
                                    <select class="form-control input-small input-inline" v-model="oneSelected" @change="createTwoClass">
                                        <option value="left">选择一级分类</option>
                                        <option v-for="item,index in oneClassify" :value="item.classId">{{ item.className }}</option>
                                    </select>
                                    <select class="form-control input-small input-inline" v-model="twoSelected">
                                        <option v-if="twoClassify.length < 1" value="left">暂无</option>
                                        <option v-else value="left">选择二级分类</option>
                                        <option v-for="item,index in twoClassify" :value="item.productTypeCode">{{ item.className }}</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-md-3 control-label"><b class="text-red">*</b>排序：</label>
                                <div class="col-md-5">
                                    <input type="text" min="1" class="form-control input-small input-inline" v-model="goodsSort">
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-md-3 control-label"><b class="text-red">*</b>价格（原价）：</label>
                                <div class="col-md-5">
                                    <input type="number" class="form-control input-small input-inline" placeholder="" v-model="primeCost">
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-md-3 control-label"><b class="text-red">*</b>价格（销售价）：</label>
                                <div class="col-md-5">
                                    <input type="number" class="form-control input-small input-inline" placeholder="" v-model="price">
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-md-3 control-label"><b class="text-red">*</b>赠送积分比例：</label>
                                <div class="col-md-5">
                                    <input type="text" class="form-control input-small input-inline" placeholder="" v-model="giveRatio">%
                                </div>
                            </div>
                            <div class="form-group" v-if="productDetailInfo.specialList">
                                <label class="col-md-3 control-label"><b class="text-red">*</b>商品属性：</label>
                                <div class="col-md-8">
                                    <table class="table table-bordered table-hover u-table-input">
                                        <thead>
                                            <tr>
                                                <th>颜色</th>
                                                <th>尺码</th>
                                                <th>重量</th>
                                                <th>库存</th>
                                                <th>原价</th>
                                                <th>成本</th>
                                                <th>服务费</th>
                                                <th>利润</th>
                                                <th>售价</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="item,index in productDetailInfo.specialList">
                                                <td>
                                                    <input type="text" v-model="item.skuColor" disabled="disabled">
                                                </td>
                                                <td>
                                                    <input type="text" v-model="item.skuSize" disabled="disabled">
                                                </td>
                                                <td>
                                                    <input type="text" v-model="item.weight" disabled="disabled">
                                                </td>
                                                <td>
                                                    <input type="text" v-model="item.proCount" disabled="disabled">
                                                </td>
                                                <td>
                                                    <input type="text" min="0" v-model="item.productOrigiPrice" @change="_getFullMoney( item.productOrigiPrice, index, 'productOrigiPrice') ">
                                                </td>
                                                <td>
                                                    <input type="number" min="0" v-model="item.productCostPrice" @change="_getFullMoney( item.productCostPrice, index, 'productCostPrice') " @blur="handleSalePrice(item, index)">
                                                </td>
                                                <td>
                                                    <input type="number" min="0" v-model="item.productServicePrice" @change="_getFullMoney( item.productServicePrice, index, 'productServicePrice') " @blur="handleSalePrice(item, index)">
                                                </td>
                                                <td>
                                                    <input type="number" min="0" v-model="item.productLc" @change="_getFullMoney( item.productLc, index, 'productLc') " @blur="handleSalePrice(item, index)">
                                                </td>
                                                <td>
                                                    <input type="number" min="0" v-model="item.productPrice" :id="'proPriceInp' + index" disabled="disabled">
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <!--<div class="form-group">
                                <label class="col-md-3 control-label" >商品状态：</label>
                                <div class="col-md-5">
                                    <el-radio-group v-model="goodsStatus">
                                        <el-radio :label="0">销售中</el-radio>
                                        <el-radio :label="1">下架</el-radio>
                                    </el-radio-group>
                                </div>
                            </div>-->
                            <div class="form-group">
                                <label class="col-md-3 control-label"><b class="text-red">*</b>商品图片：</label>
                                <div class="col-md-9">
                                    <p class="u-goods-img">商品图片大小不能超过3MB；<span class="text-red"> 700×700 </span>以上图片上传后自动提供放大镜功能。</p>
                                    <div class="lineBlock">
                                        <div class="img-wrap" v-for="item,index in imgList">
                                            <span class="del" @click="handleImgDel(index, 'goods')">-</span>
                                            <input type="file" accept="image/jpeg" @change="handleImgUpload(index, 'goods')" />
                                            <img :src="item.fileUrl" />
                                        </div>
                                        <div class="img-add">
                                            <input type="file" accept="image/jpeg" @change="addImgUpload('goods')" /> +
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-md-3 control-label"><b class="text-red">*</b>详情图片：</label>
                                <div class="col-md-9">
                                    <!--<div id="editor" style="z-index: 2000!important;"></div>-->
                                    
                                    <div class="lineBlock">
                                        <div class="img-wrap" v-for="item,index in remarkImgList">
                                            <span class="del" @click="handleImgDel(index, 'remark')">-</span>
                                            <input type="file" accept="image/jpeg" @change="handleImgUpload(index, 'remark')" />
                                            <img :src="item" />
                                        </div>
                                        <div class="img-add">
                                            <input type="file" accept="image/jpeg" @change="addImgUpload('remark')" /> +
                                        </div>
                                    </div>
                                    <!--<template v-for="item in remarkImgList">
                                    	<img :src="item" class="remark-img" />
                                    </template>-->
                                </div>
                            </div>
                        </div>
                        <div class="operate ta-center">
                            <button type="button" class="btn btn-success" @click="handleSava">保存</button>
                            <button type="button" class="btn default" @click="$router.push('/goods')">取消</button>
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
            onle: true, //是否第一次加载
            //          title: '', //标题
            //          titleLength: 0, //标题长度
            subTitle: '', //副标题
            subTitleLength: 0, //副标题长度
            oneClassify: [], //一级分类数组
            twoClassify: [], //二级分类数组
            oneSelected: "left", //一级分类
            oneStorage: "", //一级存储值
            twoSelected: "left", //二级分类
            //          totalStock: null,//总库存
            price: null, //销售价
            skuPrices: [], //商品SKU ID与价格 串
            //          skuList: [],//sku列表
            //          originPriceArr: [],//原价数组
            //          salePriceArr: [],//销售价数组
            //          costPriceArr: [],//成本价数组
            //          servicePriceArr: [],//服务费数组
            //          productLcArr: [],//利润数组
            code: '', //code信息
            classId: '', //商品分类CODE
            primeCost: null, //价格(原价)
            giveRatio: null, //赠送比例
            goodsStatus: 0, //商品状态
            goodsSort: null, //商品排序
            imgList: [], //已经图片对象
            productDetailInfo: {},
            editor: null, //富文本编辑器
            editContent: '', //富文本内容
            uploadImgUrl: this.baseUrl + '/productBusi/uploadRichPics', //上传图片接口
            remarkImgList: []//详情图片数组
        }
    },
    watch: {
        // 商品 原价
        'primeCost': function(val, oldVal) { if (val != null) { this.primeCost = this.doubleFloat(val.toString()); } },
        // 商品 销售价
        'price': function(val, oldVal) { if (val != null) { this.price = this.doubleFloat(val.toString()); } },
    },
    mounted() {
        this.$nextTick(function() {
//          this.initEditor();
            this.getAllData(this.$route.query.id);
        });
    },
    methods: {
        // 设置 => 强制金额
        _getFullMoney(_price, _index, _type) {
            if (_price != null) {
                this.productDetailInfo.specialList[_index][_type] = this.doubleFloat(_price);
            }
        },
        //获取商品详情数据
        getAllData: function(_code) {
            this.code = _code;
            var that = this;
            var reqUrl = this.baseUrl + '/productInfo/getProductDetail';
            var params = {
                token: this.token,
                //参数(必选)
                proCode: _code,
            }
            this.$http.get(reqUrl, { params: params }).then(function(res) {
                if (!res) {
                    return;
                }
                that.productDetailInfo = res.productDetailInfo;
                
                //获取商品价格信息
                /*  if(that.productDetailInfo.specialList){
                        var specialList = that.productDetailInfo.specialList;
                        
                        for(var i = 0;i<specialList.length;i++){
                            that.originPriceArr[i] = specialList[i].productOrigiPrice; //原价
                            that.salePriceArr[i] = specialList[i].productPrice; //销售价
                            that.costPriceArr[i] = specialList[i].productCostPrice; //成本价
                            that.servicePriceArr[i] = specialList[i].productServicePrice; //服务费
                            that.productLcArr[i] = specialList[i].productLc; //利润
                            
                            var obj = {
                                skupri:specialList[i].skuCode+'-'+ that.originPriceArr[i]+'-'+that.salePriceArr[i] + '-' 
                                        + that.costPriceArr[i] + '-' + that.servicePriceArr[i] + '-' + that.productLcArr[i]
                            };
                            that.skuList.push(obj);
                        }
                    }*/
                //加载商品图片
                if (res.productDetailInfo.imgList) {
                    var imgListArr = res.productDetailInfo.imgList.split(",");
                    for (var i = 0; i < imgListArr.length; i++) {
                        var imgArr = imgListArr[i].split("|", 1);
                        var imgSrcArr = imgListArr[i].slice(33);
                        var srcObj = { fileCode: imgArr, fileUrl: imgSrcArr };
                        that.imgList.push(srcObj);
                    }
                }
                //加载库存
                if (res.productDetailInfo.specialList) {
                    var skuNoArr = res.productDetailInfo.specialList;
                    var arr = [];
                    for (var i = 0; i < skuNoArr.length; i++) {
                        that.getGoodsStock(arr, i, skuNoArr[i].skuNo);
                    }
                }
				 
                that.modelData();
            });
        },
        //数据绑定
        modelData() {
            if (this.productDetailInfo.proHitTitle) {
                this.subTitle = this.productDetailInfo.proHitTitle; //副标题
                this.subTitleLength = this.subTitle.length;
            }
            if (this.productDetailInfo.proSort) {
                this.goodsSort = this.productDetailInfo.proSort; //排序
            }
            if (this.productDetailInfo.proOriginalPrice) {
                this.primeCost = this.productDetailInfo.proOriginalPrice; //原价
            }
            if (this.productDetailInfo.proSalePrice) {
                this.price = this.productDetailInfo.proSalePrice; //销售价
            }
            if (this.productDetailInfo.integralProportion) {
                this.giveRatio = this.productDetailInfo.integralProportion; //赠送积分比例
            }
            if (parseInt(this.productDetailInfo.proSale)) {
                // this.goodsStatus = parseInt(this.productDetailInfo.proSale);//商品状态
            }
//          if (this.productDetailInfo.proRemark) {
//              this.editContent = this.productDetailInfo.proRemark; //商品说明
//              this.editor.txt.clear();
//              this.editor.create();
//              var _string = this.editContent.replace(/\%26/g, "&");
//              this.editor.txt.html(_string);
//          }
			
			this.getAllClassify(); 
			this.dealRemarkImg();
        },
        //处理详情图片
        dealRemarkImg() {
        	//加载商品详情图片  remarkImgList
			var proRemark = this.productDetailInfo.proRemark, 
				imgReg = /<img.+?>/ig, //img标签正则表达式
				remarkImgList = proRemark.match(imgReg),//得到的商品详情图片数组
				objE = document.createElement("div"), //创建divDOM
				arr = [];
			if(remarkImgList == null || remarkImgList.length == 0) {
				return;
			}
			for(var i = 0; i < remarkImgList.length;i++) {
				var obj = remarkImgList[i];
				objE.innerHTML = objE.innerHTML + obj;
				var imgSrc =  objE.childNodes[i].src;
				arr[i]= imgSrc;
			}
			this.remarkImgList = arr;
        },
        //获取一级分类
        getAllClassify: function() {
            var that = this;
            var reqUrl = this.baseUrl + '/productInfo/getProTypeOptions';
            var params = {
                token: this.token,
                //参数(必选)
                lv: 1
            }
            this.$http.get(reqUrl, { params: params }).then(function(res) {
                if (!res) {
                    return;
                }
                that.oneClassify = res.typeOptions;
                //判断是否有默认分类
                if (that.productDetailInfo.proClassNID && that.productDetailInfo.proClassId) {
                    that.oneSelected = that.productDetailInfo.proClassNID;
                    that.createTwoClass();
                }
            });
        },
        //生成二级分类
        createTwoClass: function() {
            if (this.oneSelected != "left") {
                this.twoClassify = [];
                this.twoSelected = "left";
                var that = this;
                var reqUrl = this.baseUrl + '/productInfo/getSecondLvProTypes';
                var params = {
                    token: this.token,
                    //参数(必选)
                    typeCode: this.oneSelected
                }
                this.$http.get(reqUrl, { params: params }).then(function(res) {
                    if (!res) {
                        return;
                    }
                    that.twoClassify = res.types;
                    if (that.onle && that.productDetailInfo.proClassId) {
                        that.twoSelected = that.productDetailInfo.proClassId;
                        that.onle = false;
                    }
                });
            } else {
                this.oneStorage = "";
                this.twoClassify = [];
                this.twoSelected = "left";
            }
        },
        //获取库存
        getGoodsStock: function(_arr, _index, _params) {
            var skuNo = _arr[_index];
            var that = this;
            var reqUrl = this.baseUrl + '/productStock/proStocks';
            var params = {
                token: this.token,
                //参数(必选)
                proSkuNo: _params
            }
            this.$http.get(reqUrl, { params: params }).then(function(res) {
                if (!res) {
                    return;
                }
                that.productDetailInfo.specialList[_index].proCount = res.Result[0].ProCount;
            });
        },
        //编辑器
        initEditor: function() {
            this.editor = new E('#editor');
            this.editor.customConfig.pasteFilterStyle = false;
            this.editor.customConfig.pasteIgnoreImg = true;

            this.editor.customConfig.onchange = (html) => {
                this.editContent = html
            }
            this.editor.customConfig.uploadImgServer = this.uploadImgUrl;
            this.editor.customConfig.uploadImgParams = {
                action: 'uploadimage',
                token: this.token // 属性值会自动进行 encode ，此处无需 encode
            }
            this.editor.customConfig.uploadImgMaxSize = 2 * 1024 * 1024; // 将图片大小限制为 3M
            this.editor.customConfig.uploadImgParamsWithUrl = true;
            this.editor.customConfig.uploadFileName = 'files';
            this.editor.customConfig.uploadImgHooks = {
                customInsert: function(insertImg, result, editor) {
                    var url = result.data.richImgs[0].picUrl;
                    insertImg(url);
                }
            }
            this.editor.create();
            /*   var that = this;
            document.getElementById('btnSave').addEventListener('click', function () {
                var json = that.editor.txt.getJSON();  // 获取 JSON 格式的内容
                that.editContent = json;
            })*/
        },
        //计算商品销售价
        handleSalePrice(item, index) {
            var obj = this.productDetailInfo.specialList[index];
            if (obj.productPrice == undefined) {
                obj.productPrice = 0;
            }
            if (obj.productCostPrice == undefined) {
                obj.productCostPrice = 0;
            }
            if (obj.productServicePrice == undefined) {
                obj.productServicePrice = 0;
            }
            if (obj.productLc == undefined) {
                obj.productLc = 0;
            }
            var val1 = this.NumberAdd(obj.productCostPrice, obj.productServicePrice);
            var val2 = this.NumberAdd(val1, obj.productLc);
            this.productDetailInfo.specialList[index].productPrice = val2;
            document.getElementById('proPriceInp' + index).value = val2;
        },
        // 上传限制
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isPNG = file.type === 'image/png';
            const isLt2M = file.size / 1024 / 1024 < 5;
            var isIMG = true;
            if (!isJPG) {
                if (!isPNG) {
                    this.$message.error('上传图片只能是 JPG, PNG 格式!');
                    isIMG = false;
                }
            }
            if (!isLt2M) {
                this.$message.error('上传图片大小不能超过 5MB!');
            }
            return isIMG && isLt2M;
        },
        //商品图片上传(修改)
        handleImgUpload: function(_index, _name, ev) {
            var ev = event || window.event,
            	elem = ev.currentTarget,
            	imgElem = elem.nextElementSibling,
            	files = this.uploadImgFn(elem);
            this.beforeAvatarUpload(files.fileObj);
            return 
            imgElem.src = files.fileUrl;
            if(_name == 'goods') { //商品图片
            	this.imgList[_index].fileUrl = files.fileUrl;
            } else { //详情图片
            	this.remarkImgList[_index] = files.fileUrl;
            }
            this.uploadImg(files.fileObj, _index, _name);
        },
        //商品图片上传(删除)
        handleImgDel: function(_index, _name, ev) {
            var ev = event || window.event,
            	elem = ev.currentTarget,
            	imgElem = elem.parentElement;
            if(_name == 'goods') { //商品图片
            	this.imgList.splice(_index, 1);
            } else { //详情图片
            	this.remarkImgList.splice(_index, 1);
            }
        },
        //商品图片上传(添加)
        addImgUpload: function(_name, ev) {
            var ev = event || window.event,
            	elem = ev.currentTarget,
            	num = 0,
            	files = this.uploadImgFn(elem); //获取上传的图片文件                
            this.beforeAvatarUpload(files.fileObj);
            if(_name == 'goods') { //商品图片
            	num = this.imgList.length;
            	if(this.imgList.length >= 10) {
            		this.$message.error('最多只能添加10张图片');
            		return;
            	}
                var obj = { fileCode: '', fileUrl: files.fileUrl }
                this.imgList.push(obj);
            } else {//详情图片
            	num = this.remarkImgList.length;
                this.remarkImgList.push(files.fileUrl);
            }
            this.uploadImg(files.fileObj, num, _name);
            elem.value = "";
        },
        //上传图片接口
        uploadImg: function(_files, _index, _name) {
            var that = this,
            	reqUrl = this.baseUrl + '/productBusi/uploadRichPics',
            	formData = new FormData();
            formData.append("token", that.token);
            formData.append("files", _files);
            this.$http.post(reqUrl, { formData: formData }).then(function(res) {
                if (!res) { return; }
                if(_name == 'goods') {//商品图片
                	that.imgList[_index].fileUrl = res.richImgs[0].picUrl;
                } else {//详情图片
                	that.remarkImgList[_index] = res.richImgs[0].picUrl;
                }
            });
        },
        //字数控制
        txtLength: function(_elem, _target) {
            this[_target] = this[_elem].length;
        },
        //保存提交
        handleSava: function() {
            if (!this.subTitle) {
                this.$message.error('副标题不能为空！');
                return;
            }
            if (this.oneSelected == "left" || this.twoSelected == "left") {
                this.$message.error('商品类别不能为空！');
                return;
            }
            if (!this.goodsSort) {
                this.$message.error('商品排序不能为空！');
                return;
            }
            if (!this.primeCost) {
                this.$message.error('商品原价不能为空！');
                return;
            }
            if (!this.price) {
                this.$message.error('商品销售价不能为空！');
                return;
            }
            if (!this.giveRatio) {
                this.$message.error('赠送积分不能为空！');
                return;
            }
            for (var i = 0; i < this.productDetailInfo.specialList.length; i++) {
                var obj = this.productDetailInfo.specialList[i];
                if (obj.productOrigiPrice == undefined || obj.productCostPrice == undefined ||
                    obj.productServicePrice == undefined || obj.productLc == undefined) {
                    this.$message.error('商品属性的价格不能为空！');
                    return;
                }

                if ((obj.productOrigiPrice.toString() == '') || (obj.productCostPrice.toString() == '') ||
                    (obj.productServicePrice.toString() == '') || (obj.productLc.toString() == '') ||
                    (obj.productPrice.toString() == '')) {
                    this.$message.error('商品属性的价格不能为空！');
                    return;
                }
                var skuPricesObj = {
                    skupri: obj.skuCode + '-' + obj.productOrigiPrice + '-' + obj.productPrice + '-' +
                        obj.productCostPrice + '-' + obj.productServicePrice + '-' + obj.productLc
                }
                this.skuPrices.push(skuPricesObj);
            }
            if (this.imgList.length == 0) {
                this.$message.error('商品图片不能为空！');
                return;
            }
			if(this.remarkImgList.length == 0) {
			  	this.$message.error('详情图片不能为空！');
                return;	
			}

            // var _string = this.deleteSpaceAll(this.editContent.replace(/\"/g, "'"));
            // _string = _string.replace(/\\n/g, "\\n");
            // params.proRemark = encodeURI(_string);
            // var a = that.editContent.replace(/\%/g, "%25"),
            //  a = a.replace(/\\n/g, "\\n"),
            //  a = a.replace(/[\r\n]/g, ""); 
//          var _string = this.editContent.replace(/\&/g, "%26");
//          params.proRemark = _string;

			var that = this,
            	reqUrl = this.baseUrl + '/productBusi/updatePro',
            	params = {
	                token: this.token,
	                proCode: that.code,
	                proHitTitle: that.subTitle,
	                classId: that.twoSelected,
	                salePrice: Number(that.price),
	                originPrice: Number(that.primeCost),
	                proportion: Number(that.giveRatio),
	                proSale: that.goodsStatus,
	                proSort: Number(that.goodsSort),
	                skuPrices: JSON.stringify(that.skuPrices) //商品SKU ID与价格 串
	            };
	        
			//处理商品图片
            if (this.imgList.length > 0) {
                var haveImgList = [];
                var addImgList = [];
                for (var i = 0; i < this.imgList.length; i++) {
                    var str = '';
                    if (this.imgList[i].fileCode) {
                        str = this.imgList[i].fileCode + "|" + this.imgList[i].fileUrl;
                        haveImgList.push(str);
                    } else {
                        str = this.imgList[i].fileUrl;
                        addImgList.push(str);
                    }
                }
                if (haveImgList.length > 0) { //更新的图片
                    params.imgList = JSON.stringify(haveImgList);
                }
                if (addImgList.length > 0) { //添加的图片
                    params.addImgList = JSON.stringify(addImgList);
                }
            }
            
            //处理详情图片数据
            var reImgLen = this.remarkImgList.length,
            	proRemark = '';
            if(reImgLen == 1) {
            	proRemark = '<img src=' + this.remarkImgList[0] + ' />';
            } else {
            	for(var i = 0;i < this.remarkImgList.length;i++) {
            		var str = this.remarkImgList[i];
            		if(i == 0) {
            			proRemark = '<img src=' + str + ' />';
            		} else {
            			proRemark = proRemark + '<img src=' + str + ' />';
            		}
	            }
            }
            params.proRemark = proRemark;
            this.$http.post(reqUrl, params).then(function(res) {
                if (!res) { return; }
                that.$router.push('/goods');
            });

        }
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

.lineBlock .img-wrap {
    display: inline-block;
    vertical-align: top;
    position: relative;
    width: 120px;
    height: 120px;
    margin-right: 20px;
    margin-bottom: 10px;
    border: 1px dashed #ddd;
    border-radius: 5px;
}

.lineBlock .img-wrap .del {
    position: absolute;
    top: -5px;
    right: -5px;
    width: 15px;
    height: 15px;
    color: #fff;
    background-color: #CB5A5E;
    text-align: center;
    border-radius: 50%;
    cursor: pointer;
    z-index: 500;
}

.lineBlock .img-wrap input {
    position: absolute;
    left: 0;
    top: 0;
    width: 120px;
    height: 120px;
    filter: alpha(opacity=0);
    opacity: 0;
}

.lineBlock .img-wrap img {
    width: 120px;
    height: 120px;
    border-radius: 5px;
}

.lineBlock .img-add {
    display: inline-block;
    vertical-align: top;
    position: relative;
    width: 120px;
    height: 120px;
    line-height: 120px;
    color: #ddd;
    font-size: 48px;
    text-align: center;
    border: 1px dashed #ddd;
    border-radius: 5px;
    margin-bottom: 10px;
}

.lineBlock .img-add input {
    position: absolute;
    top: 0;
    left: 0;
    width: 120px;
    height: 120px;
    filter: alpha(opacity=0);
    opacity: 0;
}

.remark-img {
	width: 120px;
	height: 120px;
	margin: 0 10px 10px 0;
}
</style>
