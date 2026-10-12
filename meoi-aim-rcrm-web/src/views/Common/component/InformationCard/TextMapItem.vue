<template>
    <div v-if="textMapData?.infoDetail" class="text-graph" :style="warpStyle">
        <div v-ellipsis class="iot-info" :style="contentStyle">
            {{ getIotName(textMapData) }}{{ textMapData.dataValue || '--' + (textMapData.unit || '') }}
        </div>
    </div>
</template>
<script setup>
import { computed } from 'vue';

const props = defineProps({
    textMapData: {
        type: Object,
        default: () => ({})
    },
    legendScaleRatio: {
        type: Number,
        default: 1
    }
});

const warpStyle = computed(() => {
    return {
        width: props.textMapData.size.x + 'px',
        height: props.textMapData.size.y + 'px',
        left: props.textMapData.absoluteLocation.x + 'px',
        top: props.textMapData.absoluteLocation.y + 'px'
    };
});

const contentStyle = computed(() => {
    return {
        transform: `scale(${props.legendScaleRatio})`,
        maxWidth: `${props.textMapData.size.x / props.legendScaleRatio}px`
    };
});
const getIotName = iot => {
    let title = iot?.textTitle || iot?.infoDetail?.aliasName || iot?.infoDetail?.name || '';
    if (title) {
        if (title.endsWith(':') || title.endsWith('：')) {
            return title;
        }
        return title + ':';
    }
    return '';
};
</script>
<style lang="scss" scoped>
.text-graph {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    user-select: none;
    .iot-info {
        width: 100%;
        color: var(--gray-600);
        font-size: 18px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 100%;
        padding: 4px;
        border-radius: 2px;
        background: rgb(247 249 250 / 90%);
    }
}
</style>
