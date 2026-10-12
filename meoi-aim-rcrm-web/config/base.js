/* eslint-disable import/no-extraneous-dependencies */
// base.js

const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const AutoImport = require('unplugin-auto-import/webpack');
const webpack = require('webpack');
const { readEnv } = require('./util');
const { name } = require('../package.json');
const  LanguageManager =require('../locales/project_str_resources');

module.exports = (env, argv) => {
    const isDev = argv.mode === 'development'; // 是否是开发模式
    const envVariable = readEnv(`../.env.${argv.mode}`);
    console.log('envVariable>>>', envVariable);
    LanguageManager.run(path.resolve(__dirname, '../', 'locales'), path.join(__dirname, '../' , 'src/locales/langs'), ['rcrm_web']);
    return {
        entry: path.join(__dirname, '../src/main.js'), // 入口文件
        output: {
            library: `${name}`,
            libraryTarget: 'umd',
            chunkLoadingGlobal: `webpackJsonp_${name}`,
            path: path.resolve(__dirname, '../meoi-aim-rcrm-web'),
            filename: 'javascript/[name].[contenthash:5].js', // [name] 是entry的key
            publicPath: isDev ? '/' : '/meoi-aim-rcrm-web/',
            assetModuleFilename: 'static/[name][ext]',
            globalObject: 'window'
        },
        module: {
            rules: [
                {
                    test: /\.vue/,
                    use: ['thread-loader', 'vue-loader']
                },
                {
                    test: /\.jsx?$/,
                    use: [
                        'thread-loader',
                        {
                            loader: 'babel-loader',
                            options: {
                                cacheDirectory: !isDev
                            }
                        }
                    ],
                    exclude: file => /node_modules/.test(file)
                },
                {
                    test: /\.tsx?$/,
                    use: [
                        'thread-loader',
                        {
                            loader: 'babel-loader',
                            options: {
                                cacheDirectory: !isDev
                            }
                        },
                        {
                            loader: 'ts-loader',
                            options: {
                                transpileOnly: true, // 为true会解决ts文件热更新异常的问题,但会丢失类型检查
                                appendTsSuffixTo: ['\\.vue$'],
                                compilerOptions: {
                                    sourceMap: isDev
                                },
                                happyPackMode: true // 解决hooks is undefined
                            }
                        }
                    ]
                },
                {
                    test: /\.(css|sass|scss)$/,
                    use: [
                        // 开发环境使用style-looder,打包模式抽离css
                        isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
                        'css-loader',
                        'postcss-loader',
                        'sass-loader',
                        {
                            loader: 'sass-resources-loader',
                            options: {
                                resources: [path.resolve(__dirname, '../src/styles/mixin/index.scss')]
                            }
                        }
                    ]
                },
                {
                    test: /.(png|jpg|jpeg|gif|svg)$/, // 匹配图片文件
                    type: 'asset', // type选择asset
                    parser: {
                        dataUrlCondition: {
                            maxSize: 1024 // 小于1kb转base64位
                        }
                    },
                    generator: {
                        filename: 'static/images/[name].[contenthash:8][ext]' // 文件输出目录和命名
                    }
                },
                {
                    test: /.(woff2?|eot|ttf|otf)$/, // 匹配字体图标文件
                    type: 'asset', // type选择asset
                    parser: {
                        dataUrlCondition: {
                            maxSize: 10 * 1024 // 小于10kb转base64位
                        }
                    },
                    generator: {
                        filename: 'static/fonts/[name].[contenthash:8][ext]' // 文件输出目录和命名
                    }
                },
                {
                    test: /.(mp4|webm|ogg|mp3|wav|flac|aac)$/, // 匹配媒体文件
                    type: 'asset', // type选择asset
                    parser: {
                        dataUrlCondition: {
                            maxSize: 10 * 1024 // 小于10kb转base64位
                        }
                    },
                    generator: {
                        filename: 'static/media/[name].[contenthash:8][ext]' // 文件输出目录和命名
                    }
                },
                {
                    test: /\.m?js/,
                    resolve: {
                        fullySpecified: false
                    }
                }
            ]
        },
        resolve: {
            extensions: ['.vue', '.ts', '.tsx', '.js', '.jsx', '.json'],
            alias: {
                '@': path.join(__dirname, '../src')
            }
        },
        plugins: [
            new VueLoaderPlugin(),
            new webpack.DefinePlugin({
                'process.env': {
                    ...envVariable
                },
                __VUE_OPTIONS_API__: true, // 是否开启 option api
                __VUE_PROD_DEVTOOLS__: false // 是否在生产环境中开启dev-tools
            }),
            AutoImport.default({
                imports: ['vue', 'vue-router', 'pinia', '@vueuse/core'],
                dts: path.resolve(__dirname, '../src', 'auto-imports.d.ts'),
                eslintrc: {
                    enabled: true
                }
            }),
            new CopyPlugin({
                patterns: [
                    {
                        from: path.resolve(__dirname, '../public'), // 复制public下文件
                        to: path.resolve(__dirname, '../meoi-aim-rcrm-web/public') // 复制到打包目录中
                    }
                ]
            })
        ],
        cache: {
            type: 'filesystem' // 使用文件缓存
        }
    };
};
