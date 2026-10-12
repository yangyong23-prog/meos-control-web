<template>
    <div class="container-box">
        <m-tabs v-model="policyParams.on" :data="policyParams.items" size="large" style="margin-bottom: 18px" @change="tabsChange" />
        <template v-if="policyParams.on === '1'">
            <objectTemplate
                v-model="policyParams.on1"
                :title="i18n.global.t('meos_control_web.central_cooling_system')"
                type="ACCC"
                name="policy_site_cooling"
                :tab-data="policyParams.items1"
                @second-tab-change="secondTabChange"
            >
                <xshellFormList ref="policy_site_cooling" type="ACCC" :label-width="'170px'" :xshell-policy-params="policyParams" :data-list="policyParams.siteCoolingData" />
            </objectTemplate>
            <objectTemplate
                v-model="policyParams.onAuto"
                :title="i18n.global.t('meos_control_web.chilled_water_pump_control_group')"
                type="GROUP"
                name="policy_site_pump"
                :tab-data="policyParams.itemsAuto"
                @second-tab-change="secondTabChange"
            >
                <xshellFormList ref="policy_site_pump" :label-width="'170px'" :xshell-policy-params="policyParams" :data-list="policyParams.sitePumpData" />
            </objectTemplate>
        </template>
        <template v-if="policyParams.on === '2'">
            <objectTemplate
                v-model="policyParams.on2"
                :title="i18n.global.t('meos_control_web.central_cooling_system')"
                type="ACCC"
                name="policy_device_cooling"
                :tab-data="policyParams.items2"
                @second-tab-change="secondTabChange"
            >
                <xshellFormList ref="policy_device_cooling" :label-width="'170px'" :xshell-policy-params="policyParams" :data-list="policyParams.policyDeviceCoolingData" />
            </objectTemplate>

            <xshellFormList
                ref="policy_device_chiller"
                :label-width="'170px'"
                :title="i18n.global.t('meos_control_web.compression_chiller')"
                :xshell-policy-params="policyParams"
                :data-list="policyParams.deviceChillerData"
            />

            <xshellFormList
                ref="policy_device_fan"
                :label-width="'170px'"
                :title="i18n.global.t('meos_control_web.cooling_tower_fan')"
                :xshell-policy-params="policyParams"
                :data-list="policyParams.deviceFanData"
            />

            <xshellFormList
                ref="policy_device_pump"
                :label-width="'170px'"
                :title="i18n.global.t('meos_control_web.chilled_water_pump_alt')"
                :xshell-policy-params="policyParams"
                :data-list="policyParams.devicePumpData"
            />

            <xshellFormList
                ref="policy_device_valve"
                :label-width="'170px'"
                :title="i18n.global.t('meos_control_web.regulate_water_valve')"
                :xshell-policy-params="policyParams"
                :data-list="policyParams.deviceValueData"
            />
        </template>
        <template v-if="policyParams.on === '3'">
            <objectTemplate
                v-model="policyParams.on3"
                :title="i18n.global.t('meos_control_web.central_heat_cool_source_system')"
                type="ACCI"
                name="policy_site_cooling_hot"
                :tab-data="policyParams.items3"
                @second-tab-change="secondTabChange"
            >
                <xshellFormList ref="policy_site_cooling_hot" :label-width="'210px'" :xshell-policy-params="policyParams" :data-list="policyParams.policySiteCoolingHotData" />
            </objectTemplate>
            <xshellFormList
                ref="policy_site_pump_cold_hot"
                :label-width="'210px'"
                :title="i18n.global.t('meos_control_web.shared_chw_cw_pump_control_group')"
                :xshell-policy-params="policyParams"
                :data-list="policyParams.sitePumpColdHotData"
            />
        </template>
        <template v-if="policyParams.on === '4'">
            <objectTemplate
                v-model="policyParams.on4"
                :title="i18n.global.t('meos_control_web.central_heat_cool_source_system')"
                type="ACCI"
                name="policy_device_cooling_hot"
                :tab-data="policyParams.items4"
                @second-tab-change="secondTabChange"
            >
                <xshellFormList ref="policy_device_cooling_hot" :label-width="'150px'" :xshell-policy-params="policyParams" :data-list="policyParams.deviceCoolingHotData" />
            </objectTemplate>
            <xshellFormList
                ref="policy_device_hot_pump"
                :label-width="'150px'"
                :title="i18n.global.t('meos_control_web.air_source_heat_pump_control_group')"
                :xshell-policy-params="policyParams"
                :data-list="policyParams.deviceHotPumpData"
            />
            <xshellFormList
                ref="policy_device_circulat_pump"
                :label-width="'150px'"
                :title="i18n.global.t('meos_control_web.circulation_pump')"
                :xshell-policy-params="policyParams"
                :data-list="policyParams.deviceCirculatPumpData"
            />
            <xshellFormList
                ref="policy_device_regulat_water"
                :label-width="'150px'"
                :title="i18n.global.t('meos_control_web.regulate_water_valve')"
                :xshell-policy-params="policyParams"
                :data-list="policyParams.deviceRegulatWaterData"
            />
        </template>
        <template v-if="policyParams.on === '5'">
            <xshellFormList
                ref="policy_end_air"
                :label-width="'180px'"
                :title="i18n.global.t('meos_control_web.fresh_air_handling_unit')"
                :xshell-policy-params="policyParams"
                :data-list="policyParams.endAirData"
            />

            <xshellFormList
                ref="policy_end_vrvh"
                :label-width="'180px'"
                :title="i18n.global.t('meos_control_web.hvac_unit_horizontal_type')"
                :xshell-policy-params="policyParams"
                :data-list="policyParams.endVrvhData"
            />
            <xshellFormList
                ref="policy_end_vrvv"
                :label-width="'180px'"
                :title="i18n.global.t('meos_control_web.hvac_unit_ceiling_type')"
                :xshell-policy-params="policyParams"
                :data-list="policyParams.endVrvvData"
            />
            <xshellFormList
                ref="policy_end_fcu"
                :label-width="'180px'"
                :title="i18n.global.t('meos_control_web.fan_coil_unit')"
                :xshell-policy-params="policyParams"
                :data-list="policyParams.endFcuData"
            />
        </template>
    </div>
