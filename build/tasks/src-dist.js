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
  return target
})

/**
 * [default description]
 * @param  {[type]} env [description]
 * @return {[type]}     [description]
 */
export default (env) => {
  emptyDirSync(env.DIST)
  return new Promise((resolve, reject) => {

    const CommonConfig = {
      entry: `${env.SRC}/index.js`,
      output: {
        path: env.DIST,
        filename: 'optimal-select.js',
        library: 'OptimalSelect',
        libraryTarget: 'umd'
      },
      plugins: [
        new webpack.DefinePlugin({
          'global.document': JSON.stringify(true)
        })
      ],
      module: {
        rules: [
          {
            test: /\.js$/,
            use: [
              {
                loader: 'babel-loader'
              }
            ]
          }
        ]
      }
    }

    // = development
    const DevelopmentConfig = merge({
      devtool: 'inline-source-map',
      plugins: [
        new webpack.DefinePlugin({
          'process.env': JSON.stringify({
            NODE_ENV: 'development'
          })
        }),
        new webpack.LoaderOptionsPlugin({
          debug: true
        })
      ]
    }, CommonConfig)

    if (__DEVELOPMENT__) {
      var ready = false
      return webpack(DevelopmentConfig).watch(100, (error, stats) => {
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
    const ProductionDebugConfig = {...DevelopmentConfig}

    // = production:minified
    const ProductionMinifiedConfig = merge({
      devtool: 'sourcemap',
      output: {
        filename: CommonConfig.output.filename.replace('.js', '.min.js')
      },
      plugins: [
        new webpack.DefinePlugin({
          'process.env': JSON.stringify({
            NODE_ENV: 'production'
          })
        }),
        new webpack.LoaderOptionsPlugin({
          minimize: true
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
          sourceMap: true,
          compress: {
            unused: true,
            dead_code: true,
            warnings: false,
            screw_ie8: true
          },
          output: {
            comments: false
          }
        })
      ]
    }, CommonConfig)

    return webpack(ProductionDebugConfig).run((error, stats) => {
      if (error) {
        return reject(error)
      }
      return webpack(ProductionMinifiedConfig).run((error, stats) => {
        if (error) {
          return reject(error)
        }
        return resolve()
      })
    })
  })
}
