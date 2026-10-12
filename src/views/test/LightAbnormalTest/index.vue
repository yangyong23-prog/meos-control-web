<template>
    <div class="abnormal-container" style="width: 100%; height: 100%">
        <AbnormlTest />
        <div class="space-card-container">
            <SpaceHoverCard></SpaceHoverCard>
        </div>
    </div>
</template>
<script setup>
import useLightAbnormal from '../../lightingControl/hooks/useLightAbnormal';
import AbnormlTest from './AbnormlTest.vue';
import SpaceHoverCard from '../../lightingControl/components/SpaceHoverCard.vue';

useLightAbnormal(); // 照明异常事件hook 注入
</script>
<style scoped lang="less">
.abnormal-container {
    display: flex;
    .space-card-container {
        position: relative;
        margin-top: 500px;
        margin-left: 200px;
    }
}
</style>
