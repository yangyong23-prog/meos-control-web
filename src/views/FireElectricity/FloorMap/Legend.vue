<template>
    <div class="legend-wrap">
        <span class="legend-name">{{ i18n.global.t('meos_control_web.space_status_colon') }}</span>
        <div v-for="(item, index) in switchList" :key="index + 's'" class="switch legend-item">
            <i class="mark" :style="{ background: item.color }"></i><span class="legend-value ft">{{ item.name }}</span>
        </div>
        <div class="divide" />
        <span class="legend-name">{{ i18n.global.t('meos_control_web.camera_colon') }}</span>
        <div class="legend-item">
            <div class="legend-item-camera" :style="{ background: '#FCF5FF', borderRadius: '3px', border: '1px solid #8252E3' }">
                <Camera />
            </div>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import Camera from '@/assets/svg/camera.svg';

const switchList = computed(() => legendObj.spaceStatus);

const legendObj = {
    spaceStatus: [
        {
            name: i18n.global.t('meos_control_web.has_abnormal_event'),
            color: '#F0ABA8'
        },
        {
            name: i18n.global.t('meos_control_web.no_anomaly_event'),
            color: '#A3D4B6'
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
