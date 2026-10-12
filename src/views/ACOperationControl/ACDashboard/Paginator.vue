<template>
    <div class="acdash-paginator">
        <div :class="['prev-btn', 'page-btn', modelValue === 0 ? 'disabled' : '']" @click="changePage(modelValue - 1)">
            <svg class="icon" aria-hidden="true" style="height: 16px; width: 16px">
                <use xlink:href="#icon-zuo" />
            </svg>
        </div>
        <span class="current-page">{{ modelValue + 1 }}</span
        ><span class="total-pages">/{{ totalPages }}</span>
        <div :class="['next-btn', 'page-btn', modelValue === totalPages - 1 ? 'disabled' : '']" @click="changePage(modelValue + 1)">
            <svg class="icon" aria-hidden="true" style="height: 16px; width: 16px">
                <use xlink:href="#icon-you" />
            </svg>
        </div>
    </div>
</template>
<script setup>
const props = defineProps({
    modelValue: {
        type: Number,
        default: 0
    },
    totalPages: {
        type: Number,
        default: 0
    }
});
const emits = defineEmits(['update:modelValue']);

const currentPage = ref(props.modelValue);
const changePage = page => {
    if (page >= 0 && page < props.totalPages) {
        currentPage.value = page;
        emits('update:modelValue', currentPage.value);
    }
};
</script>
<style lang="less" scoped>
.acdash-paginator {
    display: flex;
    flex-direction: row;
    gap: 2px;
    height: 22px;
    align-items: center;
    .page-btn {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        width: 16px;
        height: 16px;
        border-radius: 2px;
        cursor: pointer;
        .icon {
            fill: #626c78;
        }
        &:hover {
            background-color: #c4c9cf4d;
        }
        &.disabled {
            cursor: not-allowed;
            .icon {
                fill: #c4c9cf;
            }
            &:hover {
                background-color: transparent;
            }
        }
    }
    .current-page {
        font-weight: var(--platform-font-weight);
        font-size: 14px;
        line-height: 22px;
        letter-spacing: 0px;
        color: #1b2129;
    }
    .total-pages {
        font-weight: var(--platform-font-weight);
        font-size: 14px;
        line-height: 22px;
        color: #8b949e;
    }
}
</style>
