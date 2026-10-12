<template>
    <span class="double-star-svg">
        <DoubleStartBigSvg class="big-star"></DoubleStartBigSvg>
        <DoubleStartSmallSvg class="small-star"></DoubleStartSmallSvg>
    </span>
</template>
<script setup>
import DoubleStartBigSvg from '@/assets/svg/double_star_big.svg';
import DoubleStartSmallSvg from '@/assets/svg/double_star_small.svg';
</script>
<style lang="less" scoped>
.double-star-svg {
    position: relative;
    display: inline-block;
    width: 30px;
    height: 20px;
    overflow: hidden;
    .big-star {
        position: absolute;
        left: 2px;
        bottom: 2px;
        animation: identifier 2s linear infinite;
        transform-origin: 50% 50%;
    }
    .small-star {
        position: absolute;
        right: 0px;
        top: 0px;
        animation: identifier 2s linear infinite;
    }
    @keyframes identifier {
        0% {
            transform: rotateZ(0deg);
        }
        100% {
            transform: rotateZ(360deg);
        }
    }
}
</style>
