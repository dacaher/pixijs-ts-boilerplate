const common = require('./webpack.common');
const merge = require('webpack-merge');
const path = require('path');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const SriPlugin = require('webpack-subresource-integrity');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const outputDir = 'dist';
const publicPath = '';
const tsConfig = 'tsconfig.prod.json';

// noinspection JSUnresolvedFunction
module.exports = merge(common, {
    output: {
        path: path.resolve(__dirname, outputDir),
        filename: '[name].bundle.min.js',
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
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: {
                        loader: 'typings-for-css-modules-loader',
                        options: {
                            modules: false,
                            minimize: true
                        }
                    }
                })
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: {
                        loader: 'typings-for-css-modules-loader',
                        options: {
                            modules: false,
                            sass: true,
                            minimize: true
                        }
                    }
                })
            }
        ]
    },
    plugins: [
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
        new ExtractTextPlugin({
            filename: '[name].bundle.min.css',
            allChunks: true,
            disable: false
        }),
        new UglifyJSPlugin({
            sourceMap: true
        }),
        new SriPlugin({
            hashFuncNames: ['sha256', 'sha384']
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        })
    ],
});