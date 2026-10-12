<template>
    <div :id="id" class="policy-generation-card" :class="cardClass" @click="outClick">
        <div class="policy-generation-card-title">
            <ClockSVG />
            <span v-ellipsis class="title-text">{{ i18n.global.t('meos_control_web.calculation_time_colon') }}{{ computedStartTime }}</span>
            <span v-if="last" class="last-tip">{{ i18n.global.t('meos_control_web.latest') }}</span>
        </div>
        <div class="dashed-line">
            <svg xmlns="http://www.w3.org/2000/svg" width="290" height="2" viewBox="0 0 290 2" fill="none">
                <path d="M0 1H290" stroke="#C4C9CF" stroke-opacity="0.6" stroke-dasharray="5 4" />
            </svg>
        </div>
        <!-- 天气 -->
        <div class="weather-info">
            <div class="weather-info-left">
                <div class="info-left-up">{{ strategy[index].outdoorWeather.text }}</div>
                <div v-ellipsis class="info-left-down meos-ellipsis-line">{{ i18n.global.t('meos_control_web.outdoor_weather') }}</div>
            </div>
            <div class="weather-info-right">
                <div v-ellipsis>{{ i18n.global.t('meos_control_web.temperature_colon') }}{{ strategy[index].outdoorWeather.temperature }}°C</div>
                <div v-ellipsis>{{ i18n.global.t('meos_control_web.humidity_colon') }}{{ strategy[index].outdoorWeather.humidity }}%RH</div>
            </div>
        </div>
        <!-- AI描述 -->
        <div class="AI-desc">
            {{ i18n.global.t('meos_control_web.passed') }}
            <span class="AI-desc-number">{{ strategy[index].cmpCount }}</span>
            {{ i18n.global.t('meos_control_web.ai_forecast_calculation_strategy_generated_time') }}
            {{ timeConsuming }}， {{ i18n.global.t('meos_control_web.typical_strategy_below') }}
        </div>
        <!-- 策略 -->
        <div v-for="(item, index) in strategy[index].stgyCodeList" :id="lineIds[index]" :key="index" class="policy-item" @click="policyItem(index)">
            <div v-ellipsis class="policy-code meos-ellipsis-line">{{ i18n.global.t('meos_control_web.strategy_code_colon') }}{{ item.code }}</div>
            <div class="policy-desc">
                <span v-ellipsis class="policy-desc-space">{{ showLabel }}</span>
                <div v-ellipsis class="policy-desc-detail">{{ showValue(index) }}</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import ClockSVG from '@/assets/svg/clock.svg';
import emitter from '@/utils/bus';
import { uuid } from 'yushu-js-utils';
import treeBuildFloor from '@/store/treeBuildFloor';
import { strategyOverviewKey, objectsMapKey } from '../../../../../hooks/useStaticData';
import { broadcastAndComputeEndTimeKey, activeStrategyIndexKey, headerCenterStateKey } from '../../../../../injectionKey';
import dayjs from 'dayjs';
import { get, round } from 'lodash';
import { dayjsIsAfter } from '@/utils/dayjsTools';

const strategy = inject(strategyOverviewKey);
const objectsMap = inject(objectsMapKey);
const broadcastAndComputeEndTime = inject(broadcastAndComputeEndTimeKey);
const activeIndex = inject(activeStrategyIndexKey);
const headerCenterState = inject(headerCenterStateKey);

const props = defineProps({
    index: Number
});

const labelMap = ref({
    totalOperatingTimeOfTheSystem: i18n.global.t('meos_control_web.system_total_runtime'),
    sysOpenTime: i18n.global.t('meos_control_web.system_start_time'),
    sysCloseTime: i18n.global.t('meos_control_web.system_shutdown_time'),
    // chillerGroup: i18n.global.t('meos_control_web.chiller_unit_count_colon'),
    coolingStorageStartTime: i18n.global.t('meos_control_web.cooling_storage_start_time_colon'),
    coolingStorageEndTime: i18n.global.t('meos_control_web.cooling_storage_end_time_colon'),
    waterOutTempSet: i18n.global.t('meos_control_web.chiller_outlet_temp_colon'),
    freezingPumpGroup: i18n.global.t('meos_control_web.chilled_water_pump_units_colon')
});

const id = ref(`PGCard_${uuid(5)}`);

