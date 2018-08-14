import instance from './index'

const preUrlPath = ''
// const downloadPath = process.env.API_DOWNLOAD || ''

export const loginShopVerify = params => { return instance.post(`${preUrlPath}/admin/wp/mer/loginShopVerify`, params).then(res => res.data) }
