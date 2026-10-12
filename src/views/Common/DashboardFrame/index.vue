<template>
    <div class="spatial-grid-list-wrapper">
        <div v-if="loading" class="loading-container"></div>
        <div v-else-if="!gridData?.length && isLoaded" class="empty-container">
            <m-illustration :title="i18n.global.t('meos_control_web.no_content')" type="noContent" />
        </div>
        <GridList v-else v-bind="$attrs" ref="gridListRef" :grid-data="gridData">
            <!-- 插槽透传 -->
            <template v-for="(item, key, index) in $slots" :key="index" #[key]="$props">
                <slot :name="key" v-bind="$props"></slot>
            </template>
        </GridList>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { MLoading } from 'meri-plus';

import GridList from './GridList.vue';

const props = defineProps({
    gridData: {
        type: Array,
        default: () => []
    },
    loading: {
        type: Boolean,
        default: true
    },
    isLoaded: {
        type: Boolean,
        default: true
    }
});

const gridListRef = ref();

const loadingInstance = ref();
watch(
    () => props.loading,
    () => {
        if (props.loading) {
            nextTick(() => {
                loadingInstance.value = MLoading.service({
                    target: `.loading-container`,
                    fullscreen: false,
                    duration: 100,
                    lottieName: 'ball',
                    loadIconStyle: {
                        width: '100px',
                        height: '100px'
                    },
                    background: 'transparent'
                });
            });
        } else {
            loadingInstance.value?.destroy();
        }
    },
    {
        immediate: true
    }
);
const scrollToFloor = floorObj => {
    gridListRef.value?.scrollTo(floorObj);
};
const scrollFloors = floorObj => {
    gridListRef.value?.scrollFloor(floorObj);
};
defineExpose({
    scrollToFloor,
    scrollFloors
});
</script>

<style lang="less" scoped>
.spatial-grid-list-wrapper {
    width: 100%;
    height: 100%;

    .loading-container {
        flex: 1;
        width: 100%;
        height: 100%;
        background-color: transparent;

        display: flex;
        align-items: center;
        justify-content: center;
    }

    .empty-container {
        position: absolute;
        background-color: transparent;
        display: flex;
        align-items: center;
        justify-content: center;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
}
</style>
