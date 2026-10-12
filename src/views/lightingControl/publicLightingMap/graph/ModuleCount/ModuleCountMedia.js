import { CSS2DObject } from '@yushu/three-base/three-extends/jsm/renderers/CSS2DRenderer';
import BaseMedia from '@/views/GraphMVC/core/View/BaseMedia';
import vueApp from '../utils';
import ModuleCountComponent from './ModuleCount.vue';
export default class SpaceLabelInfoMedia extends BaseMedia {
    constructor(model, rootMedia) {
        super(model, rootMedia);
        this.rootMedia = rootMedia;
        this.init();
        this.currentStyle = this.model.addObserver('ChangeState', ({ name, value }) => {
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
    makeObject3D() {
        this.vueApp = vueApp(ModuleCountComponent, {
            model: this.model,
            onClickItem: data => {
                this.rootMedia.emit('css2dobjectclick', data);
            }
        });
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
        this.labelDom.addEventListener('mousemove', this.css2dobjectmousemove);
    }
    removeMouseEvent() {
        this.labelDom.removeEventListener('mousemove', this.css2dobjectmousemove);
    }
    onObject3DLayout() {
        this.object3D.position.copy(this.model.bimLocation);
    }
    dispose() {
        this.removeMouseEvent();
        this.labelDom = null;
        this.vueApp.dispose();
    }
}
