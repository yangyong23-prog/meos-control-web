<template>
    <div class="graph-select" tabindex="1" :class="{ 'is-open': open }" @blur="open = false">
        <div class="graph-select-trigger" @click="open = !open">
            <!-- <img v-show="hasIcon" class="icon-title" src="@/assets/images/operateMonitoring/slogen.png" /> -->
            <span v-ellipsis class="choose-text m-ellipsis">{{ defaultGraph.localName ?? '--' }}</span>
            <SolidArrow v-if="options.length > 2" class="icon svg-icon icon-arrow" :class="{ open: open }" />
        </div>
        <div v-if="options.length > 2" class="graph-select-option">
            <m-scrollbar ref="scrollbar" :max-height="'500px'" class="graph-select-scrollbar">
                <div
                    v-for="li in options"
                    :key="li.key"
                    :class="[li.isGroup ? 'group-name' : 'select-item', li.key === defaultGraph?.key ? 'selected' : '']"
                    @click.stop="choose(li)"
                >
                    {{ li.localName ?? '--' }}
                </div>
            </m-scrollbar>
        </div>
    </div>
</template>
<script setup>
// 直接引入箭头 SVG，避免依赖全局图标符号。
import SolidArrow from '@/assets/svg/solid-arrow.svg';

const props = defineProps({
    hasIcon: {
        type: Boolean,
        default: true
    },
    options: {
        type: Array,
        default: () => []
    },
    defaultGraph: {
        type: Object,
        default: null
    }
});

const emit = defineEmits(['change']);

const open = ref(false);

const scrollbar = ref();

watch(open, () => {
    if (open.value) {
        nextTick(() => {
            scrollbar.value.update();
            scrollbar.value.setScrollTop(0);
        });
    }
});

const choose = item => {
    if (item.isGroup) return;
    open.value = false;
    emit('change', item);
};
onUnmounted(() => {
    scrollbar.value = null;
});
</script>
<style lang="less" scoped>
.SPACE_3D_GRAPH .choose-text {
    color: @white !important;
}

.graph-select {
    position: relative;

    &.is-open {
        .graph-select-option {
            display: flex;
            opacity: 1;
        }
    }
    .graph-select-trigger {
        display: flex;
        align-items: center;
        padding: 0 16px;
        height: 40px;
        cursor: pointer;
        .icon-title {
            width: 32px;
            height: 32px;
            margin-right: 8px;
            transform: scale(1.2);
        }
        .choose-text {
            font-size: 18px;
            font-weight: bold;
            color: var(--gray-800);
            max-width: 400px;
        }
        .icon-arrow {
            width: 24px;
            height: 24px;
            margin-left: 4px;
            transition: transform 0.2s ease;

            &.open {
                transform: rotate(180deg);
            }
        }
    }

    .graph-select-option {
        position: absolute;
        top: 100%;
        left: 40px;
        width: 198px;
        padding: 8px 0;
        background-color: #fff;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
        flex-direction: column;
        border-radius: 4px;
        gap: 4px;
        z-index: var(--z-index-select-dropdown);
        display: none;
        opacity: 0;
        transition: opacity 0.2s ease;

        .graph-select-scrollbar {
            max-height: calc(100vh - 100px);
            :deep(.m-scrollbar__box--hidden-default) {
                max-height: calc(100vh - 100px);
                padding: 0 8px;
            }
            :deep(.m-scrollbar__bar.is-horizontal) {
                right: 0;
            }
        }
        .select-item {
            padding: 8px 10px;
            font-size: 14px;
            color: var(--gray-900);
            cursor: pointer;
            border: 4px;
            &:hover {
                background-color: var(--gray-100);
            }

            &.selected {
                background-color: var(--blue-100);
                color: var(--blue-500);
                font-weight: bold;
            }
        }

        .group-name {
            color: var(--gray-500);
            font-size: 12px;
            padding: 4px 10px;
        }
    }
}
</style>
