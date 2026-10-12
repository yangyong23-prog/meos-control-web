// @ts-ignore
import i18n from '@/localization';
import { WebGLScene } from '@yushu/core3d';
import { baseUtils } from '@yushu/three-base';
import RootNode from '@/views/GraphMVC/graphScene/RootNode/RootNode';
import { SceneLoader, EffectLoader, EdgeMaterial } from '@yushu/effecttool';
import { modelNameEnum, RenderOrder, StatePriority } from '@/views/GraphMVC/graphScene/GraphSceneDefine';
import { calcFloorDirectionalLight, restoreControls, convertV3ToP2, convertCoordinateByBluetoothSignCalLocation } from '@/apm-3d/utils/buildingTools';
import VisibilityContext from '@/views/GraphMVC/graphScene/Context/VisibilityContext';
import { GraphResourceManager } from '@/views/GraphMVC/utils/GraphResourceManager';
import * as THREE from '@yushu/three-base';
import Controller from '@/views/GraphMVC/core/Controller';
import CameraControls from 'camera-controls';
import { INTERFACE_PREFIX_RWD } from '@/config';
import { getFloorInfoByFloorId, getFloorInfoByLocalName } from '@/utils/buildingUtils';
import Space from '@/views/GraphMVC/graphScene/Space/Space';
import RobotInfo from './RobotInfo/RobotInfo';
const { getD3PosByBimLocation } = baseUtils;

const D3_SCENE_NAME = '05_building_classic';

const { M2FOOT, MM2FOOT, ResourceTracker } = THREE.baseUtils;
export default class RobotFloorScene extends WebGLScene {
    constructor({ projectId = 'Pj1101050031', groupCode, env = 'production' }) {
        super();
        this.projectId = projectId;
        this.groupCode = groupCode;
        this.env = env;
        this.floorIdMapModal = {}; // 楼层id映射模型
        this._equipAllDataMap = new Map();
        this.equipModelMap = new Map();
        RootNode.registerAll();
    }

    Init({ renderer }) {
        this.useCameraControls = true;
        const size = new THREE.Vector2();
        renderer.getSize(size);
        this.camera = new THREE.OrthographicCamera(size.x / -2, size.x / 2, size.y / 2, size.y / -2, 0.01, 20000);
        this.camera.position.set(0, 300, 0);
    }

    Create() {
        this.meshGroup = new THREE.Group();
        this.Scene.add(this.meshGroup);

        this.floorMeshGroup = new THREE.Group();
        this.Scene.add(this.floorMeshGroup);

        const defaultBg = new THREE.Color('#D6DDE5');
        this.Scene.background = defaultBg;

        // 场景加载器
        this.floorMapSceneLoader = new SceneLoader(this.env, this.projectId, D3_SCENE_NAME, this.renderer);

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

        // this.bindEvent();

        this.tracker = new ResourceTracker();
        this.tracker.track(this.floorMeshGroup);
        this.tracker.track(this.meshGroup);
    }

