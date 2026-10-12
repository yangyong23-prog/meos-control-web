<template>
    <Panel :loading="loading" :title="title" title-path="/parking-lot" :card-tag="data?.cardTag">
        <div v-if="!loaded" class="ac-row-grid"></div>
        <div v-else-if="loaded && data" class="vent-row row">
            <div class="vent-col col">
                <div class="chart-pie-wrap">
                    <ChartPie :data="ratio" />
                </div>
            </div>
            <div class="vent-col col parking-legends">
                <div class="parking-con">
                    <div class="pic-box">
                        <VueSvg :path="vacantParkSvg" />
                    </div>
                    <div class="val-box">
                        <span class="val ffb">{{ card.freeTotal }}</span>
                        <span>{{ i18n.global.t('operation_duty_homepage.meos_home_free_parking_space') }}</span>
                    </div>
                </div>
                <div class="parking-con">
                    <div class="pic-box">
                        <VueSvg :path="totalParkSvg" />
                    </div>
                    <div class="val-box">
                        <span class="val ffb">{{ card.equipmentTotal }}</span>
                        <span>{{ i18n.global.t('common.total_parking_spaces') }}</span>
                    </div>
                </div>
            </div>
        </div>
        <Empty v-else-if="loaded" :text="i18n.global.t('operation_duty_homepage.meos_home_no_content_yet')" width="90px" height="76px" />
    </Panel>
</template>
<script setup>
import i18n from '@/localization';
import Panel from '@/views/components/base/panel.vue';
import Empty from '@/components/Empty.vue';
import ChartPie from './chart-pie.vue';
import VueSvg from '@/components/VueSvg.vue';
import vacantParkSvg from '@/assets/svg/vacantpark.svg';
import totalParkSvg from '@/assets/svg/totalpark.svg';
import { useHomeDataHook } from '@/hooks/useHomeDataHook';
import GridLayout from '@/components/grid/GridLayout.vue';
import { formatNumber } from '@/utils/tools';
import GridLayoutItem from '@/components/grid/GridLayoutItem.vue';
import { isNil, isNumber, clone } from 'lodash';
defineProps({
    title: {
        type: String,
        default: i18n.global.t('common.meos_home_parking_lot')
    }
});
const { getDutyHomeData, data, startDataPolling, loaded, loading } = useHomeDataHook();
const card = computed(() => {
    if (data.value?.childCardList?.length) {
        const card = clone(data.value?.childCardList[0]);
        if (isNumber(card.freeTotal)) {
            card.freeTotal = formatNumber(card.freeTotal);
        } else {
            card.freeTotal = '--';
        }
        if (isNumber(card.equipmentTotal)) {
            card.equipmentTotal = formatNumber(card.equipmentTotal);
        } else {
            card.equipmentTotal = '--';
        }
        return card;
    }
    return {
        freeTotal: '--',
        equipmentTotal: '--'
    };
});
const ratio = computed(() => {
    if (data.value?.childCardList?.length) {
        const card = data.value?.childCardList[0];
        return card.equipmentTotal && !isNil(card.freeTotal) ? ((card?.freeTotal / card?.equipmentTotal) * 100).toFixed(0) : null;
    }
    return null;
});
onMounted(() => {
    // TODO
    startDataPolling({ systemList: ['PARKING'] });
    getDutyHomeData({ systemList: ['PARKING'] });
});
</script>
<style lang="less" scoped>
.vent-row {
    display: flex;
    flex-direction: row;
    flex-grow: 1;
    width: 100%;
    align-items: center;
    justify-content: flex-start;
    padding: 35px 40px 45px 40px;
    gap: 40px;
}
.chart-pie-wrap {
    width: 150px;
    height: 150px;
}
.parking-legends {
    display: flex;
    flex-direction: column;
    gap: 28px;
    .parking-con {
        display: flex;
        flex-direction: row;
        gap: 20px;
        .pic-box {
            width: 56px;
            height: 56px;
        }
        .val-box {
            display: flex;
            flex-direction: column;
            span {
                font-size: 14px;
                font-style: normal;
                font-weight: 400;
                line-height: 22px; /* 157.143% */
                color: var(--gray-600, #626c78);
            }
            span.val {
                font-size: 24px;
                font-style: normal;
                font-weight: 700;
                line-height: 32px; /* 133.333% */
                color: var(--gray-800, #2e3742);
            }
        }
    }
}
</style>
