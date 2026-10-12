<template>
    <div class="acai-supply-container">
        <Timetable
            v-if="isShowTimeTable"
            :system-type="SYSTEM_CLASSCODE"
            :cur-console-type="curConsoleType"
            :current-system="currentSystem"
            :system-instance="systemInstance"
            :enable-console-types="enableConsoleTypes"
            @go-back="isShowTimeTable = false"
        >
        </Timetable>
        <SystemAndControl
            :ref="e => (systemInstance = e)"
            v-model="systemId"
            v-model:view-mode="viewMode"
            v-model:system-class-code="systemClassCode"
            has-indoor-temperature
            has-outdoor-temperature
            use-default-chart
            use-default-space-map
            hide-icon
            has-notify
            :menu-code="MENU_CODE"
            :subscribe-type="SUBSCRIBE_TYPE"
            :running-monitor-type="RUNNING_MONITOR_TYPE"
            :abnormal-event-list="abnormalEventList"
            :chart-props="{
                beforeClickNode,
                canHoverGroupSelect: true,
                needLineFlow: true,
                shouldHadSubGraph,
                lineFlowConfig,
                defaultLegends
            }"
            :space-map-props="{
                sortSpacesByClassCodes,
                findDefaultSpace,
                queryEquipsParams,
                querySpacesByChartObjType: true
            }"
            :control-panel-props="{
                useComponent: USE_COMPONENT_BY_INFOCODE,
                groupKeyMap: GROUP_KEY_MAP,
                openTimeTable: openTimeTable
            }"
            :system-params-set-props="{
                sseConsoleClient: sseSystemDetail,
                maxAndMin: {
                    coolingTowerOutTempSet: { max: 50, min: 0 },
                    coolWaterDetaTempSet: { max: 10, min: 0 },
                    coldSourceReturnTempSet: { max: 40, min: 0 },
                    coolingSourceSideSupplyAndReturnTemperature: { max: 10, min: 0 },
                    distributorCollectorDetaPressSet: { max: 1000, min: 0 },
                    sourceReturnTempSet: { max: 40, min: 0 },
                    sourceSupplyAndReturnTempDiffSet: { max: 10, min: 0 }
                },
                optionsObj: {
                    coolingTowerOutTempSet: OPTIONS_ONE,
                    coolWaterDetaTempSet: OPTIONS_ONE,
                    coldSourceReturnTempSet: OPTIONS_TWO,
                    coolingSourceSideSupplyAndReturnTemperature: OPTIONS_ONE,
                    sourceReturnTempSet: OPTIONS_ONE,
                    sourceSupplyAndReturnTempDiffSet: OPTIONS_ONE
                },
                specialInfoCodes: specialInfoCodes,
                specialInfoCodeKey: specialInfoCodeKey,
                handleSpecialInfoCodesFn: handleSpecialInfoCodesFn,
                handleSpecialSubmitFn: handleSpecialSubmitFn
            }"
            :run-param-key="GROUP_CODE_KEY_MAP.x1stTag3"
            :disability-alarm-reset-key="GROUP_CODE_KEY_MAP.disabilityAlarmReset"
            :system-class-code="SYSTEM_CLASSCODE"
            :console-type-map="CONSOLE_TYPE_MAP"
            :sort-by-info-code="SORT_BY_INFOCODE"
            :custom-control-params="customControlParams"
            :handle-special-info-codes-data-sources-fn="handleSpecialInfoCodesDataSourcesFn"
            @class-code-equip-ids-map="getClassCodeEquipIdsMap"
            @object-id-and-info-codes="getObjectIdAndInfoCodes"
            @system-detail-loaded="getSystemDetail"
            @control-list-loaded="getSystemDeatilAndContrilClassCodesMap"
            @after-chart-equips-loaded="afterChartEquipsLoaded"
        >
            <template #left-content>
                <m-tag v-if="runModeText" size="medium" color="#1B2129" :bg-color="viewMode === ViewModeEnum.MAP_VIEW ? '#F7F9FA' : '#E0E4EB'"> {{ runModeText }} </m-tag>
            </template>
            <template #[COOLINGTOWEROUTTEMPSET]="{ data, getInfoData }">
                <div>
                    <span style="margin-right: 4px" class="value-text">
                        {{ handleCodeValue(data) }}
                    </span>
                    <div v-if="getInfoData(data.relInfoCodeConfigs?.[0] || {})?.dataValue?.manualAutoSet + '' === IS_AUTO" class="auto-box">
                        <div class="auto-box-item fc">
                            {{ i18n.global.t('meos_control_web.cooling_tower_heat_dissipation_temp_diff') }}:
                            {{ getInfoData(data.relInfoCodeConfigs?.[0] || {})?.dataValue?.heatDissipationTemperatureDifference }}{{ data.unit }}
                        </div>
                        <div class="auto-box-item fc">
                            {{ i18n.global.t('meos_control_web.cooling_tower_out_temp_min_value') }}:
                            {{ getInfoData(data.relInfoCodeConfigs?.[0] || {})?.dataValue?.coolWaterReturnTempMinValue }}{{ data.unit }}
                        </div>
                    </div>
                </div>
            </template>
            <template #[`${COOLINGTOWEROUTTEMPSET}Tag`]="{ data, getInfoData }">
                <m-tag v-if="getInfoData(data.relInfoCodeConfigs?.[0] || {})?.dataValue?.manualAutoSet + '' === IS_MANUAL" color="#E68600" bg-color="#FFF0CC" size="small">
                    {{ i18n.global.t('meos_control_web.manual1') }}
                </m-tag>
                <m-tag v-if="getInfoData(data.relInfoCodeConfigs?.[0] || {})?.dataValue?.manualAutoSet + '' === IS_AUTO" color="#683BD6" bg-color="#F1E5FE" size="small">
                    {{ i18n.global.t('meos_control_web.auto') }}
                </m-tag>
            </template>
            <template
                #right-content="{
                    mapSpaceList,
                    currentMapSpaceId,
                    externalDataLoading,
                    isChartBaseSystem,
                    handleEquipInit,
                    handleEquipAllChange,
                    handleEquipSelectChange,
                    handleSpaceSelectChange
                }"
            >
                <template v-if="!externalDataLoading">
                    <HeaderRight
                        v-show="viewMode === ViewModeEnum.MAP_VIEW"
                        :system-id="systemId"
                        :space-id="currentMapSpaceId"
                        :map-space-list="mapSpaceList"
                        :system-equips-ids="systemEquipsIds"
                        :is-chart-base-system="isChartBaseSystem"
                        @equip-init="handleEquipInit"
                        @equip-all-change="handleEquipAllChange"
                        @equip-select-change="handleEquipSelectChange"
                        @space-select-change="handleSpaceSelectChange"
                    ></HeaderRight>
                </template>
            </template>
            <template #abnormal="{ controlTabs }">
                <AbnormalEventList
                    :is-sub-panel="controlTabs?.length > 1"
                    :abnormal-event-list="abnormalEventList"
                    :abnormal-event-list-loaded-time="abnormalEventListLoadedTime"
                    :abnormal-event-list-update-time="abnormalEventListUpdateTime"
                    :abnormal-event-list-loading="abnormalEventListLoading"
                />
            </template>
        </SystemAndControl>
    </div>
