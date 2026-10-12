// @ts-ignore
import i18n from '@/localization';
import { WebGLScene } from '@yushu/core3d';
import { SceneLoader, EffectLoader } from '@yushu/effecttool';
import _, { debounce } from 'lodash';
import CameraControls from 'camera-controls';
import * as THREE from '@yushu/three-base';
import { parseMainBuildingBoardInfo, isFloor, isFloorFrame, calcFloorDirectionalLight, restoreControls, convertP3ToP2 } from '@/apm-3d/utils/buildingTools';
import RootNode from '@/views/GraphMVC/graphScene/RootNode/RootNode';
import Controller from '@/views/GraphMVC/core/Controller';
import { INTERFACE_PREFIX_RWD, useFloorCollisionSetting } from '@/config';
import { GraphResourceManager } from '@/views/GraphMVC/utils/GraphResourceManager';
import EquipStateDetector from './graph/CollisionDetector/EquipStateDetector';
import AirEquipIconInfoDetector from './graph/CollisionDetector/AirEquipIconInfoDetector';
import SpaceLabelInfoDetector from './graph/CollisionDetector/SpaceLabelInfoDetector';
import FloorSpaceEquipDetector from './graph/CollisionDetector/FloorSpaceEquipDetector';
import { RevitModelColorFromClassCode } from '@/views/GraphMVC/config/color/ModelCommonColor';

import Group from '@/views/GraphMVC/graphScene/Group/Group';
import Floor from '@/views/GraphMVC/graphScene/Floor/Floor';
import { modelNameEnum } from '@/views/GraphMVC/graphScene/GraphSceneDefine';
import { getFloorInfoByFloorId } from '@/utils/buildingUtils';
import { OBJ_TYPE } from '@/utils/globalVariables';
import VisibilityContext from '@/views/GraphMVC/graphScene/Context/VisibilityContext';

import AdvanceLinkLine from '@/views/GraphMVC/graphScene/AdvanceLinkLine/AdvanceLinkLine';
import { collectGeometryBuffer } from '@/views/GraphMVC/core/utils';
import RevitPipe from '@/views/GraphMVC/graphScene/RevitPipe/RevitPipe';
import { ThreadPool } from '@/utils/ThreadPool';
// eslint-disable-next-line import/extensions
import RevitPipleWorker from '@/views/GraphMVC/workers/RevitPiple.worker.js?worker';

import Equip from '@/views/GraphMVC/graphScene/Equip/Equip';

import { CONTROL_BAR_TAB_KEYS, ENV_ATTR_KEYS, ENV_CODE_MAP_INFOCODE, MONITORING_CONTROL_TYPE } from '@/views/ACOperationControl/constants/constant';
import DataBatchTaskHelper from '@/utils/DataBatchTaskHelper';
import { ABNORMAL_EVENT } from '@/utils/SSEEventTypes';
import { NONE_RENDER_IN_3D } from '../constants/constant';

import {
    getEquipStyles,
    createEqupStateInfo,
    createEqupIconInfo,
    createSpaceModel,
    createSpaceLabelInfoModel,
    createSpacePositionInfoModel,
    isEquipAbnormal
} from '../utils/scene';

const { M2FOOT, MM2FOOT, ResourceTracker } = THREE.baseUtils;

const WIREFRAME_SCENE_NAME = '07_building_relation';
const D3_SCENE_NAME = '05_building_classic';

