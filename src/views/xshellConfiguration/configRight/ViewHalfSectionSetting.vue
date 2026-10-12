<template>
    <div class="container-box">
        <!-- 末端监测空间范围 -->
        <AirTerminalSpaceScopeSub
            v-show="isSpaceScopeSubPage"
            v-model:show="isSpaceScopeSubPage"
            v-model:scope-mode="scopeMode"
            v-model:last-saved-whitelist-config="lastSavedWhitelistConfig"
            v-model:loading="isSpaceScopeLoading"
            @back="handleCloseSpaceScopeSub"
            @update="getSpaceScopeWhitelist"
        ></AirTerminalSpaceScopeSub>
        <div v-show="!isSpaceScopeSubPage">
            <title-type
                class="terminal-scope-title"
                :title="i18n.global.t('meos_control_web.terminal_monitoring_space_scope')"
                :sub-title="i18n.global.t('meos_control_web.terminal_monitoring_space_scope_tips')"
            />
            <div class="space-scope-header">
                <div class="space-scope-title">{{ i18n.global.t('meos_control_web.space_range_config') }}</div>
                <div v-if="isSpaceScopeLoading" class="loading-txt">{{ i18n.global.t('meos_control_web.data_loading_dots') }}</div>
                <div v-else-if="scopeMode !== 'CUSTOM'" class="space-scope-summary">
                    {{ i18n.global.t('meos_control_web.reference_all_manageable_space_prefix') }}
                    <m-tips :disabled="!isCalcLoading" theme="darkTransparent" :content="i18n.global.t('meos_control_web.please_wait_until_calculation_completed')" placement="top">
                        <span
                            :class="{
                                'space-scope-count': true,
                                disabled: isCalcLoading
                            }"
                            @click="handleOpenSpaceScopeSub"
                            >{{ manageableSpaceCount }}</span
                        >
                    </m-tips>

                    {{ i18n.global.t('meos_control_web.reference_all_manageable_space_suffix') }}
                </div>
                <div v-else class="space-scope-summary">
                    {{ i18n.global.t('meos_control_web.air_terminal_scope_mode_whitelist_prefix') }}
                    <m-tips :disabled="!isCalcLoading" theme="darkTransparent" :content="i18n.global.t('meos_control_web.please_wait_until_calculation_completed')" placement="top">
                        <span
                            :class="{
                                'space-scope-count': true,
                                disabled: isCalcLoading
                            }"
                            @click="handleOpenSpaceScopeSub"
                            >{{ manageableSpaceCount }}</span
                        >
                    </m-tips>
                    {{ i18n.global.t('meos_control_web.reference_all_manageable_space_suffix') }}
                </div>
                <m-tips :disabled="!isCalcLoading" theme="darkTransparent" :content="i18n.global.t('meos_control_web.please_wait_until_calculation_completed')" placement="top">
                    <m-button :disabled="isCalcLoading" type="link" size="medium" class="space-scope-edit" @click="handleOpenSpaceScopeSub">{{
                        i18n.global.t('meos_control_web.edit_config')
                    }}</m-button>
                </m-tips>
            </div>
            <!-- 末端管理范围计算 -->
            <CalcUpdateView
                v-model:loading="isCalcLoading"
                :title="i18n.global.t('meos_control_web.terminal_manage_scope_calc')"
                :loop-interval="5000"
                :running-monitor-type="AIR_TERMINAL"
            />
            <!-- 环境参数指标配置 -->
            <div class="no-margin-container">
                <xshellFormList
                    v-if="params.environmentData.length"
                    ref="environmentFormRef"
                    :label-width="'345px'"
                    :title="i18n.global.t('meos_control_web.environment_parameter_index_config')"
                    :xshell-params="params"
                    :data-list="params.environmentData"
                >
                </xshellFormList>
            </div>
            <!-- 半剖图显隐配置 -->
            <div class="visibility-form-list">
                <xshellFormList
                    ref="visibilityFormRef"
                    :label-width="'345px'"
                    :title="i18n.global.t('meos_control_web.half_section_visibility_config')"
                    :xshell-params="params"
                    :data-list="params.visibilityData"
                >
                </xshellFormList>
            </div>
            <div class="no-margin-container">
                <!-- 半剖图展示配置 -->
                <xshellFormList
                    ref="displayFormRef"
                    :label-width="'345px'"
                    :title="i18n.global.t('meos_control_web.half_section_display_config')"
                    :xshell-params="params"
                    :data-list="params.displayData"
                    :is-ellipsis="true"
                >
                </xshellFormList>
                <!-- 空间与设备关系展示配置 -->
                <xshellFormList
                    v-if="params.spaceEquipmentDisplayData.length"
                    ref="spaceEquipmentDisplayFormRef"
                    :label-width="'345px'"
                    :title="i18n.global.t('meos_control_web.space_equipment_relation_display_config')"
                    :xshell-params="params"
                    :data-list="params.spaceEquipmentDisplayData"
                    :is-ellipsis="true"
                >
                </xshellFormList>
            </div>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { shellConfigQuery, shellConfigSave, queryWhitelist, getDynamicIotRulesList } from '@/apis/xshellConfiguration';
