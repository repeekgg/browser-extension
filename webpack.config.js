const path = require('path')

module.exports = {
  context: path.resolve(__dirname, 'extension', 'src'),
  entry: {
    content: './content/index.js',
    options: './options/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'extension', 'dist'),
    filename: '[name].js'
  },
  "module": {
    "rules": [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  }
}
