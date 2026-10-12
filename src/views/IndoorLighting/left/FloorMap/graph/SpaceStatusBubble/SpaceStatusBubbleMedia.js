// @ts-ignore
import i18n from '@/localization';
// import { baseUtils } from '@yushu/three-base';
import { CSS2DObject } from '@yushu/three-base/three-extends/jsm/renderers/CSS2DRenderer';
import BaseMedia from '@/views/GraphMVC/core/View/BaseMedia';

import { vueApp } from '@/views/GraphMVC/utils/d2Utils';
// 工具函数
// const { getD3PosByBimLocation } = baseUtils;
import SpaceStatusBubble from './SpaceStatusBubble.vue';
export default class SpaceStatusBubbleMedia extends BaseMedia {
    constructor(model, rootMedia) {
        // ![必须]继承父类
        super(model, rootMedia);
        // ![必须]初始化父类方法
        this.init();
        this.model.addObserver('ChangeState', v => {
            this.updateStyle();
        });
        this.model.addObserver('UpdateStatustData', v => {
            this.updateStatustData();
        });
        this.listenerAbortController = new AbortController();
    }
    // ![必须]创建css2d图元
    makeObject3D() {
        const onClick = () => {
            this.rootMedia.emit('css2dobjectclick', { event: {}, model: this.model });
        };
        this.vueApp = vueApp(SpaceStatusBubble, { model: this.model, currentStyle: null, onClick }, this.rootMedia);
        const rootDom = this.vueApp.getDom();
        const object3D = new CSS2DObject(rootDom);
        const normalDom = rootDom.querySelector('.space-bubble-2d-warp .container-wrap');

        if (normalDom) {
            this.addMouseEvent(normalDom);
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

    onObject3DLayout() {
        // #设置图元位置 -> bimLocation是在SpaceLabelInfo model层定义的
        // console.log('this.model.bimLocation: ', this.model.bimLocation);
        // this.object3D.position.copy(this.model.bimLocation);
        try {
            const {
                model: { height = 0, floorHeight = 0, needCustomY = true }
            } = this;
            const infoLocation = this.model.bimLocation.clone();
            if (needCustomY) {
                infoLocation.setY(floorHeight + height + 0.1);
            }
            const position = infoLocation.clone().applyMatrix4(this.parentMedia.object3D.matrix.clone().invert());
            this.model.infoLocation = infoLocation; // 用作碰撞的Location
            this.model.iconInfoLocation = position;
            this.object3D.position.copy(position);
        } catch (e) {
            console.log('e: ', e);
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
        if (_show) {
            this.vueApp?.setProps('currentStyle', currentStyle);
        }
    }

    updateStatustData() {
        this.vueApp.setProps('currentStatusList', this.model?.statusList);
    }
    dispose() {
        this.listenerAbortController?.abort();
        this.listenerAbortController = null;
        this.vueApp.dispose(this.object3D.element);
        this.object3D.element = null;
        super.dispose();
    }
}
