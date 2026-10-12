import * as THREE from '@yushu/three-base';
import CameraControls from 'camera-controls';
import RenderContext from '@/views/GraphMVC/core/View/RenderContext';

/* 按比例分为14级的上下文 */

CameraControls.install({ THREE });

const SCALE_ENLARGE_TIME = 14; // 放大次数
const SCALE_RADIO = 0.4; // 放大比例

export default class GraphSceneFloorContext extends RenderContext {
    constructor(webglScene) {
        const { Scene, camera, renderer, controls, css3dRender, effectLoader, canvasWidth, canvasHeight } = webglScene;
        super(Scene, camera, renderer, controls, css3dRender, effectLoader);
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.currentLevel = 0;
    }

    init() {
        this._init2dControl();
        this._init3dControl();
        this._fromCanvasCall = () => {
            this.fromCanvas = true;
        };
        this.css3dRender.domElement.addEventListener('wheel', this._fromCanvasCall);
    }

    restoreControls(box) {
        return new Promise(resolve => {
            const needChange = false;
            this.box = box;
            this.currentLevel = 0;
            this.fromCanvas = false;
            if (this.controls.camera.isPerspectiveCamera) {
                if (this.initSate3d && !needChange) {
                    this.controls.reset(true).then(() => {
                        resolve({ changed: this.controlsChanged });
                        this.controlsChanged = false;
                    });
                } else if (!this.box.isEmpty() && !this.initSate3d) {
                    const height = Math.abs(this.box.max.z - this.box.min.z);
                    const width = Math.abs(this.box.max.x - this.box.min.x);
                    const rotate = this.controls.rotateTo(0, 0, false);
                    const fit = this.controls.fitToBox(this.box, false, {
                        paddingTop: height * 0.1,
                        paddingLeft: width * 0.1,
                        paddingBottom: height * 0.1,
                        paddingRight: width * 0.1
                    });
                    Promise.allSettled([rotate, fit]).then(() => {
                        setTimeout(() => {
                            this._configControlsWithBox();
                            this.controls.saveState();
                            this.initSate3d = true;
                            resolve({ changed: this.controlsChanged });
                            this.controlsChanged = false;
                        });
                    });
                }
                if (this.initSate2d) {
                    this.controls2d.reset(false);
                }
            } else {
                if (this.initSate2d && !needChange) {
                    this.controls.reset(true).then(() => {
                        resolve({ changed: this.controlsChanged });
                        this.controlsChanged = false;
                    });
                } else if (!this.box.isEmpty() && !this.initSate2d) {
                    const height = Math.abs(this.box.max.z - this.box.min.z);
                    const width = Math.abs(this.box.max.x - this.box.min.x);
                    console.log('width height:>> ', width, height);
                    this.controls
                        .fitToBox(this.box, false, {
                            paddingTop: height * 0.1,
                            paddingLeft: width * 0.1,
                            paddingBottom: height * 0.1,
                            paddingRight: width * 0.1
                        })
                        .then(() => {
                            setTimeout(() => {
                                this._configControlsWithBox();
                                this.controls.saveState();
                                this.initSate2d = true;
                                resolve({ changed: this.controlsChanged });
                                this.controlsChanged = false;
                            });
                        });
                }
                if (this.initSate3d) {
                    this.controls3d.reset(false);
                }
            }
        });
    }

    switchControls(type) {
        this._isLastPerspective = this.controls.camera.isPerspectiveCamera ? 1 : 2;
        this.type = type;
        this.controlsChanged = true;
        return this.controls;
    }

    changeZoomLevel(levelStep) {
        return new Promise(resolve => {
            const enlargeLevel = this.currentLevel + levelStep;
            const stepEnable = enlargeLevel > -1 && enlargeLevel < SCALE_ENLARGE_TIME;
            if (!stepEnable) {
                resolve({ changed: false });
                return;
            }
            if (this.controls.camera.isPerspectiveCamera) {
                const distance = this.controls.maxDistance / (1 + SCALE_RADIO * enlargeLevel);
                this.controls.distance = distance;
            } else {
                const zoom = this.controls.minZoom + SCALE_RADIO * this.controls.minZoom * enlargeLevel;
                this.controls.zoomTo(zoom);
            }
            this.currentLevel = enlargeLevel;
            this.controlsChanged = true;
            resolve({ changed: false });
        });
    }

    addEventListener(event, func) {
        this.controls2d.addEventListener(event, func);
        this.controls3d.addEventListener(event, func);
    }

    removeEventListener(event, func) {
        this.controls2d.removeEventListener(event, func);
        this.controls3d.removeEventListener(event, func);
    }

