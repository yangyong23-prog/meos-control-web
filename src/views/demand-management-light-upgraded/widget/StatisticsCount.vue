<template>
    <div :class="['statistics-count-wrap', withGap ? '' : 'no-gap']">
        <span>{{ i18n.global.t('common.total_count') }}</span>
        <span class="count">{{ props.total }}</span>
        <span>/</span>
        <span>{{ i18n.global.t('common.status_open') }}</span>
        <span class="count">{{ openCount }}</span>
        <span v-show="unConfigCount">/</span>
        <span v-show="unConfigCount">{{ i18n.global.t('meos_control_web.unconfiged') }}</span>
        <span v-show="unConfigCount" :class="[withHightLight ? 'hight-light' : 'count']">{{ unConfigCount }}</span>

        <template v-if="withFeedBack">
            <span v-show="feedbackCount">/</span>
            <span v-show="feedbackCount">{{ i18n.global.t('meos_control_web.feedback_adjustment') }}</span>
            <span v-show="feedbackCount" class="count">{{ feedbackCount }}</span>
        </template>
    </div>
</template>

<script setup>
import i18n from '@/localization';
const props = defineProps({
    total: {
        type: Number,
        default: 0
    },
    openCount: {
        type: Number,
        default: 0
    },
    unConfigCount: {
        type: Number,
        default: 0
    },
    feedbackCount: {
        type: Number,
        default: 0
    },
    withGap: {
        type: Boolean,
        default: false
    },
    withHightLight: {
        type: Boolean,
        default: false
    },
    withFeedBack: {
        type: Boolean,
        default: false
    }
});
</script>

<style lang="less" scoped>
.statistics-count-wrap {
    display: flex;
    align-items: center;
    gap: 4px;

    color: var(--gray-600, #626c78);
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;

    .count {
        color: var(--gray-900, #1b2129);
    }
    .hight-light {
        color: var(--gray-900, #1b2129);
        // color: var(--red-500, #f55047);
    }
}
.no-gap {
    gap: 0px;
}
</style>
