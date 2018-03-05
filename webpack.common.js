/*
`CheckerPlugin` is optional. Use it if you want async error reporting.
We need this plugin to detect a `--watch` mode. It may be removed later
after https://github.com/webpack/webpack/issues/3460 will be resolved.
*/
const {CheckerPlugin} = require('awesome-typescript-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const {TsConfigPathsPlugin} = require('awesome-typescript-loader');

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
        'pixi.js': 'PIXI',
    },
    resolve: {
        extensions: ['.js', '.ts', '.tsx', '.css', '.scss', '.json'],
        modules: ['node_modules'],
        alias: {
            'styles': path.resolve(__dirname, 'src/styles/'),
            // 'vendor': path.resolve(__dirname, 'src/scripts/vendor/'),
            // 'app': path.resolve(__dirname, 'src/scripts/app/'),
            // 'pixi-app-wrapper': path.resolve(__dirname, 'src/scripts/vendor/dacaher/pixi-app-wrapper'),
            // 'fpsmeter': path.resolve(__dirname, 'src/scripts/vendor/darsain/fpsmeter/fpsmeter'),
            // 'screenfull': path.resolve(__dirname, 'src/scripts/vendor/sindresorhus/screenfull/screenfull'),
            // 'eventemitter3': path.resolve(__dirname, 'src/scripts/vendor/primus/eventemitter3'),
            // 'gsap': path.resolve(__dirname, 'src/scripts/vendor/greensock/greensock-js'),
            // 'pixi-layers': path.resolve(__dirname, 'src/scripts/vendor/pixijs/pixi-layers/pixi-layers'),
            // 'pixi-particles': path.resolve(__dirname, 'src/scripts/vendor/pixijs/pixi-particles/pixi-particles'),
            // 'pixi-spine': path.resolve(__dirname, 'src/scripts/vendor/pixijs/pixi-spine/pixi-spine'),
        },
        plugins: [
            new TsConfigPathsPlugin()
        ],
    },
    stats: 'verbose',
};