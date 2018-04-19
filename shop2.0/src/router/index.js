import Vue from 'vue'
import Router from 'vue-router'

import Index from '@/components/index' // 首页 => 视图
import home from '@/components/home/home' // 首页内容
import BindMobile from '@/components/login/bindMobile' //绑定手机号

import Register from '@/components/register/register' //注册
import registerSuccess from '@/components/register/registerSuccess' //注册成功
import registerProtocol from '@/components/register/registerProtocol' //注册协议
import inviteRegister from '@/components/register/inviteRegister' //邀请好友注册

import Login from '@/components/login/login' // 登录
import ForgetPwd from '@/components/forgetPwd/forgetPwd' // 忘记密码

import PdDetails from '@/components/home/pdDetails' // 商品详情
import JoinCart from '@/components/home/joinCart' // 加入购物车
import GoBuy from '@/components/home/goBuy' // 去付款
import shoppingCartGoBuy from '@/components/home/shoppingCartGoBuy' // 购物车-去付款
import choosePayWay from '@/components/home/choosePayWay' // 选择支付方式
import BuySuccess from '@/components/home/buySuccess' // 支付完成
import Comment from '@/components/home/comment' // 评论
import Search from '@/components/home/search' // 搜索
import SearchResult from '@/components/home/searchResult' // 搜索结果

import Integral from '@/components/home/integral' // 积分乐园
import LuckDraw from '@/components/home/luckDraw' // 抽奖

import FirstClass from '@/components/class/firstClass' // 一级分类
import SecondClass from '@/components/class/secondClass' // 二级分类
import ProductList from '@/components/class/productList' // 商品列表
import GoodsExpired from '@/components/class/goodsExpired' // 商品信息不存在


import My from '@/components/my/view' // 我的 => 视图
import User from '@/components/my/userIndex' // 我的 => 个人信息
import UserInfo from '@/components/my/user/userInfo' // 我的 => 个人信息
import Setting from '@/components/my/user/setting' // 我的 => 个人信息
import Collect from '@/components/my/collect/collect' // 我的 => 个人收藏
import MyIntegral from '@/components/my/integral/integral' // 我的 => 个人收藏
import MyTrace from '@/components/my/trace/trace' // 我的 => 个人足迹

import changePhone from '@/components/my/setting/changePhone/changePhone' // 我的 => 变更手机号
import confirmPassword from '@/components/my/setting/changePhone/confirmPassword' // 我的 => 变更手机号  => 确认支付密码
import loginPassword from '@/components/my/setting/loginPassword/resetLoginPassword' // 我的 => 设置/重置登录密码
import setPayPassword from '@/components/my/setting/payPassword/setPayPassword' // 我的 => 设置/重置支付密码


import OrderList from '@/components/my/order/orderList' // 我的 => 订单列表
import OrderInfo from '@/components/my/order/orderInfo' // 我的 => 订单详情
import OrderAppraise from '@/components/my/order/orderAppraise' // 我的 => 订单详情 => 评价
import OrderAppraiseSuccess from '@/components/my/order/orderAppraiseSuccess' // 我的 => 订单详情 => 评价
import OrderLogistics from '@/components/my/order/logistics' // 我的 => 订单 => 物流

import AfterSales from '@/components/my/order/afterSales' // 我的 => 申请售后
import AfterSalesList from '@/components/my/order/afterSalesList' // 我的 => 售后列表
import AfterSalesState from '@/components/my/order/afterSalesState' // 我的 => 售后详情

import AfterSalesNegotiate from '@/components/my/order/afterSalesNegotiate' // 我的 => 售后详情 = 协商

import address from '@/components/my/receivingAddress/receivingAddress' // 我的 => 收货地址
import add from '@/components/my/receivingAddress/addAddress' // 我的 => 增加收货地址

import invitingFriends from '@/components/my/invitingFriends/invitingFriends' // 我的 => 邀请好友list
import myInviting from '@/components/my/invitingFriends/myInviting' // 我的 => 邀请列表
import myCode from '@/components/my/invitingFriends/myCode' // 我的 => 邀请好友二维码
import invitationSuccess from '@/components/my/invitingFriends/invitationSuccess' // 我的 => 邀请您体验榛品购-注册成功
import invitationForm from '@/components/my/invitingFriends/invitationForm' // 我的 => 邀请您体验榛品购-注册表单

import opinion from '@/components/my/opinion/opinion' // 我的 => 意见反馈
import opinionList from '@/components/my/opinion/opinionList' // 我的 => 意见反馈列表

