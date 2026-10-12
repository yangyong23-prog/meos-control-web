<template>
    <div ref="contentElementRef" :class="['acequip-card-content', sideLayout ? 'acequip-side-layout' : '']">
        <div class="aceuip-card-top">
            <span v-if="width > 328" class="mark-icon">
                <component :is="iconObj[item.classCode]"></component>
            </span>
            <div class="card-data">
                <div class="card-data-val">{{ item?.equipmentTotal || 0 }}</div>
                <div v-ellipsis="{ y: true }" class="card-data-label m-ellipsis">{{ item.classCodeName }}</div>
            </div>
            <div class="card-data-hr"></div>
            <div class="card-data-status">
                <div class="card-data">
                    <div class="card-data-val">{{ item?.openTotal || 0 }}</div>
                    <div class="card-data-label">{{ i18n.global.t('meos_control_web.on') }}</div>
                </div>
                <div class="card-data">
                    <div class="card-data-val">{{ item?.closeTotal || 0 }}</div>
                    <div class="card-data-label">{{ i18n.global.t('meos_control_web.off') }}</div>
                </div>
                <div class="card-data">
                    <div class="card-data-val">{{ item?.noDataTotal || 0 }}</div>
                    <div class="card-data-label">{{ i18n.global.t('meos_control_web.no_data1') }}</div>
                </div>
            </div>
        </div>
        <div :class="['aceuip-card-bottom', width <= 268 ? 'small-screen' : 'big-screen']">
            <div class="card-data">
                <div class="card-label">{{ i18n.global.t('meos_control_web.abnormal_colon') }}</div>
                <div class="card-val">{{ item?.exceptionTotal ? item?.exceptionTotal : '0' }}</div>
            </div>
            <div class="card-data">
                <div class="card-label">{{ i18n.global.t('meos_control_web.local_colon') }}</div>
                <div class="card-val">{{ item?.localityTotal || '0' }}</div>
            </div>
            <div class="card-data">
                <div class="card-label">{{ i18n.global.t('meos_control_web.manual_colon') }}</div>
                <div class="card-val">{{ item?.manualTotal || '0' }}</div>
            </div>
            <div class="card-data">
                <div class="card-label">{{ i18n.global.t('meos_control_web.auto_colon') }}</div>
                <div class="card-val">{{ item?.autoTotal || '0' }}</div>
            </div>
            <!-- <div class="card-data">
                <div class="card-label">{{ i18n.global.t('meos_control_web.offline_colon') }}</div>
                <div class="card-val">{{ item?.offlineTotal || '0' }}</div>
            </div>
            <div class="card-data">
                <div class="card-label">{{ i18n.global.t('meos_control_web.control_feedback_mismatch_colon') }}</div>
                <div class="card-val">{{ item?.orderFailAlarmTotal || '0' }}</div>
            </div> -->
        </div>
    </div>
</template>
<script setup>
import { useQiankunElementSize } from '@/hooks/useQiankunElementSize';
import i18n from '@/localization';
import FanCoil from '@/assets/svg/FanCoil.svg';
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
import Dehumidifier from '@/assets/svg/dehumidifier.svg';
const contentElementRef = ref();
const { width } = useQiankunElementSize(contentElementRef);
defineProps({
    sideLayout: {
        type: Boolean,
        default: false
    },
    item: {
        type: Object,
        default: () => {}
    }
});
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
    CFCSEW: SmokeVentWindow, // 排烟窗
    ACATDH: Dehumidifier // 除湿机
};
</script>
<style lang="less" scoped>
.acequip-card-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    .aceuip-card-top {
        display: flex;
        height: 40px;
        flex-grow: 1;
        flex-direction: row;
        gap: 12px;
        align-items: center;
        .card-data-hr {
            border-right: 1px solid #e1e5eb;
            height: 40px;
        }
        .card-data-status {
            display: flex;
            flex-grow: 1;
            flex-direction: row;
            align-items: center;
            gap: 4px;
        }
        .card-data {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
            min-width: 56px;
            .card-data-val {
                font-family: PersagyMedium;
                font-weight: 600;
                color: var(--gray-800, #2e3742);
                font-size: 16px;
                line-height: 100%;
                letter-spacing: 0px;
            }
            .card-data-label {
                color: var(--gray-600, #626c78);
                font-size: 14px;
                font-style: normal;
                font-weight: var(--platform-font-weight);
                max-width: 100%;
                line-height: 100%; /* 14px */
            }
        }
    }
    .aceuip-card-bottom {
        width: 100%;
        margin-top: 20px;
        flex-direction: row;
        padding: 12px 8px;
        border-radius: 4px;
        column-gap: 8px;
        row-gap: 16px;
        align-items: flex-start;
        align-content: flex-start;
        background: linear-gradient(90deg, #f0f6fc 0%, rgba(240, 246, 252, 0) 100%);
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        &.small-screen {
            grid-template-columns: repeat(2, 1fr);
        }
        .card-data {
            display: flex;
            flex-direction: row;
            white-space: nowrap;
            .card-label {
                font-weight: var(--platform-font-weight);
                font-size: 14px;
                line-height: 22px;
                letter-spacing: 0px;
                color: #626c78;
            }
            .card-val {
                font-family: PersagyMedium;
                font-weight: 600;
                font-size: 14px;
                line-height: 22px;
                letter-spacing: 0px;
                color: #1b2129;
            }
        }
    }
    &.acequip-side-layout {
        .aceuip-card-bottom {
            grid-template-columns: repeat(2, 1fr);
        }
    }
}

.loading-wrap {
    margin-top: 20px;
    width: 100%;
    display: flex;
    flex-direction: column;
}
</style>