</template>

<script setup>
import SystemAndControl from '@/views/Common/SystemsAndControl/index.vue';
import AbnormalEventList from '@/views/Common/SystemsAndControl/AbnormalEventList.vue';
import { useAbnormalEventHook } from '@/views/Common/SystemsAndControl/hooks/useAbnormalEventHook';
import { CompTypeEnum, ConsoleTypesEnum, ViewModeEnum } from '@/views/Common/SystemsAndControl/types';
import {
    RUNNING_MONITOR_TYPE,
    SUBSCRIBE_TYPE,
    MENU_CODE,
    EQUIPS_CLASS_CODE_MAP,
    SYSTEM_CLASSCODE,
    CONSOLE_TYPE_MAP,
    SORT_BY_INFOCODE,
    GROUP_KEY_MAP,
    USE_COMPONENT_BY_INFOCODE,
    MAIN_GRAP_TYPE_CODE,
    OPTIONS_ONE,
    OPTIONS_TWO,
    OPTIONS_THREE
} from './variables';
import { filterEquipsClassCodes } from './utils/index';
import { useRelationChartSSEHook, useSystemDetailSSEHook } from './hooks/useSSEHook';
import { GROUP_CODE_KEY_MAP, INFO_CODE, CLOSE_CONTROL_FORM, IS_AUTO, IS_MANUAL, OTHER_REASON, SUCCESSCODE } from '@/utils/globalVariables';
import HeaderRight from './components/HeaderRight.vue';
import DockSingleton from '@/hooks/responsiveDock';
import { useWatchWithCleanup } from '@/hooks/useWatchEffectWithCleanup';
import { handleRwdObjectDetail } from '@/components/systemInfo/DisabilityAlarmReset/utils';
import { INFO_CODE_CONFIG_EVENT } from '@/utils/SSEEventTypes';
import i18n from '@/localization';
import { openSpaceListKey, codeDefineKey, chillerDataKey } from './injectKeys';
import Timetable from './components/timetable/index.vue';
import { getValueStr } from '@/utils/viewUtils';
import emitter from '@/utils/bus';
import FormItemRadio from '@/components/ObjectInfoComponents/ControlForm/FormItemRadio.vue';
import FormText from '@/components/ObjectInfoComponents/ControlForm/FormText.vue';
import { REASON_SELECT } from '@/components/ObjectInfoComponents/ControlForm/config';
import FormItemInputNumber from '@/components/ObjectInfoComponents/ControlForm/FormItemInputNumber.vue';
import { buildSystemParamsSpecialInfoCodeForm, submitSystemParamsSpecialInfoCode } from '@/views/Common/SystemsAndControl/utils';
import { extendInfoCodeValueConfig } from '@/apis/ACAC';
import { useSuccessMessage } from '@/utils/tools';
import { isNil } from 'lodash';