import { formatterValue, parseValue, validate } from '../utils/tools';
import CalcUpdateView from './common/CalcUpdateView.vue';
import xshellFormList from './common/xshellFormList.vue';
import titleType from './common/titleType.vue';
import AirTerminalSpaceScopeSub from './AirTerminalSpaceScopeSub.vue';
import emitter from '@/utils/bus';
import { $Message, MLoading, MButton } from 'meri-plus';
import { fetchAbortControllerInjectKey, loadingInstanceInjectKey, goBackKey } from '../hooks/useGlobalData';
import { AIR_TERMINAL, GeneralZone, GRID, IOT_RUNNING, SUCCESSCODE, OBJ_TYPE } from '@/utils/globalVariables';
import { HALF_SECTION_VISIBILITY_ENUM } from '../constants/constant';
import useBuildingInstanceTree from '../hooks/useBuildingInstanceTree';
import { HALF_SECTION_QUERY_SCENE_NAME } from '../constants/constant';
import { ACTIVE_MENUS_ID_ENUM } from '../constants/enums';

// 不展示批量恢复默认值按钮，移除 emit
const fetchAbortController = inject(fetchAbortControllerInjectKey);
const iotRulesAbortController = ref();
const whitelistAbortController = ref();
const LEFT_ACTIVE_MENU_ID = ACTIVE_MENUS_ID_ENUM.VIEW_HALF_SECTION_SETTING;

const visibilityFormRef = ref(null);
const displayFormRef = ref(null);

const environmentFormRef = ref(null);
const spaceEquipmentDisplayFormRef = ref(null);

const isSpaceScopeSubPage = ref(false);
const goBack = inject(goBackKey);
const isCalcLoading = ref(false);

const manageableSpaceCount = ref(0);
const params = reactive({
    allItem: [], // 全部的item,不包含groups
    defaultItem: [], // 默认不变的item

    visibilityData: [],
    displayData: [],
    spaceEquipmentDisplayData: [],
    environmentData: []
});

const iotConditionOptions = ref([]);

const { initBuildingInstanceTree, ACATAHInstanceTree, ACATFUInstanceTree, ACAHGInstanceTree, ACATAHInstanceTreeMap, ACATFUInstanceTreeMap } = useBuildingInstanceTree();

provide('ACATAHInstanceTree', ACATAHInstanceTree);
provide('ACATFUInstanceTree', ACATFUInstanceTree);
provide('ACAHGInstanceTree', ACAHGInstanceTree);
provide('ACATAHInstanceTreeMap', ACATAHInstanceTreeMap);
provide('ACATFUInstanceTreeMap', ACATFUInstanceTreeMap);

const loadingInstance = inject(loadingInstanceInjectKey);
const setLoading = () => {
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
};

const getIotConditionOptions = arr => {
    return arr
        .map(v => {
            const configs = v?.groupChildren?.[0]?.relInfoCodeConfigs || [];
            const groupName = v?.groupName;
            const infoName = configs?.[0]?.aliasName ?? configs?.[0]?.infoCodeName;
            const finalOptions =
                configs
                    ?.filter(config => {
                        const hasLabel = config?.infoCode && (config?.aliasName || config?.infoCodeName);
                        const showStyle = parseValue(config?.showStyle);
                        const canShellConfigured = showStyle?.canShellConfigured;
                        return hasLabel && canShellConfigured;
                    })
                    ?.map(config => ({
                        id: config.infoCode,
                        name: config.aliasName ?? config?.infoCodeName
                    })) || [];
            return {
                code: v?.groupCode,
                name: groupName || infoName,
                options: finalOptions
            };
        })
        .filter(v => !!v?.code && !!v?.name && Array.isArray(v?.options) && v.options.length);
};

