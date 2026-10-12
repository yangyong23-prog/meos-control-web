import * as THREE from '@yushu/three-base';
import CameraControls from 'camera-controls';
import RenderContext from '@/views/GraphMVC/core/View/RenderContext';

const { MM2FOOT } = THREE.baseUtils;

/* 按比例尺动态分配等级 */

CameraControls.install({ THREE });

// 10m x 10m
// m => 1000mm
const standardSideLength = 10 * 1000 * MM2FOOT;
const stepDisance = 100;
const scaleCoefficient = 1.11;
// 拖拽css2d图标不隐藏等级，小于此等级css2d图标不隐藏，css3d图标隐藏
const dragVisibleLevel = 2;
// 大于此等级css3d图标隐藏
const css3dInvisibleLevel = 4;

export default class GraphSceneFloorContext extends RenderContext {
    constructor(webglScene) {
        const { Scene, camera, renderer, controls, css3dRender, effectLoader, canvasWidth, canvasHeight } = webglScene;
        super(Scene, camera, renderer, controls, css3dRender, effectLoader);
        this.webglScene = webglScene;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this._levelStep = 0;
        this._hiddenChildNodes = [];
        this.currentLevel = 0;
        this._minDistance = 0;
        this.polarAngle3d = Math.PI / 6;
        this.maxPolarAngle = Math.PI / 3;
    }

    init() {
        this._init3dControl();
        this._eventBind(this.controls);
        this.transform3dDom = this.css3dRender.domElement.querySelector("[style*='transform-style: preserve-3d']");
    }

    phiChange(restore) {
        this.controls.minPolarAngle = 0;
        this.controls.maxPolarAngle = this.maxPolarAngle;
        const p = new Promise(resolve => {
            this.controls.rotatePolarTo(restore ? 0 : this.polarAngle3d, true).finally(() => {
                resolve();
            });
        });
        p.finally(() => {
            this.controls.minPolarAngle = 0;
            this.controls.maxPolarAngle = restore ? 0 : this.maxPolarAngle;
        });
        return p;
    }

    restoreControls(box, buildDirectAngle = 0) {
        return new Promise(resolve => {
            if (box.isEmpty()) {
                resolve();
                return;
            }

            if (!this.maxlevelTimes) {
                const size = new THREE.Vector3();
                box.getSize(size);
                this._radioValue = Math.tan((this.camera.fov * 0.5 * Math.PI) / 180);
                this._minDistance = (standardSideLength * 0.5) / this._radioValue;

                const d = this.controls.getDistanceToFitBox(size.x * scaleCoefficient, size.z * scaleCoefficient, size.y * scaleCoefficient);
                const originValue = (d - this._minDistance) / stepDisance;
                this.maxlevelTimes = Math.ceil(originValue);

                this._maxDistance = this._minDistance + this.maxlevelTimes * stepDisance;
            }

            this.box = box;
            if (!this.box.isEmpty()) {
                this._zoomIn = false;
                this._configControlsWithBox();
                const rotate = this.controls.rotateTo(0, 0, true);
                const target = new THREE.Vector3();
                this.box.getCenter(target);
                const position = new THREE.Vector3();
                position.copy(target);
                const addV = new THREE.Vector3(0, this._maxDistance, 0);
                addV.applyAxisAngle(new THREE.Vector3(1, 0, 0), this.type === '2d' ? 0 : this.polarAngle3d);
                position.add(addV);
                const fit = this.controls.setLookAt(position.x, position.y, position.z, target.x, target.y, target.z, true);
                Promise.allSettled([rotate, fit]).then(() => {
                    this.controls.rotateAzimuthTo(buildDirectAngle * THREE.MathUtils.DEG2RAD, false);
                    this.controls.saveState();
                    resolve();
                });
            }
        });
    }

    switchControls(type) {
        this.type = type;
        this.controls.mouseButtons.left = CameraControls.ACTION.TRUCK;
        this.controls.mouseButtons.right = CameraControls.ACTION.ROTATE;
        return this.controls;
    }

    addEventListener(event, func) {
        this.controls.addEventListener(event, func);
    }

    removeEventListener(event, func) {
        this.controls.removeEventListener(event, func);
    }

    switchCameraLayerView(enable) {
        enable ? this.controls.connect(this.css3dRender.domElement) : this.controls.disconnect();
        this.css3dRender.domElement.style.pointerEvents = enable ? 'auto' : 'none';
        this.controls.camera.layers.set(enable ? 0 : 1);
    }

    set _levelStep(value) {
        this._mlevelStep = value;
        this.currentLevel = Math.round(this._mlevelStep);
    }

    get _levelStep() {
        return this._mlevelStep;
    }

    clear() {
        this.maxlevelTimes = null;
        this.currentLevel = 0;
        this.controls.maxDistance = Infinity;
        this.controls.minDistance = Number.EPSILON;
    }

    dispose() {
        this._removeEventBind(this.controls);
    }

