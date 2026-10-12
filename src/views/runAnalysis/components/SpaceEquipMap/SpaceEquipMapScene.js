// @ts-ignore
import i18n from '@/localization';
import { WebGLScene } from '@yushu/core3d';
import { SceneLoader, EffectLoader } from '@yushu/effecttool';
import _, { debounce } from 'lodash';
import CameraControls from 'camera-controls';
import * as THREE from '@yushu/three-base';
import { isFloor, isFloorFrame, calcFloorDirectionalLight, restoreControls, convertP3ToP2 } from '@/apm-3d/utils/buildingTools';
import RootNode from '@/views/GraphMVC/graphScene/RootNode/RootNode';
import Controller from '@/views/GraphMVC/core/Controller';
import { INTERFACE_PREFIX_RWD } from '@/config';
import { GraphResourceManager } from '@/views/GraphMVC/utils/GraphResourceManager';
import EquipStateDetector from './graph/CollisionDetector/EquipStateDetector';
import AirEquipIconInfoDetector from './graph/CollisionDetector/AirEquipIconInfoDetector';

import Group from '@/views/GraphMVC/graphScene/Group/Group';
import { modelNameEnum } from '@/views/GraphMVC/graphScene/GraphSceneDefine';
import { getFloorInfoByFloorId } from '@/utils/buildingUtils';
import VisibilityContext from '@/views/GraphMVC/graphScene/Context/VisibilityContext';

import AdvanceLinkLine from '@/views/GraphMVC/graphScene/AdvanceLinkLine/AdvanceLinkLine';

import Equip from '@/views/GraphMVC/graphScene/Equip/Equip';

import DataBatchTaskHelper from '@/utils/DataBatchTaskHelper';

import { getEquipStyles, createEqupStateInfo, createEqupIconInfo, createSpaceModel, createSpaceLabelInfoModel } from './sceneUtil';

const { M2FOOT, MM2FOOT, ResourceTracker } = THREE.baseUtils;

const WIREFRAME_SCENE_NAME = '07_building_relation';
const D3_SCENE_NAME = '05_building_classic';

const BUILDING_MODE = 1;
const FLOOR_MODE = 2;
// 枚举映射状态
const ENUM_MAP_STATE = {
    TOO_COLD: 'coldest',
    COLD: 'colder',
    APPROPRIATE: 'appropriate',
    HOT: 'hotter',
    TOO_HOT: 'hottest',
    HIGH: 'co2Hight',
    TOO_HIGH: 'co2TooHight'
};

export default class SpaceEquipMapScene extends WebGLScene {
    constructor({ projectId = '', groupCode, env = 'production', loadings, bgColor, canSpaceSelected }) {
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
        this.canSpaceSelected = canSpaceSelected;

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

        this.setComposser(this.composer);

        // 状态感知相关Spce Model
        this.cachedSpaceModelMap = new Map();
        this.cachedEquipGroupModelMap = new Map();

        this.currentSpaceIdData = new Map();
        this.currentEquipIdData = new Map();

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
        this.rootNodeModel.unhoverSpace();
        this.unhoverModel();

        // console.log('hover------newModel: ', newModel);
        if (newModel && newModel.name === modelNameEnum.MultipleSpace) {
            this.hoverSpaceModel(newModel);
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
        }
    }

    // controller 调用
    viewOnClickTarget({ model }) {
        if (!this.canSpaceSelected) {
            return;
        }
        if (model && model.getState('selected')) {
            return;
        }
        this.unselectModel();
        if (model.name === modelNameEnum.MultipleSpace) {
            this.selectSpaceModel(model);
        }
    }

