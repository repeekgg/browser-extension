const path = require('path')
const webpack = require('webpack')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  devtool: process.env.NODE_ENV === 'production' ? false : 'inline-source-map',
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
        include: /popup/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['react'],
            plugins: [
              'transform-class-properties',
              'transform-object-rest-spread'
            ]
          }
        }
      },
      {
        test: /\.js$/,
        include: /content/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [
              'transform-object-rest-spread',
              [
                'transform-react-jsx',
                {
                  pragma: 'h',
                  useBuiltIns: true
                }
              ]
            ]
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
    new CleanWebpackPlugin(['dist']),
    new CopyWebpackPlugin(['*']),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ],
  optimization: {
    concatenateModules: true,
    minimizer:
      process.env.NODE_ENV === 'production' ? [new UglifyJsPlugin()] : undefined
  }
}
