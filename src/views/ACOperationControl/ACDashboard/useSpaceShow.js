import { computed, inject } from 'vue';
import DockSingleton from '@/hooks/responsiveDock';

import {
    dashboardCurrentEnvWithScopeInjectKey,
    flattenedSpacesMapInjectKey,
    dashboardOnlyShowIOTMonitorSpaceInjectKey,
    dashboardAbnormalSpaceFilterInjectKey,
    dashboardScheduleValueFilterInjectKey,
    dashboardCurrentEnvInjectKey
} from '../hooks/useDashboard';

import { curEnvHasShellConfigScheduleStatusKey } from '../injectKeys';

import { getEnvScope, DASHBOARD_STATUS_IDS, DASHBOARD_ENV_BELONG_IDS } from '../constants/constant';

import { isSpaceEnvShielded } from '../utils/shield';

export function useSpaceShow(spaceId) {
    const currentEnvWithScope = inject(dashboardCurrentEnvWithScopeInjectKey);
    const flattenedSpacesMap = inject(flattenedSpacesMapInjectKey);

    const dashboardCurrentEnv = inject(dashboardCurrentEnvInjectKey);
    const dashboardOnlyShowIOTMonitorSpace = inject(dashboardOnlyShowIOTMonitorSpaceInjectKey);
    const dashboardAbnormalSpaceFilter = inject(dashboardAbnormalSpaceFilterInjectKey);
    const dashboardScheduleValueFilter = inject(dashboardScheduleValueFilterInjectKey);

    const curEnvHasShellConfigScheduleStatus = inject(curEnvHasShellConfigScheduleStatusKey);

    const { getIotData, getCustomInfo, getObjectAbnormalStatus } = DockSingleton.getInstance();

    const isSecondPositionControlTarget = computed(() => {
        return [DASHBOARD_ENV_BELONG_IDS.RH, DASHBOARD_ENV_BELONG_IDS.PRESSURE_DIFF].includes(dashboardCurrentEnv.value);
    });

    const envFilterContext = computed(() => {
        const envWithScope = currentEnvWithScope.value || '';
        const [envCode = '', scopeCode = 'all'] = envWithScope.split('-');

        return {
            envCode,
            upperEnv: envCode.toUpperCase(),
            scopeCode,
            needScopeFilter: !!envWithScope && scopeCode !== 'all'
        };
    });

    const getEnvIotRules = space => {
        return space?.existsEnvIotRule?.[envFilterContext.value.upperEnv] || [];
    };

    const getControlAimRules = space => {
        return space?.existsControlAimIotRule?.[envFilterContext.value.upperEnv] || [];
    };

    const checkIotMonitorFilter = space => {
        if (!dashboardOnlyShowIOTMonitorSpace.value) {
            return true;
        }

        return getEnvIotRules(space).length > 0;
    };

    const checkScopeFilter = () => {
        const { envCode, scopeCode, needScopeFilter } = envFilterContext.value;

        if (!needScopeFilter) {
            return true;
        }

        const limitRangeObj = getCustomInfo(spaceId, 'DEMAND_CONFIG', envCode);
        const valObj = getIotData(spaceId, envCode);

        let curScope = getEnvScope(valObj?.dataValue, limitRangeObj?.dataValue, envCode);

        if (isSpaceEnvShielded(spaceId, valObj, getIotData)) {
            curScope = DASHBOARD_STATUS_IDS.IS_SHIELD;
        }

        return curScope === scopeCode;
    };

    const checkScheduleValueFilter = space => {
        const { envCode, upperEnv } = envFilterContext.value;

        if (!curEnvHasShellConfigScheduleStatus.value || !dashboardScheduleValueFilter.value || !envCode) {
            return true;
        }

        const currentUpperEnv = space?.[upperEnv] || {};
        const { infoCode, infoCodeType } = currentUpperEnv?.secondGroupSecondInfo || {};

        if (!infoCode || !infoCodeType) {
            return true;
        }

        const targetLabelObj = getCustomInfo(spaceId, infoCodeType, infoCode);

        return dashboardScheduleValueFilter.value === targetLabelObj?.dataValue;
    };

    const checkAbnormalFilter = () => {
        if (dashboardAbnormalSpaceFilter.value !== 'abnormal') {
            return true;
        }

        return !!getObjectAbnormalStatus(spaceId);
    };

    const isSpaceVisible = computed(() => {
        const space = flattenedSpacesMap.value?.get(spaceId);

        if (!space) {
            return false;
        }

        return checkIotMonitorFilter(space) && checkScopeFilter() && checkScheduleValueFilter(space) && checkAbnormalFilter();
    });

    const hasSomeRule = computed(() => {
        const space = flattenedSpacesMap.value?.get(spaceId);

        if (!space) {
            return false;
        }

        const envIotRules = getEnvIotRules(space);
        const controlAimRules = getControlAimRules(space);

        const hasEnvIotRule = envIotRules.length > 0;
        const hasControlAimRule = controlAimRules.length > 0;

        if (isSecondPositionControlTarget.value) {
            return hasEnvIotRule || hasControlAimRule;
        }

        const currentUpperEnv = space?.[envFilterContext.value.upperEnv] || {};
        const hasCustomRule = !!currentUpperEnv?.secondGroupSecondInfo?.infoCode;

        return hasEnvIotRule || hasControlAimRule || hasCustomRule;
    });

    return {
        isSpaceVisible,
        isSpaceShow: isSpaceVisible,
        hasSomeRule
    };
}
