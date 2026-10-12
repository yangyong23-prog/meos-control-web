import i18n from '@/localization';
import { dashboardDataKey, currentFloorObjInjectKey, selectModuleInfoInjectKey, clickAssembleFucKey, statisticsSelectKey, abnormalTypeFilteringKey } from './useCommonConfig';
export default () => {
    const dashboardData = inject(dashboardDataKey);
    const currentFloorObj = inject(currentFloorObjInjectKey);
    const selectModuleInfo = inject(selectModuleInfoInjectKey);
    const clickAssembleFuc = inject(clickAssembleFucKey);
    const statisticsSelect = inject(statisticsSelectKey);
    const abnormalTypeFiltering = inject(abnormalTypeFilteringKey);
    const spaceItemColumn = inject('spaceItemColumn');
    const collapseData = ref([]);
    const toFloorMap = (parent, item) => {
        currentFloorObj.value = {
            ...item,
            buildingLocalName: parent.buildingName,
            id: item.floorId
        };
        console.log('currentFloorObj.value :>> ', currentFloorObj.value);
    };
    const formatNumber = value => {
        return value?.toLocaleString();
    };
    const openSidebar = (item, name, type) => {
        selectModuleInfo.value = {
            localName: item.floorName ? item.floorName : item.buildingName,
            name: name,
            dataList: clickAssembleFuc(item.floorId ? 'floorId' : 'buildingId', item.floorId || item.buildingId, type)
        };
    };

    // 判断当前项是否被选中
    const isItemSelected = computed(() => {
        return (item, name) => selectModuleInfo.value?.localName === item && selectModuleInfo.value?.name === name;
    });

    watchEffect(() => {
        collapseData.value = dashboardData.value.map(item => item.buildingId);
    });
    return {
        collapseData,
        statisticsSelect,
        spaceItemColumn,
        dashboardData,
        abnormalTypeFiltering,
        isItemSelected,
        openSidebar,
        formatNumber,
        toFloorMap
    };
};
