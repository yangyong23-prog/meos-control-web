// @ts-ignore
import i18n from '@/localization';
import { WebGLScene } from '@yushu/core3d';
import * as THREE from '@yushu/three-base';
import CameraControls from 'camera-controls';
import VisibilityContext from '@/views/GraphMVC/graphScene/Context/VisibilityContext';
import RootNode from '@/views/GraphMVC/graphScene/RootNode/RootNode';
import Controller from '@/views/GraphMVC/core/Controller';
import { ThreadPool } from '@/utils/ThreadPool';
import { GraphResourceManager } from '@/views/GraphMVC/utils/GraphResourceManager';
import { INTERFACE_PREFIX_RWD } from '@/config';
import { modelNameEnum, RenderOrder, StatePriority } from '@/views/GraphMVC/graphScene/GraphSceneDefine';
import { getFloorInfoByFloorId } from '@/utils/buildingUtils';
import FlowSpaceIconInfo from './graph/FlowSpaceIconInfo/FlowSpaceIconInfo';
import _, { debounce, forEach } from 'lodash';
import FlowSpaceCardCollisionDetector from './graph/FlowSpaceCardCollisionDetector/FlowSpaceCardCollisionDetector';
import { parseMainBuildingBoardInfo, isFloor, isFloorFrame, calcFloorDirectionalLight, restoreControls, convertP3ToP2 } from '@/apm-3d/utils/buildingTools';
import Space from '@/views/GraphMVC/graphScene/Space/Space';
import FlowEquipIconInfo from './graph/FlowEquipIconInfo/FlowEquipIconInfo';

// eslint-disable-next-line import/extensions
import RevitPipleWorker from '@/views/GraphMVC/workers/RevitPiple.worker.js?worker';
const { M2FOOT, MM2FOOT, ResourceTracker } = THREE.baseUtils;

import { SceneLoader, EffectLoader, EdgeMaterial } from '@yushu/effecttool';
import { baseColors } from '@/constants/baseColors';

const D3_SCENE_NAME = '05_building_classic';
export default class PublicMapScene extends WebGLScene {
    constructor({ projectId = 'Pj1101050031', groupCode, env = 'production', loadings, bgColor }) {
        super();
        this.projectId = projectId;
        this.groupCode = groupCode;
        this.env = env;

        this.floorIdMapModal = {}; // 楼层id映射模型

        this.loadings = loadings;

        RootNode.registerAll();
        this.bgColorRef = bgColor;

        this._collisionInvokeDebounce = debounce(this.invokeScaleAndCollision, 20);
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

        this.floorMapSceneLoader = new SceneLoader(this.env, this.projectId, D3_SCENE_NAME, this.renderer);

        // 模式对应灯光
        this.lights = [];
        // 模式对应背景
        this.bgModeMap = {};
        this.linkLines = [];

        this.initCamera();

        // 后处理工具
        this.effectLoader = new EffectLoader(this.env, this.renderer);
        this.composer = this.effectLoader.getComposer(this.Scene, this.camera);
        this.setComposser(this.composer);

        // 存储所有空间
        this.mainSpaceModelMap = new Map();

        // 存储所有设备
        this.equipIconInfoModelMap = new Map();

        // 注册MapMvc
        this.renderContext = new VisibilityContext(this);
        this.renderContext.init('3d');

        this.rootNodeModel = new RootNode();
        this.mapController = new Controller(this.rootNodeModel, this.renderContext);
        this.mapController.delegate = this;

        this.flowSpaceCardCollisionDetector = new FlowSpaceCardCollisionDetector(this.renderContext);

        // 资源管理器
        this.materialManager = this.renderContext.materialManager;
        this.graphResourceManager = new GraphResourceManager({
            projectId: this.projectId,
            groupCode: this.groupCode,
            env: this.env,
            bdtpUrl: INTERFACE_PREFIX_RWD,
            materialManager: this.materialManager
        });

        this.threadPool = new ThreadPool({
            WorkerConstructor: RevitPipleWorker
        });

        this.bindEvent();

        this.tracker = new ResourceTracker();
        this.tracker.track(this.floorMeshGroup);
        this.tracker.track(this.meshGroup);
    }

    hoverModel(model) {
        model?.setState('hover', true);
        this.currentHoverModel = model;
    }