const COOLINGTOWEROUTTEMPSET = 'coolingTowerOutTempSet';
const ZDY_AIR_CONDITIONING_CAPACITY_SET = 'ZDYairConditioningCapacitySet';
const AIR_CONDITIONING_CAPACITY_SET = 'airConditioningCapacitySet';
const RUN_MODE_SET = 'runModeSet';
const { getIotData, getCustomInfo } = DockSingleton.getInstance();
const specialInfoCodes = [ZDY_AIR_CONDITIONING_CAPACITY_SET, RUN_MODE_SET, COOLINGTOWEROUTTEMPSET];
const specialInfoCodeKey = {
    [ZDY_AIR_CONDITIONING_CAPACITY_SET]: AIR_CONDITIONING_CAPACITY_SET,
    [RUN_MODE_SET]: RUN_MODE_SET,
    [COOLINGTOWEROUTTEMPSET]: COOLINGTOWEROUTTEMPSET
};
const { setRelationChartSSEClientOption } = useRelationChartSSEHook(SUBSCRIBE_TYPE);
const { sseClient: sseSystemDetail, setSystemDetailSSEClientOption } = useSystemDetailSSEHook(SUBSCRIBE_TYPE);

const lineFlowConfig = {
    // 需要识别的相对的管线类型
    lineTypesInPairs: [
        { graphCode: 'ChillWaterLoop' },
        { graphCode: 'CoolingWaterLoop' },
        { graphCode: 'BuriedWaterNetwork' },
        { graphCode: 'MechForArch' },
        { graphCode: 'ModeGlycolLoop' },
        { graphCode: 'GlycolNetwork' }
    ],
    // 分集水器对象相关线上需要识别的线类型编码：采暖水关系 地埋管关系
    // 规则2：仅在A、B设备为分水器【ACGEDB】或集水器【ACGECL】且规则1找不到水泵时使用；如果A与B是采暖水关系，那么找to A或 from B具有采暖水关系的水泵；如果A与B是地埋管关系，那么找to A或 from B具有地埋管关系的水泵
    graphCodeForPumps: ['ChillWaterLoop', 'CoolingWaterLoop', 'BuriedWaterNetwork', 'MechForArch', 'GlycolNetwork', 'ModeGlycolLoop'],
    // 水泵classCode 范围
    pumpClassCodes: ['ACCHCH', 'ACGEFP', 'ACCISP', 'ACCCOP', 'ACCHHP', 'ACCCCP', 'ACCCGP', 'ACCGP', 'ACCPC', 'ACOPC']
};
const viewMode = ref(ViewModeEnum.GRAPH_CODE);
const systemId = ref('');
const systemClassCode = ref('');
const systemInstance = ref(null);

