import * as THREE from '@yushu/three-base';
import BaseMedia from '../../core/View/BaseMedia';

export default class GroupMedia extends BaseMedia {
    constructor(model, rootMedia) {
        super(model, rootMedia);
        this.init();

        this.model.addObserver('ChangeState', e => this.stateChanged(e));

        this.lastStyle = {};
    }

    // eslint-disable-next-line class-methods-use-this
    makeObject3D() {
        const object3D = new THREE.Group();
        const { key } = this.model.data;
        if (key) {
            object3D.modelKey = key;
        }
        return object3D;
    }

    onObject3DMounted() {
        this.parseStyle();
    }

    parseStyle() {
        const style = this.model.caclCurrentStyle();
        this.model.show = style.show;

        this.lastStyle = style;
    }

    stateChanged() {
        this.parseStyle();
    }
}
