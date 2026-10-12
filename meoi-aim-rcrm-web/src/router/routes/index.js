import NodeManageRoute from './modules/NodeManage';
import TestRoute from './modules/NodeManageTest';

export default [
    {
        path: '/relationchart-editor',
        name: 'system',
        component: () => import('@/views/RelationChartEditor/index.vue')
    },
    ...NodeManageRoute,
    ...TestRoute
];
