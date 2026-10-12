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
        <GridLayout v-else-if="loaded && !isEmpty" class="vent-row row" :gutter="9">
            <GridLayoutItem v-if="hasOperatingMode" class="vent-col col bc" :span="9">
                <GridCardTop :data="currentSystem" :current-switch-set="currentSwitchSet" />
            </GridLayoutItem>
            <GridLayoutItem v-if="cards.length" class="vent-col col vent-col-mid" :span="9">
                <GridCardMid :cards="cards" />
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
import { useACACDataHook } from '@/hooks/useACACDataHook';
import GridCardTop from './grid-card-top.vue';
import GridCardMid from './grid-card-mid.vue';
import GridCardBut from './grid-card-but.vue';
import { isEdge } from '@/utils/tools';
import { INFONAMES, INFO_ORDERS } from './constant';
import { dayTz } from '@/utils/dayjsTools';
import { isNil } from 'lodash';
const { data, getDutyHomeData, startDataPolling, dataLoading, loaded, loading } = useHomeDataHook();
const { acacLoaded, acacLoading, loadCodeDefine, acacData, infoDataLoading, currentSystemId, acacCodeDefine, getACACData, startInfoDataPolling } = useACACDataHook();
defineProps({
    title: {
        type: String,
        default: i18n.global.t('operation_duty_homepage.meos_home_air_conditioning_cold_source')
    }
});
const loadingData = computed(() => {
    if (isEdge()) {
        return acacLoading.value;
    } else {
        return loading.value;
    }
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
    const consoles = isEdge() ? acacData.value : currentSystem.value?.coolInputConsoles?.concat(currentSystem.value.coolSupplyConsoles);
    if (consoles) {
        consoles.forEach(info => {
            if (info.infoCode && info.infoCode.match(/SwitchSet/gi)) {
                info.time = getOpenAndCloseTime(info.switchSetRecordList);
                info.order = INFO_ORDERS.indexOf(info.infoCode);
                ret.push(info);
            }
        });
    }
    ret.sort((a, b) => a.order - b.order);
    return ret;
});

