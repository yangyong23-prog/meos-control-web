<template>
    <div class="monitor-player-test-warp">
        <MonitorPlayer
            :select-obj="testObj"
            :offline-status="false"
            @close="
                () => {
                    console.log('q12212');
                }
            "
        ></MonitorPlayer>
    </div>
</template>
<script setup>
import MonitorPlayer from '../../Common/MonitorPlayer/index.vue';
const testObj = ref({
    id: 'Eq74803828245263ecac1c51473c962f987a8973e5e0',
    manufacturer: 'xxx大华xxx',
    localName: 'F1_监控摄像头南_43'
});

// const mockEnv = ref({
//     baseUrl: 'https://xc-njjy.meosedge.com/iot-hub-server-edge',
//     groupCode: 'XC',
//     projectId: 'Pj3201050003'
// });
</script>
<style lang="less">
.monitor-player-test-warp {
    padding: 50px;
}
</style>
