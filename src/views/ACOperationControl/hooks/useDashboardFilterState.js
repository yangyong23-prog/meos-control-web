import { ref, computed, provide, watch, onUnmounted } from 'vue';
import i18n from '@/localization';

// 过滤/选择状态簇：当前环境参数（一级/二级）、IOT 监测仅看、调度值过滤、异常过滤、
// 当前建筑/楼层、环境 tab、当前统计参数、品质/压差启用开关。
export const dashboardOnlyShowIOTMonitorSpaceInjectKey = Symbol('dashboardOnlyShowIOTMonitorSpace');
export const dashboardScheduleValueFilterInjectKey = Symbol('dashboardScheduleValueFilter');
export const dashboardAbnormalSpaceFilterInjectKey = Symbol('dashboardAbnormalSpaceFilter');
export const dashboardCurrentEnvInjectKey = Symbol('dashboardCurrentEnv');
export const dashboardCurrentEnvWithScopeInjectKey = Symbol('dashboardCurrentEnvWithScope');
export const dashboardCurrentBuildingObjInjectKey = Symbol('dashboardCurrentBuildingObj');
export const dashboardCurrentBuildingFloorObjInjectKey = Symbol('dashboardCurrentBuildingFloorObjInjectKey');
export const dashboardEnvTabsInjectKey = Symbol('dashboardEnvTabsInjectKey');
export const dashboardFilterEnvStatusInjectKey = Symbol('dashboardFilterEnvStatus');
export const curDashboardStaticsEnvParamKey = Symbol('curDashboardStaticsEnvParam');
export const isRhQualityEnabledKey = Symbol('isRhQualityEnabled');
export const isPressureDiffEnabledKey = Symbol('isPressureDiffEnabled');

export const currentItemTitleInjectKey = Symbol('currentItemTitleInjectKey');

// 看板过滤与选择状态 store：持有环境参数选择、各类过滤开关、建筑/楼层选择等响应式状态，
// 并暴露 filterEnvWithScope 用于响应统计卡片的点击过滤。
export const useDashboardFilterState = () => {
    const dashboardEnvTabs = ref([]);
    const isRhQualityEnabled = ref(false);
    const isPressureDiffEnabled = ref(false);

    const dashboardOnlyShowIOTMonitorSpace = ref(false);
    const dashboardScheduleValueFilter = ref('');
    const dashboardAbnormalSpaceFilter = ref('');
    // 环境参数二级选项
    const dashboardCurrentEnvWithScope = ref();
    // 环境参数一级选项
    const dashboardCurrentEnv = computed(() => {
        const envWithScope = dashboardCurrentEnvWithScope.value || '';
        const [envCode = ''] = envWithScope.split('-');
        return envCode || '';
    });
    const dashboardCurrentBuildingObj = ref();
    const dashboardCurrentBuildingFloorObj = ref();
    const curDashboardStaticsEnvParam = ref({});

    const filterEnvWithScope = item => {
        // 反选
        if (item?.id === curDashboardStaticsEnvParam.value?.id && item?.belong === curDashboardStaticsEnvParam.value?.belong) {
            curDashboardStaticsEnvParam.value = {};
            const firstItem = dashboardEnvTabs?.value?.[0];
            if (!firstItem) return;
            dashboardCurrentEnvWithScope.value = `${firstItem.id}-all`;
            return;
        }
        const env = item?.belong;
        // 当前未选中一级选项时，或选项中无环境数据时，不处理
        if (!dashboardCurrentEnv.value || !dashboardEnvTabs?.value?.some(v => v?.id === env)) {
            return;
        }

        dashboardCurrentEnvWithScope.value = `${item.belong}-${item.id}`;
        // 默认勾选上仅看iot空间
        dashboardOnlyShowIOTMonitorSpace.value = true;
        curDashboardStaticsEnvParam.value = item;
    };

    const curEnvName = computed(() => {
        return dashboardEnvTabs.value?.find(item => item?.id === dashboardCurrentEnv.value)?.name;
    });

    const currentItemTitle = computed(() => {
        return curEnvName.value ? i18n.global.t('meos_control_web.current_item', { item: curEnvName.value }) : '  ';
    });

    provide(dashboardEnvTabsInjectKey, dashboardEnvTabs);
    provide(dashboardOnlyShowIOTMonitorSpaceInjectKey, dashboardOnlyShowIOTMonitorSpace);
    provide(dashboardScheduleValueFilterInjectKey, dashboardScheduleValueFilter);
    provide(dashboardAbnormalSpaceFilterInjectKey, dashboardAbnormalSpaceFilter);
    provide(dashboardCurrentEnvInjectKey, dashboardCurrentEnv);
    provide(dashboardCurrentEnvWithScopeInjectKey, dashboardCurrentEnvWithScope);
    provide(dashboardCurrentBuildingObjInjectKey, dashboardCurrentBuildingObj);
    provide(dashboardCurrentBuildingFloorObjInjectKey, dashboardCurrentBuildingFloorObj);
    provide(dashboardFilterEnvStatusInjectKey, filterEnvWithScope);
    provide(curDashboardStaticsEnvParamKey, curDashboardStaticsEnvParam);
    provide(isRhQualityEnabledKey, isRhQualityEnabled);
    provide(isPressureDiffEnabledKey, isPressureDiffEnabled);
    provide(currentItemTitleInjectKey, currentItemTitle);

    watch(dashboardCurrentEnv, () => {
        dashboardScheduleValueFilter.value = '';
    });

    onUnmounted(() => {
        dashboardOnlyShowIOTMonitorSpace.value = null;
        dashboardScheduleValueFilter.value = null;
        dashboardAbnormalSpaceFilter.value = null;
        dashboardCurrentEnvWithScope.value = null;
        dashboardCurrentBuildingObj.value = null;

        // 补全：
        dashboardEnvTabs.value = [];
        dashboardCurrentBuildingFloorObj.value = null;
        curDashboardStaticsEnvParam.value = {};
        isRhQualityEnabled.value = false;
        isPressureDiffEnabled.value = false;
    });

    return {
        dashboardEnvTabs,
        dashboardCurrentEnv,
        dashboardCurrentEnvWithScope,
        dashboardOnlyShowIOTMonitorSpace,
        dashboardScheduleValueFilter,
        dashboardAbnormalSpaceFilter,
        dashboardCurrentBuildingObj,
        dashboardCurrentBuildingFloorObj,
        curDashboardStaticsEnvParam,
        filterEnvWithScope,
        isRhQualityEnabled,
        isPressureDiffEnabled
    };
};
