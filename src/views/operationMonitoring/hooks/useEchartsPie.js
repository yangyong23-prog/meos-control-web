import { listSpacesByRunningMonitor } from '@/apis/systemDiagram';
import dataDockHandling from '@/hooks/dataDockHandling';
import { iterateObjct4InstanceInfo } from '@/utils/index';
import { generalZoneIdsKey } from './useCommonConfig';
import DockSingleton from '@/hooks/responsiveDock';
import { isEmpty, debounce } from 'lodash';
import i18n from '@/localization';
import { GRID } from '@/utils/globalVariables';

export default curPathName => {
    const { loadDynaDataWithIotHandling } = dataDockHandling();
    const { getCustomInfo, getIotData } = DockSingleton.getInstance();
    const generalZoneIds = inject(generalZoneIdsKey);
    const allSpaceIds = ref([]);
    const chartsData = ref([]);
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
    const queryListSpacesByRunningMonitor = systemId => {
        listSpacesByRunningMonitor({
            runningMonitorType: runningMonitorType.value,
            filterSpaceServiceSystemIds: [systemId]
        }).then(res => {
            allSpaceIds.value = res.data.map(item => ({ id: item.id, localName: item.localName })) || [];
            queryListInfoCodeConfigsByObject(allSpaceIds.value);
        });
    };
    const queryListInfoCodeConfigsByObject = ids => {
        if (ids.length === 0) {
            chartsData.value = [
                { name: i18n.global.t('meos_control_web.over_cooled'), key: 'underCoolingCount', value: 0 },
                { name: i18n.global.t('meos_control_web.too_cool'), key: 'lowerComfortCount', value: 0 },
                { name: i18n.global.t('meos_control_web.comfortable'), key: 'upperComfortCount', value: 0 },
                { name: i18n.global.t('meos_control_web.too_warm'), key: 'overHeatingCount', value: 0 },
                { name: i18n.global.t('meos_control_web.over_heated'), key: 'greaterOverHeatingCount', value: 0 }
            ];
            return;
        }
        loadDynaDataWithIotHandling({
            runningMonitorType: runningMonitorType.value,
            objectIds: ids.filter(item => item.id).map(item => item.id),
            templateCode: GRID,
            notFilterIotInfoCodeRule: true
        }).then(res => {
            const { result, data } = res;
            if (result !== 'success') return;
            const { classCodeIds } = iterateObjct4InstanceInfo(data);
            generalZoneIds.value = classCodeIds;
            if (Array.isArray(data) && data.length > 0 && Array.isArray(allSpaceIds.value)) {
                const spaceIdMap = new Map(allSpaceIds.value.map(spaceItem => [spaceItem.id, spaceItem]));
                data.forEach(item => {
                    const spaceItem = spaceIdMap.get(item.id);
                    Object.assign(spaceItem, item);
                });
                allSpaceIds.value = [...spaceIdMap.values()];
            }
        });
    };
    const runningMonitorType = computed(() => {
        const pathMapping = {
            AC: 'COLD_SOURCE',
            ACCI: 'COLD_HEAT_SOURCE',
            ACCH: 'HEAT_SOURCE'
        };
        const pathName = typeof curPathName.value === 'string' ? curPathName.value : '';
        return pathMapping[pathName] || '';
    });
    const elementsDyncData = computed(() => {
        const list = ref([]);
        if (!Array.isArray(allSpaceIds.value) || allSpaceIds.value.length === 0) {
            return list.value;
        }
        const total = [];
        const counts = {};
        allSpaceIds.value.forEach(item => {
            try {
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
                    total.push(item);
                }
            } catch (error) {
                console.error(`Error processing item ${item.id}:`, error);
            }
        });

        chartConfig.forEach(config => {
            counts[config.key] = total.filter(item => item[config.key] && item.floorId).length;
        });
        list.value = chartConfig
            .map(config => ({
                name: config.name,
                key: config.key,
                value: counts[config.key] || 0,
                data: total.filter(item => item[config.key] && item.floorId)
            }))
            .filter(item => item.value > 0 || (item.key !== 'noData' && item.key !== 'isConfiguration'));
        return list.value;
    });

    const updateDataAndState = data => {
        chartsData.value = data;
    };
    const updateDataAndStateDebounce = debounce(updateDataAndState, 100);

    watch(
        () => elementsDyncData?.value,
        newVal => {
            if (!isEmpty(newVal)) {
                updateDataAndStateDebounce(newVal);
            }
        }
    );
    return { chartsData, allSpaceIds, queryListSpacesByRunningMonitor, queryListInfoCodeConfigsByObject };
};
