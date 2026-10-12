// @ts-ignore
import i18n from '@/localization';
// import { baseUtils } from '@yushu/three-base';
import { CSS2DObject } from '@yushu/three-base/three-extends/jsm/renderers/CSS2DRenderer';
import BaseMedia from '@/views/GraphMVC/core/View/BaseMedia';
import { createVNode, render } from 'vue';
import { vueApp } from '@/views/GraphMVC/utils/d2Utils';
// 工具函数
// const { getD3PosByBimLocation } = baseUtils;
import ESEquipIconInfoComponent from './ESEquipIconInfo.vue';
export default class AirEquipIconInfoMedia extends BaseMedia {
    constructor(model, rootMedia) {
        // ![必须]继承父类
        super(model, rootMedia);
        // ![必须]初始化父类方法
        this.init();
        this.model.addObserver('ChangeState', v => {
            this.updateStyle();
        });
        this.model.addObserver('UpdatePositionY', v => {
            this.updatePositionY(v);
        });
        this.listenerAbortController = new AbortController();
    }
    // ![必须]创建css2d图元
    makeObject3D() {
        this.vueApp = vueApp(ESEquipIconInfoComponent, { model: this.model, currentStyle: null }, this.rootMedia);
        const rootDom = this.vueApp.getDom();
        const object3D = new CSS2DObject(rootDom);
        const normalDom = rootDom.querySelector('.ac-equip-2d-warp .normal');
        const groupDom = rootDom.querySelector('.ac-equip-2d-warp .group-wrap');
        // console.log('normalDom: ', normalDom);
        if (normalDom) {
            this.addMouseEvent(normalDom);
        }
        if (groupDom) {
            this.addGroupEvent(groupDom);
        }
        object3D.modelKey = `es_equip_iconinfo_${this.model?.data?.id}`;
        return object3D;
    }

    addMouseEvent(labelDom) {
        labelDom.addEventListener(
            'mousemove',
            event => {
                event.stopPropagation();
                this.rootMedia.emit('css2dobjectmousemove', { event, model: this.model });
            },
            { signal: this.listenerAbortController?.signal }
        );

        labelDom.addEventListener(
            'dblclick',
            event => {
                event.stopPropagation();
                this.rootMedia.emit('css2dobjectclick', { event, model: this.model });
            },
            { signal: this.listenerAbortController?.signal }
        );

        labelDom.addEventListener(
            'pointerdown',
            event => {
                this.rootMedia.emit('css2dobjectclick', { event, model: this.model });
            },
            { signal: this.listenerAbortController?.signal }
        );
    }
    addGroupEvent(groupDom) {
        groupDom.addEventListener(
            'mousemove',
            event => {
                event.stopPropagation();
                this.rootMedia.emit('css2dobjectmousemove', { event, model: this.model });
            },
            { signal: this.listenerAbortController?.signal }
        );
    }

    onObject3DLayout() {
        // if (!this.model?.relationParentPos) {
        //     // #设置图元位置 -> bimLocation是在SpaceLabelInfo model层定义的
        // }
        this.object3D.position.copy(this.model.bimLocation);
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
        // this.vueApp.vm.component.props.currentStyle = currentStyle;
        // this.vueApp.vm.component.props.absorbList = this.model.absorbs?.map(m => {
        //     const d = m.data || {};
        //     return {
        //         localName: d.localName,
        //         id: d.id
        //     };
        // });
        this.vueApp.setProps('currentStyle', currentStyle);
        this.vueApp.setProps(
            'absorbList',
            this.model.absorbs?.map(m => {
                const d = m.data || {};
                return {
                    localName: d.localName ?? '--',
                    id: d.id
                };
            })
        );
    }

    updatePositionY(data) {
        if (data && data.value !== undefined) {
            this.object3D.position.setY(data.value);
            this.model.bimLocation = this.object3D.position.clone();
        }
    }

    dispose() {
        this.listenerAbortController?.abort();
        this.listenerAbortController = null;
        this.vueApp.dispose();
        this.vueApp = null;
        this.object3D.element = null;
        super.dispose();
    }
}
