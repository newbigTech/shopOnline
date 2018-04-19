import Vue from 'vue'

/* 配置参数 */
Vue.prototype.title = '商城Erp营销管理系统';

Vue.prototype.winH = document.documentElement.clientHeight;

Vue.prototype.pageSize = 10; //页面显示条数

//接口域名
Vue.prototype.baseUrl = 'http://192.168.1.252:8039'; //测试环境：Erp接口域名 
//Vue.prototype.baseUrl = 'http://erpservice.mall.yipingoo.com'; //线上环境：Erp接口域名 


/**
 * 身份证号校验
 */
Vue.prototype._isCardNo = function(_card) {
    var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if (reg.test(_card) === false) { return false }
    return true;
}
/**
 * 中文校验
 */
Vue.prototype._isChinese = function(_chinese) {
    var reg = /^[\u3220-\uFA29]+$/;
    if (reg.test(_chinese) === false) { return false }
    return true;
}

/**
 * 手机号码校验
 */
Vue.prototype._isPhone = function(phone) {
    var reg = /^0?1[3|4|5|8|7][0-9]\d{8}$/;
    if (reg.test(phone) === false) { return false }
    return true;
}

/*
 * 只能输入数字验证
 */
Vue.prototype._isNumber = function(numbers) {
    var reg = /^[0-9]*$/;
    if (reg.test(numbers) === false) { return false }
    return true
}

/** 银行卡 转换
 * 例如: 
 *     67479593265878
 *     6747 **** **** 78
 */
Vue.prototype.bankCard = function(_card) {
    var _cont = _card.length % 4 == 0 ? parseInt(_card.length / 4) - 1 : parseInt(_card.length / 4),
        _result = '';
    for (var i = 0; i < _card.length; i++) {
        if ((i < 4) || (i >= _cont * 4)) {
            _result += _card[i];
        } else {
            if (i % 4 == 0) {
                _result += ' *';
            }
            if (i % 4 != 0) {
                if (i % 4 == 3) {
                    _result += '* ';
                } else {
                    _result += '*';
                }
            }
        }
    }
    return _result;
}

/**
 * 加密银行卡号 -》 **** **** **** 1234
 * @param {Object} _card  需要加密的银行卡号 
 */
Vue.prototype.encryBankNo = function(_card) {
    var len = _card.length,
        a;
    if (len - 4 <= 0) {
        a = _card;
    } else {
        a = _card.substring(len - 4, len);
    }
    return '**** **** **** ' + a;
}

// 取得一个区间的随机整数
Vue.prototype._rand = function(n, m) {
    var random = Math.floor(Math.random() * (m - n + 1) + n);
    return random;
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
 * 保证中文在导出的时候是正常传输数据
 * @param {Object} cnCode 被传的中文
 */
Vue.prototype.chineseToURI = function (cnCode) {
	encodeURI(encodeURI(cnCode))
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
