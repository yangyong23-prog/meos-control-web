<template>
    <div ref="headerWarpRef" class="header-warp" :style="{ background: headerBg }">
        <span v-if="!floorView || headerModelView === 'list'" class="header-name m-ellipsis">{{ i18n.global.t('meos_control_web.header_terminal_env') }}</span>
        <div v-else class="go-back-wrap">
            <span class="go-back" @click="goBack"><IconMeriComponentChevronLeft :size="18" :color="'#424C59'" /></span>
            <span class="name">
                <template v-if="currentBuidingNum > 1 && buildingLocalName">
                    <span v-ellipsis class="building-name m-ellipsis">{{ buildingLocalName }}</span
                    >/
                </template>
                <span v-ellipsis class="m-ellipsis">{{ curFloorName }}</span>
            </span>
        </div>
        <div class="header-right">
            <template v-if="headerModelView === 'model'">
                <div class="header-box-tab">
                    <m-tabs v-if="!floorView" v-model="currentTab" :data="tabsOptions" type="segment" style="width: auto" size="small"> </m-tabs>
                    <m-tabs v-if="floorView" v-model="currentTabFloor" :data="tabsOptionsFloor" type="segment" style="width: auto" size="small"> </m-tabs>
                </div>
                <!-- 搜索组建 -->
                <MapSearch
                    :spaces="allSpaces"
                    :equips="allEquips"
                    :space-filter-fn="spaceFilterFn"
                    :equip-filter-fn="equipFilterFn"
                    :current-floor-id="currentFloorObj?.id"
                    :loading="spacesAndEquipsLoading"
                    :only-type="mapSearchOnlyType"
                    @choose="chooseObj"
                ></MapSearch>
                <div v-if="currentTabWithView === CONTROL_BAR_TAB_KEYS.QUALITY || currentTabWithView !== CONTROL_BAR_TAB_KEYS.ABNORMAL" class="header-box-select">
                    <template v-if="currentTabWithView === CONTROL_BAR_TAB_KEYS.QUALITY">
                        <m-checkbox v-model="curOnlyIotSpaceCheck">{{ i18n.global.t('meos_control_web.show_iot_spaces_only') }}</m-checkbox>
                        <span class="box-split ml12"></span>
                    </template>
                    <m-select
                        v-if="currentTabWithView !== CONTROL_BAR_TAB_KEYS.ABNORMAL && floorView"
                        v-model="currentEnvAttrFloor"
                        :max-scroll-height="362"
                        :size="160"
                        :placeholder="i18n.global.t('common.placeholder_input')"
                        :prefix="i18n.global.t('meos_control_web.env_param_colon')"
                        noborder
                        :options="envAttrTabsOptions"
                    >
                        <m-option v-for="item in envAttrTabsOptions" :key="item.id" :value="item.id" :label="item.name"> </m-option>
                    </m-select>
                    <m-select
                        v-else-if="currentTabWithView !== CONTROL_BAR_TAB_KEYS.ABNORMAL"
                        v-model="currentEnvAttr"
                        :max-scroll-height="362"
                        :size="160"
                        :placeholder="i18n.global.t('common.placeholder_input')"
                        :prefix="i18n.global.t('meos_control_web.env_param_colon')"
                        noborder
                        :options="envAttrTabsOptions"
                    >
                        <m-option v-for="item in envAttrTabsOptions" :key="item.id" :value="item.id" :label="item.name"> </m-option>
                    </m-select>
                </div>
                <!-- checkbox 宽屏直接展示 -->
                <div v-if="isWideScreen && showEquipmentFilter" class="header-box-select">
                    <m-checkbox :model-value="onlyShowControlledEquipmentRef" @change="onlyShowControlledEquipmentChange">
                        {{ i18n.global.t('meos_control_web.only_controllable_equipment') }}
                    </m-checkbox>
                    <span class="box-split ml12"></span>
                    <!-- 设备类 -->
                    <m-select
                        v-model="selectValue"
                        :max-scroll-height="362"
                        :size="160"
                        :placeholder="i18n.global.t('meos_control_web.please_select')"
                        :prefix="i18n.global.t('meos_control_web.end_device_colon')"
                        noborder
                        clearable
                        :options="equipClassCodeList"
                        @change="handleChange"
                        @clear="handleChange"
                    >
                        <m-option v-for="item in equipClassCodeList" :key="item.classCode" :value="item.classCode" :label="item.classCodeName"> </m-option>
                    </m-select>
                </div>
                <!-- 设备类 -->
                <!-- <m-select
                    v-else
                    v-model="selectValue"
                    :max-scroll-height="362"
                    :size="184"
                    :placeholder="i18n.global.t('meos_control_web.please_select')"
                    :prefix="i18n.global.t('meos_control_web.end_device_colon')"
                    clearable
                    :options="equipClassCodeList"
                    @change="handleChange"
                    @clear="handleChange"
                >
                    <m-option v-for="item in equipClassCodeList" :key="item.classCode" :value="item.classCode" :label="item.classCodeName"> </m-option>
                </m-select> -->

                <!-- 窄屏展示筛选按钮，点击弹出 Popover 包裹同样的筛选内容 -->
                <m-popover v-else-if="showEquipmentFilter" trigger="click" placement="bottom-end" :show-arrow="false">
                    <template #content>
                        <div :style="{ padding: '12px 8px' }">
                            <div class="header-box-select">
                                <m-checkbox :model-value="onlyShowControlledEquipmentRef" @change="onlyShowControlledEquipmentChange">
                                    {{ i18n.global.t('meos_control_web.only_controllable_equipment') }}
                                </m-checkbox>
                                <span class="box-split ml12"></span>
                                <m-select
                                    v-model="selectValue"
                                    :max-scroll-height="362"
                                    :size="160"
                                    :placeholder="i18n.global.t('common.placeholder_input')"
                                    :prefix="i18n.global.t('meos_control_web.end_device_colon')"
                                    noborder
                                    clearable
                                    :options="equipClassCodeList"
                                    @change="handleChange"
                                    @clear="handleChange"
                                >
                                    <m-option v-for="item in equipClassCodeList" :key="item.classCode" :value="item.classCode" :label="item.classCodeName"> </m-option>
                                </m-select>
                            </div>
                        </div>
                    </template>
                    <button class="filter-btn fcc">
                        <FilterBtnSvg />
                        <span v-if="hasActiveFilter" class="filter-dot"></span>
                    </button>
                </m-popover>

                <!-- 切换 -->
            </template>
            <HeaderModelSwitch
                v-show="!floorView"
                class="header-model-switch-container"
                :default-tab="headerModelView"
                :disabled-id="headerModelSwitchDisabledId"
                :disabled-tips="i18n.global.t('meos_control_web.model_loading_please_wait')"
                @grid-tab-change="onGridTabChange"
            />
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { useQiankunElementSize } from '@/hooks/useQiankunElementSize';
import { queryListEquipment } from '@/apis/ACOperationControl';
import { CONTROL_BAR_TABS, CONTROL_BAR_TABS_FLOOR, ENV_TABS, CONTROL_BAR_TAB_KEYS, MONITORING_CONTROL_TYPE } from '../constants/constant';
import { IconMeriComponentChevronLeft } from 'meri-icon';
// import BorderTriangleIcon from '@/assets/svg/border-triangle.svg';
import baseStore from '@/store/baseStore';
import HeaderModelSwitch from '@/views/Common/HeaderModelSwitch.vue';
import MapSearch from '@/views/Common/MapSearch/index.vue';
import {
    spacesAndEquipsLoadingInjectKey,
    selectObjectInjectKey,
    headerModelViewKey,
    currentFloorObjKey,
    floorFromeKey,
    mapAllLoadedKey,
    onlyShowIOTSpaceKey,
    envParamShellConfigKey,
    spacesAndEquipsStaticDataKey
} from '../injectKeys';
import { useTemplateRef } from 'vue';
import FilterBtnSvg from '@/assets/svg/filter-btn.svg';
import { dashboardEnvTabsInjectKey } from '../hooks/useDashboard';
import { equipLoadedEmptyKey } from '../hooks/useACGlobalData';
import { envToScheduleStatusMap, SPACE_GRID_PREFIX } from '../variables';
import { NONE_RENDER_IN_3D, SELECT_SOURCE } from '../constants/constant';
import DockSingleton from '@/hooks/responsiveDock';

