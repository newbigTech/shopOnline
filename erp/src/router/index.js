import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index' //首页
import home from '@/components/home/home' //首页
import login from '@/components/login/login' //登录

/* 个人中心 */
import personalInfo from '@/components/individual/personalInfo' //个人信息
import withdrawals from '@/components/individual/withdrawals' //账户提现

/* 实时监控 */
import todayDeal from '@/components/monitor/todayDeal' //用户当日成交监控
import bondWarn from '@/components/monitor/bondWarn' //保证金预警监控

/* 审核管理 */
import examineList from '@/components/examine/examineList' //审核列表

/* 财务管理 */
import AgentFund from '@/components/finance/agentFund' //财务管理 => 代理商资金状况表
import OperatorFund from '@/components/finance/operatorFund' //财务管理 => 运营中心资金总营业额状况
import OperatorFundDetails from '@/components/finance/operatorFundDetails' //财务管理 => 运营中心资金明细
import OrderFund from '@/components/finance/orderFund' //财务管理 => 订单明细
import SalesmanFund from '@/components/finance/salesmanFund' //财务管理 => 业务员资金状况表
import UserFundDetails from '@/components/finance/userFundDetails' //财务管理 => 用户交易明细

/* 运营中心管理 */
import operationList from '@/components/operation/index' // 代理商管理 =>[ anthor: Vsery ]
import userList from '@/components/operation/userList' // 团队管理 =>[ anthor: Vsery ]
import operationCompany from '@/components/operation/company' // 团队管理 =>[ anthor: Vsery ]
import operationItem from '@/components/operation/item' // 代理商管理 =>[ anthor: Vsery ]
import operationUser from '@/components/operation/user' // 业务员管理 =>[ anthor: Vsery ]
import permission from '@/components/operation/permission' // 权限列表 =>[ anthor: Vsery ]
import permissionUser from '@/components/operation/permissionUser' // 后台用户管理,权限管理 =>[ anthor: Vsery ]

/* 系统管理 */
import sysConfig from '@/components/system/sysConfig' //系统配置

Vue.use(Router)

let router = new Router({
    mode: 'history',
    routes: [
        { path: '/login', name: 'login', title: '登录', component: login },
        {
            path: '/',
            name: 'index',
            component: index,
            children: [
                { path: '/home', name: 'home', title: '首页', component: home, type: 'other' },
            ]
        },
        {
            path: '/personalInfo',
            name: 'individual',
            title: '个人中心',
            component: index,
            type: 'sider',
            children: [
                { path: '/personalInfo', name: 'personalInfo', title: '个人信息', component: personalInfo, type: 'sider' },
                { path: '/withdrawals', name: 'withdrawals', title: '账户提现', component: withdrawals, type: 'sider' },
            ]
        },
        {
            path: '/todayDeal',
            name: 'monitor',
            title: '实时监控',
            component: index,
            type: 'sider',
            children: [
                { path: '/todayDeal', name: 'todayDeal', title: '用户当日成交监控', component: todayDeal, type: 'sider' },
                { path: '/bondWarn', name: 'bondWarn', title: '保证金预警监控', component: bondWarn, type: 'sider' }
            ]
        },
        {
            path: '/examineList',
            name: 'examine',
            title: '审核管理',
            component: index,
            type: 'sider',
            children: [
                { path: '/examineList', name: 'examineList', title: '审核列表', component: examineList, type: 'sider' },
            ]
        },
        {
            path: '/',
            name: 'finance',
            title: '财务管理',
            component: index,
            type: 'sider',
            children: [
                { path: '/agentFund', name: 'AgentFund', title: '代理商资金状况表', component: AgentFund, type: 'sider' },
                { path: '/operatorFund', name: 'OperatorFund', title: '运营中心资金总营业额状况', component: OperatorFund, type: 'sider' },
                { path: '/operatorFundDetails', name: 'OperatorFundDetails', title: '运营中心资金明细', component: OperatorFundDetails, type: 'sider' },
                { path: '/orderFund', name: 'OrderFund', title: '订单明细', component: OrderFund, type: 'sider' },
                { path: '/salesmanFund', name: 'SalesmanFund', title: '业务员资金状况表', component: SalesmanFund, type: 'sider' },
                { path: '/userFundDetails', name: 'UserFundDetails', title: '用户交易明细', component: UserFundDetails, type: 'sider' }
            ]
        },
        {
            path: '/',
            name: 'operation',
            title: '运营中心管理',
            component: index,
            type: 'sider',
            children: [
                { path: '/userList', name: 'userList', title: '运营中心管理', component: userList, type: 'sider' },
                { path: '/operationList', name: 'operationList', title: '用户列表', component: operationList, type: 'sider' },
                { path: '/operationCompany', name: 'operationCompany', title: '代理商管理', component: operationCompany, type: 'sider' },
                { path: '/operationItem', name: 'operationItem', title: '团队管理', component: operationItem, type: 'sider' },
                { path: '/operationUser', name: 'operationUser', title: '业务员管理', component: operationUser, type: 'sider' },
                { path: '/permissionUser', name: 'permissionUser', title: '用户权限管理', component: permissionUser, type: 'sider' },
            ]
        },
        {
            path: '/sysConfig',
            name: 'system',
            title: '系统管理',
            component: index,
            type: 'sider',
            children: [
                { path: '/permission', name: 'permission', title: '权限列表[菜单管理]', component: permission, type: 'sider' },
                { path: '/sysConfig', name: 'sysConfig', title: '系统配置', component: sysConfig, type: 'sider' },
            ]
        }
    ]
})

router.beforeEach(function(to, from, next) {
    if (to.path.startsWith('/login')) {
        next()
    } else {
        let user = window.localStorage.getItem('userInfo')
        if (!user) {
            next({ path: '/login' })
        } else {
            next();
            Vue.prototype.userInfo = JSON.parse(localStorage.getItem('userInfo')); //登录之后的用户信息
            Vue.prototype.token = localStorage.getItem('token'); //登录之后的token
        }
    }
})

export default router
