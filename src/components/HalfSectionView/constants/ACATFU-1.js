import i18n from '@/localization';
import { PART_SIZE_DEFINE } from '@/components/HalfSectionView/constants/config';

export default {
    code: 'ACATFU-1',
    ownClassCode: 'ACATFU',
    // 匹配规则（以下信息点且的关系）
    rule: {
        heatRecoveryType: '1'
    },
    size: {
        width: 1299,
        height: 188
    },
    // 布局容器
    layoutContainers: {
        yure: {
            locationCenter: {
                x: 640,
                y: 114
            },
            width: 284,
            gap: 10
        }
    },
    // 部件
    parts: [
        {
            code: 'xinfengfa',
            name: i18n.global.t('meos_control_web.half_view_xinfengfa'),
            // 部件位置类型：dynamic/fixed
            locationType: 'fixed',
            // 部件中心位置
            locationCenter: {
                x: 78,
                y: 114
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
            code: 'chuxiao',
            name: i18n.global.t('meos_control_web.half_view_chuxiao'),
            // 部件位置类型：dynamic/fixed
            locationType: 'fixed',
            // 部件中心位置
            locationCenter: {
                x: 240,
                y: 114
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
                x: 324,
                y: 114
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
                x: 404,
                y: 114
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
            code: 'jiashiqi',
            name: i18n.global.t('meos_control_web.half_view_jiashiqi'),
            // 部件位置类型：dynamic/fixed
            locationType: 'fixed',
            // 部件中心位置
            locationCenter: {
                x: 858,
                y: 114
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
                x: 1034,
                y: 114
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
                x: 1186,
                y: 114
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
            direction: 'right'
        },
        {
            // 箭头编码，保持唯一，作为v-for key 使用
            code: 'arrow2',
            // 箭头位置
            locationCenter: {
                x: 1272,
                y: 102
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
                y: 224
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
                x: 1190,
                y: 224
            },
            // 信息卡位置:left/top/right/bottom
            placement: 'bottom',
            // 信息卡偏移
            offset: {
                x: 0,
                y: 0
            }
        }
    ]
};
