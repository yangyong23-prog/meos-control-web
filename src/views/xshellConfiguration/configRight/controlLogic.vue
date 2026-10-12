<template>
    <div class="container-box">
        <m-tabs v-model="controlParams.firstTabOn" :data="controlParams.firstTabData" size="large" style="margin-bottom: 18px" @change="tabsTitleChange" />
        <template v-if="controlParams.firstTabOn === '1'">
            <xshellFormList
                ref="control_vrv"
                :row="'2'"
                :title="i18n.global.t('meos_control_web.hvac_unit_control_logic_condition_input')"
                :label-width="'180px'"
                :xshell-params="controlParams"
                :data-list="controlParams.controlVrvData"
            />
            <xshellFormList
                ref="control_fan"
                :row="'2'"
                :title="i18n.global.t('meos_control_web.fcu_control_logic_input')"
                :label-width="'180px'"
                :xshell-params="controlParams"
                :data-list="controlParams.controlFanData"
            />
            <xshellFormList
                ref="control_air"
                :row="'2'"
                :title="i18n.global.t('meos_control_web.fresh_air_unit_control_logic_input')"
                :label-width="'180px'"
                :xshell-params="controlParams"
                :data-list="controlParams.controlAirData"
            />
        </template>
        <template v-else-if="controlParams.firstTabOn === '2'">
            <!-- 中央空调供冷全系统（ACAC）group_control_air_cooling-->
            <objectTemplate
                v-model="controlParams.second_tab_control_air_cooling_on"
                :title="i18n.global.t('meos_control_web.central_hvac_cooling_full_system')"
                type="ACAC"
                name="control_air_cooling"
                :tab-data="controlParams.second_tab_control_air_cooling"
                @second-tab-change="secondTabChange"
            >
                <xshellFormList
                    ref="control_air_cooling"
                    :is-ellipsis="true"
                    :label-width="'112px'"
                    :xshell-params="controlParams"
                    :data-list="controlParams.controlAirCoolingData"
                />
            </objectTemplate>
            <!-- 中央空调供热全系统（ACAH） group_control_air_hot-->
            <objectTemplate
                v-model="controlParams.second_tab_control_air_hot_on"
                :title="i18n.global.t('meos_control_web.central_hvac_heating_system')"
                type="ACAH"
                name="control_air_hot"
                :tab-data="controlParams.second_tab_control_air_hot"
                @second-tab-change="secondTabChange"
            >
                <xshellFormList ref="control_air_hot" :is-ellipsis="true" :label-width="'112px'" :xshell-params="controlParams" :data-list="controlParams.controlAirHotData" />
            </objectTemplate>
            <!-- 中央空调冷热源全系统（ACAI） -->
            <objectTemplate
                v-model="controlParams.second_tab_control_air_cold_hot_on"
                :title="i18n.global.t('meos_control_web.central_hvac_cold_hot_source_system')"
                type="ACAI"
                name="control_air_cold_hot"
                :tab-data="controlParams.second_tab_control_air_cold_hot"
                @second-tab-change="secondTabChange"
            >
                <xshellFormList
                    ref="control_air_cold_hot"
                    :is-ellipsis="true"
                    :label-width="'112px'"
                    :xshell-params="controlParams"
                    :data-list="controlParams.controlAirColdHotData"
                />
            </objectTemplate>
            <!-- 冷冻水泵控制组（ACCPC） group_control_cool_pump_group-->
            <objectTemplate
                v-model="controlParams.second_tab_control_cool_pump_group_on"
                :title="i18n.global.t('meos_control_web.chilled_water_pump_control_group')"
                type="ACCPC"
                name="control_cool_pump_group"
                :tab-data="controlParams.second_tab_control_cool_pump_group"
                @second-tab-change="secondTabChange"
            >
                <xshellFormList
                    ref="control_cool_pump_group"
                    :is-ellipsis="true"
                    :label-width="'112px'"
                    :xshell-params="controlParams"
                    :data-list="controlParams.controlCoolPumpGroupData"
                />
            </objectTemplate>
            <!-- 冷却水泵控制组（ACOPC） group_control_chil_pump_group-->
            <objectTemplate
                v-model="controlParams.second_tab_control_chil_pump_group_on"
                :title="i18n.global.t('meos_control_web.control_chil_pump_group')"
                type="ACOPC"
                name="control_chil_pump_group"
                :tab-data="controlParams.second_tab_control_chil_pump_group"
                @second-tab-change="secondTabChange"
            >
                <xshellFormList
                    ref="control_chil_pump_group"
                    :is-ellipsis="true"
                    :label-width="'112px'"
                    :xshell-params="controlParams"
                    :data-list="controlParams.controlChilPumpGroupData"
                />
            </objectTemplate>
            <!-- 冷却塔控制组（ACOTC） group_control_cool_tower_group-->
            <objectTemplate
                v-model="controlParams.second_tab_control_cool_tower_group_on"
                :title="i18n.global.t('meos_control_web.control_cool_tower_group')"
                type="ACOTC"
                name="control_cool_tower_group"
                :tab-data="controlParams.second_tab_control_cool_tower_group"
                @second-tab-change="secondTabChange"
            >
                <xshellFormList
                    ref="control_cool_tower_group"
                    :is-ellipsis="true"
                    :label-width="'112px'"
                    :xshell-params="controlParams"
                    :data-list="controlParams.controlCoolTowerGroupData"
                />
            </objectTemplate>
            <!-- 供冷乙二醇泵控制组（ACCGP） group_control_cgly_pump_group-->
            <objectTemplate
                v-model="controlParams.second_tab_control_cgly_pump_group_on"
                :title="i18n.global.t('meos_control_web.control_cgly_pump_group')"
                type="ACCGP"
                name="control_cgly_pump_group"
                :tab-data="controlParams.second_tab_control_cgly_pump_group"
                @second-tab-change="secondTabChange"
            >
                <xshellFormList
                    ref="control_cgly_pump_group"
                    :is-ellipsis="true"
                    :label-width="'112px'"
                    :xshell-params="controlParams"
                    :data-list="controlParams.controlCglyPumpGroupData"
                />
            </objectTemplate>
            <!-- 蓄冷热槽控制组（ACCST） group_control_cool_hslo_group-->
            <objectTemplate
                v-model="controlParams.second_tab_control_cool_hslo_group_on"
                :title="i18n.global.t('meos_control_web.control_cool_hslo_group')"
                type="ACCST"
                name="control_cool_hslo_group"
                :tab-data="controlParams.second_tab_control_cool_hslo_group"
                @second-tab-change="secondTabChange"
            >
                <xshellFormList
                    ref="control_cool_hslo_group"
                    :is-ellipsis="true"
                    :label-width="'112px'"
                    :xshell-params="controlParams"
                    :data-list="controlParams.controlCoolHsloGroupData"
                />
            </objectTemplate>
            <!-- 供热水泵控制组（ACHPC） group_control_hot_pump_group-->
            <objectTemplate
                v-model="controlParams.second_tab_control_hot_pump_group_on"
                :title="i18n.global.t('meos_control_web.heating_pump_control_group')"
                type="ACHPC"
                name="control_hot_pump_group"
                :tab-data="controlParams.second_tab_control_hot_pump_group"
                @second-tab-change="secondTabChange"
            >
                <xshellFormList
                    ref="control_hot_pump_group"
                    :is-ellipsis="true"
                    :label-width="'112px'"
                    :xshell-params="controlParams"
                    :data-list="controlParams.controlHotPumpGroupData"
                />
            </objectTemplate>
            <!-- 冷热共用水泵控制组（ACPPC） group_control_cool_hot_pump-->
            <objectTemplate
                v-model="controlParams.second_tab_control_cool_hot_pump_on"
                :title="i18n.global.t('meos_control_web.shared_chw_cw_pump_control_group')"
                type="ACPPC"
                name="group_control_cool_hot_pump"
                :tab-data="controlParams.second_tab_control_cool_hot_pump"
                @second-tab-change="secondTabChange"
            >
                <xshellFormList
                    ref="group_control_cool_hot_pump"
                    :is-ellipsis="true"
                    :label-width="'112px'"
                    :xshell-params="controlParams"
                    :data-list="controlParams.controlCoolHotPumpData"
                />
            </objectTemplate>
        </template>
        <!-- 通风控制逻辑条件输入：主 Tab → 场景（三级分类）→ 参数分组
             常驻挂载以保证参数初始化与校验参与；因组件为多根节点，v-show 无法生效，
             故显隐由 Panel 内部按 active 控制 -->
        <VentControlPanel ref="vent_control_panel" :active="controlParams.firstTabOn === '3'" :xshell-params="controlParams" @scene-change="sceneChangeValidate" />
    </div>
