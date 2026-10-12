<template>
    <div class="app m-font-reset">
        <router-view />
    </div>
</template>
<script setup>
// import Xsync from '@/utils/Xsync';
// import { INTERFACE_PREFIX_AIM } from '@/config';

// 测试接口
// const getBuildingInfo = params =>
//     Xsync({
//         method: 'get',
//         url: `${INTERFACE_PREFIX_AIM}/project/queryAllBuild`,
//         params
//     });
// getBuildingInfo();
</script>
<style>
.app {
    width: 100%;
    height: 100%;
}
</style>
