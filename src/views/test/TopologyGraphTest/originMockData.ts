import { OBJ_TYPE } from '@/utils/globalVariables';
/* stylelint-disable-next-line CssSyntaxError */
export const originMockData = [
    {
        id: 'Eq4403050002e58f8505a2af45eaa89327c2b6f302ba',
        localName: '控制组-01',
        objType: OBJ_TYPE.EQUIPMENT,
        classCode: 'ACAHG',
        relInfoCodeGroupConfigs: [
            {
                groupCode: 'equipStatus',
                groupName: '设备状态',
                groupOrder: 101,
                relInfoCodeConfigs: [
                    {
                        additionalMapValue: {},
                        dataSource: [
                            {
                                code: '0',
                                name: '停止'
                            },
                            {
                                code: '1',
                                name: '运行'
                            }
                        ],
                        dataTime: '2026-05-06 14:15:00',
                        dataValue: '0',
                        infoCode: 'runStatus',
                        infoCodeName: '运行状态',
                        infoCodeType: 'IOT_RUNNING',
                        existsIotRule: true,
                        relTemplateTypeId: '2029009988456767490',
                        sequence: 1,
                        originDataType: 'Boolv'
                    },
                    {
                        additionalMapValue: {},
                        dataSource: [
                            {
                                code: '0',
                                name: '手动'
                            },
                            {
                                code: '1',
                                name: '自动'
                            }
                        ],
                        dataTime: '2026-05-06 14:15:00',
                        dataValue: '1',
                        infoCode: 'manualAutoStatus',
                        infoCodeName: '手自动状态',
                        infoCodeType: 'IOT_RUNNING',
                        existsIotRule: true,
                        relTemplateTypeId: '2029009988456767490',
                        sequence: 2,
                        originDataType: 'Boolv'
                    },
                    {
                        additionalMapValue: {},
                        dataSource: [
                            {
                                code: '0',
                                name: '离线'
                            },
                            {
                                code: '1',
                                name: '在线'
                            }
                        ],
                        dataTime: '2026-05-06 14:15:00',
                        dataValue: '1',
                        infoCode: 'onlineStatus',
                        infoCodeName: '在线状态',
                        infoCodeType: 'IOT_RUNNING',
                        existsIotRule: true,
                        relTemplateTypeId: '2029009988456767490',
                        sequence: 3,
                        originDataType: 'Boolv'
                    },
                    {
                        additionalMapValue: {},
                        dataSource: [
                            {
                                code: '0',
                                name: '本地'
                            },
                            {
                                code: '1',
                                name: '远程'
                            }
                        ],
                        dataTime: '2026-05-06 14:15:00',
                        dataValue: '1',
                        infoCode: 'localRemoteStatus',
                        infoCodeName: '本地远程状态',
                        infoCodeType: 'IOT_RUNNING',
                        existsIotRule: true,
                        relTemplateTypeId: '2029009988456767490',
                        sequence: 4,
                        originDataType: 'Boolv'
                    }
                ]
            },
            {
                groupCode: 'objectAdditionalInfo',
                groupName: '控制组下设备',
                groupOrder: 19,
                relInfoCodeConfigs: [
                    {
                        dataValue: [{ id: 'Eq20001' }, { id: 'Eq20002' }, { id: 'Eq20003' }],
                        infoCode: 'relACVTSF',
                        infoCodeName: '接力风机',
                        infoCodeType: 'RWD_OBJECT_DETAIL',
                        sequence: 18
                    }
                ]
            },
            {
                groupCode: 'airConditioningEquipment',
                groupName: '空调设备',
                groupOrder: 19,
                groupChildren: [
                    {
                        groupCode: 'airConditioningEquipmentChildren',
                        groupName: '空调下级',
                        groupOrder: 20,
                        relInfoCodeConfigs: [
                            {
                                dataValue: [{ id: 'Eq21001' }],
                                infoCode: 'relACVTSF',
                                infoCodeName: '接力风机',
                                infoCodeType: 'RWD_OBJECT_DETAIL',
                                sequence: 18
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 'Eq4403050002e58f8505a2af45eaa89327c2b6f302bf',
        localName: '设备-01',
        objType: OBJ_TYPE.EQUIPMENT,
        classCode: 'ACATAH',
        relInfoCodeGroupConfigs: [
            {
                groupCode: 'equipStatus',
                groupName: '设备状态',
                groupOrder: 101,
                relInfoCodeConfigs: [
                    {
                        additionalMapValue: {},
                        dataSource: [
                            {
                                code: '0',
                                name: '停止'
                            },
                            {
                                code: '1',
                                name: '运行'
                            }
                        ],
                        dataTime: '2026-05-06 14:15:00',
                        dataValue: '0',
                        infoCode: 'runStatus',
                        infoCodeName: '运行状态',
                        infoCodeType: 'IOT_RUNNING',
                        existsIotRule: true,
                        relTemplateTypeId: '2029009988456767490',
                        sequence: 1,
                        originDataType: 'Boolv'
                    },
                    {
                        additionalMapValue: {},
                        dataSource: [
                            {
                                code: '0',
                                name: '手动'
                            },
                            {
                                code: '1',
                                name: '自动'
                            }
                        ],
                        dataTime: '2026-05-06 14:15:00',
                        dataValue: '1',
                        infoCode: 'manualAutoStatus',
                        infoCodeName: '手自动状态',
                        infoCodeType: 'IOT_RUNNING',
                        existsIotRule: true,
                        relTemplateTypeId: '2029009988456767490',
                        sequence: 2,
                        originDataType: 'Boolv'
                    },
                    {
                        additionalMapValue: {},
                        dataSource: [
                            {
                                code: '0',
                                name: '离线'
                            },
                            {
                                code: '1',
                                name: '在线'
                            }
                        ],
                        dataTime: '2026-05-06 14:15:00',
                        dataValue: '1',
                        infoCode: 'onlineStatus',
                        infoCodeName: '在线状态',
                        infoCodeType: 'IOT_RUNNING',
                        existsIotRule: true,
                        relTemplateTypeId: '2029009988456767490',
                        sequence: 3,
                        originDataType: 'Boolv'
                    },
                    {
                        additionalMapValue: {},
                        dataSource: [
                            {
                                code: '0',
                                name: '本地'
                            },
                            {
                                code: '1',
                                name: '远程'
                            }
                        ],
                        dataTime: '2026-05-06 14:15:00',
                        dataValue: '1',
                        infoCode: 'localRemoteStatus',
                        infoCodeName: '本地远程状态',
                        infoCodeType: 'IOT_RUNNING',
                        existsIotRule: true,
                        relTemplateTypeId: '2029009988456767490',
                        sequence: 4,
                        originDataType: 'Boolv'
                    }
                ]
            },
            {
                groupCode: 'airConditioningEquipment',
                groupName: '空调设备',
                groupOrder: 19,
                groupChildren: [
                    {
                        groupCode: 'airConditioningEquipmentChildren',
                        groupName: '空调下级',
                        groupOrder: 20,
                        relInfoCodeConfigs: [
                            {
                                dataValue: [{ id: 'Eq00001' }, { id: 'Eq00002' }],
                                infoCode: 'relACVTSF',
                                infoCodeName: '接力风机',
                                infoCodeType: 'RWD_OBJECT_DETAIL',
                                sequence: 18
                            }
                        ]
                    }
                ]
            },
            {
                groupCode: 'runningParameter',
                groupName: '运行参数',
                groupOrder: 1,
                relInfoCodeConfigs: [
                    {
                        additionalMapValue: {},
                        dataTime: '2026-05-06 14:25:00',
                        dataValue: '9.4',
                        infoCode: 'evapWaterOutTemp',
                        infoCodeName: '蒸发器出口水温',
                        infoCodeType: 'IOT_RUNNING',
                        existsIotRule: true,
                        relTemplateTypeId: '2036683970109206529',
                        scale: 1,
                        sequence: 1,
                        unit: '℃',
                        originDataType: 'Inst'
                    },
                    {
                        additionalMapValue: {},
                        dataTime: '2026-05-06 14:25:00',
                        dataValue: '12.8',
                        infoCode: 'evapWaterInTemp',
                        infoCodeName: '蒸发器入口水温',
                        infoCodeType: 'IOT_RUNNING',
                        existsIotRule: true,
                        relTemplateTypeId: '2036683970109206529',
                        scale: 1,
                        sequence: 2,
                        unit: '℃',
                        originDataType: 'Inst'
                    },
                    {
                        additionalMapValue: {},
                        dataTime: '2026-05-06 14:25:00',
                        dataValue: '8805.4',
                        infoCode: 'evapPress',
                        infoCodeName: '蒸发压力',
                        infoCodeType: 'IOT_RUNNING',
                        existsIotRule: true,
                        relTemplateTypeId: '2036683970109206529',
                        scale: 1,
                        sequence: 5,
                        unit: 'kPa',
                        originDataType: 'Inst'
                    },
                    {
                        additionalMapValue: {},
                        dataTime: '2026-05-06 14:25:00',
                        dataValue: '765.1',
                        infoCode: 'evapTemp',
                        infoCodeName: '蒸发温度',
                        infoCodeType: 'IOT_RUNNING',
                        existsIotRule: true,
                        relTemplateTypeId: '2036683970109206529',
                        scale: 1,
                        sequence: 6,
                        unit: '℃',
                        originDataType: 'Inst'
                    },
                    {
                        additionalMapValue: {},
                        dataTime: '2026-05-06 14:25:00',
                        dataValue: '7.1',
                        infoCode: 'evapApproachTemp',
                        infoCodeName: '蒸发趋近温度',
                        infoCodeType: 'IOT_RUNNING',
                        existsIotRule: true,
                        relTemplateTypeId: '2036683970109206529',
                        scale: 1,
                        sequence: 7,
                        unit: '℃',
                        originDataType: 'Inst'
                    }
                ]
            }
        ]
    },
    {
        id: 'Eq00001',
        localName: '设备-02',
        objType: OBJ_TYPE.EQUIPMENT,
        classCode: 'ACATAH',
        relInfoCodeGroupConfigs: [
            {
                groupCode: 'equipStatus',
                groupName: '设备状态',
                groupOrder: 101,
                relInfoCodeConfigs: [
                    {
                        additionalMapValue: {},
                        dataSource: [
                            {
                                code: '0',
                                name: '停止'
                            },
                            {
                                code: '1',
                                name: '运行'
                            }
                        ],
                        dataTime: '2026-05-06 14:15:00',
                        dataValue: '0',
                        infoCode: 'runStatus',
                        infoCodeName: '运行状态',
                        infoCodeType: 'IOT_RUNNING',
                        existsIotRule: true,
                        relTemplateTypeId: '2029009988456767490',
                        sequence: 1,
                        originDataType: 'Boolv'
                    },
                    {
                        additionalMapValue: {},
                        dataSource: [
                            {
                                code: '0',
                                name: '手动'
                            },
                            {
                                code: '1',
                                name: '自动'
                            }
                        ],
                        dataTime: '2026-05-06 14:15:00',
                        dataValue: '1',
                        infoCode: 'manualAutoStatus',
                        infoCodeName: '手自动状态',
                        infoCodeType: 'IOT_RUNNING',
                        existsIotRule: true,
                        relTemplateTypeId: '2029009988456767490',
                        sequence: 2,
                        originDataType: 'Boolv'
                    },
                    {
                        additionalMapValue: {},
                        dataSource: [
                            {
                                code: '0',
                                name: '离线'
                            },
                            {
                                code: '1',
                                name: '在线'
                            }
                        ],
                        dataTime: '2026-05-06 14:15:00',
                        dataValue: '1',
                        infoCode: 'onlineStatus',
                        infoCodeName: '在线状态',
                        infoCodeType: 'IOT_RUNNING',
                        existsIotRule: true,
                        relTemplateTypeId: '2029009988456767490',
                        sequence: 3,
                        originDataType: 'Boolv'
                    },
                    {
                        additionalMapValue: {},
                        dataSource: [
                            {
                                code: '0',
                                name: '本地'
                            },
                            {
                                code: '1',
                                name: '远程'
                            }
                        ],
                        dataTime: '2026-05-06 14:15:00',
                        dataValue: '1',
                        infoCode: 'localRemoteStatus',
                        infoCodeName: '本地远程状态',
                        infoCodeType: 'IOT_RUNNING',
                        existsIotRule: true,
                        relTemplateTypeId: '2029009988456767490',
                        sequence: 4,
                        originDataType: 'Boolv'
                    }
                ]
            },
            {
                groupCode: 'airConditioningEquipment',
                groupName: '空调设备',
                groupOrder: 19,
                groupChildren: [
                    {
                        groupCode: 'airConditioningEquipmentChildren',
                        groupName: '空调下级',
                        groupOrder: 20,
                        relInfoCodeConfigs: [
                            {
                                dataValue: [{ id: 'Eq00003' }],
                                infoCode: 'relACVTSF',
                                infoCodeName: '接力风机',
                                infoCodeType: 'RWD_OBJECT_DETAIL',
                                sequence: 18
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 'Eq00002',
        localName: '设备-03',
        objType: OBJ_TYPE.EQUIPMENT,
        classCode: 'ACATAH',
        relInfoCodeGroupConfigs: [
            {
                groupCode: 'equipStatus',
                groupName: '设备状态',
                groupOrder: 101,
                relInfoCodeConfigs: [
                    {
                        additionalMapValue: {},
                        dataSource: [
                            {
                                code: '0',
                                name: '停止'
                            },
                            {
                                code: '1',
                                name: '运行'
                            }
                        ],
                        dataTime: '2026-05-06 14:15:00',
                        dataValue: '0',
                        infoCode: 'runStatus',
                        infoCodeName: '运行状态',
                        infoCodeType: 'IOT_RUNNING',
                        existsIotRule: true,
                        relTemplateTypeId: '2029009988456767490',
                        sequence: 1,
                        originDataType: 'Boolv'
                    },
                    {
                        additionalMapValue: {},
                        dataSource: [
                            {
                                code: '0',
                                name: '手动'
                            },
                            {
                                code: '1',
                                name: '自动'
                            }
                        ],
                        dataTime: '2026-05-06 14:15:00',
                        dataValue: '1',
                        infoCode: 'manualAutoStatus',
                        infoCodeName: '手自动状态',
                        infoCodeType: 'IOT_RUNNING',
                        existsIotRule: true,
                        relTemplateTypeId: '2029009988456767490',
                        sequence: 2,
                        originDataType: 'Boolv'
                    },
                    {
                        additionalMapValue: {},
                        dataSource: [
                            {
                                code: '0',
                                name: '离线'
                            },
                            {
                                code: '1',
                                name: '在线'
                            }
                        ],
                        dataTime: '2026-05-06 14:15:00',
                        dataValue: '1',
                        infoCode: 'onlineStatus',
                        infoCodeName: '在线状态',
                        infoCodeType: 'IOT_RUNNING',
                        existsIotRule: true,
                        relTemplateTypeId: '2029009988456767490',
                        sequence: 3,
                        originDataType: 'Boolv'
                    },
                    {
                        additionalMapValue: {},
                        dataSource: [
                            {
                                code: '0',
                                name: '本地'
                            },
                            {
                                code: '1',
                                name: '远程'
                            }
                        ],
                        dataTime: '2026-05-06 14:15:00',
                        dataValue: '1',
                        infoCode: 'localRemoteStatus',
                        infoCodeName: '本地远程状态',
                        infoCodeType: 'IOT_RUNNING',
                        existsIotRule: true,
                        relTemplateTypeId: '2029009988456767490',
                        sequence: 4,
                        originDataType: 'Boolv'
                    }
                ]
            },
            {
                groupCode: 'airConditioningEquipment',
                groupName: '空调设备',
                groupOrder: 19,
                groupChildren: [
                    {
                        groupCode: 'airConditioningEquipmentChildren',
                        groupName: '空调下级',
                        groupOrder: 20,
                        relInfoCodeConfigs: [
                            {
                                dataValue: [{ id: 'Eq00003' }],
                                infoCode: 'relACVTSF',
                                infoCodeName: '接力风机',
                                infoCodeType: 'RWD_OBJECT_DETAIL',
                                sequence: 18
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 'Eq00003',
        localName: '设备-04',
        objType: OBJ_TYPE.EQUIPMENT,
        classCode: 'ACATAH',
        relInfoCodeGroupConfigs: [
            {
                groupCode: 'equipStatus',
                groupName: '设备状态',
                groupOrder: 101,
                relInfoCodeConfigs: [
                    {
                        additionalMapValue: {},
                        dataSource: [
                            {
                                code: '0',
                                name: '停止'
                            },
                            {
                                code: '1',
                                name: '运行'
                            }
                        ],
                        dataTime: '2026-05-06 14:15:00',
                        dataValue: '0',
                        infoCode: 'runStatus',
                        infoCodeName: '运行状态',
                        infoCodeType: 'IOT_RUNNING',
                        existsIotRule: true,
                        relTemplateTypeId: '2029009988456767490',
                        sequence: 1,
                        originDataType: 'Boolv'
                    },
                    {
                        additionalMapValue: {},
                        dataSource: [
                            {
                                code: '0',
                                name: '手动'
                            },
                            {
                                code: '1',
                                name: '自动'
                            }
                        ],
                        dataTime: '2026-05-06 14:15:00',
                        dataValue: '1',
                        infoCode: 'manualAutoStatus',
                        infoCodeName: '手自动状态',
                        infoCodeType: 'IOT_RUNNING',
                        existsIotRule: true,
                        relTemplateTypeId: '2029009988456767490',
                        sequence: 2,
                        originDataType: 'Boolv'
                    },
                    {
                        additionalMapValue: {},
                        dataSource: [
                            {
                                code: '0',
                                name: '离线'
                            },
                            {
                                code: '1',
                                name: '在线'
                            }
                        ],
                        dataTime: '2026-05-06 14:15:00',
                        dataValue: '1',
                        infoCode: 'onlineStatus',
                        infoCodeName: '在线状态',
                        infoCodeType: 'IOT_RUNNING',
                        existsIotRule: true,
                        relTemplateTypeId: '2029009988456767490',
                        sequence: 3,
                        originDataType: 'Boolv'
                    },
                    {
                        additionalMapValue: {},
                        dataSource: [
                            {
                                code: '0',
                                name: '本地'
                            },
                            {
                                code: '1',
                                name: '远程'
                            }
                        ],
                        dataTime: '2026-05-06 14:15:00',
                        dataValue: '1',
                        infoCode: 'localRemoteStatus',
                        infoCodeName: '本地远程状态',
                        infoCodeType: 'IOT_RUNNING',
                        existsIotRule: true,
                        relTemplateTypeId: '2029009988456767490',
                        sequence: 4,
                        originDataType: 'Boolv'
                    }
                ]
            },
            {
                groupCode: 'airConditioningEquipment',
                groupName: '空调设备',
                groupOrder: 19,
                groupChildren: [
                    {
                        groupCode: 'airConditioningEquipmentChildren',
                        groupName: '空调下级',
                        groupOrder: 20,
                        relInfoCodeConfigs: [
                            {
                                dataValue: [{ id: 'Eq00004' }],
                                infoCode: 'relACVTSF',
                                infoCodeName: '接力风机',
                                infoCodeType: 'RWD_OBJECT_DETAIL',
                                sequence: 18
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 'Eq00004',
        localName: '设备-05',
        objType: OBJ_TYPE.EQUIPMENT,
        classCode: 'ACATAH',
        relInfoCodeGroupConfigs: [
            {
                groupCode: 'equipStatus',
                groupName: '设备状态',
                groupOrder: 101,
                relInfoCodeConfigs: [
                    {
                        additionalMapValue: {},
                        dataSource: [
                            {
                                code: '0',
                                name: '停止'
                            },
                            {
                                code: '1',
                                name: '运行'
                            }
                        ],
                        dataTime: '2026-05-06 14:15:00',
                        dataValue: '0',
                        infoCode: 'runStatus',
                        infoCodeName: '运行状态',
                        infoCodeType: 'IOT_RUNNING',
                        existsIotRule: true,
                        relTemplateTypeId: '2029009988456767490',
                        sequence: 1,
                        originDataType: 'Boolv'
                    },
                    {
                        additionalMapValue: {},
                        dataSource: [
                            {
                                code: '0',
                                name: '手动'
                            },
                            {
                                code: '1',
                                name: '自动'
                            }
                        ],
                        dataTime: '2026-05-06 14:15:00',
                        dataValue: '1',
                        infoCode: 'manualAutoStatus',
                        infoCodeName: '手自动状态',
                        infoCodeType: 'IOT_RUNNING',
                        existsIotRule: true,
                        relTemplateTypeId: '2029009988456767490',
                        sequence: 2,
                        originDataType: 'Boolv'
                    },
                    {
                        additionalMapValue: {},
                        dataSource: [
                            {
                                code: '0',
                                name: '离线'
                            },
                            {
                                code: '1',
                                name: '在线'
                            }
                        ],
                        dataTime: '2026-05-06 14:15:00',
                        dataValue: '1',
                        infoCode: 'onlineStatus',
                        infoCodeName: '在线状态',
                        infoCodeType: 'IOT_RUNNING',
                        existsIotRule: true,
                        relTemplateTypeId: '2029009988456767490',
                        sequence: 3,
                        originDataType: 'Boolv'
                    },
                    {
                        additionalMapValue: {},
                        dataSource: [
                            {
                                code: '0',
                                name: '本地'
                            },
                            {
                                code: '1',
                                name: '远程'
                            }
                        ],
                        dataTime: '2026-05-06 14:15:00',
                        dataValue: '1',
                        infoCode: 'localRemoteStatus',
                        infoCodeName: '本地远程状态',
                        infoCodeType: 'IOT_RUNNING',
                        existsIotRule: true,
                        relTemplateTypeId: '2029009988456767490',
                        sequence: 4,
                        originDataType: 'Boolv'
                    }
                ]
            },
            {
                groupCode: 'airConditioningEquipment',
                groupName: '空调设备',
                groupOrder: 19,
                groupChildren: [
                    {
                        groupCode: 'airConditioningEquipmentChildren',
                        groupName: '空调下级',
                        groupOrder: 20,
                        relInfoCodeConfigs: []
                    }
                ]
            }
        ]
    },
    {
        id: 'Eq20001',
        localName: '设备-201',
        objType: OBJ_TYPE.EQUIPMENT,
        classCode: 'ACATAH',
        relInfoCodeGroupConfigs: [
            {
                groupCode: 'equipStatus',
                groupName: '设备状态',
                groupOrder: 101,
                relInfoCodeConfigs: [
                    {
                        additionalMapValue: {},
                        dataSource: [
                            {
                                code: '0',
                                name: '停止'
                            },
                            {
                                code: '1',
                                name: '运行'
                            }
                        ],
                        dataTime: '2026-05-06 14:15:00',
                        dataValue: '0',
                        infoCode: 'runStatus',
                        infoCodeName: '运行状态',
                        infoCodeType: 'IOT_RUNNING',
                        existsIotRule: true,
                        relTemplateTypeId: '2029009988456767490',
                        sequence: 1,
                        originDataType: 'Boolv'
                    },
                    {
                        additionalMapValue: {},
                        dataSource: [
                            {
                                code: '0',
                                name: '手动'
                            },
                            {
                                code: '1',
                                name: '自动'
                            }
                        ],
                        dataTime: '2026-05-06 14:15:00',
                        dataValue: '1',
                        infoCode: 'manualAutoStatus',
                        infoCodeName: '手自动状态',
                        infoCodeType: 'IOT_RUNNING',
                        existsIotRule: true,
                        relTemplateTypeId: '2029009988456767490',
                        sequence: 2,
                        originDataType: 'Boolv'
                    },
                    {
                        additionalMapValue: {},
                        dataSource: [
                            {
                                code: '0',
                                name: '离线'
                            },
                            {
                                code: '1',
                                name: '在线'
                            }
                        ],
                        dataTime: '2026-05-06 14:15:00',
                        dataValue: '1',
                        infoCode: 'onlineStatus',
                        infoCodeName: '在线状态',
                        infoCodeType: 'IOT_RUNNING',
                        existsIotRule: true,
                        relTemplateTypeId: '2029009988456767490',
                        sequence: 3,
                        originDataType: 'Boolv'
                    },
                    {
                        additionalMapValue: {},
                        dataSource: [
                            {
                                code: '0',
                                name: '本地'
                            },
                            {
                                code: '1',
                                name: '远程'
                            }
                        ],
                        dataTime: '2026-05-06 14:15:00',
                        dataValue: '1',
                        infoCode: 'localRemoteStatus',
                        infoCodeName: '本地远程状态',
                        infoCodeType: 'IOT_RUNNING',
                        existsIotRule: true,
                        relTemplateTypeId: '2029009988456767490',
                        sequence: 4,
                        originDataType: 'Boolv'
                    }
                ]
            }
        ]
    },
    {
        id: 'Eq20002',
        localName: '设备-202',
        objType: OBJ_TYPE.EQUIPMENT,
        classCode: 'ACATAH',
        relInfoCodeGroupConfigs: [
            {
                groupCode: 'equipStatus',
                groupName: '设备状态',
                groupOrder: 101,
                relInfoCodeConfigs: [
                    {
                        additionalMapValue: {},
                        dataSource: [
                            {
                                code: '0',
                                name: '停止'
                            },
                            {
                                code: '1',
                                name: '运行'
                            }
                        ],
                        dataTime: '2026-05-06 14:15:00',
                        dataValue: '0',
                        infoCode: 'runStatus',
                        infoCodeName: '运行状态',
                        infoCodeType: 'IOT_RUNNING',
                        existsIotRule: true,
                        relTemplateTypeId: '2029009988456767490',
                        sequence: 1,
                        originDataType: 'Boolv'
                    },
                    {
                        additionalMapValue: {},
                        dataSource: [
                            {
                                code: '0',
                                name: '手动'
                            },
                            {
                                code: '1',
                                name: '自动'
                            }
                        ],
                        dataTime: '2026-05-06 14:15:00',
                        dataValue: '1',
                        infoCode: 'manualAutoStatus',
                        infoCodeName: '手自动状态',
                        infoCodeType: 'IOT_RUNNING',
                        existsIotRule: true,
                        relTemplateTypeId: '2029009988456767490',
                        sequence: 2,
                        originDataType: 'Boolv'
                    },
                    {
                        additionalMapValue: {},
                        dataSource: [
                            {
                                code: '0',
                                name: '离线'
                            },
                            {
                                code: '1',
                                name: '在线'
                            }
                        ],
                        dataTime: '2026-05-06 14:15:00',
                        dataValue: '1',
                        infoCode: 'onlineStatus',
                        infoCodeName: '在线状态',
                        infoCodeType: 'IOT_RUNNING',
                        existsIotRule: true,
                        relTemplateTypeId: '2029009988456767490',
                        sequence: 3,
                        originDataType: 'Boolv'
                    },
                    {
                        additionalMapValue: {},
                        dataSource: [
                            {
                                code: '0',
                                name: '本地'
                            },
                            {
                                code: '1',
                                name: '远程'
                            }
                        ],
                        dataTime: '2026-05-06 14:15:00',
                        dataValue: '1',
                        infoCode: 'localRemoteStatus',
                        infoCodeName: '本地远程状态',
                        infoCodeType: 'IOT_RUNNING',
                        existsIotRule: true,
                        relTemplateTypeId: '2029009988456767490',
                        sequence: 4,
                        originDataType: 'Boolv'
                    }
                ]
            }
        ]
    },
    {
        id: 'Eq20003',
        localName: '设备-203',
        objType: OBJ_TYPE.EQUIPMENT,
        classCode: 'ACATAH',
        relInfoCodeGroupConfigs: [
            {
                groupCode: 'equipStatus',
                groupName: '设备状态',
                groupOrder: 101,
                relInfoCodeConfigs: [
                    {
                        additionalMapValue: {},
                        dataSource: [
                            {
                                code: '0',
                                name: '停止'
                            },
                            {
                                code: '1',
                                name: '运行'
                            }
                        ],
                        dataTime: '2026-05-06 14:15:00',
                        dataValue: '0',
                        infoCode: 'runStatus',
                        infoCodeName: '运行状态',
                        infoCodeType: 'IOT_RUNNING',
                        existsIotRule: true,
                        relTemplateTypeId: '2029009988456767490',
                        sequence: 1,
                        originDataType: 'Boolv'
                    },
                    {
                        additionalMapValue: {},
                        dataSource: [
                            {
                                code: '0',
                                name: '手动'
                            },
                            {
                                code: '1',
                                name: '自动'
                            }
                        ],
                        dataTime: '2026-05-06 14:15:00',
                        dataValue: '1',
                        infoCode: 'manualAutoStatus',
                        infoCodeName: '手自动状态',
                        infoCodeType: 'IOT_RUNNING',
                        existsIotRule: true,
                        relTemplateTypeId: '2029009988456767490',
                        sequence: 2,
                        originDataType: 'Boolv'
                    },
                    {
                        additionalMapValue: {},
                        dataSource: [
                            {
                                code: '0',
                                name: '离线'
                            },
                            {
                                code: '1',
                                name: '在线'
                            }
                        ],
                        dataTime: '2026-05-06 14:15:00',
                        dataValue: '1',
                        infoCode: 'onlineStatus',
                        infoCodeName: '在线状态',
                        infoCodeType: 'IOT_RUNNING',
                        existsIotRule: true,
                        relTemplateTypeId: '2029009988456767490',
                        sequence: 3,
                        originDataType: 'Boolv'
                    },
                    {
                        additionalMapValue: {},
                        dataSource: [
                            {
                                code: '0',
                                name: '本地'
                            },
                            {
                                code: '1',
                                name: '远程'
                            }
                        ],
                        dataTime: '2026-05-06 14:15:00',
                        dataValue: '1',
                        infoCode: 'localRemoteStatus',
                        infoCodeName: '本地远程状态',
                        infoCodeType: 'IOT_RUNNING',
                        existsIotRule: true,
                        relTemplateTypeId: '2029009988456767490',
                        sequence: 4,
                        originDataType: 'Boolv'
                    }
                ]
            }
        ]
    },
    {
        id: 'Eq21001',
        localName: '设备-Eq21001',
        objType: OBJ_TYPE.EQUIPMENT,
        classCode: 'ACATAH',
        relInfoCodeGroupConfigs: [
            {
                groupCode: 'equipStatus',
                groupName: '设备状态',
                groupOrder: 101,
                relInfoCodeConfigs: [
                    {
                        additionalMapValue: {},
                        dataSource: [
                            {
                                code: '0',
                                name: '停止'
                            },
                            {
                                code: '1',
                                name: '运行'
                            }
                        ],
                        dataTime: '2026-05-06 14:15:00',
                        dataValue: '0',
                        infoCode: 'runStatus',
                        infoCodeName: '运行状态',
                        infoCodeType: 'IOT_RUNNING',
                        existsIotRule: true,
                        relTemplateTypeId: '2029009988456767490',
                        sequence: 1,
                        originDataType: 'Boolv'
                    },
                    {
                        additionalMapValue: {},
                        dataSource: [
                            {
                                code: '0',
                                name: '手动'
                            },
                            {
                                code: '1',
                                name: '自动'
                            }
                        ],
                        dataTime: '2026-05-06 14:15:00',
                        dataValue: '1',
                        infoCode: 'manualAutoStatus',
                        infoCodeName: '手自动状态',
                        infoCodeType: 'IOT_RUNNING',
                        existsIotRule: true,
                        relTemplateTypeId: '2029009988456767490',
                        sequence: 2,
                        originDataType: 'Boolv'
                    },
                    {
                        additionalMapValue: {},
                        dataSource: [
                            {
                                code: '0',
                                name: '离线'
                            },
                            {
                                code: '1',
                                name: '在线'
                            }
                        ],
                        dataTime: '2026-05-06 14:15:00',
                        dataValue: '1',
                        infoCode: 'onlineStatus',
                        infoCodeName: '在线状态',
                        infoCodeType: 'IOT_RUNNING',
                        existsIotRule: true,
                        relTemplateTypeId: '2029009988456767490',
                        sequence: 3,
                        originDataType: 'Boolv'
                    },
                    {
                        additionalMapValue: {},
                        dataSource: [
                            {
                                code: '0',
                                name: '本地'
                            },
                            {
                                code: '1',
                                name: '远程'
                            }
                        ],
                        dataTime: '2026-05-06 14:15:00',
                        dataValue: '1',
                        infoCode: 'localRemoteStatus',
                        infoCodeName: '本地远程状态',
                        infoCodeType: 'IOT_RUNNING',
                        existsIotRule: true,
                        relTemplateTypeId: '2029009988456767490',
                        sequence: 4,
                        originDataType: 'Boolv'
                    }
                ]
            }
        ]
    },
    {
        id: 'Eq40001',
        localName: '设备-Eq40001',
        objType: OBJ_TYPE.EQUIPMENT,
        classCode: 'ACATAH',
        relInfoCodeGroupConfigs: [
            {
                groupCode: 'equipStatus',
                groupName: '设备状态',
                groupOrder: 101,
                relInfoCodeConfigs: [
                    {
                        additionalMapValue: {},
                        dataSource: [
                            {
                                code: '0',
                                name: '停止'
                            },
                            {
                                code: '1',
                                name: '运行'
                            }
                        ],
                        dataTime: '2026-05-06 14:15:00',
                        dataValue: '0',
                        infoCode: 'runStatus',
                        infoCodeName: '运行状态',
                        infoCodeType: 'IOT_RUNNING',
                        existsIotRule: true,
                        relTemplateTypeId: '2029009988456767490',
                        sequence: 1,
                        originDataType: 'Boolv'
                    },
                    {
                        additionalMapValue: {},
                        dataSource: [
                            {
                                code: '0',
                                name: '手动'
                            },
                            {
                                code: '1',
                                name: '自动'
                            }
                        ],
                        dataTime: '2026-05-06 14:15:00',
                        dataValue: '1',
                        infoCode: 'manualAutoStatus',
                        infoCodeName: '手自动状态',
                        infoCodeType: 'IOT_RUNNING',
                        existsIotRule: true,
                        relTemplateTypeId: '2029009988456767490',
                        sequence: 2,
                        originDataType: 'Boolv'
                    },
                    {
                        additionalMapValue: {},
                        dataSource: [
                            {
                                code: '0',
                                name: '离线'
                            },
                            {
                                code: '1',
                                name: '在线'
                            }
                        ],
                        dataTime: '2026-05-06 14:15:00',
                        dataValue: '1',
                        infoCode: 'onlineStatus',
                        infoCodeName: '在线状态',
                        infoCodeType: 'IOT_RUNNING',
                        existsIotRule: true,
                        relTemplateTypeId: '2029009988456767490',
                        sequence: 3,
                        originDataType: 'Boolv'
                    },
                    {
                        additionalMapValue: {},
                        dataSource: [
                            {
                                code: '0',
                                name: '本地'
                            },
                            {
                                code: '1',
                                name: '远程'
                            }
                        ],
                        dataTime: '2026-05-06 14:15:00',
                        dataValue: '1',
                        infoCode: 'localRemoteStatus',
                        infoCodeName: '本地远程状态',
                        infoCodeType: 'IOT_RUNNING',
                        existsIotRule: true,
                        relTemplateTypeId: '2029009988456767490',
                        sequence: 4,
                        originDataType: 'Boolv'
                    }
                ]
            },
            {
                groupCode: 'ventilationEquipment',
                groupName: '通风设备',
                groupOrder: 19,
                groupChildren: [
                    {
                        groupCode: 'ventilationEquipmentChildren',
                        groupName: '通风下级',
                        groupOrder: 20,
                        relInfoCodeConfigs: [
                            {
                                dataValue: [{ id: 'Eq41001' }],
                                infoCode: 'relACVTSF',
                                infoCodeName: '接力风机',
                                infoCodeType: 'RWD_OBJECT_DETAIL',
                                sequence: 18
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 'Eq41001',
        localName: '设备-Eq41001',
        objType: OBJ_TYPE.EQUIPMENT,
        classCode: 'ACATAH',
        relInfoCodeGroupConfigs: [
            {
                groupCode: 'equipStatus',
                groupName: '设备状态',
                groupOrder: 101,
                relInfoCodeConfigs: [
                    {
                        additionalMapValue: {},
                        dataSource: [
                            {
                                code: '0',
                                name: '停止'
                            },
                            {
                                code: '1',
                                name: '运行'
                            }
                        ],
                        dataTime: '2026-05-06 14:15:00',
                        dataValue: '0',
                        infoCode: 'runStatus',
                        infoCodeName: '运行状态',
                        infoCodeType: 'IOT_RUNNING',
                        existsIotRule: true,
                        relTemplateTypeId: '2029009988456767490',
                        sequence: 1,
                        originDataType: 'Boolv'
                    },
                    {
                        additionalMapValue: {},
                        dataSource: [
                            {
                                code: '0',
                                name: '手动'
                            },
                            {
                                code: '1',
                                name: '自动'
                            }
                        ],
                        dataTime: '2026-05-06 14:15:00',
                        dataValue: '1',
                        infoCode: 'manualAutoStatus',
                        infoCodeName: '手自动状态',
                        infoCodeType: 'IOT_RUNNING',
                        existsIotRule: true,
                        relTemplateTypeId: '2029009988456767490',
                        sequence: 2,
                        originDataType: 'Boolv'
                    },
                    {
                        additionalMapValue: {},
                        dataSource: [
                            {
                                code: '0',
                                name: '离线'
                            },
                            {
                                code: '1',
                                name: '在线'
                            }
                        ],
                        dataTime: '2026-05-06 14:15:00',
                        dataValue: '1',
                        infoCode: 'onlineStatus',
                        infoCodeName: '在线状态',
                        infoCodeType: 'IOT_RUNNING',
                        existsIotRule: true,
                        relTemplateTypeId: '2029009988456767490',
                        sequence: 3,
                        originDataType: 'Boolv'
                    },
                    {
                        additionalMapValue: {},
                        dataSource: [
                            {
                                code: '0',
                                name: '本地'
                            },
                            {
                                code: '1',
                                name: '远程'
                            }
                        ],
                        dataTime: '2026-05-06 14:15:00',
                        dataValue: '1',
                        infoCode: 'localRemoteStatus',
                        infoCodeName: '本地远程状态',
                        infoCodeType: 'IOT_RUNNING',
                        existsIotRule: true,
                        relTemplateTypeId: '2029009988456767490',
                        sequence: 4,
                        originDataType: 'Boolv'
                    }
                ]
            },
            {
                groupCode: 'ventilationEquipment',
                groupName: '通风设备',
                groupOrder: 19,
                groupChildren: [
                    {
                        groupCode: 'ventilationEquipmentChildren',
                        groupName: '通风下级',
                        groupOrder: 20,
                        relInfoCodeConfigs: [
                            {
                                dataValue: [{ id: 'Eq41002' }],
                                infoCode: 'relACVTSF',
                                infoCodeName: '接力风机',
                                infoCodeType: 'RWD_OBJECT_DETAIL',
                                sequence: 18
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 'Eq41002',
        localName: '设备-Eq41002',
        objType: OBJ_TYPE.EQUIPMENT,
        classCode: 'ACATAH',
        relInfoCodeGroupConfigs: [
            {
                groupCode: 'equipStatus',
                groupName: '设备状态',
                groupOrder: 101,
                relInfoCodeConfigs: [
                    {
                        additionalMapValue: {},
                        dataSource: [
                            {
                                code: '0',
                                name: '停止'
                            },
                            {
                                code: '1',
                                name: '运行'
                            }
                        ],
                        dataTime: '2026-05-06 14:15:00',
                        dataValue: '0',
                        infoCode: 'runStatus',
                        infoCodeName: '运行状态',
                        infoCodeType: 'IOT_RUNNING',
                        existsIotRule: true,
                        relTemplateTypeId: '2029009988456767490',
                        sequence: 1,
                        originDataType: 'Boolv'
                    },
                    {
                        additionalMapValue: {},
                        dataSource: [
                            {
                                code: '0',
                                name: '手动'
                            },
                            {
                                code: '1',
                                name: '自动'
                            }
                        ],
                        dataTime: '2026-05-06 14:15:00',
                        dataValue: '1',
                        infoCode: 'manualAutoStatus',
                        infoCodeName: '手自动状态',
                        infoCodeType: 'IOT_RUNNING',
                        existsIotRule: true,
                        relTemplateTypeId: '2029009988456767490',
                        sequence: 2,
                        originDataType: 'Boolv'
                    },
                    {
                        additionalMapValue: {},
                        dataSource: [
                            {
                                code: '0',
                                name: '离线'
                            },
                            {
                                code: '1',
                                name: '在线'
                            }
                        ],
                        dataTime: '2026-05-06 14:15:00',
                        dataValue: '1',
                        infoCode: 'onlineStatus',
                        infoCodeName: '在线状态',
                        infoCodeType: 'IOT_RUNNING',
                        existsIotRule: true,
                        relTemplateTypeId: '2029009988456767490',
                        sequence: 3,
                        originDataType: 'Boolv'
                    },
                    {
                        additionalMapValue: {},
                        dataSource: [
                            {
                                code: '0',
                                name: '本地'
                            },
                            {
                                code: '1',
                                name: '远程'
                            }
                        ],
                        dataTime: '2026-05-06 14:15:00',
                        dataValue: '1',
                        infoCode: 'localRemoteStatus',
                        infoCodeName: '本地远程状态',
                        infoCodeType: 'IOT_RUNNING',
                        existsIotRule: true,
                        relTemplateTypeId: '2029009988456767490',
                        sequence: 4,
                        originDataType: 'Boolv'
                    }
                ]
            },
            {
                groupCode: 'ventilationEquipment',
                groupName: '通风设备',
                groupOrder: 19,
                groupChildren: [
                    {
                        groupCode: 'ventilationEquipmentChildren',
                        groupName: '通风下级',
                        groupOrder: 20,
                        relInfoCodeConfigs: []
                    }
                ]
            }
        ]
    },
    {
        id: 'Eq11101',
        localName: '设备-Eq11101',
        objType: OBJ_TYPE.EQUIPMENT,
        classCode: 'ACATAH',
        relInfoCodeGroupConfigs: [
            {
                groupCode: 'equipStatus',
                groupName: '设备状态',
                groupOrder: 101,
                relInfoCodeConfigs: [
                    {
                        additionalMapValue: {},
                        dataSource: [
                            {
                                code: '0',
                                name: '停止'
                            },
                            {
                                code: '1',
                                name: '运行'
                            }
                        ],
                        dataTime: '2026-05-06 14:15:00',
                        dataValue: '0',
                        infoCode: 'runStatus',
                        infoCodeName: '运行状态',
                        infoCodeType: 'IOT_RUNNING',
                        existsIotRule: true,
                        relTemplateTypeId: '2029009988456767490',
                        sequence: 1,
                        originDataType: 'Boolv'
                    },
                    {
                        additionalMapValue: {},
                        dataSource: [
                            {
                                code: '0',
                                name: '手动'
                            },
                            {
                                code: '1',
                                name: '自动'
                            }
                        ],
                        dataTime: '2026-05-06 14:15:00',
                        dataValue: '1',
                        infoCode: 'manualAutoStatus',
                        infoCodeName: '手自动状态',
                        infoCodeType: 'IOT_RUNNING',
                        existsIotRule: true,
                        relTemplateTypeId: '2029009988456767490',
                        sequence: 2,
                        originDataType: 'Boolv'
                    },
                    {
                        additionalMapValue: {},
                        dataSource: [
                            {
                                code: '0',
                                name: '离线'
                            },
                            {
                                code: '1',
                                name: '在线'
                            }
                        ],
                        dataTime: '2026-05-06 14:15:00',
                        dataValue: '1',
                        infoCode: 'onlineStatus',
                        infoCodeName: '在线状态',
                        infoCodeType: 'IOT_RUNNING',
                        existsIotRule: true,
                        relTemplateTypeId: '2029009988456767490',
                        sequence: 3,
                        originDataType: 'Boolv'
                    },
                    {
                        additionalMapValue: {},
                        dataSource: [
                            {
                                code: '0',
                                name: '本地'
                            },
                            {
                                code: '1',
                                name: '远程'
                            }
                        ],
                        dataTime: '2026-05-06 14:15:00',
                        dataValue: '1',
                        infoCode: 'localRemoteStatus',
                        infoCodeName: '本地远程状态',
                        infoCodeType: 'IOT_RUNNING',
                        existsIotRule: true,
                        relTemplateTypeId: '2029009988456767490',
                        sequence: 4,
                        originDataType: 'Boolv'
                    }
                ]
            },
            {
                groupCode: 'ventilationEquipment',
                groupName: '通风设备',
                groupOrder: 19,
                groupChildren: [
                    {
                        groupCode: 'ventilationEquipmentChildren',
                        groupName: '通风下级',
                        groupOrder: 20,
                        relInfoCodeConfigs: []
                    }
                ]
            }
        ]
    },
    {
        id: 'Eq11102',
        localName: '设备-Eq11102',
        objType: OBJ_TYPE.EQUIPMENT,
        classCode: 'ACATAH',
        relInfoCodeGroupConfigs: [
            {
                groupCode: 'equipStatus',
                groupName: '设备状态',
                groupOrder: 101,
                relInfoCodeConfigs: [
                    {
                        additionalMapValue: {},
                        dataSource: [
                            {
                                code: '0',
                                name: '停止'
                            },
                            {
                                code: '1',
                                name: '运行'
                            }
                        ],
                        dataTime: '2026-05-06 14:15:00',
                        dataValue: '0',
                        infoCode: 'runStatus',
                        infoCodeName: '运行状态',
                        infoCodeType: 'IOT_RUNNING',
                        existsIotRule: true,
                        relTemplateTypeId: '2029009988456767490',
                        sequence: 1,
                        originDataType: 'Boolv'
                    },
                    {
                        additionalMapValue: {},
                        dataSource: [
                            {
                                code: '0',
                                name: '手动'
                            },
                            {
                                code: '1',
                                name: '自动'
                            }
                        ],
                        dataTime: '2026-05-06 14:15:00',
                        dataValue: '1',
                        infoCode: 'manualAutoStatus',
                        infoCodeName: '手自动状态',
                        infoCodeType: 'IOT_RUNNING',
                        existsIotRule: true,
                        relTemplateTypeId: '2029009988456767490',
                        sequence: 2,
                        originDataType: 'Boolv'
                    },
                    {
                        additionalMapValue: {},
                        dataSource: [
                            {
                                code: '0',
                                name: '离线'
                            },
                            {
                                code: '1',
                                name: '在线'
                            }
                        ],
                        dataTime: '2026-05-06 14:15:00',
                        dataValue: '1',
                        infoCode: 'onlineStatus',
                        infoCodeName: '在线状态',
                        infoCodeType: 'IOT_RUNNING',
                        existsIotRule: true,
                        relTemplateTypeId: '2029009988456767490',
                        sequence: 3,
                        originDataType: 'Boolv'
                    },
                    {
                        additionalMapValue: {},
                        dataSource: [
                            {
                                code: '0',
                                name: '本地'
                            },
                            {
                                code: '1',
                                name: '远程'
                            }
                        ],
                        dataTime: '2026-05-06 14:15:00',
                        dataValue: '1',
                        infoCode: 'localRemoteStatus',
                        infoCodeName: '本地远程状态',
                        infoCodeType: 'IOT_RUNNING',
                        existsIotRule: true,
                        relTemplateTypeId: '2029009988456767490',
                        sequence: 4,
                        originDataType: 'Boolv'
                    }
                ]
            },
            {
                groupCode: 'ventilationEquipment',
                groupName: '通风设备',
                groupOrder: 19,
                groupChildren: [
                    {
                        groupCode: 'ventilationEquipmentChildren',
                        groupName: '通风下级',
                        groupOrder: 20,
                        relInfoCodeConfigs: []
                    }
                ]
            }
        ]
    }
];
