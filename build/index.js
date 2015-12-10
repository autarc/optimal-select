/**
 * # Build
 *
 *
 */

const path = require('path')

const fs = require('fs-extra')
const webpack = require('webpack')
const merge = require('deep-merge')(function (target, source) {
  if (target instanceof Array) {
    return [].concat(target, source)
  }
  return source
})

const manifest = require('../package.json')

const env = {
  SRC: path.resolve(__dirname, '../src'),
  DIST: path.resolve(__dirname, '..', path.dirname(manifest.main)),
  FILE: path.basename(manifest.main, path.extname(manifest.main)),
  EXPORT: 'OptimalSelect',
  isProduction: (process.env.NODE_ENV === 'production') || process.argv.length > 2
}

if (env.isProduction) {
  fs.removeSync(env.DIST)
}

var config = {
  target: 'web',
  entry: path.resolve(env.SRC, 'index.js'),
  resolve: {
    extensions: ['', '.js']
  },
  output: {
    path: env.DIST,
    filename: env.FILE + '.js',
    library: env.EXPORT,
    libraryTarget: 'umd'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel'
      }
    ]
  }
}

// development: build + watch
if (!env.isProduction) {
  config = merge(config, {
    devtool: 'source-map-inline',
    debug: true
  })
  return webpack(config).watch(100, notify)
}

// production: release
config = merge(config, {
  devtool: 'sourcemap',
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false,
        screw_ie8: true
      }
    })
  ]
})

webpack(config).run(notify)


function notify (error, stats) {
  if (error) {
    return console.error('error', error)
  }
  console.log(new Date().toISOString(), ' - [' + env.EXPORT +']', stats.toString())
}
