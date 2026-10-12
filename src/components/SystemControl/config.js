import i18n from '@/localization';
import CoolerControl from './CoolerControl.vue';
import InputControl from './InputControl.vue';
import SwitchControl from './SwitchControl.vue';

// 根据传入的数据动态返回对应的控制组件
export const CONTROL_CONFIG_FUN = data => {
    if (data.infoCode?.includes('Switch') || data.infoCode === 'airConditionDemand' || data.infoCode === 'enableCtrl') {
        return { type: 'SwitchControl', component: SwitchControl }; // 返回开关控制组件
    }
    if (data.unitsNumberSetValue) {
        return { type: 'CoolerControl', component: CoolerControl }; // 返回冷却器控制组件
    }
    return { type: 'InputControl', component: InputControl }; // 默认返回输入控制组件
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

// 系统运行状态
export const RUN_STATUS = {
    1: { id: '1', name: i18n.global.t('meos_control_web.on') }, // 系统开启
    0: { id: '0', name: i18n.global.t('meos_control_web.off') } // 系统关闭
};
// 判断是否锁定 只有激活状态下才能进行操作
export const isLock = data => {
    return data.dataValue !== '1';
};
// 判断是否锁定 V2版本 只有为0状态下才锁定
export const isLockV2 = data => {
    return data.dataValue === '0';
};
