import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import GuessSize from '@/components/game/guessSize' //猜大小
import GuessGift from '@/components/game/guessGift' //猜红包

import myUpgrade from '@/components/upgrade/myUpgrade' // 我的升级订单
import upDetail from '@/components/upgrade/upDetail'  // 升级商品详情

import AfterSales from '@/components/order/afterSales' // 我的 => 申请售后
import AfterSalesState from '@/components/order/afterSalesState' // 我的 => 售后详情
import AfterSalesNegotiate from '@/components/order/afterSalesNegotiate' // 我的 => 售后详情 = 协商

import integralClub from '@/components/integral/integralClub' // 积分乐园
import luckDraw from '@/components/integral/luckDraw' // 积分乐园-抽奖

import upgadeRecord from '@/components/personal/upgadeRecord'  //升级的列表
import upgadesRecord from '@/components/personal/child/upgadesRecord'  //升级记录
import packetRecord from '@/components/personal/child/packetRecord'  //红包记录
import lotteryList from '@/components/personal/lotteryList'  //开奖榜单

Vue.use(Router)

export default new Router({
    routes: [
        { path: '/', name: 'Index', component: Index },
        { path: '/gameSize', name: 'gameSize', component: GuessSize },
        { path: '/gameGift', name: 'gameGift', component: GuessGift },
        { path: '/myUpgrade', name: 'MyUpgrade', title: '升级订单', component: myUpgrade },
        { path: '/upDetail', name: 'upDetail', title: '升级商品详情', component: upDetail },

        { path: '/afterSales', name: 'afterSales', title: '申请售后', component: AfterSales },
        { path: '/afterSalesState', name: 'afterSalesState', title: '申请售后', component: AfterSalesState },
        { path: '/afterSalesNegotiate', name: 'afterSalesNegotiate', title: '协商详情', component: AfterSalesNegotiate },

        { path: '/integralClub', name: 'integralClub', title: '积分乐园', component: integralClub },   
        { path: '/luckDraw', name: 'luckDraw', title: '积分乐园-抽奖', component: luckDraw },  
		{ path: '/upgadeRecord', name: 'upgadeRecord', title: '升级的列表', component: upgadeRecord,
			children:[
				{ path: '/upgadeRecord/upgadesRecord', name: 'upgadesRecord', title: '升级记录', component: upgadesRecord },
				{ path: '/upgadeRecord/packetRecord', name: 'packetRecord', title: '红包记录', component: packetRecord }
			]
		},
		{ path: '/lotteryList', name: 'lotteryList', title: '开奖榜单', component: lotteryList },
    ]
})
