// @ts-ignore
import i18n from '@/localization';
// import { baseUtils } from '@yushu/three-base';
import { CSS2DObject } from '@yushu/three-base/three-extends/jsm/renderers/CSS2DRenderer';
import BaseMedia from '@/views/GraphMVC/core/View/BaseMedia';
import vueApp from '../utils';
// 工具函数
// const { getD3PosByBimLocation } = baseUtils;
import SpaceLabelComponent from './SpaceLabel.vue';
export default class SpaceLabelInfoMedia extends BaseMedia {
    constructor(model, rootMedia) {
        // ![必须]继承父类
        super(model, rootMedia);
        // ![必须]初始化父类方法
        this.init();
        this.model.addObserver('ChangeState', ({ name, value }) => {
            const { show, renderOrder } = model.caclCurrentStyle();
            if (renderOrder) {
                this.object3D.renderOrderCopy = this.object3D.renderOrder;
                this.object3D.renderOrder = renderOrder;
            } else {
                if (this.object3D.renderOrderCopy || this.object3D.renderOrderCopy === 0) {
                    this.object3D.renderOrder = this.object3D.renderOrderCopy;
                    this.object3D.renderOrderCopy = null;
                }
            }
            model.show = show;
        });
    }
    // ![必须]创建css2d图元
    makeObject3D() {
        this.vueApp = vueApp(SpaceLabelComponent, { model: this.model });
        this.labelDom = this.vueApp.getDom();
        const object3D = new CSS2DObject(this.labelDom);
        this.addMouseEvent();
        return object3D;
    }

    addMouseEvent() {
        this.css2dobjectmousemove = event => {
            event.stopPropagation();
            this.rootMedia.emit('css2dobjectmousemove', { event, model: this.model.parent });
        };
        this.css2dobjectclick = event => {
            event.stopPropagation();
            this.rootMedia.emit('css2dobjectclick', { event, model: this.model.parent });
        };
        this.labelDom.addEventListener('mousemove', this.css2dobjectmousemove);

        this.labelDom.addEventListener('dblclick', this.css2dobjectclick);

        this.labelDom.addEventListener('pointerdown', this.css2dobjectclick);
    }
    removeMouseEvent() {
        this.labelDom.removeEventListener('mousemove', this.css2dobjectmousemove);
        this.labelDom.removeEventListener('dblclick', this.css2dobjectclick);
        this.labelDom.removeEventListener('pointerdown', this.css2dobjectclick);
    }
    onObject3DLayout() {
        // #设置图元位置 -> bimLocation是在SpaceLabelInfo model层定义的
        this.object3D.position.copy(this.model.bimLocation);
    }
    dispose() {
        this.removeMouseEvent();
        this.labelDom = null;
        this.vueApp.dispose();
    }
}
