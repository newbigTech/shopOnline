import Vue from 'vue'
import { MessageBox, Indicator } from 'mint-ui';

/* 配置参数 */
Vue.prototype.title = '益品购';

Vue.prototype.adInfo = '购物，想象不到的惊喜！'; //广告标语

Vue.prototype.onGood = {
    title: '益品购',
    onUnit: '积分',
    logo: 'static/img/logo.jpg',
    details: '校园购物 - 宅寄送, 准时, 准点, 送货上门. 支持线上下单,线下支付. ',
};

Vue.prototype.AdminUser = {
    name: '益品购-',
    header: '/static/img/header.png',
};

Vue.prototype.clientH = document.documentElement.clientHeight * 0.1;

// 接口域名 =>商城微信端
//Vue.prototype.baseUrl = 'http://wechat2.yipingoo.com';

Vue.prototype.baseUrl = 'http://192.168.1.252:8081'; //测试环境：接口域名 v2.0
//Vue.prototype.baseUrl = 'http://mobileservice.mall.yipingoo.com'; //线上环境：微信端接口域名 v2.0


// 页面域名=> 商城微信端
//Vue.prototype.onlineUrl = 'http://wx.yipingoo.com'; //v1.0
//Vue.prototype.onlineUrl = 'http://wechat.yipingoo.com'; //v2.0  生产环境
Vue.prototype.onlineUrl = 'http://test.wechat.yipingoo.com'; //v2.0  测试环境

// 登录类型为密码登录
Vue.prototype.pwdLogin = 1;

// 登录类型为短信验证码登录
Vue.prototype.codeLogin = 2;

// 运费
Vue.prototype.freight = (0).toFixed(2);

// 每页显示条数
Vue.prototype.pageSize = 10;

//客服电话
Vue.prototype.serviceTel = '0731-82197426';

/* 配置参数 END */


/* 公共函数 */
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
Vue.prototype.setDateFormat = function(_Date, type = null) {
    var _Year = _Date.getFullYear(),
        _Month = _Date.getMonth() + 1,
        _Day = _Date.getDate();
    if (_Month < 10) { _Month = '0' + _Month }
    if (_Day < 10) { _Day = '0' + _Day }
    var _time = _Year + '-' + _Month + '-' + _Day;
    if (type != null) {
        var h = _Date.getHours();
        if (h < 10) {
            h = '0' + h;
        }
        var mm = _Date.getMinutes();
        if (mm < 10) {
            mm = '0' + mm;
        }
        var ss = _Date.getSeconds();
        if (ss < 10) {
            ss = '0' + ss;
        }
        _time = _time + ' ' + h + ':' + mm + ':' + ss;
    }
    return _time;
}

/**
 * input[type=file]
 * 处理上传的图片(单个) 
 * @param {Object} Dom dom对象
 */
Vue.prototype.uploadImgFn = function(Dom) {
	var fileList = Dom.files;
	if(fileList.length == 0) {
//		Indicator.close(); 
		return false;
	}
    var fileObj = fileList[0];
    var fileType = fileObj.type;
    if (fileType != 'image/png' && fileType != 'image/jpeg' && fileType != 'image/jpg') {
        this.$toast('图片格式只能是jpg、jpeg或者png');
        Dom.innerText = '';
        Dom.value = '';
        return false;
    }
    var fileSize = fileObj.size / 1024 / 1024;
    if (fileSize > 5) {
        this.$toast('图片大小不能超过5M');
        return false;
    }
    
    var files = {
        fileObj: fileObj,
        fileUrl: URL.createObjectURL(fileObj)
    }
    return files;
}

/**
 * 手机号码验证
 * @param {Object} phone  手机号码 
 */
Vue.prototype.verifyPhone = function(phone) {
    var phoneReg = /^0?1[3|4|5|8|7][0-9]\d{8}$/;
    var flag = phoneReg.test(phone);
    if (!flag) {
        this.$toast('请输入正确的手机号码');
        return false;
    }
    return true;
}

/*
 * 只能输入数字验证
 */
Vue.prototype.verifyNumber = function(numbers) {
    var numberReg = /^[0-9]*$/;
    var flag = numberReg.test(numbers);
    if (!flag) {
        return {
            state: false,
            value: numbers.replace(/[^0-9]+/g, '')
        };
    }
    return {
        state: true,
        value: numbers
    };
}

Vue.prototype.verifyEmail = function(_email) {
    var verifyEmailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
    if (verifyEmailReg.test(_email)) { return false }
    return true
}
/*
 * 登陆密码验证
 */
Vue.prototype.verifyPwd = function(passwords) {
    var verifyPwdReg = /[^ ^\u4e00-\u9fa5]+$/;
    var flag = verifyPwdReg.test(passwords);
    if (!flag) {
        return {
            state: false,
            value: passwords.replace(/[ \u4e00-\u9fa5]+$/g, '')
        };
    }
    return {
        state: true,
        value: passwords
    };
}

