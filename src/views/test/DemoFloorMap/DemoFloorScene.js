import { WebGLScene } from '@yushu/core3d';
import { SceneLoader, EffectLoader } from '@yushu/effecttool';
import _, { debounce } from 'lodash';
import CameraControls from 'camera-controls';
import * as THREE from '@yushu/three-base';
import { parseMainBuildingBoardInfo, isFloor, isFloorFrame, calcFloorDirectionalLight, restoreControls, convertP3ToP2, getEquipStyles } from '@/apm-3d/utils/buildingTools';
import RootNode from '@/views/GraphMVC/graphScene/RootNode/RootNode';
import Controller from '@/views/GraphMVC/core/Controller';
import { INTERFACE_PREFIX_RWD } from '@/config';
import { GraphResourceManager } from '@/views/GraphMVC/utils/GraphResourceManager';
import EquipStateInfo from '@/views/GraphMVC/graphScene/EquipStateInfo/EquipStateInfo';

import Group from '@/views/GraphMVC/graphScene/Group/Group';
import Space from '@/views/GraphMVC/graphScene/Space/Space';
import ParkingPlace from '@/views/parking-lot/left-map/graph/ParkingPlace/ParkingPlace';
import ChargingStation from '@/views/parking-lot/left-map/graph/ChargingStation/ChargingStation';
import SpaceIconInfoCommon from '@/views/GraphMVC/graphScene/SpaceIconInfoCommon/SpaceIconInfoCommon';
import { modelNameEnum, RenderOrder, StatePriority } from '@/views/GraphMVC/graphScene/GraphSceneDefine';
import { getFloorInfoByFloorId } from '@/utils/buildingUtils';
import { baseColors } from '@/constants/baseColors';
import VisibilityContext from '@/views/GraphMVC/graphScene/Context/VisibilityContext';

import Equip from '@/views/GraphMVC/graphScene/Equip/Equip';

const { M2FOOT, MM2FOOT, ResourceTracker } = THREE.baseUtils;

import { CAMERA_CLASS_CODES } from '@/constants/camera';

const WIREFRAME_SCENE_NAME = '07_building_relation';
const D3_SCENE_NAME = '05_building_classic';

const BUILDING_MODE = 1;
const FLOOR_MODE = 2;