const chartClassCodesData = ref({});
const spaceMapClassCodesData = ref({});
const classCodeEquipIdsMap = ref({});
const objectIdAndInfoCodes = ref({});
const systemDeatilAndContrilClassCodesMap = ref({});
const isShowTimeTable = ref(false);

const { equipmentIds, abnormalEventList, abnormalEventListLoadedTime, abnormalEventListLoading, abnormalEventListUpdateTime } = useAbnormalEventHook(
    {
        subscribeType: SUBSCRIBE_TYPE,
        runningMonitorType: RUNNING_MONITOR_TYPE
    },
    systemId,
    classCodeEquipIdsMap
);

const codeDefine = computed(() => {
    return systemInstance?.value?.codeDefine || {};
});
const chillerData = computed(() => {
    return systemInstance?.value?.chillerData || {};
});
const currentSystem = computed(() => {
    return systemInstance?.value?.currentSystem || {};
});
const curConsoleType = computed(() => {
    return systemInstance?.value?.currentConsoleTypeId || '';
});

const runModeSetInfo = computed(() => {
    return getIotData(systemId.value, INFO_CODE.runModeSet.infoCode) ?? {};
});
const runModeText = computed(() => {
    if (!runModeSetInfo.value?.existsIotRule) {
        return null;
    }
    return getValueStr(runModeSetInfo.value).text;
});

const enableConsoleTypes = computed(() => {
    const arr = [CONSOLE_TYPE_MAP.AIR_TERMINAL_ZONE.id];
    const hasCoolOrHeat = runModeSetInfo.value?.dataValue === INFO_CODE.runModeSet.cooling || runModeSetInfo.value?.dataValue === INFO_CODE.runModeSet.heating;
    if (hasCoolOrHeat) {
        arr.push(CONSOLE_TYPE_MAP.COOL_SUPPLY.id, CONSOLE_TYPE_MAP.HEAT_SUPPLY.id);
    }
    return arr;
});

