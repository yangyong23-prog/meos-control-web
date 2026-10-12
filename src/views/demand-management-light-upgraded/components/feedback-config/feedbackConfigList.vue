<template>
    <div>
        <m-collapse v-model="collapseData" class="feedback-collapse-container" :hover-style="true" icon-position="left">
            <template v-for="(rowItem, index) in collapseDataList" :key="rowItem.id">
                <m-collapse-item :id="rowItem?.id" :title="rowItem?.name">
                    <template #title>
                        <div class="collapse-item-title">
                            {{ rowItem.name }}
                        </div>
                    </template>
                    <div>
                        <FeedbackLoopConfigList :ref="ins => (spaceArrIns[index] = ins)" v-model="rowItem.innerList" :is-preview="props.isPreview" :space-id="rowItem?.id" />
                    </div>
                </m-collapse-item>
            </template>
        </m-collapse>
    </div>
</template>
<script setup>
import FeedbackLoopConfigList from './feedbackLoopConfigList.vue';

const props = defineProps({
    isPreview: {
        type: Boolean,
        default: false
    }
});

const spaceArrIns = ref([]);
const validateForm = async () => {
    const allArr = [];
    for (const key in spaceArrIns.value) {
        const curSpace = spaceArrIns.value[key];
        if (curSpace?.validateForm) {
            const resArr = await curSpace.validateForm();
            allArr.push(resArr);
        } else {
            break;
        }
    }
    return allArr;
};

defineExpose({ validateForm });

const collapseDataList = defineModel({ type: Array, default: [] });
const collapseData = defineModel('collapsed-ids', { type: Array, default: [] });
const defaultCollapseIds = computed(() => {
    return collapseDataList.value.map(item => item.id);
});

watch(
    () => defaultCollapseIds.value,
    cur => {
        collapseData.value = cur;
    }
);
</script>
<style lang="less" scoped>
.feedback-collapse-container {
    :deep(.m-collapse-item) {
        display: flex;
        padding: 0px;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        gap: 4px;

        border-radius: 4px;
    }
    :deep(.m-collapse-item__header) {
        width: auto;
        padding: 4px 4px 4px 8px;
        .collapse-item-title {
            color: var(--gray-800, #2e3742);
            font-size: 14px;
            font-style: normal;
            font-weight: 700;
            line-height: 22px; /* 157.143% */
        }
    }
    :deep(.m-collapse-item__wapper) {
        width: 100%;
    }

    :deep(.m-collapse-item__content) {
        padding: 12px 0px;
        padding-top: 0px;
    }
}

:deep(.m-collapse) {
    display: flex;
    flex-direction: column;
    row-gap: 12px;
}
</style>
