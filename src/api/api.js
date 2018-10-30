import instance from './index'

const preUrlPath = ''
// const downloadPath = process.env.API_DOWNLOAD || ''

export const getCode = `${preUrlPath}/admin/wp/comm/getCode`

export const loginVerify = params => { return instance.post(`${preUrlPath}/admin/wp/admin/loginVerify`, params).then(res => res.data) }

export const loginOut = params => { return instance.post(`${preUrlPath}/admin/wp/admin/loginOut`, params).then(res => res.data) }

export const queryMerchant = params => { return instance.post(`${preUrlPath}/admin/wp/admin/queryMerchant`, params).then(res => res.data) }

export const changeAgentMerEnter = params => { return instance.post(`${preUrlPath}/admin/wp/admin/changeAgentMerEnter`, params).then(res => res.data) }

export const ChangeAgentShop = params => { return instance.post(`${preUrlPath}/admin/wp/admin/ChangeAgentShop`, params).then(res => res.data) }

export const changeStatus = params => { return instance.post(`${preUrlPath}/admin/wp/admin/changeStatus`, params).then(res => res.data) }

export const updateMerStatus = params => { return instance.post(`${preUrlPath}/admin/wp/admin/updateMerStatus`, params).then(res => res.data) }

export const downloadAgentImages = `${preUrlPath}/admin/wp/ag/downloadAgentImages`
