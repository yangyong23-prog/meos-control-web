import i18n from '@/localization';
export const routeParamsTypeToDemandTypeMap = {
    ac: 'AIRCONDITIONING',
    light: 'LIGHTING',
    sec: 'SECURITY',
    vent: 'VENTILATION'
};

// 左侧是否展示 menus
export const isHideLeftMenus = demandType => ['AIRCONDITIONING'].includes(demandType);
// 左侧 menu 需求类型图标
export const templateTypeToMenuIconMap = {
    // 照明
    PUBLIC_AREA_LIGHTING: '#icon-activeParking',
    PARKING_LOT_LIGHTING: '#icon-activeDome',
    BUILDING_LIGHTING: '#icon-activeCommonality',
    LANDSCAPE_LIGHTING: '#icon-activeNocturne',
    SIGN_LIGHTING: '#icon-activeParkinglot',

    // 通风
    LOGISTICS_VENTILATION: '#icon-machineDogistics', //机房后勤
    PARKING_VENTILATION: '#icon-parkinglotVentilation', //停车场
    TOILET_VENTILATION: '#icon-bathroomVentilation', //卫生间
    DOME_VENTILATION: '#icon-domeVentilation', //穹顶

    //安防
    ARMING: '#icon-sec-arm',
    PASSING: '#icon-sec-passing'
};

// 左侧树是否左右拖动
export const isLeftTreeDragEnable = demandType => ['SECURITY', 'VENTILATION'].includes(demandType);

// 左侧树是否展示footer、黑名单、屏蔽空间
export const isHideLeftFooter = demandType => ['VENTILATION'].includes(demandType);
export const isHideLeftBlackList = demandType => ['SECURITY', 'VENTILATION'].includes(demandType);
export const isHideLeftShieldList = demandType => ['VENTILATION'].includes(demandType);

// 模型地图图例设置、空间状态显隐配置
const ALL_LEGENDS_CODES_ENUM = {
    special: 'special',
    shield: 'shield',
    refParentConfig: 'refParentConfig'
};
export const demandTypeToLegendMap = demandType => {
    const hideShield = isHideLeftShieldList(demandType);
    const legendItems = {
        buildingMode: [
            {
                name: i18n.global.t('meos_control_web.special_config'),
                color: '#FACD73',
                code: ALL_LEGENDS_CODES_ENUM.special
            },
            {
                name: i18n.global.t('meos_control_web.shielded_zone'),
                color: '#B0B5BA',
                code: ALL_LEGENDS_CODES_ENUM.shield,
                hide: hideShield
            }
        ],
        floorMode: [
            {
                name: i18n.global.t('meos_control_web.inherit_parent_configuration'),
                color: '#A1C8E5',
                code: ALL_LEGENDS_CODES_ENUM.refParentConfig
            },
            {
                name: i18n.global.t('meos_control_web.special_config'),
                color: '#FACD73',
                code: ALL_LEGENDS_CODES_ENUM.special
            },
            {
                name: i18n.global.t('meos_control_web.shielded_zone'),
                color: '#B0B5BA',
                code: ALL_LEGENDS_CODES_ENUM.shield,
                hide: hideShield
            }
        ]
    };
    return { legendItems, hideShield };
};

// 右侧配置是否折叠展开
export const isRightConfigExpandEnable = demandType => ['AIRCONDITIONING'].includes(demandType);

