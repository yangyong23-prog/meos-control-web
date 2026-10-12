import { CSS2DObject } from '@yushu/three-base/three-extends/jsm/renderers/CSS2DRenderer';
import { createDom } from '../../utils/d2Utils';
import BaseMedia from '../../core/View/BaseMedia';
import { Css2dobjectClick, Css2dobjectMouseMove } from '../RootNode/RootNodeMedia';
import { wrapperDom } from '../../core/utils';

export default class LinkLineInfoMedia extends BaseMedia {
    constructor(linkLineInfo, rootMedia) {
        super(linkLineInfo, rootMedia);
        this.init();
        this.model.addObserver('ChangeState', e => this.stateChanged(e));
    }

    // 重写父类方法，生成模型
    makeObject3D() {
        // console.log('LinkLineInfoMedia');
        const { linkLineData, linkLineObj } = this.model;
        if (linkLineData.absorbLineTextArr && linkLineData.absorbLineTextArr.length > 0) {
            linkLineData.absorbLineTextArr.push(linkLineData.text);
        }
        const set = new Set(linkLineData.absorbLineTextArr);
        const newArr = Array.from(set);
        const text = newArr.length > 1 ? '多个关系' : linkLineData.text;
        const offsetY = linkLineObj.offsetY || 0;
        const $dom = createDom({
            tagName: 'div',
            classList: ['link-line-label'],
            innerHTML: text,
            style: {
                display: 'inline-block',
                fontSize: '14px',
                transform: `translate(0,-60%) translate(0,${offsetY})`
            }
        });

        $dom.addEventListener('mousemove', event => {
            // 阻止mousemove事件穿透
            event.stopPropagation();
            this.rootMedia.emit(Css2dobjectMouseMove, { event, model: this.model.parent });
        });

        $dom.addEventListener('pointerdown', event => {
            // event.preventDefault();
            event.stopPropagation();
            this.rootMedia.emit(Css2dobjectClick, { event, model: this.model.parent });
        });
        const wrapper = wrapperDom($dom);
        const lineInfo = new CSS2DObject(wrapper);
        lineInfo.position.copy(linkLineObj.center);
        return lineInfo;
    }

    onObject3DMounted() {
        this.stateChanged();
    }

    stateChanged() {
        const { show, renderOrder } = this.model.caclCurrentStyle();
        this.model.show = show;
        if (renderOrder) {
            this.object3D.renderOrder = renderOrder;
        }
    }
}
