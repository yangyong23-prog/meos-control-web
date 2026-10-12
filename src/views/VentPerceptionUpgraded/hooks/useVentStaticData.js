// @ts-ignore
import i18n from '@/localization';
import { SUCCESSCODE } from '@/utils/globalVariables';
import { queryStatics } from '@/apis/ventilationPerception';
import { getEquipTypeId } from '../utils';
import { VENTILATION_FAN_TYPES } from '../variables';
import DockSingleton from '@/hooks/responsiveDock';
import { GET_MENU_CONFIG } from '@/utils/globalVariables';
import useSinglePOSTSSEClient from '@/components/hooks/useSinglePOSTSSEClient';
import useStore from '@/store';
import { VENTILATION_EQUIP_STATISTICS } from '@/utils/SSEEventTypes';
export const staticsInfoListKey = Symbol('staticsInfoListKey');
export const staticsLoadingKey = Symbol('staticsLoadingKey');
const defaultStatics = () => {
    const rst = {
        // 总计
        total: 0,
        // 异常数量
        abnormalCount: 0,
        runStatus: {
            // 在线
            on: 0,
            // 离线
            off: 0,
            // 无数据
            unknown: 0
        },
        alarmControl: {
            // 离线
            offLine: 0,
            // 空返不一致
            orderFailAlarm: 0,
            // 本地
            localStatus: 0,
            // 手动
            manualStatus: 0,
            // 自动
            autoStatus: 0
        }
    };

    return rst;
};
const getParams = equipList => {
    const rst = {};
    equipList?.forEach(eq => {
        const type = getEquipTypeId(eq);
        if (type) {
            if (!rst[type]) {
                rst[type] = [];
            }
            rst[type].push(eq.id);
        }
    });

    return rst;
};
export default curEquipInfoList => {
    const { getObjectAbnormalStatus } = DockSingleton.getInstance();
    const staticsLoading = ref(false);
    const { base } = useStore();
    const equipTypeMapStatics = ref({});
    const curParams = ref({});

    let staticsAbortController = null;
    const reset = () => {
        equipTypeMapStatics.value = {};
        curParams.value = {};
    };

    const { sseClient, setSSEClientOption } = useSinglePOSTSSEClient();
    const config = window[GET_MENU_CONFIG]();
    const eventTypes = [VENTILATION_EQUIP_STATISTICS];
    const setStaticsSSEClientOption = typeMapIds => {
        const paramsMap = {
            [VENTILATION_EQUIP_STATISTICS]: typeMapIds
        };

        setSSEClientOption({
            subscribeType: config.SUBSCRIBE_TYPE,
            instanceId: base.projectId,
            instanceType: 'PROJECT',
            eventType: eventTypes,
            eventParamMap: paramsMap
        });
    };

    watch(
        () => curEquipInfoList?.value,
        newVal => {
            reset();
            if (newVal?.length > 0) {
                if (staticsAbortController) {
                    staticsAbortController.abort();
                    staticsAbortController = null;
                }
                staticsAbortController = new AbortController();
                const p = getParams(newVal);
                curParams.value = p;
                staticsLoading.value = true;
                try {
                    queryStatics(p, staticsAbortController.signal)
                        .then(res => {
                            if (res.code === SUCCESSCODE && res.data) {
                                equipTypeMapStatics.value = res.data;
                            }
                        })
                        .finally(() => {
                            staticsLoading.value = false;
                        });
                    setStaticsSSEClientOption(p);
                } catch (e) {
                    staticsLoading.value = false;
                    console.log('e: ', e);
                }
            }
        }
    );

    const dealStaticsSSEEvent = res => {
        const d = res?.data;
        if (d) {
            equipTypeMapStatics.value = d;
        }
    };
    onMounted(() => {
        sseClient?.addEventListener(VENTILATION_EQUIP_STATISTICS, dealStaticsSSEEvent);
    });
    onBeforeUnmount(() => {
        sseClient?.removeEventListener(VENTILATION_EQUIP_STATISTICS, dealStaticsSSEEvent);
    });

    const getAbnormalCount = equips => {
        const abnormalCount = equips?.reduce((pre, cur) => {
            return pre + (getObjectAbnormalStatus(cur) ? 1 : 0);
        }, 0);
        return abnormalCount;
    };

    const staticsInfoList = computed(() => {
        return VENTILATION_FAN_TYPES.map(info => {
            const staticsObj = equipTypeMapStatics.value[info.id];
            const curEquips = curParams.value[info.id];
            if (staticsObj && curEquips?.length > 0) {
                const staticsInfo = Object.assign(defaultStatics(), staticsObj);
                // console.log('info: ', info, staticsInfo);
                return { ...info, ...staticsInfo, abnormalCount: getAbnormalCount(curEquips) };
            }
            return null;
        }).filter(Boolean);
    });

    provide(staticsInfoListKey, staticsInfoList);
    provide(staticsLoadingKey, staticsLoading);
};
