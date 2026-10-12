// @ts-ignore
import i18n from '@/localization';
import { WebGLScene } from '@yushu/core3d';
import * as THREE from '@yushu/three-base';
import { SceneLoader, EffectLoader } from '@yushu/effecttool';
import { debounce } from 'lodash';
import CameraControls from 'camera-controls';

import RootNode from '@/views/GraphMVC/graphScene/RootNode/RootNode';
import VisibilityContext from '@/views/GraphMVC/graphScene/Context/VisibilityContext';
import { GraphResourceManager } from '@/views/GraphMVC/utils/GraphResourceManager';
import Controller from '@/views/GraphMVC/core/Controller';
import { INTERFACE_PREFIX_RWD } from '@/config';
import { modelNameEnum } from '@/views/GraphMVC/graphScene/GraphSceneDefine';
import { convertP3ToP2, convertV3ToP2 } from '@/apm-3d/utils/buildingTools';
import { getFloorInfoByFloorId } from '@/utils/buildingUtils';

import EquipItemCollisionDetector from './graph/CollisionDetector/EquipItemCollisionDetector';
import { OBJ_TYPE } from '@/utils/globalVariables';
import {
    createSpaceModel,
    createSpaceLabelInfoModel,
    createParkingPlaceModel,
    createParkingPlaceNameModel,
    createChargingStationModel,
    createCamerasOrGatesModel,
    isWithinTimeRange
} from './utils/index';
import { isEntranceAndExit } from './utils/check';
import DockSingleton from '@/hooks/responsiveDock';

const D3_SCENE_NAME = '05_building_classic';

const { M2FOOT, ResourceTracker } = THREE.baseUtils;

// 停车状态，dataValue与model state key对应
const PARKING_STATE_MAP = {
    0: 'idle',
    1: 'occupy'
};

// WebGLScene 生命周期：Init => Create => Update => Destroy
// WebGlScene 常用方法：zoomCamera 相机缩放、dispose 场景销毁
const getBoxTop = (renderContext, box3) => {
    const center = new THREE.Vector3();
    const size = new THREE.Vector3();
    box3.getCenter(center);
    box3.getSize(size);
    // center.setZ(center.z - size.z / 2);
    const pos = convertV3ToP2(renderContext, center);
    return pos;
};
export default class ParkingFloorScene extends WebGLScene {
    constructor({ projectId = '', groupCode, env = 'production', loadings }) {
        super();
        this.projectId = projectId;
        this.groupCode = groupCode;
        this.env = env;
        this.loadings = loadings;

        this.floorIdMapModel = {}; // 楼层id映射土建楼板模型
        // 注册业务图元关联的所有 Media 映射
        RootNode.registerAll();
    }

    // MARK: 初始化
    // 这时相机，场景，相机控制器，渲染器还没有实例化
    Init() {
        this.useCameraControls = true;
        // const size = new THREE.Vector2();
        // // 获取渲染器大小
        // renderer.getSize(size);
        // this.camera = new THREE.OrthographicCamera(size.x / -2, size.x / 2, size.y / 2, size.y / -2, 0.01, 20000);
        this.camera = new THREE.OrthographicCamera();
        this.camera.position.set(0, 300, 0);
    }

