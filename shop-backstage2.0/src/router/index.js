import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login/login'
import Index from '@/components/index'

/* 消息  */
import Activity from '@/components/msg/activity' //商城活动
import Notice from '@/components/msg/notice' //商城公告

/* 用户  */
import User from '@/components/user/user' //用户管理-商城用户
import Operator from '@/components/user/operator' //用户管理-后台用户
import ManageOperator from '@/components/user/manageOperator' //管理后台用户


/* 商品  */
import Goods from '@/components/goods/goods' //商品管理
import synchroGoods from '@/components/goods/synchroGoods' //商品同步
import synchroClassify from '@/components/goods/synchroClassify' //商品分类同步
import synchroSecondClassify from '@/components/goods/synchroSecondClassify' //商品分类同步 - 二级分类 
import OperateGoods from '@/components/goods/operateGoods' //管理商品
import ModifyGoods from '@/components/goods/modifyGoods' //修改商品
import Classify from '@/components/goods/classify' //商品分类
import SecondClassify from '@/components/goods/secondClassify' //商品分类 - 二级分类
import Comment from '@/components/goods/comment' //商品评价

/* 订单 */
import AfterSales from '@/components/order/afterSales' //订单管理 - 售后
import AfterSalesDetail from '@/components/order/afterSalesDetail' //订单管理 - 售后详情

import orderList from '@/components/order/orderList' //订单管理 - 订单列表
import orderDetail from '@/components/order/orderDetail' //订单管理 - 订单详情

/* 首页 */
import SearchBox from '@/components/home/searchBox' //搜索框
import HotSearch from '@/components/home/hotSearch' //热搜
import Banner from '@/components/home/banner' //轮播图
import OperateBanner from '@/components/home/operateBanner' //管理轮播图
import Floor from '@/components/home/floor' //楼层管理
import FloorEdit from '@/components/home/floorEdit' //普通楼层编辑
import FindBrand from '@/components/home/FindBrand' //品牌楼层编辑
import FindBrandGoods from '@/components/home/FindBrandGoods' //品牌楼层编辑
import Channel from '@/components/home/channel' //频道管理

/* 抽奖 */
import LuckDraw from '@/components/integral/luckDraw' //频道管理

/* 其他 */
import Protocol from '@/components/other/protocol' //商城协议
import OperateProtocol from '@/components/other/operateProtocol' //管理商城协议
import Advice from '@/components/other/advice' //意见反馈
import Help from '@/components/other/help' //帮助中心
import noteTemplate from '@/components/other/noteTemplate' //短信模板
import sysConfig from '@/components/other/sysConfig' //系统管理

/* 权限与角色  */
import RoleAndAuthority from '@/components/roleAndAuthority/roleAndAuthority' //权限与角色管理
import ManageRole from '@/components/roleAndAuthority/manageRole' //管理角色
import ManageAuthority from '@/components/roleAndAuthority/manageAuthority' //管理权限

/* 菜单 */
import Menus from '@/components/menus/menus' //菜单管理

/* 报表 */
import IntegralList from '@/components/statement/integralList' //积分总表
import IntegralDetails from '@/components/statement/integralDetails' //积分明细
import UserList from '@/components/statement/userList' //用户总表
import OrderAllList from '@/components/statement/orderList' //订单总表
import Monitoring from '@/components/statement/monitoring' //注单监控报表

/* 升级专区 */
import UpClassList from '@/components/upgrade/upClassList' //升级分类列表
import UpGoodsList from '@/components/upgrade/upGoodsList' //升级商品列表
import ClassDetails from '@/components/upgrade/classDetails' //升级商品列表详情
import UpOrderList from '@/components/upgrade/upOrderList' //升级订单列表

/* 提现管理  */
import withdrawalsList from '@/components/withdrawals/withdrawalsList' //提现列表

/* app管理  */
import bootPage from '@/components/app/bootPage' //App开机页配置
import homeActivity from '@/components/app/homeActivity' //首页活动图层配置
import sign from '@/components/app/sign' //每日签到配置
import appMenu from '@/components/app/appMenu' //app菜单管理

/* 优惠券管理 */
import Coupon from '@/components/coupon/coupon' //优惠券列表
import CouponAdd from '@/components/coupon/couponAdd' //优惠券详情
import CouponGoods from '@/components/coupon/couponGoods' //体验券商品
import CouponDetails from '@/components/coupon/couponDetails' //体验券商品详情

Vue.use(Router)