const customControlParams = consoleTypesData => {
    if (getIotData(systemId.value, INFO_CODE.runModeSet.infoCode).dataValue === INFO_CODE.runModeSet.cooling) {
        CONSOLE_TYPE_MAP[ConsoleTypesEnum.COOL_SUPPLY].show = true;
    }
    if (getIotData(systemId.value, INFO_CODE.runModeSet.infoCode).dataValue === INFO_CODE.runModeSet.heating) {
        CONSOLE_TYPE_MAP[ConsoleTypesEnum.HEAT_SUPPLY].show = true;
    }
    consoleTypesData.value = Object.values(CONSOLE_TYPE_MAP);
    useWatchWithCleanup(
        () => getIotData(systemId.value, INFO_CODE.runModeSet.infoCode).dataValue,
        val => {
            // ○ 根据运行模式设定（runModeSet）来区分显示供冷或者供热控制台。
            // ■ 运行模式设定（runModeSet）=  1 制冷，显示供冷tab。
            // ■ 运行模式设定（runModeSet）=  2 制热，显示供热tab。
            // ■ 其余情况则不显示该tab：例如运行模式设定无实例化规则或者该信息点的的值为空或者该信息点的枚举值不等于1或者2。
            const consoleTypesData = systemInstance.value?.consoleTypesData;
            if (!Array.isArray(consoleTypesData)) {
                return;
            }
            const isCooling = val === INFO_CODE.runModeSet.cooling;
            const isHeating = val === INFO_CODE.runModeSet.heating;

            consoleTypesData.forEach(element => {
                if (element.id === ConsoleTypesEnum.COOL_SUPPLY) {
                    element.show = isCooling;
                }
                if (element.id === ConsoleTypesEnum.HEAT_SUPPLY) {
                    element.show = isHeating;
                }
            });

            // 当前可展示且有控制项的控制台 tab 集合
            const visibleTabs = consoleTypesData.filter(item => item.show && item.controlList?.length);
            const currentConsoleTypeId = systemInstance.value?.currentConsoleTypeId;
            if (typeof currentConsoleTypeId !== 'string') {
                return;
            }

            // 读取当前选中的控制台 id（字符串）
            const currentId = currentConsoleTypeId;
            // 若当前在“空调分区”tab，runModeSet 变化时不自动切换 tab
            if (currentId === ConsoleTypesEnum.AIR_TERMINAL_ZONE) {
                return;
            }
            // 根据运行模式确定“优先应切换到”的控制台
            const preferredId = isCooling ? ConsoleTypesEnum.COOL_SUPPLY : isHeating ? ConsoleTypesEnum.HEAT_SUPPLY : '';

            // 默认保留当前选中项；若当前项不可见则回退到第一个可见项
            let nextId = currentId;
            if (preferredId && visibleTabs.some(item => item.id === preferredId)) {
                nextId = preferredId;
            } else if (!visibleTabs.some(item => item.id === currentId)) {
                nextId = visibleTabs[0]?.id || '';
            }

            // 仅在目标 id 变化时赋值，避免无效更新
            if (nextId !== currentId) {
                systemInstance.value.currentConsoleTypeId = nextId;
            }
        }
    );
};
const getEquipsAndClassCodes = data => {
    if (!Object.keys(data).length) {
        return;
    }
    const arrIds = Object.values(data).flat();

    equipmentIds.value = [...new Set(arrIds)];
    classCodeEquipIdsMap.value = data;
};

const finalClassCodeData = computed(() => {
    if (viewMode.value === ViewModeEnum.GRAPH_CODE) {
        return chartClassCodesData.value;
    } else {
        return spaceMapClassCodesData.value;
    }
});