import helpCenter from '@/components/my/helpCenter/helpCenter' // 我的 => 帮助中心
import helpList from '@/components/my/helpCenter/helpList' // 我的 => 帮助中心 => 列表
import helpQuery from '@/components/my/helpCenter/helpQuery' // 我的 => 帮助中心 => 搜索列表
import helpDetails from '@/components/my/helpCenter/helpDetails' // 我的 => 帮助中心 => 问题详情

import ShoppingCart from '@/components/shop/shoppingCart' // 我的 => 购物车

import moneyIndex from '@/components/my/money/moneyIndex' //账户余额首页
import balance from '@/components/my/money/accountDetails/balance' //我的=>账户明细=>余额明细
import payDetails from '@/components/my/money/accountDetails/payDetails' //我的=>账户明细=>余额明细=>充值提现详情
import recycleDetails from '@/components/my/money/accountDetails/recycleDetails' //我的=>账户明细=>余额明细=>回收详情详情

import withDraw from '@/components/my/money/withDraw/withDraw' //我的=>账户明细=>提现=>提现
import withDrawResult from '@/components/my/money/withDraw/withDrawResult' //我的=>账户明细=>提现=>提现结果

import moneyRecharge from '@/components/my/money/recharge/moneyRecharge' //我的=>账户余额-充值
import mRSuccess from '@/components/my/money/recharge/mRSuccess' //我的=>账户余额-充值成功
import myBankCard from '@/components/my/money/bankcard/myBankCard' //我的=>账户余额-我的银行卡
import manageBank from '@/components/my/money/bankcard/manageBank' //我的=>账户余额-添加银行卡/管理银行卡
import manageBank1 from '@/components/my/money/bankcard/manageBank1' //我的=>账户余额-添加银行卡/管理银行卡-第一步
import manageBank2 from '@/components/my/money/bankcard/manageBank2' //我的=>账户余额-添加银行卡/管理银行卡-第二步
import manageBank3 from '@/components/my/money/bankcard/manageBank3' //我的=>账户余额-添加银行卡/管理银行卡-第三步
import manageBankSuccess from '@/components/my/money/bankcard/manageBankSuccess' //我的=>账户余额-添加银行卡/管理银行卡 - 成功
import phoneWarn from '@/components/my/money/bankcard/phoneWarn' //我的=>账户余额-手机号不符提示


import MessageCenter from '@/components/msg/MessageCenter' //消息中心
import ShopSales from '@/components/msg/ShopSales' //商城活动
import LogisticsNotification from '@/components/msg/LogisticsNotification' //物流通知
import MallAnnouncement from '@/components/msg/MallAnnouncement' //商城公告
import AnnouncementDetails from '@/components/msg/AnnouncementDetails' //商城公告详情
import MessageNotification from '@/components/msg/MessageNotification'  //通知消息

import upgadeRecord from '@/components/upgrade/upgadeRecord'  //升级的列表
import upgadesRecord from '@/components/upgrade/child/upgadesRecord'  //升级记录
import packetRecord from '@/components/upgrade/child/packetRecord'  //红包记录
import lotteryList from '@/components/upgrade/lotteryList'  //开奖榜单

import guessSize from '@/components/game/guessSize' //猜大小
import guessGift from '@/components/game/guessGift' //猜红包

import areaIndex from '@/components/upgrade/areaIndex' //专区列表

import upgradeIndex from '@/components/upgrade/upgradeIndex' //升级专区 - 首页
import upDetail from '@/components/upgrade/upDetail' //升级专区 - 升级商品详情
import upGoBuy from '@/components/upgrade/upGoBuy' //升级专区 - 订单付款
import upBuySuccess from '@/components/upgrade/upBuySuccess' //升级专区 - 升级产品购买成功

import myUpgrade from '@/components/upgrade/myUpgrade' // 我的升级订单
import pickGoods from '@/components/upgrade/pickGoods' // 我的升级订单

import wineArea from '@/components/area/wineArea' // 红酒专区
import wineDetail from '@/components/area/wineDetail' // 红酒详情
import gameAreaProm from '@/components/area/gameAreaProm' // 促销专区游戏规则
import gameAreaIncre from '@/components/area/gameAreaIncre' // 增值专区游戏规则
import BlackTea from '@/components/area/blackTea' // 安化黑茶
import HundredTea from '@/components/area/hundredTea' // 百年茂记
import Yanxihong from '@/components/area/yanxihong' // 百年茂记
import registerArea from '@/components/area/registerArea' // 注册专区（新人注册送体验券）

