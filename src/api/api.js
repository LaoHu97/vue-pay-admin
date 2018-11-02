import instance from './index'
import Axios from './axios'

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

export const queryAgentShopMer = params => { return instance.post(`${preUrlPath}/admin/wp/admin/queryAgentShopMer`, params).then(res => res.data) }

export const resetMerMpwd = params => { return instance.post(`${preUrlPath}/admin/wp/ag/resetMerMpwd`, params).then(res => res.data) }

//打印列表
export const queryPrintcfg = params => { return instance.post(`${preUrlPath}/admin/wp/agent/device/queryPrintcfg`,params).then(res => res.data); };
//删除列表
export const deletePrintNew = params => { return instance.post(`${preUrlPath}/admin/wp/mer/deletePrintNew`,params).then(res => res.data); };
//添加打印配置
export const addPrintcfg = params => { return instance.post(`${preUrlPath}/admin/wp/agent/device/addPrintcfg`,params).then(res => res.data); };
//打印状态修改
export const updatePStatus = params => { return instance.post(`${preUrlPath}/admin/wp/agent/device/updatePStatus`,params).then(res => res.data); };
//打印状态修改
export const updatePStatusNew = params => { return instance.post(`${preUrlPath}/admin/wp/mer/updatePStatusNew`,params).then(res => res.data); };
//修改打印配置
export const updatePrintcfg = params => { return instance.post(`${preUrlPath}/admin/wp/agent/device/updatePrintcfg`,params).then(res => res.data); };

export const selectSaleByName= params => { return instance.post(`${preUrlPath}/admin/wp/comm/selectSaleByName`, params).then(res => res.data); };

export const updateAgentSalesman = params => { return instance.post(`${preUrlPath}/admin/wp/ag/updateAgentSalesman`,params).then(res => res.data); };
//门店查询
export const queryStoresShop = params => { return instance.post(`${preUrlPath}/admin/wp/admin/queryStoresShop`,params).then(res => res.data); };
//门店添加
export const addAdminStore = params => { return instance.post(`${preUrlPath}/admin/wp/admin/addAdminStore`,params).then(res => res.data); };
//门店修改
export const updateAdminStore = params => { return instance.post(`${preUrlPath}/admin/wp/admin/updateAdminStore`,params).then(res => res.data); };

// 2018-11-02

// 修改状态(绑定和解绑)
export const updateTerminal = params => { return Axios.post(`${preUrlPath}/admin/wp/admin/updateTerminal`,params).then(res => res.data); };
// 查询详情
export const queryTerminal = params => { return Axios.post(`${preUrlPath}/admin/wp/admin/queryTerminal`,params).then(res => res.data); };
// 查询列表
export const queryTerminals = params => { return Axios.post(`${preUrlPath}/admin/wp/admin/queryTerminals`,params).then(res => res.data); };
//门店模糊查询
export const selectStoreList = params => { return Axios.post(`${preUrlPath}/admin/wp/ag/selectStoreList`,params).then(res => res.data); };
//款台查询
export const selectEmpsBySid = params => { return Axios.post(`${preUrlPath}/admin/wp/comm/selectEmpsBySid`,params).then(res => res.data); };