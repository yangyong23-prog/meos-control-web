import { GeneralZone, OBJ_TYPE } from '@/utils/globalVariables';

export const mockList = [
    {
        name: '全部',
        inCount: '82434745',
        outCount: '10134'
    },
    {
        name: '西门'.repeat(4),
        inCount: '823435',
        outCount: '10134'
    },
    {
        name: '南门',
        inCount: '823435',
        outCount: ''
    },
    {
        name: '北门',
        inCount: '',
        outCount: '10519934'
    },
    {
        name: '东门',
        inCount: '',
        outCount: '10519934'
    }
];

export const mockProjectStatistic = {
    code: '00000',
    result: 'success',
    data: [
        {
            id: 'Pj9909990007',
            name: '禹数2#楼',
            localId: '9909990007',
            localName: '禹数2#楼',
            projectId: 'Pj9909990007',
            objType: OBJ_TYPE.PROJECT,
            classCode: 'project',
            valid: true,
            dynamicName: '禹数2#楼',
            objectId: 'Pj9909990007',
            objectName: '禹数2#楼',
            templateTypeId: '1826554131631542273',
            templateTypeName: '项目',
            relInfoCodeGroupConfigs: [
                {
                    groupChildren: [
                        {
                            groupChildren: [],
                            groupCode: 'currentPassengerFlowStatisticTrend',
                            groupName: '当前客流统计趋势',
                            groupOrder: 1,
                            relInfoCodeConfigs: [
                                {
                                    dataValue: [],
                                    infoCode: 'spExsitPeopleNum',
                                    infoCodeType: 'IOT_PERSISTENCE_TREND',
                                    relTemplateTypeId: '1826554131631542273',
                                    sequence: 1
                                }
                            ]
                        }
                    ],
                    groupCode: 'currentPassengerFlowStatistic',
                    groupName: '实时客流统计',
                    groupOrder: 20,
                    relInfoCodeConfigs: []
                }
            ],
            modifiedTime: '1724379216000',
            altitude: 435,
            projAreaTree: '{"0501":9745258.3,"04":3245.2,"05":678435.6,"06":3457.1}',
            projUnderArea: 53883,
            projCityLocationMap: [],
            projFuncType: 'BFT-04.10.00',
            projParkNum: 894,
            beCompletedDate: '',
            businessOpeningTime: '20230512',
            creationTime: '1609430400000',
            city: '110100',
            projFloorArea: 109601,
            modifier: 'EMS',
            latitude: 39.9,
            updateApp: 'BOSS',
            groupManageZone: 'TYXN',
            projHeight: 162,
            projNeighborLocationMap: [],
            assetManager: '开元投资管理有限公司',
            handoverDate: '',
            province: '110000',
            property: '开元物业服务中心',
            projUnderParkNum: 894,
            group: 'TYXN',
            longitude: 116.3,
            virtualCodes: [],
            owner: '开元投资管理有限公司',
            publishTime: '20240823100425',
            projGroundParkNum: 56,
            creator: '0',
            projPic: [
                {
                    id: 'https://dev-minioapi.ysbdtp.com/dataplatform/20240722/1721633595145image38-2139153998.png',
                    key: '1721633595145image38.png',
                    name: '1721633595145image38.png',
                    type: 'file',
                    status: 'done',
                    suffix: 'image/jpg'
                }
            ],
            projArea: 163484,
            address: '海淀区',
            projUnderfloorNum: 3,
            businessEffectiveTime: '20240823100425',
            constructor: ['江苏江都建设', '苏州金螳螂建筑装饰', '上海柏承行建筑工程咨询', '北京北黄自动化'],
            designer: ['香港王淑云室内设计', '香港—林景观', 'ADEAS凯达环球', '中国建筑西北设计院', '王及王（成都）设计顾问', '台北巨汇设计有限公司'],
            projIntro: '以人性化的考量让空间尺度合理化，在满目钢筋水泥森林的城市中，瞥见灼灼光华1',
            createApp: 'BOSS',
            grouping: 1,
            projCoverArea: 21598,
            urbanZone: '110108',
            climateZone: '30',
            urbanDevpLev: '1120'
        }
    ],
    message: null,
    timestamp: '1724397404050'
};