</template>

<script setup lang="ts">
// @ts-ignore
import i18n from '@/localization';
// eslint-disable eqeqeq
import titleType from './common/titleType.vue';
import Empty from './common/empty.vue';
import { ref, nextTick, watch, reactive, onMounted } from 'vue';
import xshellFormList from './common/xshellFormList.vue';
import { shellConfigQuery } from '@/apis/xshellConfiguration';
import { formatterValue, updateshellConfigSave, validate, checkErrorStatus } from '../utils/tools';
import { $Message, MLoading } from 'meri-plus';
import emitter from '@/utils/bus';
import objectTemplate from './common/objectTemplate.vue';
import { fetchAbortControllerInjectKey, loadingInstanceInjectKey } from '../hooks/useGlobalData';
import { ACTIVE_MENUS_ID_ENUM } from '../constants/enums';

const emit = defineEmits(['defaultRestoreAll']);

const fetchAbortController = inject(fetchAbortControllerInjectKey);
const loadingInstance = inject(loadingInstanceInjectKey);
const policyParams = reactive({
    isErrorRandom: Math.random(),
    isErrorData: [
        // { id: 'policy_site_pump', errorStatus: true },
        { id: 'policy_device_chiller', errorStatus: true },
        { id: 'policy_site_pump_cold_hot', errorStatus: true },
        { id: 'policy_device_pump', errorStatus: true },
        { id: 'policy_device_valve', errorStatus: true },
        { id: 'policy_device_fan', errorStatus: true },
        { id: 'policy_device_hot_pump', errorStatus: true },
        { id: 'policy_device_circulat_pump', errorStatus: true },
        { id: 'policy_device_regulat_water', errorStatus: true },
        { id: 'policy_end_air', errorStatus: true },
        { id: 'policy_end_vrvh', errorStatus: true },
        { id: 'policy_end_vrvv', errorStatus: true },
        { id: 'policy_end_fcu', errorStatus: true }
    ] as any,
    isErrorData1: [],
    isErrorData2: [],
    isErrorData3: [],
    isErrorData4: [],
    isErrorDataAuto: [],
    allItem: [] as any,
    noDefaultData: [] as any, // 需要恢复默认值的数组
    paramsArr: [] as any,
    siteCoolingData: [] as any,
    sitePumpData: [],
    siteCoolingHotData: [] as any,
    deviceChillerData: [],
    sitePumpColdHotData: [],
    devicePumpData: [],
    deviceValueData: [],
    endAirData: [],
    endVrvhData: [],
    endVrvvData: [],
    endFcuData: [],
    items: [
        {
            id: '1',
            name: `${i18n.global.t('meos_control_web.cooling_station_strategy_intervention')}`
        },
        {
            id: '2',
            name: `${i18n.global.t('meos_control_web.cooling_station_system_equipment_control')}`
        },
        {
            id: '3',
            name: `${i18n.global.t('meos_control_web.heating_cooling_station_strategy_intervention')}`
        },
        {
            id: '4',
            name: `${i18n.global.t('meos_control_web.heating_cooling_station_system_equipment_control')}`
        },
        {
            id: '5',
            name: `${i18n.global.t('meos_control_web.terminal_control_intervention')}`
        }
    ],
    items1: [] as any,
    items2: [] as any,
    items3: [] as any,
    items4: [] as any,
    itemsAuto: [] as any,
    on: '1',
    on1: '',
    on2: '',
    on3: '',
    on4: '',
    onAuto: '',
    tabItem1: [] as any,
    tabItem2: [] as any,
    tabItem3: [] as any,
    tabItem4: [] as any,
    tabItemAuto: [] as any,
    defaultItem: [] as any,
    deviceCoolingData: [] as any,
    deviceFanData: [] as any,
    deviceCoolingHotData: [] as any,
    deviceHotPumpData: [] as any,
    deviceCirculatPumpData: [] as any,
    deviceRegulatWaterData: [] as any,
    policySiteCoolingHotData: [] as any,
    policyDeviceCoolingData: [] as any
});
const algCoolingMachineChangeRangeDisabled = ref(false);

