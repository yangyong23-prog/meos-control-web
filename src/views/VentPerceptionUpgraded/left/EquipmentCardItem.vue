<template>
    <div ref="contentElementRef" :class="['acequip-card-content', sideLayout ? 'acequip-side-layout' : '']">
        <div class="aceuip-card-top">
            <span v-if="width > 328" class="mark-icon" :style="{ backgroundColor: iconBgColor[item.id] }">
                <img v-if="typeof iconObj[item.id] === 'string'" :src="iconObj[item.id]" alt="" />
                <component :is="iconObj[item.id]" v-else></component>
            </span>
            <div class="card-data">
                <div class="card-data-val">{{ item?.total || 0 }}</div>
                <div v-ellipsis="{ y: true }" class="card-data-label m-ellipsis">{{ item.name }}</div>
            </div>
            <div class="card-data-hr"></div>
            <div class="card-data-status">
                <div class="card-data">
                    <div class="card-data-val">{{ item?.runStatus?.on || 0 }}</div>
                    <div class="card-data-label">{{ i18n.global.t('meos_control_web.on') }}</div>
                </div>
                <div class="card-data">
                    <div class="card-data-val">{{ item?.runStatus?.off || 0 }}</div>
                    <div class="card-data-label">{{ i18n.global.t('meos_control_web.off') }}</div>
                </div>
                <div class="card-data">
                    <div class="card-data-val">{{ item?.runStatus?.unknown || 0 }}</div>
                    <div class="card-data-label">{{ i18n.global.t('meos_control_web.no_data1') }}</div>
                </div>
            </div>
        </div>
        <div :class="['aceuip-card-bottom', width <= 268 ? 'small-screen' : 'big-screen']">
            <div class="card-data">
                <div class="card-label">{{ i18n.global.t('meos_control_web.abnormal_colon') }}</div>
                <div class="card-val">{{ item?.abnormalCount ?? 0 }}</div>
            </div>
            <div class="card-data">
                <div class="card-label">{{ i18n.global.t('meos_control_web.local_colon') }}</div>
                <div class="card-val">{{ item?.alarmControl?.localStatus || '0' }}</div>
            </div>
            <div class="card-data">
                <div class="card-label">{{ i18n.global.t('meos_control_web.remote_manual_colon') }}</div>
                <div class="card-val">{{ item?.alarmControl?.manualStatus || '0' }}</div>
            </div>
            <div class="card-data">
                <div class="card-label">{{ i18n.global.t('meos_control_web.remote_auto_colon') }}</div>
                <div class="card-val">{{ item?.alarmControl?.autoStatus || '0' }}</div>
            </div>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { useElementSize } from '@vueuse/core';
import {
    VENTILATION_FAN_SEND,
    VENTILATION_FAN_FFSCMF,
    VENTILATION_FAN_EXHAUST,
    VENTILATION_FAN_FFSCAF,
    VENTILATION_FAN_CFCSWN,
    VENTILATION_FAN_CFCSEW
} from '@/views/VentPerceptionUpgraded/variables';

import VentilationFanExhaustSvg from '@/assets/svg/vent/ventilation_fan_exhaust.svg';
import VentilationFanFfscafSvg from '@/assets/svg/vent/ventilation_fan_ffscaf.svg';
import VentilationFanFfscmfSvg from '@/assets/svg/vent/ventilation_fan_ffscmf.svg';
import VentilationFanSendSvg from '@/assets/svg/vent/ventilation_fan_send.svg';
import WindowIcon from '@/assets/images/SpaceTopologyGraph/card_icon_CFCSEW.png?url';
const contentElementRef = ref();
const { width } = useElementSize(contentElementRef);
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
    [VENTILATION_FAN_SEND]: VentilationFanSendSvg,
    [VENTILATION_FAN_FFSCMF]: VentilationFanFfscmfSvg,
    [VENTILATION_FAN_EXHAUST]: VentilationFanExhaustSvg,
    [VENTILATION_FAN_FFSCAF]: VentilationFanFfscafSvg,
    [VENTILATION_FAN_CFCSWN]: WindowIcon,
    [VENTILATION_FAN_CFCSEW]: WindowIcon
};

const iconBgColor = {
    [VENTILATION_FAN_SEND]: '#E6FCF7',
    [VENTILATION_FAN_FFSCMF]: '#EBEEFF',
    [VENTILATION_FAN_EXHAUST]: '#D3ECFF',
    [VENTILATION_FAN_FFSCAF]: '#F7E3F5'
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

        .mark-icon {
            display: flex;
            width: 40px;
            height: 40px;
            padding: 5px;
            justify-content: center;
            align-items: center;
            border-radius: 8px;
        }
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
        grid-template-columns: repeat(2, 150px);
        &.small-screen {
            grid-template-columns: repeat(2, 122px);
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
            grid-template-columns: repeat(3, 1fr);
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
