import { defineStore } from 'pinia';

const chartDataStore = defineStore('chartDataStore', {
    state: () => ({
        sortList: [],
        eqNames: [],
        adjustObject: {} // 细节调整选中的设备对象
    }),

    getters: {
        getSortList: state => {
            return state.sortList.map(item => {
                const name = state.eqNames.find(val => item.dataObjectId === val.dataObjectId);
                item.name = name.aliasName || name.localName;
                return item;
            });
        }
    },

    actions: {
        setSortList(list) {
            this.sortList = list;
        },
        setEqNames(names) {
            this.eqNames = names;
        },
        setAdjustObject(obj) {
            const name = this.eqNames && this.eqNames.find(val => obj?.data.dataObjectId === val.dataObjectId);
            obj.name = name.aliasName || name.localName;
            this.adjustObject = obj;
        }
    }
});

export default chartDataStore;
