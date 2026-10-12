/* eslint-disable import/no-extraneous-dependencies */
// webpack.dev.js
const path = require('path');
const { merge } = require('webpack-merge');
const baseConfig = require('./base');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const port = 5003;

// 合并公共配置,并添加开发环境配置
module.exports = (env, argv) =>
    merge(baseConfig(env, argv), {
        mode: 'development', // 开发模式,打包更加快速,省了代码优化步骤
        devtool: 'eval-cheap-module-source-map', // 源码调试模式,后面会讲
        plugins: [
            new HtmlWebpackPlugin({
                template: path.join(__dirname, '../index-dev.html'), // 引入模版
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
            })
        ],
        devServer: {
            open: true,
            port, // 服务端口号
            compress: false, // gzip压缩,开发环境不开启,提升热更新速度
            hot: true, // 开启热更新，后面会讲vue3模块热替换具体配置
            historyApiFallback: true, // 解决history路由404问题
            static: {
                directory: path.join(__dirname, '../public') //托管静态资源public文件夹
            },
            client: {
                overlay: false
            },
            proxy: {
                '/yiheng-common-web': {
                    target: 'https://qa.meos.center',
                    changeOrigin: true
                }
            }
        }
    });