// 右侧配置详情-时间轴图例组件配置
export const templateTypeToConfigLegendMap = {
    ARMING: [
        {
            color: '#E1E5EB',
            borderColor: '#8B949E',
            title: i18n.global.t('meos_control_web.disarm_period'),
            type: 'disarmingTimeIntervals',
            isDefault: true
        },
        {
            color: '#FFB7B4',
            borderColor: '#F55047',
            title: i18n.global.t('meos_control_web.arm_period'),
            type: 'armingTimeIntervals'
        }
    ],
    PASSING: [
        {
            color: '#B2E5C6',
            borderColor: '#3FBE72',
            title: i18n.global.t('meos_control_web.all_access_period'),
            type: 'passableTimeIntervals'
        },
        {
            color: '#FFB7B4',
            borderColor: '#F55047',
            title: i18n.global.t('meos_control_web.all_no_access_period'),
            type: 'unpassableTimeIntervals'
        },
        {
            color: '#A2CDFF',
            borderColor: '#246FE5',
            title: i18n.global.t('meos_control_web.access_period_by_permission'),
            type: 'permissionPassTimeIntervals',
            isDefault: true
        }
    ],
    // TODO 待确认通风图例类型
    VENTILATION: [
        {
            color: '#6FC1FF',
            borderColor: '#215DD9',
            title: i18n.global.t('meos_control_web.exhaust_demand_time'),
            tips: i18n.global.t('meos_control_web.auto_ventilate_by_sensor_or_keep_fan_on_during_set_time_slot'),
            type: 'exhaustTimeIntervals'
        },
        {
            color: '#90DED9',
            borderColor: '#00A2A7',
            title: i18n.global.t('meos_control_web.supply_air_demand_time'),
            tips: i18n.global.t('meos_control_web.keep_fan_on_during_set_time_slot'),
            type: 'deliverTimeIntervals'
        },
        {
            color: 'repeating-linear-gradient(108.552deg, #e1e5eb, #e1e5eb 4px, #ffffff 0px, #ffffff 8px)',
            title: i18n.global.t('meos_control_web.no_demand1'),
            borderColor: '#8B949E',
            isDefault: true
        }
    ],
    // 穹顶通风：在排风、送风之外新增自然通风需求时间
    DOME_VENTILATION: [
        {
            color: '#6FC1FF',
            borderColor: '#215DD9',
            title: i18n.global.t('meos_control_web.exhaust_demand_time'),
            tips: i18n.global.t('meos_control_web.auto_ventilate_by_sensor_or_keep_fan_on_during_set_time_slot'),
            type: 'exhaustTimeIntervals'
        },
        {
            color: '#90DED9',
            borderColor: '#00A2A7',
            title: i18n.global.t('meos_control_web.supply_air_demand_time'),
            tips: i18n.global.t('meos_control_web.keep_fan_on_during_set_time_slot'),
            type: 'deliverTimeIntervals'
        },
        {
            color: '#CBE061',
            borderColor: '#CCE062',
            title: i18n.global.t('meos_control_web.natural_ventilation_demand_time'),
            tips: i18n.global.t('meos_control_web.natural_ventilation_demand_tips'),
            type: 'naturalVentilationTimeIntervals'
        },
        {
            color: 'repeating-linear-gradient(108.552deg, #e1e5eb, #e1e5eb 4px, #ffffff 0px, #ffffff 8px)',
            title: i18n.global.t('meos_control_web.no_demand1'),
            borderColor: '#8B949E',
            isDefault: true
        }
    ]
};

