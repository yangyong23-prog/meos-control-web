<template>
    <div class="monitor-player-warp">
        <button @click="doPlay">显示</button>
        <button @click="doClose">关闭</button>
        <button @click="doChangeObjIds">改ID</button>
        <div v-if="showPlayer" :style="{ padding: '20px', backgroundColor: 'lightblue' }">
            <MutiplePlayer
                v-model:current-split="currentSplit"
                :title="'监控视频11'"
                :palyback-default-date="new Date(Date.now() - 10 * 60 * 60 * 1000)"
                :layout="layout"
                :env-config="config"
                :object-ids="objIds"
                :show-close-btn="false"
                @close="closePlayer"
            ></MutiplePlayer>
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue';
import { MutiplePlayer } from 'yushu-component-web';
// import 'yushu-component-web/dist/index.css';
const config = {
    baseUrl: 'https://edge.jrzjbsh.cn:9002/iot-hub-server-edge',
    projectId: 'Pj1101050059',
    groupCode: 'JRZJBJ',
    bdtpBaseUrl: 'https://ops.jrzjbsh.cn:9001/dtp-rwd-server',
    hikSzBasePath: './bin',
    token: ''
};

const layout = [1, 2, 3, 4];

const objIds = ref([
    'Eq1101050059d7f6f241017646d18ae8ff04f7f8767d',
    'Eq1101050059c404733aac9344edb34eedb0bd040c36',
    'Eq110105005962538a78b5f5456293eb9f9b8d4c4aff',
    'Eq11010500592b45ff244d2444de90d0b3da9bd9e841',
    'Eq1101050059cd3827d9d31d4da99133e5eb76f54a59',
    'Eq1101050059b61c99432b60482983368f7468a1f1ab',
    'Eq11010500593e74044a3b7e4f0eb3fa01eb8134bc98',
    'Eq11010500597a617414ace04b9fbdb4c2355826c394',
    'Eq110105005927096f226576411c9b4aaecdb9e17f11',
    'Eq110105005952b8fca3efc84d90a2a97c485f50fa28',
    'Eq1101050059bbc8e9983e604d1bb745cf2729bfa40a',
    'Eq110105005907fc5b7baf1146458777f99360d031d0',
    'Eq11010500595355f32fd5534a91acccea9977275a43',
    'Eq1101050059635eba41e6c44b33bd1e332868e3d27e',
    'Eq1101050059712842b0fc8d4984bd2982f49adde83f',
    'Eq110105005952ae615db5494b20b0b705c6e3b6cba8',
    'Eq1101050059538e77aefcf040b3bf0d3236bdbc3bc6',
    'Eq1101050059737b92a48b3c44f0855b6d4fa3207ff8',
    'Eq1101050059f80c3c1a953f492d98614f85c317fac9',
    'Eq110105005906ccb9244ee1441094a930dabb630644',
    'Eq11010500591826803c0bab4ffe9a21331a3a8bf94a'
]);

const showPlayer = ref(false);

const closePlayer = () => {
    showPlayer.value = false;
};

const doClose = () => {
    showPlayer.value = false;
};

const doPlay = () => {
    showPlayer.value = true;
};
const doChangeObjIds = () => {
    objIds.value = [
        'Eq11010500592b45ff244d2444de90d0b3da9bd9e841',
        'Eq1101050059cd3827d9d31d4da99133e5eb76f54a59',
        'Eq1101050059b61c99432b60482983368f7468a1f1ab',
        'Eq11010500593e74044a3b7e4f0eb3fa01eb8134bc98',
        'Eq11010500597a617414ace04b9fbdb4c2355826c394',
        'Eq110105005927096f226576411c9b4aaecdb9e17f11',
        'Eq110105005952b8fca3efc84d90a2a97c485f50fa28',
        'Eq1101050059bbc8e9983e604d1bb745cf2729bfa40a',
        'Eq110105005907fc5b7baf1146458777f99360d031d0'
    ];
};

const currentSplit = ref(2);

const doChange4 = () => {
    currentSplit.value = 4;
};
</script>
<style lang="scss" scoped>
.monitor-player-warp {
    padding: 50px;
    width: 70%;
    height: 100%;
    :deep(.container) {
    }
}
</style>
