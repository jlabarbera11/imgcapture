let webpack = require('webpack')
let config = require('../webpack.config')

require('./prepare')

webpack(config, (err) => {
  if (err) throw err
}
)