</template>

<script setup lang="ts">
// @ts-ignore
import i18n from '@/localization';
/* eslint-disable camelcase */
/* eslint-disable eqeqeq */
import { ref, reactive } from 'vue';
import { formatterValue, updateshellConfigSave, validate, checkErrorStatus } from '../utils/tools';
import { shellConfigQuery } from '@/apis/xshellConfiguration';
import xshellFormList from './common/xshellFormList.vue';
import objectTemplate from './common/objectTemplate.vue';
import VentControlPanel from './common/VentControlPanel.vue';
import emitter from '@/utils/bus';
import { $Message, MLoading } from 'meri-plus';
import { fetchAbortControllerInjectKey, loadingInstanceInjectKey } from '../hooks/useGlobalData';
import { ACTIVE_MENUS_ID_ENUM } from '../constants/enums';
import { VENT_GROUP_PREFIX } from '../constants/constant';

const emit = defineEmits(['defaultRestoreAll']);
const fetchAbortController: any = inject(fetchAbortControllerInjectKey);
const loadingInstance: any = inject(loadingInstanceInjectKey);

const controlParams = reactive({
    isErrorRandom: Math.random(),
    firstTabOn: '1',
    firstTabData: [
        {
            id: '1',
            name: `${i18n.global.t('meos_control_web.terminal_control_logic_input')}`
        },
        {
            id: '2',
            name: `${i18n.global.t('meos_control_web.heating_cooling_source_control_logic_unit_selection_input')}`
        },
        {
            id: '3',
            name: `${i18n.global.t('meos_control_web.vent_control_logic_condition_input')}`
        }
    ],
    allItem: [] as any, // 全部的item,不包含groups
    controlVrvData: [],
    controlFanData: [],
    controlAirData: [],
    defaultItem: [] as any,
    noDefaultData: [] as any, // 需要恢复默认值的数组
    // 中央空调供冷全系统
    second_tab_control_air_cooling: [],
    second_tab_control_air_cooling_on: '',
    second_tab_control_air_cooling_Data: [],
    controlAirCoolingData: [],
    controlAirCoolingErrorData: [],
    // 中央空调供热全系统
    second_tab_control_air_hot: [],
    second_tab_control_air_hot_on: '',
    second_tab_control_air_hot_Data: [],
    controlAirHotData: [],
    controlAirHotErrorData: [],
    // 中央空调冷热源全系统
    second_tab_control_air_cold_hot: [],
    second_tab_control_air_cold_hot_on: '',
    second_tab_control_air_cold_hot_Data: [],
    controlAirColdHotData: [],
    controlAirColdHotErrorData: [],
    // 冷冻水泵控制组
    second_tab_control_cool_pump_group: [],
    second_tab_control_cool_pump_group_on: '',
    second_tab_control_cool_pump_group_Data: [],
    controlCoolPumpGroupData: [],
    controlCoolPumpGroupErrorData: [],
    // 冷却水泵控制组
    second_tab_control_chil_pump_group: [],
    second_tab_control_chil_pump_group_on: '',
    second_tab_control_chil_pump_group_Data: [],
    controlChilPumpGroupData: [],
    controlChilPumpGroupErrorData: [],
    //   冷却塔控制组
    second_tab_control_cool_tower_group: [],
    second_tab_control_cool_tower_group_on: '',
    second_tab_control_cool_tower_group_Data: [],
    controlCoolTowerGroupData: [],
    controlCoolTowerGroupErrorData: [],
    //   供冷乙二醇泵控制组
    second_tab_control_cgly_pump_group: [],
    second_tab_control_cgly_pump_group_on: '',
    second_tab_control_cgly_pump_group_Data: [],
    controlCglyPumpGroupData: [],
    controlCglyPumpGroupErrorData: [],
    //   蓄冷热槽控制组
    second_tab_control_cool_hslo_group: [],
    second_tab_control_cool_hslo_group_on: '',
    second_tab_control_cool_hslo_group_Data: [],
    controlCoolHsloGroupData: [],
    controlCoolHsloGroupErrorData: [],
    // 供热水泵控制组
    second_tab_control_hot_pump_group: [],
    second_tab_control_hot_pump_group_on: '',
    second_tab_control_hot_pump_group_Data: [],
    controlHotPumpGroupData: [],
    controlHotPumpGroupErrorData: [],
    // 冷热共用水泵控制组
    second_tab_control_cool_hot_pump: [],
    second_tab_control_cool_hot_pump_on: '',
    second_tab_control_cool_hot_pump_Data: [],
    controlCoolHotPumpData: [],
    controlCoolHotPumpErrorData: []
});
// 空调机组控制逻辑条件输入
// eslint-disable-next-line camelcase
const control_vrv = ref<any>(null);
// 风机盘管控制逻辑条件输入
// eslint-disable-next-line camelcase
const control_fan = ref<any>(null);
// 新风机组控制逻辑条件输入
// eslint-disable-next-line camelcase
const control_air = ref<any>(null);
// 中央空调供冷全系统
const control_air_cooling = ref<any>(null);
// 中央空调供热全系统
const control_air_hot = ref<any>(null);
// 中央空调冷热源全系统
const control_air_cold_hot = ref<any>(null);
// 冷冻水泵控制组
const control_cool_pump_group = ref<any>(null);
// 冷却水泵控制组
const control_chil_pump_group = ref<any>(null);
// 冷却塔控制组
const control_cool_tower_group = ref<any>(null);
// 供冷乙二醇泵控制组
const control_cgly_pump_group = ref<any>(null);
// 蓄冷热槽控制组
const control_cool_hslo_group = ref<any>(null);
// 供热水泵控制组
const control_hot_pump_group = ref<any>(null);
// 冷热共用水泵控制组
const group_control_cool_hot_pump = ref<any>(null);
// 通风控制逻辑条件输入（场景面板）
const vent_control_panel = ref<any>(null);

