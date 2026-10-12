// @ts-ignore
import i18n from '@/localization';
import { baseUtils } from '@yushu/three-base';
import * as THREE from '@yushu/three-base';
import BaseMedia from '@/views/GraphMVC/core/View/BaseMedia';
import TWEEN, { Tween, Easing } from '@tweenjs/tween.js';

const { setMeshUpToY, outlineParseToMesh, M2FOOT } = baseUtils;

// 电梯平均速度 ；单位foot/s,英尺/每秒
const VELOCITY = 30;
export default class StraightLadderMedia extends BaseMedia {
    constructor(shaft, rootMedia) {
        super(shaft, rootMedia);
        this.init();

        this.model.addObserver('ChangeState', e => this.stateChanged(e));

        this.model.addObserver('RequestUpdateY', e => this.requestUpdateY(e));
        this.animate = time => {
            if (this.moverTween) {
                this.moverTween.update(time);
                requestAnimationFrame(this.animate);
            }
        };
    }

    // 重写父类方法，生成模型
    makeObject3D() {
        const { data, defaultY = 0, depth = 0.01 } = this.model;
        if (!data.relShaft?.shaftSpaceList?.length) {
            console.warn('直梯关联竖井数据缺失');
            return;
        }
        let { outline } = data.relShaft.shaftSpaceList[0];
        if (typeof outline === 'string') {
            outline = JSON.parse(outline);
        }
        const spaceMesh = outlineParseToMesh(outline, depth);

        setMeshUpToY(spaceMesh);
        spaceMesh.position.y = defaultY;
        spaceMesh.updateMatrix();
        spaceMesh.modelKey = data?.id || '';
        spaceMesh.material = new THREE.MeshStandardMaterial({
            transparent: true,
            opacity: 1,
            depthWrite: false,
            side: THREE.DoubleSide,
            polygonOffset: true
        });
        spaceMesh.renderOrder = 5;
        return spaceMesh;
    }

    parseStyle() {
        const { show, color, useLinearColor = false, alpha = 1, pauseAnimation = false } = this.model.caclCurrentStyle();

        this.model.show = show;
        this.curPauseAnimation = pauseAnimation;
        // console.log('this.curPauseAnimation : ', this.curPauseAnimation, pauseAnimation);
        if (!show) {
            this.stopAnimation();
            return;
        }
        this.checkStartAnimate();
        const { materialManager } = this.rootMedia.renderContext;

        // this.object3D.material = materialManager.dequeueMaterial({ color, useLinearColor, alpha });
        this.object3D.material.opacity = alpha;
        this.object3D.material.color = new THREE.Color(color || '#F2F2F2');
    }

    // 检查开始动画
    checkStartAnimate() {
        if (this.curPauseAnimation) {
            this.isStop = true;
            this.stopAnimation();
        } else {
            const toY = this.model.targetY !== undefined ? this.model.targetY : this.model.defaultY || 0;

            const distance = Math.abs(toY - this.object3D.position.y);
            if (distance > 0.001) {
                this.animateMoveToY();
            }
        }
    }

    stateChanged(e) {
        this.parseStyle();
    }

    // 请求更新Y
    // 需要动画needAnimate
    requestUpdateY({ needAnimate = true }) {
        // console.log('requestUpdateY: ', needAnimate);
        if (needAnimate) {
            this.checkStartAnimate();
        } else {
            // 不需要动画直接改Y
            const toY = this.model.targetY !== undefined ? this.model.targetY : this.model.defaultY || 0;
            this.object3D.position.y = toY;
        }
    }

    // 停止动画
    stopAnimation() {
        this.object3D.updateMatrixWorld();
        if (this.tweenRAF) {
            cancelAnimationFrame(this.tweenRAF);
            this.tweenRAF = null;
        }
        if (this.moverTween) {
            this.moverTween?.pause();
            this.moverTween?.stop();
            this.moverTween = null;
        }
    }

    // 动画移动到Y
    animateMoveToY() {
        const tweenEasing = Easing.Cubic.InOut;
        const toY = this.model.targetY !== undefined ? this.model.targetY : this.model.defaultY || 0;

        const distance = Math.abs(toY - this.object3D.position.y);
        // const duration = 2000;
        const duration = (distance / VELOCITY) * 1000;
        // console.log('duration: ', duration, distance);

        this.stopAnimation();

        this.moverTween = new Tween(this.object3D.position)
            .to({ y: toY }, duration)
            .easing(tweenEasing)

            .onComplete(() => {
                this.moverTween = null;
            })
            .start();
        this.tweenRAF = requestAnimationFrame(this.animate);
    }

    onObject3DMounted() {
        this.parseStyle();
        this.object3D.updateMatrixWorld(true, true);
    }
}