    // MARK: 创建阶段
    // 一般用于创建模型，往场景中加光影，修改相机位置
    Create() {
        // 建筑网格组容器
        this.meshGroup = new THREE.Group();
        this.Scene.add(this.meshGroup);

        // 楼层网格组容器
        this.floorMeshGroup = new THREE.Group();
        this.Scene.add(this.floorMeshGroup);

        // 场景背景色
        this.Scene.background = new THREE.Color('#e8edf3');

        // 楼层场景加载器
        this.floorMapSceneLoader = new SceneLoader(this.env, this.projectId, D3_SCENE_NAME, this.renderer);

        // 场景灯光
        this.lights = [];
        // 不同模式如建筑、楼层对应的灯光映射
        this.lightsMap = {};

        // 相机初始化
        this.initCamera();
        const size = new THREE.Vector2();
        // 获取渲染器大小
        this.renderer.getSize(size);
        this.camera.left = size.x / -2;
        this.camera.right = size.x / 2;
        this.camera.top = size.y / 2;
        this.camera.bottom = size.y / -2;

        // 后处理效果合成器：通常是指应用到2d图像上的某种特效或者滤镜
        this.effectLoader = new EffectLoader(this.env, this.renderer);
        this.composer = this.effectLoader.getComposer(this.Scene, this.camera);
        this.setComposser(this.composer);

        // 状态感知相关：存储空间、存储设备信息
        this.mainSpaceModelMap = new Map();
        this.mainEquipModelMap = new Map();
        this.entranceAndExitModelMap = new Map();
        this.curSelectedParkingSpot = null;

        // 注册 Map Mvc
        // 设置显隐渲染上下文节点
        this.renderContext = new VisibilityContext(this);
        this.renderContext.init('3d');

        // 场景根节点，管理所有子节点
        this.rootNodeModel = new RootNode();
        // 设置根节点及渲染上下文的控制器
        this.mapController = new Controller(this.rootNodeModel, this.renderContext);
        // 将当前对象设置为控制器委托
        this.mapController.delegate = this;

        // 资源管理器
        this.materialManager = this.renderContext.materialManager;
        this.graphResourceManager = new GraphResourceManager({
            projectId: this.projectId,
            groupCode: this.groupCode,
            env: this.env,
            bdtpUrl: INTERFACE_PREFIX_RWD,
            materialManager: this.materialManager
        });

        this.loadError = false; // 加载场景错误

        // 图元碰撞器初始化
        this.equipItemCollisionDetector = new EquipItemCollisionDetector(this.renderContext);
        // 碰撞器防抖函数
        this._collisionInvokeDebounce = debounce(this.invokeScaleAndCollision, 20);

        // 事件绑定
        this.bindEvent();

        // 资源监控跟踪，及时清理资源
        this.tracker = new ResourceTracker();
        this.tracker.track(this.floorMeshGroup);
        this.tracker.track(this.meshGroup);
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

    bindEvent() {
        // 控制器绑定事件
        this.controls.addEventListener('change', () => {
            if (this.disabled) return;
            this._collisionInvokeDebounce();
        });
    }

    invokeScaleAndCollision() {
        this.equipItemCollisionDetector.collision();
    }

    // MARK: model 操作
    // hover、unhover、select、unselect
    hoverModel(model) {
        model?.setState('hover', true);
        this.currentHoverModel = model;
    }

    hoverEquipModel(equipModel) {
        this.hoverModel(equipModel);
    }

    hoverCard(model) {
        // console.log('hoverCard: ', model);
        // 将bimLocation从P3坐标转换为P2坐标
        const finalData = model?.data || model?.spaceData;
        const { bimLocation } = finalData || {};
        let pos = null;
        if (model.box3) {
            pos = getBoxTop(this.renderContext, model.box3);
        } else {
            pos = convertP3ToP2(this.renderContext, bimLocation);
        }
        if (pos) {
            // 派发 onUnHoverCard 事件
            this.dispatchEvent({
                type: 'onHoverCard',
                data: { pos, instance: finalData }
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
    }

    selectModel(model) {
        model?.setState('selected', true);
        this.currentSelectModel = model;
    }

    selectSpaceModel(spaceModel) {
        this.selectModel(spaceModel);
        this.dispatchEvent({ type: 'clickDetail', data: spaceModel.spaceData });
    }

    selectEquipModel(equipModel) {
        this.selectModel(equipModel);
        this.dispatchEvent({ type: 'clickDetail', data: equipModel.data });
    }

    unselectModel() {
        if (this.currentSelectModel) {
            this.currentSelectModel.setState('selected', false);
            this.currentSelectModel = null;
        }
    }

    // MARK: MapObj 操作
    // click、hover、unhover
    clickMapObj(obj) {
        this.unhoverModel();
        this.unselectModel();
        const space = this.mainSpaceModelMap.get(obj.id);
        if (space) {
            // 空间暂不支持点击
            // this.selectSpaceModel(space);
            return;
        }
        const equip = this.mainEquipModelMap.get(obj.id);
        if (equip) {
            this.selectEquipModel(equip);
        }

        if (obj.relObjIds?.[0]) {
            const chargeStationEquip = this.mainEquipModelMap.get(`${obj.relObjIds?.[0]}-${obj.id}`);
            if (chargeStationEquip) {
                this.selectEquipModel(chargeStationEquip);
            }
        }
    }

    hoverMapObj(obj) {
        this.rootNodeModel.unhoverSpace();
        this.unhoverModel();
        const space = this.mainSpaceModelMap.get(obj.id);
        if (space) {
            this.hoverModel(space);
        }
        let equip = this.mainEquipModelMap.get(obj.id);
        if (!equip && obj.relObjIds?.[0]) {
            equip = this.mainEquipModelMap.get(`${obj.relObjIds?.[0]}-${obj.id}`);
        }
        if (equip) {
            this.hoverEquipModel(equip);
            this.hoverCard(equip);
        }
    }

    unhoverMapObj() {
        this.rootNodeModel.unhoverSpace();
        this.unhoverModel();
    }

    // MARK: Controller 方法
    // hover、长hover、click
    viewOnHoverTargetChanged({ newModel }) {
        if (newModel?.getState?.('selected')) {
            return;
        }

        this.rootNodeModel.unhoverSpace();
        this.unhoverModel();

        if (newModel && newModel.name === modelNameEnum.Space) {
            this.hoverModel(newModel);
            // 空间暂不支持点击
            this.css3dRender.domElement.style.cursor = 'default';
        } else if (newModel && newModel.name === modelNameEnum.PLEquipIconInfo && newModel.data?.objType === OBJ_TYPE.EQUIPMENT) {
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

    viewOnLongHoverTargetChanged({ newModel }) {
        if (newModel && newModel.getState('selected')) {
            return;
        }

        if (newModel && newModel.name === modelNameEnum.PLEquipIconInfo) {
            this.hoverCard(newModel);
            this.css3dRender.domElement.style.cursor = 'pointer';
        } else if (newModel && newModel.name === modelNameEnum.ChargingStation) {
            this.hoverCard(newModel);
        } else if (newModel && newModel.name === modelNameEnum.ParkingPlace) {
            this.hoverCard(newModel);
        }
    }

    viewOnClickTarget({ model }) {
        if (model && model.getState('selected')) {
            return;
        }
        this.unselectModel();

        if (model.name === modelNameEnum.Space) {
            // 空间暂不支持点击
            // this.selectSpaceModel(model);
            return;
        } else if (model && model.name === modelNameEnum.PLEquipIconInfo) {
            this.selectEquipModel(model);
        } else if (model && model.name === modelNameEnum.ParkingPlace) {
            this.selectEquipModel(model);
        } else if (model && model.name === modelNameEnum.ChargingStation) {
            this.selectEquipModel(model);
        } else if (!model) {
            this.css3dRender.domElement.style.cursor = 'default';
        }
    }

    // MARK: 私有公共方法
    // initLoader、renderFloor、setIotInfoExpress、sseRefreshIotInfo、_loadAndShowCF、restoreCamera、resize、removeDyncElements、removeAllObjects、createElements
    // _loadSceneBackground、_loadSceneLights、_loadAndShowCF、_clipBox
    // _updateFloorObjectsShow、_switchCamera、_switchLights、

    async _loadSceneBackground() {
        // const color = await this.floorMapSceneLoader.getSceneBackground(this.renderer);
        this.Scene.background = new THREE.Color('#e8edf3');
    }

    async _loadSceneLights() {
        const lightGroup = await this.floorMapSceneLoader.initLightAndShadow();
        // 初始化光照组中查找平行光、环境光
        // const dirLight = lightGroup.children.find(c => c.isDirectionalLight);
        const ambLight = lightGroup.children.find(c => c.isAmbientLight);

        // 去除平行光
        // if (dirLight) {
        //     // dirLight.intensity = 1;
        //     dirLight.visible = false;
        //     this.Scene.add(dirLight);
        //     this.lights.push(dirLight);
        // }

        if (ambLight) {
            // ambLight.intensity = 0.8;
            ambLight.visible = false;
            this.Scene.add(ambLight);
            this.lights.push(ambLight);
        }
    }

    // 加载楼层土建楼板模型并缓存
    async _loadAndShowCF() {
        this.floorMeshGroup.visible = true;
        const floorId = this._curFloorId;
        if (!floorId) {
            return;
        }
        if (this.floorIdMapModel[floorId]?.cfModel || this.floorIdMapModel[floorId]?.floorModel) {
            return;
        }
        const infinityLevelStyles = {
            hide: {
                show: false,
                priority: Infinity
            },
            normal: {
                color: '#9ba5ae',
                useLinearColor: false,
                show: true,
                materialType: THREE.MeshBasicMaterial.name
            }
        };
        this.loadings.floorLoading.value = true;

        try {
            if (!this.floorIdMapModel[floorId]) {
                this.floorIdMapModel[floorId] = {};
            }
            this.graphResourceManager.floorId = floorId;
            const initPromises = [];
            initPromises.push(this.graphResourceManager.loadCfResource(floorId, infinityLevelStyles));
            initPromises.push(this.graphResourceManager.loadFloorMeshInfos(floorId, { ...infinityLevelStyles }));
            await Promise.allSettled(initPromises).then(res => {
                if (this.floorIdMapModel[floorId]?.cfModel || this.floorIdMapModel[floorId]?.floorModel) {
                    return;
                }
                if (res[0].status === 'fulfilled' && res[0].value) {
                    const { equip, mesh, styles } = res[0].value;

                    equip.setStateStyles(styles);

                    // 土建楼板模型添加到根节点模型
                    this.rootNodeModel.addChild(equip);
                    if (this.floorIdMapModel[floorId]) {
                        this.floorIdMapModel[floorId].cfModel = equip;
                        this.floorIdMapModel[floorId].mesh = mesh;
                    }
                } else {
                    console.log('loadCfResource error: ', res[0]);
                }

                if (res[1].status === 'fulfilled' && res[1].value) {
                    const { mesh: floorMesh, equip } = res[1].value;
                    if (!floorMesh) {
                        return;
                    }

                    // 禁用用户交互
                    equip.userinteractionEnable = false;
                    // 添加楼层网格到楼层网格组容器
                    this.floorMeshGroup.add(floorMesh);

                    // 压缩楼板，避免有天花板的mesh
                    if (this.floorIdMapModel[floorId]) {
                        this.floorIdMapModel[floorId].floorModel = equip;
                        floorMesh.material.side = THREE.FrontSide;
                        this.floorIdMapModel[floorId].floorMesh = floorMesh;
                    }

                    const material = new THREE.MeshBasicMaterial({ color: '#DFE6EE' });
                    material.side = THREE.FrontSide;
                    floorMesh.material = material;

                    floorMesh.scale.set(1, 1, 0.0000001);

                    const floor = getFloorInfoByFloorId(floorId);
                    const floorElevation = M2FOOT * Number(floor.floorElevation || 0);
                    const translateHeight = floorElevation - 0.1;
                    floorMesh.position.y = translateHeight;
                } else {
                    console.log('loadFloorMeshInfos error: ', res[1]);
                }
            });
        } catch (e) {
            console.error('loadCf error: ', e);
        } finally {
            this.loadings.floorLoading.value = false;
        }
    }

    // 获取边界裁剪框
    _clipBox() {
        const fId = this._curFloorId;
        if (!fId) {
            return;
        }

        const boundingBox = new THREE.Box3();
        Object.keys(this.floorIdMapModel).forEach(floorId => {
            if (fId === floorId) {
                const { floorMesh, cfMesh } = this.floorIdMapModel[fId];
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

    // 更新楼层相关模型显隐
    _updateFloorObjectsShow() {
        const curFloorId = this._curFloorId;
        // 土建楼板显隐
        Object.keys(this.floorIdMapModel).forEach(fId => {
            // 非全楼情况下
            // 只显示本楼层的土建楼板
            const { cfModel, floorMesh } = this.floorIdMapModel[fId];
            const isNotCurFloor = fId !== curFloorId;
            cfModel?.setState('hide', isNotCurFloor);
            if (floorMesh) {
                floorMesh.visible = !isNotCurFloor;
            }
        });
    }

    _switchCamera() {
        if (this.curClipBox) {
            // 设置边界为当前裁剪框
            this.controls?.setBoundary?.(this.curClipBox);

            // 限制极角为0，摄像机只能平移不能倾斜
            this.controls.minPolarAngle = 0;
            this.controls.maxPolarAngle = 0;

            // 设置鼠标左键为平移操作，右键为旋转操作
            if (this.controls.mouseButtons) {
                this.controls.mouseButtons.left = CameraControls.ACTION.TRUCK;
                this.controls.mouseButtons.right = CameraControls.ACTION.ROTATE;
            }

            // 缩放范围
            this.controls.minZoom = 0.1;
            this.controls.maxZoom = 25;

            // 调整相机以适应裁剪框，并留出边距，然后保存状态
            this.controls?.fitToBox?.(this.curClipBox, true, { paddingLeft: 60, paddingRight: 20, paddingBottom: 40, paddingTop: 40 }).then(() => {
                this.controls.saveState();
            });
        }
    }

    _switchLights() {
        this.lights?.forEach(light => {
            light.visible = true;
            // light.intensity = 0.8;
        });
    }

    // MARK: 初始化场景
    // initLoader、renderFloor、createElements
    // 相机复位
    restoreCamera() {
        this.controls.reset(true);
    }

    async moveCameraToBox(spotItem, callback) {
        const spotId = spotItem?.objectId || spotItem?.id;
        const spotCurrentFloorId = spotItem?.floorId;

        if (spotCurrentFloorId) {
            const equip = spotId ? this.mainEquipModelMap.get(spotId) : false;
            if (equip) {
                const { centerPointer } = equip || {};

                // A、重置视角 this.restoreCamera();
                // B、重置到包围盒边界
                // this.controls?.fitToBox?.(box3, true, { paddingLeft: 60, paddingRight: 20, paddingBottom: 40, paddingTop: 40 }).then(() => {
                //     this.controls.saveState();
                // });
                // C、平移到包围盒中心点，使用相对移动量
                const currentCameraPosition = this.camera.position;
                const deltaX = centerPointer.x - currentCameraPosition.x;
                const deltaZ = centerPointer.z - currentCameraPosition.z;
                this.controls?.truck?.(deltaX, deltaZ, true);
                this.unselectModel();
                this.selectEquipModel(equip);
                callback?.();
            }
        }
    }

    resize() {
        super.resize();
        this.renderContext.canvasPropsInitialize();
    }

    async initLoader() {
        const loadPromises = [];
        await this.floorMapSceneLoader.init();
        loadPromises.push(this._loadSceneBackground());
        loadPromises.push(this._loadSceneLights());
        await Promise.allSettled(loadPromises);
    }

    async renderFloor(floorId) {
        this._curFloorId = floorId;
        // 切换过渡中，隐藏页面元素
        this._updateFloorObjectsShow();
        this.rootNodeModel.setState('hidden', true);
        if (this.css3dRender.domElement.style) {
            this.css3dRender.domElement.style.display = 'none';
        }

        console.time('loadAndShowCF');
        await this._loadAndShowCF();
        console.timeEnd('loadAndShowCF');
        this._clipBox();

        this._updateFloorObjectsShow();
        this.rootNodeModel.setState('hidden', false);
        if (this.css3dRender.domElement.style) {
            this.css3dRender.domElement.style.display = 'block';
        }

        this._switchCamera();
        this._switchLights();

        this._collisionInvokeDebounce();
    }

    // 创建空间、设备图元等
    createElements(totalData) {
        const { spaces = [], parkingSpots = [], camerasOrGates = [] } = totalData;
        // console.log('createElements---spaces: ', spaces, this._curFloorId);

        this.graphResourceManager.cancelAll();
        this.removeDynamicObjects();
        this.equipItemCollisionDetector.clearElements();

        // const floorInfo = getFloorInfoByFloorId(this._curFloorId);
        // const { floorElevation } = floorInfo;

        spaces.forEach(objData => {
            if (this.mainSpaceModelMap.has(objData.id)) {
                return;
            }
            const floorHeight = M2FOOT * Number(objData.floorElevation || 0);
            const spaceModel = createSpaceModel(objData, floorHeight);
            const isEntranceAndExitItem = isEntranceAndExit(objData.roomFuncType);

            if (spaceModel) {
                // #空间标签图元
                const spaceLabel = createSpaceLabelInfoModel(objData, floorHeight);
                spaceModel.addChild(spaceLabel);

                Object.keys(spaceLabel.defineStyles).forEach(key => {
                    spaceLabel.defineStyles[key].iconShow = isEntranceAndExitItem;
                });

                // const hide = objData.floorId !== this._curFloorId;
                // spaceModel.setState('hide', hide);

                this.rootNodeModel.addChild(spaceModel);
                this.mainSpaceModelMap.set(objData.id, spaceModel);
            }
        });

        parkingSpots.forEach(objData => {
            const parkingSpotModel = createParkingPlaceModel(objData);
            this.rootNodeModel.addChild(parkingSpotModel);
            const nameModel = createParkingPlaceNameModel(objData, parkingSpotModel);
            parkingSpotModel.addChild(nameModel);
            if (objData.chargeStation) {
                const chargeStationModel = createChargingStationModel(objData.chargeStation, parkingSpotModel);
                this.rootNodeModel.addChild(chargeStationModel);
                const stName = createParkingPlaceNameModel(objData.chargeStation, chargeStationModel);
                chargeStationModel.addChild(stName);
                this.mainEquipModelMap.set(`${objData.id}-${objData.chargeStation.id}`, chargeStationModel);
            }
            this.mainEquipModelMap.set(objData.id, parkingSpotModel);
        });

        camerasOrGates.forEach(objData => {
            const equipIconInfoModel = createCamerasOrGatesModel(objData);
            this.rootNodeModel.addChild(equipIconInfoModel);
            this.mainEquipModelMap.set(objData.id, equipIconInfoModel);
        });
    }

    updateElementsShow() {
        this.equipItemCollisionDetector.clearElements();
        this.mainSpaceModelMap.forEach(model => {
            model.setAsyncState('filterHide', this._curFloorId !== model.spaceData.floorId);
        });
        this.mainEquipModelMap.forEach(model => {
            const filterHide = this._curFloorId !== model.data.floorId;
            model.setAsyncState('filterHide', filterHide);
            // 加入碰撞器
            if (!filterHide && model.name === modelNameEnum.PLEquipIconInfo) {
                this.equipItemCollisionDetector.addElement(model);
            }
        });
        this._collisionInvokeDebounce();
    }

    updateSpaceStatus(abnormalFloorIdsSet) {
        const stateNames = ['openForBusiness', 'closedForBusiness', 'abnormal'];
        const { getCustomInfo } = DockSingleton.getInstance();
        this.mainSpaceModelMap.forEach(model => {
            if (!model.getState('hide') && !model.getState('filterHide')) {
                const { _infoMapOrigin, floorId, id } = model.spaceData || {};

                model.clearStatesAsync(stateNames);
                Object.entries(_infoMapOrigin).forEach(([key, value]) => {
                    if (value) {
                        const originDataValue = value.dataValue;
                        if (key === 'alarmstatus') {
                            const isAbnormal = originDataValue === 'alarmstatus';
                            model.setAsyncState('abnormal', isAbnormal);
                            if (abnormalFloorIdsSet && isAbnormal) {
                                abnormalFloorIdsSet.add(floorId);
                            }
                        } else if (key === 'openTime') {
                            if (originDataValue) {
                                const isInTimeRange = isWithinTimeRange(originDataValue);
                                if (isInTimeRange) {
                                    model.setAsyncState('openForBusiness', true);
                                } else {
                                    model.setAsyncState('closedForBusiness', true);
                                }
                            }
                        }
                    }
                });

                // 取dashboard注入的自定义信息点数据，判断空间营业时间
                const calendarObj = getCustomInfo(id, 'CALENDAR_WORK_TIME_SELF', 'calendarWorkTimeSelf');
                const calendarWorkTimeValue = calendarObj?.dataValue ?? [];
                if (Array.isArray(calendarWorkTimeValue) && calendarWorkTimeValue?.length) {
                    const isWorkTime = calendarWorkTimeValue.some(time => {
                        const isInTimeRange = isWithinTimeRange(time);
                        return isInTimeRange;
                    });
                    if (isWorkTime) {
                        model.setAsyncState('openForBusiness', true);
                    } else {
                        model.setAsyncState('closedForBusiness', true);
                    }
                }
            }
        });
    }
    _updateEquipStatus(model, stateNames = ['idle', 'occupy', 'abnormal'], abnormalFloorIdsSet) {
        const data = model?.spaceData || model?.data;
        if (!data) return;
        const { _infoMapOrigin, floorId } = data || {};

        model.clearStatesAsync(stateNames);
        Object.entries(_infoMapOrigin).forEach(([key, value]) => {
            if (value) {
                const originDataValue = value.dataValue;
                if (key === 'alarmstatus') {
                    const isAbnormal = originDataValue === 'alarmstatus';
                    if (isAbnormal) {
                        // console.log('originDataValue: ', originDataValue, model);
                    }
                    model.setAsyncState('abnormal', isAbnormal);
                    if (isAbnormal) {
                        abnormalFloorIdsSet.add(floorId);
                    }
                } else if (key === 'parkingStatus') {
                    const stateName = PARKING_STATE_MAP[originDataValue];
                    if (stateName) {
                        model.setAsyncState(stateName, true);
                    }
                } else if (key === 'onlineStatus') {
                    model.setAsyncState('offline', originDataValue === '0');
                    model.setAsyncState('online', originDataValue === '1');
                }
            }
        });
    }

    sseRefreshIotInfo() {
        const abnormalFloorIdsSet = new Set();
        this.updateSpaceStatus(abnormalFloorIdsSet);
        this.mainEquipModelMap.forEach(equipModel => {
            if (!equipModel.getState('filterHide')) {
                if (equipModel.name === modelNameEnum.ParkingPlace) {
                    this._updateEquipStatus(equipModel, ['idle', 'occupy', 'abnormal'], abnormalFloorIdsSet);
                } else {
                    this._updateEquipStatus(equipModel, ['abnormal', 'offline', 'online'], abnormalFloorIdsSet);
                }
            }
        });
        return abnormalFloorIdsSet;

        // this._collisionInvokeDebounce();
    }

    removeDynamicObjects() {
        this.mainSpaceModelMap.forEach(v => {
            this.rootNodeModel.removeChild(v);
        });
        this.mainSpaceModelMap.clear();

        this.mainEquipModelMap.forEach(v => {
            this.rootNodeModel.removeChild(v);
        });
        this.mainEquipModelMap.clear();
    }

    removeAllObjects() {
        this.removeDynamicObjects();
        this.floorIdMapModel = {};
    }

    // MARK: 更新阶段
    // 每次帧调用时 Update 会在 threejs 渲染器渲染前执行
    Update() {
        super.Update();
        this.effectLoader?.update();
        this.renderContext?.frameAnimationLoop();
    }

    // MARK: 销毁阶段
    // 当场景实例调用 dispose 方法销毁场景时会执行 Destroy 生命周期函数，Destroy 会在场景,相机销毁之前执行
    Destroy() {
        this.removeAllObjects();
        this.tracker.dispose();
        this.graphResourceManager.cancelAll();
        this.graphResourceManager.dispose();
        this.floorMapSceneLoader.dispose();
    }
}
