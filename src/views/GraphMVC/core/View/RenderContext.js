import * as THREE from '@yushu/three-base';
import MaterialManager from './MaterialManager';

export default class RenderContext {
    constructor(scene, camera, renderer, controls, css3dRender, effectLoader) {
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.controls = controls;
        this.css3dRender = css3dRender;
        this.effectLoader = effectLoader;
        this.canvasPropsInitialize();
        this.materialManager = new MaterialManager();
        this.frameCallback = null;
    }

    // eslint-disable-next-line class-methods-use-this
    init() {}

    // eslint-disable-next-line class-methods-use-this
    dispose() {
        this.materialManager.dispose();
    }

    canvasPropsInitialize() {
        if (this.renderer) {
            const size = new THREE.Vector2();
            this.renderer.getSize(size);
            this.canvasWidth = size.width;
            this.canvasHeight = size.height;
        }
    }

    frameAnimationLoop() {
        if (this.frameCallback) {
            this.frameCallback();
        }
    }

    // 应当内部设置 setAnimationLoop。后续逐步重构中去除?
    setFrameAnimationLoop(callback) {
        if (callback) {
            this.frameCallback = callback;
        }
    }
}
