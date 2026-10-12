<template>
    <div class="running-monitor-datalist-layout">
        <div class="running-monitor-datalist-title">
            {{ title }}
        </div>
        <div
            :class="{
                'running-monitor-datalist-value': true,
                'column-layout': columnLayout
            }"
        >
            <div v-for="(item, idx) in items" :key="idx" class="data-values-items">
                <span class="item-data-label">
                    {{ item.label }}
                </span>
                <span class="item-data-value"> {{ item.value }}℃ </span>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { PropType } from 'vue';

defineProps({
    title: {
        type: String,
        default: ''
    },
    columnLayout: {
        type: Boolean,
        default: false
    },
    items: {
        type: Array as PropType<
            {
                label: string;
                value: string;
            }[]
        >,
        default: () => []
    }
});
</script>
<style lang="less" scoped>
.running-monitor-datalist-layout {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    height: 100%;
    white-space: nowrap;
    .running-monitor-datalist-title {
        color: var(--gray-800, #2e3742);
        font-size: 14px;
        font-style: normal;
        font-weight: 700;
        line-height: 22px;
    }
    .running-monitor-datalist-value {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        flex-grow: 1;
        padding-right: 19px;
        height: 100%;
        &.column-layout {
            justify-content: flex-start;
            gap: 12px;
            margin-top: 12px;
            .data-values-items {
                flex-direction: column-reverse;
                justify-content: flex-start;
                align-items: flex-start;
                .item-data-value {
                    font-family: 'PersagyBold', 'Persagy-Bold', 'PersagyRegular', 'PersagyMedium';
                    line-height: 24px;
                    font-size: 16px;
                }
                .item-data-label {
                    color: var(--gray-600, #626c78);
                }
            }
        }
        .data-values-items {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            gap: 0;
            width: 100%;
            .item-data-label {
                color: var(--gray-900, #1b2129);

                font-size: 14px;
                font-style: normal;
                font-weight: 400;
                line-height: 22px; /* 157.143% */
            }
            .item-data-value {
                color: var(--gray-800, #2e3742);
                font-size: 14px;
                font-style: normal;
                font-weight: 700;
                line-height: 22px; /* 157.143% */
            }
        }
    }
}
</style>
