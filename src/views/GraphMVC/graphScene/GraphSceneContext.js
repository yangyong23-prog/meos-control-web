import * as THREE from '@yushu/three-base';
import RenderContext from '../core/View/RenderContext';

export default class GraphSceneContext extends RenderContext {
    init(scene) {
        if (this.controls) {
            this.controls.minPolarAngle = 0; // 控制翻转角度
            this.controls.maxPolarAngle = Math.PI / 3;
            this.controls.enableDamping = true;
            this.controls.enableRotate = true;
            this.controls.minDistance = 200;
            this.controls.maxDistance = 1200;
            this.controls.maxZoom = 13.67;
            this.controls.minZoom = 0.158;
            this.controls.dampingFactor = 0.7;
            this.controls.panSpeed = 2;
            this.controls.screenSpacePanning = false;
            this.controls.zoomToCursor = true;
            if (scene === '3d') {
                this.controls.mouseButtons = {
                    LEFT: THREE.MOUSE.ROTATE,
                    MIDDLE: THREE.MOUSE.DOLLY,
                    RIGHT: THREE.MOUSE.PAN
                };
            } else {
                this.controls.mouseButtons = {
                    LEFT: THREE.MOUSE.PAN,
                    MIDDLE: THREE.MOUSE.DOLLY,
                    RIGHT: THREE.MOUSE.ROTATE
                };
            }
        }
    }
}
