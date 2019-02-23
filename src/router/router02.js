import index from '@/views/view/index.vue'
export default [{
  path: 'shop',
  redirect: '/router02/shop/table1',
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
    component: () => import('@/views/view/table1/table1.vue')
  }, {
    path: 'table6',
    name: '商户审核',
    meat: {
      name: '商户审核'
    },
    component: () => import('@/views/view/table1/table6.vue')
  }, {
    path: 'table2',
    name: '门店列表',
    meat: {
      name: '门店列表',
      hidden: true
    },
    component: () => import('@/views/view/table1/table2.vue')
  }, {
    path: 'table3',
    name: '查看终端',
    meat: {
      name: '查看终端',
      hidden: true
    },
    component: () => import('@/views/view/table1/table3.vue')
  }, {
    path: 'table4',
    name: '款台列表',
    meat: {
      name: '款台列表',
      hidden: true
    },
    component: () => import('@/views/view/table1/table4.vue')
  }, {
    path: 'table5',
    name: '商户信息',
    meat: {
      name: '商户信息',
      hidden: true
    },
    component: () => import('@/views/view/table1/table5.vue')
  }, {
    path: 'table8',
    name: '新增商户-01',
    meat: {
      name: '新增商户-01',
      hidden: true
    },
    component: () => import('@/views/view/table1/table8.vue')
  }, {
    path: 'table9',
    name: '新增商户-02',
    meat: {
      name: '新增商户-02',
      hidden: true
    },
    component: () => import('@/views/view/table1/table9.vue')
  }, {
    path: 'table10',
    name: '新增商户-03',
    meat: {
      name: '新增商户-03',
      hidden: true
    },
    component: () => import('@/views/view/table1/table10.vue')
  }, {
    path: 'table11',
    name: '微信支付配置',
    meat: {
      name: '微信支付配置',
      hidden: true
    },
    component: () => import('@/views/view/table1/table11.vue')
  }, {
    path: 'table12',
    name: '支付宝支付配置',
    meat: {
      name: '支付宝支付配置',
      hidden: true
    },
    component: () => import('@/views/view/table1/table12.vue')
  },{
    path: 'table14',
    name: '费率审核',
    meat: {
      name: '费率审核',
      hidden: false
    },
    component: () => import('@/views/view/table1/table14.vue')
  }]
}]





