// @ts-ignore
import i18n from '@/localization';
import * as THREE from '@yushu/three-base';
import { getFloorInfoByFloorId, getFloorInfoListByFloorIdList, getBuildingInfoByFloorId } from '@/utils/buildingUtils';
import {
    STRAIGHT_LADDER_CLASS_CODES,
    ESCALATOR_CLASS_CODES,
    TRACTION_CLASS_CODES,
    SHAFT_CLASS_CODES,
    ENTRANCE_AND_EXIT_CODES,
    DOOR_GROUP_CLASS_CODES,
    MOVEDIRECT_VAL_MAP_STATE,
    TOILET_CODES
} from '@/views/elevatorSystem/constants';
import {
    parseMainBuildingBoardInfo,
    isFloor,
    isFloorFrame,
    calcFloorDirectionalLight,
    restoreControls,
    convertP3ToP2,
    convertV3ToP2,
    getEquipStyles
} from '@/apm-3d/utils/buildingTools';
import ESEquipIconInfo from './ElevatorBuildingFloorMap/graph/ESEquipIconInfo/ESEquipIconInfo';
import ShaftCombined from './ElevatorBuildingFloorMap/graph/ShaftCombined/ShaftCombined';
import StraightLadder from './ElevatorBuildingFloorMap/graph/StraightLadder/StraightLadder';
import StraightLadderPopover from './ElevatorBuildingFloorMap/graph/StraightLadderPopover/StraightLadderPopover';

import { baseColors } from '@/constants/baseColors';
import EquipStateInfo from '@/views/GraphMVC/graphScene/EquipStateInfo/EquipStateInfo';
import MultipleSpace from '@/views/GraphMVC/graphScene/MultipleSpace/MultipleSpace';
import Space from '@/views/GraphMVC/graphScene/Space/Space';
import SpaceIconInfoCommon from '@/views/GraphMVC/graphScene/SpaceIconInfoCommon/SpaceIconInfoCommon';
import { modelNameEnum, RenderOrder, StatePriority } from '@/views/GraphMVC/graphScene/GraphSceneDefine';
import { OBJ_TYPE } from '@/utils/globalVariables';

const { M2FOOT, MM2FOOT, ResourceTracker } = THREE.baseUtils;
const _judgeIncludeClassCode = (targetList, classCode) => {
    return targetList?.includes(classCode?.toUpperCase());
};
// 是竖井
export const isShaft = classCode => {
    return _judgeIncludeClassCode(SHAFT_CLASS_CODES, classCode);
};
// 直梯
export const isStraightLadder = classCode => {
    return _judgeIncludeClassCode(STRAIGHT_LADDER_CLASS_CODES, classCode);
};
// 扶梯
export const isEscalator = classCode => {
    return _judgeIncludeClassCode(ESCALATOR_CLASS_CODES, classCode);
};
// 曳引机
export const isTraction = classCode => {
    return _judgeIncludeClassCode(TRACTION_CLASS_CODES, classCode);
};
// 门组
export const isDoorGroup = classCode => {
    return _judgeIncludeClassCode(DOOR_GROUP_CLASS_CODES, classCode);
};

// 出入口
export const isEntranceAndExit = code => {
    return _judgeIncludeClassCode(ENTRANCE_AND_EXIT_CODES, code);
};
// 是卫生间
export const isToilet = code => {
    return _judgeIncludeClassCode(TOILET_CODES, code);
};

export const getRelObjectIds = (groups, infoCode) => {
    return groups
        ?.find(g => g.groupCode === 'relation')
        ?.relInfoCodeConfigs?.find(rel => rel.infoCode === infoCode)
        ?.dataValue?.map(space => {
            return space.id;
        });
};

// 获取groups里所在空间ID
export const getInSpaceIds = groups => {
    return groups
        ?.find(g => g.groupCode === 'relation')
        ?.relInfoCodeConfigs?.find(rel => rel.infoCode === 'inSpace')
        ?.dataValue?.map(space => {
            return space.id;
        });
};

// 直梯获取关联的竖井ID
export const getStraightLadderRelShaftId = groups => {
    return groups
        ?.find(g => g.groupCode === 'relation')
        ?.relInfoCodeConfigs?.find(rel => rel.infoCode === 'inShaft')
        ?.dataValue?.find(shaft => {
            return shaft;
        })?.id;
};

