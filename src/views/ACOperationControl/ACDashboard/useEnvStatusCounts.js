import { computed } from 'vue';
import { getStatusMapForEnv, DASHBOARD_ENV_BELONG_IDS, DASHBOARD_STATUS_IDS } from '../constants/constant';

// 将空间id-状态映射按状态分组后，统计各状态空间数量（含加载/无数据占位处理）
const getCountByGroup = (filterIds, originalObject, type) => {
    const mapData = getStatusMapForEnv(type) || [];
    const mapIds = mapData.map(item => item.id);
    let statusCount = {};
    mapIds.forEach(key => {
        let spaceIds = originalObject[key] || [];
        if (filterIds?.length) {
            spaceIds = spaceIds.filter(v => filterIds.includes(v));
        }
        const finalCount = spaceIds?.length ?? 0;
        // 非无数据项/无标准项，或无数据项/无标准项有值才展示
        const hideKeys = [DASHBOARD_STATUS_IDS.NO_DATA, DASHBOARD_STATUS_IDS.NO_STANDARD, DASHBOARD_STATUS_IDS.IS_SHIELD];
        if (hideKeys.includes(key) && !finalCount) {
            return;
        }
        statusCount[key] = finalCount;
    });

    return statusCount;
};

// 由环境类型配置驱动，生成各环境参数的状态计数 computed，消除 CardsStatistics 中 4 份重复。
// statusStatistics: { [envType]: 注入的 状态分组 ref }；currentFloorObj / floorToSpaceIdsMap 用于楼层视图过滤。
export const useEnvStatusCounts = ({ statusStatistics, currentFloorObj, floorToSpaceIdsMap }) => {
    const buildCount = envType =>
        computed(() => {
            const isFloorView = !!currentFloorObj?.value?.id;
            const curFloorSpaceIds = isFloorView ? floorToSpaceIdsMap?.value?.[currentFloorObj?.value?.id] || [] : [];
            return getCountByGroup(curFloorSpaceIds, statusStatistics[envType].value, envType);
        });

    return {
        tdbStatusCount: buildCount(DASHBOARD_ENV_BELONG_IDS.TDB),
        co2StatusCount: buildCount(DASHBOARD_ENV_BELONG_IDS.CO2),
        rhStatusCount: buildCount(DASHBOARD_ENV_BELONG_IDS.RH),
        pressureDiffCount: buildCount(DASHBOARD_ENV_BELONG_IDS.PRESSURE_DIFF)
    };
};
