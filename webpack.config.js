const path = require('node:path')
const webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = (_env, argv) => {
  return {
    devtool: false,
    context: path.resolve(__dirname, 'src'),
    entry: {
      content: './content/index.js',
      popup: './popup/index.js',
      background: './background/index.js'
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].js'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          use: {
            loader: 'esbuild-loader',
            options: {
              loader: 'jsx',
              target: 'es2020'
            }
          }
        },
        {
          test: /\.svg$/,
          loader: 'svg-inline-loader'
        }
      ]
    },
    plugins: [
      new CleanWebpackPlugin(),
      new CopyWebpackPlugin({
        patterns: ['*']
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(argv.mode)
      })
    ],
    optimization: {
      concatenateModules: true,
      minimizer:
        argv.mode === 'production'
          ? [
              new TerserPlugin({
                parallel: true,
                terserOptions: {
                  mangle: false,
                  output: {
                    beautify: true,
                    indent_level: 2 // eslint-disable-line camelcase
                  }
                }
              })
            ]
          : undefined
    }
  }
}
