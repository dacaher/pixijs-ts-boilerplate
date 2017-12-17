const common = require('./webpack.common');
const merge = require('webpack-merge');
const path = require('path');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const {TsConfigPathsPlugin} = require('awesome-typescript-loader');
const DashboardPlugin = require('webpack-dashboard/plugin');

const outputDir = 'dev';
const publicPath = '/';
const tsConfig = 'tsconfig.dev.json';

module.exports = merge(common, {
    output: {
        path: path.resolve(__dirname, outputDir),
        filename: '[name].bundle.js',
        publicPath: publicPath,
        crossOriginLoading: 'anonymous'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'awesome-typescript-loader',
                        options: {
                            configFileName: tsConfig
                        }
                    }
                ],
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: 'typings-for-css-modules-loader',
                        options: {
                            modules: false
                        }
                    }
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    {
                        loader: 'typings-for-css-modules-loader',
                        options: {
                            modules: false,
                            sass: true
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new DashboardPlugin(),
        new FileManagerPlugin({
            onEnd: {
                copy: [
                    {
                        source: path.resolve(__dirname, 'assets'),
                        destination: path.resolve(__dirname, outputDir) + '/assets'
                    }
                ]
            }
        }),
        new TsConfigPathsPlugin({configFileName: tsConfig})
    ],
    devtool: 'inline-source-map',
    devServer: {
        contentBase: path.join(__dirname, outputDir),
        compress: false,
        host: '0.0.0.0',
        port: 9000,
        publicPath: publicPath,
        https: false,
        overlay: {
            warnings: true,
            errors: true
        }
    }
});