    hoverModel(model) {
        model?.setState('hover', true);
        this.currentHoverModel = model;
    }
    hoverSpaceModel(sapceModel) {
        this.hoverModel(sapceModel);
    }
    hoverEquipModel(model) {
        this.hoverModel(model);
        const fId = model?.data?.floorId;
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

    selectModel(model) {
        model.setState('selected', true);
        this.currentSelectedModel = model;
    }
    selectEquipModel(model) {
        this.selectModel(model);
        this.clickDetail(model.data);
    }
    selectSpaceModel(model) {
        this.selectModel(model);
        this.clickDetail(model.spaceData);
    }

    unselectModel() {
        if (this.currentSelectedModel) {
            this.currentSelectedModel.setState('selected', false);
            this.currentSelectedModel = null;
        }
    }

    clickMapObj(obj) {
        this.unselectModel();
        this.unhoverMapObj();
        const space = this.cachedSpaceModelMap.get(obj.id);
        if (space) {
            this.selectSpaceModel(space);
            return;
        }
        const equip = this.cachedEquipGroupModelMap.get(obj.id);
        if (equip) {
            this.selectEquipModel(equip);
        }
    }
    hoverMapObj(obj) {
        this.rootNodeModel.unhoverSpace();
        this.unhoverModel();
        const space = this.cachedSpaceModelMap.get(obj.id);
        if (space) {
            this.hoverSpaceModel(space);
            this.hoverCard(space);
            return;
        }
        const equip = this.cachedEquipGroupModelMap.get(obj.id);
        if (equip) {
            this.hoverEquipModel(equip);
            this.hoverCard(equip);
        }
    }
    unhoverMapObj() {
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
                        c.visible = false;
                    });
                    floorGroups.push(group);
                } else if (isFloorFrame(group)) {
                    group.children.forEach(c => {
                        c.visible = false;
                    });
                    floorGroups.push(group);
                } else {
                    this.meshGroup.add(group);
                }
            });
            const boudingBox = new THREE.Box3();
            boudingBox.expandByObject(this.meshGroup);

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
        const stateNames = ['appropriate', 'colder', 'coldest', 'hotter', 'co2TooHight', 'co2Hight'];
        const spaceObj = space?.spaceData;

        if (!spaceObj) {
            return;
        }
        space.clearStatesAsync(stateNames);
        const stateName = ENUM_MAP_STATE[spaceObj.status];
        if (stateName) {
            space.setAsyncState(stateName, true);
        }
    }
    updateSpaceStatus() {
        this.cachedSpaceModelMap.forEach(model => {
            if (model.getState('hide') || model.getState('filterHide')) {
                return;
            }
            this._updateSpaceState(model);
        });
    }

    _updateSpaceModelShow(model) {
        const isFloorMap = this.mapMode === FLOOR_MODE;
        const { spaceData } = model;
        const hideVal = !this.currentSpaceIdData.has(spaceData.id);

        model?.setAsyncState('hide', hideVal);
        // 空间上小圆点model，对应第1个子
        if (!hideVal) {
            model?.setGeometryIndex(isFloorMap ? 1 : 0);
        }
    }

    _updateEquipModelShow(model) {
        const curFloorId = this._curFloorId;
        const isFloorMap = this.mapMode === FLOOR_MODE;
        const equipStateInfo = model.findChildByName(modelNameEnum.EquipStateDotInfo);
        const airEquipIconInfo = model.findChildByName(modelNameEnum.AirEquipIconInfo);
        let isHide = !this.currentEquipIdData.has(model.data?.id);
        if (!isFloorMap) {
            // 全楼视角默认不展示设备
            // filterHide = !this.curFilterType === CONTROL_BAR_TAB_KEYS.ABNORMAL && filterHide;

            if (!isHide && equipStateInfo) {
                this.equipStateDetector.addElement(equipStateInfo);
            }
        } else {
            if (!isHide && airEquipIconInfo) {
                this.airEquipIconInfoDetector.addElement(airEquipIconInfo);
            }
        }

        model?.setAsyncState('hide', isHide);
        model?.setAsyncState('buildingMode', !isFloorMap);
        model?.setAsyncState('floorMode', isFloorMap);
    }
    updateShowElements() {
        this.equipStateDetector.clearElements();
        this.airEquipIconInfoDetector.clearElements();
        const curFloorId = this._curFloorId;
        const isFloorMap = this.mapMode === FLOOR_MODE;

        const spaceShowFloorLocalId = new Set();

        // 遍历空间
        this.cachedSpaceModelMap.forEach(space => {
            this._updateSpaceModelShow(space);

            if (!isFloorMap && !space.getState('hide') && !space.getState('filterHide')) {
                spaceShowFloorLocalId.add(space?.spaceData?.floorLocalId);
            }
        });
        this.cachedEquipGroupModelMap.forEach(model => {
            this._updateEquipModelShow(model);
        });
        // console.log('this.airEquipIconInfoDetector: ', this.airEquipIconInfoDetector);

        if (!isFloorMap) {
            this._updateFloorShow(spaceShowFloorLocalId);
        }

        this._collisionInvokeDebounce();
    }

    updateModelsShowAndStyle() {
        this.equipStateDetector.clearElements();
        this.airEquipIconInfoDetector.clearElements();
        const isFloorMap = this.mapMode === FLOOR_MODE;
        const curFloorId = this._curFloorId;

        const spaceShowFloorLocalId = new Set();
        // 遍历空间
        this.cachedSpaceModelMap.forEach(space => {
            this._updateSpaceModelShow(space);
            if (!space.getState('hide') && !space.getState('filterHide')) {
                this._updateSpaceState(space);

                if (!isFloorMap) {
                    spaceShowFloorLocalId.add(space?.spaceData?.floorLocalId);
                }
            }
        });
        this.cachedEquipGroupModelMap.forEach(model => {
            this._updateEquipModelShow(model);
        });

        if (!isFloorMap) {
            this._updateFloorShow(spaceShowFloorLocalId);
        }

        this._collisionInvokeDebounce();
    }

    // 创建飞线实例
    _createAdvanceLinkLine(relA, relB) {
        if (relA.id === relB.id) return;
        if (!relA.bimLocation || !relB.bimLocation) return;
        // if (!this.cachedSpaceModelMap.has(relB.id)) return;
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

    createLinkLines(links) {
        links?.forEach(obj => {
            const { fromObj, toObj } = obj;
            this._createAdvanceLinkLine(fromObj, toObj);
        });
    }

    createAndRenderSpaces() {
        this.currentSpaceIdData.forEach((sapceObj, id) => {
            const { floorElevation } = sapceObj;
            let model = null;
            if (this.cachedSpaceModelMap.has(id)) {
                model = this.cachedSpaceModelMap.get(id);
                model.spaceData = sapceObj;
            } else {
                model = createSpaceModel(sapceObj);
                if (model) {
                    // #空间标签图元
                    const spaceLabel = createSpaceLabelInfoModel(sapceObj, floorElevation);
                    // const abnormalIcon = createSpaceAbnormalIcon(item);
                    model.setGeometryIndex(0);
                    this.rootNodeModel.addChild(model);
                    model.addChild(spaceLabel);
                    // this.spaceLabelDetector.addElement(spaceLabel);
                    Object.keys(spaceLabel.defineStyles).forEach(key => {
                        spaceLabel.defineStyles[key].iconShow = false;
                    });

                    this.cachedSpaceModelMap.set(id, model);
                }
            }
            if (model) {
                this._updateSpaceModelShow(model);
                if (!model.getState('hide')) {
                    this._updateSpaceState(model);
                }
            }
        });
    }

    createEquip2DModels(equipObj) {
        const equipGroup = this.cachedEquipGroupModelMap.get(equipObj?.id);
        if (equipObj?.bimLocation && equipGroup) {
            try {
                const equipStateInfo = createEqupStateInfo(equipObj);
                equipGroup.addChild(equipStateInfo);

                const airEquipIconInfo = createEqupIconInfo(equipObj);
                equipGroup.addChild(airEquipIconInfo);
            } catch (e) {
                console.log('e: ', e);
            }
        }
    }

    async _loadAndCreateEquips(equips) {
        console.log('equips: ', equips);
        equips?.forEach(obj => {
            let equipGroup = this.cachedEquipGroupModelMap.get(obj.id);
            if (!equipGroup) {
                equipGroup = new Group();
                equipGroup.data = obj;
                this.rootNodeModel.addChild(equipGroup);

                this.cachedEquipGroupModelMap.set(obj.id, equipGroup);
                this.createEquip2DModels(obj);
            }
            if (equipGroup) {
                this._updateEquipModelShow(equipGroup);
            }
        });
        await this.graphResourceManager.loadEquips(equips, { useAdvance: false }, obj => {
            const equipGroup = this.cachedEquipGroupModelMap.get(obj.equipData.id);
            if (!equipGroup) {
                return;
            }
            const equip = new Equip(obj.equipData, obj.mesh);
            const equipStyles = getEquipStyles(obj.equipData, obj ? obj.normalStyle : null);
            // 给选中的材质设置贴图
            // const selMaterial = this.materialManager.dequeueMaterial(equipStyles.selected);
            // const actMaterial = this.materialManager.dequeueMaterial(equipStyles.active);
            // selMaterial.map = obj.mesh.material.map;
            // actMaterial.map = obj.mesh.material.map;
            equip.setStateStyles(equipStyles);

            // 标记有设备模型
            equipGroup.hasEquipMesh = true;
            equipGroup.addChild(equip);
            this._updateEquipModelShow(equipGroup);
        });
    }
    async createAndRenderElements(data) {
        this.currentSpaceIdData.clear();
        this.currentEquipIdData.clear();
        this.hideAllSpaceEquip();
        this.clearAllLine();
        const { spaces, equipments, links } = data;
        // console.log('spaces: ', data, floors);
        spaces?.forEach(obj => {
            this.currentSpaceIdData.set(obj.id, obj);
        });
        equipments?.forEach(obj => {
            this.currentEquipIdData.set(obj.id, obj);
        });
        this.createAndRenderSpaces(spaces);
        // this.spaceCreateBatchHelper.setTargetDatas(spaces);
        // this.spaceCreateBatchHelper.run();
        this.createLinkLines(links);
        const promiseGenArr = [];

        if (equipments?.length > 0) {
            const equipsLoad = this._loadAndCreateEquips(equipments);
            promiseGenArr.push(equipsLoad);
            // this.equipCreateBatchHelper.setTargetDatas(equips);
            // this.equipCreateBatchHelper.run();
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
            this.cachedSpaceModelMap.forEach(space => {
                const { spaceData } = space;

                if (spaceData?.floorId === fId) {
                    const spaceMesh = this.Scene.getObjectByProperty('modelKey', spaceData?.id);
                    if (spaceMesh) {
                        boundingBox.expandByObject(spaceMesh);
                    }
                }
            });
            if (boundingBox.isEmpty()) {
                boundingBox.expandByPoint(new THREE.Vector3(0, 0, 0));
                boundingBox.expandByPoint(new THREE.Vector3(10, 10, 10));
            }
            this.curClipBox = boundingBox;
        }
    }

    // 更新建筑相关及关系模式相关模型显隐
    _updateBuildingShow() {
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
        // console.trace('switchModeView--modeVal: ', modeVal);
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
        this._switchCamera();
        this._switchLights();

        this._collisionInvokeDebounce();
    }

    invokeScaleAndCollision() {
        // console.log('invokeScaleAndCollision: ', this.equipStateDetector.collisionMap?.size);
        // this.spaceNameCollisionDetector.collision();
        this.equipStateDetector.collision();
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

    pauseRender(pause) {
        this.pauseRenderLoop = pause;
    }

    clearAllLine() {
        this.linkLines?.forEach(model => {
            this.rootNodeModel.removeChild(model);
        });

        this.linkLines = [];
    }

    // 隐藏所有空间设备
    hideAllSpaceEquip() {
        this.cachedSpaceModelMap.forEach((v, k) => {
            if (!v.getState('hide')) {
                v.setAsyncState('hide', true);
            }
        });

        this.cachedEquipGroupModelMap.forEach(v => {
            if (!v.getState('hide')) {
                v.setAsyncState('hide', true);
            }
        });
    }

    removeDyncElements() {
        this.cachedSpaceModelMap.forEach((v, k) => {
            this.rootNodeModel.removeChild(v);
        });
        this.cachedSpaceModelMap.clear();

        this.cachedEquipGroupModelMap.forEach(v => {
            this.rootNodeModel.removeChild(v);
        });

        this.cachedEquipGroupModelMap.clear();
        this.curSpaceShowMap = {};
        this.clearAllLine();
    }

    removeAllObjects() {
        this.removeDyncElements();
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
        this.spaceCreateBatchHelper?.dispose();
    }
}
