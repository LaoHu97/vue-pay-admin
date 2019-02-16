import index from '@/views/view/index.vue'
export default [{
    path: 'shop',
    redirect: '/deal/shop/page1',
    name: '渠道商管理',
    meat: {
      name: '渠道商管理',
      icon: 'icon-shangjia'
    },
    component: index,
    children: [{
      path: 'page1',
      name: '渠道商入驻',
      meat: {
        name: '渠道商入驻'
      },
      component: () => import('@/views/view/table8/page1.vue')
    }, {
      path: 'page2',
      name: '渠道商列表',
      meat: {
        name: '渠道商列表'
      },
      component: () => import('@/views/view/table8/page2.vue')
    }, {
      path: 'page3',
      name: '新增渠道商-01',
      meat: {
        name: '新增渠道商-01',
        hidden: true
      },
      component: () => import('@/views/view/table8/page3.vue')
    }, {
      path: 'page4',
      name: '新增渠道商-02',
      meat: {
        name: '新增渠道商-02',
        hidden: true
      },
      component: () => import('@/views/view/table8/page4.vue')
    }, {
      path: 'page5',
      name: '新增渠道商-03',
      meat: {
        name: '新增渠道商-03',
        hidden: true
      },
      component: () => import('@/views/view/table8/page5.vue')
    }]
  }, {
    path: 'shop',
    redirect: '/deal/shop/payPage1',
    name: '渠道商返佣',
    meat: {
      name: '渠道商返佣',
      icon: 'icon-shangjia'
    },
    component: index,
    children: [{
      path: 'payPage1',
      name: '返佣查询',
      meat: {
        name: '返佣查询'
      },
      component: () => import('@/views/view/table9/payPage1.vue')
    }]
  }, {
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
    path: 'table7',
    name: '终端审核',
    meat: {
      name: '终端审核',
      hidden: false
    },
    component: () => import('@/views/view/table1/table7.vue')
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
  }, {
    path: 'table13',
    name: '商户费率变更查询',
    meat: {
      name: '商户费率变更查询',
      hidden: false
    },
    component: () => import('@/views/view/table1/table13.vue')
  }, {
    path: 'table14',
    name: '费率审核',
    meat: {
      name: '费率审核',
      hidden: false
    },
    component: () => import('@/views/view/table1/table14.vue')
  }, {
    path: 'table15',
    name: '行业限额',
    meat: {
      name: '行业限额',
      hidden: false
    },
    component: () => import('@/views/view/table1/table15.vue')
  }]
}, {
  path: 'shop',
  redirect: '/deal/shop/continue1',
  name: '续期管理',
  meat: {
    name: '续期管理',
    icon: 'icon-shangjia'
  },
  component: index,
  children: [{
    path: 'continue1',
    name: '续期提醒列表',
    meat: {
      name: '续期提醒列表'
    },
    component: () => import('@/views/view/table10/continue1.vue')
  }]
}, {
  path: 'shop',
  redirect: '/deal/shop/specialRatePage1',
  name: '特殊费率',
  meat: {
    name: '特殊费率',
    icon: 'icon-shangjia'
  },
  component: index,
  children: [{
    path: 'specialRatePage1',
    name: '新增特殊费率',
    meat: {
      name: '新增特殊费率'
    },
    component: () => import('@/views/view/table11/specialRatePage1.vue')
  }]
}, {
  path: 'shop',
  redirect: '/deal/shop/inspectPage1',
  name: '实名认证',
  meat: {
    name: '实名认证',
    icon: 'icon-shangjia'
  },
  component: index,
  children: [{
    path: 'inspectPage1',
    name: '联网核查',
    meat: {
      name: '联网核查'
    },
    component: () => import('@/views/view/table7/inspectPage1.vue')
  }, {
    path: 'inspectPage2',
    name: '四要素',
    meat: {
      name: '四要素'
    },
    component: () => import('@/views/view/table7/inspectPage2.vue')
  }, {
    path: 'inspectPage3',
    name: '手机号鉴权',
    meat: {
      name: '手机号鉴权'
    },
    component: () => import('@/views/view/table7/inspectPage3.vue')
  }]
}, {
  path: 'shop',
  name: '交易管理',
  meat: {
    name: '交易管理',
    icon: 'icon-tuanduicankaoxian-'
  },
  component: index,
  children: [{
    path: 'order3',
    name: '交易查询',
    meat: {
      name: '交易查询'
    },
    component: () => import('@/views/view/table4/order03.vue')
  }]
}, {
  path: 'shop',
  name: '对账差错处理',
  meat: {
    name: '对账差错处理',
    icon: 'icon-tuanduicankaoxian-'
  },
  component: index,
  children: [{
    path: 'order1',
    name: '待处理订单',
    meat: {
      name: '待处理订单'
    },
    component: () => import('@/views/view/table4/order01.vue')
  }]
}, {
  path: 'shop',
  name: '异常订单',
  meat: {
    name: '异常订单',
    icon: 'icon-tuanduicankaoxian-'
  },
  component: index,
  children: [{
    path: 'order4',
    name: '异常订单',
    meat: {
      name: '异常订单'
    },
    component: () => import('@/views/view/table4/order04.vue')
  }]
}, {
  path: 'shop',
  name: '结算管理',
  meat: {
    name: '结算管理',
    icon: 'icon-tuanduicankaoxian-'
  },
  component: index,
  children: [{
    path: 'settlement',
    name: '结算单查询',
    meat: {
      name: '结算单查询'
    },
    component: () => import('@/views/view/table6/settlement1.vue')
  }]
}, {
  path: 'shop',
  name: '账单管理',
  meat: {
    name: '账单管理',
    icon: 'icon-tuanduicankaoxian-'
  },
  component: index,
  children: [{
    path: 'excelPage',
    name: '对账单下载',
    meat: {
      name: '对账单下载'
    },
    component: () => import('@/views/view/table5/excelPage.vue')
  }]
}]