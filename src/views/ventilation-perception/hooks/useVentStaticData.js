// @ts-ignore
import i18n from '@/localization';
import { SUCCESSCODE } from '@/utils/globalVariables';
import { queryStatics } from '@/apis/ventilationPerception';

import { RECEIVE_FAN, SEND_FAN } from '../constant/symbols';

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
    const rst = { ffscafObjIds: new Set(), ffscmfObjIds: new Set() };
    equipList?.forEach(eq => {
        if (eq.equipType === SEND_FAN) {
            rst.ffscmfObjIds.add(eq.id);
        } else if (eq.equipType === RECEIVE_FAN) {
            rst.ffscafObjIds.add(eq.id);
        }
    });
    rst.ffscafObjIds = [...rst.ffscafObjIds];
    rst.ffscmfObjIds = [...rst.ffscmfObjIds];
    return rst;
};
export default () => {
    const curEquipInfoList = inject('curEquipInfoList');
    const sseClient = inject('sseClient');
    const templateType = inject('templateType');

    const staticsLoading = ref(false);

    const equipTypeMapStatics = ref({});

    let staticsAbortController = null;
    watch(
        () => curEquipInfoList?.value,
        newVal => {
            if (newVal?.length > 0) {
                if (staticsAbortController) {
                    staticsAbortController.abort();
                    staticsAbortController = null;
                }
                staticsAbortController = new AbortController();
                const p = getParams(newVal);

                staticsLoading.value = true;
                try {
                    queryStatics(p, staticsAbortController.signal)
                        .then(res => {
                            if ((res.code === SUCCESSCODE, res.data)) {
                                const { ffscafInfo, ffscmfInfo } = res.data;
                                equipTypeMapStatics.value[RECEIVE_FAN] = ffscafInfo || {};
                                equipTypeMapStatics.value[SEND_FAN] = ffscmfInfo || {};
                            }
                        })
                        .finally(() => {
                            staticsLoading.value = false;
                        });
                } catch (e) {
                    staticsLoading.value = false;
                    console.log('e: ', e);
                }
            }
        }
    );
    const dealStaticsSSEEvent = res => {
        const d = res?.data?.equipStatisticsMap;
        if (d) {
            const { ffscafInfo, ffscmfInfo } = d;
            equipTypeMapStatics.value[RECEIVE_FAN] = ffscafInfo || {};
            equipTypeMapStatics.value[SEND_FAN] = ffscmfInfo || {};
        }
    };
    onMounted(() => {
        sseClient?.addEventListener('VENTILATION_VIEW', dealStaticsSSEEvent);
    });
    onBeforeUnmount(() => {
        sseClient?.removeEventListener('VENTILATION_VIEW', dealStaticsSSEEvent);
    });

    const additionAbnormalCount = (target, equipType) => {
        if (target) {
            const abnormalCount = curEquipInfoList.value?.reduce((pre, cur) => {
                return pre + (cur.equipType === equipType && cur.isAbnormal ? 1 : 0);
            }, 0);
            target.abnormalCount = abnormalCount;
        }
    };

    const staticsInfo = computed(() => {
        // 排风机
        const receiveFan = Object.assign(defaultStatics(), equipTypeMapStatics.value[RECEIVE_FAN]);

        additionAbnormalCount(receiveFan, RECEIVE_FAN);
        // 送风机
        const sendFan = Object.assign(defaultStatics(), equipTypeMapStatics.value[SEND_FAN]);
        additionAbnormalCount(sendFan, SEND_FAN);

        // console.log('receiveFan, sendFan: ', receiveFan, sendFan);
        return { receiveFan, sendFan };
    });

    watchEffect(() => {
        if (templateType?.value) {
            staticsLoading.value = true;
        }
    });

    provide('staticsInfo', staticsInfo);
    provide('staticsLoading', staticsLoading);
    return { staticsInfo, staticsLoading };
};
