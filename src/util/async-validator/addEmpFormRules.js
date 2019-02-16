//添加门店表单验证
import { number_phone } from "@/util/async-validator.js"
export const addEmpFormRules = {
  username: [
    { required: true, message: "请输入款台名称", trigger: "blur" },
    { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" }
  ],
  storeId: [
    { required: true, message: "请选择所属门店", trigger: "change" }
  ],
  email: [
    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
  ],
  phone: [
    { required: true, message: "请输入联系电话", trigger: "blur" },
    { validator: number_phone, trigger: 'blur' }
  ],
	linkman: [{
	  required: true,
	  message: "请输入联系人",
	  trigger: "blur"
	}]
}