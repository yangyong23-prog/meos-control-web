// @ts-ignore
import i18n from '@/localization';
export const buildingFloorSpaceIdsMapKey = Symbol('buildingFloorSpaceIdsMapKey');
export const selectedFloorIdKey = Symbol('selectedFloorIdKey');
export const selectedSpacesKey = Symbol('selectedSpacesKey');

export const treeSearchKeywordKey = Symbol('treeSearchKeywordKey');
export const filterStringKey = Symbol('filterStringKey');
export const onlyLookSelectedKey = Symbol('onlyLookSelectedKey');
export const updateFilterStringKey = Symbol('updateFilterStringKey');
export const treeFilterValuesKey = Symbol('treeFilterValuesKey');

export default (props, treeData, defaultSelectedSpace) => {
    // 树搜索关键字
    const keyword = ref('');
    // 树过滤关键字
    const filterString = ref('');

    // 仅看已选
    const onlyLookSelected = ref('uncheck');

    // 默认会选中最上层的楼层并展开，楼层按照从高到低的顺序
    const selectedFloorId = ref('');
    // 选中空间
    const selectedSpaces = ref([]);
    const selectedCount = computed(() => selectedSpaces.value.length);

    const handleTreeIdMap = (data, map) => {
        if (data?.id) {
            map.set(data.id, data);
        }
        if (data?.children?.length) {
            data.children.forEach(item => {
                handleTreeIdMap(item, map);
            });
        }
    };

    // 全局建筑、楼层、空间id与数据对应关系
    const buildingFloorSpaceIdsMap = computed(() => {
        const objMap = new Map();
        if (Array.isArray(treeData?.value)) {
            console.log(treeData.value);

            treeData?.value?.forEach(item => {
                handleTreeIdMap(item, objMap);
            });
        }
        return objMap;
    });

    // 选中默认的空间节点
    watch([() => treeData?.value, () => defaultSelectedSpace?.value], ([newTree, newSelect]) => {
        if (newTree?.length) {
            nextTick(() => {
                selectedSpaces.value = newSelect;
            });
        }
    });

    const treeFilterValues = computed(() => {
        const filterObj = {};
        props.treeFiltersMap.forEach((value, key) => {
            filterObj[key] = { key, value: value?.filterVal, isEmpty: value?.isEmpty };
        });
        return filterObj;
    });

    // 更新树节点过滤关键字
    const updateFilterString = () => {
        const filterObject = { searchKeyword: keyword.value, isLookAtSelected: false, searchWithSelectedTime: '', treeFiltersObject: treeFilterValues.value };
        if (onlyLookSelected.value === 'uncheck') {
            filterObject.isLookAtSelected = false;
        } else {
            filterObject.isLookAtSelected = true;
            if (selectedSpaces?.value?.length) {
                const timeString = new Date().toISOString();
                filterObject.searchWithSelectedTime = timeString;
            }
        }
        filterString.value = JSON.stringify(filterObject);
    };

    const clearCheckedAndKeyword = (resetDefaultSelected = false) => {
        onlyLookSelected.value = 'uncheck';
        keyword.value = '';
        if (resetDefaultSelected) {
            selectedSpaces.value = defaultSelectedSpace?.value ?? [];
        }
    };

    provide(buildingFloorSpaceIdsMapKey, buildingFloorSpaceIdsMap);
    provide(selectedFloorIdKey, selectedFloorId);
    provide(selectedSpacesKey, selectedSpaces);

    provide(treeSearchKeywordKey, keyword);
    provide(filterStringKey, filterString);
    provide(onlyLookSelectedKey, onlyLookSelected);
    provide(updateFilterStringKey, updateFilterString);
    provide(treeFilterValuesKey, treeFilterValues);

    return {
        onlyLookSelected,
        selectedCount,
        selectedFloorId,
        selectedSpaces,
        buildingFloorSpaceIdsMap,
        clearCheckedAndKeyword
    };
};