const lineIds = ref(['PGCard_inner1' + uuid(5), 'PGCard_inner2' + uuid(5), 'PGCard_inner3' + uuid(5)]);

const last = computed(() => {
    return props.index === 0;
});

const active = computed(() => {
    return props.index === activeIndex.value;
});

// 用于计算策略中下一个节点的所用时间
const currentTime = computed(() => {
    let currentTime = null;
    if (broadcastAndComputeEndTime.value) {
        currentTime = broadcastAndComputeEndTime.value;
    } else if (strategy.value[activeIndex.value].endTime) {
        currentTime = dayjs(strategy.value[activeIndex.value].endTime, 'YYYY-MM-DD HH:mm:ss', true);
    }
    return currentTime;
});

const computedStartTime = computed(() => {
    // 展示开始时间
    if (strategy.value[props.index].startTime) {
        const date = dayjs(strategy.value[props.index].startTime, 'YYYY-MM-DD HH:mm:ss', true);
        return date.format('YYYY-MM-DD HH:mm');
    }
    return '--';
});

const timeConsuming = computed(() => {
    if (!strategy.value[props.index].startTime) {
        return i18n.global.t('meos_control_web.mm_ss_format');
    }
    let start = strategy.value[props.index].startTime,
        end = null,
        minutes = 0,
        second = 0;
    if (last.value && broadcastAndComputeEndTime.value) {
        end = broadcastAndComputeEndTime.value.format('YYYY-MM-DD HH:mm:ss');
    } else if (strategy.value[props.index].endTime) {
        end = strategy.value[props.index].endTime;
    } else {
        return i18n.global.t('meos_control_web.mm_ss_format');
    }
    start = dayjs(start, 'YYYY-MM-DD HH:mm:ss', true);
    end = dayjs(end, 'YYYY-MM-DD HH:mm:ss', true);

    (minutes = end.diff(start, 'minute')), (second = end.diff(start, 'second'));
    minutes = minutes % 60;
    second = second % 60;
    return i18n.global.t('meos_control_web.mm_ss_format1', {
        minutes: minutes,
        second: second
    });
});

const worstSpaces = computed(() => {
    return index => {
        if (!strategy.value[props.index].stgyCodeList[index]) {
            return i18n.global.t('meos_control_web.none1');
        }
        const { content } = strategy.value[props.index].stgyCodeList[index];
        if (!content) {
            return i18n.global.t('meos_control_web.none1');
        }
        const { worstSpaceIds } = content.data[0].stgyIndicator;
        if (worstSpaceIds.length === 0) return i18n.global.t('meos_control_web.none1');
        if (worstSpaceIds) {
            let arr = [];
            for (const key in worstSpaceIds) {
                const worstSpaceInfo = objectsMap.value[worstSpaceIds[key]];
                let floorName = '',
                    buildName = '',
                    spaceName = '';
                if (worstSpaceInfo) {
                    floorName = treeBuildFloor().getBuildOrFloor(worstSpaceInfo.floorId).localName;
                    buildName = treeBuildFloor().getBuildOrFloor(worstSpaceInfo.buildingId).localName;
                    spaceName = objectsMap.value[worstSpaceIds[key]].localName;
                }
                arr.push(`${buildName}-${floorName}-${spaceName}`);
            }
            return arr.join('、');
        }
        return i18n.global.t('meos_control_web.none1');
    };
});

