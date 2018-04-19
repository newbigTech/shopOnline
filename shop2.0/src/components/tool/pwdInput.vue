<!-- 密码输入框 -->
<template>
    <div class="pwdInput"><!--redBorder-->
    	<div :class="['pwd-input-box '] + [redBorder ? 'red-box' : '']">
			<input type="tel" maxlength="1"  v-for="item in inputList"
				 :id="item.id" @keyup="handleKeyup" @focus="handleFocus($event)" @blur="handleBlur($event)"/>
    	</div>
    </div>
</template>
<script>
export default {
    name: 'pwdInput', // 密码输入框
    data() {
        return {
        	pwdLength: 6,//密码长度
        	index: 0,//当前密码框的下标
        	pwdVal: '',//密码最后的值
        	inputList: [
        		{'id': 'input0'},
        		{'id': 'input1'},
        		{'id': 'input2'},
        		{'id': 'input3'},
        		{'id': 'input4'},
        		{'id': 'input5'}
        	]
        }
    },
    props: {
    	//红色边框
    	'redBorder': {
    		type: Boolean,
    		default: false
    	}
    },
    mounted() {
        this.$nextTick(function() {
    		document.getElementById('input0').focus(); //第一个获得焦点
    		
    		document.body.style.height = (this.clientH * 10) + 'px';
    		document.body.style.overflow = 'hidden';
        });
    },
    methods: {
    	//输入触发
    	handleKeyup: function(e) {
    		if(e.keyCode == 8) {
    			this.handleRemove(e);
    			return;
    		}
    		var arr = [];
    		if(this.index < this.pwdLength - 1) { //第一个到最后一个
    			var val = document.getElementById('input' + this.index).value; 
    			if(isNaN(val)) {
					this.$toast('请输入数字');
					document.getElementById('input' + this.index).value = '';
					document.getElementById('input' + this.index).type = 'tel';
					return;
				}
    			this.index++;
    			document.getElementById('input' + this.index).focus(); 
    		} else { //全部输入完成， 获得最终的密码
    			document.getElementById('input' + this.index).blur(); 
    			for(var i = 0;i < this.pwdLength;i++) {
    				var val = document.getElementById('input' + i).value;
    				this.pwdVal = this.pwdVal + val;
    				document.getElementById('input' + i).value = '';
    				document.getElementById('input' + i).type = 'tel';
    			} 
    			this.$emit('result', this.pwdVal);//给父组件传最后的密码值
    			this.index = 0;
    			this.pwdVal = '';
    			document.body.removeAttribute('style');
//  			document.body.style.height = 'auto';
//  			document.body.style.overflow = 'auto';
    		}
    	},
    	//得到焦点触发
    	handleFocus: function(e) {
			e.currentTarget.type = 'tel';
    		var currId = e.currentTarget.id;
    		var index = currId.split('input')[1];
    		//文本框不是第一个时
    		if(index > 0) {
    			for(var i = index;i < this.pwdLength;i++) {
					document.getElementById('input' + i).value = '';
					document.getElementById('input' + i).type = 'tel';
				}
    			var beforeVal = document.getElementById('input' + (index - 1)).value; 
    			//前一个文本框没有值 ，前一个文本框获取焦点
    			if(!beforeVal) {
    				document.getElementById('input' + (index - 1)).focus();
    				this.index = index - 1;
    			}
    		} else {
    			for(var i = 0;i < this.pwdLength;i++) {
					document.getElementById('input' + i).value = '';
					document.getElementById('input' + i).type = 'tel';
				}
    			this.index = 0;
    		}
    	},
    	//失去焦点
    	handleBlur: function(e) {
			e.currentTarget.type = 'password';
    	},
    	//删除
    	handleRemove: function(e) {
    		var currId = e.currentTarget.id;
    		var index = currId.split('input')[1];
    		document.getElementById('input' + (index - 1)).type = 'tel';
    		//文本框不是第一个时
    		if(index > 0) {
				for(var i = index;i < this.pwdLength;i++) {
					document.getElementById('input' + i).value = '';
				}
				this.index = index - 1;
				document.getElementById('input' + (index - 1)).focus();
    		} else {
    			for(var i = 0;i < this.pwdLength;i++) {
					document.getElementById('input' + i).value = '';
				}
    			document.getElementById('input0').type = 'tel';
    			this.index = 0;
    		}
    	}
    }
}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style scoped>
.pwd-input-box {
	position: relative;
	top: 0rem;
	left: 0;
	width: 72%;
	min-width: 27.5rem;
	height: 4.6rem;
	line-height: 4.5rem;
	margin: 0 auto;
	border: 0.1rem solid #cdcdcd;
	box-sizing: border-box;
}
.pwd-input-box.red-box {
	box-sizing: border-box;
	width: 100%;
	min-width: auto;
	height: 4.8rem;
	border: 0.1rem solid #ff4242;
	border-radius: 0.5rem;
}
.pwd-input-box.red-box input {
	margin-top: 0.1rem;
}
.pwd-input-box.red-box input:first-child {
	margin-left: 0.1rem;
}
.pwd-input-box input {
	position: absolute;
	top: 0.1rem;
	left: 0rem;
	/*width: 4.4rem;*/
	width: 16.5%;
	height: 4.3rem;
	line-height: 4.3rem;
	font-size: 2.6rem;
	box-sizing: border-box;
	border-right: 0.1rem solid #cdcdcd;
	text-align: center;
	border-radius: 0 !important;
	/*margin-right: 0.1%;*/
}
.pwd-input-box input:last-child,
.pwd-input-box.red-box input:last-child  {
	border-right: none;
}
.pwd-input-box input:nth-child(1) {
	left: 0;
}
.pwd-input-box input:nth-child(2) {
	left: calc(16.6% + 0.1rem);
}
.pwd-input-box input:nth-child(3) {
	left: calc(33.2% + 0.1rem);
}
.pwd-input-box input:nth-child(4) {
	left: calc(49.8% + 0.1rem);
}
.pwd-input-box input:nth-child(5) {
	left: calc(66.4% + 0.1rem);
}
.pwd-input-box input:nth-child(6) {
	left: calc(83% + 0.1rem);
}
</style>
