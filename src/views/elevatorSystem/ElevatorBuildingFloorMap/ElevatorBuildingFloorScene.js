// @ts-ignore
import i18n from '@/localization';
import { WebGLScene } from '@yushu/core3d';
import { SceneLoader, EffectLoader } from '@yushu/effecttool';
import _, { debounce } from 'lodash';
import CameraControls from 'camera-controls';
import * as THREE from '@yushu/three-base';
import { parseMainBuildingBoardInfo, isFloorFrame, calcFloorDirectionalLight, restoreControls, convertP3ToP2, convertV3ToP2 } from '@/apm-3d/utils/buildingTools';
import RootNode from '@/views/GraphMVC/graphScene/RootNode/RootNode';
import Controller from '@/views/GraphMVC/core/Controller';
import { INTERFACE_PREFIX_RWD } from '@/config';
import { GraphResourceManager } from '@/views/GraphMVC/utils/GraphResourceManager';
import { isEdge } from '@/utils/envUtils';
import EquipStateDetector from './graph/CollisionDetector/EquipStateDetector';
import AirEquipIconInfoDetector from './graph/CollisionDetector/AirEquipIconInfoDetector';

import Group from '@/views/GraphMVC/graphScene/Group/Group';
import Floor from '@/views/GraphMVC/graphScene/Floor/Floor';
import FloorTagInfo from '@/views/GraphMVC/graphScene/FloorTagInfo/FloorTagInfo';
import { modelNameEnum, RenderOrder, StatePriority } from '@/views/GraphMVC/graphScene/GraphSceneDefine';
import { getFloorInfoByFloorId } from '@/utils/buildingUtils';
import { OBJ_TYPE } from '@/utils/globalVariables';

import VisibilityContext from '@/views/GraphMVC/graphScene/Context/VisibilityContext';
// import { MOVEDIRECT_VAL_MAP_STATE } from '@/views/elevatorSystem/constants';
import {
    isStraightLadder,
    getEquipStatusStates,
    isDoorGroup,
    isEntranceAndExit,
    createSpaceModel,
    createOtherSpaceModel,
    createShaftCombined,
    createStraightLadderPopover,
    createStraightLadder,
    createEqupStateInfo,
    createEqupIconInfo,
    createSpaceLabelInfoModel,
    createEntranceAndExitsPrDoorGroupsIconInfo,
    getEquipStylesDefine
} from '@/views/elevatorSystem/utils';
import Equip from '@/views/GraphMVC/graphScene/Equip/Equip';

const { M2FOOT, MM2FOOT, ResourceTracker } = THREE.baseUtils;

export const isFloor = group => group.name.trim().toLowerCase().indexOf('mainbuilding_floor') > -1 || group.name.trim().toLowerCase().endsWith('mainbuilding_board_1');

const WIREFRAME_SCENE_NAME = '07_building_relation';
const D3_SCENE_NAME = '05_building_classic';

const BUILDING_MODE = 1;
const FLOOR_MODE = 2;

const get2DPos = (scene, renderContext, modelKey, isFloorMap) => {
    const object3D = scene.getObjectByProperty('modelKey', modelKey);
    // console.log('object3D: ', object3D, modelKey);
    if (object3D) {
        if (isFloorMap) {
            const posV3 = new THREE.Vector3();
            object3D.getWorldPosition(posV3);
            const pos = convertV3ToP2(renderContext, posV3);
            // console.log('pos: ', pos);
            return pos;
        }
        const box = new THREE.Box3();
        box.setFromObject(object3D);
        const centerP = new THREE.Vector3();
        const sizeV3 = new THREE.Vector3();
        box.getCenter(centerP);
        box.getSize(sizeV3);
        centerP.y += sizeV3.y / 2;
        // console.log('centerP: ', centerP);

        const pos = convertV3ToP2(renderContext, centerP);
        return pos;
    }
};

