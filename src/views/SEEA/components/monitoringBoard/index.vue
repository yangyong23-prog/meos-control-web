<template>
    <m-modal
        v-model:visible="show"
        :append-to="$modalAppendTo"
        content-class-name="monitor-borad-modal-content"
        modal-class-name="monitor-borad-modal"
        type="full"
        :closeable="false"
        :need-scrollbar="false"
        @close="$emit('close')"
    >
        <template #header> </template>
        <template #content>
            <div ref="monitoringBoardRef" class="monitoring-board wh100" :style="{ zIndex: zIndex }">
                <div class="monitoring-board-header fcb">
                    <div class="fs24 fw500 fc" style="gap: 4px">
                        <span>{{ i18n.global.t('meos_control_web.power_gen_data_statistics') }}</span>
                    </div>
                    <div class="monitoring-board-header-close fcc" @click="$emit('close')">
                        <IconMeriComponentClose size="24" />
                    </div>
                </div>
                <div class="monitoring-board-main">
                    <div v-if="!loading && isEmpty" class="monitoring-board-empty wh100">
                        <Empty :text="i18n.global.t('meos_control_web.no_content')" width="90px" height="76px" />
                    </div>
                    <div v-else-if="!loading" class="wh100">
                        <div class="charts-container">
                            <div
                                v-for="(item, index) in charts"
                                :key="index"
                                :class="{
                                    'chart-container': true,
                                    'tow-size': charts.length === 2,
                                    'one-size': charts.length === 1
                                }"
                            >
                                <Chart :item="item" :sys-info-codes="sysInfoCodes" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </m-modal>
</template>
<script setup>
import i18n from '@/localization';
import { useZIndex } from 'meri-plus';
import Empty from '@/components/common/Empty.vue';
import Chart from './chart.vue';
import { IconMeriComponentClose } from 'meri-icon';
import { useMonitoringBoard } from '../../hooks/useMonitorHook';
import { systemIdKey } from '@/views/SEEA/hooks/useBaseHook';
import { computed } from 'vue';
const systemId = inject(systemIdKey);
const props = defineProps({
    sysInfoCodes: {
        type: Array,
        default: () => []
    }
});
const { loading, chartConfigs, isEmpty } = useMonitoringBoard();
const charts = computed(() => {
    return chartConfigs.value;
});
const show = ref(false);
onMounted(() => {
    show.value = true;
});
defineEmits(['close']);
const zIndex = computed(() => useZIndex().nextZIndex());
</script>
<style lang="less" scoped>
.monitor-borad-modal {
    position: relative;
}
.monitoring-board {
    position: absolute;
    top: 0;
    left: 0;
    background: url('@/assets/imgs/page_bg.png');
    background-color: rgb(235 246 255);
    background-size: cover;
    background-repeat: no-repeat;
    padding-bottom: 16px;
    &-header {
        height: 56px;
        padding: 16px 16px 0 16px;
        &-close {
            border-radius: 4px;
            cursor: pointer;
            height: 32px;
            width: 32px;
            &:hover {
                background-color: var(--alpha-30);
            }
        }
    }
    &-empty {
        height: calc(100% - 56px);
        width: 100%;
        box-sizing: border-box;
        padding: 8px 16px 0 12px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    &-main {
        height: calc(100% - 56px);
        width: 100%;
        box-sizing: border-box;
        position: relative;
        padding: 8px 16px 0 12px;
        :deep(.m-scrollbar__bar.is-horizontal) {
            display: none !important;
        }
        .charts-container {
            display: flex;
            width: 100%;
            height: 100%;
            flex-direction: column;
            gap: 13px;
            .chart-container {
                display: block;
                position: relative;
                width: 100%;
                height: 33%;
                &.tow-size {
                    height: 50%;
                }
                &.one-size {
                    height: 100%;
                }
            }
        }
    }
}
</style>
