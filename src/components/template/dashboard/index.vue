<template>
    <div ref="dashboardContainerRef" class="dashboard-container" :style="containerCssVars">
        <m-scrollbar ref="scrollbarRef" bar-y-size="0px" bar-x-size="0px" @scroll="onScroll">
            <div class="dashboard-scrollbar-content">
                <slot name="prefix"></slot>
                <div class="dashboard-content">
                    <div v-if="(isLoaded && !gridData.length) || (gridData.length && gridData?.every(v => !v?.isShow))" class="empty-container">
                        <m-illustration :title="i18n.global.t('meos_control_web.no_content')" type="noContent" />
                    </div>
                    <CollapseList v-if="isLoaded" v-bind="$attrs" :grid-data="props.gridData">
                        <!-- 插槽透传 -->
                        <template v-for="(_, key, index) in $slots" :key="index" #[key]="$props">
                            <slot :name="key" v-bind="$props"></slot>
                        </template>
                    </CollapseList>
                    <div class="filter-header-container">
                        <slot name="filter-header"></slot>
                    </div>
                </div>
            </div>
        </m-scrollbar>
        <slot name="suffix"></slot>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { useElementSize } from '@vueuse/core';
import CollapseList from './widget/CollapseList.vue';

const props = defineProps({
    gridData: {
        type: Array,
        default: () => []
    },
    isLoaded: {
        type: Boolean,
        default: true
    }
});

const emits = defineEmits(['scroll']);

const dashboardContainerRef = ref();
const { height, width } = useElementSize(dashboardContainerRef);
const containerCssVars = computed(() => {
    return {
        '--dashboard-container-height': `${height.value}px`,
        '--dashboard-container-width': `${width.value}px`
    };
});

const scrollbarRef = ref();

const onScroll = itemData => {
    emits('scroll', itemData);
};
</script>

<style lang="less" scoped>
.dashboard-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.dashboard-scrollbar-content {
    height: 100%;
    display: flex;
    flex-direction: column;
    min-height: var(--dashboard-container-height);
}

.dashboard-content {
    flex: 1;
    width: 100%;
    position: relative;
}

.empty-container {
    position: absolute;
    background-color: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 0;
    left: 0;
    min-height: 200px;
    width: 100%;
    height: 100%;
}

.filter-header-container {
    position: absolute;
    top: 0;
    right: 0;
    width: fit-content;
    display: flex;
    justify-content: flex-end;
}
</style>
