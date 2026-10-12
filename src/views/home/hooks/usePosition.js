export default (props, emits) => {
    const boxRef = ref();

    const getTopPx = () => {
        nextTick(() => {
            let scrollHeight = boxRef.value?.scrollHeight || 0;
            if (scrollHeight > 600) {
                emits('topPx', '52px');
            } else {
                emits('topPx', '112px');
            }
        });
    };
    onMounted(() => getTopPx());

    watch(
        () => props.moduleList,
        () => getTopPx(),
        { deep: true, immediate: true }
    );

    return {
        boxRef
    };
};
