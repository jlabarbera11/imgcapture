let webpack = require('webpack')
let path = require('path')
let fileSystem = require('fs')
let env = require('./utils/env')
let HtmlWebpackPlugin = require('html-webpack-plugin')
let WriteFilePlugin = require('write-file-webpack-plugin')

// load the secrets
var alias = {}

var secretsPath = path.join(__dirname, ('secrets.' + env.NODE_ENV + '.js'))

if (fileSystem.existsSync(secretsPath)) {
  alias['secrets'] = secretsPath
}

module.exports = {
  entry: {
    options: path.join(__dirname, 'src', 'js', 'options.js'),
    background: path.join(__dirname, 'src', 'js', 'background.js'),
    contentscript: path.join(__dirname, 'src', 'js', 'contentscript.js')
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].bundle.js'
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel', exclude: /node_modules/ },
      { test: /contentscript.css$/, loader: 'file-loader?name=[name].[ext]' },
      { test: /.css$/, loader: 'style-loader!css-loader', exclude: /contentscript.css$/ },
      { test: /\.(jpe?g|png|gif|svg)$/i, loader: 'file-loader?name=[name].[ext]' }
    ]
  },
  resolve: {
    alias: alias
  },
  plugins: [
    // expose and write the allowed env vars on the compiled bundle
    new webpack.DefinePlugin({ 'process.env': JSON.stringify(env) }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'options.html'),
      filename: 'options.html',
      chunks: ['options']
    }),
    new WriteFilePlugin()
  ],
  chromeExtensionBoilerplate: {
    notHotReload: ['contentscript']
  }
}
