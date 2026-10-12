// @ts-ignore
/* eslint-disable */
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { viteMockServe } from 'vite-plugin-mock';
import viteCompression from 'vite-plugin-compression';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import qiankun from 'vite-plugin-qiankun-persagy';
import { createHtmlPlugin } from 'vite-plugin-html';
import { visualizer } from 'rollup-plugin-visualizer';
import svgLoader from 'vite-svg-loader';
import { get_externals_v3, get_static_urls_v3 } from 'persagy-tools';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import vueDevTools from 'vite-plugin-vue-devtools';
import copyPlugin from 'rollup-plugin-copy';
import LanguageManager from './locales/project_str_resources';

import path from 'path';

// 复制多语系资源
LanguageManager.run(path.resolve(__dirname, 'locales'), path.join(__dirname, 'src/locales/langs'), ['meos_control_web', 'common']);

const edgeClient = process.argv.includes('edge');
const grayClient = process.argv.includes('gray');

const packageName = edgeClient ? 'meos-autocontrol-web-edge' : grayClient ? 'meos-control-web-gray' : 'meos-control-web';

const entranceName = edgeClient ? 'indexEdge' : grayClient ? 'indexGray' : 'index';

const resolve = (...rest: string[]) => path.resolve(__dirname, ...rest);

const imageType = 'jpg,jpeg,png,gif,webp,svg'.split(',');

const externals = Object.keys(get_externals_v3(['axios']));

const cdnList = get_static_urls_v3().js_src.filter(url => externals.some(pck => url.includes(`${pck}@`)));

const renameIndexPlugin = (htmlFileName: string, newFilename: string) => {
    if (!newFilename) return;
    return {
        name: 'renameIndex',
        enforce: 'post',
        generateBundle(options: any, bundle: any) {
            const indexHtml = bundle[htmlFileName];
            indexHtml.fileName = newFilename;
        }
    };
};

let envJsOrigin: string = '';
// envJsOrigin = 'http://172.16.1.18:8888';
envJsOrigin = 'https://dev.meos.center';
// envJsOrigin = 'https://dev-tyxk.meosedge.com';
// envJsOrigin = 'https://qa-tyxk.meosedge.com';
// envJsOrigin = 'https://qa-taige.meosedge.com';
// envJsOrigin = 'https://qa-jtzg5.meosedge.com';
// envJsOrigin = 'https://dev-jtzg5.meosedge.com';
// envJsOrigin = 'https://qaen-edge.meos.center';
// envJsOrigin = 'https://qa.meos.center';
// envJsOrigin = 'https://ys-bgl.meosedge.com';
// envJsOrigin = 'https://qa-tyxn.meosedge.com';
// envJsOrigin = 'https://ys-bgl.meosedge.com';

// 前后端 地址 映射
const nearEndServerMap: any = {
    'https://dev.meos.center': 'https://dev-gw.meos.net.cn',
    'https://qa.meos.center': 'https://qa-gw.meos.net.cn',
    'https://pre.meos.center': 'https://pre-gw.meos.net.cn',
    'https://meos.center': 'https://gw.meos.net.cn',
    'https://qaen-edge.meos.center': 'qaen-gateway.meos.center'
};

const switchHttpToWss = (url: string) => {
    if (url.startsWith('https')) {
        return url.replace(/^https/, 'wss');
    }
    return url.replace(/^http/, 'wss');
};

const getEnvJSProxyConfig = (envJsOrigin: string) => {
    const isEdge = envJsOrigin.includes('edge.');
    if (isEdge) {
        return {
            target: envJsOrigin,
            rewrite: (path: any) => path.replace(/^\/yiheng-common-web\/static\/env\/apm.env.js/, '/yiheng-common-web-edge/static/env/apm.env.js'),
            changeOrigin: true,
            secure: false
        };
    }
    return {
        target: envJsOrigin,
        changeOrigin: true,
        secure: false
    };
};

const getApiProxyConfig = (envJsOrigin: string) => {
    const nearEndUrl = nearEndServerMap[envJsOrigin] || envJsOrigin;
    return {
        '/proxy-api': {
            target: nearEndUrl,
            rewrite: (path: any) => path.replace(/^\/proxy-api/, ''),
            changeOrigin: true,
            secure: false
        },
        '/proxy-wss': {
            target: switchHttpToWss(nearEndUrl),
            rewrite: (path: any) => path.replace(/^\/proxy-wss/, ''),
            changeOrigin: true,
            secure: false
        }
    };
};

