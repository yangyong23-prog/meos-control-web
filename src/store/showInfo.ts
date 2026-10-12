import { defineStore } from 'pinia';

export const showInfoStore = defineStore('showInfo', {
    state() {
        return {
            isComponentVisible: false
        };
    },
    actions: {
        closePopupShow() {
            this.isComponentVisible = !this.isComponentVisible;
        }
    }
});
