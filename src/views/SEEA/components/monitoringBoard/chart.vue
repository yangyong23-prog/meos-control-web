<template>
    <div class="chart-box wh100">
        <div class="chart-box-title">
            <span class="fw600 fs16">{{ getSysInfoName() }}</span>
            <span v-if="dataIsNone" class="accumdata cp nodata">
                <span v-if="item.infoCode.groupCode !== anualGroupCode" class="val">{{ getSysInfoValue() }}</span>
                <span v-if="item.infoCode.groupCode !== anualGroupCode" class="unit">{{ item.unit }}</span>
            </span>
            <m-popover v-else :enterable="false" theme="darkTransparent" :show-arrow="false">
                <template #content>
                    <p style="font-size: 14px">
                        {{ i18n.global.t('meos_control_web.data_update_time_colon')
                        }}{{ cumulativeEnergyUpdateTime?.[item.infoCode.groupCode] ? cumulativeEnergyUpdateTime[item.infoCode.groupCode] : '--' }}
                    </p>
                    <p style="color: #c4c9cf; font-size: 12px">{{ i18n.global.t('meos_control_web.click_analysis_jump') }}</p>
                </template>
                <span class="accumdata cp" @click="itemInfo(item)">{{ getSysInfoValue() }}{{ item.unit }}</span>
            </m-popover>
        </div>
        <div class="chart-box-chart">
            <Empty v-if="item.empty" :text="i18n.global.t('meos_control_web.no_content')" width="90px" height="76px" />
            <EchartsPieAndLineBox
                v-else
                ref="echartsRefs"
                :need-min="false"
                :custom-x-axis-data="customXAxisData"
                :data="[...handleChartData(item)]"
                :tooltip="getTooltip(item)"
                :custom-title-style-fun="customTitleStyleFun"
                :custom-item-style-fun="customItemStyleFun"
            />
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { systemIdKey } from '@/views/SEEA/hooks/useBaseHook';
import Empty from '@/components/common/Empty.vue';
import { cumulativeEnergyUpdateTimeKey } from '../../hooks/useBaseHook';
import EchartsPieAndLineBox from '@/components/echarts/EchartsPieAndLineBox.vue';
import DockSingleton from '@/hooks/responsiveDock';
import { jumpToAnalysis } from '@/utils/envUtils';
import { computed } from 'vue';
import { anualGroupCode } from '../../constants';
const { getCustomInfo } = DockSingleton.getInstance();
const props = defineProps({
    item: {
        type: Object,
        default: () => {}
    },
    height: {
        type: Number,
        default: 0
    },
    sysInfoCodes: {
        type: Array,
        default: () => []
    }
});
const cumulativeEnergyUpdateTime = inject(cumulativeEnergyUpdateTimeKey);
const customTitleStyleFun = data => {
    return `<div style="display: flex; flex-direction: column; gap: 8px;">
      <div>${data.label || '--'}</div>
    </div>`;
};
const systemId = inject(systemIdKey);
const getSysInfoValue = () => {
    const info = props.sysInfoCodes?.find(info => info.groupCode === props.item?.infoCode?.groupCode);
    return info?.dataValue || '--';
};
const getSysInfoName = () => {
    const info = props.sysInfoCodes?.find(info => info.groupCode === props.item?.infoCode?.groupCode);
    return info?.aliasName || info?.groupName || '';
};
const customItemStyleFun = item => {
    const icon = {
        solid: `<span class="echarts-tooltip-icon" style="background-color: ${props.item.chartData.lineStyle.color}"></span>`,
        rect: `<span class="echarts-tooltip-icon" style="width: 16px; height: 16px; border-radius:4px; background-color: ${props.item.chartData.lineStyle.color}"></span>`,
        dashed: `<span class="echarts-tooltip-icon" style="background: repeating-linear-gradient(90deg, ${props.item.chartData.lineStyle.color}, ${props.item.chartData.lineStyle.color} 2px, var(--gray-0) 2px, var(--gray-0) 4px);"></span>`
    };
    return `
    ${icon[props.item.chartData.lineStyle.type]}
    <span class="echarts-tooltip-name">${item.data[item.data.key]}：</span>
    <span class="echarts-tooltip-value">${item.data.value === null ? '--' : item.data.value}${item.data.unit}</span>
  `;
};
const getTooltip = item => {
    if (item.infoCode?.axisPointer) {
        return {
            axisPointer: item.infoCode?.axisPointer
        };
    }
    return {};
};
const customXAxisData = () => {
    return {
        axisLabel: {
            show: true,
            color: '#626C78',
            formatter: (value, index) => {
                return value;
            }
        }
    };
};
const dataIsNone = computed(() => {
    const info = props.sysInfoCodes?.find(info => info.groupCode === props.item?.infoCode?.groupCode);
    if (info?.dataValue) {
        return false;
    }
    return true;
});
const itemInfo = item => {
    const info = props.sysInfoCodes?.find(info => info.groupCode === props.item?.infoCode?.groupCode);
    if (!info) {
        return;
    }
    const jumpParams = {
        infoCode: 'accddailyCumulativeEnergy',
        id: systemId.value
    };
    jumpToAnalysis(jumpParams);
};
const handleChartData = data => {
    return [data.chartData];
};
</script>
<style lang="less" scoped>
.chart-box {
    padding: 8px 16px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.7);
    &-title {
        height: 32px;
        margin-bottom: 4px;
        display: flex;
        align-items: center;
        .accumdata {
            cursor: pointer;
            color: var(--blue-500, #246fe5);
            font-size: 16px;
            font-style: normal;
            font-weight: 700;
            line-height: 22px; /* 137.5% */
            margin-left: 12px;
            &.nodata {
                cursor: auto;
                .val {
                    color: var(--gray-900, #1b2129);
                }
                .unit {
                    color: var(--gray-600, #626c78);
                }
            }
        }
    }
    &-chart {
        height: calc(100% - 36px);
        padding: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
</style>