// 右侧配置详情-模板类型映射环境品质目标、反馈调节
export const templateTypeMapEnvAndFeedback = {
    LOGISTICS_VENTILATION: {
        env: [
            {
                label: i18n.global.t('meos_control_web.o2_target_value'),
                unit: '%',
                code: 'o2Target',
                scope: i18n.global.t('meos_control_web.range_0_to_100'),
                defaultVal: 19.5,
                step: 0.01,
                precision: 2,
                valNumberToPercent: true, // 小数转换成百分比
                rules: [
                    {
                        validator: (rule, val, callback) => {
                            if (val?.toString()?.trim() && (val < 0 || val === 0 || val > 100)) {
                                callback(new Error(i18n.global.t('meos_control_web.required_two_decimal_range_0_100')));
                            } else {
                                callback();
                            }
                        },
                        trigger: ['blur']
                    }
                ]
            },
            {
                label: i18n.global.t('meos_control_web.temperature_target_value'),
                unit: '℃',
                code: 'tdbTarget',
                scope: i18n.global.t('meos_control_web.range_minus_99_9_to_99_9'),
                defaultVal: 40,
                step: 0.1,
                precision: 1,
                rules: [
                    {
                        validator: (rule, val, callback) => {
                            if (val?.toString()?.trim() && (val < -99.9 || val > 99.9)) {
                                callback(new Error(i18n.global.t('meos_control_web.required_one_decimal_range_neg99p9_99p9')));
                            } else {
                                callback();
                            }
                        },
                        trigger: ['blur']
                    }
                ]
            }
        ],
        feedback: {
            tips: i18n.global.t('meos_control_web.dynamic_adjustment_by_o2_temp'),
            defaultVal: true
        }
    },
    PARKING_VENTILATION: {
        env: [
            {
                label: i18n.global.t('meos_control_web.co_target_value'),
                unit: 'ppm',
                code: 'cotarget',
                scope: i18n.global.t('meos_control_web.range_0_to_9999'),
                defaultVal: 30,
                step: 1,
                precision: 0,
                rules: [
                    {
                        validator: (rule, val, callback) => {
                            if (val?.toString()?.trim() && (val < 0 || val === 0 || val > 9999)) {
                                callback(new Error(i18n.global.t('meos_control_web.required_positive_integer_range_0_9999')));
                            } else {
                                callback();
                            }
                        },
                        trigger: ['blur']
                    }
                ]
            }
        ],
        feedback: {
            tips: i18n.global.t('meos_control_web.dynamic_adjustment_by_co'),
            defaultVal: false
        }
    },
    TOILET_VENTILATION: {
        env: [
            {
                label: i18n.global.t('meos_control_web.nh3_target_value'),
                unit: 'mg/m³',
                code: 'nh3Target',
                scope: i18n.global.t('meos_control_web.range_0_to_50'),
                defaultVal: 0.3,
                step: 0.01,
                precision: 2,
                rules: [
                    {
                        validator: (rule, val, callback) => {
                            if (val?.toString()?.trim() && (val < 0 || val === 0 || val > 50)) {
                                callback(new Error(i18n.global.t('meos_control_web.required_two_decimal_range_0_50')));
                            } else {
                                callback();
                            }
                        },
                        trigger: ['blur']
                    }
                ]
            },
            {
                label: i18n.global.t('meos_control_web.h2s_target_value'),
                unit: 'mg/m³',
                code: 'h2STarget',
                scope: i18n.global.t('meos_control_web.range_0_to_20'),
                defaultVal: 0.01,
                step: 0.01,
                precision: 2,
                rules: [
                    {
                        validator: (rule, val, callback) => {
                            if (val?.toString()?.trim() && (val < 0 || val === 0 || val > 20)) {
                                callback(new Error(i18n.global.t('meos_control_web.required_two_decimal_range_0_20')));
                            } else {
                                callback();
                            }
                        },
                        trigger: ['blur']
                    }
                ]
            }
        ],
        feedback: {
            tips: i18n.global.t('meos_control_web.dynamic_adjustment_by_nh3_h2s'),
            defaultVal: true
        }
    },
    DOME_VENTILATION: {
        env: [
            {
                label: i18n.global.t('meos_control_web.temperature_target_value'),
                unit: '℃',
                code: 'tdbTarget',
                scope: i18n.global.t('meos_control_web.range_minus_99_9_to_99_9'),
                defaultVal: 40,
                step: 0.1,
                precision: 1,
                rules: [
                    {
                        validator: (rule, val, callback) => {
                            if (val?.toString()?.trim() && (val < -99.9 || val > 99.9)) {
                                callback(new Error(i18n.global.t('meos_control_web.required_one_decimal_range_neg99p9_99p9')));
                            } else {
                                callback();
                            }
                        },
                        trigger: ['blur']
                    }
                ]
            }
        ],
        feedback: {
            tips: i18n.global.t('meos_control_web.by_temperature_adaptive_adjustment'),
            defaultVal: true
        }
    }
};

// 排风/送风需求时间通用字段配置
const exhaustTimeRangeConfig = {
    code: 'exhaustTimeIntervals',
    title: i18n.global.t('meos_control_web.exhaust_demand_time'),
    tips: i18n.global.t('meos_control_web.auto_ventilate_by_sensor_or_keep_fan_on_during_set_time_slot')
};
const deliverTimeRangeConfig = {
    code: 'deliverTimeIntervals',
    title: i18n.global.t('meos_control_web.supply_air_demand_time'),
    tips: i18n.global.t('meos_control_web.keep_fan_on_during_set_time_slot')
};
const baseVentTimeRangeConfig = [exhaustTimeRangeConfig, deliverTimeRangeConfig];

// 穹顶自然通风需求时间字段配置
const naturalVentTimeRangeConfig = {
    code: 'naturalVentilationTimeIntervals',
    title: i18n.global.t('meos_control_web.natural_ventilation_demand_time'),
    tips: i18n.global.t('meos_control_web.natural_ventilation_demand_tips'),
    limit: 20,
    overLimitTips: i18n.global.t('meos_control_web.natural_ventilation_max_time_slots')
};

// 各通风场景的通风需求时间字段配置（穹顶新增自然通风需求时间）
// 注意：各场景持有独立数组副本，消费方不得原地修改元素，防止跨场景串改
export const ventTimeRangeConfigMap = {
    LOGISTICS_VENTILATION: [...baseVentTimeRangeConfig],
    PARKING_VENTILATION: [...baseVentTimeRangeConfig],
    TOILET_VENTILATION: [...baseVentTimeRangeConfig],
    // 穹顶：排风需求时间、送风需求时间、自然通风需求时间均最多20段
    DOME_VENTILATION: [{ ...exhaustTimeRangeConfig, limit: 20 }, { ...deliverTimeRangeConfig, limit: 20 }, naturalVentTimeRangeConfig]
};

// 兜底配置（与原有排风/送风结构保持一致）
export const ventTimeRangeConfig = [...ventTimeRangeConfigMap.LOGISTICS_VENTILATION];
