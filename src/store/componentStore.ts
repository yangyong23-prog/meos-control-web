import { uniqueId } from 'lodash';
import { defineStore } from 'pinia';

const componentStore = defineStore('component', {
    state() {
        return {
            loading: false,
            id: '123123'
        };
    },
    getters: {
        getId(state) {
            return state.id;
        }
    },
    actions: {
        setId() {
            this.id = uniqueId('component-id-');
        },
        closeLoading(id: string) {
            if (this.id === id) {
                this.loading = false;
            }
        }
    }
});

export default componentStore;
