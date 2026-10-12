<template>
    <div class="requirement-target-container" :style="{ overflow: isLoading ? 'hidden' : 'auto' }">
        <div v-if="isLoading"></div>
        <template v-else>
            <template v-if="Object.keys(globalConfigList).length > 0 || spaceFuncTypeConfigsList?.length > 0">
                <div class="title title-view">{{ i18n.global.t('meos_control_web.demand_overview') }}</div>
                <div class="legend">
                    <div v-for="item in legendData" :key="item.name" class="legend-item">
                        <div class="legend-item-color" :style="{ backgroundColor: item.color }"></div>
                        <div class="legend-item-text">{{ item.name }}</div>
                    </div>
                </div>
                <div style="position: relative">
                    <LegendTimeLineItem :list-data="generalView" :type-show="false">
                        <div v-show="!isCurrentTimeIntersect" ref="midTimeElement">12:00</div>
                    </LegendTimeLineItem>
                    <div class="cur-time" :style="{ left: `${curTimePosition}` }">
                        <div class="cur-coordinate">
                            <div ref="curTimeElement" class="cur-coordinate-inner">{{ i18n.global.t('meos_control_web.current') }}</div>
                        </div>
                    </div>
                </div>
                <div class="title" style="margin: 12px 0 8px">
                    {{ i18n.global.t('meos_control_web.current_demand_colon')
                    }}<span class="sub-title"
                        >{{ i18n.global.t('meos_control_web.auto_demand') }}<span v-if="getTime()">({{ getTime() }})</span>
                        <span v-else>--</span>
                    </span>
                </div>
                <!-- <LegendAndTimeline /> -->
                <div v-if="type !== 'space' && spaceFuncTypeConfigsList?.length" class="title">{{ i18n.global.t('meos_control_web.global_configuration') }}</div>
                <ConfigureCard :item-data="globalConfigList" />
                <template v-if="type !== 'space' && spaceFuncTypeConfigsList?.length">
                    <div class="dividing-line">
                        <div class="text">{{ i18n.global.t('meos_control_web.below_is_space_configuration') }}</div>
                    </div>
                    <div v-for="(value, key) in spaceFuncTypeConfigsList" :key="key">
                        <div v-if="value.funcTypes.map(item => item.name).join(',')" v-ellipsis class="title">{{ value.funcTypes.map(item => item.name).join(',') }}</div>
                        <ConfigureCard :item-data="value.config" />
                    </div>
                </template>
            </template>
            <div v-else class="no-data">
                <m-illustration :title="i18n.global.t('meos_control_web.no_content')" type="noContent" />
            </div>
        </template>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import dayjs from 'dayjs';
import { getDayjsTz } from '@/utils/globalVariables';
import LegendTimeLineItem from '../../../DemandManagementHome/right-demand-config-sec/components/LegendTimeLineItem.vue';
// import LegendAndTimeline from './LegendAndTimeline.vue';
import useRequirementTarget from '../../hooks/useRequirementTarget';
import ConfigureCard from './ConfigureCard.vue';
import { templateTypeToConfigLegendMap } from '../../constants/index';
import { dayjsIsAfter, dayjsIsBefore, dayjsIsSameOrAfter } from '@/utils/dayjsTools';

const props = defineProps({
    type: {
        type: String,
        default: ''
    },
    defaultTemplateType: {
        type: String,
        default: ''
    }
});

const defaultTemplateType = computed(() => {
    return props?.defaultTemplateType;
});

const { legendData, globalConfigList, spaceFuncTypeConfigsList, finalConfigObj, templateType, isLoading } = useRequirementTarget(defaultTemplateType);

const groupArr = ref([]);
const generalView = ref([]);
const curTimePosition = computed(() => {
    // 获取当前时间
    const now = getDayjsTz();
    // 获取一天的毫秒数
    const millisecondsInDay = 24 * 60 * 60 * 1000; // 每小时60分钟，每分钟60秒，每秒1000毫秒
    // 计算当前时间在一天中的毫秒数
    const millisecondsSinceStartOfDay =
        now.hour() * 3600000 + // 小时转毫秒
        now.minute() * 60000 + // 分钟转毫秒
        now.second() * 1000 + // 秒转毫秒
        now.millisecond(); // 毫秒数

    // 计算占比
    // 43%-57% 碰撞
    const percentage = (millisecondsSinceStartOfDay / millisecondsInDay) * 100;
    return `calc(${percentage}% - 14px)`;
});

const curTimeElement = ref(null);
const midTimeElement = ref(null);

const isCurrentTimeIntersect = computed(() => {
    if (curTimeElement.value && midTimeElement.value) {
        const isIntersect = areElementsIntersecting(curTimeElement.value, midTimeElement.value);
        return isIntersect;
    }
    return false;
});

function areElementsIntersecting(element1, element2) {
    const rect1 = element1.getBoundingClientRect();
    const rect2 = element2.getBoundingClientRect();

    return !(rect1.right < rect2.left || rect1.left > rect2.right || rect1.bottom < rect2.top || rect1.top > rect2.bottom);
}

