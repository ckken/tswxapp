/**
 * Created by ken on 2017/1/5.
 */
import {Promise} from 'promise'
const host = 'https://napi.mazing.com'
const WxHttp = function (method = 'GET') {
  /**
   * @url
   * @data
   * @header:{'content-type': 'application/x-www-form-urlencoded'||'application/json'}
   * token
   */
  return function (url = '', data = {}, header = {}, token = '') {
    let isURL = (url.indexOf('http') > -1) || (url.indexOf('https') > -1)
    url = (url.indexOf('http') > -1) ? url : `${host}${url}`
    const {mazingMember} = getApp()
    if (token === '') {
      token = (mazingMember && mazingMember.token) ? mazingMember.token : ''
    }
    header = header || {'content-type': 'application/x-www-form-urlencoded'}
    header.lang = (mazingMember && mazingMember.lang) ? mazingMember.lang : 'zh'
    if (token) {
      header.token = token
    }
    return new Promise((resolve, reject) => {
      wx.request({
        method: method,
        url: url,
        data: data,
        header: header,
        complete: (res) => {
          console.log("url:" url "\nresponse:" res)
          var object = res.data.object
          var code = res.data.code
          var isSuccess = code == 1
          if (code == 80) {//TODO:还需要重新调用手机登录
            try {
              wx.clearStorageSync()
            } catch (e) {
              // Do something when catch error
            }
          }
          var message = isSuccess ? '调用成功' : (res.data.message || '网络连接出错,请检查联网')
          resolve({object, code, message})
        }
      })
    })
  }
}

export default {
  get: WxHttp('GET'),
  post: WxHttp('POST'),
  put: WxHttp('PUT'),
  del: WxHttp('DELETE')
}