// 中央供冷系统
// eslint-disable-next-line camelcase
const policy_site_cooling = ref<any>(null);
// 冷冻水泵控制组
// eslint-disable-next-line camelcase
const policy_site_pump = ref<any>(null);
//
// eslint-disable-next-line camelcase
const policy_device_cooling = ref<any>(null);
// 压缩式冷水机组
// eslint-disable-next-line camelcase
const policy_device_chiller = ref<any>(null);
// 冷却塔风机
// eslint-disable-next-line camelcase
const policy_device_fan = ref<any>(null);
// 冷冻水泵
// eslint-disable-next-line camelcase
const policy_device_pump = ref<any>(null);
// 调节水阀
// eslint-disable-next-line camelcase
const policy_device_valve = ref<any>(null);
// 中央冷热源系统
// eslint-disable-next-line camelcase
const policy_site_cooling_hot = ref<any>(null);
// 冷冻水泵控制组
// eslint-disable-next-line camelcase
const policy_site_pump_cold_hot = ref<any>(null);
// 中央冷热源系统
// eslint-disable-next-line camelcase
const policy_device_cooling_hot = ref<any>(null);
// 空气源热泵控制组
// eslint-disable-next-line camelcase
const policy_device_hot_pump = ref<any>(null);
// 循环泵
// eslint-disable-next-line camelcase
const policy_device_circulat_pump = ref<any>(null);
// 调节水阀
// eslint-disable-next-line camelcase
const policy_device_regulat_water = ref<any>(null);
// 新风机组
// eslint-disable-next-line camelcase
const policy_end_air = ref<any>(null);
// 空调机组-卧式
// eslint-disable-next-line camelcase
const policy_end_vrvh = ref<any>(null);
// 空调机组-吊式
// eslint-disable-next-line camelcase
const policy_end_vrvv = ref<any>(null);
// 风机盘管
// eslint-disable-next-line camelcase
const policy_end_fcu = ref<any>(null);

