import Vue from 'vue'
import Router from 'vue-router'
import login from '@/views/login/index.vue'
import home from '@/views/home.vue'

import router01 from './router01'
import router02 from './router02'
import router03 from './router03'
import router04 from './router04'
import router05 from './router05'

Vue.use(Router)


let router = new Router({
  routes: [
    {
      path: '/',
      component: login,
      name: '登录',
      meat: {
        name: '登录',
        hidden: true
      }
    }, {
      path: '/home',
      name: '首页',
      meat: {
        name: '首页'
      },
      component: home,
      children: [{
        path: '/home/index',
        name: '账号中心',
        meat: {
          name: '账号中心',
          icon: ''
        },
        component: () => import('@/views/home/index.vue')
      }]
    }, {
      path: '/router01',
      redirect: '/router01/shop/page1',
      name: '渠道中心',
      meat: {
        name: '渠道中心'
      },
      component: home,
      children: router01
    }, {
      path: '/router02',
      name: '商户中心',
      redirect: '/router02/shop/table1',
      meat: {
        name: '商户中心'
      },
      component: home,
      children: router02
    }, {
      path: '/router03',
      name: '交易中心',
      redirect: '/router03/shop/order3',
      meat: {
        name: '交易中心'
      },
      component: home,
      children: router03
    }, {
      path: '/router04',
      name: '对账中心',
      redirect: '/router04/shop/order1',
      meat: {
        name: '对账中心'
      },
      component: home,
      children: router04
    }, {
      path: '/router05',
      name: '运营中心',
      redirect: '/router05/shop/inspectPage1',
      meat: {
        name: '运营中心'
      },
      component: home,
      children: router05
    }
  ]
})

router.beforeEach((to, from, next) => {
  let routeName = to.meta.title || to.name;
  window.document.title = (routeName ? routeName + ' - ' : '') + '有氧金融运维端';
  next();
});

export default router