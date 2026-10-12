<template>
    <div :style="{ width: '100%', height: isDet ? '100%' : '' }" :class="[rightConfigExpand ? 'ml12' : isDet ? '' : 'mt40', 'box-line', 'fcc']">
        <div class="fcb f14 mb4 box-line-item">
            <div v-for="(item, index) in list" :key="index" :class="[rightConfigExpand ? 'fcb h100' : 'fcb h64', 'flex-row']" :style="{ left: `${percentPositions[index]}` }">
                <div v-ellipsis :class="['ft1', 'base-txt']">{{ rightConfigExpand ? item.name : item.name.slice(2) }}</div>
                <!-- <div class="get-line-white"></div> -->
                <div>{{ `${item.value?.toString() || '--'}${props.unit}` }}</div>
            </div>
        </div>
        <div class="temperature-bar"></div>
    </div>
</template>
<script setup>
import { rightConfigExpandInjectKey } from '../constant/injectKey';
const rightConfigExpand = inject(rightConfigExpandInjectKey);
const props = defineProps({
    list: {
        type: Array,
        default: () => []
    },
    isDet: {
        type: Boolean,
        default: false
    },
    unit: {
        type: String,
        default: '℃'
    }
});

const percentPositions = ['11%', '37%', '63%', '89%'];
</script>
<style lang="less" scoped>
.flex-row {
    position: absolute;
    transform: translateX(-50%);
    flex-direction: column;
    width: 22%;
}
.base-txt {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
    width: 100%;
    text-align: center;
}
.box-line {
    position: relative;
    max-width: 1000px;

    &-item {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: transparent;
        z-index: 2;
    }
}
.temperature-item {
    width: 100%;
    padding: 12px 0px;
    flex: 1;
}
.mh96 {
    min-height: 96px;
}
.mh128 {
    min-height: 128px;
}
.temperature-item:not(:last-child) {
    border-bottom: 1px dashed #e1e5eb;
}
.temperature-bar {
    width: 100%;
    height: 12px;
    border-radius: 4px;
    background: linear-gradient(
        90deg,
        #68b2e8 0%,
        #68b2e8 calc(11% - 1px),
        white calc(11% - 1px),
        white calc(11% + 1px),
        #6bcfdd calc(11% + 1px),
        #6bcfdd calc(37% - 1px),
        white calc(37% - 1px),
        white calc(37% + 1px),
        #8ad1a6 calc(37% + 1px),
        #8ad1a6 calc(63% - 1px),
        white calc(63% - 1px),
        white calc(63% + 1px),
        #edc578 calc(63% + 1px),
        #edc578 calc(89% - 1px),
        white calc(89% - 1px),
        white calc(89% + 1px),
        #ef9b96 calc(89% + 1px),
        #ef9b96 100%
    );
}
.get-line-box {
    width: 100%;
    height: 100%;
}
.get-line-white {
    height: 12px;
    width: 2px;
    background-color: white;
}
.h64 {
    height: 64px;
}
.w97 {
    width: 97%;
}
</style>
