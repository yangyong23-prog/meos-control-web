<template>
    <div class="iot-group-container" :style="style">
        <div class="group-info-top">
            <PrePage v-if="totalPages > 1" class="page-btn" @click="prePage()" />
            <div
                :class="{
                    'group-info-name-wrap': true,
                    'has-btns': totalPages > 1
                }"
            >
                <div
                    v-ellipsis
                    :class="['group-info-name', 'text-hide']"
                    :style="{
                        background: '',
                        color: ''
                    }"
                >
                    {{ data.relObj?.dataObject?.localName ?? '--' }}
                </div>
                <div
                    class="status-marks"
                    :style="{ right: `0px`, top: '-4px', transform: `scale(${legendScaleRatio}) translateY(-50%)` }"
                ></div>
            </div>
            <NextPage v-if="totalPages > 1" class="page-btn" @click="nextPage()" />
        </div>

        <div v-for="(item, index) in iotItems" :key="index" class="group-info-item">
            <div v-ellipsis class="group-info-item-key text-hide">
                {{ item.aliasName || item.name }}{{ getUnit(item) }}
            </div>
            <div v-if="item.linkCodes?.length > 0" class="item-val-group-line fc">
                <template v-for="(linkItem, linkIdx) in item.linkCodes" :key="`linkCode_${item.infoCode}_${linkIdx}`">
                    <div class="info-item text-hide">{{ itemShowText(linkItem, false) }}</div>
                    <div v-if="linkIdx < item.linkCodes.length - 1" class="group-val-line"></div>
                </template>
            </div>
            <div v-else v-ellipsis class="item-val-inline text-hide">
                {{ getItemValText(data, item) }}
            </div>
        </div>
    </div>
</template>

<script setup>
import NextPage from '@/assets/svg/nextpage.svg';
import PrePage from '@/assets/svg/prepage.svg';
import { ref, watchEffect, computed } from 'vue';
const currentPage = ref(0);

const props = defineProps({
    data: {
        type: Object,
        default: () => {}
    },
    chartAttr: {
        type: Object,
        default: null
    }
});
const totalPages = ref(0);
const prePage = () => {
    if (currentPage.value > 0) {
        currentPage.value -= 1;
    } else {
        currentPage.value = totalPages.value - 1;
    }
};

const nextPage = () => {
    if (currentPage.value < totalPages.value - 1) {
        currentPage.value += 1;
    } else {
        currentPage.value = 0;
    }
};

watchEffect(() => {
    const { data } = props;
    if (props.chartAttr?.classCode === 'SEHD') {
        totalPages.value = Math.ceil(data.iotGroupsList.length / 4);
    }
});

const getItemValText = (data, iotItem, showUnit = false) => {
    return `${'--'}${showUnit ? iotItem.unit || '' : ''}`;
};

const itemShowText = (infoItem, showUnit = true) => {
    return `${infoItem.aliasName || infoItem.name}${infoItem.hasColon ? '' : ':'}${getItemValText(
        props.data,
        infoItem,
        showUnit
    )}`;
};

const getUnit = infoItem => {
    let tempUnit = infoItem.unit;
    if (infoItem.linkCodes?.length) {
        tempUnit = infoItem.linkCodes[0].unit;
    }
    if (tempUnit) return `(${tempUnit})`;
    return '';
};

const iotItems = computed(() => {
    if (props.chartAttr?.classCode === 'SEHD') {
        return props.data.iotGroupsList.slice(currentPage.value * 4, currentPage.value * 4 + 4);
    }
    return props.data.iotGroupsList;
});

const style = computed(() => {
    const { x, y, w } = props.data || {};
    return {
        top: `${y}px`,
        left: `${x}px`,
        width: `${w}px`
    };
});
</script>
<style lang="scss" scoped>
.iot-group-container {
    display: inline-block;
    position: absolute;
    padding: 8px;
    box-sizing: border-box;
    border-radius: 4px;
    border: 1px solid rgb(241 244 246 / 100%);
    background: rgb(241 244 246 / 100%);
    color: #424c59;
    font-size: 14px;
    .group-info-top {
        display: flex;
        flex-direction: row;
        flex: 1;
        width: 100%;
        position: relative;
        gap: 8px;
        align-items: center;
        justify-content: space-between;
        .page-btn {
            cursor: pointer;
            &:hover {
                :deep circle {
                    stroke: var(--blue-500, #246fe5);
                }
                :deep path {
                    fill: var(--blue-500, #246fe5);
                }
            }
        }
    }
    .group-info-name-wrap {
        position: relative;
        display: flex;
        flex: 1;
        max-width: 100%;
        &.has-btns {
            max-width: calc(100% - 80px);
        }
    }
    .group-info-name {
        cursor: default;
        width: 100%;
        font-size: 24px;
        font-style: normal;
        position: relative;
        text-align: center;
        font-weight: 700;
        line-height: 40px;
        padding-left: 6px;
        padding-right: 6px;
        border-radius: 2px;
        user-select: none;
        &:hover,
        &.is-selected {
            cursor: pointer;
            background-color: #246fe5 !important;
            color: #ffffff;
        }
        &.is-abnormal {
            background: var(--red-500, #f55047);
            color: #ffffff;
        }
    }
    .status-marks {
        position: absolute;
        pointer-events: none;
        .mark-out {
            display: inline-block;
            width: 7px;
            line-height: 0;
            position: relative;
            .mark-item {
                display: inline-block;
                width: 14px;
                height: 14px;
                border: 2px solid #ffffff;
                border-radius: 50%;
            }

            // 动画 变大再变小
            @keyframes mark-animation {
                0% {
                    transform: scale(1);
                }
                50% {
                    transform: scale(5);
                    opacity: 0.2;
                }
                100% {
                    transform: scale(5);
                    opacity: 0;
                }
            }
            .mark-animation {
                position: absolute;
                width: 14px;
                height: 14px;
                border-radius: 50%;
                opacity: 0.2;
                animation: mark-animation 2s cubic-bezier(0, 0, 0.25, 1) infinite;
            }
        }
    }
    .group-info-item {
        width: 100%;
        display: flex;
        justify-content: space-between;
        cursor: default;
        padding: 12px 0;
        border-bottom: 1px solid #e1e5eb;
        margin-top: 2px;
        &:last-child {
            border-bottom: none;
        }
        .group-info-item-key {
            @include text-ellipsis;

            max-width: 240px;
            color: var(--blue-500);
            font-size: 20px;
            font-style: normal;
            font-weight: var(--platform-font-weight);
            line-height: 26px;
            border-radius: 4px;
            background: var(--blue-100);
            padding: 2px 4px;
            margin-right: 4px;
        }
        .item-val-group-line {
            flex-basis: 1;
            flex-shrink: 1;
            gap: 4px;
            cursor: pointer;
            display: flex;
            justify-content: flex-end;
            font-size: 20px;
            .group-val-line {
                width: 1px;
                height: 16px;
                background: var(--gray-400);
            }
        }
        .group-info-item-value {
            @include text-ellipsis;
        }
        .item-val-inline {
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 20px;
        }
        .info-item:hover,
        .item-val-inline:hover {
            background: rgb(196 201 207 / 30%);
            color: var(--blue-500);
        }
    }
    .text-hide {
        overflow: hidden;
        display: inline-block;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}
</style>
