<template>
    <div :id="'loading-id-' + id" class="loading-dd"></div>
</template>
<script setup>
import { MLoading } from 'meri-plus';
import { onBeforeUnmount } from 'vue';
const props = defineProps({
    id: {
        type: String,
        default: '1'
    }
});
let lodingInstance = null;

onMounted(() => {
    // MLoading.service({
    //     target,
    //     fullscreen: false,
    //     duration: 30000,
    //     lottieName: 'ball',
    //     loadTextOptions: {
    //         text: '加载中',
    //         style: {
    //             top: '-15px'
    //         }
    //     },
    //     loadIconStyle: {
    //         width: '100px',
    //         height: '100px'
    //     }
    // });

    lodingInstance = MLoading.service({
        target: '#loading-id-' + props.id,
        fullscreen: false,
        duration: 30000,
        lottieName: 'ball',
        loadIconStyle: {
            width: '100px',
            height: '100px'
        }
    });
});

onBeforeUnmount(() => {
    console.log(lodingInstance?.vm);
    console.log(lodingInstance?.vm?.unmount);
    lodingInstance?.destroy();
    lodingInstance?.vm?.unmount();
    console.log('销毁了。。。');
});
</script>
<style lang="less">
.loading-dd {
    width: 100%;
    height: 100%;
}
</style>
