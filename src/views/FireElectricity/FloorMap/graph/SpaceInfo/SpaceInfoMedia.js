// @ts-ignore
import i18n from '@/localization';
// import { baseUtils } from '@yushu/three-base';
import { CSS2DObject } from '@yushu/three-base/three-extends/jsm/renderers/CSS2DRenderer';
import BaseMedia from '@/views/GraphMVC/core/View/BaseMedia';
import { vueApp } from '@/views/GraphMVC/utils/d2Utils';
// 工具函数
// const { getD3PosByBimLocation } = baseUtils;
import SpaceInfoComponent from './SpaceInfo.vue';
export default class SpaceAggregatorInfoMedia extends BaseMedia {
    constructor(model, rootMedia) {
        // ![必须]继承父类
        super(model, rootMedia);
        // ![必须]初始化父类方法
        this.init();
        this.model.addObserver('ChangeState', ({ name, value }) => {
            const currentStyle = model.caclCurrentStyle();
            const { show, renderOrder } = currentStyle;
            this.object3D.renderOrder = renderOrder;

            model.show = show;

            if (show) {
                this.vueApp?.setProps('currentStyle', currentStyle);
            }
        });
        this.listenerAbortController = new AbortController();
    }
    // ![必须]创建css2d图元
    makeObject3D() {
        this.vueApp = vueApp(SpaceInfoComponent, {
            model: this.model
        });
        this.labelDom = this.vueApp.getDom();
        const object3D = new CSS2DObject(this.labelDom);
        this.addMouseEvent(this.labelDom);

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
            'pointerdown',
            event => {
                this.rootMedia.emit('css2dobjectclick', { event, model: this.model.parent });
            },
            { signal: this.listenerAbortController?.signal }
        );
    }

    onObject3DLayout() {
        // #设置图元位置 -> bimLocation是在SpaceLabelInfo model层定义的
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
    dispose() {
        this.labelDom = null;

        this.listenerAbortController?.abort();
        this.listenerAbortController = null;
        this.vueApp.dispose(this.object3D.element);
        this.object3D.element = null;
        super.dispose();
    }
}