watch(
    () => finalConfigObj.value,
    () => {
        let temArr = [];
        const { globalConfig, spaceFuncTypeConfigs } = finalConfigObj.value || {};
        if (globalConfig) {
            const tempArr = [];
            Object.entries(globalConfig || {}).forEach(([key, val]) => {
                if (Array.isArray(val)) {
                    val.forEach(v => {
                        tempArr.push({ type: key, isGlobal: true, configId: 'global', ...v });
                    });
                }
            });
            temArr.push({
                isGlobal: true,
                itemData: tempArr,
                isEmpty: false,
                configId: 'global'
            });
        }
        if (spaceFuncTypeConfigs) {
            spaceFuncTypeConfigs.forEach(configItem => {
                const { funcTypes, config } = configItem || {};
                const configTitle = funcTypes?.[0]?.name;
                const configId = funcTypes?.[0]?.code;
                const tempArr = [];
                Object.entries(config || {}).forEach(([key, val]) => {
                    if (Array.isArray(val)) {
                        val.forEach(v => {
                            const curItem = { type: key, configTitle, configId, ...v };
                            tempArr.push(curItem);
                        });
                    }
                });
                tempArr.push({
                    isGlobal: false,
                    itemData: tempArr,
                    isEmpty: false,
                    configTitle,
                    configId
                });
            });
        }
        groupArr.value = temArr
            .map(item => {
                return item?.itemData;
            })
            .flat();
    },
    { immediate: true }
);
watch(
    [() => groupArr.value, () => templateType.value],
    ([curItem, curTemplate]) => {
        if (curItem?.length && curTemplate) {
            const res = curItem?.map(v => {
                const legendItem = templateTypeToConfigLegendMap[curTemplate]?.find(legendObj => legendObj?.type === v?.type) || {};
                return { ...v, ...legendItem };
            });
            generalView.value = res;
        }
    },
    { immediate: true }
);
const getTime = () => {
    const currentTime = getDayjsTz();
    const todayStr = currentTime.format('YYYY-MM-DD');
    const formatTime = timeStr => {
        if (!timeStr) return '--';
        const [hours, minutes] = timeStr.split(':');
        return `${hours}:${minutes}`;
    };

    const matchingItem = generalView.value.find(item => {
        if (!item?.beginTime?.absoluteTime || !item?.endTime?.absoluteTime) {
            return false;
        }

        if (item.acrossDay) {
            return true; // Assuming across-day items are always considered active
        }

        const startTime = dayjs(`${todayStr} ${item.beginTime.absoluteTime}`);
        const endTime = dayjs(`${todayStr} ${item.endTime.absoluteTime}`);

        // Special handling for 00:00 end time (treat as 24:00)
        if (item.endTime.absoluteTime === '00:00:00') {
            return dayjsIsSameOrAfter(currentTime, startTime);
        }

        return dayjsIsSameOrAfter(currentTime, startTime) && dayjsIsAfter(endTime, currentTime);
    });

    if (!matchingItem) return '';

    if (matchingItem.acrossDay) {
        return `${formatTime(matchingItem.beginTime.absoluteTime)}-${i18n.global.t('meos_control_web.next_day')}${formatTime(matchingItem.endTime.absoluteTime)}`;
    } else {
        return `${formatTime(matchingItem.beginTime.absoluteTime)}-${formatTime(matchingItem.endTime.absoluteTime)}`;
    }
};

onUnmounted(() => {
    curTimeElement.value = null;
    midTimeElement.value = null;
});
</script>
<style lang="less" scoped>
.requirement-target-container {
    height: 100%;
    .title {
        color: #2e3742;
        font-size: 14px;
        font-weight: 700;
        line-height: 22px;
        height: 22px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .title-view {
        position: relative;
        padding-left: 12px;
        &::before {
            position: absolute;
            content: '';
            top: 4px;
            left: 0;
            width: 3px;
            height: 14px;
            background: #246fe5;
        }
    }
    .legend {
        margin-top: 12px;
        margin-bottom: 8px;
        display: flex;
        align-items: center;
        grid-gap: 8px;
        height: 15px;
        &-item {
            display: flex;
            align-items: center;
            grid-gap: 8px;
            &-color {
                width: 14px;
                height: 14px;
            }
            &-text {
                color: #626c78;
                font-size: 12px;
            }
        }
    }
    .cur-time {
        position: absolute;
        bottom: 3px;
        .cur-coordinate {
            height: 16px;
            line-height: 16px;
            width: 28px;
            border-radius: 2px;
            background: #424c59;
            position: relative;
            &::after {
                content: '';
                position: absolute;
                top: -6px;
                left: 50%;
                transform: translateX(-50%);
                border-width: 3px;
                border-style: solid;
                border-color: transparent transparent #424c59 transparent;
            }

            .cur-coordinate-inner {
                height: 100%;
                width: 100%;
                position: relative;
                font-size: 10px;
                color: #fff;
                text-align: center;
                &::before {
                    position: absolute;
                    content: '';
                    top: -33px;
                    left: calc(50% - 0.5px);
                    width: 1px;
                    height: 28px;
                    border-left: 1px dashed #000;
                }
            }
        }
    }
    .dividing-line {
        height: 1px;
        margin: 26px 0;
        background: linear-gradient(to left, transparent 0%, transparent 50%, #c4c9cf 50%, #c4c9cf 100%);
        background-size: 10px 1px;
        background-repeat: repeat-x;
        position: relative;
        .text {
            height: 22px;
            line-height: 22px;
            color: #8b949e;
            font-size: 12px;
            background: #fff;
            text-align: center;
            position: absolute;
            top: -11px;
            left: 50%;
            transform: translateX(-50%);
            padding: 0 12px;
            white-space: nowrap;
        }
    }
    .no-data {
        height: calc(100vh - 180px);
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
.title {
    color: #2e3742;
    font-size: 14px;
    font-weight: 700;
    line-height: 22px;
    height: 22px;
    margin: 20px 0 12px 0;
    .sub-title {
        font-weight: var(--platform-font-weight);
    }
}
</style>
