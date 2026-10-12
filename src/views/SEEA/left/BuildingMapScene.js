// @ts-ignore
import i18n from '@/localization';
import { WebGLScene } from '@yushu/core3d';
import { SceneLoader, EffectLoader, EdgeMaterial } from '@yushu/effecttool';
import _, { debounce } from 'lodash';
import CameraControls from 'camera-controls';
import * as THREE from '@yushu/three-base';
import { parseMainBuildingBoardInfo, isFloor, isFloorFrame, convertP3ToP2 } from '@/apm-3d/utils/buildingTools';
import RootNode from '@/views/GraphMVC/graphScene/RootNode/RootNode';
import Controller from '@/views/GraphMVC/core/Controller';
import { INTERFACE_PREFIX_RWD } from '@/config';
import { GraphResourceManager } from '@/views/GraphMVC/utils/GraphResourceManager';
import EquipStateInfo from '@/views/GraphMVC/graphScene/EquipStateInfo/EquipStateInfo';
import EquipStateDetector from './graph/CollisionDetector/EquipStateDetector';
import { RevitModelColorFromClassCode } from '@/views/GraphMVC/config/color/ModelCommonColor';
import { OBJ_TYPE } from '@/utils/globalVariables';
import Group from '@/views/GraphMVC/graphScene/Group/Group';
import Floor from '@/views/GraphMVC/graphScene/Floor/Floor';
import { modelNameEnum, RenderOrder, StatePriority } from '@/views/GraphMVC/graphScene/GraphSceneDefine';

import { baseColors } from '@/constants/baseColors';
import VisibilityContext from '@/views/GraphMVC/graphScene/Context/VisibilityContext';

import Equip from '@/views/GraphMVC/graphScene/Equip/Equip';

const { ResourceTracker } = THREE.baseUtils;

const WIREFRAME_SCENE_NAME = '07_building_relation';

const BUILDING_MODE = 1;

