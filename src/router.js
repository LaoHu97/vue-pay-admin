import Vue from 'vue'
import Router from 'vue-router'
import login from './views/login/index.vue'
import home from './views/home.vue'
import index from './views/view/index.vue'

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
        component: () => import('./views/home/index.vue')
      }]
    }, {
      path: '/deal',
      redirect: '/deal/shop/table1',
      name: '管理中心',
      meat: {
        name: '管理中心'
      },
      component: home,
      children: [{
        path: 'shop',
        redirect: '/deal/shop/table1',
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
          component: () => import('./views/view/table1/table1.vue')
        }, {
          path: 'table6',
          name: '商户审核',
          meat: {
            name: '商户审核'
          },
          component: () => import('./views/view/table1/table6.vue')
        }, {
          path: 'table2',
          name: '门店列表',
          meat: {
            name: '门店列表',
            hidden: true
          },
          component: () => import('./views/view/table1/table2.vue')
        }, {
          path: 'table3',
          name: '新增商户',
          meat: {
            name: '新增商户',
            hidden: true
          },
          component: () => import('./views/view/table1/table3.vue')
        }, {
          path: 'table4',
          name: '款台列表',
          meat: {
            name: '款台列表',
            hidden: true
          },
          component: () => import('./views/view/table1/table4.vue')
        }, {
          path: 'table5',
          name: '商户信息',
          meat: {
            name: '商户信息',
            hidden: true
          },
          component: () => import('./views/view/table1/table5.vue')
        }, {
          path: 'table7',
          name: '终端审核',
          meat: {
            name: '终端审核',
            hidden: true
          },
          component: () => import('./views/view/table1/table7.vue')
        }]
      }, {
        path: 'shop',
        name: '订单管理',
        meat: {
          name: '订单管理',
          icon: 'icon-tuanduicankaoxian-'
        },
        component: index,
        children: [{
          path: 'order1',
          name: '待补订单',
          meat: {
            name: '待补订单'
          },
          component: () => import('./views/view/table4/order01.vue')
        }, {
          path: 'order2',
          name: '待处理门店数据',
          meat: {
            name: '待处理门店数据'
          },
          component: () => import('./views/view/table4/order02.vue')
        }]
      }
        // {
        //   path: '/shop',
        //   name: '系统配置',
        //   meat: {
        //     name: '系统配置',
        //     icon: 'icon-xitong'
        //   },
        //   component: index,
        //   children: [{
        //     path: 'paypage',
        //     name: '支付配置',
        //     meat: {
        //       name: '支付配置'
        //     },
        //     component: () => import('./views/view/table2/payPage.vue')
        //   }]
        // }, {
        //   path: '/shop',
        //   name: '终端管理',
        //   meat: {
        //     name: '终端管理',
        //     icon: 'icon-shouyin'
        //   },
        //   component: index,
        //   children: [{
        //     path: 'emppage1',
        //     name: '扫呗终端',
        //     meat: {
        //       name: '扫呗终端'
        //     },
        //     component: () => import('./views/view/table3/emppage1.vue')
        //   }, {
        //     path: 'emppage2',
        //     name: '新大陆终端',
        //     meat: {
        //       name: '新大陆终端'
        //     },
        //     component: () => import('./views/view/table3/emppage2.vue')
        //   }]
        // }
      ]
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
        component: () => import('./views/account/password.vue')
      }]
    }
  ]
})
