//添加终端表单验证
export const addTerminalFormRules = {
    terminal_type: [
        { required: true, message: "请选择终端类型", trigger: "change" }
    ],
    SN: [{ required: false, message: "请选择设备编号", trigger: "change" }],
    terminal_version: [
        { required: true, message: "请选择设备型号", trigger: "change" }
    ],
    sid: [{ required: true, message: "请选择门店", trigger: "change" }],
    eid: [{ required: true, message: "请选择款台", trigger: "change" }]
}