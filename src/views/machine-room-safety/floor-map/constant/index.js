// @ts-ignore
import i18n from '@/localization';
export const BUILDING_MODE = 1;
export const FLOOR_MODE = 2;
export const WIREFRAME_SCENE_NAME = '07_building_relation';
export const D3_SCENE_NAME = '05_building_classic';

export const MACHINE_ROOM_FLOOR_EQUIP_OPTIONS = [
    {
        id: '门禁设备',
        name: '门禁设备',
        children: [
            { id: 'CFCSDR', name: '普通门' },
            { id: 'CFCSFR', name: '防火门' },
            { id: 'SPEGFG', name: '速通门' }
        ]
    },
    { id: '视频监控设备', name: '视频监控设备', children: [{ id: 'SPVSCM', name: '监控摄像头' }] }
];
export const filterClassCodes = classCodes => {
    let filterOptions = [];
    const allClassCodes = MACHINE_ROOM_FLOOR_EQUIP_OPTIONS.flatMap(v => v?.children);
    const activeClassCodes = allClassCodes.filter(v => classCodes.includes(v?.id))?.map(v => v?.id);

    MACHINE_ROOM_FLOOR_EQUIP_OPTIONS.forEach(option => {
        const newChildren = option?.children?.filter(v => activeClassCodes.includes(v?.id));
        if (newChildren?.length) {
            filterOptions.push({
                id: option?.id,
                name: option?.name,
                children: newChildren
            });
        }
    });
    return filterOptions;
};

