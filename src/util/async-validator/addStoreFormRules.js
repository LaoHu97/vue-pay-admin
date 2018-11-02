
import { number_phone } from "@/util/async-validator.js"

//添加门店表单验证
export const addStoreFormRules = {
	mname: [
		{ required: true, message: "请输入门店名称", trigger: "blur" },
		{ min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" }
	],
	storeName: [
		{ required: true, message: "请输入分店名称", trigger: "blur" },
		{ min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" }
	],
	telephone: [
		{ required: true, message: "请输入客服电话", trigger: "blur" },
		{ validator: number_phone, trigger: 'blur' }
	],
}
