import index from '@/views/view/index.vue'
export default [{
  path: 'shop',
  redirect: '/router05/shop/order1',
  name: '对账管理',
  meta: {
    title: '对账管理',
    icon: 'icon-tuanduicankaoxian-'
  },
  component: index,
  children: [{
    path: 'order1',
    name: '对账差错处理',
    meta: {
      title: '对账差错处理'
    },
    component: () => import('@/views/view/table4/order01.vue')
  }, {
    path: 'excelPage',
    name: '对账单下载',
    meta: {
      title: '对账单下载'
    },
    component: () => import('@/views/view/table5/excelPage.vue')
  }, {
    path: 'settlement',
    name: '结算查询',
    meta: {
      title: '结算查询'
    },
    component: () => import('@/views/view/table6/settlement1.vue')
  }]
}]
