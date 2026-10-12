<template>
    <div ref="monitoringBoardRef" class="monitoring-board wh100" :style="{ zIndex: zIndex }">
        <div class="monitoring-board-header fcb">
            <div class="fs20 fw600 fc" style="gap: 4px">
                <MonitoringIcon />
                <span>{{ i18n.global.t('meos_control_web.operation_monitoring_dashboard') }}</span>
                <span>-</span>
                <span style="color: var(--blue-500)">{{ currentSystem.localName }}</span>
            </div>
            <div class="monitoring-board-header-close fcc" @click="$emit('close')">
                <IconMeriComponentClose size="24" />
            </div>
        </div>
        <div class="monitoring-board-main">
            <template v-if="!loading">
                <RunDataChart
                    :tabs="runDataTabs"
                    :loading="loadingRunDataTab"
                    :equipment-list="equipmentList"
                    :run-efficiency-data="runEfficiencyData"
                    :echart-datas="echartDatas"
                    :active-tab-data="activeTabData"
                    :outdoor-weather="outdoorWeather"
                />
            </template>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { useZIndex } from 'meri-plus';
import { IconMeriComponentClose } from 'meri-icon';
import { currentSystemKey } from '../../hooks/useBaseHook';
import MonitoringIcon from '@/assets/svg/ACAC/monitoring.svg';
import { useMonitoringBoard } from '../../hooks/useMonitoringBoard';
import RunDataChart from './RunDataChart.vue';
import {
    ABSORPTION_CHILLER_CLASSCODE,
    AIR_SOURCE_HEAT_PUMP_CONTROL_CLASSCODE,
    BOILER_CLASSCODE,
    GROUND_SOURCE_HEAT_PUMP_CLASSCODE,
    WATER_SOURCE_HEAT_PUMP_CLASSCODE
} from '../../constant/variable';
import { tagObjList } from '@/apis/ACAH';
import BdtpSingleton from '@/hooks/responsiveBdtpInfo';
import { OBJ_TYPE } from '@/utils/globalVariables';

const { setBdtpInfoData } = BdtpSingleton.getInstance();
tagObjList({
    classCodes: [
        ...BOILER_CLASSCODE,
        ...ABSORPTION_CHILLER_CLASSCODE,
        ...AIR_SOURCE_HEAT_PUMP_CONTROL_CLASSCODE,
        ...WATER_SOURCE_HEAT_PUMP_CLASSCODE,
        ...GROUND_SOURCE_HEAT_PUMP_CLASSCODE
    ],
    tagNames: [
        //标签分类名称
        'equipCriticalLevel'
    ],
    objTypes: [OBJ_TYPE.EQUIPMENT, OBJ_TYPE.EQUIPGROUP]
}).then(res => {
    if (res && res.data) {
        res.data.forEach(element => {
            setBdtpInfoData(element.classCode, 'equipCriticalLevel', element);
        });
    }
});
defineEmits(['close']);
const currentSystem = inject(currentSystemKey);
const zIndex = computed(() => useZIndex().nextZIndex());
const monitoringBoardRef = ref(null);
const { runDataTabs, loadingRunDataTab, runEfficiencyData, echartDatas, activeTabData, loading, equipmentList, outdoorWeather } = useMonitoringBoard();
</script>
<style lang="less" scoped>
.monitoring-board {
    position: absolute;
    top: 0;
    overflow: hidden;
    left: 0;
    background: url('@/assets/imgs/page_bg.png');
    background-color: rgb(235 246 255);
    background-size: cover;
    background-repeat: no-repeat;
    padding-bottom: 16px;
    &-header {
        height: 44px;
        padding: 8px 24px 0 24px;
        &-close {
            border-radius: 4px;
            cursor: pointer;
            height: 32px;
            width: 32px;
            &:hover {
                background-color: var(--alpha-30);
            }
        }
    }
    &-main {
        height: calc(100% - 44px);
        padding: 8px 0px 0px 0px;
        overflow: auto;
        :deep(.m-scrollbar__bar.is-horizontal) {
            display: none !important;
        }
    }
}
</style>
