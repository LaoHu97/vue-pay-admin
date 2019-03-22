
import index from '@/views/view/index.vue'
export default [{
  path: 'shop',
  redirect: '/router03/shop/inspectPage1',
  name: '信息核查',
  meta: {
    title: '信息核查',
    icon: 'icon-shangjia'
  },
  component: index,
  children: [{
    path: 'inspectPage1',
    name: '身份证核查',
    meta: {
      title: '身份证核查'
    },
    component: () => import('@/views/view/table7/inspectPage1.vue')
  }, {
    path: 'inspectPage2',
    name: '银行卡核查',
    meta: {
      title: '银行卡核查'
    },
    component: () => import('@/views/view/table7/inspectPage2.vue')
  }, {
    path: 'inspectPage3',
    name: '手机号鉴权',
    meta: {
      title: '手机号鉴权'
    },
    component: () => import('@/views/view/table7/inspectPage3.vue')
  }]
}, {
  path: 'shop',
  redirect: '/router03/shop/specialRatePage1',
  name: '运营维护',
  meta: {
    title: '运营维护',
    icon: 'icon-shangjia'
  },
  component: index,
  children: [{
    path: 'specialRatePage1',
    name: '特殊费率',
    meta: {
      title: '特殊费率'
    },
    component: () => import('@/views/view/table11/specialRatePage1.vue')
  }, {
    path: 'table15',
    name: '行业限额',
    meta: {
      title: '行业限额',
      hidden: false
    },
    component: () => import('@/views/view/table1/table15.vue')
  }, {
    path: 'continue1',
    name: '续期提醒',
    meta: {
      title: '续期提醒'
    },
    component: () => import('@/views/view/table10/continue1.vue')
  }]
}, {
  path: 'shop',
  redirect: '/router03/shop/notice1',
  name: '公告管理',
  meta: {
    title: '公告管理',
    icon: 'icon-shangjia'
  },
  component: index,
  children: [{
    path: 'notice1',
    name: '公告列表',
    meta: {
      title: '公告列表'
    },
    component: () => import('@/views/view/table2/notice1.vue')
  }]
}]