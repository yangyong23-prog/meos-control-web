<template>
    <m-collapse-item
        v-if="renderedCards?.length"
        :id="group?.id"
        :title="group?.name"
        :style="{ '--item-index': !props?.withScroll && props.index === 1 ? '0' : `${props.index}` }"
    >
        <template #title>
            <div :class="{ 'group-title': true }">{{ props.group.name }}</div>
        </template>
        <div class="cards-list" :style="{ paddingBottom: props.index === 0 ? '8px' : '0px' }">
            <template v-for="card in renderedCards" :key="card.exceptionEventId">
                <AbnormalCard :card="card" @hover-abnormal-item="hoverAbnormalItem" @unhover-abnormal-item="unhoverAbnormalItem"></AbnormalCard>
            </template>
        </div>
    </m-collapse-item>

    <div v-if="props.index === 0 && props.withScroll" class="remain-scroll-collapse-header">
        <m-collapse-item v-if="renderedCards?.length" :id="group?.id" :title="group?.name">
            <template #title>
                <div :class="{ 'group-title': true }">{{ props.group.name }}</div>
            </template>
        </m-collapse-item>
    </div>
</template>

<script setup>
import AbnormalCard from './abnormal-card.vue';
const props = defineProps({
    group: {
        type: Object,
        default: () => {}
    },
    index: {
        type: Number,
        default: 0
    },
    withScroll: {
        type: Boolean,
        default: true
    }
});

const emits = defineEmits(['hover-abnormal-item', 'unhover-abnormal-item']);

const hoverAbnormalItem = item => {
    emits('hover-abnormal-item', item);
};

const unhoverAbnormalItem = () => {
    emits('unhover-abnormal-item');
};

const renderedCards = ref([]);
const pendingCards = ref([]);

const idleCallbackId = ref(null);
const isRendering = ref(false);

const renderBatch = () => {
    if (!isRendering.value) {
        return;
    }
    const batch = pendingCards.value.splice(0, 20); // 每次渲染20个
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
    pendingCards.value = [...(props.group?.cards || [])];
    renderedCards.value = [];

    renderBatch();
};

onMounted(() => {
    timeSlicing();
});

watch(
    () => props.group?.cards,
    () => {
        timeSlicing();
    }
);

onUnmounted(() => {
    stopRendering();
});
</script>

<style lang="less" scoped>
:deep(.m-collapse-item__header) {
    padding-left: 0px;
    padding-block: 3px;

    position: sticky;
    top: calc(var(--sticky-top) + var(--item-index) * 28px);
    z-index: 1;
    background-color: white;
    border-radius: 0px;

    &:hover {
        &::after {
            content: '';
            position: absolute;
            top: 0px;
            left: 0px;
            width: 100%;
            height: 100%;
            background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
            border-radius: 4px;
            z-index: 1;
        }
    }
}

:deep(.m-collapse-item__header-icon) {
    width: 16px;
    height: 16px;
    z-index: 6;

    &:hover {
        background-color: rgba(196, 201, 207, 0.3);
        svg {
            fill: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
        }
    }
}

:deep(.m-collapse-item) {
    & + .m-collapse-item {
        margin-top: 8px;
    }
}

.group-title {
    color: var(--gray-800, #2e3742);

    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;
}

.cards-list {
    padding-top: 8px;
    display: flex;
    flex-direction: column;
    row-gap: 8px;
}

.remain-scroll-collapse-header {
    position: absolute;
    top: 0px;
    left: 0px;
    right: 16px;
}
</style>
