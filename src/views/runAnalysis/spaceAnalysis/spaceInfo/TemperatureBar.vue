<template>
    <div :style="{ width: '100%', height: isDet ? '100%' : '' }" :class="['mt40', 'box-line', 'fcc']">
        <div class="fcb f14 mb4 box-line-item">
            <div v-for="(item, index) in list" :key="index" :class="['fcb h64']" style="flex-direction: column; min-width: 22%">
                <div v-ellipsis class="ft1 name">{{ item.name }}</div>
                <div class="get-line-white"></div>
                <div>{{ item.value }}℃</div>
            </div>
        </div>
        <div class="temperature-bar"></div>
    </div>
</template>
<script setup>
defineProps({
    list: {
        type: Array,
        default: () => []
    },
    isDet: {
        type: Boolean,
        default: false
    }
});
</script>
<style lang="less" scoped>
.box-line {
    position: relative;
    &-item {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: transparent;
        z-index: 2;
        gap: 12px;
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
    background: linear-gradient(90deg, #246fe5 6.88%, #8edbab 37.44%, #8edbab 63.8%, #f55047 93.17%);
    position: relative;
}
.get-line-box {
    width: 100%;
    height: 100%;
}
.name {
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
    text-align: center;
}
.get-line-white {
    height: 8px;
    width: 2px;
    background-color: white;
    border-radius: 4px;
}
.h64 {
    height: 64px;
}
.w97 {
    width: 97%;
}
</style>
