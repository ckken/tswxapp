/**
 * Created by ken on 2017/4/5.
 */
const colors = require('colors/safe')
const through2 = require('through2')
function compile() {
  return through2.obj(function (file, enc, cb) {
    try {
      cb(null, file)
      console.log(`${colors.blue('编译:')} ${colors.red(file.path)}`)
    } catch (e) {
      console.log(e)
      cb(e)
    }
  })
}

module.exports = compile