<template>
    <div class="run-data-chart">
        <div class="run-data-chart-header" style="margin-bottom: 12px">
            <m-tabs v-model="runDataTabModel" :data="tabs" size="large" @change="$emit('change')" />
            <template v-if="showSelectOptions">
                <m-select v-model="selectedEquipment" :size="160" :options="selectOptions" />
            </template>
        </div>
        <div class="run-data-chart-content">
            <component
                :is="activeTabData.component"
                v-if="!loading && (echartDatasList.length || (activeTabData.id === 'OutdoorWeather' && outdoorWeatherOnehour))"
                :equipment-list="equipmentList"
                :selected-equipment="selectedObj"
                :current-operating-mode-data="currentOperatingModeData"
                :current-operating-mode-data2="currentOperatingModeData1h"
                :height="computedHeight"
                :echart-datas="echartDatasList"
                :outdoor-weather="outdoorWeather"
                :run-efficiency-data="runEfficiencyData"
                :outdoor-weather-onehour="outdoorWeatherOnehour"
                :avg-cooling-storage-rate="avgCoolingStorageRate"
            />
            <m-list-skeleton v-else-if="loading" style="margin-top: 20px" />
            <m-illustration
                v-else-if="echartDatasList.length === 0"
                :title="i18n.global.t('meos_control_web.no_content')"
                type="noContent"
                class="fcc"
                :style="{ 'min-height': computedHeight - 50 + 'px' }"
            ></m-illustration>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { RUN_DATA_TABS } from '../../hooks/config';
import { runDataTabModelKey } from '../../hooks/useMonitoringBoard';

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
    currentOperatingModeData: {
        type: Object,
        default: () => ({})
    },
    currentOperatingModeData1h: {
        type: Object,
        default: () => ({})
    },
    outdoorWeather: {
        type: Object,
        default: () => ({})
    },
    outdoorWeatherOnehour: {
        type: Object,
        default: () => ({})
    },
    avgCoolingStorageRate: {
        type: Object,
        default: () => ({})
    }
});
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

const computedHeight = computed(() => {
    if (echartDatasList.value.length >= 3) {
        if (props.height / 2 > 300) {
            return props.height / 2;
        } else {
            return 300;
        }
    } else {
        if (props.height > 300) {
            return props.height;
        } else {
            return 300;
        }
    }
});
</script>
<style lang="less" scoped>
.run-data-chart {
    height: calc(100% - 192px);
    &-header {
        height: 42px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    &-content {
        height: calc(100% - 42px);
    }
}
@media screen and (max-width: 1700px) {
    .run-data-chart {
        height: calc(100% - 135px);
    }
}
</style>
