// @ts-ignore
import i18n from '@/localization';
// import { baseUtils } from '@yushu/three-base';
import { CSS2DObject } from '@yushu/three-base/three-extends/jsm/renderers/CSS2DRenderer';
import BaseMedia from '@/views/GraphMVC/core/View/BaseMedia';
import { wrapperDom } from '@/views/GraphMVC/core/utils';
// import { createVNode, render } from 'vue';
import { Box3, Vector3 } from '@yushu/three-base';
import { vueApp } from '@/views/GraphMVC/utils/d2Utils';

// 工具函数
// const { getD3PosByBimLocation } = baseUtils;
import StraightLadderPopoverComponent from './StraightLadderPopover.vue';
export default class AirEquipIconInfoMedia extends BaseMedia {
    constructor(model, rootMedia) {
        // ![必须]继承父类
        super(model, rootMedia);
        // ![必须]初始化父类方法
        this.init();
        this.model.addObserver('ChangeState', v => {
            this.updateStyle();
        });
        this.model.addObserver('UpdateCurFloor', v => {
            this.updateCurFloor();
        });
    }
    // ![必须]创建css2d图元
    makeObject3D() {
        this.vueApp = vueApp(StraightLadderPopoverComponent, { model: this.model, currentStyle: null });
        const rootDom = this.vueApp.getDom();
        const object3D = new CSS2DObject(rootDom);

        return object3D;
    }

    onObject3DLayout() {
        // 对于无bimLocation的，以父模型的几何中心点坐标为坐标
        const box = new Box3();
        box.setFromObject(this.parentMedia?.object3D);
        const centerP = new Vector3();
        const sizeV3 = new Vector3();
        box.getCenter(centerP);
        box.getSize(sizeV3);
        centerP.y += sizeV3.y / 2;
        const position = centerP.clone().applyMatrix4(this.parentMedia.object3D.matrix.clone().invert());
        this.object3D.position.copy(position);
    }

    onObject3DMounted() {
        this.updateStyle();
    }

    updateStyle() {
        const currentStyle = this.model.caclCurrentStyle();

        const { show, renderOrder } = currentStyle;

        let _show = show;
        if (!this.model.getParentsShow()) {
            _show = false;
        }
        _show = _show && !this.model.isRemoved();
        this.model.show = _show;

        this.object3D.renderOrder = renderOrder;
        this.vueApp.setProps('currentStyle', currentStyle);
        // this.vueApp.vm.component.props.currentStyle = currentStyle;
    }

    updateCurFloor() {
        // this.vueApp.vm.component.props.curFloor = this.model?.curFloor;
        this.vueApp.setProps('curFloor', this.model?.curFloor);
    }

    dispose() {
        this.vueApp.dispose(this.object3D.element);
        this.object3D.element = null;
        super.dispose();
    }
}
