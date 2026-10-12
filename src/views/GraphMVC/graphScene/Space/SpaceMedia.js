import TWEEN from '@tweenjs/tween.js';
import * as THREE from '@yushu/three-base';
import { baseUtils } from '@yushu/three-base';
// import { State } from '../Model/FloorDefine';
import BaseMedia from '../../core/View/BaseMedia';
import { darkenColor, overlayColor, changeColorDark } from '../../core/utils/color';

const { setMeshUpToY, outlineParseToMesh } = baseUtils;

export default class SpaceMedia extends BaseMedia {
    constructor(space, rootMedia) {
        super(space, rootMedia);

        this.init();
        this.model.addObserver('AddSpaceBorder', e => this.addSpaceBorder(e));
        this.model.addObserver('RemoveSpaceBorder', e => this.removeSpaceBorder(e));

        this.model.addObserver('AddSpaceIconInfo', e => this.addSpaceIconInfo(e));
        this.model.addObserver('RemoveSpaceIconInfo', e => this.removeSpaceIconInfo(e));

        this.model.addObserver('AddRelationCard', e => this.addRelationCard(e));
        this.model.addObserver('RemoveRelationCard', e => this.removeRelationCard(e));

        this.model.addObserver('ChangeState', e => this.spaceStateChanged(e));

        this.model.addObserver('UpdatePositionY', v => {
            this.updatePositionY(v);
        });
        this.hoverTween = null;
        this.animate = time => {
            if (this.hoverTween) {
                this.hoverTween.update(time);
                requestAnimationFrame(this.animate);
            }
        };
        this.tweenRAF = null;
    }

    // 重写父类方法，生成模型
    makeObject3D() {
        const { spaceData, floorHeight, depth = 0.01 } = this.model;
        let { outline } = spaceData;
        if (typeof outline === 'string') {
            outline = JSON.parse(outline);
        }
        const spaceMesh = outlineParseToMesh(outline, depth);

        setMeshUpToY(spaceMesh);
        spaceMesh.position.y = floorHeight;
        spaceMesh.updateMatrix();
        spaceMesh.modelKey = spaceData?.id || '';
        return spaceMesh;
    }

    addSpaceBorder(spaceBoder) {
        this.addChild(spaceBoder);
    }

    removeSpaceBorder(spaceBoder) {
        this.removeChild(spaceBoder);
    }

    addSpaceIconInfo(spaceIconInfo) {
        this.addChild(spaceIconInfo);
    }

    removeSpaceIconInfo(spaceIconInfo) {
        this.removeChild(spaceIconInfo);
    }

    addRelationCard(relationCard) {
        this.addChild(relationCard);
    }

    removeRelationCard(relationCard) {
        this.removeChild(relationCard);
    }

    onObject3DMounted() {
        this.spaceStateChanged();
    }

    spaceStateChanged() {
        const {
            show,
            color,
            colorMode,
            useAnimate,
            animationIterationCount,
            useLinearColor = false,
            alpha = 1,
            blendAlpha = 0,
            blendColor,
            outline
        } = this.model.caclCurrentStyle();
        let _color = color;
        this.model.show = show;
        if (!show) return;
        const { effectLoader, materialManager } = this.rootMedia.renderContext;

        if (!useAnimate) {
            if (this.hoverTween) {
                this.hoverTween.stop();
                this.hoverTween.end();
                this.hoverTween = null;
            }
            if (this.tweenRAF) {
                cancelAnimationFrame(this.tweenRAF);
                this.tweenRAF = null;
            }
        }

        if (colorMode === 'dark') {
            _color = changeColorDark(color, 30, 20) || color;
        } else if (colorMode === 'blend' && blendColor) {
            //color：透明叠加的前景色  blendColor：背景色
            _color = overlayColor(color, blendColor, blendAlpha) || color;
        }
        if (effectLoader) {
            if (effectLoader.outlinePass) {
                if (outline) {
                    if (!this.outlineEd) {
                        this.outlineEd = true;
                        if (effectLoader.outlinePass.selectedObjects) {
                            effectLoader.outlinePass.selectedObjects.push(this.object3D);
                        }
                        // effectLoader.outlineMesh(this.object3D);
                    }
                } else {
                    if (this.outlineEd) {
                        this.outlineEd = false;
                        // effectLoader.outlinePass.selectedObjects = [];
                        effectLoader.outlinePass.selectedObjects = effectLoader.outlinePass.selectedObjects?.filter(m => m !== this.object3D);
                    }
                }
            }
        }
        // console.log('color: ', color, _color, colorMode, useAnimate, alpha);
        if (!useAnimate) {
            this.object3D.material = materialManager.dequeueMaterial({ color: _color, useLinearColor, alpha });
        }
        if (useAnimate) {
            this.object3D.material = this.object3D.material.clone();
            const tempColor = new THREE.Color(_color);
            this.hoverTween = new TWEEN.Tween(this.object3D.material.color, false).to(tempColor, 300).easing(TWEEN.Easing.Cubic.In).yoyo(true);
            if (Number.isInteger(animationIterationCount) || animationIterationCount === Infinity) {
                this.hoverTween.repeat(animationIterationCount);
                this.hoverTween.repeatDelay(600);
            }
            this.hoverTween.start().onComplete(() => {
                this.hoverTween = null;
            });
            this.tweenRAF = requestAnimationFrame(this.animate);
        } else {
            this.object3D.material = materialManager.dequeueMaterial({ color: _color, useLinearColor, alpha });
        }
    }

    updatePositionY(data) {
        if (data && data.value !== undefined) {
            this.object3D.position.setY(data.value);
        }
    }
}
