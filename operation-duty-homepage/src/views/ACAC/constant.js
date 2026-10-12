// @ts-ignore
import i18n from '@/localization';
// 自定义名称
export const INFONAMES = {
    // primaryChillWaterMainSupplyTemp: i18n.global.t('common.outlet_water_temp_of_cooler'),
    // primaryChillWaterMainReturnTemp: i18n.global.t('operation_duty_homepage.meos_home_cooler_return_water_temperature'),
    sysCOP: i18n.global.t('common.meos_home_cold_station_eer'),
    chillersCOP: i18n.global.t('common.meos_home_cold_station_cop'),
    avgCoolingStorageRate: i18n.global.t('operation_duty_homepage.meos_home_average_cold_storage_ratio')
};
export const CHILLER_CLASSCODE = {
    ACSCG: i18n.global.t('common.group')
};

// 排序
export const INFO_ORDERS = {
    coolingSupplySwitchSet: 0, // 供冷开关设定
    dischargeCoolingSwitchSet: 1, // 放冷开关设定
    freeCoolingSwitchSet: 2, // 免费冷开关设定
    coolingStorageSwitchSet: 3, // 蓄冷开关设定
    primaryChillWaterMainSupplyTemp: 4, // 冷机出水温度
    primaryChillWaterMainReturnTemp: 5, // 冷机回水温度
    ACSCG: 5.5, // 冷机开启台数
    BASE: 6, // 冷机开启台数
    ACCCCC: 7, // 离心机开启台数
    ACCCSC: 8, // 螺杆机开启台数
    BASE_DUAL: 9, // 双工况冷机开启台数
    ACCCCC_DUAL: 10, // 双工况冷机开启台数
    ACCCSC_DUAL: 11, // 双工况冷机开启台数
    ACCCWH_DUAL: 12, // 双工况冷机开启台数
    ACCCGH_DUAL: 13, // 双工况冷机开启台数
    ACAHC: 14, // 空气源热泵控制组开启台数
    ACCCGH: 15, // 地源热泵开启台数
    ACCCWH: 16, // 水源热泵开启台数
    ACCCAC: 17, // 吸收式冷水机组开启台数
    sysCOP: 18, // 冷站EER
    chillersCOP: 19, // 冷机组COP
    avgCoolingStorageRate: 20 // 平均蓄冷比例
};
