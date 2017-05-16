import mobx from './mobx'
let _mergeGetterValue = function (res, object) {
  Object.getOwnPropertyNames(object).forEach(function (propertyName) {
    if (propertyName === '$mobx') {
      return
    }
    let descriptor = Object.getOwnPropertyDescriptor(object, propertyName)
    if (descriptor && !descriptor.writable) {
      res[propertyName] = object[propertyName]
    }
  })
}

let _toJS = function (object) {
  let res = mobx.toJS(object)
  _mergeGetterValue(res, object)
  return res
}

export const toJS = function (props) {
  let res = {}
  Object.keys(props).forEach(function (key) {
    res[key] = _toJS(props[key])
  })
  return res
}

export const deepCopy = function (o={}) {
  return JSON.parse(JSON.stringify(o))
}
