import { defineConfig, loadEnv } from 'vite';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import qiankun from 'vite-plugin-qiankun-persagy';

const packageName = 'meos-daily-report-web';
const resolve = (...rest: string[]) => path.resolve(__dirname, ...rest);

let envJsOrigin = '';
// envJsOrigin = 'http://172.16.1.14:8888';
// envJsOrigin = 'https://dev.meos.center';
// envJsOrigin = 'https://dev-tyxk.meosedge.com';
// envJsOrigin = 'https://qa-tyxk.meosedge.com';
// envJsOrigin = 'https://qa-taige.meosedge.com';
// envJsOrigin = 'https://qa-jtzg5.meosedge.com';
// envJsOrigin = 'https://qaen-edge.meos.center';
envJsOrigin = 'https://qa.meos.center';
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
    console.log('nearEndUrl: ', nearEndUrl);
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
export default defineConfig(({ mode }) => {
    const { VITE_ENV_JS_ORIGIN, VITE_ENV_vueDevTools } = loadEnv(mode, `${process.cwd()}/env`);
    return {
        base: mode === 'production' ? `/${packageName}` : '',
        plugins: [
            // The React and Tailwind plugins are both required for Make, even if
            // Tailwind is not being actively used – do not remove them
            react(),
            tailwindcss(),
            qiankun(packageName, {
                useDevMode: true
            })
        ],
        envDir: resolve('env'),
        resolve: {
            alias: {
                // Alias @ to the src directory
                '@': path.resolve(__dirname, './src')
            }
        },
        server: {
            host: '0.0.0.0',
            port: 3011,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },

            proxy: {
                '/yiheng-common-web': getEnvJSProxyConfig(envJsOrigin),
                ...getApiProxyConfig(envJsOrigin)
            }
        },
        build: {
            outDir: `${packageName}`,
            cssCodeSplit: true,
            sourcemap: false,
            target: 'modules'
        }
    };
});