const props = defineProps({
    scrollTop: {
        type: Number,
        default: 0
    }
});

const { getIotData, getObjectAbnormalStatus } = DockSingleton.getInstance();
const headerModelView = inject(headerModelViewKey);
// const spaceIotDataLoading = inject(spaceIotDataLoadingKey);
const mapAllLoaded = inject(mapAllLoadedKey);

const emits = defineEmits(['grid-tab-change', 'grid-sub-tab-change']);

// 模型切换在地图数据未加载完成前禁止切换，不再等待网格图加载
const headerModelSwitchDisabledId = computed(() => {
    return !mapAllLoaded.value ? 'model' : '';
});

const store = baseStore();

const headerWarpRef = useTemplateRef('headerWarpRef');
const { width: screenWidth } = useQiankunElementSize(headerWarpRef);
const isWideScreen = computed(() => screenWidth.value >= 1344);
const hasActiveFilter = computed(() => {
    // 有选择设备类或仅看可控设备为勾选状态，则认为有过滤
    const controlledChecked = onlyShowControlledEquipmentRef.value === 'checked';
    return controlledChecked || !!selectValue.value;
});
const onGridTabChange = item => {
    headerModelView.value = item;
    emits('grid-tab-change', item);
};

// const tabMapToClassName = {
//     [CONTROL_BAR_TAB_KEYS.QUALITY]: 'quality',
//     [CONTROL_BAR_TAB_KEYS.SCHEDUING]: 'shceduling'
// };

