export const useIdleRenderCards = (props, limitRenderCount = 20) => {
    const renderedCards = ref([]);
    const pendingCards = ref([]);

    const idleCallbackId = ref(null);
    const isRendering = ref(false);

    const renderBatch = () => {
        if (!isRendering.value) {
            return;
        }
        const batch = pendingCards.value.splice(0, limitRenderCount); // 每次渲染xx个
        renderedCards.value.push(...batch);

        if (pendingCards.value.length > 0) {
            // 继续渲染剩余卡片
            idleCallbackId.value = requestIdleCallback(renderBatch);
        } else {
            // 渲染完成
            isRendering.value = false;
        }
    };

    const stopRendering = () => {
        isRendering.value = false;
        if (idleCallbackId.value) {
            cancelIdleCallback(idleCallbackId.value);
            idleCallbackId.value = null;
        }
    };

    const timeSlicing = () => {
        // 取消正在进行的渲染
        stopRendering();

        isRendering.value = true;
        pendingCards.value = [...(props.data || [])];
        renderedCards.value = [];

        renderBatch();
    };

    onUnmounted(() => {
        stopRendering();
    });
    return {
        renderedCards,
        timeSlicing
    };
};