const createSpaceModel = item => {
    const floorInfo = getFloorInfoByFloorId(item.floorId);
    const { floorElevation, height } = floorInfo;
    const floorHeight = M2FOOT * Number(floorElevation || 0);
    // const _height = M2FOOT * Number(height || 0);
    const space = new Space(item, 0, floorHeight, 0.01);

    const normalOpacity = 0.7;
    const deepOpacity = 1;
    space.setStateStyles({
        normal: {
            ...space.defineStyles.normal,
            color: baseColors['$blue-500'],
            show: true,
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
            priority: RenderOrder.hover
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
            // color: '#7188A6',
            color: '#ACC2DE',
            alpha: normalOpacity,
            priority: RenderOrder.space + 1
        },
        // 无法监测
        unmonitored: {
            show: true,
            color: '#C4C9CF',
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
            // color: baseColors['$red-500'],
            color: '#F0ABA8',
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
            priority: 2001
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
    const _tahText = CAMERA_CLASS_CODES.includes(item.classCode) ? null : '--';
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
            tagText: '开',
            tagBgColor: '#09B3B5',
            priority: RenderOrder.equip + 1
        },
        closed: {
            // dotColor: `#15AE55`,
            tagText: '关',
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
            tagText: '常开',
            tagBgColor: '#FFA51E',
            priority: RenderOrder.equip + 1
        },
        // 常闭
        closeAccess: {
            tagText: '常闭',
            tagBgColor: '#7188A6',
            priority: RenderOrder.equip + 1
        },
        // 权限通行
        authorizedAccess: {
            tagText: '权限通行',
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
        // 关联模式下显示
        relModeShow: {
            show: true,
            textShow: true,
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

const createParkingPlace = item => {
    const model = new ParkingPlace(item);

    return model;
};
const createChargingStation = (item, relationModel) => {
    const model = new ChargingStation(item, { relationModel });

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

        currentTabFloor,
        onlyShowControlledEquipment
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
        this.currentTabFloorRef = currentTabFloor;
        this.onlyShowControlledEquipmentRef = onlyShowControlledEquipment;
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

        // this.Scene.background = new THREE.Color('#D4DDE5');

        const defaultBg = new THREE.Color('#D6DDE5');
        // this.Scene.background = defaultBg.convertSRGBToLinear();
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
        this.composer = this.effectLoader.getComposer(this.Scene, this.camera);
        // this.composer.addPass(new ShaderPass(GammaCorrectionShader));
        // const outputPass = new OutputPass();
        // this.composer.addPass(outputPass);
        this.setComposser(this.composer);

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

        console.log('hover------newModel: ', newModel);
        if (newModel && newModel.name === modelNameEnum.Space) {
            this.hoverSpaceModel(newModel);
            this.css3dRender.domElement.style.cursor = 'pointer';
        } else if (newModel && ((newModel.name === modelNameEnum.Group && newModel.data?.objType === 'equipment') || newModel.name === modelNameEnum.Equip)) {
            this.hoverEquipModel(newModel);
            this.css3dRender.domElement.style.cursor = 'pointer';
        } else if (newModel && newModel.name === modelNameEnum.ParkingPlace) {
            this.hoverEquipModel(newModel);
            this.css3dRender.domElement.style.cursor = 'pointer';
        } else if (newModel && newModel.name === modelNameEnum.ChargingStation) {
            this.hoverEquipModel(newModel);
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

        if (newModel && newModel.name === modelNameEnum.Space) {
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
        console.log('viewOnClickTarget--model: ', model);
        this.unselectModel();
        // if (model.target) {
        //     model.setState('selected', true);
        // }
        if (model.name === modelNameEnum.Space) {
            this.selectSpaceModel(model);
        } else if (model && model.name === modelNameEnum.Group) {
            this.selectEquipModel(model);
        } else if (model && (model.name === modelNameEnum.Equip || model.name === modelNameEnum.EquipStateInfo)) {
            this.selectEquipModel(model.parent);
        } else if (model && (model.name === modelNameEnum.FloorTagInfo || model.name === modelNameEnum.Floor)) {
            const d = model.parent.equipData || model.equipData;
            if (d) {
                this.dispatchEvent({
                    type: 'clickFloor',
                    data: { ...d, floorId: d.id }
                });
            }
        }
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
        this.hoverModel(model);
        const fId = model?.data?.floorId;
        if (fId && this.floorIdMapModal[fId]?.floorLocalId) {
            this.highlightFloor(this.floorIdMapModal[fId].floorLocalId);
        }
    }

    hoverCard(model) {
        const pos = convertP3ToP2(this.renderContext, model?.data?.bimLocation || model.spaceData?.bimLocation);
        this.dispatchEvent({
            type: 'onHoverCard',
            data: { pos, instance: model?.data || model.spaceData }
        });
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
    selectEquipModel(model) {
        this.selectModel(model);
        this.clickDetail(model.data);
        const fId = model?.data?.floorId;
        if (fId && this.floorIdMapModal[fId]?.floorLocalId) {
            this.highlightFloor(this.floorIdMapModal[fId].floorLocalId, 'active');
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
        if (space) {
            this.hoverSpaceModel(space);
            this.hoverCard(space);
            return;
        }
        const equip = this.equipGroupModelMap.get(obj.id);
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

    async _loadeSceneBackground() {
        Promise.allSettled([this.floorMapSceneLoader.getSceneBackground(this.renderer)]).then(rst => {
            const [rst0, rst1] = rst;
            if (rst0.status === 'fulfilled') {
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
        return Promise.allSettled([this.floorMapSceneLoader.initLightAndShadow()]).then(rst => {
            const [rst0] = rst;
            if (rst0.status === 'fulfilled') {
                const lights = rst0.value;
                // this.lightsMap[FLOOR_MODE] = lights;
                addLights(lights, FLOOR_MODE);
                // this.wireframeGroup.add(lights);
            }
        });
    }

    async initLoader() {
        const loadPromise = [];
        await Promise.allSettled([this.floorMapSceneLoader.init()]);
        loadPromise.push(this._loadeSceneLights());
        await Promise.allSettled(loadPromise);
        this.setCamera(this.buildingCameraModel);
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

    updateSpaceEquipData(data, floorAbnormalRecord) {
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
            if (equipGroup?.data) {
                Object.keys(obj).forEach(k => {
                    equipGroup.data[k] = obj[k];
                });
            }
        });

        spaces?.forEach(space => {
            if (space.abnormal) {
                //空间是否存在异常
                floorAbnormalRecord.value[space.floorId] = space.floorId;
            }
        });
        equipments?.forEach(equipment => {
            const { abnormalTypes } = equipment;
            if (abnormalTypes?.length > 0) {
                floorAbnormalRecord.value[equipment.floorId] = equipment.floorId;
            }
        });
    }

    updateShowElements() {
        console.log('updateShowElements: ', this.curFilterType);
        const curFloorId = this._curFloorId;
        const isFloorMap = this.mapMode === FLOOR_MODE;

        const spaceShowFloorLocalId = new Set();

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

            space?.setAsyncState('hide', hideVal);
            space?.setAsyncState('filterHide', filterHide);
            // 全楼视角：仅展示未隐藏、未过滤隐藏的空间的楼层，待更新楼层数据
            if (!isFloorMap && !hideVal && !filterHide) {
                spaceShowFloorLocalId.add(spaceData.floorLocalId);
            }

            // const val = isFloorMap && spaceData.floorId !== curFloorId;

            space?.setAsyncState('floorMode', isFloorMap);
        });
        this.equipGroupModelMap.forEach(model => {
            let filterHide = false;
            const { data } = model;
            // 楼层及全楼视角顶部header筛选：过滤展示有异常类型的设备
            // 非异常tab时，全楼视角默认过滤隐藏设备，楼层视角不过滤隐藏

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

                this.rootNodeModel.addChild(space);
                space.addChild(spaceLabel);
                // this.spaceLabelDetector.addElement(spaceLabel);
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
        await this.graphResourceManager.loadEquips(equips, {}, obj => {
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
                } catch (e) {
                    console.log('e: ', e);
                }
            }
        });
        this.updateShowElements();
    }
    async createElements(data) {
        const { spaces, parkingPlaces, equips } = data;
        console.log(' spaces, equips: ', spaces, parkingPlaces, equips, this.Scene);
        // console.log('spaces: ', data, floors);

        this.graphResourceManager.cancelAll();
        this.removeDyncElements();
        this._createSpaces(spaces);

        parkingPlaces?.forEach(obj => {
            const m = createParkingPlace(obj);
            this.rootNodeModel.addChild(m);
            // console.log('m: ', m);
            const cs = createChargingStation(obj, m);
            this.rootNodeModel.addChild(cs);
            // cs.setState('abnormal', true);
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
        // console.log('_switchCamera: ', this.mapMode === BUILDING_MODE, this.curClipBox?.clone());

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
            await Promise.allSettled([this.graphResourceManager.loadCfResource(fId, styles), this.graphResourceManager.loadFloorMeshInfos(fId, styles)]).then(rst => {
                const [rst0, rst1] = rst;
                if (rst0.status === 'fulfilled' && rst0.value) {
                    const { equip, mesh } = rst0.value;
                    equip.setStateStyles(rst.styles);

                    // this.rootNodeModel.addChild(equip);
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
                    // floorMesh.material.side = THREE.FrontSide;
                    this.floorIdMapModal[fId].floorMesh = floorMesh;

                    const material = new THREE.MeshBasicMaterial({ color: '#DFE6EE', transparent: true, opacity: 0.1 });
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

    // 切换模式视图展示
    async switchModeView(modeVal, floorId) {
        // 全楼与楼层视角切换
        // console.trace('switchModeView--modeVal: ', modeVal);
        this._curFloorId = floorId;
        this.mapMode = modeVal;
        // 切换过渡中 隐藏页面元素
        this.rootNodeModel.setState('hidden', true);
        if (this.css3dRender.domElement.style) {
            this.css3dRender.domElement.style.display = 'none';
        }

        if (modeVal === FLOOR_MODE) {
            await this._loadAndShowCF();
            await this._clipBox();
        }
        this.rootNodeModel.setState('hidden', false);
        if (this.css3dRender.domElement.style) {
            this.css3dRender.domElement.style.display = 'block';
        }
        this._updateFloorObjectsShow();
        this._switchCamera();
        this._switchLights();
        console.log('sssss====', this.Scene);
        this._collisionInvokeDebounce();
    }

    invokeScaleAndCollision() {
        //TODO 待更新碰撞消费
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
    }
}