const getShellConfigQuery = (name: string) => {
    loadingInstance.value?.destroy?.();
    loadingInstance.value = MLoading.service({
        target: '.shell-config-right-box',
        fullscreen: false,
        duration: 30000,
        lottieName: 'ball',
        loadIconStyle: {
            width: '100px',
            height: '100px'
        }
    });
    policyParams.allItem = [];
    policyParams.siteCoolingData = [];
    policyParams.sitePumpData = [];
    policyParams.siteCoolingHotData = [];
    policyParams.deviceChillerData = [];
    policyParams.sitePumpColdHotData = [];
    policyParams.devicePumpData = [];
    policyParams.deviceValueData = [];
    policyParams.endAirData = [];
    policyParams.endVrvhData = [];
    policyParams.endVrvvData = [];
    policyParams.endFcuData = [];
    policyParams.items1 = [];
    policyParams.items2 = [];
    policyParams.items3 = [];
    policyParams.items4 = [];
    policyParams.itemsAuto = [];
    policyParams.isErrorData1 = [];
    policyParams.isErrorData2 = [];
    policyParams.isErrorData3 = [];
    policyParams.isErrorData4 = [];
    policyParams.isErrorDataAuto = [];
    policyParams.deviceCoolingData = [];
    policyParams.deviceFanData = [];
    policyParams.deviceCoolingHotData = [];
    policyParams.deviceHotPumpData = [];
    policyParams.deviceCirculatPumpData = [];
    policyParams.deviceRegulatWaterData = [];
    policyParams.policySiteCoolingHotData = [];
    policyParams.policyDeviceCoolingData = [];

    fetchAbortController.value?.abort?.();
    fetchAbortController.value = new AbortController();
    shellConfigQuery({ scene: name }, fetchAbortController.value.signal)
        .then((res: any) => {
            if (res.code === '00000') {
                res.data.length &&
                    res.data.forEach((groups: any) => {
                        if (groups.groups.length) {
                            groups.groups.forEach((item: any) => {
                                policyParams.allItem.push(item);
                                // eslint-disable-next-line eqeqeq
                                if (item.group == 'group_policy_site_cooling') {
                                    policyParams.tabItem1 = formatterValue(item.items);
                                    policyParams.items1 = objectTabs(item.items).tabList;
                                    policyParams.on1 = objectTabs(item.items).tabOn;
                                    policyParams.siteCoolingData = objectTabs(item.items).tabData;
                                    policyParams.isErrorData1 = objectTabs(item.items, 1).errorData;
                                    // eslint-disable-next-line eqeqeq
                                } else if (item.group == 'group_policy_site_pump') {
                                    //
                                    item.items.map((code: any) => {
                                        if (code.objectName === i18n.global.t('meos_control_web.primary_pump_group')) {
                                            code.objectId = 'group_policy_site_pump_auto';
                                        }
                                    });
                                    policyParams.tabItemAuto = formatterValue(item.items);
                                    policyParams.itemsAuto = objectTabs(item.items).tabList;
                                    policyParams.onAuto = objectTabs(item.items).tabOn;
                                    policyParams.sitePumpData = objectTabs(item.items).tabData;
                                    policyParams.isErrorDataAuto = objectTabs(item.items, 1).errorData;
                                    //   policyParams.sitePumpData = formatterValue(item.items)
                                    // eslint-disable-next-line eqeqeq
                                } else if (item.group == 'group_policy_device_cooling') {
                                    policyParams.tabItem2 = formatterValue(item.items);
                                    policyParams.items2 = objectTabs(item.items).tabList;
                                    policyParams.on2 = objectTabs(item.items).tabOn;
                                    policyParams.policyDeviceCoolingData = objectTabs(item.items).tabData;
                                    policyParams.isErrorData2 = objectTabs(item.items, 2).errorData;
                                    // eslint-disable-next-line eqeqeq
                                } else if (item.group == 'group_policy_device_chiller') {
                                    policyParams.deviceChillerData = formatterValue(item.items);
                                    // eslint-disable-next-line eqeqeq
                                } else if (item.group == 'group_policy_site_pump_cold_hot') {
                                    policyParams.sitePumpColdHotData = formatterValue(item.items);
                                    // eslint-disable-next-line eqeqeq
                                } else if (item.group == 'group_policy_device_pump') {
                                    policyParams.devicePumpData = formatterValue(item.items);
                                    // eslint-disable-next-line eqeqeq
                                } else if (item.group == 'group_policy_device_valve') {
                                    policyParams.deviceValueData = formatterValue(item.items);
                                    // eslint-disable-next-line eqeqeq
                                } else if (item.group == 'group_policy_end_air') {
                                    policyParams.endAirData = formatterValue(item.items);
                                    // eslint-disable-next-line eqeqeq
                                } else if (item.group == 'group_policy_end_vrvh') {
                                    policyParams.endVrvhData = formatterValue(item.items);
                                    // eslint-disable-next-line eqeqeq
                                } else if (item.group == 'group_policy_end_vrvv') {
                                    policyParams.endVrvvData = formatterValue(item.items);
                                    // eslint-disable-next-line eqeqeq
                                } else if (item.group == 'group_policy_end_fcu') {
                                    policyParams.endFcuData = formatterValue(item.items);
                                    // eslint-disable-next-line eqeqeq
                                } else if (item.group == 'group_policy_site_cooling_hot') {
                                    policyParams.tabItem3 = formatterValue(item.items);
                                    policyParams.items3 = objectTabs(item.items).tabList;
                                    policyParams.on3 = objectTabs(item.items).tabOn;
                                    policyParams.policySiteCoolingHotData = objectTabs(item.items).tabData;
                                    policyParams.isErrorData3 = objectTabs(item.items, 3).errorData;
                                    // eslint-disable-next-line eqeqeq
                                } else if (item.group == 'group_policy_device_fan') {
                                    policyParams.deviceFanData = formatterValue(item.items);

                                    // eslint-disable-next-line eqeqeq
                                } else if (item.group == 'group_policy_device_cooling_hot') {
                                    policyParams.tabItem4 = formatterValue(item.items);
                                    policyParams.items4 = objectTabs(item.items).tabList;
                                    policyParams.on4 = objectTabs(item.items).tabOn;
                                    policyParams.deviceCoolingHotData = objectTabs(item.items).tabData;
                                    policyParams.isErrorData4 = objectTabs(item.items, 4).errorData;
                                    // eslint-disable-next-line eqeqeq
                                } else if (item.group == 'group_policy_device_hot_pump') {
                                    policyParams.deviceHotPumpData = formatterValue(item.items);
                                    // eslint-disable-next-line eqeqeq
                                } else if (item.group == 'group_policy_device_circulat_pump') {
                                    policyParams.deviceCirculatPumpData = formatterValue(item.items);
                                    // eslint-disable-next-line eqeqeq
                                } else if (item.group == 'group_policy_device_regulat_water') {
                                    policyParams.deviceRegulatWaterData = formatterValue(item.items);
                                }
                            });
                        }
                    });
                policyParams.defaultItem = JSON.parse(JSON.stringify(policyParams.allItem));
            }
        })
        .finally(() => {
            loadingInstance.value?.destroy?.();
        });
};

