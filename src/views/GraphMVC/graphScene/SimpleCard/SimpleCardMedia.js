import { CSS2DObject } from '@yushu/three-base/three-extends/jsm/renderers/CSS2DRenderer';
import BaseMedia from '../../core/View/BaseMedia';
import { createDom } from '../../utils/d2Utils';
import { wrapperDom } from '../../core/utils';

export default class SimpleCardMedia extends BaseMedia {
    constructor(model, rootMedia) {
        super(model, rootMedia);
        this.init();
    }

    // 重写父类方法，生成模型
    makeObject3D() {
        const {
            model: { floorHeight, bimLocation }
        } = this;
        if (!bimLocation) return;
        this.$dom = createDom({
            tagName: 'div',
            classList: ['xxx-container'],
            style: { transform: `${this.transformScale}translate(0,0)`, 'transform-origin': 'bottom' }
        });

        this.$dom.innerHTML = '';
        const wrapper = wrapperDom(this.$dom);
        const iconInfoMesh = new CSS2DObject(wrapper);

        const iconInfoLocation = bimLocation;
        iconInfoLocation.setY(floorHeight + 0.1);
        iconInfoMesh.position.copy(iconInfoLocation);

        return iconInfoMesh;
    }

    onObject3DMounted() {
        this.parseStyle();
    }

    parseStyle() {
        const style = this.model.caclCurrentStyle();
        this.model.show = style.show;
    }
}