// 是否有运行工况
const hasOperatingMode = computed(() => {
    return !!currentSystem?.value?.infoCodeAndValue?.currentOperatingMode || currentSwitchSet.value.length;
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
const handleActualCloud = item => {
    if (isEdge()) return;
    for (let index = 0; index < item.unitsNumberActualValue.length; index++) {
        const element = item.unitsNumberActualValue[index];
        if (element.infoCode.includes('M1Num')) {
            element.infoCodeValue = item.unitsNumberActualValueCloud?.m1Num;
        }
        if (element.infoCode.includes('SNum')) {
            element.infoCodeValue = item.unitsNumberActualValueCloud?.snum;
        }
        if (element.infoCode.includes('Num') && !element.infoCode.includes('M1Num') && !element.infoCode.includes('SNum')) {
            element.infoCodeValue = item.unitsNumberActualValueCloud?.num;
        }
    }
};
const cards = computed(() => {
    const ret = [];
    const infocodes = [];
    const consoles = isEdge() ? acacData.value : currentSystem.value?.coolInputConsoles?.concat(currentSystem.value.coolSupplyConsoles);
    if (consoles) {
        consoles.forEach(info => {
            const code = info.actualInfoCode || info.infoCode;
            if (infocodes.indexOf(code) === -1 && INFO_ORDERS.indexOf(code) !== -1 && code && !code.match(/SwitchSet/gi)) {
                infocodes.push(code);
                const item = {
                    order: INFO_ORDERS.indexOf(code),
                    name: INFONAMES[code] || codeDefine.value[code]?.name.replace(i18n.global.t('operation_duty_homepage.meos_home_number_of_open_units'), ''),
                    values: []
                };
                if (info.unitsNumberActualValue) {
                    handleActualCloud(info);
                    if (info.unitsNumberActualValue.length === 1) {
                        item.values.push({
                            val: isNil(info.unitsNumberActualValue[0].infoCodeValue) ? '--' : info.unitsNumberActualValue[0].infoCodeValue,
                            unit: i18n.global.t('common.tai')
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
    if (currentSystem.value?.infoCodeAndValue?.primaryChillWaterMainReturnTemp) {
        const item = {
            order: INFO_ORDERS.indexOf('primaryChillWaterMainReturnTemp'),
            name: INFONAMES.primaryChillWaterMainReturnTemp,
            values: [
                {
                    val:
                        currentSystem.value?.infoCodeAndValue?.primaryChillWaterMainReturnTemp?.dataValue ||
                        currentSystem.value?.infoCodeAndValue?.primaryChillWaterMainReturnTemp?.infoCodeValue ||
                        '--',
                    unit:
                        currentSystem.value?.infoCodeAndValue?.primaryChillWaterMainReturnTemp?.dataValue ||
                        currentSystem.value?.infoCodeAndValue?.primaryChillWaterMainReturnTemp?.infoCodeValue
                            ? currentSystem.value?.infoCodeAndValue?.primaryChillWaterMainReturnTemp?.unit
                            : ''
                }
            ]
        };
        ret.push(item);
    }
    ret.sort((a, b) => a.order - b.order);
    return ret;
});

const bottomData = computed(() => {
    const ret = [];
    Object.keys(currentSystem.value?.infoCodeAndValue || {})?.forEach(bottom => {
        if (['sysCOP', 'chillersCOP', 'avgCoolingStorageRate'].indexOf(bottom) !== -1) {
            const info = currentSystem.value.infoCodeAndValue[bottom];
            ret.push({
                order: INFO_ORDERS.indexOf(bottom),
                label: INFONAMES[bottom] || info.infoCodeName,
                val: info.dataValue || info.infoCodeValue ? `${info.dataValue || info.infoCodeValue}${info.unit || ''}` : '--'
            });
        }
    });
    ret.sort((a, b) => a.order - b.order);
    return ret;
});

const isEmpty = computed(() => {
    return bottomData.value.length === 0 && cards.value.length === 0 && !hasOperatingMode.value;
});

watch(
    () => dataLoading.value,
    () => {
        if (currentSelectOption.value) {
            currentSystem.value = data.value.childCards?.find(system => system?.system?.id === currentSelectOption.value);
            currentSystemId.value = currentSystem.value?.system?.id;
        } else if (data.value) {
            currentSelectOption.value = data.value.childCards?.[0]?.system?.id;
            currentSystem.value = data.value.childCards?.[0];
            currentSystemId.value = currentSystem.value?.system?.id;
        }
    }
);

const onSelectChange = async item => {
    currentSelectOption.value = item;
    currentSystem.value = data.value.childCards?.find(system => system?.system?.id === currentSelectOption.value);
    currentSystemId.value = currentSystem.value?.system?.id;
    if (isEdge()) {
        await getACACData();
    }
};

const titlePath = computed(() => {
    if (currentSystem.value && currentSystem.value?.isExistsSystemGraph) {
        return `/ACAC`;
    }
    return '';
});
const codeDefine = computed(() => {
    const rec = {};
    if (isEdge()) {
        acacCodeDefine.value?.forEach(obj => {
            rec[obj.aliasCode] = obj;
            rec[obj.code] = obj;
        });
    } else if (data.value && data.value.scheduleInfoCodeDefine && data.value.scheduleInfoCodeDefine.ACAC) {
        data.value.scheduleInfoCodeDefine.ACAC?.forEach(obj => {
            rec[obj.aliasCode] = obj;
            rec[obj.code] = obj;
        });
    }
    return rec;
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
    if (isEdge()) {
        await loadCodeDefine();
        // 获取数据
        startInfoDataPolling();
    }
    await getDutyHomeData({ systemList: ['AIR_CONDITIONING_COLD_SOURCE'] }, '.ac-row-grid');
    if (isEdge()) {
        await getACACData();
    }
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
            height: auto;
            flex-grow: 1;
        }
    }
}
</style>
