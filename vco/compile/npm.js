const through2 = require('through2')
const ts = require('typescript')
const path = require('path')
const fs = require('fs')
const rootPath = path.resolve('.')
const tsconfig = fs.readFileSync(`${rootPath}/tsconfig.json`, 'utf-8')
/**
 * ts to js es5
 * @returns {*}
 */
module.exports = function () {
  return through2.obj(function (file, enc, cb) {
    try {
      let code = file.contents.toString()
      code = ts.transpileModule(code, tsconfig)
      let context = code.outputText
      file.contents = new Buffer(context, 'utf-8')
      cb(null, file)
    } catch (e) {
      console.log(e)
      cb(e)
    }
  })
}
