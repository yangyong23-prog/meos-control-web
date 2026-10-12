import * as THREE from '@yushu/three-base';
import { parseCFOutLineToMesh } from '@/views/GraphMVC/utils/MapCFLoader';
import BaseMedia from '../../core/View/BaseMedia';

export default class CivilMedia extends BaseMedia {
    constructor(civil, rootMedia) {
        super(civil, rootMedia);
        this.init();

        this.model.addObserver('ChangeState', () => this.changeState());
        this.model.addObserver('ChangeMaterial', () => this.changeMaterial());
        this.model.addObserver('SetColorRatio', () => this.setColorRatio());
    }

    // 重写父类方法，生成模型
    makeObject3D() {
        const { data, height, floorHeight } = this.model;
        const mesh = parseCFOutLineToMesh(data, height);
        mesh.position.y = floorHeight;
        return mesh;
    }

    changeMaterial() {
        const { material } = this.model;
        this.object3D.material = material;
    }

    onObject3DMounted() {
        this.changeState();
    }

    changeState() {
        const { materialManager } = this.rootMedia.renderContext;

        const style = this.model.caclCurrentStyle();
        if (style) {
            this.object3D.material = materialManager.dequeueMaterial(style);
            this.model.show = style.show;
        }
    }

    setColorRatio() {
        const { ratio = 0 } = this.model;
        const style = this.model.caclCurrentStyle();
        if (style) {
            const { startColor, endColor } = style;
            if (startColor && endColor) {
                const c = new THREE.Color();

                c.lerpColors(new THREE.Color(startColor), new THREE.Color(endColor), ratio);
                this.object3D.material.color = c;
                this.object3D.material.emissive = c;
                // console.log('c: ', c.getHexString(), ratio, this.object3D);
            }
        }
    }
}
