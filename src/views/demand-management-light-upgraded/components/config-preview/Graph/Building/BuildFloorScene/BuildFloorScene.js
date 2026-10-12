// @ts-ignore
import i18n from '@/localization';
import { WebGLScene } from '@yushu/core3d';
import { SceneLoader, EffectLoader } from '@yushu/effecttool';
import { ShaderPass } from '@yushu/three-base/three-extends/jsm/postprocessing/ShaderPass';
import { GammaCorrectionShader } from '@yushu/three-base/three-extends/jsm/shaders/GammaCorrectionShader';
import { debounce } from 'lodash';
import CameraControls from 'camera-controls';
import * as THREE from '@yushu/three-base';
import { parseMainBuildingBoardInfo, isFloor, isFloorFrame, calcFloorDirectionalLight, restoreControls } from './utils';

// import EquipPopoverInfo from '@/views/GraphMVC/graphScene/EquipPopoverInfo/EquipPopoverInfo';
import SpacePopoverInfo from './SpacePopoverInfo/SpacePopoverInfo';
import RootNode from '@/views/GraphMVC/graphScene/RootNode/RootNode';
import Controller from '@/views/GraphMVC/core/Controller';
import { INTERFACE_PREFIX_RWD } from '@/config';
import { GraphResourceManager } from '@/views/GraphMVC/utils/GraphResourceManager';

import Group from '@/views/GraphMVC/graphScene/Group/Group';
import Floor from '@/views/GraphMVC/graphScene/Floor/Floor';
import FloorTagInfo from '@/views/GraphMVC/graphScene/FloorTagInfo/FloorTagInfo';
import MultipleSpace from '@/views/GraphMVC/graphScene/MultipleSpace/MultipleSpace';
import SpaceCollisionDetector from './CollisionDetector/SpaceCollisionDetector';
import { modelNameEnum, RenderOrder, StatePriority } from '@/views/GraphMVC/graphScene/GraphSceneDefine';
import { getFloorInfoByFloorId } from '@/utils/buildingUtils';
import { baseColors } from '@/constants/baseColors';
import VisibilityContext from '@/views/GraphMVC/graphScene/Context/VisibilityContext';
import { SMD_PARTIAL_OPEN, SMD_ALL_CLOSE, SMD_ALL_OPEN, NOT_CONFIGURED, FEEDBACK_ADJUSTMENT } from '@/views/demand-management-light-upgraded/constant';

const { M2FOOT, MM2FOOT, ResourceTracker } = THREE.baseUtils;

const WIREFRAME_SCENE_NAME = '07_building_relation';
const D3_SCENE_NAME = '05_building_classic';

const BUILDING_MODE = 1;
const FLOOR_MODE = 2;

const SETTING_MODE_LIST = [SMD_PARTIAL_OPEN, SMD_ALL_CLOSE, SMD_ALL_OPEN, FEEDBACK_ADJUSTMENT];
// 开关状态对应的 Model 状态键
const SETTING_MODE_STATE = {};
// 开关状态对应的颜色配置
const SETTING_MODE_COLORS = {};

const createSpaceModel = item => {
    const floorInfo = getFloorInfoByFloorId(item.floorId);
    const { floorElevation, height } = floorInfo;
    const floorHeight = M2FOOT * Number(floorElevation || 0);
    const _height = M2FOOT * Number(height || 0);
    const space = new MultipleSpace(item, { height: 0, floorHeight, depths: [_height, 0.01] });

    space.setStateStyles({
        normal: {
            ...space.defineStyles.normal,
            color: baseColors['$grey-500'],
            useLinearColor: true,
            alpha: 0.5
        },
        floorMode: {
            priority: RenderOrder.space + 2,
            alpha: 1
        },
        selected: {
            show: true,
            color: baseColors['$blue-500'],
            alpha: 1,
            priority: RenderOrder.selected
        },
        hover: {
            show: true,
            priority: RenderOrder.hover,
            alpha: 1,
            colorMode: 'dark'
        },
        partOpen: {
            color: SETTING_MODE_COLORS[SMD_PARTIAL_OPEN].spaceColor || '#AC9777',
            alpha: 0.5,
            priority: RenderOrder.space + 1
        },
        allOpen: {
            color: SETTING_MODE_COLORS[SMD_ALL_OPEN].spaceColor || baseColors['$orange-500'],
            alpha: 0.5,
            priority: RenderOrder.space + 1
        },
        allClose: {
            color: SETTING_MODE_COLORS[SMD_ALL_CLOSE].spaceColor || baseColors['$grey-900'],
            alpha: 0.5,
            priority: RenderOrder.space + 1
        },
        feedbackAdjustment: {
            color: SETTING_MODE_COLORS[FEEDBACK_ADJUSTMENT].spaceColor,
            alpha: 0.5,
            priority: RenderOrder.space + 1
        },
        limitHide: {
            show: false,
            priority: 1000
        },
        filterHide: {
            show: false,
            priority: Infinity
        },
        hide: {
            show: false,
            priority: Infinity
        }
    });

    return space;
};

