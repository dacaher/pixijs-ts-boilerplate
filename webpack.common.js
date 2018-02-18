/*
`CheckerPlugin` is optional. Use it if you want async error reporting.
We need this plugin to detect a `--watch` mode. It may be removed later
after https://github.com/webpack/webpack/issues/3460 will be resolved.
*/
const {CheckerPlugin} = require('awesome-typescript-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    entry: {
        index: './src/scripts/index.ts',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: ['source-map-loader'],
                enforce: 'pre'
            }
        ]
    },
    devtool: 'source-map',
    plugins: [
        new CheckerPlugin(),
        new HtmlWebpackPlugin({
            title: 'My PIXI App',
            template: 'src/html/index.html',
            hash: true,
            minify: {
                collapseWhitespace: true
            }
        })
    ],
    externals: {
        'vendor/pixijs/pixi.js/pixi.js': 'PIXI'
    },
    resolve: {
        extensions: ['.js', '.ts', '.tsx', '.css', '.scss'],
        alias: {
            // CUSTOM PACKAGES:
            'styles': path.resolve(__dirname, 'src/styles/'),
            'app': path.resolve(__dirname, 'src/scripts/app/'),
            'vendor': path.resolve(__dirname, 'src/scripts/vendor/'),
        }
    },
    stats: 'verbose'
};