/*
 * 登陆密码验证
 */
Vue.prototype.verifyNumber = function(numbers) {
    var numberReg = /^[0-9]*$/;
    var flag = numberReg.test(numbers);
    if (!flag) {
        return {
            state: false,
            value: numbers.replace(/[^0-9]+/g, '')
        };
    }
    return {
        state: true,
        value: numbers
    };
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
 * 判断是否登录
 */
Vue.prototype.hadLogin = function() {
    if (!this.userInfo) {
        this.$toast('请先登录');
        this.$router.push('/login');
        return false;
    }
    return true;
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
 * mint-ui mt-actionsheet使用
 * 上传图片格式限制（只能是jpg/gif）  
 * @param {Object} param  图片文件
 */
Vue.prototype.judgePicFormat = function(imgFile) {
	if(!imgFile) { return false; }
	
    var imgType = imgFile.fileObj.type;
    if (imgType != 'image/jpeg' && imgType != 'image/jpg' && imgType != 'image/png') {
        this.$toast('图片格式只能是jpg、jpeg或png');
        return false;
    }
    var fileSize = imgFile.fileObj.size / 1024 / 1024;
    if (fileSize > 5) {
        this.$toast('图片大小不能超过5M');
        return false;
    }
    return true;
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
 * 判断当前设备是IOS还是安卓
 */
Vue.prototype.isIosOrAndroid = function() {
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) { //判断iPhone|iPad|iPod|iOS
          
        return 'IOS';
    } else if (/(Android)/i.test(navigator.userAgent)) {  //判断Android
          
        return 'Android';
    }
}

/* 微信端支付 */
Vue.prototype.getWxPay = function(obj, successPath, errorPath = null) {
    if (typeof WeixinJSBridge == "undefined") {
        if (document.addEventListener) {
            document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady, false);
        } else if (document.attachEvent) {
            document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady);
            document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady);
        }
    } else {
        this.onBridgeReady(obj, successPath, errorPath);
    }
};
Vue.prototype.onBridgeReady = function(obj, successPath, errorPath = null) {
    WeixinJSBridge.invoke(
        'getBrandWCPayRequest', obj,
        function(res) {
            // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
            if (res.err_msg == "get_brand_wcpay_request:ok") {
                setTimeout(function() {
                    location.href = successPath;
                }, 100);
            } else {
                if (errorPath != null) {
                    setTimeout(function() {
                        location.href = errorPath;
                    }, 100);
                }
            }
        }
    );
};
/* 微信端支付  END*/

/**
 * 微信授权
 * @param {Object} redirect_uri  回调地址
 */
Vue.prototype.handleWxAuthor = function(redirect_uri) {
    var that = this;
    var reqUrl = this.baseUrl + '/customer/getWechatLoginRequest';
    this.$http.get(reqUrl).then(function(res) {
        if (!res) { return; }
        var weChatAuthRequestURL = res.weChatAuthRequestURL;
        var arr = weChatAuthRequestURL.split('redirect_uri=');
        weChatAuthRequestURL = arr[0] + 'redirect_uri=' + redirect_uri + arr[1];
        location.href = weChatAuthRequestURL;
    });
}

/**
 * 通过微信授权后的code 获取oppenid
 * @param {Object} param  不为null,调取商城微信登录 (wxLogin)
 */
Vue.prototype.getWxInfo = function(param = null) {
    var localUrl = window.location.href;
    var arr = localUrl.split('code=');
    if (arr.length <= 1) {
        return;
    }
    arr = arr[1].split('&');
    var that = this;
    var reqUrl = this.baseUrl + '/customer/wechatLoginAuthValidate';
    var params = {
        code: arr[0]
    }
    this.$http.get(reqUrl, { params: params })
        .then(function(res) {
            if (!res) { return; }
            localStorage.setItem('_loginWay', '');

            //失败：1.授权失败 2.未绑定商城用户
            //成功：3.授权验证成功
            var wxAuthResult = res.wxAuthResult;
            var msg = '',
                _wxLoginInfo = {};
            if (wxAuthResult == '1') {
                that.$toast('授权失败');
                return;
            }
            _wxLoginInfo = {
                openid: res.openid //微信OPENID
            }
            if (wxAuthResult == '2') {
                //已经登录时    传参:手机号码/oppenid  直接绑定商城
                if (that.userInfo != null) {
                    that.userInfo.wxId = res.openid;
                    that.handleBind(); //直接绑定商城用户
                    return;
                }

                that.$toast('请绑定手机号');
                localStorage.setItem('_wxLoginInfo', JSON.stringify(_wxLoginInfo));

                that.$router.push('/bindMobile');
            }
            if (wxAuthResult == '3') {
                _wxLoginInfo.wxLoginCode = res.wxLoginCode; //微信登陆码
                localStorage.setItem('_wxLoginInfo', JSON.stringify(_wxLoginInfo));

                that.$toast('授权验证成功');
                if (param != null) {
                    that.goWxLogin(_wxLoginInfo);
                }
            }
        });
}
/**
 * 更新商城用户微信绑定
 */
