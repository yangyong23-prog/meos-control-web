// @ts-ignore
import i18n from '@/localization';
import {
    floorViewInjectKey,
    spacePassengerFlowDataInjectKey,
    selectModuleInfoInjectKey,
    showModuleInfoInjectKey,
    openDetailDrawerInjectKey,
    closeDetailDrawerInjectKey,
    currentFloorObjInjectKey,
    doorsGroupDataListInjectKey,
    doorsGroupDataLoadingInjectKey,
    currentBuildingObjInjectKey,
    currentBuidingNumInjectKey
} from '../constant/injectKey';
import { listBuildingAndSpaceByProjectIdGroupFloor } from '@/apis/PassengerFlowStatistics';
import { getPassengerFlowHeadCountData } from '@/apis/PassengerFlowStatistics';
import { getFloorInfoByFloorId } from '@/utils/buildingUtils';
import useStore from '@/store';
import { GRID, PASSENGER_FLOW, OBJ_TYPE } from '@/utils/globalVariables';
// import floorSpaces from './mock.json';

// 全局注入ref
export default () => {
    const { base } = useStore();
    const { projectId, groupCode } = base || {};
    const currentFloorObj = ref(null);
    const currentBuildingObj = ref(null);
    const currentBuidingNum = ref(1);
    // currentFloorObj.value = {
    //     floorId: 'Fl61011220107ca564431e4e4b6c8b1dfb9b2740d88a'
    // };
    const floorView = computed(() => {
        return !!currentFloorObj?.value?.floorId;
    });

    const showModuleInfo = ref(false);
    const selectModuleInfo = ref(null);
    const flowLoading = ref(false);

    const openDetailDrawer = obj => {
        showModuleInfo.value = true;
        if (obj) {
            let floorLocalName = obj.floorLocalId;
            if (!floorLocalName && obj.floorId) {
                const floor = getFloorInfoByFloorId(obj.floorId);
                floorLocalName = floor?.localId;
            }

            const data = {
                ...obj,
                id: obj.id,
                localName: obj.localName ?? '--',
                floorLocalName,
                spaceId: obj.objType === OBJ_TYPE.SPACE ? obj.id : '',
                type: obj.objType
            };
            selectModuleInfo.value = data;
        }
    };

    const closeDetailDrawer = () => {
        showModuleInfo.value = false;
        selectModuleInfo.value = null;
    };

    // 门组统计信息
    const doorsGroupDataList = ref([]);
    const doorsDataLoading = ref(false);
    const queryDoorGroupData = async () => {
        doorsDataLoading.value = true;
        const res = await getPassengerFlowHeadCountData({ projectId: projectId, groupCode: groupCode }).finally(() => {
            doorsDataLoading.value = false;
        });
        if (res?.code === '00000') {
            const resData = res?.data;
            if (Array.isArray(resData)) {
                // 全部排序到前面
                doorsGroupDataList.value = resData?.toSorted((a, b) => (a?.objectId === 'all' || b?.objectId === 'all' ? -1 : 0));
            }
        }
    };

    // 空间客流统计数组
    const spacePassengerFlowData = ref([]);
    const queryListBuildingAndSpaceByProjectIdGroupFloor = async () => {
        spacePassengerFlowData.value = [];
        flowLoading.value = true;
        const response = await listBuildingAndSpaceByProjectIdGroupFloor({
            runningMonitorSecondType: PASSENGER_FLOW,
            templateCode: GRID
        }).finally(() => {
            flowLoading.value = false;
        });
        if (response.code === '00000') {
            const buildings = response.data?.buildings || [];
            buildings?.forEach(building => {
                building?.floors?.forEach(floor => {
                    floor.buildingId = building.buildingId;
                    floor.spaces.forEach(space => {
                        space.hoverFloor = false;
                        space.floorLocalId = floor.floorLocalId;
                        space.floorLocalName = floor.floorLocalName;
                    });
                });
            });
            spacePassengerFlowData.value = buildings;
        }
    };

    queryListBuildingAndSpaceByProjectIdGroupFloor();
    queryDoorGroupData();

    provide(currentFloorObjInjectKey, currentFloorObj);
    provide(currentBuildingObjInjectKey, currentBuildingObj);
    provide(currentBuidingNumInjectKey, currentBuidingNum);
    provide(floorViewInjectKey, floorView);
    provide(showModuleInfoInjectKey, showModuleInfo);
    provide(selectModuleInfoInjectKey, selectModuleInfo);
    provide(spacePassengerFlowDataInjectKey, spacePassengerFlowData);
    provide(openDetailDrawerInjectKey, openDetailDrawer);
    provide(closeDetailDrawerInjectKey, closeDetailDrawer);
    provide(doorsGroupDataListInjectKey, doorsGroupDataList);
    provide(doorsGroupDataLoadingInjectKey, doorsDataLoading);

    return {
        currentFloorObj,
        floorView,
        spacePassengerFlowData,
        flowLoading,
        showModuleInfo,
        selectModuleInfo,
        closeDetailDrawer
    };
};
