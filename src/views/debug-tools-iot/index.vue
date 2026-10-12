<template>
    <div class="debug-tools-iot-container">
        <m-sidebar v-model:width="leftSidebarWidth" v-model:show="leftSidebarShow" :change-size="true" :resident="false">
            <template v-if="isMountedLoading">
                <div class="left-loading-container">
                    <m-list-skeleton />
                </div>
            </template>
            <template v-else>
                <Left></Left>
            </template>
        </m-sidebar>
        <div class="right">
            <tableRight :is-mounted-loading="isMountedLoading" />
        </div>
    </div>
</template>

<script setup>
import Left from './left/index.vue';
import useDebugToolsGlobal from './hooks/useDebugToolsGlobal';
import tableRight from './tableRight/index.vue';

const { isMountedLoading, leftSidebarWidth, leftSidebarShow } = useDebugToolsGlobal();
</script>

<style lang="less" scoped>
.debug-tools-iot-container {
    width: 100%;
    height: 100%;
    display: flex;
    min-width: 1280px;

    :deep(.meri-sidebar) {
        height: 100%;
    }

    .left-loading-container {
        padding: 16px;
    }

    .right {
        flex: 1;
    }
}
</style>
