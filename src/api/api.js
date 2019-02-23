import instance from './index'
import Axios from './axios'

const preUrlPath = ''
const downloadPath = 'http://test.weupay.com:8081'

export const getCode = `${preUrlPath}/admin/wp/comm/getCode`

export const loginVerify = params => { return instance.post(`${preUrlPath}/admin/wp/admin/loginVerify`, params).then(res => res.data) }

export const loginOut = params => { return instance.post(`${preUrlPath}/admin/wp/admin/loginOut`, params).then(res => res.data) }

export const queryMerchant = params => { return instance.post(`${preUrlPath}/admin/wp/admin/queryMerchant`, params).then(res => res.data) }

export const changeAgentMerEnter = params => { return instance.post(`${preUrlPath}/admin/wp/admin/changeAgentMerEnter`, params).then(res => res.data) }

export const ChangeAgentShop = params => { return instance.post(`${preUrlPath}/admin/wp/admin/ChangeAgentShop`, params).then(res => res.data) }

export const changeStatus = params => { return instance.post(`${preUrlPath}/admin/wp/admin/changeStatus`, params).then(res => res.data) }

export const updateMerStatus = params => { return instance.post(`${preUrlPath}/admin/wp/admin/updateMerStatus`, params).then(res => res.data) }

export const downloadAgentImages = `${preUrlPath}/admin/wp/admin/downloadAgentImages`

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
//门店密码重置
export const resetStorePwd = params => { return instance.post(`${preUrlPath}/admin/wp/admin/resetStorePwd`, params).then(res => res.data); };

//款台查询
export const queryAdminEmp = params => { return instance.post(`${preUrlPath}/admin/wp/admin/queryAdminEmp`, params).then(res => res.data); };

// 2018-11-02

// 修改状态(绑定和解绑)
export const updateTerminal = params => { return Axios.post(`${preUrlPath}/admin/wp/admin/updateTerminal`,params).then(res => res.data); };
// 查询详情
export const queryTerminal = params => { return Axios.post(`${preUrlPath}/admin/wp/admin/queryTerminal`,params).then(res => res.data); };
// 查询列表
export const queryTerminals = params => { return Axios.post(`${preUrlPath}/admin/wp/admin/queryTerminals`,params).then(res => res.data); };
//门店模糊查询
export const selectStoreList = params => { return instance.post(`${preUrlPath}/admin/wp/ag/selectStoreList`,params).then(res => res.data); };

export const queryMerMname = params => { return Axios.post(`${preUrlPath}/admin/wp/admin/queryMerMname`, params).then(res => res.data); };

//款台查询
export const selectEmpsBySid = params => { return instance.post(`${preUrlPath}/admin/wp/comm/selectEmpsBySid`,params).then(res => res.data); };
// 添加款台
export const addEmployee = params => { return instance.post(`${preUrlPath}/admin/wp/admin/addEmployee`, params).then(res => res.data); };


export const queryReplacementOrder = params => { return Axios.post(`${preUrlPath}/admin/repair/queryReplacementOrder`, params).then(res => res.data); };

export const replaceOrderInsertOrder = params => { return Axios.post(`${preUrlPath}/admin/repair/replaceOrderInsertOrder`, params).then(res => res.data); };

export const queryAwaitStatement = params => { return Axios.post(`${preUrlPath}/admin/repair/queryAwaitStatement`, params).then(res => res.data); };

export const updateStatementData = params => { return Axios.post(`${preUrlPath}/admin/repair/updateStatementData`, params).then(res => res.data); };

export const updateReplaceOrder = params => { return Axios.post(`${preUrlPath}/admin/repair/updateReplaceOrder`, params).then(res => res.data); };

//商户入住
export const agentMerEnter = params => { return instance.post(`${preUrlPath}/admin/wp/admin/agentMerEnter`, params).then(res => res.data); };
export const addAgentMertwo = params => { return instance.post(`${preUrlPath}/admin/wp/admin/addAgentMertwo`, params).then(res => res.data); };
//行业类目
export const addLcShopView = params => { return instance.post(`${preUrlPath}/admin/wp/comm/addLcShopView`, params).then(res => res.data); };
export const showBusinessType = params => { return instance.post(`${preUrlPath}/admin/wp/comm/showBusinessType`, params).then(res => res.data); };
//开户银行
export const selectBank = params => { return instance.post(`${preUrlPath}/admin/wp/comm/selectBank`, params).then(res => res.data); };
//开户银行省
export const getProvince = params => { return instance.post(`${preUrlPath}/admin/wp/comm/getProvince`, params).then(res => res.data); };
//开户银行市
export const queryCityCounty = params => { return instance.post(`${preUrlPath}/admin/wp/comm/queryCityCounty`, params).then(res => res.data); };