// 算法逻辑条件输入一级tab
const tabsChange = (data: any) => {
    formValidate();
    // eslint-disable-next-line eqeqeq
    if (data.id == '1') {
        if (policyParams.items1.length) {
            policyParams.on1 = policyParams.items1[0].id;
            policyParams.siteCoolingData = policyParams.tabItem1.filter((item: any) => {
                // eslint-disable-next-line eqeqeq
                return item.objectId == policyParams.on1;
            });
        }
        // eslint-disable-next-line eqeqeq
    } else if (data.id == '2') {
        if (policyParams.items2.length) {
            policyParams.on2 = policyParams.items2[0].id;
            policyParams.siteCoolingHotData = policyParams.tabItem2.filter((item: any) => {
                // eslint-disable-next-line eqeqeq
                return item.objectId == policyParams.on2;
            });
        }
        // eslint-disable-next-line eqeqeq
    } else if (data.id == '3') {
        if (policyParams.items3.length) {
            policyParams.on3 = policyParams.items3[0].id;
            policyParams.policySiteCoolingHotData = policyParams.tabItem3.filter((item: any) => {
                // eslint-disable-next-line eqeqeq
                return item.objectId == policyParams.on3;
            });
        }
        // eslint-disable-next-line eqeqeq
    } else if (data.id == '4') {
        if (policyParams.items4.length) {
            policyParams.on4 = policyParams.items4[0].id;
            policyParams.deviceCoolingHotData = policyParams.tabItem4.filter((item: any) => {
                // eslint-disable-next-line eqeqeq
                return item.objectId == policyParams.on4;
            });
        }
    }
};

