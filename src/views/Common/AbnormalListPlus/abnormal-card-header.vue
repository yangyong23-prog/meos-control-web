<template>
    <div class="card-header">
        <div ref="tagsRef" class="tags-container">
            <template v-for="tag in renderTags" :key="tag.name">
                <template v-if="tag.showIcon">
                    <div class="icon-wrap">
                        <div class="abnormal-header-icon-status" :style="{ 'background-color': tag.color }">
                            <RishIcon />
                            {{ tag.name }}
                        </div>
                    </div>
                </template>
                <template v-else>
                    <div class="tag-wrap">
                        <m-tag color="#FFFFFF" :bg-color="tag.color" size="small">
                            {{ tag.name }}
                        </m-tag>
                    </div>
                </template>
            </template>
        </div>
        <div class="card-name" :style="{ 'max-width': `calc(100% - ${width}px - ${codeWidth ? codeWidth + colGap + colGap : colGap}px)` }">
            <span v-ellipsis="{ class: ['abnormal-value-name-ellipsis-class'] }" class="name-text m-ellipsis">{{ renderName }}</span>
        </div>
        <div
            ref="codeRef"
            :class="{
                'card-code': true,
                'show-code': isHover
            }"
        >
            <m-tag color="#1B2129" bg-color="#E8ECF0" size="small">{{ props?.card?.eventNumber || '--' }}</m-tag>
        </div>
    </div>
</template>

<script setup>
import RishIcon from '@/assets/svg/abnormal/exclude.svg';
import { useElementSize } from '@vueuse/core';
const props = defineProps({
    card: {
        type: Object,
        default: () => {}
    },
    renderTags: {
        type: Array,
        default: () => []
    },
    renderName: {
        type: String,
        default: ''
    },
    isHover: {
        type: Boolean,
        default: false
    }
});
const tagsRef = ref(null);
const codeRef = ref(null);
const { width } = useElementSize(tagsRef);
const { width: codeWidth } = useElementSize(codeRef);
const colGap = 4;
</script>

<style lang="less" scoped>
.abnormal-header-icon-status {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 2px;
    color: #fff;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    padding: 0px 6.5px;
    border-radius: 4px;
    line-height: 22px;
    height: 22px;
    line-height: normal;
}
.card-header {
    display: flex;
    padding: 12px;
    gap: 4px;
    height: 46px;
    align-items: center;
}

.tags-container {
    display: flex;
    align-items: center;
    gap: 4px;
}
.icon-wrap {
    display: flex;
    align-items: center;
}

.tag-wrap {
    height: 30px;
    display: flex;
    align-items: center;
}

.m-tag {
    height: 22px;
    border-radius: 4px;
    padding-inline: 6px;
}

.card-name {
    display: flex;
    align-items: center;
    .name-text {
        display: inline-block;
        max-width: 100%;
        color: var(--gray-800, #2e3742);
        font-size: 16px;
        font-style: normal;
        font-weight: 700;
        line-height: 20px;
    }
}

.card-code {
    visibility: hidden;
    opacity: 0;
    width: 0;
    margin-left: auto;
    transition: opacity 300ms cubic-bezier(0.25, 0.1, 0.25, 0.1), width 300ms cubic-bezier(0.25, 0.1, 0.25, 0.1);
}
.show-code {
    visibility: visible;
    opacity: 1;
    width: auto;
}
</style>
