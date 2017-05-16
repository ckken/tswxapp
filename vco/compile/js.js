const through2 = require('through2')
const ts = require('typescript')
const path = require('path')
const fs = require('fs')
const os = require('os')
const rootPath = path.resolve('.')
const tsconfig = fs.readFileSync(`${rootPath}/tsconfig.json`, 'utf-8')
const colors = require('colors/safe')
/**
 * app & page 格式化
 * @param context
 * @param file
 * @returns {*}
 */
function classTofunction(context, file) {
  let defaultExport = 'exports.default'
  let matchs = context.match(/exports\.default\s*=\s*(\w+);/i)
  if ((file.path.indexOf(`src${path.sep}app.js`) > -1 || file.path.indexOf(`src${path.sep}app.vue`) > -1) && matchs) {
    defaultExport = matchs[1]
    context = context.replace(/exports\.default\s*=\s*(\w+);/i, '')
    context += `\App(require('vco').default.$initApp(${defaultExport}));\n`
    // console.log('app',file.path)
  } else if (file.path.indexOf(`src${path.sep}pages`) > -1 && matchs) {
    defaultExport = matchs[1]
    context = context.replace(/exports\.default\s*=\s*(\w+);/i, '')
    context += `\Page(require('vco').default.$initPage(${defaultExport}));\n`
    // console.log('page', file.path)
  }
  return context
}
/**
 * 相对路径转换成绝对路径
 * @param context
 * @param file
 * @returns {string|void|XML|*}
 */
function absoluteTorelative(context, file) {
  return context.replace(/require\(['"]([\w\d_\-\.\/]+)['"]\)/ig, (match, lib) => {
    // console.log(match, lib)
    if (lib[0] === '.') {
      /**
       * 相对路径
       */
    } else if (lib.indexOf('/') === -1 || lib.indexOf('/') === lib.length - 1) {
      /**
       * 全局模块
       * @type {string}
       */
      var distPath = file.path.replace('/src/', '/dist/')
      var fromlib = rootPath + '/dist/npm/' + lib + '.js'
      fromlib = path.parse(fromlib)
      distPath = path.parse(distPath)
      lib = path.relative(distPath.dir, fromlib.dir)
      lib = lib || '.'
      lib = lib + '/' + fromlib.name
    } else {
      /**
       * 需要转义的模块
       * @type {string}
       */
      var distPath = file.path.replace('/src/', '/dist/')
      var fromlib = rootPath + '/dist/' + lib + '.js'
      fromlib = path.parse(fromlib)
      distPath = path.parse(distPath)

      lib = path.relative(distPath.dir, fromlib.dir)
      lib = lib || '.'
      lib = lib + '/' + fromlib.name
      // console.log(distPath.dir,fromlib.dir,lib)
    }
    // windows反斜杠问题
    if (os.type().toLocaleLowerCase().indexOf('windows') >= 0) {
      lib = lib.replace(/\\/g, '/').replace('../dist/', '')
    }
    // console.log(lib)
    return `require('${lib}')`
  })
}
/**
 * ts 转换 js
 * @param file
 * @returns {*}
 */
function tsToJs(file) {
  var code = file.contents.toString()
  return ts.transpileModule(code, tsconfig)
}
/**
 * gulp ts 编译入口
 * @returns {*}
 */
function compileJs() {
  return through2.obj(function (file, enc, cb) {
    try {
      let code = tsToJs(file)
      let context = code.outputText
      //
      context = classTofunction(context, file)
      context = absoluteTorelative(context, file)
      //
      file.contents = new Buffer(context, 'utf-8')
      cb(null, file)
      console.log(`${colors.blue('编译:')} ${colors.yellow(file.path)}`)
    } catch (e) {
      console.log(e)
      cb(e)
    }
  })
}

module.exports = compileJs