const tabsTitleChange = () => {
    formValidate();
};
// 二级tab数据列表
const objectTabs = (data: any, index?: number) => {
    let params = reactive({
        arr: [] as any,
        tabData: [] as any,
        tabOn: '',
        tabList: [] as any,
        errorData: [] as any
    });

    data.forEach((code: any) => {
        if (code.objectId) {
            params.arr.push({
                id: code.objectId,
                name: code.objectName
            });
        }
    });
    if (params.arr.length) {
        params.tabList = [...new Set(params.arr.map((obj: any) => JSON.stringify(obj)))].map((str: any) => JSON.parse(str));
        params.tabOn = params.tabList[0].id;
        params.tabData = formatterValue(data).filter((item: any) => {
            // eslint-disable-next-line eqeqeq
            return item.objectId == params.tabOn;
        });
        params.errorData = params.tabList.map((item: any) => {
            return {
                id: `${index}-${item.id}`,
                errorStatus: true
            };
        });
    }

    return params;
};

const CONTROL_GROUP_ALIAS_MAP: Record<string, string> = {
    group_control_cold_hot_all: 'group_control_air_cold_hot'
};

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
    controlParams.allItem = [];
    controlParams.controlVrvData = [];
    controlParams.controlFanData = [];
    controlParams.controlAirData = [];

    controlParams.controlAirCoolingData = [];
    controlParams.controlAirCoolingErrorData = [];
    controlParams.second_tab_control_air_cooling_Data = [];

    controlParams.controlAirHotData = [];
    controlParams.controlAirHotErrorData = [];
    controlParams.second_tab_control_air_hot_Data = [];

    controlParams.controlAirColdHotData = [];
    controlParams.controlAirColdHotErrorData = [];
    controlParams.second_tab_control_air_cold_hot_Data = [];

    controlParams.controlChilPumpGroupData = [];
    controlParams.controlChilPumpGroupErrorData = [];
    controlParams.second_tab_control_chil_pump_group_Data = [];

    controlParams.controlCoolTowerGroupData = [];
    controlParams.controlCoolTowerGroupErrorData = [];
    controlParams.second_tab_control_cool_tower_group_Data = [];

    controlParams.controlCglyPumpGroupData = [];
    controlParams.controlCglyPumpGroupErrorData = [];
    controlParams.second_tab_control_cgly_pump_group_Data = [];

    controlParams.controlCoolHsloGroupData = [];
    controlParams.controlCoolHsloGroupErrorData = [];
    controlParams.second_tab_control_cool_hslo_group_Data = [];

    controlParams.controlHotPumpGroupData = [];
    controlParams.controlHotPumpGroupErrorData = [];
    controlParams.second_tab_control_hot_pump_group_Data = [];

    controlParams.controlCoolHotPumpData = [];
    controlParams.controlCoolHotPumpErrorData = [];
    controlParams.second_tab_control_cool_hot_pump_Data = [];

    // 通风场景：重置聚合错误状态与面板选中状态
    ventErrorData.value = [];
    vent_control_panel.value?.resetScene?.();

    fetchAbortController.value?.abort?.();
    fetchAbortController.value = new AbortController();
    shellConfigQuery({ scene: name }, fetchAbortController.value.signal)
        .then((res: any) => {
            if (res.code === '00000') {
                res.data.length &&
                    res.data.forEach((group: any) => {
                        group.groups.length &&
                            group.groups.forEach((item: any) => {
                                controlParams.allItem.push(item);
                                // 通风场景分组以统一前缀命名，由 VentControlPanel 自行按场景定义分桶，
                                // 此处仅入 allItem，避免进入下方精确匹配的 switch 分支。
                                if (typeof item.group === 'string' && item.group.startsWith(VENT_GROUP_PREFIX)) {
                                    return;
                                }
                                // eslint-disable-next-line default-case
                                const normalizedGroup = CONTROL_GROUP_ALIAS_MAP[item.group] || item.group;
                                switch (normalizedGroup) {
                                    case 'group_control_vrv':
                                        controlParams.controlVrvData = formatterValue(item.items);
                                        break;
                                    case 'group_control_fan':
                                        controlParams.controlFanData = formatterValue(item.items);
                                        break;
                                    case 'group_control_air':
                                        controlParams.controlAirData = formatterValue(item.items);
                                        break;
                                    case 'group_control_air_cooling':
                                        controlParams.second_tab_control_air_cooling_Data = formatterValue(item.items);
                                        controlParams.second_tab_control_air_cooling = objectTabs(item.items).tabList;
                                        controlParams.second_tab_control_air_cooling_on = objectTabs(item.items).tabOn;
                                        controlParams.controlAirCoolingData = objectTabs(item.items).tabData;
                                        controlParams.controlAirCoolingErrorData = objectTabs(item.items, 2).errorData;
                                        break;
                                    case 'group_control_air_hot':
                                        controlParams.second_tab_control_air_hot_Data = formatterValue(item.items);
                                        controlParams.second_tab_control_air_hot = objectTabs(item.items).tabList;
                                        controlParams.second_tab_control_air_hot_on = objectTabs(item.items).tabOn;
                                        controlParams.controlAirHotData = objectTabs(item.items).tabData;
                                        controlParams.controlAirHotErrorData = objectTabs(item.items, 2).errorData;
                                        break;
                                    case 'group_control_air_cold_hot':
                                        controlParams.second_tab_control_air_cold_hot_Data = formatterValue(item.items);
                                        controlParams.second_tab_control_air_cold_hot = objectTabs(item.items).tabList;
                                        controlParams.second_tab_control_air_cold_hot_on = objectTabs(item.items).tabOn;
                                        controlParams.controlAirColdHotData = objectTabs(item.items).tabData;
                                        controlParams.controlAirColdHotErrorData = objectTabs(item.items, 2).errorData;
                                        break;
                                    case 'group_control_cool_pump_group':
                                        controlParams.second_tab_control_cool_pump_group_Data = formatterValue(item.items);
                                        controlParams.second_tab_control_cool_pump_group = objectTabs(item.items).tabList;
                                        controlParams.second_tab_control_cool_pump_group_on = objectTabs(item.items).tabOn;
                                        controlParams.controlCoolPumpGroupData = objectTabs(item.items).tabData;
                                        controlParams.controlCoolPumpGroupErrorData = objectTabs(item.items, 2).errorData;
                                        break;
                                    case 'group_control_chil_pump_group':
                                        controlParams.second_tab_control_chil_pump_group_Data = formatterValue(item.items);
                                        controlParams.second_tab_control_chil_pump_group = objectTabs(item.items).tabList;
                                        controlParams.second_tab_control_chil_pump_group_on = objectTabs(item.items).tabOn;
                                        controlParams.controlChilPumpGroupData = objectTabs(item.items).tabData;
                                        controlParams.controlChilPumpGroupErrorData = objectTabs(item.items, 2).errorData;
                                        break;
                                    case 'group_control_cool_tower_group':
                                        controlParams.second_tab_control_cool_tower_group_Data = formatterValue(item.items);
                                        controlParams.second_tab_control_cool_tower_group = objectTabs(item.items).tabList;
                                        controlParams.second_tab_control_cool_tower_group_on = objectTabs(item.items).tabOn;
                                        controlParams.controlCoolTowerGroupData = objectTabs(item.items).tabData;
                                        controlParams.controlCoolTowerGroupErrorData = objectTabs(item.items, 2).errorData;
                                        break;
                                    case 'group_control_cgly_pump_group':
                                        controlParams.second_tab_control_cgly_pump_group_Data = formatterValue(item.items);
                                        controlParams.second_tab_control_cgly_pump_group = objectTabs(item.items).tabList;
                                        controlParams.second_tab_control_cgly_pump_group_on = objectTabs(item.items).tabOn;
                                        controlParams.controlCglyPumpGroupData = objectTabs(item.items).tabData;
                                        controlParams.controlCglyPumpGroupErrorData = objectTabs(item.items, 2).errorData;
                                        break;
                                    case 'group_control_cool_hslo_group':
                                        controlParams.second_tab_control_cool_hslo_group_Data = formatterValue(item.items);
                                        controlParams.second_tab_control_cool_hslo_group = objectTabs(item.items).tabList;
                                        controlParams.second_tab_control_cool_hslo_group_on = objectTabs(item.items).tabOn;
                                        controlParams.controlCoolHsloGroupData = objectTabs(item.items).tabData;
                                        controlParams.controlCoolHsloGroupErrorData = objectTabs(item.items, 2).errorData;
                                        break;
                                    case 'group_control_hot_pump_group':
                                        controlParams.second_tab_control_hot_pump_group_Data = formatterValue(item.items);
                                        controlParams.second_tab_control_hot_pump_group = objectTabs(item.items).tabList;
                                        controlParams.second_tab_control_hot_pump_group_on = objectTabs(item.items).tabOn;
                                        controlParams.controlHotPumpGroupData = objectTabs(item.items).tabData;
                                        controlParams.controlHotPumpGroupErrorData = objectTabs(item.items, 2).errorData;
                                        break;
                                    case 'group_control_cool_hot_pump':
                                        controlParams.second_tab_control_cool_hot_pump_Data = formatterValue(item.items);
                                        controlParams.second_tab_control_cool_hot_pump = objectTabs(item.items).tabList;
                                        controlParams.second_tab_control_cool_hot_pump_on = objectTabs(item.items).tabOn;
                                        controlParams.controlCoolHotPumpData = objectTabs(item.items).tabData;
                                        controlParams.controlCoolHotPumpErrorData = objectTabs(item.items, 2).errorData;
                                        break;
                                    default:
                                        break;
                                }
                            });
                    });

                // 通风场景：在默认值快照前同步完成参数格式化，
                // 保证 formatterValue 对 allItem 的加工被纳入快照，避免误判为已修改
                vent_control_panel.value?.initScene?.();

                controlParams.defaultItem = JSON.parse(JSON.stringify(controlParams.allItem));
            }
        })
        .catch(() => {
            $Message.error({ title: i18n.global.t('meos_control_web.request_failed') });
        })
        .finally(() => {
            loadingInstance.value?.destroy?.();
        });
};

