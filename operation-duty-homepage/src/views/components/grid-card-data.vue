<template>
    <div class="running-monitor-datacard-layout">
        <div v-ellipsis class="running-monitor-datacard-title">
            {{ title }}
        </div>
        <div class="running-monitor-datacard-value">
            <div v-for="(item, idx) in items" :key="idx" class="data-values-items">
                <span class="item-data-value">
                    {{ item.value }}
                </span>
                <span class="item-data-unit">
                    {{ item.unit }}
                </span>
                <m-popover v-if="dataStatus && dataStatus.length" :show-arrow="false" theme="darkTransparent" placement="top-start">
                    <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g id="component/information">
                            <g id="Vector">
                                <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M15.3346 8.50033C15.3346 12.5504 12.0514 15.8337 8.0013 15.8337C3.95121 15.8337 0.667969 12.5504 0.667969 8.50033C0.667969 4.45024 3.95121 1.16699 8.0013 1.16699C12.0514 1.16699 15.3346 4.45024 15.3346 8.50033ZM2.0013 8.50033C2.0013 11.814 4.68759 14.5003 8.0013 14.5003C11.315 14.5003 14.0013 11.814 14.0013 8.50033C14.0013 5.18662 11.315 2.50033 8.0013 2.50033C4.68759 2.50033 2.0013 5.18662 2.0013 8.50033Z"
                                    fill="#8B949E"
                                />
                                <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M6.95655 12.4863C7.87966 12.4863 8.42851 11.8788 8.96742 11.0912C8.96742 10.9972 9.00023 10.7494 8.97988 10.6089L8.26303 11.449C8.11399 11.6074 7.92947 11.7185 7.84148 11.6885C7.76082 11.6604 7.71288 11.5722 7.72924 11.4853L8.92534 7.6389C9.02456 7.15019 8.75409 6.70623 8.18285 6.64943C7.58159 6.64943 6.69592 7.27098 6.15627 8.05862C6.15627 8.1532 6.13918 8.38702 6.15896 8.52753L6.87654 7.68682C7.02484 7.5284 7.19691 7.41791 7.28417 7.44793C7.37216 7.47795 7.42075 7.57823 7.39185 7.67217L6.20422 11.5C6.06706 11.9473 6.32631 12.3867 6.95655 12.4863Z"
                                    fill="#8B949E"
                                />
                                <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M8.47932 4.50033C8.34139 4.5034 8.20653 4.53956 8.07473 4.60881C7.94294 4.67805 7.83873 4.77884 7.7621 4.91118C7.68547 5.04351 7.64793 5.18431 7.64946 5.33357C7.65099 5.48283 7.68854 5.62209 7.7621 5.75134C7.83566 5.8806 7.93604 5.98216 8.06324 6.05602C8.19044 6.12988 8.32913 6.16681 8.47932 6.16681C8.62644 6.16989 8.76514 6.13373 8.8954 6.05833C9.02567 5.98293 9.12758 5.8806 9.20114 5.75134C9.2747 5.62209 9.31301 5.48206 9.31608 5.33126C9.31608 5.18354 9.27777 5.04351 9.20114 4.91118C9.12451 4.77884 9.01877 4.67728 8.88391 4.6065C8.74905 4.53572 8.61418 4.50033 8.47932 4.50033Z"
                                    fill="#8B949E"
                                />
                            </g>
                        </g>
                    </svg>
                    <template #content>
                        <div class="data-valiue-status">
                            <div v-for="(k, i) in dataStatus" :key="i" class="data-value-status-val">{{ k.objectName }}&nbsp;:&nbsp;{{ k.status }}</div>
                        </div>
                    </template>
                </m-popover>
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
    dataStatus: {
        type: Array as PropType<
            {
                objectName: string;
                status: string;
            }[]
        >,
        default: () => []
    },
    items: {
        type: Array as PropType<
            {
                value: string;
                unit: string;
            }[]
        >,
        default: () => []
    }
});
</script>
<style lang="less" scoped>
.running-monitor-datacard-layout {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    height: 100%;
    white-space: nowrap;
    width: 100%;
    .running-monitor-datacard-title {
        color: var(--gray-800, #2e3742);
        font-size: 14px;
        font-style: normal;
        font-weight: 700;
        line-height: 22px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .running-monitor-datacard-value {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-top: 16px;
        flex-grow: 0;
        .data-values-items {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 0;
            .item-data-value {
                color: var(--gray-800, #2e3742);
                font-size: 24px;
                font-style: normal;
                font-weight: 700;
                line-height: normal;
            }
            .item-data-unit {
                color: var(--gray-600, #626c78);
                font-size: 16px;
                font-style: normal;
                font-weight: 400;
                line-height: 28px; /* 175% */
            }
        }
    }
}
</style>