const VUE_DEV_TOOLS_ENABLED = true;
export default defineConfig(({ mode }) => {
    const { VITE_ENV_JS_ORIGIN, VITE_ENV_vueDevTools } = loadEnv(mode, `${process.cwd()}/env`);
    const env_VueDevTools = VITE_ENV_vueDevTools === 'false' ? false : true;

    const plugins = [
        vue(),
        vueJsx(),
        (env_VueDevTools ?? VUE_DEV_TOOLS_ENABLED) && vueDevTools(),
        viteMockServe({
            mockPath: 'mock',
            localEnabled: true
        }),
        Components({
            directoryAsNamespace: true,
            dts: path.resolve(__dirname, 'src', 'types', 'components.d.ts'),
            extensions: ['vue', 'jsx', 'tsx'],
            resolvers: [ElementPlusResolver()],
            dirs: [path.resolve(__dirname, 'src', 'components', 'brcomponents')]
        }),
        AutoImport({
            imports: ['vue', 'vue-router', 'pinia'],
            dts: path.resolve(__dirname, 'src', 'types', 'auto-imports.d.ts'),
            eslintrc: {
                enabled: true
            },
            resolvers: [ElementPlusResolver()]
        }),
        createHtmlPlugin({
            minify: true,
            inject: {
                data: {
                    title: packageName,
                    cdnList: []
                }
            }
        }),
        createSvgIconsPlugin({
            // 指定需要缓存的图标文件夹
            iconDirs: [path.resolve(process.cwd(), 'src/assets/svg')],
            // 指定symbolId格式
            symbolId: 'icon-[dir]-[name]'
        }),
        qiankun(packageName, {
            // 微应用名字，与主应用注册的微应用名字保持一致
            useDevMode: true
        }),
        svgLoader({
            svgo: false
        }),
        renameIndexPlugin(`${entranceName}.html`, 'index.html'),
        copyPlugin({
            targets: [
                { src: './src/video-sdk/*', dest: `${packageName}/video-sdk` },
                { src: './src/dahua-rtsp-sdk/*', dest: `${packageName}/dahua-rtsp-sdk` }
            ]
        })
    ];
    if (mode === 'development' || mode === 'micro') {
        // plugins.push(
        //   checker({
        //     typescript: true,
        //     eslint: {
        //       lintCommand: 'eslint "./src/**/*.{ts,tsx}"'
        //     }
        //   })
        // )
    } else if (mode === 'production') {
        plugins.push(
            viteCompression({
                algorithm: 'gzip',
                threshold: 10240,
                verbose: false,
                deleteOriginFile: false
            })
        );
        plugins.push();
    } else if (mode === 'report') {
        plugins.push(
            visualizer({
                open: true,
                gzipSize: true,
                filename: 'report.html'
            })
        );
    }

    const config = {
        define: {
            'import.meta.env.VITE_PACKAGE_NAME': `"${packageName}"`,
            __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false // 启用/禁用生产环境构建下激活 (hydration) 不匹配的详细警告。启用会在打包结果中包含更多代码，因此建议仅在调试时启用此功能
        },
        envDir: resolve('env'),
        base: mode === 'production' ? `/${packageName}` : '',
        plugins,
        resolve: {
            alias: {
                '@': resolve('./src'),
                three: '@yushu/three-base'
            },
            extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.less', '.scss']
        },
        server: {
            open: true,
            port: 3000,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            proxy: {
                '/yiheng-common-web': getEnvJSProxyConfig(VITE_ENV_JS_ORIGIN || envJsOrigin),
                ...getApiProxyConfig(VITE_ENV_JS_ORIGIN || envJsOrigin),
               '/ai-bdmpc-agent-edge': getEnvJSProxyConfig(VITE_ENV_JS_ORIGIN || envJsOrigin)
            }
        },
        build: {
            outDir: packageName,
            cssCodeSplit: true,
            sourcemap: false,
            target: 'modules',
            chunkSizeWarningLimit: 1024,
            assetsInlineLimit: 5120,
            manifest: false,
            minify: 'terser',
            terserOptions: {
                compress: {
                    drop_console: false,
                    drop_debugger: true
                },
                keep_classnames: true
            },
            rollupOptions: {
                input: {
                    main: resolve(`${entranceName}.html`)
                },
                plugins: [
                    copyPlugin({
                        verbose: true,
                        hook: 'closeBundle',
                        targets: [
                            { src: './src/video-sdk/*', dest: `${packageName}/video-sdk` },
                            { src: './src/dahua-rtsp-sdk/*', dest: `${packageName}/dahua-rtsp-sdk` }
                        ]
                    }) as any
                ],
                output: {
                    external: externals,
                    chunkFileNames: 'static/js/[name]-[hash].js',
                    entryFileNames: 'static/js/[name]-[hash].js',
                    assetFileNames: (assetInfo: any) => {
                        const name = assetInfo.name as string;
                        const ext = (name.match(/\.(\w+)?$/) as RegExpMatchArray)?.[1].toLowerCase();
                        if (['css', 'woff2', 'woff', 'ttf'].includes(ext)) {
                            return 'static/css/[name]-[hash].[ext]';
                        }
                        if (imageType.includes(ext)) {
                            return 'static/images/[name]-[hash].[ext]';
                        }
                        return 'static/other/[name]-[hash].[ext]';
                    }
                }
            }
        },
        css: {
            preprocessorOptions: {
                less: {
                    additionalData: `@import "./src/assets/less/variables";`
                }
            }
        }
    };
    return config;
});
