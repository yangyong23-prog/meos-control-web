<template>
    <div class="wh100 statics-container">
        <div v-for="item in equipStatics" :key="item.classCode" class="item">
            <div class="icon-wrap" :style="{ backgroundColor: codeMapBgColor[item.classCode] }">
                <component :is="codeMapIcon[item.classCode]"></component>
            </div>
            <div class="info-item">
                <div class="val ffCustom-M">{{ item.total }}</div>
                <div class="label">{{ item.name }}</div>
            </div>
            <div class="split-line"></div>
            <div class="info-wrap">
                <div class="info-item">
                    <div class="val ffCustom-M">{{ item.abnormalCount }}</div>
                    <div class="label">{{ i18n.global.t('meos_control_web.abnormal') }}</div>
                </div>
                <div class="info-item">
                    <div class="val ffCustom-M">{{ item.offlineCount }}</div>
                    <div class="label">{{ i18n.global.t('meos_control_web.offline') }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { equipStaticsKey } from '@/views/SEEA/hooks/useBaseHook';
import SEDGBPIcon from '@/assets/svg/SEEA/static-SEDGBP.svg';
import SEDGCBIcon from '@/assets/svg/SEEA/static-SEDGCB.svg';
import SEDGGCIcon from '@/assets/svg/SEEA/static-SEDGGC.svg';
import SEDGGIIcon from '@/assets/svg/SEEA/static-SEDGGI.svg';
import SEDGSCIcon from '@/assets/svg/SEEA/static-SEDGSC.svg';
import SEDGSPIcon from '@/assets/svg/SEEA/static-SEDGSP.svg';
import SETDIVIcon from '@/assets/svg/SEEA/static-SETDIV.svg';
import WESEMSIcon from '@/assets/svg/SEEA/static-WESEMS.svg';

const equipStatics = inject(equipStaticsKey);

const codeMapIcon = {
    SEDGBP: SEDGBPIcon,
    SEDGCB: SEDGCBIcon,
    SEDGGC: SEDGGCIcon,
    SEDGGI: SEDGGIIcon,
    SEDGSC: SEDGSCIcon,
    SEDGSP: SEDGSPIcon,
    SETDIV: SETDIVIcon,
    WESEMS: WESEMSIcon
};
const codeMapBgColor = {
    SEDGBP: '#D3ECFF',
    SEDGCB: '#F7E3F5',
    SEDGGC: '#F7E3F5',
    SEDGGI: '#E1E5FA',
    SEDGSC: '#D3ECFF',
    SEDGSP: '#D9F7F0',
    SETDIV: '#E1E5FA',
    WESEMS: '#D9F7F0'
};
</script>
<style lang="less" scoped>
.statics-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 24px;
    // padding: 16px;

    .item {
        display: flex;
        align-items: center;
        gap: 12px;
        align-self: stretch;

        .icon-wrap {
            display: flex;
            width: 40px;
            height: 40px;
            padding: 6px;
            justify-content: center;
            align-items: center;
            border-radius: 8px;
        }

        .split-line {
            width: 1px;
            height: 40px;
            background-color: #e1e5eb;
        }
        .info-wrap {
            display: flex;
            align-items: center;
            gap: 4px;
            flex: 1 0 0;
        }
        .info-item {
            display: flex;
            width: 80px;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
            gap: 4px;
            .val {
                color: var(--gray-800, #2e3742);
                font-size: 16px;
                font-weight: 600;
            }
            .label {
                color: var(--gray-600, #626c78);
                font-size: 14px;
                font-weight: 400;
                white-space: nowrap;
            }
        }
    }
}
</style>
