<template>
    <div class="project-parking-statistics">
        <!-- 当前车辆总数仅由接口数据控制显隐，SSE 只更新展示值 -->
        <div v-if="isProjectView && showCarTotal" class="project-parking-statistics-item mb12 fc">
            <CurrentVehicleIcon class="mark-icon" aria-hidden="true" />
            <div class="ml32 total first-item" style="width: calc(100% - 54px)">
                <div class="f20 fb6 fmp">{{ displayValue(projectParkingStatisticsObj.CAR_TOTAL) }}</div>
                <div class="f14 ft">{{ i18n.global.t('meos_control_web.current_vehicle_total') }}</div>
            </div>
        </div>
        <div class="project-parking-statistics-item mb12 fc">
            <ParkingSpaceIcon class="mark-icon" aria-hidden="true" />
            <div class="ml32 total first-item">
                <div class="f20 fb6 fmp">{{ displayValue(projectParkingStatisticsObj.PARKING_SPACE) }}</div>
                <div class="f14 ft">{{ i18n.global.t('common.total_parking_spaces') }}</div>
            </div>
            <div class="ml32 total">
                <div class="f20 fb6 fmp">{{ displayValue(idleParkingSpaceNumber) }}</div>
                <div class="f14 ft">{{ i18n.global.t('common.idle_parking_spaces') }}</div>
            </div>
            <div class="ml32 total">
                <div class="f20 fb6 fmp">{{ idleParkingProportion }}</div>
                <div class="f14 ft">{{ i18n.global.t('common.idle_parking_spaces_proportion') }}</div>
            </div>
        </div>
        <div v-if="projectParkingStatisticsObj.CHARGING_PARKING_SPACE" class="project-parking-statistics-item mb12 fc">
            <ChargingIcon class="mark-icon" aria-hidden="true" />
            <div class="ml32 total first-item">
                <div class="f20 fb6 fmp">{{ displayValue(projectParkingStatisticsObj.CHARGING_PARKING_SPACE) }}</div>
                <div class="f14 ft">{{ i18n.global.t('meos_control_web.charging_parking_space') }}</div>
            </div>
            <div class="ml32 total">
                <div class="f20 fb6 fmp">{{ displayValue(projectParkingStatisticsObj.VACANT_CHARGING_PARKING_SPACE) }}</div>
                <div class="f14 ft">{{ i18n.global.t('meos_control_web.idle_charging_spaces') }}</div>
            </div>
            <div class="ml32 total">
                <div class="f20 fb6 fmp">{{ idleChargingProportion }}</div>
                <div class="f14 ft">{{ i18n.global.t('meos_control_web.idle_charging_spaces_proportion') }}</div>
            </div>
        </div>
        <div v-if="projectParkingStatisticsObj.FAST_CHARGING_PARKING_SPACE" class="project-parking-statistics-item mb12 fc">
            <FastChargeIcon class="mark-icon" aria-hidden="true" />
            <div class="ml32 total first-item">
                <div class="f20 fb6 fmp">{{ displayValue(projectParkingStatisticsObj.FAST_CHARGING_PARKING_SPACE) }}</div>
                <div class="f14 ft">{{ i18n.global.t('meos_control_web.fast_charging_space') }}</div>
            </div>
            <div class="ml32 total">
                <div class="f20 fb6 fmp">{{ displayValue(projectParkingStatisticsObj.VACANT_FAST_CHARGING_PARKING_SPACE) }}</div>
                <div class="f14 ft">{{ i18n.global.t('meos_control_web.idle_fast_charging_spaces') }}</div>
            </div>
            <div class="ml32 total">
                <div class="f20 fb6 fmp">{{ idleFastChargingProportion }}</div>
                <div class="f14 ft">{{ i18n.global.t('meos_control_web.idle_fast_charging_spaces_proportion') }}</div>
            </div>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
// 统计图标统一通过 SVG 组件导入。
import CurrentVehicleIcon from '@/assets/svg/currentVehicle.svg';
import ParkingSpaceIcon from '@/assets/svg/parkingSpace.svg';
import ChargingIcon from '@/assets/svg/charging.svg';
import FastChargeIcon from '@/assets/svg/FastCharge.svg';
import { displayValue, viodExcludeZero } from '@/utils/viewUtils';
import { round } from 'lodash';

const props = defineProps({
    projectParkingStatisticsObj: {
        type: Object,
        default: () => {}
    },
    showCarTotal: {
        type: Boolean,
        default: false
    },
    isProjectView: {
        type: Boolean,
        default: false
    }
});

const idleParkingSpaceNumber = computed(() => props.projectParkingStatisticsObj.VACANT_PARKING_SPACE);

const idleParkingProportion = computed(() => {
    if (!props.projectParkingStatisticsObj) return '--';
    // 分母不为0
    if (props.projectParkingStatisticsObj.PARKING_SPACE === 0) {
        return '--';
    }
    if (viodExcludeZero(props.projectParkingStatisticsObj.PARKING_SPACE) || viodExcludeZero(idleParkingSpaceNumber.value)) {
        return '--';
    }
    let proportion = idleParkingSpaceNumber.value / props.projectParkingStatisticsObj.PARKING_SPACE;
    proportion = round(proportion * 100, 1);
    return `${proportion}%`;
});
// 充电车位
const idleChargingProportion = computed(() => {
    if (!props.projectParkingStatisticsObj) return '--';
    // 分母不为0
    if (props.projectParkingStatisticsObj.CHARGING_PARKING_SPACE === 0) {
        return '--';
    }
    if (viodExcludeZero(props.projectParkingStatisticsObj.CHARGING_PARKING_SPACE) || viodExcludeZero(props.projectParkingStatisticsObj.VACANT_CHARGING_PARKING_SPACE)) {
        return '--';
    }
    let proportion = props.projectParkingStatisticsObj.VACANT_CHARGING_PARKING_SPACE / props.projectParkingStatisticsObj.CHARGING_PARKING_SPACE;
    proportion = round(proportion * 100, 1);
    return `${proportion}%`;
});

// 快充车位
const idleFastChargingProportion = computed(() => {
    if (!props.projectParkingStatisticsObj) return '--';
    // 分母不为0
    if (props.projectParkingStatisticsObj.FAST_CHARGING_PARKING_SPACE === 0) {
        return '--';
    }
    if (viodExcludeZero(props.projectParkingStatisticsObj.FAST_CHARGING_PARKING_SPACE) || viodExcludeZero(props.projectParkingStatisticsObj.VACANT_FAST_CHARGING_PARKING_SPACE)) {
        return '--';
    }
    let proportion = props.projectParkingStatisticsObj.VACANT_FAST_CHARGING_PARKING_SPACE / props.projectParkingStatisticsObj.FAST_CHARGING_PARKING_SPACE;
    proportion = round(proportion * 100, 1);
    return `${proportion}%`;
});
</script>
<style lang="less" scoped>
.project-parking-statistics {
    &-item {
        border-radius: 4px;
        background: #f4f8ff;
        padding: 16px;
        .mark-icon {
            width: 44px;
            height: 44px;
        }
        .total {
            width: 100px;
            margin-left: 16px;
        }
        .first-item {
            width: 22%;
        }
    }
}
</style>