export default class ElevatorBuildingFloorScene extends WebGLScene {
    constructor({ projectId = '', groupCode, env = 'production', loadings, bgColor }) {
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
        this.otherSpaceModelMap = new Map();
        // 竖井图元model映射
        this.shaftModelMap = new Map();
        // 直梯图元model映射
        this.straightLadderModelMap = new Map();
        // 电梯所在空间模型映射
        this.straightLadderInSpaceModelMap = new Map();
        // 直梯iconInfo图元model映射
        this.straightLadderIconInfoMap = new Map();
        this.equipGroupModelMap = new Map();

        // 出入口or门组
        this.eeOrDoorGroupModelMap = new Map();
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
        // TODO 碰撞器初始化
        // #空间标签图元碰撞器
        this.equipStateDetector = new EquipStateDetector(this.renderContext);
        // TAG 设备图元碰撞器
        this.airEquipIconInfoDetector = new AirEquipIconInfoDetector(this.renderContext);
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
        this.unhoverShaft();

        console.log('hover------newModel: ', newModel);
        // if (newModel && newModel.name === modelNameEnum.MultipleSpace) {
        //     this.hoverSpaceModel(newModel);
        //     this.css3dRender.domElement.style.cursor = 'pointer';
        // } else
        if (newModel && newModel.name === modelNameEnum.Group && newModel.data?.objType === OBJ_TYPE.EQUIPMENT) {
            this.hoverEquipModel(newModel);
            this.css3dRender.domElement.style.cursor = 'pointer';
        } else if (newModel && newModel.name === modelNameEnum.ESEquipIconInfo) {
            if (isDoorGroup(newModel.data?.classCode)) {
                return;
            }
            this.hoverEquipModel(newModel.parent === this.rootNodeModel ? newModel : newModel.parent);
            this.css3dRender.domElement.style.cursor = 'pointer';
        } else if (newModel && newModel.name === modelNameEnum.Equip) {
            this.hoverEquipModel(newModel.parent);
            this.css3dRender.domElement.style.cursor = 'pointer';
        } else if (newModel && newModel.name === modelNameEnum.StraightLadder) {
            this.hoverModel(newModel);
            this.hoverShaft(newModel?.data?.relShaft?.id);

            this.css3dRender.domElement.style.cursor = 'pointer';
        } else if (newModel && newModel.name === modelNameEnum.FloorTagInfo) {
            this.css3dRender.domElement.style.cursor = 'pointer';
            const model = newModel.parent;
            this.highlightFloor(model);
        } else if (newModel && newModel.name === modelNameEnum.Floor) {
            this.highlightFloor(newModel);
            this.css3dRender.domElement.style.cursor = 'pointer';
        } else if (newModel && (newModel.name === modelNameEnum.Space || newModel.name === modelNameEnum.MultipleSpace)) {
            if (this._curFloorId) {
                this.hoverModel(newModel);
            }
            this.css3dRender.domElement.style.cursor = 'default';
        } else if (newModel && newModel.name === modelNameEnum.Group) {
            if (isEntranceAndExit(newModel.data?.roomFuncType)) {
                this.hoverModel(newModel);
                this.css3dRender.domElement.style.cursor = 'default';
            }
        } else {
            this.css3dRender.domElement.style.cursor = 'default';
        }
    }

    // controller 调用
    viewOnLongHoverTargetChanged({ newModel, event, point }) {
        if (newModel && newModel.getState('selected')) {
            return;
        }

        // if (newModel && newModel.name === modelNameEnum.MultipleSpace) {
        //     this.hoverCard(newModel);
        //     this.css3dRender.domElement.style.cursor = 'pointer';
        // } else
        if (newModel && newModel.name === modelNameEnum.StraightLadder) {
            console.log('newModel============: ', event, point);
            this.hoverCard(newModel, event);
            this.css3dRender.domElement.style.cursor = 'pointer';
        } else if (newModel && newModel.name === modelNameEnum.ESEquipIconInfo) {
            if (isDoorGroup(newModel.data?.classCode)) {
                return;
            }
            this.hoverCard(newModel);

            this.css3dRender.domElement.style.cursor = 'pointer';
        } else if (newModel && newModel.name === modelNameEnum.Equip) {
            this.hoverCard(newModel);
        } else if (newModel && newModel.name === modelNameEnum.Group && newModel.data) {
            if (isEntranceAndExit(newModel.data?.roomFuncType)) {
                return;
            }

            this.hoverCard(newModel);

            this.css3dRender.domElement.style.cursor = 'pointer';
        }
    }

