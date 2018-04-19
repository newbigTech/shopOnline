<!-- 优惠券管理 - 修改/添加 -->
<template>
	<div class="couponAdd">
		<v-breadcrumb firstMenu="优惠券管理" :secondMenu="secondMenu"></v-breadcrumb>
		<div class="nav row">
			<div class="col-md-12">
				<div class="portlet box red">
					<div class="portlet-title">
						<div class="caption">{{secondMenu}}</div>
					</div>
					<div class="portlet-body">
					  	<div class="dialog-con">
					  		<div class="dialog-item" v-if="dialog.title !='添加'">
					  			<div class="col-md-2 ta-right">名称：</div>
					  			<div class="col-md-2"><input type="text" v-model="dialog.name"/></div>
					  		</div>
					  		<div class="dialog-item">
					  			<div class="col-md-2 ta-right">描述：</div>
					  			<div class="col-md-5"><input type="text" v-model="dialog.descript"/></div>
					  		</div>
					  		<div class="dialog-item">
					  			<div class="col-md-2 ta-right">金额：</div>
					  			<div class="col-md-2">
					  				<input type="text" v-model="dialog.amount"/>
					  			</div>
					  		</div>
					  		<div class="dialog-item">
					  			<div class="col-md-2 ta-right">起止时间：</div>
					  			<div class="col-md-3">
					  				 <el-date-picker v-model="selectDate" type="datetimerange"
					  				 	 start-placeholder="开始时间" end-placeholder="结束时间" 
					  				 	 value-format="yyyy-MM-dd HH:mm:ss"
					  				 	  @change="datePicker"></el-date-picker>
					  			</div>
					  			<!--<div class="col-md-2"><el-checkbox v-model="dialog.limit">无限制</el-checkbox></div>-->
					  		</div>
					  		<div class="dialog-item">
					  			<div class="col-md-2 ta-right">优惠券类型：</div>
					  			<!--
					  			<div class="col-md-1 ta-right">
					  				<el-radio v-model="dialog.type" label="1">现金券</el-radio>
					  			</div>
					  			<div class="col-md-1">
					  				<input type="text" v-model="dialog.cash"/>
					  			</div>
					  			
					  			<div class="col-md-1 ta-right">
					  				<el-radio v-model="dialog.type" label="2">满减券</el-radio>
					  			</div>
					  			<div class="col-md-1 ta-right">
					  				满&nbsp;<input type="text" v-model="dialog.full" style="width: 60%;"/>
					  			</div>
					  			<div class="col-md-1">
					  				减&nbsp;<input type="text" v-model="dialog.minus" style="width: 60%;"/>
					  			</div>
					  			-->
					  			<div class="col-md-1">
					  				<el-radio v-model="dialog.type" label="1">体验券</el-radio>
					  			</div>
					  		</div>
					  		<div class="dialog-item">
					  			<div class="col-md-2 ta-right">发放数量：</div>
					  			<div class="col-md-2">
					  				<input type="number" v-model="dialog.number"
					  					onkeyup="this.value=this.value.replace(/[^\d]/g,'')"/>
					  			</div>
					  			<div class="col-md-2">
					  				<!--<el-checkbox v-model="dialog.limitNum">无限制</el-checkbox>-->
					  			</div>
					  		</div>
					  		<div class="dialog-item">
					  			<div class="col-md-2 ta-right">有效期：</div>
					  			<div class="col-md-4">
					  				<el-radio v-model="dialog.validTime" label="2" @change="handleValidTime">按时间</el-radio>
					  				  <el-date-picker value-format="yyyy-MM-dd HH:mm:ss"
								      v-model="limitTime" type="datetime"  :disabled="dialog.validTime == '1'" 
								      placeholder="选择时间" >
								    </el-date-picker>
					  			</div>
					  			<div class="col-md-3">
					  				<el-radio v-model="dialog.validTime" label="1" @change="handleValidTime">按日期</el-radio>
					  				<input type="number" v-model="limitTime2" :disabled="dialog.validTime == '2'" style="width: 60%;"/>
					  			</div>
					  		</div>
					  		<div class="dialog-item">
					  			<div class="col-md-2 ta-right">发放条件：</div>
					  			<div class="col-md-1">
					  				<el-radio v-model="dialog.condition" label="1">新用户</el-radio>
					  			</div>
					  			<!--<div class="col-md-1 ta-right">
					  				<el-radio v-model="dialog.condition" label="2">订单总额</el-radio>
					  			</div>
					  			<div class="col-md-1">
					  				<input type="text" v-model="dialog.total" :disabled="dialog.condition == '1'"/>
					  			</div>-->
					  		</div>
					  		<div class="dialog-item">
					  			<div class="col-md-2 ta-right">积分限制：</div>
					  			<div class="col-md-1">
					  				<el-radio v-model="dialog.integral" label="1">限制</el-radio>
					  			</div>
					  			<!--<div class="col-md-1">
					  				<el-radio v-model="dialog.integral" label="0">不限</el-radio>
					  			</div>-->
					  		</div>
					  		<div class="dialog-item">
					  			<div class="col-md-2 ta-right">是否上架：</div>
					  			<div class="col-md-1">
					  				<el-radio v-model="dialog.shelves" label="1">是&nbsp;&nbsp;&nbsp;</el-radio>
					  			</div>
					  			<div class="col-md-1">
					  				<el-radio v-model="dialog.shelves" label="0">否&nbsp;&nbsp;&nbsp;</el-radio>
					  			</div>
					  		</div>
					  		<div class="dialog-item upload-item">
					  			<div class="col-md-2 ta-right">领取图片：</div>
					  			<div class="col-md-8">
					  				 <div class="lineBlock">
                                        <div class="img-wrap" v-if="dialog.receiveImg != ''">
                                            <input type="file" accept="image/jpeg" @change="uploadImg" />
                                            <img :src="dialog.receiveImg" />
                                        </div>
                                        <div class="img-add" v-if="dialog.receiveImg == ''">
                                            <input type="file" accept="image/jpeg" @change="uploadImg" /> +
                                        </div>
                                    </div>
					  				<!--<img :src="dialog.receiveImg" class="receive-img" v-if="dialog.receiveImg != ''" />-->
					  				<!--<input type="file"  @change="uploadImg"/>-->
					  			</div>
					  		</div>
					  	</div>
					  	<div class="dialog-btm ta-center">
					  		<button type="button" class="btn btn-primary" @click="handleSave">保存</button>
							<button type="button" class="btn btn-default" @click="handleCancle">取消</button>
					  	</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
	import breadcrumb from '@/components/tool/breadcrumb' //面包屑
	
	export default {
		name:'couponGoods',
		components: {
       		'v-breadcrumb': breadcrumb
    	},
    	data() {
    		return {
    			secondMenu: '添加优惠券',
    			couponId: '',//修改优惠券时，优惠券id
    			selectDate: null,
    			limitTime: null, //有效时间
    			limitTime2: '', //有效天数
    			dialog:{
    				name: '',descript: '',amount: '',number: '',
    				type: '1', //类型(1:体验券,2:现金券,3:满减券)
    				validTime: '1',//有效期(1:按日期,2:统一时间)
    				condition: '1', //发放条件(1:新用户,2:订单总额(大于等于))
    				integral: '1',//积分限制(0:不限制,1:限制)
    				shelves: '1',//是否上架(0:不上架,1:上架)
    				receiveImg: '',//领取图片
    			},//数据
    		}
    	},
    	 watch: {
	        'dialog.amount': function(val, oldVal) { 
	        	if(val != '') {
	                this.dialog.amount = this.doubleFloat(val);
	            }
	        },
	    },
    	created() {
    		var id = this.$route.query.id;
    		if(id == undefined) { //添加优惠券
    			this.secondMenu = '添加优惠券';
    		} else {
    			this.secondMenu = '修改优惠券';
    			this.couponId = id;
    			this.getDetail();//获取优惠券详情
    		}
	    },
	    mounted() {
	        this.$nextTick(function() {
	        	
	        });
	    },
    	methods:{
    		 // 起止时间处理
	        datePicker() {
	            if (this.selectDate) {
	                this.dialog.startTime = this.selectDate[0];
	                this.dialog.endTime = this.selectDate[1];
	            } else {
	                this.dialog.startTime = null;
	                this.dialog.endTime = null;
	            }
	        },
	        //选择有效期change
	        handleValidTime() {
	        	if(this.dialog.validTime == '2') {
	        		this.limitTime2 = '';
	        	} else {
	        		this.limitTime = null;
	        	}
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
	        //上传图片
	        uploadImg() {
	            var ev = event || window.event,
	            	elem = ev.currentTarget,
	            	imgElem = elem.nextElementSibling,
	            	files = this.uploadImgFn(elem),
	            	that = this,
	            	reqUrl = this.baseUrl + '/upload/files',
	            	formData = new FormData();
                this.beforeAvatarUpload(files.fileObj);
	            formData.append("token", that.token);
	            formData.append("fileCategory", '1');
	            formData.append("filePathKey", 'couponImgPath'); //添加优惠券图片
	            formData.append("file", files.fileObj);
	            this.$http.post(reqUrl, { formData: formData }).then(function(res) {
	                if (!res) { return; }
	               	that.dialog.receiveImg = res.path;
	            });
	            
	        },
	        getDetail() {
	        	var that = this,
					reqUrl = this.baseUrl + '/protocol/findDiscountCouponById',
					params = {
						pageNum: 1,
						pageSize: 1,
						id: this.couponId
					}
				this.$http.get(reqUrl, {params: params}).then(function(res) {
					if(!res) {
						return;
					}
					var obj = res.awardList[0];
					that.dialog.name = obj.name;
					that.dialog.descript = obj.descript;
					that.dialog.amount = obj.amount.toString();
					that.dialog.type = obj.type;
					that.dialog.number = obj.number;
					that.dialog.validTime = obj.validTime;
					
					if(that.dialog.validTime == '1') {
						that.limitTime2 = obj.validDay;
					} else {
						that.limitTime = obj.validEndTime;
					}
					that.dialog.condition = obj.conditionType;
					that.dialog.integral = obj.integral;
					that.dialog.shelves = obj.shelves;
					that.dialog.receiveImg = obj.receiveImg;
					
					that.dialog.startTime = that.formatDate(obj.startTime, 'time');
	                that.dialog.endTime = that.formatDate(obj.endTime, 'time');
					that.selectDate = [that.dialog.startTime, that.dialog.endTime];
					
				})
	       }, 
    		//保存
    		handleSave() {
    			if(this.dialog.name == '') {
    				this.$message('请输入名称');
    				return;	
    			}
    			if(this.dialog.descript == '') {
    				this.$message('请输入描述');
    				return;	
    			}
    			if(this.dialog.amount == '') {
    				this.$message('请输入金额');
    				return;	
    			}
    			if(this.selectDate == null) {
    				this.$message('请选择起止时间');
    				return;	
    			}
    			if(this.dialog.number == '') {
    				this.$message('请输入发放数量');
    				return;
    			}
    			if(this.dialog.validTime == '2') {//有效期(1:按日期,2:统一时间)
    				if(this.limitTime == null) {
	    				this.$message('请选择时间');
	    				return;
    				}
    				this.limitTime2 == '';
    			} else {
    				if(this.limitTime2 == '') {
	    				this.$message('请输入日期');
	    				return;
    				}
    				this.limitTime == null;
    			}
    			if(this.dialog.receiveImg == '') {
    				this.$message('请选择领取图片');
    				return;	
    			}
    			if(this.dialog.validTime == '2') {//有效期(1:按日期,2:统一时间)
    				this.dialog.validEndTime = this.limitTime;
    			} else {//有效期(1:按日期,2:统一时间)
    				this.dialog.validDay = this.limitTime2;
    			}
    			var that = this,
					reqUrl = '';
				if(this.couponId == '') {//添加优惠券
    				reqUrl = this.baseUrl + '/protocol/addCoupon';
    			} else { //修改优惠券
    				this.dialog.id = this.couponId;
    				reqUrl = this.baseUrl + '/protocol/updateCoupon';
    			}
				this.$http.post(reqUrl, this.dialog).then(function(res) {
					if(!res) {return;}
					that.limitTime = null;
    				that.limitTime2 = '';
    				that.$router.push('/coupon');
				})
    		},
    		//取消
    		handleCancle() {
    			this.$router.push({
	                path: '/coupon',
	            });
    		}
    	}
	}
</script>

<style scoped>
@import url("../home/css/dialog.css");
.dialog-con .dialog-item.upload-item {
	height: 120px;
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
.lineBlock .img-wrap input[type='file'],
.lineBlock .img-add input[type='file'] {
    position: absolute;
    left: 0;
    top: 0;
    width: 120px;
    height: 120px;
    filter: alpha(opacity=0);
    opacity: 0;
}
.lineBlock .img-wrap img {
    width: 116px;
    height: 116px;
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
</style>