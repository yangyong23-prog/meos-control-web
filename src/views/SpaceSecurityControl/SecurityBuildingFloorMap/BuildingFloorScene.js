import { WebGLScene } from '@yushu/core3d';
import { SceneLoader, EffectLoader } from '@yushu/effecttool';
import { debounce } from 'lodash';
import CameraControls from 'camera-controls';
import * as THREE from '@yushu/three-base';
import { parseMainBuildingBoardInfo, isFloor, isFloorFrame, calcFloorDirectionalLight, restoreControls, convertP3ToP2, getEquipStyles } from '@/apm-3d/utils/buildingTools';
import RootNode from '@/views/GraphMVC/graphScene/RootNode/RootNode';
import Controller from '@/views/GraphMVC/core/Controller';
import { INTERFACE_PREFIX_RWD } from '@/config';
import { GraphResourceManager } from '@/views/GraphMVC/utils/GraphResourceManager';
import EquipStateInfo from '@/views/GraphMVC/graphScene/EquipStateInfo/EquipStateInfo';

import EquipStateDetector from './graph/CollisionDetector/EquipStateDetector';
import AirEquipIconInfoDetector from './graph/CollisionDetector/AirEquipIconInfoDetector';
import AirEquipIconInfo from './graph/AirEquipIconInfo/AirEquipIconInfo';
import i18n from '@/localization';
import { OBJ_TYPE } from '@/utils/globalVariables';
import Group from '@/views/GraphMVC/graphScene/Group/Group';
import Floor from '@/views/GraphMVC/graphScene/Floor/Floor';
import MultipleSpace from '@/views/GraphMVC/graphScene/MultipleSpace/MultipleSpace';
import SpaceIconInfoCommon from '@/views/GraphMVC/graphScene/SpaceIconInfoCommon/SpaceIconInfoCommon';
import { modelNameEnum, RenderOrder, StatePriority } from '@/views/GraphMVC/graphScene/GraphSceneDefine';
import { getFloorInfoByFloorId } from '@/utils/buildingFloorTreeUtils';
import { baseColors } from '@/constants/baseColors';
import VisibilityContext from '@/views/GraphMVC/graphScene/Context/VisibilityContext';

import AdvanceLinkLine from '@/views/GraphMVC/graphScene/AdvanceLinkLine/AdvanceLinkLine';

import Equip from '@/views/GraphMVC/graphScene/Equip/Equip';

const { M2FOOT, MM2FOOT, ResourceTracker } = THREE.baseUtils;

import { CONTROL_BAR_TAB_KEYS, computeSpaceAccessStatus, CAMERA_TYPES_OMIT_OTHER } from '../constants/index';
import DockSingleton from '@/hooks/responsiveDock';

const WIREFRAME_SCENE_NAME = '07_building_relation';
const D3_SCENE_NAME = '05_building_classic';

const BUILDING_MODE = 1;
const FLOOR_MODE = 2;
// 枚举空间撤布防映射状态
const SPACE_DEPLOYMENT_DATA_SOURCE_MAP = [
    {
        code: '1',
        name: i18n.global.t('common.arm'),
        status: 'armed'
    },
    {
        code: '2',
        name: i18n.global.t('meos_control_web.disarm_alt'),
        status: 'disarmed'
    },
    {
        code: '3',
        name: i18n.global.t('meos_control_web.partial_arm'),
        status: 'partiallyArmed'
    },
    {
        code: '99',
        name: i18n.global.t('meos_control_web.unknown'),
        status: 'unmonitored'
    }
];

// 通行状态，空间、门
const DEPLOYMENT_STATUS_MAP_STATE = {
    NORMALLY_OPEN: 'openAccess', //开放式通行、常开
    NORMAL_CLOSE: 'closeAccess', //不可通行、长关
    PERMISSION_PASS: 'authorizedAccess', //权限通行
    UNMONITORED: 'unmonitored' //无法监测
};

export const SPACE_ACCESS_DATA_SOURCE_MAP = [
    {
        code: '1',
        name: i18n.global.t('meos_control_web.access_by_permission'),
        status: 'PERMISSION_PASS'
    },
    {
        code: '2',
        name: i18n.global.t('meos_control_web.all_personnel_access'),
        status: 'NORMALLY_OPEN'
    },
    {
        code: '3',
        name: i18n.global.t('meos_control_web.all_personnel_no_access'),
        status: 'NORMAL_CLOSE'
    }
];

const EQUIP_ACCESS_DATA_SOURCE_MAP = [
    {
        code: '1',
        name: i18n.global.t('meos_control_web.all_personnel_access'),
        status: 'NORMALLY_OPEN'
    },
    {
        code: '2',
        name: i18n.global.t('meos_control_web.all_personnel_no_access'),
        status: 'NORMAL_CLOSE'
    },
    {
        code: '3',
        name: i18n.global.t('meos_control_web.access_by_permission'),
        status: 'PERMISSION_PASS'
    },
    {
        code: '4',
        name: i18n.global.t('meos_control_web.no_demand1'),
        status: 'UNMONITORED'
    }
];

const ONLINE_STATUS_MAP = [
    {
        code: '0',
        name: i18n.global.t('meos_control_web.offline'),
        status: 'OFFLINE'
    },
    {
        code: '1',
        name: i18n.global.t('meos_control_web.online'),
        status: 'ONLINE'
    }
];

const ORDER_FAIL_STATUS_MAP = [
    {
        code: '0',
        name: i18n.global.t('meos_control_web.normal'),
        status: 'NORMAL'
    },
    {
        code: '1',
        name: i18n.global.t('meos_control_web.alarm'),
        status: 'CONTROL_REVERSE_INCONSISTENT'
    }
];

const isSmallIcon = item => {
    return item.iconType === 'FIRST_CLASS_SMALL_ICON' || item.iconType === 'SECOND_CLASS_SMALL_ICON';
};

