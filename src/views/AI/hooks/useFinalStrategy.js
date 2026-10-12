import { infoCodesAllMapKey, currentSystemKey, strategyOverviewTempKey, currentSystemIdKey, chillerCodeDefineKey } from './useStaticData';
import { getInfoCodeUniqueKey } from '../utils';
import { broadcastAndComputeEndTimeKey, activeStrategyIndexKey } from '../injectionKey';
import dayjs from 'dayjs';

import { dayjsIsAfter } from '@/utils/dayjsTools';
import i18n from '@/localization';
import { isEmpty } from '@/utils/tools';
import { templateConfigsKey } from './useTemplateConfig';
import { formatAIDebugTime, getTimeSeriesSummary, logAIDebug } from '../utils/debug';

const FIELD_TYPE = {
    CHILLER_NUMBER: 'CHILLER_NUMBER'
};

const getChillerMeasureWord = chillerType => {
    return chillerType === 'ACSCG' ? i18n.global.t('common.group') : i18n.global.t('common.tai');
};
// 新增公共方法用于处理设备数量显示逻辑
const formatDeviceCount = (deviceGroup, unit) => {
    if (!deviceGroup) return `--${unit}`;
    const { small, large, m1, SMALL, LARGE, M1 } = deviceGroup || {};
    const smallCount = small || SMALL;
    const largeCount = large || LARGE;
    const m1Count = m1 || M1;

    const hasSmall = smallCount !== undefined;
    const hasM1 = m1Count !== undefined;
    const isOnlyLarge = !hasSmall && !hasM1;

    if (isOnlyLarge) {
        return `${largeCount ?? '--'}${unit}`;
    } else if (hasSmall && hasM1) {
        return i18n.global.t('common.large_mid_small', {
            big: isEmpty(largeCount),
            mid: isEmpty(m1Count),
            sm: isEmpty(smallCount)
        });
    } else if (!hasSmall) {
        return i18n.global.t('common.large_mid', {
            big: isEmpty(largeCount),
            mid: isEmpty(m1Count)
        });
    } else if (!hasM1) {
        return i18n.global.t('common.large_small', {
            big: isEmpty(largeCount),
            sm: isEmpty(smallCount)
        });
    }
    return '--';
};
export default () => {
    const currentSystem = inject(currentSystemKey);
    const strategy = inject(strategyOverviewTempKey);
    const infoCodesAllMap = inject(infoCodesAllMapKey);
    const activeIndex = inject(activeStrategyIndexKey);
    const broadcastAndComputeEndTime = inject(broadcastAndComputeEndTimeKey);
    const systemId = inject(currentSystemIdKey);
    const templateConfigs = inject(templateConfigsKey);

    const chillerCodeDefine = inject(chillerCodeDefineKey);

    const finalStrategyList = ref([]);
    const finalStrategyDebugState = ref('');

    const logFinalStrategyDebug = (message, payload) => {
        const signature = JSON.stringify({ message, payload });
        if (finalStrategyDebugState.value === signature) {
            return;
        }
        finalStrategyDebugState.value = signature;
        logAIDebug('final-strategy', message, payload);
    };

    const bestStrategy = computed(() => {
        if (!strategy?.value?.[activeIndex.value]) return null;
        const val = strategy.value[activeIndex.value].stgyCodeList.find(item => {
            return item.isBest;
        });
        const data = val && val?.content ? val?.content?.data?.[0] : {};

        return { ...data, curPredACAC: data?.predACAC?.[systemId.value] ?? [] };
    });

    const currentTime = computed(() => {
        let curTime = null;
        if (broadcastAndComputeEndTime.value) {
            curTime = broadcastAndComputeEndTime.value;
        } else if (strategy?.value?.[activeIndex.value]?.endTime) {
            curTime = dayjs(strategy.value[activeIndex.value].endTime, 'YYYY-MM-DD HH:mm:ss', true);
        }
        return curTime;
    });

    const getNextIndex = arr => {
        if (!currentTime.value || !arr) return null;

        let nextIndex = null;
        for (let i = 0; i < arr.length; i++) {
            const nextTime = dayjs(arr[i].time, 'YYYY-MM-DD HH:mm:ss', true);
            if (dayjsIsAfter(nextTime, currentTime.value)) {
                nextIndex = i;
                break;
            }
        }
        return nextIndex;
    };

    const getNumber = (val, scale) => {
        try {
            const num = parseFloat(val);
            return isNaN(num) ? val : num.toFixed(scale || 0);
        } catch (e) {
            console.log('e: ', e);
        }
        return val;
    };
    watchEffect(() => {
        const config = templateConfigs.value?.mpcFinalStrategySelection;
        const readyPayload = {
            activeIndex: activeIndex.value,
            configLength: config?.length ?? 0,
            infoCodeCount: infoCodesAllMap?.value?.size,
            hasBestStrategy: Boolean(bestStrategy.value),
            hasChillerCodeDefine: Boolean(chillerCodeDefine.value),
            currentTime: formatAIDebugTime(currentTime.value),
            bestStrategyCode: bestStrategy.value?.stgyIndicator?.strategyCode ?? null
        };
        if (!(config?.length && infoCodesAllMap?.value?.size && bestStrategy.value && chillerCodeDefine.value)) {
            logFinalStrategyDebug('最终策略选择前置条件未满足', readyPayload);
            // 最终策略需要重置为[]
            finalStrategyList.value = [];
            return;
        }

        const curChillerCodeDefine = chillerCodeDefine.value[currentSystem.value?.classCode] || chillerCodeDefine.value.ACAC;
        if (!curChillerCodeDefine) {
            logFinalStrategyDebug('当前系统缺少冷机编码定义', {
                ...readyPayload,
                systemClassCode: currentSystem.value?.classCode ?? null
            });
            // 最终策略需要重置为[]
            finalStrategyList.value = [];
            return;
        }

        const nextIndex = getNextIndex(bestStrategy.value.stgyCSDetail);
        // const nextIndex = 21;

        if (!nextIndex && nextIndex !== 0) {
            logFinalStrategyDebug('最终策略选择未找到未来时刻索引', {
                ...readyPayload,
                stgyCSDetailSummary: getTimeSeriesSummary(bestStrategy.value.stgyCSDetail),
                predACACSummary: getTimeSeriesSummary(bestStrategy.value.curPredACAC)
            });
            // 最终策略需要重置为[]
            finalStrategyList.value = [];
            return '';
        }

        const valueObj = bestStrategy.value.stgyCSDetail[nextIndex];

        finalStrategyList.value = config
            ?.map(g => {
                const group = { ...g };
                const items = g.items
                    ?.map(item => {
                        if (!valueObj.hasOwnProperty(item.field)) {
                            return null;
                        }
                        const val = valueObj[item.field];
                        if (item.type === FIELD_TYPE.CHILLER_NUMBER) {
                            if (val) {
                                const arr = [];
                                Object.keys(val).forEach(code => {
                                    const codeDefine = curChillerCodeDefine[code] ?? {};
                                    const chillerVal = val[code];
                                    const unit = getChillerMeasureWord(code) || i18n.global.t('common.tai');

                                    arr.push({ ...codeDefine, valText: formatDeviceCount(chillerVal, unit) });
                                });
                                return arr?.sort((a, b) => a.order - b.order);
                            }
                        } else {
                            const systemCodeDefine = infoCodesAllMap.value.get(getInfoCodeUniqueKey(currentSystem.value?.classCode, item.field));
                            const codeDefine = systemCodeDefine ?? {};
                            if (!systemCodeDefine && !item.name) {
                                return null;
                            }

                            const dataSources = item.dataSources || codeDefine.dataSources;
                            const unit = item.unit || codeDefine.unit;
                            let valText = val;

                            if (dataSources?.length > 0) {
                                valText = dataSources.find(source => source.code === val?.toString())?.name;
                            } else {
                                const scale = item.scale || codeDefine.scale || 0;
                                const num = getNumber(val, scale);

                                valText = `${num ?? '--'}${unit ?? ''}`;
                            }
                            return { ...item, valText, ...codeDefine };
                        }
                    })
                    .flatMap(item => (Array.isArray(item) ? item : [item]))
                    .filter(Boolean);
                return { ...group, items };
            })
            .filter(g => g.items.length > 0);

        logFinalStrategyDebug('最终策略选择组装完成', {
            ...readyPayload,
            nextIndex,
            groupCount: finalStrategyList.value.length,
            groupSummary: finalStrategyList.value.map(group => ({
                id: group.id,
                name: group.name,
                itemCount: group.items.length,
                fields: group.items.map(item => item.field ?? item.code ?? null).filter(Boolean)
            }))
        });
    });

    return { finalStrategyList };
};