const filterEquipmentClass = inject('filterEquipmentClass');
const currentTab = inject('currentTab');
const currentTabFloor = inject('currentTabFloor');
const currentFloorObj = inject(currentFloorObjKey);
const currentBuidingNum = inject('currentBuidingNum');
const currentEnvAttr = inject('currentEnvAttr');
const currentEnvAttrFloor = inject('currentEnvAttrFloor');
const floorFrome = inject(floorFromeKey);

const selectObject = inject(selectObjectInjectKey);

const onlyShowControlledEquipment = inject('onlyShowControlledEquipment');
const onlyShowIOTSpace = inject(onlyShowIOTSpaceKey);
const envParamShellConfig = inject(envParamShellConfigKey);
const equipLoadedEmpty = inject(equipLoadedEmptyKey);

const spacesAndEquipsStaticData = inject(spacesAndEquipsStaticDataKey);
const allSpaces = computed(() => {
    return spacesAndEquipsStaticData.value?.spaces || [];
});
const allEquips = computed(() => {
    return spacesAndEquipsStaticData.value?.equipments || [];
});
const spacesAndEquipsLoading = inject(spacesAndEquipsLoadingInjectKey);

const floorView = computed(() => {
    return !!currentFloorObj.value?.id;
});
const currentTabWithView = computed(() => {
    return floorView.value ? currentTabFloor.value : currentTab.value;
});

const currentEnvAttrWithView = computed(() => {
    return floorView.value ? currentEnvAttrFloor.value : currentEnvAttr.value;
});

const mapSearchOnlyType = computed(() => {
    if (floorView.value) return '';
    return currentTab.value === CONTROL_BAR_TAB_KEYS.ABNORMAL ? '' : 'space';
});

