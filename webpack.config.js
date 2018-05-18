const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
require('dotenv').config();

const SRC_DIR = path.join(__dirname, '/client/src');
const DIST_DIR = process.env.NODE_ENV === 'production' 
  ? path.join(__dirname, '/public') 
  : path.join(__dirname,'/client/dist');

const suffix = process.env.NODE_ENV === 'production' 
  ? '.min' 
  : ''

const filename = process.env.NODE_ENV === 'production' ? 'bundle.min.js': 'bundle.js';

const common = {
  context: `${SRC_DIR}`,
  
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
          loader: 'isomorphic-style-loader',
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

const client = {
  entry: './client.js',
  output: {
    path: DIST_DIR,
    filename: `client-bundle${suffix}.js`
  }
};

const server = {
  entry: './server.js',
  target: 'node',
  output: {
    path: DIST_DIR,
    filename: `server-bundle${suffix}.js`,
    libraryTarget: 'commonjs-module'
  },
  /// ///
  // test: /\.css$/,
  // use: [
  //   {
  //     loader: 'isomorphic-style-loader',
  //   },
  //   {
  //     loader: 'css-loader',
  //     options: {
  //       modules: true,
  //       // importLoaders: 1,
  //       localIdentName: '[name]__[local]___[hash:base64:5]',
  //       sourceMap: true,
  //     },
  //   },
  // ],
}

module.exports = [
  Object.assign({}, common, client),
  Object.assign({}, common, server)
];
