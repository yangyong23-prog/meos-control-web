// const spaceMap = () => import('ServiceSpace/SpaceMap.vue'),
const dealWithPath = path => {
    if (path[0] === '/') {
        return path.slice(1, path.length);
    }
    return path;
};

/**
 *
 * 动态生成地图路由
 * @param {*} fromRoute // 从哪个路由跳转过来
 * @returns
 */

// // 资产地图 (设备地图 + 场景地图)
// export const getAssetsMap = (fromRoute = '', blankRoute = true) => ({
//     path: `${fromRoute}/assetsMap`,
//     name: 'assetsMap',
//     component: assetsMap,
//     meta: {
//         title: 'assetsMap',
//         formRoute: dealWithPath(fromRoute),
//         blankRoute // 标记不是新开页面路由
//     }
// });

// 空间地图
// export const getSpaceMap = (fromRoute = '', blankRoute = true) => ({
//     path: `${fromRoute}/spaceMap`,
//     name: 'spaceMap',
//     component: spaceMap,
//     meta: {
//         title: 'spaceMap',
//         formRoute: dealWithPath(fromRoute),
//         blankRoute // 标记不是新开页面路由
//     }
// });

// 系统图
// export const getSystemChartRoute = (fromRoute = '', blankRoute = true) => ({
//     path: `${fromRoute}/systemChart`,
//     name: 'systemChart',
//     component: systemChart,
//     meta: {
//         title: 'systemChart',
//         formRoute: dealWithPath(fromRoute),
//         blankRoute // 标记不是新开页面路由
//     }
// });
