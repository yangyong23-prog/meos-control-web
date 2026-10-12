import { defineStore } from 'pinia';

const useMidFrameStore = defineStore('midFrameStore', {
    state: () => ({
        props: {}
    }),
    getters: {},
    actions: {
        setProps(props) {
            this.props = props;
        },
        setGlobalState(config) {
            this.props?.setGlobalState?.(config);
        }
    }
});

export default useMidFrameStore;