export const ROOM_MACHINE_MAP_FUNC_TYPES = [
    {
        id: '冷热源机房',
        name: '冷热源机房',
        children: [
            {
                id: 'SFT-02.03.01',
                name: '制冷机房'
            },
            {
                id: 'SFT-02.03.07',
                name: '空调水泵房'
            },
            {
                id: 'SFT-02.03.02',
                name: '锅炉房'
            },
            {
                id: 'SFT-02.03.05',
                name: '换热站'
            },
            {
                id: 'SFT-02.03.06',
                name: '市热站'
            },
            {
                id: 'SFT-02.03.04',
                name: '调压间'
            },
            {
                id: 'SFT-02.03.09',
                name: '空气压缩机房'
            },
            {
                id: 'SFT-02.03.10',
                name: '室外机放置间'
            }
        ]
    },
    {
        id: '空调机房',
        name: '空调机房',
        children: [
            {
                id: 'SFT-02.04.01',
                name: '空调机房'
            }
        ]
    },
    {
        id: '新风机房',
        name: '新风机房',
        children: [
            {
                id: 'SFT-02.04.02',
                name: '新风机房'
            }
        ]
    },
    {
        id: '送排风机房',
        name: '送排风机房',
        children: [
            {
                id: 'SFT-02.04.03',
                name: '送风机房'
            },
            {
                id: 'SFT-02.04.04',
                name: '排风机房'
            }
        ]
    },
    {
        id: '变配电机房',
        name: '变配电机房',
        children: [
            {
                id: 'SFT-02.07.01',
                name: '开闭站'
            },
            {
                id: 'SFT-02.07.02',
                name: '变配电室'
            },
            {
                id: 'SFT-02.07.03',
                name: '配电室'
            }
        ]
    },
    {
        id: '发电机房',
        name: '发电机房',
        children: [
            {
                id: 'SFT-02.07.04',
                name: '发电机房'
            },
            {
                id: 'SFT-02.07.06',
                name: '柴油发电机房储油间'
            }
        ]
    },
    {
        id: '生活水泵房',
        name: '生活水泵房',
        children: [
            {
                id: 'SFT-02.05.01',
                name: '生活水泵房'
            },
            {
                id: 'SFT-02.05.02',
                name: '生活水箱间'
            }
        ]
    },
    {
        id: '热水机房',
        name: '热水机房',
        children: [
            {
                id: 'SFT-02.05.09',
                name: '热水机房'
            },
            {
                id: 'SFT-02.05.06',
                name: '太阳能热水机房'
            }
        ]
    },
    {
        id: '纯水机房',
        name: '纯水机房',
        children: [
            {
                id: 'SFT-02.05.11',
                name: '纯水机房'
            }
        ]
    },
    {
        id: '污废水机房',
        name: '污废水机房',
        children: [
            {
                id: 'SFT-02.05.03',
                name: '隔油池间'
            },
            {
                id: 'SFT-02.05.07',
                name: '污水处理间'
            },
            {
                id: 'SFT-02.05.10',
                name: '废水机房'
            }
        ]
    },
    {
        id: '中水处理机房',
        name: '中水处理机房',
        children: [
            {
                id: 'SFT-02.05.05',
                name: '中水处理机房'
            }
        ]
    },
    {
        id: '雨水机房',
        name: '雨水机房',
        children: [
            {
                id: 'SFT-02.05.08',
                name: '雨水收集机房'
            }
        ]
    },
    {
        id: '中控室',
        name: '中控室',
        children: [
            {
                id: 'SFT-02.06.05',
                name: '消防控制中心'
            },
            {
                id: 'SFT-02.08.01',
                name: '建筑设备监控机房'
            }
        ]
    },
    {
        id: '消防水泵房',
        name: '消防水泵房',
        children: [
            {
                id: 'SFT-02.06.01',
                name: '消防水泵房'
            },
            {
                id: 'SFT-02.06.02',
                name: '消防水箱间'
            },
            {
                id: 'SFT-02.06.03',
                name: '消防水池'
            }
        ]
    },
    {
        id: '报警阀间',
        name: '报警阀间',
        children: [
            {
                id: 'SFT-02.06.04',
                name: '报警阀室'
            }
        ]
    },
    {
        id: '钢瓶间',
        name: '钢瓶间',
        children: [
            {
                id: 'SFT-02.06.07',
                name: '钢瓶间'
            }
        ]
    },
    {
        id: '消防风机房',
        name: '消防风机房',
        children: [
            {
                id: 'SFT-02.06.08',
                name: '排烟机房'
            },
            {
                id: 'SFT-02.06.09',
                name: '补风机房'
            },
            {
                id: 'SFT-02.06.10',
                name: '加压送风机房'
            },
            {
                id: 'SFT-02.06.11',
                name: '消防合用风机房'
            }
        ]
    },
    {
        id: '弱电机房',
        name: '弱电机房',
        children: [
            {
                id: 'SFT-02.08.02',
                name: '网络机房'
            },
            {
                id: 'SFT-02.08.03',
                name: '电话机房'
            },
            {
                id: 'SFT-02.08.04',
                name: '电视机房'
            },
            {
                id: 'SFT-02.08.05',
                name: '广播机房'
            }
        ]
    }
];

export const filterRoomFuncTypes = roomFuncTypes => {
    if (!Array.isArray(roomFuncTypes)) {
        return ROOM_MACHINE_MAP_FUNC_TYPES;
    }
    const allRoomFuncTypes = ROOM_MACHINE_MAP_FUNC_TYPES.flatMap(v => v?.children);
    const activeFuncTypes = allRoomFuncTypes.filter(v => roomFuncTypes.includes(v?.id))?.map(v => v?.id);
    let filterOptions = [];
    ROOM_MACHINE_MAP_FUNC_TYPES.forEach(option => {
        const currentRoomFuncTypes = option?.children?.filter(v => activeFuncTypes.includes(v?.id));
        if (currentRoomFuncTypes?.length) {
            filterOptions.push({
                id: option?.id,
                name: option?.name,
                children: currentRoomFuncTypes
            });
        }
    });
    return filterOptions;
};

export const defaultRoomFuncTypes = ROOM_MACHINE_MAP_FUNC_TYPES.flatMap(v => v?.children)?.map(v => v?.id);
