import { defineStore } from 'pinia';
import { SUCCESSCODE } from '@/utils/globalVariables';
import { listInfoCodes } from '@/apis/common';

const infoCodeDataStore = defineStore('infoCodeData', {
    state: () => {
        return {
            infoCodeMap: new Map(),
            infoCodeList: []
        };
    },
    getters: {
        getinfoCode() {
            return code => this.infoCodeMap.get(code);
        }
    },
    actions: {
        async handleInfoCodeData(classCodes) {
            this.infoCodeList = [];
            this.infoCodeMap = new Map();
            const { data, code } = await listInfoCodes({ classCodes });
            if (code === SUCCESSCODE) {
                data.forEach(element => {
                    this.infoCodeMap.set(element.code, element);
                });
                this.infoCodeList = data;
            }
            return { data, code };
        }
    }
});

export default infoCodeDataStore;