let router = new Router({
    routes: [
        { path: '/login', name: 'Login', title: '登录', component: Login },
        { path: '/', name: 'Index', title: '首页', component: Index },
        {
            path: '/activity',
            name: 'Msg',
            title: '消息',
            component: Index,
            type: 'sider',
            icon: '&#xe6cf;',
            children: [
                { path: '/activity', name: 'Activity', title: '商城活动', component: Activity, type: 'sider' },
                { path: '/notice', name: 'Notice', title: '商城公告', component: Notice, type: 'sider' },
            ]
        },
        {
            path: '/user',
            name: 'user',
            title: '用户',
            component: Index,
            type: 'sider',
            icon: '&#xe62a;',
            children: [
                { path: '/user', name: 'User', title: '商城用户管理', component: User, type: 'sider' },
                { path: '/operator', name: 'Operator', title: '后台用户管理', component: Operator, type: 'sider' },
                { path: '/manageOperator', name: 'ManageOperator', title: '管理后台用户', component: ManageOperator },
            ]
        },
        {
            path: '/goods',
            name: 'goods',
            title: '商品',
            component: Index,
            type: 'sider',
            icon: '&#xe670;',
            children: [
                { path: '/goods', name: 'Goods', title: '商品管理', component: Goods, type: 'sider' },
                { path: '/synchroGoods', name: 'SynchroGoods', title: '商品同步', component: synchroGoods },
                { path: '/synchroClassify', name: 'synchroClassify', title: '商品分类同步', component: synchroClassify },
                { path: '/synchroSecondClassify', name: 'synchroSecondClassify', title: '商品二级分类同步', component: synchroSecondClassify },
                { path: '/operateGoods', name: 'OperateGoods', title: '管理商品', component: OperateGoods },
                { path: '/modifyGoods', name: 'ModifyGoods', title: '修改商品', component: ModifyGoods },
                { path: '/classify', name: 'Classify', title: '商品分类', component: Classify, type: 'sider' },
                { path: '/secondClassify', name: 'SecondClassify', title: '商品二级分类', component: SecondClassify },
                { path: '/comment', name: 'Comment', title: '商品评价', component: Comment, type: 'sider' }
            ]
        },
        {
            path: '/order',
            name: 'order',
            title: '订单',
            component: Index,
            type: 'sider',
            icon: '&#xe65e;',
            children: [
                { path: '/afterSales', name: 'afterSales', title: '售后', component: AfterSales, type: 'sider' },
                { path: '/afterSalesDetail', name: 'afterSalesDetail', title: '售后', component: AfterSalesDetail },
                { path: '/orderList', name: 'orderList', title: '订单列表', component: orderList, type: 'sider' },
                { path: '/orderDetail', name: 'orderDetail', title: '订单详情', component: orderDetail },
            ]
        },
        {
            path: '/searchBox',
            name: 'searchBox',
            title: '首页',
            component: Index,
            type: 'sider',
            icon: '&#xe633;',
            children: [
                { path: '/searchBox', name: 'SearchBox', title: '搜索框', component: SearchBox, type: 'sider' },
                { path: '/hotSearch', name: 'HotSearch', title: '热搜', component: HotSearch, type: 'sider' },
                { path: '/banner', name: 'Banner', title: '轮播图', component: Banner, type: 'sider' },
                { path: '/operateBanner', name: 'OperateBanner', title: '管理轮播图', component: OperateBanner },
                { path: '/floor', name: 'Floor', title: '楼层管理', component: Floor, type: 'sider' },
                { path: '/floorEdit', name: 'FloorEdit', title: '普通楼层编辑', component: FloorEdit, type: 'sider' },
                { path: '/FindBrand', name: 'FindBrand', title: '品牌楼层编辑', component: FindBrand, type: 'sider' },
                { path: '/FindBrandGoods', name: 'FindBrandGoods', title: '品牌商品列表', component: FindBrandGoods, type: 'other' },
                { path: '/channel', name: 'Channel', title: '频道管理', component: Channel, type: 'sider' }
            ]
        },
        {
            path: '/luckDraw',
            name: 'integral',
            title: '积分乐园',
            component: Index,
            type: 'sider',
            icon: '&#xe61a;',
            children: [
                { path: '/luckDraw', name: 'LuckDraw', title: '抽奖', component: LuckDraw, type: 'sider' },
            ]
        },
        {
            path: '/protocol',
            name: 'protocol',
            title: '其他',
            component: Index,
            type: 'sider',
            icon: '&#xe7ef;',
            children: [
                { path: '/protocol', name: 'Protocol', title: '商城协议', component: Protocol, type: 'sider' },
                { path: '/operateProtocol', name: 'OperateProtocol', title: '管理商城协议', component: OperateProtocol },
                { path: '/advice', name: 'Advice', title: '意见反馈', component: Advice, type: 'sider' },
                { path: '/help', name: 'Help', title: '帮助中心', component: Help, type: 'sider' },
                { path: '/noteTemplate', name: 'noteTemplate', title: '短信模板', component: noteTemplate, type: 'sider' },
                { path: '/sysConfig', name: 'sysConfig', title: '系统管理', component: sysConfig, type: 'sider' }
            ]
        },
        {
            path: '/roleAndAuthority',
            name: 'roleAndAuthority',
            title: '角色与权限',
            component: Index,
            type: 'sider',
            icon: '&#xe65e;',
            children: [
                { path: '/roleAndAuthority', name: 'RoleAndAuthority', title: '角色与权限', component: RoleAndAuthority, type: 'sider' },
                { path: '/manageRole', name: 'ManageRole', title: '管理角色', component: ManageRole },
                { path: '/manageAuthority', name: 'ManageAuthority', title: '管理权限', component: ManageAuthority },
            ]
        },
        {
            path: '/menus',
            name: 'menus',
            title: '菜单',
            component: Index,
            type: 'sider',
            icon: '&#xe65e;',
            children: [
                { path: '/menus', name: 'Menus', title: '菜单管理', component: Menus, type: 'sider' },
            ]
        },
        {
            path: '/userList',
            name: 'userList',
            title: '报表',
            component: Index,
            type: 'sider',
            children: [
                { path: '/integralList', name: 'IntegralList', title: '积分总表', component: IntegralList, type: 'sider' },
                { path: '/integralDetails', name: 'IntegralDetails', title: '积分明细详情', component: IntegralDetails, type: 'sider' },
                { path: '/userList', name: 'UserList', title: '积分明细详情', component: UserList, type: 'sider' },
                { path: '/orderAllList', name: 'OrderAllList', title: '订单总表', component: OrderAllList, type: 'sider' },
                { path: '/monitoring', name: 'Monitoring', title: '注单监控报表', component: Monitoring, type: 'sider' }
            ]
        },
        {
            path: '/upClassList',
            name: 'upClassList',
            title: '升级专区',
            component: Index,
            type: 'sider',
            children: [
                { path: '/upClassList', name: 'UpClassList', title: '升级分类列表', component: UpClassList, type: 'sider' },
                { path: '/upOrderList', name: 'UpOrderList', title: '订单列表', component: UpOrderList, type: 'sider' },
                { path: '/upGoodsList', name: 'UpGoodsList', title: '升级商品列表', component: UpGoodsList, type: 'sider' },
                { path: '/classDetails', name: 'ClassDetails', title: '分类详情列表', component: ClassDetails, type: 'sider' }
            ]
        },

        {
            path: '/withdrawalsList',
            name: 'withdrawals',
            title: '提现管理',
            component: Index,
            type: 'sider',
            children: [
                { path: '/withdrawalsList', name: 'withdrawalsList', title: '提现列表', component: withdrawalsList, type: 'sider' },
            ]
        },
        {
            path: '/bootPage',
            name: 'app',
            title: 'app管理',
            component: Index,
            type: 'sider',
            children: [
                { path: '/bootPage', name: 'bootPage', title: 'App开机页配置', component: bootPage, type: 'sider' },
                { path: '/homeActivity', name: 'homeActivity', title: '首页活动图层配置', component: homeActivity, type: 'sider' },
                { path: '/sign', name: 'sign', title: '每日签到配置', component: sign, type: 'sider' },
                { path: '/appMenu', name: 'appMenu', title: 'app菜单管理', component: appMenu, type: 'sider' }
            ]
        },
        {
            path: '/coupon',
            name: 'coupon',
            title: '提现管理',
            component: Index,
            type: 'sider',
            children: [
                { path: '/coupon', name: 'Coupon', title: '优惠券列表', component: Coupon, type: 'sider' },
                { path: '/couponAdd', name: 'CouponAdd', title: '优惠券详情', component: CouponAdd, type: 'sider' },
                { path: '/couponGoods', name: 'CouponGoods', title: '体验券商品', component: CouponGoods, type: 'sider' },
                { path: '/couponDetails', name: 'CouponDetails', title: '体验券商品详情', component: CouponDetails, type: 'sider' }
            ]
        },
    ]
})

router.beforeEach(function(to, from, next) {
    if (to.path.startsWith('/login')) {
        next()
    } else {
        let user = window.localStorage.getItem('bsUserInfo')
        if (!user) {
            next({ path: '/login' })
        } else {
            next();
            Vue.prototype.userInfo = JSON.parse(localStorage.getItem('bsUserInfo')); //登录之后的用户信息
            Vue.prototype.token = localStorage.getItem('token'); //登录之后的token
        }
    }
})

export default router
