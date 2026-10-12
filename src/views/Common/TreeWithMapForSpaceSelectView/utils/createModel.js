// @ts-ignore
import i18n from '@/localization';
import { RenderOrder, StatePriority } from '@/views/GraphMVC/graphScene/GraphSceneDefine';
import { baseColors } from '@/constants/baseColors';

import MultipleSpace from '@/views/GraphMVC/graphScene/MultipleSpace/MultipleSpace';
import SpaceNameInfo from '../graph/spaceNameInfo/SpaceNameInfo';

export const createSpaceModel = (objData, { floorHeight, _height }) => {
    const normalOpacity = 1;
    const deepOpacity = 1;
    const spaceModel = new MultipleSpace(objData, { height: 0, floorHeight, depths: [0.01] });
    spaceModel.setStateStyles({
        normal: {
            color: '#A1C8E5',
            show: true,
            useLinearColor: false,
            alpha: normalOpacity
        },
        hover: {
            show: true,
            alpha: deepOpacity,
            colorMode: 'dark',
            priority: RenderOrder.hover
        },
        unSelected: {
            show: true,
            color: '#A1C8E5',
            alpha: normalOpacity,
            priority: RenderOrder.selected
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
            priority: StatePriority.hover
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
        }
    });
    return model;
};
