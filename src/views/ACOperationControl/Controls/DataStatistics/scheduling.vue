<template>
    <div v-if="legendData && legendData.length" class="scheduling-container">
        <div class="legend">
            <div v-for="(item, index) in legendData" :key="index + 'l'" class="legend-item">
                <span class="legend-bg" :style="{ backgroundColor: item.color }"></span>
                <span class="legend-name">{{ item.value }}</span>
                <span v-if="item.num === 0 && item.count === 0">--</span>
                <span v-else>{{ i18n.global.t('meos_control_web.certain_number', { count: item.num }) }}({{ ((item.num / item.count) * 100).toFixed(1) }}%)</span>
            </div>
        </div>
        <div class="legend-bar">
            <div
                v-for="(item, index) in legendData"
                :key="index + 'b'"
                class="bar-item"
                :style="{
                    backgroundColor: item.color,
                    borderRadius: item.radius,
                    width: item.count !== 0 ? ((item.num / item.count) * 100).toFixed(1) + '%' : 0 + '%'
                }"
            ></div>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { ENV_ATTR_KEYS } from '../../constants/constant';
const props = defineProps(['curTab']);
const qualityStatisticsList = inject('qualityStatisticsList');
const legendData = ref([]);

watch(
    () => [props?.curTab, qualityStatisticsList?.value],
    () => {
        if (props.curTab === ENV_ATTR_KEYS.TEMPERATURE) {
            legendData.value = qualityStatisticsList?.value?.schedulingTemperatureStatistics?.types;
        } else {
            legendData.value = qualityStatisticsList?.value?.schedulingCarbonDioxideStatistics?.types;
        }
        if (legendData.value?.length) {
            // 计算不为0的对象数量
            let nonZeroCount = legendData.value.filter(obj => obj.num !== 0).length;
            if (nonZeroCount > 1) {
                let firstNonZero = legendData.value.filter(obj => obj.num !== 0)[0],
                    lastNonZero = legendData.value.filter(obj => obj.num !== 0).slice(-1)[0];
                legendData.value.forEach(item => {
                    if (item.key === firstNonZero.key) {
                        item.radius = '4px 0 0 4px';
                    } else if (item.key === lastNonZero.key) {
                        item.radius = '0 4px 4px 0';
                    }
                });
            }
        }
    },
    {
        immediate: true
    }
);
</script>

<style lang="less" scoped>
.scheduling-container {
    padding: 12px 8px 8px;
    .legend {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        margin-bottom: 8px;
        &-item {
            color: var(--gray-900, #1b2129);
            font-size: 12px;
            font-weight: var(--platform-font-weight);
            line-height: 18px;
            display: flex;
            align-items: center;
            margin-right: 4px;
            margin-bottom: 4px;
            .legend-bg {
                display: flex;
                align-items: center;
                width: 14px;
                height: 14px;
                border-radius: 2px;
            }
            .legend-name {
                color: var(--gray-600, #626c78);
                margin: 0 4px;
            }
            &:last-of-type {
                margin-right: 0;
            }
        }
    }
    .legend-bar {
        height: 8px;
        border-radius: 4px;
        display: flex;
        background: var(--gray-200, #e8ecf0);
        .bar-item {
            height: 100%;
            border-radius: 4px;
        }
    }
}
</style>
