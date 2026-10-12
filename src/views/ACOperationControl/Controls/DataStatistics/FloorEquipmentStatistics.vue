<template>
    <div ref="containerRef" class="floor-equipment-statistics-container">
        <div class="header">
            <span class="mark-icon">
                <component :is="ventilateIconArr[props.index]"></component>
            </span>
            <div class="name-box">
                <div class="name-title">{{ props?.name }}</div>
                <div class="name-total">
                    {{ i18n.global.t('common.total_count') }}:<span class="fmp">{{ computedData?.total || '0' }}</span>
                </div>
            </div>
        </div>
        <div class="center" :style="{ columnGap: width > 400 ? '16px' : '8px' }">
            <template v-for="(item, idx) in legendItems" :key="idx">
                <div v-if="!isLegendHide(item)" class="flex-item">
                    <div class="legend-name">{{ item.name }}</div>
                    <div class="legend-count fmp">{{ legendVal(item) }}</div>
                    <div class="legend-bar">
                        <div
                            class="bar-item"
                            :style="{
                                backgroundColor: item.color,
                                width: legendWidth(item)
                            }"
                        ></div>
                    </div>
                </div>
            </template>
        </div>
        <div class="bottom" :style="{ columnGap: width > 400 ? '16px' : '8px' }">
            <div v-for="(item, itemIndex) in statusMapArr" :key="itemIndex" :class="['statistics', item.isCenter && (width < 400 || width === 400) ? 'is-center' : '']">
                <span class="statistics-label">{{ `${item.name}:` }}</span>
                <span v-ellipsis class="statistics-value fmp m-ellipsis">{{ item.getValue(computedData) }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useQiankunElementSize } from '@/hooks/useQiankunElementSize';
import ventilateExhaustFan from '@/assets/svg/ventilate-ExhaustFan.svg';
import ventilateSupplyFan from '@/assets/svg/ventilate-SupplyFan.svg';
import i18n from '@/localization';

const props = defineProps({
    data: {
        type: Object,
        default: () => {}
    },
    name: {
        type: String,
        default: () => ''
    },
    index: {
        type: Number,
        default: () => 0
    }
});

const containerRef = ref();
const { width } = useQiankunElementSize(containerRef);

const computedData = computed(() => {
    return props?.data;
});

const ventilateIconArr = ref([ventilateExhaustFan, ventilateSupplyFan]);

const legendItems = [
    {
        name: i18n.global.t('meos_control_web.on'),
        color: '#09B3B5',
        valKey: 'on'
    },
    {
        name: i18n.global.t('meos_control_web.off'),
        color: '#626C78',
        valKey: 'off'
    },
    {
        name: i18n.global.t('meos_control_web.no_data1'),
        color: '#C4C9CF',
        valKey: 'unknown'
    }
];

const legendWidth = computed(() => item => {
    const legendValue = legendVal?.value(item);
    const total = computedData?.value?.total;
    return legendValue !== 0 ? ((legendValue / total) * 100).toFixed(1) + '%' : '0%';
});

const legendVal = computed(() => item => {
    const runStatus = computedData?.value?.runStatus;
    return runStatus?.[item.valKey] ?? 0;
});

const isLegendHide = computed(() => item => {
    const runStatus = computedData?.value?.runStatus;
    return runStatus?.[item.valKey]?.toString() ? false : true;
});

const statusMapArr = [
    {
        name: i18n.global.t('meos_control_web.offline'),
        code: 'offline',
        getValue: detail => {
            return detail?.alarmControl?.offLine ?? '0';
        }
    },
    {
        name: i18n.global.t('meos_control_web.control_feedback_mismatch'),
        code: 'orderFail',
        isCenter: true,
        getValue: detail => {
            return detail?.alarmControl?.orderFailAlarm ?? '0';
        }
    },
    {
        name: i18n.global.t('meos_control_web.abnormal'),
        code: 'abnormal',
        getValue: detail => {
            return detail?.abnormalCount ?? '0';
        }
    },
    {
        name: i18n.global.t('meos_control_web.local'),
        code: 'local',
        getValue: detail => {
            return detail?.alarmControl?.localStatus ?? '0';
        }
    },
    {
        name: i18n.global.t('meos_control_web.manual'),
        code: 'manual',
        isCenter: true,
        getValue: detail => {
            return detail?.alarmControl?.manualStatus ?? '0';
        }
    },
    {
        name: i18n.global.t('meos_control_web.auto'),
        code: 'auto',
        getValue: detail => {
            return detail?.alarmControl?.autoStatus ?? '0';
        }
    }
];
</script>

<style lang="less" scoped>
.floor-equipment-statistics-container {
    display: flex;
    flex-direction: column;
    padding: 12px;
    row-gap: 16px;

    border-radius: 4px;
    border: 1px solid @grey-200;

    margin: 300px;
    max-width: 400px;

    .header {
        display: flex;
        align-items: center;
        column-gap: 12px;
    }

    .center {
        display: flex;
        align-items: center;
        justify-content: space-between;
        column-gap: 16px;
    }
}

.mark-icon {
    display: inline-block;
    width: 44px;
    height: 44px;
}

.name-box {
    display: flex;
    flex-direction: column;
    row-gap: 4px;

    .name-title {
        color: @grey-800;
        font-size: 18px;
        font-weight: 700;
        line-height: 24px;
    }

    .name-total {
        color: @grey-600;
        font-size: 14px;
        font-weight: var(--platform-font-weight);
        line-height: 22px;
    }
}

.flex-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    row-gap: 4px;
}

.legend-name {
    color: @grey-600;
    font-size: 14px;
    font-weight: var(--platform-font-weight);
    line-height: normal;
}

.legend-count {
    color: #000;
    font-size: 18px;
    font-weight: 700;
    line-height: normal;
}

.legend-bar {
    height: 5px;
    background: #e8ecf0;
    .bar-item {
        height: 100%;
    }
}

.bottom {
    display: grid;
    row-gap: 12px;

    flex-wrap: wrap;
    grid-template-columns: repeat(3, 1fr);
}

.statistics {
    padding: 4px;
    display: flex;
    align-items: center;
    column-gap: 4px;

    border-radius: 4px;
    background: #f7f9fa;
}

.statistics.is-center {
    width: 125px;
}

.statistics-label {
    color: @grey-600;
    font-size: 14px;
    font-weight: var(--platform-font-weight);
    line-height: 24px;
    min-width: fit-content;
}

.statistics-value {
    color: #000;
    font-size: 14px;
    font-weight: 600;
    line-height: 24px;
}
</style>