    switchCameraLayerView(enable) {
        this.controls.camera.layers.set(enable ? 0 : 1);
    }

    get controls() {
        if (this.type === '2d') {
            return this.controls2d;
        }
        return this.controls3d;
    }

    set controls(value) {
        this.controls2d = value;
    }

    clear() {
        this.controls2d.maxZoom = Infinity;
        this.controls2d.minZoom = 0.01;
        this.initSate2d = false;

        this.controls.maxDistance = Infinity;
        this.controls.minDistance = Number.EPSILON;
        this.initSate3d = false;
    }

    dispose() {
        this._removeEventBind(this.controls2d);
        this._removeEventBind(this.controls3d);
        this.css3dRender.domElement.removeEventListener('wheel', this._fromCanvasCall);
    }

    // privare method
    _init2dControl() {
        this._camera2d = new THREE.OrthographicCamera(this.canvasWidth / -2, this.canvasWidth / 2, this.canvasHeight / 2, this.canvasHeight / -2, 0.01, 20000);
        this._camera2d.position.set(0, 100, 0);
        // this._camera2d.up.set(0, 0, -1);
        this.camera = this._camera2d;

        this.controls2d = new CameraControls(this._camera2d, this.css3dRender.domElement);

        this.controls2d.mouseButtons.left = CameraControls.ACTION.TRUCK;
        this.controls2d.mouseButtons.right = CameraControls.ACTION.TRUCK;
        this._configCommonControl(this.controls2d);
    }

    _init3dControl() {
        this._camera3d = new THREE.PerspectiveCamera(45, this.canvasWidth / this.canvasHeight, 0.01, 20000);
        this._camera3d.fov = 45;
        this._camera3d.position.set(0, 100, 0);

        this.controls3d = new CameraControls(this._camera3d, this.css3dRender.domElement);

        this.controls3d.mouseButtons.left = CameraControls.ACTION.ROTATE;
        this.controls3d.mouseButtons.right = CameraControls.ACTION.TRUCK;

        this.controls3d.minPolarAngle = 0; // 控制翻转角度
        this.controls3d.maxPolarAngle = Math.PI / 3;
        this._configCommonControl(this.controls3d);
    }

    _configCommonControl(controls) {
        console.log('this :>> ', this);
        controls.truckSpeed = 2.5;
        controls.smoothTime = 0.04;
        controls.verticalDragToForward = false;
        controls.dollyToCursor = true;
        controls.dollyDragInverted = true;
    }

    _configControlsWithBox() {
        this.controls.setBoundary(this.box);
        if (this.controls.camera.isPerspectiveCamera) {
            const { distance } = this.controls;
            this.controls.maxDistance = distance;
            this.controls.minDistance = distance / (1 + SCALE_RADIO * SCALE_ENLARGE_TIME);
        } else {
            this.controls.maxZoom = this.controls.camera.zoom + SCALE_RADIO * this.controls.camera.zoom * SCALE_ENLARGE_TIME;
            this.controls.minZoom = this.controls.camera.zoom;
        }
        this._eventBind(this.controls2d);
        this._eventBind(this.controls3d);
    }

    _calcCurrentLevel() {
        let radio = 0;
        if (this.controls.camera.isPerspectiveCamera) {
            const { distance } = this.controls;
            if (distance === undefined) return;
            radio = this.controls.maxDistance / distance;
        } else {
            const { zoom } = this.controls.camera;
            if (zoom === undefined) return;
            radio = zoom / this.controls.minZoom;
        }
        const scale = Math.round(radio * 10 ** 2) / 10 ** 2;
        const level = Math.floor((scale - 1) / SCALE_RADIO);
        this.currentLevel = level;
    }

    _eventBind(controls) {
        this._removeEventBind(controls);
        controls.addEventListener('sleep', () => {
            if (this.fromCanvas) {
                if (this.notDolly) {
                    controls.dispatchEvent({ type: 'end' });
                } else {
                    controls.dispatchEvent({ type: 'dollyEnd' });
                }
                this.controlsChanged = true;
            }
            this.fromCanvas = false;
            this.notDolly = false;
        });
        controls.addEventListener('rest', () => {
            this._calcCurrentLevel();
        });

        controls.addEventListener('controlend', () => {
            this.notDolly = true;
        });
        controls.addEventListener('controlstart', this._fromCanvasCall);
    }

    // eslint-disable-next-line class-methods-use-this
    _removeEventBind(controls) {
        controls.removeAllEventListeners('sleep');
        controls.removeAllEventListeners('rest');
        controls.removeAllEventListeners('controlend');
        controls.removeAllEventListeners('controlstart');
    }
}
