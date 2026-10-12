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
            if (container && container.firstElementChild) {
                container.removeChild(container.firstElementChild);
            }
            container = null;
        }
    };
};
// 工具函数
// const { getD3PosByBimLocation } = baseUtils;
import SpaceNameInfoComponent from './SpaceNameInfo.vue';
export default class SpacePopoverInfoMedia extends BaseMedia {
    constructor(model, rootMedia) {
        // ![必须]继承父类
        super(model, rootMedia);
        // ![必须]初始化父类方法
        this.init();
        this.model.addObserver('ChangeState', v => {
            this.updateStyle();
        });
    }
    // ![必须]创建css2d图元
    makeObject3D() {
        this.vueApp = vueApp(SpaceNameInfoComponent, { model: this.model, currentStyle: null });
        const rootDom = this.vueApp.getDom();
        const object3D = new CSS2DObject(rootDom);
        this.normalDom = rootDom.querySelector('.custom-space-name-info-warp .normal');
        if (this.normalDom) {
            this.addMouseEvent(this.normalDom);
        }

        return object3D;
    }

    addMouseEvent(labelDom) {
        this.css2dobjectmousemove = event => {
            event.stopPropagation();
            this.rootMedia.emit('css2dobjectmousemove', { event, model: this.model.parent });
        };
        this.css2dobjectclick = event => {
            event.stopPropagation();
            this.rootMedia.emit('css2dobjectclick', { event, model: this.model.parent });
        };
        if (labelDom) {
            labelDom.addEventListener('mousemove', this.css2dobjectmousemove);
            labelDom.addEventListener('pointerdown', this.css2dobjectclick);
        }
    }

    removeMouseEvent(labelDom) {
        if (labelDom) {
            labelDom.removeEventListener('mousemove', this.css2dobjectmousemove);
            labelDom.removeEventListener('pointerdown', this.css2dobjectclick);
        }
    }

    onObject3DLayout() {
        // #设置图元位置 -> bimLocation是在SpaceLabelInfo model层定义的
        // this.object3D.position.copy(this.model.bimLocation);
        const {
            model: { height = 0, floorHeight, needCustomY = true }
        } = this;
        const infoLocation = this.model.bimLocation.clone();
        if (needCustomY) {
            infoLocation.setY(floorHeight + height + 0.1);
        }
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

    dispose() {
        // 移除真实 DOM 事件监听器
        this.removeMouseEvent(this.normalDom);
        // 移除真实 DOM 引用
        this.normalDom = null;

        // 移除虚拟 DOM 传参
        this.vueApp.vm.component.props.currentStyle = null;
        this.vueApp.vm.component.props.model = null;
        // 移除虚拟 DOM，清空挂载 DOM 引用
        this.vueApp.removeDom();
        // 移除 CSS2DObject 引用
        this.object3D.element = null;

        super.dispose();
        // this.vueApp = null;
    }
}
