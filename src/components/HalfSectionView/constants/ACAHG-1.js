import i18n from '@/localization';
import { PART_SIZE_DEFINE } from '@/components/HalfSectionView/constants/config';

export default {
    code: 'ACAHG-1',
    ownClassCode: 'ACAHG',
    // 背景管道类型：dynamic/fixed 默认fixed
    pipeBgType: 'dynamic',
    // 默认
    pipeBgBaseInfo: {
        x: 0,
        y: 0
    },
    pipeDynBgInfos: {
        x: 190,
        y: 300,
        firstHeight: 188,
        middleHeight: 427
    },
    // 匹配规则（以下信息点且的关系）
    rule: {
        // 有无新风段:有
        isFreshAirSection: '1',
        // 有无排风段：无
        isExhaustAirSection: '1'
    },
    cutConfig: {
        //  剪裁限制数量
        yureGroup: 3
    },
    size: {
        width: 1790,
        height: 380
    },
    // 布局容器
    layoutContainers: {
        rowContainer1: {
            locationCenter: {
                // x: 960,
                // y: 414
                x: 950,
                y: 414
            },
            // width: 338,
            width: 1320,
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
                x: 256,
                y: 205
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
            code: 'xinfengfa',
            name: i18n.global.t('meos_control_web.half_view_xinfengfa'),

            nameStyle: {
                translateY: '-100%',
                nameMaxWidth: {
                    // 类型：partWidthMultiple 部件宽度倍数/fixed 固定
                    type: 'partWidthMultiple',
                    value: 2
                }
            },
            // 部件位置类型：dynamic/fixed
            locationType: 'fixed',
            // 部件中心位置
            locationCenter: {
                x: 78,
                y: 410
            },

            // 部件尺寸
            size: PART_SIZE_DEFINE.xinfengfa,
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
                x: 340,
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
                x: 470,
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
                x: 580,
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
                x: 694,
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
                x: 1235,
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
                x: 1406,
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
                x: 1546,
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
    // 关联设备名字配置（控制组下空调机组）
    relEquipName: {
        // 锚点位置
        anchorLocation: {
            x: 346,
            y: 410
        },
        // 信息卡位置:left/top/right/bottom
        placement: 'left',
        // 信息卡偏移
        offset: {
            x: 0,
            y: 0
        }
    },
    // 箭头
    arrows: [
        {
            // 箭头编码，保持唯一，作为v-for key 使用
            code: 'arrow1',
            // 箭头位置
            locationCenter: {
                x: 805,
                y: 56
            },
            // 箭头方向
            direction: 'left'
        },
        {
            code: 'arrow2',
            // 箭头位置
            locationCenter: {
                x: 14,
                y: 406
            },
            // 箭头方向
            direction: 'right'
        },
        {
            code: 'arrow3',
            // 箭头位置
            locationCenter: {
                x: 1750,
                y: 406
            },
            // 箭头方向
            direction: 'right'
        }
    ],
    // 风口信息卡
    airOutletCards: [
        {
            code: 'xinfengkou',
            // 锚点位置
            anchorLocation: {
                x: 82,
                y: 532
            },
            // 信息卡位置:left/top/right/bottom
            placement: 'bottom',
            // 信息卡偏移
            offset: {
                x: 0,
                y: 0
            }
        },
        {
            code: 'songfengkou',
            // 锚点位置
            anchorLocation: {
                x: 1680,
                y: 334
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
                x: 855,
                y: 96
            },
            // 信息卡位置:left/top/right/bottom
            placement: 'topRight',
            // 信息卡偏移
            offset: {
                x: 40,
                y: 0
            }
        }
    ]
};
