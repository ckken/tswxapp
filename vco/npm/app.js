import {Promise} from './promise'
export default class {
  $init() {
    this.$wxToPromise()
    return this
  }

  $wxToPromise() {
    let noPromiseMethods = {
      stopRecord: true,
      pauseVoice: true,
      stopVoice: true,
      pauseBackgroundAudio: true,
      stopBackgroundAudio: true,
      showNavigationBarLoading: true,
      hideNavigationBarLoading: true,
      createAnimation: true,
      createContext: true,
      hideKeyboard: true,
      stopPullDownRefresh: true,
      request: true
    }

    Object.keys(wx).map((key) => {
      if (!noPromiseMethods[key] && key.substr(0, 2) !== 'on' && !(/\w+Sync$/.test(key))) {
        wx[`_${key}`] = wx[key]
        Object.defineProperty(wx, key, {
          get () {
            return (obj) => {
              obj = obj || {}
              return new Promise((resolve, reject) => {
                obj.success = resolve
                obj.fail = reject
                wx[`_${key}`](obj)
              }).catch(console.log.bind(console))
            }
          }
        })
      }
    })
  }
}
