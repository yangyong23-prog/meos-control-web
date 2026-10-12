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

const getFileObjByUrl = fileUrl => {
    if (!fileUrl) return null;
    const suffix = fileUrl.split('.').pop();
    return {
        src: fileUrl,
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
            if (data.fieldMeta?.multiple) {
                files.value = (data.rawValue || []).map(value => getFileObjByUrl(value.url)).filter(Boolean);
            } else {
                const obj = getFileObjByUrl(data.rawValue?.url);
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
