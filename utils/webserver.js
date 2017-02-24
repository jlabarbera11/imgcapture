let WebpackDevServer = require('webpack-dev-server')
let webpack = require('webpack')
let config = require('../webpack.config')
let env = require('./env')
let path = require('path')

require('./prepare')

let options = (config.chromeExtensionBoilerplate || {})
let excludeEntriesToHotReload = (options.notHotReload || [])

for (var entryName in config.entry) {
  if (excludeEntriesToHotReload.indexOf(entryName) === -1) {
    config.entry[entryName] =
      [
        ('webpack-dev-server/client?http://localhost:' + env.PORT),
        'webpack/hot/dev-server'
      ].concat(config.entry[entryName])
  }
}

config.plugins =
  [new webpack.HotModuleReplacementPlugin()].concat(config.plugins || [])

let compiler = webpack(config)

let server =
  new WebpackDevServer(compiler, {
    contentBase: path.join(__dirname, '../build'),
    hot: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
    noInfo: true
  })

server.listen(env.PORT)
