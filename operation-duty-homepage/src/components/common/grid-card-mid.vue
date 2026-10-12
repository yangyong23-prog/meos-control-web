<template>
    <m-scrollbar ref="midWrap" class="acac-grid-card-mid-wrap" @scroll-to-boundary="scrollToBoundary" @scroll="scroll">
        <GridCardMidCol v-for="(card, index) in cards" :key="index + card.name" :item="card" />
        <VueSvg v-if="hasPrePage" :path="PrePage" class="page-btn pre-page" @click="prePage()" />
        <VueSvg v-if="hasNextPage" :path="NextPage" class="page-btn next-page" @click="nextPage()" />
    </m-scrollbar>
</template>
<script setup>
import VueSvg from '@/components/VueSvg.vue';
import GridCardMidCol from './grid-card-mid-col.vue';
import NextPage from '@/assets/svg/nextPage.svg';
import PrePage from '@/assets/svg/prePage.svg';
import { useResizeObserver } from '@vueuse/core';
import { isNil, throttle } from 'lodash';
const props = defineProps({
    cards: {
        type: Array,
        default: () => []
    }
});
const midWrap = ref();
const hasPrePage = ref(false);
const top = ref(0);
const left = ref(0);
const prePage = () => {
    midWrap.value.setScrollLeft(left.value - 200);
};
const hasNextPage = ref(false);
const nextPage = () => {
    midWrap.value.setScrollLeft(left.value + 200);
};
let resizeObserver = null;
const resize = async () => {
    const box = midWrap?.value.boxRef;
    const offsetWidth = box?.offsetWidth || 0;
    const scrollWidth = box?.scrollWidth || 0;
    if (offsetWidth + left.value < scrollWidth) {
        hasNextPage.value = true;
    } else {
        hasNextPage.value = false;
    }
};
const scrollToBoundary = boundary => {
    if (boundary === 'right') {
        hasNextPage.value = false;
    } else if (boundary === 'left') {
        hasPrePage.value = false;
    }
};
const scroll = ({ scrollLeft, scrollTop }) => {
    top.value = scrollTop;
    left.value = scrollLeft;
    if (left.value > 0) {
        hasPrePage.value = true;
        hasNextPage.value = true;
    } else {
        hasPrePage.value = false;
        hasNextPage.value = true;
    }
};
onMounted(() => {
    resizeObserver = useResizeObserver(midWrap.value, throttle(resize, 50));
});
onUnmounted(() => {
    resizeObserver?.stop();
});
watch(
    () => props.cards,
    () => {
        nextTick(() => {
            resize();
        });
    },
    { deep: true }
);
</script>
<style lang="less" scoped>
.acac-grid-card-mid-wrap {
    width: 100%;
    height: 100%;
    user-select: none;
    .page-btn {
        position: absolute;
        top: 50%;
        transform: translate(0, -50%);
        cursor: pointer;
        &:hover {
            :deep(path) {
                fill: #246fe5;
            }
            :deep(rect) {
                stroke: #9fc9fb;
            }
        }
        &.pre-page {
            left: 0px;
        }
        &.next-page {
            right: 0px;
        }
    }
    :deep(.m-scrollbar__bar.is-horizontal) {
        display: none !important;
    }
    :deep(.m-scrollbar__content) {
        height: 100%;
        display: flex;
        gap: 8px;
    }
}
</style>