export const createSpaceLabelInfoModel = objData => {
    const floorInfo = getFloorInfoByFloorId(objData.floorId);
    const { floorElevation } = floorInfo;
    const floorHeight = M2FOOT * Number(floorElevation || 0);
    const model = new SpacePopoverInfo(objData, { floorHeight });

    model.setStateStyles({
        normal: {
            ...model.defineStyles.normal,
            show: true,
            showIcon: false,
            showText: true,
            showPopover: false
        },
        hover: {
            show: true,
            showText: true,
            showPopover: true,
            cssName: 'hover',
            textColor: '#246FE5',
            renderOrder: RenderOrder.hover,
            priority: StatePriority.hover
        },
        selected: {
            show: true,
            showText: true,
            showSelect: true,
            textColor: '#246FE5',
            renderOrder: RenderOrder.selected,
            priority: StatePriority.selected
        },
        feedbackAdjustment: {
            showIcon: true,
            priority: RenderOrder.space + 2
        },
        partOpen: {
            showIcon: false,
            priority: RenderOrder.space + 2
        },
        allOpen: {
            showIcon: false,
            priority: RenderOrder.space + 2
        },
        allClose: {
            showIcon: false,
            priority: RenderOrder.space + 2
        },
        filterHide: {
            show: false,
            priority: 500,
            showPopover: false
        },
        hide: {
            show: false,
            priority: Infinity,
            showPopover: false
        },
        buildingMode: {
            show: true,
            // showText: false,
            showPopover: false
        }
    });
    return model;
};

const DEFAULT_ENV = import.meta.env.U3D_ENV || 'production';
export default class BuildingScene extends WebGLScene {
    constructor({ projectId = '', groupCode, env = DEFAULT_ENV, floorLoading, bgColor, spaceMaxCount }) {
        super();
        this.projectId = projectId;
        this.groupCode = groupCode;
        this.env = env;

        this.floorModalMap = {}; // 楼层名字 到楼层信息的映射
        this.floorLoading = floorLoading;
        /**
         * [floorId]:{cfModel:,cfMesh:,floorModel:,floorMesh,floorOriginMat:,floorGreyMat}
         */
        this.floorIdMapModal = {}; // 楼层id映射模型
        RootNode.registerAll();
        this.bgColorRef = bgColor;
        this.spaceMaxCount = spaceMaxCount;
        SETTING_MODE_STATE[SMD_ALL_OPEN] = 'allOpen';
        SETTING_MODE_STATE[SMD_ALL_CLOSE] = 'allClose';
        SETTING_MODE_STATE[SMD_PARTIAL_OPEN] = 'partOpen';
        SETTING_MODE_STATE[FEEDBACK_ADJUSTMENT] = 'feedbackAdjustment';
        SETTING_MODE_COLORS[SMD_ALL_OPEN] = {
            spaceColor: baseColors['$yellow-500'],
            label: i18n.global.t('meos_control_web.fully_on'),
            labelColor: '#ffffff',
            labelBgColor: baseColors['$yellow-600']
        };
        SETTING_MODE_COLORS[SMD_ALL_CLOSE] = {
            spaceColor: baseColors['$grey-600'],
            label: i18n.global.t('meos_control_web.fully_off'),
            labelColor: baseColors['$grey-600'],
            labelBgColor: baseColors['$grey-200']
        };
        SETTING_MODE_COLORS[SMD_PARTIAL_OPEN] = {
            spaceColor: baseColors['$orange-800'],
            label: i18n.global.t('meos_control_web.partial_on'),
            labelColor: baseColors['$red-700'],
            labelBgColor: baseColors['$red-100']
        };
        SETTING_MODE_COLORS[NOT_CONFIGURED] = {
            spaceColor: '#8B949E',
            label: i18n.global.t('meos_control_web.unconfiged'),
            labelColor: baseColors['$grey-600'],
            labelBgColor: baseColors['$grey-200']
        };
        SETTING_MODE_COLORS[FEEDBACK_ADJUSTMENT] = {
            spaceColor: '#A7008E',
            label: i18n.global.t('meos_control_web.feedback_adjustment'),
            labelColor: baseColors['$purple-700'],
            labelBgColor: baseColors['$purple-100']
        };
    }

