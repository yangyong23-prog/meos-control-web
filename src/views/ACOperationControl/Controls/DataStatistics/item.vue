<template>
    <div class="data-analysis-item mb16">
        <div class="fc">
            <span class="mark-icon">
                <component :is="iconObj[data.classCode]"></component>
            </span>
            <div class="ml12">
                <div class="f18 fb7">{{ data.classCodeName }}</div>
                <div class="f14 ft">
                    {{ i18n.global.t('common.total_count') }}:<span class="fmp">{{ data?.equipmentTotal || '0' }}</span>
                </div>
            </div>
        </div>
        <div class="fc mt23 flex-gap">
            <div class="flex-item">
                <div class="f14 ft">{{ i18n.global.t('common.status_open') }}</div>
                <div class="fmp f18 fb7 mt4">{{ data.openTotal || '0' }}</div>
                <div class="legend-bar mt4">
                    <div
                        class="bar-item"
                        :style="{
                            backgroundColor: '#09B3B5',
                            width: data.openTotal !== 0 ? ((data.openTotal / data.equipmentTotal) * 100).toFixed(1) + '%' : 0 + '%'
                        }"
                    ></div>
                </div>
            </div>
            <div class="flex-item">
                <div class="f14 ft">{{ i18n.global.t('common.status_close') }}</div>
                <div class="fmp f18 fb7 mt4">{{ data.closeTotal || '0' }}</div>
                <div class="legend-bar mt4">
                    <div
                        class="bar-item"
                        :style="{
                            backgroundColor: '#626C78',
                            width: data.closeTotal !== 0 ? ((data.closeTotal / data.equipmentTotal) * 100).toFixed(1) + '%' : 0 + '%'
                        }"
                    ></div>
                </div>
            </div>
            <div class="flex-item">
                <div class="f14 ft">{{ i18n.global.t('meos_control_web.no_data1') }}</div>
                <div class="fmp f18 fb7 mt4">{{ data.noDataTotal || '0' }}</div>
                <div class="legend-bar mt4">
                    <div
                        class="bar-item"
                        :style="{
                            backgroundColor: '#C4C9CF',
                            width: data.noDataTotal !== 0 ? ((data.noDataTotal / data.equipmentTotal) * 100).toFixed(1) + '%' : 0 + '%'
                        }"
                    ></div>
                </div>
            </div>
        </div>
        <div class="statistics-buttom mt16 gp16 fw">
            <div class="statistics">
                <span class="f14 ft">{{ i18n.global.t('meos_control_web.offline') }}:</span>
                <span class="fmp f14 fb6">{{ data?.offlineTotal || '0' }}</span>
            </div>
            <div v-ellipsis class="statistics m-ellipsis mw">
                <span class="f14 ft popver-name">{{ i18n.global.t('meos_control_web.control_feedback_mismatch') }}:</span>
                <span class="fmp f14 fb6">{{ data?.orderFailAlarmTotal || '0' }}</span>
            </div>
            <div class="statistics">
                <span class="f14 ft">{{ i18n.global.t('meos_control_web.abnormal') }}:</span>
                <span class="fmp f14 fb6">{{ data?.exceptionTotal ? data?.exceptionTotal : '0' }}</span>
            </div>
            <div class="statistics">
                <span class="f14 ft">{{ i18n.global.t('meos_control_web.local') }}:</span>
                <span class="fmp f14 fb6">{{ data?.localityTotal || '0' }}</span>
            </div>
            <div class="statistics mw">
                <span class="f14 ft">{{ i18n.global.t('meos_control_web.manual') }}:</span>
                <span class="fmp f14 fb6">{{ data?.manualTotal || '0' }}</span>
            </div>
            <div class="statistics">
                <span class="f14 ft">{{ i18n.global.t('meos_control_web.auto') }}:</span>
                <span class="fmp f14 fb6">{{ data?.autoTotal || '0' }}</span>
            </div>
        </div>
    </div>
</template>
<script setup>
import FanCoil from '@/assets/svg/FanCoil.svg';
import i18n from '@/localization';
import AirConditioningUnit from '@/assets/svg/AirConditioningUnit.svg';
import FreshAirUnit from '@/assets/svg/FreshAirUnit.svg';
import AirScrubber from '@/assets/svg/AirScrubber.svg';
import WaterCoolerMachine from '@/assets/svg/WaterCoolerMachine.svg';
import FloorAirConditioner from '@/assets/svg/FloorAirConditioner.svg';
import indoorUnit from '@/assets/svg/indoorUnit.svg';
import AirCurtainMachine from '@/assets/svg/AirCurtainMachine.svg';
import VariableAirVolumeBox from '@/assets/svg/variableAirVolumeBox.svg';
import VentilationFan from '@/assets/svg/ventilationFan.svg';
import VentilationFanUnion from '@/assets/svg/ventilationFanUnion.svg';
import SmokeVentWindow from '@/assets/svg/smokeVentWindow.svg';

const iconObj = {
    ACATFC: FanCoil,
    ACATAH: AirConditioningUnit,
    ACATFU: FreshAirUnit,
    ACATRA: AirScrubber,
    ACCCWP: WaterCoolerMachine,
    ACATFA: FloorAirConditioner,
    ACVRVI: indoorUnit,
    ACVTAC: AirCurtainMachine,
    ACATVA: VariableAirVolumeBox, //变风量箱
    ACVTSF: VentilationFan, // 通风风机
    FFSCAF: VentilationFanUnion,
    FFSCMF: VentilationFanUnion,
    CFCSEW: SmokeVentWindow // 排烟窗
};

defineProps({
    data: {
        type: Object,
        default: () => {}
    }
});
</script>
<style lang="less" scoped>
.data-analysis {
    &-item {
        border-radius: 4px;
        border: 1px solid var(--gray-200, #e8ecf0);
        padding: 12px;
    }
    .left-icon {
        border-radius: 8px;
        background: var(--turquoise-50, #e6fcf7);
        padding: 9px;
    }
    .legend-bar {
        height: 5px;
        background: #e8ecf0;
        .bar-item {
            height: 100%;
            // border-radius: 2px;
        }
    }
    .flex-gap {
        gap: 16px;
    }
    .statistics-buttom {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        .statistics {
            border-radius: 4px;
            background: var(--gray-50, #f7f9fa);
            padding: 4px;
        }
    }
}
.mark-icon {
    display: inline-block;
    width: 44px;
    height: 44px;
}
.m-flexible-overlay {
    .popver-name {
        color: white;
    }
}
@media (max-width: 1800px) {
    .flex-item:nth-of-type(2) {
        width: 125px;
    }
    .flex-item:not(:nth-child(2)) {
        width: 26%;
    }
    .mw {
        width: 125px;
    }
}
@media (min-width: 1800px) {
    .flex-item {
        width: 33%;
    }
}
</style>
