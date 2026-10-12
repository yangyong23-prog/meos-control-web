<template>
    <div class="vent-perception-operating-control h100">
        <div v-if="hasData || staticsLoading" class="operating-control-main">
            <m-list-skeleton v-if="staticsLoading" :item-num="6" />
            <m-scrollbar v-else ref="scrollbarRef" class="container" :height="'100%'">
                <div class="wh100">
                    <FoldWrap
                        v-model="proxyList"
                        :data="prjStatisticsList"
                        :btn-enable-num="2"
                        :expand-text="i18n.global.t('meos_control_web.expand_all')"
                        :btn-distance-y="'4'"
                        :type="'dashboard'"
                    >
                        <div class="card-wrap">
                            <div v-for="(item, idx) in proxyList" :key="item.id" class="card-item wh100">
                                <div class="card-header w100">
                                    <div class="title-item">{{ i18n.global.t('meos_control_web.name_distribution', { name: item.name }) }}</div>
                                    <m-button v-if="idx === 0" class="equipment-list" type="default" size="small" @click="openEquipmentList()">{{
                                        i18n.global.t('meos_control_web.equipment_list')
                                    }}</m-button>
                                </div>
                                <PieChartStatistic :data-statistics="item" class="statistics-cards-item" :select-item-id="curDashboardEnvParams" :disable-interactive="true">
                                </PieChartStatistic>
                            </div>
                        </div>
                    </FoldWrap>

                    <div class="equip-cards-wrap">
                        <div class="card-header w100 vt-equip-header">
                            <div class="title-item">{{ i18n.global.t('meos_control_web.ventilation_equipment') }}</div>
                            <m-button v-if="!proxyList?.length" class="equipment-list" type="default" size="small" @click="openEquipmentList()">{{
                                i18n.global.t('meos_control_web.equipment_list')
                            }}</m-button>
                        </div>
                        <div class="equip-card-list w100">
                            <EquipmentCardItem v-for="(item, idx) in equipStaticsInfoList" :key="idx" :item="item" />
                        </div>
                    </div>
                </div>
            </m-scrollbar>
        </div>
        <m-illustration v-else :title="i18n.global.t('meos_control_web.no_content')" type="noContent" style="height: calc(100% - 32px)" class="fcc"></m-illustration>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { ref } from 'vue';
import FoldWrap from '@/components/common/FoldWrap.vue';

import { prjStatisticsListKey } from '../hooks/useBaseHook';
import { staticsInfoListKey, staticsLoadingKey } from '@/views/VentPerceptionUpgraded/hooks/useVentStaticData';
import EquipmentCardItem from '../left/EquipmentCardItem.vue';
import PieChartStatistic from '../left/PieChartStatistic.vue';
import { openEquipmentListKey } from '@/views/VentPerceptionUpgraded/hooks/useEquipmentList';
const prjStatisticsList = inject(prjStatisticsListKey);
const equipStaticsInfoList = inject(staticsInfoListKey);
// const currentFloorObj = inject(currentFloorObjInjectKey, ref({}));
const openEquipmentList = inject(openEquipmentListKey);
const staticsLoading = inject(staticsLoadingKey);

//
const proxyList = ref([]);

const hasData = computed(() => {
    return prjStatisticsList?.value?.length > 0 || equipStaticsInfoList?.value?.length > 0;
});
</script>
<style lang="less" scoped>
.vent-perception-operating-control {
    position: relative;
    // overflow: auto;
    :deep(.m-tabs-list) {
        padding-top: 0;
    }

    .title-item {
        display: flex;
        align-items: center;
        gap: 9px;

        color: var(--gray-800, #2e3742);
        font-size: 18px;
        font-style: normal;
        font-weight: 700;
        line-height: 24px; /* 133.333% */
        &::before {
            // position: absolute;
            content: '';
            // top: 7px;
            // left: 0;
            width: 3px;
            height: 14px;
            background-color: var(--blue-500, #246fe5);
        }
    }
    .operating-control-main {
        height: 100%;

        :deep(.fold-option-wrap-sticky-bg-dashboard) {
            position: inherit;
            background-color: white;
            // .btn-wrap {
            //     .title {
            //         color: #626c78;
            //     }
            //     &:hover .title {
            //         color: #626c78;
            //     }
            // }
        }
    }
    .equipment-list {
        // position: absolute;
        // top: 12px;
        // right: 0;
        z-index: 4;
    }
    .card-wrap {
        user-select: none;
        grid-template-columns: var(--system-repeat);
        display: grid;
        gap: 16px;

        // margin-bottom: 24px;
        .card-item {
            // margin-bottom: 24px;
            // min-height: 254px;
            min-width: 300px;
            flex: 1;
            // height: 272px;
            align-self: stretch;
            padding: 0 16px 0 0px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.8);
        }
    }
    .card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .vt-equip-header {
        padding-right: 16px;
    }
    .equip-cards-wrap {
        margin-top: 16px;
        padding-bottom: 24px;
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 24px;
        .equip-card-list {
            display: flex;
            flex-direction: column;
            gap: 32px;
        }
    }
}
</style>
