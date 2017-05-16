import {useStrict, autorun, observable, action} from './mobx'
import {deepCopy} from './mobx-tool'
/**
 * 启动严格模式
 */
useStrict(false)
/**
 * 复用Store 缓存
 * @type {{}}
 * @private
 */
let _StoreObjectCache = {} // 缓存Store 对象共享数据
/**
 * 注入Store
 * @param StoreClass
 * @returns {Function}
 */
export const inject = function (...injectArg) {
  return function (page) {
    return class extends page {
      constructor(...args) {
        super(...args)
        this.store = this.store || {}
        injectArg.map((pathVal) => {
          if (!_StoreObjectCache[pathVal]) {
            let Cls = require(`../store/${pathVal}`)
            _StoreObjectCache[pathVal] = new Cls.default()
          }
          this.store[pathVal] = _StoreObjectCache[pathVal]
        })
        super.constructor()
      }
    }
  }
}
/**
 * 监听 pageClass
 * @param page
 * @returns {{}}
 */
export const observer = function (page) {
  /**
   * 绑定mobx 与 page
   */
  let connected = observable(false)

  /**
   * _UpdateState 监听观察者变化 同步到 setData
   * 私有变量
   * 单向绑定 state
   * 双向绑定store 没有定义state的话采取 store绑定数据 懒人模式
   */
  function _UpdateState() {
    if (typeof this.state === 'function') {
      let state = this.state()
      // state = deepCopy(state)
      this.setData({...state})
    } else {
      let store = this.store || {}
      // toJS(store) // 暂时取消转换成js 的类型判断 节省性能
      store = deepCopy(store) // 删除原型链
      this.setData(store)
    }
  }

  return class extends page {
    _isUnload = false // 监听是否同一个监听名称避免重复监听
    onShow(...arg) {
      action(() => {
        connected.set(true)
      })()
      super.onShow && super.onShow(...arg)
    }

    onHide(...arg) {
      action(() => {
        connected.set(false)
      })()
      super.onHide && super.onHide(...arg)
    }

    onLoad(...arg) {
      action(() => {
        connected.set(true)
      })()
      autorun(() => {
        if (connected.get() && !this._isUnload) {
          //console.log('this.store', this.store)
          _UpdateState.call(this)
        }
      })
      super.onLoad && super.onLoad(...arg)
    }

    onUnload(...arg) {
      action(() => {
        connected.set(false)
        this._isUnload = true
      })()
      super.onUnload && super.onUnload(...arg)
    }
  }
}
