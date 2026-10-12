import { allControllerParameter } from '@/apis/duty';
import { dayTz } from '@/utils/dayjsTools';
import { SUCCESSCODE } from '@/utils/globalVariables';
import { listScheduleInfoCodeDefine } from '@/apis/duty';
import { useIntervalHook } from './useIntervalHook';

export const useControlDataHook = ({ consoleTypes = [], systemType = '' }) => {
    const controlLoading = ref(false);
    const controlData = ref([]);
    const currentController = ref(null);
    const intervalHook = useIntervalHook();

    const fetchControlData = async (params, clear = true, needLoading = true) => {
        if (needLoading) {
            controlLoading.value = true;
        }
        currentController.value?.abort();
        const controller = new AbortController();
        currentController.value = controller;
        let projectId = window?.WebStore?.projectId;

        try {
            const ress = await Promise.allSettled(
                consoleTypes.map(type =>
                    allControllerParameter(
                        {
                            projectId: projectId,
                            beginDate: dayTz().format('YYYY-MM-DD'),
                            endDate: dayTz().format('YYYY-MM-DD'),
                            consoleTypes: type,
                            systemType,
                            ...params
                        },
                        {
                            signal: controller.signal
                        }
                    )
                )
            );
            if (clear) {
                controlData.value = [];
            }
            ress.forEach((res, i) => {
                if (res.status === 'fulfilled') {
                    if (res.value.code === SUCCESSCODE) {
                        res.value.data = res.value.data.map(item => ({ ...item, consoleType: consoleTypes[i] }));
                        controlData.value = controlData.value.concat(res.value.data);
                    }
                }
            });
        } catch (error) {
            if (error?.name !== 'AbortError') {
                console.error('Failed to fetch control data:', error);
            }
        } finally {
            if (currentController.value === controller) {
                controlLoading.value = false;
            }
        }
    };
    const codeDefine = ref({});
    const loadCodeDefine = async () => {
        try {
            const ret = await listScheduleInfoCodeDefine({
                classCode: systemType
            });

            if (ret.code === SUCCESSCODE) {
                ret.data?.[systemType]?.forEach(item => {
                    codeDefine.value[item.code] = item;
                    codeDefine.value[item.aliasCode] = item;
                });
            }
        } catch (err) {
            console.log(err);
        }
    };
    const startDataPolling = params => {
        intervalHook.startDataPolling([() => fetchControlData(params, true, false)]);
    };
    onMounted(() => {
        loadCodeDefine();
    });
    onUnmounted(() => {
        currentController.value?.abort();
    });
    return {
        controlLoading,
        controlData,
        codeDefine,
        fetchControlData,
        startDataPolling
    };
};
