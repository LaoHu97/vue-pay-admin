//电话验证
export const number_phone = (rule, value, callback) => {
  if (!/^\d{7,15}$/.test(value) && value !== '') {
    callback(new Error('请输入正确的电话号码'));
  } else {
    callback();
  }
}