const createEqupStateInfo = item => {
    const equipStateInfo = new EquipStateInfo(item);
    equipStateInfo.setStateStyles({
        normal: {
            show: true,
            textShow: true,
            bubbleShow: false,
            dotShow: true,
            dotVisible: true,
            joinCollide: true,
            dotColor: baseColors['$green-700'],
            // tagText: '--',
            // tagBgColor: '#C4C9CF',
            renderOrder: RenderOrder.equip,
            priority: RenderOrder.equip,
            weight: RenderOrder.equip
        },

        offline: {
            dotColor: `${baseColors['$grey-500']}`,
            textColor: baseColors.$white,
            textBgColor: baseColors['$grey-500'],
            textBorder: '1px solid #fff',
            priority: RenderOrder.equip + 1,
            weight: RenderOrder.equip + 1
        },

        floorMode: {
            show: false,
            priority: 3000
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

const getEquipStyles = (equipData, normalStyle) => {
    const style = {
        hover: {
            outline: true,
            priority: 20
        },
        active: {
            // outline: true,
            group: normalStyle?.group,
            materialType: EdgeMaterial.name,
            alpha: 0.5,
            color: '#9FC9FB',
            priority: 50
        },
        hoverRelation: {
            outline: true,
            priority: 50
        },

        selected: {
            group: normalStyle?.group,
            materialType: EdgeMaterial.name,
            alpha: 0.5,
            color: '#9FC9FB',
            priority: 40
        },
        floorMode: {
            show: false,
            priority: 3000
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
    };
    if (equipData) {
        style.normal = normalStyle || {
            show: false,
            ...equipData.colorInfo,
            color: RevitModelColorFromClassCode(equipData.classCode),
            materialType: THREE.MeshStandardMaterial.name
        };
    }
    return style;
};

export default class PublicMapScene extends WebGLScene {
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

        const defaultBg = new THREE.Color('#D6DDE5');
        this.bgColorRef.value = '#D6DDE5';
        // this.Scene.background = defaultBg.convertSRGBToLinear();
        this.Scene.background = defaultBg;

        // 场景加载器
        this.buildingSceneLoader = new SceneLoader(this.env, this.projectId, WIREFRAME_SCENE_NAME, this.renderer);

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
        // #空间标签图元碰撞器
        this.equipStateDetector = new EquipStateDetector(this.renderContext);
        // TAG 设备图元碰撞器
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
        // this.unHighlightFloor();
        this.unhoverModel();

        // console.log('hover------newModel: ', newModel);
        if (newModel && newModel.name === modelNameEnum.Group && newModel.data?.objType === OBJ_TYPE.EQUIPMENT) {
            this.hoverEquipModel(newModel);
            this.css3dRender.domElement.style.cursor = 'pointer';
        }
        if (newModel && newModel.name === modelNameEnum.Equip) {
            this.hoverEquipModel(newModel.parent);
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

        if (newModel && newModel.name === modelNameEnum.Equip) {
            this.hoverCard(newModel.parent);
        } else if (newModel && newModel.name === modelNameEnum.Group && newModel.data) {
            let showCard = true;

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
        if (model && model.name === modelNameEnum.Group) {
            this.selectEquipModel(model);
        } else if (model && (model.name === modelNameEnum.Equip || model.name === modelNameEnum.EquipStateInfo)) {
            this.selectEquipModel(model.parent);
        }
    }

    hoverModel(model) {
        model?.setState('hover', true);
        this.currentHoverModel = model;
    }

    hoverEquipModel(model) {
        this.hoverModel(model);
        const fId = model?.data?.floorId;
        // console.log('model?.data: ', model?.data, this.floorIdMapModal[fId]);
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

    unselectModel() {
        // this.unHighlightFloor('active');
        if (this.currentSelectedModel) {
            this.currentSelectedModel.setState('selected', false);
            this.currentSelectedModel = null;
        }
    }

    clickMapObj(obj) {
        this.unselectModel();
        this.unhoverMapObj();

        const equip = this.equipGroupModelMap.get(obj.id);
        if (equip) {
            this.selectEquipModel(equip);
        }
    }
    hoverMapObj(obj) {
        // this.unHighlightFloor();
        // this.rootNodeModel.unhoverSpace();
        this.unhoverModel();

        const equip = this.equipGroupModelMap.get(obj.id);
        if (equip) {
            this.hoverEquipModel(equip);
            this.hoverCard(equip);
        }
    }
    unhoverMapObj() {
        // this.unHighlightFloor();
        // this.rootNodeModel.unhoverSpace();
        this.unhoverModel();
    }

    async _loadeBuildingMeshs() {
        try {
            const floorGroups = [];
            // 模型
            await this.buildingSceneLoader.loadMeshes(false, group => {
                if (!group) return;
                console.log(group);

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
        return this.buildingSceneLoader.getSceneBackground(this.renderer).then(res => {
            if (res?.isColor) {
                this.bgColorRef.value = `#${res.getHexString()}`;
                this.Scene.background = res;
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
                this.Scene.add(dirlight);
            }
            if (amlight) {
                this.Scene.add(amlight);
            }
        };
        return this.buildingSceneLoader.initLightAndShadow().then(res => {
            addLights(res, BUILDING_MODE);
        });
    }

    async initLoader() {
        const loadPromise = [];
        await this.buildingSceneLoader.init();
        loadPromise.push(this._loadeBuildingMeshs());
        loadPromise.push(this._loadeSceneBackground());
        loadPromise.push(this._loadeSceneLights());
        loadPromise.push(this._loadeBuildingCamera());
        await Promise.allSettled(loadPromise);
        this.setCamera(this.buildingCameraModel);
    }

    async initScene() {
        await this.initLoader();
        this.initControls();
        console.log('this Scene: ', this.Scene);
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
                // const { floorMesh } = meshInfo;
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

    updateOneModelState(id, stateName, value) {
        const model = this.equipGroupModelMap.get(id);
        model?.setAsyncState(stateName, value);
    }

    updateShowElements() {
        this.equipStateDetector.clearElements();
        this.equipGroupModelMap.forEach(model => {
            const equipStateInfo = model.findChildByName(modelNameEnum.EquipStateDotInfo);

            let filterHide = false;

            // 对于当前tab，是异常的时候根据设备异常状态过滤
            //  全楼视角隐藏设备，楼层视角不做过滤

            // 全楼视角默认不展示设备

            if (!filterHide && equipStateInfo) {
                this.equipStateDetector.addElement(equipStateInfo);
            }

            // model?.setAsyncState('stateInfoHide', stateInfoHide);
            model?.setAsyncState('filterHide', filterHide);
        });

        this._collisionInvokeDebounce();
    }

    // 退出关联模式
    exitRelationMode() {
        this.isRelationMode = false;

        this.equipStateDetector.clearElements();

        this.equipGroupModelMap.forEach(model => {
            model.setAsyncState('isRelMode', false);
            model.setAsyncState('relModeShow', false);
            model.setAsyncState('isRelObject', false);
            const equipStateInfo = model.findChildByName(modelNameEnum.EquipStateDotInfo);

            if (!model.getState('hide') && !model.getState('filterHide')) {
                if (equipStateInfo) {
                    this.equipStateDetector.addElement(equipStateInfo);
                }
            }
        });
        // clear linkLines
        this.clearAllLine();
        this._collisionInvokeDebounce();
    }

    // 创建飞线实例

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
        const { equips, floors } = data;
        this.resetFloor();
        // console.log('spaces: ', data, floors);

        this.graphResourceManager.cancelAll();
        this.removeDyncElements();

        const promiseGenArr = [];

        if (equips?.length > 0) {
            const equipsLoad = this._loadAndCreateEquips(equips);
            promiseGenArr.push(equipsLoad);
        }
        await Promise.allSettled(promiseGenArr);
    }

    initControls() {
        // console.log('_switchCamera: ', this.mapMode === BUILDING_MODE, this.curClipBox?.clone());
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
    }

    invokeScaleAndCollision() {
        // console.log('invokeScaleAndCollision: ', this.equipStateDetector.collisionMap?.size, this.equipStateDetector.collisionMap);
        // this.spaceNameCollisionDetector.collision();
        if (!this.pauseRenderLoop) {
            this.equipStateDetector.collision();
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
        this.tracker.dispose();
        this.mapController.dispose();
        this.removeAllObjects();
        this.graphResourceManager.cancelAll();
        this.graphResourceManager.dispose();
        this.buildingSceneLoader.dispose();
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
