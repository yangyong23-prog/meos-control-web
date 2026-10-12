// @ts-ignore
import i18n from '@/localization';
import { CSS2DObject } from '@yushu/three-base/three-extends/jsm/renderers/CSS2DRenderer';
import BaseMedia from '@/views/GraphMVC/core/View/BaseMedia';
import { render, createVNode } from 'vue';
import EquipRunningIconInfoComponent from './EquipRunningIconInfo.vue';

export const currentRenderDataInjectKey = 'currentRenderDataInjectKey';
export const currentMediaStyleInjectKey = 'currentMediaStyleInjectKey';

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

export default class EquipRunningIconInfoMedia extends BaseMedia {
    constructor(model, rootMedia) {
        // ![必须]继承父类
        super(model, rootMedia);
        // ![必须]初始化父类方法
        this.init();
        this.model.addObserver('ChangeState', () => {
            this.updateStyle();
        });
        this.model.addObserver('UpdateIot', data => {
            this.updateIot(data);
        });
    }

    // ![必须]创建css2d图元
    makeObject3D() {
        this.vueApp = vueApp(EquipRunningIconInfoComponent, { model: this.model, currentStyle: null, rootMedia: this.rootMedia });
        const rootDom = this.vueApp.getDom();
        const object3D = new CSS2DObject(rootDom);
        // const normalDom = rootDom.querySelector('.equip-running-icon-info-container .iot-rows-card');
        // if (normalDom) {
        //     this.addMouseEvent(normalDom);
        // }
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

    onObject3DLayout() {
        const { bimLocation } = this.model;
        const infoLocation = bimLocation.clone();

        const position = infoLocation.clone().applyMatrix4(this.parentMedia.object3D.matrix.clone().invert());
        // this.model.infoLocation = infoLocation; // 用作碰撞的Location
        // this.model.iconInfoLocation = position;
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

    updateIot(newData = {}) {
        // TODO 待调整
        const infoCodes = Object.values(newData)
            .filter(val => {
                return val?.groupCode === 'fixedBubbleCard';
            })
            ?.slice(0, 4);

        this.vueApp.vm.component.props.infoCodes = [...infoCodes];
    }
}
