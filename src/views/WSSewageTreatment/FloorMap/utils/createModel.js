// @ts-ignore
import i18n from '@/localization';
import { RenderOrder, StatePriority } from '@/views/GraphMVC/graphScene/GraphSceneDefine';
import { baseColors } from '@/constants/baseColors';

import Space from '@/views/GraphMVC/graphScene/Space/Space';
import WsstEquipIconInfo from '../graph/WsstEquipIconInfo/WsstEquipIconInfo';
import SpaceIconInfoCommon from '@/views/GraphMVC/graphScene/SpaceIconInfoCommon/SpaceIconInfoCommon';

export const createSpaceModel = (objData, { floorHeight, _height }) => {
    const normalOpacity = 1;
    const deepOpacity = 1;

    const spaceModel = new Space(objData, 0, floorHeight);
    spaceModel.setStateStyles({
        normal: {
            ...spaceModel.defineStyles.normal,
            color: '#B0D7BF',
            show: true,
            useLinearColor: false,
            alpha: normalOpacity
        },
        abnormal: {
            color: '#ECC0BE',
            priority: StatePriority + 5
        },
        hover: {
            show: true,
            alpha: deepOpacity,
            colorMode: 'dark',
            priority: 2500
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

export const createEquipIcon = data => {
    const model = new WsstEquipIconInfo(data);

    return model;
};

export const createSpaceLabelInfoModel = (item, floorHeight) => {
    const model = new SpaceIconInfoCommon(item, { floorHeight });

    model.setStateStyles({
        normal: {
            ...model.defineStyles.normal,
            show: true,
            textShow: true,
            iconShow: false,
            renderOrder: RenderOrder.equip - 5
        },
        hover: {
            ...model.defineStyles.hover,
            opacity: 1,
            priority: 2100
        },
        selected: {
            ...model.defineStyles.selected,
            opacity: 1,
            priority: 2100
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
        relModeShow: {
            show: true,
            opacity: 0.5,
            renderOrder: RenderOrder.equip - 1,
            priority: 2001
        },
        hide: {
            show: false,
            priority: Infinity
        }
    });
    return model;
};