const openTimeTable = consoleType => {
    // systemInstance.value?.ControlRef?.closeForm?.();
    emitter.emit(CLOSE_CONTROL_FORM, { needClose: true });
    isShowTimeTable.value = true;
};
const handleSpecialInfoCodesFn = (value, list, relateFormList) => {
    const key = specialInfoCodeKey?.[value.infoCode] || '';
    if (key !== COOLINGTOWEROUTTEMPSET) {
        buildSystemParamsSpecialInfoCodeForm({
            value,
            list,
            relateFormList,
            specialInfoCodeKey
        });
    } else {
        const manualFormList = [],
            autoFormList = [];
        const manualAutoConfig = value.relInfoCodeConfigs?.[0] || {};
        const manualAutoConfigDataValue = getCustomInfo(systemId.value, manualAutoConfig.infoCodeType, manualAutoConfig?.infoCode)?.dataValue;
        const manualAutoData = {
            name: value.infoCodeName || value.infoCode,
            required: true,
            defaultValue: isNil(manualAutoConfigDataValue?.manualAutoSet) ? '' : manualAutoConfigDataValue?.manualAutoSet + '',
            componentAttrs: {
                onChange: val => {
                    if (val === IS_AUTO) {
                        relateFormList.value = autoFormList;
                    } else {
                        relateFormList.value = manualFormList;
                    }
                }
            },
            infoCode: INFO_CODE.manualAutoSet.infoCode,
            dataSource: [
                { code: IS_MANUAL, name: i18n.global.t('meos_control_web.manual1') },
                { code: IS_AUTO, name: i18n.global.t('meos_control_web.auto') }
            ],
            component: FormItemRadio
        };
        const inputData = {
            name: '',
            required: true,
            defaultValue: getIotData(systemId.value, value.infoCode)?.dataValue || '',
            componentAttrs: {
                precision: value?.scale || 1
            },
            infoCode: value.infoCode,
            unit: value?.unit || '',
            component: FormItemInputNumber
        };
        list.value.push(manualAutoData);
        manualFormList.push(inputData);
        manualFormList.push(
            REASON_SELECT(null, {
                input: { maxlength: 200 },
                select: { options: OPTIONS_THREE }
            })
        );
        autoFormList.push({
            name: '',
            infoCodeName: value.infoCodeName,
            defaultValue: '',
            isStation: systemInstance.value?.isStation,
            component: FormText
        });
        // 自动模式下配置冷却塔控制参数

        autoFormList.push(
            {
                name: i18n.global.t('meos_control_web.cooling_tower_heat_dissipation_temp_diff'),
                required: true,
                defaultValue: manualAutoConfigDataValue?.heatDissipationTemperatureDifference ?? '',
                componentAttrs: {
                    precision: value?.scale || 1
                },
                infoCode: 'heatDissipationTemperatureDifference',
                unit: value?.unit || '',
                component: FormItemInputNumber
            },
            {
                name: i18n.global.t('meos_control_web.cooling_tower_out_temp_min_value'),
                required: true,
                defaultValue: manualAutoConfigDataValue?.coolWaterReturnTempMinValue ?? '',
                componentAttrs: {
                    precision: value?.scale || 1
                },
                infoCode: 'coolWaterReturnTempMinValue',
                unit: value?.unit || '',
                component: FormItemInputNumber
            }
        );
        autoFormList.push(
            REASON_SELECT(null, {
                input: { maxlength: 200 },
                select: { options: OPTIONS_THREE }
            })
        );
        if (manualAutoConfigDataValue?.manualAutoSet + '' === IS_AUTO) {
            relateFormList.value = autoFormList;
        } else {
            relateFormList.value = manualFormList;
        }
    }
};
const handleSpecialSubmitFn = (data, currentData, cb, refreshTemplateInfoCodes) => {
    console.log(data, currentData.infoCode);

    if (currentData.infoCode === COOLINGTOWEROUTTEMPSET) {
        const params = {
            classCode: currentSystem.value.classCode,
            systemId: currentSystem.value.systemId,
            infoCode: currentData.infoCode,
            infoValue: data[currentData.infoCode], //信息点设定值 自动下不填写
            beforeValue: getIotData(currentSystem.value.systemId, currentData.infoCode)?.dataValue ?? '', //修改前的设定值 冷却塔出水温度设定值
            content: data.operateReason || (data.operateType === OTHER_REASON ? '' : data.operateType), //原因
            extendSetting: {
                coolWaterReturnTempMinValue: data.coolWaterReturnTempMinValue, //冷却塔出水温度最小值
                manualAutoSet: data[INFO_CODE.manualAutoSet.infoCode], //手自动状态 0-人工 1-自动
                heatDissipationTemperatureDifference: data.heatDissipationTemperatureDifference //冷却塔散热趋近温差ΔT
            }
        };
        extendInfoCodeValueConfig(params)
            .then(res => {
                if (res.code === SUCCESSCODE) {
                    useSuccessMessage();
                    refreshTemplateInfoCodes();
                }
            })
            .finally(() => {
                cb();
            });
    } else {
        submitSystemParamsSpecialInfoCode({
            data,
            currentData,
            systemId: systemId.value,
            systemClassCode: systemClassCode.value,
            specialInfoCodeKey,
            getCustomInfo,
            onSuccess: refreshTemplateInfoCodes,
            onFinally: cb
        });
    }
};
const handleCodeValue = data => {
    const obj = getIotData(systemId.value, data.infoCode);
    return getValueStr(obj).text;
};
watch(
    () => finalClassCodeData.value,
    cur => {
        getEquipsAndClassCodes(cur);
    }
);

