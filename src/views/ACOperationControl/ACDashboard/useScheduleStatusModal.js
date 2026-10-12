import { ref, computed, watch, inject } from 'vue';
import i18n from '@/localization';
import DockSingleton from '@/hooks/responsiveDock';
import { flattenedSpacesMapInjectKey, tdbScheduleStatusGroupKey, cO2ScheduleStatusGroupKey } from '../hooks/useDashboard';
import { DASHBOARD_ENV_BELONG_IDS, DASHBOARD_COMMON_VALUES } from '../constants/constant';
import { getSpaceScheduleInfo } from '../utils/spaceStatus';

const filterSpaceIdsList = (filterIds, originalObject) => {
    const result = Object.entries(originalObject || {}).flatMap(([status, spaceIds]) => {
        // status 可能为 --
        if (status && status !== DASHBOARD_COMMON_VALUES.TARGET_VALUE && status !== DASHBOARD_COMMON_VALUES.UNKNOWN) {
            return spaceIds.filter(v => (filterIds?.length ? filterIds?.includes(v) : true))?.map(spaceId => ({ spaceId, status }));
        }
        return [];
    });
    return result;
};

// 调度状态弹窗：聚合 调度状态分组 -> 空间列表 -> 弹窗行数据 的拼装，以及弹窗开关状态。
// 从 CardsStatistics 抽离，使其回归卡片列表薄壳。
export const useScheduleStatusModal = ({ currentFloorObj, floorToSpaceIdsMap, emits }) => {
    const flattenedSpacesMap = inject(flattenedSpacesMapInjectKey);
    const tdbScheduleStatusGroup = inject(tdbScheduleStatusGroupKey);
    const cO2ScheduleStatusGroup = inject(cO2ScheduleStatusGroupKey);

    const showModal = ref(false);
    const modalIdTitle = ref({ id: '', title: '' });
    const modalData = ref([]);

    const tdbScheduleStatusSpaceList = computed(() => {
        const isFloorView = !!currentFloorObj?.value?.id;
        const curFloorSpaceIds = isFloorView ? floorToSpaceIdsMap?.value?.[currentFloorObj?.value?.id] || [] : [];
        return filterSpaceIdsList(curFloorSpaceIds, tdbScheduleStatusGroup.value);
    });

    const tdbScheduleStatusGroupCount = computed(() => {
        return tdbScheduleStatusSpaceList.value?.length ?? 0;
    });

    const cO2ScheduleStatusSpaceList = computed(() => {
        const isFloorView = !!currentFloorObj?.value?.id;
        const curFloorSpaceIds = isFloorView ? floorToSpaceIdsMap?.value?.[currentFloorObj?.value?.id] || [] : [];
        return filterSpaceIdsList(curFloorSpaceIds, cO2ScheduleStatusGroup.value);
    });

    const cO2ScheduleStatusGroupCount = computed(() => {
        return cO2ScheduleStatusSpaceList.value?.length ?? 0;
    });

    const openModal = (type, count) => {
        if (!count) {
            return;
        }
        emits('openSpaceScheduleModal');
        const { getIotData, getCustomInfo } = DockSingleton.getInstance();

        modalIdTitle.value.id = type;
        modalIdTitle.value.title = `${i18n.global.t('meos_control_web.space_scheduling')} - ${
            type === DASHBOARD_ENV_BELONG_IDS.TDB ? i18n.global.t('meos_control_web.temperature') : i18n.global.t('meos_control_web.co2_concentration')
        }`;

        const filterTargetScheduleList = type === DASHBOARD_ENV_BELONG_IDS.TDB ? tdbScheduleStatusSpaceList.value : cO2ScheduleStatusSpaceList.value;

        modalData.value = filterTargetScheduleList
            .map(v => {
                const { spaceId, status } = v || {};
                const spaceData = flattenedSpacesMap.value?.get(spaceId) || {};
                const { id, localName: spaceName, floorSequenceId, floorId, floorLocalId, buildingId, buildingLocalName } = spaceData;

                const { curSpaceUpperEnv, scheduleObj } = getSpaceScheduleInfo(spaceId, spaceData, type, getCustomInfo);
                const controlAim = curSpaceUpperEnv?.secondGroupThirdInfo?.infoCode;
                const targetValObj = controlAim ? getIotData(spaceId, controlAim) : null;
                const iotValObj = getIotData(spaceId, type);
                const limitRangeObj = getCustomInfo(spaceId, DASHBOARD_COMMON_VALUES.DEMAND_CONFIG_INFO_CODE_TYPE, type);
                const commonUnit = iotValObj?.unit || targetValObj?.unit || DASHBOARD_COMMON_VALUES.UNKNOWN;

                const { lowerComfortSeasonLimitValue, upperComfortSeasonLimitValue, carbonDioxideLimitValue, carbonDioxideUpperLimitValue } = limitRangeObj?.dataValue || {};

                return {
                    id,
                    spaceId: id,
                    spaceName,
                    localName: spaceName,
                    floorId,
                    floorLocalId,
                    floorSequenceId,
                    buildingId,
                    buildingName: buildingLocalName,
                    curSpaceUpperEnv,
                    // TODO 不动态的数据
                    scheduleStatus: status || scheduleObj?.dataValue || DASHBOARD_COMMON_VALUES.EMPTY,
                    showTargetValue: !!targetValObj?.existsIotRule,
                    targetValue: targetValObj?.dataValue ? targetValObj?.dataValue + commonUnit : DASHBOARD_COMMON_VALUES.EMPTY,
                    showIotValue: !!iotValObj?.existsIotRule,
                    iotValue: iotValObj?.dataValue ? iotValObj?.dataValue + iotValObj?.unit : DASHBOARD_COMMON_VALUES.EMPTY,
                    unit: iotValObj?.unit || commonUnit,
                    showComfortableValue: !!limitRangeObj?.infoCode,
                    lowerValue:
                        type === DASHBOARD_ENV_BELONG_IDS.TDB
                            ? lowerComfortSeasonLimitValue
                            : type === DASHBOARD_ENV_BELONG_IDS.CO2
                            ? carbonDioxideLimitValue
                            : DASHBOARD_COMMON_VALUES.EMPTY,
                    higherValue:
                        type === DASHBOARD_ENV_BELONG_IDS.TDB
                            ? upperComfortSeasonLimitValue
                            : type === DASHBOARD_ENV_BELONG_IDS.CO2
                            ? carbonDioxideUpperLimitValue
                            : DASHBOARD_COMMON_VALUES.EMPTY
                };
            })
            .toSorted((a, b) => a.floorSequenceId - b.floorSequenceId);

        showModal.value = true;
    };

    watch(
        () => showModal.value,
        cur => {
            if (!cur) {
                modalIdTitle.value.id = DASHBOARD_COMMON_VALUES.EMPTY;
                modalIdTitle.value.title = DASHBOARD_COMMON_VALUES.EMPTY;
                modalData.value = [];
            }
        }
    );

    return {
        showModal,
        modalIdTitle,
        modalData,
        tdbScheduleStatusGroupCount,
        cO2ScheduleStatusGroupCount,
        openModal
    };
};