// 获取设备状态
export const getEquipStatus = obj => {
    return obj.relInfoCodeGroupConfigs?.find(g => g.groupCode === 'equipStatus')?.relInfoCodeConfigs;
};
// 获取设备有哪些状态
export const getEquipStatusStates = item => {
    const states = [];
    let arrs = getEquipStatus(item) || [];
    const isAbnormal = arrs?.some(obj => obj.infoCode === 'alarmstatus' && obj.dataValue === 'alarmstatus');
    const isOverLoad = arrs?.some(obj => obj.infoCode === 'isOverLoad' && obj.dataValue === '1');
    if (isAbnormal && isOverLoad) {
        arrs = arrs?.filter(obj => obj.infoCode !== 'alarmstatus' && obj.infoCode !== 'isOverLoad');
        states.push({ name: 'abnormalAndOverload', value: true });
    }
    arrs.forEach(obj => {
        if (obj.infoCode === 'moveDirect') {
            const sm = MOVEDIRECT_VAL_MAP_STATE[obj.dataValue];
            if (sm) {
                states.push({ name: sm, value: true });
            }
        } else if (obj.infoCode === 'lockStatus' && obj.dataValue === '1') {
            states.push({ name: 'locked', value: true });
        } else if (obj.infoCode === 'alarmstatus' && obj.dataValue === 'alarmstatus') {
            states.push({ name: 'abnormal', value: true });
        } else if (obj.infoCode === 'isOverLoad' && obj.dataValue === '1') {
            // 超载
            states.push({ name: 'overload', value: true });
        } else if (obj.infoCode === 'stopFloor') {
            states.push({ name: 'stopFloor', value: obj.dataValue });
        }
    });
    return states;
};

export const additionalFloorInfo = (item, cachedFloorInfo) => {
    if (!item.floorId) {
        return;
    }
    if (!cachedFloorInfo[item.floorId]) {
        const floorInfo = getFloorInfoByFloorId(item.floorId, false);
        cachedFloorInfo[item.floorId] = floorInfo;

        item.floorLocalId = floorInfo?.localId;
    }
    const floorInfo = cachedFloorInfo[item.floorId];

    item.floorLocalId = floorInfo.localId;
    item.floorLocalName = floorInfo.localName ?? '--';
    item.floorElevation = floorInfo.floorElevation;
    item.floorSequenceId = floorInfo.floorSequenceId;
    item.height = floorInfo.height;
};

// 判断直梯服务楼层
export const judgeSLadderServeFloor = (obj, floorId) => {
    return obj.serviceSpaces?.some(space => space.floorId === floorId);
};