Vue.prototype.handleBind = function() {
    var that = this;
    var reqUrl = this.baseUrl + '/customer/updOpenIdByTel';
    var params = {
        openid: this.userInfo.wxId,
        phone: this.userInfo.phone
    }
    this.$http.post(reqUrl, params).then(function(res) {
        if (!res) { return; }
        that.userInfo = res;
        //      that.token = res.token;
        localStorage.setItem('userInfo', JSON.stringify(res));
        //      localStorage.setItem('token', res.token);
    });
}

/**
 * 商城的微信登录
 * @param {Object} _wxLoginInfo  微信登录信息
 */
Vue.prototype.goWxLogin = function(_wxLoginInfo) {
    Indicator.open({
        text: '登录中...',
        spinnerType: 'fading-circle'
    });
    var that = this;
    var reqUrl = this.baseUrl + '/customer/login';
    var params = {
        openid: _wxLoginInfo.openid,
        wxLoginCode: _wxLoginInfo.wxLoginCode,
        loginType: '3' //登陆类型，1=密码登录，2=短信验证码登录 3=微信登录
    }
    this.$http.post(reqUrl, params).then(function(res) {
        Indicator.close();
        if (!res) { return; }
        if (res.isExitPwd == '2') { //没有设置登录密码
            MessageBox({
                title: '',
                message: '未设置登录密码',
                confirmButtonText: '前往设置',
                cancelButtonText: '取消',
                showCancelButton: true
            }).then(function(action) {
                if (action == 'confirm') {
                    that.$router.push('/loginPassword');
                } else {}
            })
            //          that.$toast('请前往个人中心设置登录密码');
        }
        that.userInfo = res;
        that.token = res.token;
        localStorage.setItem('userInfo', JSON.stringify(res));
        localStorage.setItem('token', res.token);
        that.$router.push('/');
    });
}
/**
 * 公共输入金额格式化
 * @param {Object} a 是需要被处理的值
 */
Vue.prototype.onlyMoney = function(a) {
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

Vue.prototype._bankName = function(_name) {
    var _result = '';
    for (var i = 0; i < _name.length; i++) {
        if (i == (_name.length - 1)) {
            _result += _name[i];
        } else {
            _result += '*';
        }
    }
    return _result;
}

/** 银行卡 转换
 * 例如: 
 *     67479593265878
 *     6747 **** **** 78
 */
Vue.prototype._bankCrad = function(_card) {
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

/* 设置 银行卡号 
 * 例如: 
 *     67479593265878
 *     6747 9593 2658 78
 */
Vue.prototype._setBankCrad = function(_card) {
    var _Reg = /^[0-9]*$/,
        _cont = 0,
        _result = '';
    for (var i = 0; i < _card.length; i++) {
        if (_Reg.test(_card[i])) {
            if (_cont == 4) {
                _result += ' ' + _card[i];
                _cont = 1;
            } else {
                _result += _card[i];
                _cont++;
            }
        }
    }
    return _result;
}


/**
 * 时间差函数
 * _time 作为一个参数, 格式必须为 '2018-01-25 12:00:00' 或 '12:00:00';
 * _state 传入 count, 此为直接毫秒倒计时
 * _state 作为一个可选参数, 如果不传, 为 传入时间在当前时间前, 否者 传入时间在当前时间后.
 * 如果时间格式是正确的，那下面这一步转化时间格式就可以不用了
 */
Vue.prototype._timeFn = function(_time, _state) {
    if (_state == 'count') {
        _time -= 1000;
        var dateDiff = _time;
    } else {
        var reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;
        if (_time.match(reg) == null) {
            var _reg = /^(\d{1,2}):(\d{1,2}):(\d{1,2})$/;
            if (_time.match(_reg) == null) {
                console.log('_timeFn(), 没有传入有效参数: 请输入如 \'2018-01-25 12:00:00\' 或 \'12:00:00\'');
                return false;
            } else {
                var _new = new Date();
                _time = _new.getFullYear() + '-' + (_new.getMonth() + 1) + '-' + (_new.getDate() + 1) + ' ' + _time;
            }
        }
        var dateBegin = new Date(_time.replace(/-/g, "/")), // 将-转化为/，使用new Date
            dateEnd = new Date(); // 获取当前时间
        if (_state != undefined) {
            var dateDiff = dateBegin.getTime() - dateEnd.getTime(); // 时间差的毫秒数
        } else if (_state == 'end') {
            var dateDiff = dateEnd.getTime() - dateBegin.getTime(); // 时间差的毫秒数
        }
    }
    var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000)), // 计算出相差天数
        leave1 = dateDiff % (24 * 3600 * 1000), // 计算天数后剩余的毫秒数
        hours = Math.floor(leave1 / (3600 * 1000)), // 计算出小时数
        // 计算相差分钟数
        leave2 = leave1 % (3600 * 1000), // 计算小时数后剩余的毫秒数
        minutes = Math.floor(leave2 / (60 * 1000)), // 计算相差分钟数
        // 计算相差秒数
        leave3 = leave2 % (60 * 1000), // 计算分钟数后剩余的毫秒数
        seconds = Math.round(leave3 / 1000);
    // console.log(" 相差 " + dayDiff + "天 " + hours + "小时 " + minutes + "分钟 " + seconds + "秒")
    // console.log(dateDiff + "时间差的毫秒数", dayDiff + "计算出相差天数", leave1 + "计算天数后剩余的毫秒数", hours + "计算出小时数", minutes + "计算相差分钟数", seconds + "计算相差秒数");
    var _result = {
        dateDiff: dateDiff,
        days: dayDiff,
        daysStr: [
            (dayDiff > 9 ? dayDiff.toString().slice(0, 1) : '0'),
            (dayDiff > 9 ? dayDiff.toString().slice(1, 2) : dayDiff.toString().slice(0, 1)),
        ],
        hours: hours,
        hoursStr: [
            (hours > 9 ? hours.toString().slice(0, 1) : '0'),
            (hours > 9 ? hours.toString().slice(1, 2) : hours.toString().slice(0, 1)),
        ],
        minutes: minutes,
        minutesStr: [
            (minutes > 9 ? minutes.toString().slice(0, 1) : '0'),
            (minutes > 9 ? minutes.toString().slice(1, 2) : minutes.toString().slice(0, 1)),
        ],
        seconds: seconds,
        secondsStr: [
            (seconds > 9 ? seconds.toString().slice(0, 1) : '0'),
            (seconds > 9 ? seconds.toString().slice(1, 2) : seconds.toString().slice(0, 1)),
        ],
    }
    return _result;
}

