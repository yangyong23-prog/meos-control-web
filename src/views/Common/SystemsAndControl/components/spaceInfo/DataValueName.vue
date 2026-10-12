<template>
    <div class="data-value fc">
        <div v-ellipsis class="data-value-name m-ellipsis">{{ name }}</div>
        <div class="data-value-value" :style="{ color: color }">
            {{ isEmpty(value) }}<span class="f12">{{ unit }}</span>
        </div>
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
    },
    color: {
        type: String,
        default: ''
    }
});
</script>
<style lang="less" scoped>
.data-value {
    height: 100%;
    &-name {
        position: relative;
        z-index: 1;
        color: var(--gray-600);
    }
    &-value {
        color: var(--gray-600);
    }
    &.is-active {
        .data-value-name {
            color: #e1e5eb;
        }
    }
}
</style>
