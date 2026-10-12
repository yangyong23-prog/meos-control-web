// @ts-ignore
import i18n from '@/localization';
// import { baseUtils } from '@yushu/three-base';
import { CSS2DObject } from '@yushu/three-base/three-extends/jsm/renderers/CSS2DRenderer';
import BaseMedia from '@/views/GraphMVC/core/View/BaseMedia';
import { createVNode, render } from 'vue';
import { baseColors } from '@/constants/baseColors';

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

const statusTextStyleMap = {
    allOpen: {
        color: baseColors['$yellow-600'],
        textColor: '#ffffff',
        text: i18n.global.t('meos_control_web.fully_on')
    },
    allClose: {
        color: baseColors['$grey-200'],
        textColor: baseColors['$grey-600'],
        text: i18n.global.t('meos_control_web.fully_off')
    },
    partOpen: {
        color: baseColors['$red-100'],
        textColor: baseColors['$red-700'],
        text: i18n.global.t('meos_control_web.partial_on')
    },
    feedbackAdjustment: {
        color: baseColors['$purple-100'],
        textColor: baseColors['$purple-700'],
        text: i18n.global.t('meos_control_web.feedback_adjustment')
    },
    NOT_CONFIGURED: {
        color: baseColors['$grey-200'],
        textColor: baseColors['$grey-600'],
        text: i18n.global.t('meos_control_web.unconfiged')
    }
};

// 工具函数
// const { getD3PosByBimLocation } = baseUtils;
import SpacePopoverInfoComponent from './SpacePopoverInfo.vue';
export default class SpacePopoverInfoMedia extends BaseMedia {
    constructor(model, rootMedia) {
        // ![必须]继承父类
        super(model, rootMedia);
        // ![必须]初始化父类方法
        this.init();
        this.model.addObserver('ChangeState', v => {
            this.updateStyle(v);
        });
    }
    // ![必须]创建css2d图元
    makeObject3D() {
        this.vueApp = vueApp(SpacePopoverInfoComponent, { model: this.model, currentStyle: null, rootMedia: this.rootMedia });
        const rootDom = this.vueApp.getDom();
        const object3D = new CSS2DObject(rootDom);
        const normalDom = rootDom.querySelector('.req-space-popoverinfo-warp .normal');
        if (normalDom) {
            this.addMouseEvent(normalDom);
        }

        return object3D;
    }

    addMouseEvent(labelDom) {
        labelDom.addEventListener('mousemove', event => {
            event.stopPropagation();
            this.rootMedia.emit('css2dobjectmousemove', { event, model: this.model });
        });

        labelDom.addEventListener('dblclick', event => {
            event.stopPropagation();
            this.rootMedia.emit('css2dobjectclick', { event, model: this.model });
        });

        labelDom.addEventListener('pointerdown', event => {
            this.rootMedia.emit('css2dobjectclick', { event, model: this.model });
        });
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

        let _show = show,
            popoverText = statusTextStyleMap.NOT_CONFIGURED;
        if (!this.model.getParentsShow()) {
            _show = false;
        }
        _show = _show && !this.model.isRemoved();
        this.model.show = _show;

        Object.keys(statusTextStyleMap).forEach(k => {
            if (this.model.getState(k)) {
                popoverText = statusTextStyleMap[k];
            }
        });

        this.object3D.renderOrder = renderOrder;
        this.vueApp.vm.component.props.currentStyle = { ...currentStyle, popoverText };
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
