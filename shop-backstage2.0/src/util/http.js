import Vue from 'vue'

import axios from 'axios'
Vue.prototype.$http = axios

import { Message } from 'element-ui';

//http request 拦截器
axios.interceptors.request.use(
  	function(config) {
  		config.headers = {
	      'Content-Type': 'application/x-www-form-urlencoded'
	   	};
   		var token = localStorage.getItem('token');
  		if(config.method == 'get') {
  			var params = config.params;
  			for(var i in params) {
  				var reg = new RegExp("[\\u4E00-\\u9FFF]+","g");
				var val = params[i];
				if(reg.test(val)) {
					params[i] = encodeURI(val);
				}
  			}
  			
  			if(token) {
  				if((!params) || ((params != undefined) && (!params.token))) {
  					if(!params) {
		  				params = {'token': token};
		  			} else {
		  				params.token = token;
		  			}
  				}
	  		}
		   	config.data = params;
  		}
		if(config.method == 'post') {
			
			if(config.data.formData == undefined) {
				config.data = hendleParams(config.data)
			} else {
				config.headers = {
			      	'Content-Type': 'application/x-www-form-urlencoded;multipart/form-data'
			   	};
			   	var formData = config.data.formData;
			   	var token2 = formData.get('token');
			   	if(token && (token2 == null)) {
		   			formData.append('token', token);
			   	}
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
			result += '&' + i + '=' + params[i];
		}
		index++;
	}
	var token = localStorage.getItem('token');
	if(token && (!params.token) && (params.sendJson == undefined)) {
		var token = localStorage.getItem('token');
		result += '&token=' + token;
	}
	return result;
}
//http response 拦截器

axios.interceptors.response.use(
   	function(response) {
	  	var resData = response.data;
	    var resultInfo = resData.resultInfo;
	    if(resultInfo.code != '0000') {
	    	Message(resultInfo.description);
            if(resultInfo.code = '8888' && resultInfo.description == '登录已失效，请重新登录') {
	    		window.localStorage.clear();
	    		location.href = '/';
	    		return false;
	    	}
	    	return false;
	    }
	    var successData = resData.data;
	    if(successData == 0 || successData == null) {
	    	successData = 'success';
	    }
	    return successData;
  	},
  	function(error) {
    	return Promise.reject(error)
  	}
)
