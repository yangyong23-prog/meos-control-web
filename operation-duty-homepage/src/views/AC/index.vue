<template>
    <Panel
        v-model="currentSelectOption"
        :title="title"
        :loading="loadingNumberOfChillers"
        :card-tag="currentSystem?.cardTag"
        :template-name="currentSystem?.templateName"
        :template-tag="currentSystem?.templateTag"
        :title-path="titlePath"
        :title-params="titleParams"
        :select-options="selectOptions"
        @change="onSelectChange"
    >
        <div v-if="!loaded" class="ac-row-grid"></div>
        <GridLayout v-else-if="loaded && currentSystem" class="vent-row row" :gutter="9">
            <GridLayoutItem v-if="isEdge()" class="vent-col col bc" :span="6">
                <GridCardPanel :data="currentSystem" />
            </GridLayoutItem>
            <GridLayoutItem class="vent-col col" :span="isEdge() ? 3 : 9">
                <GridLayout class="vent-row-mini row" :gutter="4">
                    <GridLayoutItem class="col bc" :span="isEdge() ? 4 : 2">
                        <GridCardMini v-if="isEdge()" :title="i18n.global.t('common.meos_home_cold_station_eer')" info-code="sysCOP" :info-code-value="currentSystem?.sysCOP" />
                        <gridCardData v-else :title="i18n.global.t('common.meos_home_cold_station_eer')" :items="[{ value: currentSystem?.sysCOP || '--' }]" />
                    </GridLayoutItem>
                    <GridLayoutItem class="col bc" :span="isEdge() ? 4 : 2">
                        <GridCardMini
                            v-if="isEdge()"
                            :title="i18n.global.t('common.meos_home_cold_station_cop')"
                            info-code="chillersCOP"
                            :info-code-value="currentSystem?.chillersCOP"
                        />
                        <gridCardData v-else :title="i18n.global.t('common.meos_home_cold_station_cop')" :items="[{ value: currentSystem?.chillersCOP || '--' }]" />
                    </GridLayoutItem>
                </GridLayout>
            </GridLayoutItem>
            <GridLayoutItem class="vent-col col bc" :span="3">
                <gridCardData :title="i18n.global.t('operation_duty_homepage.meos_home_number_of_operating_chillers')" :items="chillNum" />
            </GridLayoutItem>
            <GridLayoutItem class="vent-col col bc" :span="3">
                <gridCardData :title="i18n.global.t('common.outlet_water_temp_of_cooler')" :items="inputTemp" />
            </GridLayoutItem>
            <GridLayoutItem class="vent-col col bc" :span="3">
                <gridCardData :title="i18n.global.t('operation_duty_homepage.meos_home_cooler_return_water_temperature')" :items="returnTemp" />
            </GridLayoutItem>
        </GridLayout>
        <Empty v-else-if="loaded" :text="i18n.global.t('operation_duty_homepage.meos_home_no_content_yet')" width="90px" height="76px" />
    </Panel>
</template>

<script setup>
import i18n from '@/localization';
import Empty from '@/components/Empty.vue';
import GridLayout from '@/components/grid/GridLayout.vue';
import gridCardData from '../components/grid-card-data.vue';
import GridLayoutItem from '@/components/grid/GridLayoutItem.vue';
import Panel from '../components/base/panel.vue';
import GridCardPanel from '../components/grid-card-panel.vue';
import GridCardMini from '../components/grid-card-mini.vue';
import { useHomeDataHook } from '@/hooks/useHomeDataHook';
import { isEdge } from '@/utils/tools';
defineProps({
    size: {
        type: String,
        default: '1*1'
    },
    title: {
        type: String,
        default: i18n.global.t('common.cooling_source_system')
    }
});