import experArea from '@/components/coupon/experArea' // 体验券区
import Coupon from '@/components/coupon/coupon' // 优惠券
import CouponUnused from '@/components/coupon/child/couponUnused' // 未使用优惠券
import CouponUsed from '@/components/coupon/child/couponUsed' // 已使用优惠券
import invalidCoupon from '@/components/coupon/invalidCoupon' // 已失效优惠券

import brandDetail from '@/components/brand/brandDetail' // 品牌详情页

Vue.use(Router)

let router = new Router({
	mode: 'history',
//	saveScrollPosition: true,
//	scrollBehavior (to, from, savedPosition) {
//		if(savedPosition) {
// 			return savedPosition
// 		} else {
// 			const position = {}
//		 	if(to.hash) {
//		 		position.selector = to.hash
//		 	}
//		 	if(to.matched.some(m => m.meta.scrollToTop)) {
//		 		position.x = 0
//		 		position.y = 0
//		 	}
//		 	return position
//		}
//	},
	routes: [
		{ path: '/', name: 'Index', title: '首页', component: Index},/*meta: {keepAlive : true, scrollToTop: true }*/
		{ path: '/login', name: 'Login', title: '登录', component: Login },
		{ path: '/register',name: 'Register',title: '注册',component: Register},
		{ path: '/registerSuccess',name: 'registerSuccess',title: '注册成功',component: registerSuccess},
		{ path: '/registerProtocol',name: 'registerProtocol',title: '注册协议',component: registerProtocol},
		{ path: '/inviteRegister',name: 'inviteRegister',title: '邀请您体验榛品购',component: inviteRegister},
		{ path: '/bindMobile', name: 'BindMobile', component: BindMobile },
		{ path: '/forgetPwd', name: 'ForgetPwd', title: '忘记密码', component: ForgetPwd },	
		
		{ path: '/pdDetails', name: 'PdDetails', title: '商品详情', component: PdDetails },
		{ path: '/joinCart', name: 'JoinCart', title: '加入购物车', component: JoinCart },

		{ path: '/goBuy', name: 'GoBuy', title: '去付款', component: GoBuy },
		{ path: '/choosePayWay', name: 'choosePayWay', title: '选择支付方式', component: choosePayWay },
		{ path: '/buySuccess', name: 'BuySuccess', title: '支付完成', component: BuySuccess },
		
		{ path: '/search', name: 'Search', title: '搜索', component: Search },
		{ path: '/searchResult', name: 'SearchResult', title: '搜索结果', component: SearchResult },
		{ path: '/comment', name: 'Comment', title: '评论', component: Comment },
		{ path: '/integral', name: 'Integral', title: '积分乐园', component: Integral },
		{ path: '/luckDraw', name: 'LuckDraw', title: '抽奖', component: LuckDraw },

		{ path: '/firstClass', name: 'FirstClass', title: '一级分类', component: FirstClass },
		{ path: '/secondClass', name: 'SecondClass', title: '二级分类', component: SecondClass },
		{ path: '/productList', name: 'ProductList', title: '商品列表', component: ProductList },
		{ path: '/goodsExpired', name: 'GoodsExpired', title: '商品过期不存在', component: GoodsExpired },
		{
			path: '/my',
			name: 'My',
			title: '我的',
			component: My,
			children: [
                { path: '/myUpgrade', name: 'MyUpgrade', title: '升级订单', component: myUpgrade },   
				{ path: '/pickGoods', name: 'pickGoods', title: '提货', component: pickGoods },	

				{ path: '/user', name: 'MyUser', title: '我的个人中心', component: User },
				{ path: '/userInfo', name: 'MyUserInfo', title: '我的个人信息', component: UserInfo },
				{ path: '/userSetting', name: 'MySetting', title: '我的设置', component: Setting },
				{ path: '/userCollect', name: 'MyCollect', title: '我的收藏', component: Collect },
				{ path: '/userIntegral', name: 'MyIntegral', title: '我的积分', component: MyIntegral },
				{ path: '/userTrace', name: 'MyTrace', title: '我的足迹', component: MyTrace },
				
				{ path: '/changePhone', name: 'changePhone', title: '变更手机号', component: changePhone },
				{ path: '/confirmPassword', name: 'confirmPassword', title: '变更手机号', component: confirmPassword },
				{ path: '/loginPassword', name: 'loginPassword', title: '重置登陆密码', component: loginPassword },
				{ path: '/setPayPassword', name: 'setPayPassword', title: '设置支付密码', component: setPayPassword },

				{ path: '/userOrderList', name: 'MyOrderList', title: '我的订单', component: OrderList },
				{ path: '/userOrderInfo', name: 'MyOrderInfo', title: '我的订单详情', component: OrderInfo },
				{ path: '/userOrderAppraise', name: 'MyOrderAppraise', title: '我的订单评价', component: OrderAppraise },
				{ path: '/userOrderAppraiseSuccess', name: 'MyOrderAppraiseSuccess', title: '我的订单评价成功', component: OrderAppraiseSuccess },

				{ path: '/userOrderLogistics', name: 'MyOrderLogistics', title: '订单物流', component: OrderLogistics },
				
				{ path: '/userAfterSalesList', name: 'MyAfterSalesList', title: '售后列表', component: AfterSalesList },
				{ path: '/userAfterSales', name: 'MyAfterSales', title: '申请售后', component: AfterSales },
				{ path: '/userAfterSalesState', name: 'MyAfterSalesState', title: '售后详情', component: AfterSalesState },
				{ path: '/userAfterSalesNegotiate', name: 'MyAfterSalesNegotiate', title: '协商详情', component: AfterSalesNegotiate },

				{ path: '/receivingAddress', name: 'MyReceivingAddress', title: '收货地址', component: address },
				{ path: '/addAddress', name:'addAddress', title:'新增地址', component:add },

				{ path: '/invitingFriends',name:'MyInvitingFriends',title:'邀请好友', component: invitingFriends },
				{ path: '/myInviting',name:'myInviting',title:'邀请列表', component: myInviting },
				{ path: '/myCode',name:'myCode',title:'邀请好友', component: myCode },
				{ path: '/invitationSuccess',name:'invitationSuccess',title:'邀请成功', component: invitationSuccess },
				{ path: '/invitationForm',name:'invitationForm',title:'邀请表单', component: invitationForm },

				{ path: '/opinion',name:'opinion',title:'意见反馈', component: opinion },
				{ path: '/opinionList',name:'opinionList',title:'意见反馈', component: opinionList },

				{ path: '/helpCenter',name:'helpCenter',title:'帮助中心', component: helpCenter },
				{ path: '/helpList',name:'helpList',title:'帮助中心列表', component: helpList },
				{ path: '/helpQuery',name:'helpQuery',title:'帮助中心', component: helpQuery },
				{ path: '/helpDetails',name:'helpDetails',title:'帮助中心', component: helpDetails },
				
				{ path: '/moneyIndex', name: 'moneyIndex', title: '账户余额', component: moneyIndex },
				{ path: '/balance',name:'balance',title:'余额明细', component: balance },
				{ path: '/payDetails',name:'payDetails',title:'充值提现详情', component: payDetails },
				{ path: '/recycleDetails',name:'recycleDetails',title:'回收详情', component: recycleDetails },

				{ path: '/withDraw',name:'withDraw',title:'提现', component: withDraw },
				{ path: '/withDrawResult',name:'withDrawResult',title:'提现结果', component: withDrawResult },

				{ path: '/moneyRecharge',name:'moneyRecharge',title:'账户余额充值', component: moneyRecharge },
				{ path: '/mRSuccess',name:'mRSuccess',title:'账户余额充值成功', component: mRSuccess },
				{ path: '/myBankCard',name:'myBankCard',title:'我的银行卡', component: myBankCard },
				{ path: '/manageBank',name:'manageBank',title:'添加银行卡/管理银行卡', component: manageBank },
				{ path: '/manageBank1',name:'manageBank1',title:'添加银行卡/管理银行卡1', component: manageBank1 },
				{ path: '/manageBank2',name:'manageBank2',title:'添加银行卡/管理银行卡2', component: manageBank2 },
				{ path: '/manageBank3',name:'manageBank3',title:'添加银行卡/管理银行卡3', component: manageBank3 },
				{ path: '/manageBankSuccess',name:'manageBankSuccess',title:'添加银行卡/管理银行卡成功', component: manageBankSuccess },
				{ path: '/phoneWarn',name:'phoneWarn',title:'手机号不符提示', component: phoneWarn },

			]
		},
		{ path: '/guessSize',name:'guessSize',title:'猜大小', component: guessSize },
		{ path: '/guessGift',name:'guessGift',title:'猜红包', component: guessGift },
		
		{ path: '/shoppingCart', name: 'MyShoppingCart', title: '我的购物车', component: ShoppingCart},
		{ path: '/shoppingCartGoBuy', name: 'MyShoppingCartGoBuy', title: '去付款', component: shoppingCartGoBuy },
		
		{ path: '/MessageCenter', name: 'MessageCenter', title: '消息中心', component: MessageCenter },
		{ path: '/ShopSales', name: 'ShopSales', title: '商城活动', component: ShopSales },
		{ path: '/LogisticsNotification', name: 'LogisticsNotification', title: '物流通知', component: LogisticsNotification },
		{ path: '/MallAnnouncement', name: 'MallAnnouncement', title: '商城公告', component: MallAnnouncement },
		{ path: '/AnnouncementDetails', name: 'AnnouncementDetails', title: '公告详情', component: AnnouncementDetails },
		{ path: '/MessageNotification', name: 'MessageNotification', title: '通知消息', component: MessageNotification },
		{ path: '/lotteryList', name: 'lotteryList', title: '开奖榜单', component: lotteryList },
		{ path: '/upgadeRecord', name: 'upgadeRecord', title: '升级的列表', component: upgadeRecord,
		children:[
			{ path: '/upgadeRecord/upgadesRecord', name: 'upgadesRecord', title: '升级记录', component: upgadesRecord },
			{ path: '/upgadeRecord/packetRecord', name: 'packetRecord', title: '红包记录', component: packetRecord },
		]},
		{ path: '/experArea', name: 'experArea', title: '体验券区', component: experArea },
		{ path: '/coupon', name: 'Coupon', title: '优惠券', component: Coupon},
		{ path: '/invalidCoupon', name: 'invalidCoupon', title: '已失效优惠券', component: invalidCoupon},
		{ path: '/areaIndex', name: 'areaIndex', title: '专区列表', component: areaIndex },
		{ path: '/upgradeIndex', name: 'upgradeIndex', title: '升级专区', component: upgradeIndex },
		{ path: '/upDetail', name: 'upDetail', title: '升级商品详情', component: upDetail },
		{ path: '/upGoBuy', name: 'upGoBuy', title: '订单付款', component: upGoBuy },
		{ path: '/upBuySuccess', name: 'upBuySuccess', title: '升级产品购买成功', component: upBuySuccess },
		{ path: '/wineArea', name: 'wineArea', title: '红酒专区', component: wineArea },
		{ path: '/wineDetail', name: 'wineDetail', title: '红酒详情', component: wineDetail },
		{ path: '/gameAreaProm', name: 'gameAreaProm', title: '促销专区游戏规则', component: gameAreaProm },
		{ path: '/gameAreaIncre', name: 'gameAreaIncre', title: '增值专区游戏规则', component: gameAreaIncre },
		{ path: '/blackTea', name: 'BlackTea', title: '安化黑茶', component: BlackTea },
		{ path: '/hundredTea', name: 'HundredTea', title: '百年茂记', component: HundredTea },
		{ path: '/yanxihong', name: 'Yanxihong', title: '烟溪红', component: Yanxihong },
		{ path: '/registerArea', name: 'registerArea', title: '新人注册送体验券', component: registerArea },
		{ path: '/brandDetail', name: 'brandDetail', title: '品牌详情页', component: brandDetail },
	]
});

