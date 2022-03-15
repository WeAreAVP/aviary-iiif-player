const { webpack } = require('webpack');
const { merge } = require('webpack-merge');
const common = require('./common');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    output: {
        publicPath: '/'
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
                        plugins: ['@babel/transform-runtime'],
                    },
                },
            },
            {
                test: /\.(sass|less|css)$/,
                use: [
                    "style-loader",
                    "css-loader",
                    "less-loader",
                    "postcss-loader",
                    {
                        loader: "postcss-loader",
                        options: {
                            postcssOptions: {
                                plugins: [
                                    [
                                        "postcss-preset-env",
                                        {
                                            // Options
                                        },
                                    ],
                                ],
                            },
                        },
                    },
                ],
            },
        ]
    },
    devServer: {
        historyApiFallback: true,
        contentBase: './src',
        watchContentBase: true,
        hot: true,
        inline: true
    },
    // devServer: {
    //     port: 3000,
    //     historyApiFallback: true,
    //     contentBase: path.resolve("dist")
    // },
    // externals: {
    //     react: "react",
    //     "react-dom": "react-dom",
    // },
    performance: {
        hints: true,
        maxEntrypointSize: 65536000,
        maxAssetSize: 65536000
    },
    // plugins: [
    //     new webpack.ProvidePlugin({
    //         "React": "react",
    //      }),
    // ]
});
