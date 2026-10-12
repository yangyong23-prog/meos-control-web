<template>
    <div ref="cardContainer" :class="['row-items-container', isSmallSize ? 'small-size' : '']">
        <div v-for="(row, index) in props?.rowsInfo?.filter(item => !item?.isHide?.())" :key="index" class="row-item">
            <div class="row-left-container">
                <div class="row-label">{{ `${row?.label || '--'}` }}</div>
                <m-popover v-if="row?.tips" :show-arrow="false" theme="darkTransparent" placement="top">
                    <template #content>
                        <div style="max-width: 400px">{{ row?.tips || '--' }}</div>
                    </template>
                    <svg aria-hidden="true" class="row-tips-icon">
                        <use :xlink:href="'#icon-info-small'" />
                    </svg>
                </m-popover>
            </div>
            <slot name="value" :row="row" :is-small-size="isSmallSize" :index="index"></slot>
        </div>
    </div>
</template>

<script setup>
import { useElementSize } from '@vueuse/core';
const props = defineProps({
    rowsInfo: {
        type: Array,
        default: () => []
    }
});

const cardContainer = ref(null);
const { width: cardWidth } = useElementSize(cardContainer);

const isSmallSize = computed(() => cardWidth.value < 500);
</script>

<style lang="less" scoped>
.row-item {
    display: flex;
    column-gap: 10px;

    & + .row-item {
        margin-top: 12px;
    }

    .row-left-container {
        display: flex;
        column-gap: 4px;
        width: 132px;

        :deep(.m-popper-trigger) {
            display: inline-flex;
            align-items: center;
            height: 22px;
        }
    }

    .row-label {
        color: @grey-600;
        font-size: 14px;
        font-weight: var(--platform-font-weight);
        line-height: 22px;
    }

    .row-tips-icon {
        width: 16px;
        height: 16px;
        color: @grey-500;
    }
}

.small-size {
    .row-left-container {
        width: 130px;
    }

    .row-tips-icon {
        width: 14px;
        height: 14px;
    }

    .row-item {
        column-gap: 4px;
    }
}
</style>
