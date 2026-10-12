// @ts-ignore
import i18n from '@/localization';
import useStore from '@/store';
import DockSingleton from '@/hooks/responsiveDock';
import dataDockHandling from '@/hooks/dataDockHandling';
import { orderBy, uniqBy } from 'lodash';
import { equipmentsWithStatusKey } from './useBaseDataHook';
import useSinglePOSTSSEClient from '@/components/hooks/useSinglePOSTSSEClient';
import xplantindoorenvStore from '@/store/xplantindoorenv';
import { getListTreeBuildingFloorSpace } from '@/apis/xplantindoorenv3d';
import { GeneralZone, MODEL_VIEW, SUCCESSCODE } from '@/utils/globalVariables';
import { getEquipmentsBySpaceId, getSpaceInfoBySpaceId, getEquipmentsBySpaceIdV2 } from '@/apis/machineRoomSpaceMap';

import {
    space3DViewSSEClientInjectKey,
    allEquipsInjectKey,
    allSpaceInfoInjectKey,
    allSpaceInfoWithEquipsLoadingInjectKey,
    riskAbnormalLoadingInjectKey,
    runningMonitorTypeInjectKey,
    curSpace3DViewDataInjectKey,
    allFloorInfoInjectKey,
    switchIotHideInjectKey,
    selEquipIdsInjectKey,
    equipClassOptionInjectKey
} from '../constant/injectKey';
import { iterateObjct4InstanceInfo } from '@/utils';
import { RUNNING_MONITOR_TYPE, SPACE_STATUS } from '../variable';
import { useRoute } from 'vue-router';
import useAbnormalDataWithSSE from '@/views/Common/AbnormalListPlus/useAbnormalDataWithSSE';
import { isEdge } from '@/utils/envUtils';
import {
    ABNORMAL_EVENT,
    CLOUD_IOT_DATA_CHANGE,
    DANGER_EVENT,
    INFO_CODE_CONFIG_EVENT,
    IOT_DATA_CHANGE,
    RELEASE_INTERVENTION,
    DANGER_EVENT_MONITORING_SITUATION
} from '@/utils/SSEEventTypes';
import { CAMERA_COLUMS, EQUIP_BASE_COLUMS } from '@/constants/equipAdditionalColumns';

import useRewriteSingletonDanegerEventFn from './useRewriteSingletonDanegerEventFn';
import useRewriteSingletonAbnormalEventFn from './useRewriteSingletonAbnormalEventFn';
import { sortDangerEventByStatus, sortDangerEventByTagAndName } from '../utils';

const runningMonitorType = 'COMPUTER_ROOM_SECURITY';
export const getRiskListByInstanceKey = Symbol('getRiskListByInstance');
export const getRiskListNameViewByInstanceKey = Symbol('getRiskListNameViewByInstance');
export const spaceAbnormalDetailWithListKey = Symbol('spaceAbnormalDetailWithListKey');

