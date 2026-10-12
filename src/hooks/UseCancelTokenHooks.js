import i18n from '@/localization';
import axios from 'axios';
const UseCancelTokenHooks = () => {
    const source = ref(null); //存放取消的请求方法
    const cancelQuest = () => {
        if (typeof source.value === 'function') {
            source.value('终止请求'); //取消请求
        }
    };
    const cancelToken = () =>
        new axios.CancelToken(function executor(c) {
            source.value = c;
        });

    return {
        cancelToken,
        cancelQuest,
        source
    };
};

export default UseCancelTokenHooks;
