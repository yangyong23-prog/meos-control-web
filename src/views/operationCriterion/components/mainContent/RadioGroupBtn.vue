<template>
    <div
        class="ocg-radio-btn"
        :class="{
            selected,
            selectable,
            hover: selectable
        }"
    >
        <div v-if="showTitle && title" class="ocg-radio-btn-title">
            {{ title }}
        </div>
        <div class="ocg-radio-btn-perform">
            <div class="ocg-radio-btn-perform-detail">
                <span class="ocg-radio-btn-perform-key">{{ i18n.global.t('meos_control_web.temperature_satisfaction_rate_2') }}</span>
                <span class="ocg-radio-btn-perform-val"> {{ rule.tempFillRate }}% </span>
            </div>
            <div class="ocg-radio-btn-perform-detail">
                <span class="ocg-radio-btn-perform-key">{{ i18n.global.t('meos_control_web.co2_satisfaction_rate') }}</span>
                <span class="ocg-radio-btn-perform-val"> {{ rule.co2FillRate }}% </span>
            </div>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
const props = defineProps({
    selected: {
        type: Boolean,
        default: false
    },
    selectable: {
        type: Boolean,
        default: false
    },
    showTitle: {
        type: Boolean,
        default: true
    },
    rule: {
        type: Object,
        default: () => {}
    },
    type: {
        type: String,
        default: ''
    }
});
const title = computed(() => {
    if (props.rule.intervalMin && props.rule.intervalMax) {
        if (props.type === 'value_select_lowest_cast') {
            return i18n.global.t('meos_control_web.elec_price_range_minmax', {
                min: props.rule.intervalMin,
                max: props.rule.intervalMax
            });
        } else if (props.type === 'value_select_Lowest_carbon_emissions') {
            return `${props.rule.intervalMin}<${i18n.global.t('meos_control_web.carbon_factor')}≤${props.rule.intervalMax}kgCO₂/kWh：`;
        }
    }
    return '';
});
</script>
<style lang="less" scoped>
.ocg-radio-btn {
    display: flex;
    width: 100%;
    height: 76px;
    box-sizing: border-box;
    flex-shrink: 0;
    padding: 12px 16px;
    flex-direction: column;
    align-items: flex-start;
    white-space: nowrap;
    gap: 8px;
    border-radius: 4px;
    border: 1px solid var(--gray-300, #e1e5eb);
    .ocg-radio-btn-title {
        color: var(--gray-800, #2e3742);
        font-size: 14px;
        font-style: normal;
        font-weight: var(--platform-font-weight);
        line-height: 22px; /* 157.143% */
    }
    .ocg-radio-btn-perform {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        gap: 24px;
        .ocg-radio-btn-perform-detail {
            display: flex;
            flex-direction: row;
            align-items: center;
            .ocg-radio-btn-perform-key {
                color: var(--gray-600, #626c78);
                font-size: 14px;
                font-style: normal;
                font-weight: var(--platform-font-weight);
                line-height: 22px; /* 157.143% */
            }
            .ocg-radio-btn-perform-val {
                color: var(--gray-800, #2e3742);
                font-feature-settings: 'liga' off, 'clig' off;

                font-size: 14px;
                font-style: normal;
                font-weight: 700;
                line-height: 20px; /* 142.857% */
            }
        }
    }
    &.selectable {
        cursor: pointer;
    }
    &.selected {
        border: 1px solid var(--blue-300, #64a6f7);
        background: var(--blue-50, #ebf6ff);
        .ocg-radio-btn-title {
            color: var(--blue-500, #246fe5);
        }
    }
    &.hover {
        &:hover {
            border: 1px solid var(--blue-300, #64a6f7);
            background: var(--blue-50, #ebf6ff);
            .ocg-radio-btn-title {
                color: var(--blue-500, #246fe5);
            }
        }
    }

    &.disabled {
        border-radius: 4px;
        background: rgba(196, 201, 207, 0.12);
    }
}
</style>