export default ({ spaceShowModuleInfo, spaceSelectModuleInfo }) => {
    const { base } = useStore();
    const { initDangerEventIds, loadDangerEventsListWithHandling } = dataDockHandling();
    // 设备类编码和对象ID
    const classCode2objectIds = ref({});
    const objectIds = ref([]);
    const equipClassOption = ref([]);

    const switchIotHideModel = ref('uncheck');
    const selEquipIds = ref();
    const switchIotHide = computed(() => {
        return switchIotHideModel.value === 'uncheck';
    });
    // 仅主动管理的风险-组件model
    const spaceOnlyActMagRiskModel = ref('checked');
    // SSE
    const { sseClient, setSSEClientOption } = useSinglePOSTSSEClient(runningMonitorType);
    // 订阅事件类型
    const eventType = [isEdge() ? IOT_DATA_CHANGE : CLOUD_IOT_DATA_CHANGE, RELEASE_INTERVENTION, INFO_CODE_CONFIG_EVENT, DANGER_EVENT, DANGER_EVENT_MONITORING_SITUATION];

    const eventParamMap = { INFO_CODE_CONFIG_EVENT: { templateType: MODEL_VIEW } };
    if (!isEdge()) {
        eventParamMap.CLOUD_IOT_DATA_CHANGE = { templateType: MODEL_VIEW };
    }
    const isActiveOnlyMagRisk = computed(() => {
        return spaceOnlyActMagRiskModel.value === 'checked';
    });
    // 重新池子异常，风险相关API
    useRewriteSingletonDanegerEventFn(isActiveOnlyMagRisk);
    useRewriteSingletonAbnormalEventFn(isActiveOnlyMagRisk);

    const { setObject2RelatedObject, getRelatedObjects, getObjectDanegerEventsList, AbnormalEventStrategy, setAbnormalEventStrategy, getAbnormalEventsList } =
        DockSingleton.getInstance();

    watch([() => classCode2objectIds.value, () => initDangerEventIds.value], () => {
        if (Object.keys(classCode2objectIds.value).length) {
            if (initDangerEventIds.value?.length) {
                eventParamMap.DANGER_EVENT_MONITORING_SITUATION = initDangerEventIds.value;
            }
            setSSEClientOption({
                claasCode2objectIds: classCode2objectIds.value,
                eventParamMap,
                eventType: [...eventType, ABNORMAL_EVENT]
            });
        }
    });

    const { onQueryAbnormalEventList, abnormalEventListLoading } = useAbnormalDataWithSSE({
        sseClient: sseClient,
        objectIds: objectIds
    });

    const spaceAbnormalDetailWithList = ref({ abnormalEventListLoading: true, abnormalEventList: [] });

    const equipmentsInSpace = ref([]);
    const equipmentsWithStatus = computed(() => {
        if (equipmentsInSpace.value.length === 0) {
            return [];
        }
        const equipmentsInClassCode = new Map();
        equipmentsInSpace.value.forEach(item => {
            item.danegerEventList = getObjectDanegerEventsList(item.id) || [];
            if (item.danegerEventList.length && item.danegerEventList.find(val => val.status === SPACE_STATUS.UNKNOWN.id)) {
                if (item.danegerEventList.find(val => val.followMark)) {
                    item.followMark = true;
                }
                if (equipmentsInClassCode.get(item.classCode)) {
                    const obj = equipmentsInClassCode.get(item.classCode);
                    if (item.followMark) {
                        obj.followMark = true;
                    }
                    obj.danegerEventListLength += item.danegerEventList.length;
                    obj.equipments.push(item);
                } else {
                    equipmentsInClassCode.set(item.classCode, {
                        classCode: item.classCode,
                        classCodeName: item.classCodeName,
                        followMark: item.followMark || false,
                        danegerEventListLength: item.danegerEventList.length,
                        equipments: [item]
                    });
                }
            }
        });
        const arr = Array.from(equipmentsInClassCode.values());
        return orderBy(arr, ['followMark', 'danegerEventListLength'], ['desc', 'desc']);
    });

    const allFloorInfo = ref([]);
    const allEquips = ref([]);
    const allSpaceInfo = ref({});
    const allSpaceInfoWithEquipsLoading = ref(false);
    const riskAbnormalLoading = ref(false);

    const { query } = useRoute();

    const { curSpaceId, curFloorId } = query || {};

    const curSpace3DViewData = inject(curSpace3DViewDataInjectKey); // 被选中的空间对象

    const spaceViewId = computed(() => {
        const res = curSpace3DViewData?.value?.id || curSpaceId;
        return res;
    });

    const floorViewId = computed(() => {
        const res = curSpace3DViewData?.value?.floorId || curFloorId;
        return res;
    });
    const handleTreeBuildingFloorData = async () => {
        const buildFloorMap = new Map();
        const parasm = {
            projectId: base.projectId,
            isQuerySpace: false
        };
        const { data, code } = await getListTreeBuildingFloorSpace(parasm);

        if (code === SUCCESSCODE) {
            data.forEach(element => {
                buildFloorMap.set(element.id, element);
                element.floors.forEach((floor, i) => {
                    floor.order = i;
                    floor.buildingName = element.localName ?? '--';
                    buildFloorMap.set(floor.id, floor);
                });
            });
            xplantindoorenvStore().setBuildingData(data);
            xplantindoorenvStore().setBuildingFloorData(data);
        }
        return data;
    };

    const init = async () => {
        if (!spaceViewId?.value || !floorViewId?.value) {
            return;
        }

        try {
            equipClassOption.value = [];
            allSpaceInfoWithEquipsLoading.value = true;
            riskAbnormalLoading.value = true;
            console.time('loadSpaceInfoWithEquips');
            const resArr = await Promise.all([
                getSpaceInfoBySpaceId({ projectId: base.projectId, spaceIds: [spaceViewId.value] }),
                getEquipmentsBySpaceIdV2({ spaceId: spaceViewId.value }),
                // getEquipmentsBySpaceId({
                //     spaceId: spaceViewId.value,
                //     withColumns: ['major', ...EQUIP_BASE_COLUMS, ...CAMERA_COLUMS],
                //     filterControlledClassCodes: ['CFCSDR', 'CFCSFR', 'SPEGFG'],
                //     queryClassCodeName: 'true',
                //     queryOperableRunningStatus: true,
                //     queryMajorName: true
                // }),
                handleTreeBuildingFloorData()
            ]);
            // 从楼栋树数据中提取当前楼层信息
            const treeBuildingData = resArr?.[2];
            let floorLocalName = '--';
            if (Array.isArray(treeBuildingData)) {
                for (const building of treeBuildingData) {
                    const floor = building.floors?.find(f => f.id === floorViewId.value);
                    if (floor) {
                        floorLocalName = floor.localName ?? building.localName ?? '--';
                        allFloorInfo.value = [{ ...floor, buildingName: building.localName }];
                        break;
                    }
                }
            }
            const classCodeMap = {};
            if (resArr?.[0]?.code === SUCCESSCODE) {
                const resData = resArr?.[0]?.data;
                const spaceInfoItem = resData?.[0] || {};
                allSpaceInfo.value = { ...spaceInfoItem, floorLocalName };
                classCodeMap[spaceInfoItem?.classCode] = [spaceInfoItem?.id];
                spaceSelectModuleInfo.value = { ...spaceInfoItem, floorLocalName };
                spaceShowModuleInfo.value = true;
            }
            if (resArr?.[1]?.code === SUCCESSCODE) {
                const resData = resArr?.[1]?.data;
                // 过滤楼板："classCode": "CFCSFL"
                allEquips.value = resData?.filter(v => v?.classCode !== 'CFCSFL' && v?.floorId === curFloorId);

                allEquips.value.forEach(item => {
                    if (!classCodeMap[item.classCode]) {
                        classCodeMap[item.classCode] = [item.id];
                    } else {
                        classCodeMap[item.classCode].push(item.id);
                    }
                    equipmentsInSpace.value.push(item);
                    setObject2RelatedObject(spaceViewId.value, item.id);
                });
                classCode2objectIds.value = classCodeMap;
            }
            equipmentsInSpace.value = uniqBy(equipmentsInSpace.value, 'id');
            spaceSelectModuleInfo.value.equipmentsInSpace = equipmentsInSpace.value;
            const { classCodeIds, instanceIds } = iterateObjct4InstanceInfo(allEquips.value);
            instanceIds.push(spaceViewId.value);
            objectIds.value = structuredClone(instanceIds);
            // Phase 1 完成，释放 3D 场景加载
            allSpaceInfoWithEquipsLoading.value = false;
            // Phase 2: 风险+异常数据 fire-and-forget，不阻塞 3D 场景

            Promise.allSettled([
                loadDangerEventsListWithHandling({
                    runningMonitorType: RUNNING_MONITOR_TYPE,
                    objectIds: objectIds.value
                }),
                onQueryAbnormalEventList(
                    {
                        projectId: base.projectId,
                        instanceIds: objectIds.value,
                        runningMonitorType: RUNNING_MONITOR_TYPE
                    },
                    true
                )
            ]).finally(() => {
                riskAbnormalLoading.value = false;
            });
            console.timeEnd('loadSpaceInfoWithEquips');
        } catch (error) {
            console.log('loadSpaceInfoWithEquipsError', error);
            allSpaceInfoWithEquipsLoading.value = false;
        }
    };

    const getRiskListNameViewByInstance = ({ spaceId }) => {
        const allDangerListMap = new Map();
        if (spaceId) {
            const dangerEventList = getObjectDanegerEventsList(spaceId) || [];
            if (Array.isArray(dangerEventList) && dangerEventList.length) {
                dangerEventList.forEach(dangerItem => {
                    const cloneItem = structuredClone(dangerItem);
                    const instanceItem = {
                        id: spaceId,
                        key: `${spaceId}-${dangerItem.dangerEventId}`,
                        localName: spaceSelectModuleInfo?.value?.localName,
                        isSpace: true,
                        dangerItem: cloneItem,
                        followMark: cloneItem?.followMark
                    };
                    allDangerListMap.set(dangerItem.dangerEventId, {
                        dangerEventId: dangerItem.dangerEventId,
                        dangerEventName: dangerItem?.name ?? '--',
                        dangerItem: cloneItem,
                        followMark: cloneItem?.followMark,
                        instances: [instanceItem]
                    });
                });
            }
        }
        equipmentsInSpace.value.forEach(item => {
            const filterCondition = spaceId ? getRelatedObjects(spaceId)?.includes(item.id) : true;
            if (filterCondition) {
                const dangerEventList = getObjectDanegerEventsList(item.id) || [];
                if (Array.isArray(dangerEventList) && dangerEventList.length) {
                    dangerEventList.forEach(dangerItem => {
                        const cloneItem = structuredClone(dangerItem);
                        cloneItem.equipCriticalLevel = item.equipCriticalLevel;
                        cloneItem.equipLocalName = item.localName;
                        if (allDangerListMap.get(dangerItem.dangerEventId)) {
                            const obj = allDangerListMap.get(dangerItem.dangerEventId);
                            const instanceItem = {
                                id: item.id,
                                key: `${item.id}-${dangerItem.dangerEventId}`,
                                localName: item?.localName,
                                dangerItem: cloneItem,
                                followMark: cloneItem?.followMark
                            };
                            obj.instances.push(instanceItem);
                        } else {
                            const instanceItem = {
                                id: item.id,
                                key: `${item.id}-${dangerItem.dangerEventId}`,
                                localName: item?.localName,
                                dangerItem: cloneItem,
                                followMark: cloneItem?.followMark
                            };
                            allDangerListMap.set(dangerItem.dangerEventId, {
                                dangerEventId: dangerItem.dangerEventId,
                                dangerEventName: dangerItem?.name ?? '--',
                                dangerItem: cloneItem,
                                followMark: cloneItem?.followMark,
                                instances: [instanceItem]
                            });
                        }
                    });
                }
            }
        });
        const arr = Array.from(allDangerListMap.values());
        const tempArr = arr.toSorted((a, b) => {
            return sortDangerEventByStatus(a.dangerItem, b.dangerItem);
        });
        const groupArr = [...new Set(tempArr.map(v => v?.dangerEventId))];
        const final = groupArr.map(key => {
            return allDangerListMap.get(key);
        });

        return final;
    };

    const getRiskListByInstance = ({ spaceId, equipId, filterStatusId }) => {
        const riskListMap = new Map();
        const spaceDangerEventList = [];
        const spaceArr = [];
        if (spaceId) {
            const cloneItem = structuredClone(spaceSelectModuleInfo?.value || {});
            cloneItem.danegerEventList = (getObjectDanegerEventsList(spaceId) || []).toSorted(sortDangerEventByTagAndName);

            const list = filterStatusId ? cloneItem.danegerEventList.filter(v => v.status === filterStatusId) : cloneItem.danegerEventList;
            cloneItem.danegerEventList = list;

            if (list.length) {
                spaceDangerEventList.push(...list);
                // TODO 排序
                spaceArr.push(cloneItem);
            }
        }

        spaceDangerEventList.length &&
            riskListMap.set(GeneralZone, {
                classCode: GeneralZone,
                classCodeName: i18n.global.t('common.space'),
                isSpace: true,
                followMark: spaceDangerEventList.find(val => val.followMark) ? true : false,
                danegerEventListLength: spaceDangerEventList.length,
                equipments: spaceArr
            });

        equipmentsInSpace.value.forEach(item => {
            const filterCondition = spaceId ? getRelatedObjects(spaceId)?.includes(item.id) : equipId ? item.id === equipId : true;
            if (filterCondition) {
                const cloneItem = structuredClone({ ...item });
                cloneItem.danegerEventList = (getObjectDanegerEventsList(item.id) || []).toSorted(sortDangerEventByTagAndName);
                cloneItem.danegerEventList = filterStatusId ? cloneItem.danegerEventList.filter(v => v.status === filterStatusId) : cloneItem.danegerEventList;
                if (cloneItem.danegerEventList.length) {
                    if (cloneItem.danegerEventList.find(val => val.followMark)) {
                        cloneItem.followMark = true;
                    }
                    if (riskListMap.get(item.classCode)) {
                        const obj = riskListMap.get(item.classCode);
                        if (cloneItem.followMark) {
                            obj.followMark = true;
                        }
                        obj.danegerEventListLength += cloneItem.danegerEventList.length;
                        obj.equipments.push(cloneItem);
                    } else {
                        // TODO 排序
                        riskListMap.set(item.classCode, {
                            classCode: item.classCode,
                            classCodeName: item.classCodeName ?? '--',
                            followMark: cloneItem.followMark || false,
                            danegerEventListLength: cloneItem.danegerEventList.length,
                            equipments: [cloneItem]
                        });
                    }
                }
            }
        });
        const arr = Array.from(riskListMap.values());
        return arr;
    };

    watchEffect(() => {
        spaceAbnormalDetailWithList.value.abnormalEventListLoading = abnormalEventListLoading.value;
        if (spaceViewId.value) {
            spaceAbnormalDetailWithList.value.abnormalEventList = getAbnormalEventsList([spaceViewId.value]);
        }
    });

    onMounted(() => {
        setAbnormalEventStrategy(AbnormalEventStrategy.Related);
        init();
    });
    onBeforeUnmount(() => {
        setAbnormalEventStrategy(AbnormalEventStrategy.Single);
    });
    provide(equipmentsWithStatusKey, equipmentsWithStatus);
    provide(space3DViewSSEClientInjectKey, sseClient);
    provide(allFloorInfoInjectKey, allFloorInfo);
    provide(allEquipsInjectKey, allEquips);
    provide(allSpaceInfoInjectKey, allSpaceInfo);
    provide(allSpaceInfoWithEquipsLoadingInjectKey, allSpaceInfoWithEquipsLoading);
    provide(riskAbnormalLoadingInjectKey, riskAbnormalLoading);
    provide(runningMonitorTypeInjectKey, runningMonitorType);
    provide(switchIotHideInjectKey, switchIotHide);
    provide(selEquipIdsInjectKey, selEquipIds);
    provide(equipClassOptionInjectKey, equipClassOption);
    provide(getRiskListByInstanceKey, getRiskListByInstance);
    provide(getRiskListNameViewByInstanceKey, getRiskListNameViewByInstance);
    provide(spaceAbnormalDetailWithListKey, spaceAbnormalDetailWithList);

    return {
        allEquips,
        equipmentsWithStatus,
        allSpaceInfoWithEquipsLoading,
        riskAbnormalLoading,
        allSpaceInfo,
        sseClient,
        switchIotHideModel,
        spaceOnlyActMagRiskModel,
        equipClassOption,
        selEquipIds,
        getRiskListByInstance,
        getRiskListNameViewByInstance,
        runningMonitorType
    };
};
