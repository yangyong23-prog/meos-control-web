import { CSS2DObject } from '@yushu/three-base/three-extends/jsm/renderers/CSS2DRenderer';
import { createDom } from '../../utils/d2Utils';
import { Css2dobjectClick, Css2dobjectMouseMove } from '../RootNode/RootNodeMedia';
import { wrapperDom } from '../../core/utils';
import { RenderOrder } from '../GraphSceneDefine';
import BaseMedia from '../../core/View/BaseMedia';

export default class PipeInfoMedia extends BaseMedia {
    constructor(linkLineInfo, rootMedia) {
        super(linkLineInfo, rootMedia);
        this.init();
    }

    // 重写父类方法，生成模型
    makeObject3D() {
        const { pipeData, point } = this.model;
        if (pipeData && pipeData.length && point) {
            const text = pipeData[0].groupName || pipeData[0].localName || '--';
            const $dom = createDom({
                tagName: 'div',
                classList: ['pipe-info-label'],
                innerHTML: text,
                style: {
                    display: 'inline-block',
                    fontSize: '14px',
                    transform: 'translate(0,-60%)'
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
            const pipeInfoMedia = new CSS2DObject(wrapper);
            pipeInfoMedia.position.copy(point);
            pipeInfoMedia.renderOrder = RenderOrder.hover;
            return pipeInfoMedia;
        }
    }
}