const showLabel = computed(() => {
    if (!strategy.value[props.index]) return '';
    // 判断是否有数据可比较
    for (let i = 0; i < strategy.value[props.index].stgyCodeList.length; i++) {
        if (!getStrategyValue(i)) return '';
    }

    // 对比计算系统总运行时长
    if (
        bestDiffOther(
            strategy.value[props.index].stgyCodeList.map((item, index) => {
                return {
                    code: item.code,
                    isBest: item.isBest,
                    data: totalOperatingTimeOfTheSystem(index)
                };
            }),
            `Strategy-totalOperatingTimeOfTheSystem${i18n.global.t('meos_control_web.template_dup')}:`
        )
    )
        return labelMap.value.totalOperatingTimeOfTheSystem;

    // 对比系统开启时间
    if (
        bestDiffOther(
            strategy.value[props.index].stgyCodeList.map((item, index) => {
                return {
                    code: item.code,
                    isBest: item.isBest,
                    data: sysOpenTime(index)
                };
            }),
            'Strategy-sysOpenTime:'
        )
    )
        return labelMap.value.sysOpenTime;

    // 对比系统关闭时间
    if (
        bestDiffOther(
            strategy.value[props.index].stgyCodeList.map((item, index) => {
                return {
                    code: item.code,
                    isBest: item.isBest,
                    data: sysCloseTime(index)
                };
            }),
            'Strategy-sysCloseTime:'
        )
    )
        return labelMap.value.sysCloseTime;
    // 对比蓄冷开始时间
    if (
        bestDiffOther(
            strategy.value[props.index].stgyCodeList.map((item, index) => {
                return {
                    code: item.code,
                    isBest: item.isBest,
                    data: coolingStorageStartTime(index)
                };
            }),
            'Strategy-coolingStorageStartTime:'
        )
    )
        return labelMap.value.coolingStorageStartTime;
    // 对比蓄冷时间
    if (
        bestDiffOther(
            strategy.value[props.index].stgyCodeList.map((item, index) => {
                return {
                    code: item.code,
                    isBest: item.isBest,
                    data: coolingStorageEndTime(index)
                };
            }),
            'Strategy-coolingStorageEndTime:'
        )
    )
        return labelMap.value.coolingStorageEndTime;

    // 对比计算冷机台数
    // if (
    //     bestDiffOther(
    //         strategy.value[props.index].stgyCodeList.map((item, index) => {
    //             return {
    //                 code: item.code,
    //                 isBest: item.isBest,
    //                 data: chillerGroup(index)
    //             };
    //         }),
    //         `Strategy-chillerGroup${i18n.global.t('meos_control_web.template_dup')}:`
    //     )
    // )
    //     return labelMap.value.chillerGroup;

    // 对比计算冷机出水温度
    if (
        bestDiffOther(
            strategy.value[props.index].stgyCodeList.map((item, index) => {
                return {
                    code: item.code,
                    isBest: item.isBest,
                    data: waterOutTempSet(index)
                };
            }),
            `Strategy-waterOutTempSet${i18n.global.t('meos_control_web.template_dup')}:`
        )
    )
        return labelMap.value.waterOutTempSet;

    // 对比计算冷冻泵台数
    if (
        bestDiffOther(
            strategy.value[props.index].stgyCodeList.map((item, index) => {
                return {
                    code: item.code,
                    isBest: item.isBest,
                    data: freezingPumpGroup(index)
                };
            }),
            `Strategy-freezingPumpGroup${i18n.global.t('meos_control_web.template_dup')}:`
        )
    )
        return labelMap.value.freezingPumpGroup;

    // 其他
    return labelMap.value.totalOperatingTimeOfTheSystem;
});

const showValue = computed(() => {
    return index => {
        switch (showLabel.value) {
            case labelMap.value.totalOperatingTimeOfTheSystem:
                return totalOperatingTimeOfTheSystem(index);
            case labelMap.value.sysOpenTime:
                return sysOpenTime(index);
            case labelMap.value.sysCloseTime:
                return sysCloseTime(index);
            case labelMap.value.coolingStorageStartTime:
                return coolingStorageStartTime(index);
            case labelMap.value.coolingStorageEndTime:
                return coolingStorageEndTime(index);
            case labelMap.value.waterOutTempSet:
                return waterOutTempSet(index);
            case labelMap.value.freezingPumpGroup:
                return freezingPumpGroup(index);
            default:
                return '';
        }
    };
});

