<template>
    <div class="legend-wrap">
        <span class="legend-category-name">{{ i18n.global.t('meos_control_web.space_status_colon') }}</span>
        <div v-for="(item, index) in legends" :key="index + 's'" class="switch legend-item">
            <i class="mark" :style="{ background: item.color }"></i>
            <span class="legend-name">{{ item.name }}</span>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
// import { ENV_ATTR_KEYS, CONTROL_BAR_TAB_KEYS } from '../constants/constant';

defineProps({
    legends: {
        type: Array,
        default: () => []
    }
});

// const ENV_SPACE_NAME = {
//     [ENV_ATTR_KEYS.TEMPERATURE]: '空间温度',
//     [ENV_ATTR_KEYS.CO2]: '空间CO₂浓度'
// };
</script>
<style lang="less" scoped>
.legend-wrap {
    max-width: 100%;
    width: max-content;
    height: 40px;
    display: flex;
    align-items: center;
    background: linear-gradient(180deg, #e1e7ee 0%, #d6dde5 100%);
    border-radius: 4px 4px 0px 0px;
    flex-wrap: wrap;
    row-gap: 8px;
    font-size: 12px;
    white-space: nowrap;
    padding: 4px 16px;
    .legend-category-name {
        font-weight: 700;
    }
    .legend-item {
        display: flex;
        align-items: center;
        margin-right: 12px;

        &:last-child {
            margin-right: 0;
        }
    }

    .legend-name {
        color: @grey-600;
    }

    .switch .mark {
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
        width: 18px;
        height: 18px;
        margin-right: 4px;
    }
}
</style>