// 更新配置
const updateshellConfig = () => {
    const loading = MLoading.service({
        target: '.shell-config-right-box',
        fullscreen: false,
        duration: 30000,
        lottieName: 'ball',
        loadIconStyle: {
            width: '100px',
            height: '100px'
        }
    });
    updateshellConfigSave('control', controlParams.allItem).then((res: any) => {
        loading.destroy();
        if (res.code == '00000') {
            $Message.success({ title: i18n.global.t('meos_control_web.configuration_success') });
            emitter.emit('confirmDisabled', { status: true, isSave: true });
            getShellConfigQuery('control');
        } else {
            loading.destroy();
        }
    });
};

emitter.off('InputEmitter');
emitter.on('InputEmitter', (data: any) => {
    // eslint-disable-next-line eqeqeq
    if (data.menu === ACTIVE_MENUS_ID_ENUM.CONTROL_LOGIC) {
        // eslint-disable-next-line eqeqeq
        if (data.type == 'confirm') {
            formValidate(data.menu);
            // eslint-disable-next-line eqeqeq
        } else if (data.type == 'cancel') {
            controlParams.allItem.map((group: any) => {
                group.items.length &&
                    group.items.map((item: any) => {
                        item.valueInputLeft = item.valueLeft != null ? item.valueLeft : item.defaultValueLeft;
                    });
            });
            emitter.emit('confirmDisabled', { status: true, isSave: true });
        } else {
            controlParams.allItem.map((group: any) => {
                group.items.map((item: any) => {
                    item.valueInputLeft = item.defaultValueLeft;
                });
            });
            formValidate();
        }
    }
});
const secondTabChange = (data: any, name: string) => {
    // eslint-disable-next-line default-case
    switch (name) {
        case 'control_air_cooling':
            controlParams.controlAirCoolingData = formattSecondTab(controlParams.second_tab_control_air_cooling_Data, data);
            break;
        case 'control_air_hot':
            controlParams.controlAirHotData = formattSecondTab(controlParams.second_tab_control_air_hot_Data, data);
            break;
        case 'control_air_cold_hot':
            controlParams.controlAirColdHotData = formattSecondTab(controlParams.second_tab_control_air_cold_hot_Data, data);
            break;
        case 'control_cool_pump_group':
            controlParams.controlCoolPumpGroupData = formattSecondTab(controlParams.second_tab_control_cool_pump_group_Data, data);
            break;
        case 'control_chil_pump_group':
            controlParams.controlChilPumpGroupData = formattSecondTab(controlParams.second_tab_control_chil_pump_group_Data, data);
            break;
        case 'control_cool_tower_group':
            controlParams.controlCoolTowerGroupData = formattSecondTab(controlParams.second_tab_control_cool_tower_group_Data, data);
            break;
        case 'control_cgly_pump_group':
            controlParams.controlCglyPumpGroupData = formattSecondTab(controlParams.second_tab_control_cgly_pump_group_Data, data);
            break;
        case 'control_cool_hslo_group':
            controlParams.controlCoolHsloGroupData = formattSecondTab(controlParams.second_tab_control_cool_hslo_group_Data, data);
            break;
        case 'control_hot_pump_group':
            controlParams.controlHotPumpGroupData = formattSecondTab(controlParams.second_tab_control_hot_pump_group_Data, data);
            break;
        case 'group_control_cool_hot_pump':
            controlParams.controlCoolHotPumpData = formattSecondTab(controlParams.second_tab_control_cool_hot_pump_Data, data);
            break;
    }
};

