<template>
    <div class="expandable-panel" :class="{ 'is-expanded': expanded }">
        <div class="expandable-panel-content" :style="`height: ${scrollHeight}px`">
            <m-scrollbar ref="content" :height="maxHeight" :max-height="maxHeight" :class="{ 'expandable-panel-noscrollbar': !expanded }">
                <slot></slot>
            </m-scrollbar>
        </div>
        <div v-if="showExpand" class="expandable-panel-button fcc" @click="toggleExpand">
            <slot name="expand-btn" :expanded="expanded">
                <div class="btn-box fcc">
                    {{ expanded ? i18n.global.t('meos_control_web.collapse') : i18n.global.t('meos_control_web.view_more') }}
                    <IconMeriComponentChevronDown size="14" color="#246FE5" style="margin-left: 4px" />
                </div>
            </slot>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { IconMeriComponentChevronDown } from 'meri-icon';
import { throttle } from 'lodash';
const emit = defineEmits(['expand']);
// 定义props
const props = defineProps({
    defaultHeight: {
        type: Number,
        default: 0
    },
    showExpand: {
        type: Boolean,
        default: true
    },
    maxHeight: {
        type: Number,
        default: 0
    }
});
const content = ref();
const expanded = ref(false);
const collapsedHeight = ref(props.defaultHeight);

const scrollHeight = computed(() => {
    return expanded.value ? collapsedHeight.value : props.defaultHeight;
});

// 切换展开状态
const toggleExpand = () => {
    expanded.value = !expanded.value;
    if (!expanded.value) {
        // 滚动到顶部
        content.value.boxRef.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    emit('expand', expanded.value);
};
let containerDom, containerDomResizeObserver;

onMounted(() => {
    containerDom = content.value.boxRef.querySelector('.m-scrollbar__content');

    containerDomResizeObserver = new ResizeObserver(
        throttle(entries => {
            const domChage = entries.find(e => e.target === containerDom);
            if (domChage) {
                collapsedHeight.value = Math.min(domChage.contentRect.height, props.maxHeight);
            }
        }, 16)
    );

    containerDomResizeObserver.observe(containerDom);
});

onUnmounted(() => {
    containerDomResizeObserver.unobserve(containerDom);
});
</script>

<style lang="less" scoped>
.box {
    position: absolute;
    content: '';
    top: 50%;
    transform: translateY(-50%);
    height: 1.5px;
    width: calc(50% - 36px);
}
.expandable-panel {
    width: 100%;
    padding-bottom: 4px;
    position: relative;
    &-content {
        overflow: hidden;
        transition: height 0.3s ease;
        box-sizing: content-box;
    }

    &-header {
        cursor: pointer;
        .btn-box {
            background-color: transparent;
        }
    }
    &-button {
        white-space: nowrap;
        margin: 12px 0 4px 0;
        height: 32px;
        left: 0;
        right: 0;
        position: absolute;
        bottom: 0;
        color: var(--blue-500, #246fe5);
        cursor: pointer;
        background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #fff 63.28%);
    }
    &.is-expanded {
        .expandable-panel-content {
        }
        svg {
            transform: rotate(180deg);
        }
        .expandable-panel-header {
            background: transparent;
        }
    }
    .btn-box {
        height: 100%;
        padding: 5px 8px;
        border-radius: 4px;
    }
    svg {
        transition: transform 0.3s ease;
    }
    :deep(.expandable-panel-noscrollbar) {
        &.m-scrollbar .m-scrollbar__box {
            overflow: hidden;
        }
        .m-scrollbar__bar {
            display: none !important;
        }
    }
}
</style>
