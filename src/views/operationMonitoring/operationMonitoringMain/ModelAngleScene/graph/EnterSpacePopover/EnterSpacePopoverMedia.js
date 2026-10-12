// @ts-ignore
import i18n from '@/localization';
import { CSS2DObject } from '@yushu/three-base/three-extends/jsm/renderers/CSS2DRenderer';
import BaseMedia from '@/views/GraphMVC/core/View/BaseMedia';

import { RenderOrder } from '@/views/GraphMVC/graphScene/GraphSceneDefine';

import { Css2dobjectClick } from '@/views/GraphMVC/graphScene/RootNode/RootNodeMedia';
import { createDom } from '@/views/GraphMVC/utils/d2Utils';
import { wrapperDom } from '@/views/GraphMVC/core/utils';
import './enterSpacePopover.less';

const _svg = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="14" viewBox="0 0 13 14" fill="none">
<path fill-rule="evenodd" clip-rule="evenodd" d="M0 6.3C0 9.77935 5.425 14 6.3 14C7.175 14 12.6 9.77935 12.6 6.3C12.6 2.82065 9.77935 0 6.3 0C2.82065 0 0 2.82065 0 6.3ZM6.29993 8.4776C7.68138 8.4776 8.80127 7.35771 8.80127 5.97626C8.80127 4.59481 7.68138 3.47492 6.29993 3.47492C4.91847 3.47492 3.79858 4.59481 3.79858 5.97626C3.79858 7.35771 4.91847 8.4776 6.29993 8.4776Z" fill="#D9D9D9"/>
</svg>`;

export default class EnterSpacePopoverMedia extends BaseMedia {
    constructor(model, rootMedia) {
        super(model, rootMedia);
        this.init();
    }

    // 重写父类方法，生成模型
    makeObject3D() {
        const {
            model: { floorElevation = 0, bimLocation }
        } = this;
        if (!bimLocation) return;
        this.$dom = createDom({
            tagName: 'div',
            classList: ['enter-space-popover-container'],
            innerHTML: _svg,
            style: { transform: `${this.transformScale}translate(0,0)`, 'transform-origin': 'bottom' }
        });

        this.$divstitle = createDom({
            tagName: 'span',
            classList: ['enter-space-popover-title'],
            innerHTML: i18n.global.t('meos_control_web.enter_space'),
            appendTo: this.$dom
        });

        this.domPointerdown = event => {
            console.log('pointerdown: ');
            event.stopPropagation();
            this.rootMedia.emit(Css2dobjectClick, { event, model: this.model });
        };
        this.$dom.addEventListener('pointerdown', this.domPointerdown);

        this.$dom.style.transform = `translate(0, -50%)`;

        const wrapper = wrapperDom(this.$dom);
        const popover2d = new CSS2DObject(wrapper);

        popover2d.renderOrder = RenderOrder.card;

        const iconInfoLocation = bimLocation.clone();
        iconInfoLocation.setY(floorElevation + 0.1);
        popover2d.position.copy(iconInfoLocation);

        return popover2d;
    }

    onObject3DMounted() {
        this.parseStyle();
    }

    parseStyle() {
        const style = this.model.caclCurrentStyle();
        this.model.show = style.show;
        console.log('style: ', style, this.model);
    }

    dispose() {
        super.dispose();

        this.$dom.removeEventListener('pointerdown', this.domPointerdown);
        this.$dom = null;
        this.$divstitle = null;
    }
}
