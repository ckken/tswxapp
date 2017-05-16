const gulp = require('gulp')
const less = require('gulp-less')
const rename = require('gulp-rename')
// const clean = require('gulp-clean')
const watch = require('gulp-watch')
const del = require('del')
const path = require('path')
const compileJs = require('./vco/compile/js')
const compileHtml = require('./vco/compile/html')
const compileCss = require('./vco/compile/css')
const compileJson = require('./vco/compile/json')
const npm = require('./vco/compile/npm')
const {html, css, js} = require('./vco/compile/vue')
const gulpif = require('gulp-if')
// const sourcemaps = require('gulp-sourcemaps')// 小程序暂不支持

gulp.task('watch', function () {
  // 删除所有生成文件
  del.sync(['./dist'])
  // vue编译
  watch('src/**/*.vue', {ignoreInitial: false}).pipe(js()).pipe(compileJs()).pipe(rename({extname: '.js'})).pipe(gulp.dest('dist'))
  watch('src/**/*.vue', {ignoreInitial: false}).pipe(html()).pipe(rename({extname: '.wxml'})).pipe(gulp.dest('dist'))
  watch('src/**/*.vue', {ignoreInitial: false}).pipe(css()).pipe(gulpif(ifWxss, less({paths: [path.join(__dirname, 'less', 'includes')]}))).pipe(rename({extname: '.wxss'})).pipe(gulp.dest('dist'))
  // 库文件生成
  watch(['vco/npm/**/*.js'], {ignoreInitial: false}).pipe(npm()).pipe(gulp.dest('dist/npm'))
  watch('src/**/*.{png,jpg,gif,bmp}', {ignoreInitial: false}).pipe(gulp.dest('dist'))
  // 普通版本同步
  watch('src/{pages,components}/**/*.less', {ignoreInitial: false}).pipe(compileCss()).pipe(less({paths: [path.join(__dirname, 'less', 'includes')]})).pipe(rename({extname: '.wxss'})).pipe(gulp.dest('dist'))
  watch('src/**/*.html', {ignoreInitial: false}).pipe(compileHtml()).pipe(rename({extname: '.wxml'})).pipe(gulp.dest('dist'))
  watch('src/**/*.json', {ignoreInitial: false}).pipe(compileJson()).pipe(gulp.dest('dist'))
  // 兼容老版本的写法
  watch('src/**/*.{js,ts}', {ignoreInitial: false}).pipe(compileJs()).pipe(gulp.dest('dist'))
  watch('src/**/*.wxml', {ignoreInitial: false}).pipe(gulp.dest('dist'))
  watch('src/**/*.wxss', {ignoreInitial: false}).pipe(gulp.dest('dist'))
})

function ifWxss(file) {
  return (file.contents.toString().indexOf('.wxss') === -1)
}
