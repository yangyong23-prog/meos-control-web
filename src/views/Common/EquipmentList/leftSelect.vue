<template>
    <div class="left-select">
        <div class="fc left-select-title">
            <m-button type="text" size="medium" icon="IconMeriComponentChevronLeft" @click="close">{{ i18n.global.t('meos_control_web.back') }}</m-button>
            <div class="get-line ml4 mr8"></div>
            <div v-ellipsis class="f18 fb7 m-ellipsis">{{ equipmentData || i18n.global.t('meos_control_web.equipment_list') }}</div>
        </div>
        <div v-if="templateLoading" style="padding: 0 13px" class="mt8">
            <m-list-skeleton />
        </div>
        <div v-else class="scrollbar-wrap">
            <m-scrollbar box-class="left-select--item-scrollbar">
                <div class="left-select-item">
                    <template v-if="runningMonitorType === 'KITCHEN_RANGE_HOOD'">
                        <m-tree v-model="currentModel" :data="templateListTree" last-stage @change="clickItemTree">
                            <template #rowSuffix="node">
                                {{ node.totalObjectCount }}
                            </template>
                        </m-tree>
                    </template>
                    <template v-else>
                        <div
                            v-for="(item, index) in templateList"
                            :key="index"
                            class="left-select-item-list fcb f14"
                            :class="{ active: activeIndex == index }"
                            @click="clickItem(item, index)"
                        >
                            <div v-ellipsis class="left-title m-ellipsis">{{ item.templateTypeName }}</div>
                            <div class="ft">{{ item.totalObjectCount }}</div>
                        </div></template
                    >
                </div>
            </m-scrollbar>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
const emits = defineEmits(['close']);
const equipmentData = inject('equipmentData');
const currentItem = inject('currentItem');
const currentModel = ref([]);
const activeIndex = ref(0);
const props = defineProps({
    templateList: {
        type: Array,
        default: () => []
    },
    templateListTree: {
        type: Array,
        default: () => []
    },
    templateLoading: {
        type: Boolean,
        default: false
    },
    runningMonitorType: {
        type: String,
        default: ''
    }
});
const close = () => {
    emits('close');
};

const clickItem = (item, index) => {
    currentItem.value = item;
    activeIndex.value = index;
};

const clickItemTree = (ids, selectNode, currentNode) => {
    if (currentNode) {
        currentItem.value = currentNode;
        currentModel.value = ids;
    }
};

// 只适用于列表
watch(
    [currentItem, () => props.templateList],
    () => {
        activeIndex.value = props.templateList?.findIndex(item => item.templateTypeId === currentItem.value?.templateTypeId) || 0;
    },
    {
        immediate: true
    }
);

watchEffect(() => {
    currentModel.value = [currentItem?.value?.id];
});
</script>
<style lang="less" scoped>
.left-select {
    width: 240px;
}
.scrollbar-wrap {
    height: 100%;
    padding-bottom: 60px;
    /deep/.left-select--item-scrollbar {
        .m-scrollbar__content {
            height: 100%;
        }
    }
}
.left-select {
    height: 100%;
    background: var(--gray-100, #f1f4f6);
    &-title {
        padding: 8px 12px 8px 8px;
        border-bottom: 1px solid var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
    }
    &-item {
        padding: 8px 13px 20px 8px;
        min-height: 100%;
        height: 100%;
        user-select: none;
        &-list {
            padding: 9px 12px;
            border-radius: 4px;
            &:hover {
                background: rgba(196, 201, 207, 0.3);
                cursor: pointer;
                .left-title {
                    color: #1b2129;
                }
            }
        }
        .active {
            background: #d9ebff;
            cursor: default;
            .left-title {
                font-weight: 700;
                color: #246fe5;
            }
        }
    }
}

.get-line {
    width: 1px;
    height: 16px;
    background-color: var(--gray-400, #c4c9cf);
}
</style>