// 二级tab数据列表
const objectTabs = (data: any, index?: number) => {
    let paramsTab = reactive({
        arr: [] as any,
        tabData: [] as any,
        tabOn: '',
        tabList: [] as any,
        errorData: [] as any
    });

    data.forEach((code: any) => {
        // eslint-disable-next-line eqeqeq
        if (code.code == 'policy_site_cooling_machine_large' && code.defaultValues == '0') {
            algCoolingMachineChangeRangeDisabled.value = true;
        }
        if (code.objectId) {
            paramsTab.arr.push({
                id: code.objectId,
                name: code.objectName
            });
        }
    });
    if (paramsTab.arr.length) {
        paramsTab.tabList = [...new Set(paramsTab.arr.map((obj: any) => JSON.stringify(obj)))].map((str: any) => JSON.parse(str));
        paramsTab.tabOn = paramsTab.tabList[0].id;
        paramsTab.tabData = formatterValue(data).filter((item: any) => {
            // eslint-disable-next-line eqeqeq
            return item.objectId == paramsTab.tabOn;
        });
        paramsTab.errorData = paramsTab.tabList.map((item: any) => {
            return {
                id: `${index}-${item.id}`,
                errorStatus: true
            };
        });
    }

    return paramsTab;
};

const secondTabChange = (data: any, name: string) => {
    // eslint-disable-next-line default-case
    switch (name) {
        case 'policy_site_cooling':
            policyParams.siteCoolingData = formattSecondTab(policyParams.tabItem1, data);
            break;
        case 'policy_site_pump':
            policyParams.sitePumpData = formattSecondTab(policyParams.tabItemAuto, data);
            break;
        case 'policy_device_cooling':
            policyParams.policyDeviceCoolingData = formattSecondTab(policyParams.tabItem2, data);
            break;
        case 'policy_site_cooling_hot':
            policyParams.policySiteCoolingHotData = formattSecondTab(policyParams.tabItem3, data);
            break;
        case 'policy_device_cooling_hot':
            policyParams.deviceCoolingHotData = formattSecondTab(policyParams.tabItem4, data);
            break;
    }
};
const formattSecondTab = (allData: any, errParams: any) => {
    let dataList = ref([] as any);
    allData.forEach((item: any) => {
        // eslint-disable-next-line eqeqeq
        if (item.code == 'policy_site_cooling_machine_large' && item.defaultValues == '0') {
            algCoolingMachineChangeRangeDisabled.value = true;
        }
        if (errParams.id === item.objectId) {
            dataList.value.push(item);
        }
    });
    formValidate();
    return dataList.value;
};

emitter.off('InputEmitter');
emitter.on('InputEmitter', (data: any) => {
    // eslint-disable-next-line eqeqeq
    if (data.menu === ACTIVE_MENUS_ID_ENUM.FRONT_END_OF_STRATEGY_AND_CONTROL_PARAMETERS) {
        // eslint-disable-next-line eqeqeq
        if (data.type == 'confirm') {
            formValidate(data.menu);
            // eslint-disable-next-line eqeqeq
        } else if (data.type == 'cancel') {
            policyParams.allItem.map((group: any) => {
                group.items.length &&
                    group.items.map((item: any) => {
                        item.valueInputLeft = item.valueLeft != null ? item.valueLeft : item.defaultValueLeft;
                        item.valueInputRight = item.valueRight != null ? item.valueRight : item.defaultValueRight;
                    });
            });
            emitter.emit('confirmDisabled', { status: true, isSave: true });
        } else {
            policyParams.allItem.map((group: any) => {
                group.items.map((item: any) => {
                    item.valueInputLeft = item.defaultValueLeft;
                    item.valueInputRight = item.defaultValueRight;
                });
            });
            formValidate();
        }
    }
});

// 更新配置
const updateshellConfig = () => {
    updateshellConfigSave('policy', policyParams.allItem).then((res: any) => {
        // eslint-disable-next-line eqeqeq
        if (res.code == '00000') {
            $Message.success({ title: i18n.global.t('meos_control_web.configuration_success') });
            emitter.emit('confirmDisabled', { status: true, isSave: true });
            getShellConfigQuery('policy');
        }
    });
};