const headerBg = computed(() => {
    return headerModelView.value === 'model' ? 'transparent' : props?.scrollTop ? '#DBEBFD' : 'transparent';
});

const curOnlyIotSpaceCheck = computed({
    get() {
        return onlyShowIOTSpace.value ? 'checked' : 'uncheck';
    },
    set(val) {
        onlyShowIOTSpace.value = val === 'checked';
    }
});
const spaceFilterFn = spaceData => {
    let flag = true;
    // if (filterEquipmentClass.value && !filterEquipmentClass.value.relSpaceIds?.includes(spaceData.id)) {
    //     flag = false;
    // }

    if (flag && currentTabWithView.value === CONTROL_BAR_TAB_KEYS.ABNORMAL) {
        flag = getObjectAbnormalStatus(spaceData.id) || spaceData.unableMonitor;
    }

    // 还未被过滤flag=true，楼层图且是品质视角，勾选了仅看iot空间
    if (flag && currentTabWithView.value === CONTROL_BAR_TAB_KEYS.QUALITY && onlyShowIOTSpace.value) {
        const infoCode = currentEnvAttrWithView.value;
        const info = getIotData(spaceData.id, infoCode);
        flag = info?.existsIotRule;
    }
    // if (flag && floorView.value && onlyShowControlledEquipment.value) {
    //     flag = spaceData.controlled;
    // }

    return flag;
};

const equipFilterFn = equipData => {
    let flag = true;
    if (filterEquipmentClass.value && filterEquipmentClass.value.classCode !== equipData.classCode) {
        flag = false;
    }

    if (flag && onlyShowControlledEquipment.value && equipData.monitoringSurveillanceStatus !== MONITORING_CONTROL_TYPE.MEASURABLE_CONTROLLABLE) {
        flag = false;
    }

    if (flag && currentTabWithView.value === CONTROL_BAR_TAB_KEYS.ABNORMAL) {
        flag = getObjectAbnormalStatus(equipData?.id);
    }

    return flag;
};

const onlyShowControlledEquipmentRef = ref(onlyShowControlledEquipment?.value ? 'checked' : 'uncheck');

const selectValue = ref();
const equipClassCodeList = inject('equipClassCodeList');

const dashboardEnvTabs = inject(dashboardEnvTabsInjectKey);

const scheduleEnabledEnvIds = computed(() => {
    const envShellConfigList = envParamShellConfig.value || [];

    if (!envShellConfigList.length) {
        return Object.keys(envToScheduleStatusMap);
    }

    return Object.entries(envToScheduleStatusMap)
        .filter(([envId, scheduleField]) => {
            const envConfig = envShellConfigList.find(item => item.code?.replace?.(SPACE_GRID_PREFIX, '')?.toUpperCase() === envId.toUpperCase());
            return (envConfig?.value || []).includes(scheduleField);
        })
        .map(([envId]) => envId);
});

const hasScheduleView = computed(() => scheduleEnabledEnvIds.value.length > 0);

const tabsOptions = computed(() => {
    return CONTROL_BAR_TABS.filter(item => item.id !== CONTROL_BAR_TAB_KEYS.SCHEDUING || hasScheduleView.value).map(item => ({ ...item }));
});

const tabsOptionsFloor = computed(() => {
    return CONTROL_BAR_TABS_FLOOR.filter(item => item.id !== CONTROL_BAR_TAB_KEYS.SCHEDUING || hasScheduleView.value).map(item => ({ ...item }));
});

const showEquipmentFilter = computed(() => !equipLoadedEmpty.value);

const envAttrTabsOptions = computed(() => {
    if (currentTabWithView.value === CONTROL_BAR_TAB_KEYS.QUALITY) {
        return dashboardEnvTabs.value;
    }

    return ENV_TABS.filter(item => scheduleEnabledEnvIds.value.includes(item.id));
});

