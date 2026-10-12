// @ts-ignore
import i18n from '@/localization';
import * as THREE from '@yushu/three-base';
import BaseMedia from '@/views/GraphMVC/core/View/BaseMedia';

export default class LampLightGroupMedia extends BaseMedia {
    constructor(model, rootMedia) {
        super(model, rootMedia);

        this.init();

        this.model.addObserver('ChangeState', e => this.spaceStateChanged(e));
    }

    // 重写父类方法，生成模型
    makeObject3D() {
        const { data, group } = this.model;
        if (!group) {
            console.warn('夜景灯具类组图元缺少对应的THREE Group 对象');
            return;
        }

        return group;
    }

    onObject3DMounted() {
        this.spaceStateChanged();
    }

    spaceStateChanged() {
        const { show, color, emissive, emissiveIntensity } = this.model.caclCurrentStyle();
        // console.log('spaceStateChanged---color: ', color, emissive, emissiveIntensity);

        this.model.show = show;
        this.object3D?.children?.forEach(mesh => {
            mesh.material.color.set(color);
            mesh.material.emissiveIntensity = emissiveIntensity;
            mesh.material.emissive = mesh.material.color.clone();
        });
        if (!show) return;
    }
}
