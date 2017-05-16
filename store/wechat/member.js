/**
 * Created by ken on 2017/4/1.
 */
import {autorun, observable, computed, action} from 'utils/mobx'
import http from 'utils/http'
import aop from 'store/aop'
/**
 * 初始化默认值
 */
const LoginTimeOut = 604700 //  登陆过期时间 秒为单位 默认为 7天 ：604700
const MzMemberKey = 'mazingMember' // 登陆缓存key
const Api = {
  login: '/oauth/member/loginbywx', // 微信登陆
  memberInfo: '/oauth/member/info', // 获取用户数据
  loginByCaptcha: '/oauth/member/loginbycaptcha', // 验证码登录
  getCaptcha: '/oauth/member/captcha' // 获取验证码
}
/**
 * 0-什么都不是；1-超管；2-运营；11-门店店主；12-门店店长
 * @type {number}
 */
const role = 0
export default class extends aop {
  @observable member = {}

  @computed get GetMember() {
    return JSON.stringify(this.member)
  }

  @computed get roleType() {
    //  (0-什么都不是；1-超管；2-运营；11-门店店主；12-门店店长)
    if(!this.member||!this.member.role)return '游客'
    switch (this.member.role) {
      case 1:
        return '超级管理员'
        break
      case 2:
        return '运营'
        break
      case 11:
        return '门店店主'
        break
      case 12:
        return '门店店长'
        break
      default:
        return '游客'
    }
  }

  @action checkPhone() {}

  @action
  async InitMember() {
    let member = await wx.getStorage({key: MzMemberKey})
    member = member && member.data || {}
    member.lang = 'zh'
    // 语言环境获取,目前仅支持'zh'和'en'
    wx.getSystemInfo({
      complete: function(res) {
        member.lang = (res && res.language.startsWith('zh')) ? 'zh' : 'en'
      }
    })
    /**
     * 7天时间 7天后退出登陆过
     * @type {number}
     */

    if (Object.keys(member).length > 0) {
      member.now = member.now || 0
      let nowTimeOut = Date.now() / 1000 - member.now
      if (nowTimeOut > LoginTimeOut) {
        await wx.removeStorage({key: MzMemberKey})
        member = {}
      }
    }
    /**
     * 7天后注销重新登录
     */

    if (Object.keys(member).length === 0) {
      let {code} = await wx.login()
      member = await wx.getUserInfo()
      member.code = code
      let {object, code, message} = await http.post(Api.login, member)

      if (code === 1) {
        member = Object.assign(member, object)
      }
      await wx.setStorage({key: MzMemberKey, data: member}) // 微信异步set
    }
    this.member = member
    return this.member
  }
  /**
   * 根据电话号码获取验证码
   */
  @action async getCaptcha(passport) {
    var params = {
      mobile: passport
    }
    return await http.post(Api.getCaptcha, params)
  }
  /**
   * 验证码登录米星(功能相当于绑定)
   */
  @action async loginByCaptcha(passport, captcha) {
    var params = {
      mobile: passport,
      captcha: captcha,
      wxappOpenId: this.member.wx.openId,
      wxUnionId: this.member.wx.unionId
    }
    wx.showLoading({title: '绑定中'})
    let response = await http.post(Api.loginByCaptcha, params)
    if (response.code === 1) {
      let member = Object.assign(this.member, response.object)
      await wx.setStorage({key: MzMemberKey, data: member}) // 微信异步set
      this.member = member
      wx.showToast({title: '绑定成功', duration: 2000})
    } else {
      wx.showToast({title: response.message, duration: 2000})
    }

    return response
  }
  /**
   * 获取用户在米星的数据,在 解绑/绑定 小程序操作之后调用
   * @return {Promise} [description]
   */
  async getmemberInfo() {
    var response = await http.get(Api.memberInfo)
    return response
  }
  /**
   * 解绑手机号码
   * @type {String}
   */
  @action async unbindwxapp() {
    console.log(JSON.stringify(this.member))
    var url = '/oauth/member/unbindwxapp'
    var params = {
      openId: this.member.wx.openId,
      unionId: this.member.wx.unionId
    }
    wx.showLoading({title: '解绑中'})
    var response = await http.post(url, params)
    if (response.code == 1) {
      this.member.isBindMobile = false
      await wx.setStorage({key: MzMemberKey, data: this.member})
      wx.showToast({title: '解绑成功'})
    } else {
      wx.showToast({title: response.message, duration: 2000})
    }
    return response
  }
}
