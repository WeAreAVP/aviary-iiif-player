const path = require('path');
const { merge } = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const common = require('./common');
const TerserPlugin = require('terser-webpack-plugin');
const { webpack } = require('webpack');

module.exports = merge(common, {
    mode: 'production',
    output: {
        filename: 'application.js',
        publicPath: './',
        path: path.resolve('dist'),
        chunkFilename: 'vendor-[id]-[contenthash].js',
        libraryTarget: "commonjs2"
    },
    resolve: {
        extensions: ["*", ".js", ".jsx"],
    },
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
            {
                test: /\.(sass|less|css)$/,
                use: [
                    "style-loader",
                    "css-loader",
                    "less-loader",
                  
                    // {
                    //     loader: "css-loader",
                       
                    // },
                ],
            },
        ]
    },
    performance: {
        hints: false,
        maxEntrypointSize: 65536000,
        maxAssetSize: 65536000
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    format: {
                        comments: false
                    }
                },
                extractComments: false
            })
        ]
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

    plugins: [
        new CleanWebpackPlugin(),

    ]
});
