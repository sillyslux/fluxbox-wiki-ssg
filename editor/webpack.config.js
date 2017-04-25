const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  context: `${__dirname}`,

  entry: './frontend-build.js',

  output: {
    filename: 'editor-bundle.js',
    path: `${__dirname}/../public`,
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.json'],
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: [
            'es2015',
            'stage-0',
            'react',
          ],
        },
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      {
        test: /\.sass$/,
        loader: ExtractTextPlugin.extract('css!sass'),
      },
    ],
  },
  plugins: [
    new ExtractTextPlugin('editor.css', {
      filename: '../css/editor.global.sass',
      disable: process.env.NODE_ENV === 'development',
      allChunks: true,
    }),
  ],
}