    Init() {
        this.useCameraControls = true;
    }

    Create() {
        this.meshGroup = new THREE.Group();
        this.Scene.add(this.meshGroup);

        this.floorMeshGroup = new THREE.Group();
        this.Scene.add(this.floorMeshGroup);

        this.Scene.background = new THREE.Color('#D6DDE5');

        // 场景加载器
        this.buildingSceneLoader = new SceneLoader(this.env, this.projectId, WIREFRAME_SCENE_NAME, this.renderer);
        this.floorMapSceneLoader = new SceneLoader(this.env, this.projectId, D3_SCENE_NAME, this.renderer);

        // 模式对应灯光
        this.lightsMap = {};
        // 模式对应背景
        this.bgModeMap = {};
        this.curSpaceShowMap = {};

        this.initCamera();

        // 处理事件相关代码
        this.effectLoader = new EffectLoader(this.env, this.renderer);
        this.composer = this.effectLoader.getComposer(this.Scene, this.camera);
        // this.composer.addPass(new ShaderPass(GammaCorrectionShader));
        this.setComposser(this.composer);

        // 状态感知相关Spce Model
        this.mainSpaceModelMap = new Map();
        this.curRelIdSet = new Set();

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

        this.spaceNameCollisionDetector = new SpaceCollisionDetector(this.renderContext); // 空间名称碰撞器
        this._collisionInvokeDebounce = debounce(this.invokeScaleAndCollision, 20);
        this.bindEvent();

        this.tracker = new ResourceTracker();
        this.tracker.track(this.floorMeshGroup);
        this.tracker.track(this.meshGroup);
    }

    // controller 调用
    viewOnHoverTargetChanged({ newModel }) {
        if (newModel && newModel.getState('selected')) {
            return;
        }

        this.rootNodeModel.unhoverSpace();
        this.unhoverModel();

        if (newModel && newModel.name === modelNameEnum.MultipleSpace) {
            this.hoverModel(newModel.parent);
            this.css3dRender.domElement.style.cursor = 'pointer';
        } else if (newModel && newModel.name === modelNameEnum.Group && newModel.data) {
            this.hoverModel(newModel);
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
            // this.hoverSpaceCard(newModel.parent);
            this.css3dRender.domElement.style.cursor = 'pointer';
        } else if (newModel && newModel.name === modelNameEnum.Group && newModel.data) {
            // this.hoverSpaceCard(newModel);
            this.css3dRender.domElement.style.cursor = 'pointer';
        }
    }

    // controller 调用
    viewOnClickTarget({ model }) {
        if (model && model.getState('selected')) {
            return;
        }
        if (model && model.name === modelNameEnum.MultipleSpace) {
            this.clickDetail(model.spaceData);
            this.css3dRender.domElement.style.cursor = 'pointer';
        }
    }

