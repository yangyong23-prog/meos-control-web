<template>
    <div class="space-total">
        <div class="iot-and-legend fcb">
            <div class="iot fcc">
                <m-checkbox v-model="value" @change="change">{{ i18n.global.t('meos_control_web.show_only_iot_monitored_spaces') }}</m-checkbox>
            </div>
            <div class="legend fcc">
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
import { curSelectedTimeKey, changeIotSpaceKey, spaceTypeKey, spaceTimeStatisticsKey } from '../../injectionKey';
import { AIR_SPACE_STATUS, AIR_SPACE_STATUS_CO2, AIR_SPACE_STATUS_TDB, TEMPERATURE } from '../../variable';
defineProps({
    show: {
        type: Boolean,
        default: false
    }
});
const curSelectedTime = inject(curSelectedTimeKey); // ==> src\views\runAnalysis\hooks\useSpaceAnalysis.js
const changeIotSpace = inject(changeIotSpaceKey); // ==> src\views\runAnalysis\hooks\useSpaceAnalysis.js
const spaceType = inject(spaceTypeKey); // ==> src\views\runAnalysis\hooks\useSpaceAnalysis.js
const spaceTimeStatistics = inject(spaceTimeStatisticsKey); // ==> src\views\runAnalysis\hooks\useSpaceAnalysis.js

const value = ref('checked');
const legendList = computed(() => {
    return spaceType.value === TEMPERATURE
        ? [
              AIR_SPACE_STATUS_TDB[AIR_SPACE_STATUS.TOO_COLD],
              AIR_SPACE_STATUS_TDB[AIR_SPACE_STATUS.COLD],
              AIR_SPACE_STATUS_TDB[AIR_SPACE_STATUS.APPROPRIATE],
              AIR_SPACE_STATUS_TDB[AIR_SPACE_STATUS.HOT],
              AIR_SPACE_STATUS_TDB[AIR_SPACE_STATUS.TOO_HOT]
          ]
        : [AIR_SPACE_STATUS_CO2[AIR_SPACE_STATUS.APPROPRIATE], AIR_SPACE_STATUS_CO2[AIR_SPACE_STATUS.HIGH], AIR_SPACE_STATUS_CO2[AIR_SPACE_STATUS.TOO_HIGH]];
});

const stateTotal = computed(() => {
    const obj = spaceType.value === TEMPERATURE ? AIR_SPACE_STATUS_TDB : AIR_SPACE_STATUS_CO2;
    const arr = [];
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const element = spaceTimeStatistics.value[key];
            arr.push({ name: obj[key].name, value: element ?? 0, color: obj[key].textColor });
        }
    }
    return arr;
});
const change = data => {
    changeIotSpace(data === 'checked');
};
</script>
<style lang="less" scoped>
.space-total {
    margin-bottom: 32px;
    padding: 0 20px;
    .iot-and-legend {
        padding: 8px 0;
        height: 38px;
        .legend {
            gap: 16px;
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
