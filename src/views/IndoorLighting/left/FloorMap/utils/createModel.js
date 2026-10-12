// @ts-ignore
import i18n from '@/localization';
import { RenderOrder, StatePriority } from '@/views/GraphMVC/graphScene/GraphSceneDefine';
import { baseColors } from '@/constants/baseColors';

import Space from '@/views/GraphMVC/graphScene/Space/Space';
import SpaceStatusBubble from '../graph/SpaceStatusBubble/SpaceStatusBubble';
import FEEquipIcon from '../graph/FEEquipIcon/FEEquipIcon';
import SpaceInfo from '../graph/SpaceInfo/SpaceInfo';
import SpaceIconInfoCommon from '@/views/GraphMVC/graphScene/SpaceIconInfoCommon/SpaceIconInfoCommon';
import SpaceCard from '../graph/SpaceCard/SpaceCard';
import SpaceAggregatorInfo from '../graph/SpaceAggregatorInfo/SpaceAggregatorInfo';
import { SpaceType } from '../hooks/useFloorMapHook';

export const createSpaceModel = (objData, { floorHeight, _height }) => {
    const normalOpacity = 1;
    const deepOpacity = 1;

    const spaceModel = new Space(objData, 0, floorHeight);
    spaceModel.setStateStyles(
        objData.type === SpaceType.position
            ? {
                  normal: {
                      show: true
                  }
              }
            : {
                  normal: {
                      ...spaceModel.defineStyles.normal,
                      color: '#ffffff',
                      show: true,
                      useLinearColor: false,
                      alpha: normalOpacity,
                      priority: RenderOrder.space
                  },
                  abnormal: {
                      color: '#ECC0BE',
                      priority: RenderOrder.space + 1
                  },
                  hover: {
                      show: true,
                      alpha: deepOpacity,
                      useAnimate: true,
                      colorMode: 'dark',
                      priority: 2500
                  },
                  relSpacesHover: {
                      show: true,
                      //   outline: true,
                      alpha: deepOpacity,
                      colorMode: 'dark',
                      useAnimate: true,
                      animationIterationCount: Infinity,
                      priority: 2500
                  },

                  selected: {
                      show: true,
                      color: baseColors['$blue-500'],
                      alpha: deepOpacity,
                      priority: RenderOrder.selected
                  },
                  innerSelected: {
                      show: true,
                      alpha: deepOpacity,
                      priority: RenderOrder.selected
                  },
                  onOffNormal: {
                      color: '#A3D4B6',
                      priority: RenderOrder.space + 5
                  },
                  onOffAbnormal: {
                      color: '#F2BFA5',
                      priority: RenderOrder.space + 5
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
              }
    );

    return spaceModel;
};

export const createEquipIcon = data => {
    const model = new FEEquipIcon(data);

    return model;
};

export function createSpaceCard(data, floorHeight) {
    const model = new SpaceCard(data, { floorHeight });
    model.setStateStyles({
        normal: {
            show: true,
            // 是否完整显示
            fullShow: false,
            showSelect: false,
            renderOrder: RenderOrder.card + 1,
            priority: StatePriority.normal
        },
        filterCardHide: {
            // show: false,
            // 一般情况下只展示有异常回路的控制模块
            fullShow: false,
            priority: 1000
        },
        // 显示所有控制器(顶部勾选“查看模块及回路”)
        showAllController: {
            fullShow: true,
            priority: 1000
        },
        hover: {
            show: true,
            opacity: 1,
            fullShow: true,
            renderOrder: RenderOrder.card + 3,
            priority: 2500
        },
        innerHover: {
            show: true,
            opacity: 1,
            renderOrder: RenderOrder.card + 3,
            priority: 2500
        },
        // 选中
        selected: {
            show: false,

            renderOrder: RenderOrder.card + 2,
            priority: 3000
        },
        innerSelected: {
            show: true,
            showSelect: true,
            fullShow: true,
            renderOrder: RenderOrder.card + 2,
            priority: 3001
        },
        // 关联模式下
        isRelMode: {
            priority: 2000
        },
        // 关联模式下显示
        relModeShow: {
            controllerShow: true,
            opacity: 0.3,
            priority: 2001
        },
        // 是关联对象
        isRelObject: {
            opacity: 1,
            hideLabel: false,
            priority: 2002
        },
        hasLux: {
            bottomGap: 15,
            priority: 4000
        }
    });
    return model;
}

export const createSpaceLabelInfoModel = (item, floorHeight) => {
    const model = new SpaceAggregatorInfo(item, { floorHeight });
    model.setStateStyles({
        normal: {
            show: true,
            color: '#1B2129',
            controllerShow: false,
            // 是否展示照度值
            workPlaneLuxShow: false,
            spaceIcon: false,
            showLegend: false,
            spaceIconColor: baseColors['$grey-600'],
            joinCollide: true,
            priority: RenderOrder.space,
            renderOrder: item.type === SpaceType.hostsController ? RenderOrder.space + 1 : RenderOrder.space
        },
        // hover
        hover: {
            show: true,
            priority: 2500,
            opacity: 1,
            color: '#246FE5',
            hideLabel: false,
            renderOrder: RenderOrder.hover
        },
        selected: {
            show: true,
            color: '#246FE5',
            spaceIcon: false,
            selectedIcon: true,
            hideLabel: false,
            renderOrder: RenderOrder.selected,
            priority: 3000
        },
        innerSelected: {
            show: true,
            renderOrder: RenderOrder.selected,
            priority: 3001
        },
        collided: {
            show: false,
            priority: 2100
        },

        // partOpen: {
        //     workPlaneLuxShow: true,
        //     spaceIconColor: baseColors['$orange-800'],
        //     priority: RenderOrder.space + 5
        // },
        // allOpen: {
        //     workPlaneLuxShow: true,
        //     spaceIconColor: baseColors['$orange-600'],
        //     priority: RenderOrder.space + 5
        // },
        // allClose: {
        //     workPlaneLuxShow: true,
        //     spaceIconColor: baseColors['$grey-900'],
        //     priority: RenderOrder.space + 5
        // },
        // feedbackAdjustment: {
        //     showFeedback: true,
        //     priority: RenderOrder.space + 5
        // },
        // controllerSelected: {
        //     controllerBg: '#246FE5',
        //     priority: RenderOrder.space + 5
        // },
        // // 全楼下异常
        // abnormal: {
        //     // spaceIconColor: baseColors['$red-500'],
        //     // color: baseColors['$red-500'],
        //     priority: RenderOrder.space + 5
        // },

        // // 超出空间数量上限情况
        // spceLimitMode: {
        //     spaceIcon: true,
        //     priority: RenderOrder.space + 5
        // },
        // floorMode: {
        //     show: true,
        //     controllerShow: true,
        //     spaceIcon: false,
        //     showLegend: true,
        //     priority: RenderOrder.space + 6
        // },

        // 关联模式下
        isRelMode: {
            show: false,
            priority: 2000
        },
        // 关联模式下显示
        relModeShow: {
            show: true,
            controllerShow: true,
            opacity: 0.3,
            priority: 2001
        },
        // // 是关联对象
        isRelObject: {
            opacity: 1,
            hideLabel: false,
            priority: 2002
        },
        filterHide: {
            show: false,
            hideLabel: true,
            priority: 500
        },
        hasLux: {
            bottomGap: 16,
            priority: 4000
        }
        // controllerShow: {
        //     show: true,
        //     controllerShow: true,
        //     priority: 600
        // },
        // hide: {
        //     show: false,
        //     priority: Infinity
        // }
    });
    return model;
};

export const createSpacePositionInfoModel = (item, floorHeight) => {
    const model = new SpaceAggregatorInfo(item, { floorHeight });
    model.setStateStyles({
        normal: {
            show: true,
            color: '#626C78',
            controllerShow: false,
            // 是否展示照度值
            workPlaneLuxShow: false,
            showLegend: false,
            spaceIconColor: baseColors['$grey-500'],
            joinCollide: true,
            priority: RenderOrder.space,
            renderOrder: RenderOrder.postionSpace
        },
        hover: {
            show: true,
            showName: false,
            renderOrder: RenderOrder.hover
        },
        filterHide: {
            show: false,
            priority: 500
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
