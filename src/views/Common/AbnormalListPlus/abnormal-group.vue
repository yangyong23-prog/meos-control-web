<template>
    <m-collapse v-model="collapseData" class="collapse-container" :style="{ '--sticky-top': `${props.stickyTop}px` }" :hover-style="false" icon-position="left">
        <template v-for="(group, index) in props.groupData" :key="group.id">
            <CollapseItem
                :group="group"
                :index="filterGroupLength < 2 ? 0 : index"
                :with-scroll="withScroll"
                @hover-abnormal-item="hoverAbnormalItem"
                @unhover-abnormal-item="unhoverAbnormalItem"
            ></CollapseItem>
        </template>
    </m-collapse>
</template>

<script setup>
import CollapseItem from './abnormal-group-collapse-item.vue';
const props = defineProps({
    groupData: {
        type: Array,
        default: () => []
    },
    stickyTop: {
        type: Number,
        default: 0
    },
    withScroll: {
        type: Boolean,
        default: true
    }
});

const emits = defineEmits(['hover-abnormal-item', 'unhover-abnormal-item']);
const collapseData = ref([]);
const allCollapseKeys = computed(() => {
    return props.groupData.map(item => item.id);
});

const filterGroupLength = computed(() => {
    return props.groupData?.filter(s => s?.cards?.length)?.length;
});

const hoverAbnormalItem = item => {
    emits('hover-abnormal-item', item);
};

const unhoverAbnormalItem = () => {
    emits('unhover-abnormal-item');
};

watch(
    () => allCollapseKeys.value,
    cur => {
        nextTick(() => {
            collapseData.value = cur;
        });
    },
    {
        immediate: true
    }
);
</script>

<style lang="less" scoped>
.collapse-container {
    :deep(.m-collapse-item) {
        & + .m-collapse-item {
            margin-top: 8px;
        }
    }
}
</style>
