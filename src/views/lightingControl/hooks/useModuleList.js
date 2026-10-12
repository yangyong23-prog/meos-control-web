// @ts-ignore
import i18n from '@/localization';
import { treeBuildingFloorRoomFuncTypeSpace } from '@/apis/lightingControl';

export default () => {
    const treeData = ref([]);
    // 定义常量
    const TYPE_BUILDING = 'BUILDING';
    const TYPE_FLOOR = 'FLOOR';
    const TYPE_SPACE = 'SPACE';

    // 映射表
    const typeMapping = {
        Bd: TYPE_BUILDING,
        Fl: TYPE_FLOOR,
        Sp: TYPE_SPACE
    };
    const queryTreeBuildingFloorRoomFuncTypeSpace = async () => {
        const res = await treeBuildingFloorRoomFuncTypeSpace();
        const { data, result } = res;
        if (result === 'success' && data?.length) {
            treeData.value = data;
            handelTree(treeData.value, 'children', (item, parent) => {
                item.id = item.id || item.code;
                item.name = (item.name || item.localName) ?? '--';
                item.children = item.floors || item.roomFuncTypes || item.spaces;
                if (item.id && item.id.length >= 2) {
                    const prefix = item.id.substring(0, 2);
                    item.type = typeMapping[prefix] || '';
                } else {
                    item.type = '';
                }
            });
        } else {
            treeData.value = [];
        }
        console.log('res', treeData.value);
    };
    function handelTree(list = [], key, cb) {
        (function fn(list = [], parent) {
            list.forEach(item => {
                cb(item, parent);
                if (Array.isArray(item[key]) && item[key].length) fn(item[key], item);
            });
        })(list);
    }
    queryTreeBuildingFloorRoomFuncTypeSpace();
    provide('BuildingFloorRoomFuncTypeSpaceTreeData', treeData);
};
