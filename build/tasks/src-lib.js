/**
 * # Task: Source - Library
 *
 *
 */

import { emptyDirSync } from 'fs-extra'
import gulp from 'gulp'
const $ = require('gulp-load-plugins')()

/**
 * [description]
 * @param  {[type]} env [description]
 * @return {[type]}     [description]
 */
export default (env) => {
  emptyDirSync(env.LIB)
  return new Promise((resolve, reject) => {
    const MATCH_ALL = `${env.SRC}/**/*`
    const target = `${env.LIB}/`
    transform(gulp.src(MATCH_ALL), target).on('end', () => {
      if (__DEVELOPMENT__) {
        $.watch(MATCH_ALL, (file) => {
          transform(gulp.src(file.path, { base: `${env.SRC}` }), target)
          .on('end', () => console.log('[CHANGE]', $.util.colors.yellow(file.path)))
        })
      }
      return resolve()
    })
  })
}

/**
* Lazypipe alternative re-usable code
* @param  {[type]} stream [description]
* @param  {[type]} target [description]
* @return {[type]}        [description]
*/
function transform (stream, target) {
  return stream
  .pipe($.plumber(::console.error))
  .pipe($.sourcemaps.init())
    .pipe($.babel({/** see .babelrc **/}))
  .pipe($.sourcemaps.write())
  .pipe($.plumber.stop())
  .pipe(gulp.dest(target))
}
