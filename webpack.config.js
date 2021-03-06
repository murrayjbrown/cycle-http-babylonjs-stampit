'use strict';
const path = require('path');
const webpack = require('webpack');

module.exports = {
  resolve: {
    extensions: ['', '.js'],
    root: [ path.resolve('.') ],
    modulesDirectories: ['app', 'lib', 'node_modules', 'public', 'tests']
  },
  entry: {
    app: [
      path.join(__dirname, "build", "app")
    ],
    common: [
      path.join(__dirname, "build", "common.js")
    ]
  },
  output: {
    path: path.join(__dirname, "build", "app"),
    filename: "[name].bundle.js",
    chunkFilename: "[id].bundle.js",
    libraryTarget: "umd"
    // crossOriginLoading: "use-credentials"
  },
  externals: [
    "app"
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ["babel"],
      exclude: path.resolve(__dirname, "node_modules")
    }, {
      test: /\.gif$/,
      loader: "url-loader?mimetype=image/gif"
    }, {
      test: /\.jpg$/,
      loader: "url-loader?mimetype=image/jpg"
    }, {
      test: /\.png$/,
      loader: "url-loader?mimetype=image/png"
    }]
  },
  target: "web",
  devtool: "#inline-source-map",
  babel: { // .babelrc takes precedence
    presets:['es2015', 'react']
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin(/* chunkName= */"common", /* filename= */"common.bundle.js"),
    new webpack.DefinePlugin({ __PROD__: false })
  ]
};