const buildingLocalName = computed(() => {
    if (currentFloorObj.value) {
        return `${currentFloorObj.value.buildingLocalName}`;
    }
    return '';
});

const curFloorName = computed(() => {
    if (currentFloorObj.value) {
        return i18n.global.t('meos_control_web.floor_num', { floor: currentFloorObj.value.localId || currentFloorObj.value.floorName });
    }
    return '';
});

const getEquipClassCodeList = async () => {
    try {
        let postData = null;
        if (!currentFloorObj?.value?.id) {
            postData = {
                projectId: store.projectId,
                instanceType: 'PROJECT',
                instanceId: store.projectId
            };
        } else {
            postData = {
                projectId: store.projectId,
                instanceType: 'FLOOR',
                instanceId: currentFloorObj.value.id
            };
        }
        filterEquipmentClass.value = null;
        selectValue.value = '';
        const res = await queryListEquipment(postData);

        const { data } = res || {};
        (data || [])
            .filter(da => !NONE_RENDER_IN_3D.includes(da.classCode))
            .forEach(da => {
                da.id = da.classCode;
                da.name = da.classCodeName;
            });
        equipClassCodeList.value = data || [];
    } catch (error) {
        console.error(error);
    }
};

const chooseObj = obj => {
    selectObject(obj, SELECT_SOURCE.SEARCH);
};

watch(
    () => currentFloorObj?.value?.id,
    (val, oldVal) => {
        getEquipClassCodeList();
        currentTab.value = CONTROL_BAR_TAB_KEYS.QUALITY;
        if (!oldVal) {
            currentTabFloor.value = CONTROL_BAR_TAB_KEYS.QUALITY;
        }
    },
    {
        immediate: true
    }
);

watch(
    () => currentTabWithView.value,
    val => {
        if (val === CONTROL_BAR_TAB_KEYS.SCHEDUING && !hasScheduleView.value) {
            if (floorView.value) {
                currentTabFloor.value = CONTROL_BAR_TAB_KEYS.QUALITY;
            } else {
                currentTab.value = CONTROL_BAR_TAB_KEYS.QUALITY;
            }
            return;
        }

        if (val === CONTROL_BAR_TAB_KEYS.SCHEDUING) {
            if (!envAttrTabsOptions.value.some(t => t.id === currentEnvAttrWithView.value)) {
                if (floorView.value) {
                    currentEnvAttrFloor.value = envAttrTabsOptions.value.at(0).id;
                } else {
                    currentEnvAttr.value = envAttrTabsOptions.value.at(0).id;
                }
            }
        }
    },
    {
        deep: true
    }
);

watch(
    () => hasScheduleView.value,
    visible => {
        if (!visible) {
            if (currentTab.value === CONTROL_BAR_TAB_KEYS.SCHEDUING) {
                currentTab.value = CONTROL_BAR_TAB_KEYS.QUALITY;
            }
            if (currentTabFloor.value === CONTROL_BAR_TAB_KEYS.SCHEDUING) {
                currentTabFloor.value = CONTROL_BAR_TAB_KEYS.QUALITY;
            }
        }
    },
    {
        immediate: true
    }
);

watch(
    () => screenWidth.value,
    val => {
        screenWidth.value = val;
    },
    {
        deep: true
    }
);

const handleChange = selectId => {
    filterEquipmentClass.value = equipClassCodeList.value.find(da => da.classCode === selectId);
};

const onlyShowControlledEquipmentChange = state => {
    onlyShowControlledEquipmentRef.value = state;
    onlyShowControlledEquipment.value = state === 'checked' ? true : false;
};

const goBack = () => {
    currentFloorObj.value = null;
    if (floorFrome.value === 'dashboard') {
        headerModelView.value = 'list';
        floorFrome.value = '';
    }
};

onMounted(() => {});

