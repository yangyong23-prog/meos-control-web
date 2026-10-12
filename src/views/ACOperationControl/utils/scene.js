// @ts-ignore
import i18n from '@/localization';
import { EdgeMaterial } from '@yushu/effecttool';
import * as THREE from '@yushu/three-base';
import EquipStateInfo from '@/views/GraphMVC/graphScene/EquipStateInfo/EquipStateInfo';
import { RevitModelColorFromClassCode } from '@/views/GraphMVC/config/color/ModelCommonColor';
import AirEquipIconInfo from '../BuildingFloorMap/graph/AirEquipIconInfo/AirEquipIconInfo';

import MultipleSpace from '@/views/GraphMVC/graphScene/MultipleSpace/MultipleSpace';
import ACSpaceInfo from '../BuildingFloorMap/graph/ACSpaceInfo/ACSpaceInfo';
import { RenderOrder, StatePriority } from '@/views/GraphMVC/graphScene/GraphSceneDefine';
import { getFloorInfoByFloorId } from '@/utils/buildingUtils';
import { baseColors } from '@/constants/baseColors';

const { M2FOOT } = THREE.baseUtils;

export const createSpaceModel = item => {
    const floorInfo = getFloorInfoByFloorId(item.floorId);
    const { floorElevation, height } = floorInfo;
    const floorHeight = M2FOOT * Number(floorElevation || 0);
    const _height = M2FOOT * Number(height || 0);
    // const space = new MultipleSpace(item, 0, floorHeight, _height, true);
    const space = new MultipleSpace(item, { height: 0, floorHeight, depths: [_height * 0.6, 0.01] });

    const normalOpacity = 0.7;
    const deepOpacity = 1;
    space.setStateStyles({
        normal: {
            ...space.defineStyles.normal,
            color: '#C4C9CF',
            useLinearColor: true,
            alpha: normalOpacity
        },
        noneData: {
            color: '#C4C9CF',
            alpha: normalOpacity,
            priority: RenderOrder.space + 2
        },
        // 无标准
        noStandard: {
            color: '#9FA5AB',
            alpha: normalOpacity,
            priority: RenderOrder.space + 1
        },
        // 屏蔽
        envShieldedZone: {
            color: '#C9B79B',
            alpha: normalOpacity,
            priority: RenderOrder.space + 1
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
        // 异常
        abnormal: {
            // color: baseColors['$red-600'],
            color: '#F0ABA8',
            alpha: normalOpacity,
            priority: RenderOrder.space + 5
        },
        unabnormal: {
            // color: baseColors['$red-600'],
            color: '#A3D4B6',
            alpha: normalOpacity,
            priority: RenderOrder.space + 5
        },

        // 合适
        appropriate: {
            // color: baseColors['$green-500'],
            color: '#A3D4B6',
            alpha: normalOpacity,
            priority: RenderOrder.space + 2
        },

        // 较冷
        colder: {
            // color: '#16C9E1',
            color: '#9BD6DE',
            alpha: normalOpacity,
            priority: RenderOrder.space + 2
        },
        // 过冷
        coldest: {
            // color: '#0E9AFF',
            color: '#A1C8E5',
            alpha: normalOpacity,
            priority: RenderOrder.space + 2
        },

        // 较热
        hotter: {
            // color: '#FF9900',
            color: '#EDD4A1',
            alpha: normalOpacity,
            priority: RenderOrder.space + 2
        },
        // 过热
        hottest: {
            // color: baseColors['$red-500'],
            color: '#F2B8A5',
            alpha: normalOpacity,
            priority: RenderOrder.space + 2
        },
        // CO2 浓度过高
        overCo2: {
            color: '#F2B8A5',
            alpha: normalOpacity,
            priority: RenderOrder.space + 2
        },
        // CO2 浓度偏高
        highCo2: {
            color: '#EAC884',
            alpha: normalOpacity,
            priority: RenderOrder.space + 2
        },
        // 调度-目标值
        targetValue: {
            // color: '#8ED4A9',
            color: '#A3D4B6',
            alpha: normalOpacity,
            priority: RenderOrder.space + 2
        },
        // 调度-冷(蓄冷/下限)
        dspCold: {
            // color: '#8ABEE5',
            color: '#A1C8E5',
            alpha: normalOpacity,
            priority: RenderOrder.space + 2
        },
        // 调度-热(蓄热/上限)
        dspHot: {
            // color: '#F2A68C',
            color: '#F2B8A5',
            alpha: normalOpacity,
            priority: RenderOrder.space + 2
        },

        // 筛选隐藏
        filterHide: {
            show: false,
            priority: 500
        },
        // 关联模式下
        isRelMode: {
            show: false,
            priority: 2000
        },
        // 关联模式下显示
        relModeShow: {
            show: true,
            colorMode: 'blend',
            blendAlpha: 0.3,
            blendColor: '#D0D7E3',
            priority: 2001
        },
        // 是关联对象
        isRelObject: {
            colorMode: '',
            priority: 2002
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
        // 控反不一致
        orderFail: {
            dotColor: baseColors['$orange-500'],
            textColor: baseColors.$white,
            textBgColor: baseColors['$orange-500'],
            priority: RenderOrder.equip + 3,
            weight: RenderOrder.equip + 3,
            dotCssName: 'breath'
        },

        // 异常和控反不一致
        abnormalOrderFail: {
            dotColor: `${baseColors['$red-500']};${baseColors['$orange-500']}`,
            textColor: baseColors.$white,
            textBgColor: baseColors['$red-500'],
            priority: RenderOrder.equip + 4,
            weight: RenderOrder.equip + 4,
            dotCssName: 'breath'
        },
        floorMode: {
            show: false,
            priority: 3000
        },
        filterHide: {
            show: false,
            priority: 1000
        },
        // 关联模式下
        isRelMode: {
            show: false,
            priority: 2000
        },
        // 关联模式下显示
        relModeShow: {
            show: true,
            priority: 2001
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
    // 电动调节水阀/风管式再热装置,没有开关状态，颜色要特殊处理
    if (item.classCode === 'ACVVEJ' || item.classCode === 'ACATHT') {
        delete equipIconInfo.defineStyles?.opened;
        delete equipIconInfo.defineStyles?.closed;
        equipIconInfo.defineStyles.normal.iconBgColor = '#64A6F7';
    }
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
        // 关联模式下
        isRelMode: {
            show: false,
            priority: 2000
        },
        // 关联模式下显示
        relModeShow: {
            show: true,
            opacity: 0.5,
            priority: 2001
        },
        // 是关联对象
        isRelObject: {
            opacity: 1,
            show: true,
            showText: true,
            priority: 2102
        },
        inSameCtlGroup: {
            textColor: '#ffffff', // 字体颜色
            textShadow: '', // 字体描边
            textBgColor: '#246FE5', // 文字背景
            textBorder: '1px solid #fff',
            renderOrder: RenderOrder.selected,
            iconBgColor: 'linear-gradient(0deg, rgba(3, 3, 3, 0.20) 0%, rgba(3, 3, 3, 0.20) 100%), #246FE5', // 图标背景

            opacity: 1,
            priority: 2002
        },
        filterHide: {
            show: false,
            priority: 1000
        }
    });

    return equipIconInfo;
};
export const createSpaceLabelInfoModel = (item, floorHeight) => {
    const model = new ACSpaceInfo(item, { floorHeight });

    model.setStateStyles({
        normal: {
            ...model.defineStyles.normal,
            show: true,
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
        buildingMode: {
            show: false,
            priority: StatePriority.hover - 2
        },
        // 是关联对象
        isRelObject: {
            opacity: 1,
            // 关联模式，关联对象，层级比设备名字低
            // renderOrder: 5,
            show: true,
            textShow: true,
            priority: 2102
        },
        // 关联模式下显示
        relModeShow: {
            show: true,
            opacity: 0.3,
            priority: 2001
        },
        hide: {
            show: false,
            priority: Infinity
        }
    });
    return model;
};

export const createSpacePositionInfoModel = (item, floorHeight) => {
    const model = new ACSpaceInfo(item, { floorHeight });
    model.setStateStyles({
        normal: {
            show: false,
            color: '#A4ADB7',
            controllerShow: false,
            showLegend: false,
            spaceIconColor: baseColors['$grey-500'],
            joinCollide: true,
            priority: RenderOrder.space,
            renderOrder: RenderOrder.postionSpace
        },
        filterHide: {
            show: false,
            priority: 500
        },
        floorMode: {
            show: true,
            spaceIcon: false,
            showLegend: true,
            priority: RenderOrder.space + 6
        },
        collided: {
            show: false,
            priority: 2100
        },
        // 关联模式下显示
        relModeShow: {
            show: true,
            controllerShow: true,
            opacity: 0.3,
            priority: 2001
        }
    });
    return model;
};

export const getEquipStyles = (equipData, normalStyle) => {
    const style = {
        hover: {
            outline: true,
            priority: 20
        },
        active: {
            // outline: true,
            group: normalStyle?.group,
            materialType: EdgeMaterial.name,
            alpha: 0.5,
            color: '#9FC9FB',
            priority: 50
        },
        hoverRelation: {
            outline: true,
            priority: 50
        },

        selected: {
            group: normalStyle?.group,
            materialType: EdgeMaterial.name,
            alpha: 0.5,
            color: '#9FC9FB',
            priority: 40
        },
        floorMode: {
            show: false,
            priority: 3000
        },
        filterHide: {
            show: false,
            priority: 1000
        },
        // 关联模式下
        isRelMode: {
            show: false,
            priority: 2000
        },
        // 关联模式下显示
        relModeShow: {
            show: true,
            priority: 2001
        },
        hide: {
            show: false,
            priority: Infinity
        }
    };
    if (equipData) {
        style.normal = normalStyle || {
            show: false,
            ...equipData.colorInfo,
            color: RevitModelColorFromClassCode(equipData.classCode),
            materialType: THREE.MeshStandardMaterial.name
        };
    }
    return style;
};

export const isEquipAbnormal = tag => {
    if (!tag) {
        return false;
    }
    const { abnormalStatuses } = tag;
    // 异常事件+控反不一致作为设备异常的过滤条件
    return abnormalStatuses?.length > 0;
};
