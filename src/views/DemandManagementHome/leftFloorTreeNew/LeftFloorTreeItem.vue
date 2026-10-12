<template>
    <div :id="`tree_node_${props?.node?.id}`" :class="['left-floor-tree-item', 'fcb']">
        <!-- 项目层级 -->
        <template v-if="node.lv === 0">
            <div v-ellipsis class="m-ellipsis tree-item-name">
                {{ node.name }}
            </div>
            <div class="config-title fc">
                <div class="config-ball"></div>
                <span>{{ i18n.global.t('meos_control_web.special_config') }}</span>
            </div>
        </template>
        <!-- 楼层建筑 -->
        <template v-else-if="node.lv <= 2">
            <div v-ellipsis class="m-ellipsis tree-item-name">
                <div v-if="showCustomConfigFlag(node.id)" class="config-ball"></div>
                {{ node.name }}
            </div>
        </template>
        <!-- 空间 -->
        <template v-else>
            <div v-ellipsis class="m-ellipsis" style="min-height: 22px; line-height: 22px">
                <div v-if="showCustomConfigFlag(node.id)" class="config-ball"></div>
                {{ node.name }}
            </div>
        </template>
    </div>
</template>
<script setup>
import i18n from '@/localization';
// node:{id,name,lv}
const props = defineProps({
    node: {
        type: Object,
        default: () => {}
    },
    customConfigIds: {
        type: Array,
        default: () => []
    },
    shieldedSpaceIds: {
        type: Array,
        default: () => []
    }
});

const showCustomConfigFlag = computed(() => id => props?.customConfigIds?.includes(id));
</script>

<style lang="less" scoped>
.left-floor-tree-item {
    height: 100%;
    padding-right: 12px;

    .config-title {
        font-weight: normal;
        color: var(--gray-600);
        flex-shrink: 0;
    }
    .config {
        font-weight: normal;
        color: var(--gray-600);
    }
    .config-ball {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #facd73;
        margin-right: 4px;
        display: inline-block;
    }
    .tree-item-name {
        height: 22px;
        line-height: 22px;
        padding-right: 8px;
    }
    :deep(.m-tag.m-tag-small) {
        font-weight: normal;
    }
}
</style>