const BUILDING_MODE = 1;
const FLOOR_MODE = 2;
// 枚举映射状态
const ENUM_MAP_STATE = {
    NO_STANDARD: 'noStandard', // 无标准算作无数据
    NO_DATA: 'noneData',
    // NONE_DATA: 'noneData', // 无数据
    TOO_COLD: 'coldest', // 过冷
    COLD: 'colder', // 偏冷
    APPROPRIATE: 'appropriate', // 舒适
    HOT: 'hotter', // 偏热
    SLIGHTLY_HIGH: 'highCo2', //偏高
    TOO_HIGH: 'overCo2', // 过高
    TOO_HOT: 'hottest', // 过热
    TARGET_VALUE: 'targetValue', // 目标值 (tdb or co2)
    UPPER_LIMIT_VALUE: 'dspHot', // 上限值 (tdb or co2)
    COLD_STORAGE_VALUE: 'dspCold', // 蓄冷值 (tdb)
    LOWER_LIMIT_VALUE: 'dspCold', // 下限值 (tdb)
    HEAT_STORAGE_VALUE: 'dspHot', // 蓄热值 (tdb)

    TOO_LOW: 'coldest',
    SLIGHTLY_LOW: 'colder',
    // 屏蔽
    SHIELDED_ZONE: 'envShieldedZone',
    NORMAL: 'appropriate'
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
        currentEnvAttr,
        currentEnvAttrFloor,
        currentTabFloor,
        showPipes,
        onlyShowControlledEquipment,
        onlyShowIOTSpace,
        mapSettings
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
        this.curEnvAttrRef = currentEnvAttr;
        this.currentEnvAttrFloorRef = currentEnvAttrFloor;
        this.currentTabFloorRef = currentTabFloor;
        this.showPipesRef = showPipes;
        this.onlyShowControlledEquipmentRef = onlyShowControlledEquipment;
        this.onlyShowIOTSpaceRef = onlyShowIOTSpace;
        this.mapSettingsRef = mapSettings;

        this.spaceCreateBatchHelper = new DataBatchTaskHelper({
            taskHandler: this.createSpaces,
            sortFn: this.spaceCreateSort,
            handerSrcScope: this
        });
        this.equipCreateBatchHelper = new DataBatchTaskHelper({
            taskHandler: this.createEquip2DModels,
            handerSrcScope: this
        });
    }

    // 空间分批创建排序
    spaceCreateSort(a, b) {
        if (this.mapMode === BUILDING_MODE) {
            if (this.curFilterType === CONTROL_BAR_TAB_KEYS.QUALITY) {
                let k = '';
                if (this.curEnvAttr === ENV_ATTR_KEYS.RH) {
                    k = a?.tag?.rHInterval;
                } else if (this.curEnvAttr === ENV_ATTR_KEYS.PRESSURE_DIFF) {
                    k = a?.tag?.relativePressureDiffToOtherSpaceInterval;
                } else {
                    k = this.curEnvAttr === ENV_ATTR_KEYS.TEMPERATURE ? a?.tag?.temperatureInterval : a?.tag?.carbonDioxideInterval;
                }

                const aStateName = ENUM_MAP_STATE[k];
                return aStateName ? -1 : 1;
            } else if (this.curFilterType === CONTROL_BAR_TAB_KEYS.SCHEDUING) {
                const aStateName = ENUM_MAP_STATE[this.curEnvAttr === ENV_ATTR_KEYS.TEMPERATURE ? a?.tag?.temperatureDemandStatus : a?.tag?.carbonDioxideDemandStatus];
                return aStateName ? -1 : 1;
            }
        } else {
            return this._curFloorId === a.floorId ? -1 : 1;
        }
        return 0;
    }

    get curFilterType() {
        return this.curFilterTypeRef?.value;
    }
    get filterEquipmentClass() {
        return this.filterEquipmentClassRef?.value;
    }

    get showPipes() {
        return this.showPipesRef?.value;
    }
    get curEnvAttr() {
        return this.curEnvAttrRef?.value;
    }

    get currentEnvAttrFloor() {
        return this.currentEnvAttrFloorRef?.value;
    }
    get currentTabFloor() {
        return this.currentTabFloorRef?.value;
    }
    get onlyShowControlledEquipment() {
        return this.onlyShowControlledEquipmentRef?.value;
    }
    get onlyShowIOTSpace() {
        return this.onlyShowIOTSpaceRef?.value;
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
        this.composer = this.effectLoader.getComposer(this.Scene, this.camera);
        // this.composer.addPass(new ShaderPass(GammaCorrectionShader));
        // const outputPass = new OutputPass();
        // this.composer.addPass(outputPass);
        this.setComposser(this.composer);

        // 状态感知相关Spce Model
        this.mainSpaceModelMap = new Map();
        this.otherSpaceModelMap = new Map();
        this.equipGroupModelMap = new Map();
        this.curRelIdSet = new Set();
        this.pipeModels = [];

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
        // #空间标签图元碰撞器
        this.equipStateDetector = new EquipStateDetector(this.renderContext);
        // TAG 设备图元碰撞器
        this.airEquipIconInfoDetector = new AirEquipIconInfoDetector(this.renderContext);
        // 关联模式设备iocn碰撞器
        this.airEquipIconInfoRelDetector = new AirEquipIconInfoDetector(this.renderContext);
        // 空间信息点图元
        // this.spaceQualityInfoDetector = new SpaceQualityInfoDetector(this.renderContext);
        this.spaceLabelDetector = new SpaceLabelInfoDetector(this.renderContext);
        // 设备图元 + 空间标签 合并碰撞器 (空间和设备同时碰撞开启时使用)
        this.floorSpaceEquipDetector = new FloorSpaceEquipDetector(this.renderContext);
        this._collisionInvokeDebounce = debounce(this.invokeScaleAndCollision, 20);
        this.bindEvent();

        this.threadPool = new ThreadPool({
            WorkerConstructor: RevitPipleWorker
        });

        this.tracker = new ResourceTracker();
        this.tracker.track(this.floorMeshGroup);
        this.tracker.track(this.meshGroup);
    }

    // controller 调用
    viewOnHoverTargetChanged({ newModel }) {
        console.log('newModel: ', newModel);
        if (newModel?.getState('selected') || newModel?.isOther) {
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
        } else {
            this.css3dRender.domElement.style.cursor = 'default';
        }
    }

    // controller 调用
    viewOnLongHoverTargetChanged({ newModel }) {
        if ((newModel && newModel.getState('selected')) || newModel?.isOther) {
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
        if ((model && model.getState('selected')) || model?.isOther) {
            return;
        }
        this.unselectModel();
        if (model.name === modelNameEnum.MultipleSpace) {
            // this.selectSpaceModel(model);
            this.clickDetail(model.spaceData);
        } else if (model && model.name === modelNameEnum.Group) {
            // this.selectEquipModel(model);
            this.clickDetail(model.data);
        } else if (model && (model.name === modelNameEnum.Equip || model.name === modelNameEnum.EquipStateInfo)) {
            // this.selectEquipModel(model.parent);
            this.clickDetail(model.parent?.data);
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
        const data = model?.data || model.spaceData;
        const fId = data?.floorId;
        if (fId && this.floorIdMapModal[fId]?.floorLocalId) {
            this.highlightFloor(this.floorIdMapModal[fId].floorLocalId, 'hover');
        }
    }

    unhoverModel() {
        this.highlightFloor('hover');
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
            if (floorInfo && floorInfo.floorMVCModal) {
                model = floorInfo.floorMVCModal;
            }
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
    activeEquipFloorModel(model) {
        const fId = model?.data?.floorId;
        if (fId && this.floorIdMapModal[fId]?.floorLocalId) {
            this.highlightFloor(this.floorIdMapModal[fId].floorLocalId, 'active');
        }
    }
    selectEquipModel(model) {
        // this.selectModel(model);

        const fId = model?.data?.floorId;
        if (fId && this.floorIdMapModal[fId]?.floorLocalId) {
            this.highlightFloor(this.floorIdMapModal[fId].floorLocalId, 'active');
        }
    }
    activeSpaceFloorModel(model) {
        this.highlightFloor(model.spaceData?.floorLocalId, 'active');
    }
    selectSpaceModel(model) {
        // this.selectModel(model);

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
            this.selectModel(space);
            console.log('space: ', space);
            this.activeSpaceFloorModel(space);
            return;
        }
        const equip = this.equipGroupModelMap.get(obj.id);
        if (equip) {
            this.selectModel(equip);
            this.activeEquipFloorModel(equip);
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
            this._updateBuildingShow(false);
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
        if (this.mapMode === BUILDING_MODE) {
            this.setCamera(this.buildingCameraModel);
        }
        this._switchLights();
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
                floorModal.userinteractionEnable = false; // 不参与射线求交
                // const { floorMesh } = meshInfo;
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
            'appropriate',
            'colder',
            'coldest',
            'hotter',
            'highCo2',
            'overCo2',
            'targetValue',
            'hottest',
            'dspTarget',
            'dspCold',
            'dspHot',
            'noneData',
            'noStandard',
            'envShieldedZone'
        ];
        const spaceObj = space?.spaceData;

        if (!spaceObj) {
            return;
        }
        space.clearStatesAsync(stateNames);

        // 统一处理变量
        let filterType, envAttr, tabKey, envAttrTemp, envAttrCo2, envAttrHumidity;
        if (this.mapMode === BUILDING_MODE) {
            filterType = this.curFilterType;
            envAttr = this.curEnvAttr;
            tabKey = CONTROL_BAR_TAB_KEYS;
            envAttrTemp = ENV_ATTR_KEYS.TEMPERATURE;
            envAttrCo2 = ENV_ATTR_KEYS.CO2;
            envAttrHumidity = ENV_ATTR_KEYS.RH;
        } else {
            filterType = this.currentTabFloor;
            envAttr = this.currentEnvAttrFloor;
            tabKey = CONTROL_BAR_TAB_KEYS;
            envAttrTemp = ENV_ATTR_KEYS.TEMPERATURE;
            envAttrCo2 = ENV_ATTR_KEYS.CO2;
            envAttrHumidity = ENV_ATTR_KEYS.RH;
        }

        if (filterType === tabKey.QUALITY) {
            let stateNameKey = null;
            if (envAttr === envAttrTemp) {
                stateNameKey = spaceObj.tag?.temperatureInterval;
            } else if (envAttr === envAttrCo2) {
                stateNameKey = spaceObj.tag?.carbonDioxideInterval;
            } else if (envAttr === envAttrHumidity) {
                stateNameKey = spaceObj.tag?.rHInterval;
            } else {
                stateNameKey = spaceObj.tag?.[envAttr + 'Interval'];
            }
            const stateName = ENUM_MAP_STATE[stateNameKey];
            if (stateName) {
                space.setAsyncState(stateName, true);
            }
        } else if (filterType === tabKey.SCHEDUING) {
            const stateName = ENUM_MAP_STATE[envAttr === envAttrTemp ? spaceObj.tag?.temperatureDemandStatus : spaceObj.tag?.carbonDioxideDemandStatus];

            if (stateName) {
                space.setAsyncState(stateName, true);
            }
        } else if (filterType === tabKey.ABNORMAL) {
            if (spaceObj?.tag?.abnormal) {
                space.setAsyncState('abnormal', true);
            }
        }
        // 品质视角才设置当前环境参数,否则不显示参数
        this._updateSpaceCurrentEnvAttr(space, filterType === tabKey.QUALITY ? envAttr : '');
    }

    updateSpaceStatus() {
        this.mainSpaceModelMap.forEach(model => {
            if (model.getState('hide') || model.getState('filterHide')) {
                return;
            }
            this._updateSpaceState(model);
        });
    }

    // ========== 性能优化：增量更新单个空间/设备，避免 SSE 触发全量 updateModelsShowAndStyle ==========
    updateOneSpaceShowAndState(spaceId, tag) {
        const space = this.mainSpaceModelMap.get(spaceId);

        if (!space) {
            return;
        }
        if (tag && space.spaceData) {
            space.spaceData.tag = tag;
        }
        // 先更新显隐状态（通道 B 元素可能在 bindAllEffects 前因缺少 tag/infoData 被隐藏，
        // 此时 tag/infoData 已就绪，重新计算后 filterHide 会从 true 变为正确值）
        this._updateSpaceModelShow(space);

        if (space.getState('hide') || space.getState('filterHide')) return;
        this._updateSpaceState(space);
    }

    updateOneEquipShowAndState(equipId, tag) {
        const group = this.equipGroupModelMap.get(equipId);
        if (!group) return;
        if (tag && group.data) {
            group.data.tag = tag;
        }
        this._updateEquipModelShow(group);
        // 不管设备当前是否隐藏都执行 _updateEquipState，将状态更新的开销分散到 SSE 推送时，
        // 避免切模式时 updateModelsShowAndStyle 中对全部可见设备做集中重算
        this._updateEquipState(group);
    }

    _updateEquipState(group) {
        const stateNames = ['offline', 'closed', 'opened', 'abnormalOrderFail', 'orderFail', 'abnormal'];
        group.clearStatesAsync(stateNames);
        const equipData = group.data;
        if (equipData?.tag) {
            const { runStatus, onlineStatus, abnormalStatuses } = equipData.tag;
            if (onlineStatus === 'OFFLINE') {
                group.setAsyncState('offline', true);
            } else if (runStatus === 'CLOSE') {
                group.setAsyncState('closed', true);
            } else if (runStatus === 'OPEN') {
                group.setAsyncState('opened', true);
            }
            if (abnormalStatuses?.length > 0) {
                if (abnormalStatuses.includes(ABNORMAL_EVENT) && abnormalStatuses.includes('ORDER_FAIL_ALARM')) {
                    group.setAsyncState('abnormalOrderFail', true);
                } else {
                    if (abnormalStatuses.includes('ORDER_FAIL_ALARM')) {
                        group.setAsyncState('orderFail', true);
                    }
                    if (abnormalStatuses.includes(ABNORMAL_EVENT)) {
                        group.setAsyncState('abnormal', true);
                    }
                }
            }
        }
    }

    // 更新当前品质tab
    _updateSpaceCurrentEnvAttr(space, currentEnv) {
        if (space?.spaceData) {
            const spaceQualityInfo = space.findChildByName(modelNameEnum.ACSpaceInfo);
            spaceQualityInfo.data.currentEnvAttr = currentEnv;
            spaceQualityInfo?.updateCurrentEnvAttr();
        }
    }

    _updateSpaceModelShow(model) {
        const curFloorId = this._curFloorId;
        const isFloorMap = this.mapMode === FLOOR_MODE;
        const { spaceData } = model;

        let hideVal = false,
            filterHide = false,
            // 统一逻辑处理，无论isFloorMap如何，变量不同
            curTab,
            envAttr,
            infoCode;
        if (isFloorMap) {
            curTab = this.currentTabFloor;
            envAttr = this.currentEnvAttrFloor;
            hideVal = spaceData.floorId !== curFloorId;
        } else {
            curTab = this.curFilterType;
            envAttr = this.curEnvAttr;
            // 楼栋模式下不需要hideVal，保持为false
            hideVal = false;
        }

        // 过滤，当勾选只显示异常时
        if (curTab === CONTROL_BAR_TAB_KEYS.ABNORMAL) {
            filterHide = !spaceData.tag?.abnormal && !spaceData.unableMonitor;
        }

        // 品质视角勾选了仅看iot空间,根据当前环境参数过滤有规则的空间
        if (!filterHide && curTab === CONTROL_BAR_TAB_KEYS.QUALITY && this.onlyShowIOTSpace) {
            infoCode = envAttr;
            if (spaceData.infoData && infoCode) {
                filterHide = !spaceData.infoData[infoCode]?.existsIotRule;
            } else {
                // 无iot数据也是无规则，与dashboard逻辑保持一致
                filterHide = true;
            }
        }
        // if (!filterHide && this.filterEquipmentClass) {
        //     filterHide = !this.filterEquipmentClass.relSpaceIds.includes(spaceData.id);
        // }
        const spaceLabelInfo = model.findChildByName(modelNameEnum.ACSpaceInfo);
        if (spaceLabelInfo) {
            if (!filterHide && isFloorMap && !hideVal) {
                this.addSpaceToDetector(spaceLabelInfo);
            } else {
                this.removeSpaceFromDetector(spaceLabelInfo);
            }
        }

        model?.setAsyncState('floorMode', isFloorMap);
        model?.setAsyncState('buildingMode', !isFloorMap);
        // 空间上小圆点model，对应第1个子
        if (!hideVal && !filterHide) {
            model?.setGeometryIndex(isFloorMap ? 1 : 0);
        }
        if (hideVal === model.getState('hide') && filterHide === model.getState('filterHide')) {
            return;
        }
        model?.setAsyncState('hide', hideVal);
        model?.setAsyncState('filterHide', filterHide);
    }

    _updateEquipModelShow(model) {
        if (!model) {
            return;
        }
        const curFloorId = this._curFloorId;
        const isFloorMap = this.mapMode === FLOOR_MODE;
        // 使用缓存引用替代 findChildByName，避免每次遍历 childModels
        const equipStateInfo = model._cachedEquipStateInfo;
        const airEquipIconInfo = model._cachedAirEquipIconInfo;
        let filterHide = this.filterEquipmentClass && this.filterEquipmentClass.classCode !== model.data?.classCode;
        if (!isFloorMap) {
            if (!filterHide && this.onlyShowControlledEquipment) {
                filterHide = model.data?.monitoringSurveillanceStatus !== MONITORING_CONTROL_TYPE.MEASURABLE_CONTROLLABLE;
            }
            if (this.curFilterType === CONTROL_BAR_TAB_KEYS.ABNORMAL) {
                filterHide = filterHide || !isEquipAbnormal(model.data?.tag);
            } else {
                filterHide = true;
            }
            if (equipStateInfo) {
                if (!filterHide) {
                    this.equipStateDetector.addElement(equipStateInfo);
                } else {
                    this.equipStateDetector.removeElement(equipStateInfo);
                }
            }
        } else {
            if (!filterHide) {
                filterHide = model.data?.floorId !== curFloorId;
            }
            if (!filterHide && this.onlyShowControlledEquipment) {
                filterHide = model.data?.monitoringSurveillanceStatus !== MONITORING_CONTROL_TYPE.MEASURABLE_CONTROLLABLE;
            }
            if (!filterHide && this.currentTabFloor === CONTROL_BAR_TAB_KEYS.ABNORMAL) {
                filterHide = !isEquipAbnormal(model.data?.tag);
            }
            if (airEquipIconInfo) {
                if (!filterHide) {
                    this.addEquipToDetector(airEquipIconInfo);
                } else {
                    this.removeEquipFromDetector(airEquipIconInfo);
                }
            }
        }

        if (isFloorMap !== model.getState('floorMode')) {
            model.setAsyncState('floorMode', isFloorMap);
            model.setAsyncState('buildingMode', !isFloorMap);
        }
        if (filterHide !== model.getState('filterHide')) {
            model.setAsyncState('filterHide', filterHide);
        }
    }
    updateOtherSpacesShow(needCollision = true) {
        const curFloorId = this._curFloorId;
        const isFloorMap = this.mapMode === FLOOR_MODE;
        this.otherSpaceModelMap.forEach(group => {
            const { data: spaceData } = group;
            // 当前对象在当前楼层中
            const isInCurFloor = spaceData.floorId === curFloorId;
            let filterHide = false;
            if (isFloorMap) {
                // 楼层视角下过滤不属于本楼层的
                filterHide = !isInCurFloor;
            } else {
                filterHide = true;
            }
            if (!filterHide) {
                const busyModel = this.mainSpaceModelMap.get(spaceData.id);

                if (busyModel && !busyModel?.getState('filterHide')) {
                    filterHide = true;
                }
            }

            group?.setAsyncState('filterHide', filterHide);
            group?.setAsyncState('floorMode', isFloorMap);
            const infoModel = group.findChildByName(modelNameEnum.ACSpaceInfo);
            if (infoModel) {
                if (!filterHide && isFloorMap) {
                    this.addSpaceToDetector(infoModel);
                } else {
                    this.removeSpaceFromDetector(infoModel);
                }
            }
        });
        if (needCollision) {
            this._collisionInvokeDebounce();
        }
    }

    /**
     * 更新图元显隐、样式；
     * needCollision：需要碰撞，默认true
     * */
    updateModelsShowAndStyle(needCollision = true) {
        this.equipStateDetector.clearElements();
        this.airEquipIconInfoDetector.clearElements();
        // this.spaceQualityInfoDetector.clearElements();
        this.spaceLabelDetector.clearElements();
        this.floorSpaceEquipDetector.clearElements();
        const curFloorId = this._curFloorId;
        const isFloorMap = this.mapMode === FLOOR_MODE;

        const spaceShowFloorLocalId = new Set();

        // 遍历空间
        this.mainSpaceModelMap.forEach(space => {
            this._updateSpaceModelShow(space);

            if (!space.getState('hide') && !space.getState('filterHide')) {
                this._updateSpaceState(space);
                if (!isFloorMap) {
                    spaceShowFloorLocalId.add(space?.spaceData?.floorLocalId);
                }
            }
        });

        this.equipGroupModelMap.forEach(model => {
            this._updateEquipModelShow(model);
            // _updateEquipState 已提前到 SSE 推送时分散执行，此处不再集中重算
        });

        this.pipeModels.forEach(model => {
            const { pipeData } = model;
            let hideVal = true;
            if (isFloorMap) {
                hideVal = curFloorId !== pipeData.floorId || !this.showPipes;
            }
            model?.setAsyncState('hide', hideVal);
        });

        if (!isFloorMap) {
            this._updateFloorShow(spaceShowFloorLocalId);
        }
        this.updateOtherSpacesShow(needCollision);
        if (needCollision) {
            this._collisionInvokeDebounce();
        }
    }

    // 关联模式元素显示
    showRelationElements(arr, inSameCtlGroupIds) {
        this.isRelationMode = true;
        // console.log('arr: ', arr);
        const idMap = {};
        arr.forEach(obj => {
            idMap[obj.id] = true;
        });
        this.equipStateDetector.clearElements();
        this.airEquipIconInfoDetector.clearElements();
        this.airEquipIconInfoRelDetector.clearElements();
        const isFloorMap = this.mapMode === FLOOR_MODE;
        this.clearAllLine();
        // console.log('idMap: ', idMap);
        const linkObjs = [];
        // 当前时异常tab
        const isAbnormalTab = (isFloorMap ? this.currentTabFloor : this.curFilterType) === CONTROL_BAR_TAB_KEYS.ABNORMAL;
        this.mainSpaceModelMap.forEach(space => {
            space.setAsyncState('isRelMode', true);

            const isRelObj = !!idMap[space.spaceData?.id];
            // 全楼时展示关联对象，楼层-展示当楼层的关联对象，以及当钱楼层过滤出来的其它非关联对象
            const isShow = (!isFloorMap && isRelObj) || (space.spaceData?.floorId === this._curFloorId && (isRelObj || !space.getState('filterHide')));
            space.setAsyncState('relModeShow', isShow);
            space.setAsyncState('isRelObject', isRelObj);

            const isAbnormal = isAbnormalTab && space.spaceData?.tag?.abnormal;
            const isUnAbnormal = isAbnormalTab && space.spaceData?.tag?.abnormal === false && !space.spaceData?.unableMonitor;
            space.setAsyncState('abnormal', isAbnormal);
            space.setAsyncState('unabnormal', isUnAbnormal);
            if (isShow) {
                if (isRelObj) {
                    linkObjs.push({
                        from: this.currentSelectedModel?.spaceData || this.currentSelectedModel?.data,
                        to: space.spaceData
                    });
                }
                if (isFloorMap) {
                    const spaceLabelInfo = space.findChildByName(modelNameEnum.ACSpaceInfo);

                    if (spaceLabelInfo) {
                        this.addSpaceToDetector(spaceLabelInfo);
                    }
                }
            }
        });

        const inSameCtlGroupIdMap = {};
        inSameCtlGroupIds?.forEach(id => {
            inSameCtlGroupIdMap[id] = true;
        });
        this.equipGroupModelMap.forEach(model => {
            model.setAsyncState('isRelMode', true);
            model.setAsyncState('relModeShow', false);
            model.setAsyncState('isRelObject', false);
            model.setAsyncState('inSameCtlGroup', false);

            const isRelObj = !!idMap[model.data?.id];
            const isInSameCtlGroup = !!inSameCtlGroupIdMap[model.data?.id];
            // 全楼时展示关联对象，楼层-展示当楼层的关联对象，以及当钱楼层过滤出来的其它非关联对象
            const isShow = (!isFloorMap && isRelObj) || (model.data?.floorId === this._curFloorId && (isRelObj || !model.getState('filterHide'))) || isInSameCtlGroup;
            if (isShow) {
                const equipStateInfo = model.findChildByName(modelNameEnum.EquipStateDotInfo);
                const airEquipIconInfo = model.findChildByName(modelNameEnum.AirEquipIconInfo);
                if (isFloorMap) {
                    if (airEquipIconInfo) {
                        if (isRelObj) {
                            this.airEquipIconInfoRelDetector.addElement(airEquipIconInfo);
                        } else {
                            this.addEquipToDetector(airEquipIconInfo);
                        }
                    }
                } else {
                    if (equipStateInfo) {
                        this.equipStateDetector.addElement(equipStateInfo);
                    }
                }
                model.setAsyncState('relModeShow', isShow);
                model.setAsyncState('isRelObject', isRelObj);
                model.setAsyncState('inSameCtlGroup', isInSameCtlGroup);

                if (isRelObj) {
                    linkObjs.push({
                        from: this.currentSelectedModel?.spaceData || this.currentSelectedModel?.data,
                        to: model.data
                    });
                }
            }
        });
        this.currentSelectedModel?.setAsyncState('relModeShow', true);
        this.currentSelectedModel?.setAsyncState('isRelObject', true);
        // this.createLinkLines
        linkObjs.forEach(obj => {
            this._createAdvanceLinkLine(obj.from, obj.to);
        });
        this._collisionInvokeDebounce();
    }
    // 退出关联模式
    exitRelationMode() {
        this.isRelationMode = false;
        const isFloorMap = this.mapMode === FLOOR_MODE;
        this.equipStateDetector.clearElements();
        this.airEquipIconInfoDetector.clearElements();
        this.airEquipIconInfoRelDetector.clearElements();

        const isAbnormalTab = (isFloorMap ? this.currentTabFloor : this.curFilterType) === CONTROL_BAR_TAB_KEYS.ABNORMAL;
        this.mainSpaceModelMap.forEach(space => {
            if (!space.getState('isRelMode')) {
                return;
            }
            space.setAsyncState('isRelMode', false);
            space.setAsyncState('relModeShow', false);
            space.setAsyncState('isRelObject', false);
            space.setAsyncState('abnormal', isAbnormalTab && space.spaceData?.tag?.abnormal);
            space.setAsyncState('unabnormal', false);
        });
        this.equipGroupModelMap.forEach(model => {
            if (!model.getState('isRelMode')) {
                return;
            }
            model.setAsyncState('isRelMode', false);
            model.setAsyncState('relModeShow', false);
            model.setAsyncState('isRelObject', false);
            model.setAsyncState('inSameCtlGroup', false);
            const equipStateInfo = model.findChildByName(modelNameEnum.EquipStateDotInfo);
            const airEquipIconInfo = model.findChildByName(modelNameEnum.AirEquipIconInfo);
            if (!model.getState('hide') && !model.getState('filterHide')) {
                if (isFloorMap) {
                    if (airEquipIconInfo) {
                        this.addEquipToDetector(airEquipIconInfo);
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

    createSpaces(list) {
        // const spaceModels = [];
        const isExceedLimit = list?.length > this.spaceMaxCount;
        this.isExceedLimit = isExceedLimit;
        (list || []).forEach(item => {
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
                // const abnormalIcon = createSpaceAbnormalIcon(item);
                space.setGeometryIndex(0);
                this.rootNodeModel.addChild(space);
                space.addChild(spaceLabel);
                // space.addChild(spaceQualityInfo);
                // this.spaceLabelDetector.addElement(spaceLabel);
                Object.keys(spaceLabel.defineStyles).forEach(key => {
                    spaceLabel.defineStyles[key].iconShow = false;
                });

                // const val = this.mapMode === FLOOR_MODE && item.floorId !== this._curFloorId;
                // space.setState('hide', val);
                this._updateSpaceModelShow(space);
                if (!space.getState('hide') && !space.getState('filterHide')) {
                    this._updateSpaceState(space);
                }

                this.mainSpaceModelMap.set(item.id, space);
            }
        });
    }

    // 创建其它空间
    createOtherSpaces(spaces) {
        this.otherSpaceModelMap.forEach((v, k) => {
            const infoModel = v.findChildByName(modelNameEnum.ACSpaceInfo);
            if (infoModel) {
                this.removeSpaceFromDetector(infoModel);
            }
            this.rootNodeModel.removeChild(v);
        });
        this.otherSpaceModelMap.clear();
        spaces?.forEach(item => {
            if (this.otherSpaceModelMap.has(item.id)) {
                return;
            }
            const group = new Group();
            // 标识model是其它空间
            group.isOther = true;
            group.data = item;
            // #空间标签图元
            const floorHeight = M2FOOT * Number(item.floorElevation ?? 0);

            const spaceLabel = createSpacePositionInfoModel(item, floorHeight);
            spaceLabel.isOther = true;
            group.addChild(spaceLabel);
            this.rootNodeModel.addChild(group);
            this.addSpaceToDetector(spaceLabel);

            // Object.keys(spaceLabel.defineStyles).forEach(key => {
            //     spaceLabel.defineStyles[key].iconShow = false;
            // });
            const val = this.mapMode === FLOOR_MODE && item.floorId !== this._curFloorId;
            group.setState('hide', val);

            this.otherSpaceModelMap.set(item.id, group);
        });
    }

    hasCachedPipes(floorId) {
        return this.pipeModels.some(obj => obj.floorId === floorId);
    }
    async createRevitePipes(pipes) {
        // console.log('pipes: ', pipes);
        // 过滤当前楼层的
        const pipeDataArr = pipes?.filter(obj => obj.floorId === this._curFloorId);
        if (!pipeDataArr?.length) {
            return;
        }
        this.threadPool.removeAllTask();
        // 先按楼层分组，再按classCode合并管道
        const meshInfos = await this.graphResourceManager.loadPipeMeshInfo(pipeDataArr);
        // console.log('meshInfos: ', meshInfos.length);
        const floorClassMeshs = {};
        let _meshRef = null;

        meshInfos.forEach(meshInfo => {
            const { equipData, mesh, meshRef } = meshInfo;
            if (!_meshRef) {
                _meshRef = {
                    MeshUrl: meshRef?.MeshUrl,
                    Matrix: new THREE.Matrix4()
                };
            }

            if (equipData && mesh) {
                const { classCode, id, floorId } = equipData;
                if (classCode && id && floorId) {
                    if (!floorClassMeshs[floorId]) {
                        floorClassMeshs[floorId] = {};
                    }
                    const floorClass = floorClassMeshs[floorId];
                    if (!floorClass[classCode]) {
                        floorClass[classCode] = [];
                    }
                    floorClass[classCode].push(meshInfo);
                }
            }
        });

        const mergePromises = [];
        Object.keys(floorClassMeshs).forEach(floorId => {
            const floorClass = floorClassMeshs[floorId];
            // console.log('floorId: ', floorId);
            if (floorClass) {
                Object.keys(floorClass).forEach(classCode => {
                    const classMeshInfos = floorClass[classCode];
                    const geoArr = [],
                        matrixArr = [];
                    const bufferPointers = new Set();

                    classMeshInfos.forEach(info => {
                        const { mesh } = info;
                        if (mesh?.geometry) {
                            geoArr.push(mesh.geometry);
                            collectGeometryBuffer(mesh.geometry, bufferPointers);
                        }
                        matrixArr.push(mesh.matrix.clone());
                    });
                    const cacheKey = `${floorId}-${classCode}`;
                    const pipeModel = new RevitPipe({ classCode, floorId, localName: '', color: RevitModelColorFromClassCode(classCode) });
                    pipeModel.defineStyles.normal.materialType = THREE.MeshStandardMaterial.name;
                    // allAsyncTaskCount++;
                    const p = this.threadPool
                        .dispatchThread({
                            userData: {
                                data: { geoArr, matrixArr },
                                cacheKey
                            },
                            // workerTransfer: bufferPointers,
                            taskIdKey: 'cacheKey'
                        })
                        .then(result => {
                            if (!result) return;
                            pipeModel.workerData = result;
                            pipeModel.useAdvanceMat = true;
                            pipeModel.meshRef = _meshRef;
                            pipeModel.matOption = {
                                type: 'device',
                                roughness: 0.2,
                                metalness: 0.1
                            };
                            this.pipeModels.push(pipeModel);
                            this.rootNodeModel.addChild(pipeModel);
                        })
                        .catch(e => {
                            console.log('bufferPointers: ', geoArr, bufferPointers, [...bufferPointers]);
                            pipeModel.workerData = {};
                            console.log('e: ', e);
                        })
                        .finally(() => {});
                    mergePromises.push(p);
                });
            }
        });
        return Promise.allSettled(mergePromises);
    }

    createEquip2DModels(equips) {
        equips?.forEach(obj => {
            const equipGroup = this.equipGroupModelMap.get(obj.id);
            if (obj?.bimLocation && equipGroup) {
                // 防重：已创建过2D图元的跳过，避免双通道并行时重复添加子节点
                if (equipGroup._cachedAirEquipIconInfo) {
                    return;
                }
                try {
                    const equipStateInfo = createEqupStateInfo(obj);
                    equipGroup.addChild(equipStateInfo);
                    equipGroup._cachedEquipStateInfo = equipStateInfo;

                    const airEquipIconInfo = createEqupIconInfo(obj);
                    equipGroup.addChild(airEquipIconInfo);
                    equipGroup._cachedAirEquipIconInfo = airEquipIconInfo;

                    this._updateEquipModelShow(equipGroup);
                    if (!equipGroup.getState('hide') && !equipGroup.getState('filterHide')) {
                        this._updateEquipState(equipGroup);
                    }
                } catch (e) {
                    console.log('e: ', e);
                }
            }
        });
    }

    // 仅创建 Group 壳（不加载3D mesh），供通道 B 楼层加载使用
    ensureEquipGroups(equips) {
        equips?.forEach(obj => {
            if (!this.equipGroupModelMap.has(obj.id)) {
                const equipGroup = new Group();
                equipGroup.data = obj;
                this.rootNodeModel.addChild(equipGroup);
                this.equipGroupModelMap.set(obj.id, equipGroup);
            }
        });
    }

    async _loadAndCreateEquips(equips) {
        this.ensureEquipGroups(equips);
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

            // 标记有设备模型
            equipGroup.hasEquipMesh = true;
            equipGroup.addChild(equip);
            equip.setAsyncState('floorMode', !!this._curFloorId);
            // console.log('equipGroup: ', equipGroup);
        });
    }
    async createElements(data) {
        const { spaces, equips: _equips, pipes, floors } = data;
        this.resetFloor();
        // console.log('spaces: ', data, floors);

        this.graphResourceManager.cancelAll();
        this.removeDyncElements();
        // this.createSpaces(spaces);
        this.spaceCreateBatchHelper.setTargetDatas(spaces);
        this.spaceCreateBatchHelper.run();
        floors?.forEach(floor => {
            this.recordFloorInfo({ floorName: floor.localId, localId: floor.localId, id: floor.id });
        });

        const promiseGenArr = [];
        // if (pipes?.length > 0) {
        //     promiseGenArr.push(this.createRevitePipes(pipes));
        // }
        const equips = _equips.filter(e => e.bimLocation && !NONE_RENDER_IN_3D.includes(e.classCode));
        if (equips?.length > 0) {
            const equipsLoad = this._loadAndCreateEquips(equips);
            promiseGenArr.push(equipsLoad);
            this.equipCreateBatchHelper.setTargetDatas(equips);
            this.equipCreateBatchHelper.run();
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
    _updateBuildingShow(needUpdateModelShow = true) {
        // 全楼外壳显隐
        this.meshGroup.visible = this.mapMode === BUILDING_MODE;
        // 全楼楼板、楼层标签显隐
        Object.values(this.floorModalMap).forEach(floorInfo => {
            const hideVal = this.mapMode !== BUILDING_MODE;
            floorInfo.floorMVCModal?.setState('hide', hideVal);
        });
        if (needUpdateModelShow) {
            this.updateModelsShowAndStyle();
        }
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

    // 切换模式视图展示
    async switchModeView(modeVal, floorId) {
        // console.trace('this._curFloorId: ', modeVal, this._curFloorId, floorId);
        if (modeVal === FLOOR_MODE && this._curFloorId === floorId) {
            return;
        }
        if (modeVal === BUILDING_MODE && modeVal === this.mapMode) {
            return;
        }
        // console.trace('switchModeView--modeVal: ', modeVal);
        this._curFloorId = floorId;
        this.mapMode = modeVal;
        // 切换过渡中 隐藏页面元素
        // this.rootNodeModel.setState('hidden', true);
        if (this.css3dRender.domElement.style) {
            this.css3dRender.domElement.style.display = 'none';
        }

        this._updateBuildingShow();
        if (modeVal === FLOOR_MODE) {
            // setTimeout(() => this._loadAndShowCF(), 20);
            await this._loadAndShowCF();
            await this._clipBox();
        } else {
            this.curClipBox = this.buildingBox;
        }

        // this.rootNodeModel.setState('hidden', false);
        if (this.css3dRender.domElement.style) {
            this.css3dRender.domElement.style.display = 'block';
        }
        this._updateFloorObjectsShow();
        this._switchCamera();
        this._switchLights();

        this._collisionInvokeDebounce();
    }

    invokeScaleAndCollision() {
        // console.log('invokeScaleAndCollision: ', this.spaceLabelDetector.collisionSet?.size, this.spaceLabelDetector.collisionSet);

        // this.spaceNameCollisionDetector.collision();
        this.equipStateDetector.collision(false);
        if (this.useFloorSpaceCollision) {
            // "空间和设备同时碰撞"开启: 设备与空间统一由合并碰撞器处理(含同类碰撞)
            this.floorSpaceEquipDetector.collision(this.collisionPriority);

            if (this.isRelationMode) {
                this.airEquipIconInfoRelDetector.collision(false);
            }
        } else {
            this.airEquipIconInfoDetector.collision(false);
            if (this.isRelationMode) {
                this.airEquipIconInfoRelDetector.collision(false);
            }
            // this.spaceQualityInfoDetector.collision();
            this.spaceLabelDetector.collision();
        }
    }

    // ! 是否启用"空间和设备同时碰撞"合并碰撞器: 配置开关(useFloorCollisionSetting) + 设置项collision开启 + 非关联模式
    get useFloorSpaceCollision() {
        return useFloorCollisionSetting && this.mapSettingsRef?.value?.collision === 'checked';
    }
    // 显示优先级: 'equip'设备优先 / 'space'空间优先
    get collisionPriority() {
        return this.mapSettingsRef?.value?.priority || 'equip';
    }

    // 空间标签图元 注册到碰撞器(根据合并碰撞开关路由)
    addSpaceToDetector(model) {
        if (this.useFloorSpaceCollision) {
            this.floorSpaceEquipDetector.addSpaceElement(model);
        } else {
            this.spaceLabelDetector.addElement(model);
        }
    }
    removeSpaceFromDetector(model) {
        if (this.useFloorSpaceCollision) {
            this.floorSpaceEquipDetector.removeSpaceElement(model);
        } else {
            this.spaceLabelDetector.removeElement(model);
        }
    }
    // 设备图元 注册到碰撞器(根据合并碰撞开关路由)
    addEquipToDetector(model) {
        if (this.useFloorSpaceCollision) {
            this.floorSpaceEquipDetector.addEquipElement(model);
        } else {
            this.airEquipIconInfoDetector.addElement(model);
        }
    }
    removeEquipFromDetector(model) {
        if (this.useFloorSpaceCollision) {
            this.floorSpaceEquipDetector.removeEquipElement(model);
        } else {
            this.airEquipIconInfoDetector.removeElement(model);
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
        this._collisionInvokeDebounce();
    }

    pauseRender(pause) {
        this.pauseRenderLoop = pause;
    }

    clearAllLine() {
        this.linkLines?.forEach(model => {
            this.rootNodeModel.removeChild(model);
        });

        this.linkLines = [];
    }

    removeDyncElements() {
        this.equipStateDetector.clearElements();
        this.airEquipIconInfoDetector.clearElements();
        this.spaceLabelDetector.clearElements();
        this.floorSpaceEquipDetector.clearElements();
        this.mainSpaceModelMap.forEach((v, k) => {
            this.rootNodeModel.removeChild(v);
        });
        this.mainSpaceModelMap.clear();
        this.otherSpaceModelMap.forEach((v, k) => {
            this.rootNodeModel.removeChild(v);
        });
        this.otherSpaceModelMap.clear();

        this.equipGroupModelMap.forEach(v => {
            if (v) {
                v._cachedEquipStateInfo = null;
                v._cachedAirEquipIconInfo = null;
                this.rootNodeModel.removeChild(v);
            }
        });
        this.pipeModels.forEach(m => {
            this.rootNodeModel.removeChild(m);
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
        this.pipeModels = [];
    }

    Destroy() {
        this.mapController.dispose();
        this.removeAllObjects();
        this.tracker.dispose();
        this.graphResourceManager.cancelAll();
        this.graphResourceManager.dispose();
        this.buildingSceneLoader.dispose();
        this.floorMapSceneLoader.dispose();
        this.spaceCreateBatchHelper?.dispose();
        this.renderer.setAnimationLoop(null);
        this.threadPool.destroy();
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
        // this.renderer.info.reset();
        // const {
        //     programs,
        //     memory: { geometries, textures }
        // } = this.renderer.info;
        // console.table([{ geometries: geometries, textures: textures, programs: programs }]);
    }
}
