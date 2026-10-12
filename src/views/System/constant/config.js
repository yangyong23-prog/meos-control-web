import i18n from '@/localization';
import EquipInfoTPAS from '../components/equipInfo-TPAS/index.vue';
import ControlTPAS from '../components/control-TPAS/index.vue';
import { useRightTPASHook } from '../hooks/useRightHook';

export const SYSTEM_CONFIGS = {
    TPAS: {
        SYSTEM_CLASSCODE: 'TPAS',
        RUNNING_MONITOR_TYPE: 'AIR_COMPRESSOR', // TODO
        CLASS_CODES: [],
        LEFT_CONFIG: {
            EQUIP_INFO_COMPONENT: EquipInfoTPAS,
            // 判断有分视图的设备组
            CHECK_EQUIP_GROUP_HAD_SUB_GRAPH: () => {
                return false;
            },
            // 判断不可交互设备组
            CHECK_EQUIP_GROUP_DISABLE_SELECT: () => {
                return false;
            },
            // 关联异常事件的 classCodes
            CHECK_INSTANCE_RELATED_ABNORMAL_EVENTS: () => {
                return false;
            }
        },
        RIGHT_CONFIG: {
            SHOW_NOTIFY: true,
            // 右侧控制组件
            RIGHT_CONTROL_COMPONENT: ControlTPAS,
            RIGHT_CONTROL_HOOK: useRightTPASHook
        },
        EXTRA_SSE_EVENTS: []
    }
};
