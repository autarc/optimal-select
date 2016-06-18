/**
 * # Task: Source - Distribution
 *
 * Configuration to build browser packages.
 */

import { emptyDirSync } from 'fs-extra'
import webpack from 'webpack'
const merge = require('deep-merge')((target, source) => {
  if (target instanceof Array) {
    return [].concat(target, source)
  }
  return source
})

/**
 * [default description]
 * @param  {[type]} env [description]
 * @return {[type]}     [description]
 */
export default (env) => {
  emptyDirSync(env.DIST)
  return new Promise((resolve, reject) => {

    var config = {
      target: 'web',
      entry: `${env.SRC}/index.js`,
      resolve: {
        extensions: ['', '.js']
      },
      output: {
        path: env.DIST,
        filename: 'optimal-select.js',
        library: 'OptimalSelect',
        libraryTarget: 'umd'
      },
      module: {
        loaders: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel'
          }
        ]
      }
    }

    // = development
    if (__DEVELOPMENT__) {
      const DevConfig = merge(config, {
        debug: true,
        devtool: 'inline-source-map'
      })
      var ready = false
      return webpack(DevConfig).watch(100, (error, stats) => {
        if (ready) {
          if (error) {
            return console.error(error)
          }
          return console.log(new Date().toISOString(), ' - [OptimalSelect]', stats.toString())
        }
        ready = true
        return resolve()
      })
    }

    // = production:debug
    const ProductionDebugConfig = merge(config, {
      debug: true,
      plugins: [
        new webpack.DefinePlugin({
          'process.env': {
            'NODE_ENV': JSON.stringify('development')
          }
        })
      ]
    })

    // = production:min
    const ProductionMinConfig = merge(config, {
      devtool: 'sourcemap',
      output: {
        filename: config.output.filename.replace('.js', '.min.js')
      },
      plugins: [
        new webpack.DefinePlugin({
          'process.env': {
            'NODE_ENV': JSON.stringify('production')
          }
        }),
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

    return webpack(ProductionDebugConfig).run((error, stats) => {
      if (error) {
        return rejec(error)
      }
      return webpack(ProductionMinConfig).run((error, stats) => {
        if (error) {
          return reject(error)
        }
        return resolve()
      })
    })

  })
}
