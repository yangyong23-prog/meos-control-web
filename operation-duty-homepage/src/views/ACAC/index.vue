<template>
    <Panel
        v-model="currentSelectOption"
        :title="title"
        :loading="loadingData"
        :card-tag="{
            errorEventTotal: currentSystem?.exceptionEventCount
        }"
        :template-name="data?.demandTemplate?.templateName"
        :template-tag="data?.demandTemplate?.templateTag"
        :title-path="titlePath"
        :title-params="titleParams"
        :select-options="selectOptions"
        @change="onSelectChange"
    >
        <div v-if="!loaded" class="ac-row-grid"></div>
        <GridLayout v-else-if="loaded && !isEmpty" :key="systemId" class="vent-row row" :gutter="9">
            <GridLayoutItem v-if="hasOperatingMode" class="vent-col col bc" :span="9">
                <GridCardTop :data="currentSystem" :current-switch-set="currentSwitchSet" />
            </GridLayoutItem>
            <GridLayoutItem v-if="cards.length" class="vent-col col vent-col-mid" :span="9">
                <GridCardMid :key="currentSelectOption" :cards="cards" />
            </GridLayoutItem>
            <GridLayoutItem v-if="bottomData.length" class="vent-col col" :span="9">
                <GridCardBut :data="bottomData" />
            </GridLayoutItem>
        </GridLayout>
        <Empty v-else-if="loaded && isEmpty" :text="i18n.global.t('operation_duty_homepage.meos_home_no_content_yet')" width="90px" height="76px" />
    </Panel>
</template>
<script setup>
import i18n from '@/localization';
import Empty from '@/components/Empty.vue';
import GridLayout from '@/components/grid/GridLayout.vue';
import GridLayoutItem from '@/components/grid/GridLayoutItem.vue';
import Panel from '../components/base/panel.vue';
import { useHomeDataHook } from '@/hooks/useHomeDataHook';
import GridCardTop from '@/components/common/grid-card-top.vue';
import GridCardMid from '@/components/common/grid-card-mid.vue';
import GridCardBut from '@/components/common/grid-card-but.vue';
import { CHILLER_CLASSCODE, INFONAMES, INFO_ORDERS } from './constant';
import { dayTz } from '@/utils/dayjsTools';
import { isNil, uniqBy } from 'lodash';
import { useControlDataHook } from '../../hooks/useControlDataHook';
const { data, getDutyHomeData, startDataPolling, dataLoading, loaded, loading } = useHomeDataHook();
const {
    controlData,
    controlLoading,
    fetchControlData,
    codeDefine,
    startDataPolling: startControlDataPolling
} = useControlDataHook({ consoleTypes: ['COOL_SUPPLY', 'COOL_INPUT'], systemType: 'ACAC' });
defineProps({
    title: {
        type: String,
        default: i18n.global.t('operation_duty_homepage.meos_home_air_conditioning_cold_source')
    }
});
const loadingData = computed(() => {
    return dataLoading.value || controlLoading.value;
});
const currentSelectOption = ref();
const selectOptions = computed(() => {
    if (data.value) {
        return data.value.childCards?.map(system => ({
            id: system.system.id,
            name: system.system.localName
        }));
    }
    return [];
});
const currentSystem = ref();

const currentSwitchSet = computed(() => {
    const ret = [];
    const consoles = controlData.value || [];
    if (consoles.length) {
        consoles.forEach(info => {
            if (info.infoCode && info.infoCode.match(/SwitchSet/gi)) {
                info.time = getOpenAndCloseTime(info.switchSetRecordList);
                info.order = INFO_ORDERS[info.infoCode];
                ret.push(info);
            }
        });
    }
    ret.sort((a, b) => a.order - b.order);
    return ret;
});

