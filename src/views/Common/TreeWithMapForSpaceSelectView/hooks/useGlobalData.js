// @ts-ignore
import i18n from '@/localization';
export const buildingFloorSpaceIdsMapKey = Symbol('buildingFloorSpaceIdsMapKey');
export const selectedFloorIdKey = Symbol('selectedFloorIdKey');
export const selectedSpacesKey = Symbol('selectedSpacesKey');

export const treeSearchKeywordKey = Symbol('treeSearchKeywordKey');
export const filterStringKey = Symbol('filterStringKey');
export const onlyLookSelectedKey = Symbol('onlyLookSelectedKey');
export const updateFilterStringKey = Symbol('updateFilterStringKey');

export default props => {
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
    const selectedCount = computed(() => selectedSpaces.value?.length);

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
        if (Array.isArray(props.treeData)) {
            console.log(props.treeData);

            props.treeData?.forEach(item => {
                handleTreeIdMap(item, objMap);
            });
        }
        return objMap;
    });

    // 选中默认的空间节点
    watch(
        [() => props.treeData, () => props.defaultSelected],
        ([newTree, newSelect]) => {
            if (newTree?.length) {
                nextTick(() => {
                    selectedSpaces.value = newSelect;
                });
            }
        },
        { immediate: true }
    );

    // 更新树节点过滤关键字
    const updateFilterString = () => {
        if (onlyLookSelected.value === 'uncheck') {
            filterString.value = keyword.value;
        } else {
            if (selectedSpaces?.value?.length) {
                const timeString = new Date().toISOString();
                const finalString = `${keyword?.value}~onlyLook~searchWithSelected~${timeString}`;
                filterString.value = finalString;
            } else {
                filterString.value = `${keyword?.value}~onlyLook`;
            }
        }
    };

    const clearCheckedAndKeyword = () => {
        onlyLookSelected.value = 'uncheck';
        keyword.value = '';
    };

    provide(buildingFloorSpaceIdsMapKey, buildingFloorSpaceIdsMap);
    provide(selectedFloorIdKey, selectedFloorId);
    provide(selectedSpacesKey, selectedSpaces);

    provide(treeSearchKeywordKey, keyword);
    provide(filterStringKey, filterString);
    provide(onlyLookSelectedKey, onlyLookSelected);
    provide(updateFilterStringKey, updateFilterString);

    return {
        onlyLookSelected,
        selectedCount,
        selectedFloorId,
        selectedSpaces,
        buildingFloorSpaceIdsMap,
        clearCheckedAndKeyword
    };
};
