import Vue from 'vue'

/* 配置参数 */
Vue.prototype.title = '益品购后台管理系统';

Vue.prototype.winH = document.documentElement.clientHeight;

//接口域名
Vue.prototype.baseUrl = 'http://192.168.1.252:8082'; //测试环境：接口域名 v2.0
//Vue.prototype.baseUrl = 'http://mgservice.mall.yipingoo.com'; //线上环境：接口域名 v2.0

Vue.prototype.normalStatus = 1; //状态正常
Vue.prototype.invalidStatus = 0; //状态失效

Vue.prototype.pageSize = 10; //每页记录数
Vue.prototype.maxPageSize = 100; //每页最大的记录数

//商品类型（积分 / 升级）
Vue.prototype.goodsType = [
	{'label': '普通商品', 'value': 1},
	{'label': '促销专区', 'value': 2},
	{'label': '增值专区', 'value': 3}
]

/* 配置参数 END */


/* 公共函数 */


/**
 * 强制2位小时金额
 * @param {[type]} _money [description]
 */
Vue.prototype.setFullMoney = function(_money){
    _money = parseFloat(_money);
    if (_money%1 != 0 ) {
        return parseFloat(this.doubleFloat(_money.toString()));
    }
    return _money;
}

/**
 * 浮点型数据 乘法
 * 例如: 696.9 = 555.6 + 141.3;
 * return 696.9;
 */
Vue.prototype.NumberMul = function(arg1, arg2) {
    var m = 0;
    var s1 = arg1.toString();
    var s2 = arg2.toString();
    try {
        m += s1.split(".")[1].length;
    } catch (e) {}
    try {
        m += s2.split(".")[1].length;
    } catch (e) {}

    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
}

/**
 * 浮点型数据 加法
 * 例如: 696.9 = 555.6 + 141.3;
 * return 696.9;
 */
Vue.prototype.NumberAdd = function(arg1, arg2) {
    var r1, r2, m, n;
    try {
        r1 = arg1.toString().split(".")[1].length
    } catch (e) {
        r1 = 0
    }
    try {
        r2 = arg2.toString().split(".")[1].length
    } catch (e) { r2 = 0 } m = Math.pow(10, Math.max(r1, r2))
    n = (r1 >= r2) ? r1 : r2;
    return ((arg1 * m + arg2 * m) / m).toFixed(n);
}
/**
 * 浮点型数据 减法
 * 例如: 555.39 = 696.95 - 141.56;
 * return 555.39;
 */
Vue.prototype.NumberDiv = function(arg1, arg2) {
    var r1, r2, m, n;
    try {
        r1 = arg1.toString().split(".")[1].length;
    } catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    } catch (e) {
        r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2)); //last modify by deeka //动态控制精度长度
    n = (r1 >= r2) ? r1 : r2;
    return ((arg1 * m - arg2 * m) / m).toFixed(n);
}
/**
 * 设置日期格式
 * @param {String} 强制返回字符串日期格式 2000-01-01
 */
Vue.prototype.setDateFormat = function(_Date) {
    var _Year = _Date.getFullYear(),
        _Month = _Date.getMonth() + 1,
        _Day = _Date.getDate();
    if (_Month < 10) { _Month = '0' + _Month }
    if (_Day < 10) { _Day = '0' + _Day }
    return _Year + '-' + _Month + '-' + _Day;
}

/**
 * 手机号码验证
 * @param {Object} phone  手机号码 
 */
Vue.prototype.verifyPhone = function(phone) {
    var phoneReg = /^0?1[3|4|5|8|7][0-9]\d{8}$/;
    var flag = phoneReg.test(phone);
    if (!flag) {
        this.$message('请输入正确的手机号码');
        return false;
    }
    return true;
}

/**
 * 加密手机号码
 * @param {Object} param  需要加密手机号码
 */
Vue.prototype.encryptPhone = function(param) {
    var param = param.toString();
    return param.substring(0, 3) + '****' + param.substring(7, 11);
}

/**
 * 去字符串中所有空格
 * @param {Object} str 需要去空格的字符串
 */
Vue.prototype.deleteSpaceAll = function(str) {
    return str.replace(/\s/g, "");
}

/**
 * 去字符串中左右两边的空格
 * @param {Object} str 需要去空格的字符串
 */
Vue.prototype.deleteSpaceLR = function(str) {
    return str.replace(/(^\s*)|(\s*$)/g, '');
}

/**
 * 判断是否为空
 * @param {Object} str 
 */
Vue.prototype.isNull = function(str = '') {
	if(str.replace(/(^s*)|(s*$)/g, "").length == 0) {
		return true;
	}
   	return false;
}

/**
 * 处理上传的图片(单个)
 * @param {Object} Dom input[type=file]的dom对象 eg:document.getElementById('xxx');
 */
Vue.prototype.uploadImgFn = function(Dom) {
    var fileObj = Dom.files[0];
    var fileType = fileObj.type;
    if (fileType != 'image/png' && fileType != 'image/jpeg') {
        this.$message.error('上传图片只能是 JPG, PNG 格式!');
        Dom.innerText = '';
        Dom.value = '';
        return false;
    }
    var files = {
        fileObj: fileObj,
        fileUrl: URL.createObjectURL(fileObj)
    }
    return files;
}

/**
 * 格式化时间 yyyy-mm-dd
 * @param {Object} param 需要格式化的时间(GMT时间)
 */
Vue.prototype.formatDate = function(param, type = null) {
    var a = new Date(param);
    var m = a.getMonth() + 1;
    if (m < 10) {
        m = '0' + m;
    }
    var d = a.getDate();
    if (d < 10) {
        d = '0' + d;
    }
    var b = a.getFullYear() + '-' + m + '-' + d;

    if (type != null) {
        var h = a.getHours();
        if (h < 10) {
            h = '0' + h;
        }
        var mm = a.getMinutes();
        if (mm < 10) {
            mm = '0' + mm;
        }
        var ss = a.getSeconds();
        if (ss < 10) {
            ss = '0' + ss;
        }
        b = b + ' ' + h + ':' + mm + ':' + ss;
    }
    return b;
}

// 取得一个区间的随机整数
Vue.prototype._rand = function(n, m) {
    var random = Math.floor(Math.random() * (m - n + 1) + n);
    return random;
}

/**
 * 公共输入金额格式化(保留小数0.01位)
 * @param {Object} a 是需要被处理的值
 */
Vue.prototype.doubleFloat = function(a) {
    //先把非数字的都替换掉，除了数字和.     
    a = a.replace(/[^\d\.]/g, '');
    //必须保证第一个为数字而不是.       
    a = a.replace(/^\./g, '');
    //保证只有出现一个.而没有多个.       
    a = a.replace(/\.{2,}/g, '.');
    //保证.只出现一次，而不能出现两次以上       
    a = a.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
    //只能输入两位小数  
    a = a.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
    return a;
}
/* 公共函数 END */
