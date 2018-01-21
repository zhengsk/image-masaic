const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.js',

    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },

    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        open: true,
        port: 9000,
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['babel-preset-env'],
                    }
                }
            }
        ]
    },

    plugins: [
        new HtmlWebpackPlugin({
            title: 'Image Mosaic',
            filename: 'index.html'
        }),
    ]


}