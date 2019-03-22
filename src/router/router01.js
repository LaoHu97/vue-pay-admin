import index from '@/views/view/index.vue'
export default [{
  path: 'shop',
  redirect: '/router01/shop/page1',
  name: '渠道商管理',
  meta: {
    title: '渠道商管理',
    icon: 'icon-shangjia'
  },
  component: index,
  children: [{
    path: 'page1',
    name: '渠道商入驻',
    meta: {
      title: '渠道商入驻',
      noCache: true
    },
    component: () => import('@/views/view/table8/page1.vue')
  }, {
    path: 'page2',
    name: '渠道商列表',
    meta: {
      title: '渠道商列表'
    },
    component: () => import('@/views/view/table8/page2.vue')
  }, {
    path: 'payPage1',
    name: '渠道商分润',
    meta: {
      title: '渠道商分润'
    },
    component: () => import('@/views/view/table9/payPage1.vue')
  }, {
    path: 'page3',
    name: '渠道商管理-基本资料',
    meta: {
      title: '渠道商管理-基本资料',
      hidden: true,
      noCache: true,
      noTages: true
    },
    component: () => import('@/views/view/table8/page3.vue')
  }, {
    path: 'page4',
    name: '渠道商管理-结算信息',
    meta: {
      title: '渠道商管理-结算信息',
      hidden: true,
      noCache: true,
      noTages: true
    },
    component: () => import('@/views/view/table8/page4.vue')
  }, {
    path: 'page5',
    name: '渠道商管理-上传资质',
    meta: {
      title: '渠道商管理-上传资质',
      hidden: true,
      noCache: true,
      noTages: true
    },
    component: () => import('@/views/view/table8/page5.vue')
  }]
}]