// 验证
const formValidate = (data?: any) => {
    if (policyParams.on === '1') {
        nextTick(() => {
            Promise.all([
                policyParams.items1.length
                    ? // eslint-disable-next-line camelcase
                      policy_site_cooling.value.Mform.validate((valid: boolean, error: any) => {
                          checkErrorStatus(policyParams.isErrorData1, valid, `1-${policyParams.on1}`);
                          return valid;
                      })
                    : null,
                policyParams.itemsAuto.length
                    ? // eslint-disable-next-line camelcase
                      policy_site_pump.value.Mform.validate((valid: boolean, error: any) => {
                          checkErrorStatus(policyParams.isErrorDataAuto, valid, `1-${policyParams.onAuto}`);
                          return valid;
                      })
                    : null
            ]).then(function (results) {
                // eslint-disable-next-line eqeqeq
                if (data === ACTIVE_MENUS_ID_ENUM.FRONT_END_OF_STRATEGY_AND_CONTROL_PARAMETERS) {
                    // 更新配置
                    updateshellConfig();
                } else {
                    if (results.includes(undefined)) {
                        emitter.emit('confirmDisabled', { status: true, isSave: false });
                    }
                }
            });
        });
    } else if (policyParams.on === '2') {
        nextTick(() => {
            Promise.all([
                policyParams.items2.length
                    ? // eslint-disable-next-line camelcase
                      policy_device_cooling.value.Mform.validate((valid: boolean, error: any) => {
                          checkErrorStatus(policyParams.isErrorData2, valid, `2-${policyParams.on2}`);
                          return valid;
                      })
                    : null,
                // eslint-disable-next-line camelcase
                policy_device_chiller.value.Mform.validate((valid: boolean, error: any) => {
                    checkErrorStatus(policyParams.isErrorData, valid, 'policy_device_chiller');
                    return valid;
                }),
                // eslint-disable-next-line camelcase
                policy_device_fan.value.Mform.validate((valid: boolean, error: any) => {
                    checkErrorStatus(policyParams.isErrorData, valid, 'policy_device_fan');
                    return valid;
                }),
                // eslint-disable-next-line camelcase
                policy_device_pump.value.Mform.validate((valid: boolean, error: any) => {
                    checkErrorStatus(policyParams.isErrorData, valid, 'policy_device_pump');
                    return valid;
                }),
                // eslint-disable-next-line camelcase
                policy_device_valve.value.Mform.validate((valid: boolean, error: any) => {
                    checkErrorStatus(policyParams.isErrorData, valid, 'policy_device_valve');
                    return valid;
                })
            ]).then(function (results) {
                // eslint-disable-next-line eqeqeq
                if (data == 3) {
                    // 更新配置
                    updateshellConfig();
                } else {
                    if (results.includes(undefined)) {
                        emitter.emit('confirmDisabled', { status: true, isSave: false });
                    }
                }
            });
        });
    } else if (policyParams.on === '3') {
        nextTick(() => {
            Promise.all([
                policyParams.items3.length
                    ? // eslint-disable-next-line camelcase
                      policy_site_cooling_hot.value.Mform.validate((valid: boolean, error: any) => {
                          checkErrorStatus(policyParams.isErrorData1, valid, `3-${policyParams.on3}`);
                          return valid;
                      })
                    : null,
                // eslint-disable-next-line camelcase
                policy_site_pump_cold_hot.value.Mform.validate((valid: boolean, error: any) => {
                    checkErrorStatus(policyParams.isErrorData, valid, 'policy_site_pump_cold_hot');
                    return valid;
                })
            ]).then(function (results) {
                // eslint-disable-next-line eqeqeq
                if (data == 3) {
                    // 更新配置
                    updateshellConfig();
                } else {
                    if (results.includes(undefined)) {
                        emitter.emit('confirmDisabled', { status: true, isSave: false });
                    }
                }
            });
        });
    } else if (policyParams.on === '4') {
        nextTick(() => {
            Promise.all([
                policyParams.items4.length
                    ? // eslint-disable-next-line camelcase
                      policy_device_cooling_hot.value.Mform.validate((valid: boolean, error: any) => {
                          checkErrorStatus(policyParams.isErrorData4, valid, `4-${policyParams.on4}`);
                          return valid;
                      })
                    : null,
                // eslint-disable-next-line camelcase
                policy_device_hot_pump.value.Mform.validate((valid: boolean, error: any) => {
                    checkErrorStatus(policyParams.isErrorData, valid, 'policy_device_hot_pump');
                    return valid;
                }),
                // eslint-disable-next-line camelcase
                policy_device_circulat_pump.value.Mform.validate((valid: boolean, error: any) => {
                    checkErrorStatus(policyParams.isErrorData, valid, 'policy_device_circulat_pump');
                    return valid;
                }),
                // eslint-disable-next-line camelcase
                policy_device_regulat_water.value.Mform.validate((valid: boolean, error: any) => {
                    checkErrorStatus(policyParams.isErrorData, valid, 'policy_device_regulat_water');
                    return valid;
                })
            ]).then(function (results) {
                // eslint-disable-next-line eqeqeq
                if (data == 3) {
                    // 更新配置
                    updateshellConfig();
                } else {
                    if (results.includes(undefined)) {
                        emitter.emit('confirmDisabled', { status: true, isSave: false });
                    }
                }
            });
        });
    } else if (policyParams.on === '5') {
        nextTick(() => {
            Promise.all([
                // eslint-disable-next-line camelcase
                policy_end_air.value.Mform.validate((valid: boolean, error: any) => {
                    checkErrorStatus(policyParams.isErrorData, valid, 'policy_end_air');
                    return valid;
                }),
                // eslint-disable-next-line camelcase
                policy_end_vrvh.value.Mform.validate((valid: boolean, error: any) => {
                    checkErrorStatus(policyParams.isErrorData, valid, 'policy_end_vrvh');
                    return valid;
                }),
                // eslint-disable-next-line camelcase
                policy_end_vrvv.value.Mform.validate((valid: boolean, error: any) => {
                    checkErrorStatus(policyParams.isErrorData, valid, 'policy_end_vrvv');
                    return valid;
                }),
                // eslint-disable-next-line camelcase
                policy_end_fcu.value.Mform.validate((valid: boolean, error: any) => {
                    checkErrorStatus(policyParams.isErrorData, valid, 'policy_end_fcu');
                    return valid;
                })
            ]).then(function (results) {
                // eslint-disable-next-line eqeqeq
                if (data == 3) {
                    // 更新配置
                    updateshellConfig();
                } else {
                    if (results.includes(undefined)) {
                        emitter.emit('confirmDisabled', { status: true, isSave: false });
                    }
                }
            });
        });
    }
};

