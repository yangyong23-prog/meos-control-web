import App from './App.vue';
import { createApp } from 'vue';
import pinia, { useMainStore } from './store';
import getRouter from './router';
import { setToken } from '@/utils/auth';
import MeriPlue from 'meri-plus';
import { INTERFACE_PREFIX_BDTP_FILE } from '@/config';

// 全局样式
import '@/styles/global.scss';
import '@/assets/font/iconfont.css';
import 'meri-plus/theme/index.css';
import 'meri-icon/lib/style.css';

let loaded = false,
    app,
    mainStore;

if (!app) {
    app = createApp(App);
    app.use(pinia);
    app.use(MeriPlue);
    mainStore = useMainStore();
}

// qiankun window全局变量
const isQK = window.__POWERED_BY_QIANKUN__;

// vue挂载函数
const render = (props = {}) => {
    if (loaded) return;
    // 单例
    const router = getRouter(isQK ? props.prefix : '/');
    app.use(router);

    const { container } = props;
    app.mount(container ? container.querySelector('#rcrm') : '#rcrm');
    loaded = true;

    handleAfterRender();
};

const handleAfterRender = () => {
    mainStore.setDrawerTop(isQK ? 48 : 0);
};

// 独立运行
if (!isQK) {
    let staticToken = '';
    if ((INTERFACE_PREFIX_BDTP_FILE || '').indexOf('qa') > -1) {
        // qa 永久token
        staticToken =
            'eyJhbGciOiJIUzI1NiJ9.eyJkZXZpY2VUeXBlIjoxLCJhdWQiOiJ5dXNodS1zYWFzLWNsaWVudCIsInN1YiI6Inl1c2h1LXVzZXIiLCJhY2NvdW50SWQiOiIxNTA5ODMyMjM3NjE3MTgwNjc0IiwiYWNjb3VudE5hbWUiOiIxODA4ODg4ODEwMCIsImFjY291bnRUeXBlIjoiMiIsImlzcyI6Inl1c2h1IiwianRpIjoiNTMyNjY5MDMtNWQ2Zi00MDUyLWJmNzYtMzQ2YTI2YTUzOTExIn0.wM1XXhdqjFxvkIu6xCEnlcINfzkvSEtEtLKlQtmdoKY';
    } else {
        // dev 永久token
        staticToken =
            'eyJhbGciOiJIUzI1NiJ9.eyJkZXZpY2VUeXBlIjoxLCJhdWQiOiJ5dXNodS1zYWFzLWNsaWVudCIsInN1YiI6Inl1c2h1LXVzZXIiLCJhY2NvdW50SWQiOiIxNTA5MDU2ODI1MTgwNjgwMTkzIiwiYWNjb3VudE5hbWUiOiLmtYvor5XkurrlkZgyIiwiaXNzIjoieXVzaHUiLCJqdGkiOiJlNDkyMmEzMC00ODI3LTRhZDUtYWU1Yy1iYjcwOTI4YjIxZDYifQ.xf4lOWEXGmvMmOl0Z5tGr8FdnAHOAfF10WCyhSg7jek';
    }
    // dev环境永久token
    setToken(staticToken);
    mainStore.setGroupCode(process.env.API_GROUPCODE);
    mainStore.setProjectId(process.env.API_PROJECT);
    render();
}

/* 微应用运行 start */
export async function bootstrap(props) {
    console.log('[vue] apm app bootstraped', props);
    // 微应用初始化 - 这里获取主应用传来的base前缀
}
export async function mount(props) {
    // console.log('[vue] props from main framework', props);
    // 微应用挂载
    props.onGlobalStateChange((state, prev) => {
        // state: 变更后的状态; prev 变更前的状态
        console.log('===子应用====', state, prev);
        const { userInfo = {}, projectId = '', logout, prefix = '', token = '' } = state;
        window?.DEBUGGERSTATE && console.log('%c 更新的状态', 'color: blue;font-size: 16px;', state);
        const { subjectCode = '' } = userInfo;
        mainStore.setGroupCode(subjectCode);
        mainStore.setProjectId(projectId);
        mainStore.setPastDueHandle(logout);
        mainStore.setQiankunFn(props);
        mainStore.setMicroServicePrefix(prefix);
        if (token) {
            setToken(token);
        }

        // pinia 只能需要在实例化后才能调用
        render(props);
    }, true);
    setTimeout(() => {
        // 例子 - 关闭局部loading
        props.setGlobalState({ closeLoading: true });
    }, 3000);
}
export async function unmount() {
    // 微应用卸载
    app.unmount(); // 销毁vue实例
    app = null; // 清空实例
    loaded = false;
}
/* 微应用运行 end */