export const createSpaceModel = item => {
    const { floorElevation, height } = item;
    const floorHeight = M2FOOT * Number(floorElevation || 0);
    const _height = M2FOOT * Number(height || 0);
    // const space = new MultipleSpace(item, 0, floorHeight, _height, true);
    const space = new MultipleSpace(item, { height: 0, floorHeight, depths: [_height * 0.6, 0.01] });
    // 空间不可交互，就不可射线求交，此处特殊
    space.userinteractionEnable = false;
    const normalOpacity = 0.2;
    const deepOpacity = 1;
    space.setStateStyles({
        normal: {
            ...space.defineStyles.normal,
            color: '#0045B1',
            useLinearColor: true,
            show: item.isContainTraction,
            alpha: normalOpacity
        },
        floorMode: {
            show: true,
            color: '#A1C8E5',
            priority: 20,
            alpha: 1
        },
        hover: {
            show: true,
            color: '#89BEE5',
            priority: RenderOrder.hover
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
export const createOtherSpaceModel = (item, floorElevation, colorDefine = {}) => {
    const floorHeight = M2FOOT * Number(floorElevation || 0);
    const space = new Space(item, 0, floorHeight);

    const { normalColor = '#E8EEF2', hoverColor = '#D8E3EB' } = colorDefine;
    space.setStateStyles({
        normal: {
            ...space.defineStyles.normal,
            color: normalColor,
            useLinearColor: true,
            show: true
        },
        hover: {
            show: true,
            color: hoverColor,
            priority: RenderOrder.hover
        },
        floorMode: {
            priority: RenderOrder.space + 20,
            alpha: 1,
            show: true
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

export const createShaftCombined = item => {
    const shaft = new ShaftCombined(item);

    return shaft;
};
// 创建直梯上气泡图元
export const createStraightLadderPopover = item => {
    const m = new StraightLadderPopover(item);

    return m;
};
export const createStraightLadder = item => {
    const spaces = item.relShaft.shaftSpaceList;
    let minHeight = spaces[0].height,
        bottomSpace = spaces[0];
    spaces.forEach(obj => {
        if (obj.height < minHeight) {
            minHeight = obj.height;
        }
        if (obj.floorElevation < bottomSpace.floorElevation) {
            bottomSpace = obj;
        }
    });
    const depth = minHeight;
    // const { floorElevation, height } = floorInfo;
    const _height = M2FOOT * Number(depth || 0);
    const { floorElevation } = bottomSpace;
    const defaultY = M2FOOT * Number(floorElevation || 0);
    const m = new StraightLadder(item, { depth: _height, defaultY });

    return m;
};
// idES:是给直梯用的
export const createEqupStateInfo = (item, idES = false) => {
    const equipStateInfo = new EquipStateInfo(item);
    const styles = {
        normal: {
            show: !idES,
            textShow: !idES,
            bubbleShow: false,
            dotShow: !idES,
            dotVisible: !idES,
            joinCollide: true,
            dotColor: baseColors['$green-700'],
            tagBgColor: '#C4C9CF',
            renderOrder: RenderOrder.equip,
            priority: RenderOrder.equip,
            weight: RenderOrder.equip
        },

        onPlay: {
            show: true,
            textShow: true,
            dotShow: true,
            joinCollide: false,
            dotColor: baseColors['$blue-500'],
            textColor: baseColors.$white,
            textBgColor: baseColors['$blue-500'],
            renderOrder: RenderOrder.hover,
            priority: RenderOrder.hover
        },

        abnormal: {
            show: true,
            dotShow: true,
            dotVisible: true,
            dotColor: baseColors['$red-500'],
            textColor: baseColors.$white,
            textBgColor: baseColors['$red-500'],
            priority: RenderOrder.equip + 2,
            weight: RenderOrder.equip + 2,
            dotCssName: 'breath'
        },

        // 超重
        overload: {
            show: true,
            dotShow: true,
            dotVisible: true,
            dotColor: baseColors['$orange-500'],
            textColor: baseColors.$white,
            textBgColor: baseColors['$orange-500'],
            textBorder: '1px solid #fff',
            priority: RenderOrder.equip + 3,
            weight: RenderOrder.equip + 3,
            dotCssName: 'breath'
        },

        // 异常和控反不一致
        abnormalAndOverload: {
            show: true,
            dotShow: true,
            dotVisible: true,
            dotColor: `${baseColors['$red-500']};${baseColors['$orange-500']}`,
            textColor: baseColors.$white,
            textBgColor: baseColors['$red-500'],
            textBorder: '1px solid #fff',
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
    };

    equipStateInfo.setStateStyles(styles);
    return equipStateInfo;
};

export const createEqupIconInfo = (item, relationParentPos = true) => {
    const meta = { relationParentPos };
    const equipIconInfo = new ESEquipIconInfo(item, meta);
    const normalStyle = equipIconInfo.defineStyles?.normal || {};

    const isEscalatorOrSL = isEscalator(item?.classCode) || isStraightLadder(item?.classCode);
    const iconBgColor = isEscalatorOrSL ? '#567EAD' : '#8B949E';
    equipIconInfo.setStateStyles({
        normal: {
            ...normalStyle,
            iconBgColor, // 图标背景
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
            priority: 2001
        },
        filterHide: {
            show: false,
            priority: 1000
        }
    });

    return equipIconInfo;
};
export const createSpaceLabelInfoModel = (item, floorElevation) => {
    const floorHeight = M2FOOT * Number(floorElevation || 0);
    const model = new SpaceIconInfoCommon(item, { floorHeight });

    const showIcon = isToilet(item.roomFuncType);
    model.setStateStyles({
        normal: {
            ...model.defineStyles.normal,
            show: true,
            textShow: false,
            iconShow: showIcon
        },

        hover: {
            show: true,
            textShow: true,
            iconShow: showIcon,
            cssName: 'hover',
            textColor: '#1B2129',
            renderOrder: RenderOrder.hover,
            priority: StatePriority.hover
        },

        filterHide: {
            show: false,
            priority: 500
        },

        hide: {
            show: false,
            priority: Infinity
        }
    });
    return model;
};

export const createEntranceAndExitsPrDoorGroupsIconInfo = item => {
    let m = null;
    if (item.objType === OBJ_TYPE.SPACE) {
        const floorHeight = M2FOOT * Number(item.floorElevation || 0);
        m = new SpaceIconInfoCommon(item, { floorHeight });
        m.setStateStyles({
            normal: {
                show: true,
                iconShow: true,
                textShow: false,
                cssName: 'space-info-container',
                textColor: '#626c78',
                iconbgColor: '#ffffff',
                // '#1b2129', '#fff', bgColor
                width: 18,
                height: 18,
                renderOrder: 0,
                priority: 0
            },
            hover: {
                show: true,
                textShow: true,
                iconShow: true,
                joinCollide: false,
                cssName: 'space-info-container',
                textColor: '#626c78',
                iconbgColor: '#ffffff',
                width: 18,
                height: 18,
                renderOrder: 0,
                priority: 0
            },
            filterHide: {
                show: false,
                priority: 1000
            }
        });
    } else {
        m = new ESEquipIconInfo(item);
        const normalStyle = m.defineStyles?.normal || {};

        m.setStateStyles({
            normal: {
                ...normalStyle,
                show: true // 是否显示
            },

            filterHide: {
                show: false,
                priority: 1000
            }
        });
    }
    return m;
};
// 门组

export const getEquipStylesDefine = (item, normalStyle) => {
    const baseStyles = getEquipStyles(item, normalStyle) || {};
    // 扶梯设备
    if (isEscalator(item?.classCode)) {
        // 扶梯在楼层视角也显示
        delete baseStyles.floorMode;
        if (baseStyles.normal) {
            baseStyles.normal.color = '#567EAD';
        }
        baseStyles.goUp = {
            color: '#9B6CED',
            priority: 15
        };
        // 静止
        baseStyles.static = {
            show: true,
            color: '#424c59',
            priority: 15
        };

        baseStyles.goDown = {
            show: true, // 是否显示
            color: '#00a2a7',
            priority: 15
        };
        baseStyles.locked = {
            show: true, // 是否显示
            color: '#8b949e',

            priority: 20
        };
    }
    return baseStyles;
};
