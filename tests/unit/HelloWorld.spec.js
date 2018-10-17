import { shallowMount } from '@vue/test-utils'
import loginIndex from '@/views/login/index.vue'

test('测试', () => {
  // 渲染这个组件
  const wrapper = shallowMount(loginIndex)

  // `authCode` 在除去头尾空格之后不应该少于 7 个字符
  wrapper.setData({ authCode: ' '.repeat(7) })

  // 确认错误信息被渲染了
  expect(wrapper.find('.error').exists()).toBe(true)

  // 将名字更新至足够长
  wrapper.setData({
    authCode: 'Lachlan'
  })

  // 断言错误信息不再显示了
  expect(wrapper.find('.error').exists()).toBe(false)
})
