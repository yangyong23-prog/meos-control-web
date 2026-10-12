import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createRouter } from './router';
import { store } from './store';
import { initializeStore } from './store/initStore';
import './styles/index.css';
import './styles/meosGlobal.css';
import { renderWithQiankun, qiankunWindow } from './utils/helper';
import { qiankunStore } from './store/qiankunStore';
import { setToken } from './store/baseSlice';

import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import dayjs from 'dayjs';
import { Environment } from '@/config'

// 保存 React Root 实例
let root: ReturnType<typeof createRoot> | null = null;



// 设置时区为项目所在时区，解决时区问题
const updateTimeZone = (props: any) => {
    // 获取本地时区，通过Intl.DateTimeFormat().resolvedOptions()获取
    let { timeZone } = Intl.DateTimeFormat().resolvedOptions();
    if (import.meta.env.DEV) {
        timeZone = import.meta.env.VITE_DEV_TIME_ZONE || timeZone;
    } else if (props) {
        timeZone = props?.['mid-frame-web-timezone'] || timeZone;
    }
    dayjs.extend(utc);
    dayjs.extend(timezone);
    dayjs.tz.setDefault(timeZone);
};

/**
 * 渲染函数
 */
function render(props?: any) {
    const container = props?.container;
    const rootElement = container ? container.querySelector('#app') : document.getElementById('app');
    
    if (!rootElement) {
        console.error('App element not found');
        return;
    }

    // 保存主应用传入的数据
    if (props) {
        sessionStorage.setItem('meosSystem', JSON.stringify(props));
    }

    const propsCopy = JSON.parse(JSON.stringify(props || {}));
    // 初始化Redux store
    initializeStore(propsCopy);

    updateTimeZone(props);

    // 计算路由 basename
    let routeBase = '/meos-daily-report-web';
    if (qiankunWindow.__POWERED_BY_QIANKUN__ && props) {
        // 微前端模式：使用主应用传入的基础路径
        const microBasePath = props?.microBasePath || '/mid-frame-web';
        routeBase = `${microBasePath}/meos-daily-report-web`;
    }

    const router = createRouter(routeBase);

    root = createRoot(rootElement);
    root.render(
        <Provider store={store}>
            <RouterProvider router={router} />
        </Provider>
    );
}

/**
 * 初始化乾坤微前端生命周期
 */
const initByQiankun = () => {
    renderWithQiankun({
        bootstrap() {
            console.log('微应用：bootstrap');
        },
        mount(props: any) {
            console.log('微前端 props >>>>', props);
            // 保存 props 到 store
            qiankunStore.setProps(props);
            render(props);
        },
        unmount() {
            console.log('微应用：unmount');
            if (root) {
                root.unmount();
                root = null;
            }
            // 清空 store
            qiankunStore.clear();
        },
        update() {
            console.log('微应用：update');
        }
    });
};

// 判断是否在乾坤环境中运行
if (qiankunWindow.__POWERED_BY_QIANKUN__) {
    // 微前端模式
    initByQiankun();
} else {
    // 独立运行模式
    render();
}