import i18n from '@/localization';
import { ControlListItem } from '../types/control';
import SwitchControl from '../components/control/SwitchControl.vue';

// 主图graphTypeCode
export const MAIN_GRAP_TYPE_CODE = i18n.global.t('meos_control_web.source_side_water_diagram');

export const RUN_X1STTAG_3 = 'x1stTag_3'; // 运行参数
export const RUN_X1STTAG_5 = 'x1stTag_5'; // 技术参数
/**
 * 监测监控状态枚举
 * @property {number} NO_DATA 无数据
 * @property {number} UNSUPERVISABLE_AND_UNCONTROLLABLE 不可监不可控
 * @property {number} SUPERVISABLE_BUT_UNCONTROLLABLE 只可监不可控
 * @property {number} SUPERVISABLE_AND_CONTROLLABLE 可监可控
 */
export const MonitoringSurveillanceStatus = {
    NO_DATA: [undefined, null, ''],
    UNSUPERVISABLE_AND_UNCONTROLLABLE: '1',
    SUPERVISABLE_BUT_UNCONTROLLABLE: '2',
    SUPERVISABLE_AND_CONTROLLABLE: '3'
};

// 根据传入的数据动态返回对应的控制组件
export const CONTROL_CONFIG_FUN = (data: ControlListItem) => {
    if (data.infoCode?.includes('Switch') || data.infoCode === 'airConditionDemand' || data.infoCode === 'enableCtrl') {
        return { type: 'SwitchControl', component: SwitchControl }; // 返回开关控制组件
    }
    // if (data.unitsNumberSetValue) {
    //     return { type: 'CoolerControl', component: CoolerControl }; // 返回冷却器控制组件
    // }
    // return { type: 'InputControl', component: InputControl }; // 默认返回输入控制组件
};

// 系统运行状态
export const RUN_STATUS = {
    1: { id: '1', name: i18n.global.t('meos_control_web.on') }, // 系统开启
    0: { id: '0', name: i18n.global.t('meos_control_web.off') } // 系统关闭
};

// 冷机代码定义
export const CHILLER_CODE = () => ({
    LARGE: { id: 'LARGE', name: i18n.global.t('common.large'), shortName: i18n.global.t('common.large_short') }, // 大冷机
    M1: { id: 'M1', name: i18n.global.t('common.mid'), shortName: i18n.global.t('common.mid_short') }, // 中冷机
    SMALL: { id: 'SMALL', name: i18n.global.t('common.small'), shortName: i18n.global.t('common.small_short') } // 小冷机
});
// 冷机类型定义
export const CHILLER_TYPE = {
    LMS: { id: 'LMS', name: 'LMS' }, // 大中小冷机
    LM: { id: 'LM', name: 'LM' }, // 大中冷机
    LS: { id: 'LS', name: 'LS' }, // 大小冷机
    L: { id: 'L', name: 'L' } // 大冷机
};

export const CONSOLEIS_CLOSE = '0';

export const OPEN = '1';
export const CLOSE = '0';

export const INFOCODE_SET_AND_UNITSNUMBERS_SET = 'infoCodeSetAndUnitsNumberSet';
