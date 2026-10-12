import TWEEN from '@tweenjs/tween.js';
import * as THREE from '@yushu/three-base';
import { baseUtils } from '@yushu/three-base';
// import { State } from '../Model/FloorDefine';
import BaseMedia from '../../core/View/BaseMedia';

import { changeColorDark, blendWithWhite, overlayColor } from '../../core/utils/color';
const { setMeshUpToY, outlineParseToMesh, outlineToShape, ResourceTracker } = baseUtils;

export default class MultipleSpaceMedia extends BaseMedia {
    constructor(space, rootMedia) {
        super(space, rootMedia);
        this.geometryBucket = [];
        // this.object3DDepth1 = null;
        // this.object3DDepth2 = null;
        this.init();
        this.model.addObserver('AddSpaceBorder', e => this.addSpaceBorder(e));
        this.model.addObserver('RemoveSpaceBorder', e => this.removeSpaceBorder(e));

        this.model.addObserver('AddSpaceIconInfo', e => this.addSpaceIconInfo(e));
        this.model.addObserver('RemoveSpaceIconInfo', e => this.removeSpaceIconInfo(e));

        this.model.addObserver('AddRelationCard', e => this.addRelationCard(e));
        this.model.addObserver('RemoveRelationCard', e => this.removeRelationCard(e));

        this.model.addObserver('ChangeState', e => this.spaceStateChanged(e));

        this.model.addObserver('ChangeCurrentGeometry', e => this.changeCurrentGeometry(e));

        this.hoverTween = null;
        this.animate = time => {
            if (this.hoverTween) {
                this.hoverTween.update(time);
                requestAnimationFrame(this.animate);
            }
        };
        this.tweenRAF = null;
        this.tracker = new ResourceTracker();
    }

    // 重写父类方法，生成模型
    makeObject3D() {
        const { spaceData, floorHeight, depths = [] } = this.model;
        let outLine = spaceData.outline;
        if (typeof outLine === 'string') {
            outLine = JSON.parse(outLine);
        }
        this.geometryBucket = depths.map(depth => {
            return this.createGeometry(outLine, {
                steps: 1,
                depth
            });
        });

        const curGeometry = this.getCurGeometry();

        const spaceMesh = new THREE.Mesh(curGeometry);
        setMeshUpToY(spaceMesh);
        spaceMesh.position.y = floorHeight;
        spaceMesh.updateMatrix();
        spaceMesh.modelKey = spaceData?.id || '';

        return spaceMesh;
    }

    getCurGeometry() {
        const { curGeometryIndex = 0 } = this.model;
        const curGeometry = this.geometryBucket?.[curGeometryIndex];
        if (!curGeometry) {
            throw new Error('当前几何体不存在');
        }
        return curGeometry;
    }

    createGeometry(outline, { steps, depth, bevelEnabled = false }) {
        const shapes = outlineToShape(outline);

        return this.track(
            new THREE.ExtrudeGeometry(shapes, {
                steps,
                depth,
                bevelEnabled
            })
        );
    }

    changeCurrentGeometry() {
        this.object3D.geometry = this.getCurGeometry();
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
        const { show, color, useAnimate, useLinearColor = false, alpha = 1, colorMode, blendAlpha = 0, blendColor } = this.model.caclCurrentStyle();
        let _color = color;
        this.model.show = show;
        if (!show) return;
        const { materialManager } = this.rootMedia.renderContext;

        if (this.hoverTween) {
            this.hoverTween.stop();
            this.hoverTween = null;
        }
        if (this.tweenRAF) {
            cancelAnimationFrame(this.tweenRAF);
            this.tweenRAF = null;
        }

        if (colorMode === 'dark') {
            _color = changeColorDark(color, 30, 20) || color;
        } else if (colorMode === 'blend' && blendColor) {
            //color：透明叠加的前景色  blendColor：背景色
            _color = overlayColor(color, blendColor, blendAlpha) || color;
        }

        if (!useAnimate) {
            this.object3D.material = materialManager.dequeueMaterial({ color: _color, useLinearColor, alpha });
        }
        if (useAnimate) {
            this.object3D.material = this.object3D.material.clone();
            const tempColor = new THREE.Color(_color);
            this.hoverTween = new TWEEN.Tween(this.object3D.material.color)
                .to(tempColor, 400)
                .easing(TWEEN.Easing.Cubic.InOut)
                .start()
                .onComplete(() => {
                    this.hoverTween = null;
                });
            this.tweenRAF = requestAnimationFrame(this.animate);
        } else {
            this.object3D.material = materialManager.dequeueMaterial({ color: _color, useLinearColor, alpha });
        }
    }
}
