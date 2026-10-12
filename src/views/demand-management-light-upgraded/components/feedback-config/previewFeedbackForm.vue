<template>
    <div class="preview-row">
        <div v-if="hasAdjustType" class="lighting-adjustment">
            <div class="row-label">{{ i18n.global.t('meos_control_web.illuminance_adjustment_type') }}</div>
            <div class="row-desc">{{ SPACE_FEEDBACK_ADJUST_TYPE[props.spaceFeedbackAdjustType].label }}</div>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { SPACE_FEEDBACK_ADJUST_TYPE } from '../../constant';

const props = defineProps({
    params: {
        type: Object,
        default: () => ({})
    },
    spaceFeedbackAdjustType: {
        type: String,
        default: ''
    }
});

const hasAdjustType = computed(() => {
    return !!SPACE_FEEDBACK_ADJUST_TYPE[props.spaceFeedbackAdjustType];
});
</script>

<style lang="less" scoped>
.preview-row {
    display: flex;
    align-items: center;
    gap: 8px 48px;
    padding: 8px 16px;
    flex-wrap: wrap;

    background: var(--gray-100, #f1f4f6);

    .left-half,
    .right-half,
    .lighting-adjustment {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .row-content {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px;
    }

    .row-label {
        color: var(--gray-800, #2e3742);
    }
    .row-desc {
        color: var(--gray-600, #626c78);
    }
    .row-value {
        color: var(--gray-900, #1b2129);
    }
}
</style>