const formattSecondTab = (allData: any, params: any) => {
    let dataList = ref([] as any);
    allData.forEach((item: any) => {
        if (params.id === item.objectId) {
            dataList.value.push(item);
        }
    });
    formValidate();
    return dataList.value;
};
const results1: any = ref([]);
const results2: any = ref([]);
// 通风控制逻辑条件输入：错误状态聚合（响应式，供确认按钮可用性判断）
const ventErrorData: any = ref([]);

// 通风场景切换时重新校验，保证确认按钮状态跟随当前场景
const sceneChangeValidate = () => {
    formValidate();
};

// 统一处理校验结果：包含 undefined 时置灰，否则恢复可用
const formValidateResult = (results: any[], data?: any) => {
    if (data === ACTIVE_MENUS_ID_ENUM.CONTROL_LOGIC || data === 1) {
        // 更新配置
        updateshellConfig();
    } else {
        if (results.includes(undefined) || results.includes(false)) {
            emitter.emit('confirmDisabled', { status: true, isSave: false });
        }
    }
};

// 验证
const formValidate = (data?: any) => {
    if (controlParams.firstTabOn === '1') {
        nextTick(() => {
            Promise.all([validate(control_vrv), validate(control_fan), validate(control_air)]).then(function (results) {
                results1.value = results;
                // eslint-disable-next-line eqeqeq
                if (data == 1) {
                    // 更新配置
                    updateshellConfig();
                } else {
                    if (results1.value.includes(undefined) || results2.value.includes(undefined)) {
                        emitter.emit('confirmDisabled', { status: true, isSave: false });
                    }
                }
            });
        });
    } else if (controlParams.firstTabOn === '2') {
        nextTick(() => {
            Promise.all([
                controlParams.second_tab_control_air_cooling.length
                    ? control_air_cooling.value.Mform.validate((valid: boolean) => {
                          checkErrorStatus(controlParams.controlAirCoolingErrorData, valid, `2-${controlParams.second_tab_control_air_cooling_on}`);
                          return valid;
                      })
                    : null,
                controlParams.second_tab_control_air_hot.length
                    ? control_air_hot.value.Mform.validate((valid: boolean) => {
                          checkErrorStatus(controlParams.controlAirHotErrorData, valid, `2-${controlParams.second_tab_control_air_hot_on}`);
                          return valid;
                      })
                    : null,
                controlParams.second_tab_control_air_cold_hot.length
                    ? control_air_cold_hot.value.Mform.validate((valid: boolean) => {
                          checkErrorStatus(controlParams.controlAirColdHotErrorData, valid, `2-${controlParams.second_tab_control_air_cold_hot_on}`);
                          return valid;
                      })
                    : null,
                controlParams.second_tab_control_cool_pump_group.length
                    ? control_cool_pump_group.value.Mform.validate((valid: boolean) => {
                          checkErrorStatus(controlParams.controlCoolPumpGroupErrorData, valid, `2-${controlParams.second_tab_control_cool_pump_group_on}`);
                          return valid;
                      })
                    : null,
                controlParams.second_tab_control_chil_pump_group.length
                    ? control_chil_pump_group.value.Mform.validate((valid: boolean) => {
                          checkErrorStatus(controlParams.controlChilPumpGroupErrorData, valid, `2-${controlParams.second_tab_control_chil_pump_group_on}`);
                          return valid;
                      })
                    : null,
                controlParams.second_tab_control_cool_tower_group.length
                    ? control_cool_tower_group.value.Mform.validate((valid: boolean) => {
                          checkErrorStatus(controlParams.controlCoolTowerGroupErrorData, valid, `2-${controlParams.second_tab_control_cool_tower_group_on}`);
                          return valid;
                      })
                    : null,
                controlParams.second_tab_control_cgly_pump_group.length
                    ? control_cgly_pump_group.value.Mform.validate((valid: boolean) => {
                          checkErrorStatus(controlParams.controlCglyPumpGroupErrorData, valid, `2-${controlParams.second_tab_control_cgly_pump_group_on}`);
                          return valid;
                      })
                    : null,
                controlParams.second_tab_control_cool_hslo_group.length
                    ? control_cool_hslo_group.value.Mform.validate((valid: boolean) => {
                          checkErrorStatus(controlParams.controlCoolHsloGroupErrorData, valid, `2-${controlParams.second_tab_control_cool_hslo_group_on}`);
                          return valid;
                      })
                    : null,
                controlParams.second_tab_control_hot_pump_group.length
                    ? control_hot_pump_group.value.Mform.validate((valid: boolean) => {
                          checkErrorStatus(controlParams.controlHotPumpGroupErrorData, valid, `2-${controlParams.second_tab_control_hot_pump_group_on}`);
                          return valid;
                      })
                    : null,
                controlParams.second_tab_control_cool_hot_pump.length
                    ? group_control_cool_hot_pump.value.Mform.validate((valid: boolean) => {
                          checkErrorStatus(controlParams.controlCoolHotPumpErrorData, valid, `2-${controlParams.second_tab_control_cool_hot_pump_on}`);
                          return valid;
                      })
                    : null
            ]).then(function (results) {
                results2.value = results;
                // eslint-disable-next-line eqeqeq
                if (data === ACTIVE_MENUS_ID_ENUM.CONTROL_LOGIC) {
                    // 更新配置
                    updateshellConfig();
                } else {
                    if (results1.value.includes(undefined) || results2.value.includes(undefined)) {
                        emitter.emit('confirmDisabled', { status: true, isSave: false });
                    }
                }
            });
        });
    } else if (controlParams.firstTabOn === '3') {
        // 通风控制逻辑条件输入：按当前场景全部分组校验
        nextTick(() => {
            const panel = vent_control_panel.value;
            // 无分组数据时不参与校验，避免误置灰确认按钮
            if (!panel?.hasVentGroup) {
                ventErrorData.value = [];
                formValidateResult([], data);
                return;
            }
            panel.validateScene((valid: boolean) => {
                // 按当前场景更新聚合状态，保证确认按钮可用性判断准确
                ventErrorData.value = [{ id: panel.currentScene, errorStatus: !!valid }];
                formValidateResult([valid], data);
            });
        });
    }
};