// 计算系统总运行时长
const totalOperatingTimeOfTheSystem = index => {
    const currentStrategy = getStrategyValue(index);
    if (currentStrategy === null || !Array.isArray(currentStrategy.stgyCSDetail)) return null;
    const openNum = currentStrategy.stgyCSDetail.filter(item => {
        return item.coolingSupplySwitchSet === 1;
    }).length;
    const total = openNum * 15;
    const hours = parseInt(total / 60);
    const mins = total % 60;
    return i18n.global.t('meos_control_web.hour_minute', { hours: hours, mins: mins });
};
// 计算系统开启时间
const sysOpenTime = index => {
    if (!strategy.value[props.index] || strategy.value[props.index].IsSystemOpen !== false || strategy.value[props.index].IsSystemOpen === null) return null;
    const currentStrategy = getStrategyValue(index);
    if (currentStrategy === null) return null;
    const nextIndex = getNextIndex(currentStrategy.stgyCSDetail);
    if (!nextIndex && nextIndex !== 0) return null;
    let openTime = '';
    for (let i = nextIndex; i < currentStrategy.stgyCSDetail.length; i++) {
        if (currentStrategy.stgyCSDetail[i].coolingSupplySwitchSet === 1) {
            openTime = currentStrategy.stgyCSDetail[i].time;
            break;
        }
    }
    if (openTime === '') return null;
    return dayjs(openTime, 'YYYY-MM-DD HH:mm:ss', true).format('HH:mm');
};
// 计算系统关闭时间
const sysCloseTime = index => {
    if (!strategy.value[props.index] || strategy.value[props.index].IsSystemOpen !== true || strategy.value[props.index].IsSystemOpen === null) return null;
    const currentStrategy = getStrategyValue(index);
    if (currentStrategy === null) return null;
    const nextIndex = getNextIndex(currentStrategy.stgyCSDetail);
    if (!nextIndex && nextIndex !== 0) return null;
    let closeTime = '';
    for (let i = nextIndex; i < currentStrategy.stgyCSDetail.length; i++) {
        if (currentStrategy.stgyCSDetail[i].coolingSupplySwitchSet === 0) {
            closeTime = currentStrategy.stgyCSDetail[i].time;
            break;
        }
    }
    if (closeTime === '') return null;
    return dayjs(closeTime, 'YYYY-MM-DD HH:mm:ss', true).format('HH:mm');
};
// 计算蓄冷开始时间
const coolingStorageStartTime = index => {
    if (!strategy.value[props.index] || strategy.value[props.index].IsCoolingStorageOpen !== false || strategy.value[props.index].IsCoolingStorageOpen === null) return null;
    const currentStrategy = getStrategyValue(index);
    if (currentStrategy === null) return null;
    const nextIndex = getNextIndex(currentStrategy.stgyCSDetail);
    if (!nextIndex && nextIndex !== 0) return null;
    let closeTime = '';
    for (let i = nextIndex; i < currentStrategy.stgyCSDetail.length; i++) {
        if (currentStrategy.stgyCSDetail[i].coolingStorageSwitchSet === 1) {
            closeTime = currentStrategy.stgyCSDetail[i].time;
            break;
        }
    }
    if (closeTime === '') return null;
    return dayjs(closeTime, 'YYYY-MM-DD HH:mm:ss', true).format('HH:mm');
};
// 计算蓄冷时间
const coolingStorageEndTime = index => {
    if (!strategy.value[props.index] || strategy.value[props.index].IsCoolingStorageOpen !== true || strategy.value[props.index].IsCoolingStorageOpen === null) return null;
    const currentStrategy = getStrategyValue(index);
    if (currentStrategy === null) return null;
    const nextIndex = getNextIndex(currentStrategy.stgyCSDetail);
    if (!nextIndex && nextIndex !== 0) return null;
    let closeTime = '';
    for (let i = nextIndex; i < currentStrategy.stgyCSDetail.length; i++) {
        if (currentStrategy.stgyCSDetail[i].coolingStorageSwitchSet === 0) {
            closeTime = currentStrategy.stgyCSDetail[i].time;
            break;
        }
    }
    if (closeTime === '') return null;
    return dayjs(closeTime, 'YYYY-MM-DD HH:mm:ss', true).format('HH:mm');
};
// 计算冷机台数
// const chillerGroup = index => {
//     const currentStrategy = getStrategyValue(index);
//     if (currentStrategy === null) return null;
//     const nextIndex = getNextIndex(currentStrategy.stgyCSDetail);
//     if (!nextIndex && nextIndex !== 0) return null;
//     const { chillerGroup } = currentStrategy.stgyCSDetail[nextIndex];
//     if (!chillerGroup) return null;
//     if (!chillerGroup.small && chillerGroup.small !== 0) {
//         if (!chillerGroup.large && chillerGroup.large !== 0) {
//             return i18n.global.t('meos_control_web.no_tai');
//         } else {
//             return `${chillerGroup.large}${i18n.global.t('common.tai')}`;
//         }
//     }
//     return i18n.global.t('common.large_small', {
//         big: chillerGroup.large,
//         sm: chillerGroup.small
//     });
// };
// 计算冷机出水温度
const waterOutTempSet = index => {
    const currentStrategy = getStrategyValue(index);
    if (currentStrategy === null) return null;
    const nextIndex = getNextIndex(currentStrategy.stgyCSDetail);
    if (!nextIndex && nextIndex !== 0) return null;
    if (!currentStrategy.stgyCSDetail[nextIndex].waterOutTempSet && currentStrategy.stgyCSDetail[nextIndex].waterOutTempSet !== 0) return null;
    const str = round(currentStrategy.stgyCSDetail[nextIndex].waterOutTempSet, 1) + '°C';
    return str;
};
// 计算冷冻泵台数
const freezingPumpGroup = index => {
    const currentStrategy = getStrategyValue(index);
    if (currentStrategy === null) return null;
    const nextIndex = getNextIndex(currentStrategy.stgyCSDetail);
    if (nextIndex === null) return null;
    const { freezingPumpGroup: tempGroup } = currentStrategy.stgyCSDetail[nextIndex] || {};
    if (typeof tempGroup === 'object' && tempGroup !== null) {
        const smallCount = tempGroup.small || tempGroup.SMALL;
        const largeCount = tempGroup.large || tempGroup.LARGE;
        if (!smallCount && smallCount !== 0) {
            if (!largeCount && largeCount !== 0) {
                return i18n.global.t('meos_control_web.no_tai');
            } else {
                return `${largeCount}${i18n.global.t('common.tai')}`;
            }
        }
    } else if (typeof tempGroup === 'number') {
        return `${tempGroup}${i18n.global.t('common.tai')}`;
    } else {
        return null;
    }
};

