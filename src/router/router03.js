import index from '@/views/view/index.vue'
export default [{
  path: 'shop',
  redirect: '/router04/shop/order3',
  name: '交易管理',
  meat: {
    name: '交易管理',
    icon: 'icon-shangjia'
  },
  component: index,
  children: [{
    path: 'order3',
    name: '交易查询',
    meat: {
      name: '交易查询'
    },
    component: () => import('@/views/view/table4/order03.vue')
  }, {
    path: 'order5',
    name: '交易详情',
    meat: {
      name: '交易详情',
      hidden: true
    },
    component: () => import('@/views/view/table4/order05.vue')
  }, {
    path: 'order4',
    name: '异常订单',
    meat: {
      name: '异常订单'
    },
    component: () => import('@/views/view/table4/order04.vue')
  }]
}]