const getClassCodeEquipIdsMap = (data, type) => {
    if (Object.keys(data).length === 0) {
        return;
    }

    const cloneData = structuredClone(data);
    //  关系图视角：获取系统实例+系统图中包括的设备的异常事件
    //  模型视角：根据左侧选择的设备范围，获取设备的异常事件；系统实例的异常事件
    if (systemClassCode.value && systemId.value && !cloneData[systemClassCode.value]) {
        cloneData[systemClassCode.value] = [systemId.value];
    }
    if (type === ViewModeEnum.MAP_VIEW) {
        spaceMapClassCodesData.value = cloneData;
    } else {
        chartClassCodesData.value = cloneData;
    }
};
const getObjectIdAndInfoCodes = data => {
    const cloneData = structuredClone(data || {});
    for (const key in cloneData) {
        if (!Object.hasOwn(cloneData, key) || cloneData[key].includes('rcRunStatus')) continue;
        cloneData[key].push('rcRunStatus');
    }
    objectIdAndInfoCodes.value = { ...cloneData, ...objectIdAndInfoCodes.value };
};

const getSystemDetail = data => {
    if (data && data.id) {
        systemDeatilAndContrilClassCodesMap.value[data.classCode] = [data.id];
    } else {
        systemDeatilAndContrilClassCodesMap.value[SYSTEM_CLASSCODE] = [systemId.value];
    }
};
const getSystemDeatilAndContrilClassCodesMap = data => {
    systemDeatilAndContrilClassCodesMap.value = {
        ...systemDeatilAndContrilClassCodesMap.value,
        ...data
    };
};
/**
 * 判断是否启用选择功能
 * 根据模态框数据的组件类型来决定是否允许选择
 * @param {Object} modalData - 模态框数据对象
 * @param {string} modalData.compType - 组件类型
 * @returns {boolean} 返回是否启用选择功能，如果是包节点类型则返回false，否则返回true
 */
const enableSelect = modalData => {
    if (modalData.compType === CompTypeEnum.PACK_NODE) {
        return false;
    }
    return true;
};

const isRelationChartBaseSystem = curSystem => {
    const { objType, systemId: curSystemId } = curSystem || {};
    const isSystem = objType ? objType?.toUpperCase() === 'SYSTEM' : undefined;
    const isStartsWithSY = curSystemId?.toUpperCase()?.startsWith('SY');
    return isSystem ?? isStartsWithSY;
};

const afterChartEquipsLoaded = async data => {
    const { systemInfo, equipsClassCodes } = data || {};
    const { systemId: curSystemId } = systemInfo || {};
    if (!isRelationChartBaseSystem(systemInfo)) {
        // 关系图基准对象是设备，则首先获取关系图中的设备，再根据classCode请求模型图空间数据
        const finalClassCodes = filterEquipsClassCodes(equipsClassCodes);
        await systemInstance?.value?.querySpaceList?.(curSystemId, systemInfo, finalClassCodes);
    }
};
const queryEquipsParams = (curSystem, equipsClassCodes) => {
    const { classCode, systemId: curSystemId } = curSystem || {};

    const fromSystemData = EQUIPS_CLASS_CODE_MAP;
    console.log('classCode: ', classCode, EQUIPS_CLASS_CODE_MAP);
    const classCodes = fromSystemData.map(v => v.classCode);
    const queryParam = {
        withColumns: ['id', 'localName', 'classCode', 'floorId']
    };
    // 关系图基准对象是系统，则根据系统实例查询系统下的设备,再找到系统的空间
    queryParam.classCode = classCodes;
    queryParam.relationTo = {
        graphCode: 'MechSubset',
        relCode: 'Sy2Eq',
        objFrom: [curSystemId]
    };

    const takeValueLogic = {
        queryInSpaces: true,
        queryParam: queryParam,
        queryInSpaceAdditionalWithColumns: ['outline', 'floorId']
    };
    const params = {
        runningMonitorType: RUNNING_MONITOR_TYPE,
        takeValueLogic
    };
    return params;
};
const sortSpacesByClassCodes = ({ spaces, spaceIdMapClassCodes }) => {
    const collator = new Intl.Collator('zh-CN', { sensitivity: 'case', numeric: true });

    const result = spaces.toSorted((a, b) => {
        // 当同一类优先级有多个空间时，按空间名称升序排列
        if (a.spaceOrder === b.spaceOrder) {
            const aName = a.localName || '';
            const bName = b.localName || '';
            return collator.compare(aName, bName);
        }
        return a.spaceOrder - b.spaceOrder;
    });
    // const result = sortBy(newSpaces, ['spaceOrder', 'localName']);
    return result;
};
// 默认选中冷热水循环水泵（ACCHCH）所在的空间，如果冷热水循环水泵（ACCHCH）所在的空间有多个，取返回的第一个。如果没有冷热水循环水泵，则选中第一个空间
const findDefaultSpace = (spaces, spaceIdMapClassCodes) => {
    if (!Array.isArray(spaces) || spaces.length === 0) return null;
    const match = spaces.find(space => {
        const spaceId = space?.id;
        if (!spaceId) return false;
        let classCodes = spaceIdMapClassCodes?.[spaceId] || [];
        classCodes = [...classCodes];
        return classCodes.includes('ACCHCH');
    });
    return match || spaces[0];
};
const defaultLegends = [
    { id: 'abnormal_event', name: i18n.global.t('meos_control_web.abnormal_event'), color: '#F55047', bgColor: '#FFFFFF' },
    { id: 'power_outage', name: i18n.global.t('meos_control_web.power_off'), bgColor: '#ffffff', color: '#B5A777' }
];
const shouldHadSubGraph = (obj, curSystemInfo) => {
    console.log('obj, curSystemInfo: ', obj, curSystemInfo);
    // 主图上，空调控制分区的打包节点应该有分视图
    if (curSystemInfo?.graphTypeCode === MAIN_GRAP_TYPE_CODE && obj.items?.some(item => item.classCode === 'ACZone')) {
        return true;
    }
    return false;
};

