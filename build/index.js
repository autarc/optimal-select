/**
 * # Build
 *
 * Handles the scripts defined in 'package.json'
 */

require('babel-register')

var path = require('path')

global.__DEVELOPMENT__ = !(process.env.NODE_ENV === 'production' || process.argv.length > 2)

// environment (default mode: development)
var env = {
  // ROOT: path.resolve(__dirname, '..'),
  SRC: path.resolve(__dirname, '../src'),
  LIB: path.resolve(__dirname, '../lib'),
  DIST: path.resolve(__dirname, '../dist')
}

// ~> define individual transformation order here
var SourceLibrary = require('./tasks/src-lib')
var SourceDistribution = require('./tasks/src-dist')

SourceLibrary(env).then(function () {
  return SourceDistribution(env)
})
.then(function(){
  console.log('[BUILD]', __DEVELOPMENT__ ? 'WATCH' : 'RELEASE')
})
.catch(console.error.bind(console))
