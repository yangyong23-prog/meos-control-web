import * as THREE from '@yushu/three-base';
import BaseMedia from '../../core/View/BaseMedia';

export const Css2dobjectClick = 'css2dobjectclick';
export const Css2dobjectMouseMove = 'css2dobjectmousemove';
export default class RootNodeMedia extends BaseMedia {
    constructor(model, rootMedia) {
        super(model, rootMedia);
        this.init();
        this.model.addObserver('ChangeState', e => this.stateChanged(e));
    }

    // eslint-disable-next-line class-methods-use-this
    makeObject3D() {
        return new THREE.Object3D();
    }

    stateChanged() {
        const curStyle = this.model.caclCurrentStyle();
        if (curStyle) {
            const { visible } = curStyle;
            this.object3D.visible = visible;
        }
    }
}
