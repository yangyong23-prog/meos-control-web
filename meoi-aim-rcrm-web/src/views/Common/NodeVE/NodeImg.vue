<template>
    <img v-if="fileUrl" :src="fileUrl" class="node-img" />
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';
import { ApmFile } from 'yushu-js-utils';

const props = defineProps({
    fileId: {
        type: String,
        default: ''
    }
});

const fileUrl = ref('');

watch(
    () => props.fileId,
    async () => {
        if (props.fileId) {
            if (props.fileId.indexOf('.') > -1) {
                fileUrl.value = props.fileId;
            } else {
                try {
                    const res = await ApmFile.getFileInfo(props.fileId);
                    fileUrl.value = res.persisFileDownloadUrl;
                } catch (error) {
                    console.log(error);
                }
            }
        }
    },
    {
        immediate: true
    }
);
</script>
<style lang="scss" scoped>
.node-img {
    width: 100%;
    height: 100%;
}
.img-loading-warp {
    width: 100%;
    height: 100%;
}
</style>
