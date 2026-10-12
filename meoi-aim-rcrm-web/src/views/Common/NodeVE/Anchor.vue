<template>
    <m-popover
        ref="popRef"
        :content="anchor.code"
        trigger="manually"
        popover-class="anchor-pop-content"
        theme="darkTransparent"
    >
        <div
            class="opera-unit"
            :class="{
                active: anchor.active,
                ban: (moveTarget && moveTarget !== anchor) || mode !== 'edit',
                hover: isHover
            }"
            :style="unitStyle"
            @mouseenter="hover"
            @mouseleave="unhover"
        >
            <VueSvg :path="url" @mousedown="mousedown"></VueSvg>
        </div>
    </m-popover>
    <div
        v-if="anchor.type === 'h' && unitStyle.left !== '0px' && unitStyle.left !== `${size.x}px`"
        :style="`top:0;left:${unitStyle.left};height:100%`"
        class="guid-line h"
    ></div>
    <div
        v-if="anchor.type === 'v' && unitStyle.top !== '0px' && unitStyle.top !== `${size.y}px`"
        :style="`left:0;top:${unitStyle.top};width:100%`"
        class="guid-line v"
    ></div>
</template>
<script setup lang="ts">
import VueSvg from '@/components/VueSvg.vue';
import { watchEffect, ref } from 'vue';
const staticAnchor = require('@/assets/svg/anchor-static.svg');
const hAnchor = require('@/assets/svg/anchor-h.svg');
const vAnchor = require('@/assets/svg/anchor-v.svg');

const props = defineProps({
    anchor: {
        type: Object,
        default: () => ({})
    },
    size: {
        type: Object,
        default: () => ({
            x: 0,
            y: 0
        })
    },
    mode: {
        type: String,
        default: 'view'
    },
    moveTarget: {
        type: Object,
        default: null
    }
});

const emit = defineEmits(['captureTarget']);

const url = ref('');
watchEffect(() => {
    if (props.anchor.type === 'h') {
        url.value = hAnchor;
    } else if (props.anchor.type === 'v') {
        url.value = vAnchor;
    } else {
        url.value = staticAnchor;
    }
});

type StyleType = { left?: string; top?: string; cursor?: string };
const unitStyle = ref<StyleType>({});

watchEffect(() => {
    const { anchor } = props;
    const { position, offset } = anchor;
    const style: StyleType = {};
    style.left = `${position.x + offset.x}px`;
    style.top = `${position.y + offset.y}px`;

    unitStyle.value = style;
});

const popRef = ref();
const isHover = ref(false);

const hover = () => {
    if (!props.moveTarget) {
        popRef.value?.manuallyOpen();
        isHover.value = true;
    }
};

const unhover = () => {
    popRef.value?.manuallyHide();
    isHover.value = false;
};

const mousedown = (e: MouseEvent) => {
    if (props.mode === 'edit') {
        popRef.value?.manuallyHide();
        emit('captureTarget', props.anchor, e);
    }
};
</script>
<style lang="scss">
.anchor-pop-content {
    pointer-events: none;
}
</style>
<style lang="scss" scoped>
.opera-unit {
    position: absolute;
    z-index: 9;
    transform: translate(-50%, -50%);
    display: inline-block;
    line-height: 0;
    cursor: pointer;
    &.hover {
        :deep(circle, path) {
            fill: var(--purple-400);
        }
    }
    &.ban {
        cursor: default;
    }
    &.active {
        z-index: 99;
        :deep(circle, path) {
            fill: var(--green-600);
        }
    }
}
.guid-line {
    display: inline-block;
    position: absolute;
    z-index: 1;
    &.h {
        width: 1px;
        border-left: 1.5px dashed #be49c5;
    }
    &.v {
        height: 1px;
        border-top: 1.5px dashed #be49c5;
    }
}
</style>