const getIOTRuleOptions = async () => {
    iotRulesAbortController.value?.abort?.();
    iotRulesAbortController.value = new AbortController();
    const res = await getDynamicIotRulesList(
        {
            runningMonitorType: AIR_TERMINAL,
            templateTypes: [GRID],
            classCodes: [GeneralZone],
            infoCodeTypes: [IOT_RUNNING, 'DEMAND_TARGET_TYPE']
        },
        { signal: iotRulesAbortController.value.signal }
    );
    if (res?.code === SUCCESSCODE) {
        const arr = res?.data?.[0]?.relInfoCodeGroupConfigs || [];
        const options = getIotConditionOptions(arr);
        iotConditionOptions.value = Array.isArray(options) ? options : [];
    }
    return res;
};

const getShellConfigQuery = async (isQueryIotRule = true) => {
    setLoading();

    if (isQueryIotRule) {
        await getIOTRuleOptions();
    }

    params.allItem = [];
    params.defaultItem = [];
    params.visibilityData = [];
    params.displayData = [];
    params.spaceEquipmentDisplayData = [];
    params.environmentData = [];

    fetchAbortController.value?.abort?.();
    fetchAbortController.value = new AbortController();

    const res = await shellConfigQuery({ scene: HALF_SECTION_QUERY_SCENE_NAME }, fetchAbortController.value.signal).finally(() => {});
    if (res.code === SUCCESSCODE && Array.isArray(res.data)) {
        const tempArr = handleFormatterGroups(res.data);
        params.allItem = tempArr;
        params.defaultItem = structuredClone(tempArr);
    }

    loadingInstance.value?.destroy?.();
};

const groupTypes = {
    visibility: 'group_hsec_show',
    display: 'group_hsec_display',

    spaceEquipmentDisplay: 'group_space_device_display',
    environment: 'group_hsec_env_indicator'
};
const envCodes = ['hsec_env_indicator'];

// 环境参数壳配置历史值只接受数组结构，异常数据统一回退为空数组。
const getParsedEnvironmentConfig = value => {
    const parsedValue = parseValue(value);
    return Array.isArray(parsedValue) ? parsedValue : [];
};

// 只保留当前动态规则中仍存在的信息点；
// 没有该环境项时默认全选；只要存在该环境项，就尊重已保存结果，包括空数组
const getEnvironmentSelectedIds = (savedItem, optionIds) => {
    if (!savedItem) {
        return optionIds;
    }

    const savedIds = getParsedEnvironmentConfig(savedItem.value).filter(id => optionIds.includes(id));
    return savedIds;
};

const handleFormatterGroups = groupList => {
    let tempArr = [];
    groupList.forEach(group => {
        if (Array.isArray(group?.groups)) {
            group.groups.forEach(itemObj => {
                if (itemObj.group === groupTypes.visibility) {
                    params.visibilityData = handleFormatterVisibilityData(itemObj.items);
                } else if (itemObj.group === groupTypes.display) {
                    params.displayData = formatterValue(itemObj.items);
                } else if (itemObj.group === groupTypes.spaceEquipmentDisplay) {
                    params.spaceEquipmentDisplayData = formatterValue(itemObj.items);
                } else if (itemObj.group === groupTypes.environment) {
                    const parsedEnvData = getParsedEnvironmentConfig(itemObj.items?.[0]?.value);
                    // 环境参数全部选项来自动态规则；历史值只回显仍有效的信息点，整组失效时回退为当前全选。
                    const finalOptions = iotConditionOptions.value?.length ? iotConditionOptions.value : [];

                    params.environmentData = finalOptions.map(v => {
                        const defaultIds = v.options.map(option => option.id);
                        const lastSavedData = parsedEnvData.find(env => env?.code === v.code);
                        return {
                            ...v,
                            group: groupTypes.environment,
                            mulInstanceList: v.options,
                            valueType: 'MULTIPLE_CHECKBOX',
                            defaultValueLeft: defaultIds,
                            valueInputLeft: getEnvironmentSelectedIds(lastSavedData, defaultIds)
                        };
                    });
                }
            });
            tempArr = [...params.visibilityData, ...params.displayData, ...params.spaceEquipmentDisplayData, ...params.environmentData];
        }
    });
    return tempArr;
};

