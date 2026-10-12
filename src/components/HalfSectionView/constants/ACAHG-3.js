import i18n from '@/localization';
import { PART_SIZE_DEFINE } from '@/components/HalfSectionView/constants/config';

export default {
    code: 'ACAHG-3',
    ownClassCode: 'ACAHG',
    // 背景管道类型：dynamic/fixed 默认fixed
    pipeBgType: 'dynamic',
    // 默认
    pipeBgBaseInfo: {
        x: 0,
        y: 0
    },
    pipeDynBgInfos: {
        x: 0,
        y: 300,
        firstHeight: 188,
        middleHeight: 428
    },
    // 匹配规则（以下信息点且的关系）
    rule: {
        // 有无新风段:有
        isFreshAirSection: '0',
        // 有无排风段：无
        isExhaustAirSection: '0'
    },
    cutConfig: {
        //  剪裁限制数量
        yureGroup: 3
    },
    size: {
        width: 1602,
        height: 380
    },
    // 布局容器
    layoutContainers: {
        rowContainer1: {
            locationCenter: {
                x: 758,
                y: 414
            },
            width: 1316,
            gap: 10
        }
    },
    // 部件
    parts: [
        {
            code: 'chuanganqi',
            name: i18n.global.t('meos_control_web.half_view_chuanganqi'),
            nameStyle: {
                nameMaxWidth: {
                    // 类型：partWidthMultiple 部件宽度倍数/fixed 固定
                    type: 'partWidthMultiple',
                    value: 10
                }
            },
            // 部件位置类型：dynamic/fixed
            locationType: 'fixed',
            // 部件中心位置
            locationCenter: {
                x: 480,
                y: 47
            },

            // 部件尺寸
            size: PART_SIZE_DEFINE.chuanganqi,

            // 显示规则， 数组元素是或的关系
            showRules: [
                {
                    type: 'existsIotRule'
                }
            ],
            // showRules: [{ type: 'existsIotRule' }, { type: 'range', field: 'filterSectionNum', value: [2, 100000] }, { type: 'contain', field: 'filtType', value: '1' }]
            infoCard: {
                // 信息卡位置:left/top/right/bottom
                placement: 'top',
                // 信息卡偏移
                offset: {
                    // 偏移类型：relParentName 相对于父级名称/ fixed 囸定
                    type: 'fixed',
                    value: 26
                }
            }
        },
        {
            code: 'huifengfa',
            name: i18n.global.t('meos_control_web.half_view_huifengfa'),
            // 部件位置类型：dynamic/fixed
            locationType: 'fixed',
            // 部件中心位置
            locationCenter: {
                x: 61,
                y: 186
            },

            // 部件尺寸
            size: PART_SIZE_DEFINE.huifengfa,

            // 显示规则， 数组元素是或的关系
            showRules: [
                {
                    type: 'existsIotRule'
                }
            ],
            // showRules: [{ type: 'existsIotRule' }, { type: 'range', field: 'filterSectionNum', value: [2, 100000] }, { type: 'contain', field: 'filtType', value: '1' }]
            infoCard: {
                // 信息卡位置:left/top/right/bottom
                placement: 'right',
                // 信息卡偏移
                offset: {
                    // 偏移类型：relParentName 相对于父级名称/ fixed 囸定
                    type: 'fixed',
                    value: 16
                }
            }
        },

        {
            code: 'hunfengfa',
            name: i18n.global.t('meos_control_web.half_view_hunfengfa'),
            nameStyle: {
                translateY: '-100%'
            },
            // 关联在设备上展示（空调机组）
            isRelEquipment: true,
            // 部件位置类型：dynamic/fixed
            // locationType: 'fixed',
            locationType: 'dynamic',
            layout: 'flex',
            layoutContainer: 'rowContainer1',
            // 部件中心位置
            locationCenter: {
                x: 134,
                y: 414
            },

            // 部件尺寸
            size: PART_SIZE_DEFINE.hunfengfa,
            // 显示规则， 数组元素是或的关系
            showRules: [
                {
                    type: 'existsIotRule'
                }
            ],
            infoCard: {
                // 信息卡位置:left/top/right/bottom
                placement: 'top',
                // 信息卡偏移
                offset: {
                    // 偏移类型：relParentName 相对于父级名称/ fixed 囸定
                    type: 'fixed',
                    value: 10
                }
            }
        },
        {
            code: 'chuxiao',
            name: i18n.global.t('meos_control_web.half_view_chuxiao'),
            nameStyle: {
                translateY: '-100%'
            },
            // 关联在设备上展示（空调机组）
            isRelEquipment: true,
            // 部件位置类型：dynamic/fixed
            // locationType: 'fixed',
            locationType: 'dynamic',
            layout: 'flex',
            layoutContainer: 'rowContainer1',
            // 部件中心位置
            locationCenter: {
                x: 272,
                y: 414
            },

            // 部件尺寸
            size: PART_SIZE_DEFINE.chuxiao,
            // 显示规则， 数组元素是或的关系
            showRules: [{ type: 'contain', field: 'filtType', value: '1' }]
        },
        {
            code: 'zhongxiao',
            name: i18n.global.t('meos_control_web.half_view_zhongxiao'),
            nameStyle: {
                translateY: '-100%'
            },
            // 关联在设备上展示（空调机组）
            isRelEquipment: true,
            // 部件位置类型：dynamic/fixed
            // locationType: 'fixed',
            locationType: 'dynamic',
            layout: 'flex',
            layoutContainer: 'rowContainer1',
            // 部件中心位置
            locationCenter: {
                x: 383,
                y: 414
            },

            // 部件尺寸
            size: PART_SIZE_DEFINE.zhongxiao,

            // 显示规则， 数组元素是或的关系
            showRules: [{ type: 'contain', field: 'filtType', value: '2' }]
        },
        {
            code: 'jingdianchuchen',
            name: i18n.global.t('meos_control_web.half_view_jingdianchuchen'),
            nameStyle: {
                translateY: '-100%'
            },
            // 关联在设备上展示（空调机组）
            isRelEquipment: true,
            // 部件位置类型：dynamic/fixed
            // locationType: 'fixed',
            locationType: 'dynamic',
            layout: 'flex',
            layoutContainer: 'rowContainer1',
            // 部件中心位置
            locationCenter: {
                x: 495,
                y: 414
            },

            // 部件尺寸
            size: PART_SIZE_DEFINE.jingdianchuchen,

            // 显示规则， 数组元素是或的关系
            showRules: [{ type: 'contain', field: 'filtType', value: '6' }],
            infoCard: {
                // 信息卡位置:left/top/right/bottom
                placement: 'top',
                // 信息卡偏移
                offset: {
                    // 偏移类型：relParentName 相对于父级名称/ fixed 囸定
                    type: 'fixed',
                    value: 10
                }
            }
        },
        {
            code: 'yure',
            name: i18n.global.t('meos_control_web.half_view_heating_section'),
            nameStyle: {
                translateY: '-100%'
            },
            // 关联在设备上展示（空调机组）
            isRelEquipment: true,
            // 部件位置类型：dynamic/fixed
            locationType: 'dynamic',
            layout: 'flex',
            layoutContainer: 'rowContainer1',
            // 数量剪裁编码
            cutCode: 'yureGroup',
            // 部件尺寸
            size: PART_SIZE_DEFINE.lengpanguan,

            // 显示规则， 数组元素是或的关系
            showRules: [{ type: 'existsIotRule' }],
            infoCard: {
                // 信息卡位置:left/top/right/bottom
                placement: 'bottom',
                // 信息卡偏移
                offset: {
                    // 偏移类型：relParentName 相对于父级名称/ fixed 囸定
                    type: 'relParentName',
                    value: 10
                }
            }
        },
        {
            code: 'yure01',
            name: i18n.global.t('meos_control_web.half_view_heating_section'),
            nameStyle: {
                translateY: '-100%'
            },
            // 关联在设备上展示（空调机组）
            isRelEquipment: true,
            // 部件位置类型：dynamic/fixed
            locationType: 'dynamic',
            layout: 'flex',
            layoutContainer: 'rowContainer1',
            // 数量剪裁编码
            cutCode: 'yureGroup',
            // 部件尺寸
            size: PART_SIZE_DEFINE.lengpanguan,

            // 显示规则， 数组元素是或的关系
            showRules: [{ type: 'existsIotRule' }],
            infoCard: {
                // 信息卡位置:left/top/right/bottom
                placement: 'bottom',
                // 信息卡偏移
                offset: {
                    // 偏移类型：relParentName 相对于父级名称/ fixed 囸定
                    type: 'relParentName',
                    value: 10
                }
            }
        },
        {
            code: 'lengpanguan',
            name: i18n.global.t('meos_control_web.half_view_cooling_section'),
            nameStyle: {
                translateY: '-100%'
            },
            // 关联在设备上展示（空调机组）
            isRelEquipment: true,
            // 部件位置类型：dynamic/fixed
            locationType: 'dynamic',
            layout: 'flex',
            layoutContainer: 'rowContainer1',
            // 数量剪裁编码
            cutCode: 'yureGroup',
            // 部件尺寸
            size: PART_SIZE_DEFINE.lengpanguan,

            // 显示规则， 数组元素是或的关系
            showRules: [{ type: 'existsIotRule' }, { type: 'equals', field: 'isCoolCoilSection', value: '1' }],
            infoCard: {
                // 信息卡位置:left/top/right/bottom
                placement: 'top',
                // 信息卡偏移
                offset: {
                    // 偏移类型：relParentName 相对于父级名称/ fixed 囸定
                    // type: 'relParentName',
                    type: 'fixed',
                    value: 10
                }
            }
        },
        {
            code: 'lengpanguan01',
            name: i18n.global.t('meos_control_web.half_view_cooling_section'),
            nameStyle: {
                translateY: '-100%'
            },
            // 关联在设备上展示（空调机组）
            isRelEquipment: true,
            // 部件位置类型：dynamic/fixed
            locationType: 'dynamic',
            layout: 'flex',
            layoutContainer: 'rowContainer1',
            // 数量剪裁编码
            cutCode: 'yureGroup',
            // 部件尺寸
            size: PART_SIZE_DEFINE.lengpanguan,

            // 显示规则， 数组元素是或的关系
            showRules: [{ type: 'existsIotRule' }],
            infoCard: {
                // 信息卡位置:left/top/right/bottom
                placement: 'bottom',
                // 信息卡偏移
                offset: {
                    // 偏移类型：relParentName 相对于父级名称/ fixed 囸定
                    type: 'relParentName',
                    value: 10
                }
            }
        },
        {
            code: 'repanguan',
            name: i18n.global.t('meos_control_web.half_view_heating_section'),
            nameStyle: {
                translateY: '-100%'
            },
            // 关联在设备上展示（空调机组）
            isRelEquipment: true,
            // 部件位置类型：dynamic/fixed
            locationType: 'dynamic',
            layout: 'flex',
            layoutContainer: 'rowContainer1',
            // 数量剪裁编码
            cutCode: 'yureGroup',
            // 部件尺寸
            size: PART_SIZE_DEFINE.repanguan,

            // 显示规则， 数组元素是或的关系
            showRules: [{ type: 'existsIotRule' }, { type: 'equals', field: 'isHotWaterFunc', value: '1' }],
            infoCard: {
                // 信息卡位置:left/top/right/bottom
                placement: 'top',
                // 信息卡偏移
                offset: {
                    // 偏移类型：relParentName 相对于父级名称/ fixed 囸定
                    type: 'fixed',
                    value: 16
                }
            }
        },
        {
            code: 'zairepanguan',
            name: i18n.global.t('meos_control_web.half_view_heating_section'),
            nameStyle: {
                translateY: '-100%'
            },
            // 关联在设备上展示（空调机组）
            isRelEquipment: true,
            // 部件位置类型：dynamic/fixed
            locationType: 'dynamic',
            layout: 'flex',
            layoutContainer: 'rowContainer1',
            // 数量剪裁编码
            cutCode: 'yureGroup',
            // 部件中心位置
            locationCenter: {
                x: 726,
                y: 414
            },
            locationCenter2: {
                x: 690,
                y: 414
            },
            // 部件尺寸
            size: PART_SIZE_DEFINE.zairepanguan,

            // 显示规则， 数组元素是或的关系
            showRules: [{ type: 'existsIotRule' }, { type: 'equals', field: 'isReheatSection', value: '1' }],
            infoCard: {
                // 信息卡位置:left/top/right/bottom
                placement: 'bottom',
                // 信息卡偏移
                offset: {
                    // 偏移类型：relParentName 相对于父级名称/ fixed 囸定
                    type: 'relParentName',
                    value: 10
                }
            }
        },
        {
            code: 'zairepanguan01',
            name: i18n.global.t('meos_control_web.half_view_heating_section'),
            nameStyle: {
                translateY: '-100%'
            },
            // 关联在设备上展示（空调机组）
            isRelEquipment: true,
            // 部件位置类型：dynamic/fixed
            locationType: 'dynamic',
            layout: 'flex',
            layoutContainer: 'rowContainer1',
            // 数量剪裁编码
            cutCode: 'yureGroup',
            // 部件尺寸
            size: PART_SIZE_DEFINE.zairepanguan,

            // 显示规则， 数组元素是或的关系
            showRules: [{ type: 'existsIotRule' }],
            infoCard: {
                // 信息卡位置:left/top/right/bottom
                placement: 'bottom',
                // 信息卡偏移
                offset: {
                    // 偏移类型：relParentName 相对于父级名称/ fixed 囸定
                    type: 'relParentName',
                    value: 10
                }
            }
        },

        {
            code: 'jiashiqi',
            name: i18n.global.t('meos_control_web.half_view_jiashiqi'),
            nameStyle: {
                translateY: '-100%'
            },
            // 关联在设备上展示（空调机组）
            isRelEquipment: true,
            // 部件位置类型：dynamic/fixed
            // locationType: 'fixed',
            locationType: 'dynamic',
            layout: 'flex',
            layoutContainer: 'rowContainer1',
            // 部件中心位置
            locationCenter: {
                x: 1051,
                y: 414
            },

            // 部件尺寸
            size: PART_SIZE_DEFINE.jiashiqi,

            // 显示规则， 数组元素是或的关系
            showRules: [{ type: 'existsIotRule' }, { type: 'equals', field: 'isDSection', value: '1' }],
            infoCard: {
                // 信息卡位置:left/top/right/bottom
                placement: 'top',
                // 信息卡偏移
                offset: {
                    // 偏移类型：relParentName 相对于父级名称/ fixed 囸定
                    type: 'fixed',
                    value: 16
                }
            }
        },
        {
            code: 'songfengji',
            name: i18n.global.t('meos_control_web.half_view_songfengji'),
            nameStyle: {
                translateY: '-100%'
            },
            // 关联在设备上展示（空调机组）
            isRelEquipment: true,
            // 部件位置类型：dynamic/fixed
            // locationType: 'fixed',
            locationType: 'dynamic',
            layout: 'flex',
            layoutContainer: 'rowContainer1',
            // 部件中心位置
            locationCenter: {
                x: 1224,
                y: 414
            },

            // 部件尺寸
            size: PART_SIZE_DEFINE.songfengji,

            // 显示规则， 数组元素是或的关系
            showRules: [{ type: 'existsIotRule' }, { type: 'equals', field: 'isSupplySection', value: '1' }],
            infoCard: {
                // 信息卡位置:left/top/right/bottom
                placement: 'bottom',
                // 信息卡偏移
                offset: {
                    // 偏移类型：relParentName 相对于父级名称/ fixed 囸定
                    type: 'relParentName',
                    value: 10
                }
            }
        },
        {
            code: 'songfengfa',
            name: i18n.global.t('meos_control_web.half_view_songfengfa'),
            // 关联在设备上展示（空调机组）
            isRelEquipment: true,

            nameStyle: {
                translateY: '-100%',
                nameMaxWidth: {
                    // 类型：partWidthMultiple 部件宽度倍数/fixed 固定
                    type: 'partWidthMultiple',
                    value: 2
                }
            },
            // 部件位置类型：dynamic/fixed
            // locationType: 'fixed',
            locationType: 'dynamic',
            layout: 'flex',
            layoutContainer: 'rowContainer1',
            // 部件中心位置
            locationCenter: {
                x: 1310,
                y: 414
            },

            // 部件尺寸
            size: PART_SIZE_DEFINE.songfengfa,

            // 显示规则， 数组元素是或的关系
            showRules: [{ type: 'existsIotRule' }],
            infoCard: {
                // 信息卡位置:left/top/right/bottom
                placement: 'top',
                // 信息卡偏移
                offset: {
                    // 偏移类型：relParentName 相对于父级名称/ fixed 囸定
                    type: 'fixed',
                    value: 16
                }
            }
        }
    ],
    // 箭头
    arrows: [
        {
            // 箭头编码，保持唯一，作为v-for key 使用
            code: 'arrow1',
            // 箭头位置
            locationCenter: {
                x: 621,
                y: 53
            },
            // 箭头方向
            direction: 'left'
        },

        {
            code: 'arrow2',
            // 箭头位置
            locationCenter: {
                x: 1545,
                y: 400
            },
            // 箭头方向
            direction: 'right'
        }
    ],
    // 关联设备名字配置（控制组下空调机组）
    relEquipName: {
        // 锚点位置
        anchorLocation: {
            x: 102,
            y: 395
        },
        // 信息卡位置:left/top/right/bottom
        placement: 'left',
        // 信息卡偏移
        offset: {
            x: 0,
            y: 0
        }
    },
    // 风口信息卡
    airOutletCards: [
        {
            code: 'songfengkou',
            // 锚点位置
            anchorLocation: {
                x: 1480,
                y: 338
            },
            // 信息卡位置:left/top/right/bottom
            placement: 'top',
            // 信息卡偏移
            offset: {
                x: 0,
                y: 0
            }
        },
        {
            code: 'huifengkou',
            // 锚点位置
            anchorLocation: {
                x: 668,
                y: 95
            },
            // 信息卡位置:left/top/right/bottom
            placement: 'topRight',
            // 信息卡偏移
            offset: {
                x: 0,
                y: 0
            }
        }
    ]
};
