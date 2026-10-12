// @ts-ignore
import i18n from '@/localization';
import { SUCCESSCODE } from '@/utils/globalVariables';
import { useIntervalHook } from './useIntervalHook';
import { allControllerParameter } from '@/apis/duty';
import { listScheduleInfoCodeDefine } from '@/apis/duty';
import { dayTz } from '@/utils/dayjsTools';

export const useACACDataHook = () => {
    const acacLoading = ref(true);
    const acacLoaded = ref(false);
    const acacData = ref([]);
    const acacCodeDefine = ref([]);
    const intervalHook = useIntervalHook();
    const currentSystemId = ref();
    // 是否正在获取数据，轮询时防止上一次接口未返回又继续发起请求
    const infoDataLoading = ref(false);
    const loadACACData = async () => {
        if (infoDataLoading.value) {
            return;
        }
        if (!currentSystemId.value) return;
        infoDataLoading.value = true;
        try {
            let projectId = window?.WebStore?.projectId;

            const ret = await Promise.allSettled([
                allControllerParameter({
                    projectId: projectId,
                    systemId: currentSystemId.value,
                    systemType: 'ACAC',
                    consoleTypes: 'COOL_INPUT',
                    beginDate: dayTz().format('YYYY-MM-DD'),
                    endDate: dayTz().format('YYYY-MM-DD')
                }),
                allControllerParameter({
                    projectId: projectId,
                    systemId: currentSystemId.value,
                    systemType: 'ACAC',
                    consoleTypes: 'COOL_SUPPLY',
                    beginDate: dayTz().format('YYYY-MM-DD'),
                    endDate: dayTz().format('YYYY-MM-DD')
                })
            ]);
            acacData.value = [];
            ret.forEach(res => {
                if (res.status === 'fulfilled') {
                    if (res.value.code === SUCCESSCODE) {
                        acacData.value = acacData.value.concat(res.value.data);
                    }
                }
            });
        } catch (err) {
            console.log(err);
        } finally {
            infoDataLoading.value = false;
        }
    };

    const loadCodeDefine = async () => {
        try {
            const ret = await listScheduleInfoCodeDefine({
                classCode: 'ACAC'
            });

            if (ret.code === SUCCESSCODE) {
                acacCodeDefine.value = ret.data.ACAC;
            }
        } catch (err) {
            console.log(err);
        }
    };

    const getACACData = async () => {
        acacLoading.value = true;
        await loadACACData();
        acacLoaded.value = true;
        acacLoading.value = false;
    };

    const startInfoDataPolling = () => {
        intervalHook.startDataPolling([() => loadACACData()]);
    };
    return {
        acacLoaded,
        acacLoading,
        acacData,
        acacCodeDefine,
        infoDataLoading,
        loadCodeDefine,
        currentSystemId,
        getACACData,
        startInfoDataPolling
    };
};
