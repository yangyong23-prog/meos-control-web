// @ts-ignore
import i18n from '@/localization';
// import { baseUtils } from '@yushu/three-base';
import { CSS2DObject } from '@yushu/three-base/three-extends/jsm/renderers/CSS2DRenderer';
import BaseMedia from '@/views/GraphMVC/core/View/BaseMedia';

import { vueApp } from '@/views/GraphMVC/utils/d2Utils';

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
        this.listenerAbortController = new AbortController();
    }

    clickAbsorbItem(item, event) {
        const targetModel = this.model?.getAbsorbModelById(item?.id);
        if (targetModel) {
            this.rootMedia.emit('css2dobjectclick', { event, model: targetModel.parent });
        }
        console.log('clickAbsorbItem: ', this);
    }
    // ![必须]创建css2d图元
    makeObject3D() {
        // const wrapper = document.createElement('div');
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const _this = this;
        this.vueApp = vueApp(AirEquipIconInfoComponent, {
            model: this.model,
            currentStyle: null,
            clickAbsorbItem: (item, e) => {
                this.clickAbsorbItem.call(_this, item, e);
            }
        });
        const rootDom = this.vueApp.getDom();
        // const rootDom = wrapperDom(this.vueApp.getDom());
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
        return object3D;
    }

    addMouseEvent(labelDom) {
        labelDom.addEventListener(
            'mousemove',
            event => {
                event.stopPropagation();
                this.rootMedia.emit('css2dobjectmousemove', { event, model: this.model.parent });
            },
            { signal: this.listenerAbortController?.signal }
        );

        labelDom.addEventListener(
            'dblclick',
            event => {
                event.stopPropagation();
                this.rootMedia.emit('css2dobjectclick', { event, model: this.model.parent });
            },
            { signal: this.listenerAbortController?.signal }
        );

        labelDom.addEventListener(
            'pointerdown',
            event => {
                this.rootMedia.emit('css2dobjectclick', { event, model: this.model.parent });
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
