import i18n from '@/localization';
import { PART_SIZE_DEFINE } from '@/components/HalfSectionView/constants/config';

export default {
    code: 'ACATAH-1',
    ownClassCode: 'ACATAH',
    // 匹配规则（以下信息点且的关系）
    rule: {
        // 新风热回收类型 :无热回收
        freshAirHeatRecoveryType: '1',
        // 有无新风段:有
        isFreshAirSection: '1',
        // 有无排风段：无
        isExhaustAirSection: '0'
    },
    cutConfig: {
        //  剪裁限制数量
        yureGroup: 3
    },
    size: {
        width: 1306,
        height: 380
    },
    // 布局容器
    layoutContainers: {
        yure: {
            locationCenter: {
                x: 624,
                y: 306
            },
            width: 284,
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
                x: 170,
                y: 135
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
                y: 306
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
                y: 306
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
                y: 306
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
                y: 306
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
            // 部件位置类型：dynamic/fixed
            locationType: 'dynamic',
            layout: 'flex',
            layoutContainer: 'yure',
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
            // 部件位置类型：dynamic/fixed
            locationType: 'dynamic',
            layout: 'flex',
            layoutContainer: 'yure',
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
            // 部件位置类型：dynamic/fixed
            locationType: 'dynamic',
            layout: 'flex',
            layoutContainer: 'yure',
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
            // 部件位置类型：dynamic/fixed
            locationType: 'dynamic',
            layout: 'flex',
            layoutContainer: 'yure',
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
            // 部件位置类型：dynamic/fixed
            locationType: 'dynamic',
            layout: 'flex',
            layoutContainer: 'yure',
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
            // 部件位置类型：dynamic/fixed
            locationType: 'dynamic',
            layout: 'flex',
            layoutContainer: 'yure',
            // 数量剪裁编码
            cutCode: 'yureGroup',
            // 部件中心位置
            locationCenter: {
                x: 726,
                y: 306
            },
            locationCenter2: {
                x: 690,
                y: 306
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
            // 部件位置类型：dynamic/fixed
            locationType: 'dynamic',
            layout: 'flex',
            layoutContainer: 'yure',
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
            // 部件位置类型：dynamic/fixed
            locationType: 'fixed',
            // 部件中心位置
            locationCenter: {
                x: 858,
                y: 306
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
                x: 1012,
                y: 306
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
            nameStyle: {
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
                x: 1160,
                y: 306
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
                x: 695,
                y: 52
            },
            // 箭头方向
            direction: 'left'
        },
        {
            code: 'arrow2',
            // 箭头位置
            locationCenter: {
                x: 14,
                y: 286
            },
            // 箭头方向
            direction: 'right'
        },
        {
            code: 'arrow3',
            // 箭头位置
            locationCenter: {
                x: 1265,
                y: 286
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
                y: 412
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
                y: 412
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
                x: 718,
                y: 50
            },
            // 信息卡位置:left/top/right/bottom
            placement: 'right',
            // 信息卡偏移
            offset: {
                x: 0,
                y: 0
            }
        }
    ]
};
