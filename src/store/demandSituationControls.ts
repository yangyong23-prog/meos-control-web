import { defineStore } from 'pinia';

export const useControls = defineStore('demand-situation-controls', {
    state: () => {
        return {
            scrollPosition: 0,
            publicArea: [],
            parkingLot: []
        };
    },
    getters: {},
    actions: {}
});
