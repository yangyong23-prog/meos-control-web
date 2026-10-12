<template>
    <div class="collapse-column-list-container" :style="{ '--show-type-height': `${topGap}px` }">
        <m-scrollbar>
            <m-collapse v-model="collapseIds" icon-position="left" :class="['first-collapse-container', 'tab-collapse-container']">
                <m-collapse-item v-for="item in props.riskList" :id="item.dangerEventId" :key="item.dangerEventId" :hover-style="false">
                    <template #title>
                        <div class="risk-category-name">{{ `${item.dangerEventName} (${item.instances?.length ?? 0})` }}</div>
                    </template>
                    <template #default="{ isActive }">
                        <InnerCollapseContentWithName :active="isActive" :data="item.instances" />
                    </template>
                </m-collapse-item>
            </m-collapse>
        </m-scrollbar>
    </div>
</template>

<script setup>
import InnerCollapseContentWithName from '../widget/InnerCollapseContentWithName.vue';
const props = defineProps({
    riskList: {
        type: Array,
        default: () => []
    },
    topGap: {
        type: Number,
        default: 0
    }
});

const collapseIds = ref([]);
const firstLevelIds = computed(() => {
    return props.riskList.map(item => item.dangerEventId);
});

watch(
    () => firstLevelIds.value,
    curIds => {
        collapseIds.value = curIds;
    },
    {
        immediate: true
    }
);
</script>

<style lang="less" scoped>
.collapse-column-list-container {
    height: calc(100% - var(--show-type-height));
    padding-top: 4px;
    padding-bottom: 16px;
}
.first-collapse-container {
    padding-right: 16px;
    :deep(& > .m-collapse-item) {
        & > .m-collapse-item__header {
            display: flex;
            justify-content: flex-start;
            align-items: flex-start;
            line-height: 24px;
            height: fit-content;
            padding: 11px 0;
            gap: 4px;
            &:hover {
                background-color: transparent;
            }
        }
    }
}
.tab-collapse-container {
    padding-right: 24px;
}
.risk-category-name {
    color: var(--Grey-Grey-900, #1b2129);
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
}
</style>
