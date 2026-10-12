<template>
    <div class="expand-fold-box-container">
        <div :id="props?.slotKey" ref="contentElementRef" class="content-container" :style="{ maxHeight: showMaxHeight && !isExpand ? `${props.maxHeight}px` : 'none' }">
            <slot></slot>
        </div>
        <div v-if="!!showMaxHeight" class="row-container" @click="toggleBtn">
            <div>{{ !isExpand ? i18n.global.t('meos_control_web.expand_more') : i18n.global.t('meos_control_web.collapse') }}</div>
            <svg xmlns="http://www.w3.org/2000/svg" :style="{ rotate: isExpand ? '180deg' : '0deg' }" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2.66663 5.94562L7.99838 11.2774L7.99948 11.2784L13.3333 5.94459L12.5274 5.13867L7.99706 9.66899L3.47016 5.14209L2.66663 5.94562Z" fill="currentcolor" />
            </svg>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { useElementSize } from '@vueuse/core';

const props = defineProps({
    maxHeight: {
        type: Number,
        default: 76
    },
    slotKey: {
        type: String,
        default: ''
    }
});

const isExpand = ref(false);
const historyHeight = ref([]);
const contentElementRef = ref(null);

const { height } = useElementSize(contentElementRef);

watch(
    () => props?.slotKey,
    curKey => {
        if (curKey) {
            isExpand.value = false;
            historyHeight.value = [];
            contentElementRef.value = null;
        }
    }
);

watch(
    () => height.value,
    contentHeight => {
        if (contentHeight) {
            historyHeight.value.push(contentHeight);
        }
    },
    {
        immediate: true
    }
);

const showMaxHeight = computed(() => {
    const arr = historyHeight.value;
    const historyMax = Math.max(...arr);
    return historyMax > props.maxHeight;
});

const toggleBtn = () => {
    isExpand.value = !isExpand.value;
};
</script>

<style lang="less" scoped>
.expand-fold-box-container {
    display: flex;
    flex-direction: column;
}
.content-container {
    overflow: hidden;
}
.row-container {
    display: flex;
    align-items: center;
    column-gap: 4px;
    color: #246fe5;
    cursor: pointer;

    font-size: 14px;
    font-style: normal;
    font-weight: var(--platform-font-weight);
    line-height: 22px;
    margin-top: 8px;

    &:hover {
        color: #1b4acc;
    }
}
</style>
