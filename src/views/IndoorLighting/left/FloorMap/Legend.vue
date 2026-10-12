<template>
    <div class="legend-wrap">
        <span class="legend-name">{{ i18n.global.t('meos_control_web.space_lighting_colon') }}</span>
        <div v-for="(item, index) in switchList" :key="index + 's'" class="switch legend-item">
            <i class="mark" :style="{ background: item.color }"></i><span class="legend-value ft">{{ item.name }}</span>
        </div>
        <div class="divide" />
        <span class="legend-name">{{ i18n.global.t('meos_control_web.loop_colon') }}</span>
        <div v-for="item in circuits" :key="item.name" class="switch legend-item">
            <component :is="item.svg"></component>
            <span class="legend-value ft ml4">{{ item.name }}</span>
        </div>
        <div class="divide" />
        <div v-for="(item, index) in publicControl" :key="index" class="switch legend-item">
            <span class="mark" :style="{ background: item.color }">N</span><span class="legend-value ft">{{ item.name }}</span>
        </div>
    </div>
</template>
<script setup>
import TurnOn from '@/assets/svg/indoorLighting/turn_on.svg';
import TurnOff from '@/assets/svg/indoorLighting/turn_off.svg';
import Inconsistency from '@/assets/svg/indoorLighting/inconsistency.svg';
import Unknown from '@/assets/svg/indoorLighting/unknown.svg';
import Local from '@/assets/svg/indoorLighting/local.svg';
import i18n from '@/localization';

const switchList = computed(() => legendObj.spaceStatus);
const circuits = computed(() => legendObj.circuits);
const publicControl = computed(() => legendObj.publicControl);

const legendObj = {
    spaceStatus: [
        {
            name: i18n.global.t('meos_control_web.on_off_normally'),
            color: '#A3D4B6'
        },
        {
            name: i18n.global.t('meos_control_web.on_off_abnormal'),
            color: '#F2BFA5'
        }
    ],
    circuits: [
        {
            name: i18n.global.t('meos_control_web.on'),
            svg: TurnOn
        },
        {
            name: i18n.global.t('meos_control_web.off'),
            svg: TurnOff
        },
        {
            name: i18n.global.t('meos_control_web.switch_status_unknown'),
            svg: Unknown
        },
        {
            name: i18n.global.t('meos_control_web.over_on_under_off'),
            svg: Inconsistency
        },
        {
            name: i18n.global.t('meos_control_web.local'),
            svg: Local
        }
    ],
    publicControl: [
        {
            name: i18n.global.t('meos_control_web.lighting_controller_num'),
            color: '#424C59'
        }
    ]
};
</script>
<style lang="less" scoped>
.legend-wrap {
    max-width: 100%;
    width: max-content;
    padding: 11px 20px;
    display: flex;
    align-items: center;
    border-radius: 4px 4px 0px 0px;
    background: linear-gradient(180deg, #e1e7ee 0%, #d6dde5 100%);
    flex-wrap: wrap;
    row-gap: 8px;
    white-space: nowrap;
    line-height: 20px;
    font-size: 14px;
    .legend-name {
        font-weight: 700;
        color: #2e3742;
    }
    .legend-value {
        color: var(--gray-600, #626c78);
        font-size: 14px;
        font-weight: var(--platform-font-weight);
        line-height: 18px;
    }
    .legend-item {
        display: flex;
        align-items: center;
        margin-right: 12px;
        &:last-child {
            margin-right: 0;
        }
    }
    .legend-item-camera {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 18px;
        height: 18px;
        padding: 0.9px 0.899px 1.8px 1.801px;
    }
}
.divide {
    width: 1px;
    height: 14px;
    background: #b1b9c2;
    margin-right: 12px;
}

.switch .mark {
    display: inline-block;
    width: 14px;
    height: 14px;
    margin-right: 4px;
    border-radius: 2px;
    color: #ffffff;
    font-size: 10px;
    font-weight: 700;
    text-align: center;
    line-height: 14px;
}
</style>
