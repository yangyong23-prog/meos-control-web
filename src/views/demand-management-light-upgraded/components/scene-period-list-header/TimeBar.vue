<template>
    <m-popover :enterable="true" trigger="hover" placement="bottom" :show-arrow="false" theme="darkTransparent" popover-class="tip-popover-box">
        <template #content>
            {{ item.hoverText }}
        </template>
        <div
            ref="timeBarRef"
            class="time-item"
            :class="{
                active: item.id === props.selectedId
            }"
            @click="selItem(item)"
        >
            <span ref="timeTextRef" :class="[showTimeText ? 'text-show' : 'text-hide']"> {{ item.timeText }}</span>
        </div>
    </m-popover>
</template>

<script setup>
import { useElementSize } from '@vueuse/core';

const props = defineProps({
    item: {
        type: Object,
        default: () => ({})
    },
    selectedId: {
        type: String,
        default: ''
    },
    hasSunSetSunRise: {
        type: Boolean,
        default: false
    }
});

const timeBarRef = ref();
const timeTextRef = ref();
const allItemsShowConfig = defineModel({ type: Map, default: new Map() });
const { width } = useElementSize(timeBarRef);
const { height } = useElementSize(timeTextRef);

watch([() => width.value, () => props.hasSunSetSunRise], () => {
    let showText = false;
    if (!props.hasSunSetSunRise) {
        showText = width.value >= 100;
    } else {
        showText = width.value >= 168;
    }

    if (allItemsShowConfig.value?.has(props.item?.id)) {
        allItemsShowConfig.value.get(props.item?.id).showText = showText;
    }
});

watch([() => height.value], () => {
    if (allItemsShowConfig.value?.has(props.item?.id)) {
        allItemsShowConfig.value.get(props.item?.id).isOverflow = height.value > 20;
    }
});

const isAllShowText = computed(() => {
    const allArr = [...allItemsShowConfig.value.values()];
    return allArr.length && allArr.every(v => v?.showText);
});

const isSomeOverflow = computed(() => {
    const allArr = [...allItemsShowConfig.value.values()];
    return allArr.length && allArr.some(v => v?.isOverflow);
});

const showTimeText = computed(() => {
    if (!isAllShowText.value) {
        return false;
    } else {
        return !isSomeOverflow.value;
    }
});

const emits = defineEmits(['change']);

const selItem = item => {
    emits('change', item);
};
</script>

<style lang="less" scoped>
.time-item {
    flex: 1;
    min-width: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0px;
    cursor: pointer;

    border-radius: 2px;
    background: var(--blue-200, #9fc9fb);
    border: 1px solid var(--blue-200, #9fc9fb);

    color: #fff;
    text-align: center;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    height: 16px;
    line-height: 16px;

    &:not(.active) {
        &:hover {
            border: 1px solid var(--blue-500, #246fe5);
            background: var(--blue-300, #64a6f7);
            box-shadow: 0 2px 10px 0 rgba(27, 33, 41, 0.1);
        }
    }
}
.active {
    border: 1px solid var(--blue-500, #246fe5);
    background: var(--blue-500, #246fe5);
    box-shadow: 0 2px 6px 0 rgba(17, 71, 143, 0.1);
}
.text-show {
    visibility: visible;
}
.text-hide {
    visibility: hidden;
}
</style>
