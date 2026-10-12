<template>
    <Panel :loading="loading" :title="title" title-path="/elevator-system" :card-tag="data?.cardTag">
        <div v-if="!loaded" class="ac-row-grid"></div>
        <GridLayout v-else-if="loaded && cards?.length" class="vent-row row" :gutter="8">
            <template v-if="cards.length > 3">
                <GridLayoutItem v-for="(card, index) in cards" :key="index" class="vent-col col bc" :span="4">
                    <elevatorGridCardNew :item="card" :pie-color="card.pieColor" />
                </GridLayoutItem>
            </template>
            <template v-else-if="cards.length === 3">
                <GridLayoutItem v-for="(card, index) in cards.slice(0, 2)" :key="index" class="vent-col col bc" :span="4">
                    <elevatorGridCardNew :item="card" :pie-color="card.pieColor" />
                </GridLayoutItem>
                <GridLayoutItem class="vent-col col bc" :span="8">
                    <elevatorGridCardNew :item="cards[2]" :pie-color="cards[2].pieColor" />
                </GridLayoutItem>
            </template>
            <template v-else-if="cards.length <= 2">
                <GridLayoutItem v-for="(card, index) in cards" :key="index" class="vent-col col bc" :span="8">
                    <elevatorGridCardNew :item="card" :pie-color="card.pieColor" />
                </GridLayoutItem>
            </template>
        </GridLayout>
        <Empty v-else-if="loaded" :text="i18n.global.t('operation_duty_homepage.meos_home_no_content_yet')" width="90px" height="76px" />
    </Panel>
</template>
<script setup>
import i18n from '@/localization';
import Panel from '@/views/components/base/panel.vue';
import Empty from '@/components/Empty.vue';
import { ELEVATOR_STATUS_NAME } from '@/utils/tools';
import GridLayout from '@/components/grid/GridLayout.vue';
import GridLayoutItem from '@/components/grid/GridLayoutItem.vue';
import elevatorGridCardNew from './grid-card-ele-new.vue';
import { useHomeDataHook } from '@/hooks/useHomeDataHook';
import ElevatorGridCard from './elevator-grid-card.vue';
defineProps({
    title: {
        type: String,
        default: i18n.global.t('common.elevator')
    }
});
const getName = infoCode => {
    let prefix = i18n.global.t('operation_duty_homepage.meos_home_total_quantity');
    if (infoCode) {
        prefix = ELEVATOR_STATUS_NAME[infoCode];
    }
    return prefix;
};

const { getDutyHomeData, startDataPolling, data, loaded, loading } = useHomeDataHook();
const cards = computed(() => {
    const res = [];
    if (data.value && data.value?.childCardList.length) {
        data.value?.childCardList.forEach(card => {
            const ret = {
                name: card.name,
                classCode: card.classCode,
                runningTotal: 0,
                equipmentTotal: 0,
                children: []
            };
            // 直梯 扶梯
            if (card.classCode === 'ELELEL' || card.classCode === 'ELELES') {
                ret.pieColor = '#14C4C4';
                card.elevatorDataList?.forEach(elevator => {
                    ret.runningTotal += elevator.runningTotal;
                    ret.equipmentTotal += elevator.equipmentTotal;
                    // 直梯
                    if (elevator.classCode === 'ELELEL') {
                        // 客梯
                        if (elevator.funcType.toString() === '1') {
                            ret.children.push({
                                runningTotal: elevator.runningTotal,
                                equipmentTotal: elevator.equipmentTotal,
                                name: `${i18n.global.t('operation_duty_homepage.meos_home_passenger_elevator')}${getName(elevator.infoCode)}`
                            });
                            // 货梯
                        } else {
                            ret.children.push({
                                runningTotal: elevator.runningTotal,
                                equipmentTotal: elevator.equipmentTotal,
                                name: `${i18n.global.t('operation_duty_homepage.meos_home_freight_elevator')}${getName(elevator.infoCode)}`
                            });
                        }
                        // 扶梯
                    } else {
                        ret.children.push({
                            runningTotal: elevator.runningTotal,
                            equipmentTotal: elevator.equipmentTotal,
                            pieColor: '#14C4C4',
                            name: getName(elevator.infoCode)
                        });
                    }
                });
            } else {
                // 构建摄像数据
                card.cameraDataList?.forEach(camera => {
                    ret.runningTotal += camera.runningTotal;
                    ret.equipmentTotal += camera.equipmentTotal;
                    ret.pieColor = '#2481F2';
                    ret.children.push({
                        showChart: true,
                        runningTotal: camera.runningTotal,
                        equipmentTotal: camera.equipmentTotal,
                        pieColor: '#2481F2',
                        name: i18n.global.t('operation_duty_homepage.meos_home_online')
                    });
                });
            }
            if (ret.children.length) {
                res.push(ret);
            }
        });
    }
    return res;
});
onMounted(() => {
    startDataPolling({ systemList: ['ELEVATOR'] }, '.ac-row-grid');
    getDutyHomeData({ systemList: ['ELEVATOR'] }, '.ac-row-grid');
});
</script>
<style lang="less" scoped>
.vent-row {
    flex-grow: 0;
    height: 100%;
    padding: 0 12px;
    grid-auto-rows: 1fr;
    .vent-col {
        height: 100%;
    }
}
</style>
