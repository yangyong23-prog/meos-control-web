// @ts-ignore
import i18n from '@/localization';
import { EdgeMaterial } from '@yushu/effecttool';
import * as THREE from '@yushu/three-base';
import EquipStateInfo from '@/views/GraphMVC/graphScene/EquipStateInfo/EquipStateInfo';
import { RevitModelColorFromClassCode } from '@/views/GraphMVC/config/color/ModelCommonColor';
import AirEquipIconInfo from './graph/AirEquipIconInfo/AirEquipIconInfo';

import MultipleSpace from '@/views/GraphMVC/graphScene/MultipleSpace/MultipleSpace';
import SpaceIconInfoCommon from '@/views/GraphMVC/graphScene/SpaceIconInfoCommon/SpaceIconInfoCommon';
import { RenderOrder, StatePriority } from '@/views/GraphMVC/graphScene/GraphSceneDefine';
import { getFloorInfoByFloorId } from '@/utils/buildingUtils';
import { baseColors } from '@/constants/baseColors';

const { M2FOOT } = THREE.baseUtils;

export const createSpaceModel = item => {
    const { floorElevation, height } = item;
    const floorHeight = M2FOOT * Number(floorElevation || 0);
    const _height = M2FOOT * Number(height || 0);
    // const space = new MultipleSpace(item, 0, floorHeight, _height, true);
    const space = new MultipleSpace(item, { height: 0, floorHeight, depths: [_height * 0.6, 0.01] });

    const normalOpacity = 0.7;
    const deepOpacity = 1;
    space.setStateStyles({
        normal: {
            ...space.defineStyles.normal,
            color: '#BBC1C8',
            useLinearColor: true,
            alpha: normalOpacity
        },
        floorMode: {
            priority: RenderOrder.space + 20,
            alpha: 1
        },
        selected: {
            show: true,
            color: baseColors['$blue-500'],
            alpha: deepOpacity,
            priority: RenderOrder.selected
        },
        hover: {
            show: true,
            // alpha: deepOpacity,
            colorMode: 'dark',
            priority: 2500
        },

        // 合适
        appropriate: {
            // color: baseColors['$green-500'],
            color: '#3fbe72',
            alpha: normalOpacity,
            priority: RenderOrder.space + 1
        },

        // 较冷
        colder: {
            // color: '#16C9E1',
            color: '#16C9E1',
            alpha: normalOpacity,
            priority: RenderOrder.space + 1
        },
        // 过冷
        coldest: {
            // color: '#0E9AFF',
            color: '#246FE5',
            alpha: normalOpacity,
            priority: RenderOrder.space + 1
        },

        // 较热
        hotter: {
            // color: '#FF9900',
            color: '#FF9900',
            alpha: normalOpacity,
            priority: RenderOrder.space + 1
        },
        // 过热
        hottest: {
            // color: baseColors['$red-500'],
            color: '#F55047',
            alpha: normalOpacity,
            priority: RenderOrder.space + 1
        },
        // CO2 浓度过高
        co2Hight: {
            color: '#FFAD33',
            alpha: normalOpacity,
            priority: RenderOrder.space + 1
        },
        // 调度-目标值
        co2TooHight: {
            // color: '#8ED4A9',
            color: '#F55047',
            alpha: normalOpacity,
            priority: RenderOrder.space + 1
        },

        // 筛选隐藏
        filterHide: {
            show: false,
            priority: 500
        },

        hide: {
            show: false,
            priority: Infinity
        }
    });

    return space;
};

export const createEqupStateInfo = item => {
    const equipStateInfo = new EquipStateInfo(item);
    equipStateInfo.setStateStyles({
        floorMode: {
            show: false,
            priority: 3000
        },
        filterHide: {
            show: false,
            priority: 1000
        },

        hide: {
            show: false,
            priority: Infinity
        }
    });

    return equipStateInfo;
};
export const createEqupIconInfo = item => {
    const equipIconInfo = new AirEquipIconInfo(item);
    const normalStyle = equipIconInfo.defineStyles?.normal || {};
    equipIconInfo.setStateStyles({
        normal: {
            ...normalStyle,
            show: false // 是否显示
        },

        floorMode: {
            show: true,
            priority: StatePriority.absorb - 5
        },
        buildingMode: {
            show: false,
            priority: 3000
        },

        hide: {
            show: false,
            priority: 2000
        }
    });

    return equipIconInfo;
};
export const createSpaceLabelInfoModel = (item, floorHeight) => {
    const model = new SpaceIconInfoCommon(item, { floorHeight });

    model.setStateStyles({
        normal: {
            ...model.defineStyles.normal,
            show: false,
            iconShow: false
        },

        floorMode: {
            spaceIcon: false,
            showLegend: true,
            priority: RenderOrder.space + 6
        },

        filterHide: {
            show: false,
            priority: 500
        },

        // 是关联对象
        isRelObject: {
            opacity: 1,
            // 关联模式，关联对象，层级比设备名字低
            renderOrder: 5,
            show: true,
            textShow: true,
            priority: 2002
        },
        // 关联模式下显示
        // relModeShow: {
        //     show: true,
        //     textShow: true,
        //     renderOrder: RenderOrder.equip - 1,
        //     priority: 2001
        // },
        hide: {
            show: false,
            priority: Infinity
        }
    });
    return model;
};
export const getEquipStyles = (equipData, normalStyle) => {
    const style = {
        floorMode: {
            show: false,
            priority: 3000
        },

        hide: {
            show: false,
            priority: Infinity
        }
    };
    if (equipData) {
        style.normal = normalStyle || {
            show: true,
            ...equipData.colorInfo,
            color: RevitModelColorFromClassCode(equipData.classCode),
            materialType: THREE.MeshStandardMaterial.name
        };
    }
    return style;
};
