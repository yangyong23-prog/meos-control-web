<template>
    <div
        v-show="isLoading || proxyList?.length > 0"
        class="statistics-container"
        :style="{ height: isLoading ? '216px' : 'auto', paddingBottom: foldDataList?.length > 3 ? '4px' : '24px' }"
    >
        <FoldWrap
            v-if="!isLoading"
            v-model="proxyList"
            :data="foldDataList"
            :btn-enable-num="cardSize"
            :expand-text="i18n.global.t('meos_control_web.expand_all')"
            :btn-distance-y="'4'"
            :type="'dashboard'"
        >
            <div class="card-wrap">
                <template v-for="item in proxyList" :key="item.id">
                    <div v-if="item.type === 'equipStatisticCard'" class="card-item wh100">
                        <CardTitle :title="curEquipCardData?.name">
                            <template #right>
                                <m-button type="default" size="small" @click="openEquipmentPanel()">{{ i18n.global.t('meos_control_web.equipment_list') }}</m-button>
                            </template>
                        </CardTitle>
                        <EquipmentStatisticsCard :statistics-list="equipStaticsInfoList" @change="equipCardChange"></EquipmentStatisticsCard>
                    </div>
                    <div v-else class="card-item wh100">
                        <CardTitle :title="i18n.global.t('meos_control_web.name_distribution', { name: item.name })"> </CardTitle>
                        <PieChartStatistic :data-statistics="item" class="statistics-cards-item" :select-item-id="curDashboardStaticsEnvParam" @click-item="clickItem">
                        </PieChartStatistic>
                    </div>
                </template>
            </div>
        </FoldWrap>

        <m-list-skeleton v-else :item-num="6" />
    </div>
</template>
<script setup>
import i18n from '@/localization';
import {
    prjStatisticsListKey,
    loadingKey,
    filterEnvWithScopeKey,
    curDashboardEnvParamsKey,
    dyncDataLoadingKey,
    curDashboardStaticsEnvParamKey
} from '@/views/VentPerceptionUpgraded/hooks/useBaseHook';
import { staticsInfoListKey } from '@/views/VentPerceptionUpgraded/hooks/useVentStaticData';
import { openEquipmentListKey } from '@/views/VentPerceptionUpgraded/hooks/useEquipmentList';
import PieChartStatistic from './PieChartStatistic.vue';
import EquipmentStatisticsCard from './EquipmentStatisticsCard.vue';
import FoldWrap from '@/components/common/FoldWrap.vue';
import CardTitle from './CardTitle.vue';
const props = defineProps({
    dataStatistics: {
        type: Object,
        default: () => {}
    },
    disableInteractive: {
        type: Boolean,
        default: false
    },
    type: {
        type: String,
        default: ''
    },
    cardSize: {
        type: Number,
        default: 3
    }
});
const prjStatisticsList = inject(prjStatisticsListKey);
const loading = inject(loadingKey);
const dyncDataLoading = inject(dyncDataLoadingKey);
const filterEnvWithScope = inject(filterEnvWithScopeKey);
const curDashboardEnvParams = inject(curDashboardEnvParamsKey);
const curDashboardStaticsEnvParam = inject(curDashboardStaticsEnvParamKey);
const openEquipmentList = inject(openEquipmentListKey);
const equipStaticsInfoList = inject(staticsInfoListKey);

const curEquipCardData = ref();
const isLoading = computed(() => {
    return dyncDataLoading.value || loading.value;
});
const openEquipmentPanel = () => {
    console.log('openEquipmentPanel: ');
    openEquipmentList();
};

const clickItem = item => {
    console.log('item: ', item);
    filterEnvWithScope?.(item);
};
const equipCardChange = data => {
    curEquipCardData.value = data;
};
//
const proxyList = ref([]);
// 卡片列表
const foldDataList = computed(() => {
    let arr = prjStatisticsList?.value || [];
    arr = [...arr];
    if (equipStaticsInfoList?.value?.length > 0 > 0) {
        arr.push({
            id: 'equipStatisticCard',
            type: 'equipStatisticCard',
            name: i18n.global.t('meos_control_web.device_stat_card')
        });
    }

    return arr;
});
</script>

<style lang="less" scoped>
.statistics-container {
    width: 100%;
    display: flex;
    align-self: stretch;
    flex-grow: 1;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
    .card-wrap {
        user-select: none;
        grid-template-columns: var(--system-repeat);
        display: grid;
        gap: 12px;

        // margin-bottom: 24px;
        .card-item {
            // margin-bottom: 24px;
            min-height: 254px;
            min-width: 300px;
            flex: 1;
            height: 272px;
            align-self: stretch;
            padding: 12px 16px 12px 16px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.8);
        }
    }
}
</style>
