import Vue from 'vue'
import Router from 'vue-router'
import login from './views/login/index.vue'
import home from './views/main/home.vue'
import index from './views/main/view/index.vue'

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
        component: () => import('./views/main/home/index.vue')
      }]
    }, {
      path: '/deal',
      name: '交易中心',
      meat: {
        name: '交易中心'
      },
      component: home,
      children: [{
        path: 'shop',
        name: '商户管理',
        meat: {
          name: '商户管理',
          icon: 'icon-shangjia'
        },
        component: index,
        children: [{
          path: 'table1',
          name: '商户列表',
          meat: {
            name: '商户列表'
          },
          component: () => import('./views/main/view/table1/table1.vue')
        }, {
          path: 'table2',
          name: '门店列表',
          meat: {
            name: '门店列表'
          },
          component: () => import('./views/main/view/table1/table2.vue')
        }, {
          path: 'table3',
          name: '新增商户',
          meat: {
            name: '新增商户'
          },
          component: () => import('./views/main/view/table1/table3.vue')
        }]
      }, {
        path: '/shop',
        name: '系统配置',
        meat: {
          name: '系统配置',
          icon: 'icon-xitong'
        },
        component: index,
        children: [{
          path: 'paypage',
          name: '支付配置',
          meat: {
            name: '支付配置'
          },
          component: () => import('./views/main/view/table2/payPage.vue')
        }]
      }]
    }, {
      path: '/account',
      name: '账户中心',
      meat: {
        name: '账户中心'
      },
      component: home,
      children: [{
        path: 'password',
        name: '密码管理',
        meat: {
          name: '密码管理',
          icon: ''
        },
        component: () => import('./views/main/account/password.vue')
      }]
    }
  ]
})
