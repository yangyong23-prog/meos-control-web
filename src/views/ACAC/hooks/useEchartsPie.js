import { listSpacesByRunningMonitor } from '@/apis/ACAC';
import dataDockHandling from '@/hooks/dataDockHandling';
import DockSingleton from '@/hooks/responsiveDock';
import { debounce } from 'lodash';
import { RUNNING_MONITOR_TYPE } from '../variables';
import { useSseHook } from './useSSEHook';
import { isEdge } from '@/utils/envUtils';
import i18n from '@/localization';
import { CLOUD_IOT_DATA_CHANGE, INFO_CODE_CONFIG_EVENT, IOT_DATA_CHANGE } from '@/utils/SSEEventTypes';
import { GRID } from '@/utils/globalVariables';

export default () => {
    const { loadDynaDataWithIotHandling } = dataDockHandling();
    const { getCustomInfo, getIotData, clearOneObjectInfo } = DockSingleton.getInstance();
    const { setRelationChartSSEClientOption } = useSseHook();
    const allSpaceIds = ref([]);
    // 定义图表项的配置
    const chartConfig = [
        { name: i18n.global.t('meos_control_web.over_cooled'), key: 'underCoolingCount' },
        { name: i18n.global.t('meos_control_web.too_cool'), key: 'lowerComfortCount' },
        { name: i18n.global.t('meos_control_web.comfortable'), key: 'upperComfortCount' },
        { name: i18n.global.t('meos_control_web.too_warm'), key: 'overHeatingCount' },
        { name: i18n.global.t('meos_control_web.over_heated'), key: 'greaterOverHeatingCount' },
        { name: i18n.global.t('meos_control_web.no_data1'), key: 'noData' },
        { name: i18n.global.t('meos_control_web.no_operation_standard'), key: 'isConfiguration' }
    ];
    // 保留原有五个温度区间，作为尚未加载空间数据时的占位数据。
    const createChartData = spaces => {
        const counts = {};
        chartConfig.forEach(config => {
            counts[config.key] = spaces.filter(item => item[config.key]).length;
        });
        return chartConfig
            .map(config => ({
                name: config.name,
                key: config.key,
                value: counts[config.key] || 0,
                data: spaces.filter(item => item[config.key])
            }))
            .filter(item => item.value > 0 || (item.key !== 'noData' && item.key !== 'isConfiguration'));
    };
    // 三个筛选范围共享同一套温度区间统计，避免切换口径后图例与明细不一致。
    const createSpaceScopeData = spaces => ({
        all: createChartData(spaces.all),
        withAcDemand: createChartData(spaces.withAcDemand),
        withoutAcDemand: createChartData(spaces.withoutAcDemand)
    });
    const createEmptySpaceScopeData = () => createSpaceScopeData({ all: [], withAcDemand: [], withoutAcDemand: [] });
    const chartsData = ref(createChartData([]));
    const chartsDataBySpaceScope = ref(createEmptySpaceScopeData());
    const queryListSpacesByRunningMonitor = systemId => {
        listSpacesByRunningMonitor({
            runningMonitorType: RUNNING_MONITOR_TYPE,
            filterSpaceServiceSystemIds: [systemId],
            filterInfoCodeRules: ['tdb']
        }).then(res => {
            const resData = res?.data || [];
            const simpleResData = resData.map(item => ({ id: item.id, localName: item.localName }));
            queryListInfoCodeConfigsByObject(simpleResData);
        });
    };
    const queryListInfoCodeConfigsByObject = ids => {
        ids.forEach(item => {
            clearOneObjectInfo(item.id);
        });
        if (ids.length === 0) {
            chartsData.value = createChartData([]);
            chartsDataBySpaceScope.value = createEmptySpaceScopeData();
            allSpaceIds.value = [];
            return;
        }
        loadDynaDataWithIotHandling({
            runningMonitorType: RUNNING_MONITOR_TYPE,
            objectIds: ids.filter(item => item.id).map(item => item.id),
            templateCode: GRID,
            notFilterIotInfoCodeRule: true
        }).then(res => {
            const { result, data } = res;
            if (result !== 'success') return;
            if (Array.isArray(data) && data.length > 0 && Array.isArray(ids)) {
                const spaceIdMap = new Map(ids.map(spaceItem => [spaceItem.id, spaceItem]));
                data.forEach(item => {
                    const spaceItem = spaceIdMap.get(item.id) || {};
                    Object.assign(spaceItem, item);
                });
                const arr = [...spaceIdMap.values()];
                allSpaceIds.value = structuredClone(arr);
                setRelationChartSSEClientOption(
                    { GeneralZone: arr.map(item => item.id) },
                    RUNNING_MONITOR_TYPE,
                    GRID,
                    [isEdge() ? IOT_DATA_CHANGE : CLOUD_IOT_DATA_CHANGE, INFO_CODE_CONFIG_EVENT],
                    {
                        INFO_CODE_CONFIG_EVENT: { templateType: GRID },
                        ...(isEdge()
                            ? {}
                            : {
                                  CLOUD_IOT_DATA_CHANGE: {
                                      templateTypes: [GRID]
                                  }
                              })
                    }
                );
            }
        });
    };
    // 计算所有空间的总数
    const allChartSpacesCount = computed(() => allSpaceIds.value.length || 0);

    const elementsDyncData = computed(() => {
        const arr = structuredClone(allSpaceIds.value);
        if (!Array.isArray(arr) || arr.length === 0) {
            return createEmptySpaceScopeData();
        }
        // airConditionDemand=1 表示有空调需求，其余空间归入无空调需求范围。
        const spacesByScope = {
            all: [],
            withAcDemand: [],
            withoutAcDemand: []
        };

        arr.forEach(item => {
            try {
                const acDemandObj = getIotData(item.id, 'airConditionDemand');
                const hasAirConditioningDemand = acDemandObj?.existsIotRule === true && acDemandObj?.dataValue === '1';

                const tdbObj = getIotData(item.id, 'tdb');
                item.isTdb = !!tdbObj;
                const demandConfigObj = getCustomInfo(item.id, 'DEMAND_CONFIG', 'tdb');
                const configDataValue = demandConfigObj?.dataValue;
                if (configDataValue) {
                    item.isConfiguration = false;
                    const limits = {
                        underCooling: parseFloat(configDataValue.underCoolingSeasonLimitValue) || 0,
                        lowerComfort: parseFloat(configDataValue.lowerComfortSeasonLimitValue) || 0,
                        upperComfort: parseFloat(configDataValue.upperComfortSeasonLimitValue) || 0,
                        overHeating: parseFloat(configDataValue.overHeatingSeasonLimitValue) || 0
                    };
                    item.underCoolingCount = 0;
                    item.lowerComfortCount = 0;
                    item.upperComfortCount = 0;
                    item.overHeatingCount = 0;
                    item.greaterOverHeatingCount = 0;
                    if (tdbObj?.dataValue) {
                        item.noData = false;
                        const dataValue = parseFloat(tdbObj?.dataValue);
                        const ranges = [
                            { key: 'underCoolingCount', condition: dataValue < limits.underCooling },
                            { key: 'lowerComfortCount', condition: dataValue >= limits.underCooling && dataValue < limits.lowerComfort },
                            { key: 'upperComfortCount', condition: dataValue >= limits.lowerComfort && dataValue <= limits.upperComfort },
                            { key: 'overHeatingCount', condition: dataValue > limits.upperComfort && dataValue <= limits.overHeating },
                            { key: 'greaterOverHeatingCount', condition: dataValue > limits.overHeating }
                        ];
                        ranges.forEach(range => {
                            if (range.condition) item[range.key]++;
                        });
                    } else {
                        item.noData = true;
                    }
                } else {
                    item.isConfiguration = true;
                }
                if (item.isTdb) {
                    spacesByScope.all.push(item);
                    spacesByScope[hasAirConditioningDemand ? 'withAcDemand' : 'withoutAcDemand'].push(item);
                }
            } catch (error) {
                console.error(`Error processing item ${item.id}:`, error);
            }
        });
        return createSpaceScopeData(spacesByScope);
    });

    const updateDataAndState = data => {
        chartsData.value = data.withAcDemand;
        chartsDataBySpaceScope.value = data;
    };
    const updateDataAndStateDebounce = debounce(updateDataAndState, 100);

    watch(
        () => elementsDyncData?.value,
        newVal => {
            updateDataAndStateDebounce(newVal);
        },
        {
            deep: true
        }
    );
    return { chartsData, chartsDataBySpaceScope, allChartSpacesCount, queryListSpacesByRunningMonitor };
};
