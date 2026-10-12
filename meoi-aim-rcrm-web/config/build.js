/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable camelcase */
// build.js
const { merge } = require('webpack-merge');
const baseConfig = require('./base');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
// const globAll = require('glob-all');
// const { PurgeCSSPlugin } = require('purgecss-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) =>
    merge(baseConfig(env, argv), {
        mode: 'production', // 生产模式,会开启tree-shaking和压缩代码,以及其他优化
        plugins: [
            new HtmlWebpackPlugin({
                template: path.join(__dirname, '../index.html'), // 引入模版
                favicon: path.join(__dirname, '../public/favicon.ico'),
                filename: 'index.html',
                minify: {
                    // 对index.html压缩
                    collapseWhitespace: true, // 去掉index.html的空格
                    removeAttributeQuotes: true // 去掉引号
                },
                hash: true, // 去掉上次浏览器的缓存（使浏览器每次获取到的是最新的html）
                inlineSource: '.(js|css)',
                inject: 'body'
            }),
            new MiniCssExtractPlugin({
                filename: 'static/css/[name].[contenthash:8].css' // 抽离css的输出目录和名称
            }),
            // 将文件压缩成 .gz
            new CompressionPlugin({
                test: /\.(js|css)$/, // 只生成css,js压缩文件
                filename: '[path][base].gz', // 文件命名
                algorithm: 'gzip', // 压缩格式,默认是gzip
                threshold: 10240, // 只有大小大于该值的资源会被处理。默认值是 10k
                minRatio: 0.8 // 压缩率,默认值是 0.8
            }),
            new CssMinimizerPlugin() // 压缩css
            // 清理无用css
            // new PurgeCSSPlugin({
            //     // 检测src下所有vue文件和public下index.html中使用的类名和id和标签名称
            //     // 只打包这些文件中用到的样式
            //     paths: globAll.sync([
            //         `${path.join(__dirname, '../src')}/**/*.vue`,
            //         path.join(__dirname, '../index.html')
            //     ])
            // })
        ],
        optimization: {
            minimizer: [
                new TerserPlugin({
                    // 压缩js
                    parallel: true, // 开启多线程压缩
                    terserOptions: {
                        compress: {
                            unsafe_math: false,
                            pure_funcs: ['console.log', 'debugger'] // 删除console.log
                        }
                    }
                })
            ],
            splitChunks: {
                // 分隔代码
                cacheGroups: {
                    vendors: {
                        // 提取node_modules代码
                        test: /node_modules/, // 只匹配node_modules里面的模块
                        name: 'vendors', // 提取文件命名为vendors,js后缀和chunkhash会自动加
                        minChunks: 1, // 只要使用一次就提取出来
                        chunks: 'initial', // 只提取初始化就能获取到的模块,不管异步的
                        minSize: 0, // 提取代码体积大于0就提取出来
                        priority: 1 // 提取优先级为1
                    },
                    commons: {
                        // 提取页面公共代码
                        name: 'commons', // 提取文件命名为commons
                        minChunks: 2, // 只要使用两次就提取出来
                        chunks: 'initial', // 只提取初始化就能获取到的模块,不管异步的
                        minSize: 3000 // 提取代码体积大于3kb就提取出来
                    }
                }
            }
        }
    });