let isTreeChanged = ref(false);

const isFlag = ref(false);

watch(
    () => [policyParams.allItem, policyParams.defaultItem],
    () => {
        isTreeChanged.value = JSON.stringify(policyParams.allItem) !== JSON.stringify(policyParams.defaultItem);
        if (isTreeChanged.value) {
            formValidate();
            emitter.emit('confirmDisabled', { status: false, isSave: true });
            policyParams.isErrorRandom++;
        } else {
            emitter.emit('confirmDisabled', { status: true, isSave: true });
            formValidate();
        }
    },
    { deep: true }
);

// 监听所有的item，有不是默认值的单独放到一个数组里面
watch(
    () => policyParams.allItem,
    newValue => {
        policyParams.noDefaultData = [];
        newValue.map((group: any) => {
            group.items.map((item: any) => {
                if (item.valueInputLeft !== item.defaultValueLeft || item.valueInputRight !== item.defaultValueRight) {
                    policyParams.noDefaultData.push(item);
                }
            });
        });
    },
    { deep: true }
);

// 监听需要恢复默认值的数组 为空时不展示批量恢复默认值按钮
watch(
    () => policyParams.noDefaultData,
    newValue => {
        if (newValue.length) {
            newValue.map((item: any) => {
                if (item.valueInputLeft !== item.defaultValueLeft || item.valueInputRight !== item.defaultValueRight) {
                    isFlag.value = true;
                    emit('defaultRestoreAll', true);
                }
            });
        } else {
            isFlag.value = false;
            emit('defaultRestoreAll', false);
        }
    },
    { deep: true }
);

watch(
    () => [
        policyParams.isErrorRandom,
        policyParams.isErrorData,
        policyParams.isErrorData1,
        policyParams.isErrorData2,
        policyParams.isErrorData3,
        policyParams.isErrorData4,
        policyParams.isErrorDataAuto
    ],
    (newVal, oldVal) => {
        for (let i = 0; i < newVal.length; i++) {
            if (newVal[i] instanceof Array) {
                let arr = [];
                arr = newVal[i].map((item: any) => {
                    return item.errorStatus;
                });
                if (arr.includes(false)) {
                    emitter.emit('confirmDisabled', { status: true, isSave: false });
                    return;
                }
            }
        }
        if (isTreeChanged.value) {
            emitter.emit('confirmDisabled', { status: false, isSave: true });
        } else {
            emitter.emit('confirmDisabled', { status: true, isSave: true });
        }
    },
    { deep: true }
);

onMounted(() => {
    getShellConfigQuery('policy');
});
</script>
<style scoped lang="less">
@import '../styles/xshellConfigRight.less';
</style>
