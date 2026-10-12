<template>
    <div class="widget-card">
        <m-checkbox v-model="dashboardOnlyShowIOTMonitorSpaceCheck">{{ i18n.global.t('meos_control_web.show_iot_spaces_only') }}</m-checkbox>
        <div class="cascader-container">
            <div class="divider"></div>
            <m-cascader
                :key="extraOptionsRenderKey"
                v-model="dashboardCurrentEnvWithScope"
                :options="envList"
                :caption="i18n.global.t('meos_control_web.env_parameters')"
                :clearable="false"
                :popover-class="'cascader-env-list-custom-dropdown'"
                :width="200"
                :drop-panel-single-width="160"
                @change="cascaderChange"
            >
            </m-cascader>
        </div>
    </div>
    <div v-if="!isQualityFirst && !isEmptyValueSelectType && curEnvHasShellConfigScheduleStatus" class="widget-select">
        <m-select
            v-model="dashboardScheduleValueFilter"
            clearable
            :size="200"
            :options="scheduleValueList"
            :max-scroll-height="362"
            :placeholder="i18n.global.t('meos_control_web.please_select')"
            :prefix="i18n.global.t('meos_control_web.schedule_status_colon')"
        ></m-select>
    </div>
    <div class="widget-select">
        <m-select
            v-model="dashboardAbnormalSpaceFilter"
            clearable
            :size="200"
            :options="abnormalList"
            :max-scroll-height="362"
            :placeholder="i18n.global.t('meos_control_web.please_select')"
            :prefix="i18n.global.t('meos_control_web.abnormal_filter_colon')"
        ></m-select>
    </div>
    <m-tree-select
        v-model="currentBuildingFloorObj"
        :data="buildingFloors"
        clearable
        :size="200"
        class="widget-select"
        :prefix="i18n.global.t('meos_control_web.building_floor_colon')"
        searchable
        panel-searchable
    >
    </m-tree-select>
</template>

<script setup>
import i18n from '@/localization';
import { immutableBuildingFloorSpacesStaticTreeKey, globalValueSelectTypeKey, curEnvHasShellConfigScheduleStatusKey, seasonTagCodesKey } from '../injectKeys';
import { listInstantiationDateTag } from '@/apis/calendar';
import dayjs from 'dayjs';
import {
    dashboardOnlyShowIOTMonitorSpaceInjectKey,
    dashboardScheduleValueFilterInjectKey,
    dashboardAbnormalSpaceFilterInjectKey,
    dashboardCurrentEnvInjectKey,
    dashboardCurrentEnvWithScopeInjectKey,
    dashboardCurrentBuildingFloorObjInjectKey,
    dashboardEnvTabsInjectKey,
    curDashboardStaticsEnvParamKey
} from '../hooks/useDashboard';
import {
    DASHBOARD_CARD_TEMPERATURE_STATUS_MAP,
    DASHBOARD_CARD_CO2_STATUS_MAP,
    DASHBOARD_CARD_RH_STATUS_MAP,
    DASHBOARD_CARD_PRESSURE_DIFF_STATUS_MAP,
    DASHBOARD_ENV_BELONG_IDS
} from '../constants/constant';
import { debounce, isEqual } from 'lodash';
import { getDayjsTz } from '@/utils/globalVariables';

const SEASON_ENUM = {
    SEASON_COOLING: 'ACSeason-1', // 供冷季
    SEASON_HEATING: 'ACSeason-2' // 供热季
};

const defaultList = [{ id: 'TARGET_VALUE', name: i18n.global.t('meos_control_web.un_schedule') }];

const globalValueSelectType = inject(globalValueSelectTypeKey);

const isQualityFirst = computed(() => globalValueSelectType.value === 'value_select_quality_first');
const isEmptyValueSelectType = computed(() => !globalValueSelectType.value?.length);

const coolSeasonValueList = [
    { id: 'TARGET_VALUE', name: i18n.global.t('meos_control_web.un_schedule') },
    { id: 'UPPER_LIMIT_VALUE', name: i18n.global.t('meos_control_web.upper_limit_value') },
    { id: 'COLD_STORAGE_VALUE', name: i18n.global.t('meos_control_web.cold_storage_value') }
];

