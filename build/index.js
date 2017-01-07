/**
 * # Build
 *
 * Handles the scripts defined in 'package.json'.
 */

// environment (default mode: development)
global.__DEVELOPMENT__ = !(process.env.NODE_ENV === 'production' || process.argv.length > 2)

require('babel-register')

var path = require('path')

var SourceLibrary = require('./tasks/src-lib')
var SourceDistribution = require('./tasks/src-dist')

var env = {
  SRC: path.resolve(__dirname, '../src'),
  LIB: path.resolve(__dirname, '../lib'),
  DIST: path.resolve(__dirname, '../dist')
}

SourceLibrary(env).then(function () {
  return SourceDistribution(env)
})
.then(function(){
  console.log('[BUILD]', __DEVELOPMENT__ ? 'WATCH' : 'RELEASE')
})
.catch(console.error.bind(console))
