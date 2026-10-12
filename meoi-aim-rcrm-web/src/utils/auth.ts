import useMainStore from '../store/modules/main/index';

const isLogin = () => {
    const mainStore = useMainStore();
    return !!mainStore.token;
};

const getToken = () => {
    const mainStore = useMainStore();
    return mainStore.token;
};

const setToken = (token: string) => {
    const mainStore = useMainStore();
    mainStore.setToken(token);
};

const clearToken = () => {
    const mainStore = useMainStore();
    mainStore.setToken('');
};

export { isLogin, getToken, setToken, clearToken };
