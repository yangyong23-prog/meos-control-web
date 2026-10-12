import { useSpaceScopeDataAccess } from './useSpaceScopeDataAccess';
import { useSpaceWhitelistMerge } from './useSpaceWhitelistMerge';

export const useAirTerminalSpaceScope = () => {
    const dataAccess = useSpaceScopeDataAccess();
    const whitelistMerge = useSpaceWhitelistMerge({
        buildingFloorSpaceList: dataAccess.buildingFloorSpaceList,
        whitelistSpaceIds: dataAccess.whitelistSpaceIds,
        spaceTreeData: dataAccess.spaceTreeData,
        loadFilteredSpaceTree: dataAccess.loadFilteredSpaceTree,
        querySpacesByIotRules: dataAccess.querySpacesByIotRules,
        mapIotRecordsToSpaceRows: dataAccess.mapIotRecordsToSpaceRows,
        mapTreeNodesToSpaceRows: dataAccess.mapTreeNodesToSpaceRows,
        fetchDynamicIOTData: dataAccess.fetchDynamicIOTData,
        sortSpacesByLocation: dataAccess.sortSpacesByLocation
    });

    return {
        referencedSpaceList: dataAccess.referencedSpaceList,
        buildingFloorSpaceList: dataAccess.buildingFloorSpaceList,
        spaceListLoading: dataAccess.spaceListLoading,
        spaceTreeLoading: dataAccess.spaceTreeLoading,
        spaceTreeData: dataAccess.spaceTreeData,
        initSpaceScopeData: dataAccess.initSpaceScopeData,
        setLastSavedWhiteList: dataAccess.setLastSavedWhiteList,

        whitelistSpaceIds: whitelistMerge.whitelistSpaceIds,
        checkedSpaceIds: whitelistMerge.checkedSpaceIds,
        tableResetKey: whitelistMerge.tableResetKey,
        showAddByIotModal: whitelistMerge.showAddByIotModal,
        iotConditionOptions: whitelistMerge.iotConditionOptions,
        iotSelectedConditions: whitelistMerge.iotSelectedConditions,
        addByIotLoading: whitelistMerge.addByIotLoading,
        showIotLoading: whitelistMerge.showIotLoading,
        showAddBySpaceMapModal: whitelistMerge.showAddBySpaceMapModal,
        beforeConfirmCallback: whitelistMerge.beforeConfirmCallback,
        handleCheckedChange: whitelistMerge.handleCheckedChange,
        handleRemoveSpace: whitelistMerge.handleRemoveSpace,
        handleRemoveSelected: whitelistMerge.handleRemoveSelected,
        openAddBySpaceMapModal: whitelistMerge.openAddBySpaceMapModal,
        openAddByIotModal: whitelistMerge.openAddByIotModal,
        closeAddByIotModal: whitelistMerge.closeAddByIotModal,
        confirmAddByIot: whitelistMerge.confirmAddByIot,
        confirmAddBySpaceMap: whitelistMerge.confirmAddBySpaceMap,
        confirmClearAll: whitelistMerge.confirmClearAll
    };
};
