import { defineStore } from 'pinia';

export const useControls = defineStore('controls', {
    state: () => {
        return {
            scrollPosition: 0,
            demandDataStore: []
        };
    },
    getters: {},
    actions: {}
});
