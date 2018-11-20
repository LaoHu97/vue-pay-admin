//添加门店表单验证
export const addEmpFormRules = {
  username: [
    { required: true, message: "请输入门店名称", trigger: "blur" },
    { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" }
  ],
  storeId: [
    { required: true, message: "请选择所属门店", trigger: "change" }
  ]
}