const handleFormatterVisibilityData = itemList => {
    const cloneList = structuredClone(itemList);
    const newList = formatterValue(cloneList);
    const visibilityData = newList.reduce((acc, itemObj) => {
        acc[itemObj.code] = itemObj;
        return acc;
    }, {});

    const filterData = Object.keys(HALF_SECTION_VISIBILITY_ENUM).reduce((acc, key) => {
        const { id, relationCode, classCode } = HALF_SECTION_VISIBILITY_ENUM[key];
        const item = visibilityData[id];
        if (item) {
            if (classCode) {
                item.classCode = classCode;
            }
            // 聚合关联数据到空调机组
            if (relationCode) {
                item.relationCode = relationCode;
                let relationData = [];
                try {
                    relationData = JSON.parse(visibilityData[relationCode]?.value);
                } catch (error) {
                    relationData = [];
                }

                item.relationData = relationData;
            }
            if (HALF_SECTION_VISIBILITY_ENUM[key]?.options) {
                item.options = HALF_SECTION_VISIBILITY_ENUM[key].options;
            }

            acc.push(item);
        }
        return acc;
    }, []);

    return filterData;
};

// 白名单配置模式，默认全量引用
const scopeMode = ref('FULL');
// 上次保存的白名单配置
const lastSavedWhitelistConfig = ref({});
// 是否在加载空间范围配置
const isSpaceScopeLoading = ref(false);
const getSpaceScopeWhitelist = async () => {
    isSpaceScopeLoading.value = true;
    whitelistAbortController.value?.abort?.();
    whitelistAbortController.value = new AbortController();
    const res = await queryWhitelist(
        {
            runningMonitorType: AIR_TERMINAL,
            objType: OBJ_TYPE.SPACE
        },
        { signal: whitelistAbortController.value.signal }
    ).finally(() => {
        isSpaceScopeLoading.value = false;
    });

    if (res?.code === SUCCESSCODE) {
        const resData = res.data;

        scopeMode.value = resData?.whitelistType || 'FULL';
        manageableSpaceCount.value = resData?.objects?.length || 0;
        lastSavedWhitelistConfig.value = resData;

        return;
    } else {
        manageableSpaceCount.value = 0;
    }
};

const coverSubmitData = () => {
    const allItem = coverData(params.allItem);

    // 按照 group 分组
    const groupMap = new Map();
    const envItemsMap = new Map();

    allItem.forEach(item => {
        const group = item.group || 'default';

        if (group === groupTypes.environment) {
            envItemsMap.set(item.code, item);
        } else {
            if (!groupMap.has(group)) {
                groupMap.set(group, []);
            }

            // 转换 value：处理数组、对象等特殊情况
            let value = item.valueInputLeft;

            // 如果是数组（如设备列表），转换为 JSON 字符串
            if (Array.isArray(value)) {
                value = JSON.stringify(value);
            }

            groupMap.get(group).push({
                code: item.code,
                value: value
            });
        }
    });
    if (envItemsMap.size) {
        const finalVal = Array.from(envItemsMap.values()).map(v => ({
            code: v.code,
            value: v.valueInputLeft
        }));
        groupMap.set(groupTypes.environment, [{ code: envCodes[0], value: JSON.stringify(finalVal) }]);
    }

    // 转换为目标格式
    const result = Array.from(groupMap.entries()).map(([group, items]) => ({
        group: group,
        items: items
    }));

    return {
        scene: HALF_SECTION_QUERY_SCENE_NAME,
        groups: result
    };
};

const resetData = () => {
    params.allItem.map((item, index) => {
        const { relationCode } = item;
        const defaultItem = params.defaultItem[index];
        // 聚合关联数据到空调机组
        if (relationCode) {
            item.relationData = [...defaultItem.relationData];
        }
        item.valueInputLeft = structuredClone(defaultItem.valueInputLeft ?? defaultItem.valueLeft);
    });
};
// 更新配置
const updateshellConfig = () => {
    const submitData = coverSubmitData(params.allItem);
    shellConfigSave(submitData).then(res => {
        if (res.code === '00000') {
            $Message.success({ title: i18n.global.t('meos_control_web.configuration_success') });
            emitter.emit('confirmDisabled', { status: true, isSave: true });
            getShellConfigQuery(false);
        }
    });
};

const handleInputEmitter = data => {
    if (data.menu === LEFT_ACTIVE_MENU_ID && !isSpaceScopeSubPage.value) {
        if (data.type === 'confirm') {
            formValidate(data.menu);
        } else if (data.type === 'cancel') {
            resetData();
            emitter.emit('confirmDisabled', { status: true, isSave: true });
        }
    }
};

emitter.on('InputEmitter', handleInputEmitter);

