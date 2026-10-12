<template>
    <div class="container">
        <div class="header"></div>

        <div ref="scroll1" class="scroll1">
            <div class="rect3"></div>
            <!-- <div v-for="i in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]" :key="i" class="rect4"></div> -->
            <div ref="reac1" class="rect1"></div>
            <!-- <div v-for="i in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]" :key="i" class="rect4"></div> -->
        </div>

        <div ref="scroll" class="scroll">
            <div ref="reac2" class="rect2"></div>
            <div class="rect3"></div>
            <div v-for="i in [1, 2, 3, 4, 5, 6, 7]" :key="i" class="rect4"></div>
        </div>

        <Line :start-config="startConfig" :end-config="endConfig" :grow-animation="true"></Line>
    </div>
</template>

<script setup>
import Line from './index.vue';

const reac1 = ref();
const reac2 = ref();
const scroll = ref();
const scroll1 = ref();

const startConfig = computed(() => {
    return {
        dom: reac1.value,
        scrollCintainer: scroll1.value
    };
});

const endConfig = computed(() => {
    return {
        dom: reac2.value,
        height: 0,
        offsetX: -10,
        offsetY: 0,
        scrollCintainer: scroll.value
    };
});

const click1 = () => {};
const click2 = () => {};
</script>

<style lang="less" scoped>
.header {
    width: 100%;
    height: 40px;
    background-color: aquamarine;
}
.container {
    padding-top: 40px;
    width: 100%;
    height: 100%;
    position: relative;
    // pointer-events: none;

    .scroll1 {
        overflow: scroll;

        position: absolute;
        width: 200px;
        height: 800px;
        left: 100px;
        top: 100px;
    }

    .rect1 {
        width: 200px;
        height: 200px;
        background-color: red;
    }

    .scroll {
        overflow: scroll;

        position: absolute;
        width: 200px;
        height: 300px;
        left: 600px;
        top: 600px;
    }

    .rect2 {
        width: 200px;
        height: 100px;
        background-color: green;
    }
    .rect3 {
        width: 200px;
        height: 100px;
        background-color: yellow;
    }
    .rect4 {
        width: 200px;
        height: 100px;
        background-color: pink;
    }

    .draw-rect {
        position: absolute;
    }
}
</style>
