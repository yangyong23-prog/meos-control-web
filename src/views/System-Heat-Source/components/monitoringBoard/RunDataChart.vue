<template>
    <div ref="containerRef" class="run-data-chart" :style="{ '--custom-content-scroll-height': `${containerHeight - 54}px` }">
        <div class="run-data-chart-header">
            <m-tabs v-model="runDataTabModel" :data="tabs" size="large" @change="$emit('change')" />
            <template v-if="showSelectOptions">
                <m-select v-model="selectedEquipment" :size="160" :options="selectOptions" />
            </template>
        </div>
        <m-scrollbar class="run-data-chart-content">
            <component
                :is="activeTabData.component"
                v-if="showChartView"
                :equipment-list="equipmentList"
                :selected-equipment="selectedObj"
                :echart-datas="echartDatasList"
                :outdoor-weather="outdoorWeather"
                :run-efficiency-data="runEfficiencyData"
                :avg-cooling-storage-rate="avgCoolingStorageRate"
                :style="{ 'padding-inline': '16px' }"
            />
            <m-list-skeleton v-else-if="loading" :style="{ 'padding-inline': '16px' }" />
            <m-illustration
                v-else-if="echartDatasList.length === 0 || (showSelectOptions && !selectOptions.length)"
                :title="i18n.global.t('meos_control_web.no_content')"
                type="noContent"
                class="fcc"
                :style="{ height: '100%', position: 'absolute', top: '0', left: '0', width: '100%' }"
            ></m-illustration>
        </m-scrollbar>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { RUN_DATA_TABS } from '../../utils/monitorConfig';
import { runDataTabModelKey } from '../../hooks/useMonitoringBoard';
import { useElementSize } from '@vueuse/core';

const props = defineProps({
    tabs: {
        type: Array,
        default: () => []
    },
    height: {
        type: Number,
        default: 0
    },
    loading: {
        type: Boolean,
        default: false
    },
    echartDatas: {
        type: Array,
        default: () => []
    },
    activeTabData: {
        type: Object,
        default: () => ({})
    },
    equipmentList: {
        type: Array,
        default: () => []
    },
    runEfficiencyData: {
        type: Array,
        default: () => []
    },
    outdoorWeather: {
        type: Object,
        default: () => ({})
    }
});
const containerRef = ref();
const { height: containerHeight } = useElementSize(containerRef);
const echartDatasList = computed(() => {
    if (runDataTabModel.value === RUN_DATA_TABS().OutdoorWeather.id) {
        return [1];
    }
    return props.echartDatas.filter(item => item.show);
});
defineEmits(['change']);
const runDataTabModel = inject(runDataTabModelKey, ref(''));

const showSelectOptions = computed(() => {
    return runDataTabModel.value === 'FinalStagePumpGroup';
});
const selectedEquipment = ref();
const selectOptions = computed(() => {
    // 仅展示有实例的设备组选项
    const optionsMap = new Map();
    props.equipmentList.forEach(item => {
        if (item?.parentId && item?.parentName && item?.eqGroupExistRule) {
            if (!optionsMap.has(item.parentId)) {
                optionsMap.set(item.parentId, item.parentName);
            }
        }
    });
    const options = [...optionsMap].map(([key, value]) => ({ id: key, name: value }));
    return options;
});

const showChartView = computed(() => {
    const isOutDoorWeather = props.activeTabData.id === 'OutdoorWeather';
    const isFinalPumpGroup = props.activeTabData.id === 'FinalStagePumpGroup';
    const hasChart = echartDatasList.value.length;
    const hasOptions = selectOptions.value.length;

    if (props.loading) {
        return false;
    }

    if (isOutDoorWeather) {
        return props.outdoorWeather;
    }

    if (isFinalPumpGroup) {
        return hasOptions && hasChart;
    }

    return hasChart;
});
const selectedObj = computed(() => {
    const selectId = selectedEquipment.value;
    if (runDataTabModel.value === 'FinalStagePumpGroup' && selectId) {
        // 仅展示有实例的设备列表
        const instanceList = props.equipmentList?.filter(item => item?.parentId === selectId && item?.eqExistRule);
        return { instanceList, id: selectId };
    }
    return { instanceList: [], id: '' };
});

watch([() => selectOptions.value, () => runDataTabModel.value], ([curOptions, curTab]) => {
    if (curOptions?.length && curTab === 'FinalStagePumpGroup') {
        selectedEquipment.value = curOptions[0].id;
    } else {
        selectedEquipment.value = undefined;
    }
});
</script>
<style lang="less" scoped>
.run-data-chart {
    height: calc(100%);
    &-header {
        height: 42px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 12px;
        padding-inline: 16px;
    }
    &-content {
        height: calc(100% - 54px);
    }
}
</style>