//router.beforeEach(function(to, from, next) {
//	if (to.path.startsWith('/login')) {
//	  next()
//	} else {
//  let user = window.localStorage.getItem('userInfo')
// 	if (!user) {
//    next({ path: '/login' })
//  } else {
//    next();
//    Vue.prototype.userInfo = JSON.parse(localStorage.getItem('userInfo')); //登录之后的用户信息
//    Vue.prototype.token = localStorage.getItem('token'); //登录之后的token
//  }
//	}
//})

//let indexScrollTop = 0;
router.beforeEach(function(to, from, next) {
//	if (to.path !== '/') {
//  	indexScrollTop = document.body.scrollTop //开始切换路由前将当前页面scrollTop存放到变量
//	}
	next();
	Vue.prototype.userInfo = JSON.parse(localStorage.getItem('userInfo')); //登录之后的用户信息
	Vue.prototype.token = localStorage.getItem('token'); //登录之后的token
})

router.afterEach(function(to, form, next) {
	console.log(to)
	console.log(form)
	window.scrollTo(0, 0);
//	if (to.path !== '/') {
//  	document.body.scrollTop = 0
//	} else {
//  	Vue.nextTick(() => {
//    		document.body.scrollTop = indexScrollTop //路由切换完成设置scrollTop
//  	})
//	}
//	document.body.scrollTop = document.documentElement.scrollTop = 0;
})


export default router
