import { createApp } from 'vue';
import AppComponent from './App.vue';
import router from './router';
import { pinia } from '@/store';
import { renderWithQiankun, qiankunWindow } from '@/utils/helper';
import { initGlobalState } from 'qiankun';
import { isNil, isUndefined } from 'lodash';
import 'meri-plus/theme/index.css';
import 'meri-icon/lib/style.css';
import '@/assets/less/variables';
import '@/assets/font/iconfont.css';
import '@/assets/font/iconfont';
import 'yushu-component-web/dist/style.css';
import '@/styles/index';
import 'virtual:svg-icons-register';
import Meri, { setLangguage } from 'meri-plus';
import { INTERFACE_PREFIX_YUSHU_CDN } from '@/config';
import { SceneLoader } from '@yushu/effecttool';
import { isEdge, isMeosFrame } from '@/utils/envUtils';
import iotExpireManager from '@/utils/iotExpireManager';
// 兼容
import * as at from 'array.prototype.at';
import './lib/datePollyfill';
import { setGlobalVueInstance } from './vueInstance';
import i18n, { DEFAULT_LANG, getLocaleLang } from '@/localization';
import useMidFrameStore from '@/store/midFrameStore';
// 引入 swiper 的 element bundle
import 'swiper/element/bundle';

import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import dayjs from 'dayjs';

// 注册 swiper 的自定义元素
import { register } from 'swiper/element/bundle';
register(); // 💥 必须注册！

SceneLoader.setFileHost(INTERFACE_PREFIX_YUSHU_CDN);

at.shim();
// eslint-disable-next-line init-declarations
let instance: any;

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

function updateLanguage() {
    const localLang = getLocaleLang(DEFAULT_LANG);
    setLangguage(localLang);
}

function render(props?: any) {
    const container = props?.container;
    const appRoot = !isNil(container) ? (container.querySelector('#app') as HTMLElement) : null;
    // 保存当前宿主框架，供业务代码统一判断运行环境。
    (window as any)['frame-source'] = props?.['frame-source'];
    const inMeosFrame = isMeosFrame();
    // 标记当前框架，供 Teleport 到子应用根节点下的组件适配布局。
    if (appRoot) appRoot.dataset.frameSource = inMeosFrame ? 'meos-frame' : '';
    sessionStorage.setItem('WebEnv', JSON.stringify(props?.WebEnv));
    const routers = router(props);
    instance = createApp(AppComponent);
    // 在组件挂载前保存主应用导航方法，避免初始化期间跳转时 props 尚未注入。
    useMidFrameStore(pinia).setProps(props);
    // meos-frame 需要将抽屉限制在当前子应用内，避免 Teleport 到主应用 body。
    instance.config.globalProperties.$drawerAppendTo = inMeosFrame && appRoot ? appRoot : 'body';
    // 弹窗通过字符串选择器挂载到当前框架的子应用根节点，其他环境仍挂载到 body。
    instance.config.globalProperties.$modalAppendTo = inMeosFrame && appRoot ? '#app[data-frame-source="meos-frame"]' : 'body';
    instance
        .use(pinia)
        .use(routers)
        .use(Meri)
        .use(i18n)
        .mount(appRoot || '#app');
    // instance.config.warnHandler = () => ({});
    setGlobalVueInstance(instance);

    updateLanguage();

    updateTimeZone(props);

    console.log('isEdge', isEdge());
}

(Performance.prototype as any).marks = (name: string) => {
    performance.mark(`${name}start`);
};

(Performance.prototype as any).marke = (name: string) => {
    performance.mark(`${name}end`);
};

(Performance.prototype as any).measurem = (name: string) => {
    performance.measure(name, `${name}start`, `${name}end`);
};

const initByQiankun = () => {
    renderWithQiankun({
        bootstrap() {
            console.log('微应用：bootstrap');
        },
        mount(props: any) {
            console.log('微前端props>>>>', props);
            sessionStorage.setItem('meosSystem', JSON.stringify(props));
            // 获取主应用传入数据
            render(props);

            iotExpireManager.clear();
            iotExpireManager.startExpireCheck();
        },
        unmount() {
            instance.unmount();
            instance = null;
            iotExpireManager.clear();
            iotExpireManager.stopExpireCheck();
        },
        update() {
            console.log('微应用：update');
        }
    });
};
initGlobalState();
// 独立运行时
// eslint-disable-next-line no-underscore-dangle
if (isUndefined(qiankunWindow.__POWERED_BY_QIANKUN__)) {
    render({});
} else {
    initByQiankun();
}
