<template>
    <div class="legend-container">
        <span class="legend-category-name">{{ i18n.global.t('meos_control_web.risk_and_abnormal_colon') }}</span>
        <div v-for="(item, index) in equipStatuses" :key="index" class="legend-item">
            <i class="circle-mark" :style="{ background: item.color }"></i>
            <span class="legend-name">{{ item.name }}</span>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { SPACE_STATUS } from '../variable';
// const equipStatuses = ref([
//     { color: '#F29F00', name: i18n.global.t('meos_control_web.potential_risk') },
//     { color: '#F55047', name: i18n.global.t('meos_control_web.risk_occurred') }
// ]);
const equipStatuses = ref([
    { ...SPACE_STATUS.UNKNOWN, color: '#9B6CED' },
    { ...SPACE_STATUS.POTENTIAL, color: '#F29F00' },
    { ...SPACE_STATUS.EXCEPTION, color: '#F55047' }
]);
</script>

<style lang="less" scoped>
.legend-container {
    width: max-content;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    padding: 11px 20px;
    border-radius: 4px 4px 0px 0px;
    background: linear-gradient(180deg, rgba(112, 113, 121, 0.9) 0%, rgba(88, 89, 99, 0.9) 100%);

    z-index: 50;
    row-gap: 12px;

    .legend-category-name {
        color: @grey-100;
        font-size: 14px;
        font-style: normal;
        font-weight: 700;
        height: 18px;
        line-height: 18px;
    }

    .legend-item {
        display: flex;
        align-items: center;
        column-gap: 4px;
        margin-right: 12px;
        .legend-item-door {
            display: flex;
            justify-content: center;
            align-items: center;

            width: 20px;
            height: 20px;
            padding: 3px;
        }
        &:last-child {
            margin-right: 0;
        }
    }

    .circle-mark {
        display: inline-flex;
        box-sizing: border-box;
        width: 10px;
        height: 10px;
        border-radius: 90px;
        margin-right: 4px;
        border: 1px solid #fff;
    }

    .line-icon {
        display: inline-flex;
        width: 14px;
        height: 3px;
    }

    .legend-name {
        color: @grey-400;
        font-size: 14px;
        font-style: normal;
        font-weight: var(--platform-font-weight);
        line-height: 18px;
    }

    .icon-item {
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        border: 1px solid rgba(255, 255, 255, 0.4);
        color: #fff;
        font-size: 10px;
        line-height: 18px;
    }

    .divide {
        width: 1px;
        height: 14px;
        background: #b1b9c2;
        margin-right: 12px;
    }
}
</style>