const { data, getDutyHomeData, loadNumberOfChillers, loadingNumberOfChillers, chillerData, startDataPolling, dataLoading, loaded, loading } = useHomeDataHook();
const currentSelectOption = ref();
const currentSystem = ref();
const selectOptions = computed(() => {
    if (data.value) {
        return data.value.hotColdchildCardVOList?.map(system => ({
            id: system.systemId,
            name: system.localName
        }));
    }
    return [];
});
const onSelectChange = async item => {
    currentSelectOption.value = item;
    currentSystem.value = data.value.hotColdchildCardVOList?.find(system => system.systemId === item);
    await loadNumberOfChillers(item);
};
watch(
    () => dataLoading.value,
    () => {
        if (currentSelectOption.value) {
            currentSystem.value = data.value.hotColdchildCardVOList?.find(system => system.systemId === currentSelectOption.value);
        } else if (data.value) {
            currentSelectOption.value = data.value.hotColdchildCardVOList?.[0]?.systemId;
            currentSystem.value = data.value.hotColdchildCardVOList?.[0];
        }
    }
);
const titlePath = computed(() => {
    if (currentSystem.value && currentSystem.value.canJump) {
        return `/filter-system-graph/AC`;
    }
    return '';
});
const titleParams = computed(() => {
    if (currentSystem.value) {
        return {
            sysName: currentSystem.value.sysName,
            graphTypeCode: currentSystem.value.graphTypeCode,
            classCode: currentSystem.value.classCode
        };
    }
    return {};
});
const chillNum = computed(() => {
    const items = [];
    if (currentSystem.value) {
        if (currentSystem.value.runningStatistics.chillerLNum) {
            if (currentSystem.value.runningStatistics.chillerSNum && chillerData.value && chillerData.value.smallChillersNumber && +chillerData.value.smallChillersNumber > 0) {
                items.push({
                    value: currentSystem.value.runningStatistics.chillerLNum,
                    unit: i18n.global.t('common.large')
                });
                items.push({
                    value: currentSystem.value.runningStatistics.chillerSNum,
                    unit: i18n.global.t('common.small')
                });
            } else {
                items.push({
                    value: currentSystem.value.runningStatistics.chillerLNum,
                    unit: i18n.global.t('common.tai')
                });
            }
        }
    }
    if (items.length === 0) {
        items.push({
            value: '--',
            unit: ''
        });
    }
    return items;
});

const inputTemp = computed(() => {
    if (currentSystem.value && currentSystem.value.primaryChillWaterMainSupplyTemp) {
        return [
            {
                value: Number(currentSystem.value.primaryChillWaterMainSupplyTemp).toFixed(2),
                unit: '℃'
            }
        ];
    }
    return [
        {
            value: '--',
            unit: ''
        }
    ];
});

const returnTemp = computed(() => {
    if (currentSystem.value && currentSystem.value.primaryChillWaterMainReturnTemp) {
        return [
            {
                value: Number(currentSystem.value.primaryChillWaterMainReturnTemp).toFixed(2),
                unit: '℃'
            }
        ];
    }
    return [
        {
            value: '--',
            unit: ''
        }
    ];
});

onMounted(async () => {
    // 获取数据
    startDataPolling({ systemList: ['COLD_SOURCE'] }, '.ac-row-grid');
    await getDutyHomeData({ systemList: ['COLD_SOURCE'] }, '.ac-row-grid');
    if (data.value) {
        currentSelectOption.value = data.value.hotColdchildCardVOList?.[0]?.systemId;
        currentSystem.value = data.value.hotColdchildCardVOList?.[0];
        await loadNumberOfChillers(data.value.hotColdchildCardVOList?.[0]?.systemId);
    }
});
</script>
<style lang="less" scoped>
.ac-row-grid {
    flex-grow: 1;
    flex-shrink: 0;
    padding: 0 12px;
}
.vent-row {
    flex-grow: 1;
    flex-shrink: 0;
    padding: 0 12px;
    .vent-row-mini {
        height: 100%;
        flex-grow: 1;
    }
}
</style>