    // controller 调用
    viewOnClickTarget({ model }) {
        if (model && model.getState('selected')) {
            return;
        }
        this.unselectModel();

        // if (model.name === modelNameEnum.MultipleSpace) {
        //     this.selectSpaceModel(model);
        // } else
        if (model && model.name === modelNameEnum.Group && model.data?.objType === OBJ_TYPE.EQUIPMENT) {
            this.selectEquipModel(model);
        } else if (model && (model.name === modelNameEnum.Equip || model.name === modelNameEnum.EquipStateInfo)) {
            this.selectEquipModel(model.parent);
        } else if (model && model.name === modelNameEnum.StraightLadder) {
            this.selectEquipModel(model);
        } else if (model && model.name === modelNameEnum.ESEquipIconInfo) {
            if (isDoorGroup(model.data?.classCode)) {
                return;
            }
            this.selectEquipModel(model);
        } else if (model && (model.name === modelNameEnum.FloorTagInfo || model.name === modelNameEnum.Floor)) {
            const d = model.parent.equipData || model.equipData;
            console.log('d: ', d, model);
            if (d && d.id) {
                this.dispatchEvent({
                    type: 'clickFloor',
                    data: { ...d, floorId: d.id }
                });
            }
        }
    }

    hoverModel(model) {
        model?.setAsyncState('hover', true);
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
        const d = model?.data || model.spaceData || model.equipData;
        if (d) {
            if (isStraightLadder(d.classCode)) {
                const isFloorMap = this.mapMode === FLOOR_MODE;
                const modelKey = (isFloorMap ? 'es_equip_iconinfo_' : '') + d.id;
                // const pos = isFloorMap ? getSLIconInfoDomPos(model?.data.id) : get2DPos(this.Scene, this.renderContext, model?.data.id);
                const pos = get2DPos(this.Scene, this.renderContext, modelKey, isFloorMap);
                // console.log('isFloorMap: ', isFloorMap, pos);
                if (pos) {
                    // console.log('pos---====: ', pos);
                    this.dispatchEvent({
                        type: 'onHoverCard',
                        data: { pos, instance: d }
                    });
                }
                return;
            } else {
                const pos = convertP3ToP2(this.renderContext, d?.bimLocation);
                this.dispatchEvent({
                    type: 'onHoverCard',
                    data: { pos, instance: d }
                });
            }
        }
    }

