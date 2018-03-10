const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  devtool: 'sourcemap',
  context: path.resolve(__dirname, 'src'),
  entry: {
    content: './content/index.js',
    popup: './popup/index.js'
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
      }
    ]
  },
  plugins: [new CleanWebpackPlugin(['dist']), new CopyWebpackPlugin(['*'])],
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
