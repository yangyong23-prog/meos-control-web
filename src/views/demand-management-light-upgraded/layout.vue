<template>
    <div class="layout-container">
        <Header></Header>
        <div class="content-wrap">
            <div class="left-wrap">
                <m-list-skeleton v-if="leftTreeLoading" />
                <template v-else>
                    <Left />
                    <LeftActionFooter v-if="publicAreaVisible" />
                </template>
            </div>
            <div class="right-wrap">
                <RightActionHeader />
                <div v-show="isRightLoading" class="right-loading-container"></div>
                <template v-if="!isRightLoading && isRightConfigInfoLoaded">
                    <Right @refresh-left-list="refreshConfigGroup" @refresh-right-list="refreshConfigInfo" />
                </template>
            </div>
        </div>
    </div>
</template>

<script setup>
import { MLoading } from 'meri-plus';
import Header from './components/scene-period-list-header/index.vue';
import Left from './left/index.vue';
import LeftActionFooter from './left/LeftActionFooter.vue';
import Right from './right/index.vue';
import RightActionHeader from './right/RightActionHeader.vue';
import { leftTreeLoadingKey, rightConfigInfoLoadingKey, refreshConfigGroupKey, refreshConfigInfoInjectKey, isRightConfigInfoLoadedKey } from './hooks/useConfigCommonHook';
import { publicAreaVisibleKey, isPreviewInjectKey } from './hooks/useGlobalData';

const leftTreeLoading = inject(leftTreeLoadingKey);
const rightConfigInfoLoading = inject(rightConfigInfoLoadingKey);
const isRightConfigInfoLoaded = inject(isRightConfigInfoLoadedKey);
const refreshConfigGroup = inject(refreshConfigGroupKey);
const refreshConfigInfo = inject(refreshConfigInfoInjectKey);
const loadingInstance = ref(null);

const publicAreaVisible = inject(publicAreaVisibleKey);
const isRightLoading = computed(() => leftTreeLoading.value || rightConfigInfoLoading.value);
const isPreview = inject(isPreviewInjectKey);

watch(
    () => isRightLoading.value,
    curLoading => {
        if (curLoading) {
            const instanceObject = MLoading.service({
                target: '.right-loading-container',
                fullscreen: false,
                background: 'transparent',
                duration: 30000,
                lottieName: 'ball',
                loadIconStyle: {
                    width: '100px',
                    height: '100px',
                    visibility: isPreview.value ? 'hidden' : 'visible'
                }
            });
            loadingInstance.value = instanceObject;
        } else {
            loadingInstance.value?.destroy?.();
        }
    },
    {
        immediate: true
    }
);

onBeforeUnmount(() => {
    loadingInstance.value?.destroy?.();
    loadingInstance.value = null;
});
</script>

<style lang="less" scoped>
.layout-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.content-wrap {
    display: flex;
    height: calc(100% - 48px);
}

.left-wrap {
    position: relative;
    width: 336px;
    height: 100%;
    overflow: hidden;

    padding: 12px 16px;
    display: flex;
    flex-direction: column;

    border-right: 1px solid var(--gray-300, #e1e5eb);
    background: rgba(255, 255, 255, 0.8);
}

.right-wrap {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 0 16px 16px 16px;
    position: relative;
    max-width: calc(100vw - 400px);
    min-width: 880px;

    .right-loading-container {
        width: 100%;
        height: calc(100% - 56px);
        border-radius: 8px;
        background: #fff;
        position: relative;
        z-index: 1;
    }
}
</style>