    unhoverModel() {
        if (this.currentHoverModel) {
            this.currentHoverModel.setAsyncState('hover', false);
            this.currentHoverModel = null;
            this.dispatchEvent({
                type: 'onUnHover',
                data: {}
            });
        }
        this.unhoverShaft();
    }
    unhoverShaft() {
        if (this.currentHoverShaft) {
            this.currentHoverShaft.setAsyncState('hover', false);
            this.currentHoverShaft = null;
        }
    }
    hoverShaft(straightLadderId) {
        const shaftModel = this.shaftModelMap.get(straightLadderId);
        this.currentHoverShaft = shaftModel;
        if (this.currentHoverShaft) {
            this.currentHoverShaft.setAsyncState('hover', true);
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
        const isFloorMap = this.mapMode === FLOOR_MODE;
        let m = isFloorMap ? this.straightLadderIconInfoMap.get(obj.id) : this.straightLadderModelMap.get(obj.id);
        if (!m) {
            m = this.equipGroupModelMap.get(obj.id);
        }
        if (m) {
            this.selectEquipModel(m);
        }
    }
    hoverMapObj(obj) {
        this.unHighlightFloor();
        this.rootNodeModel.unhoverSpace();
        this.unhoverModel();
        const isFloorMap = this.mapMode === FLOOR_MODE;
        let m = isFloorMap ? this.straightLadderIconInfoMap.get(obj.id) : this.straightLadderModelMap.get(obj.id);
        // console.log('hoverMapObj---m: ', m);
        if (!m) {
            m = this.equipGroupModelMap.get(obj.id);
        }

        if (m) {
            this.hoverEquipModel(m);
            this.hoverShaft(obj.relShaft?.id);
            this.hoverCard(m);
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
                        c.renderOrder = 10;
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
                    group.renderOrder = 1;
                }
            });
            const boudingBox = new THREE.Box3();
            boudingBox.expandByObject(this.meshGroup);
            // 不显示楼层
            // this.createFloorMeshs(floorGroups);
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
                // floorModal.userinteractionEnable = false; // 不参与射线求交
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
        // console.log('recordFloorInfo====.floorModalMap: ', this.floorModalMap);
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
            if (newInfo.floorMVCModal) {
                newInfo.floorMVCModal.addChild(floorTag);
                newInfo.floorMVCModal.setState('inUse', true);
                // newInfo.floorMVCModal.setState('hover', true);
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

    // 更新设备状态
    updateEquipStatus() {
        console.log('updateEquipStatus: ');
        //moveDirect alarmstatus  isOverLoad lockStatus stopFloor
        const stateNames = ['goUp', 'goDown', 'static', 'locked', 'abnormal'];

        this.equipGroupModelMap.forEach(group => {
            if (group.getState('hide')) {
                return;
            }
            group.clearStatesAsync(stateNames);
            const equipData = group.data;
            if (equipData) {
                const states = getEquipStatusStates(equipData);
                states?.forEach(obj => {
                    group.setAsyncState(obj.name, true);
                });
            }
        });
        const slStateNames = ['goUp', 'goDown', 'locked', 'static', 'abnormal', 'overload', 'abnormalAndOverload'];
        const shaftStates = ['locked'];
        this.straightLadderModelMap.forEach(m => {
            m.clearStatesAsync(slStateNames);
            const equipData = m.data;
            if (equipData) {
                const states = getEquipStatusStates(equipData);
                const slPopover = m.findChildByName(modelNameEnum.StraightLadderPopover);
                // console.log('status: ', states, equipData.id, equipData);
                states?.forEach(obj => {
                    if (obj.name === 'stopFloor') {
                        const stopFloorSpace = equipData.relShaft?.shaftSpaceList?.find(space => space.floorLocalName === obj.value);
                        // console.log('stopFloorSpace: ', stopFloorSpace);
                        if (stopFloorSpace) {
                            const floorE = stopFloorSpace.floorElevation;
                            m.requestUpdateY({ value: M2FOOT * floorE });
                        } else {
                            m.requestUpdateY({ needAnimate: false });
                        }

                        slPopover?.setCurFloor({ localName: obj.value || '' });
                    } else {
                        m.setAsyncState(obj.name, true);
                    }
                });

                const shaftModel = this.shaftModelMap.get(equipData.relShaft?.id);
                // 竖井对应的直梯如果锁梯，竖井设置locked状态
                if (shaftModel) {
                    shaftModel.clearStatesAsync(shaftStates);
                    if (m.getState('locked')) {
                        shaftModel.setAsyncState('locked', true);
                    }
                }
            }
        });
        this.straightLadderIconInfoMap.forEach(m => {
            m.clearStatesAsync(slStateNames);
            const equipData = m.data;
            if (equipData) {
                const states = getEquipStatusStates(equipData);
                states?.forEach(obj => {
                    m.setAsyncState(obj.name, true);
                });
            }
        });
    }

    updateSpaceEquipData(data) {
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
    }

    updateShowElements() {
        this.equipStateDetector.clearElements();
        this.airEquipIconInfoDetector.clearElements();
        const curFloorId = this._curFloorId;
        const isFloorMap = this.mapMode === FLOOR_MODE;

        const spaceShowFloorLocalId = new Set();

        this.shaftModelMap.forEach(m => {
            m?.setAsyncState('hide', isFloorMap);
        });
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
            // 空间上小圆点model，对应第1个子
            if (!hideVal && !filterHide) {
                space.userinteractionEnable = isFloorMap;
                space?.setGeometryIndex(isFloorMap ? 1 : 0);
            }
        });
        this.equipGroupModelMap.forEach(model => {
            //  找到当前设备的设备状态圆点图元、空间设备图标图元
            const equipStateInfo = model.findChildByName(modelNameEnum.EquipStateDotInfo);
            const airEquipIconInfo = model.findChildByName(modelNameEnum.ESEquipIconInfo);
            let filterHide = false;

            if (!isFloorMap) {
                // 全楼视角：未过滤隐藏，则添加设备图元到设备状态图元碰撞器
                if (!filterHide && equipStateInfo) {
                    this.equipStateDetector.addElement(equipStateInfo);
                }
            } else {
                if (!filterHide) {
                    filterHide = model.data?.floorId !== curFloorId;
                }

                // 楼层视角：未过滤隐藏，则添加设备图元到空间设备信息碰撞器
                if (!filterHide && airEquipIconInfo) {
                    this.airEquipIconInfoDetector.addElement(airEquipIconInfo);
                }
                // console.log('airEquipIconInfo: ', airEquipIconInfo, filterHide, model.data);
            }

            model?.setAsyncState('floorMode', isFloorMap);
            model?.setAsyncState('buildingMode', !isFloorMap);
            model?.setAsyncState('filterHide', filterHide);
        });