// 获取开启时间和关闭时间
const getOpenAndCloseTime = switchSetRecordList => {
    const today = dayTz().format('YYYY-MM-DD'); // 当前日期
    const filteredData =
        switchSetRecordList?.filter(item => {
            item.operateTime = dayTz(item.operateTime).format('YYYY-MM-DD HH:mm:ss');
            return item.operateTime.startsWith(today);
        }) || [];

    // 获取开启时间(actualValue=1 的最早时间点)
    const openTime = filteredData
        .filter(item => item.actualValue === '1')
        .map(item => item.operateTime)
        .sort()[0];

    // 获取关闭时间（actualValue=0 的最晚时间点）
    const closeTime = filteredData
        .filter(item => item.actualValue === '0')
        .map(item => item.operateTime)
        .sort()
        .reverse()[0];

    // 判断关闭时间是否早于等于开启时间
    let finalCloseTime = '';
    if (!closeTime) {
        finalCloseTime = '--';
    } else if (dayTz(closeTime).isBefore(dayTz(openTime)) && openTime) {
        finalCloseTime = '--';
    } else {
        finalCloseTime = dayTz(closeTime).format('HH:mm');
    }

    return { openTime: openTime ? dayTz(openTime).format('HH:mm') : '--', closeTime: finalCloseTime };
};
const cards = computed(() => {
    const ret = [];
    const infocodes = [];
    let consoles = controlData.value || [];
    consoles = uniqBy(consoles, 'infoCode');
    if (consoles.length) {
        consoles.forEach(info => {
            const code = info.actualInfoCode || info.infoCode;
            if (INFO_ORDERS[code] && !code.match(/SwitchSet/gi)) {
                infocodes.push(code);
                const item = {
                    order: INFO_ORDERS[code],
                    name: codeDefine.value[code]?.name,
                    values: []
                };
                if (info.unitsNumberActualValue) {
                    if (info.unitsNumberActualValue.length === 1) {
                        item.values.push({
                            val: isNil(info.unitsNumberActualValue[0].infoCodeValue) ? '--' : info.unitsNumberActualValue[0].infoCodeValue,
                            unit: CHILLER_CLASSCODE[code] || i18n.global.t('common.tai')
                        });
                    } else if (info.unitsNumberActualValue.length > 1) {
                        info.unitsNumberActualValue.forEach(unit => {
                            if (unit.infoCode.match(/SNum/g)) {
                                item.values.push({
                                    order: 3,
                                    val: isNil(unit.infoCodeValue) ? '--' : unit.infoCodeValue,
                                    unit: i18n.global.t('common.small')
                                });
                            }
                            if (unit.infoCode.match(/[^S1]Num/g)) {
                                item.values.push({
                                    order: 1,
                                    val: isNil(unit.infoCodeValue) ? '--' : unit.infoCodeValue,
                                    unit: i18n.global.t('common.large')
                                });
                            }
                            if (unit.infoCode.match(/M1Num/g)) {
                                item.values.push({
                                    order: 2,
                                    val: isNil(unit.infoCodeValue) ? '--' : unit.infoCodeValue,
                                    unit: i18n.global.t('common.mid')
                                });
                            }
                        });
                        item.values.sort((a, b) => a.order - b.order);
                    }
                } else {
                    item.values.push({
                        val: info.actualValue || '--',
                        unit: info.actualValue ? info.unit : ''
                    });
                }

                if (item.values.length) {
                    ret.push(item);
                }
            }
        });
    }
    const primaryChillWaterMainReturnTemp = currentSystem.value?.infoCodeAndValue?.primaryChillWaterMainReturnTemp;
    if (primaryChillWaterMainReturnTemp) {
        const item = {
            order: INFO_ORDERS.primaryChillWaterMainReturnTemp,
            name: codeDefine.value.primaryChillWaterMainReturnTemp?.name || INFONAMES.primaryChillWaterMainReturnTemp || primaryChillWaterMainReturnTemp.infoCodeName,
            values: [
                {
                    val: primaryChillWaterMainReturnTemp?.dataValue || primaryChillWaterMainReturnTemp?.infoCodeValue || '--',
                    unit: primaryChillWaterMainReturnTemp?.dataValue || primaryChillWaterMainReturnTemp?.infoCodeValue ? primaryChillWaterMainReturnTemp?.unit : ''
                }
            ]
        };
        ret.push(item);
    }

    ret.sort((a, b) => a.order - b.order);
    return ret;
});

const isEmpty = computed(() => {
    return bottomData.value.length === 0 && cards.value.length === 0 && !hasOperatingMode.value;
});
// 是否有运行工况
const hasOperatingMode = computed(() => {
    return !!currentSystem?.value?.infoCodeAndValue?.currentOperatingMode || currentSwitchSet.value.length;
});
const bottomData = computed(() => {
    const ret = [];
    Object.keys(currentSystem.value?.infoCodeAndValue || {})?.forEach(bottom => {
        if (['sysCOP', 'chillersCOP', 'avgCoolingStorageRate'].indexOf(bottom) !== -1) {
            const info = currentSystem.value.infoCodeAndValue[bottom];
            ret.push({
                order: INFO_ORDERS[bottom],
                label: INFONAMES[bottom] || info.infoCodeName,
                val: info.dataValue || info.infoCodeValue ? `${info.dataValue || info.infoCodeValue}${info.unit || ''}` : '--'
            });
        }
    });
    ret.sort((a, b) => a.order - b.order);
    return ret;
});
watch(
    () => dataLoading.value,
    () => {
        if (currentSelectOption.value) {
            currentSystem.value = data.value.childCards?.find(system => system?.system?.id === currentSelectOption.value);
        } else if (data.value) {
            currentSelectOption.value = data.value.childCards?.[0]?.system?.id;
            currentSystem.value = data.value.childCards?.[0];
        }
    }
);
const systemId = computed(() => currentSystem.value?.system?.id);
const onSelectChange = item => {
    currentSelectOption.value = item;
    currentSystem.value = data.value.childCards?.find(system => system?.system?.id === currentSelectOption.value);
    systemId.value && fetchControlData({ systemId: systemId.value });
    systemId.value && startControlDataPolling({ systemId: systemId.value });
};

const titlePath = computed(() => {
    if (currentSystem.value && currentSystem.value?.isExistsSystemGraph) {
        return `/ACAC`;
    }
    return '';
});
const titleParams = computed(() => {
    if (currentSystem.value) {
        return {
            sysName: currentSystem.value.system?.localName,
            graphTypeCode: currentSystem.value?.graphTypeCode,
            classCode: currentSystem.value?.classCode || ''
        };
    }
    return {};
});

onMounted(async () => {
    // 获取数据
    startDataPolling({ systemList: ['AIR_CONDITIONING_COLD_SOURCE'] }, '.ac-row-grid');
    await getDutyHomeData({ systemList: ['AIR_CONDITIONING_COLD_SOURCE'] }, '.ac-row-grid');

    systemId.value && fetchControlData({ systemId: systemId.value });
    systemId.value && startControlDataPolling({ systemId: systemId.value });
});
</script>
<style lang="less" scoped>
.vent-row {
    height: 100%;
    display: flex;
    flex-direction: column;
    .vent-col {
        flex-grow: 0;
        height: 46px;
        &.vent-col-mid {
            flex-grow: 1;
        }
    }
}
</style>
