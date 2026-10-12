// @ts-ignore
import i18n from '@/localization';
import { Box3, Vector3 } from '@yushu/three-base';
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
import AirEquipIconInfoComponent from './AirEquipIconInfo.vue';
export default class AirEquipIconInfoMedia extends BaseMedia {
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
        this.vueApp = vueApp(AirEquipIconInfoComponent, { model: this.model, currentStyle: null, rootMedia: this.rootMedia });
        const rootDom = this.vueApp.getDom();
        const object3D = new CSS2DObject(rootDom);
        const normalDom = rootDom.querySelector('.ac-equip-2d-warp .normal');
        const groupDom = rootDom.querySelector('.ac-equip-2d-warp .group-wrap');
        if (normalDom) {
            this.addMouseEvent(normalDom);
        }
        if (groupDom) {
            this.addGroupEvent(groupDom);
        }
        return object3D;
    }

    addMouseEvent(labelDom) {
        labelDom.addEventListener('mousemove', event => {
            event.stopPropagation();
            this.rootMedia.emit('css2dobjectmousemove', { event, model: this.model.parent });
        });

        labelDom.addEventListener('dblclick', event => {
            event.stopPropagation();
            this.rootMedia.emit('css2dobjectclick', { event, model: this.model.parent });
        });

        labelDom.addEventListener('pointerdown', event => {
            this.rootMedia.emit('css2dobjectclick', { event, model: this.model.parent });
        });
    }
    addGroupEvent(groupDom) {
        groupDom.addEventListener('mousemove', event => {
            event.stopPropagation();
            this.rootMedia.emit('css2dobjectmousemove', { event, model: this.model.parent });
        });
    }

    onObject3DLayout() {
        // #设置图元位置
        const { bimLocation } = this.model;
        if (bimLocation) {
            const infoLocation = bimLocation.clone();
            const position = infoLocation.clone().applyMatrix4(this.parentMedia.object3D.matrix.clone().invert());
            this.object3D.position.copy(position);
        } else {
            // 对于无bimLocation的，以父模型的几何中心点坐标为坐标
            const box = new Box3();
            box.setFromObject(this.parentMedia?.object3D);
            const centerP = new Vector3();
            box.getCenter(centerP);
            const position = centerP.clone().applyMatrix4(this.parentMedia.object3D.matrix.clone().invert());
            this.object3D.position.copy(position);
        }
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
        const finalData = this.model.absorbs?.map(m => {
            const d = m.data || {};
            return {
                iconType: d?.iconType,
                localName: d.localName ?? '--',
                id: d.id
            };
        });
        this.vueApp.vm.component.props.absorbList = finalData;
    }
}
