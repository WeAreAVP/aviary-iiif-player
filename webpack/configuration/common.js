// const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path')
module.exports = {
  entry: ["./src/index.js"],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: ['@babel/transform-runtime', "@babel/plugin-transform-react-jsx",
              "@babel/plugin-proposal-class-properties",
              "@babel/plugin-syntax-jsx",],
          },
        },
      },
      // {
      //   test: /\.(sass|less|css)$/,
      //   use: [
      //     "style-loader",
      //     "css-loader",
      //     "less-loader",
        
      //   ],
      // },
    ]
  },
  performance: {
    hints: true,
    maxEntrypointSize: 65536000,
    maxAssetSize: 65536000
  },

  resolve: {
    extensions: ["*", ".js", ".jsx"],
  },

  devServer: {
    port: 3000,
    historyApiFallback: true,
    contentBase: path.resolve("dist")
  },
  externals: {
    "react": "react",
    "react-dom": "react-dom",
  },


  // plugins: [
  //   new HtmlWebpackPlugin({
  //     title: 'React Application',
  //     template: './webpack/template/index.ejs',
  //     inject: 'head'
  //   })
  // ]
}