export const mockSpaceDetail = [
    {
        id: 'Sp748038282442b7f856f50f490ab15380b6d97cd120',
        name: '合用前室',
        localId: '2483',
        localName: '电梯厅合用前室',
        projectId: 'Pj9522457558',
        objType: OBJ_TYPE.SPACE,
        classCode: GeneralZone,
        valid: true,
        dynamicName: '电梯厅合用前室',
        objectId: 'Sp748038282442b7f856f50f490ab15380b6d97cd120',
        objectName: '电梯厅合用前室',
        templateTypeId: '1826893237783838721',
        templateTypeName: '物业分区',
        relInfoCodeGroupConfigs: [
            {
                groupChildren: [],
                groupCode: 'spaceStatus',
                groupName: '空间状态',
                groupOrder: 2,
                relInfoCodeConfigs: [
                    {
                        dataSource: [
                            {
                                code: 'alarmstatus',
                                name: '异常'
                            }
                        ],
                        infoCode: 'alarmstatus',
                        infoCodeName: '异常事件',
                        infoCodeType: 'RISK_EVENT',
                        relTemplateTypeId: '1826893237783838721',
                        sequence: 1
                    }
                ]
            },
            {
                groupChildren: [],
                groupCode: 'riskEvent',
                groupName: '异常事件',
                groupOrder: 3,
                relInfoCodeConfigs: [
                    {
                        dataValue: [],
                        infoCode: 'alarmeventdetail',
                        infoCodeType: 'RISK_EVENT_DETAIL',
                        relTemplateTypeId: '1826893237783838721',
                        sequence: 1
                    }
                ]
            },
            {
                groupChildren: [
                    {
                        groupChildren: [],
                        groupCode: 'currentPassengerFlowStatisticTrend',
                        groupName: '当前客流统计趋势',
                        groupOrder: 1,
                        relInfoCodeConfigs: [
                            {
                                dataSource: [],
                                dataValue: [
                                    {
                                        time: '2024-08-23 01:00:00'
                                    },
                                    {
                                        time: '2024-08-23 02:00:00'
                                    },
                                    {
                                        time: '2024-08-23 03:00:00'
                                    },
                                    {
                                        time: '2024-08-23 04:00:00'
                                    },
                                    {
                                        time: '2024-08-23 05:00:00'
                                    },
                                    {
                                        time: '2024-08-23 06:00:00'
                                    },
                                    {
                                        time: '2024-08-23 07:00:00'
                                    },
                                    {
                                        time: '2024-08-23 08:00:00'
                                    },
                                    {
                                        time: '2024-08-23 09:00:00'
                                    },
                                    {
                                        time: '2024-08-23 10:00:00'
                                    },
                                    {
                                        time: '2024-08-23 11:00:00'
                                    },
                                    {
                                        time: '2024-08-23 12:00:00'
                                    },
                                    {
                                        time: '2024-08-23 13:00:00'
                                    },
                                    {
                                        time: '2024-08-23 14:00:00'
                                    },
                                    {
                                        time: '2024-08-23 15:00:00'
                                    },
                                    {
                                        time: '2024-08-23 16:00:00'
                                    },
                                    {
                                        time: '2024-08-23 17:00:00'
                                    },
                                    {
                                        time: '2024-08-23 18:00:00',
                                        value: '43'
                                    },
                                    {
                                        time: '2024-08-23 19:00:00',
                                        value: '8'
                                    },
                                    {
                                        time: '2024-08-23 20:00:00',
                                        value: '57'
                                    },
                                    {
                                        time: '2024-08-23 21:00:00'
                                    },
                                    {
                                        time: '2024-08-23 22:00:00'
                                    },
                                    {
                                        time: '2024-08-23 23:00:00'
                                    }
                                ],
                                infoCode: 'spExsitPeopleNum',
                                infoCodeName: '空间内现有人数',
                                infoCodeType: 'IOT_PERSISTENCE_TREND',
                                relTemplateTypeId: '1826893237783838721',
                                sequence: 1,
                                unit: '人'
                            }
                        ]
                    }
                ],
                groupCode: 'currentPassengerFlowStatistic',
                groupName: '实时客流统计',
                groupOrder: 20,
                relInfoCodeConfigs: [
                    {
                        dataSource: [],
                        infoCode: 'spExsitPeopleNum',
                        infoCodeName: '空间内现有人数',
                        infoCodeType: 'IOT_RUNNING',
                        relTemplateTypeId: '1826893237783838721',
                        sequence: 1,
                        unit: '人'
                    }
                ]
            },
            {
                groupChildren: [
                    {
                        groupChildren: [],
                        groupCode: 'timeSlotEntryAndExitTrend',
                        groupName: '分时段出入场趋势',
                        groupOrder: 1,
                        relInfoCodeConfigs: [
                            {
                                dataSource: [],
                                dataValue: [],
                                infoCode: 'spInPeopleFlow',
                                infoCodeName: '空间逐时离开人次',
                                infoCodeType: 'IOT_PERSISTENCE_TREND',
                                relTemplateTypeId: '1826893237783838721',
                                sequence: 1,
                                unit: '人次/min'
                            },
                            {
                                dataSource: [],
                                dataValue: [],
                                infoCode: 'spOutPeopleFlow',
                                infoCodeName: '空间逐时进入人次',
                                infoCodeType: 'IOT_PERSISTENCE_TREND',
                                relTemplateTypeId: '1826893237783838721',
                                sequence: 2,
                                unit: '人次/min'
                            }
                        ]
                    }
                ],
                groupCode: 'cumulativePassengerFlowStatistics',
                groupName: '今日累计入出入场人数统计',
                groupOrder: 21,
                relInfoCodeConfigs: [
                    {
                        dataSource: [],
                        infoCode: 'spInPeopleFlow',
                        infoCodeName: '空间逐时离开人次',
                        infoCodeType: 'IOT_PERSISTENCE',
                        relTemplateTypeId: '1826893237783838721',
                        sequence: 1,
                        unit: '人次/min'
                    },
                    {
                        dataSource: [],
                        infoCode: 'spOutPeopleFlow',
                        infoCodeName: '空间逐时进入人次',
                        infoCodeType: 'IOT_PERSISTENCE',
                        relTemplateTypeId: '1826893237783838721',
                        sequence: 2,
                        unit: '人次/min'
                    }
                ]
            }
        ],
        modifiedTime: '1724227999000',
        spaceState: 1,
        netArea: 21.4,
        roomFuncType: 'SFT-05.05.00',
        defaultQRCode: 'Sp748038282442b7f856f50f490ab15380b6d97cd120',
        creationTime: '1699256775000',
        roomHeight: 3.9,
        isOutdoorSpace: 1,
        modifier: '1692322243611',
        updateApp: '23',
        pic: [
            {
                key: '1699947655649.png',
                path: '/storage/emulated/0/Android/data/com.ys.bdtp.adm/offlineImages/1699947655649.png',
                itemType: 0
            }
        ],
        domesticWaterSupply: '0',
        naturalGasSupply: '0',
        floorId: 'Fl1717703961663614976',
        outline:
            '[[[{"X":112924.97,"Y":203829.64,"Z":-15200.0},{"X":112924.97,"Y":205879.64,"Z":-15200.0},{"X":112924.97,"Y":206129.64,"Z":-15200.0},{"X":110574.97,"Y":206129.64,"Z":-15200.0},{"X":110574.97,"Y":208129.64,"Z":-15200.0},{"X":110574.97,"Y":209429.64,"Z":-15200.0},{"X":107774.92,"Y":209429.64,"Z":-15200.0},{"X":107774.92,"Y":208229.63,"Z":-15200.0},{"X":107224.97,"Y":208229.63,"Z":-15200.0},{"X":107224.97,"Y":203879.64,"Z":-15200.0},{"X":107224.97,"Y":203829.64,"Z":-15200.0},{"X":112924.97,"Y":203829.64,"Z":-15200.0}]]]',
        bimId: 'Pj9522457558Fl1717703961663614976:8469261',
        state: 1,
        publishTime: '20240821155423',
        creator: '1468407036472950020',
        bimLocation: '110074.97,206629.64,-13250.0',
        withFloor: '1',
        businessEffectiveTime: '20240821155423',
        format: 'BFT-04.10.00',
        grouping: 1,
        buildArea: 23.5,
        digitalDeliveryName: 'DSY_B3_前室_10',
        buildingId: 'Bd1717703084831780864',
        cADID: '合用前室'
    }
];
