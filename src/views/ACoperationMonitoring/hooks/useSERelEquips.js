import i18n from '@/localization';
import { listObjectsByTackValueLogic } from '@/apis/public';
import { batchQueryInfoCode } from '@/apis/monitor';
import DockSingleton from '@/hooks/responsiveDock';
import UseCancelTokenHooks from '@/hooks/UseCancelTokenHooks';
import { SUCCESSCODE } from '@/utils/globalVariables';
import baseStore from '@/store/baseStore';
import xplantindoorenvStore from '@/store/xplantindoorenv';
import { additionalFloorInfo } from '@/apm-3d/utils/buildingTools';
import _ from 'lodash';
import { idMapInfoCodesKey } from '@/views/Common/RelatedRelationships/useRelationships';
import { CLOUD_IOT_DATA_CHANGE, IOT_DATA_CHANGE } from '@/utils/SSEEventTypes';
import useSinglePOSTSSEClient from '@/components/hooks/useSinglePOSTSSEClient';
import useResponsiveDockSSEHandle from '@/components/hooks/useResponsiveDockSSEHandle';

const TARGET_CLASSCODE = 'SETDCP';
const SUBSCRIBETYPE = 'SE';
export default props => {
    let sysViewBatchQueryController = null;

    const { setIotData } = DockSingleton.getInstance();
    const staticUseCancelToken = UseCancelTokenHooks();
    const groupObjs = ref();
    const idMapInfoCodes = ref({});
    const loading = ref(false);

    const floorIdCache = {};

    const groupList = computed(() => {
        const buildingList = xplantindoorenvStore().buildingData;
        if (buildingList?.length > 1) {
            return groupObjs.value?.map(group => {
                const buildingIdMap = {};
                const objList = group.list || [];
                objList?.forEach(obj => {
                    obj.floorId = obj.inFloor?.id;
                    additionalFloorInfo(obj, floorIdCache);
                    if (!buildingIdMap[obj.buildingId]) {
                        buildingIdMap[obj.buildingId] = {
                            id: obj.buildingId,
                            name: obj.buildingLocalName,
                            open: true,
                            children: []
                        };
                    }
                    // obj.infoCodes = flatInfoCodes(obj.relInfoCodeGroupConfigs);
                    buildingIdMap[obj.buildingId].children.push(obj);
                });
                const buildObjs = [];
                // const buildObjs = Object.values(buildingIdMap);
                buildingList.forEach(building => {
                    const buildObj = buildingIdMap[building.id];
                    if (buildObj) {
                        buildObjs.push(buildObj);
                    }
                });
                buildObjs.forEach(obj => {
                    obj.children = obj.children.sort((a, b) => b.floorSequenceId - a.floorSequenceId);
                });
                group.children = buildObjs;
                group.childType = 'building';
                group.open = true;
                return group;
            });
        } else {
            return groupObjs.value?.map(group => {
                const objList = group.list || [];
                objList?.forEach(obj => {
                    obj.floorId = obj.inFloor?.id;
                    additionalFloorInfo(obj, floorIdCache);
                    // obj.infoCodes = flatInfoCodes(obj.relInfoCodeGroupConfigs);
                    obj.name = obj.localName;
                });
                group.children = objList.sort((a, b) => a.floorSequenceId - b.floorSequenceId);
                group.open = true;
                return group;
            });
        }
    });

    // sse 订阅
    const sseEventTypes = [IOT_DATA_CHANGE, CLOUD_IOT_DATA_CHANGE];
    const { sseClient, setSSEClientOption } = useSinglePOSTSSEClient(SUBSCRIBETYPE);
    const setLeftSysChartIOTSSEClientOption = (claasCode2objectIds, objectIdAndInfoCodes) => {
        const eventParamMap = {
            CLOUD_IOT_DATA_CHANGE: {
                templateTypes: ['CUSTOM_IOT'],
                objectIdAndInfoCodes
            }
        };
        setSSEClientOption({
            subscribeType: SUBSCRIBETYPE,
            instanceId: baseStore().projectId,
            instanceType: 'PROJECT',
            eventType: sseEventTypes,
            eventParamMap,
            claasCode2objectIds
        });
    };
    const closeSSEClient = () => {
        sseClient.setOptions();
    };

    useResponsiveDockSSEHandle(sseClient, sseEventTypes);

    const loadIotData = async equips => {
        if (!equips?.length) {
            return;
        }
        sysViewBatchQueryController?.abort();
        sysViewBatchQueryController = new AbortController();
        const objects = equips.map(obj => {
            return {
                objectId: obj.id,
                classCode: obj.classCode,
                infoCodes: [
                    'temperature' // 温度
                ]
            };
        });
        const params = {
            projectId: baseStore().projectId,
            queryInfoCodeRule: true,
            queryInfoCodeDefine: true,
            object: objects
        };
        const { code, data } = await batchQueryInfoCode(params, sysViewBatchQueryController.signal);
        if (code === SUCCESSCODE && data) {
            const idMap = {};
            data.forEach(obj => {
                setIotData(obj.objectId, obj.infoCode, obj);
                idMap[obj.objectId] = [obj];
            });

            idMapInfoCodes.value = idMap;
        }
    };
    const loadStaticObjs = async () => {
        staticUseCancelToken.cancelQuest();
        const mainId = props.selectObj?.id;
        if (!mainId) {
            return;
        }
        loading.value = true;
        const params = {
            takeValueLogic: {
                queryInFloor: true,
                queryInBuilding: true,
                queryParam: {
                    classCode: TARGET_CLASSCODE,
                    monitoringSurveillanceStatus: ['2', '3'],
                    relationTo: {
                        graphCode: 'MechSubset',
                        relCode: 'Eq2Eq',
                        objFrom: [mainId]
                    },
                    withColumns: ['id', 'localName', 'classCode', 'objType', 'relObjIds']
                }
            }
        };
        try {
            const { code, data } = await listObjectsByTackValueLogic(params, { cancelToken: staticUseCancelToken.cancelToken() });
            // console.log('data: ', data);
            if (code === SUCCESSCODE && data?.length > 0) {
                const equips = _.uniqBy(data, 'id');
                // const ids = equips.map(obj => obj.id);

                groupObjs.value = [
                    {
                        groupName: i18n.global.t('meos_control_web.capacitor'),
                        list: equips
                    }
                ];

                loadIotData(equips);
            } else {
                groupObjs.value = [];
            }
        } catch (e) {
            console.log('e: ', e);
        } finally {
            loading.value = false;
        }
    };

    watch(
        () => props.selectObj,
        () => {
            idMapInfoCodes.value = {};
            staticUseCancelToken.cancelQuest();
            sysViewBatchQueryController?.abort();
            if (props.selectObj?.id) {
                loadStaticObjs();
            }
        },
        { immediate: true }
    );
    watch(idMapInfoCodes, () => {
        if (idMapInfoCodes.value && !_.isEmpty(idMapInfoCodes.value)) {
            const ids = Object.keys(idMapInfoCodes.value) || [];
            const classCodeMapIds = {
                [TARGET_CLASSCODE]: ids
            };
            const idInfoCodes = {};
            ids.forEach(id => {
                idInfoCodes[id] = ['temperature'];
            });
            setLeftSysChartIOTSSEClientOption(classCodeMapIds, idInfoCodes);
        } else {
            closeSSEClient();
        }
    });

    provide(idMapInfoCodesKey, idMapInfoCodes);
    return { groupList, idMapInfoCodes, loading };
};
