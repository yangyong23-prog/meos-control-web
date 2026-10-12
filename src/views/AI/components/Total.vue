<template>
    <div class="space-total">
        <div class="iot-and-legend fcb">
            <div class="iot-left" :style="{ width: `calc(100% - ${legendWidth}px)` }">
                <slot name="left" :width="legendWidth"></slot>
            </div>
            <div ref="legendRef" class="legend fcc">
                <div v-for="item in legendList" :key="item.name" class="legend-item fcc">
                    <div class="legend-item-color" :style="{ background: item.color }"></div>
                    <div>{{ item.name }}</div>
                </div>
            </div>
        </div>
        <div v-if="show" class="total-box fc">
            <sapn class="fw600">{{ curSelectedTime }}</sapn>
            <span class="total-box-item">
                <template v-for="item in stateTotal" :key="item.name">
                    <span style="color: var(--gray-600)">{{ item.name }}{{ i18n.global.t('common.space') }}</span>
                    <span class="fw600 ffCP" :style="{ color: item.color, marginRight: '16px' }">&nbsp;{{ item.value }}</span>
                </template>
            </span>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { AIR_SPACE_STATUS, AIR_SPACE_STATUS_CO2, AIR_SPACE_STATUS_TDB, AIR_SPACE_STATUS_HUMIDITY, TEMPERATURE, CO2, HUMIDITY } from '../variable';
import { onBeforeUnmount, onMounted, ref } from 'vue';
const props = defineProps({
    show: {
        type: Boolean,
        default: false
    },
    curSelectedTime: {
        type: String,
        default: ''
    },
    spaceType: {
        type: String,
        default: TEMPERATURE
    },
    spaceTimeStatistics: {
        type: Object,
        default: () => ({})
    }
});

const legendList = computed(() => {
    const res =
        props.spaceType === TEMPERATURE
            ? [
                  AIR_SPACE_STATUS_TDB[AIR_SPACE_STATUS.TOO_COLD],
                  AIR_SPACE_STATUS_TDB[AIR_SPACE_STATUS.COLD],
                  AIR_SPACE_STATUS_TDB[AIR_SPACE_STATUS.NORMAL],
                  AIR_SPACE_STATUS_TDB[AIR_SPACE_STATUS.HOT],
                  AIR_SPACE_STATUS_TDB[AIR_SPACE_STATUS.TOO_HOT]
              ]
            : props.spaceType === CO2
            ? [AIR_SPACE_STATUS_CO2[AIR_SPACE_STATUS.NORMAL], AIR_SPACE_STATUS_CO2[AIR_SPACE_STATUS.HIGH], AIR_SPACE_STATUS_CO2[AIR_SPACE_STATUS.TOO_HIGH]]
            : props.spaceType === HUMIDITY
            ? [
                  AIR_SPACE_STATUS_HUMIDITY[AIR_SPACE_STATUS.TOO_DRY],
                  AIR_SPACE_STATUS_HUMIDITY[AIR_SPACE_STATUS.DRY],
                  AIR_SPACE_STATUS_HUMIDITY[AIR_SPACE_STATUS.NORMAL],
                  AIR_SPACE_STATUS_HUMIDITY[AIR_SPACE_STATUS.WET],
                  AIR_SPACE_STATUS_HUMIDITY[AIR_SPACE_STATUS.TOO_WET]
              ]
            : [];
    return res;
});
const stateTotal = computed(() => {
    const obj =
        props.spaceType === TEMPERATURE ? AIR_SPACE_STATUS_TDB : props.spaceType === CO2 ? AIR_SPACE_STATUS_CO2 : props.spaceType === HUMIDITY ? AIR_SPACE_STATUS_HUMIDITY : {};
    const arr = [];
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const element = props.spaceTimeStatistics[key];
            arr.push({ name: obj[key].name, value: element ?? 0, color: obj[key].textColor });
        }
    }
    return arr;
});

const legendRef = ref(null);
const legendWidth = ref(0);
let legendResizeObserver;

const updateLegendWidth = () => {
    if (!legendRef.value) {
        legendWidth.value = 0;
        return;
    }
    legendWidth.value = Math.ceil(legendRef.value.getBoundingClientRect().width || 0);
};

onMounted(() => {
    updateLegendWidth();
    if (typeof ResizeObserver === 'undefined') {
        return;
    }
    legendResizeObserver = new ResizeObserver(() => {
        updateLegendWidth();
    });
    legendResizeObserver.observe(legendRef.value);
});

onBeforeUnmount(() => {
    if (legendResizeObserver) {
        legendResizeObserver.disconnect();
    }
});
</script>
<style lang="less" scoped>
.space-total {
    margin-bottom: 28px;
    padding: 0 20px;
    .iot-and-legend {
        padding: 8px 0;
        padding-top: 16px;
        align-items: center;
        width: 100%;
        min-width: 0;
        gap: 16px;

        .iot-left {
            min-width: 0;
            overflow: hidden;
        }

        .legend {
            gap: 16px;
            flex: 0 0 auto;
            white-space: nowrap;
            &-item-color {
                width: 12px;
                height: 12px;
                border-radius: 2px;
                margin-right: 5px;
            }
        }
    }
    .total-box {
        padding: 8px 12px;
        height: 38px;
        border-radius: 4px;
        background-color: var(--blue-50);
        gap: 16px;
        line-height: 22px;
    }
}
</style>
