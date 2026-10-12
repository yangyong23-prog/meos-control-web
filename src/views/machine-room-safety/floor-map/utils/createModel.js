// @ts-ignore
import i18n from '@/localization';
import { RenderOrder, StatePriority } from '@/views/GraphMVC/graphScene/GraphSceneDefine';
import { baseColors } from '@/constants/baseColors';
import { isCamera } from './index';
// import { SPACE_STATUS } from '../../variable';

import MultipleSpace from '@/views/GraphMVC/graphScene/MultipleSpace/MultipleSpace';
import AirEquipIconInfo from '../graph/AirEquipIconInfo/AirEquipIconInfo';
import SpacePopoverInfo from '../graph/SpacePopoverInfo/SpacePopoverInfo';
import SpaceNameInfo from '../graph/SpaceNameInfo/SpaceNameInfo';

export const createSpaceModel = (objData, { floorHeight, _height }) => {
    const normalOpacity = 1;
    const deepOpacity = 1;
    // const spaceModel = new Space(objData, 0, floorHeight);
    const spaceModel = new MultipleSpace(objData, { height: 0, floorHeight, depths: [0.01] });
    spaceModel.setStateStyles({
        normal: {
            color: '#A3D4B6',
            show: true,
            useLinearColor: false,
            alpha: normalOpacity
        },
        hover: {
            show: true,
            alpha: deepOpacity,
            colorMode: 'dark',
            priority: 2003
        },
        selected: {
            show: true,
            color: baseColors['$blue-500'],
            alpha: deepOpacity,
            priority: RenderOrder.selected
        },
        filterHide: {
            show: false,
            priority: 50
        },

        isNormal: {
            color: '#A3D4B6',
            priority: RenderOrder.space,
            show: true
        },
        noRiskEvent: {
            color: '#CED6E1',
            priority: RenderOrder.space,
            show: true
        },
        unknown: {
            color: '#BAB6DE',
            priority: RenderOrder.space,
            show: true
        },
        potential: {
            color: '#EDD4A1',
            priority: RenderOrder.space,
            show: true
        },
        exception: {
            color: '#F0ABA8',
            priority: RenderOrder.space,
            show: true
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
        }
    });

    return spaceModel;
};

export const createSpaceLabelInfoModel = (item, { floorHeight }) => {
    const spaceNameItem = { ...item, name: item?.localName ?? '--' };
    const model = new SpaceNameInfo(spaceNameItem, { floorHeight });

    model.setStateStyles({
        normal: {
            ...model.defineStyles.normal,
            show: true,
            textShow: true,
            iconShow: false,

            // 默认正常色
            color: '#A3D4B6',
            priority: RenderOrder.space
        },
        hover: {
            show: true,
            textShow: true, // 显示文字
            textColor: '#246FE5',
            renderOrder: RenderOrder.hover,
            priority: 403,
            showColorAlpha: 1,
            blendAlpha: 1
        },
        filterHide: {
            show: false,
            priority: 500
        },
        hide: {
            show: false,
            priority: Infinity
        },
        // 文字被碰撞
        textCollided: {
            show: false,
            textShow: false,
            priority: 500
        },
        // 关联模式下
        isRelMode: {
            show: false,
            priority: 400
        },
        // 关联模式下显示
        relModeShow: {
            show: true,
            colorMode: 'blend',
            blendAlpha: 0.3,
            blendColor: '#D0D7E3',
            priority: 401,
            showColorAlpha: 0.3
        },
        // 是关联对象
        isRelObject: {
            colorMode: '',
            priority: 402
        }
    });
    return model;
};

export const createSpacePopoverInfoModel = (objData, { floorHeight }) => {
    const model = new SpacePopoverInfo(objData, { floorHeight });
    model.setStateStyles({
        normal: {
            ...model.defineStyles.normal,
            show: true,
            showText: true,
            iconShow: false,

            // 默认正常色
            color: '#A3D4B6'
        },
        hover: {
            show: true,
            showText: true, // 显示文字
            textColor: '#246FE5',
            renderOrder: RenderOrder.hover,
            priority: 403,
            showColorAlpha: 1,
            blendAlpha: 1
        },
        filterHide: {
            show: false,
            priority: 500
        },
        hide: {
            show: false,
            priority: Infinity
        },

        isNormal: {
            color: '#A3D4B6',
            renderOrder: RenderOrder.space + 1,
            show: true,
            showText: true,
            bubbleBgColor: '#3FBE72'
        },
        noRiskEvent: {
            color: '#A3D4B6',
            renderOrder: RenderOrder.space + 1,
            show: true,
            showText: true,
            showBubble: false
        },
        unknown: {
            color: '#BAB6DE',
            renderOrder: RenderOrder.space + 1,
            show: true,
            showText: true,
            bubbleBgColor: '#9B6CED'
        },
        potential: {
            color: '#EDD4A1',
            renderOrder: RenderOrder.space + 1,
            show: true,
            showText: true,
            dotColor: '#FF9D00',
            bubbleBgColor: '#FF9D2D'
        },
        exception: {
            color: '#F0ABA8',
            renderOrder: RenderOrder.space + 1,
            show: true,
            showText: true,
            dotColor: '#F55047',
            bubbleBgColor: '#FE5D55'
        },
        // 关联模式下
        isRelMode: {
            show: false,
            priority: 400
        },
        // 关联模式下显示
        relModeShow: {
            show: true,
            colorMode: 'blend',
            blendAlpha: 0.3,
            blendColor: '#D0D7E3',
            priority: 401,
            showColorAlpha: 0.3
        },
        // 是关联对象
        isRelObject: {
            colorMode: '',
            priority: 402
        }
    });
    return model;
};

export const createEquipModel = data => {
    const isCameraEquip = isCamera(data.classCode);
    const meta = isCameraEquip ? { iconFillColor: '#8252E3' } : {};
    const model = new AirEquipIconInfo(data, meta);
    if (isCameraEquip) {
        model.setAsyncState('cameraDefault', true);
    }
    return model;
};