export const queryCity = params => { return instance.post(`${preUrlPath}/admin/wp/comm/queryCity`, params).then(res => res.data); };
//开户银行支行
export const selectbranch = params => {
  return instance.post(`${preUrlPath}/admin/wp/comm/selectbranchByProCit`, params).then(res => res.data);
};

//新增商户
export const addAgentMerone = params => { return instance.post(`${preUrlPath}/admin/wp/admin/addAgentMerone`, params).then(res => res.data); };

export const uploadImage = `${preUrlPath}/admin/wp/admin/uploadAgentImage`;

export const agentShopPage = params => { return instance.post(`${preUrlPath}/admin/wp/admin/agentShopPage`, params).then(res => res.data); };

export const addAgentMerthree = params => { return instance.post(`${preUrlPath}/admin/wp/admin/addAgentMerthree`, params).then(res => res.data); };

export const adminGetTwoCode = `${preUrlPath}/admin/wp/admin/adminGetTwoCode`;

export const getEmpMemCode = `${preUrlPath}/admin/wp/mer/getEmpMemCode`;

export const resetEmpPwd = params => { return instance.post(`${preUrlPath}/admin/wp/admin/resetEmpPwd`, params).then(res => res.data); };

export const queryEmployeeDetail = params => { return instance.post(`${preUrlPath}/admin/wp/admin/queryEmployeeDetail`, params).then(res => res.data); };

export const storePayConfig = params => { return instance.post(`${preUrlPath}/admin/wp/admin/storePayConfig`, params).then(res => res.data); };

export const updateAdminEmp = params => { return instance.post(`${preUrlPath}/admin/wp/admin/updateAdminEmp`, params).then(res => res.data); };

export const queryStoreDetail = params => { return instance.post(`${preUrlPath}/admin/wp/admin/queryStoreDetail`, params).then(res => res.data); };
//查询异常订单列表
export const queryExceptionOrderList = params => { return instance.post(`${preUrlPath}/admin/wp/admin/queryExceptionOrderList`, params).then(res => res.data); };
//异常订单同步
export const synExceptionOrderStatus = params => { return instance.post(`${preUrlPath}/admin/wp/admin/synExceptionOrderStatus`, params).then(res => res.data); };
//查询订单详情
export const queryOrderDetailNew = params => {
  return Axios.post(`${preUrlPath}/admin/wp/admin/queryOrderDetailNew`, params).then(res => res.data);
};
//更新订单状态
export const updateExceptionOrder = params => { return instance.post(`${preUrlPath}/admin/wp/admin/updateExceptionOrder`, params).then(res => res.data); };
//查询订单列表
export const queryOrderList = params => { return instance.post(`${preUrlPath}/admin/wp/admin/queryOrderList`, params).then(res => res.data); };

export const checkDataExcel = params => { return instance.get(`${downloadPath}/download/mer/checkDataExcel`, { params: params }); };

export const queryMerPayConfig = params => { return instance.post(`${preUrlPath}/admin/wp/admin/queryMerPayConfig`, params).then(res => res.data); };

export const updateMerPayConfig = params => { return instance.post(`${preUrlPath}/admin/wp/admin/updateMerPayConfig`, params).then(res => res.data); };

export const bsbLegalDocumentType = params => { return Axios.post(`${preUrlPath}/admin/wp/bsbadmin/bsbLegalDocumentType`, params).then(res => res.data); };

export const queryMerchantPay = params => { return instance.post(`${preUrlPath}/admin/wp/admin/queryMerchantPay`, params).then(res => res.data); };

export const updateMerchantPay = params => { return instance.post(`${preUrlPath}/admin/wp/admin/updateMerchantPay`, params).then(res => res.data); };

export const queryMerNextRate = params => { return instance.post(`${preUrlPath}/admin/wp/admin/queryMerNextRate`, params).then(res => res.data); };

export const queryStatementList = params => { return instance.post(`${preUrlPath}/admin/wp/admin/queryStatementList`, params).then(res => res.data); };

export const openWxAli = params => { return instance.post(`${preUrlPath}/admin/wp/admin/openWxAli`, params).then(res => res.data); };

export const queryDownloadData = params => {
  return instance.post(`${preUrlPath}/admin/wp/admin/queryDownloadData`, params).then(res => res.data);
};

export const queryMerDownRecord = params => {
  return instance.post(`${preUrlPath}/admin/wp/admin/queryMerDownRecord`, params).then(res => res.data);
};

export const queryChangeRateList = params => {
  return instance.post(`${preUrlPath}/admin/wp/admin/queryChangeRateList`, params).then(res => res.data);
};

