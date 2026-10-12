import { defineStore } from 'pinia';

const adjustDataStore = defineStore('adjustDataStore', {
    state: () => ({
        isMutil: false,
        cardTitle: '', // 预览卡片标题
        infoList: []
    }),

    getters: {},

    actions: {
        setInfoList(data) {
            this.infoList = data;
        },
        setIsMutil(data) {
            this.isMutil = data;
        }
    }
});

export default adjustDataStore;
