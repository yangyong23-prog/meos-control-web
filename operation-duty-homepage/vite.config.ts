import path from 'path';
import vue from '@vitejs/plugin-vue';
import federation from '@originjs/vite-plugin-federation';
import { defineConfig } from 'vite';
import { name } from './package.json';
import AutoImport from 'unplugin-auto-import/vite';
import LanguageManager from '../locales/project_str_resources';

// 复制多语系资源
LanguageManager.run(path.resolve(__dirname, '..', 'locales'), path.join(__dirname, 'src/locales/langs'), ['common', 'operation_duty_homepage']);

const resolve = (...rest: string[]) => path.resolve(__dirname, ...rest);
const edgeClient = process.argv.includes('edge');
const grayClient = process.argv.includes('gray');
const packageName = edgeClient ? name + '-edge' : grayClient ? name + '-gray' : name;
export default defineConfig({
    base: `/`,
    plugins: [
        vue(),
        AutoImport({
            imports: ['vue', 'vue-router', 'pinia', '@vueuse/core'],
            dts: path.resolve(__dirname, './src', 'auto-imports.d.ts'),
            eslintrc: {
                enabled: true
            }
        }),
        federation({
            name,
            filename: 'RemoteRunHomeDashboardWebEntry.js',
            exposes: {
                './RemoteRunHomeDashboardWebEntry': './src/views/run-home/index.vue' // 导出组件路径
            },
            shared: ['vue', 'meri-plus']
        })
    ],
    resolve: {
        alias: {
            '@': resolve('./src')
        },
        extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
    },
    build: {
        outDir: packageName,
        target: 'esnext',
        minify: true
    },
    server: {
        open: false,
        port: 2569,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        proxy: {
            '/yiheng-common-web': {
                // target: 'https://dev-tyxn.meosedge.com', //边缘端开发环境
                // target: 'https://qa-tyxn.meosedge.com/',
                target: 'https://dev.meos.center',
                // target: 'https://qa.meos.center',
                // target: 'https://ys-bgl.meosedge.com/',
                // target: 'https://qa-hrqh.meosedge.com/',
                // target: 'https://qa-tyxn.meosedge.com',
                // target: 'https://qa-tyxk.meosedge.com',
                // target: 'https://qa-ysbj.meosedge.com', // 边缘端 冷热源
                // target: 'https://qa-tyifc.meosedge.com', // 边qa
                rewrite: path => path.replace(/^\/yiheng-common-web\/static\/env\/apm.env.js/, '/yiheng-common-web-edge/static/env/apm.env.js'), // 调试用 代理到边
                // rewrite: path => path.replace(/^\/yiheng-common-web\/static\/env\/apm.env.js/, '/yiheng-common-web-edge/static/env/apm.env.local.js'), // 调试用 代理到边
                // rewrite: path => path.replace(/^\/yiheng-common-web\/static\/env\/apm.env.js/, '/yiheng-common-web/static/env-edge/apm-edge.env.js'), // 调试用 代理到边
                changeOrigin: true
            },
            // 边缘端系统图图片代理
            '/meos-control-server-edge': {
                // target: 'https://dev-tyxk.meosedge.com',
                target: 'https://qa-jtzg5.meosedge.com',
                // target: 'https://dev.meos.center',
                // target: 'https://ys-bgl.meosedge.com/',
                // target: 'https://qa-tyxk.meosedge.com',
                changeOrigin: true
            },
            // 边缘端系统图图片代理
            '/dtp-meos-server-edge': {
                target: 'https://qa-jtzg5.meosedge.com',
                // target: 'https://dev.meos.center',
                // target: 'https://ys-bgl.meosedge.com/',
                // target: 'https://qa-tyxk.meosedge.com',
                changeOrigin: true
            },
            '/apimock': {
                // target: 'https://qa.meos.center',
                // target: 'https://ys-bgl.meosedge.com/',
                target: 'https://qa-tyxn.meosedge.com',
                changeOrigin: true
            },
            '/meos-control-server': {
                // target: 'http://172.16.2.14:8088',
                target: 'https://qa-gw.meos.net.cn',
                // target: 'https://qa.yushu.cloud',
                // target: 'https://qa.meos.center',
                // target: 'https://ys-bgl.meosedge.com/',
                // target: 'https://dev.meos.center',
                // target: 'https://qa-ifc24.meosedge.com',
                // target: 'https://192.168.101.32:40003', //边
                // target: 'http://192.168.0.49:8088', //乾坤本地 云http://192.168.0.49:8090 边http://192.168.0.49:8088
                changeOrigin: true,
                secure: false
            }
        }
    }
});