        this.straightLadderModelMap.forEach(m => {
            m?.setAsyncState('hide', isFloorMap);
        });

        const getInFloorSpaceObj = (slData, fId) => {
            return slData.relShaft?.shaftSpaceList?.find(obj => obj.floorId === fId);
        };

        this.straightLadderIconInfoMap?.forEach(m => {
            let filterHide = false;

            if (isFloorMap) {
                const spaceObj = getInFloorSpaceObj(m.data, curFloorId);
                // console.log('spaceObj: ', spaceObj);
                filterHide = !spaceObj;
                if (spaceObj) {
                    const { floorElevation, height } = spaceObj;
                    const floorHeight = M2FOOT * Number(floorElevation || 0);
                    const _height = M2FOOT * Number(height || 0);
                    const y = floorHeight + _height + 0.1;
                    m.updatePositionY(y);
                }
            }
            m?.setAsyncState('floorMode', isFloorMap);
            m?.setAsyncState('buildingMode', !isFloorMap);
            m?.setAsyncState('filterHide', filterHide);
            if (!filterHide) {
                this.airEquipIconInfoDetector.addElement(m);
            }
            // model?.setAsyncState('filterHide', filterHide);
        });
        // this.straightLadderInSpaceModelMap?.forEach(m => {
        //     let filterHide = true;

        //     if (isFloorMap) {
        //         const { slObj } = m;
        //         const inFloorSpaceObj = getInFloorSpaceObj(slObj, curFloorId);
        //         if (inFloorSpaceObj) {
        //             // console.log('curFloorId: ', curFloorId, inFloorSpaceObj, slObj);
        //             filterHide = false;
        //             const { floorElevation } = inFloorSpaceObj;
        //             const floorHeight = M2FOOT * Number(floorElevation || 0);
        //             const y = floorHeight + 0.1;
        //             m.updatePositionY(y);
        //         }
        //     }
        //     m?.setAsyncState('floorMode', isFloorMap);
        //     m?.setAsyncState('filterHide', filterHide);

        //     // model?.setAsyncState('filterHide', filterHide);
        // });

