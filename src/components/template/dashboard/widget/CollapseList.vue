<template>
    <div
        ref="containerRef"
        class="collapse-list-wrapper"
        :style="{ '--row-cards-show-count': rowCardsShowCount, '--collapse-row-bottom': `${props.collapseRowBottom}px`, ...customStyle }"
    >
        <div
            :class="{
                'collapse-list-content': true,
                'fit-layout': props.fitLayout
            }"
        >
            <m-collapse v-model="collapseData" class="collapse-container" :hover-style="false" icon-position="left" only-icon-click>
                <template v-for="group in gridData" :key="group.id">
                    <m-collapse-item v-if="group?.isShow" :id="group?.id" :title="group?.name">
                        <template v-if="$slots.collapse" #title="{ isActive }">
                            <slot name="collapse" :collapse="{ group, isActive }"></slot>
                        </template>

                        <template v-if="group.children?.length">
                            <GroupCardsContainer
                                v-for="subGroup in group.children"
                                :key="subGroup.id"
                                :group="subGroup"
                                :fit-layout="props.fitLayout"
                                :is-row-fill="props.isRowFill"
                            >
                                <!-- 插槽透传 -->
                                <template v-for="(_, key, index) in $slots" :key="index" #[key]="$props">
                                    <slot :name="key" v-bind="$props"></slot>
                                </template>
                            </GroupCardsContainer>
                        </template>
                        <template v-else>
                            <GroupCardsContainer :group="group" :fit-layout="props.fitLayout">
                                <!-- 插槽透传 -->
                                <template v-for="(_, key, index) in $slots" :key="index" #[key]="$props">
                                    <slot :name="key" v-bind="$props"></slot>
                                </template>
                            </GroupCardsContainer>
                        </template>
                    </m-collapse-item>
                </template>
            </m-collapse>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { useElementSize } from '@vueuse/core';
import GroupCardsContainer from './GroupCardsContainer.vue';

const props = defineProps({
    gridData: {
        type: Array,
        default: () => []
    },
    collapsedKeys: {
        type: Array,
        default: () => []
    },
    filterCollapsedKey: {
        type: String,
        default: ''
    },
    customStyle: {
        type: Object,
        default: () => {}
    },
    fitLayout: {
        type: Boolean,
        default: true
    },
    mediaQueryRules: {
        type: Array,
        //  example:
        //  { minWidth: 1440, cards: 4 }, // ≥1440px 时显示4列
        //  { minWidth: 1100, cards: 3 }, // ≥1100px 时显示3列
        //  { default: true, cards: 2 } // 默认显示2列
        default: () => []
    },
    defaultCardsCount: {
        type: Number,
        default: 4
    },
    isRowFill: {
        type: Boolean,
        default: false
    },
    collapseRowBottom: {
        type: Number,
        default: 12
    }
});

const collapseData = ref([]);
const containerRef = ref(null);
const { width } = useElementSize(containerRef);

const rowCardsShowCount = computed(() => {
    if (props.mediaQueryRules.length) {
        const sortedRules = [...props.mediaQueryRules].sort((a, b) => (b?.minWidth ?? 0) - (a?.minWidth ?? 0));
        const matchedRule = sortedRules.find(rule => width.value >= (rule?.minWidth ?? 0));
        const defaultRule = sortedRules.find(r => r?.default)?.cards || props.defaultCardsCount;
        return matchedRule?.cards ?? defaultRule;
    }
    return props.defaultCardsCount;
});

watch(
    () => props?.collapsedKeys,
    curIds => {
        // 默认展开所有节点
        collapseData.value = curIds;
    },
    {
        immediate: true
    }
);

watch(
    () => props?.filterCollapsedKey,
    cur => {
        if (cur) {
            // 筛选的分组id，默认展开
            const newArr = [...collapseData.value, cur];
            nextTick(() => {
                collapseData.value = [...new Set(newArr)];
            });
        }
    },
    {
        immediate: true
    }
);
</script>

<style lang="less" scoped>
.collapse-list-wrapper {
    height: 100%;
    width: 100%;
    display: flex;

    .collapse-list-content {
        width: 100%;
    }
}
.collapse-container {
    height: 100%;
    padding-bottom: 80px;

    :deep(.m-collapse-item__header) {
        width: fit-content;
        padding-left: 0px;
        padding-block: 3px;
        margin-bottom: var(--collapse-row-bottom);

        color: @grey-800;
        font-size: 18px;
        font-style: normal;
        font-weight: 700;
        line-height: 26px;
        cursor: default;

        .m-collapse-item__header-icon {
            cursor: pointer;
        }
    }
    :deep(.m-collapse-item) {
        & + .m-collapse-item {
            margin-top: 16px;
        }
    }
}

.fit-layout {
    width: 100%;
    :deep(.m-collapse-item__content) {
        display: grid;
        grid-template-columns: repeat(var(--row-cards-show-count), 1fr);
        column-gap: 12px;
        row-gap: 16px;
    }
}

.empty-container {
    min-height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
