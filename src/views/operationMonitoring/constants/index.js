import i18n from '@/localization';
// 视角类型 PERSPECTIVE_DICT 枚举
export const PERSPECTIVE_DICT = {
    RELATIONAL_PERSPECTIVE: 'RELATIONAL_PERSPECTIVE',
    MODEL_PERSPECTIVE: 'MODEL_PERSPECTIVE'
};

// 视角列表
export const PERSPECTIVE_LIST = [
    {
        id: PERSPECTIVE_DICT.RELATIONAL_PERSPECTIVE,
        name: i18n.global.t('meos_control_web.relationship_view')
    },
    {
        id: PERSPECTIVE_DICT.MODEL_PERSPECTIVE,
        name: i18n.global.t('meos_control_web.model_view_angle')
    }
];

// 图类型定义 GRAPH_TYPE_DICT 枚举
export const GRAPH_TYPE_DICT = {
    SYSTEM_GRAPH: 'SYSTEM_GRAPH', // 系统图
    WHOLO_BUILD_GRAPH: 'WHOLO_BUILD_GRAPH', // 全楼图
    FLOOR_GRAPH: 'FLOOR_GRAPH', // 楼层图
    SPACE_3D_GRAPH: 'SPACE_3D_GRAPH' // 空间3D图
};
