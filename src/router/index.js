import Vue from 'vue'
import Router from 'vue-router'
import login from '@/views/login/index.vue'
import home from '@/views/home.vue'

import adminCenterRouter from './adminCenterRouter'

Vue.use(Router)

export default new Router({
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
      path: '/deal',
      redirect: '/deal/shop/page1',
      name: '管理中心',
      meat: {
        name: '管理中心'
      },
      component: home,
      children: adminCenterRouter
    }, {
      path: '/account',
      name: '账户中心',
      meat: {
        name: '账户中心'
      },
      component: home,
      redirect: '/account/password',
      children: [{
        path: 'password',
        name: '密码管理',
        meat: {
          name: '密码管理',
          icon: ''
        },
        component: () => import('@/views/account/password.vue')
      }]
    }
  ]
})