// 验证
const formValidate = data => {
    nextTick(() => {
        const validateTasks = [validate(visibilityFormRef), validate(displayFormRef)];
        if (params.spaceEquipmentDisplayData.length) {
            validateTasks.push(validate(spaceEquipmentDisplayFormRef));
        }
        if (params.environmentData.length) {
            validateTasks.push(validate(environmentFormRef));
        }

        Promise.all(validateTasks).then(function (results) {
            if (results.includes(undefined)) {
                if (data === LEFT_ACTIVE_MENU_ID) {
                    $Message.error({ title: i18n.global.t('meos_control_web.error_items_exist_please_check') });
                }
                return;
            }
            if (data === LEFT_ACTIVE_MENU_ID) {
                // 更新配置
                updateshellConfig();
            }
        });
    });
};

const isTreeChanged = ref(false);
const coverData = list => {
    const newList = list.reduce((arr, cur) => {
        const { code, valueInputLeft, shellConfigValue, relationCode, relationData } = cur;
        arr.push({
            code,
            valueInputLeft,
            shellConfigValue,
            group: cur.group
        });
        if (relationCode) {
            arr.push({
                code: relationCode,
                valueInputLeft: relationData || [],
                shellConfigValue: relationData || [],
                group: cur.group
            });
        }
        return arr;
    }, []);
    return newList;
};
watch(
    () => [params.allItem, params.defaultItem],
    () => {
        const curItems = coverData(params.allItem);
        const defaultItems = coverData(params.defaultItem);

        isTreeChanged.value = JSON.stringify(curItems) !== JSON.stringify(defaultItems);
        if (isTreeChanged.value) {
            formValidate();
            emitter.emit('confirmDisabled', { status: false, isSave: true });
        } else {
            formValidate();
            emitter.emit('confirmDisabled', { status: true, isSave: true });
        }
    },
    { deep: true }
);
const init = async () => {
    getShellConfigQuery();
    initBuildingInstanceTree();
    await getSpaceScopeWhitelist();
};

const handleOpenSpaceScopeSub = () => {
    if (isCalcLoading.value) {
        return;
    }
    if (goBack) {
        goBack.from = ACTIVE_MENUS_ID_ENUM.VIEW_HALF_SECTION_SETTING;
        goBack.subTitle = i18n.global.t('meos_control_web.terminal_monitoring_space_scope_config');
        goBack.callback = () => {
            isSpaceScopeSubPage.value = false;
            goBack.subTitle = '';
            emitter.emit('confirmDisabled', { status: !isTreeChanged.value, isSave: true });
        };
    }
    nextTick(() => {
        isSpaceScopeSubPage.value = true;
    });
};

const handleCloseSpaceScopeSub = () => {
    isSpaceScopeSubPage.value = false;
};

onMounted(() => {
    init();
});
onUnmounted(() => {
    iotRulesAbortController.value?.abort?.();
    whitelistAbortController.value?.abort?.();
    emitter.off('InputEmitter', handleInputEmitter);
    goBack.subTitle = '';
    goBack.callback = null;
});
</script>

<style scoped lang="less">
@import '../styles/xshellConfigRight.less';

.terminal-scope-title {
    margin-bottom: 12px;
}

.space-scope-header {
    height: 32px;
    padding: 0 0 0 30px;
    margin-bottom: 12px;
    color: #1b2129;
    font-size: 14px;
    line-height: 22px;
    display: flex;
    align-items: center;
}

.space-scope-title {
    flex: 0 0 auto;
    min-width: 345px;
    font-weight: 400;
    white-space: nowrap;
    margin-right: 12px;
}

.space-scope-summary {
    font-weight: 400;
    text-align: center;
    white-space: nowrap;
}

.space-scope-count {
    color: #246ee5;
    font-weight: 700;
    cursor: pointer;
}
.space-scope-count.disabled {
    color: #c4c9cf;
    cursor: not-allowed;
}

.space-scope-edit {
    flex: 0 0 auto;
    padding: 0;
    min-width: auto;
}

.visibility-form-list {
    :deep(.form-box) {
        padding-top: 12px;
        margin-bottom: 0px;
    }
    :deep(.form-box-data) {
        margin-top: 0px;
        overflow: hidden;
    }
    :deep(.flex-column-layout) {
        width: 100%;
    }
}
.loading-txt {
    color: @grey-600;
}
.no-margin-container {
    :deep(.form-box) {
        margin-bottom: 11px;
    }
    :deep(.form-box-data) {
        & + .form-box-data {
            margin-top: 0px;
        }
    }
}
</style>