    _init3dControl() {
        this.camera = new THREE.PerspectiveCamera(45, this.canvasWidth / this.canvasHeight, 0.01, 20000);
        this.camera.fov = 45;
        this.camera.position.set(0, 100, 0);

        this.controls = new CameraControls(this.camera, this.css3dRender.domElement);
        this.controls.minPolarAngle = 0;
        this.controls.maxPolarAngle = 0;

        this._configCommonControl(this.controls);
    }

    // eslint-disable-next-line class-methods-use-this
    _configCommonControl(controls) {
        controls.dollySpeed = 2.5;
        controls.smoothTime = 0.1;
        controls.draggingSmoothTime = 0.1;
        // controls.smoothTime = 0.25;
        // controls.draggingSmoothTime = 0.25;
        controls.verticalDragToForward = false;
        controls.dollyToCursor = true;
        controls.dollyDragInverted = true;
    }

    _configControlsWithBox() {
        this.controls.setBoundary(this.box);
        const sph = new THREE.Sphere();
        this.box.getBoundingSphere(sph);
        this.controls.camera.far = sph.radius * 4;
        this.controls.camera.updateMatrixWorld();
        this.controls.minDistance = this._minDistance;
        this.controls.maxDistance = this._maxDistance;
    }

    _calcCurrentLevel() {
        let radio = 0;
        const { distance } = this.controls;
        if (distance === undefined) return;
        radio = (distance - this._minDistance) / stepDisance;
        this._lastLevelStep = this._levelStep;
        this._levelStep = radio;
    }

    /**
     * 保留方法
     */
    _calcCurrentCameraMaxtrix() {
        const distance = this._levelStep * stepDisance + this._minDistance;
        const zoom = Math.min(this.canvasWidth, this.canvasHeight) / distance / (2 * this._radioValue);
        const target = new THREE.Vector3();
        this.controls.getTarget(target);
        return { distance, zoom, target };
    }

    _eventBind(controls) {
        this._wheelHandle = e => {
            const r = e.deltaY < 1;
            if (this._panOrRotate) {
                // 处理旋转未停止直接zoomout的情况
                this._panOrRotate = false;
                this._zoomIn = true;
                this._lastVisibility = '';
            }
            if (this._zoomIn === true && !r) {
                this._visibilityDom('hide');
            }
            this._zoomIn = r;
        };
        this.css3dRender.domElement.addEventListener('wheel', this._wheelHandle);
        controls.addEventListener('sleep', () => {
            if (!this._lockEvent) return;
            this._calcCurrentLevel();
            this._dispatchChangeEnd();
            this._lockEvent = false;
            this._zoomIn = undefined;
            this._panOrRotate = false;
        });
        controls.addEventListener('transitionstart', () => {
            this._lockEvent = true;
            this._visibilityDom('hidden');
        });
        controls.addEventListener('controlstart', () => {
            this._panOrRotate = true;
        });
    }

    _dispatchChangeEnd() {
        this.controls.dispatchEvent({
            type: 'change',
            message: {
                levelChanged: Math.round(this._levelStep) !== Math.round(this._lastLevelStep),
                newLevel: Math.round(this._levelStep),
                oldLevel: Math.round(this._lastLevelStep)
            }
        });
        this._visibilityDom('');
    }

    _visibilityDom(value) {
        if (this._lastVisibility === value) {
            return;
        }

        clearTimeout(this._lastTimer);

        let hide = value !== '';

        this._pauseLoop(hide);
        const func = () => {
            const nodes = hide ? this.css3dRender.domElement.childNodes : this._hiddenChildNodes;
            this._hiddenChildNodes = [];
            for (let index = 0; index < nodes.length; index++) {
                const element = nodes[index];
                hide = this.currentLevel < dragVisibleLevel && this.transform3dDom !== element && hide && (this._zoomIn || this._panOrRotate) ? false : hide;
                // element.style.transition = 'opacity 0.05s ease-out';
                element.style.visibility = hide ? 'hidden' : 'visible';
                // element.style.opacity = hide ? 0 : 1;
                if (hide) this._hiddenChildNodes.push(element);
            }
            if (this.currentLevel > css3dInvisibleLevel) this.transform3dDom.style.visibility = 'hidden';
        };

        // setTimeout延时为1ms，可解决2D/3D切换元素显示不正确的问题
        this._lastTimer = hide ? func() : setTimeout(func, 1);
        this._lastVisibility = value;
    }

    _pauseLoop(pause) {
        this.webglScene.pauseCss3dRenderLoop = this.currentLevel > css3dInvisibleLevel ? true : pause;
        this.webglScene.pauseCss2dRenderLoop = this.currentLevel < dragVisibleLevel && (this._zoomIn || this._panOrRotate) ? false : pause;
    }

    // eslint-disable-next-line class-methods-use-this
    _removeEventBind(controls) {
        this.css3dRender.domElement.removeEventListener('wheel', this._wheelHandle);
        controls.removeAllEventListeners('transitionstart');
        controls.removeAllEventListeners('rest');
        controls.removeAllEventListeners('update');
        controls.removeAllEventListeners('sleep');
        controls.removeAllEventListeners('controlstart');
        controls.removeAllEventListeners('controlend');
    }
}
