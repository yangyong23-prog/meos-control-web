<template>
    <div :style="{ width: '100%', height: isDet ? '100%' : '' }" :class="[rightConfigExpand ? 'ml12' : 'mt30', 'box-line', 'fcc']">
        <div :class="['fcb', 'f14', 'mb4', 'box-line-item', 'w100']">
            <div v-for="(item, index) in list" :key="index" :class="[rightConfigExpand ? 'fcb h100' : 'fcb h64', 'flex-row']" :style="{ left: `${percentPositions[index]}` }">
                <div class="ft1 font-h" v-html="item.name"></div>
                <!-- <div class="get-line-white"></div> -->
                <div class="font-h">{{ item.value || '--' }}ppm</div>
            </div>
        </div>
        <div class="temperature-bar"></div>
    </div>
</template>
<script setup>
const props = defineProps({
    obj: {
        type: Object,
        default: () => {}
    },
    list: {
        type: Array,
        default: () => []
    },
    isDet: {
        type: Boolean,
        default: false
    },
    rightConfigExpand: {
        type: Boolean,
        default: false
    }
});
const percentPositions = ['20%', '80%'];
</script>
<style lang="less" scoped>
.flex-row {
    position: absolute;
    transform: translateX(-50%);
    flex-direction: column;
    width: 100%;
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
        #8ad1a6 0%,
        #8ad1a6 calc(20% - 1px),
        white calc(20% - 1px),
        white calc(20% + 1px),
        #edc578 calc(20% + 1px),
        #edc578 calc(80% - 1px),
        white calc(80% - 1px),
        white calc(80% + 1px),
        #ef9b96 calc(80% + 1px),
        #ef9b96 100%
    );
    position: relative;
}
.get-line-box {
    width: 100%;
    height: 100%;
}
.get-line-white {
    height: 8px;
    width: 2px;
    background-color: white;
    border-radius: 4px;
}
.w55 {
    width: 55%;
}
.h64 {
    height: 64px;
}
.w97 {
    width: 97%;
}
.font-h {
    height: 19px;
    white-space: normal;
    min-width: 40%;
    text-align: center;
}
</style>
