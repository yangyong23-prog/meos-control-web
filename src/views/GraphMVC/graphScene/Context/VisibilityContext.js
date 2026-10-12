import RenderContext from '@/views/GraphMVC/core/View/RenderContext';
import * as THREE from '@yushu/three-base';
import CameraControls from 'camera-controls';
/* 隐藏DOM的上下文 */

/* 按比例尺动态分配等级 */

CameraControls.install({ THREE });
// 拖拽css2d图标不隐藏距离，小于此距离css2d图标不隐藏
const dragVisibleDistance = 100;

export default class Context extends RenderContext {
    constructor(webglScene) {
        const { Scene, camera, renderer, controls, css3dRender, effectLoader } = webglScene;
        super(Scene, camera, renderer, controls, css3dRender, effectLoader);
        this.webglScene = webglScene;
    }

    init() {
        this._eventBind(this.controls);
        this.transform3dDom = this.css3dRender.domElement.querySelector("[style*='transform-style: preserve-3d']");
    }

    dispose() {
        super.dispose();
        this._removeEventBind(this.controls);
    }

    addEventListener(event, func) {
        this.controls.addEventListener(event, func);
    }

    removeEventListener(event, func) {
        this.controls.removeEventListener(event, func);
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
        // this.css3dRender.domElement.addEventListener('wheel', this._wheelHandle);
        controls.addEventListener('sleep', () => {
            if (!this._lockEvent) return;
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
        this.controls.dispatchEvent({ type: 'change' });
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
                hide = this.controls.distance < dragVisibleDistance && this.transform3dDom !== element && hide && (this._zoomIn || this._panOrRotate) ? false : hide;
                // element.style.transition = 'opacity 0.05s ease-out';
                element.style.visibility = hide ? 'hidden' : 'visible';
                // element.style.opacity = hide ? 0 : 1;
                if (hide) this._hiddenChildNodes.push(element);
            }
            // if (this.currentLevel > css3dInvisibleLevel) this.transform3dDom.style.visibility = 'hidden';
        };

        // setTimeout延时为1ms，可解决2D/3D切换元素显示不正确的问题
        this._lastTimer = hide ? func() : setTimeout(func, 1);
        this._lastVisibility = value;
    }

    _pauseLoop(pause) {
        // this.webglScene.pauseCss3dRenderLoop = (this.currentLevel > css3dInvisibleLevel) ? true : pause;
        this.webglScene.pauseCss2dRenderLoop = this.controls.distance < dragVisibleDistance && (this._zoomIn || this._panOrRotate) ? false : pause;
    }

    // eslint-disable-next-line class-methods-use-this
    _removeEventBind(controls) {
        try {
            this.css3dRender.domElement.removeEventListener('wheel', this._wheelHandle);
            controls?.removeAllEventListeners('transitionstart');
            controls?.removeAllEventListeners('rest');
            controls?.removeAllEventListeners('update');
            controls?.removeAllEventListeners('sleep');
            controls?.removeAllEventListeners('controlstart');
            controls?.removeAllEventListeners('controlend');
        } catch (error) {
            console.error('removeEventBind error:', error);
        }
    }
}
