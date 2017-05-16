const colors = require('colors/safe')
const through2 = require('through2')
const fs = require('fs')
const type = {
  template: {
    reg: /<template[^>]*>([\s\S]*)<\/template>/,
    ext: 'wxml',
    color: 'blue'
  },
  style: {
    reg: /<style[^>]*>([\s\S]*)<\/style>/,
    ext: 'wxss',
    color: 'yellow'
  },
  script: {
    reg: /<script[^>]*>([\s\S]*)<\/script>/,
    ext: 'js',
    color: 'green'
  }
}
const compile = function (type) {
  return through2.obj(function (file, enc, cb) {
    if (type.reg) {
      let context = file.contents.toString()
      context = type.reg.exec(context)
      if (context && context.length > 1) {
        context[1] = context[1].trim()
        file.contents = new Buffer(context[1], 'utf-8')
      } else {
        file.contents = new Buffer('', 'utf-8')
      }
    }
    try {
      cb(null, file)
      console.log(`${colors[type.color](`编译 ${type.ext}:`)} ${colors[type.color](file.path)}`)
    } catch (e) {
      console.log(e)
      cb(e)
    }
  })
}
module.exports = {
  html() {
    return compile(type.template)
  },
  css() {
    return compile(type.style)
  },
  js() {
    return compile(type.script)
  },
  wxss() {
    return compile(type.wxss)
  }
}

String.prototype.trim = function() {
  return this.replace(/(^\s*)|(\s*$)/g, '')
}
