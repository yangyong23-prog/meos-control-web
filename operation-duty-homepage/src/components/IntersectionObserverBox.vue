<template>
    <div
        ref="IntersectionObserverBox"
        class="IntersectionObserverBox"
        :style="{ opacity: opacity }"
    >
        <slot></slot>
    </div>
</template>

<script setup>
import i18n from '@/localization';
const IntersectionObserverBox = ref();
const intersectionObserver = ref();
let ResizeObserverRef = null,
    mscrollbabox = null;
const opacity = ref(1);
const cardRef = inject('cardRef');
const intersectionObserverFun = () => {
    // 先断开之前的观察器
    intersectionObserver.value?.disconnect();

    // 确保元素存在且是有效的DOM元素
    if (!IntersectionObserverBox.value || !(IntersectionObserverBox.value instanceof Element)) {
        console.log('------ IntersectionObserverBox is not a valid DOM element');
        return;
    }

    intersectionObserver.value = new IntersectionObserver(entries => {
        if (entries[0].intersectionRatio < 1) {
            opacity.value = 0;
        } else {
            opacity.value = 1;
        }
    });

    // 开始监听
    intersectionObserver.value.observe(IntersectionObserverBox.value);
};

onMounted(() => {
    // 确保在组件挂载后再执行
    nextTick(() => {
        mscrollbabox = document.querySelector('.m-scrollbar__box');
        if (IntersectionObserverBox.value) {
            ResizeObserverRef = new ResizeObserver(intersectionObserverFun);
            window.addEventListener('scroll', intersectionObserverFun);
            mscrollbabox?.addEventListener('scroll', intersectionObserverFun);
            intersectionObserverFun();
            cardRef.value && ResizeObserverRef.observe(cardRef.value);
        }
    });
});

onUnmounted(() => {
    intersectionObserver.value?.disconnect();
    window.removeEventListener('resize', intersectionObserverFun);
    window.removeEventListener('scroll', intersectionObserverFun);
    mscrollbabox?.removeEventListener('scroll', intersectionObserverFun);
    cardRef.value && ResizeObserverRef?.unobserve(cardRef.value);
    // 清理引用
    intersectionObserver.value = null;
    ResizeObserverRef = null;
    mscrollbabox = null;
});
</script>

<style lang="less" scoped></style>
