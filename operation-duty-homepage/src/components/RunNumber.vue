<template>
    <div class="run-number fcc">
        <div v-if="showLabel" class="run-number-text">{{ label }}</div>
        <template v-if="isNumber(value) && isNumber(total)">
            <div class="run-number-value">{{ value }}</div>
            <IntersectionObserverBox>
                <div class="run-number-total">/{{ total }}</div>
            </IntersectionObserverBox>
        </template>
        <template v-else-if="isNumber(total)">
            <div class="run-number-value">--</div>
            <IntersectionObserverBox>
                <div class="run-number-total">/{{ total }}</div>
            </IntersectionObserverBox>
        </template>
        <template v-else>
            <div class="run-number-value">--</div>
        </template>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { isNumber } from 'lodash';
import IntersectionObserverBox from '@/components/IntersectionObserverBox.vue';
defineProps({
    showLabel: {
        type: Boolean,
        default: true
    },
    label: {
        type: String,
        default: i18n.global.t('common.operation')
    },
    value: {
        type: Number,
        default: 0
    },
    total: {
        type: Number,
        default: 0
    }
});
</script>
<style lang="less" scoped>
.run-number {
    height: 30px;
    &-text {
        color: var(--gray-600);
        margin-right: 4px;
    }
    &-value {
        font-size: 24px;
        font-weight: 700;
        color: var(--gray-800);
    }
    &-total {
        color: var(--gray-600);
    }
}
</style>