    unhoverModel() {
        if (this.currentHoverModel) {
            this.currentHoverModel.setState('hover', false);
            this.currentHoverModel.setState('abnormalHover', false);
            this.currentHoverModel = null;
            this.dispatchEvent({
                type: 'onUnHover',
                data: {}
            });
        }
    }

    hoverSpaceModel(sapceModel) {
        // 判断下是不是异常状态 TODO
        this.hoverModel(sapceModel);
        if (sapceModel?.spaceData?._infoMap?.alarmstatus?.dataValue === 'alarmstatus') {
            this.currentHoverModel.setState('abnormalHover', true);
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

    selectObjectModel(model) {
        this.selectModel(model);
        this.clickDetail(model.data || model.spaceData);
    }

    invokeScaleAndCollision() {
        this.flowSpaceCardCollisionDetector.collision();
    }

    bindEvent() {
        // 控制器事件
        this.controls.addEventListener('change', () => {
            // 拖拽
            if (this.disabled) return;
            this._collisionInvokeDebounce();
        });
    }

    // controller 调用 hover
    viewOnHoverTargetChanged({ newModel }) {
        if (newModel?.getState('selected')) {
            return;
        }

        this.unhoverModel();

        if (newModel && newModel.name === modelNameEnum.Space) {
            this.hoverSpaceModel(newModel);
            this.css3dRender.domElement.style.cursor = 'pointer';
        } else if (newModel && newModel.name === modelNameEnum.FlowEquipIconInfo) {
            this.hoverModel(newModel);
            this.css3dRender.domElement.style.cursor = 'pointer';
        } else if (!newModel) {
            this.css3dRender.domElement.style.cursor = 'default';
        }
    }

    // controller 调用 长hover
    viewOnLongHoverTargetChanged({ newModel }) {
        if (newModel && newModel.getState('selected')) {
            return;
        }

        if (newModel && newModel.name === modelNameEnum.Space) {
            // TODO
            // this.hoverCard(newModel);
            // this.css3dRender.domElement.style.cursor = 'pointer';
        } else if (newModel && newModel.name === modelNameEnum.FlowEquipIconInfo) {
            this.hoverCard(newModel);
            this.css3dRender.domElement.style.cursor = 'pointer';
        } else if (!newModel) {
            this.css3dRender.domElement.style.cursor = 'default';
        }
    }

    // controller 调用 click
    viewOnClickTarget({ model }) {
        this.unhoverModel();
        this.unselectModel();

        if (model && model.getState('selected')) {
            return;
        }

        if (model && model.name === modelNameEnum.Space) {
            this.selectObjectModel(model);
        } else if (model && model.name === modelNameEnum.FlowEquipIconInfo) {
            this.selectObjectModel(model);
        } else if (!model) {
            this.css3dRender.domElement.style.cursor = 'default';
        }
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

    async initLoader() {
        const loadPromise = [];
        await this.floorMapSceneLoader.init();
        loadPromise.push(this._loadeSceneBackground());
        loadPromise.push(this._loadeSceneLights());
        await Promise.allSettled(loadPromise);
    }

    async _loadeSceneBackground() {
        const color = await this.floorMapSceneLoader.getSceneBackground(this.renderer);
        if (color) this.Scene.background = color;
    }

    async _loadeSceneLights() {
        const lightGroup = await this.floorMapSceneLoader.initLightAndShadow();
        const dirlight = lightGroup.children.find(c => c.isDirectionalLight);
        const amlight = lightGroup.children.find(c => c.isAmbientLight);
        if (dirlight) {
            this.Scene.add(dirlight);
            dirlight.intensity = 1;
            this.lights.push(dirlight);
        }
        if (amlight) {
            amlight.intensity = 0.8;
            this.Scene.add(amlight);
            this.lights.push(amlight);
        }
    }

    async renderFloor(floorId) {
        this.rootNodeModel.setState('hidden', true);
        this.mainSpaceModelMap.forEach(model => {
            model.setState('hide', true);
        });
        this.equipIconInfoModelMap.forEach(model => {
            model.setState('hide', true);
        });
        this._curFloorId = floorId;

        this._updateFloorObjectsShow();

        await this._loadAndShowCF();
        this.mainSpaceModelMap.forEach(model => {
            model.setState('hide', false);
        });
        this.equipIconInfoModelMap.forEach(model => {
            model.setState('hide', false);
        });
        this._clipBox();
        this.rootNodeModel.setState('hidden', false);
        if (this.css3dRender.domElement.style) {
            this.css3dRender.domElement.style.display = 'block';
        }

        this._updateFloorObjectsShow();
        this._switchCamera();
        this._switchLights();
    }

    setIotInfoExpress(model) {
        const data = model?.spaceData || model?.data;
        if (!data) return;
        const { _infoMap, _infoMapOrigin } = data || {};
        Object.keys(_infoMapOrigin).forEach(key => {
            const originValue = _infoMapOrigin[key].dataValue;
            const oldDataValue = _infoMap[key]?.dataValue;
            if (originValue !== oldDataValue) {
                if (_infoMap[key]) {
                    _infoMap[key].dataValue = originValue;
                    if (key === 'alarmstatus') {
                        const isAbnormal = _infoMap[key].dataValue === 'alarmstatus';
                        model.setState('abnormal', isAbnormal);
                    } else if (key === 'onlinestatus') {
                        const onlineStatusInfoObj = data._infoMap?.onlineStatus;
                        if (onlineStatusInfoObj) {
                            const dataValue = onlineStatusInfoObj?.dataValue;
                            if (!dataValue) {
                                model.setState('noData', !dataValue);
                                model.setState('offline', false);
                            } else {
                                model.setState('offline', dataValue !== '1');
                            }
                        }
                    } else if (key === 'accmInPeopleFlow') {
                        if (model?.spaceIconInfo?.refreshExsitPeopleNum) {
                            model?.spaceIconInfo?.refreshExsitPeopleNum();
                        }
                    }
                }
            }
        });
    }

    sseRefreshIotInfo() {
        this.mainSpaceModelMap.forEach(spaceModel => {
            this.setIotInfoExpress(spaceModel);
        });
        this.equipIconInfoModelMap.forEach(equipModel => {
            this.setIotInfoExpress(equipModel);
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
            console.log('this.floorIdMapModal[fId]?.cfModel>>>>', this.floorIdMapModal[fId]?.cfModel);

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
                } else {
                    console.error('loadCfResource error: ', rst0);
                }

                if (rst1.status === 'fulfilled' && rst1.value) {
                    const { mesh: floorMesh, equip } = rst1.value;
                    if (!floorMesh) {
                        return;
                    }

                    const floor = getFloorInfoByFloorId(fId);
                    const floorElevation = M2FOOT * Number(floor.floorElevation || 0);

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
                } else {
                    console.error('loadFloorMeshInfos error: ', rst0);
                }
            });
        } catch (e) {
            console.error('loadCf error: ', e);
        }
        this.loadings.floorLoading.value = false;
    }

    // 更新楼层相关模型显隐
    _updateFloorObjectsShow() {
        const curFloorId = this._curFloorId;
        // 土建楼板显隐
        Object.keys(this.floorIdMapModal).forEach(fId => {
            // 非全楼情况下
            // 只显示本楼层的土建楼板
            const { cfModel, floorMesh } = this.floorIdMapModal[fId];
            const val = fId !== curFloorId;
            cfModel?.setState('hide', val);
            if (floorMesh) {
                floorMesh.visible = !val;
            }
        });
    }

    _clipBox() {
        const fId = this._curFloorId;
        if (!fId) {
            return;
        }

        const boundingBox = new THREE.Box3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 1, 1));
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

