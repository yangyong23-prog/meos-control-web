// @ts-ignore
import i18n from '@/localization';
// import { baseUtils } from '@yushu/three-base';
import { CSS2DObject } from '@yushu/three-base/three-extends/jsm/renderers/CSS2DRenderer';
import BaseMedia from '@/views/GraphMVC/core/View/BaseMedia';
import { createVNode, render } from 'vue';

const vueApp = (component, props) => {
    //1、创造包裹虚拟节点的div元素
    let container = document.createElement('div');
    if (!component) {
        return render(null, container);
    }
    //2、创造虚拟节点
    const vm = createVNode(component, props);
    //3、将虚拟节点创造成真实DOM
    render(vm, container);
    return {
        vm,
        getDom: () => container.firstElementChild,
        removeDom: () => {
            render(null, container);
            container.removeChild(container.firstElementChild);
            container = null;
        }
    };
};
// 工具函数
// const { getD3PosByBimLocation } = baseUtils;
import SpaceAbnormalIconComponent from './SpaceAbnormalIcon.vue';
export default class SpaceAbnormalIconMedia extends BaseMedia {
    constructor(model, rootMedia) {
        // ![必须]继承父类
        super(model, rootMedia);
        // ![必须]初始化父类方法
        this.init();
        this.model.addObserver('ChangeState', v => {
            this.updateStyle();
        });
    }

    makeObject3D() {
        this.vueApp = vueApp(SpaceAbnormalIconComponent, { model: this.model, currentStyle: null });
        const labelDom = this.vueApp.getDom();
        const object3D = new CSS2DObject(labelDom);
        this.addMouseEvent(labelDom);
        return object3D;
    }

    addMouseEvent(labelDom) {
        labelDom.addEventListener('mousemove', event => {
            event.stopPropagation();
            this.rootMedia.emit('css2dobjectmousemove', { event, model: this.model.parent });
        });

        labelDom.addEventListener('pointerdown', event => {
            this.rootMedia.emit('css2dobjectclick', { event, model: this.model.parent });
        });
    }

    onObject3DLayout() {
        // #设置图元位置 -> bimLocation是在SpaceLabelInfo model层定义的
        // this.object3D.position.copy(this.model.bimLocation);
        const infoLocation = this.model.bimLocation.clone();
        const position = infoLocation.clone().applyMatrix4(this.parentMedia.object3D.matrix.clone().invert());
        this.model.infoLocation = infoLocation; // 用作碰撞的Location
        this.model.iconInfoLocation = position;
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
        this.vueApp.vm.component.props.currentStyle = currentStyle;
    }
}
