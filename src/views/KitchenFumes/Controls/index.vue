<template>
    <div class="data-statistics">
        <div class="data-statistics-top">
            <div class="fcb bt-color">
                <div class="f16">{{ i18n.global.t('meos_control_web.data_statistics') }}</div>
                <m-button size="small" @click="showEquipmentList = true">{{ i18n.global.t('meos_control_web.equipment_list') }}</m-button>
            </div>
        </div>
        <div style="height: calc(100% - 90px)">
            <m-scrollbar box-class="data-control-scrollbar">
                <dataAnalysis />
            </m-scrollbar>
        </div>
    </div>
</template>
<script setup>
import { isEdge } from '@/utils/envUtils';
import i18n from '@/localization';
import dataAnalysis from './dataAnalysis/index.vue';
const showEquipmentList = inject('showEquipmentList');
</script>
<style lang="less" scoped>
.data-statistics {
    height: 100%;
    :deep(.m-loading-mask) {
        z-index: 44 !important;
    }
    &-top {
        padding: 16px;
    }
}
.bt-color {
    border-bottom: 1px solid var(--gray-200, #e8ecf0);
    line-height: 42px;
}
:deep(.data-control-scrollbar) {
    padding: 0 16px 0px 16px;
}
</style>
