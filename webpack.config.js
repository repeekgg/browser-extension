const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  devtool: 'sourcemap',
  context: path.resolve(__dirname, 'extension', 'src'),
  entry: {
    content: './content/index.js',
    options: './options/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'extension', 'dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  optimization: {
    concatenateModules: true,
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          mangle: false,
          compress: false,
          output: {
            beautify: true,
            indent_level: 2
          }
        }
      })
    ]
  }
}