let isTreeChanged = ref(false);
const isFlag = ref(false);
watch(
    () => [controlParams.allItem, controlParams.defaultItem],
    () => {
        isTreeChanged.value = JSON.stringify(controlParams.allItem) !== JSON.stringify(controlParams.defaultItem);
        if (isTreeChanged.value) {
            formValidate();
            emitter.emit('confirmDisabled', { status: false, isSave: true });
            controlParams.isErrorRandom++;
        } else {
            emitter.emit('confirmDisabled', { status: true, isSave: true });
            formValidate();
        }
    },
    { deep: true }
);

// 监听所有的item，有不是默认值的单独放到一个数组里面
watch(
    () => controlParams.allItem,
    newValue => {
        controlParams.noDefaultData = [];
        newValue.map((group: any) => {
            group.items.map((item: any) => {
                if (item.valueInputLeft !== item.defaultValueLeft) {
                    controlParams.noDefaultData.push(item);
                }
            });
        });
    },
    { deep: true }
);

// 监听需要恢复默认值的数组 为空时不展示批量恢复默认值按钮
watch(
    () => controlParams.noDefaultData,
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
        controlParams.isErrorRandom,
        controlParams.controlAirCoolingErrorData,
        controlParams.controlAirHotErrorData,
        controlParams.controlAirColdHotErrorData,
        controlParams.controlCoolPumpGroupErrorData,
        controlParams.controlChilPumpGroupErrorData,
        controlParams.controlCoolTowerGroupErrorData,
        controlParams.controlCglyPumpGroupErrorData,
        controlParams.controlCoolHsloGroupErrorData,
        controlParams.controlHotPumpGroupErrorData,
        controlParams.controlCoolHotPumpErrorData,
        ventErrorData.value
    ],
    (newVal: any) => {
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
        emitter.emit('confirmDisabled', { status: false, isSave: true });
        if (isTreeChanged.value) {
            emitter.emit('confirmDisabled', { status: false, isSave: true });
        } else {
            emitter.emit('confirmDisabled', { status: true, isSave: true });
            console.log('没发生变化');
        }
    },
    { deep: true }
);

onMounted(() => {
    getShellConfigQuery('control');
});
</script>
<style scoped lang="less">
@import '../styles/xshellConfigRight.less';
</style>
