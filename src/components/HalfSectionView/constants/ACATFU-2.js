import i18n from '@/localization';
import { PART_SIZE_DEFINE } from '@/components/HalfSectionView/constants/config';

export default {
    code: 'ACATFU-2',
    ownClassCode: 'ACATFU',
    // 匹配规则（以下信息点且的关系）
    rule: {
        heatRecoveryType: '3'
    },
    size: {
        width: 1299,
        height: 333
    },
    // 布局容器
    layoutContainers: {
        yure: {
            locationCenter: {
                x: 720,
                y: 259
            },
            width: 284,
            gap: 10
        }
    },
    // 部件
    parts: [
        {
            code: 'paifengfa',
            name: i18n.global.t('meos_control_web.half_view_paifengfa'),
            nameStyle: {
                nameOffset: {
                    y: -8
                }
            },
            // 部件位置类型：dynamic/fixed
            locationType: 'fixed',
            // 部件中心位置
            locationCenter: {
                x: 82,
                y: 114
            },

            // 部件尺寸
            size: PART_SIZE_DEFINE.paifengfa,
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
            code: 'paifengji',
            name: i18n.global.t('meos_control_web.half_view_paifengji'),
            nameStyle: {
                nameOffset: {
                    y: -8
                }
            },
            // 部件位置类型：dynamic/fixed
            locationType: 'fixed',
            // 部件中心位置
            locationCenter: {
                x: 252,
                y: 114
            },

            // 部件尺寸
            size: PART_SIZE_DEFINE.paifengji,
            // 显示规则， 数组元素是或的关系
            showRules: [
                {
                    type: 'existsIotRule'
                },
                {
                    type: 'equals',
                    field: 'isExhaustFan',
                    value: '1'
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
            code: 'chuanganqi',
            name: i18n.global.t('meos_control_web.half_view_chuanganqi'),
            nameStyle: {
                nameMaxWidth: {
                    // 类型：partWidthMultiple 部件宽度倍数/fixed 固定
                    type: 'partWidthMultiple',
                    value: 8
                }
            },
            // 部件位置类型：dynamic/fixed
            locationType: 'fixed',
            // 部件中心位置
            locationCenter: {
                x: 754,
                y: 106
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
                    value: 72
                }
            }
        },
        {
            code: 'chuxiao',
            // 如果模板里有重复的部件，用来表示第几个
            index: 1,
            name: i18n.global.t('meos_control_web.half_view_chuxiao'),
            nameStyle: {
                nameOffset: {
                    y: -8
                }
            },
            // 部件位置类型：dynamic/fixed
            locationType: 'fixed',
            // 部件中心位置
            locationCenter: {
                x: 1160,
                y: 114
            },

            // 部件尺寸
            size: PART_SIZE_DEFINE.chuxiao,
            // 显示规则， 数组元素是或的关系
            showRules: [{ type: 'contain', field: 'filtType', value: '1' }]
        },
        {
            code: 'xinfengfa',
            name: i18n.global.t('meos_control_web.half_view_xinfengfa'),
            // 部件位置类型：dynamic/fixed
            locationType: 'fixed',
            // 部件中心位置
            locationCenter: {
                x: 78,
                y: 259
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
            code: 'chuxiao',
            // 如果模板里有重复的部件，用来表示第几个
            index: 2,
            name: i18n.global.t('meos_control_web.half_view_chuxiao'),
            // 部件位置类型：dynamic/fixed
            locationType: 'fixed',
            // 部件中心位置
            locationCenter: {
                x: 200,
                y: 259
            },

            // 部件尺寸
            size: PART_SIZE_DEFINE.chuxiao,
            // 显示规则， 数组元素是或的关系
            showRules: [{ type: 'contain', field: 'filtType', value: '1' }]
        },
        {
            code: 'zhongxiao',
            name: i18n.global.t('meos_control_web.half_view_zhongxiao'),
            // 部件位置类型：dynamic/fixed
            locationType: 'fixed',
            // 部件中心位置
            locationCenter: {
                x: 280,
                y: 259
            },

            // 部件尺寸
            size: PART_SIZE_DEFINE.zhongxiao,

            // 显示规则， 数组元素是或的关系
            showRules: [{ type: 'contain', field: 'filtType', value: '2' }]
        },
        {
            code: 'jingdianchuchen',
            name: i18n.global.t('meos_control_web.half_view_jingdianchuchen'),
            // 部件位置类型：dynamic/fixed
            locationType: 'fixed',
            // 部件中心位置
            locationCenter: {
                x: 360,
                y: 259
            },

            // 部件尺寸
            size: PART_SIZE_DEFINE.jingdianchuchen,

            // 显示规则， 数组元素是或的关系
            showRules: [{ type: 'contain', field: 'filtType', value: '6' }],
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
            code: 'yure',
            name: i18n.global.t('meos_control_web.half_view_heating_section'),
            // 部件位置类型：dynamic/fixed
            locationType: 'dynamic',
            layout: 'flex',
            layoutContainer: 'yure',

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
            // 部件位置类型：dynamic/fixed
            locationType: 'dynamic',
            layout: 'flex',
            layoutContainer: 'yure',

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
            // 部件位置类型：dynamic/fixed
            locationType: 'dynamic',
            layout: 'flex',
            layoutContainer: 'yure',

            // 部件尺寸
            size: PART_SIZE_DEFINE.lengpanguan,

            // 显示规则， 数组元素是或的关系
            showRules: [{ type: 'existsIotRule' }, { type: 'equals', field: 'isCoolCoilSection', value: '1' }],
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
            code: 'lengpanguan01',
            name: i18n.global.t('meos_control_web.half_view_cooling_section'),
            // 部件位置类型：dynamic/fixed
            locationType: 'dynamic',
            layout: 'flex',
            layoutContainer: 'yure',

            // 部件尺寸
            size: PART_SIZE_DEFINE.lengpanguan,

            // 显示规则， 数组元素是或的关系
            showRules: [{ type: 'existsIotRule' }, { type: 'equals', field: 'isCoolCoilSection', value: '1' }],
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
            // 部件位置类型：dynamic/fixed
            locationType: 'dynamic',
            layout: 'flex',
            layoutContainer: 'yure',
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
            // 部件位置类型：dynamic/fixed
            locationType: 'dynamic',
            layout: 'flex',
            layoutContainer: 'yure',
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
            // 部件位置类型：dynamic/fixed
            locationType: 'dynamic',
            layout: 'flex',
            layoutContainer: 'yure',
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
            code: 'rezhuanlun',
            name: i18n.global.t('meos_control_web.half_view_rezhuanlun'),
            nameStyle: {
                nameOffset: {
                    y: 25
                },
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
                x: 490,
                y: 179
            },

            // 部件尺寸
            size: PART_SIZE_DEFINE.rezhuanlun,

            // 显示规则， 数组元素是或的关系
            showRules: [
                {
                    type: 'equals',
                    field: 'heatRecoveryType',
                    value: '3'
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
            code: 'jiashiqi',
            name: i18n.global.t('meos_control_web.half_view_jiashiqi'),
            // 部件位置类型：dynamic/fixed
            locationType: 'fixed',
            // 部件中心位置
            locationCenter: {
                x: 924,
                y: 259
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
            // 部件位置类型：dynamic/fixed
            locationType: 'fixed',
            // 部件中心位置
            locationCenter: {
                x: 1068,
                y: 259
            },

            // 部件尺寸
            size: PART_SIZE_DEFINE.songfengji,

            // 显示规则， 数组元素是或的关系
            showRules: [{ type: 'existsIotRule' }, { type: 'equals', field: 'isSupplySection', value: '1' }],
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
            code: 'songfengfa',
            name: i18n.global.t('meos_control_web.half_view_songfengfa'),
            // 部件位置类型：dynamic/fixed
            locationType: 'fixed',
            // 部件中心位置
            locationCenter: {
                x: 1194,
                y: 259
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
                x: 2,
                y: 102
            },
            // 箭头方向
            direction: 'left'
        },
        {
            code: 'arrow2',
            // 箭头位置
            locationCenter: {
                x: 1270,
                y: 113
            },
            // 箭头方向
            direction: 'left'
        },
        {
            code: 'arrow3',
            // 箭头位置
            locationCenter: {
                x: 3,
                y: 234
            },
            // 箭头方向
            direction: 'right'
        },
        {
            code: 'arrow4',
            // 箭头位置
            locationCenter: {
                x: 1270,
                y: 249
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
                y: 368
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
                x: 1200,
                y: 368
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
            code: 'huifengkou',
            // 锚点位置
            anchorLocation: {
                x: 1179,
                y: -10
            },
            // 信息卡位置:left/top/right/bottom
            placement: 'top',
            // 信息卡偏移
            offset: {
                x: 0,
                y: 0
            }
        }
    ]
};
