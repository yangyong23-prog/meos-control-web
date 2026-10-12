<template>
    <div class="collapse-column-list-container" :style="{ '--show-type-height': `${topGap}px` }">
        <m-scrollbar>
            <m-collapse v-model="collapseIds" icon-position="left">
                <m-collapse-item
                    v-for="item in props.riskList"
                    :id="item.classCode"
                    :key="item.classCode"
                    :hover-style="false"
                    :class="['first-collapse', props.showType === 'tab' ? 'tab-collapse-wrap' : '']"
                >
                    <template #title>
                        <div class="risk-category-name">
                            {{
                                `${item.classCodeName || '--'}
                            (${item?.danegerEventListLength ?? 0})`
                            }}
                        </div>
                    </template>
                    <template #default="{ isActive }">
                        <InnerCollapseContent :active="isActive" :data="item.equipments" :risk-card-show-type="props.riskCardShowType" />
                    </template>
                </m-collapse-item>
            </m-collapse>
        </m-scrollbar>
    </div>
</template>

<script setup>
import InnerCollapseContent from '../widget/InnerCollapseContent.vue';
const props = defineProps({
    riskList: {
        type: Array,
        default: () => []
    },
    showType: {
        type: String,
        // panel、tab(面板或弹窗)
        default: 'panel'
    },
    topGap: {
        type: Number,
        default: 0
    },
    riskCardShowType: {
        type: String,
        // unknown、riskManagement(状态不明、风险管控)
        default: 'unknown'
    }
});

const collapseIds = ref([]);
const firstLevelIds = computed(() => {
    return props.riskList.map(item => item.classCode);
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

.first-collapse {
    padding-right: 16px;
    :deep(& > .m-collapse-item__header) {
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

.tab-collapse-wrap {
    padding-right: 24px;
}

.risk-category-name {
    color: var(--Grey-Grey-900, #1b2129);
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
}
</style>
