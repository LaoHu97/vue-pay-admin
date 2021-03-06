import axios from 'axios'
import router from '../router'
import * as util from '../util/util.js'

const instance = axios.create({
  baseURL: process.env.API_ROOT,
  timeout: 40000
})

instance.defaults.headers.post['Content-Type'] = 'application/json'
// 错误处理
instance.interceptors.request.use(request => {
  return request
}, error => {
  util.catchError(error)
})

instance.interceptors.response.use(response => {
  if (response.data.status === 200) {
    return response
  } else {
    util.catchError(response)
  }
}, error => {
  util.catchError(error)
})

export default instance