const getStrategyValue = strategyIndex => {
    return strategy.value[props.index]?.stgyCodeList[strategyIndex]?.content?.data?.[0];
};

const getNextIndex = (arr = []) => {
    if (!currentTime.value) return null;
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

const bestDiffOther = (arr, log) => {
    let diff = false;
    const best = arr.find(item => {
        return item.isBest;
    });
    if (!best) return false;
    const them = arr.filter(item => {
        return !item.isBest;
    });
    for (let i = 0, l = them.length; i < l; i++) {
        if (them[i].data !== best.data && them[i].data !== null && best.data !== null) diff = true;
    }
    return diff;
};

onMounted(() => {
    nextTick(() => {
        emitter.emit('PGcard', {
            outId: id.value,
            lineIds: lineIds.value,
            index: props.index
        });
    });
});

const cardClass = computed(() => {
    let className = 'policy-generation-card-unactive';
    if (active.value) {
        className = 'policy-generation-card-active';
    }
    return className;
});

const policyItem = index => {
    if (!active.value) return;
    if (headerCenterState.value === 0 || headerCenterState.value === 1 || headerCenterState.value === 2) {
        emitter.emit('PG-item-click', {
            stgyIndex: props.index,
            stgyCodeIndex: index
        });
    }
};

const outClick = () => {
    emitter.emit('PG-out-click', {
        index: props.index
    });
};
</script>

<style lang="less" scoped>
.policy-generation-card {
    overflow: hidden;
    padding: 12px 16px 20px 16px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.8);
    box-shadow: 2px 1px 0px 0px rgba(255, 255, 255, 0.8) inset;
    .policy-generation-card-title {
        display: flex;
        align-items: center;
        padding: 4px;
        border-radius: 4px;
        background: linear-gradient(90deg, rgba(216, 214, 221, 0.2) 0%, rgba(232, 228, 234, 0.08) 100%);
        .title-text {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            padding: 4px;
            color: var(--gray-600, #626c78);
            text-align: center;
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 22px; /* 157.143% */
        }
        .last-tip {
            padding: 4px;
            flex: 1;
            display: flex;
            padding: 0px 4px;
            justify-content: center;
            align-items: center;
            gap: 10px;
            border-radius: 2px;
            background: var(--violet-100, #f1e5fe);
            color: var(--violet-700, #683bd6);
            font-size: 12px;
            font-style: normal;
            font-weight: 400;
            line-height: 20px; /* 166.667% */
        }
    }
    .dashed-line {
        margin: 12px 0px 12px 0px;
        height: 2px;
        position: relative;
        svg {
            width: 100%;
            position: absolute;
            top: 0px;
        }
    }
    .weather-info {
        padding: 8px 16px;
        display: flex;
        border-radius: 8px;
        background: linear-gradient(90deg, rgba(196, 201, 207, 0.2) 0%, rgba(196, 201, 207, 0.08) 100%);
        .weather-info-left {
            min-width: 64px;
            width: 32%;
            height: 52px;
            border-right: 1px #d3dcea solid;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .info-left-up {
                color: var(--gray-800, #2e3742);
                font-size: 16px;
                font-style: normal;
                font-weight: 700;
                line-height: normal;
            }
            .info-left-down {
                color: var(--gray-600, #626c78);
                font-size: 14px;
                font-style: normal;
                font-weight: 400;
                line-height: 22px; /* 157.143% */
                margin-right: 2px;
            }
        }
        .weather-info-right {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding-left: 8px;
            overflow: hidden;
            div {
                text-align: right;
                color: var(--gray-600, #626c78);
                font-size: 14px;
                font-style: normal;
                font-weight: 400;
                line-height: normal;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
    }
    .AI-desc {
        margin: 12px 0px;
        color: var(--gray-900, #8b949e);
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 24px; /* 171.429% */
        .AI-desc-number {
            color: var(--gray-900, #8b949e);
            font-size: 18px;
            font-weight: 600;
            font-family: CustomMedium2;
        }
    }
    .policy-item {
        margin-top: 16px;
        display: flex;
        height: 86px;
        padding: 12px;
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
        align-self: stretch;
        border-radius: 8px;
        border: 1px solid var(--gray-200, #e8ecf0);
        background: var(--gray-100, #f1f4f6);
        .policy-code {
            max-width: 100%;
            border-radius: 4px;
            padding: 2px 8px;
            font-size: 12px;
            color: var(--gray-600, #626c78);
            background: var(--gray-200, #f1f4f6);
        }
        .policy-desc {
            width: 100%;
            display: flex;
            .policy-desc-space {
                color: var(--gray-600, #626c78);
                font-size: 14px;
                font-style: normal;
                font-weight: 400;
                display: inline-block;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .policy-desc-detail {
                flex-grow: 1;
                color: var(--gray-800, #2e3742);
                font-size: 14px;
                font-style: normal;
                font-weight: 400;
                display: inline-block;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
    }
}

.policy-generation-card-active {
    margin-top: 0px;
    background: rgba(255, 255, 255, 0.6);
    overflow: hidden;
    box-shadow: 2px 1px 0px 0px rgba(255, 255, 255, 0.6) inset;
    .policy-generation-card-title {
        border-radius: 4px;
        background: linear-gradient(90deg, rgba(213, 202, 240, 0.45) 0%, rgba(232, 228, 234, 0.08) 100%);
    }
    .AI-desc {
        color: var(--gray-900, #1b2129);
        .AI-desc-number {
            color: var(--blue-500, #246fe5);
        }
    }
    .policy-item:nth-last-child(3) {
        border: 1px solid #e1d4ff;
        background: linear-gradient(94deg, rgba(227, 215, 255, 0.2) 0%, rgba(206, 185, 255, 0.2) 50.44%);
        .policy-code {
            background: #d8def8;
        }
    }
    .policy-item:nth-last-child(2) {
        border: 1px solid #a3e6f6;
        background: linear-gradient(94deg, rgba(153, 235, 255, 0.2) 0%, rgba(153, 235, 255, 0.2) 50.44%);
        .policy-code {
            background: #ceebfa;
        }
    }
    .policy-item:nth-last-child(1) {
        border: 1px solid #f7e7c0;
        background: linear-gradient(94deg, rgba(255, 242, 194, 0.2) 0%, rgba(255, 231, 142, 0.2) 50.44%);
        .policy-code {
            background: #f1edcf;
        }
    }
    .policy-item:hover {
        cursor: pointer;
        border: 1px solid var(--blue-500, #246fe5);
        background: var(--blue-100, #d9ebff);
        box-shadow: 0px 4px 8px 0px rgba(99, 148, 230, 0.32);
        .policy-code {
            background: #c9dff4 !important;
        }
    }
}
.policy-generation-card-unactive {
    &:hover {
        cursor: pointer;
    }
}
</style>
