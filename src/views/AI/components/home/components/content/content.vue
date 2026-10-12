<template>
    <div class="AI-home-content">
        <LeftThree class="content-left"></LeftThree>
        <FinalSelection class="content-right"> </FinalSelection>
    </div>
</template>

<script setup>
import LeftThree from './components/leftThree.vue';
import FinalSelection from './components/finalSelection.vue';
</script>

<style lang="less" scoped>
.AI-home-content {
    position: absolute;
    top: 120px;
    width: 100%;
    height: calc(100% - 120px);
    overflow: hidden;
    .content-left {
        display: inline-block;
        box-sizing: border-box;
        height: 100%;
        vertical-align: top;
    }
    .content-right {
        // max-height: calc(100% - 20px);
        vertical-align: top;
        display: inline-block;
        box-sizing: border-box;
        border-radius: 12px;
        border: 2px solid #008cea;
        margin-bottom: 20px;
        background: linear-gradient(90deg, rgba(43, 115, 231, 0.32) 0%, rgba(149, 115, 253, 0.32) 100%), #fff;
        box-shadow: 0px 4px 24px 0px rgba(99, 148, 230, 0.12);
    }
}
@media screen and(max-width: 1440px) {
    .AI-home-content {
        overflow-x: scroll;
        padding: 0px 12px;
        .content-left {
            width: calc(100% - 312px);
        }
        .content-right {
            margin-left: 12px;
            width: 300px;
        }
    }
}

@media screen and(min-width: 1440px) {
    .AI-home-content {
        padding: 0px 12px;
        .content-left {
            width: calc(100% - 292px);
        }
        .content-right {
            margin-left: 12px;
            width: 280px;
        }
    }
}
@media screen and(min-width: 1600px) {
    .AI-home-content {
        padding: 0px 12px;
        .content-left {
            box-sizing: border-box;
            width: calc(82% - 16px);
        }
        .content-right {
            box-sizing: border-box;
            margin-left: 16px;
            width: 18%;
        }
    }
}
@media screen and(min-width: 1920px) {
}
</style>
