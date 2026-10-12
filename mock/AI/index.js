const options = [
    {
        url: '/ai-autorun-agent/strategy/jobResult',
        method: 'post',
        response: () => [
            {
                message: 'success',
                data: {
                    timeLabel: 'yyyyMMddHHmmss', // 预测时序数据的首个15min的时间值
                    startTime: '20250715095015', // 计算开始时间 ********
                    endTime: '20250715095311', // 计算结束时间
                    cmpCount: 20, // 计算次数
                    cmpResult: 'success', // 计算结果，success表示成功
                    cmpNextStartTime: '20250715100515', // 下次计算开始时间
                    stgyCodeList: [
                        // 三套策略的编码
                        {
                            code: '2938187478', // 策略编码
                            isBest: false // 是否最优策略
                        },
                        {
                            code: '2938187479', // 策略编码
                            isBest: false // 是否最优策略
                        },
                        {
                            code: '2938187480', // 策略编码
                            isBest: false // 是否最优策略
                        }
                    ]
                }
            }
        ],
        timeout: 1000
    },
    {
        url: '/ai-autorun-agent/strategy/detail',
        method: 'post',
        response: () => {
            return {
                message: 'success',
                data: [
                    {
                        // 时间格式待定
                        stgyIndicator: {
                            // 策略指标信息
                            strategyCode: '202507151000-0', // 策略编码
                            isBest: true, // 是否为最佳策略
                            tempComplianceRatio: 56.3, // 温度达标比例，比例值*100
                            co2ComplianceRatio: 88.9, // CO2达标比例，比例值*100
                            rigidUnsatisfiedArea: 127.2, // 刚性不满足面积
                            worstSpaceIds: ['Sp3201050003053003d52b0841a180e1bb17f584cc83'], // 最不利空间id集合
                            rigidUnsatisfiedSpaceIds: ['Sp3201050003053003d52b0841a180e1bb17f584cc83'], // 刚性不满足空间id集合
                            coldStationSupCooling: [
                                // 冷站提供冷量
                                {
                                    time: 'yyyyMMddHHmmss',
                                    data: 146.8
                                }
                            ],
                            spaceNeedCooling: [
                                // 空间需求冷量
                                {
                                    time: 'yyyyMMddHHmmss',
                                    data: 146.8
                                }
                            ],
                            coldStationEnergy: {
                                // 冷站能耗，key为如下枚举值的编码:冷机CHILLER、冷冻水泵ACCCCP、冷却水泵ACCCOP、冷却塔ACCCOT
                                CHILLER: [
                                    // 冷机能耗
                                    {
                                        time: 'yyyyMMddHHmmss',
                                        data: 146.8
                                    }
                                ],
                                ACCCCP: [],
                                ACCCOP: [],
                                ACCCOT: [] // 冷却塔控制单元能耗，AI模型这边使用ACCCOT编码表示冷却塔控制单元
                            },
                            coldStationCost: {
                                // 冷站费用，key为枚举值（同冷站能耗）
                                CHILLER: [],
                                ACCCCP: [],
                                ACCCOP: [],
                                ACCCOT: [] //AI模型这边使用ACCCOT编码表示冷却塔控制单元
                            },
                            coldStationCarbon: {
                                // 冷站碳排放量，key为枚举值（同冷站能耗）
                                CHILLER: [],
                                ACCCCP: [],
                                ACCCOP: [],
                                ACCCOT: [] //AI模型这边使用ACCCOT编码表示冷却塔控制单元
                            },
                            coldStationEnergySum: 1200.5, // 冷站系统总能耗
                            coldStationCostSum: 2314.96, // 冷站系统总费用
                            coldStationCarbonSum: 42143.76 // 冷站系统碳排放总量
                        },
                        stgyCSDetail: [
                            // 冷站策略明细，逐15min数据
                            {
                                time: 'yyyyMMddHHmmss',
                                sysOpen: 0, // 冷站系统开关：0关，1开
                                chillerGroup: {
                                    small: 1,
                                    large: 2
                                }, // 冷机开启台数
                                waterOutTempSet: 18.5, // 冷机出水温度
                                freezingPumpGroup: {
                                    small: 1,
                                    large: 2
                                }, // 冷冻泵台数分组
                                freezingPumpFreq: 30.0, //冷冻泵运行频率
                                coolingPumpGroup: {
                                    small: 1,
                                    large: 2
                                }, // 冷却泵台数分组
                                coolingPumpFreq: 33.0, // 冷却泵运行频率
                                coolingTowerUnitGroup: {
                                    small: 1,
                                    large: 2
                                }, // 冷却塔控制单元台数分组
                                coolingTowerFanFreq: 32.0, //冷却塔风机频率
                                fanRunNum: null // 冷却塔风机台数
                            }
                        ],
                        stgyACCC: [
                            // 系统策略明细，逐15min数据
                            {
                                time: 'yyyyMMddHHmmss',
                                primaryChillWaterMainSupplyTemp: 19.0, // 冷冻水供水干管温度
                                primaryChillWaterMainReturnTemp: 24.0, // 冷冻水回水干管温度
                                coolWaterMainSupplyTemp: 19.0, // 冷机冷却水出水干管温度
                                coolWaterMainReturnTemp: 26.0, // 冷机冷却水进水干管温度
                                primaryChillWaterFlow: 74.8, // 冷冻水总流量
                                coolWaterFlow: 34.0 // 冷却水总流量
                            }
                        ],
                        stgySpace: {
                            // 空间实例策略明细，逐15min数据（key为实例id）
                            'Sp3201050003053003d52b08...': [
                                {
                                    time: 'yyyyMMddHHmmss',
                                    acNeed: 0, // 空间是否有空调需求：0无，1有
                                    schedule: 0, // 空间是否调度：0否，1是
                                    rigidUnsatisfied: 0, // 是否刚性不满足空间：0否，1是
                                    tdb: 23.0, // 温度预测值
                                    tdbGoal: 23.0, // 温度目标
                                    tdbType: 0, // 温度标签：0在舒适区内,1超舒适区上限,2超过热门限,-1超舒适区下限,-2超温度过冷门限
                                    cO2: 23.0, // CO2预测值
                                    cO2Type: 0, // CO2标签,
                                    rh: 23.0, // 湿度预测值
                                    rhGoal: 23.0, // 湿度目标
                                    rhType: 0 // 湿度标签：0舒适区内,1超舒适区上限,2超过湿门限,-1超舒适区下限，-2超过干门限
                                }
                            ]
                        },
                        stgyACCCSC: {
                            // 螺杆式冷水机组实例策略明细，逐15min数据（key为实例id）
                            'Eq3201050003053003d52b08...': [
                                {
                                    time: 'yyyyMMddHHmmss',
                                    runStatus: 0, // 运行状态:0关，1开
                                    evapWaterInTemp: 20.0, // 蒸发器入口水温
                                    evapWaterOutTemp: 20.0, // 蒸发器出口水温
                                    condWaterInTemp: 20.0, // 冷凝器入口水温
                                    condWaterOutTemp: 20.0 // 冷凝器出口水温
                                }
                            ]
                        },
                        stgyACCCCC: {
                            // 离心式冷水机组实例策略明细，逐15min数据（key为实例id）
                            'Eq3201050003053003d52b08...': [
                                {
                                    time: 'yyyyMMddHHmmss',
                                    runStatus: 0, // 运行状态:0关，1开
                                    evapWaterInTemp: 20.0, // 蒸发器入口水温
                                    evapWaterOutTemp: 20.0, // 蒸发器出口水温
                                    condWaterInTemp: 20.0, // 冷凝器入口水温
                                    condWaterOutTemp: 20.0 // 冷凝器出口水温
                                }
                            ]
                        },
                        stgyACCCCP: {
                            // 供冷冷冻水泵实例策略明细，逐15min数据（key为实例id）
                            'Eq3201050003053003d52b08...': [
                                {
                                    time: 'yyyyMMddHHmmss',
                                    runStatus: 0, // 运行状态:0关，1开
                                    equipFreqSet: 20.0 // 设备频率设定
                                }
                            ]
                        },
                        stgyACCCOP: {
                            // 供冷冷却水泵实例策略明细，逐15min数据（key为实例id）
                            'Eq3201050003053003d52b08...': [
                                {
                                    time: 'yyyyMMddHHmmss',
                                    runStatus: 0, // 运行状态:0关，1开
                                    equipFreqSet: 20.0 // 设备频率设定
                                }
                            ]
                        },
                        stgyACCCOT: {
                            // 冷却塔（控制单元）实例策略明细，逐15min数据（key为实例id）
                            'Eg3201050003053003d52b08...': [
                                {
                                    time: 'yyyyMMddHHmmss',
                                    fanRunNum: 0, // 运行状态:0关，1开
                                    fanFreqSet: 20.0, // 风机频率设定
                                    fanLevel: null // 风机档位
                                }
                            ]
                        },
                        stgyACATAH: {
                            // 空调机组实例策略明细，逐15min数据（key为实例id）
                            'Eq3201050003053003d52b08...': [
                                {
                                    time: 'yyyyMMddHHmmss',
                                    runStatus: 0, // 运行状态:0关，1开
                                    supplyAirTemp: 18.0, // 送风温度设定
                                    returnAirTemp: 25.0 // 回风温度设定
                                }
                            ]
                        },
                        stgyACATFU: {
                            // 新风机组实例策略明细，逐15min数据（key为实例id）
                            'Eq3201050003053003d52b08...': [
                                {
                                    time: 'yyyyMMddHHmmss',
                                    runStatus: 0, // 运行状态:0关，1开
                                    supplyAirTemp: 18.0 // 送风温度设定
                                }
                            ]
                        }
                    }
                ]
            };
        },
        timeout: 1000
    }
];

export default options;