    // controller 调用
    viewOnHoverTargetChanged({ newModel }) {
        if (newModel?.getState('selected')) {
            return;
        }

        this.dispatchEvent({
            type: 'onUnHover',
            data: {}
        });

        this.unhoverModel();
        if (newModel && newModel.name === modelNameEnum.RobotInfo) {
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

        if (newModel && newModel.name === modelNameEnum.RobotInfo) {
            this.hoverCard(newModel);
            this.css3dRender.domElement.style.cursor = 'pointer';
        }
    }

    hoverModel(model) {
        model?.setState('hover', true);
        this.currentHoverModel = model;
    }

    unhoverModel() {
        if (this.currentHoverModel) {
            this.currentHoverModel.setState('hover', false);
            this.currentHoverModel = null;
        }
    }

    hoverCard(model) {
        if (!model.equipData?.bluetoothSignCalLocation) return;
        const posVec3 = getD3PosByBimLocation(convertCoordinateByBluetoothSignCalLocation(model.equipData?.bluetoothSignCalLocation));
        posVec3.setY(this.floorHeight + this.height + 0.1);
        const pos = convertV3ToP2(this.renderContext, posVec3);
        this.dispatchEvent({
            type: 'onHoverCard',
            data: { pos, instance: model?.data || model.equipData }
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

    async switchFloor(floorId) {
        this._curFloorId = floorId;
        const { floorElevation, height } = getFloorInfoByFloorId(this._curFloorId);
        this.floorHeight = M2FOOT * Number(floorElevation || 0);
        this.height = M2FOOT * Number(height || 0);

        await this._loadAndShowCF();
        await this._clipBox();
        this._switchLights();
        this._switchCamera();
        this._createSpaces();
        this._creatEquips();
    }

    handlerCarry(data, model) {
        if (data.cartLoadStatus === '1') {
            model.setState('carry', true);
            if (data.cartId) {
                const boxModel = this.equipModelMap.get(data.cartId);
                boxModel?.setState('hide', true);
            }
        } else {
            model.setState('carry', false);
            if (data.cartId) {
                const boxModel = this.equipModelMap.get(data.cartId);
                boxModel?.setState('hide', false);
                data.cartId = '';
            }
        }
    }

    iotDataChange({ data }) {
        const { objectId, infoCode, dataValue } = data;
        const eqData = this._equipAllDataMap.get(objectId);
        if (!eqData) return;
        const cahcheEqModel = this.equipModelMap.get(objectId);
        if (infoCode === 'sysFloor') {
            const { id: floorId } = getFloorInfoByLocalName(dataValue);
            eqData.floorId = floorId;
            if (floorId !== this._curFloorId) {
                if (cahcheEqModel) {
                    this.rootNodeModel.removeChild(cahcheEqModel);
                    this.equipModelMap.delete(objectId);
                }
            } else {
                if (!cahcheEqModel) {
                    const equipModel = new RobotInfo(eqData, { floorHeight: this.floorHeight, height: this.height });
                    this.handlerCarry(eqData, equipModel);
                    this.rootNodeModel.addChild(equipModel);
                    this.equipModelMap.set(eqData.id, equipModel);
                }
            }
        } else if (infoCode === 'bluetoothSignCalLocation') {
            eqData[infoCode] = dataValue;
            if (!cahcheEqModel) {
                console.log('没有已经创建的RobotInfo');
                return;
            }
            cahcheEqModel.emit('iotDataChange', data);
        } else if (infoCode === 'cartLoadStatus' || infoCode === 'cartId') {
            // 目前只考虑一个机器人携带一个箱子,如果一个机器人已经携带了一个箱子，再推过来一条数据携带另一个箱子，我这边的处理逻辑是 把之前的箱子丢掉（即显示在地图上），把当前箱子携带上（即从地图上隐藏）
            if (infoCode === 'cartId' && eqData.cartId !== dataValue) {
                const boxModel = this.equipModelMap.get(eqData.cartId);
                boxModel?.setState('hide', false);
            }

            eqData[infoCode] = dataValue;
            if (!cahcheEqModel) {
                console.log('没有已经创建的RobotInfo');
                return;
            }

            this.handlerCarry(eqData, cahcheEqModel);
        }
    }

    setAllEquips(equipAllMap) {
        this._equipAllDataMap = equipAllMap;
    }

    getCartIds() {
        const filterEquips = [...this._equipAllDataMap.values()].filter(equip => {
            return equip.cartLoadStatus === '1' && equip.cartId;
        });
        const allCartIds = filterEquips.map(equip => equip.cartId);
        console.log('allCartIds>>>', allCartIds);

        return allCartIds;
    }

    _creatEquips() {
        this.equipModelMap?.size > 0 &&
            this.equipModelMap.values().forEach(e => {
                this.rootNodeModel.removeChild(e);
            });
        this.equipModelMap = new Map();
        const allCartIds = this.getCartIds();

        // PDPDRB-机器人，PDPDBX-搬运箱
        this._equipAllDataMap
            .values()
            .filter(e => {
                return e.floorId === this._curFloorId;
            })
            .forEach(equip => {
                const equipModel = new RobotInfo(equip, { floorHeight: this.floorHeight, height: this.height });
                if (equip.cartLoadStatus === '1') {
                    equipModel.setState('carry', true);
                } else {
                    equipModel.setState('carry', false);
                }
                if (allCartIds.indexOf(equip.id) > -1) {
                    equipModel.setState('hide', 1);
                }
                this.equipModelMap.set(equip.id, equipModel);
                this.rootNodeModel.addChild(equipModel);
            });
    }

    resize() {
        super.resize();
        this.renderContext.canvasPropsInitialize();
    }

    _createSpaces() {
        this.spaces &&
            this.spaces.forEach(s => {
                this.rootNodeModel.removeChild(s);
            });
        this.spaces = [];
        const colorMap = {
            'SFT-01': '#E8EEF2',
            'SFT-02': '#C2CFF2',
            'SFT-03': '#FFFFFF',
            'SFT-04': '#E2EBE1',
            'SFT-05': '#E8E8E8'
        };
        const { spaces, floorElevation } = getFloorInfoByFloorId(this._curFloorId);
        spaces.forEach(item => {
            const color = colorMap[item.roomFuncType?.slice(0, 6)] || '#E8EEF2';
            item.color = color;
            const floorHeight = M2FOOT * Number(floorElevation || 0);
            const space = new Space(item, 0, floorHeight);
            this.spaces.push(space);
            // 解除注释
            this.rootNodeModel.addChild(space);
        });
    }

    // 加载楼层土建楼板模型并缓存
    async _loadAndShowCF() {
        this.floorMeshGroup.visible = true;
        const fId = this._curFloorId;
        if (!fId) {
            return;
        }
        if (this.floorIdMapModal[fId]?.cfModel) {
            this._updateFloorObjectsShow();
            return;
        }
        const styles = {
            normal: {
                show: true,
                color: '#C2CCD6',
                useLinearColor: false
            },
            hide: {
                show: false,
                priority: Infinity
            }
        };
        try {
            if (!this.floorIdMapModal[fId]) {
                this.floorIdMapModal[fId] = {};
            }
            this.graphResourceManager.floorId = fId;

            const loadCfParams = {
                floorId: fId,
                styles,
                wallCodes: ['CFCSCL', 'CFCSWL']
            };

            await Promise.allSettled([this.graphResourceManager.loadCfResourceDetail(loadCfParams), this.graphResourceManager.loadFloorMeshInfos(fId, styles)]).then(rst => {
                const [rst0, rst1] = rst;
                if (rst0.status === 'fulfilled' && rst0.value) {
                    const { equip, mesh } = rst0.value;
                    equip.setStateStyles(rst.styles);

                    // 解除注释
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
                    // 解除注释
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
                    // console.log('loadFloorMeshInfos error: ', rst0);
                }
                this._updateFloorObjectsShow();
            });
        } catch (e) {
            console.log('loadCf error: ', e);
        }
    }

    // 更新楼层相关模型显隐
    _updateFloorObjectsShow() {
        const curFloorId = this._curFloorId;
        // 土建楼板显隐
        Object.keys(this.floorIdMapModal).forEach(fId => {
            // 非全楼情况下
            // 只显示本楼层的土建楼板
            const { cfModel, floorMesh } = this.floorIdMapModal[fId];
            let val = fId !== curFloorId;
            cfModel?.setState('hide', val);
            if (floorMesh) {
                floorMesh.visible = !val;
            }
        });
    }

    async initLoader() {
        await this._loadeSceneLights();
    }

    _loadeSceneLights() {
        const addLights = lightGroup => {
            // const dirlight = lightGroup.children.find(c => c.isDirectionalLight);
            const amlight = lightGroup.children.find(c => c.isAmbientLight);
            const lights = [];
            // if (dirlight) {
            //     dirlight.visible = false;
            //     this.Scene.add(dirlight);
            //     lights.push(dirlight);
            // }
            if (amlight) {
                amlight.visible = false;
                // amlight.intensity = amlight.intensity / Math.PI;
                this.Scene.add(amlight);
                lights.push(amlight);
            }
            this.lights = lights;
        };
        return this.floorMapSceneLoader.initLightAndShadow().then(data => {
            const lights = data;
            addLights(lights);
        });
    }

    _switchLights() {
        this.lights.forEach(light => {
            light.visible = true;
            light.intensity = 0.8;
        });
    }

    _clipBox() {
        const fId = this._curFloorId;
        if (!fId) {
            return;
        }

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
        // 解除注释，等待删除
        if (this.helper) {
            this.Scene.remove(this.helper);
        }
        // this.helper = new THREE.Box3Helper(boundingBox, 0xff0000);
        // this.Scene.add(this.helper);
    }

    _switchCamera() {
        this.controls.mouseButtons.left = CameraControls.ACTION.TRUCK;
        this.controls.mouseButtons.right = CameraControls.ACTION.ROTATE;
        this.controls.minPolarAngle = 0;
        this.controls.maxPolarAngle = 0;
        this.controls.minZoom = 1;
        this.controls.maxZoom = 10;
        this.controls.setBoundary(this.curClipBox);

        this.controls.fitToBox(this.curClipBox, true, { paddingLeft: 60, paddingRight: 20, paddingBottom: 20, paddingTop: 20 }).then(() => {
            this.controls.saveState();
        });
    }

    restoreCamera() {
        this.controls.reset(true);
    }

    removeAllObjects() {
        // this.removeDyncElements();
        this.curRelIdSet.clear();
        // this.floorModalMap = {};
        this.curSpaceShowMap = {};
        this.floorIdMapModal = {};
    }

    Destroy() {
        this.removeAllObjects();
        this.tracker.dispose();
        this.graphResourceManager.cancelAll();
        this.graphResourceManager.dispose();
        this.floorMapSceneLoader.dispose();
    }
}
