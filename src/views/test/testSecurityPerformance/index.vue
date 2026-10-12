<template>
    <div class="test-security-warp">
        <SpaceSecurityControl v-if="show" />
        <div class="toogle-show-btn" @click="toogleShowControl">切换销毁重建</div>
    </div>
</template>
<script setup>
import SpaceSecurityControl from '../../SpaceSecurityControl/index.vue';

const show = ref(true);

const toogleShowControl = () => {
    show.value = !show.value;
};
</script>
<style lang="less">
.test-security-warp {
    position: relative;
    width: 100%;
    height: 100%;
    .toogle-show-btn {
        position: absolute;
        top: 10px;
        right: 20px;
        width: 100px;
        height: 30px;
        line-height: 30px;
        height: 32px;
        line-height: 32px;
        background-color: #fff;
        text-align: center;
        z-index: 999999;
        border-radius: 4px;
        box-shadow: 4px 4px 10px 0px rgba(27, 33, 41, 0.1);
        cursor: pointer;
    }
}
</style>
