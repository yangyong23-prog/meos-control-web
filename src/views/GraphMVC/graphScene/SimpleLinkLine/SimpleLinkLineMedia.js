import * as THREE from '@yushu/three-base';
import BaseMedia from '../../core/View/BaseMedia';

import { ArrowLineHelper } from '@yushu/three-base/three-extends/yushu/ArrowLineHelper/ArrowLineHelper';

export default class SimpleLinkLineMedia extends BaseMedia {
    constructor(linkLine, rootMedia) {
        super(linkLine, rootMedia);
        this.originalColor = this.model.color;
        this.init();
        this.model.addObserver('AddLinkLineInfo', e => this.addLinkLineInfo(e));
        this.model.addObserver('RemoveLinkLineInfo', e => this.removeLinkLineInfo(e));
        this.model.addObserver('ChangeState', e => this.LinkLineStateChanged(e));
    }

    // 重写父类方法，生成模型
    makeObject3D() {
        const { linkLineData, bimLocationFrom, bimLocationTo } = this.model;
        if (!bimLocationFrom || !bimLocationTo) return console.warn('飞行线相关数据没有bimLocation!');
        const geometry = new THREE.BufferGeometry();
        // 线的方向向量
        const lineDir = bimLocationTo.clone().sub(bimLocationFrom.clone());

        // x z平面上垂直于线方向的单位向量
        const unitVector2 = new THREE.Vector2(lineDir.z, -lineDir.x).normalize();
        let numUnitVector2 = new THREE.Vector3(0, 0);
        if (linkLineData.num > 0) {
            const coefficient = Math.ceil(linkLineData.num / 2) * 10;
            if (linkLineData.num % 2 === 1) {
                numUnitVector2 = unitVector2.multiplyScalar(coefficient);
            } else {
                numUnitVector2 = unitVector2.multiplyScalar(-coefficient);
            }
        }
        // 线段中点
        const vectorCenter = bimLocationFrom.clone().add(bimLocationTo).divideScalar(2);
        // 中点沿法线偏移一定距离，作为新的飞行线的控制点
        const elseControlPoint = vectorCenter.clone().add(new THREE.Vector3(numUnitVector2.x, 60, numUnitVector2.y));
        const curve = new THREE.QuadraticBezierCurve3(bimLocationFrom, elseControlPoint, bimLocationTo);
        const pointers = curve.getPoints(99);
        geometry.setFromPoints(pointers);

        const arrowLine = new ArrowLineHelper(bimLocationFrom.clone(), bimLocationTo.clone(), elseControlPoint.clone(), 2, linkLineData.isDirection, this.originalColor);
        this.model.linkLineObj = { mesh: arrowLine, center: arrowLine.center };
        const linkLineMesh = arrowLine;
        // console.log('linkLineMesh', linkLineMesh);
        return linkLineMesh;
    }

    addLinkLineInfo(LinkLineInfo) {
        this.addChild(LinkLineInfo);
    }

    removeLinkLineInfo(LinkLineInfo) {
        this.removeChild(LinkLineInfo);
    }

    onObject3DMounted() {
        this.LinkLineStateChanged();
    }

    LinkLineStateChanged() {
        const { show, color } = this.model.caclCurrentStyle();
        this.model.show = show;
        if (color) {
            this.object3D.setColor(color);
        }
    }
}
