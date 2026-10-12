import * as THREE from '@yushu/three-base';

import BaseMedia from '../../core/View/BaseMedia';

const { baseUtils } = THREE;
const { outlineToShape } = baseUtils;

export default class SpaceBorderMedia extends BaseMedia {
    constructor(spaceBorder, rootMedia) {
        super(spaceBorder, rootMedia);
        this.init();
    }

    // 重写父类方法，生成模型
    makeObject3D() {
        const { spaceData } = this.model;
        let outLine = spaceData.outline;
        if (typeof outLine === 'string') {
            outLine = JSON.parse(outLine);
        }
        const shapes = outlineToShape(outLine);
        const spaceLine = new THREE.Mesh();
        if (!shapes) {
            return spaceLine;
        } // 可能存在数据
        shapes.forEach(shape => {
            const outlinePoints = shape.getPoints();
            const outline = new THREE.BufferGeometry().setFromPoints(outlinePoints);
            const outlineStrokes = new THREE.Line(outline);
            spaceLine.add(outlineStrokes);
        });
        const lineMaterial = new THREE.LineBasicMaterial({ color: 'lightGrey', fog: false });
        lineMaterial.needsUpdate = true;
        spaceLine.children.forEach(l => {
            l.material = lineMaterial;
        });
        return spaceLine;
    }
}
