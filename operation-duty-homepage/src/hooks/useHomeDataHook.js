// @ts-ignore
import i18n from '@/localization';
import { getDutyHome, getNumberOfChillers } from '@/apis/duty';
import { SUCCESSCODE } from '@/utils/globalVariables';
import { useIntervalHook } from './useIntervalHook';
export const useHomeDataHook = () => {
    const loading = ref(true);
    const loaded = ref(false);
    const data = ref();
    const chillerData = ref();
    const intervalHook = useIntervalHook();
    // 是否正在获取数据，轮询时防止上一次接口未返回又继续发起请求
    const dataLoading = ref(false);
    const loadingNumberOfChillers = ref(true);
    const loadDutyHomeData = async (systemList, needLoading = true) => {
        if (dataLoading.value) {
            return;
        }
        if (needLoading) {
            dataLoading.value = true;
        }
        try {
            const res = await getDutyHome(systemList);
            if (res.code === SUCCESSCODE) {
                if (res.data && res.data.length) {
                    data.value = res.data[0] || {};
                }
            }
        } catch (err) {
            console.log(err);
        } finally {
            dataLoading.value = false;
        }
    };

    const getDutyHomeData = async systemList => {
        loading.value = true;
        await loadDutyHomeData(systemList);
        loaded.value = true;
        loading.value = false;
    };

    const loadNumberOfChillers = async systemId => {
        loadingNumberOfChillers.value = true;
        try {
            const res = await getNumberOfChillers({ systemId });
            if (res.code === SUCCESSCODE) {
                if (res.data) {
                    chillerData.value = res.data || {};
                }
            }
        } catch (err) {
            console.log(err);
        } finally {
            loadingNumberOfChillers.value = false;
        }
    };

    const startDataPolling = systemList => {
        intervalHook.startDataPolling([() => loadDutyHomeData(systemList, false)]);
    };

    return {
        data,
        loading,
        loaded,
        dataLoading,
        loadingNumberOfChillers,
        loadNumberOfChillers,
        chillerData,
        getDutyHomeData,
        startDataPolling
    };
};
