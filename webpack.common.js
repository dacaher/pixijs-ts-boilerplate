// `CheckerPlugin` is optional. Use it if you want async error reporting.
// We need this plugin to detect a `--watch` mode. It may be removed later
// after https://github.com/webpack/webpack/issues/3460 will be resolved.
const {CheckerPlugin} = require('awesome-typescript-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');


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
    plugins: [
        new CheckerPlugin(),
        new HtmlWebpackPlugin({
            title: 'My PIXI App',
            template: 'src/html/index.html',
            hash: true,
            minify: {
                collapseWhitespace: false,
                removeComments: true
            }
        })
    ],
    externals: {
        'pixi.js': 'PIXI'
    },
    resolve: {
        extensions: ['.js', '.ts', '.tsx', '.css', '.scss']
    },
    stats: 'verbose'
};