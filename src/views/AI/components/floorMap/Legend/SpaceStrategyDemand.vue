<template>
    <div class="legend-wrap">
        <span class="legend-title">{{ i18n.global.t('meos_control_web.space_status_colon') }}</span>
        <div v-for="(item, index) in statuList" :key="index + 's'" class="switch legend-item">
            <component :is="item.icon" v-if="item.icon" class="mark-icon" aria-hidden="true"></component>
            <i v-else class="mark" :style="{ background: item.color }"></i><span class="legend-name">{{ item.name }}</span>
        </div>
        <!-- <div class="divide" /> -->
    </div>
</template>
<script setup>
import i18n from '@/localization';
const statuList = computed(() => legendObj.status);

const legendObj = {
    status: [
        {
            name: i18n.global.t('meos_control_web.has_air_conditioning_demand'),
            color: '#246FE5CC'
        },
        {
            name: i18n.global.t('meos_control_web.no_hvac_demand'),
            color: '#CCCCCC'
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
    .legend-title {
        font-weight: 700;
        color: #2e3742;
        margin-right: 12px;
    }
    .legend-name {
        color: #626c78;
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
.mark-icon {
    display: inline-block;
    // width: 18px;
    // height: 18px;
    margin-right: 4px;
}
</style>
