<!-- eslint-disable vue/no-v-html -->
<template>
    <div :class="['tree-item', 'fcb']">
        <div v-if="!keyword" v-ellipsis class="m-ellipsis tree-item-name">
            {{ node.localName ?? '--' }}
        </div>
        <div v-else v-ellipsis class="m-ellipsis tree-item-name highlight" v-html="highlight(node)"></div>
        <m-tag v-if="node.isCfg" color="#E68600" bg-color="#FFF0CC" size="small">{{ i18n.global.t('meos_control_web.configured') }}</m-tag>
    </div>
</template>

<script setup>
import i18n from '@/localization';
const props = defineProps({
    node: { type: Object, default: () => ({}) },
    keyword: { type: String, default: null }
});

const highlight = node => {
    return node.localName ? node.localName.replace(new RegExp(props.keyword, 'g'), `<span>${props.keyword}</span>`) : '--';
};
</script>
<style lang="less" scoped>
.tree-item {
    height: 100%;

    .config {
        font-weight: normal;
        color: var(--gray-600);
    }
    .tree-item-name {
        height: 22px;
        line-height: 22px;
        padding-right: 8px;
    }
    .highlight {
        ::v-deep span {
            color: var(--primary-color);
        }
    }
    :deep(.m-tag.m-tag-small) {
        font-weight: normal;
    }
    .control-space {
        margin-left: 12px;
        width: 56px;
        .control-space-btn {
            display: none;
            font-size: 12px;
            padding: 4px;
            color: var(--blue-500);
            background-color: rgba(196, 201, 207, 0.3);
            border-radius: 4px;
            font-weight: normal;
        }
        &:hover {
            .control-space-btn {
                display: inline-flex;
            }
            .m-tag {
                display: none;
            }
        }
    }
}
</style>