    _switchCamera() {
        if (this.curClipBox) {
            const { maxDistance: _maxDistance } = restoreControls(this.curClipBox, this.controls, true);
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

    _switchLights() {
        this.lights?.forEach(light => {
            if (light.isDirectionalLight) {
                calcFloorDirectionalLight(this.curClipBox, light);
            }
        });
    }

    // 复位相机
    restoreCamera() {
        this.controls.reset(true).then(() => {
            // this.zoomAfter();
        });
    }

    resize() {
        super.resize();
        this.renderContext.canvasPropsInitialize();
    }

    removeDyncElements() {
        this.mainSpaceModelMap.forEach((v, k) => {
            this.rootNodeModel.removeChild(v);
        });
        this.mainSpaceModelMap.clear();

        this.equipIconInfoModelMap.forEach(v => {
            this.rootNodeModel.removeChild(v);
        });

        this.equipIconInfoModelMap.clear();
    }

    removeAllObjects() {
        this.removeDyncElements();
        this.floorIdMapModal = {};
    }

    createElements(spaces = [], cameras = [], doorGroup = []) {
        this.removeDyncElements();
        this.flowSpaceCardCollisionDetector.clearElements();

        const floorInfo = getFloorInfoByFloorId(this._curFloorId);
        const { floorElevation } = floorInfo;
        const floorHeight = M2FOOT * Number(floorElevation || 0);

        // 1,创建空间
        spaces.forEach(sp => {
            const spaceModel = new Space(sp, 0, floorHeight, 0.2);
            spaceModel.setStateStyles({
                normal: {
                    ...spaceModel.defineStyles.normal,
                    color: '#A1C8E5',
                    renderOrder: RenderOrder.space,
                    priority: 1
                },
                // abnormal: {
                //     color: '#F0ABA8',
                //     renderOrder: RenderOrder.space + 1,
                //     priority: 2
                // },
                hover: {
                    show: true,
                    color: '#7FB5DC',

                    renderOrder: RenderOrder.hover,
                    priority: 3
                },
                // abnormalHover: {
                //     show: true,
                //     color: '#F07D78',
                //     renderOrder: RenderOrder.hover + 1,
                //     priority: 4
                // },
                selected: {
                    show: true,
                    color: '#246FE5',
                    renderOrder: RenderOrder.selected,
                    priority: 5
                },
                hide: {
                    show: false,
                    priority: Infinity
                }
            });
            const isAbnormal = sp._infoMap?.alarmstatus?.dataValue === 'alarmstatus';
            spaceModel.setState('abnormal', isAbnormal);

            // 创建label图元
            const spaceIconInfoModel = new FlowSpaceIconInfo(sp, 0, floorHeight);
            spaceIconInfoModel.setStateStyles({
                normal: {
                    ...spaceModel.defineStyles.normal,
                    cardBgColor: '#fff',
                    cardFontColor: '#1B2129',
                    iconColor: '#7188A6',
                    nameColor: '#1B2129',
                    showCard: true,
                    showMark: false,
                    renderOrder: RenderOrder.space,
                    priority: 1
                },
                collided: {
                    showCard: false,
                    priority: 2
                },
                abnormal: {
                    renderOrder: RenderOrder.space + 1,
                    priority: 2
                },
                hover: {
                    show: true,
                    showCard: true,
                    cardBgColor: '#246FE5',
                    cardFontColor: '#fff',
                    iconColor: '#fff',
                    nameColor: '#246FE5',
                    renderOrder: RenderOrder.hover,
                    priority: 3
                },
                abnormalHover: {
                    showCard: true,
                    renderOrder: RenderOrder.hover + 1,
                    priority: 4
                },
                selected: {
                    show: true,
                    showCard: false,
                    nameColor: '#246FE5',
                    showMark: true,
                    renderOrder: RenderOrder.selected,
                    priority: 5
                }
            });
            spaceModel.addSpaceIconInfo(spaceIconInfoModel);
            this.flowSpaceCardCollisionDetector.addElement(spaceIconInfoModel);

            this.rootNodeModel.addChild(spaceModel);
            this.mainSpaceModelMap.set(sp.id, spaceModel);
        });

        // 2, 创建摄像机 和 门组

        cameras.forEach(data => {
            if (!data.bimLocation) return;
            data.iconType = 'FIRST_CLASS_SMALL_ICON';
            const equipIconInfo = new FlowEquipIconInfo(data);
            const normalStyle = equipIconInfo.defineStyles?.normal || {};
            const renderOrder = RenderOrder.equip;
            equipIconInfo.setStateStyles({
                normal: {
                    ...normalStyle,
                    show: true, // 是否显示
                    iconBgColor: '#FCF5FF',
                    iconBorderColor: '#8252E3',
                    iconColor: '#8252E3',
                    showText: false,
                    renderOrder,
                    priority: 1
                },
                noData: {
                    iconBgColor: '#FCF5FF',
                    iconBorderColor: '#C4C9CF',
                    iconColor: '#C4C9CF',
                    renderOrder: renderOrder + 1,
                    priority: 2
                },
                offline: {
                    iconBgColor: '#C4C9CF',
                    iconBorderColor: '#8B949E',
                    iconColor: '#8B949E',
                    renderOrder: renderOrder + 2,
                    priority: 3
                },
                abnormal: {
                    dotColor: `${baseColors['$red-500']}`,
                    renderOrder: renderOrder + 4,
                    priority: 4
                },
                hover: {
                    show: true,
                    iconBgColor: '#FCF5FF',
                    iconBorderColor: '#8252E3',
                    iconColor: '#8252E3',
                    showText: true,
                    textColor: '#ffffff', // 字体颜色
                    textShadow: '', // 字体描边
                    textBgColor: '#246FE5', // 文字背景
                    textBorder: '1px solid #fff',
                    showMark: false, // 显示标记
                    renderOrder: RenderOrder.hover,
                    priority: 5
                },
                selected: {
                    show: true,
                    iconBgColor: '#246FE5',
                    iconBorderColor: '#246FE5',
                    iconColor: '#fff',
                    showText: true,
                    textColor: '#ffffff', // 字体颜色
                    textShadow: '', // 字体描边
                    textBgColor: '#246FE5', // 文字背景
                    textBorder: '1px solid #fff',
                    showMark: true, // 显示标记
                    renderOrder: RenderOrder.selected,
                    priority: 6
                },
                hide: {
                    show: false,
                    priority: Infinity
                }
            });

            const isAbnormal = data._infoMap?.alarmstatus?.dataValue === 'alarmstatus';
            equipIconInfo.setState('abnormal', isAbnormal);
            const onlineStatusInfoObj = data._infoMap?.onlineStatus;
            if (onlineStatusInfoObj) {
                const dataValue = onlineStatusInfoObj?.dataValue;
                if (!dataValue) {
                    equipIconInfo.setState('noData', !dataValue);
                    equipIconInfo.setState('offline', false);
                } else {
                    equipIconInfo.setState('offline', dataValue !== '1');
                }
            }

            this.equipIconInfoModelMap.set(data.id, equipIconInfo);
            this.rootNodeModel.addChild(equipIconInfo);
        });

        doorGroup.forEach(data => {
            if (!data.bimLocation) return;
            data.iconType = 'FIRST_CLASS_SMALL_ICON';
            const equipIconInfo = new FlowEquipIconInfo(data);
            const normalStyle = equipIconInfo.defineStyles?.normal || {};
            const renderOrder = RenderOrder.equip;
            equipIconInfo.setStateStyles({
                normal: {
                    ...normalStyle,
                    show: true, // 是否显示
                    renderOrder
                },
                authorizedAccess: {
                    iconBgColor: '#45AFFE', // 图标背景
                    priority: RenderOrder.equip + 1
                },
                hover: {
                    show: true,
                    showText: true,
                    textColor: '#ffffff', // 字体颜色
                    textShadow: '', // 字体描边
                    iconBgColor: '#246FE5',
                    textBgColor: '#246FE5', // 文字背景
                    textBorder: '1px solid #fff',
                    showMark: false, // 显示标记
                    renderOrder: RenderOrder.hover,
                    priority: StatePriority.hover
                },
                selected: {},
                hide: {
                    show: false,
                    priority: Infinity
                }
            });

            this.equipIconInfoModelMap.set(data.id, equipIconInfo);
            this.rootNodeModel.addChild(equipIconInfo);
        });

        this._collisionInvokeDebounce();
    }

    clickDetail(obj) {
        this.dispatchEvent({ type: 'clickDetail', data: obj });
    }

    clickMapObj(obj) {
        this.unhoverModel();
        this.unselectModel();
        const space = this.mainSpaceModelMap.get(obj.id);
        if (space) {
            this.selectModel(space);
            return;
        }
        const equip = this.equipIconInfoModelMap.get(obj.id);
        if (equip) {
            this.selectModel(equip);
        }
    }

    hoverMapObj(obj) {
        this.unhoverModel();
        const space = this.mainSpaceModelMap.get(obj.id);
        if (space) {
            this.hoverSpaceModel(space);
            return;
        }
        const equip = this.equipIconInfoModelMap.get(obj.id);
        if (equip) {
            this.hoverModel(equip);
            this.hoverCard(equip);
        }
    }

    unhoverMapObj() {
        this.unhoverModel();
    }

    hoverCard(model) {
        const pos = convertP3ToP2(this.renderContext, model?.data?.bimLocation || model.spaceData?.bimLocation);
        this.dispatchEvent({
            type: 'onHoverCard',
            data: { pos, instance: model?.data || model?.spaceData }
        });
    }

    Destroy() {
        this.removeAllObjects();
        this.tracker.dispose();
        this.graphResourceManager.cancelAll();
        this.graphResourceManager.dispose();
        this.floorMapSceneLoader.dispose();
        this.threadPool.destroy();
    }
}
