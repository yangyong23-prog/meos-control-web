// 是否是楼板的group
export const isFloor = group => group.name.trim().toLowerCase().endsWith('mainbuilding_floor_1') || group.name.trim().toLowerCase().endsWith('mainbuilding_board_1');

// 是否是侧板的group
// export const isFloorFrame = (group) => group.name.trim().endsWith('MainBuilding_FloorWireframe_1');
export const isFloorFrame = group => group.name.trim().toLowerCase().indexOf('wireframe') > -1;

// 解析 楼板模型 name 中所携带的信息
export const parseMainBuildingBoardInfo = name => {
    const info = name.split('_');
    return {
        floorName: info[info.length - 1]
    };
};

// 解析 侧板 模型 name 所携带的信息
export const parseMainBuildingCubeInfo = name => {
    const info = name.split('_');
    return {
        projectId: info[0],
        buildingId: info[1],
        floorName: info[info.length - 1]
    };
};
