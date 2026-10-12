import { defineStore } from 'pinia';

const useMainStore = defineStore('main', {
    state: () => ({
        // group-code或project-id
        groupCode: '',
        projectId: '',
        token: '',
        // 运行策略内容关闭时间
        contentCloseTime: 0,
        // 乾坤环境下子应用登出函数
        pastDueHandle: undefined,
        //子应用在乾坤环境下的路由前缀
        microServicePrefix: '',
        // Drawer组件距离顶部的距离
        drawerTop: 0,
        // 微前端钩子数据
        qiankunFn: null
    }),

    getters: {},

    actions: {
        setGroupCode(val) {
            this.groupCode = val;
        },
        setProjectId(val) {
            this.projectId = val;
        },
        setToken(val) {
            this.token = val;
        },
        setContentCloseTime(val) {
            this.contentCloseTime = val;
        },
        setPastDueHandle(val) {
            this.pastDueHandle = val;
        },
        setMicroServicePrefix(val) {
            this.microServicePrefix = val;
        },
        setDrawerTop(val) {
            this.drawerTop = val;
        },
        // 设置微前端加载钩子
        setQiankunFn(val) {
            this.qiankunFn = val;
        }
    }
});

export default useMainStore;
