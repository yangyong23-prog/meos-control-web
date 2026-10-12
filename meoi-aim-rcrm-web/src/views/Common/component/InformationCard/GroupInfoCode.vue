<template>
    <div :id="infoPointData?.id" :class="[isChart ? 'group-info-chart' : 'group-info']" :style="outStyle">
        <div v-if="infoPointData.showTitle" v-ellipsis class="group-info-name">{{ infoPointData.title }}</div>
        <div v-for="item in infoPointData.groups" :key="item.infoCode" class="group-info-item" :style="outStyleItem">
            <div v-ellipsis class="group-info-item-key">{{ item.aliasName || item.name }}</div>
            <div v-ellipsis class="group-info-item-value">
                {{ getValueTextByInfoObject(item) }}{{ item?.unit || '' }}
            </div>
        </div>
    </div>
</template>
<script setup>
import { computed } from 'vue';
import { getValueTextByInfoObject } from '../utils';
const props = defineProps({
    isChart: {
        type: Boolean,
        default: true
    },
    infoPointData: {
        type: Object,
        default: () => ({})
    }
});
const outStyle = computed(() => {
    const { width, fontSize } = props.infoPointData;
    if (props.isChart) {
        return {
            width: `${width}px`,
            fontSize: `${fontSize}px`
        };
    }

    return {};
});
const outStyleItem = computed(() => {
    const { fontSize } = props.infoPointData;
    if (props.isChart) {
        return {
            fontSize: `${fontSize}px`
        };
    }

    return {};
});
</script>

<style lang="scss" scoped>
.group-info-chart {
    border-radius: 8px;
    padding: 12px;
    border: 1px solid #e1e5eb;
    background: rgb(255 255 255 / 80%);
    color: #424c59;
    display: flex;
    flex-direction: column;
    gap: 8px;
    .group-info-name {
        width: 100%;
        line-height: 1.3333;
        color: #424c59;
        cursor: pointer;
        font-weight: 700;

        @include text-ellipsis;
    }
    .group-info-item {
        /* stylelint-disable-next-line number-max-precision */
        line-height: 1.66666;
        padding-bottom: 4px;
        align-items: center;
        gap: 8px;
        border-bottom: 1px solid #e1e5eb;

        @include flex-display(space-between, center);
        .group-info-item-key {
            max-width: 66%;
            color: #626c78;

            @include text-ellipsis;
        }
        .group-info-item-value {
            text-align: right;
            margin-left: 8px;
            color: #424c59;
            max-width: 120px;

            @include text-ellipsis;
        }
    }
}
.group-info {
    min-width: 180px;
    max-width: 214px;
    border-radius: 4px;
    padding: 8px;
    border: 0.6px solid #e1e5eb;
    background: rgb(255 255 255 / 80%);
    .group-info-name {
        font-weight: 700;
        margin-bottom: 6px;
        font-size: 14px;

        @include text-ellipsis;
    }
    .group-info-item {
        border-bottom: 1px solid #e1e5eb;
        margin-bottom: 4px;
        font-size: 12px;

        @include flex-display(space-between, center);
        .group-info-item-key {
            max-width: 120px;
            color: #626c78;

            @include text-ellipsis;
        }
        .group-info-item-value {
            max-width: 70px;
            color: #424c59;

            @include text-ellipsis;
        }
    }
}
</style>
