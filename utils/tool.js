/**
 * Created by ken on 2017/4/20..
 */
module.exports = {
  formatNumber (n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  },
  /**
   *
   * @param date 千分位
   * @param fmt
   * @returns {*}
   */
  formatTime (date, fmt) {
    date = new Date(date)
    if(!date)return '--'
    var o = {
      'M+': date.getMonth() + 1,                 // 月份
      'd+': date.getDate(),                    // 日
      'h+': date.getHours(),                   // 小时
      'm+': date.getMinutes(),                 // 分
      's+': date.getSeconds(),                 // 秒
      'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
      'S': date.getMilliseconds()             // 毫秒
    }
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (var k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
      }
    }
    return fmt
  },
  formatPrice (num) {
    return (Number(num).toFixed(2) + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
  },
  /**
   * 将分为单位的number转换成人民币字符串输出
   * @param  {[type]} cent [description]
   * @return {[type]}      [description]
   */
  centToYuan (cent) {
    return '¥ ' + Number(cent/100).toFixed(2)
  },

  /**
   * 代理层/域/java-api路径
   * [/agent][/storeapi][/api/ticket/ticketRule/query]
   */
  proxyJava (url, domain) {
    return `https://napi.mazing.com/agent/${domain}${url}`
  },

  /**
   * 根据相对路径获取绝对路径
   * @param url
   * @returns {*}
   */
  mzImg (url) {
    if (!url) {
      return ''
    }
    return 'https://img.mazing.com/' + url
  }

}