const createSpaceModel = item => {
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
            show: false,
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
            alpha: deepOpacity,
            colorMode: 'dark',
            priority: 2500
        },

        // 布防
        armed: {
            show: true,
            // color: '#FF8845',
            color: '#F2B8A5',
            alpha: normalOpacity,
            priority: RenderOrder.space + 1
        },
        // 部分布防
        partiallyArmed: {
            show: true,
            // color: '#F2CB0C',
            color: '#EDD4A1',
            alpha: normalOpacity,
            priority: RenderOrder.space + 1
        },
        // 撤防
        disarmed: {
            show: true,
            // color: '#ACC2DE',
            color: '#A3B8CF',
            alpha: normalOpacity,
            priority: RenderOrder.space + 1
        },
        // 无法监测
        unmonitored: {
            show: true,
            // color: '#C4C9CF',
            color: '#BBC1C8',
            alpha: normalOpacity,
            priority: RenderOrder.space + 1
        },
        // 撤布防无法检测
        deploymentUnmonitored: {
            show: true,
            color: '#BBC1C8',
            alpha: normalOpacity,
            priority: RenderOrder.space + 1
        },
        //
        openAccess: {
            show: true,
            // color: baseColors['$green-600'],
            color: '#A3D4B6',
            alpha: normalOpacity,
            priority: RenderOrder.space + 1
        },
        closeAccess: {
            show: true,
            // color: '#F0ABA8',
            color: '#F2B8A5',
            alpha: normalOpacity,
            priority: RenderOrder.space + 1
        },
        authorizedAccess: {
            show: true,
            // color: '#45AFFE',
            color: '#A1C8E5',
            alpha: normalOpacity,
            priority: RenderOrder.space + 1
        },

        // 异常
        abnormal: {
            show: true,
            // color: baseColors['$red-500'],
            color: '#F0ABA8',
            alpha: normalOpacity,
            priority: RenderOrder.space + 5
        },
        // 非异常
        unAbnormal: {
            // color: baseColors['$green-600'],
            color: '#A3D4B6',
            alpha: normalOpacity,
            priority: RenderOrder.space + 5
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

const createEqupStateInfo = item => {
    const equipStateInfo = new EquipStateInfo(item);
    const _tahText = isSmallIcon(item) ? null : '--';
    equipStateInfo.setStateStyles({
        normal: {
            show: true,
            textShow: true,
            bubbleShow: false,
            dotShow: true,
            dotVisible: true,
            joinCollide: true,
            dotColor: baseColors['$green-700'],
            tagText: _tahText,
            tagBgColor: '#C4C9CF',
            renderOrder: RenderOrder.equip,
            priority: RenderOrder.equip,
            weight: RenderOrder.equip
        },
        abnormal: {
            dotColor: baseColors['$red-500'],
            textColor: baseColors.$white,
            textBgColor: baseColors['$red-500'],
            textBorder: '1px solid #fff',
            priority: RenderOrder.equip + 2,
            weight: RenderOrder.equip + 2,
            dotCssName: 'breath'
        },
        // 控反不一致
        orderFail: {
            dotColor: baseColors['$orange-500'],
            textColor: baseColors.$white,
            textBgColor: baseColors['$orange-500'],
            textBorder: '1px solid #fff',
            priority: RenderOrder.equip + 3,
            weight: RenderOrder.equip + 3,
            dotCssName: 'breath'
        },

        // 异常和控反不一致
        abnormalOrderFail: {
            dotColor: `${baseColors['$red-500']};${baseColors['$orange-500']}`,
            textColor: baseColors.$white,
            textBgColor: baseColors['$red-500'],
            textBorder: '1px solid #fff',
            priority: RenderOrder.equip + 4,
            weight: RenderOrder.equip + 4,
            dotCssName: 'breath'
        },
        offline: {
            dotColor: `${baseColors['$grey-500']}`,
            textColor: baseColors.$white,
            textBgColor: baseColors['$grey-500'],
            textBorder: '1px solid #fff',
            priority: RenderOrder.equip + 1,
            weight: RenderOrder.equip + 1
        },
        opened: {
            tagText: i18n.global.t('meos_control_web.on'),
            tagBgColor: '#09B3B5',
            priority: RenderOrder.equip + 1
        },
        closed: {
            // dotColor: `#15AE55`,
            tagText: i18n.global.t('meos_control_web.off'),
            tagBgColor: '#2E3742',
            // textColor: baseColors.$white,
            // textBgColor: baseColors['$grey-500'],
            priority: RenderOrder.equip + 1
        },
        hover: {
            show: true,
            textShow: true,
            dotShow: true,
            joinCollide: false,
            textColor: baseColors.$white,
            textBgColor: baseColors['$blue-500'],
            textBorder: '1px solid #fff',
            renderOrder: RenderOrder.hover,
            priority: 2004
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
            priority: 2004
        },
        // 常开
        openAccess: {
            tagText: i18n.global.t('meos_control_web.normally_open'),
            tagBgColor: '#FFA51E',
            priority: RenderOrder.equip + 1
        },
        // 常闭
        closeAccess: {
            tagText: i18n.global.t('meos_control_web.normally_closed'),
            tagBgColor: '#7188A6',
            priority: RenderOrder.equip + 1
        },
        // 权限通行
        authorizedAccess: {
            tagText: i18n.global.t('meos_control_web.permission_access'),
            tagBgColor: '#45AFFE',
            priority: RenderOrder.equip + 1
        },
        floorMode: {
            show: false,
            priority: 2008
        },
        filterHide: {
            show: false,
            priority: 1000
        },
        videoHighlight: {
            show: true,
            textShow: true,
            priority: 1503
        },
        videoOpacityShow: {
            opacity: 0.2,
            priority: 1500
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
const renderOrderMap = {
    NORMAL_ICON: RenderOrder.equip + 8,
    FIRST_CLASS_SMALL_ICON: RenderOrder.equip + 4,
    SECOND_CLASS_SMALL_ICON: RenderOrder.equip + 2
};

const createEqupIconInfo = item => {
    const isSmIcon = isSmallIcon(item);
    const meta = isSmIcon ? { iconFillColor: '#8252E3' } : null;
    const equipIconInfo = new AirEquipIconInfo(item, meta);
    const normalStyle = equipIconInfo.defineStyles?.normal || {};
    const renderOrder = renderOrderMap[item.iconType] || RenderOrder.equip;
    equipIconInfo.setStateStyles({
        normal: {
            ...normalStyle,
            show: false, // 是否显示
            iconBgColor: isSmIcon ? '#ffffff' : '#8B949E',
            iconColor: isSmIcon ? '#8252E3' : '#ffffff',
            iconBorderColor: isSmIcon ? '#8252E3' : '',
            renderOrder
        },

        openAccess: {
            iconBgColor: '#FFA51E', // 图标背景
            priority: RenderOrder.equip + 1
        },
        closeAccess: {
            iconBgColor: '#7188A6', // 图标背景
            priority: RenderOrder.equip + 1
        },
        authorizedAccess: {
            iconBgColor: '#45AFFE', // 图标背景
            priority: RenderOrder.equip + 1
        },
        // hover
        onPlay: {
            show: true,
            showText: true,
            textColor: '#ffffff', // 字体颜色
            textShadow: '', // 字体描边
            iconBgColor: '#246FE5',
            textBgColor: '#246FE5', // 文字背景
            textBorder: '1px solid #fff',
            iconColor: '#fff',
            iconBorderColor: '#246FE5',
            showMark: false, // 显示标记
            renderOrder: RenderOrder.hover,
            priority: 2004
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
            priority: 2002
        },
        filterHide: {
            show: false,
            priority: 1000
        },
        videoEditMode: {
            showText: true, // 显示文字
            textColor: '#1B2129', // 字体颜色
            // textShadow: TEXT_SHADOW_STRING, // 字体描边
            textBgColor: '', // 文字背景
            textBorder: '',
            iconBgColor: isSmIcon ? '#ffffff' : '#8B949E',
            iconColor: isSmIcon ? '#8252E3' : '#ffffff',
            iconBorderColor: isSmIcon ? '#8252E3' : '',
            dotColor: '',
            showMark: false, // 显示标记
            priority: 1200
        },
        videoEditModeHover: {
            showText: true, // 显示文字
            textColor: '#246FE5', // 字体颜色
            // textShadow: TEXT_SHADOW_STR, // 字体描边
            textBgColor: '', // 文字背景
            textBorder: '#fff',
            iconBgColor: '#246FE5',
            iconColor: '#fff',
            iconBorderColor: '#fff',
            dotColor: '',
            showMark: false, // 显示标记
            priority: 2902,
            renderOrder: RenderOrder.hover
        },
        videoEditModeSelected: {
            textColor: '#1B2129', // 字体颜色
            // textShadow: TEXT_SHADOW_STR, // 字体描边
            textBgColor: '', // 文字背景
            textBorder: '#fff',
            iconBgColor: '#09B3B5',
            iconColor: '#fff',
            iconBorderColor: '#fff',
            dotColor: '',
            showMark: false, // 显示标记
            priority: 2901
        },
        videoHighlight: {
            show: true,
            showText: true, // 显示文字
            textColor: '#1B2129', // 字体颜色
            // textShadow: TEXT_SHADOW_STR, // 字体描边
            textBgColor: '', // 文字背景
            textBorder: '#fff',
            iconBgColor: '#09B3B5',
            iconColor: '#fff',
            iconBorderColor: '#fff',
            opacity: 1,
            priority: 2903
        },
        videoOpacityShow: {
            opacity: 0.2,
            priority: 2900
        }
    });

    return equipIconInfo;
};
const createSpaceLabelInfoModel = (item, floorHeight) => {
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
        hide: {
            show: false,
            priority: Infinity
        }
    });
    return model;
};

export default class PublicMapScene extends WebGLScene {
    constructor({
        projectId = '',
        groupCode,
        env = 'production',
        loadings,
        bgColor,
        curFilterType,
        filterEquipmentClass,
        cameraEquipmentClass,
        currentTabFloor,
        onlyShowControlledEquipment,
        selectedCameraTypes,
        selectedSpaceFuncTypes,
        showVideoGroupMap
    }) {
        super();
        this.projectId = projectId;
        this.groupCode = groupCode;
        this.env = env;

        this.floorModalMap = {}; // 楼层名字 到楼层信息的映射
        this.loadings = loadings;
        /**
         * [floorId]:{cfModel:,cfMesh:,floorModel:,floorMesh,floorOriginMat:,floorGreyMat}
         */
        this.floorIdMapModal = {}; // 楼层id映射模型
        RootNode.registerAll();
        this.bgColorRef = bgColor;
        this.curFilterTypeRef = curFilterType;
        this.filterEquipmentClassRef = filterEquipmentClass;
        this.cameraEquipmentClass = cameraEquipmentClass;
        this.currentTabFloorRef = currentTabFloor;
        this.onlyShowControlledEquipmentRef = onlyShowControlledEquipment;
        this.isVideoEditMode = false;
        this.selectedCameraTypesRef = selectedCameraTypes;
        this.selectedSpaceFuncTypesRef = selectedSpaceFuncTypes;
    }

    get curSelectedCameraTypes() {
        return this.selectedCameraTypesRef?.value;
    }

    get curSelectedSpaceFuncTypes() {
        return this.selectedSpaceFuncTypesRef?.value;
    }

    get curFilterType() {
        return this.curFilterTypeRef?.value;
    }
    get filterEquipmentClass() {
        return this.filterEquipmentClassRef?.value;
    }
    get curFilterAbnormal() {
        return this.curFilterAbnormalRef?.value;
    }

    get curFilterIntervened() {
        return this.curFilterIntervenedRef?.value;
    }

    get currentTabFloor() {
        return this.currentTabFloorRef?.value;
    }
    get onlyShowControlledEquipment() {
        return this.onlyShowControlledEquipmentRef?.value;
    }

    Init() {
        this.useCameraControls = true;
    }

    Create() {
        this.meshGroup = new THREE.Group();
        this.Scene.add(this.meshGroup);

        this.floorMeshGroup = new THREE.Group();
        this.Scene.add(this.floorMeshGroup);

        const defaultBg = new THREE.Color('#D6DDE5');
        this.Scene.background = defaultBg;

        // 场景加载器
        this.buildingSceneLoader = new SceneLoader(this.env, this.projectId, WIREFRAME_SCENE_NAME, this.renderer);
        this.floorMapSceneLoader = new SceneLoader(this.env, this.projectId, D3_SCENE_NAME, this.renderer);

        // 模式对应灯光
        this.lightsMap = {};
        // 模式对应背景
        this.bgModeMap = {};
        this.curSpaceShowMap = {};
        this.linkLines = [];

        this.initCamera();

        // 处理事件相关代码
        this.effectLoader = new EffectLoader(this.env, this.renderer);
        const composer = this.effectLoader.getComposer(this.Scene, this.camera);
        // this.composer.addPass(new ShaderPass(GammaCorrectionShader));
        // const outputPass = new OutputPass();
        // this.composer.addPass(outputPass);
        this.setComposser(composer);

        // 状态感知相关Space Model
        this.mainSpaceModelMap = new Map();
        this.equipGroupModelMap = new Map();
        this.curRelIdSet = new Set();

        // this.renderer.useLegacyLights = false;
        // 注册MapMvc
        this.renderContext = new VisibilityContext(this);
        this.renderContext.init('3d');
        this.rootNodeModel = new RootNode();
        this.mapController = new Controller(this.rootNodeModel, this.renderContext);
        this.mapController.delegate = this;

        this.materialManager = this.renderContext.materialManager;
        this.graphResourceManager = new GraphResourceManager({
            projectId: this.projectId,
            groupCode: this.groupCode,
            env: this.env,
            bdtpUrl: INTERFACE_PREFIX_RWD,
            materialManager: this.materialManager
        });

        this.loadError = false; // 加载场景错误
        // 空间小圆点名称碰撞器
        // this.spaceNameCollisionDetector = new EquipDotInfoCollisionDetector(this.renderContext);
        // 碰撞器初始化
        // #空间标签图元碰撞器
        this.equipStateDetector = new EquipStateDetector(this.renderContext);
        // TAG 设备图元碰撞器
        this.airEquipIconInfoDetector = new AirEquipIconInfoDetector(this.renderContext);
        this.airEquipIconInfoRelDetector = new AirEquipIconInfoDetector(this.renderContext);
        this._collisionInvokeDebounce = debounce(this.invokeScaleAndCollision, 20);
        this.bindEvent();

        this.tracker = new ResourceTracker();
        this.tracker.track(this.floorMeshGroup);
        this.tracker.track(this.meshGroup);
    }

    // controller 调用
    viewOnHoverTargetChanged({ newModel }) {
        if (newModel?.getState('selected')) {
            return;
        }
        this.unHighlightFloor();
        this.rootNodeModel.unhoverSpace();
        this.unhoverModel();

        // console.log('hover------newModel: ', newModel);
        if (newModel && newModel.name === modelNameEnum.MultipleSpace) {
            this.hoverSpaceModel(newModel);
            this.css3dRender.domElement.style.cursor = 'pointer';
        } else if (newModel && ((newModel.name === modelNameEnum.Group && newModel.data?.objType === OBJ_TYPE.EQUIPMENT) || newModel.name === modelNameEnum.Equip)) {
            this.hoverEquipModel(newModel);
            this.css3dRender.domElement.style.cursor = 'pointer';
        } else if (newModel && newModel.name === modelNameEnum.Floor) {
            this.highlightFloor(newModel);
            this.css3dRender.domElement.style.cursor = 'pointer';
        } else {
            this.css3dRender.domElement.style.cursor = 'default';
        }
    }

    // controller 调用
    viewOnLongHoverTargetChanged({ newModel }) {
        if (newModel && newModel.getState('selected')) {
            return;
        }

        if (newModel && newModel.name === modelNameEnum.MultipleSpace) {
            this.hoverCard(newModel);
            this.css3dRender.domElement.style.cursor = 'pointer';
        } else if (newModel && newModel.name === modelNameEnum.Equip) {
            this.hoverCard(newModel.parent);
        } else if (newModel && newModel.name === modelNameEnum.Group && newModel.data) {
            let showCard = true;
            if (this.mapMode === FLOOR_MODE) {
                const equipIcon = newModel.findChildByName(modelNameEnum.AirEquipIconInfo);
                if (equipIcon && equipIcon.haveAbsorb) {
                    showCard = false;
                }
            }
            if (showCard) {
                this.hoverCard(newModel);
            }

            this.css3dRender.domElement.style.cursor = 'pointer';
        }
    }

    // controller 调用
    viewOnClickTarget({ model }) {
        if (model && model.getState('selected')) {
            return;
        }
        this.unselectModel();
        // if (model.target) {
        //     model.setState('selected', true);
        // }
        if (model.name === modelNameEnum.MultipleSpace) {
            this.selectSpaceModel(model);
        } else if (model && model.name === modelNameEnum.Group) {
            this.clickEquipModel(model);
        } else if (model && (model.name === modelNameEnum.Equip || model.name === modelNameEnum.EquipStateInfo)) {
            this.clickEquipModel(model.parent);
        }
    }

    pauseRender(pause) {
        this.pauseRenderLoop = pause;
    }

    hoverModel(model) {
        model?.setState('hover', true);
        this.currentHoverModel = model;
    }
    hoverSpaceModel(sapceModel) {
        this.hoverModel(sapceModel);

        this.highlightFloor(sapceModel?.spaceData?.floorLocalId);
    }
    hoverEquipModel(model) {
        if (this.isVideoEditMode) {
            model.setState('videoEditModeHover', true);
            this.currentVideoHoverModel = model;
        } else {
            this.hoverModel(model);
            const fId = model?.data?.floorId;
            if (fId && this.floorIdMapModal[fId]?.floorLocalId) {
                this.highlightFloor(this.floorIdMapModal[fId].floorLocalId);
            }
        }
    }

    hoverCard(model) {
        const pos = convertP3ToP2(this.renderContext, model?.data?.bimLocation || model.spaceData?.bimLocation);
        if (this.isVideoEditMode) {
            if (this.mapMode === FLOOR_MODE) {
                this.dispatchEvent({
                    type: 'onHoverVideoCard',
                    data: { pos, instance: model?.data || model.spaceData }
                });
            }
        } else {
            this.dispatchEvent({
                type: 'onHoverCard',
                data: { pos, instance: model?.data || model.spaceData }
            });
        }
    }

    unhoverModel() {
        if (this.currentHoverModel) {
            this.currentHoverModel.setState('hover', false);
            this.currentHoverModel = null;
            this.dispatchEvent({
                type: 'onUnHover',
                data: {}
            });
        }
        if (this.currentVideoHoverModel) {
            this.currentVideoHoverModel.setState('videoEditModeHover', false);
            this.currentVideoHoverModel = null;
            this.dispatchEvent({
                type: 'onUnHoverVideo',
                data: {}
            });
        }
    }

    // 高亮楼板
    highlightFloor(floor, stateName = 'hover') {
        let model;
        if (typeof floor === 'string') {
            const floorInfo = this.floorModalMap[floor];
            model = floorInfo?.floorMVCModal;
        } else {
            model = floor;
        }

        if (model) {
            model.setState(stateName, true);
        }
    }

    // 取消高亮楼板
    unHighlightFloor(stateName = 'hover') {
        //
        Object.keys(this.floorModalMap).forEach(floorName => {
            const floorInfo = this.floorModalMap[floorName];
            const model = floorInfo?.floorMVCModal;
            if (model && model.getState(stateName)) {
                model.setState(stateName, false);
            }
        });
    }

    selectModel(model) {
        model.setState('selected', true);
        this.currentSelectedModel = model;
    }
    // 其他部分选择
    selectEquipModel(model) {
        this.selectModel(model);
        this.clickDetail(model.data);
        const fId = model?.data?.floorId;
        if (fId && this.floorIdMapModal[fId]?.floorLocalId) {
            this.highlightFloor(this.floorIdMapModal[fId].floorLocalId, 'active');
        }
    }
    // 点击地图
    clickEquipModel(model) {
        if (this.isVideoEditMode) {
            // const selected = !model.getState('videoEditModeSelected');
            // model.setState('videoEditModeSelected', selected);
            if (this.cameraEquipmentClass.includes(model?.data?.classCode)) {
                this.dispatchEvent({
                    type: 'onVideoEditModeSelected',
                    selected: false,
                    data: model.data
                });
            }
        } else {
            this.selectModel(model);
            this.clickDetail(model.data);
            const fId = model?.data?.floorId;
            if (fId && this.floorIdMapModal[fId]?.floorLocalId) {
                this.highlightFloor(this.floorIdMapModal[fId].floorLocalId, 'active');
            }
        }
    }
    selectSpaceModel(model) {
        this.selectModel(model);
        this.clickDetail(model.spaceData);
        this.highlightFloor(model.spaceData?.floorLocalId, 'active');
    }

    unselectModel() {
        this.unHighlightFloor('active');
        if (this.currentSelectedModel) {
            this.currentSelectedModel.setState('selected', false);
            this.currentSelectedModel = null;
        }
    }

    getBaseDataById(id) {
        const space = this.mainSpaceModelMap.get(id);
        const equip = this.equipGroupModelMap.get(id);
        const baseObj = space?.spaceData || equip?.data;
        return baseObj;
    }

    clickMapObj(obj) {
        this.unselectModel();
        this.unhoverMapObj();
        const space = this.mainSpaceModelMap.get(obj.id);
        if (space) {
            this.selectSpaceModel(space);
            return;
        }
        const equip = this.equipGroupModelMap.get(obj.id);
        if (equip) {
            this.selectEquipModel(equip);
        }
    }
    hoverMapObj(obj) {
        this.unHighlightFloor();
        this.rootNodeModel.unhoverSpace();
        this.unhoverModel();
        const space = this.mainSpaceModelMap.get(obj.id);
        const equip = this.equipGroupModelMap.get(obj.id);
        const baseObj = space?.spaceData || equip?.data;
        if (this._curFloorId && this._curFloorId !== baseObj?.floorId) {
            return;
        }
        if (space) {
            this.hoverSpaceModel(space);
            this.hoverCard(space);
            return;
        }
        if (equip) {
            this.hoverEquipModel(equip);
            this.hoverCard(equip);
        }
    }
    unhoverMapObj() {
        this.unHighlightFloor();
        this.rootNodeModel.unhoverSpace();
        this.unhoverModel();
    }
    setEquipOnPlay(obj) {
        const equip = this.equipGroupModelMap.get(obj.id);
        if (equip) {
            equip.setState('onPlay', true);
            this.lastPlayEquip = equip;
        }
    }
    unsetEquipOnPlay() {
        this.lastPlayEquip?.setState('onPlay', false);
    }

    async _loadeBuildingMeshs() {
        try {
            const floorGroups = [];

            // 模型
            await this.buildingSceneLoader.loadMeshes(false, group => {
                if (!group) return;
                if (isFloor(group)) {
                    group.children.forEach(c => {
                        c.visible = true;
                    });
                    floorGroups.push(group);
                } else if (isFloorFrame(group)) {
                    group.children.forEach(c => {
                        c.visible = true;
                    });
                    floorGroups.push(group);
                } else {
                    this.meshGroup.add(group);
                }
            });
            const boudingBox = new THREE.Box3();
            boudingBox.expandByObject(this.meshGroup);
            this.createFloorMeshs(floorGroups);
            this.buildingBox = boudingBox;
        } catch (e) {
            console.log('loadeScene---e: ', e);
            this.loadError = true;
            this.dispatchEvent({ type: 'noScene' });
            return e;
        }
    }

    _loadeBuildingCamera() {
        return this.buildingSceneLoader.getCameraModel().then(cameraModel => {
            this.buildingCameraModel = cameraModel;
        });
    }

    async _loadeSceneBackground() {
        Promise.allSettled([this.buildingSceneLoader.getSceneBackground(this.renderer), this.floorMapSceneLoader.getSceneBackground(this.renderer)]).then(rst => {
            const [rst0, rst1] = rst;
            if (rst0.status === 'fulfilled') {
                const bg0 = rst0.value;
                this.bgModeMap[BUILDING_MODE] = bg0;
            }
            if (rst1.status === 'fulfilled') {
                const bg1 = rst1.value;
                this.bgModeMap[FLOOR_MODE] = bg1;
            }
        });
    }

    _loadeSceneLights() {
        const addLights = (lightGroup, mode) => {
            const dirlight = lightGroup.children.find(c => c.isDirectionalLight);
            const amlight = lightGroup.children.find(c => c.isAmbientLight);
            const lights = [];
            this.lightsMap[mode] = lights;
            if (dirlight) {
                dirlight.visible = false;
                this.Scene.add(dirlight);
                lights.push(dirlight);
            }
            if (amlight) {
                amlight.visible = false;
                // amlight.intensity = amlight.intensity / Math.PI;
                this.Scene.add(amlight);
                lights.push(amlight);
            }
        };
        return Promise.allSettled([this.buildingSceneLoader.initLightAndShadow(), this.floorMapSceneLoader.initLightAndShadow()]).then(rst => {
            const [rst0, rst1] = rst;
            if (rst0.status === 'fulfilled') {
                const lights = rst0.value;

                addLights(lights, BUILDING_MODE);
            }
            if (rst1.status === 'fulfilled') {
                const lights = rst1.value;
                // this.lightsMap[FLOOR_MODE] = lights;
                addLights(lights, FLOOR_MODE);
                // this.wireframeGroup.add(lights);
            }
        });
    }

    async initLoader() {
        const loadPromise = [];
        await Promise.allSettled([this.buildingSceneLoader.init(), this.floorMapSceneLoader.init()]);
        loadPromise.push(this._loadeBuildingMeshs());
        loadPromise.push(this._loadeSceneBackground());
        loadPromise.push(this._loadeSceneLights());
        loadPromise.push(this._loadeBuildingCamera());
        await Promise.allSettled(loadPromise);
        this.setCamera(this.buildingCameraModel);
    }

    resetFloor() {
        Object.values(this.floorModalMap).forEach(floorInfo => {
            floorInfo.canSelect = false;
            if (floorInfo.floorMVCModal) {
                floorInfo.floorMVCModal.setState('normal', true);
                floorInfo.floorMVCModal.setState('inUse', false);
                floorInfo.floorMVCModal.setState('canSelect', false);
                floorInfo.floorMVCModal.setState('hover', false);
                floorInfo.floorMVCModal.setState('selected', false);
                floorInfo.floorMVCModal.removeChildren();
            }
        });
    }

    createFloorMeshs(groups) {
        if (groups) {
            const floorMeshsInfo = new Map();
            groups.forEach(group => {
                const isFloorGroup = isFloor(group);
                if (group.children?.length) {
                    group.children.forEach(mesh => {
                        const info = parseMainBuildingBoardInfo(mesh.name);
                        if (info) {
                            if (!floorMeshsInfo.get(info.floorName)) {
                                floorMeshsInfo.set(info.floorName, {});
                            }
                            const meshInfo = floorMeshsInfo.get(info.floorName);
                            meshInfo[isFloorGroup ? 'floorMesh' : 'floorWframeMesh'] = mesh;
                        }
                    });
                }
            });

            const ALPHA = 0.15;
            floorMeshsInfo.forEach((meshInfo, key) => {
                if (!meshInfo || !key) {
                    return;
                }
                const info = { floorName: key };
                const floorModal = new Floor({ ...info }, meshInfo);
                const { floorMesh, floorWframeMesh } = meshInfo;
                floorModal.setStateStyles({
                    normal: {
                        show: false,
                        floorMaterialType: floorMesh?.material.type,
                        floorColor: floorMesh?.material.color.getHex(),
                        floorAlpha: 0.15,
                        floorSide: floorMesh?.material.side,
                        wframeMaterialType: floorWframeMesh?.material.type,
                        wframeColor: floorWframeMesh?.material.color.getHex(),
                        wframeAlpha: floorWframeMesh?.material.opacity,
                        wframeSide: floorWframeMesh?.material.side
                    },
                    inUse: {
                        show: true
                    },
                    hover: {
                        floorAlpha: 0.85
                    },
                    active: {
                        floorAlpha: 0.85
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
                floorModal.userinteractionEnable = false; // 不参与射线求交
                info.floorMVCModal = floorModal;
                try {
                    this.rootNodeModel.addChild(floorModal);
                    this.recordFloorInfo(info);
                } catch (e) {
                    console.error(e);
                }
            });
            return floorMeshsInfo;
        }
    }

    recordFloorInfo(info) {
        if (!this.floorModalMap[info.floorName]) {
            this.floorModalMap[info.floorName] = { ...info };
        } else {
            const old = this.floorModalMap[info.floorName];
            this.floorModalMap[info.floorName] = { ...old, ...info };
        }
        const newInfo = this.floorModalMap[info.floorName];
        if (newInfo.floorMVCModal) {
            newInfo.floorMVCModal.equipData = { ...newInfo.floorMVCModal.equipData, ...newInfo };
            delete newInfo.floorMVCModal.equipData.floorMVCModal; // 去除循环引用
            // if (newInfo.floorTag && newInfo.floorTag.isRemoved()) {
            //     newInfo.floorMVCModal.addChild(newInfo.floorTag);
            //     newInfo.floorMVCModal.setState('inUse', true);
            // }
            newInfo.floorMVCModal.setState('inUse', true);
        }
    }

    clickDetail(obj) {
        this.dispatchEvent({ type: 'clickDetail', data: obj });
    }

    // 复位相机
    restoreCamera() {
        this.controls.reset(true).then(() => {
            // this.zoomAfter();
        });
    }

    initCamera() {
        this.controls.screenSpacePanning = true;

        this.controls.dollySpeed = 2.5;
        this.controls.smoothTime = 0.1;
        this.controls.draggingSmoothTime = 0.1;
        this.controls.verticalDragToForward = false;
        this.controls.dollyToCursor = true;
        this.controls.dollyDragInverted = true;
    }

    setBuildingCamera() {
        if (this.buildingCameraModel) {
            this.setCamera(this.buildingCameraModel);
        }
    }

    setCamera(model) {
        if (!model) {
            return;
        }
        const { fov, left, right, bottom, top, far, near, position, target } = model;
        this.camera.fov = fov;
        this.camera.left = left;
        this.camera.right = right;
        this.camera.bottom = bottom;
        this.camera.top = top;
        this.camera.up.set(0, 1, 0);
        this.camera.position.set(position.x, position.y, position.z);
        this.camera.far = far;
        this.camera.near = near;
        this.controls.setTarget(target.x, target.y, target.z);

        this.controls.setLookAt(position.x, position.y, position.z, target.x, target.y, target.z, false);

        this.camera.updateProjectionMatrix();
        this.controls.update();
        this.controls.saveState();
        this.getLookAtDirection(position, target);
    }

    getLookAtDirection(position, target) {
        // console.log('getLookAtDirection: ');
        const xDriection = Math.abs(position.x - target.x);
        const zDriection = Math.abs(position.z - target.z);
        if (xDriection > zDriection) {
            this._defaultCameraDirection = 'X';
        } else {
            this._defaultCameraDirection = 'Z';
        }
    }

    _updateSpaceState(space) {
        const stateNames = [
            'abnormal',
            'unAbnormal',
            'armed',
            'partiallyArmed',
            'disarmed',
            'unmonitored',
            'deploymentUnmonitored',
            'openAccess',
            'authorizedAccess',
            'closeAccess'
        ];
        const spaceObj = space?.spaceData;

        if (!spaceObj) {
            return;
        }
        // 清空异步状态及相关样式
        space.clearStatesAsync(stateNames);

        const { getObjectAbnormalStatus, getIotData } = DockSingleton.getInstance();

        // TODO 动静分离
        if (this.curFilterType === CONTROL_BAR_TAB_KEYS.ABNORMAL) {
            space.setAsyncState('deploymentUnmonitored', false);

            // 空间下的设备有异常，空间算不算有异常？
            const isAbnormal = getObjectAbnormalStatus(spaceObj.id);
            if (isAbnormal) {
                space.setAsyncState('abnormal', true);
            }
        } else if (this.curFilterType === CONTROL_BAR_TAB_KEYS.DEPLOYMENTSTATUS) {
            const spaceDeployment = getIotData(spaceObj.id, 'deploymentStatus');
            const spaceDeploymentStatus = SPACE_DEPLOYMENT_DATA_SOURCE_MAP.find(v => v?.code === spaceDeployment?.dataValue)?.status;
            if (spaceDeploymentStatus) {
                space.setAsyncState(spaceDeploymentStatus, true);
            } else {
                // 获取不到撤布防状态，渲染成无法监测状态
                space.setAsyncState('deploymentUnmonitored', true);
            }
        } else if (this.curFilterType === CONTROL_BAR_TAB_KEYS.ACCESSDEMAND) {
            space.setAsyncState('deploymentUnmonitored', false);

            // 空间通行是拿空间下门：通行信息点，算出空间的通行状态，门 classCode ['CFCSDR', 'CFCSFR', 'SPEGFG']
            const spaceAccessStatus = computeSpaceAccessStatus(spaceObj, getIotData);

            const curStateName = DEPLOYMENT_STATUS_MAP_STATE[spaceAccessStatus];
            if (curStateName) {
                space.setAsyncState(curStateName, true);
            }
        }
    }
    // TODO
    updateSpaceStatus() {
        this.mainSpaceModelMap.forEach(model => {
            if (model.getState('hide') || model.getState('filterHide')) {
                return;
            }
            this._updateSpaceState(model);
        });
    }

    // 更新设备状态
    // TODO
    updateEquipStatus() {
        const isFloorMap = this.mapMode === FLOOR_MODE;

        const stateNames = ['iconType', 'offline', 'opened', 'closed', 'openAccess', 'closeAccess', 'authorizedAccess', 'orderFail', 'abnormal', 'abnormalOrderFail'];
        this.equipGroupModelMap.forEach(group => {
            if (group.getState('hide') || group.getState('filterHide')) {
                return;
            }
            group.clearStatesAsync(stateNames);
            const equipData = group.data;
            const { getObjectAbnormalStatus, getIotData } = DockSingleton.getInstance();
            if (equipData) {
                // TODO 动静分离
                const onlineItem = getIotData(equipData.id, 'onlineStatus')?.dataValue;
                const onlineStatus = ONLINE_STATUS_MAP.find(v => v?.code === onlineItem)?.status;
                if (onlineItem === 'OFFLINE' || onlineStatus === 'OFFLINE') {
                    group.setAsyncState('offline', true);
                }

                const isAbnormal = getObjectAbnormalStatus(equipData.id);

                const orderFailItem = getIotData(equipData.id, 'orderFailAlarm')?.dataValue;
                const orderFailStatus = ORDER_FAIL_STATUS_MAP.find(v => v?.code === orderFailItem)?.status;

                // 全楼或不是小图标的情况下设置开启关闭状态
                if (!isFloorMap || !isSmallIcon(equipData)) {
                    // 如果是关闭的看它的通行状态，若是开启的设置开启(opened)状态
                    const equipRunStatus = getIotData(equipData.id, 'runStatus')?.dataValue;
                    const equipAccessDemand = getIotData(equipData.id, 'accessDemand')?.dataValue;
                    const equipAccessDemandStatus = EQUIP_ACCESS_DATA_SOURCE_MAP.find(v => v?.code === equipAccessDemand)?.status;
                    if (['CLOSE', '0'].includes(equipRunStatus)) {
                        group.setAsyncState('closed', true);
                        const accessDemandStateName = DEPLOYMENT_STATUS_MAP_STATE[equipAccessDemandStatus];
                        if (accessDemandStateName) {
                            group.setAsyncState(accessDemandStateName, true);
                        }
                    } else if (['OPEN', '1'].includes(equipRunStatus)) {
                        group.setAsyncState('opened', true);
                    }
                }

                // if (abnormalStatuses?.length > 0) {
                //     if (abnormalStatuses.includes('ABNORMAL') && abnormalStatuses.includes('CONTROL_REVERSE_INCONSISTENT')) {
                //         group.setAsyncState('abnormalOrderFail', true);
                //     } else {
                //         if (abnormalStatuses?.includes('CONTROL_REVERSE_INCONSISTENT')) {
                //             group.setAsyncState('orderFail', true);
                //         }
                //         if (abnormalStatuses?.includes('ABNORMAL')) {
                //             group.setAsyncState('abnormal', true);
                //         }
                //     }
                // }
                if (isAbnormal) {
                    if (orderFailStatus === 'CONTROL_REVERSE_INCONSISTENT' || orderFailItem === 'CONTROL_REVERSE_INCONSISTENT') {
                        group.setAsyncState('abnormalOrderFail', true);
                    } else {
                        group.setAsyncState('abnormal', true);
                    }
                } else if (orderFailStatus === 'CONTROL_REVERSE_INCONSISTENT' || orderFailItem === 'CONTROL_REVERSE_INCONSISTENT') {
                    group.setAsyncState('orderFail', true);
                }
            }
        });
    }

    updateSpaceEquipData(data, floorAbnormalRecord) {
        // TODO ？？？
        floorAbnormalRecord.value = {};
        const { spaces, equipments } = data;
        // const equipDataSet = new Set();
        spaces?.forEach(obj => {
            const space = this.mainSpaceModelMap.get(obj.id);
            if (space?.spaceData) {
                Object.keys(obj).forEach(k => {
                    space.spaceData[k] = obj[k];
                });
            }
        });
        equipments?.forEach(obj => {
            const equipGroup = this.equipGroupModelMap.get(obj.id);
            const equipData = equipGroup?.data;
            if (equipData) {
                Object.keys(obj).forEach(k => {
                    equipData[k] = obj[k];
                });
            }
        });

        const { getObjectAbnormalStatus } = DockSingleton.getInstance();

        // TODO 动静分离
        this.mainSpaceModelMap?.forEach(model => {
            const space = model?.spaceData;
            const isAbnormal = getObjectAbnormalStatus(space.id);
            if (isAbnormal) {
                floorAbnormalRecord.value[space.floorId] = space.floorId;
            }
        });
        this.equipGroupModelMap?.forEach(equipGroup => {
            const equipData = equipGroup?.data;
            if (equipData) {
                const isAbnormal = getObjectAbnormalStatus(equipData.id);
                if (isAbnormal) {
                    floorAbnormalRecord.value[equipData.floorId] = equipData.floorId;
                }
            }
        });
    }

    updateShowElements() {
        this.equipStateDetector.clearElements();
        this.airEquipIconInfoDetector.clearElements();
        const curFloorId = this._curFloorId;
        const isFloorMap = this.mapMode === FLOOR_MODE;

        const { getObjectAbnormalStatus, getIotData } = DockSingleton.getInstance();

        const spaceShowFloorLocalId = new Set();
        const deploymentStatusSpaces = new Set();

        // 遍历空间
        this.mainSpaceModelMap.forEach(space => {
            const { spaceData } = space;
            let hideVal = false,
                filterHide = false;
            if (isFloorMap) {
                // 楼层视角：非当前楼层的空间隐藏
                hideVal = spaceData.floorId !== curFloorId;

                //楼层视角顶部header筛选：过滤展示仅可控设备下的可控状态空间

                // space?.setAsyncState('filterHide', filterHide);
                // space?.setAsyncState('hide', hideVal);
            }
            // 楼层及全楼视角顶部header筛选：过滤展示部分设备类型的空间、过滤展示异常状态的空间

            const curDeployment = getIotData(spaceData.id, 'deploymentStatus');
            const curDeploymentStatus = SPACE_DEPLOYMENT_DATA_SOURCE_MAP.find(v => v?.code === curDeployment?.dataValue)?.status;
            // 如果有撤布防状态，则加入集合记录
            if (curDeploymentStatus) {
                deploymentStatusSpaces.add(spaceData.id);
            }

            if (this.isVideoEditMode) {
                filterHide = true;
            } else {
                // TODO 动静分离
                if (!filterHide) {
                    if (this.curFilterType === CONTROL_BAR_TAB_KEYS.ABNORMAL) {
                        const isAbnormal = getObjectAbnormalStatus(spaceData.id);
                        filterHide = !isAbnormal;
                    } else if (this.curFilterType === CONTROL_BAR_TAB_KEYS.DEPLOYMENTSTATUS) {
                        filterHide = !spaceData?.isFromDeployment;
                    } else if (this.curFilterType === CONTROL_BAR_TAB_KEYS.ACCESSDEMAND) {
                        filterHide = !spaceData?.isFromAccess;
                    }
                }
            }

            space?.setAsyncState('hide', hideVal);
            space?.setAsyncState('filterHide', filterHide);
            // 全楼视角：仅展示未隐藏、未过滤隐藏的空间的楼层，待更新楼层数据
            if (!isFloorMap && !hideVal && !filterHide) {
                spaceShowFloorLocalId.add(spaceData.floorLocalId);
            }

            // const val = isFloorMap && spaceData.floorId !== curFloorId;

            space?.setAsyncState('floorMode', isFloorMap);
            // 空间上小圆点model，对应第1个子
            if (!hideVal && !filterHide) {
                // const space = this.isExceedLimit ? null : group?.getChildByIndex(0);

                space?.setGeometryIndex(isFloorMap ? 1 : 0);
            }
        });
        this.equipGroupModelMap.forEach(model => {
            // 找到当前设备的设备状态圆点图元、空间设备图标图元
            const equipStateInfo = model.findChildByName(modelNameEnum.EquipStateDotInfo);
            const airEquipIconInfo = model.findChildByName(modelNameEnum.AirEquipIconInfo);
            let filterHide = false;
            const { data } = model;
            if (!this.isVideoEditMode) {
                // 楼层及全楼视角顶部header筛选：过滤展示有异常类型的设备
                // 非异常tab时，全楼视角默认过滤隐藏设备，楼层视角不过滤隐藏
                if (this.curFilterType === CONTROL_BAR_TAB_KEYS.ABNORMAL) {
                    // TODO 动静分离
                    const isAbnormal = getObjectAbnormalStatus(model.data.id);
                    // clearAbnormalEventsList([model.data.id]);
                    // if (['Eq74803828244d42f014541c412389de2aa84b774d69', 'Eq74803828244787b3c833f347d19ce22ab6cc866f6e'].includes(model.data.id)) {
                    //     debugger;
                    // }
                    filterHide = !isAbnormal;
                } else {
                    filterHide = !isFloorMap;
                }
            }

            if (!isFloorMap) {
                if (this.isVideoEditMode) {
                    filterHide = true;
                } else {
                    // 全楼视角：未过滤隐藏，则添加设备图元到设备状态图元碰撞器
                    if (!filterHide && equipStateInfo) {
                        this.equipStateDetector.addElement(equipStateInfo);
                    }
                }
            } else {
                if (this.isVideoEditMode) {
                    if (!filterHide && this.cameraEquipmentClass?.length > 0) {
                        filterHide = !this.cameraEquipmentClass.includes(data.classCode);
                    }
                    // 设备类型
                    if (!filterHide && this.curSelectedCameraTypes) {
                        // 默认无勾选，则过滤仅枪机、球机、半球机的摄像头
                        const cameraTypesArr = this.curSelectedCameraTypes?.length ? this.curSelectedCameraTypes : CAMERA_TYPES_OMIT_OTHER;
                        filterHide = !cameraTypesArr.some(cameraType => {
                            return data.cameraType && cameraType === data.cameraType;
                        });
                    }
                    // 空间功能类型
                    if (!filterHide && this.curSelectedSpaceFuncTypes?.length > 0) {
                        filterHide = !this.curSelectedSpaceFuncTypes.some(funcType => {
                            return Array.isArray(data?.roomFuncTypes) && data?.roomFuncTypes.includes(funcType);
                        });
                    }

                    if (!filterHide) {
                        filterHide = model.data?.floorId !== curFloorId;
                    }
                    if (!filterHide && airEquipIconInfo) {
                        this.airEquipIconInfoDetector.addElement(airEquipIconInfo);
                    }
                } else {
                    // 楼层视角：过滤展示部分设备类型的设备、当前楼层的设备、仅可控筛选下的可控状态设备
                    if (!filterHide && this.filterEquipmentClass?.length > 0) {
                        filterHide = !this.filterEquipmentClass.some(obj => {
                            return obj.classCode === data.classCode && (!obj.condition || (obj.condition && data[obj.condition] === obj.conditionValue));
                        });
                    }
                    if (!filterHide) {
                        filterHide = model.data?.floorId !== curFloorId;
                    }
                    if (!filterHide && this.onlyShowControlledEquipment) {
                        filterHide = !model.data?.isControl;
                    }
                    // 楼层视角：未过滤隐藏，则添加设备图元到空间设备信息碰撞器
                    if (!filterHide && airEquipIconInfo) {
                        this.airEquipIconInfoDetector.addElement(airEquipIconInfo);
                    }
                }
            }

            model?.setAsyncState('videoEditMode', !filterHide && this.isVideoEditMode);
            model?.setAsyncState('floorMode', isFloorMap);
            model?.setAsyncState('buildingMode', !isFloorMap);
            model?.setAsyncState('filterHide', filterHide);
        });

        // 全楼视角：更新楼层数据
        if (!isFloorMap) {
            this._updateFloorShow(spaceShowFloorLocalId);
        }

        // 关联设备相关图元在碰撞器里的更新
        this._collisionInvokeDebounce();

        return [...deploymentStatusSpaces];
    }

    // 关联模式元素显示
    showRelationElements(arr) {
        this.isRelationMode = true;
        const idMap = {};
        arr.forEach(objId => {
            idMap[objId] = true;
        });
        this.equipStateDetector.clearElements();
        this.airEquipIconInfoDetector.clearElements();
        this.airEquipIconInfoRelDetector.clearElements();
        const isFloorMap = this.mapMode === FLOOR_MODE;
        this.clearAllLine();
        // console.log('idMap: ', idMap);
        const linkObjs = [];
        const curSelObjectData = this.currentSelectedModel?.spaceData || this.currentSelectedModel?.data;

        this.mainSpaceModelMap.forEach(space => {
            space.setAsyncState('isRelMode', true);
            const isRelObj = !!idMap[space.spaceData?.id];
            // 全楼时展示关联对象，楼层-展示当楼层的关联对象，以及当钱楼层过滤出来的其它非关联对象
            const isShow = (!isFloorMap && isRelObj) || (space.spaceData?.floorId === this._curFloorId && (isRelObj || !space.getState('filterHide')));
            space.setAsyncState('relModeShow', isShow);
            space.setAsyncState('isRelObject', isRelObj);

            if (this.curFilterType === CONTROL_BAR_TAB_KEYS.ABNORMAL) {
                const isAbnormal = !!space.spaceData?.abnormal;

                space.setAsyncState('abnormal', isAbnormal);
                space.setAsyncState('unAbnormal', !isAbnormal);
            }
            if (isShow && isRelObj) {
                linkObjs.push({
                    from: curSelObjectData,
                    to: space.spaceData
                });
            }
        });

        this.equipGroupModelMap.forEach(model => {
            model.setAsyncState('isRelMode', true);
            model.setAsyncState('relModeShow', false);

            const isRelObj = !!idMap[model.data?.id];
            // 全楼时展示关联对象，楼层-展示当楼层的关联对象，以及当钱楼层过滤出来的其它非关联对象
            const isShow = (!isFloorMap && isRelObj) || (model.data?.floorId === this._curFloorId && (isRelObj || !model.getState('filterHide')));
            model.setAsyncState('isRelObject', isRelObj);
            if (isShow) {
                const equipStateInfo = model.findChildByName(modelNameEnum.EquipStateDotInfo);
                const airEquipIconInfo = model.findChildByName(modelNameEnum.AirEquipIconInfo);
                if (isFloorMap) {
                    if (airEquipIconInfo) {
                        if (isRelObj) {
                            this.airEquipIconInfoRelDetector.addElement(airEquipIconInfo);
                        } else {
                            this.airEquipIconInfoDetector.addElement(airEquipIconInfo);
                        }
                    }
                } else if (airEquipIconInfo) {
                    this.equipStateDetector.addElement(equipStateInfo);
                }
                model.setAsyncState('relModeShow', !isFloorMap || model.data?.floorId === this._curFloorId);
                const inSelSpace =
                    curSelObjectData.objType !== OBJ_TYPE.SPACE || (curSelObjectData.objType === OBJ_TYPE.SPACE && !model.data?.relObjIds?.includes(curSelObjectData.id));

                if (isRelObj && inSelSpace) {
                    linkObjs.push({
                        from: curSelObjectData,
                        to: model.data
                    });
                }
            }
        });
        this.currentSelectedModel?.setAsyncState('relModeShow', true);
        // this.createLinkLines
        linkObjs.forEach(obj => {
            this._createAdvanceLinkLine(obj.from, obj.to);
        });
        // console.log('linkObjs: ', linkObjs, this.Scene);
        this._collisionInvokeDebounce();
    }
    // 退出关联模式
    exitRelationMode() {
        this.isRelationMode = false;
        const isFloorMap = this.mapMode === FLOOR_MODE;
        this.equipStateDetector.clearElements();
        this.airEquipIconInfoDetector.clearElements();
        this.airEquipIconInfoRelDetector.clearElements();
        this.mainSpaceModelMap.forEach(space => {
            space.setAsyncState('isRelMode', false);
            space.setAsyncState('relModeShow', false);
            space.setAsyncState('isRelObject', false);
            // space.setAsyncState('abnormal', this.curFilterType === CONTROL_BAR_TAB_KEYS.ABNORMAL && space.spaceData?.abnormal);
        });
        this.equipGroupModelMap.forEach(model => {
            model.setAsyncState('isRelMode', false);
            model.setAsyncState('relModeShow', false);
            model.setAsyncState('isRelObject', false);
            const equipStateInfo = model.findChildByName(modelNameEnum.EquipStateDotInfo);
            const airEquipIconInfo = model.findChildByName(modelNameEnum.AirEquipIconInfo);
            if (!model.getState('hide') && !model.getState('filterHide')) {
                if (isFloorMap) {
                    if (airEquipIconInfo) {
                        this.airEquipIconInfoDetector.addElement(airEquipIconInfo);
                    }
                } else {
                    if (equipStateInfo) {
                        this.equipStateDetector.addElement(equipStateInfo);
                    }
                }
            }
        });
        // clear linkLines
        this.clearAllLine();
        this._collisionInvokeDebounce();
    }

    // 创建飞线实例
    _createAdvanceLinkLine(relA, relB) {
        if (relA.id === relB.id) return;
        if (!relA.bimLocation || !relB.bimLocation) return;
        // if (!this.mainSpaceModelMap.has(relB.id)) return;
        const mapKey = `${relA.id}-${relB.id}`;
        let advanceLinkLine = new AdvanceLinkLine(
            {
                startObj: { id: relA.id, bimLocation: relA.bimLocation },
                endObj: { id: relB.id, bimLocation: relB.bimLocation },
                useArrow: false,
                id: mapKey
            },
            {
                color: '#3E5B80',
                outColor: '#3E5B80',
                show: true,
                width: 2
            }
        );

        advanceLinkLine.fromData = relA;
        advanceLinkLine.toData = relB;
        this.linkLines.push(advanceLinkLine);
        this.rootNodeModel.addChild(advanceLinkLine);
    }

    _createSpaces(list) {
        // const spaceModels = [];
        const isExceedLimit = list?.length > this.spaceMaxCount;
        this.isExceedLimit = isExceedLimit;
        (list || []).forEach(item => {
            // console.log('item: ', item);

            // 若容器中已经创建过了或待创建的关联空间是当前选中的主空间，则之间返回
            if (this.mainSpaceModelMap.has(item.id)) {
                return;
            }
            // const group = new Group();
            // group.data = item;
            const fId = item.floorId;
            if (!this.floorIdMapModal[fId]) {
                this.floorIdMapModal[fId] = {};
            }
            if (!this.floorIdMapModal[fId].hasOwnProperty('floorHeight')) {
                const floorInfo = getFloorInfoByFloorId(item.floorId);
                const { floorElevation, localId } = floorInfo;
                this.floorIdMapModal[fId].floorHeight = M2FOOT * Number(floorElevation || 0);
                this.floorIdMapModal[fId].floorLocalId = localId;
            }
            // group.addChild(spaceLabel);
            const space = createSpaceModel(item);
            if (space) {
                // #空间标签图元
                const spaceLabel = createSpaceLabelInfoModel(item, this.floorIdMapModal[fId].floorHeight);

                space.setGeometryIndex(0);
                this.rootNodeModel.addChild(space);
                space.addChild(spaceLabel);
                Object.keys(spaceLabel.defineStyles).forEach(key => {
                    spaceLabel.defineStyles[key].iconShow = false;
                });

                const val = this.mapMode === FLOOR_MODE && item.floorId !== this._curFloorId;
                space.setState('hide', val);

                this.mainSpaceModelMap.set(item.id, space);
            }
        });
    }

    async _loadAndCreateEquips(equips) {
        equips?.forEach(obj => {
            if (!this.equipGroupModelMap.has(obj.id)) {
                const equipGroup = new Group();
                equipGroup.data = obj;
                this.rootNodeModel.addChild(equipGroup);

                this.equipGroupModelMap.set(obj.id, equipGroup);
            }
        });
        await this.graphResourceManager.loadEquips(equips, { useAdvance: false }, obj => {
            const equipGroup = this.equipGroupModelMap.get(obj.equipData.id);
            if (!equipGroup) {
                return;
            }
            const equip = new Equip(obj.equipData, obj.mesh);
            const equipStyles = getEquipStyles(obj.equipData, obj ? obj.normalStyle : null);
            // 给选中的材质设置贴图
            const selMaterial = this.materialManager.dequeueMaterial(equipStyles.selected);
            const actMaterial = this.materialManager.dequeueMaterial(equipStyles.active);
            selMaterial.map = obj.mesh.material.map;
            actMaterial.map = obj.mesh.material.map;
            equip.setStateStyles(equipStyles);

            const equipStateInfo = createEqupStateInfo(obj.equipData);
            equipGroup.addChild(equipStateInfo);
            equipGroup.setAsyncState('filterHide', true);

            const airEquipIconInfo = createEqupIconInfo(obj.equipData);
            equipGroup.addChild(airEquipIconInfo);

            // 标记有设备模型
            equipGroup.hasEquipMesh = true;
            equipGroup.addChild(equip);
            // console.log('equipGroup: ', equipGroup);
        });
        equips?.forEach(obj => {
            if (!obj.bimLocation) {
                return;
            }
            const equipGroup = this.equipGroupModelMap.get(obj.id);
            if (equipGroup && !equipGroup.hasEquipMesh) {
                try {
                    const equipStateInfo = createEqupStateInfo(obj);
                    equipGroup.addChild(equipStateInfo);

                    const airEquipIconInfo = createEqupIconInfo(obj);
                    equipGroup.addChild(airEquipIconInfo);
                } catch (e) {
                    console.log('e: ', e);
                }
            }
        });

        this.graphResourceManager?.releaseDBCache();
        this.graphResourceManager?.releaseMeshCache();
        this.updateShowElements();
        this.updateEquipStatus();
    }
    async createElements(data) {
        const { spaces, equips, floors } = data;
        this.resetFloor();
        // console.log('spaces: ', data, floors);

        this.graphResourceManager.cancelAll();
        this.removeDyncElements();
        this._createSpaces(spaces);
        floors?.forEach(floor => {
            this.recordFloorInfo({ floorName: floor.localId, localId: floor.localId, id: floor.id }, true);
        });

        const promiseGenArr = [];

        if (equips?.length > 0) {
            const equipsLoad = this._loadAndCreateEquips(equips);
            promiseGenArr.push(equipsLoad);
        }
        await Promise.allSettled(promiseGenArr);
    }

    _switchLights() {
        if (this.mapMode) {
            Object.keys(this.lightsMap).forEach(k => {
                const _mode = parseInt(k);
                const lights = this.lightsMap[k];
                lights?.forEach(light => {
                    if (light.useLight) {
                        this.Scene.remove(light.useLight);
                        light.useLight = null;
                    }
                    light.visible = _mode === this.mapMode;
                    if (light.visible) {
                        if (this.mapMode === FLOOR_MODE) {
                            if (light.isDirectionalLight) {
                                light.useLight = light.clone();
                                calcFloorDirectionalLight(this.curClipBox, light.useLight);
                                this.Scene.add(light.useLight);

                                // console.log('isDirectionalLight: ', light);
                                light.useLight.intensity = 1;
                                return;
                            } else {
                                light.intensity = 0.8;
                            }
                        }
                        this.Scene.add(light);
                    } else {
                        this.Scene.remove(light);
                    }
                });
            });
        }
    }

    _switchCamera() {
        if (this.mapMode === BUILDING_MODE) {
            this.setCamera(this.buildingCameraModel);
            this.controls.minDistance = this.controls.distance * 0.1;
            this.controls.maxDistance = this.controls.distance * 2;

            this.controls.minPolarAngle = 0;
            this.controls.maxPolarAngle = Math.PI / 2;

            this.controls.mouseButtons.left = CameraControls.ACTION.ROTATE;
            this.controls.mouseButtons.right = CameraControls.ACTION.TRUCK;
            this.controls.mouseButtons.wheel = CameraControls.ACTION.DOLLY;
            this.controls.mouseButtons.middle = CameraControls.ACTION.DOLLY;
            if (this.curClipBox) {
                this.controls.setBoundary(this.curClipBox);
            }
        } else {
            if (this.curClipBox) {
                const { maxDistance: _maxDistance } = restoreControls(this.curClipBox, this.controls, this.mapMode === FLOOR_MODE);
                this.controls.setBoundary(this.curClipBox);
                const standardSideLength = 10 * 1000 * MM2FOOT;
                this._radioValue = Math.tan((this.camera.fov * 0.5 * Math.PI) / 180);
                this.controls.minDistance = (standardSideLength * 0.5) / this._radioValue;
                this.controls.maxDistance = _maxDistance;

                this.controls.minPolarAngle = 0;
                this.controls.maxPolarAngle = Math.PI / 3;

                this.controls.mouseButtons.left = CameraControls.ACTION.TRUCK;
                this.controls.mouseButtons.right = CameraControls.ACTION.ROTATE;
            }
        }
    }

    _clipBox() {
        const fId = this._curFloorId;
        if (!fId) {
            return;
        }
        if (this.mapMode === FLOOR_MODE) {
            // mesh = this.floorIdMapModal[fId]?.cfMesh;

            const boundingBox = new THREE.Box3();
            // 土建楼板显隐
            Object.keys(this.floorIdMapModal).forEach(floorId => {
                if (fId === floorId) {
                    const { floorMesh, cfMesh } = this.floorIdMapModal[fId];
                    if (floorMesh) {
                        boundingBox.expandByObject(floorMesh);
                    }
                    if (cfMesh) {
                        boundingBox.expandByObject(cfMesh);
                    }
                }
            });
            // 遍历空间
            this.mainSpaceModelMap.forEach(space => {
                const { spaceData } = space;

                if (spaceData?.floorId === fId) {
                    const spaceMesh = this.Scene.getObjectByProperty('modelKey', spaceData?.id);
                    if (spaceMesh) {
                        boundingBox.expandByObject(spaceMesh);
                    }
                }
            });
            this.curClipBox = boundingBox;
        }
    }

    // 更新建筑相关及关系模式相关模型显隐
    _updateBuildingShow() {
        // console.log('_updateObjectsShow: ', this._curFloorId);
        // this.colDetector.clearElements(false);
        // 全楼外壳显隐
        this.meshGroup.visible = this.mapMode === BUILDING_MODE;
        // 全楼楼板、楼层标签显隐
        Object.values(this.floorModalMap).forEach(floorInfo => {
            const hideVal = this.mapMode !== BUILDING_MODE;
            floorInfo.floorMVCModal?.setState('hide', hideVal);
        });
        this.updateShowElements();
    }

    // 更新楼层相关模型显隐
    _updateFloorObjectsShow() {
        const curFloorId = this._curFloorId;
        const isBuildingMode = this.mapMode === BUILDING_MODE;
        // 土建楼板显隐
        Object.keys(this.floorIdMapModal).forEach(fId => {
            // 非全楼情况下
            // 只显示本楼层的土建楼板
            const { cfModel, floorMesh } = this.floorIdMapModal[fId];
            const val = isBuildingMode || fId !== curFloorId;
            cfModel?.setState('hide', val);
            if (floorMesh) {
                floorMesh.visible = !val;
            }
        });
    }

    // 楼层相关显隐
    _updateFloorShow(floorLocalIdSet) {
        if (floorLocalIdSet) {
            Object.values(this.floorModalMap).forEach(floorInfo => {
                floorInfo?.floorMVCModal?.setState('inUse', floorLocalIdSet.has(floorInfo.floorName));
            });
        }
    }

    // 加载楼层土建楼板模型并缓存
    async _loadAndShowCF() {
        this.floorMeshGroup.visible = true;
        const fId = this._curFloorId;
        if (!fId) {
            return;
        }
        if (this.floorIdMapModal[fId]?.cfModel) {
            return;
        }
        const styles = {
            hide: {
                show: false,
                priority: Infinity
            }
        };
        this.loadings.floorLoading.value = true;
        try {
            if (!this.floorIdMapModal[fId]) {
                this.floorIdMapModal[fId] = {};
            }
            this.graphResourceManager.floorId = fId;
            await Promise.allSettled([this.graphResourceManager.loadCfResource(fId, styles), this.graphResourceManager.loadFloorMeshInfos(fId, { ...styles })]).then(rst => {
                if (this.floorIdMapModal[fId]?.cfModel) {
                    return;
                }
                const [rst0, rst1] = rst;
                if (rst0.status === 'fulfilled' && rst0.value) {
                    const { equip, mesh } = rst0.value;
                    equip.setStateStyles(rst.styles);

                    this.rootNodeModel.addChild(equip);
                    this.floorIdMapModal[fId].cfModel = equip;
                    this.floorIdMapModal[fId].cfMesh = mesh;
                    // console.log('mesh: ', mesh);
                } else {
                    console.log('loadCfResource error: ', rst0);
                }
                const floor = getFloorInfoByFloorId(fId);
                const floorElevation = M2FOOT * Number(floor.floorElevation || 0);
                if (rst1.status === 'fulfilled' && rst1.value) {
                    const { mesh: floorMesh, equip } = rst1.value;
                    if (!floorMesh) {
                        return;
                    }
                    equip.userinteractionEnable = false;
                    // this.rootNodeModel.addChild(equip);
                    this.floorMeshGroup.add(floorMesh);

                    // 压缩楼板，避免有天花板的mesh
                    this.floorIdMapModal[fId].floorModel = equip;
                    floorMesh.material.side = THREE.FrontSide;
                    this.floorIdMapModal[fId].floorMesh = floorMesh;

                    const material = new THREE.MeshBasicMaterial({ color: '#DFE6EE' });
                    material.side = THREE.FrontSide;
                    floorMesh.material = material;

                    floorMesh.scale.set(1, 1, 0.0000001);
                    const translateHeight = floorElevation - 0.1;
                    floorMesh.position.y = translateHeight;
                    // this.floorIdMapModal[fId].floorY = translateHeight;
                } else {
                    console.log('loadFloorMeshInfos error: ', rst0);
                }
                this._updateFloorObjectsShow();
            });
        } catch (e) {
            console.log('loadCf error: ', e);
        }
        this.loadings.floorLoading.value = false;
    }

    // TODO
    switchVideoEditMode(isVideoEditMode) {
        this.isVideoEditMode = isVideoEditMode;
    }

    setCameraGroup(cameraIds = []) {
        if (this.isVideoEditMode) {
            this.equipGroupModelMap.forEach(group => {
                const equipData = group.data;
                if (equipData.floorId === this._curFloorId) {
                    if (cameraIds.includes(equipData.id)) {
                        group?.setAsyncState('videoEditModeSelected', true);
                    } else {
                        group?.setAsyncState('videoEditModeSelected', false);
                    }
                }
            });
        } else {
            this.equipGroupModelMap.forEach(group => {
                group?.setAsyncState('videoEditModeHover', false);
                group?.setAsyncState('videoEditModeSelected', false);
            });
        }
    }

    highlightCameras(cameraIds = []) {
        const isFloorMap = this.mapMode === FLOOR_MODE;
        this.equipGroupModelMap.forEach(group => {
            const equipData = group.data;
            if (isFloorMap) {
                if (equipData.floorId === this._curFloorId) {
                    if (cameraIds.includes(equipData.id)) {
                        group?.setAsyncState('videoHighlight', true);
                    } else {
                        group?.setAsyncState('videoOpacityShow', true);
                    }
                }
            } else {
                if (cameraIds.includes(equipData.id)) {
                    group?.setAsyncState('videoHighlight', true);
                } else {
                    group?.setAsyncState('videoOpacityShow', true);
                }
            }
        });
    }

    unhighlightCameras() {
        const isFloorMap = this.mapMode === FLOOR_MODE;
        this.equipGroupModelMap.forEach(group => {
            const equipData = group.data;
            if (isFloorMap) {
                if (equipData.floorId === this._curFloorId) {
                    group?.setAsyncState('videoHighlight', false);
                    group?.setAsyncState('videoOpacityShow', false);
                }
            } else {
                group?.setAsyncState('videoHighlight', false);
                group?.setAsyncState('videoOpacityShow', false);
            }
        });
    }

    // 切换模式视图展示
    async switchModeView(modeVal, floorId) {
        console.time('switchModeView');
        // 幂等：与当前视角一致时直接返回，避免重复下钻触发重复的 CF/楼板加载
        if (this.mapMode === modeVal && this._curFloorId === floorId) {
            return;
        }
        // 全楼与楼层视角切换
        this._curFloorId = floorId;
        this.mapMode = modeVal;
        // 切换过渡中，隐藏页面元素
        this._updateFloorObjectsShow();
        this.rootNodeModel.setState('hidden', true);
        if (this.css3dRender.domElement.style) {
            this.css3dRender.domElement.style.display = 'none';
        }

        this._updateBuildingShow();
        if (modeVal === FLOOR_MODE) {
            console.time('_loadAndShowCF');
            await this._loadAndShowCF();
            console.timeEnd('_loadAndShowCF');
            await this._clipBox();
        } else {
            this.curClipBox = this.buildingBox;
        }
        this.rootNodeModel.setState('hidden', false);
        if (this.css3dRender.domElement.style) {
            this.css3dRender.domElement.style.display = 'block';
        }
        if (!this.curClipBox) return;

        this._updateFloorObjectsShow();
        this._switchCamera();
        this._switchLights();

        this._collisionInvokeDebounce();
        console.timeEnd('switchModeView');
    }

    invokeScaleAndCollision() {
        // console.log('invokeScaleAndCollision: ', this.equipStateDetector.collisionMap?.size);
        // this.spaceNameCollisionDetector.collision();
        this.equipStateDetector.collision();
        // 关联模式下，不使用碰撞聚合
        this.airEquipIconInfoDetector.collision();
        if (this.isRelationMode) {
            this.airEquipIconInfoRelDetector.collision(false);
        }
    }

    bindEvent() {
        // 控制器事件
        this.controls.addEventListener('change', () => {
            // 拖拽
            if (this.disabled) return;
            this._collisionInvokeDebounce();
        });
    }

    Update() {
        super.Update();

        this.effectLoader?.update();
        this.renderContext?.frameAnimationLoop();
    }

    resize() {
        super.resize();
        this.renderContext.canvasPropsInitialize();
    }

    clearAllLine() {
        this.linkLines?.forEach(model => {
            this.rootNodeModel.removeChild(model);
        });

        this.linkLines = [];
    }

    removeDyncElements() {
        this.mainSpaceModelMap.forEach((v, k) => {
            this.rootNodeModel.removeChild(v);
        });
        this.mainSpaceModelMap.clear();

        this.equipGroupModelMap.forEach(v => {
            this.rootNodeModel.removeChild(v);
        });

        this.equipGroupModelMap.clear();
        this.curSpaceShowMap = {};
        this.clearAllLine();
    }

    removeAllObjects() {
        this.removeDyncElements();
        this.curRelIdSet.clear();
        this.floorModalMap = {};
        this.curSpaceShowMap = {};
        this.floorIdMapModal = {};
    }

    Destroy() {
        this.removeAllObjects();
        this.tracker.dispose();
        this.graphResourceManager.cancelAll();
        this.graphResourceManager.dispose();
        this.buildingSceneLoader.dispose();
        this.floorMapSceneLoader.dispose();

        this.composer?.dispose();
        this.renderer.setAnimationLoop(null);
        this.renderer.clear();
        this.renderer.dispose();
        this.renderer.forceContextLoss();
        this.renderer.renderLists.dispose();
        this.renderer.context = null;
        this.renderer.domElement = null;
        this.renderer.getRenderTarget()?.dispose();
        this.renderer.info.reset();
        // const {
        //     programs,
        //     memory: { geometries, textures }
        // } = this.renderer.info;
        // console.table([{ geometries: geometries, textures: textures, programs: programs }]);
    }
}
