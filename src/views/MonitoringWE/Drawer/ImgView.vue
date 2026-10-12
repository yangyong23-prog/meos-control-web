<template>
    <div class="img-warp">
        <m-image-upload :preview="true" :multiple="true" :files="files"></m-image-upload>
    </div>
</template>
<script setup>
const props = defineProps({
    data: {
        type: Object,
        default: () => {}
    }
});

const files = ref([]);

const getFileObjByUrl = file => {
    if (!file) return null;
    const suffix = file.path.split('.').pop();
    return {
        src: file.path,
        type: 'imgage',
        suffix,
        state: 'resolve'
    };
};

watch(
    () => props.data,
    () => {
        const { data } = props;
        if (data) {
            if (data.dataValue?.length) {
                files.value = (data.dataValue || []).map(value => getFileObjByUrl(value)).filter(Boolean);
            } else {
                const obj = getFileObjByUrl(data.dataValue?.url);
                if (obj) {
                    files.value = [obj];
                }
            }
        } else {
            files.value = [];
        }
    },
    {
        immediate: true
    }
);
</script>
<style lang="less" scoped>
.img-warp {
    :deep(.m-image-upload) {
        width: 80px;
        height: 80px;
        display: block;
        overflow: hidden;
        .m-image-upload-item {
            width: 100%;
            height: 100%;
            display: block;
            margin: 0;
            padding: 0;
            border: none;
            border-radius: 2px;
            overflow: hidden;
        }
    }
}
</style>