/**
 * 身份证号验证
 * @param {Object} _card 输入的号码
 */
Vue.prototype._isCardNo = function(_card) {
    // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X  
    var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if (reg.test(_card) === false) {
        this.$toast('请输入正确的身份证');
        return false;
    } else {
        return true;
    }
}

/**
 * [_getCookie 获取Cookie]
 * @param  {[type]} c_name [存储名称]
 * @return {[type]}        [存储值]
 */
Vue.prototype._getCookie = function(c_name) {
    if (document.cookie.length > 0) {
        var c_start = document.cookie.indexOf(c_name + "=")
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1
            var c_end = document.cookie.indexOf(";", c_start)
            if (c_end == -1) c_end = document.cookie.length
            return unescape(document.cookie.substring(c_start, c_end))
        }
    }
    return ""
}

/**
 * [_setCookie 设置Cookie ]
 * @param {[type]} c_name     [存储名称]
 * @param {[type]} value      [存储值]
 * @param {[type]} expiredays [存储时间]
 * @param {[type]} isday      [是否天]
 * 注意: expiredays 为天数
 * cookie.setMaxAge(0);         //不记录cookie
 * cookie.setMaxAge(-1);        //会话级cookie，关闭浏览器失效 
 * cookie.setMaxAge(60*60);     //过期时间为1小时
 */
Vue.prototype._setCookie = function(c_name, value, expiredays, isday) {
    expiredays = (expiredays == undefined ? 1 : expiredays)
    var exdate = new Date()
    if (isday != undefined) {
        exdate.setHours(exdate.getHours() + expiredays)
    } else {
        exdate.setDate(exdate.getDate() + expiredays)
    }
    document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : "; expires=" + exdate.toGMTString());
}


/* 调取在线客服 */
//客服
Vue.prototype.hanldleContact = function() {
	var that = this;
	try{ ysf } catch(e) { return; }
	setTimeout(function() {
        ysf.config({ uid: "1442286211167" });
        ysf.open();
    }, 500);
//	const s = document.createElement('script');
//  s.type = 'text/javascript';
//  s.src = 'https://qiyukf.com/script/f66be35e85026afe562d310df49518f8.js';
//  document.getElementById('MessageCenter').appendChild(s);
//  // document.body.appendChild(s);
//  var that = this;
//  setTimeout(function() {
//  	that.openContactWin();
//  }, 1000)
}
//Vue.prototype.openContactWin = function() {
//	ysf.config({
//      uid: "1442286211167"
//  });
//  ysf.open();
//}
/* 公共函数 END */
