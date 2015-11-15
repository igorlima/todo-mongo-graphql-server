var path = require('path')

var serverConfig = {
  entry: './server.js',
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  output: {
    path: path.join(__dirname, '.'),
    filename: 'server.build.js',
    libraryTarget: 'commonjs2'
  },

  target: 'node',

  // all non-relative modules are external
  // abc -> require('abc')
  externals: /^[a-z\-0-9]+$/,

  module: {
    loaders: [
      {
        // transpile all .js files using babel
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: ['babel']
      }
    ]
  }
}

module.exports = serverConfig
