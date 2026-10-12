// @ts-ignore
import i18n from '@/localization';
import { SUCCESSCODE } from '@/utils/globalVariables';
import { queryStatics } from '@/apis/kitchenFumes';
import _ from 'lodash';
import useSinglePOSTSSEClient from '@/components/hooks/useSinglePOSTSSEClient';
import {
    CONCENTRATED_FAN_CLASSCODE,
    FRESH_AIR_UNIT_CLASSCODE,
    VENTILATION_FAN_CLASSCODE,
    OIL_FUME_PURIFIER_CLASSCODE,
    SERVICE_SPACE_KEY,
    RUNNING_MONITOR_TYPE
} from '../constant/index';
import { gridSseclientKey, loadinhGridDataKey } from '../constant/injectKey';
import { getStaticisParamsKey } from '../utils/index';
import { isFloorViewKey } from './useKitchenFumesGlobal';
import useStore from '@/store';
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
const mergeStatics = arr => {
    const rst = defaultStatics();
    arr?.forEach(obj => {
        if (!obj) {
            return;
        }
        Object.keys(rst).forEach(k => {
            const srcVal = obj[k];
            if (typeof srcVal === 'number') {
                rst[k] += srcVal || 0;
            } else if (srcVal) {
                // k 是runStatus、alarmControl
                Object.keys(srcVal).forEach(kk => {
                    rst[k][kk] += srcVal[kk] || 0;
                });
            }
        });
    });
    return rst;
};
export default () => {
    // 统计接口的参数
    const staticParams = inject('staticParams');
    const isAbnormal = inject('isAbnormal');
    const loadinhGridData = inject(loadinhGridDataKey);
    // const sseClient = inject(gridSseclientKey);
    const { base } = useStore();
    const classMapStatics = ref({});
    const staticsLoading = ref(true);
    const isFloorView = inject(isFloorViewKey);

    const { sseClient, setSSEClientOption } = useSinglePOSTSSEClient();
    const eventType = 'KITCHEN_RANGE_HOOD_EQUIP_STATISTICS';
    const eventTypes = [eventType];
    const setStaticsSSEClientOption = typeMapIds => {
        const sseParams = {
            subscribeType: RUNNING_MONITOR_TYPE,
            instanceId: base.projectId,
            instanceType: 'PROJECT',
            eventType: eventTypes
        };
        if (isFloorView.value) {
            const paramsMap = {
                [eventType]: typeMapIds
            };
            sseParams.eventParamMap = paramsMap;
        }

        setSSEClientOption(sseParams);
    };
    // if (isEdge()) {
    const handleStaticsResponse = res => {
        const resData = res?.data;
        if (resData) {
            classMapStatics.value[CONCENTRATED_FAN_CLASSCODE] = resData[`${CONCENTRATED_FAN_CLASSCODE.toLowerCase()}Info`] || {};
            classMapStatics.value[FRESH_AIR_UNIT_CLASSCODE] = resData[`${FRESH_AIR_UNIT_CLASSCODE.toLowerCase()}Info`] || {};
            classMapStatics.value[VENTILATION_FAN_CLASSCODE] = resData[`${VENTILATION_FAN_CLASSCODE.toLowerCase()}Info`] || {};
            classMapStatics.value[OIL_FUME_PURIFIER_CLASSCODE] = resData[`${OIL_FUME_PURIFIER_CLASSCODE.toLowerCase()}Info`] || {};
        }
    };
    watch(
        [() => staticParams?.value, () => loadinhGridData?.value],
        () => {
            classMapStatics.value = {};
            if (loadinhGridData?.value || staticParams?.value) {
                staticsLoading.value = true;
                if (!staticParams?.value) {
                    return;
                }
                try {
                    queryStatics(staticParams?.value)
                        .then(res => {
                            if (res.code === SUCCESSCODE) {
                                handleStaticsResponse(res);
                            }
                        })
                        .finally(() => {
                            staticsLoading.value = false;
                        });
                    setStaticsSSEClientOption(staticParams?.value);
                } catch (e) {
                    staticsLoading.value = false;
                }
            } else {
                staticsLoading.value = false;
                sseClient?.setOptions();
            }
        },
        { immediate: true }
    );
    onMounted(() => {
        sseClient?.addEventListener('KITCHEN_RANGE_HOOD_EQUIP_STATISTICS', handleStaticsResponse);
    });

    onBeforeUnmount(() => {
        sseClient?.removeEventListener('KITCHEN_RANGE_HOOD_EQUIP_STATISTICS', handleStaticsResponse);
    });
    // }
    const classMapAbnormalCount = computed(() => {
        const rst = { [CONCENTRATED_FAN_CLASSCODE]: 0, [FRESH_AIR_UNIT_CLASSCODE]: 0, [VENTILATION_FAN_CLASSCODE]: 0, [OIL_FUME_PURIFIER_CLASSCODE]: 0 };
        if (staticParams?.value) {
            Object.entries(staticParams?.value).forEach(([k, ids]) => {
                const classCode = k.replace('ObjIds', '').toUpperCase();
                if (rst[classCode] !== undefined) {
                    rst[classCode] += ids.reduce((pre, cur) => {
                        return pre + (isAbnormal(cur) ? 1 : 0);
                    }, 0);
                }
            });
        }
        return rst;
    });

    const additionAbnormalCount = (target, srcVal = 0) => {
        if (target) {
            target.abnormalCount = srcVal;
        }
    };

    const getStaticsInfoItem = classCodes => {
        console.log('concentratedFanInfo: ', staticParams?.value, classCodes);
        const infos = [];
        classCodes?.forEach(classCode => {
            const paramsKey = getStaticisParamsKey(classCode);
            if (staticParams?.value?.[paramsKey]?.length > 0) {
                const concentratedFanInfo = classMapStatics.value[classCode];
                additionAbnormalCount(concentratedFanInfo, classMapAbnormalCount.value[classCode]);
                infos.push(concentratedFanInfo);
            }
        });
        if (infos?.length > 0) {
            if (infos?.length > 1) {
                return mergeStatics(infos);
            }
            return _.merge(defaultStatics(), infos[0]);
        }
        return null;
    };

    const staticsInfo = computed(() => {
        // const paramsKey = getStaticisParamsKey(CONCENTRATED_FAN_CLASSCODE);
        // const concentratedFanInfo = classMapStatics.value[CONCENTRATED_FAN_CLASSCODE];
        // console.log('concentratedFanInfo: ', staticParams?.value, CONCENTRATED_FAN_CLASSCODE);
        // additionAbnormalCount(concentratedFanInfo, classMapAbnormalCount.value[CONCENTRATED_FAN_CLASSCODE]);
        // const freshAir = classMapStatics.value[FRESH_AIR_UNIT_CLASSCODE];
        // additionAbnormalCount(freshAir, classMapAbnormalCount.value[FRESH_AIR_UNIT_CLASSCODE]);
        // const ventilationFan = classMapStatics.value[VENTILATION_FAN_CLASSCODE];
        // additionAbnormalCount(ventilationFan, classMapAbnormalCount.value[VENTILATION_FAN_CLASSCODE]);
        // const oilFumePurifier = classMapStatics.value[OIL_FUME_PURIFIER_CLASSCODE];
        // additionAbnormalCount(oilFumePurifier, classMapAbnormalCount.value[OIL_FUME_PURIFIER_CLASSCODE]);

        // 排风油烟机
        const rangeHoodFan = getStaticsInfoItem([CONCENTRATED_FAN_CLASSCODE]);
        // const rangeHoodFan = _.merge(defaultStatics(), concentratedFanInfo);
        // 补风机
        const supplementalFans = getStaticsInfoItem([FRESH_AIR_UNIT_CLASSCODE, VENTILATION_FAN_CLASSCODE]);
        // const supplementalFans = mergeStatics([freshAir, ventilationFan]);
        // 油烟净化器
        const oilFumePurifiers = getStaticsInfoItem([OIL_FUME_PURIFIER_CLASSCODE]);
        // const oilFumePurifiers = _.merge(defaultStatics(), oilFumePurifier);

        // console.log('rangeHoodFan, supplementalFans, oilFumePurifiers: ', rangeHoodFan, supplementalFans, oilFumePurifiers);
        return { rangeHoodFan, supplementalFans, oilFumePurifiers };
    });

    provide('staticsInfo', staticsInfo);
    provide('staticsLoading', staticsLoading);
    return { staticsInfo, staticsLoading };
};
