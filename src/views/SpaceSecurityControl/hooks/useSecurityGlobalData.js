// @ts-ignore
import i18n from '@/localization';
import { CONTROL_BAR_TAB_KEYS } from '../constants/index';
import { screenConfig } from '@/apis/SpaceSecurityControl';
import { currentModelInjectKey } from '../constants/injectKey';
import useSecurityStaticData from './useSecurityStaticData';
import DockSingleton from '@/hooks/responsiveDock';

export const allMapDataLoadedInjectKey = Symbol('allMapDataLoaded');

export default () => {
    const currentTab = ref(); // 当前选中的tab

    const currentBuidingList = ref([]); // 当前建筑数量
    const currentBuildingObj = ref({}); // 当前建筑对象
    const buildingSpaceTree = ref([]); // 建筑楼层空间数
    const onlyShowControlledEquipment = ref(false); // 仅看可控设备
    const screenConfigList = ref([]); // 设备展示树列表
    const filterEquipmentClass = ref(); // 安防设备筛选
    const equipFilterTreeData = ref(); // 安防设备筛选下拉树数据

    const currentModel = ref('list');

    const buildFloorMapRef = ref();

    const allMapDataLoaded = ref(false);
    provide(allMapDataLoadedInjectKey, allMapDataLoaded);

    const { getObjectAbnormalStatus } = DockSingleton.getInstance();

    const { currentFloorObj, tabsOptions, staticSpaces, staticEquips, staticObjectIds, classCodeObjectIdsMap } = useSecurityStaticData();

    const queryScreenConfig = async () => {
        screenConfigList.value = [];
        const res = await screenConfig({});
        if (res.result === 'success') {
            screenConfigList.value = res.data || [];
        }
    };

    const clickMapObj = obj => {
        buildFloorMapRef.value?.clickMapObj(obj);
    };

    // 当前项目中的设备-过滤后的
    const equipFilterFn = equipData => {
        const isFloorMap = !!currentFloorObj.value?.id;

        let filterHide = false;
        if (currentTab.value === CONTROL_BAR_TAB_KEYS.ABNORMAL) {
            // filterHide = !equipData?.equipIsAbnormal;
            filterHide = !getObjectAbnormalStatus(equipData?.id);
        } else {
            filterHide = !isFloorMap;
        }
        if (isFloorMap) {
            // 楼层视角：过滤展示部分设备类型的设备、当前楼层的设备、仅可控筛选下的可控状态设备
            if (!filterHide && filterEquipmentClass.value?.length > 0) {
                filterHide = !filterEquipmentClass.value.some(obj => {
                    return obj.classCode === equipData.classCode && (!obj.condition || (obj.condition && equipData[obj.condition] === obj.conditionValue));
                });
            }

            if (!filterHide && onlyShowControlledEquipment.value) {
                filterHide = !equipData?.isControl;
            }
        }

        return !filterHide;
    };

    // 当前项目中的空间-过滤后的
    const spaceFilterFn = spaceData => {
        let filterHide = false;

        if (!filterHide) {
            if (currentTab.value === CONTROL_BAR_TAB_KEYS.ABNORMAL) {
                // filterHide = !spaceData?.spaceIsAbnormal;
                filterHide = !getObjectAbnormalStatus(spaceData?.id);
            } else if (currentTab.value === CONTROL_BAR_TAB_KEYS.DEPLOYMENTSTATUS) {
                filterHide = !spaceData?.isFromDeployment;
            } else if (currentTab.value === CONTROL_BAR_TAB_KEYS.ACCESSDEMAND) {
                filterHide = !spaceData?.isFromAccess;
            }
        }
        return !filterHide;
    };
    provide('currentBuildingObj', currentBuildingObj);
    provide('currentBuidingList', currentBuidingList);

    provide('currentTab', currentTab);
    provide('buildingSpaceTree', buildingSpaceTree);
    provide('onlyShowControlledEquipment', onlyShowControlledEquipment);
    provide('filterEquipmentClass', filterEquipmentClass);
    provide('screenConfigList', screenConfigList);
    provide('equipFilterTreeData', equipFilterTreeData);
    provide('equipFilterFn', equipFilterFn);
    provide('spaceFilterFn', spaceFilterFn);
    provide('clickMapObj', clickMapObj);

    provide(currentModelInjectKey, currentModel);

    watch(tabsOptions, newVal => {
        if (newVal?.length > 0) {
            const hasPreTab = currentTab?.value;
            const hasSelectedPreTab = hasPreTab && newVal.some(obj => obj.id === hasPreTab);
            if (!hasSelectedPreTab) {
                currentTab.value = newVal[0].id;
            }
        }
    });
    onMounted(() => {
        queryScreenConfig();
    });

    onUnmounted(() => {
        currentBuildingObj.value = null;
        currentBuidingList.value = null;
        buildingSpaceTree.value = null;
        filterEquipmentClass.value = null;
        screenConfigList.value = null;
        equipFilterTreeData.value = null;
        buildFloorMapRef.value = null;
    });
    return {
        staticObjectIds,
        staticSpaces,
        staticEquips,
        classCodeObjectIdsMap,
        tabsOptions,
        currentTab,
        currentFloorObj,
        currentBuildingObj,
        buildFloorMapRef,
        clickMapObj,
        currentModel,
        allMapDataLoaded
    };
};
