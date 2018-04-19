import Vue from 'vue'

import { MessageBox,Indicator,Toast } from 'mint-ui';

import axios from 'axios'
Vue.prototype.$http = axios

//http request 拦截器
axios.interceptors.request.use(
  	function(config) {
  		config.headers = {
	      'Content-Type': 'application/x-www-form-urlencoded'
	   	};
        var token = localStorage.getItem('token');
        if(config.method == 'get') {
            if(token) {
                if((!config.params) || ((config.params != undefined) && (!config.params.token))) {
                	var userInfo = JSON.parse(localStorage.getItem('userInfo'));
                    var customerCode = userInfo.customerCode;
                    if(!config.params) {
                        config.params = {
                            'token': token,
                            'customerCode': customerCode
                        };
                    } else {
                        config.params.token = token;
                        config.params.customerCode = customerCode;
                    }
                }
            }
            var params = config.params;
  			for(var i in params) {
  				var reg = new RegExp("[\\u4E00-\\u9FFF]+","g");
				var val = params[i];
				if(reg.test(val)) {
					params[i] = encodeURI(val);
				}
  			}
            config.data = config.params;
        }
        if(config.method == 'post') {
            if(config.data.formData == undefined) {
                config.data = hendleParams(config.data);
            } else {
                config.headers = {
                  'Content-Type': 'application/x-www-form-urlencoded'//;multipart/form-data
                };
                var formData = config.data.formData;
               //需要参数中传token和customerCode
//              var token2 = formData.get('token'); 
// 				var token = localStorage.getItem('token');
//              if(token == null) {// && token2 == null
//                  var customerCode = JSON.parse(localStorage.getItem('userInfo')).customerCode;
//                  formData.append('token', token);
//                  formData.append('customerCode', customerCode);
//              }
                config.data = formData;
			}
		}
	    return config;
  	},
  	function(error) {
    	return Promise.reject(error);
  	}
);
/**
 * 处理请求参数
 * @param {Object} params 请求参数
 */
function hendleParams(params) {
	var result;
	var index = 0;
	for(var i in params) {
		if(index == 0) {
			result =  i + '=' + params[i];
		} else {
			result += '&' + i + '=' + params[i]
		}
		index++;
	}
	var token = localStorage.getItem('token');
	if( token && (!params.token) && params.sendJson == null ) {
		var customerCode = JSON.parse(localStorage.getItem('userInfo')).customerCode;
		result += '&token=' + token + '&customerCode=' + customerCode;
	}
	return result;
}

// http response 拦截器
axios.interceptors.response.use(
   	function(response) {
        if (response.data == '' || response.data == null) { Vue.$toast('网络慢,请稍后..再访问'); }
	  	var resData = response.data;
	    var resultInfo = resData.resultInfo;
	    if(resultInfo.code != '0000') {
            if(resultInfo.code == '8888' && resultInfo.description == '登录已失效，请重新登录') {
                // window.localStorage.clear();
				localStorage.removeItem('userInfo');
				localStorage.removeItem('token');
            	var arr = location.href.split('/pdDetails');
            	if(arr.length <= 1) { //当前不是商品详情页时
            		Toast(resultInfo.description);
            		location.href = '/login';
            	} 
	    		return 0;//false;
	    	}
            if(resultInfo.code == 'BC0001' && resultInfo.description == '客户信息不存在') { //客户信息不存在
            	Toast(resultInfo.description);
            	localStorage.clear();
            	location.href = '/login';
	    		return false;
            }
            if(resultInfo.code == 'BC0001' && resultInfo.description == '商品（产品）ID信息不存在') { //商品信息不存在
            	location.href = '/goodsExpired';
	    		return false;
            }
            if(resultInfo.code == '9998' && resultInfo.description == '支付密码错误次数过多,请稍后再试') { //支付次数过多
            	Toast(resultInfo.description);
	    		return resultInfo;
            }
            if(resultInfo.code == '9998' && resultInfo.description == '支付密码错误，请重试!') { //支付密码错误（升级商品购买）
            	Toast(resultInfo.description);
	    		return '支付密码错误';
            }
            if(resultInfo.code == '9998' && resultInfo.description == '登录失败！登录手机号或密码错误！') {//登录手机号或密码错误
            	return '账号或密码错误';
            }
            if(resultInfo.code == '9998' && resultInfo.description == '该商品已下架！') {//商品过期、下架、删除
            	return '商品过期';
            }
            Toast(resultInfo.description);
	    	return false;
	    }
	    var successData = resData.data;
	    if(successData == 0) {
	    	successData = 'success';
	    }
	    return successData;
  	},
  	function(error) {
    	return Promise.reject(error)
  	}
)