        this.eeOrDoorGroupModelMap.forEach(m => {
            let filterHide = false;
            const data = m.spaceData || m.data;
            if (isFloorMap) {
                // 楼层视角：非当前楼层的空间隐藏
                filterHide = data.floorId !== curFloorId || m.name === modelNameEnum.SpaceIconInfoCommon;

                //楼层视角顶部header筛选：过滤展示仅可控设备下的可控状态空间

                // space?.setAsyncState('filterHide', filterHide);
                // space?.setAsyncState('hide', hideVal);
            }
            m?.setAsyncState('filterHide', filterHide);
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
                const floorInfo = getFloorInfoByFloorId(item.floorId, false);
                const { floorElevation, localId } = floorInfo;
                this.floorIdMapModal[fId].floorHeight = M2FOOT * Number(floorElevation || 0);
                this.floorIdMapModal[fId].floorLocalId = localId;
            }
            // group.addChild(spaceLabel);
            const space = createSpaceModel(item);
            if (space) {
                const { floorElevation, height } = item;
                // #空间标签图元
                const spaceLabel = createSpaceLabelInfoModel(item, floorElevation);

                space.setGeometryIndex(0);
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

    // 创建其它空间
    _createOtherSpaces() {
        if (this._curFloorId) {
            const floorInfo = getFloorInfoByFloorId(this._curFloorId);
            if (floorInfo) {
                const { floorElevation } = floorInfo;
                floorInfo.spaces?.forEach(obj => {
                    if (!this.mainSpaceModelMap.has(obj.id) && !this.straightLadderInSpaceModelMap.has(obj.id)) {
                        const m = createOtherSpaceModel(obj, floorElevation);
                        if (m) {
                            this.rootNodeModel.addChild(m);
                            const spaceLabel = createSpaceLabelInfoModel(obj, floorElevation);
                            m.addChild(spaceLabel);
                            this.otherSpaceModelMap.set(obj.id, m);
                        }
                    }
                });
            }
        }
    }

    _createStraightLadderIconInfos(items) {
        items?.forEach(obj => {
            if (obj.relShaft?.shaftSpaceList?.length > 0) {
                const m = createEqupIconInfo(obj);
                this.straightLadderIconInfoMap?.set(obj.id, m);
                this.rootNodeModel.addChild(m);
            }
        });
    }
    // 创建直梯所在空间
    _createStraightLadderInSpace(items) {
        const colorDefine = { normalColor: '#A1C8E5', hoverColor: '#89BEE5' };
        if (this._curFloorId) {
            items?.forEach(obj => {
                if (obj.relShaft?.shaftSpaceList?.length > 0) {
                    const spaceData = obj.relShaft?.shaftSpaceList?.find(s => {
                        return s.floorId === this._curFloorId;
                    });
                    // console.log('spaceData: ', spaceData);
                    if (spaceData) {
                        const m = createOtherSpaceModel(spaceData, spaceData.floorElevation, colorDefine);
                        if (m) {
                            // 空间model上关联上直梯数据对象
                            m.slObj = obj;
                            this.straightLadderInSpaceModelMap?.set(spaceData.id, m);
                            const spaceLabel = createSpaceLabelInfoModel(spaceData, spaceData.floorElevation);
                            // console.log('spaceLabel: ', spaceLabel, m);
                            this.rootNodeModel.addChild(m);
                            m.addChild(spaceLabel);
                        }
                    }
                }
            });
        }
    }

    // 创建竖井
    _createShafts(items) {
        items?.forEach(obj => {
            if (obj.shaftSpaceList?.length > 0) {
                const shaft = createShaftCombined(obj);
                this.shaftModelMap.set(obj.id, shaft);
                this.rootNodeModel.addChild(shaft);
            }
        });
    }
    // 创建直梯
    _createStraightLadders(items) {
        items?.forEach(slObj => {
            // 有关联的竖井才创建模型
            if (slObj.relShaft?.shaftSpaceList?.length > 0) {
                const sl = createStraightLadder(slObj);

                // 直梯上hover选中文字
                const airEquipStateInfo = createEqupStateInfo({ ...slObj, bimLocation: null }, true);

                this.rootNodeModel.addChild(sl);
                sl.addChild(airEquipStateInfo);

                this.straightLadderModelMap.set(slObj.id, sl);
                if (isEdge()) {
                    const slPopover = createStraightLadderPopover({});
                    sl.addChild(slPopover);
                }
            }
        });
    }
    // 创建出入口对象
    _createEntranceAndExits(items, doorGroups) {
        items?.forEach(obj => {
            const spaceGroup = new Group();
            spaceGroup.data = obj;

            let m = createEntranceAndExitsPrDoorGroupsIconInfo(obj);
            spaceGroup.addChild(m);

            this.rootNodeModel.addChild(spaceGroup);
            this.eeOrDoorGroupModelMap.set(obj.id, spaceGroup);
        });
        doorGroups?.forEach(obj => {
            if (!obj.bimLocation) {
                return;
            }

            const spaceGroup = new Group();
            spaceGroup.data = obj;
            let m = createEntranceAndExitsPrDoorGroupsIconInfo(obj);
            spaceGroup.addChild(m);

            this.rootNodeModel.addChild(spaceGroup);
            this.eeOrDoorGroupModelMap.set(obj.id, spaceGroup);
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
            const equipStyles = getEquipStylesDefine(obj.equipData, obj ? obj.normalStyle : null);
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
        this.updateShowElements();
        this.updateEquipStatus();
    }
    async createElements(data) {
        const { spaces, shafts, floors, straightLadders, escalators, tractions, entranceAndExits, doorGroups } = data;
        this.resetFloor();
        // console.log('spaces: ', data, floors);

        this.graphResourceManager.cancelAll();
        this.removeDyncElements();
        this._createSpaces(spaces);
        // floors?.forEach(floor => {
        //     this.recordFloorInfo({ localName: floor.localName, floorName: floor.localId, localId: floor.localId, id: floor.id }, true);
        // });

        this._createShafts(shafts);
        this._createStraightLadders(straightLadders);
        this._createStraightLadderIconInfos(straightLadders);
        // this._createStraightLadderInSpace(straightLadders);
        this.straightLadders = straightLadders;
        this._createEntranceAndExits(entranceAndExits, doorGroups);

        straightLadders?.forEach(sl => {
            const shaftModel = this.shaftModelMap.get(sl.relShaft?.id);
            const serviceFloorIds = sl.serviceFloorIds || [];
            if (shaftModel && serviceFloorIds) {
                shaftModel.setDockableFloors(serviceFloorIds);
            }
        });

        const promiseGenArr = [];

        // 扶梯、曳引机需要加载轻量化模型
        const equips = [...tractions, ...escalators];
        if (equips?.length > 0) {
            const equipsLoad = this._loadAndCreateEquips(equips);
            promiseGenArr.push(equipsLoad);
        }
        // this.Scene.add(new THREE.AxesHelper(100));
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

    // 切换模式视图展示
    async switchModeView(modeVal, floorId) {
        // 全楼与楼层视角切换
        // console.trace('switchModeView--modeVal: ', modeVal);
        if (floorId !== this._curFloorId) {
            this.removeOtherSpaces();
            this.removeStraightLadderInSpaces();
        }
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
            if (floorId === this._curFloorId) {
                this.removeOtherSpaces();
                this.removeStraightLadderInSpaces();
                this._createStraightLadderInSpace(this.straightLadders);
                this._createOtherSpaces();
            }
        } else {
            this.curClipBox = this.buildingBox;
        }
        this.rootNodeModel.setState('hidden', false);
        if (this.css3dRender.domElement.style) {
            this.css3dRender.domElement.style.display = 'block';
        }

        if (floorId === this._curFloorId) {
            this._updateFloorObjectsShow();
            this._switchCamera();
            this._switchLights();

            this._collisionInvokeDebounce();
        }
    }

    invokeScaleAndCollision() {
        //TODO 待更新碰撞消费
        // console.log('invokeScaleAndCollision: ', this.equipStateDetector.collisionMap?.size);
        // this.spaceNameCollisionDetector.collision();
        this.equipStateDetector.collision();
        // 不使用碰撞聚合
        this.airEquipIconInfoDetector.collision(false);
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

    removeOtherSpaces() {
        this.otherSpaceModelMap.forEach(m => {
            this.rootNodeModel.removeChild(m);
        });
        this.otherSpaceModelMap.clear();
    }
    // 删除直梯所在空间
    removeStraightLadderInSpaces() {
        this.straightLadderInSpaceModelMap.forEach(m => {
            this.rootNodeModel.removeChild(m);
        });
        this.straightLadderInSpaceModelMap.clear();
    }

    removeDyncElements() {
        this.mainSpaceModelMap.forEach((v, k) => {
            this.rootNodeModel.removeChild(v);
        });
        this.mainSpaceModelMap.clear();

        this.equipGroupModelMap.forEach(v => {
            this.rootNodeModel.removeChild(v);
        });

        this.shaftModelMap.forEach(v => {
            this.rootNodeModel.removeChild(v);
        });
        // 直梯图元model映射
        this.straightLadderModelMap.forEach(v => {
            this.rootNodeModel.removeChild(v);
        });
        this.straightLadderIconInfoMap.forEach(v => {
            this.rootNodeModel.removeChild(v);
        });

        this.equipGroupModelMap.clear();
        this.shaftModelMap.clear();
        this.straightLadderModelMap.clear();
        this.straightLadderIconInfoMap.clear();
        this.removeOtherSpaces();
        this.removeStraightLadderInSpaces();
        this.curSpaceShowMap = {};
    }

    removeAllObjects() {
        this.removeDyncElements();
        this.floorModalMap = {};
        this.curSpaceShowMap = {};
        this.floorIdMapModal = {};
    }

    Destroy() {
        this.tracker.dispose();
        this.mapController.dispose();
        this.controls?.dispose();
        this.removeAllObjects();
        this.graphResourceManager.cancelAll();
        this.graphResourceManager.dispose();
        this.buildingSceneLoader.dispose();
        this.floorMapSceneLoader.dispose();
        this.renderer.setAnimationLoop(null);

        this.renderer.clear();
        this.renderer.dispose();
        this.renderer.forceContextLoss();
        this.effectLoader?.dispose();
        this.renderer.renderLists.dispose();
        this.renderer.context = null;
        this.renderer.domElement = null;
        this.renderer.getRenderTarget()?.dispose();
    }
}
