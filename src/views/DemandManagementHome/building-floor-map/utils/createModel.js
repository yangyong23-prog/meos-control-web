// @ts-ignore
import i18n from '@/localization';
import { RenderOrder, StatePriority } from '@/views/GraphMVC/graphScene/GraphSceneDefine';
import { baseColors } from '@/constants/baseColors';

import { isHideLeftShieldList } from '../../constant/config';

import MultipleSpace from '@/views/GraphMVC/graphScene/MultipleSpace/MultipleSpace';
// import Space from '@/views/GraphMVC/graphScene/Space/Space';
import Floor from '@/views/GraphMVC/graphScene/Floor/Floor';
import FloorTagInfo from '@/views/GraphMVC/graphScene/FloorTagInfo/FloorTagInfo';
import SpacePopoverInfo from '../graph/SpacePopoverInfo/SpacePopoverInfo';
export const createSpaceModel = (objData, { floorHeight, _height, demandType }) => {
    const normalOpacity = 1;
    const deepOpacity = 1;

    const hideShield = isHideLeftShieldList(demandType);
    const spaceModel = new MultipleSpace(objData, { height: 0, floorHeight, depths: [_height * 0.6, 0.01] });
    spaceModel.setStateStyles({
        normal: {
            ...spaceModel.defineStyles.normal,
            color: '#dfe6ee',
            show: true,
            useLinearColor: false,
            alpha: normalOpacity
        },
        floorMode: {
            priority: RenderOrder.space + 20,
            alpha: 1
        },
        hover: {
            show: true,
            alpha: deepOpacity,
            colorMode: 'dark',
            priority: RenderOrder.hover
        },
        customConfig: {
            color: '#FACD73',
            priority: RenderOrder.space + 5
        },
        ...(hideShield
            ? {}
            : {
                  shielded: {
                      color: '#B0B5BA',
                      priority: RenderOrder.space + 5
                  }
              }),
        quoteParent: {
            color: '#A1C8E5',
            priority: RenderOrder.space + 5
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

export const createSpaceLabelInfoModel = (objData, { floorHeight, demandType }) => {
    const hideShield = isHideLeftShieldList(demandType);
    const model = new SpacePopoverInfo(objData, { floorHeight });

    model.setStateStyles({
        normal: {
            ...model.defineStyles.normal,
            show: false,
            iconShow: false
        },
        hover: {
            show: true,
            showText: true, // 显示文字
            iconShow: false,
            cssName: 'hover',
            textColor: '#246FE5',
            renderOrder: RenderOrder.hover,
            priority: StatePriority.hover
        },
        floorMode: {
            show: true,
            showText: true, // 显示文字
            priority: StatePriority.hover - 5
        },
        ...(hideShield
            ? {}
            : {
                  shielded: {
                      showText: false, // 显示文字
                      priority: StatePriority.hover - 4
                  }
              }),
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

export const createFloorModel = (info, meshInfo) => {
    const floorModel = new Floor({ ...info }, meshInfo);
    const { floorMesh, floorWframeMesh } = meshInfo;
    floorModel.setStateStyles({
        normal: {
            show: false,
            floorMaterialType: floorMesh?.material.type,
            floorColor: floorMesh?.material.color.getHex(),
            floorAlpha: floorMesh?.material.opacity,
            floorSide: floorMesh?.material.side,
            wframeMaterialType: floorWframeMesh?.material.type,
            wframeColor: floorWframeMesh?.material.color.getHex(),
            wframeAlpha: floorWframeMesh?.material.opacity,
            wframeSide: floorWframeMesh?.material.side
        },
        customConfig: {
            wframeColor: '#FACD73',
            floorColor: '#FACD73'
        },
        inUse: {
            show: true
        },
        hover: {
            floorAlpha: 0.6,
            wframeAlpha: 0.8,
            wframeColor: '#246FE5',
            floorColor: '#246FE5'
        },
        active: {
            floorAlpha: 0.6,
            wframeAlpha: 0.8,
            wframeColor: '#246FE5',
            floorColor: '#246FE5'
        },
        relModeHide: {
            show: false,
            priority: 100
        },
        hide: {
            show: false,
            priority: 1000
        }
    });
    // floorModel.userinteractionEnable = false; // 不参与射线求交
    return floorModel;
};

export const createFloorTagModel = (newInfo, cameraDirection) => {
    const floorTag = new FloorTagInfo({ ...newInfo, cameraDirection });

    // floorTag.defineStyles.hover.tagClass = '_map_floor_tag_hover';
    floorTag.setStateStyles({
        normal: {
            show: false
        },
        relModeHide: {
            show: false,
            priority: 100
        },
        // inUse: {
        //     show: true,
        //     priority: 1000
        // },
        hover: {
            show: true,
            color: '#246FE5',
            nameColor: '#ffffff',
            fontWeight: 'bold',
            tagNameClass: 'floor_tag_name_hover',
            renderOrder: RenderOrder.hover
        },
        selected: {
            show: true,
            color: '#246FE5',
            nameColor: '#ffffff',
            fontWeight: 'bold',
            tagNameClass: 'floor_tag_name_hover',
            renderOrder: RenderOrder.active
        },
        active: {
            show: true,
            color: '#246FE5',
            nameColor: '#ffffff',
            fontWeight: 'bold',
            tagNameClass: 'floor_tag_name_hover',
            renderOrder: RenderOrder.active
        },
        hide: {
            show: false,
            priority: 1000
        }
    });

    return floorTag;
};