    removeSpaceCard() {
        if (this.curSpaceCard) {
            this.rootNodeModel.removeChild(this.curSpaceCard);
            this.curSpaceCard = null;
        }
    }
    showSpaceCard(model) {
        this.removeSpaceCard();
        let subModels = [];
        model?.childModels?.forEach(v => {
            if (v?.name === modelNameEnum.SpacePopoverInfo) {
                subModels.push(v);
            }
            if (v?.name === modelNameEnum.MultipleSpace) {
                subModels.push(v);
            }
        });

        subModels.forEach(v => {
            v?.setState('hover', true);
        });
        this.currentHoverModels = subModels;

        // const popopver = new EquipPopoverInfo(data, {
        //     label: modeInfo.label || '',
        //     labelColor: modeInfo.labelColor || '',
        //     labelBgColor: modeInfo.labelBgColor || ''
        // });
        // this.rootNodeModel.addChild(popopver);
        // this.curSpaceCard = popopver;
    }

    hoverModel(model) {
        model?.setState('hover', true);
        this.showSpaceCard(model);
    }

    hoverSpaceModelById(spaceId) {
        this.unhoverModel();
        this.hoverModel(this.mainSpaceModelMap.get(spaceId));
    }

    unhoverModel() {
        if (this.currentHoverModels?.length) {
            this.currentHoverModels.forEach(v => {
                v?.setState('hover', false);
            });
            this.currentHoverModels = null;
        }
        this.removeSpaceCard();
    }

    selectSpace(param) {
        this.unselectModel();
        let model = null;
        if (typeof param === 'string') {
            model = this.mainSpaceModelMap.get(param);
        } else {
            model = param;
        }
        console.log('model :>> ', model);
        if (model) {
            model.setState('selected', true);
            this.currentSelectedModel = model;
        }
    }

    selectModel(model) {
        model.setState('selected', true);
        this.currentSelectedModel = model;
    }

