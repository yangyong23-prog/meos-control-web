/* eslint-disable camelcase */
export const VALUE_SELECT_OBJS_SIMPLE = {
    value_select_lowest_cast: {
        title: '费用最低'
    },
    value_select_Lowest_carbon_emissions: {
        title: '碳排放最低'
    },
    value_select_lowest_energy: {
        title: '能耗最低'
    },
    value_select_quality_first: {
        title: '品质优先'
    }
};

/**
 * 运行日志 操作类型
 */
export const OperationType = {
    1: '自动',
    2: '人工',
    3: '报警'
};

export const COOLMODE = {
    CHILLER_COOL: 'CHILLER_COOL',
    DE_ICE_COOL: 'DE_ICE_COOL',
    FREE_COOL: 'FREE_COOL',
    CITY_COOL: 'CITY_COOL'
};
export const COOl_MODE_OPTION_DEFINE = {
    [COOLMODE.CHILLER_COOL]: {
        label: '冷机供冷',
        value: COOLMODE.CHILLER_COOL
    },
    [COOLMODE.DE_ICE_COOL]: {
        label: '放冷供冷',
        value: COOLMODE.DE_ICE_COOL
    },
    [COOLMODE.FREE_COOL]: {
        label: '免费冷供冷',
        value: COOLMODE.FREE_COOL
    },
    [COOLMODE.CITY_COOL]: {
        label: '区域板换供冷',
        value: COOLMODE.CITY_COOL
    }
};

// 系统分类代码
export const SYSTEM_CLASSCODE = 'ACAC';

// alg_air_cooling_eff_sysc 冷站EER
// alg_air_cooling_eff_chic 冷机组COP
// alg_air_cooling_eff_wtfch 冷冻水输配系数
// alg_air_cooling_eff_wtfc 冷却水输配系数
// alg_air_cooling_eff_cthf 冷却塔散热系数
// alg_air_cooling_eff_tubr 热不平衡率

export const ALG_AIR_COOLING_EFF_LABELS = {
    alg_air_cooling_eff_sysc: ['需改善', '一般', '良好', '优秀'],
    alg_air_cooling_eff_chic: ['需改善', '一般', '良好', '优秀'],
    alg_air_cooling_eff_wtfch: ['需改善', '一般', '良好', '优秀'],
    alg_air_cooling_eff_wtfc: ['需改善', '一般', '良好', '优秀'],
    alg_air_cooling_eff_cthf: ['需改善', '一般', '良好', '优秀'],
    alg_air_cooling_eff_tubr: ['需改善', '良好', '优秀', '良好', '需改善'],
    default: ['需改善', '一般', '良好', '优秀']
};

export const ALG_AIR_COOLING_EFF_STATUS = {
    alg_air_cooling_eff_sysc: ['bad', 'general', 'good', 'excellent'],
    alg_air_cooling_eff_chic: ['bad', 'general', 'good', 'excellent'],
    alg_air_cooling_eff_wtfch: ['bad', 'general', 'good', 'excellent'],
    alg_air_cooling_eff_wtfc: ['bad', 'general', 'good', 'excellent'],
    alg_air_cooling_eff_cthf: ['bad', 'general', 'good', 'excellent'],
    alg_air_cooling_eff_tubr: ['bad', 'good', 'excellent', 'good', 'bad'],
    default: ['bad', 'general', 'good', 'excellent']
};

export const ALG_AIR_COOLING_EFF_UNIT = {
    alg_air_cooling_eff_sysc: '',
    alg_air_cooling_eff_chic: '',
    alg_air_cooling_eff_wtfch: '',
    alg_air_cooling_eff_wtfc: '',
    alg_air_cooling_eff_cthf: '',
    alg_air_cooling_eff_tubr: '%',
    default: ''
};

// 调节记录对象排序规则
export const getRegulationCategoryIndex = (key: string): number => {
    switch (key) {
        case 'coolingSupplySwitchSet':
            return 0;
        case 'coolingStorageSwitchSet':
            return 1;
        case 'chillWaterOutTempSet':
            return 2;
        case 'chillWaterDetaTempSet':
        case 'chillWaterDetaPressSet':
        case 'worstTerminalDetaPressSet':
            return 3;
        case 'districtCoolingPlateSwitchSet':
            return 5;
        case 'dischargeCoolingSwitchSet':
            return 6;
        case 'freeCoolingSwitchSet':
            return 7;
        default:
            return 4;
    }
};