const hotSeasonValueList = [
    { id: 'TARGET_VALUE', name: i18n.global.t('meos_control_web.un_schedule') },
    { id: 'LOWER_LIMIT_VALUE', name: i18n.global.t('meos_control_web.lower_limit_value') },
    { id: 'HEAT_STORAGE_VALUE', name: i18n.global.t('meos_control_web.heat_storage_value') }
];

const co2ValueList = [
    { id: 'TARGET_VALUE', name: i18n.global.t('meos_control_web.un_schedule') },
    { id: 'UPPER_LIMIT_VALUE', name: i18n.global.t('meos_control_web.upper_limit_value') }
];

const abnormalList = [{ id: 'abnormal', name: i18n.global.t('meos_control_web.abnormal_event') }];
const emits = defineEmits(['filter-change']);

const dashboardEnvTabs = inject(dashboardEnvTabsInjectKey);
const dashboardCurrentEnvWithScope = inject(dashboardCurrentEnvWithScopeInjectKey);
const curDashboardStaticsEnvParam = inject(curDashboardStaticsEnvParamKey);
const dashboardCurrentEnv = inject(dashboardCurrentEnvInjectKey);

const currentBuildingFloorObj = inject(dashboardCurrentBuildingFloorObjInjectKey);
const immutableBuildingFloorSpacesStaticTree = inject(immutableBuildingFloorSpacesStaticTreeKey);
const dashboardOnlyShowIOTMonitorSpace = inject(dashboardOnlyShowIOTMonitorSpaceInjectKey);
const dashboardScheduleValueFilter = inject(dashboardScheduleValueFilterInjectKey);
const dashboardAbnormalSpaceFilter = inject(dashboardAbnormalSpaceFilterInjectKey);

const curEnvHasShellConfigScheduleStatus = inject(curEnvHasShellConfigScheduleStatusKey);

const dashboardOnlyShowIOTMonitorSpaceCheck = computed({
    get() {
        return dashboardOnlyShowIOTMonitorSpace.value ? 'checked' : 'uncheck';
    },
    set(val) {
        dashboardOnlyShowIOTMonitorSpace.value = val === 'checked';
    }
});

const isFilterChange = computed(() => [
    dashboardOnlyShowIOTMonitorSpaceCheck.value,
    dashboardCurrentEnvWithScope.value,
    dashboardScheduleValueFilter.value,
    dashboardAbnormalSpaceFilter.value,
    currentBuildingFloorObj.value
]);

const resetFilterDefault = () => {
    dashboardOnlyShowIOTMonitorSpaceCheck.value = 'checked';
    dashboardCurrentEnvWithScope.value = envList?.value?.flatMap?.(v => v?.children)?.[0]?.id;
    dashboardScheduleValueFilter.value = '';
    dashboardAbnormalSpaceFilter.value = '';
    currentBuildingFloorObj.value = undefined;
};

// 默认数据
const envList = ref([]);
const extraOptionsRenderKey = ref('');

// 动态一级选项，静态二级选项
watch(
    () => dashboardEnvTabs.value,
    curTabs => {
        if (curTabs?.length) {
            envList.value = curTabs.map(tab => {
                const isTdb = tab?.id === DASHBOARD_ENV_BELONG_IDS.TDB;
                const isCo2 = tab?.id === DASHBOARD_ENV_BELONG_IDS.CO2;
                const isRh = tab?.id === DASHBOARD_ENV_BELONG_IDS.RH;
                const isPressureDiff = tab?.id === DASHBOARD_ENV_BELONG_IDS.PRESSURE_DIFF;
                const tdbFilterArr = DASHBOARD_CARD_TEMPERATURE_STATUS_MAP.map(v => ({ ...v, id: `${v.belong}-${v.id}` }));
                const co2FilterArr = DASHBOARD_CARD_CO2_STATUS_MAP.map(v => ({ ...v, id: `${v.belong}-${v.id}` }));
                const rhFilterArr = DASHBOARD_CARD_RH_STATUS_MAP.map(v => ({ ...v, id: `${v.belong}-${v.id}` }));
                const pressureDiffFilterArr = DASHBOARD_CARD_PRESSURE_DIFF_STATUS_MAP.map(v => ({ ...v, id: `${v.belong}-${v.id}` }));
                const extraArr = isTdb ? tdbFilterArr : isCo2 ? co2FilterArr : isRh ? rhFilterArr : isPressureDiff ? pressureDiffFilterArr : [];
                return { ...tab, children: [{ id: `${tab.id}-all`, name: i18n.global.t('common.all') }, ...extraArr] };
            });
            extraOptionsRenderKey.value = new Date().toISOString();
        }
    },
    {
        immediate: true
    }
);

