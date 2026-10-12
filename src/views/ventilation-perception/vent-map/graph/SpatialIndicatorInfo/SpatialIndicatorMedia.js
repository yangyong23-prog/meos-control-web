// @ts-ignore
import i18n from '@/localization';
import { createVNode, render } from 'vue';
import BaseMedia from '@/views/GraphMVC/core/View/BaseMedia';
import { wrapperDom } from '@/views/GraphMVC/core/utils';
import SpatialIndicatorMediaComponent from './SpatialIndicatorInfo.vue';
import { CSS2DObject } from '@yushu/three-base/three-extends/jsm/renderers/CSS2DRenderer';
import { vueApp } from '@/views/GraphMVC/utils/d2Utils';

export default class SpatialIndicatorMedia extends BaseMedia {
    constructor(model, rootMedia) {
        super(model, rootMedia);
        // 标记模型实例名称、增加 Mesh 数据 media
        this.init();
        // XXX 状态更改，更新样式？
        this.model.addObserver('ChangeState', () => {
            this.updateStyle();
        });
        this.model.addObserver('UpdateIot', () => {
            this.updateIot();
        });
        this.listenerAbortController = new AbortController();
    }

    makeObject3D() {
        // 创建 Vue 实例，取 DOM 根节点创建 Three.js 中的 CSS2DObject
        this.vueApp = vueApp(SpatialIndicatorMediaComponent, { model: this.model, currentStyle: null, infoCodes: this.model.data?.infoCodes || [] });
        const rootDom = wrapperDom(this.vueApp.getDom());
        const object3D = new CSS2DObject(rootDom);
        // 添加鼠标事件监听
        this.addMouseEvent(rootDom);
        return object3D;
    }

    addMouseEvent(labelDom) {
        labelDom.addEventListener(
            'mousemove',
            event => {
                // 阻止事件冒泡，根模型节点触发鼠标移动事件
                event.stopPropagation();
                this.rootMedia.emit('css2dobjectmousemove', { event, model: this.model.parent });
            },
            { signal: this.listenerAbortController?.signal }
        );

        labelDom.addEventListener(
            'pointerdown',
            event => {
                // 根模型节点触发鼠标点击事件
                this.rootMedia.emit('css2dobjectclick', { event, model: this.model.parent });
            },
            { signal: this.listenerAbortController?.signal }
        );
    }

    onObject3DMounted() {
        // 2D模型挂载后更新样式
        this.updateStyle();
    }

    onObject3DLayout() {
        // XXX 图元位置：1、矩阵变换得到新的 position；2、用作碰撞
        // #设置图元位置 -> bimLocation是在SpaceLabelInfo model层定义的
        // this.object3D.position.copy(this.model.bimLocation);
        const {
            model: { height = 0, floorElevation, needCustomY = true }
        } = this;
        const infoLocation = this.model.bimLocation.clone();
        if (needCustomY) {
            infoLocation.setY(floorElevation + height + 0.1);
        }
        const position = infoLocation.clone().applyMatrix4(this.parentMedia.object3D.matrix.clone().invert());
        this.model.infoLocation = infoLocation; // 用作碰撞的Location
        this.model.iconInfoLocation = position;
        this.object3D.position.copy(position);
    }

    updateStyle() {
        const currentStyle = this.model.caclCurrentStyle();

        const { show, renderOrder } = currentStyle;

        // 父节点隐藏或删除，则当前节点隐藏
        let _show = show;
        if (!this.model.getParentsShow()) {
            _show = false;
        }
        _show = _show && !this.model.isRemoved();
        // 更新显隐状态
        this.model.show = _show;
        // 更新渲染顺序
        this.object3D.renderOrder = renderOrder;
        // 更新虚拟 DOM 的样式
        this.vueApp.setProps('currentStyle', currentStyle);
        // this.vueApp.vm.component.props.currentStyle = currentStyle;
    }

    updateIot() {
        const { infoCodes } = this.model.data;
        this.vueApp.setProps('infoCodes', [...infoCodes]);
        // this.vueApp.vm.component.props.infoCodes = [...infoCodes];
    }

    dispose() {
        this.listenerAbortController?.abort();
        this.listenerAbortController = null;
        this.vueApp.dispose(this.object3D.element);
        this.object3D.element = null;
        super.dispose();

        // this.$rootDom?.replaceWith(this.$rootDom?.cloneNode(true));
        // this.$rootDom = null;
        // this.vueApp.vm = null;
        // console.log('this.vueApp.vm: ', this.vueApp.vm.$destroy);
        // this.vueApp = null;
        // console.log('SSSSSS===dispose: ', this);
        // this.vueApp.vm.dispose();
    }
}