export const examineChangeRate = params => {
  return instance.post(`${preUrlPath}/admin/wp/admin/examineChangeRate`, params).then(res => res.data);
};

export const queryChangeRate = params => {
  return instance.post(`${preUrlPath}/admin/wp/admin/queryChangeRate`, params).then(res => res.data);
};

export const updateChangeCount = params => {
  return instance.post(`${preUrlPath}/admin/wp/admin/updateChangeCount`, params).then(res => res.data);
};

export const queryChangeCount = params => {
  return instance.post(`${preUrlPath}/admin/wp/admin/queryChangeCount`, params).then(res => res.data);
};

export const fourElements = params => {
  return instance.post(`${preUrlPath}/admin/wp/admin/fourElements`, params).then(res => res.data);
};

export const threeElements = params => {
  return instance.post(`${preUrlPath}/admin/wp/admin/threeElements`, params).then(res => res.data);
};

export const uploadZIP = `${preUrlPath}/admin/wp/admin/uploadZIP`;

//新增商户
export const addBsbMerone = params => {
  return Axios.post(`${preUrlPath}/admin/wp/admin/addBsbMerone`, params).then(res => res.data);
};

export const addBsbMerthree = params => {
  return Axios.post(`${preUrlPath}/admin/wp/admin/addBsbMerthree`, params).then(res => res.data);
};

export const addBsbMertwo = params => {
  return Axios.post(`${preUrlPath}/admin/wp/admin/addBsbMertwo`, params).then(res => res.data);
};

export const agentRebate = params => {
  return Axios.post(`${preUrlPath}/admin/wp/admin/agentRebate`, params).then(res => res.data);
};

export const updateRebateStatus = params => {
  return Axios.post(`${preUrlPath}/admin/wp/admin/updateRebateStatus`, params).then(res => res.data);
};

export const agentShopBsbPage = params => {
  return Axios.post(`${preUrlPath}/admin/wp/admin/agentShopBsbPage`, params).then(res => res.data);
};

export const agentMerBsbEnter = params => {
  return Axios.post(`${preUrlPath}/admin/wp/admin/agentMerBsbEnter`, params).then(res => res.data);
};

export const queryAgentList = params => {
  return Axios.post(`${preUrlPath}/admin/wp/admin/queryAgentList`, params).then(res => res.data);
};

export const queryAgentRebates = params => {
  return Axios.post(`${preUrlPath}/admin/wp/admin/queryAgentRebates`, params).then(res => res.data);
};

export const agentRateConfigView = params => {
  return Axios.post(`${preUrlPath}/admin/wp/admin/agentRateConfigView`, params).then(res => res.data);
};

export const updateAgentRateConfig = params => {
  return Axios.post(`${preUrlPath}/admin/wp/admin/updateAgentRateConfig`, params).then(res => res.data);
};

export const resetAgentPwd = params => {
  return Axios.post(`${preUrlPath}/admin/wp/admin/resetAgentPwd`, params).then(res => res.data);
};

export const queryAgentByName = params => {
  return instance.post(`${preUrlPath}/admin/wp/comm/queryAgentByName`, params).then(res => res.data);
};

export const renewalReminderList = params => {
  return Axios.post(`${preUrlPath}/admin/wp/admin/renewalReminderList`, params).then(res => res.data);
};

//查询所有行业限额
export const findAllIndustryLimit = params => {
  return Axios.post(`${preUrlPath}/admin/wp/limit/findAllIndustryLimit`, params).then(res => res.data);
};

//修改行业限额
export const updateIndustryLimit = params => {
  return Axios.post(`${preUrlPath}/admin/wp/limit/updateIndustryLimit`, params).then(res => res.data);
};

export const findShopLimitByMid = params => {
  return Axios.post(`${preUrlPath}/admin/wp/limit/findShopLimitByMid`, params).then(res => res.data);
};

export const updateShopLimit = params => {
  return Axios.post(`${preUrlPath}/admin/wp/limit/updateShopLimit`, params).then(res => res.data);
};

export const querySpecialRate = params => {
  return instance.post(`${preUrlPath}/admin/wp/admin/querySpecialRate`, params).then(res => res.data);
};

export const addSpecialRate = params => {
  return instance.post(`${preUrlPath}/admin/wp/admin/addSpecialRate`, params).then(res => res.data);
};

export const updateSpecialRate = params => {
  return instance.post(`${preUrlPath}/admin/wp/admin/updateSpecialRate`, params).then(res => res.data);
};

export const repeatRemind = params => {
  return Axios.post(`${preUrlPath}/admin/wp/admin/repeatRemind`, params).then(res => res.data);
};