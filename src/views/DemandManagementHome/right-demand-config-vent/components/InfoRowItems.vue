<template>
    <div class="row-items-container">
        <div v-for="(row, index) in props?.rowsInfo" :key="index" class="row-item">
            <div class="row-label">{{ `${row?.label || '--'}：` }}</div>
            <m-popover v-if="row?.tips" :show-arrow="false" theme="darkTransparent" placement="top">
                <template #content>
                    <div>{{ row?.tips || '--' }}</div>
                </template>
                <div class="row-tips-icon">
                    <svg aria-hidden="true" style="height: 16px; width: 16px">
                        <use :xlink:href="'#icon-info-small'" />
                    </svg>
                </div>
            </m-popover>
            <div class="row-val">{{ row?.val?.toString() ? row?.val : '--' }}</div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    rowsInfo: {
        type: Array,
        default: () => []
    }
});
</script>

<style lang="less" scoped>
.row-item {
    margin-top: 12px;
    margin-left: 12px;
    display: flex;
    align-items: center;
    column-gap: 4px;

    .row-label {
        color: @grey-600;
        font-size: 14px;
        font-weight: var(--platform-font-weight);
        line-height: 22px;
    }

    .row-tips-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        color: @grey-500;
    }

    .row-val {
        color: @grey-900;
        font-size: 14px;
        font-weight: var(--platform-font-weight);
        line-height: 22px;
    }
}
</style>