onBeforeUnmount(() => {});
</script>
<style lang="less" scoped>
.header-warp {
    padding: 16px 16px 0px 16px;
    width: 100%;
    height: 48px;
    position: absolute;
    top: 0;
    left: 0;
    z-index: var(--z-index-system-graph-header);
    display: flex;
    justify-content: space-between;

    .header-name {
        color: @grey-800;
        font-size: 20px;
        font-style: normal;
        font-weight: 700;
        line-height: 32px;
    }

    .go-back-wrap {
        flex: 1;
        overflow: hidden;
        display: inline-flex;
        padding: 0px 16px 0px 4px;
        align-items: center;
        gap: 4px;
        flex-shrink: 0;
        border-radius: 4px;
        font-size: 14px;
        color: @grey-900;
        z-index: 20;

        .go-back {
            display: inline-flex;
            align-items: center;
            cursor: pointer;
            &:hover {
                background-color: #c4c9cf80;
            }
        }

        .line {
            width: 1px;
            height: 16px;
            background-color: @grey-400;
        }
        .name {
            display: flex;
            flex: 1;
            overflow: hidden;
            color: @grey-800;
            text-align: center;
            font-size: 20px;
            font-style: normal;
            font-weight: 700;
            .building-name {
                min-width: 20px;
            }
        }
    }

    .header-model-switch-container {
        height: 100%;
    }

    .header-right {
        // width: 100%;
        width: fit-content;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 8px;
        position: relative;
        .floor-checkbox {
            height: 32px;
            padding: 0 12px;
            border-radius: 4px;
            background: var(--Grey-Grey-0, #fff);
            /* Shadow/shadow-1 */
            box-shadow: 0px 2px 10px 0px rgba(27, 33, 41, 0.1);
            /deep/.m-checkbox-label {
                display: inline-block;
                overflow: hidden;
                height: 20px;
                width: unset;
            }
        }
        .abnormal-checkbox {
            width: 104px;
            height: 32px;
            border-radius: 4px;
            background: var(--Grey-Grey-0, #fff);
            /* Shadow/shadow-1 */
            box-shadow: 0px 2px 10px 0px rgba(27, 33, 41, 0.1);
        }

        .header-box-tab {
            position: relative;
            :deep(> .m-tabs.m-tabs-segment) {
                width: 217px;
                .m-tabs-item {
                    flex: 1;
                    padding: 0 10px;
                }
                .m-tabs-name {
                    min-width: 10px;
                    line-height: 22px;
                }
                .m-tabs-body {
                    padding-right: 0 !important;

                    .m-tabs-trigger {
                        display: none !important;
                    }
                }
            }
        }
    }
}

.select-explain {
    color: var(--gray-500);
    line-height: 22px;
    font-size: 12px;
    padding: 0 0 0 8px;
}

@media screen and (max-width: 1488px) {
    .floor-checkbox {
        /deep/.m-checkbox-label {
            width: 40px;
        }
    }
}
.header-box-select {
    height: 32px;
    border-radius: 4px;
    background: #fff;
    padding: 8px 4px 8px 12px;
    border: 1px solid var(--gray-400);
    display: flex;
    align-items: center;
    .box-split {
        width: 1px;
        height: 14px;
        opacity: 0.4;
        background: var(--gray-500, #8b949e);
    }
    :deep(.m-select) {
        height: 24px;
    }
    &:not(:has(.box-split)) {
        padding: 8px 0px 8px 0px;
    }
    :deep(.m-checkbox-label) {
        max-width: 80px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: inline-block;
    }
}
.filter-btn {
    padding: 4px;
    position: relative;
    border-radius: 4px;
    background-color: transparent;
    .filter-dot {
        position: absolute;
        right: -4px;
        top: -4px;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        border: 1px solid var(--Grey-Grey-0, #fff);
        background-color: #007aff;
    }
    &:hover {
        background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
    }
}
:deep(.m-select-inner-prefix) {
    display: inline-block;
    max-width: 90px;
}
</style>
