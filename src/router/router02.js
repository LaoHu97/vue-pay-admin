import index from '@/views/view/index.vue'
export default [{
  path: 'shop',
  redirect: '/router02/shop/table1',
  name: '商户管理',
  meta: {
    title: '商户管理',
    icon: 'icon-shangjia'
  },
  component: index,
  children: [{
    path: 'table1',
    name: '商户列表',
    meta: {
      title: '商户列表'
    },
    component: () => import('@/views/view/table1/table1.vue')
  }, {
    path: 'table6',
    name: '商户审核',
    meta: {
      title: '商户审核'
    },
    component: () => import('@/views/view/table1/table6.vue')
  }, {
    path: 'table2',
    name: '门店列表',
    meta: {
      title: '门店列表',
      hidden: true,
      noCache: true
    },
    component: () => import('@/views/view/table1/table2.vue')
  }, {
    path: 'table3',
    name: '查看终端',
    meta: {
      title: '查看终端',
      hidden: true,
      noCache: true
    },
    component: () => import('@/views/view/table1/table3.vue')
  }, {
    path: 'table4',
    name: '款台列表',
    meta: {
      title: '款台列表',
      hidden: true,
      noCache: true
    },
    component: () => import('@/views/view/table1/table4.vue')
  }, {
    path: 'table5',
    name: '商户信息',
    meta: {
      title: '商户信息',
      hidden: true,
      noCache: true
    },
    component: () => import('@/views/view/table1/table5.vue')
  }, {
    path: 'table8',
    name: '商户管理-基本资料',
    meta: {
      title: '商户管理-基本资料',
      hidden: true,
      noCache: true,
      noTages: true
    },
    component: () => import('@/views/view/table1/table8.vue')
  }, {
    path: 'table9',
    name: '商户管理-结算信息',
    meta: {
      title: '商户管理-结算信息',
      hidden: true,
      noCache: true,
      noTages: true
    },
    component: () => import('@/views/view/table1/table9.vue')
  }, {
    path: 'table10',
    name: '商户管理-上传资质',
    meta: {
      title: '商户管理-上传资质',
      hidden: true,
      noCache: true,
      noTages: true
    },
    component: () => import('@/views/view/table1/table10.vue')
  }, {
    path: 'table11',
    name: '微信支付配置',
    meta: {
      title: '微信支付配置',
      hidden: true
    },
    component: () => import('@/views/view/table1/table11.vue')
  }, {
    path: 'table12',
    name: '支付宝支付配置',
    meta: {
      title: '支付宝支付配置',
      hidden: true
    },
    component: () => import('@/views/view/table1/table12.vue')
  }]
}]





