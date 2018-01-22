const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')


module.exports = {
    entry: './src/scripts/mosaic.js',

    output: {
        filename: 'index.js',
        path: path.resolve('./lib'),
        library: 'imageMosaic',
        libraryTarget: 'umd',
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
        new UglifyJsPlugin()
    ]
}