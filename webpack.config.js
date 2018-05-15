const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
require('dotenv').config();

const SRC_DIR = path.join(__dirname, '/client/src');
const DIST_DIR = process.env.NODE_ENV === 'production' 
  ? path.join(__dirname, '/public') 
  : path.join(__dirname,'/client/dist');

const filename = process.env.NODE_ENV === 'production' ? 'bundle.min.js': 'bundle.js';

module.exports = {
  entry: `${SRC_DIR}/index.js`,
  output: {
    filename: filename,
    path: DIST_DIR
  },
  // plugins: [
  //   new BundleAnalyzerPlugin()
  // ],
  module: {
    rules: [
      {
        test : /\.jsx?/,
        include : SRC_DIR,
        loader : 'babel-loader',      
        query: {
          presets: ['react', 'env'],
        }
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
						loader: 'css-loader',
						options: {
							sourceMap: true,
							modules: true,
							localIdentName: '[local]___[hash:base64:5]'
						}
					}
				],
      },
      {
        test: /\.(jpe?g|png|gif)$/i, 
        use: [
          {
            loader: 'url-loader',
            options: {}
          }
        ]
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: "babel-loader"
          },
          {
            loader: "react-svg-loader",
            options: {
              jsx: true 
            }
          }
        ]
      }
    ]
  }
};