// 动态默认选中项
watch(
    () => envList.value,
    curEnvList => {
        if (curEnvList?.length) {
            // 没有选中环境参数值时取默认级联第一个值
            if (curEnvList?.[0]?.children?.[0]?.id && !dashboardCurrentEnvWithScope.value) {
                dashboardCurrentEnvWithScope.value = curEnvList[0].children[0].id;
            }
        }
    },
    {
        immediate: true
    }
);

const cascaderChange = () => {
    curDashboardStaticsEnvParam.value = {};
};

const delayFilterChange = debounce(() => {
    emits('filter-change');
}, 500);

watch(
    () => isFilterChange.value,
    (newVal, oldVal) => {
        if (!isEqual(newVal, oldVal)) {
            delayFilterChange();
        }
    }
);

watch(
    () => curEnvHasShellConfigScheduleStatus.value,
    visible => {
        if (!visible && dashboardScheduleValueFilter.value) {
            dashboardScheduleValueFilter.value = '';
        }
    },
    {
        immediate: true
    }
);

const seasonTagCodes = inject(seasonTagCodesKey); // 供冷季

const isMultiple = computed(() => {
    const len = immutableBuildingFloorSpacesStaticTree.value?.length ?? 0;
    return len > 1;
});

const buildingFloors = computed(() => {
    const isOpen = !isMultiple.value;
    const options = (immutableBuildingFloorSpacesStaticTree.value || []).map(item => {
        const { floors, ...rest } = item || {};
        // 区分单/多建筑，单建筑默认展开节点，多建筑默认收起节点
        return { ...rest, open: isOpen, children: floors?.map(v => ({ id: v?.id, name: v?.name })) };
    });
    return options;
});

const scheduleValueList = computed(() => {
    if (dashboardCurrentEnv.value === 'tdb') {
        if (seasonTagCodes.value?.includes(SEASON_ENUM.SEASON_COOLING)) {
            return coolSeasonValueList;
        } else if (seasonTagCodes.value?.includes(SEASON_ENUM.SEASON_HEATING)) {
            return hotSeasonValueList;
        } else {
            return defaultList;
        }
    } else if (dashboardCurrentEnv.value === 'cO2') {
        return co2ValueList;
    }
    return [];
});

defineExpose({
    resetFilterDefault
});
</script>

<style lang="less">
.cascader-env-list-custom-dropdown {
    .m-cascader__list {
        height: fit-content !important;
    }
    .m-scrollbar__box {
        height: 338px !important;
    }
}
</style>
<style lang="less" scoped>
.widget-card {
    border-radius: 4px;
    background: #fff;
    border: 1px solid @grey-400;

    display: flex;
    width: fit-content;
    height: 32px;
    padding: 8px 0px 8px 8px;
    align-items: center;
    :deep(.m-checkbox-label) {
        max-width: 140px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: inline-block;
    }
    &:hover {
        border: 1px solid @blue-600;
    }
}

.cascader-container {
    display: flex;
    align-items: center;

    .divider {
        width: 1px;
        height: 14px;
        background: #c4c9cf;
        margin-left: 12px;
    }

    :deep(.m-cascader__result) {
        border: none;
        padding: 0 8px 0 12px;
    }

    :deep(.m-select-inner) {
        border: none;
    }
}
.widget-select,
.widget-card {
    & :deep(.m-select-inner-prefix) {
        display: inline-block;
        max-width: 120px;
    }
}
</style>
