<template>
    <div class="data-value">
        <div class="data-value-value fmp">
            {{ isEmpty(value) }}<span class="f12 fmp">{{ unit }}</span>
        </div>
        <div v-ellipsis class="data-value-name m-ellipsis">{{ name }}</div>
    </div>
</template>

<script lang="ts" setup>
import { isEmpty } from '@/utils/tools';

defineProps({
    name: {
        type: String,
        default: ''
    },
    value: {
        type: String,
        default: ''
    },
    unit: {
        type: String,
        default: ''
    }
});
</script>
<style lang="less" scoped>
.data-value {
    height: 100%;
    padding-right: 4px;
    &-name {
        position: relative;
        z-index: 1;
        color: var(--gray-500);
    }
    &.is-active {
        .data-value-name {
            color: #e1e5eb;
        }
    }
}
</style>