    unselectModel() {
        if (this.currentSelectedModel) {
            this.currentSelectedModel.setState('selected', false);
            this.currentSelectedModel = null;
        }
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
                    // this.Scene.add(group);
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
            console.log('floorGroups: ', floorGroups);
            this.createFloorMeshs(floorGroups);
            // this.controls.setBoundary(boudingBox);
            this.buildingBox = boudingBox;
            // this.buildingBox.setFromObject(this.meshGroup);
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
        // console.log('createFloorMeshs: ');
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
                        floorAlpha: floorMesh?.material.opacity,
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
                        floorAlpha: 0.6,
                        wframeColor: '#246FE5'
                    },
                    selected: {
                        floorAlpha: 0.6,
                        wframeColor: '#246FE5',
                        priority: RenderOrder.hover
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

    recordFloorInfo(info, createTag) {
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
            if (newInfo.floorTag && newInfo.floorTag.isRemoved()) {
                newInfo.floorMVCModal.addChild(newInfo.floorTag);
                newInfo.floorMVCModal.setState('inUse', true);
            }
        }
        if (createTag && !newInfo.floorTag) {
            const floorTag = new FloorTagInfo({ ...newInfo, cameraDirection: this._defaultCameraDirection });
            floorTag.defineStyles.relModeHide = {
                show: false,
                priority: 100
            };
            if (newInfo.floorMVCModal) {
                newInfo.floorMVCModal.addChild(floorTag);
                newInfo.floorMVCModal.setState('inUse', true);
            }
            newInfo.floorTag = floorTag;
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

    // 重建空间
    rebuildSpaces(spaces, floors) {
        this.removeMainSpaceModels();
        floors?.forEach(floor => {
            this.recordFloorInfo({ floorName: floor.localId, id: floor.id }, false);
        });
        if (spaces?.length > 0) {
            this._createSpaces(spaces);
            this._collisionInvokeDebounce();
        }
    }

    updateSpaceMode(idMapMode) {
        this.mainSpaceModelMap.forEach(model => {
            const d = model.data;
            if (d && idMapMode[d.id]) {
                d.circuitSettingMode = idMapMode[d.id];
                SETTING_MODE_LIST.forEach(mode => {
                    const sname = SETTING_MODE_STATE[mode];
                    if (sname) {
                        const sval = mode === idMapMode[d.id];
                        model.setState(sname, sval);
                    }
                });
            }
        });
        // this._collisionInvokeDebounce();
    }

    _createSpaces(list) {
        // const spaceModels = [];
        const isExceedLimit = list?.length > this.spaceMaxCount;
        this.isExceedLimit = isExceedLimit;
        (list || []).forEach(item => {
            // 若容器中已经创建过了或待创建的关联空间是当前选中的主空间，则之间返回
            if (this.mainSpaceModelMap.has(item.id)) {
                return;
            }
            const group = new Group();
            group.data = item;

            const spaceModel = createSpaceModel(item);

            if (spaceModel) {
                group.addChild(spaceModel);
                spaceModel.setGeometryIndex(0);
            }

            const spaceLabel = createSpaceLabelInfoModel(item);

            group.addChild(spaceLabel);
            this.rootNodeModel.addChild(group);

            this.spaceNameCollisionDetector.addElement(spaceLabel);
            const val = this.mapMode === FLOOR_MODE && item.floorId !== this._curFloorId;
            const spaceHide = this.mapMode === BUILDING_MODE && isExceedLimit;
            group.setState('limitHide', spaceHide);
            group.setState('hide', val);

            this.mainSpaceModelMap.set(item.id, group);
        });
    }

    // _switchLights() {
    //     if (this.mapMode) {
    //         Object.keys(this.lightsMap).forEach(k => {
    //             const _mode = parseInt(k);
    //             const lights = this.lightsMap[k];
    //             lights?.forEach(light => {
    //                 light.visible = _mode === this.mapMode;
    //                 if (light.visible) {
    //                     this.Scene.add(light);
    //                 } else {
    //                     this.Scene.remove(light);
    //                 }
    //                 if (_mode === this.mapMode && light.isDirectionalLight) {
    //                     if (this.mapMode === FLOOR_MODE) {
    //                         calcFloorDirectionalLight(this.curClipBox, light);
    //                     }
    //                     // console.log('isDirectionalLight: ', light, this.curClipBox);
    //                 }
    //             });
    //         });
    //     }
    // }

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

        console.log('this.Scene :>> ', this.Scene);
    }

    _switchCamera() {
        // console.log('_switchCamera: ', this.mapMode === BUILDING_MODE, this.curClipBox?.clone());
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

                // 缩放范围
                this.controls.minZoom = 0.1;
                this.controls.maxZoom = 25;
            }
        }
    }

    _switchBg() {
        const bg = this.bgModeMap[this.mapMode];
        if (bg) {
            const _bg = bg.clone();
            this.Scene.background = _bg;
        }
    }

    _clipBox() {
        const fId = this._curFloorId;
        if (!fId) {
            return;
        }
        if (this.mapMode === FLOOR_MODE) {
            const boundingBox = new THREE.Box3();
            const curFloorId = this._curFloorId;
            // 土建楼板显隐
            Object.keys(this.floorIdMapModal).forEach(floorId => {
                if (curFloorId === floorId) {
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
            this.mainSpaceModelMap.forEach(group => {
                const { data: spaceData } = group;

                if (spaceData?.floorId === curFloorId) {
                    const spaceMesh = this.Scene.getObjectByProperty('modelKey', spaceData?.id);
                    if (spaceMesh) {
                        boundingBox.expandByObject(spaceMesh);
                    }
                }
            });
            this.curClipBox = boundingBox;
            // mesh = this.floorIdMapModal[fId]?.cfMesh;
            // const node = this.Scene.getObjectByName(modelNameEnum.RootNode);
            // if (node) {
            //     const boundingBox = new THREE.Box3();
            //     boundingBox.expandByObject(node);
            //     boundingBox.expandByObject(this.floorMeshGroup);
            //     this.curClipBox = boundingBox;
            // }
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
        this.updateShowSpaces();
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
            floorMesh.visible = !val;
        });
    }
    setCurShowSpaces(showSpaceMap) {
        this.curSpaceShowMap = showSpaceMap;
    }
    updateShowSpaces() {
        this.spaceNameCollisionDetector.clearElements();
        const curFloorId = this._curFloorId;
        const isFloorMap = this.mapMode === FLOOR_MODE;
        // 遍历空间
        this.mainSpaceModelMap.forEach(group => {
            const { data: spaceData } = group;
            // 非全楼情况下
            // 只显示: 楼层平面图本楼层空间或空间三维图本空间，其它隐藏
            const val = isFloorMap && spaceData.floorId !== curFloorId;
            const spaceHide = this.mapMode === BUILDING_MODE && this.isExceedLimit;
            const filterHide = !this.curSpaceShowMap[spaceData.id];
            group?.setAsyncState('filterHide', filterHide);
            group?.setAsyncState('hide', val);
            group?.setAsyncState('limitHide', spaceHide);
            group?.setAsyncState('floorMode', isFloorMap);

            // 空间上小圆点model，对应第1个子
            if (!val && !filterHide) {
                // const space = this.isExceedLimit ? null : group?.getChildByIndex(0);
                let labelModel, space;
                group.childModels.forEach(m => {
                    if (m.name === modelNameEnum.SpacePopoverInfo) {
                        labelModel = m;
                        m?.setAsyncState('buildingMode', this.mapMode === BUILDING_MODE);
                    }
                    if (m.name === modelNameEnum.MultipleSpace) {
                        space = m;
                    }
                });

                space?.setGeometryIndex(isFloorMap ? 1 : 0);
                if (labelModel) {
                    this.spaceNameCollisionDetector.addElement(labelModel);
                }
            }
        });
        this._collisionInvokeDebounce();
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
        this.floorLoading.value = true;
        try {
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
                    if (!this.floorIdMapModal[fId]) {
                        this.floorIdMapModal[fId] = {};
                    }
                    this.floorIdMapModal[fId].cfModel = equip;
                    this.floorIdMapModal[fId].cfMesh = mesh;
                } else {
                    console.log('loadCfResource error: ', rst0);
                }
                const floor = getFloorInfoByFloorId(fId);
                const floorElevation = M2FOOT * Number(floor.floorElevation || 0);
                if (rst1.status === 'fulfilled') {
                    const { mesh: floorMesh, equip } = rst1.value;

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
        this.floorLoading.value = false;
    }

    // 切换模式视图展示
    async switchModeView(modeVal, floorId, restoreCamera = true) {
        this._curFloorId = floorId;
        this.mapMode = modeVal;
        // 切换过渡中 隐藏页面元素
        this.rootNodeModel.setState('hidden', true);
        if (this.css3dRender.domElement.style) {
            this.css3dRender.domElement.style.display = 'none';
        }

        this._updateBuildingShow();
        if (modeVal === FLOOR_MODE) {
            await this._loadAndShowCF();
            await this._clipBox();
        } else {
            this.curClipBox = this.buildingBox;
        }
        this.rootNodeModel.setState('hidden', false);
        if (this.css3dRender.domElement.style) {
            this.css3dRender.domElement.style.display = 'block';
        }
        this._updateFloorObjectsShow();
        if (restoreCamera) {
            this._switchCamera();
        }
        this._switchLights();
        this._switchBg();

        this._collisionInvokeDebounce();
    }

    invokeScaleAndCollision() {
        this.spaceNameCollisionDetector?.collision();
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

    removeMainSpaceModels() {
        this.mainSpaceModelMap.forEach((v, k) => {
            this.rootNodeModel.removeChild(v);
        });
        this.mainSpaceModelMap.clear();
        this.curSpaceShowMap = {};
    }

    removeAllObjects() {
        this.removeMainSpaceModels();

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
        this.renderer.setAnimationLoop(null);
        // 销毁
        console.log('-------------------销毁-------------------');
        this.renderer.clear();
        this.renderer.dispose();
        this.renderer.forceContextLoss();
        this.effectLoader?.dispose();
        this.renderer.renderLists.dispose();
        this.renderer.context = null;
        this.renderer.domElement = null;
        this.renderer.getRenderTarget()?.dispose();
        this.renderer.info.reset();
    }
}
