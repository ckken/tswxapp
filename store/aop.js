/**
 * Created by ken on 2017/4/21.
 * mobx 切面 可以更好的让代码重用
 */
export default class {
  constructor() {
    Object.getOwnPropertyNames(this.__proto__).map((key) => {
      if (key !== 'constructor' && typeof this[key] === 'function') {
        const fn = this[`${key}`]
        if ('Promise' === typeof fn) {
          this[`${key}`] = async function (...arg) {
            this[`${key}_before`] && await this[`${key}_before`]()
            const data = await fn.call(this, ...arg)
            this[`${key}_after`] && await this[`${key}_after`](data)
          }
        }
      }
    })
  }
}
