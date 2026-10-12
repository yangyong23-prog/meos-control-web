<template>
    <!-- 建筑、楼层 -->
    <template v-if="node?.objType !== 'space' && node?.instanceType !== 'SPACE'">
        <div :class="[isSelectedFloor ? 'selected-floor-node-item' : '']">{{ node.name }}</div>
    </template>
    <!-- 空间 -->
    <template v-else>
        <div v-ellipsis :ellipsis-disabled="node?.name?.length < 19" :class="['m-ellipsis', 'space-node-item']">
            <span v-show="keyword" :class="['highlight']" v-html="highlight(node)"></span>
            <span v-show="!keyword">{{ node.name }}</span>
        </div>
    </template>
</template>
<script setup>
import i18n from '@/localization';
import { nameMatch } from '@/utils/viewUtils';
const props = defineProps({
    node: {
        type: Object,
        default: () => {}
    },
    keyword: {
        type: String,
        default: ''
    },
    selectedFloorId: {
        type: String,
        default: ''
    }
});

const isSelectedFloor = computed(() => {
    return props.node.id === props.selectedFloorId;
});

const highlight = node => {
    if (!props?.keyword) return node.name;
    return nameMatch(node.name, props.keyword);
};
</script>

<style lang="less" scoped>
.highlight {
    ::v-deep span {
        color: var(--primary-color);
    }
}
.selected-floor-node-item {
    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 40px;
        z-index: -1;
        border-radius: 4px;
        background: var(--blue-100, #d9ebff);
    }
}
.space-node-item {
    width: fit-content;
    max-width: 100%;
}
</style>