const handleSpecialInfoCodesDataSourcesFn = infoCode => {
    const obj = getIotData(systemId.value, infoCode);
    if (obj.dataSource) {
        return obj.dataSource.filter(item => item.code === INFO_CODE.runModeSet.cooling || item.code === INFO_CODE.runModeSet.heating);
    }
    return null;
};
// 监听 chartClassCodesData 和 objectIdAndInfoCodes 的变化，更新 SSE 客户端选项
useWatchWithCleanup(
    () => [chartClassCodesData.value, objectIdAndInfoCodes.value],
    () => {
        setRelationChartSSEClientOption(chartClassCodesData.value, objectIdAndInfoCodes.value);
    }
);
useWatchWithCleanup(
    () => systemDeatilAndContrilClassCodesMap.value,
    () => {
        setSystemDetailSSEClientOption(systemDeatilAndContrilClassCodesMap.value);
    },
    {
        deep: true
    }
);

provide(codeDefineKey, codeDefine);
provide(chillerDataKey, chillerData);
provide(openSpaceListKey, data => {
    if (systemInstance.value?.openSpaceList) {
        systemInstance.value.openSpaceList({ airTerminalZoneId: data.objectId, airTerminalZoneName: data.localName });
    }
});
onMounted(() => {
    sseSystemDetail?.addEventListener(INFO_CODE_CONFIG_EVENT, handleRwdObjectDetail);
});
onUnmounted(() => {
    sseSystemDetail?.removeEventListener(INFO_CODE_CONFIG_EVENT, handleRwdObjectDetail);
});
</script>
<style lang="less" scoped>
.acai-supply-container {
    width: 100%;
    height: 100%;
    background: #f1f4f6;
    transition: transform 0.3s ease;

    :deep(.relation-chart-com) {
        .tools-container {
            z-index: 52;
        }
    }
}
</style>
<style lang="less">
.system-ACAI {
    .info-code-item.coolingTowerOutTempSet:has(.auto-box) {
        height: 150px;
    }
    .info-code-item.coolingTowerOutTempSet {
        grid-column: 1 / -1;
        position: relative;

        .auto-box {
            width: calc(100% - 16px);
            position: absolute;
            border-radius: 4px;
            height: 56px;
            padding: 4px 8px;
            background: var(--gray-100);
            margin-top: 8px;
            &-item {
                height: 50%;
                color: var(--gray-600);
            }
        }
    }
}
</style>
