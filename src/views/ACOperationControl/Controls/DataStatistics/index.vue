<template>
    <div class="statistics-container">
        <DataCardsStatistics v-if="isSpaceStaticDataLoaded" class="card-top-container" v-bind="$attrs" />
        <div>
            <div v-if="!equipLoadedEmpty" class="title title-bg">{{ i18n.global.t('common.end_equipment') }}</div>
            <template v-if="equipShow">
                <m-list-skeleton />
                <!-- <div v-loading="equipShow" box-class="control-scrollbar" element-loading-lottiename="circle" style="height: 250px; overflow-y: auto"></div> -->
            </template>
            <template v-else-if="!equipLoadedEmpty">
                <EquipmentStatistics :list="equipmentStatusStatisticsList" />
            </template>
            <!-- <FloorEquipment v-else /> -->
        </div>
        <div class="hidden-container">
            <Empty />
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import DataCardsStatistics from './DataCardsStatistics.vue';
import { isSpaceStaticDataLoadedKey } from '../../injectKeys';
import EquipmentStatistics from './EquipmentStatistics.vue';
// import xplantindoorenvStore from '@/store/xplantindoorenv';
import { equipmentStatusStatisticsListKey, equipLoadedEmptyKey } from '../../hooks/useACGlobalData';
import Empty from '@/components/common/Empty.vue';

const equipShow = inject('equipShow');
const equipmentStatusStatisticsList = inject(equipmentStatusStatisticsListKey);
const equipLoadedEmpty = inject(equipLoadedEmptyKey);
const isSpaceStaticDataLoaded = inject(isSpaceStaticDataLoadedKey);
</script>

<style lang="less" scoped>
:deep(.el-loading-mask) {
    background: transparent !important;
    .el-loading-spinner .path {
        stroke: #626c78;
    }
    .el-loading-spinner .circular {
        width: 32px;
        height: 32px;
    }
}
.statistics-container {
    width: 100%;
    height: 100%;
    margin-top: 16px;
    padding-right: 16px;
    .title {
        position: relative;
        color: var(--gray-800, #2e3742);
        font-size: 18px;
        font-weight: 700;
        line-height: 28px;
        padding-left: 12px;
        margin-bottom: 24px;
    }
    .title-bg {
        padding-left: 12px;
        &::before {
            position: absolute;
            content: '';
            top: 7px;
            left: 0;
            width: 3px;
            height: 14px;
            background-color: var(--blue-500, #246fe5);
        }
    }
    .tabs-flex {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-right: 16px;
        :deep(.m-tabs.m-tabs-segment) {
            width: 234px !important;
        }
    }
    .tab-content {
        margin-right: 16px;
        margin-top: 12px;
        border-radius: 8px;
        background: #f9fbff;
        overflow: hidden;
        .line {
            border-top: 1px dashed var(--blue-100, #d9ebff);
            background: #f9fbff;
        }
    }
}
.hidden-container {
    display: none;
}

/* 两个直系子 div 都为空时，父级显示“暂无内容” */
.statistics-container:has(> div:nth-child(1):empty):has(> div:nth-child(2):empty) {
    .hidden-container {
        position: absolute;
        width: 100%;
        height: calc(100% - 40px);
        display: flex;
        justify-content: center;
        align-items: center;
    }
}
</style>
