// @ts-ignore
import i18n from '@/localization';
import { CSS2DObject } from '@yushu/three-base/three-extends/jsm/renderers/CSS2DRenderer';
import BaseMedia from '@/views/GraphMVC/core/View/BaseMedia';
import { vueApp } from '@/views/GraphMVC/utils/d2Utils';
import SpaceCard from './SpaceCard.vue';
import { getLoopListByFloorIdKey } from '@/views/IndoorLighting/hooks/useBaseHook';
import DockSingleton from '@/hooks/responsiveDock';
import { Css2dobjectMouseMove } from '@/views/GraphMVC/core/View/ObjectPicker';

export default class SpaceCardMedia extends BaseMedia {
    constructor(model, rootMedia) {
        super(model, rootMedia);
        this.init();

        // 监听状态变化
        this.model.addObserver('ChangeState', () => {
            this.updateStyle();
        });
    }

    // 创建 CSS2D 图元
    makeObject3D() {
        const onClickCircuit = circuit => {
            this.model.selectedLoop = null;
            this.model.selectedController = null;
            this.model.selectedLoop = circuit;
            this.rootMedia.emit('css2dobjectclick', { event: {}, model: this.model });
        };
        const onClickControler = controler => {
            this.model.selectedLoop = null;
            this.model.selectedController = null;
            this.model.selectedController = controler;
            this.rootMedia.emit('css2dobjectclick', { event: {}, model: this.model });
        };
        const onHover = () => {
            console.log('Css2dobjectMouseMove :>> ', Css2dobjectMouseMove);
            this.rootMedia.emit(Css2dobjectMouseMove, { event: {}, model: this.model });
        };

        this.vueApp = vueApp(SpaceCard, { model: this.model, currentStyle: null, onClickCircuit, onClickControler, onHover }, this.rootMedia, false);
        const rootDom = this.vueApp.getDom();
        return new CSS2DObject(rootDom);
    }

    // 设置图元位置
    onObject3DLayout() {
        try {
            const {
                model: { height = 0, floorHeight = 0 }
            } = this;
            const infoLocation = this.model.bimLocation.clone();
            infoLocation.setY(floorHeight + height + 0.1);
            const position = infoLocation.clone().applyMatrix4(this.parentMedia.object3D.matrix.clone().invert());
            this.model.infoLocation = infoLocation;
            this.object3D.position.copy(position);
        } catch (e) {
            console.error('SpaceCardMedia onObject3DLayout error:', e);
        }
    }

    onObject3DMounted() {
        this.updateStyle();
    }

    // 更新样式
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
    // 销毁
    dispose() {
        this.vueApp?.dispose(this.object3D.element);
        this.object3D.element = null;
        super.dispose();
    }
}
