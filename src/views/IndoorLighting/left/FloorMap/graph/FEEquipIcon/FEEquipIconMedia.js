// @ts-ignore
import i18n from '@/localization';
// import { baseUtils } from '@yushu/three-base';
import { CSS2DObject } from '@yushu/three-base/three-extends/jsm/renderers/CSS2DRenderer';
import BaseMedia from '@/views/GraphMVC/core/View/BaseMedia';

import { vueApp } from '@/views/GraphMVC/utils/d2Utils';
// 工具函数
// const { getD3PosByBimLocation } = baseUtils;
import FEEquipIconComponent from './FEEquipIcon.vue';
export default class FEEquipIconMedia extends BaseMedia {
    constructor(model, rootMedia) {
        // ![必须]继承父类
        super(model, rootMedia);
        // ![必须]初始化父类方法
        this.init();
        this.model.addObserver('ChangeState', v => {
            this.updateStyle();
        });
        this.listenerAbortController = new AbortController();
    }
    // ![必须]创建css2d图元
    makeObject3D() {
        this.vueApp = vueApp(FEEquipIconComponent, { model: this.model, currentStyle: null }, this.rootMedia);
        const rootDom = this.vueApp.getDom();
        const object3D = new CSS2DObject(rootDom);
        const normalDom = rootDom.querySelector('.fe-equip-2d-warp .normal');
        const groupDom = rootDom.querySelector('.fe-equip-2d-warp .group-wrap');

        if (normalDom) {
            this.addMouseEvent(normalDom);
        }

        if (groupDom) {
            this.addGroupEvent(groupDom);
        }

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
                this.rootMedia.emit('css2dobjectmousemove', { event, model: this.model.parent });
            },
            { signal: this.listenerAbortController?.signal }
        );
    }

    onObject3DLayout() {
        // #设置图元位置 -> bimLocation是在SpaceLabelInfo model层定义的
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
    dispose() {
        this.listenerAbortController?.abort();
        this.listenerAbortController = null;
        this.vueApp.dispose(this.object3D.element);
        this.object3D.element = null;
        super.dispose();
    }
}
